"use client";

import { useEffect, useState } from "react";
import { Address, createWalletClient, custom } from "viem";

const message = `demo.dynamic.xyz wants you to sign in with your Ethereum account:
0x76D17ebc88c913eE305b92b81783D45859fFd68E

Welcome to Dynamic Demo. Signing is the only way we can truly know that you are the owner of the wallet you are connecting. Signing is a safe, gas-less transaction that does not in any way give Dynamic Demo permission to perform any transactions with your wallet.

URI: https://demo.dynamic.xyz/
Version: 1
Chain ID: 1
Nonce: 00000000000000000000000000000000
Issued At: 2024-01-03T18:45:51.064Z
Request ID: 00000000-0000-0000-0000-000000000000`;

export default function Home() {
  const [address, setAddress] = useState<Address | null>(null);

  const getProvider = () => {
    return (window as any).phantom.ethereum;
  };

  const getWalletClient = async () => {
    const client = createWalletClient({
      transport: custom(getProvider()),
    });

    const [lowercaseAddress] = await client.requestAddresses();

    return createWalletClient({
      account: lowercaseAddress,
      transport: custom(getProvider()),
    });
  };

  const onClickConnectPhantomHandler = async () => {
    const client = createWalletClient({
      transport: custom(getProvider()),
    });

    const [lowercaseAddress] = await client.requestAddresses();

    setAddress(lowercaseAddress);
  };

  const onClickSignMessageHandler = async () => {
    const client = createWalletClient({
      account: address!,
      transport: custom(getProvider()),
    });

    const signedMessage = await client.signMessage({
      message,
    });

    console.log("🚀 ~ signedMessage:", signedMessage);

    alert(signedMessage);
  };

  return (
    <div>
      {!address && (
        <button onClick={onClickConnectPhantomHandler}>
          Connect with Phantom Ledger on EVM
        </button>
      )}

      {!!address && (
        <>
          <p>
            Connected with address: <strong>{address}</strong>
            Sign Message content:
          </p>
          <pre>{message}</pre>

          <button onClick={onClickSignMessageHandler}>Sign Message</button>
        </>
      )}
    </div>
  );
}
