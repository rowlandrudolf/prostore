
import Link from "next/link";
import { auth } from "@/auth";
import { signOutUser } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";

const UserButton = async () => {

    const session = await auth();
    if(!session){
        return (
           <Button asChild>
            <Link href="/sign-in">
              <UserIcon /> Sign in
            </Link>
          </Button>
        )
    }

    const firstInitial = session.user?.name?.charAt(0).toLocaleUpperCase() ?? '';

    return ( 
        <div className="flex gap-2 items-center">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="flex items-center">
                        <Button variant='ghost' className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-300" >
                            {firstInitial}
                        </Button>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-100" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <div className="text-sm font-medium leading-none">
                                {session.user?.name}
                            </div>
                            <div className="text-sm text-muted leading-none">
                                {session.user?.email}
                            </div>
                        </div>
                    </DropdownMenuLabel>
                <DropdownMenuItem>
                    <Link href='/user/profile' className="w-full">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href='/user/orders' className="w-full">Your Orders</Link>
                </DropdownMenuItem>
                
               <DropdownMenuItem className="p-0 mb-1">
                    {/* <form action={signOutUser} className="w-full"> */}
                        <Button className="w-full py-4 h-4 justify-start" onClick={signOutUser}>
                            Sign Out
                        </Button>
                    {/* </form> */}
               </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
        </div>
     );
}
 
export default UserButton;