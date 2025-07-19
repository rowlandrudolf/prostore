
'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { buildUrlQuery } from "@/lib/utils";

type PaginationProps = {
    page: number | string;
    totalPages: number;
    urlParamName?: string;
}


const Pagination = ({
    page,
    totalPages,
    urlParamName
}: PaginationProps ) => {
   const router = useRouter();
   const searchParams = useSearchParams();

   const handleClick = (btnType: string) => {
    const pageVal = btnType === 'next' ? Number(page) + 1 : Number(page) - 1;
    const newUrl = buildUrlQuery({
        params: searchParams.toString(),
        key: urlParamName || 'page',
        value: pageVal.toString()
    })

    router.push(newUrl)

   }

    return ( 
        <div className="flex pag-2">
            <Button size='lg' 
                className="w-28"
                disabled={Number(page) <= 1}
                onClick={() => handleClick('prev')}>
                Previous 
            </Button>
            <Button size='lg' 
                className="w-28"
                disabled={Number(page) >= totalPages}
                onClick={() => handleClick('next')}>
                Next 
            </Button>
        </div>
     );
}
 
export default Pagination;