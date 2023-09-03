import Link from "next/link";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import dynamic from "next/dynamic";
import { ModeToggle } from "./ModeToggle";

const Wallet = dynamic(() => import("./Wallet").then((mod) => mod.Wallet), {
  ssr: false,
});

export function NavBar() {
  return (
    <div className="justify-between flex">
      <div className="flex items-center space-x-2">
        <Link href="/" className="mr-4 flex items-center space-x-1">
          <Image src="/logo.png" alt="Logo image" width={24} height={24} />
          <p className="font-bold tracking-tighter">DashDAO</p>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/follows" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Follows
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex space-x-3">
        <ModeToggle />
        <Wallet />
      </div>
    </div>
  );
}
