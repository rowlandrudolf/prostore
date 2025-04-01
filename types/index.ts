import { z} from 'zod'
import {
    instertProductSchema,
    insertcartSchema,
    cartItemSchema
} from '@/lib/validators';


export type Product = z.infer<typeof instertProductSchema> & {
    id: string;
    rating: string;
    createdAt: Date;
}

export type Cart = z.infer<typeof insertcartSchema>
export type CartItem = z.infer<typeof cartItemSchema>