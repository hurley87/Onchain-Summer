'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Web3AuthModalPack, Web3AuthConfig } from '@safe-global/auth-kit';
import { Web3AuthOptions } from '@web3auth/modal';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Countdown from '@/components/countdown';

const clientId = `${process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID}`;
const web3AuthNetwork = `${process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK}` as any;
const chainNamespace =
  `${process.env.NEXT_PUBLIC_WEB3AUTH_CHAIN_NAMESPACE}` as any;
const chainId = `${process.env.NEXT_PUBLIC_CHAIN_ID}`;
const rpcTarget = `${process.env.NEXT_PUBLIC_RPC}`;

console.log('env vars');
console.log(clientId, web3AuthNetwork, chainNamespace, chainId, rpcTarget);

// https://web3auth.io/docs/sdk/pnp/web/modal/initialize#arguments
const options: Web3AuthOptions = {
  clientId, // https://dashboard.web3auth.io/
  web3AuthNetwork,
  chainConfig: {
    chainNamespace,
    chainId,
    rpcTarget,
  },
  uiConfig: {
    theme: 'dark',
    loginMethodsOrder: ['google', 'facebook'],
  },
};

const web3AuthConfig: Web3AuthConfig = {
  txServiceUrl: 'https://safe-transaction-goerli.safe.global',
};

// Instantiate and initialize the pack
const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig);

export default function Home() {
  const [ownerAddress, setOwnerAddress] = useState('');
  const [web3Provider, setWeb3Provider] =
    useState<ethers.providers.Web3Provider>();
  const [isMinting, setIsMinting] = useState(false);

  useEffect(() => {
    web3AuthModalPack.init({ options });

    async function init() {
      const { eoa } = await web3AuthModalPack.signIn();
      const provider =
        web3AuthModalPack.getProvider() as ethers.providers.ExternalProvider;

      // we set react state with the provided values: owner (eoa address), chain, safes owned & web3 provider
      setOwnerAddress(eoa);
      setWeb3Provider(new ethers.providers.Web3Provider(provider));
    }

    if (web3AuthModalPack) init();
  }, []);

  const handleSignIn = async () => {
    try {
      const { eoa, safes } = await web3AuthModalPack.signIn();
      console.log(eoa, safes);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMint = async () => {
    setIsMinting(true);
    try {
      const signer = web3Provider?.getSigner();
      const contract = new ethers.Contract(
        '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        ['function mint()'],
        signer
      );
      const tx = await contract.mint();
      await tx.wait();
      setIsMinting(false);
    } catch (error) {
      console.log(error);
      setIsMinting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await web3AuthModalPack.signOut();
      setOwnerAddress('');
      setWeb3Provider(undefined);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(ownerAddress, web3Provider);

  function formatAddress(address: string) {
    return `${address.slice(0, 2)}..${address.slice(-4)}`;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-teaser-gradient">
      <div className="absolute right-2 top-2">
        {ownerAddress ? (
          <Button onClick={handleDisconnect} size="sm" variant="link">
            Disconnect {formatAddress(ownerAddress)}
          </Button>
        ) : (
          <Button onClick={handleSignIn} size="sm" variant="link">
            Connect Wallet
          </Button>
        )}
      </div>
      <div className="h-[54px] w-[54px] rounded-full bg-[#FCD22D] mb-8"></div>
      <section className="max-w-[900px] grid p-5 md:p-6 rounded-3xl md:rounded-[32px] bg-white shadow-large w-full md:grid-cols-[5fr,7fr] gap-5 md:gap-10">
        <div className="relative w-full aspect-[16/16] mb-1 lg:mb-0 order-1 md:order-2">
          <Image
            alt="Bridge to Base"
            src="/giphy.gif"
            layout="fill"
            objectFit="cover"
            className="rounded-3xl"
          />
        </div>
        <div className="flex flex-col w-full gap-4 h-full overflow-scroll order-2 md:order-1 md:gap-4 hide-scrollbar">
          <h1 className="text-[28px] text-black font-semibold tracking-tighter">
            Onchain Summer 08.09.23
          </h1>
          <div className="flex items-center mb-2">
            <span className="mr-2 text-slate-500">by</span>
            <span className="max-w-full overflow-hidden rounded-[58px] bg-ocs-gray text-white p-1 pr-2 w-max flex gap-2 items-center text-sm leading-none font-mono pl-2 !bg-slate-800 !text-white">
              <span className="leading-[140%]">dhurley.eth</span>
            </span>
          </div>
          <p className="text-[#444]">
            Base mainnet opens for everyone on August 9 with Onchain Summer, a
            multi-week festival of onchain art, music, gaming, & more.
          </p>
          <p className="text-[#444]">
            Bridge today to get ready and mint an NFT that commemorates you
            being early, one of the first to teleport to the new internet.
          </p>
          <div className="flex flex-col w-full gap-4 mt-auto">
            <Countdown />
            {ownerAddress ? (
              <Button disabled={isMinting} onClick={handleMint} size="lg">
                {' '}
                {isMinting ? 'Minting ...' : 'Mint For Free'}{' '}
              </Button>
            ) : (
              <Button onClick={handleSignIn} size="lg">
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </section>
      <p className="text-center text-xs md:text-sm leading-loose md:text-left pt-8 text-white">
        Built by{' '}
        <a
          href="https://twitter.com/davidhurley87"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          David Hurley
        </a>
        . Inspired by{' '}
        <a
          href="https://onchainsummer.xyz"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          Onchain Summer
        </a>
        . The source code is available on{' '}
        <a
          href="https://github.com/hurley87/Onchain-Summer"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          GitHub
        </a>
        .
      </p>
    </main>
  );
}
