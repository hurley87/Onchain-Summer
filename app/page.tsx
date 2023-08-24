'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Countdown from '@/components/countdown';
import { formatAddress } from '@/lib/utils';
import Link from 'next/link';
import { web3AuthModalPack, options } from '@/lib/auth';
import Mint from '@/components/mint';

export default function Home() {
  const [ownerAddress, setOwnerAddress] = useState('');
  const [web3Provider, setWeb3Provider] = useState<any>();

  useEffect(() => {
    web3AuthModalPack.init({ options });

    if (web3AuthModalPack) signIn();
  }, []);

  const signIn = async () => {
    try {
      const { eoa } = await web3AuthModalPack.signIn();
      const provider = web3AuthModalPack.getProvider() as any;
      setOwnerAddress(eoa);
      setWeb3Provider(new ethers.BrowserProvider(provider));
    } catch (error) {
      console.log(error);
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

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 bg-teaser-gradient">
      <div className="absolute right-2 top-2">
        {ownerAddress ? (
          <div className="flex">
            <Link
              target="_blank"
              href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL}/address/${ownerAddress}`}
            >
              <Button className="px-0" size="sm" variant="link">
                {formatAddress(ownerAddress)}
              </Button>
            </Link>
            <Button onClick={handleDisconnect} size="sm" variant="link">
              Disconnect
            </Button>
          </div>
        ) : (
          <Button onClick={signIn} size="sm" variant="link">
            Connect Wallet
          </Button>
        )}
      </div>
      <div className="h-[54px] w-[54px] rounded-full bg-[#FCD22D]"></div>
      <section className="my-8 max-w-[900px] grid p-5 md:p-6 rounded-3xl md:rounded-[32px] bg-white shadow-large w-full md:grid-cols-[5fr,7fr] gap-5 md:gap-10">
        <div className="relative w-full aspect-[16/16] mb-1 lg:mb-0 order-1 md:order-2">
          <Image
            alt="Bridge to Base"
            src="/giphy.gif"
            layout="fill"
            className="rounded-3xl"
          />
        </div>
        <div className="flex flex-col w-full gap-4 h-full order-2 md:order-1 md:gap-4">
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
            Base mainnet opens for everyone on August 9 with the goal of
            bringing 1B+ people onchain by providing a foundation for mainstream
            consumer crypto products.
          </p>
          <p className="text-[#444]">
            In this demo you can mint an NFT for free with only your email.{' '}
            <Link
              className="underline"
              target="_blank"
              href="https://safe.global/core"
            >
              Safe
            </Link>{' '}
            is used to create your wallet and{' '}
            <Link
              className="underline"
              target="_blank"
              href="https://www.gelato.network/relay"
            >
              Gelato
            </Link>{' '}
            is used to pay for the mint transaction.
          </p>
          <div className="flex flex-col w-full gap-4 mt-auto">
            <Countdown />
            {ownerAddress ? (
              <Mint web3Provider={web3Provider} />
            ) : (
              <Button onClick={signIn} size="lg">
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </section>
      <p className="text-center text-xs md:text-sm leading-loose md:text-left text-white">
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
