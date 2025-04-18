import { z} from 'zod'
import {
    instertProductSchema,
    insertcartSchema,
    cartItemSchema,
    shippingAddressSchema,
    insertOrderSchema,
    insertOrderItemSchema
} from '@/lib/validators';


export type Product = z.infer<typeof instertProductSchema> & {
    id: string;
    rating: string;
    createdAt: Date;
}

export type Cart = z.infer<typeof insertcartSchema>
export type CartItem = z.infer<typeof cartItemSchema>

export type ShippingAddress = z.infer<typeof shippingAddressSchema>

export type Order = z.infer<typeof insertOrderSchema> & {
    id: string;
    createdAt: Date;
    isPaid: boolean;
    paidAt: Date | null;
    isDelivered: boolean;
    deliveredAt: Date | null;
    orderItems: OrderItem[]
    user: { name: string, email: string}
}
export type OrderItem = z.infer<typeof insertOrderItemSchema>