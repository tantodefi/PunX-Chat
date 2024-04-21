"use client";
import {
  ArrowLeftStartOnRectangleIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/solid";
import { Button } from "@material-tailwind/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { useEthersSigner } from "@/wagmi/EthersSigner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/slice/pushSlice";
import { useRouter } from "next/navigation";
import usePush from "@/hooks/usePush";
import Image from "next/image";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZeroDevSmartWalletConnectors } from "@dynamic-labs/ethereum-aa";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import Script from "next/script";

export default function Home() {
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const signer = useEthersSigner();
  const dispatch = useDispatch();
  const router = useRouter();
  const { streamChat } = usePush();
  const stream = useSelector((state) => state.push.stream);

  return (
    
    <div className="h-screen w-screen flex items-center justify-center bg-black">
      <div className="w-[400px] border-[1px] border-white/30 rounded-3xl flex flex-col items-center p-5 pb-7">
      <Image 
      src="/tantodefi-upunx.jpg"
      width={500}
      height={500}
      alt="Picture of the author"
      />
     
        <h1 className="font-bold color-white text-5xl">PunX.Chat</h1>


        {!isConnected && (
          <>
          <br></br>
          <DynamicContextProvider
          settings={{
            appName: 'web3frens.xyz',
            // environmentId: "c18a6f71-7c8f-4c03-bb76-292844106dec", // update this ID to yours
            environmentId: "379215fd-c6ca-42bc-95c2-058a18783900",
            walletConnectors: [EthereumWalletConnectors, ZeroDevSmartWalletConnectors],
            // evmNetworks,
          }}
        >
        <DynamicWagmiConnector>
          <DynamicWidget/>
        </DynamicWagmiConnector>
        </DynamicContextProvider>
        <br></br>
        <p className="color-white">1. Email Signup.</p>
        <p className="color-white">2. Link Socials.</p>
        <p className="color-white">3. Then Connect.</p>
        <Button
              className="w-full mt-10 rounded-2xl"
              size="lg"
              onClick={() => {
                connect({
                  connector: connectors[0],
                });
              }}
            >
              Metamask 🦊
            </Button>
            <Button
              className="w-full mt-5 rounded-2xl"
              size="lg"
              onClick={() => {
                connect({
                  connector: connectors[1],
                });
              }}
            >
              Coinbase 🔵
            </Button>
            <Button
            className="w-full mt-5 rounded-2xl"
            size="lg"
            // onClick={() => {
            //   connect({
            //     connector: connectors[1],
            //   });
            // }}
          >
          Connect 🆙
          </Button>
          <br/>
          </>
        )}

        {isConnected && (
          <>
            <Button
              className="w-full mt-10 rounded-2xl flex items-center justify-center"
              size="lg"
              onClick={async () => {
                const user = await PushAPI.initialize(signer, {
                  env: CONSTANTS.ENV.PROD,
                });
                if (user) {
                  if (!user.readMode) {
                    dispatch(setUser(user));
                    streamChat(user);
                    router.push("/dashboard");
                  }
                }
              }}
            >
              Initiate Push{" "}
              <ChatBubbleBottomCenterTextIcon className="h-5 w-5 ml-1" />
            </Button>
            <Button
              className="w-full mt-5 rounded-2xl flex items-center justify-center"
              size="lg"
              onClick={() => {
                if (stream) stream.disconnect();
                disconnect();
              }}
            >
              Disconnect{" "}
              <ArrowLeftStartOnRectangleIcon className="h-5 w-5 ml-1 -mt-0.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
