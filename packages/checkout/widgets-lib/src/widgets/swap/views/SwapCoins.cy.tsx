import {
  describe, it, cy, beforeEach,
} from 'local-cypress';
import { mount } from 'cypress/react18';
import { BigNumber } from 'ethers';
import { cySmartGet } from '../../../lib/testUtils';
import { SwapWidgetTestComponent } from '../test-components/SwapWidgetTestComponent';
import { SwapCoins } from './SwapCoins';
import { SwapState } from '../context/swap-context/SwapContext';

describe('SwapCoins tests', () => {
  beforeEach(() => {
    cy.viewport('ipad-2');
  });

  beforeEach(() => {
    const initialSwapState: SwapState = {
      checkout: null,
      provider: null,
      providerPreference: null,
      network: null,
      tokenBalances: [
        {
          balance: BigNumber.from('10000000000000'),
          formattedBalance: '0.1',
          token: {
            name: 'IMX',
            symbol: 'IMX',
            decimals: 18,
            address: '0xF57e7e7C23978C3cAEC3C3548E3D615c346e79fF',
          },
        },
      ],
      supportedTopUps: null,
      allowedTokens: [
        {
          name: 'Ethereum',
          symbol: 'ETH',
          decimals: 18,
          address: '',
        },
        {
          name: 'IMX',
          symbol: 'IMX',
          decimals: 18,
          address: '0xF57e7e7C23978C3cAEC3C3548E3D615c346e79fF',
        },
      ],
    };

    mount(
      <SwapWidgetTestComponent initialStateOverride={initialSwapState}>
        <SwapCoins />
      </SwapWidgetTestComponent>,
    );
  });

  it('should only allow valid number up to 6 decimal places in from field', () => {
    cySmartGet('fromTokenInputs-text__input').focus().type('1234567');
    cySmartGet('fromTokenInputs-text__input').should('have.value', '1234567');
    cySmartGet('fromTokenInputs-text__input').clear();
    cySmartGet('fromTokenInputs-text__input').focus().type('12.123e4');
    cySmartGet('fromTokenInputs-text__input').should('have.value', '12.1234');
    cySmartGet('fromTokenInputs-text__input').clear();
    cySmartGet('fromTokenInputs-text__input').focus().type('12.1234567');
    cySmartGet('fromTokenInputs-text__input').should('have.value', '12.123456');
  });

  it('should only allow valid number up to 6 decimal places in to field', () => {
    cySmartGet('toTokenInputs-text__input').focus().type('1234567');
    cySmartGet('toTokenInputs-text__input').should('have.value', '1234567');
    cySmartGet('toTokenInputs-text__input').clear();

    cySmartGet('toTokenInputs-text__input').focus().type('12.123e4');
    cySmartGet('toTokenInputs-text__input').should('have.value', '12.1234');
    cySmartGet('toTokenInputs-text__input').clear();

    cySmartGet('toTokenInputs-text__input').focus().type('12.1234567');
    cySmartGet('toTokenInputs-text__input').should('have.value', '12.123456');
  });

  it('should show token balances list in from select', () => {
    cySmartGet('fromTokenInputs-select__target').click();
    cySmartGet('fromTokenInputs-select-IMX-IMX').should('be.visible');
    cySmartGet('fromTokenInputs-select-ETH-Ethereum').should('not.exist');
    cySmartGet('fromTokenInputs-select-IMX-IMX').click();
    cySmartGet('fromTokenInputs-select__target')
      .find('span')
      .should('have.text', 'IMX');
  });

  it('should show allowed tokens list in to select', () => {
    cySmartGet('toTokenInputs-select__target').click();
    cySmartGet('toTokenInputs-select-ETH-Ethereum').should('be.visible');
    cySmartGet('toTokenInputs-select-IMX-IMX').should('be.visible');
    cySmartGet('toTokenInputs-select-ETH-Ethereum').click();
    cySmartGet('toTokenInputs-select__target')
      .find('span')
      .should('have.text', 'ETH');
    cySmartGet('toTokenInputs-select-IMX-IMX').should('not.exist');
  });
});