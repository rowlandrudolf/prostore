'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signUpUser } from "@/lib/actions/user.actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";

const SignUpForm = () => {
    const [data, action] = useActionState(signUpUser, { 
        success: false,
        message: '' 
    })

    const searchParams = useSearchParams();
    const cbUrl = searchParams.get('callbackUrl') || '/'

    const SignUpButton = () => {
        const { pending } = useFormStatus()
        return (
            <Button disabled={pending} className="w-full" variant='default'> 
                { pending ? 'Submitting...' : 'Sign Up'}
            </Button>
        )
    }

    return ( 
       <form action={action}>
           <div className="space-y-6">
            <input type="hidden" name="callbackUrl" value={cbUrl} />
            <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" type="text" required autoComplete="name"/>
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required autoComplete="email"/>
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required autoComplete="password"/>
            </div>
            <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required autoComplete="confirmPassword"/>
            </div>
            <div>
                <SignUpButton/>
            </div>
            {data && !data.success && (
                <div className="text-center text-destructive">
                    {data.message}
                </div>
            )}
            <div className="text-sm text-center text-muted-foreground">
                Already have an account?
                <Link href={'sign-in'} target="_self"> Sign in</Link>
            </div>
           </div>
       </form>
     );
}
 
export default SignUpForm;