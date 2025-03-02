/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Article {
  /**
   * Unique identifier for the article
   * @format uuid
   */
  id: string;
  /** Title of the article */
  title: string;
  /** Content of the article */
  content: string;
  /** Author of the article */
  author: string;
  /** Tags associated with the article */
  tags?: string[];
  /**
   * Creation timestamp
   * @format date-time
   */
  createdAt: string;
  /**
   * Last update timestamp
   * @format date-time
   */
  updatedAt: string;
}

export interface CreateArticleDto {
  /** Title of the article */
  title: string;
  /** Content of the article */
  content: string;
  /** Author of the article */
  author: string;
  /** Tags associated with the article */
  tags?: string[];
}

export interface UpdateArticleDto {
  /** Title of the article */
  title?: string;
  /** Content of the article */
  content?: string;
  /** Author of the article */
  author?: string;
  /** Tags associated with the article */
  tags?: string[];
}

export namespace Api {
  /**
   * @description Returns a list of all articles in the system
   * @tags Articles
   * @name ArticlesList
   * @summary Retrieve all articles
   * @request GET:/api/articles
   * @response `200` `(Article)[]` A list of articles
   */
  export namespace ArticlesList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Article[];
  }

  /**
 * @description Creates a new article and returns the created article data
 * @tags Articles
 * @name ArticlesCreate
 * @summary Create a new article
 * @request POST:/api/articles
 * @response `201` `Article` Article created successfully
 * @response `400` `{
    message?: string,

}` Invalid request body
*/
  export namespace ArticlesCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateArticleDto;
    export type RequestHeaders = {};
    export type ResponseBody = Article;
  }

  /**
 * @description Returns a single article by its ID
 * @tags Articles
 * @name ArticlesDetail
 * @summary Get article by ID
 * @request GET:/api/articles/{id}
 * @response `200` `Article` Article details
 * @response `404` `{
  \** @example "Article not found" *\
    message?: string,

}` Article not found
*/
  export namespace ArticlesDetail {
    export type RequestParams = {
      /** The article ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Article;
  }

  /**
 * @description Updates an article by ID and returns the updated article
 * @tags Articles
 * @name ArticlesUpdate
 * @summary Update an existing article
 * @request PUT:/api/articles/{id}
 * @response `200` `Article` Article updated successfully
 * @response `404` `{
  \** @example "Article not found" *\
    message?: string,

}` Article not found
*/
  export namespace ArticlesUpdate {
    export type RequestParams = {
      /** The article ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateArticleDto;
    export type RequestHeaders = {};
    export type ResponseBody = Article;
  }

  /**
 * @description Deletes an article by ID
 * @tags Articles
 * @name ArticlesDelete
 * @summary Delete an article
 * @request DELETE:/api/articles/{id}
 * @response `204` `void` Article deleted successfully (no content)
 * @response `404` `{
  \** @example "Article not found" *\
    message?: string,

}` Article not found
*/
  export namespace ArticlesDelete {
    export type RequestParams = {
      /** The article ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = 'http://localhost:3333';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string') ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== 'string' ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Articles-Manager API
 * @version 1.0.0
 * @baseUrl http://localhost:3333
 *
 * API for managing articles
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Returns a list of all articles in the system
     *
     * @tags Articles
     * @name ArticlesList
     * @summary Retrieve all articles
     * @request GET:/api/articles
     * @response `200` `(Article)[]` A list of articles
     */
    articlesList: (params: RequestParams = {}) =>
      this.request<Article[], any>({
        path: `/api/articles`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
 * @description Creates a new article and returns the created article data
 *
 * @tags Articles
 * @name ArticlesCreate
 * @summary Create a new article
 * @request POST:/api/articles
 * @response `201` `Article` Article created successfully
 * @response `400` `{
    message?: string,

}` Invalid request body
 */
    articlesCreate: (data: CreateArticleDto, params: RequestParams = {}) =>
      this.request<
        Article,
        {
          message?: string;
        }
      >({
        path: `/api/articles`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
 * @description Returns a single article by its ID
 *
 * @tags Articles
 * @name ArticlesDetail
 * @summary Get article by ID
 * @request GET:/api/articles/{id}
 * @response `200` `Article` Article details
 * @response `404` `{
  \** @example "Article not found" *\
    message?: string,

}` Article not found
 */
    articlesDetail: (id: string, params: RequestParams = {}) =>
      this.request<
        Article,
        {
          /** @example "Article not found" */
          message?: string;
        }
      >({
        path: `/api/articles/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
 * @description Updates an article by ID and returns the updated article
 *
 * @tags Articles
 * @name ArticlesUpdate
 * @summary Update an existing article
 * @request PUT:/api/articles/{id}
 * @response `200` `Article` Article updated successfully
 * @response `404` `{
  \** @example "Article not found" *\
    message?: string,

}` Article not found
 */
    articlesUpdate: (id: string, data: UpdateArticleDto, params: RequestParams = {}) =>
      this.request<
        Article,
        {
          /** @example "Article not found" */
          message?: string;
        }
      >({
        path: `/api/articles/${id}`,
        method: 'PUT',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
 * @description Deletes an article by ID
 *
 * @tags Articles
 * @name ArticlesDelete
 * @summary Delete an article
 * @request DELETE:/api/articles/{id}
 * @response `204` `void` Article deleted successfully (no content)
 * @response `404` `{
  \** @example "Article not found" *\
    message?: string,

}` Article not found
 */
    articlesDelete: (id: string, params: RequestParams = {}) =>
      this.request<
        void,
        {
          /** @example "Article not found" */
          message?: string;
        }
      >({
        path: `/api/articles/${id}`,
        method: 'DELETE',
        ...params,
      }),
  };
}
