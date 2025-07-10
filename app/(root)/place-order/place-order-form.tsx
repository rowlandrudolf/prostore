'use client';

import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/order.actions";
import { Loader, ArrowRightIcon} from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";


const PlaceOrderForm = () => {

    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await createOrder();
        if(res.redirectTo){
            router.push(res.redirectTo)
        }
    }

    const PlaceOrderBtn = () => {
        const { pending } = useFormStatus();
        return (
            <Button disabled={pending} className="w-full">
                { pending ? (
                    <Loader className="w-4 h-4 animate-spin"></Loader>
                ): (
                    <ArrowRightIcon className="w-4 h-4"/> 
                )}
                {' '} Payment
            </Button>
        )
    }
 
    return ( 
        <form className="w-full" onSubmit={handleSubmit}>
            <PlaceOrderBtn/>
        </form>
    );
}
 
export default PlaceOrderForm;