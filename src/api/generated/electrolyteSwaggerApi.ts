/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface HandlerAuthResponse {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
}

export interface HandlerLoginRequest {
  login: string;
  password: string;
}

export interface HandlerRegisterRequest {
  login: string;
  password: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "//localhost:8080/api",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Electrolyte Concentration API
 * @version 1.0
 * @license MIT (https://opensource.org/licenses/MIT)
 * @termsOfService http://swagger.io/terms/
 * @baseUrl //localhost:8080/api
 * @contact API Support <support@example.com> (http://www.example.com/support)
 *
 * API for calculating ion concentration in electrolyte mixtures.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  cart = {
    /**
     * @description Adds a electrolyte to the current user's draft calculation
     *
     * @tags Cart
     * @name ItemsCreate
     * @summary Add electrolyte to cart
     * @request POST:/cart/items
     * @secure
     */
    itemsCreate: (request: object, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/cart/items`,
        method: "POST",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates volume and comment of a cart item
     *
     * @tags Cart
     * @name ItemsUpdate
     * @summary Update cart item
     * @request PUT:/cart/items/{id}
     * @secure
     */
    itemsUpdate: (id: number, request: object, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/cart/items/${id}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Removes item from cart
     *
     * @tags Cart
     * @name ItemsDelete
     * @summary Delete cart item
     * @request DELETE:/cart/items/{id}
     * @secure
     */
    itemsDelete: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/cart/items/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  concentrations = {
    /**
     * @description Returns list of user's concentrations (draft and deleted excluded)
     *
     * @tags Concentrations
     * @name ConcentrationsList
     * @summary Get user's concentrations
     * @request GET:/concentrations
     * @secure
     */
    concentrationsList: (
      query?: {
        /** Filter by status */
        status?: string;
        /** Filter by date from (YYYY-MM-DD) */
        from?: string;
        /** Filter by date to (YYYY-MM-DD) */
        to?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/concentrations`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns all concentrations from all users (draft and deleted excluded)
     *
     * @tags Concentrations
     * @name GetConcentrations
     * @summary Get all concentrations (moderator only)
     * @request GET:/concentrations/all
     * @secure
     */
    getConcentrations: (
      query?: {
        /** Filter by status */
        status?: string;
        /** Filter by date from (YYYY-MM-DD) */
        from?: string;
        /** Filter by date to (YYYY-MM-DD) */
        to?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/concentrations/all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns detailed information about a specific concentration with its items
     *
     * @tags Concentrations
     * @name ConcentrationsDetail
     * @summary Get concentration by ID
     * @request GET:/concentrations/{id}
     * @secure
     */
    concentrationsDetail: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/concentrations/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates result and description fields of a concentration
     *
     * @tags Concentrations
     * @name ConcentrationsUpdate
     * @summary Update concentration
     * @request PUT:/concentrations/{id}
     * @secure
     */
    concentrationsUpdate: (
      id: number,
      request: object,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/concentrations/${id}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Changes status to deleted (logical deletion)
     *
     * @tags Concentrations
     * @name ConcentrationsDelete
     * @summary Delete concentration (soft delete)
     * @request DELETE:/concentrations/{id}
     * @secure
     */
    concentrationsDelete: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/concentrations/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Changes status to finished, sets moderator and finish date
     *
     * @tags Concentrations
     * @name FinishUpdate
     * @summary Finish concentration (moderator action)
     * @request PUT:/concentrations/{id}/finish
     * @secure
     */
    finishUpdate: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/concentrations/${id}/finish`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Changes status from draft to formed and calculates result
     *
     * @tags Concentrations
     * @name FormedUpdate
     * @summary Form concentration (user action)
     * @request PUT:/concentrations/{id}/formed
     * @secure
     */
    formedUpdate: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/concentrations/${id}/formed`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Changes status to rejected, sets moderator and finish date
     *
     * @tags Concentrations
     * @name RejectUpdate
     * @summary Reject concentration (moderator action)
     * @request PUT:/concentrations/{id}/reject
     * @secure
     */
    rejectUpdate: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/concentrations/${id}/reject`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  electrolytes = {
    /**
     * @description Returns all electrolytes (public access)
     *
     * @tags Electrolytes
     * @name ElectrolytesList
     * @summary Get list of electrolytes
     * @request GET:/electrolytes
     */
    electrolytesList: (
      query?: {
        /** Search by name */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, any>({
        path: `/electrolytes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns detailed information about a specific electrolyte
     *
     * @tags Electrolytes
     * @name ElectrolytesDetail
     * @summary Get electrolyte by ID
     * @request GET:/electrolytes/{id}
     */
    electrolytesDetail: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/electrolytes/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  login = {
    /**
     * @description Authenticates user and returns JWT token
     *
     * @tags Auth
     * @name LoginCreate
     * @summary Login user
     * @request POST:/login
     */
    loginCreate: (request: HandlerLoginRequest, params: RequestParams = {}) =>
      this.request<HandlerAuthResponse, Record<string, any>>({
        path: `/login`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  logout = {
    /**
     * @description Adds current JWT token to blacklist
     *
     * @tags Auth
     * @name LogoutCreate
     * @summary Logout user
     * @request POST:/logout
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  register = {
    /**
     * @description Creates a new user account
     *
     * @tags Auth
     * @name RegisterCreate
     * @summary Register a new user
     * @request POST:/register
     */
    registerCreate: (
      request: HandlerRegisterRequest,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/register`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
