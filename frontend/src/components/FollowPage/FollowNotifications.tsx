import { CacheKey } from "@/constants/cache";
import {
  useAccount,
  useMutation,
  useNetwork,
  useQuery,
  useWalletClient,
} from "wagmi";
import * as PushAPI from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { useTheme } from "next-themes";
import { useEthersSigner } from "@/hooks/useEthersSigners";
import { PUSH_CHANNEL_ADDRESS } from "@/constants/address";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";

export function FollowNotifications() {
  const { toast } = useToast();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const signer = useEthersSigner();
  const { data: notificationsData } = useQuery(
    [CacheKey.NOTIFICATIONS, address, chain?.id],
    async () => {
      return PushAPI.user.getFeeds({
        user: `eip155:${chain?.id}:${address}`, // user address in CAIP
        env: ENV.STAGING,
      });
    },
    { enabled: address !== undefined && chain !== undefined }
  );
  const { data: spamNotificationsData } = useQuery(
    [CacheKey.NOTIFICATIONS, address, chain?.id, "spam"],
    async () => {
      return PushAPI.user.getFeeds({
        user: `eip155:${chain?.id}:${address}`, // user address in CAIP
        env: ENV.STAGING,
        spam: true,
      });
    },
    { enabled: address !== undefined && chain !== undefined }
  );
  const { data: subscriptionsData } = useQuery(
    [CacheKey.NOTIFICATIONS, address, chain?.id, "subscriptions"],
    async () => {
      console.log("fetchign");
      return PushAPI.user.getSubscriptions({
        user: `eip155:${chain?.id}:${address}`, // user address in CAIP
        env: ENV.STAGING,
      });
    },
    { enabled: address !== undefined && chain !== undefined }
  );
  const { mutate: optInMutate } = useMutation(["opt-in"], async () => {
    if (chain !== undefined && address !== undefined) {
      return await PushAPI.channels.subscribe({
        signer: signer!,
        channelAddress: `eip155:${chain?.id}:${PUSH_CHANNEL_ADDRESS}`,
        userAddress: `eip155:${chain?.id}:${address}`,
        onSuccess: () => {
          toast({
            title: "Successfully subscribed!",
            description:
              "Now you will receive notifications for users you have subscribed to",
          });
        },
        onError: () => {
          console.error("opt in error");
        },
        env: ENV.STAGING,
      });
    } else {
      throw new Error("Invalid chain/address" + chain?.id + address);
    }
  });
  console.log({ subscriptionsData, notificationsData });
  return (
    <div>
      {notificationsData && notificationsData.length ? (
        notificationsData.map((oneNotification: any, i: number) => {
          const {
            cta,
            title,
            message,
            app,
            icon,
            image,
            url,
            blockchain,
            notification,
          } = oneNotification;

          return <div key={i}>{title}</div>;
        })
      ) : (
        <div>No notifications found! Follow more users in the DAO pages.</div>
      )}
      {subscriptionsData?.find(
        (subscription: { channel: string }) =>
          subscription.channel === PUSH_CHANNEL_ADDRESS
      ) === undefined && <Button onClick={() => optInMutate()}>Opt In</Button>}
    </div>
  );
}
