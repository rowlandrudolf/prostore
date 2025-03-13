import ProductList from "@/components/shared/product/product-list";
// import sampleData from "@/db/sample-data";

import { getLatestProducts } from "@/lib/actions/product.actions";

const Homepage = async () => {
  const products = await getLatestProducts()
  return (
    <>
      <ProductList 
        data={products} 
        title='new arrivals'
        limit={4} />
    </>
  )
}

export default Homepage;