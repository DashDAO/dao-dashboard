import { ChevronDownIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function Wallet({
  login,
  logout,
  address,
}: {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  address?: string;
}) {
  return (
    <>
      {!address && <Button onClick={login}>Connect</Button>}
      {address && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              {`${address.slice(0, 10)}...`}
              <ChevronDownIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{address}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
