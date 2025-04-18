import { getOrderById } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { ShippingAddress } from "@/types";

export const metaData: Metadata = {
    title: 'Order Details'
}

const OrderDetailsPage = async (props: { params: Promise<{ id: string }>}) => {
    
    const { id } = await props.params 
    const order = await getOrderById(id);
    if(!order) notFound();
    console.log(order)

    return ( 
        <>
            <h1>Order Details</h1>
            <OrderDetailsTable order={{
                ...order, 
                shippingAddress: order.shippingAddress as ShippingAddress
            }}/>
        </>
     );
}
 
export default OrderDetailsPage;