'use server';

import { paymentMethodSchema, shippingAddressSchema, signInFormSchema, signUpFormSchema } from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { prisma } from "@/db/prisma";
import { hashSync } from "bcrypt-ts-edge";
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";
import { z } from "zod";
import { PAGE_SIZE } from "../constants";
// sign in with credentials provider...


export async function signInWithCredentials(prevState: unknown, formData: FormData){
    try{
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password'),
        })

        await signIn('credentials', user);

        return {
           success: true,
           message: 'signed in successfully' 
        }

    }catch(err){
        if(isRedirectError(err)){
            throw err;
        }

        return {
            success: false,
            message: 'Invalid email or password'
        }
    }
}

export async function signOutUser(){
    await signOut();
}

export async function signUpUser(prev: unknown, formdData: FormData){
    try {
        const user = signUpFormSchema.parse({
            name: formdData.get('name'),
            email: formdData.get('email'),
            password: formdData.get('password'),
            confirmPassword: formdData.get('confirmPassword')
        }) as { name: string, email: string, password: string, confirmPassword?: string }

        const plainPassword = user.password;
        user.password = hashSync(user.password, 10);
        delete user.confirmPassword

        await prisma.user.create({
            data: user
        })

        await signIn('credentials', {
            email: user.email,
            password: plainPassword 
        })

        return {
            success: true,
            message: 'User registered successfully'
        }

    }catch(err){
        if(isRedirectError(err)){
            throw err;
        }

        return {
            success: false,
            message: formatError(err)
        }
        
    }
}

export async function getUserById(userId: string){
    const user = await prisma.user.findFirst({
        where: { id: userId }
    })
    if(!user) throw new Error('User not found')
    return user;
}

export async function updateUserAddress(data: ShippingAddress){
    try {
        const session = await auth();
        const user = await prisma.user.findFirst({
            where: { id: session?.user?.id }
        })
        if(!user) throw new Error('User not found')

        const address = shippingAddressSchema.parse(data)

        await prisma.user.update({
            where: {id: user.id},
            data: { address }
        })

        return {
            success: true,
            messsage: 'User address updated'
        }

    }catch(err){
        return {
            success: false,
            message: formatError(err)
        }
    }
}


export async function updateUserPaymentMethod(data: z.infer<typeof paymentMethodSchema>){

    try {
        const session = await auth();
        const user = await prisma.user.findFirst({
            where: { id: session?.user?.id }
        })
        if(!user) throw new Error('User not found')

        const paymentMethod = paymentMethodSchema.parse(data)

        await prisma.user.update({
            where: { id: user.id },
            data: {
                paymentMethod: paymentMethod.type
            }
        })
        return {
            success: true,
            message: 'Payment method updated'
        }

    }catch(err){
        return {
            success: false,
            message: formatError(err)
        }
    }
}

export async function getUserOrders({
    limit = PAGE_SIZE, 
    page
} : { 
    limit?: number, 
    page: number
}){

    const session = await auth();
    if(!session) throw new Error('No user')

    const orders = await prisma.order.findMany({
        where: { userId: session.user!.id },
        orderBy: { createdAt: 'desc'},
        take: limit,
        skip: (page - 1) * limit 
    })

    const ordersCount =  await prisma.order.count({
        where: { userId: session.user!.id },
    })

    return {
        orders,
        totalPages: Math.ceil(ordersCount / limit)
    }

}


export async function updateUserProfile(
    userData: { name: string; email: string;} 
){
    try{
        const session = await auth();
        const user = await prisma.user.findFirst({
            where: { id: session?.user?.id }
        })
        if(!user) throw new Error('User not found')

        console.log(userData)
        await prisma.user.update({
            where: {id: user.id},
            data: { 
                name: userData.name,
                email: userData.email
            }
        })

        return {
            success: true,
            messsage: 'User profile updated'
        }

    }catch(err){
        return {
            success: false,
            message: formatError(err)
        }
    }
}