import { PUSH_CHANNEL_ADDRESS } from "@/constants/address";
import { walletClientToSigner } from "@/hooks/useEthersSigners";
import * as PushAPI from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
import { Address, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { goerli } from "viem/chains";

if (!process.env.PUSH_CHANNEL_WALLET_SECRET) {
  throw new Error("No push wallet secret found");
}

// const account = privateKeyToAccount(
//   process.env.PUSH_CHANNEL_WALLET_SECRET! as Address
// );

// const client = createWalletClient({
//   account,
//   chain: goerli,
//   transport: http(),
// });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { target, space, delegate, proposal, voted } = req.body;
    if (!target || !space || !delegate || !proposal || !voted) {
      return res.status(400).send("Invalid params");
    }
    // const signer = walletClientToSigner(client);
    const signer = new ethers.Wallet(process.env.PUSH_CHANNEL_WALLET_SECRET!);
    await PushAPI.payloads.sendNotification({
      signer,
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
      recipients: `eip155:5:${target}`, // recipient address
      channel: `eip155:5:${PUSH_CHANNEL_ADDRESS}`, // your channel address
      env: ENV.STAGING,
    });

    return res.status(200).json({});
  }
  return res.status(404).json("Not found");
}
