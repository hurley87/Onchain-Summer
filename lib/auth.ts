import { Web3AuthModalPack, Web3AuthConfig } from '@safe-global/auth-kit';

const clientId = `${process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID}`;
const web3AuthNetwork = `${process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK}` as any;
const chainNamespace =
  `${process.env.NEXT_PUBLIC_WEB3AUTH_CHAIN_NAMESPACE}` as any;
const chainId = `${process.env.NEXT_PUBLIC_CHAIN_ID}`;
const rpcTarget = `${process.env.NEXT_PUBLIC_RPC}`;

const options: any = {
  clientId,
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

const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig);

export { web3AuthModalPack, options };
