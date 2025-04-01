'use server';


import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { formatError, toJson, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertcartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

const calculatePrice = (items: CartItem[]) => {
    const itemsPrice = round2(
        items.reduce((acc, item) => acc + Number(item.price)  * item.qty, 0)
    ),
    shippingPrice = round2(
        itemsPrice > 100
            ? 0 
            : 10
    ),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2( 
         itemsPrice + shippingPrice + taxPrice
    )

    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
    }
}


export async function addItemToCart(data: CartItem) {
    try{
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if(!sessionCartId) throw new Error('Cart session not found');

        const session = await auth();

        const userId = session?.user?.id 
            ? (session.user.id as string)
            : undefined

        const cart = await getMyCart();

        const item = cartItemSchema.parse(data)

        const product = await prisma.product.findFirst({
            where: {
                id: item.productId
            }
        })

        if(!product) throw new Error('Product not found');

        if(!cart) {
            const newCart = insertcartSchema.parse({
                userId: userId,
                items: [item],
                sessionCartId: sessionCartId,
                ...calculatePrice([item])
            })

           // 
           await prisma.cart.create({
            data: newCart
           })

           revalidatePath(`/product/${product.slug}`)

           return {
               success: true,
               message: `${product.name} added to cart`
           }

        }else {

            //check if item is in cart
            const exists = (cart.items as CartItem[]).find((i) => i.productId === item.productId);
            if(exists) {
                // check stock
                if(product.stock < exists.qty + 1){
                    throw new Error('Not enough stock 1')
                }

                (cart.items as CartItem[]).find((i) => i.productId === item.productId)!.qty = exists.qty + 1;
            }else{
                // items not in cart...
                // 1. check stock
                if(product.stock < 1) throw new Error('Not enough stock 2')
                // 2. add to cart items
                cart.items.push(item)
            }

            // save to db...
            await prisma.cart.update({
                where: { id: cart.id},
                data:{
                    items: cart.items as Prisma.CartUpdateitemsInput[],
                    ...calculatePrice(cart.items as CartItem[])
                }
            })

            revalidatePath(`/products/${product.slug}`)
            return {
                success: true,
                message: `${product.name} ${exists ? ' updated in' : ' added to '} cart`
            }

        }

        
        // console.log({
        //     'session cart id': sessionCartId,
        //     'user id': userId,
        //     'item requested': item,
        //     'product found': product
        // })


    }catch(err){
        return {
            success: false,
            message: formatError(err)
        }
    }
}

export async function getMyCart(){
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if(!sessionCartId) throw new Error('Cart session not found');

     const session = await auth();

    const userId = session?.user?.id 
        ? (session.user.id as string)
        : undefined

    const cart = await prisma.cart.findFirst({
        where: userId 
            ? { userId: userId } 
            : { sessionCartId: sessionCartId }
        })
    
    if(!cart) return undefined

    return toJson({
        ...cart,
        items: cart.items as CartItem[],
        itemsPrice: cart.itemsPrice.toString(),
        totalPice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString(),
    })
}
export async function removeItemFromCart(productId: string){
    try {
        // get session cart id...
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if(!sessionCartId) throw new Error('Cart session not found');
        // get product
        const product = await prisma.product.findFirst({
            where: {
                id: productId
            }
        })
        if(!product) throw new Error('Product not found');

        // get cart
        const cart = await getMyCart();
        if(!cart) throw new Error('Cart not found');

        // check item in cart...
        const exists = (cart.items as CartItem[]).find((i) => i.productId === productId);
        if(!exists) throw new Error('Item not found');

        // check quantity
        if(exists.qty === 1){
            // remove
            cart.items = (cart.items as CartItem[]).filter((i) => i.productId !== exists.productId)

        }else{
            // reduce quanitiy
            cart.items.find((i) => i.productId === exists.productId)!.qty = exists.qty - 1;
        }

        // update cart in db.
        await prisma.cart.update({
            where: { id: cart.id,},
            data: {
                items: cart.items as Prisma.CartUpdateitemsInput[],
                ...calculatePrice(cart.items as CartItem[]),
            }
        });

        revalidatePath(`/products/${product.slug}`)

        return {
            success: true,
            message: `${product.name} was removed from cart`
        }


    }catch(err){
        return {
            success: false,
            message: formatError(err)
        }
    }
}