
import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

export const authConfig = {
    providers: [],
    callbacks: {
        authorized({ request, auth }: any) {
            // check for session cart cookie
            if(!request.cookies.get('sessionCartId')){
                //generate sesssion cart id cookie,
                const sessionCartId = crypto.randomUUID();
                const newRequestHeaders = new Headers(request.headers);

                const response = NextResponse.next({
                    request: {
                        headers: newRequestHeaders
                    }
                });

                response.cookies.set('sessionCartId', sessionCartId)
                return response;

            }else {
                return true;
            }
        }
    }

} satisfies NextAuthConfig