import React, {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';
import { Config, ImmutableX } from '@imtbl/core-sdk';
import {
  Environment,
  ImmutableConfiguration,
  ImmutableXClient,
  Networks,
  Passport,
  PassportModuleConfiguration,
} from '@imtbl/sdk';
import {
  audience,
  logoutRedirectUri,
  redirectUri,
  scope,
} from '@/config';
import { EnvironmentNames } from '@/types';
import useLocalStorage from '@/hooks/useLocalStorage';

const getCoreSdkConfig = (environment: EnvironmentNames) => {
  switch (environment) {
    case EnvironmentNames.PRODUCTION: {
      return Config.PRODUCTION;
    }
    case EnvironmentNames.SANDBOX: {
      return Config.SANDBOX;
    }
    case EnvironmentNames.DEV: {
      return Config.createConfig({
        basePath: 'https://api.dev.x.immutable.com',
        chainID: 5,
        coreContractAddress: '0xd05323731807A35599BF9798a1DE15e89d6D6eF1',
        registrationContractAddress: '0x7EB840223a3b1E0e8D54bF8A6cd83df5AFfC88B2',
      });
    }
    default: {
      throw new Error('Invalid environment');
    }
  }
};

const getPassportConfig = (environment: EnvironmentNames): PassportModuleConfiguration => {
  const sharedConfigurationValues = {
    scope,
    audience,
    redirectUri,
    logoutRedirectUri,
  };

  switch (environment) {
    case EnvironmentNames.PRODUCTION: {
      return {
        baseConfig: new ImmutableConfiguration({
          environment: Environment.PRODUCTION,
        }),
        clientId: 'PtQRK4iRJ8GkXjiz6xfImMAYhPhW0cYk',
        ...sharedConfigurationValues,
      };
    }
    case EnvironmentNames.SANDBOX: {
      return {
        baseConfig: new ImmutableConfiguration({
          environment: Environment.SANDBOX,
        }),
        clientId: 'mjtCL8mt06BtbxSkp2vbrYStKWnXVZfo',
        ...sharedConfigurationValues,
      };
    }
    case EnvironmentNames.DEV: {
      const baseConfig = new ImmutableConfiguration({
        environment: Environment.SANDBOX,
      });
      return {
        baseConfig,
        clientId: 'pCtSnHovRnPiQuBcFkXAnbCNqNVcDM3m',
        overrides: {
          network: Networks.SANDBOX,
          authenticationDomain: 'https://auth.dev.immutable.com',
          magicPublishableApiKey: 'pk_live_4058236363130CA9',
          magicProviderId: 'C9odf7hU4EQ5EufcfgYfcBaT5V6LhocXyiPRhIjw2EY=',
          passportDomain: 'https://passport.dev.immutable.com',
          imxPublicApiDomain: 'https://api.dev.immutable.com',
          immutableXClient: new ImmutableXClient({
            baseConfig,
            overrides: {
              immutableXConfig: getCoreSdkConfig(EnvironmentNames.DEV),
            },
          }),
        },
        ...sharedConfigurationValues,
      };
    }
    default: {
      throw new Error('Invalid environment');
    }
  }
};

const ImmutableContext = createContext<{
  passportClient?: Passport,
  coreSdkClient: ImmutableX,
  environment: EnvironmentNames,
  setEnvironment?:(environment: EnvironmentNames) => void;
}>({
      coreSdkClient: new ImmutableX(getCoreSdkConfig(EnvironmentNames.DEV)),
      environment: EnvironmentNames.DEV,
    });

export function ImmutableProvider({
  children,
}: { children: JSX.Element | JSX.Element[] }) {
  const [environment, setEnvironment] = useLocalStorage(
    'IMX_PASSPORT_SAMPLE_ENVIRONMENT',
    useContext(ImmutableContext).environment,
  );
  const [coreSdkClient, setCoreSdkClient] = useState<ImmutableX>(
    useContext(ImmutableContext).coreSdkClient,
  );
  const [passportClient, setPassportClient] = useState<Passport>();

  useEffect(() => {
    setCoreSdkClient(new ImmutableX(getCoreSdkConfig(environment)));
    setPassportClient(new Passport(getPassportConfig(environment)));
  }, [environment]);

  const providerValues = useMemo(() => ({
    coreSdkClient,
    passportClient,
    environment,
    setEnvironment,
  }), [coreSdkClient, passportClient, environment, setEnvironment]);

  return (
    <ImmutableContext.Provider value={providerValues}>
      {children}
    </ImmutableContext.Provider>
  );
}

export function useImmutableProvider() {
  const {
    coreSdkClient, passportClient, environment, setEnvironment,
  } = useContext(ImmutableContext);
  return {
    coreSdkClient, passportClient, environment, setEnvironment,
  };
}