'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { 
    PayPalButtons, 
    PayPalScriptProvider, 
    usePayPalScriptReducer 
} from '@paypal/react-paypal-js'

import { 
    createPaypalOrder,
    approvePaypalOrder 
} from "@/lib/actions/order.actions";

import { toast } from "sonner";

const OrderDetailsTable = ( 
{ 
order, 
paypalClientId 

}:{ 
        order: Order, 
        paypalClientId: string
}) => {

    console.log(order.id);

    const PrintLoadingState = () => {
        const [{ isPending, isRejected } ] = usePayPalScriptReducer();
        let status = '';
        if(isPending){
            status = 'Loading Payal'
        }else if(isRejected){
            status = 'Error Loading Paypal'
        }
        return status 
    }

    const handleCreatePaypalOrder = async () => {
        const res = await createPaypalOrder(order.id);
        if(!res.success){
            toast('Problemo');
        }

        return res.data
    }

    const handleApprovePaypalOrder = async (data: { orderID: string }) => {
        const res = await approvePaypalOrder(order.id, { orderId: data.orderID });
        toast(res.message);
    }

    return ( 
        <>
        <h1>Order {formatId(order.id)}</h1>
        <div className="grid md:grid-cols-3 md:gap-5">
            <div className="col-span-2 space-4-y overflow-x-auto">
                <Card>
                    <CardContent className="p-4 gap-4"> 
                        <h2>Payment method</h2>
                        <p>{order.paymentMethod}</p>
                        {order.isPaid ? (
                            <Badge variant='secondary' className="bg-amber-100"> Paid at { formatDateTime(order.paidAt!).dateTime}</Badge>
                        ) : (
                            <Badge variant='destructive'  className="bg-amber-100 my-4"> Not Paid </Badge>
                        )}
                    </CardContent>
                </Card>
                <Card className="my-4">
                    <CardContent className="p-4 gap-4"> 
                        <h2>Shipping address</h2>
                        <p>{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.streetAddress}, {order.shippingAddress.city}</p>
                        <p>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                        { order.isDelivered ? (
                            <Badge variant='secondary' className="bg-amber-400 py-10"> Delivered at { formatDateTime(order.deliveredAt!).dateTime}</Badge>
                        ) : (
                            <Badge variant='destructive'  className="bg-amber-400 my-3"> Not Delivered </Badge>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 gap-4">
                        <h2 className="text-xl pb-4">OrderItems</h2>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.orderItems.map((item) => (
                                    <TableRow key={item.slug}>
                                        <TableCell>
                                            <Link href={`/products/${item.slug}`}>
                                                <Image 
                                                    src={item.image}
                                                    width={50}
                                                    height={50}
                                                    alt={item.name}/>
                                                <span className="px-2">{item.name}</span>
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <span className="px-2">{item.qty}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="px-2">{item.price}</span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardContent className="p-4 gap-4 space-y-4">
                        <div className="flex justify-between">
                            <div>Items:</div>
                            <div>{formatCurrency(order.itemsPrice)}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Tax:</div>
                            <div>{formatCurrency(order.taxPrice)}</div>
                        </div>
                        <div className="flex justify-between pb-2 border-b-1">
                            <div>Shipping:</div>
                            <div>{formatCurrency(order.shippingPrice)}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Total Price:</div>
                            <div>{formatCurrency(order.totalPrice)}</div>
                        </div>
                        {/* paypal payment*/}
                        { !order.isPaid && order.paymentMethod === 'PayPal' && (
                            <div>
                                <PayPalScriptProvider options={{clientId: paypalClientId}}>
                                    <PrintLoadingState/>
                                    <PayPalButtons 
                                    createOrder={handleCreatePaypalOrder}
                                    onApprove={(data) => handleApprovePaypalOrder(data)}
                                    />
                                </PayPalScriptProvider>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>









        </div>
        </>
     );
}
 
export default OrderDetailsTable;