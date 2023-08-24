'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ethers } from 'ethers';
import { GelatoRelay } from '@gelatonetwork/relay-sdk';
import OnchainSummer from '@/lib/OnchainSummer.json';
import Link from 'next/link';
import { toast } from '@/components/ui/use-toast';

const relay = new GelatoRelay();

export default function Mint({ web3Provider }: { web3Provider: any }) {
  const [isMinting, setIsMinting] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const target = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as string;

  const handleMint = async () => {
    setIsMinting(true);
    try {
      const signer = (await web3Provider?.getSigner()) as any;
      const path = process.env.NEXT_PUBLIC_NFT_METADATA;
      const contract = new ethers.Contract(target, OnchainSummer.abi, signer);

      try {
        const { chainId } = await web3Provider.getNetwork();
        const { data } = await contract?.mint.populateTransaction(
          signer.address,
          path
        );
        const request: any = {
          chainId: chainId,
          target,
          data: data,
          user: signer.address,
        };
        const apiKey = process.env.NEXT_PUBLIC_GELATO_API_KEY as string;
        const response = await relay.sponsoredCallERC2771(
          request,
          signer.provider,
          apiKey
        );
        const taskId = response.taskId;

        const interval = setInterval(async () => {
          try {
            setIsMinting(true);
            const taskStatus = await relay.getTaskStatus(taskId || '');
            if (taskStatus?.taskState === 'ExecSuccess') {
              clearInterval(interval);
              setIsMinting(false);
              toast({
                title: 'NFT minted!',
                description: 'View the NFT transaction on Blockscout.',
              });
              const transactionHash = taskStatus?.transactionHash as string;
              setTransactionHash(transactionHash);
            } else if (taskStatus?.taskState === 'Cancelled') {
              throw new Error('Error minting tokens');
            }
          } catch (error) {
            console.log(error);
            if (!error?.toString().includes('GelatoRelaySDK/getTaskStatus')) {
              setIsMinting(false);
            }
          }
        }, 1000);
      } catch (e) {
        console.log('Error minting NFT: ', e);
        setIsMinting(false);
      }
    } catch (error) {
      console.log(error);
      setIsMinting(false);
    }
  };

  return transactionHash !== '' ? (
    <Link
      target="_blank"
      href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL}/tx/${transactionHash}`}
    >
      <Button size="lg">View Transaction</Button>
    </Link>
  ) : (
    <Button disabled={isMinting} onClick={handleMint} size="lg">
      {isMinting ? 'Minting ...' : 'Mint For Free'}{' '}
    </Button>
  );
}
