import { z } from 'zod'
import { formatNumberToPrice } from '../utils'
import { PAYMENT_METHODS } from '../constants'

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
    userId: z.string().optional().nullable(),
})


export const shippingAddressSchema = z.object({
    fullName: z.string().min(3, ''),
    streetAddress: z.string().min(3, ''),
    city: z.string().min(3, ''),
    postalCode: z.string().min(3, ''),
    country: z.string().min(3, ''),
    lat: z.number().optional(),
    lng: z.number().optional()
})

export const paymentMethodSchema = z.object({
    type: z.string().min(1,'Payment method required')
}).refine((data) => PAYMENT_METHODS.includes(data.type), {
    path:['type'],
    message: 'Invalid payment method'
})

export const insertOrderSchema = z.object({
    userId: z.string().min(1, 'required'),
    itemsPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    totalPrice: currency,
    paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data),{ message: 'Invalide payment method'}),
    shippingAddress: shippingAddressSchema
});

export const insertOrderItemSchema = z.object({
    productId: z.string(),
    name: z.string(),
    slug: z.string(),
    image: z.string(),
    price: currency,
    qty: z.number(),
})

export const paymentResultSchema = z.object({
    id: z.string(),
    status: z.string(),
    email_address: z.string(),
    pricePaid: z.string(),
})