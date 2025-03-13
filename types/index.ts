import { z} from 'zod'
import { instertProductSchema  } from '@/lib/validators';

export type Product = z.infer<typeof instertProductSchema> & {
    id: string;
    rating: string;
    createdAt: Date;
}