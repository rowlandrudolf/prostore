import { getProductBySlug } from "@/lib/actions/product.actions"
import { notFound } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  // CardDescription,
  // CardFooter,
  // CardHeader,
  // CardTitle,
} from "@/components/ui/card"
import ProductPrice from "@/components/shared/product/product-price"
import ProductImages from "@/components/shared/product/product-images"
import AddToCart from "@/components/shared/product/add-to-cart"

import { getMyCart } from "@/lib/actions/cart.actions"



const ProductDetailsPage = async ({params}: { params: Promise<{ slug: string }>}) => {
    const { slug } = await params
    const product = await getProductBySlug(slug)

    const cart =  await getMyCart();

    if(!product) notFound();

    return (
      <>
        <section>
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="col-span-2">
              <ProductImages images={product.images}/>
            </div>
            <div className="col-span-2 p-5">
              <div className="flex flex-col gap-6">
                <p>
                  {product.brand} - {product.category}
                </p>

                <h1 className="h3-bold">{product.name}</h1>
                <p>
                  {product.rating} of {product.numReviews} reviews
                </p>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <ProductPrice
                    value={Number(product.price)}
                    className="w-24 rounded-rull bg-green-100 text-green-700 px-5 p7-2"
                  />
                </div>
                <div className="mt-10">
                  <p className="font-semibold">Description</p>
                  <p>{product.description}</p>
                </div>
              </div>
            </div>
            <div>
              <Card>
                <CardContent className="p-4">
                  <div className="mb-2 flex justify-between">
                    <div>Price</div>
                    <ProductPrice value={Number(product.price)}/>
                  </div>
                  <div className="flex justify-between mb-2">
                    <div>Status</div>
                    {product.stock > 0 ? (
                    <Badge variant='outline'> In Stock</Badge> 
                    ) : ( 
                    <Badge>Out of Stock</Badge> 
                    )}
                  </div>
                   {product.stock > 0 && (
                    <AddToCart 
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        qty: 1,
                        image: product.images[0]
                      }}/>
                   )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </>
    );
}

export default ProductDetailsPage