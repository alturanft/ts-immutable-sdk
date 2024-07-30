import { FeeData } from "ethers";

const doesChainSupportEIP1559 = (feeData: FeeData) =>
  !!feeData.maxFeePerGas && !!feeData.maxPriorityFeePerGas;

export const getGasPriceInWei = (feeData: FeeData): bigint | null => {
  if (doesChainSupportEIP1559(feeData)) {
    // EIP1559 we need to add a tip for the miner to the base fee
    return feeData.maxFeePerGas;
  }
  if (feeData.gasPrice) return feeData.gasPrice;
  return null;
};
