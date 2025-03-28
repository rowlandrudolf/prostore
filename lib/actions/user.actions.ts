'use server';

import { signInFormSchema, signUpFormSchema } from "../validators";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { prisma } from "@/db/prisma";
import { hashSync } from "bcrypt-ts-edge";
import { formatError } from "../utils";
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