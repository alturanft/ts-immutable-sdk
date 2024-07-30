import { Environment } from "@imtbl/config";
import { JsonRpcProvider, formatUnits } from "ethers";
import {
  BridgeRequirement,
  bridgeRoute,
  hasSufficientL1Eth,
} from "./bridgeRoute";
import { CheckoutConfiguration } from "../../../config";
import { ChainId, FeeType, FundingStepType, ItemType } from "../../../types";
import { TokenBalanceResult } from "../types";
import { createBlockchainDataInstance } from "../../../instance";
import { getBridgeFeeEstimate } from "./getBridgeFeeEstimate";
import { CheckoutErrorType } from "../../../errors";
import { allowListCheckForBridge } from "../../allowList/allowListCheck";
import { INDEXER_ETH_ROOT_CONTRACT_ADDRESS } from "../indexer/fetchL1Representation";
import { DEFAULT_TOKEN_DECIMALS } from "../../../env";
import { HttpClient } from "../../../api/http";

jest.mock("../../../gasEstimate");
jest.mock("../../../instance");
jest.mock("./getBridgeFeeEstimate");
jest.mock("../../allowList/allowListCheck");

describe("bridgeRoute", () => {
  const mockedHttpClient = new HttpClient() as jest.Mocked<HttpClient>;
  const config = new CheckoutConfiguration(
    {
      baseConfig: { environment: Environment.SANDBOX },
    },
    mockedHttpClient
  );

  const readonlyProviders = new Map<ChainId, JsonRpcProvider>([
    [ChainId.SEPOLIA, {} as JsonRpcProvider],
    [ChainId.IMTBL_ZKEVM_TESTNET, {} as JsonRpcProvider],
  ]);

  describe("bridgeRoute", () => {
    describe("Bridge ETH", () => {
      const bridgeRequirement: BridgeRequirement = {
        amount: 10n,
        formattedAmount: "10",
        l2address: "0xL2ADDRESS",
      };

      beforeEach(() => {
        (createBlockchainDataInstance as jest.Mock).mockReturnValue({
          getToken: jest.fn().mockResolvedValue({
            result: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              root_contract_address: INDEXER_ETH_ROOT_CONTRACT_ADDRESS,
            },
          }),
        });

        (getBridgeFeeEstimate as jest.Mock).mockResolvedValue({
          approvalGas: 0n,
          sourceChainGas: 2n,
          bridgeFee: 3n,
          imtblFee: 4n,
          totalFees: 9n,
        });

        (allowListCheckForBridge as jest.Mock).mockResolvedValue([
          {
            name: "Sep Eth",
            symbol: "ETH",
            decimals: 18,
          },
        ]);
      });

      it("should return the bridge route if user has enough Ethereum & gas on L1", async () => {
        const balances = new Map<ChainId, TokenBalanceResult>([
          [
            ChainId.SEPOLIA,
            {
              success: true,
              balances: [
                {
                  balance: 20n,
                  formattedBalance: "20",
                  token: {
                    name: "Immutable X",
                    symbol: "IMX",
                    decimals: 18,
                    address: "0xIMX",
                  },
                },
                {
                  balance: 20n,
                  formattedBalance: "20",
                  token: {
                    name: "Sep Eth",
                    symbol: "ETH",
                    decimals: 18,
                    address: "native",
                  },
                },
              ],
            },
          ],
        ]);

        const route = await bridgeRoute(
          config,
          readonlyProviders,
          {
            bridge: true,
          },
          bridgeRequirement,
          balances
        );

        expect(route).toEqual({
          type: FundingStepType.BRIDGE,
          chainId: ChainId.SEPOLIA,
          fundingItem: {
            type: ItemType.NATIVE,
            fundsRequired: {
              amount: 10n,
              formattedAmount: "10",
            },
            userBalance: {
              balance: 20n,
              formattedBalance: "20",
            },
            token: {
              name: "Sep Eth",
              symbol: "ETH",
              decimals: 18,
              address: "native",
            },
          },
          fees: {
            approvalGasFee: {
              type: FeeType.GAS,
              amount: 0n,
              formattedAmount: formatUnits(0n, DEFAULT_TOKEN_DECIMALS),
              token: {
                name: "Sep Eth",
                symbol: "ETH",
                decimals: 18,
              },
            },
            bridgeGasFee: {
              type: FeeType.GAS,
              amount: 2n,
              formattedAmount: formatUnits(2n, DEFAULT_TOKEN_DECIMALS),
              token: {
                name: "Sep Eth",
                symbol: "ETH",
                decimals: 18,
              },
            },
            bridgeFees: [
              {
                type: FeeType.BRIDGE_FEE,
                amount: 3n,
                formattedAmount: formatUnits(3n, DEFAULT_TOKEN_DECIMALS),
                token: {
                  name: "Sep Eth",
                  symbol: "ETH",
                  decimals: 18,
                },
              },
              {
                type: FeeType.IMMUTABLE_FEE,
                amount: 4n,
                formattedAmount: formatUnits(4n, DEFAULT_TOKEN_DECIMALS),
                token: {
                  name: "Sep Eth",
                  symbol: "ETH",
                  decimals: 18,
                },
              },
            ],
          },
        });
      });

      it("should return the bridge route if user has exactly enough Ethereum & gas on L1", async () => {
        const balances = new Map<ChainId, TokenBalanceResult>([
          [
            ChainId.SEPOLIA,
            {
              success: true,
              balances: [
                {
                  balance: 19n,
                  formattedBalance: "19",
                  token: {
                    name: "Sep Eth",
                    symbol: "ETH",
                    decimals: 18,
                  },
                },
              ],
            },
          ],
        ]);

        const route = await bridgeRoute(
          config,
          readonlyProviders,
          {
            bridge: true,
          },
          bridgeRequirement,
          balances
        );

        expect(route).toEqual({
          type: FundingStepType.BRIDGE,
          chainId: ChainId.SEPOLIA,
          fundingItem: {
            type: ItemType.NATIVE,
            fundsRequired: {
              amount: 10n,
              formattedAmount: "10",
            },
            userBalance: {
              balance: 19n,
              formattedBalance: "19",
            },
            token: {
              name: "Sep Eth",
              symbol: "ETH",
              decimals: 18,
              address: undefined,
            },
          },
          fees: {
            approvalGasFee: {
              type: FeeType.GAS,
              amount: 0n,
              formattedAmount: formatUnits(0n, DEFAULT_TOKEN_DECIMALS),
              token: {
                name: "Sep Eth",
                symbol: "ETH",
                decimals: 18,
              },
            },
            bridgeGasFee: {
              type: FeeType.GAS,
              amount: 2n,
              formattedAmount: formatUnits(2n, DEFAULT_TOKEN_DECIMALS),
              token: {
                name: "Sep Eth",
                symbol: "ETH",
                decimals: 18,
              },
            },
            bridgeFees: [
              {
                type: FeeType.BRIDGE_FEE,
                amount: 3n,
                formattedAmount: formatUnits(3n, DEFAULT_TOKEN_DECIMALS),
                token: {
                  name: "Sep Eth",
                  symbol: "ETH",
                  decimals: 18,
                },
              },
              {
                type: FeeType.IMMUTABLE_FEE,
                amount: 4n,
                formattedAmount: formatUnits(4n, DEFAULT_TOKEN_DECIMALS),
                token: {
                  name: "Sep Eth",
                  symbol: "ETH",
                  decimals: 18,
                },
              },
            ],
          },
        });
      });

      it("should not return bridge route if enough eth balance on L1 but not enough for fees", async () => {
        const balances = new Map<ChainId, TokenBalanceResult>([
          [
            ChainId.SEPOLIA,
            {
              success: true,
              balances: [
                {
                  balance: 18n,
                  formattedBalance: "18",
                  token: {
                    name: "Sep Eth",
                    symbol: "ETH",
                    decimals: 18,
                  },
                },
              ],
            },
          ],
        ]);

        const route = await bridgeRoute(
          config,
          readonlyProviders,
          {
            bridge: true,
          },
          bridgeRequirement,
          balances
        );

        expect(route).toBeUndefined();
      });

      it("should not return bridge route if Ethereum is not on bridge allowlist", async () => {
        const balances = new Map<ChainId, TokenBalanceResult>([
          [
            ChainId.SEPOLIA,
            {
              success: true,
              balances: [
                {
                  balance: 20n,
                  formattedBalance: "20",
                  token: {
                    name: "Immutable X",
                    symbol: "IMX",
                    decimals: 18,
                    address: "0xIMX",
                  },
                },
                {
                  balance: 20n,
                  formattedBalance: "20",
                  token: {
                    name: "Sep Eth",
                    symbol: "ETH",
                    decimals: 18,
                  },
                },
              ],
            },
          ],
        ]);
        (allowListCheckForBridge as jest.Mock).mockResolvedValue([]);

        const route = await bridgeRoute(
          config,
          readonlyProviders,
          {
            bridge: true,
          },
          bridgeRequirement,
          balances
        );

        expect(allowListCheckForBridge).toHaveBeenCalledTimes(1);
        expect(route).toEqual(undefined);
      });
    });

    describe("Bridge ERC20", () => {
      const bridgeRequirement = {
        amount: 10n,
        formattedAmount: "10",
        l2address: "0xL2ADDRESS",
      };

      beforeEach(() => {
        (createBlockchainDataInstance as jest.Mock).mockReturnValue({
          getToken: jest.fn().mockResolvedValue({
            result: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              root_contract_address: "0xROOT_ADDRESS",
            },
          }),
        });

        (getBridgeFeeEstimate as jest.Mock).mockResolvedValue({
          approvalGas: 1n,
          sourceChainGas: 2n,
          bridgeFee: 3n,
          imtblFee: 4n,
          totalFees: 9n,
        });

        (allowListCheckForBridge as jest.Mock).mockResolvedValue([
          {
            address: "0xROOT_ADDRESS",
            name: "0xERC20",
            symbol: "0xERC20",
            decimals: 18,
          },
        ]);
      });

      it("should return the bridge route if user has enough ERC20 & gas on L1", async () => {
        const balances = new Map<ChainId, TokenBalanceResult>([
          [
            ChainId.SEPOLIA,
            {
              success: true,
              balances: [
                {
                  balance: 10n,
                  formattedBalance: "10",
                  token: {
                    name: "Sep Eth",
                    symbol: "ETH",
                    decimals: 18,
                  },
                },
                {
                  balance: 10n,
                  formattedBalance: "10",
                  token: {
                    name: "0xERC20",
                    symbol: "0xERC20",
                    decimals: 18,
                    address: "0xROOT_ADDRESS",
                  },
                },
              ],
            },
          ],
        ]);

        const route = await bridgeRoute(
          config,
          readonlyProviders,
          {
            bridge: true,
          },
          bridgeRequirement,
          balances
        );

        expect(route).toEqual({
          type: FundingStepType.BRIDGE,
          chainId: ChainId.SEPOLIA,
          fundingItem: {
            type: ItemType.ERC20,
            fundsRequired: {
              amount: 10n,
              formattedAmount: "10",
            },
            userBalance: {
              balance: 10n,
              formattedBalance: "10",
            },
            token: {
              name: "0xERC20",
              symbol: "0xERC20",
              address: "0xROOT_ADDRESS",
              decimals: 18,
            },
          },
          fees: {
            approvalGasFee: {
              type: FeeType.GAS,
              amount: 1n,
              formattedAmount: formatUnits(1n, DEFAULT_TOKEN_DECIMALS),
              token: {
                name: "Sep Eth",
                symbol: "ETH",
                decimals: 18,
              },
            },
            bridgeGasFee: {
              type: FeeType.GAS,
              amount: 2n,
              formattedAmount: formatUnits(2n, DEFAULT_TOKEN_DECIMALS),
              token: {
                name: "Sep Eth",
                symbol: "ETH",
                decimals: 18,
              },
            },
            bridgeFees: [
              {
                type: FeeType.BRIDGE_FEE,
                amount: 3n,
                formattedAmount: formatUnits(3n, DEFAULT_TOKEN_DECIMALS),
                token: {
                  name: "Sep Eth",
                  symbol: "ETH",
                  decimals: 18,
                },
              },
              {
                type: FeeType.IMMUTABLE_FEE,
                amount: 4n,
                formattedAmount: formatUnits(4n, DEFAULT_TOKEN_DECIMALS),
                token: {
                  name: "Sep Eth",
                  symbol: "ETH",
                  decimals: 18,
                },
              },
            ],
          },
        });
      });

      it("should return the bridge route if user has exactly enough ERC20 & gas on L1", async () => {
        const balances = new Map<ChainId, TokenBalanceResult>([
          [
            ChainId.SEPOLIA,
            {
              success: true,
              balances: [
                {
                  balance: 9n,
                  formattedBalance: "9",
                  token: {
                    name: "Sep Eth",
                    symbol: "ETH",
                    decimals: 18,
                  },
                },
                {
                  balance: 10n,
                  formattedBalance: "10",
                  token: {
                    name: "0xERC20",
                    symbol: "0xERC20",
                    decimals: 18,
                    address: "0xROOT_ADDRESS",
                  },
                },
              ],
            },
          ],
        ]);

        const route = await bridgeRoute(
          config,
          readonlyProviders,
          {
            bridge: true,
          },
          bridgeRequirement,
          balances
        );

        expect(route).toEqual({
          type: FundingStepType.BRIDGE,
          chainId: ChainId.SEPOLIA,
          fundingItem: {
            type: ItemType.ERC20,
            fundsRequired: {
              amount: 10n,
              formattedAmount: "10",
            },
            userBalance: {
              balance: 10n,
              formattedBalance: "10",
            },
            token: {
              name: "0xERC20",
              symbol: "0xERC20",
              address: "0xROOT_ADDRESS",
              decimals: 18,
            },
          },
          fees: {
            approvalGasFee: {
              type: FeeType.GAS,
              amount: 1n,
              formattedAmount: formatUnits(1n, DEFAULT_TOKEN_DECIMALS),
              token: {
                name: "Sep Eth",
                symbol: "ETH",
                decimals: 18,
              },
            },
            bridgeGasFee: {
              type: FeeType.GAS,
              amount: 2n,
              formattedAmount: formatUnits(2n, DEFAULT_TOKEN_DECIMALS),
              token: {
                name: "Sep Eth",
                symbol: "ETH",
                decimals: 18,
              },
            },
            bridgeFees: [
              {
                type: FeeType.BRIDGE_FEE,
                amount: 3n,
                formattedAmount: formatUnits(3n, DEFAULT_TOKEN_DECIMALS),
                token: {
                  name: "Sep Eth",
                  symbol: "ETH",
                  decimals: 18,
                },
              },
              {
                type: FeeType.IMMUTABLE_FEE,
                amount: 4n,
                formattedAmount: formatUnits(4n, DEFAULT_TOKEN_DECIMALS),
                token: {
                  name: "Sep Eth",
                  symbol: "ETH",
                  decimals: 18,
                },
              },
            ],
          },
        });
      });

      it("should return undefined if not enough ERC20 on L1", async () => {
        const balances = new Map<ChainId, TokenBalanceResult>([
          [
            ChainId.SEPOLIA,
            {
              success: true,
              balances: [
                {
                  balance: 10n,
                  formattedBalance: "10",
                  token: {
                    name: "Sep Eth",
                    symbol: "ETH",
                    decimals: 18,
                  },
                },
                {
                  balance: 9n,
                  formattedBalance: "9",
                  token: {
                    name: "0xERC20",
                    symbol: "0xERC20",
                    decimals: 18,
                    address: "0xROOT_ADDRESS",
                  },
                },
              ],
            },
          ],
        ]);

        const route = await bridgeRoute(
          config,
          readonlyProviders,
          {
            bridge: true,
          },
          bridgeRequirement,
          balances
        );

        expect(route).toBeUndefined();
      });

      it("should return undefined if not enough ETH on L1 for gas", async () => {
        const balances = new Map<ChainId, TokenBalanceResult>([
          [
            ChainId.SEPOLIA,
            {
              success: true,
              balances: [
                {
                  balance: 8n,
                  formattedBalance: "8",
                  token: {
                    name: "Sep Eth",
                    symbol: "ETH",
                    decimals: 18,
                  },
                },
                {
                  balance: 10n,
                  formattedBalance: "10",
                  token: {
                    name: "0xERC20",
                    symbol: "0xERC20",
                    decimals: 18,
                    address: "0xROOT_ADDRESS",
                  },
                },
              ],
            },
          ],
        ]);

        const route = await bridgeRoute(
          config,
          readonlyProviders,
          {
            bridge: true,
          },
          bridgeRequirement,
          balances
        );

        expect(route).toBeUndefined();
      });

      it("should not return bridge route if ERC20 is not on bridge allowlist", async () => {
        const balances = new Map<ChainId, TokenBalanceResult>([
          [
            ChainId.SEPOLIA,
            {
              success: true,
              balances: [
                {
                  balance: 10n,
                  formattedBalance: "10",
                  token: {
                    name: "Sep Eth",
                    symbol: "ETH",
                    decimals: 18,
                  },
                },
                {
                  balance: 11n,
                  formattedBalance: "11",
                  token: {
                    name: "0xERC20",
                    symbol: "0xERC20",
                    decimals: 18,
                    address: "0xROOT_ADDRESS",
                  },
                },
              ],
            },
          ],
        ]);
        (allowListCheckForBridge as jest.Mock).mockResolvedValue([]);

        const route = await bridgeRoute(
          config,
          readonlyProviders,
          {
            bridge: true,
          },
          bridgeRequirement,
          balances
        );

        expect(allowListCheckForBridge).toHaveBeenCalledTimes(1);
        expect(route).toEqual(undefined);
      });
    });

    it("should return undefined if no balance on layer 1", async () => {
      const bridgeRequirement = {
        amount: 10n,
        formattedAmount: "10",
        l2address: "0xL2ADDRESS",
      };

      (allowListCheckForBridge as jest.Mock).mockResolvedValue([
        {
          name: "Sep Eth",
          symbol: "ETH",
          decimals: 18,
        },
      ]);

      const balances = new Map<ChainId, TokenBalanceResult>([
        [
          ChainId.SEPOLIA,
          {
            success: true,
            balances: [],
          },
        ],
      ]);

      const route = await bridgeRoute(
        config,
        readonlyProviders,
        {
          bridge: true,
        },
        bridgeRequirement,
        balances
      );

      expect(route).toBeUndefined();
    });

    it("should return undefined if no token balance result for L1", async () => {
      const bridgeRequirement = {
        amount: 10n,
        formattedAmount: "10",
        l2address: "0xL2ADDRESS",
      };

      const balances = new Map<ChainId, TokenBalanceResult>([
        [
          ChainId.IMTBL_ZKEVM_TESTNET,
          {
            success: true,
            balances: [],
          },
        ],
      ]);

      const route = await bridgeRoute(
        config,
        readonlyProviders,
        {
          bridge: true,
        },
        bridgeRequirement,
        balances
      );

      expect(route).toEqual(undefined);
    });

    it("should return undefined if token balance returned unsuccessful on L1", async () => {
      const bridgeRequirement = {
        amount: 10n,
        formattedAmount: "10",
        l2address: "0xL2ADDRESS",
      };

      const balances = new Map<ChainId, TokenBalanceResult>([
        [
          ChainId.SEPOLIA,
          {
            success: false,
            balances: [],
          },
        ],
      ]);

      const route = await bridgeRoute(
        config,
        readonlyProviders,
        {
          bridge: true,
        },
        bridgeRequirement,
        balances
      );

      expect(route).toEqual(undefined);
    });

    it("should throw error if readonly providers missing L1", async () => {
      const bridgeRequirement = {
        amount: 10n,
        formattedAmount: "10",
        l2address: "0xL2ADDRESS",
      };

      const balances = new Map<ChainId, TokenBalanceResult>([
        [
          ChainId.SEPOLIA,
          {
            success: true,
            balances: [],
          },
        ],
      ]);

      let type;
      let data;

      try {
        await bridgeRoute(
          config,
          new Map<ChainId, JsonRpcProvider>([
            [ChainId.IMTBL_ZKEVM_TESTNET, {} as JsonRpcProvider],
          ]),
          {
            bridge: true,
          },
          bridgeRequirement,
          balances
        );
      } catch (err: any) {
        type = err.type;
        data = err.data;
      }

      expect(type).toEqual(CheckoutErrorType.PROVIDER_ERROR);
      expect(data).toEqual({ chainId: ChainId.SEPOLIA.toString() });
    });
  });

  describe("hasSufficientL1Eth", () => {
    it("should return true if enough eth", () => {
      const hasSufficientEth = hasSufficientL1Eth(
        {
          success: true,
          balances: [
            {
              balance: 2n,
              formattedBalance: "2",
              token: {
                name: "Sep Eth",
                symbol: "ETH",
                decimals: 18,
              },
            },
          ],
        },
        1n
      );

      expect(hasSufficientEth).toBeTruthy();
    });

    it("should return true if exactly enough eth", () => {
      const hasSufficientEth = hasSufficientL1Eth(
        {
          success: true,
          balances: [
            {
              balance: 1n,
              formattedBalance: "1",
              token: {
                name: "Sep Eth",
                symbol: "ETH",
                decimals: 18,
              },
            },
          ],
        },
        1n
      );

      expect(hasSufficientEth).toBeTruthy();
    });

    it("should return false if not enough eth", () => {
      const hasSufficientEth = hasSufficientL1Eth(
        {
          success: true,
          balances: [
            {
              balance: 0n,
              formattedBalance: "0",
              token: {
                name: "Sep Eth",
                symbol: "ETH",
                decimals: 18,
              },
            },
          ],
        },
        1n
      );

      expect(hasSufficientEth).toBeFalsy();
    });
  });
});
