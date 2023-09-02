import { Placeholder } from "@/components/Layout/Placeholder";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/router";

export default function NotFoundPage() {
  const router = useRouter();
  return (
    <Placeholder>
      <div className="flex space-y-2 flex-col">
        <h1>Page Not Found</h1>
        <Button onClick={() => router.back()}>
          <ArrowLeftIcon className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    </Placeholder>
  );
}
