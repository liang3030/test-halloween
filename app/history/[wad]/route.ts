import { NextResponse } from 'next/server';

import {
  Alchemy,
  AssetTransfersCategory,
  Network,
  SortingOrder,
} from 'alchemy-sdk';

const config = {
  apiKey: process.env.ALCHEMY_KEY,
  network: Network.BASE_GOERLI,
};

const alchemy = new Alchemy(config);


export async function GET(
  request: Request,
  { params }: { params: { wad: string } }
) {
  const { wad } = params;
  console.log(wad);
  console.log(process.env.ALCHEMY_KEY)
  const data = await alchemy.core.getAssetTransfers({
    order: SortingOrder.DESCENDING,
    fromBlock: '0x0',
    toAddress: wad,
    // TODO: contract address
    contractAddresses: ['0xe9DC288Cb2562beaE978b2e42BA7839BA443C843'],
    category: [AssetTransfersCategory.ERC721, AssetTransfersCategory.ERC1155],
  });

  const hasNFT = data.transfers.length > 0

  return NextResponse.json({ has: hasNFT });
}
