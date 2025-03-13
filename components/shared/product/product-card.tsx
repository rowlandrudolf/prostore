'use client';
import {
    Card,
    CardContent,
    // CardDescription,
    // CardFooter,
    CardHeader,
   // CardTitle,
  } from "@/components/ui/card"

import Link from "next/link";
import Image
 from "next/image";
import ProductPrice from "./product-price";
import { Product } from "@/types";

const ProductCard = ({ product } : { product: Product}) => {
    return ( 
        <Card className="w-full max-w-sm">
            <CardHeader className="p-0 items center">
                <Link href={`/products/${product.slug}`}>
                    <Image 
                        src={product.images[0]}
                        width={300}
                        height={300}
                        alt={product.name}
                        priority={true}/>
                </Link>
            </CardHeader>
            <CardContent className="p-4 grid gap-4">
                <div className="text-xs">{product.brand}</div>
                <Link href={`/products/${product.slug}`}>
                    <h2 className="text-sm font-medium"> {product.name} </h2>
                </Link>
                <div className="flex-between gap-4">
                    <p>{Number(product.rating)} stars</p>
               
                {product.stock > 0 ? (
                    <ProductPrice value={Number(product.price)} />
                ): (
                    <p className="text-destructive"> Out of stock</p>
                )}
                </div>
            </CardContent>
        </Card>
     );
}
 
export default ProductCard;