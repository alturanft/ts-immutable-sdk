import { Checkout, GetBalanceResult } from '@imtbl/checkout-sdk-web';
import { Web3Provider } from '@ethersproject/providers';
import { useMemo, useState } from 'react';
import { SuccessMessage, ErrorMessage, WarningMessage } from './messages';
import LoadingButton from './LoadingButton';
import { Box } from '@biom3/react';

interface BalanceProps {
  checkout: Checkout | undefined;
  provider: Web3Provider | undefined;
}

export default function GetBalance(props: BalanceProps) {
  const contractAddress = '0xF57e7e7C23978C3cAEC3C3548E3D615c346e79fF';

  const { provider, checkout } = props;

  const [resultBalance, setResultBalance] = useState<GetBalanceResult>();
  const [errorBalance, setErrorBalance] = useState<any>(null);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);

  const [resultNative, setResultNative] = useState<GetBalanceResult>();
  const [errorNative, setErrorNative] = useState<any>(null);
  const [loadingNative, setLoadingNative] = useState<boolean>(false);

  async function getNativeBalanceClick() {
    if (!checkout) {
      console.error('missing checkout, please connect frist');
      return;
    }
    if (!provider) {
      console.error('missing provider, please connect frist');
      return;
    }

    setErrorNative(null);
    setLoadingNative(true);

    const walletAddress = await provider.getSigner().getAddress();
    try {
      const resp = await checkout.getBalance({
        provider,
        walletAddress,
      });
      setResultNative(resp);
      setLoadingNative(false);
    } catch (err: any) {
      setErrorNative(err);
      setLoadingNative(false);
      console.log(err.message);
      console.log(err.type);
      console.log(err.data);
      console.log(err.stack);
    }
  }

  async function getERC20BalanceClick() {
    if (!checkout) {
      console.error('missing checkout, please connect frist');
      return;
    }
    if (!provider) {
      console.error('missing provider, please connect frist');
      return;
    }

    setErrorBalance(null);
    setLoadingBalance(true);

    const walletAddress = await provider.getSigner().getAddress();
    try {
      const resp = await checkout.getBalance({
        provider,
        walletAddress,
        contractAddress,
      });
      setResultBalance(resp);
      setLoadingBalance(false);
    } catch (err: any) {
      setErrorBalance(err);
      setLoadingBalance(false);
      console.log(err.message);
      console.log(err.type);
      console.log(err.data);
      console.log(err.stack);
    }
  }

  return (
    <div>
      <Box>
        {!provider && <WarningMessage>Not connected.</WarningMessage>}
        <Box
          sx={{
            marginTop: 'base.spacing.x4',
            display: 'flex',
            gap: 'base.spacing.x4',
          }}
        >
          <LoadingButton
            onClick={getNativeBalanceClick}
            loading={loadingNative}
          >
            Get Balance (Native)
          </LoadingButton>
          <LoadingButton
            onClick={getERC20BalanceClick}
            loading={loadingBalance}
          >
            Get Balance (ERC20)
          </LoadingButton>
        </Box>

        {resultNative && !errorNative && (
          <SuccessMessage>
            <Box>Balance: {resultNative.balance.toString()}</Box>
            <Box>Fromatted Balance: {resultNative.formattedBalance}</Box>
            <Box>Token Address: {resultNative.token.address}</Box>
            <Box>Token Symbol: {resultNative.token.symbol}</Box>
          </SuccessMessage>
        )}
        {errorNative && (
          <ErrorMessage>
            {errorNative.message}. Check console logs for more details.
          </ErrorMessage>
        )}

        {resultBalance && !errorBalance && (
          <SuccessMessage>
            <Box
              sx={{
                fontWeight: 'base.text.body.large.bold.fontWeight',
                marginBottom: 'base.spacing.x2',
              }}
            >
              Target token: {contractAddress}
            </Box>
            <Box>Balance: {resultBalance.balance.toString()}</Box>
            <Box>Fromatted Balance: {resultBalance.formattedBalance}</Box>
            <Box>Token Address: {resultBalance.token.address}</Box>
            <Box>Token Symbol: {resultBalance.token.symbol}</Box>
          </SuccessMessage>
        )}
        {errorBalance && (
          <ErrorMessage>
            {errorBalance.message}. Check console logs for more details.
          </ErrorMessage>
        )}
      </Box>
    </div>
  );
}