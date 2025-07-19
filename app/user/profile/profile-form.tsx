'use client';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateUserProfile } from "@/lib/actions/user.actions";
import { updateProfileSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { totalmem } from "os";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ProfileForm = () => {
    const { data: session, update } = useSession();

    const form = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: session?.user?.name ?? '',
            email: session?.user?.email ?? ''
        }
    });

    const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
        const res = await updateUserProfile(values)
        if(!res.success) return toast('Error!')
        const newSession = {
            ...session,
            user: {
                ...session?.user,
                name: values.name 
            }
        }

        await update(newSession)

        toast('Profile updated')
    
    }

    return (
        <Form {...form}>
            <form action="" className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-5">
                    <FormField
                        control={form.control}
                        name='email'
                        render={({field}) => (
                            <>
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input disabled placeholder="Email" className="input-field" {...field}/>
                                    </FormControl>
                                </FormItem>
                                <FormMessage/>
                            </>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name='name'
                        render={({field}) => (
                            <>
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input placeholder="Name" className="input-field" {...field}/>
                                    </FormControl>
                                </FormItem>
                                <FormMessage/>
                            </>
                        )}
                        />
                </div>
                <Button type="submit" size="lg" className=" bg-yellow-200 button col-span-2 w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Submitting...' : 'Update Profile'}
                </Button>
            </form>
        </Form>
    );
}
 
export default ProfileForm;