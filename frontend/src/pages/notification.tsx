import { Button } from "@/components/ui/button";
import { useEthersSigner } from "@/hooks/useEthersSigners";
import { useMutation } from "wagmi";
import * as PushAPI from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { PUSH_CHANNEL_ADDRESS } from "@/constants/address";

export default function NotificationPage() {
  const signer = useEthersSigner();
  const { mutate } = useMutation(["send-notifiication"], async () => {
    const { target, space, delegate, proposal, voted } = {
      target: "0x7730B4Cdc1B1E7a33A309AB7205411faD009C106",
      space: "yam.eth",
      delegate: "0x0Bf3d06DE2b696b97610E4B8bA67A928efBeDD17",
      proposal: "test",
      voted: true,
    };

    await PushAPI.payloads.sendNotification({
      signer,
      senderType: 0,
      type: 3, // target
      identityType: 2, // direct payload
      notification: {
        title: `[Proposal Closed] ${proposal}`,
        body: `Hey ${target}!, ${space}'s latest proposal has just closed. Go check out what your favourite delegates voted.`,
      },
      payload: {
        title: `[sdk-test] payload title`,
        body: voted
          ? `Your delegate ${delegate} successfully voted in the latest proposal. Click the link to view their recent actions.`
          : `Your delegate ${delegate} did not succesfully vote in the latest proposal. Click the link to view their recent actions.`,
        cta: `https://daodash.vercel.app/${space}/voter/${delegate}`,
        img: "",
      },
      recipients: [`eip155:5:${target}`],
      channel: `eip155:5:${PUSH_CHANNEL_ADDRESS}`, // your channel address
      env: ENV.STAGING,
    });
  });
  return <Button onClick={() => mutate()}>Send Notification</Button>;
}
