/* tslint:disable */
/* eslint-disable */
/**
 * Immutable X API
 * Immutable Multi Rollup API
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: support@immutable.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import globalAxios, { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
// @ts-ignore
import { APIError400 } from '../models';
// @ts-ignore
import { APIError404 } from '../models';
// @ts-ignore
import { APIError500 } from '../models';
// @ts-ignore
import { ListNFTOwnersResult } from '../models';
/**
 * NftOwnersApi - axios parameter creator
 * @export
 */
export const NftOwnersApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * List NFT owners by token ID
         * @summary List NFT owners by token ID
         * @param {string} contractAddress The address of contract
         * @param {string} tokenId An &#x60;uint256&#x60; token id as string
         * @param {string} chainName The name of chain
         * @param {string} [pageCursor] Base64 encoded page cursor to retrieve previous or next page. Use the value returned in the response.
         * @param {number} [pageSize] Maximum number of items to return
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listNFTOwners: async (contractAddress: string, tokenId: string, chainName: string, pageCursor?: string, pageSize?: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'contractAddress' is not null or undefined
            assertParamExists('listNFTOwners', 'contractAddress', contractAddress)
            // verify required parameter 'tokenId' is not null or undefined
            assertParamExists('listNFTOwners', 'tokenId', tokenId)
            // verify required parameter 'chainName' is not null or undefined
            assertParamExists('listNFTOwners', 'chainName', chainName)
            const localVarPath = `/v1/chains/{chain_name}/collections/{contract_address}/nfts/{token_id}/owners`
                .replace(`{${"contract_address"}}`, encodeURIComponent(String(contractAddress)))
                .replace(`{${"token_id"}}`, encodeURIComponent(String(tokenId)))
                .replace(`{${"chain_name"}}`, encodeURIComponent(String(chainName)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (pageCursor !== undefined) {
                localVarQueryParameter['page_cursor'] = pageCursor;
            }

            if (pageSize !== undefined) {
                localVarQueryParameter['page_size'] = pageSize;
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
 * NftOwnersApi - functional programming interface
 * @export
 */
export const NftOwnersApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = NftOwnersApiAxiosParamCreator(configuration)
    return {
        /**
         * List NFT owners by token ID
         * @summary List NFT owners by token ID
         * @param {string} contractAddress The address of contract
         * @param {string} tokenId An &#x60;uint256&#x60; token id as string
         * @param {string} chainName The name of chain
         * @param {string} [pageCursor] Base64 encoded page cursor to retrieve previous or next page. Use the value returned in the response.
         * @param {number} [pageSize] Maximum number of items to return
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async listNFTOwners(contractAddress: string, tokenId: string, chainName: string, pageCursor?: string, pageSize?: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ListNFTOwnersResult>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.listNFTOwners(contractAddress, tokenId, chainName, pageCursor, pageSize, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * NftOwnersApi - factory interface
 * @export
 */
export const NftOwnersApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = NftOwnersApiFp(configuration)
    return {
        /**
         * List NFT owners by token ID
         * @summary List NFT owners by token ID
         * @param {string} contractAddress The address of contract
         * @param {string} tokenId An &#x60;uint256&#x60; token id as string
         * @param {string} chainName The name of chain
         * @param {string} [pageCursor] Base64 encoded page cursor to retrieve previous or next page. Use the value returned in the response.
         * @param {number} [pageSize] Maximum number of items to return
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listNFTOwners(contractAddress: string, tokenId: string, chainName: string, pageCursor?: string, pageSize?: number, options?: any): AxiosPromise<ListNFTOwnersResult> {
            return localVarFp.listNFTOwners(contractAddress, tokenId, chainName, pageCursor, pageSize, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for listNFTOwners operation in NftOwnersApi.
 * @export
 * @interface NftOwnersApiListNFTOwnersRequest
 */
export interface NftOwnersApiListNFTOwnersRequest {
    /**
     * The address of contract
     * @type {string}
     * @memberof NftOwnersApiListNFTOwners
     */
    readonly contractAddress: string

    /**
     * An &#x60;uint256&#x60; token id as string
     * @type {string}
     * @memberof NftOwnersApiListNFTOwners
     */
    readonly tokenId: string

    /**
     * The name of chain
     * @type {string}
     * @memberof NftOwnersApiListNFTOwners
     */
    readonly chainName: string

    /**
     * Base64 encoded page cursor to retrieve previous or next page. Use the value returned in the response.
     * @type {string}
     * @memberof NftOwnersApiListNFTOwners
     */
    readonly pageCursor?: string

    /**
     * Maximum number of items to return
     * @type {number}
     * @memberof NftOwnersApiListNFTOwners
     */
    readonly pageSize?: number
}

/**
 * NftOwnersApi - object-oriented interface
 * @export
 * @class NftOwnersApi
 * @extends {BaseAPI}
 */
export class NftOwnersApi extends BaseAPI {
    /**
     * List NFT owners by token ID
     * @summary List NFT owners by token ID
     * @param {NftOwnersApiListNFTOwnersRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NftOwnersApi
     */
    public listNFTOwners(requestParameters: NftOwnersApiListNFTOwnersRequest, options?: AxiosRequestConfig) {
        return NftOwnersApiFp(this.configuration).listNFTOwners(requestParameters.contractAddress, requestParameters.tokenId, requestParameters.chainName, requestParameters.pageCursor, requestParameters.pageSize, options).then((request) => request(this.axios, this.basePath));
    }
}