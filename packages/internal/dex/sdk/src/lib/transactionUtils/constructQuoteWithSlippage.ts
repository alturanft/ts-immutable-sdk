import { Amount, QuoteTradeInfo, TokenInfo } from '../../types';
import { Currency, Percent, Token, TradeType } from '@uniswap/sdk-core';
import { ethers } from 'ethers';

export function constructQuoteWithSlippage(
  otherCurrency: Currency,
  tradeType: TradeType,
  tradeInfo: QuoteTradeInfo,
  slippagePercent: Percent
): { quote: Amount; quoteWithMaxSlippage: Amount } {
  let quote: Amount;
  let quoteWithMaxSlippage: Amount;

  const resultToken: Token = otherCurrency.wrapped;
  const tokenInfo: TokenInfo = {
    chainId: resultToken.chainId,
    address: resultToken.address,
    decimals: resultToken.decimals,
    symbol: resultToken.symbol,
    name: resultToken.name,
  };

  if (tradeType === TradeType.EXACT_INPUT) {
    quote = {
      token: tokenInfo,
      amount: tradeInfo.amountOut,
    };
  } else {
    quote = {
      token: tokenInfo,
      amount: tradeInfo.amountIn,
    };
  }

  const amountWithSlippageImpact = getAmountWithSlippageImpact(
    tradeType,
    quote.amount,
    slippagePercent
  );

  quoteWithMaxSlippage = {
    token: tokenInfo,
    amount: amountWithSlippageImpact,
  };

  return {
    quote,
    quoteWithMaxSlippage,
  };
}

export function getAmountWithSlippageImpact(
  tradeType: TradeType,
  amount: ethers.BigNumberish,
  slippagePercent: Percent
): ethers.BigNumberish {
  if (slippagePercent.numerator.toString() === '0') {
    return amount;
  }

  const amountBigNumber = ethers.BigNumber.from(amount);
  const slippageImpact = amountBigNumber
    .mul(slippagePercent.numerator.toString())
    .div(slippagePercent.denominator.toString());

  return tradeType === TradeType.EXACT_INPUT
    ? amountBigNumber.sub(slippageImpact)
    : amountBigNumber.add(slippageImpact);
}