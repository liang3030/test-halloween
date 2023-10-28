import { useAccount } from 'wagmi';

function Mint() {
  const { isConnected, address } = useAccount();

  const mintTest = async () => {
    
  };

  if (isConnected) {
    return (
      <div>
        <button onClick={mintTest}>Mint Test with thirdweb</button>
      </div>
    );
  }

  return <div>not connect</div>;
}

export { Mint };
