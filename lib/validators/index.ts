import { z } from 'zod'
import { formatNumberToPrice } from '../utils'

const currency = z.string().refine((value) => /^\d+(\.\d{2})?$/.test(formatNumberToPrice(Number(value))))
 
// schemea for insert
export const instertProductSchema = z.object({
    name: z.string().min(3, 'Name too short'),
    slug: z.string().min(3, 'Slug too short'),
    category: z.string().min(3, 'category too short'),
    brand: z.string().min(3, 'brand too short'),
    description: z.string().min(3, 'description too short'),
    stock: z.coerce.number(),
    images: z.array(z.string()).min(1, 'Image required'),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: currency
})

// schema for sign in 
export const signInFormSchema = z.object({
    email: z.string().email('invalid email address'),
    password: z.string().min(6, '6 characterrs')
})

export const signUpFormSchema = z.object({
    name: z.string().min(3),
    email: z.string().email('invalid email address'),
    password: z.string().min(6, '6 characterrs'),
    confirmPassword: z.string().min(6, '6 characterrs')
})
.refine((data) =>  data.password === data.confirmPassword , {
    message: 'passwords not matching',
    path: ['confirmPassword']
})

export const cartItemSchema = z.object({
    productId: z.string().min(1, 'Product is requried'),
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Name is required'),
    qty: z.number().int().nonnegative('Quantity required'),
    image: z.string().min(1, 'Image required'),
    price: currency
})

export const insertcartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1,'session cart id required'),
    userId: z.string().optional()
})