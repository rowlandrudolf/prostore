import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import ThemeToggle from "./theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EllipsisVertical, ShoppingCartIcon, User, UserIcon } from "lucide-react";
import UserButton from "./user-button";

const Menu = () => {
    return (
      <div className="flex justify-end gap-3">
        <nav className="hidden md:flex w-full max-w-xs gap-1">
          <ThemeToggle />
          <Button asChild variant="ghost">
            <Link href="/cart">
              <ShoppingCartIcon /> Cart
            </Link>
          </Button>
          <UserButton/>
        </nav>
        <nav className="md:hidden">
            <Sheet>
                <SheetTrigger className="align-middle">
                    <EllipsisVertical />
                </SheetTrigger>
                <SheetContent className="flex flex-col items-start p-6">
                    <SheetTitle>Menu</SheetTitle>
                    <ThemeToggle/>
                    <Button asChild variant='ghost'>
                        <Link href='/cart'>
                            <ShoppingCartIcon/> Cart
                        </Link>
                    </Button>
                    <SheetDescription></SheetDescription>
                </SheetContent>
            </Sheet>
        </nav>
      </div>
    );
}
 
export default Menu;