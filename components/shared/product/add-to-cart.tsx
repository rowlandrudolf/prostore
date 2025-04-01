'use client';
import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus, Loader } from "lucide-react";
import { toast } from "sonner";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart } from "@/types";
import { useTransition } from "react";

const AddToCart = ({ cart, item }: { cart?: Cart, item: CartItem}) => {
    const router = useRouter();

    const [isPending, startTransition] = useTransition()
    

    const handleAddToCart = async () => {
        startTransition( async () => {

            const res = await addItemToCart(item);

            if(!res.success){
                toast('Error', {
                    description: res.message,
                })
            }
    
            // handle success...
            toast('Item added', {
                className: 'bg-primary',
                description: res.message,
                action: {
                    label: 'Go to cart',
                    onClick: () => router.push('/cart')
                }
            })

        })
    }

    const handleRemoveFromCart = async () => {
        startTransition(async () => {
            const res = await removeItemFromCart(item.productId);
            toast('Item removed', {
                className: 'bg-primary',
                description: res.message
            })
            return;
        })
    }

    const exists = cart && cart.items.find((i) => i.productId === item.productId);


    return exists ? ( 
       <div>
            <Button type="button" variant='outline' onClick={handleRemoveFromCart}>
                { isPending ? (<Loader className="w-4 h-4 animate-spin"/>) 
                    : (<Minus className="h-4 w-4"/> )}
                    Remove
            </Button>
            <span className="px-2">{exists.qty}</span>
            <Button className="w-full bg-gray-200 border-accent" type="button" onClick={handleAddToCart}>
                { isPending ? (<Loader className="w-4 h-4 animate-spin"/>) 
                    : (<Plus className="h-4 w-4"/> )}
                    Add To Cart
            </Button>
       </div>
    )
    : (
        <Button className="w-full bg-gray-200 border-accent" type="button" onClick={handleAddToCart}>
            { isPending ? (<Loader className="w-4 h-4 animate-spin"/>) 
                    : (<Plus className="h-4 w-4"/> )} Add to Cart
        </Button>
     )
}
 
export default AddToCart;