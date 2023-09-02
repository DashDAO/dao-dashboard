import Link from "next/link";

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
        <Link href="/">
          <p className="font-bold tracking-tighter">DashDAOs</p>
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
