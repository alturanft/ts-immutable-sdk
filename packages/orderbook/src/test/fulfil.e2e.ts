import { Environment } from '@imtbl/config';
import { Order } from 'openapi/sdk';
import { Orderbook } from 'orderbook';
import { getLocalhostProvider } from './helpers/provider';
import { getConfig } from './helpers/config';
import { getFulfillerWallet, getOffererWallet } from './helpers/signers';
import { deployTestToken } from './helpers/erc721';
import { signAndSubmitTx, signMessage } from './helpers/sign-and-submit';
import { waitForOrderToBeOfStatus } from './helpers/order';

describe('fulfil order', () => {
  it('should fulfil the order', async () => {
    const config = getConfig();
    const provider = getLocalhostProvider();
    const offerer = getOffererWallet(provider);
    const fulfiller = getFulfillerWallet(provider);

    const sdk = new Orderbook({
      baseConfig: {
        environment: Environment.SANDBOX,
      },
      provider: getLocalhostProvider(),
      seaportContractAddress: config.seaportContractAddress,
      zoneContractAddress: config.zoneContractAddress,
      overrides: {
        apiEndpoint: config.apiUrl,
        chainId: 'eip155:31337',
      },
    });

    const { contract } = await deployTestToken(offerer);
    await contract.safeMint(offerer.address);

    const listing = await sdk.prepareListing({
      offerer: offerer.address,
      considerationItem: {
        amount: '1000000',
        type: 'IMX',
      },
      listingItem: {
        contractAddress: contract.address,
        tokenId: '0',
        type: 'ERC721',
      },
    });

    await signAndSubmitTx(listing.unsignedApprovalTransaction!, offerer, provider);
    const signature = await signMessage(
      listing.typedOrderMessageForSigning.domain,
      listing.typedOrderMessageForSigning.types,
      listing.typedOrderMessageForSigning.value,
      offerer,
    );

    const order = await sdk.createOrder({
      offerer: offerer.address,
      orderComponents: listing.orderComponents,
      orderHash: listing.orderHash,
      orderSignature: signature,
    });

    await waitForOrderToBeOfStatus(sdk, order.id, Order.status.ACTIVE);

    const { unsignedFulfillmentTransaction } = await sdk.fulfillOrder(order.id, fulfiller.address);
    await signAndSubmitTx(unsignedFulfillmentTransaction, fulfiller, provider);

    await waitForOrderToBeOfStatus(sdk, order.id, Order.status.FILLED);
  }, 60_000);
});