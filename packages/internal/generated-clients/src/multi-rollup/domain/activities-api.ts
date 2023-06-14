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
import { ActivityType } from '../models';
// @ts-ignore
import { GetActivityResult } from '../models';
// @ts-ignore
import { ListActivitiesResult } from '../models';
/**
 * ActivitiesApi - axios parameter creator
 * @export
 */
export const ActivitiesApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Get a single activity by ID
         * @summary Get a single activity by ID
         * @param {string} chainName The name of chain
         * @param {string} activityId The id of activity
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getActivity: async (chainName: string, activityId: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'chainName' is not null or undefined
            assertParamExists('getActivity', 'chainName', chainName)
            // verify required parameter 'activityId' is not null or undefined
            assertParamExists('getActivity', 'activityId', activityId)
            const localVarPath = `/v1/chains/{chain_name}/activities/{activity_id}`
                .replace(`{${"chain_name"}}`, encodeURIComponent(String(chainName)))
                .replace(`{${"activity_id"}}`, encodeURIComponent(String(activityId)));
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
         * List all activities
         * @summary List all activities
         * @param {string} chainName The name of chain
         * @param {string} [contractAddress] The contract address of NFT or ERC20 Token
         * @param {string} [tokenId] An &#x60;uint256&#x60; token id as string
         * @param {string} [accountAddress] The account address activity contains
         * @param {ActivityType} [activityType] The activity type
         * @param {string} [fromIndexedAt] From indexed at including given date
         * @param {string} [toIndexedAt] To indexed at including given date
         * @param {string} [transactionHash] The transaction hash of activity
         * @param {string} [pageCursor] Encoded page cursor to retrieve previous or next page. Use the value returned in the response.
         * @param {number} [pageSize] Maximum number of items to return
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listActivities: async (chainName: string, contractAddress?: string, tokenId?: string, accountAddress?: string, activityType?: ActivityType, fromIndexedAt?: string, toIndexedAt?: string, transactionHash?: string, pageCursor?: string, pageSize?: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'chainName' is not null or undefined
            assertParamExists('listActivities', 'chainName', chainName)
            const localVarPath = `/v1/chains/{chain_name}/activities`
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

            if (contractAddress !== undefined) {
                localVarQueryParameter['contract_address'] = contractAddress;
            }

            if (tokenId !== undefined) {
                localVarQueryParameter['token_id'] = tokenId;
            }

            if (accountAddress !== undefined) {
                localVarQueryParameter['account_address'] = accountAddress;
            }

            if (activityType !== undefined) {
                localVarQueryParameter['activity_type'] = activityType;
            }

            if (fromIndexedAt !== undefined) {
                localVarQueryParameter['from_indexed_at'] = (fromIndexedAt as any instanceof Date) ?
                    (fromIndexedAt as any).toISOString() :
                    fromIndexedAt;
            }

            if (toIndexedAt !== undefined) {
                localVarQueryParameter['to_indexed_at'] = (toIndexedAt as any instanceof Date) ?
                    (toIndexedAt as any).toISOString() :
                    toIndexedAt;
            }

            if (transactionHash !== undefined) {
                localVarQueryParameter['transaction_hash'] = transactionHash;
            }

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
 * ActivitiesApi - functional programming interface
 * @export
 */
export const ActivitiesApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = ActivitiesApiAxiosParamCreator(configuration)
    return {
        /**
         * Get a single activity by ID
         * @summary Get a single activity by ID
         * @param {string} chainName The name of chain
         * @param {string} activityId The id of activity
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getActivity(chainName: string, activityId: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GetActivityResult>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getActivity(chainName, activityId, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * List all activities
         * @summary List all activities
         * @param {string} chainName The name of chain
         * @param {string} [contractAddress] The contract address of NFT or ERC20 Token
         * @param {string} [tokenId] An &#x60;uint256&#x60; token id as string
         * @param {string} [accountAddress] The account address activity contains
         * @param {ActivityType} [activityType] The activity type
         * @param {string} [fromIndexedAt] From indexed at including given date
         * @param {string} [toIndexedAt] To indexed at including given date
         * @param {string} [transactionHash] The transaction hash of activity
         * @param {string} [pageCursor] Encoded page cursor to retrieve previous or next page. Use the value returned in the response.
         * @param {number} [pageSize] Maximum number of items to return
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async listActivities(chainName: string, contractAddress?: string, tokenId?: string, accountAddress?: string, activityType?: ActivityType, fromIndexedAt?: string, toIndexedAt?: string, transactionHash?: string, pageCursor?: string, pageSize?: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ListActivitiesResult>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.listActivities(chainName, contractAddress, tokenId, accountAddress, activityType, fromIndexedAt, toIndexedAt, transactionHash, pageCursor, pageSize, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * ActivitiesApi - factory interface
 * @export
 */
export const ActivitiesApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = ActivitiesApiFp(configuration)
    return {
        /**
         * Get a single activity by ID
         * @summary Get a single activity by ID
         * @param {string} chainName The name of chain
         * @param {string} activityId The id of activity
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getActivity(chainName: string, activityId: string, options?: any): AxiosPromise<GetActivityResult> {
            return localVarFp.getActivity(chainName, activityId, options).then((request) => request(axios, basePath));
        },
        /**
         * List all activities
         * @summary List all activities
         * @param {string} chainName The name of chain
         * @param {string} [contractAddress] The contract address of NFT or ERC20 Token
         * @param {string} [tokenId] An &#x60;uint256&#x60; token id as string
         * @param {string} [accountAddress] The account address activity contains
         * @param {ActivityType} [activityType] The activity type
         * @param {string} [fromIndexedAt] From indexed at including given date
         * @param {string} [toIndexedAt] To indexed at including given date
         * @param {string} [transactionHash] The transaction hash of activity
         * @param {string} [pageCursor] Encoded page cursor to retrieve previous or next page. Use the value returned in the response.
         * @param {number} [pageSize] Maximum number of items to return
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listActivities(chainName: string, contractAddress?: string, tokenId?: string, accountAddress?: string, activityType?: ActivityType, fromIndexedAt?: string, toIndexedAt?: string, transactionHash?: string, pageCursor?: string, pageSize?: number, options?: any): AxiosPromise<ListActivitiesResult> {
            return localVarFp.listActivities(chainName, contractAddress, tokenId, accountAddress, activityType, fromIndexedAt, toIndexedAt, transactionHash, pageCursor, pageSize, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for getActivity operation in ActivitiesApi.
 * @export
 * @interface ActivitiesApiGetActivityRequest
 */
export interface ActivitiesApiGetActivityRequest {
    /**
     * The name of chain
     * @type {string}
     * @memberof ActivitiesApiGetActivity
     */
    readonly chainName: string

    /**
     * The id of activity
     * @type {string}
     * @memberof ActivitiesApiGetActivity
     */
    readonly activityId: string
}

/**
 * Request parameters for listActivities operation in ActivitiesApi.
 * @export
 * @interface ActivitiesApiListActivitiesRequest
 */
export interface ActivitiesApiListActivitiesRequest {
    /**
     * The name of chain
     * @type {string}
     * @memberof ActivitiesApiListActivities
     */
    readonly chainName: string

    /**
     * The contract address of NFT or ERC20 Token
     * @type {string}
     * @memberof ActivitiesApiListActivities
     */
    readonly contractAddress?: string

    /**
     * An &#x60;uint256&#x60; token id as string
     * @type {string}
     * @memberof ActivitiesApiListActivities
     */
    readonly tokenId?: string

    /**
     * The account address activity contains
     * @type {string}
     * @memberof ActivitiesApiListActivities
     */
    readonly accountAddress?: string

    /**
     * The activity type
     * @type {ActivityType}
     * @memberof ActivitiesApiListActivities
     */
    readonly activityType?: ActivityType

    /**
     * From indexed at including given date
     * @type {string}
     * @memberof ActivitiesApiListActivities
     */
    readonly fromIndexedAt?: string

    /**
     * To indexed at including given date
     * @type {string}
     * @memberof ActivitiesApiListActivities
     */
    readonly toIndexedAt?: string

    /**
     * The transaction hash of activity
     * @type {string}
     * @memberof ActivitiesApiListActivities
     */
    readonly transactionHash?: string

    /**
     * Encoded page cursor to retrieve previous or next page. Use the value returned in the response.
     * @type {string}
     * @memberof ActivitiesApiListActivities
     */
    readonly pageCursor?: string

    /**
     * Maximum number of items to return
     * @type {number}
     * @memberof ActivitiesApiListActivities
     */
    readonly pageSize?: number
}

/**
 * ActivitiesApi - object-oriented interface
 * @export
 * @class ActivitiesApi
 * @extends {BaseAPI}
 */
export class ActivitiesApi extends BaseAPI {
    /**
     * Get a single activity by ID
     * @summary Get a single activity by ID
     * @param {ActivitiesApiGetActivityRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ActivitiesApi
     */
    public getActivity(requestParameters: ActivitiesApiGetActivityRequest, options?: AxiosRequestConfig) {
        return ActivitiesApiFp(this.configuration).getActivity(requestParameters.chainName, requestParameters.activityId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * List all activities
     * @summary List all activities
     * @param {ActivitiesApiListActivitiesRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ActivitiesApi
     */
    public listActivities(requestParameters: ActivitiesApiListActivitiesRequest, options?: AxiosRequestConfig) {
        return ActivitiesApiFp(this.configuration).listActivities(requestParameters.chainName, requestParameters.contractAddress, requestParameters.tokenId, requestParameters.accountAddress, requestParameters.activityType, requestParameters.fromIndexedAt, requestParameters.toIndexedAt, requestParameters.transactionHash, requestParameters.pageCursor, requestParameters.pageSize, options).then((request) => request(this.axios, this.basePath));
    }
}