import { Environment, ImmutableConfiguration } from '@imtbl/config';
import {
  ETH_MAINNET_TO_ZKEVM_MAINNET,
  ETH_SEPOLIA_TO_ZKEVM_DEVNET,
} from 'constants/bridges';
import { ethers } from 'ethers';
import {
  BridgeContracts,
  BridgeInstance,
  BridgeModuleConfiguration,
} from '../types';

/**
 * Represents the configuration for a bridge between two chains.
 */
export class BridgeConfiguration {
    /**
   * @property {ImmutableConfiguration} baseConfig - The base configuration for the module.
   * @property {BridgeInstance} bridgeInstance - The bridge instance configuration for the root and child chains.
   * @property {BridgeContracts} bridgeContracts - The configuration of the contracts associated with the bridge.
   * @property {ethers.providers.Provider} rootProvider - The Ethereum provider for the root chain.
   * @property {ethers.providers.Provider} childProvider - The Ethereum provider for the child chain.
   */
  public baseConfig: ImmutableConfiguration;
  public bridgeInstance: BridgeInstance;
  public bridgeContracts: BridgeContracts;
  public rootProvider: ethers.providers.Provider;
  public childProvider: ethers.providers.Provider;
  
  /**
   * Constructs a BridgeConfiguration instance.
   *
   * @param {BridgeModuleConfiguration} options - The configuration options for the bridge module.
   */
  constructor({
    bridgeInstance,
    rootProvider,
    childProvider,
    baseConfig,
    overrides,
  }: BridgeModuleConfiguration) {
    this.baseConfig = baseConfig;
    this.bridgeInstance = bridgeInstance;
    this.rootProvider = rootProvider;
    this.childProvider = childProvider;

    if (overrides) {
      this.bridgeContracts = overrides.bridgeContracts;
      return;
    }

    const supported =
      SupportedBridgesForEnvironment[baseConfig.environment].includes(
        bridgeInstance
      );
    if (!supported) {
      throw new Error(
        `Bridge instance with rootchain ${bridgeInstance.rootChainID} and childchain ${bridgeInstance.childChainID} is not supported in environment ${baseConfig.environment}`
      );
    }
    if (!ContractsForBridge.has(bridgeInstance)) {
      throw new Error(
        `Bridge instance with rootchain ${bridgeInstance.rootChainID} and childchain ${bridgeInstance.childChainID} is not supported in environment ${baseConfig.environment}`
      );
    }
    const bridgeContracts = ContractsForBridge.get(bridgeInstance);
    if (!bridgeContracts) {
      throw new Error(
        `Bridge instance with rootchain ${bridgeInstance.rootChainID} and childchain ${bridgeInstance.childChainID} is not supported in environment ${baseConfig.environment}`
      );
    }
    this.bridgeContracts = bridgeContracts;
  }
}

/**
 * @constant {Map<BridgeInstance, BridgeContracts>} ContractsForBridge - A map of bridge instances to their associated contract addresses.
 */
const ContractsForBridge = new Map<BridgeInstance, BridgeContracts>()
  .set(ETH_SEPOLIA_TO_ZKEVM_DEVNET, {
    rootChainERC20Predicate: '0xA401eA44cDAc48569322b1166A0696b9412977D9',
    rootChainStateSender: '0xA002CfC25D1DDdE53FBD5d8bCF8E26c821B87ceD',
    childChainERC20Predicate: '0x0000000000000000000000000000000000001004',
    childChainStateReceiver: '0x0000000000000000000000000000000000001001',
  })
  .set(ETH_MAINNET_TO_ZKEVM_MAINNET, {
    rootChainERC20Predicate: '0x',
    rootChainStateSender: '0x',
    childChainERC20Predicate: '0x',
    childChainStateReceiver: '0x',
  });

/**
 * @constant {BridgeInstance[]} SupportedSandboxBridges - An array of supported bridge instances for the sandbox environment.
 */
const SupportedSandboxBridges: BridgeInstance[] = [ETH_SEPOLIA_TO_ZKEVM_DEVNET];

/**
 * @constant {BridgeInstance[]} SupportedProductionBridges - An array of supported bridge instances for the production environment.
 */
const SupportedProductionBridges: BridgeInstance[] = [];

/**
 * @constant {Object} SupportedBridgesForEnvironment - An object mapping environment types to their supported bridge instances.
 */
export const SupportedBridgesForEnvironment: {
  [key in Environment]: BridgeInstance[];
} = {
  [Environment.SANDBOX]: SupportedSandboxBridges,
  [Environment.PRODUCTION]: SupportedProductionBridges,
};