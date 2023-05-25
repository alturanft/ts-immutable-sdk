import { describe, it } from 'local-cypress';
import { mount } from 'cypress/react18';
import { onDarkBase } from '@biom3/design-tokens';
import { BiomeThemeProvider } from '@biom3/react';
import React from 'react';
import { cySmartGet } from '../../lib/testUtils';
import { StatusView } from './StatusView';
import { StatusType } from './StatusType';

describe('status view', () => {
  it('shows success text and button', () => {
    mount(
      <BiomeThemeProvider theme={{ base: onDarkBase }}>
        <StatusView
          actionText="Close"
          testId="status-view"
          onActionClick={() => {
            // eslint-disable-next-line no-console
            console.log('clicked!');
          }}
          statusType={StatusType.SUCCESS}
          statusText="Test success"
        />
      </BiomeThemeProvider>,
    );

    cySmartGet('status-view-container').should('be.visible');
    cySmartGet('status-view').should('be.visible');
    cySmartGet('success-box').should('be.visible');
    cySmartGet('success-icon').should('be.visible');
    cySmartGet('success-text').should('be.visible');
    cySmartGet('success-text').should('have.text', 'Test success');
    cySmartGet('status-action-button').should('be.visible');
    cySmartGet('status-action-button').should('have.text', 'Close');
    cySmartGet('footer-logo-container').should('be.visible');
  });

  it('shows failure text and button', () => {
    mount(
      <BiomeThemeProvider theme={{ base: onDarkBase }}>
        <StatusView
          actionText="Close"
          testId="status-view"
          onActionClick={() => {
            // eslint-disable-next-line no-console
            console.log('clicked!');
          }}
          statusType={StatusType.FAILURE}
          statusText="Test failure"
        />
      </BiomeThemeProvider>,
    );

    cySmartGet('status-view-container').should('be.visible');
    cySmartGet('status-view').should('be.visible');
    cySmartGet('failure-box').should('be.visible');
    cySmartGet('failure-icon').should('be.visible');
    cySmartGet('failure-text').should('be.visible');
    cySmartGet('failure-text').should('have.text', 'Test failure');
    cySmartGet('status-action-button').should('be.visible');
    cySmartGet('status-action-button').should('have.text', 'Close');
    cySmartGet('footer-logo-container').should('be.visible');
  });

  it('shows rejected text and button', () => {
    mount(
      <BiomeThemeProvider theme={{ base: onDarkBase }}>
        <StatusView
          actionText="Close"
          testId="status-view"
          onActionClick={() => {
            // eslint-disable-next-line no-console
            console.log('clicked!');
          }}
          statusType={StatusType.REJECTED}
          statusText="Test rejected"
        />
      </BiomeThemeProvider>,
    );

    cySmartGet('status-view-container').should('be.visible');
    cySmartGet('status-view').should('be.visible');
    cySmartGet('rejected-box').should('be.visible');
    cySmartGet('rejected-icon').should('be.visible');
    cySmartGet('rejected-text').should('be.visible');
    cySmartGet('rejected-text').should('have.text', 'Test rejected');
    cySmartGet('status-action-button').should('be.visible');
    cySmartGet('status-action-button').should('have.text', 'Close');
    cySmartGet('footer-logo-container').should('be.visible');
  });
});