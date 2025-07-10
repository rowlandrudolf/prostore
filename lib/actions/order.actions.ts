'use server';

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError, toJson } from "../utils";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { auth } from "@/auth";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem, PaymentResult } from "@/types";
import { paypal } from "../constants/paypal";
import { revalidatePath } from "next/cache";

export async function createOrder(){
    try{
        const session = await auth();
        if(!session) throw new Error('User not authenticated')
            const userId = session.user?.id;
        if(!userId) throw new Error('User not found')

        const cart = await getMyCart();
        const user = await getUserById(userId);
        if(!cart || cart.items.length === 0){
            return {
                success: false,
                message: 'Cart is empty',
                redirectTo: '/cart'
            }
        }
        if(!user.address){
            return {
                success: false,
                message: 'No shipping address',
                redirectTo: '/shipping-address'
            }
        }
        if(!user.paymentMethod){
            return {
                success: false,
                message: 'No payment method',
                redirectTo: '/payment-method'
            }
        }

        // build order object.
        const orderData = insertOrderSchema.parse({
            userId: user.id,
            shippingAddress: user.address,
            paymentMethod: user.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice
        });

        // create transaction for order and orderitems in DB
        const orderId = await prisma.$transaction(async (tx) => {

            const order = await tx.order.create({ data: orderData })

            for (const item of cart.items as CartItem[]){
                await tx.orderItem.create({
                    data: {
                        ...item,
                        price: item.price,
                        orderId: order.id
                    }
                })
            }

            await tx.cart.update({
                where: {
                    id: cart.id
                },
                data: {
                    items: [],
                    itemsPrice: 0,
                    taxPrice: 0,
                    shippingPrice: 0,
                    totalPrice: 0
                }
            });
            return order.id      
        })

        if(!orderId) throw new Error('Order not created');

        return {
            success: true,
            message: 'Order Created',
            redirectTo: `/order/${orderId}`
        }

    }catch(err){
        if(isRedirectError(err)) throw err;
        return {
            success: false,
            messsage: formatError(err),
        }
    }
}

export async function getOrderById(id: string){
    const data = await prisma.order.findFirst({
        where: { id },
        include: {
            orderItems: true,
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    })

    return toJson(data)
}

export async function createPaypalOrder(orderId: string){
    try{
        const order = await prisma.order.findFirst({
            where: { id: orderId }
        })
        if(order){
            // create paypal order 
            const paypalOrder = await paypal.createOrder(Number(order.totalPrice));
            // update order w paypal Id,
            await prisma.order.update({
                where: { id: orderId },
                data: {
                    paymentResult: {
                        id: paypalOrder.id,
                        email_address: '',
                        status: '',
                        pricePaid: 0
                    }
                }
            });

            return {
                success: true,
                message: 'Item order created successfully',
                data: paypalOrder.id
            }

        }else{
            throw new Error('Order not found')
        }

    }catch(err){
        return {
            success: false,
            message: formatError(err)
        }
    }
}

export async function approvePaypalOrder(
    orderId: string,
    data: { orderId: string }
){
    try{
        const order = await prisma.order.findFirst({
            where: { id: orderId}
        })
        if(!order) throw new Error('Order not found')

        const captureData = await paypal.capturePayment(data.orderId)
        if(!captureData || captureData.id !== (order.paymentResult as PaymentResult)?.id || captureData.status !== 'COMPLETED'){
            throw new Error('Error in Paypal')
        }
        await updateOrderToPaid({orderId, paymentResult: {
            id: captureData.id,
            status: captureData.status,
            email_address: captureData.email_address,
            pricePaid: captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value
        }})

        revalidatePath(`/order/${orderId}`)
        return {
            success: true,
            message: 'Your order has been paid'
        }

    }catch(err){
        return {
            success: false,
            message: formatError(err)
        }
    }

}

async function updateOrderToPaid({
    orderId,
    paymentResult
}: { orderId: string, paymentResult?: PaymentResult}){
    const order = await prisma.order.findFirst({
        where: { id: orderId},
        include: {
            orderItems: true
        }
    })
    if(!order) throw new Error('Order not found')
    if(order.isPaid) throw new Error('Order already paid')
    
    await prisma.$transaction( async (tx) => {
        // Iterate over products and update stock.
        for(const item of order.orderItems){
            await tx.product.update({
                where: { id: item.productId },
                data: {
                    stock: { increment: -item.qty }
                }
            })
        }

        await tx.order.update({
            where: { id: order.id },
            data: { 
                isPaid: true, 
                paidAt: new Date(),
                paymentResult
            }
        })
    })
    // get updated order after transaction
    const updatedOrder = await prisma.order.findFirst({
        where: { id: orderId },
        include: {
            orderItems: true,
            user: { select: { name: true, email: true } }
        }
    })

    if(!updatedOrder) throw new Error('Shieeet.')
}
