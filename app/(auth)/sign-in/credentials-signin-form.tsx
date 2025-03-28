'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";

const CredentailsSignInForm = () => {
    const [data, action] = useActionState(signInWithCredentials, { 
        success: false,
        message: '' 
    })

    const searchParams = useSearchParams();
    const cbUrl = searchParams.get('callbackUrl') || '/'

    const SignInButton = () => {
        const { pending } = useFormStatus()
        return (
            <Button disabled={pending} className="w-full" variant='default'> 
                { pending ? 'Signing In...' : 'Sign In'}
            </Button>
        )
    }

    return ( 
       <form action={action}>
           <div className="space-y-6">
            <input type="hidden" name="callbackUrl" value={cbUrl} />
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required autoComplete="email"/>
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required autoComplete="password"/>
            </div>
            <div>
                <SignInButton/>
            </div>
            {data && !data.success && (
                <div className="text-center text-destructive">
                    {data.message}
                </div>
            )}
            <div className="text-sm text-center text-muted-foreground">
                Don&lsquot have an account?
                <Link href={'sign-up'} target="_self"> Sign up</Link>
            </div>
           </div>
       </form>
     );
}
 
export default CredentailsSignInForm;