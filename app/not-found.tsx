'use client';

import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const NotFound = () => {
    return (<div className="flex flex-col items-center justify-center min-h-screen">
        <Image src='/images/logo.svg' width={48} height={48} alt={`${APP_NAME}`} priority={true}></Image>
        <div className="p-6 rounded-lg shadow-md text-center w-1/3">
           <h1>Not Found</h1>
           <p className="text-destructive"> Could not find page</p>
           <Button variant='outline' className="mt-4 ml-2"
            onClick={() => (window.location.href = '/')}>
                Back
           </Button>
        </div>
    </div>)
}
 
export default NotFound;