import Pagination from "@/components/shared/pagination";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { getUserOrders } from "@/lib/actions/user.actions";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
    title: 'My orders'
}
const OrdersPage = async (props: {
    searchParams: Promise<{page: string}>
}) => {

    const { page } = await props.searchParams
    const data = await getUserOrders({
        page: Number(page) || 1,
    });



    return ( 
       <div className="space-y-2">
        <h2>Orders</h2>
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order Id</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead>Deliverd</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{formatId(order.id)}</TableCell>
                            <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
                            <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                            <TableCell>{order.isPaid ? 'Paid' : 'Not Paid'}</TableCell>
                            <TableCell>{order.isDelivered ? 'Delivered' : 'Not Delivered'}</TableCell>
                            <TableCell><Link href={`/order/${order.id}`}>Details</Link></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            { data.totalPages > 1 && (
                <Pagination 
                    page={Number(page) || 1} 
                    totalPages={data.totalPages} />
            )}
        </div>
       </div>
     );
}
 
export default OrdersPage;