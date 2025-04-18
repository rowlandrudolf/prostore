'use server';

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError, toJson } from "../utils";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { auth } from "@/auth";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";



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