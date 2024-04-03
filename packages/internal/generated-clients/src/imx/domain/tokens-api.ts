/* tslint:disable */
/* eslint-disable */
/**
 * Immutable X API
 * Immutable X API
 *
 * The version of the OpenAPI document: 3.0
 * Contact: support@immutable.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from '../configuration';
import type { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
// @ts-ignore
import { ListTokensResponse } from '../models';
// @ts-ignore
import { TokenDetails } from '../models';
/**
 * TokensApi - axios parameter creator
 * @export
 */
export const TokensApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Get details of a token
         * @summary Get details of a token
         * @param {string} address Token Contract Address
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getToken: async (address: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'address' is not null or undefined
            assertParamExists('getToken', 'address', address)
            const localVarPath = `/v1/tokens/{address}`
                .replace(`{${"address"}}`, encodeURIComponent(String(address)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Get a list of tokens
         * @summary Get a list of tokens
         * @param {number} [pageSize] Page size of the result
         * @param {string} [cursor] Cursor
         * @param {ListTokensOrderByEnum} [orderBy] Property to sort by
         * @param {string} [direction] Direction to sort (asc/desc)
         * @param {string} [address] Contract address of the token
         * @param {string} [symbols] Token symbols for the token, e.g. ?symbols&#x3D;IMX,ETH
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listTokens: async (pageSize?: number, cursor?: string, orderBy?: ListTokensOrderByEnum, direction?: string, address?: string, symbols?: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/v1/tokens`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (pageSize !== undefined) {
                localVarQueryParameter['page_size'] = pageSize;
            }

            if (cursor !== undefined) {
                localVarQueryParameter['cursor'] = cursor;
            }

            if (orderBy !== undefined) {
                localVarQueryParameter['order_by'] = orderBy;
            }

            if (direction !== undefined) {
                localVarQueryParameter['direction'] = direction;
            }

            if (address !== undefined) {
                localVarQueryParameter['address'] = address;
            }

            if (symbols !== undefined) {
                localVarQueryParameter['symbols'] = symbols;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * TokensApi - functional programming interface
 * @export
 */
export const TokensApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = TokensApiAxiosParamCreator(configuration)
    return {
        /**
         * Get details of a token
         * @summary Get details of a token
         * @param {string} address Token Contract Address
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getToken(address: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<TokenDetails>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getToken(address, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Get a list of tokens
         * @summary Get a list of tokens
         * @param {number} [pageSize] Page size of the result
         * @param {string} [cursor] Cursor
         * @param {ListTokensOrderByEnum} [orderBy] Property to sort by
         * @param {string} [direction] Direction to sort (asc/desc)
         * @param {string} [address] Contract address of the token
         * @param {string} [symbols] Token symbols for the token, e.g. ?symbols&#x3D;IMX,ETH
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async listTokens(pageSize?: number, cursor?: string, orderBy?: ListTokensOrderByEnum, direction?: string, address?: string, symbols?: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ListTokensResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.listTokens(pageSize, cursor, orderBy, direction, address, symbols, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * TokensApi - factory interface
 * @export
 */
export const TokensApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = TokensApiFp(configuration)
    return {
        /**
         * Get details of a token
         * @summary Get details of a token
         * @param {TokensApiGetTokenRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getToken(requestParameters: TokensApiGetTokenRequest, options?: AxiosRequestConfig): AxiosPromise<TokenDetails> {
            return localVarFp.getToken(requestParameters.address, options).then((request) => request(axios, basePath));
        },
        /**
         * Get a list of tokens
         * @summary Get a list of tokens
         * @param {TokensApiListTokensRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listTokens(requestParameters: TokensApiListTokensRequest = {}, options?: AxiosRequestConfig): AxiosPromise<ListTokensResponse> {
            return localVarFp.listTokens(requestParameters.pageSize, requestParameters.cursor, requestParameters.orderBy, requestParameters.direction, requestParameters.address, requestParameters.symbols, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for getToken operation in TokensApi.
 * @export
 * @interface TokensApiGetTokenRequest
 */
export interface TokensApiGetTokenRequest {
    /**
     * Token Contract Address
     * @type {string}
     * @memberof TokensApiGetToken
     */
    readonly address: string
}

/**
 * Request parameters for listTokens operation in TokensApi.
 * @export
 * @interface TokensApiListTokensRequest
 */
export interface TokensApiListTokensRequest {
    /**
     * Page size of the result
     * @type {number}
     * @memberof TokensApiListTokens
     */
    readonly pageSize?: number

    /**
     * Cursor
     * @type {string}
     * @memberof TokensApiListTokens
     */
    readonly cursor?: string

    /**
     * Property to sort by
     * @type {'contract_address' | 'name' | 'symbol'}
     * @memberof TokensApiListTokens
     */
    readonly orderBy?: ListTokensOrderByEnum

    /**
     * Direction to sort (asc/desc)
     * @type {string}
     * @memberof TokensApiListTokens
     */
    readonly direction?: string

    /**
     * Contract address of the token
     * @type {string}
     * @memberof TokensApiListTokens
     */
    readonly address?: string

    /**
     * Token symbols for the token, e.g. ?symbols&#x3D;IMX,ETH
     * @type {string}
     * @memberof TokensApiListTokens
     */
    readonly symbols?: string
}

/**
 * TokensApi - object-oriented interface
 * @export
 * @class TokensApi
 * @extends {BaseAPI}
 */
export class TokensApi extends BaseAPI {
    /**
     * Get details of a token
     * @summary Get details of a token
     * @param {TokensApiGetTokenRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TokensApi
     */
    public getToken(requestParameters: TokensApiGetTokenRequest, options?: AxiosRequestConfig) {
        return TokensApiFp(this.configuration).getToken(requestParameters.address, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Get a list of tokens
     * @summary Get a list of tokens
     * @param {TokensApiListTokensRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TokensApi
     */
    public listTokens(requestParameters: TokensApiListTokensRequest = {}, options?: AxiosRequestConfig) {
        return TokensApiFp(this.configuration).listTokens(requestParameters.pageSize, requestParameters.cursor, requestParameters.orderBy, requestParameters.direction, requestParameters.address, requestParameters.symbols, options).then((request) => request(this.axios, this.basePath));
    }
}

/**
 * @export
 */
export const ListTokensOrderByEnum = {
    ContractAddress: 'contract_address',
    Name: 'name',
    Symbol: 'symbol'
} as const;
export type ListTokensOrderByEnum = typeof ListTokensOrderByEnum[keyof typeof ListTokensOrderByEnum];
