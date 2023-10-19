import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { base, mainnet, polygon } from '@wagmi/core/chains'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, base, polygon],
  [
    alchemyProvider({ apiKey: '7NxslyA71FQhIQt1ZwTU1nRVVjOpAcy0' }),
    publicProvider(),
  ]
);

export const config = createConfig({
	autoConnect: true,
  publicClient,
	webSocketPublicClient,
	connectors: [
		new MetaMaskConnector(),
		new CoinbaseWalletConnector({ options: {appName: 'play'} }),
	]
});
