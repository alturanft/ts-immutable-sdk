import { TransactionRequest, BrowserProvider, isError } from "ethers";
import { CheckoutError, CheckoutErrorType } from "../errors";
import { SendTransactionResult } from "../types";
import { IMMUTABLE_ZKVEM_GAS_OVERRIDES } from "../env";
import { isZkEvmChainId } from "../utils/utils";

export const setTransactionGasLimits = async (
  web3Provider: BrowserProvider,
  transaction: TransactionRequest
): Promise<TransactionRequest> => {
  const rawTx = transaction;

  const { chainId } = await web3Provider.getNetwork();
  const chainIdNumber = Number(chainId);
  if (!isZkEvmChainId(chainIdNumber)) return rawTx;
  if (typeof rawTx.gasPrice !== "undefined") return rawTx;

  rawTx.maxFeePerGas = IMMUTABLE_ZKVEM_GAS_OVERRIDES.maxFeePerGas;
  rawTx.maxPriorityFeePerGas =
    IMMUTABLE_ZKVEM_GAS_OVERRIDES.maxPriorityFeePerGas;

  return rawTx;
};

export const handleProviderError = (err: any) => {
  if (isError(err, "INSUFFICIENT_FUNDS")) {
    return new CheckoutError(
      err.message,
      CheckoutErrorType.INSUFFICIENT_FUNDS,
      { error: err }
    );
  }
  if (isError(err, "ACTION_REJECTED")) {
    return new CheckoutError(
      err.message,
      CheckoutErrorType.USER_REJECTED_REQUEST_ERROR,
      { error: err }
    );
  }
  return new CheckoutError(err.message, CheckoutErrorType.TRANSACTION_FAILED, {
    error: err,
  });
};

export const sendTransaction = async (
  web3Provider: BrowserProvider,
  transaction: TransactionRequest
): Promise<SendTransactionResult> => {
  try {
    const signer = await web3Provider.getSigner();

    const rawTx = await setTransactionGasLimits(web3Provider, transaction);
    const transactionResponse = await signer.sendTransaction(rawTx);

    return {
      transactionResponse,
    };
  } catch (err: any) {
    throw handleProviderError(err);
  }
};
