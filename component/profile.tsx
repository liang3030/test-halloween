'use client';

import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
  useNetwork,
  useSwitchNetwork,
} from 'wagmi';

const sdk = new ThirdwebSDK('base-goerli', {
  clientId: 'b05efce2f90541bcc3db6874a4603406',
});

function Profile() {
  const { address, connector, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  const { disconnect } = useDisconnect();

  const mintTest = async () => {
    const contract = await sdk.getContract(
      '0xc2dc947ca3a1fe3719680cfc94c34e9e25e92066'
    );

    // Address of the wallet you want to mint the NFT to
    // const walletAddress = '0x91B547360010f6dd7ba638a47C42e6eDCe7A8E88';

    // Custom metadata of the NFT, note that you can fully customize this metadata with other properties.
    const metadata = {
      name: 'Cool NFT',
      description: 'This is a cool NFT',
      image:
        'https://i.seadn.io/gcs/files/fd233f621f44cac6bfe21c56ca728f75.png?auto=format&dpr=1&w=1000', // This can be an image url or file
    };

    const tx = await contract.erc721.mintTo(address as string, metadata);
    const receipt = tx.receipt; // the transaction receipt
    const tokenId = tx.id; // the id of the NFT minted
    const nft = await tx.data(); // (optional) fetch details of minted NFT
  };

  const getHistory = async () => {
    const fetchRes = await fetch(`/history/${address}`, { method: 'GET' });
    const res = await fetchRes.json();
    console.log(res);
  };

  const switchAndAdd = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const provider = await connector?.getProvider();

    if (provider) {
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x2105' }],
        });
      } catch (error) {
        if ((error as any).code === 4902) {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x2105',
                chainName: 'Base',
                rpcUrls: ['https://mainnet.base.org'],
                blockExplorerUrls: ['https://basescan.org'],
                // TODO: check it
                nativeCurrency: {
                  name: 'Eth',
                  symbol: 'Eth',
                  decimals: 18,
                },
              },
            ],
          });
        }
        // TODO
        console.log('error');
        console.log(error);
      }
    }
  };

  if (isConnected) {
    return (
      <div>
        <div>{ensName ? `${ensName} (${address})` : address}</div>
        <div>Connected to {connector?.name}</div>
        <div>Connected to chains {chain?.name}</div>

        <button onClick={(_) => disconnect()}>Disconnect</button>
        <br />
        {/* TODO: if not support switching network */}
        <button onClick={switchAndAdd}>SwitchChain</button>
        <br />
        {/* TODO: check nft */}
        <button
          onClick={async (_) => {
            getHistory();
          }}
        >
          {'has nft'}
        </button>
      </div>
    );
  }

  return (
    <div>
      {connectors.map((connector) => (
        <div key={connector.id}>
          <button
            disabled={!connector.ready}
            onClick={() => connect({ connector })}
            className="block"
          >
            {connector.name}
            {!connector.ready && ' (unsupported)'}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              ' (connecting)'}
          </button>
        </div>
      ))}

      {error && <div>{error.message}</div>}
    </div>
  );
}

export { Profile };
