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