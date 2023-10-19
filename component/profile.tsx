'use client';

import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
  useNetwork,
  useSwitchNetwork,
} from 'wagmi';

function Profile() {
  const { address, connector, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  const { disconnect } = useDisconnect();

  const {
    chains,
    error: switchError,
    isLoading: switchLoading,
    pendingChainId,
    switchNetwork,
  } = useSwitchNetwork({ chainId: 0x2105 });

  const switchAndAdd = async (e) => {
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
        {/* TODO: add chain */}
        <button
          onClick={async (_) => {
            if (switchNetwork) {
              await switchNetwork();
            } else {
              console.log('not support');
            }
          }}
        >
          Test button
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
