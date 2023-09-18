import { BiomeCombinedProviders } from '@biom3/react';
import { BaseTokens, onDarkBase, onLightBase } from '@biom3/design-tokens';
import {
  useContext, useEffect, useMemo, useReducer, useState,
} from 'react';
import { IMTBLWidgetEvents } from '@imtbl/checkout-widgets';
import { Passport } from '@imtbl/passport';
import { IMX_ADDRESS_ZKEVM, NATIVE, WidgetTheme } from '../../lib';
import { StrongCheckoutWidgetsConfig } from '../../lib/withDefaultWidgetConfig';
import {
  SharedViews,
  ViewActions, ViewContext, initialViewState, viewReducer,
} from '../../context/view-context/ViewContext';
import {
  OnRampFailView,
  OnRampSuccessView,
  OnRampWidgetViews,
} from '../../context/view-context/OnRampViewContextTypes';
import { LoadingView } from '../../views/loading/LoadingView';
import { text } from '../../resources/text/textConfig';
import { ConnectLoaderContext } from '../../context/connect-loader-context/ConnectLoaderContext';
import { TopUpView } from '../../views/top-up/TopUpView';
import { sendOnRampFailedEvent, sendOnRampSuccessEvent, sendOnRampWidgetCloseEvent } from './OnRampWidgetEvents';
import { OnRampMain } from './views/OnRampMain';
import { StatusType } from '../../components/Status/StatusType';
import { StatusView } from '../../components/Status/StatusView';
import { EventTargetContext } from '../../context/event-target-context/EventTargetContext';
import { OrderInProgress } from './views/OrderInProgress';

export interface OnRampWidgetProps {
  // eslint-disable-next-line react/no-unused-prop-types
  params: OnRampWidgetParams;
  config: StrongCheckoutWidgetsConfig;
}

export interface OnRampWidgetParams {
  amount?: string;
  contractAddress?: string;
  passport?: Passport;
}

export function OnRampWidget(props: OnRampWidgetProps) {
  const { config, params } = props;
  const { passport, amount, contractAddress } = params;
  const {
    theme, isOnRampEnabled, isSwapEnabled, isBridgeEnabled,
  } = config;
  const [viewState, viewDispatch] = useReducer(viewReducer, initialViewState);
  const viewReducerValues = useMemo(() => ({ viewState, viewDispatch }), [viewState, viewReducer]);

  const { connectLoaderState } = useContext(ConnectLoaderContext);
  const { checkout, provider } = connectLoaderState;
  const [tokenAddress, setTokenAddress] = useState(contractAddress);

  const { eventTargetState: { eventTarget } } = useContext(EventTargetContext);

  const biomeTheme: BaseTokens = theme.toLowerCase() === WidgetTheme.LIGHT.toLowerCase()
    ? onLightBase
    : onDarkBase;

  const {
    initialLoadingText, IN_PROGRESS_LOADING, SUCCESS, FAIL,
  } = text.views[OnRampWidgetViews.ONRAMP];

  const showIframe = useMemo(
    () => viewState.view.type === OnRampWidgetViews.ONRAMP,
    [viewState.view.type],
  );

  useEffect(() => {
    if (!checkout || !provider) return;
    (async () => {
      const network = await checkout.getNetworkInfo({
        provider,
      });
      /* If the provider's network is not supported, return out of this and let the
    connect loader handle the switch network functionality */
      if (!network.isSupported) {
        return;
      }
      const tknAddr = contractAddress?.toLocaleUpperCase() === NATIVE
        ? IMX_ADDRESS_ZKEVM
        : contractAddress;

      setTokenAddress(tknAddr);
    })();
  }, [checkout, provider, viewDispatch]);

  return (
    <BiomeCombinedProviders theme={{ base: biomeTheme }}>
      <ViewContext.Provider value={viewReducerValues}>
        {viewState.view.type === SharedViews.LOADING_VIEW && (
          <LoadingView loadingText={initialLoadingText} showFooterLogo />
        )}
        {viewState.view.type === OnRampWidgetViews.IN_PROGRESS_LOADING && (
          <LoadingView loadingText={IN_PROGRESS_LOADING.loading.text} showFooterLogo />
        )}
        {viewState.view.type === OnRampWidgetViews.IN_PROGRESS && (
          <OrderInProgress />
        )}

        {viewState.view.type === OnRampWidgetViews.SUCCESS && (
          <StatusView
            statusText={SUCCESS.text}
            actionText={SUCCESS.actionText}
            onRenderEvent={() => sendOnRampSuccessEvent(
              eventTarget,
              (viewState.view as OnRampSuccessView).data.transactionHash,
            )}
            onActionClick={() => sendOnRampWidgetCloseEvent(eventTarget)}
            statusType={StatusType.SUCCESS}
            testId="success-view"
          />
        )}

        {viewState.view.type === OnRampWidgetViews.FAIL && (
          <StatusView
            statusText={FAIL.text}
            actionText={FAIL.actionText}
            onRenderEvent={() => sendOnRampFailedEvent(
              eventTarget,
              (viewState.view as OnRampFailView).reason
                  ?? 'Transaction failed',
            )}
            onActionClick={() => {
              viewDispatch({
                payload: {
                  type: ViewActions.UPDATE_VIEW,
                  view: {
                    type: OnRampWidgetViews.ONRAMP,
                    data: viewState.view.data,
                  },
                },
              });
            }}
            statusType={StatusType.FAILURE}
            onCloseClick={() => sendOnRampWidgetCloseEvent(eventTarget)}
            testId="fail-view"
          />
        )}

        {/* This keeps Transak's iframe instance in dom to listen to transak's events. */}
        {/* We will remove the iframe instance once the processing has been finalised, either as a success or a failure */}
        {(viewState.view.type !== OnRampWidgetViews.SUCCESS
        && viewState.view.type !== OnRampWidgetViews.FAIL
        ) && (
        <OnRampMain
          passport={passport}
          showIframe={showIframe}
          tokenAmount={viewState.view.data?.amount ?? amount}
          tokenAddress={
            viewState.view.data?.contractAddress ?? tokenAddress
          }
        />
        )}

        {viewState.view.type === SharedViews.TOP_UP_VIEW && (
          <TopUpView
            widgetEvent={IMTBLWidgetEvents.IMTBL_ONRAMP_WIDGET_EVENT}
            showOnrampOption={isOnRampEnabled}
            showSwapOption={isSwapEnabled}
            showBridgeOption={isBridgeEnabled}
            onCloseButtonClick={() => sendOnRampWidgetCloseEvent(eventTarget)}
          />
        )}
      </ViewContext.Provider>
    </BiomeCombinedProviders>
  );
}