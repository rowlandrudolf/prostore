import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import  { prisma } from '@/db/prisma';
import CredentialsProvider from 'next-auth/providers/credentials'
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';
// import { cookies } from 'next/headers';
// import { NextResponse } from 'next/server';
import { authConfig } from './auth.config';
import { cookies } from 'next/headers';

export const config: NextAuthConfig = {
    pages: {
        signIn: '/sign-in',
        error: '/sign-in'
    },
    session: {
        strategy: 'jwt' as const,
        maxAge: 30 * 24 * 60 * 60
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            credentials: {
                email: { type: 'email'},
                password: { type: 'password'},
            },
            async authorize(credentials){
                if(credentials == null) return null;

                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email as string,
                    
                    }
                });

                if(user && user.password){
                    const matching = compareSync(credentials.password as string, user.password)
                    if(matching){
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        }
                    }
                }
                return null;
            }
        })
    ],
    callbacks: {
        async session({session, user, trigger, token}: any){
            session.user.id = token.sub;
            session.user.role = token.role;
            session.user.name = token.name;

            if(trigger === 'update'){
                session.user.name = user.name
            }

            return session
        },
        async jwt({token, user, trigger, session}: any){
            if(user){
                token.id = user.id
                token.role = user.role; 
           
                if(user.name === 'NO_NAME'){
                    token.name = user.email!.split('@')[0];
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { name: token.name}
                    })
                }
            
                // persist cart on signIn and signUp
                if(trigger === 'signIn' || trigger === 'signUp'){
                    const requestCookies = await cookies();
                    const sessionCartId = requestCookies.get('sessionCartId')?.value;
                    console.log('auth', sessionCartId)
                    if(sessionCartId){
                        const sessionCart = await prisma.cart.findFirst({
                            where: { sessionCartId }
                        })
                        if(sessionCart){
                            // Delelet current cart
                            await prisma.cart.deleteMany({
                                where: { userId: user.id}
                            })
                            // assign new cart
                            await prisma.cart.update({
                                where: { id: sessionCart.id},
                                data: { userId: user.id}
                            })
                        }
                    }
                } 
            }
            return token;
        },
        ...authConfig.callbacks
      
    }
}

export const { 
    handlers,
    auth,
    signIn,
    signOut
} = NextAuth(config)
