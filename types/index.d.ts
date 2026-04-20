// TypeScript Type Declarations for APIBridge AI v18
// Type definitions for api-bridge-ai 18.0.0

export = ApiBridgeAI;
export as namespace ApiBridgeAI;

declare namespace ApiBridgeAI {
  // ─── Main API ────────────────────────────────────────────────────────────

  /**
   * Wrap an Axios instance with APIBridge transformation.
   */
  function bridge(axiosInstance: any, options?: BridgeOptions): any;

  /**
   * Wrap native fetch with APIBridge transformation, retry, caching, and middleware.
   */
  function bridgeFetch(options?: BridgeFetchOptions): BridgeFetchInstance;

  /**
   * Transform any object directly without an HTTP client.
   */
  function transform(data: Record<string, any>, options?: TransformOptions): Record<string, any>;

  /**
   * Create a reusable transformer instance.
   */
  function createTransformer(options?: TransformOptions): APIBridgeTransformer;

  /**
   * Create a new API client instance (v9+).
   */
  function createClient(options?: ClientOptions): APIBridgeClient;

  /**
   * Alias for createClient (Axios-compatible).
   */
  function create(options?: ClientOptions): APIBridgeClient;

  /**
   * Execute multiple requests concurrently (like axios.all).
   */
  function all<T>(promises: Promise<T>[]): Promise<T[]>;

  /**
   * Spread the results of concurrent requests (like axios.spread).
   */
  function spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R;

  /**
   * Check if an error is a ClientError (like axios.isAxiosError).
   */
  function isClientError(err: any): boolean;

  /**
   * Alias for isClientError.
   */
  function isApiBridgeError(err: any): boolean;

  /**
   * Check if a value is a Cancel (cancellation reason).
   */
  function isCancel(value: any): boolean;

  /**
   * Check if a value is a CancelToken.
   */
  function isCancelToken(value: any): boolean;

  /**
   * Convert a plain object to FormData.
   */
  function toFormData(obj: Record<string, any>, formData?: FormData, parentKey?: string): FormData;

  /**
   * Convert an object to URL-encoded form (URLSearchParams).
   */
  function toURLEncodedForm(data: Record<string, any> | URLSearchParams): URLSearchParams;

  /**
   * Convert FormData entries back to a plain JSON object.
   */
  function formToJSON(formData: any): Record<string, any>;

  /** Check if a value is FormData. */
  function isFormData(value: any): boolean;
  /** Check if a value is a Blob. */
  function isBlob(value: any): boolean;
  /** Check if a value is a File. */
  function isFile(value: any): boolean;
  /** Check if a value is a Buffer. */
  function isBuffer(value: any): boolean;
  /** Check if a value is a Stream. */
  function isStream(value: any): boolean;
  /** Check if a value is an ArrayBuffer or typed array. */
  function isArrayBufferView(value: any): boolean;
  /** Check if a value is URLSearchParams. */
  function isURLSearchParams(value: any): boolean;
  /** Check if a value is a typed array. */
  function isTypedArray(value: any): boolean;
  /** Check if a value is a FileList. */
  function isFileList(value: any): boolean;

  /**
   * Build a full URL from base + path + params.
   */
  function buildURL(baseURL: string, path: string, params?: Record<string, any>, paramsSerializer?: ParamsSerializerConfig | ((params: any) => string)): string;

  /**
   * Deep merge two config objects.
   */
  function mergeConfig(target: Record<string, any>, source: Record<string, any>): Record<string, any>;

  /**
   * Default params serializer.
   */
  function defaultParamsSerializer(params: Record<string, any>, options?: { encode?: (value: string) => string }): string;

  /**
   * Resolve a paramsSerializer config into a serializer function (v15).
   * Supports function, { serialize, encode } object, or null.
   */
  function resolveParamsSerializer(serializer: ParamsSerializerConfig | ((params: any) => string) | null): ((params: any) => string) | null;

  /**
   * Params serializer configuration object (v15).
   */
  interface ParamsSerializerConfig {
    serialize?: (params: any, options?: any) => string;
    encode?: (value: string) => string;
  }

  // ─── v16 Security Interfaces ──────────────────────────────────────────

  interface SSRFGuardOptions {
    enabled?: boolean;
    allowlist?: string[];
    blocklist?: string[];
  }

  interface HeaderValidatorOptions {
    maxHeadersCount?: number;
    maxHeaderSize?: number;
  }

  interface RateLimiterOptions {
    maxRequests?: number;
    windowMs?: number;
  }

  interface ResponseSizeGuardOptions {
    maxResponseSize?: number;
  }

  interface SensitiveDataRedactorOptions {
    sensitiveHeaders?: string[];
  }

  interface RequestJourney {
    attempts: Array<{ attempt: number; status: number; duration: number }>;
    cacheHit: boolean;
    deduplicated: boolean;
    tokenRefreshed: boolean;
    redirects: number;
    startTime: number;
    endTime?: number;
    totalDuration?: number;
  }

  interface SizeTracker {
    total: number;
    add(bytes: number): void;
  }

  // ─── v17 Advanced Security Interfaces ───────────────────────────────────

  interface ContentSecurityPolicyOptions {
    defaultSrc?: string[];
    scriptSrc?: string[];
    styleSrc?: string[];
    imgSrc?: string[];
    connectSrc?: string[];
    fontSrc?: string[];
    objectSrc?: string[];
    frameSrc?: string[];
    baseUri?: string[];
    formAction?: string[];
    reportUri?: string | null;
    reportOnly?: boolean;
    customDirectives?: Record<string, string[]>;
  }

  interface CertificatePinningOptions {
    pins?: Array<{ host: string; sha256: string[] }>;
    enforceMode?: 'enforce' | 'report';
    maxAge?: number;
    includeSubdomains?: boolean;
  }

  interface CertPinVerifyResult {
    valid: boolean;
    host: string;
    enforced: boolean;
  }

  interface RequestSigningOptions {
    secret?: string;
    algorithm?: string;
    headerName?: string;
    signedHeaders?: string[];
    timestampTolerance?: number;
  }

  interface SignResult {
    signature: string;
    timestamp: number;
    signedHeaders: string[];
  }

  interface VerifyResult {
    valid: boolean;
    reason?: string;
  }

  interface InputSanitizerOptions {
    mode?: 'escape' | 'strip' | 'reject';
    maxDepth?: number;
    maxStringLength?: number;
    allowHTML?: boolean;
    customPatterns?: RegExp[];
  }

  interface ThreatDetection {
    type: string;
    value: string;
    path: string;
  }

  interface SecurityAuditLoggerOptions {
    maxEntries?: number;
    onAlert?: (entry: AuditLogEntry) => void;
    hashAlgorithm?: string;
  }

  interface AuditLogEntry {
    id: number;
    timestamp: number;
    event: string;
    severity: 'info' | 'warn' | 'error' | 'critical';
    details: Record<string, any>;
    hash: string;
  }

  interface AuditLogStats {
    total: number;
    bySeverity: Record<string, number>;
    lastEntry: AuditLogEntry | null;
  }

  interface AuditVerifyResult {
    valid: boolean;
    entries: number;
    brokenAt?: number;
  }

  interface PermissionPolicyOptions {
    policies?: Array<{ role: string; methods: string[]; endpoints: string[] }>;
    defaultAllow?: boolean;
    caseSensitive?: boolean;
  }

  interface PermissionCheckResult {
    allowed: boolean;
    role: string;
    method: string;
    endpoint: string;
    matchedPolicy?: object;
  }

  interface PermissionCheckMultipleResult {
    allowed: boolean;
    matchedRole?: string;
  }

  interface PayloadEncryptorOptions {
    key?: Buffer | string | null;
    algorithm?: string;
    ivLength?: number;
    tagLength?: number;
    encoding?: BufferEncoding;
  }

  interface EncryptResult {
    encrypted: string;
    iv: string;
    tag: string;
  }

  interface IdempotencyManagerOptions {
    headerName?: string;
    ttl?: number;
    maxEntries?: number;
    methods?: string[];
  }

  // ─── v18: Elite Security Option Interfaces ──────────────────────────────

  interface ZeroTrustEngineOptions {
    defaultTrustScore?: number;
    trustThreshold?: number;
    maxTrustScore?: number;
    decayRate?: number;
    decayIntervalMs?: number;
  }

  interface ThreatIntelligenceOptions {
    blockedIPs?: string[];
    blockedPatterns?: (string | RegExp)[];
    suspiciousThreshold?: number;
    autoBlock?: boolean;
  }

  interface SecureSessionManagerOptions {
    tokenLength?: number;
    maxAge?: number;
    rotationInterval?: number;
    maxSessions?: number;
    bindToIP?: boolean;
    bindToUserAgent?: boolean;
  }

  interface RequestIntegrityChainOptions {
    algorithm?: string;
    maxChainLength?: number;
  }

  interface AdaptiveRateLimiterOptions {
    baseRate?: number;
    windowMs?: number;
    burstMultiplier?: number;
    anomalyThreshold?: number;
    adaptationRate?: number;
    minRate?: number;
    maxRate?: number;
  }

  interface SecurityHeadersManagerOptions {
    hsts?: { maxAge?: number; includeSubDomains?: boolean; preload?: boolean };
    xFrameOptions?: string;
    xContentTypeOptions?: boolean;
    referrerPolicy?: string;
    permissionsPolicy?: Record<string, string[]>;
    crossOriginEmbedderPolicy?: string;
    crossOriginOpenerPolicy?: string;
    crossOriginResourcePolicy?: string;
    xDNSPrefetchControl?: boolean;
    xDownloadOptions?: boolean;
    xPermittedCrossDomainPolicies?: string;
    customHeaders?: Record<string, string>;
  }

  interface EncryptedConfigVaultOptions {
    masterKey?: string;
    algorithm?: string;
    ivLength?: number;
    tagLength?: number;
  }

  interface MutualTLSManagerOptions {
    trustedCerts?: string[];
    requireClientCert?: boolean;
    allowExpired?: boolean;
    maxCertAge?: number;
    revocationList?: string[];
  }

  interface ZeroTrustEvaluation {
    allowed: boolean;
    score: number;
    factors: string[];
  }

  interface ThreatAssessment {
    threat: boolean;
    level: 'none' | 'low' | 'medium' | 'high' | 'critical';
    reasons: string[];
    blocked: boolean;
  }

  interface SessionInfo {
    token: string;
    expiresAt: number;
  }

  interface SessionValidation {
    valid: boolean;
    reason?: string;
    needsRotation: boolean;
  }

  interface IntegrityEntry {
    hash: string;
    previousHash: string;
    request: { method: string; url: string; timestamp: number; bodyHash: string };
    index: number;
  }

  interface IntegrityVerification {
    valid: boolean;
    brokenAt?: number;
    chainLength: number;
  }

  interface AdaptiveAcquireResult {
    allowed: boolean;
    remaining: number;
    anomaly: boolean;
    currentRate: number;
  }

  interface AdaptiveStats {
    currentRate: number;
    meanRate: number;
    stdDev: number;
    anomalyDetected: boolean;
    requestCount: number;
  }

  interface SecurityValidation {
    secure: boolean;
    warnings: string[];
    score: number;
  }

  interface CertValidation {
    valid: boolean;
    reason?: string;
    trusted: boolean;
  }

  // ─── v11: VERSION ────────────────────────────────────────────────────────

  /**
   * Library version string.
   */
  const VERSION: string;

  // ─── v11: AxiosHeaders ─────────────────────────────────────────────────

  /**
   * Normalize a header name to Title-Case-Dashes format.
   */
  function normalizeHeaderName(name: string): string;

  /**
   * Case-insensitive header management class (like Axios's AxiosHeaders).
   */
  class AxiosHeaders {
    constructor(init?: Record<string, string> | AxiosHeaders | Array<[string, string]>);

    set(name: string, value: string | string[] | null, rewrite?: boolean): AxiosHeaders;
    get(name: string, asParsed?: boolean): string | null;
    has(name: string): boolean;
    delete(name: string): boolean;
    clear(): AxiosHeaders;
    forEach(callback: (value: string, name: string, headers: AxiosHeaders) => void, thisArg?: any): void;
    keys(): string[];
    values(): string[];
    entries(): Array<[string, string]>;
    readonly size: number;
    normalize(asFormat?: boolean): AxiosHeaders;
    merge(other: Record<string, string> | AxiosHeaders, rewrite?: boolean): AxiosHeaders;
    toJSON(filter?: boolean | string[] | RegExp): Record<string, string>;
    toString(): string;
    [Symbol.iterator](): Iterator<[string, string]>;

    // Common header accessors
    getContentType(): string | null;
    setContentType(value: string, rewrite?: boolean): AxiosHeaders;
    hasContentType(): boolean;
    getContentLength(): string | null;
    setContentLength(value: string, rewrite?: boolean): AxiosHeaders;
    hasContentLength(): boolean;
    getAccept(): string | null;
    setAccept(value: string, rewrite?: boolean): AxiosHeaders;
    hasAccept(): boolean;
    getAuthorization(): string | null;
    setAuthorization(value: string, rewrite?: boolean): AxiosHeaders;
    hasAuthorization(): boolean;

    // v15: Additional header accessors
    getUserAgent(): string | null;
    setUserAgent(value: string, rewrite?: boolean): AxiosHeaders;
    hasUserAgent(): boolean;
    getContentEncoding(): string | null;
    setContentEncoding(value: string, rewrite?: boolean): AxiosHeaders;
    hasContentEncoding(): boolean;
    getContentDisposition(): string | null;
    setContentDisposition(value: string, rewrite?: boolean): AxiosHeaders;
    hasContentDisposition(): boolean;

    static from(entries: any): AxiosHeaders;
    static concat(...sources: Array<Record<string, string> | AxiosHeaders>): AxiosHeaders;
    static accessor(name: string): typeof AxiosHeaders;
    /** Parse raw HTTP header string into AxiosHeaders (v15). */
    static fromString(headerStr: string | null): AxiosHeaders;
  }

  // ─── v11: HttpStatusCode ───────────────────────────────────────────────

  /**
   * HTTP status code enum (like Axios's HttpStatusCode).
   */
  const HttpStatusCode: {
    readonly Continue: 100;
    readonly SwitchingProtocols: 101;
    readonly Processing: 102;
    readonly EarlyHints: 103;
    readonly Ok: 200;
    readonly Created: 201;
    readonly Accepted: 202;
    readonly NonAuthoritativeInformation: 203;
    readonly NoContent: 204;
    readonly ResetContent: 205;
    readonly PartialContent: 206;
    readonly MultiStatus: 207;
    readonly AlreadyReported: 208;
    readonly ImUsed: 226;
    readonly MultipleChoices: 300;
    readonly MovedPermanently: 301;
    readonly Found: 302;
    readonly SeeOther: 303;
    readonly NotModified: 304;
    readonly UseProxy: 305;
    readonly TemporaryRedirect: 307;
    readonly PermanentRedirect: 308;
    readonly BadRequest: 400;
    readonly Unauthorized: 401;
    readonly PaymentRequired: 402;
    readonly Forbidden: 403;
    readonly NotFound: 404;
    readonly MethodNotAllowed: 405;
    readonly NotAcceptable: 406;
    readonly ProxyAuthenticationRequired: 407;
    readonly RequestTimeout: 408;
    readonly Conflict: 409;
    readonly Gone: 410;
    readonly LengthRequired: 411;
    readonly PreconditionFailed: 412;
    readonly PayloadTooLarge: 413;
    readonly UriTooLong: 414;
    readonly UnsupportedMediaType: 415;
    readonly RangeNotSatisfiable: 416;
    readonly ExpectationFailed: 417;
    readonly ImATeapot: 418;
    readonly MisdirectedRequest: 421;
    readonly UnprocessableEntity: 422;
    readonly Locked: 423;
    readonly FailedDependency: 424;
    readonly TooEarly: 425;
    readonly UpgradeRequired: 426;
    readonly PreconditionRequired: 428;
    readonly TooManyRequests: 429;
    readonly RequestHeaderFieldsTooLarge: 431;
    readonly UnavailableForLegalReasons: 451;
    readonly InternalServerError: 500;
    readonly NotImplemented: 501;
    readonly BadGateway: 502;
    readonly ServiceUnavailable: 503;
    readonly GatewayTimeout: 504;
    readonly HttpVersionNotSupported: 505;
    readonly VariantAlsoNegotiates: 506;
    readonly InsufficientStorage: 507;
    readonly LoopDetected: 508;
    readonly NotExtended: 510;
    readonly NetworkAuthenticationRequired: 511;
  };

  // ─── v11: Adapter System ───────────────────────────────────────────────

  type AdapterConfig = object;
  type AdapterResponse = { data: any; rawData: any; status: number; statusText: string; headers: Record<string, string> | AxiosHeaders; request?: any };
  type AdapterFunction = (config: AdapterConfig) => Promise<AdapterResponse>;

  /**
   * Fetch adapter (uses native fetch API).
   */
  function fetchAdapter(config: AdapterConfig): Promise<AdapterResponse>;

  /**
   * XHR adapter (uses XMLHttpRequest).
   */
  function xhrAdapter(config: AdapterConfig): Promise<AdapterResponse>;

  /**
   * Known adapter registry.
   */
  const adapters: Record<string, AdapterFunction>;

  /**
   * Get an adapter by name, function, or priority list.
   */
  function getAdapter(adapterConfig?: string | AdapterFunction | string[]): AdapterFunction;

  // ─── v11: URL Utilities ────────────────────────────────────────────────

  /**
   * Check if a URL is absolute.
   */
  function isAbsoluteURL(url: string): boolean;

  /**
   * Combine a base URL and a relative URL.
   */
  function combineURLs(baseURL: string, relativeURL: string): string;

  /**
   * Check if two URLs share the same origin.
   */
  function isURLSameOrigin(requestURL: string, currentOrigin?: string): boolean;

  /**
   * Parse a URL into components.
   */
  function parseURL(url: string): {
    protocol: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
    origin: string;
  } | null;

  // ─── v11: Type Helpers ─────────────────────────────────────────────────

  function kindOf(thing: any): string;
  function isPlainObject(val: any): boolean;
  function isObject(thing: any): boolean;
  function isFunction(val: any): boolean;
  function isString(val: any): boolean;
  function isNumber(val: any): boolean;
  function isBoolean(val: any): boolean;
  function isUndefined(val: any): boolean;
  function isDate(val: any): boolean;
  function isRegExp(val: any): boolean;
  function isHTMLForm(val: any): boolean;
  function isArrayBuffer(val: any): boolean;
  function isSpecCompliantForm(thing: any): boolean;
  function isBrowser(): boolean;
  function isNode(): boolean;

  // ─── v11: Utility Helpers ──────────────────────────────────────────────

  function forEach(obj: any, fn: (value: any, key: string | number, obj: any) => void, allOwnKeys?: boolean): void;
  function merge(...args: object[]): object;
  function extend(a: object, b: object, thisArg?: any, allOwnKeys?: boolean): object;
  function stripBOM(content: string): string;
  function findKey(obj: object, key: string): string | undefined;
  function freezeDeep(obj: object): object;
  function generateUID(size?: number): string;

  // ─── v11 Client Options ─────────────────────────────────────────────────

  interface ClientOptions {
    baseURL?: string;
    headers?: Record<string, string>;
    timeout?: number;
    retries?: number;
    retryDelay?: number;
    schema?: Record<string, string>;
    proxyMode?: boolean;
    autoAlign?: boolean;
    autoCoerce?: boolean;
    debug?: boolean;
    retryableStatuses?: Set<number>;
    auth?: { username: string; password: string };
    responseType?: 'json' | 'text' | 'blob' | 'arraybuffer' | 'stream';
    validateStatus?: (status: number) => boolean;
    paramsSerializer?: (params: any) => string;
    maxContentLength?: number;
    maxBodyLength?: number;
    transformRequest?: Array<(data: any, headers?: Record<string, string>) => any>;
    transformResponse?: Array<(data: any) => any>;
    responseEncoding?: string;
    maxRedirects?: number;
    decompress?: boolean;
    xsrfCookieName?: string;
    xsrfHeaderName?: string;
    withCredentials?: boolean;
    fuzzyMatcher?: any;
    typeCoercer?: any;
    // v11 options
    adapter?: string | AdapterFunction | string[];
    proxy?: { host: string; port: number; auth?: { username: string; password: string }; protocol?: string } | null;
    httpAgent?: any;
    httpsAgent?: any;
    socketPath?: string;
    formSerializer?: { indexes?: boolean; dots?: boolean; metaTokens?: boolean } | null;
    env?: { FormData?: any };
    signal?: AbortSignal;
    // v12 options
    transitional?: {
      silentJSONParsing?: boolean;
      forcedJSONParsing?: boolean;
      clarifyTimeoutError?: boolean;
    };
    // v13 options
    maxRate?: number | [number, number] | null;
    lookup?: ((hostname: string, options?: any, callback?: Function) => void) | null;
    // v14 options
    retryConfig?: RetryConfig | null;
    cache?: CacheConfig | null;
    dedupe?: DedupeConfig | null;
    tokenRefresh?: TokenRefreshConfig | null;
    timing?: boolean;
    hooks?: LifecycleHooks | null;
    // v15 options
    /** Auto-generate request correlation ID header. `true` for 'x-request-id', or a custom header name string. */
    requestId?: boolean | string;
    /** Callback before redirect requests are followed. */
    beforeRedirect?: (options: any, responseDetails: { headers: Record<string, string>; status: number; location: string }) => void;
    /** Auto Content-Type serialization. When true (default), auto-converts body based on Content-Type. */
    autoContentType?: boolean;
    /** Params serializer — function or { encode, serialize } object (v15). */
    paramsSerializer?: ParamsSerializerConfig | ((params: any) => string);
    // v16 options
    /** SSRF guard options. Default: { enabled: true }. */
    ssrf?: SSRFGuardOptions;
    /** Header validation options. */
    headerValidation?: HeaderValidatorOptions;
    /** Client-side rate limiting options. */
    rateLimiter?: RateLimiterOptions | null;
    /** Response size guard options. */
    responseSizeGuard?: ResponseSizeGuardOptions;
    /** Sensitive data redactor options. */
    redactor?: SensitiveDataRedactorOptions;
    /** Replay detection window in milliseconds (0 = disabled). */
    replayDetection?: number;
    /** Enable request journey tracking. */
    journeyTracking?: boolean;
    // v17 options
    /** Content Security Policy options. */
    csp?: ContentSecurityPolicyOptions | null;
    /** Certificate pinning options. */
    certPinning?: CertificatePinningOptions | null;
    /** Request signing options (HMAC). */
    requestSigning?: RequestSigningOptions | null;
    /** Input sanitizer options (XSS/injection prevention). */
    inputSanitizer?: InputSanitizerOptions | null;
    /** Security audit log options. */
    auditLog?: SecurityAuditLoggerOptions | null;
    /** Permission policy (RBAC) options. */
    permissions?: PermissionPolicyOptions | null;
    /** Payload encryption options (AES-256-GCM). */
    encryption?: PayloadEncryptorOptions | null;
    /** Idempotency options. */
    idempotency?: IdempotencyManagerOptions | null;
    // v18 options
    /** Zero Trust Engine options. */
    zeroTrust?: ZeroTrustEngineOptions | null;
    /** Threat Intelligence options. */
    threatIntel?: ThreatIntelligenceOptions | null;
    /** Secure Session Manager options. */
    sessionManager?: SecureSessionManagerOptions | null;
    /** Request Integrity Chain options. */
    integrityChain?: RequestIntegrityChainOptions | null;
    /** Adaptive Rate Limiter options. */
    adaptiveRateLimiter?: AdaptiveRateLimiterOptions | null;
    /** Security Headers Manager options. */
    securityHeaders?: SecurityHeadersManagerOptions | null;
    /** Encrypted Config Vault options. */
    configVault?: EncryptedConfigVaultOptions | null;
    /** Mutual TLS Manager options. */
    mtls?: MutualTLSManagerOptions | null;
  }

  // ─── v14 Configuration Interfaces ──────────────────────────────────────

  interface RetryConfig {
    retries?: number;
    retryCondition?: (error: ClientError) => boolean;
    retryDelay?: (retryCount: number, error: ClientError) => number;
    shouldResetTimeout?: boolean;
    onRetry?: (retryCount: number, error: ClientError, config: ClientRequestConfig) => void;
  }

  interface CacheConfig {
    ttl?: number;
    maxSize?: number;
    methods?: string[];
    keyGenerator?: (config: ClientRequestConfig) => string;
    exclude?: string[];
    staleWhileRevalidate?: boolean;
  }

  interface DedupeConfig {
    enabled?: boolean;
    methods?: string[];
    keyGenerator?: (config: ClientRequestConfig) => string;
  }

  interface TokenRefreshConfig {
    onRefresh: () => Promise<string>;
    statusCodes?: number[];
    maxRetries?: number;
    headerName?: string;
    tokenPrefix?: string;
  }

  interface LifecycleHooks {
    onRequest?: Array<(config: ClientRequestConfig) => void> | ((config: ClientRequestConfig) => void);
    onResponse?: Array<(response: ClientResponse) => void> | ((response: ClientResponse) => void);
    onError?: Array<(error: ClientError) => void> | ((error: ClientError) => void);
    onRetry?: Array<(retryCount: number, error: ClientError, config: ClientRequestConfig) => void> | ((retryCount: number, error: ClientError, config: ClientRequestConfig) => void);
  }

  interface ResponseTiming {
    start: number;
    end: number;
    duration: number;
  }

  interface ClientRequestConfig {
    method?: string;
    url?: string;
    baseURL?: string;
    headers?: Record<string, string>;
    params?: Record<string, any>;
    data?: any;
    body?: any;
    timeout?: number;
    signal?: AbortSignal;
    retries?: number;
    auth?: { username: string; password: string };
    responseType?: 'json' | 'text' | 'blob' | 'arraybuffer' | 'stream';
    validateStatus?: (status: number) => boolean;
    paramsSerializer?: (params: any) => string;
    maxContentLength?: number;
    maxBodyLength?: number;
    transformRequest?: Array<(data: any, headers?: Record<string, string>) => any>;
    transformResponse?: Array<(data: any) => any>;
    cancelToken?: CancelToken;
    onDownloadProgress?: (progressEvent: ProgressEvent) => void;
    onUploadProgress?: (progressEvent: ProgressEvent) => void;
    withCredentials?: boolean;
    expect?: Record<string, string | Record<string, any>>;
    // v11 options
    adapter?: string | AdapterFunction | string[];
    proxy?: { host: string; port: number; auth?: { username: string; password: string }; protocol?: string } | null;
    httpAgent?: any;
    httpsAgent?: any;
    socketPath?: string;
    formSerializer?: { indexes?: boolean; dots?: boolean; metaTokens?: boolean } | null;
    env?: { FormData?: any };
    // v14 options
    retryConfig?: RetryConfig | null;
    // v15 options
    /** Per-request beforeRedirect callback. */
    beforeRedirect?: (options: any, responseDetails: { headers: Record<string, string>; status: number; location: string }) => void;
    /** Per-request requestId override. */
    requestId?: boolean | string;
  }

  interface ClientResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: AxiosHeaders;
    config: ClientRequestConfig;
    request: any;
    raw?: any;
    // v14 timing (when timing: true)
    duration?: number;
    timing?: ResponseTiming;
    journey?: RequestJourney;
  }

  interface ProgressEvent {
    loaded: number;
    total: number;
    progress: number;
    bytes: number;
  }

  interface ClientDefaults {
    baseURL: string;
    timeout: number;
    headers: {
      common: Record<string, string>;
      get: Record<string, string>;
      post: Record<string, string>;
      put: Record<string, string>;
      patch: Record<string, string>;
      delete: Record<string, string>;
      head: Record<string, string>;
      options: Record<string, string>;
    };
    responseType: string;
    validateStatus: (status: number) => boolean;
    paramsSerializer: ((params: any) => string) | null;
    maxContentLength: number;
    maxBodyLength: number;
    transformRequest: Array<Function>;
    transformResponse: Array<Function>;
    xsrfCookieName: string;
    xsrfHeaderName: string;
    withCredentials: boolean;
    auth: { username: string; password: string } | null;
    // v11 defaults
    adapter: string | AdapterFunction | string[] | null;
    proxy: { host: string; port: number; auth?: { username: string; password: string }; protocol?: string } | null;
    httpAgent: any;
    httpsAgent: any;
    socketPath: string | null;
    formSerializer: { indexes?: boolean; dots?: boolean; metaTokens?: boolean } | null;
    env: { FormData?: any };
    maxRedirects: number;
    decompress: boolean;
    responseEncoding: string;
    // v12 defaults
    transitional: {
      silentJSONParsing: boolean;
      forcedJSONParsing: boolean;
      clarifyTimeoutError: boolean;
    };
    signal: AbortSignal | null;
    // v13 defaults
    maxRate: number | [number, number] | null;
    lookup: ((hostname: string, options?: any, callback?: Function) => void) | null;
    // v14 defaults
    retryConfig: RetryConfig | null;
    cache: CacheConfig | null;
    dedupe: DedupeConfig | null;
    tokenRefresh: TokenRefreshConfig | null;
    timing: boolean;
    hooks: LifecycleHooks | null;
  }

  // ─── v11 Client Class ──────────────────────────────────────────────────

  class APIBridgeClient {
    constructor(options?: ClientOptions);
    baseURL: string;
    defaultHeaders: Record<string, string>;
    timeout: number;
    retries: number;
    retryDelay: number;
    proxyMode: boolean;
    autoAlign: boolean;
    autoCoerce: boolean;
    auth: { username: string; password: string } | null;
    responseType: string;
    validateStatus: (status: number) => boolean;
    paramsSerializer: ((params: any) => string) | null;
    maxContentLength: number;
    maxBodyLength: number;
    transformRequest: Array<Function>;
    transformResponse: Array<Function>;
    withCredentials: boolean;
    xsrfCookieName: string;
    xsrfHeaderName: string;
    defaults: ClientDefaults;
    transformer: APIBridgeTransformer;
    learning: LearningEngine;
    fuzzyMatcher: FuzzyMatcher;
    typeCoercer: TypeCoercer;
    interceptors: InterceptorManager;
    // v11 properties
    adapter: string | AdapterFunction | string[] | null;
    proxy: { host: string; port: number; auth?: { username: string; password: string }; protocol?: string } | null;
    httpAgent: any;
    httpsAgent: any;
    socketPath: string | null;
    formSerializer: { indexes?: boolean; dots?: boolean; metaTokens?: boolean } | null;
    env: { FormData?: any };
    signal: AbortSignal | null;
    // v12 property
    transitional: { silentJSONParsing: boolean; forcedJSONParsing: boolean; clarifyTimeoutError: boolean };
    // v13 properties
    maxRate: number | [number, number] | null;
    lookup: ((hostname: string, options?: any, callback?: Function) => void) | null;
    // v14 properties
    retryConfig: RetryConfig | null;
    cache: CacheConfig | null;
    dedupe: DedupeConfig | null;
    tokenRefresh: TokenRefreshConfig | null;
    timing: boolean;
    hooks: LifecycleHooks | null;

    get<T = any>(url: string, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
    post<T = any>(url: string, body?: any, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
    put<T = any>(url: string, body?: any, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
    patch<T = any>(url: string, body?: any, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
    delete<T = any>(url: string, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
    head<T = any>(url: string, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
    options<T = any>(url: string, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
    request<T = any>(config: ClientRequestConfig): Promise<ClientResponse<T>>;
    request<T = any>(method: string, url: string, body?: any, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
    // v11 form methods
    postForm<T = any>(url: string, data?: any, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
    putForm<T = any>(url: string, data?: any, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
    patchForm<T = any>(url: string, data?: any, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
    getUri(config?: ClientRequestConfig): string;
    setSchema(schema: Record<string, string>): void;
    enableDebug(enabled: boolean): void;
    enableProxy(enabled: boolean): void;
    getStats(): any;
    clearCache(): void;
    clearResponseCache(): void;
    reset(): void;
    _coerceValue(value: any, targetType: string): any;
    _coerceToExpect(data: any, expectMap: Map<string, string>): any;
    _wrapError(err: Error, reqConfig: any, response?: any): ClientError;

    static isClientError(err: any): boolean;
    static isApiBridgeError(err: any): boolean;
  }

  class ClientError extends ApiBridgeError {
    constructor(message: string, details?: {
      status?: number;
      code?: string;
      details?: any;
      config?: ClientRequestConfig;
      response?: { data: any; status: number; statusText: string; headers: Record<string, string>; config?: ClientRequestConfig } | null;
      request?: any;
    });
    status: number | null;
    code: string;
    details: any;
    config: ClientRequestConfig | null;
    response: { data: any; status: number; statusText: string; headers: AxiosHeaders | Record<string, string>; config?: ClientRequestConfig } | null;
    request: any;
    isApiBridgeError: boolean;
    isAxiosError: boolean;
    toJSON(): { message: string; name: string; status: number | null; code: string; details: any; config: any };

    static from(error: Error, code?: string, config?: ClientRequestConfig, request?: any, response?: any): ClientError;

    // v12: Error code constants
    static readonly ERR_FR_TOO_MANY_REDIRECTS: string;
    static readonly ERR_BAD_OPTION_VALUE: string;
    static readonly ERR_BAD_OPTION: string;
    static readonly ERR_NETWORK: string;
    static readonly ERR_DEPRECATED: string;
    static readonly ERR_BAD_RESPONSE: string;
    static readonly ERR_BAD_REQUEST: string;
    static readonly ERR_CANCELED: string;
    static readonly ERR_NOT_SUPPORT: string;
    static readonly ERR_INVALID_URL: string;
    static readonly ECONNABORTED: string;
    static readonly ETIMEDOUT: string;
    static readonly ERR_TIMEOUT: string;
    static readonly ERR_MAX_BODY_LENGTH_EXCEEDED: string;
    static readonly ERR_MAX_CONTENT_LENGTH_EXCEEDED: string;
    static readonly ERR_ABORTED: string;
    static readonly ERR_SSRF_BLOCKED: string;
    static readonly ERR_HEADER_VALIDATION: string;
    static readonly ERR_RATE_LIMITED: string;
    static readonly ERR_DUPLICATE_REQUEST: string;
    static readonly ERR_RESPONSE_TOO_LARGE: string;
    // v17: Advanced security error codes
    static readonly ERR_CSP_VIOLATION: string;
    static readonly ERR_CERT_PIN_FAILED: string;
    static readonly ERR_SIGNATURE_INVALID: string;
    static readonly ERR_INPUT_REJECTED: string;
    static readonly ERR_PERMISSION_DENIED: string;
    static readonly ERR_ENCRYPTION_FAILED: string;
    static readonly ERR_DECRYPTION_FAILED: string;
    static readonly ERR_IDEMPOTENCY_CONFLICT: string;
    // v18: Elite security error codes
    static readonly ERR_ZERO_TRUST_DENIED: string;
    static readonly ERR_THREAT_DETECTED: string;
    static readonly ERR_SESSION_INVALID: string;
    static readonly ERR_INTEGRITY_VIOLATION: string;
    static readonly ERR_ADAPTIVE_RATE_LIMITED: string;
    static readonly ERR_MTLS_FAILED: string;
    static readonly ERR_VAULT_ACCESS_DENIED: string;
    static readonly ERR_SECURITY_HEADER_VIOLATION: string;
  }

  // ─── v10/v11 Cancel Token ──────────────────────────────────────────────

  class CancelToken {
    constructor(executor: (cancel: (message?: string) => void) => void);
    reason: Cancel | null;
    signal: AbortSignal;
    readonly requested: boolean;
    throwIfRequested(): void;
    subscribe(listener: (reason: Cancel) => void): void;
    unsubscribe(listener: (reason: Cancel) => void): void;
    static source(): { token: CancelToken; cancel: (message?: string) => void };
    static isCancel(value: any): boolean;
    static isCancelToken(value: any): boolean;
  }

  class Cancel {
    constructor(message?: string);
    message: string;
    __CANCEL__: boolean;
    toString(): string;
  }

  // ─── v10/v11 Interceptors ──────────────────────────────────────────────

  /** Options for interceptor registration (v15). */
  interface InterceptorOptions {
    /** When provided, interceptor is only executed if this function returns true. */
    runWhen?: (configOrResponse: any) => boolean;
    /** When true, interceptor runs synchronously (no await). Default false. */
    synchronous?: boolean;
  }

  class InterceptorChain {
    use(fulfilled: Function, rejected?: Function | null, options?: InterceptorOptions): number;
    eject(id: number): boolean;
    handlers(): Array<{ id: number; fulfilled: Function; rejected: Function | null; runWhen?: Function | null; synchronous?: boolean }>;
    clear(): void;
    forEach(fn: (handler: { fulfilled: Function; rejected: Function | null }) => void): void;
    readonly size: number;
  }

  class InterceptorManager {
    request: InterceptorChain;
    response: InterceptorChain;
    runRequest(config: any): Promise<any>;
    runResponse(response: any): Promise<any>;
    runError(error: Error): Promise<any>;
    clear(): void;
  }

  // ─── v10 Expectation Helpers ───────────────────────────────────────────

  function validateExpect(schema: Record<string, any>, depth?: number): { valid: boolean; error?: string };
  function serializeExpect(schema: Record<string, any>): string;
  function deserializeExpect(encoded: string): Record<string, any> | null;
  function extractExpect(config: Record<string, any>): { config: Record<string, any>; expect: Record<string, any> | null; error?: string };
  function injectExpectHeader(headers: Record<string, string>, expect: Record<string, any>): Record<string, string>;
  function flattenExpect(schema: Record<string, any>, prefix?: string): Map<string, string>;
  const HEADER_NAME: string;

  // ─── v10 Smart Proxy ───────────────────────────────────────────────────

  function smartProxy(data: any, options?: { learningEngine?: LearningEngine; fuzzyMatcher?: FuzzyMatcher; cache?: Map<string, any> }): any;

  // ─── Options ─────────────────────────────────────────────────────────────

  interface BridgeOptions {
    schema?: Record<string, string>;
    transformRequests?: boolean;
    cache?: CacheOptions;
    validator?: ValidatorOptions;
    normalizer?: NormalizerOptions;
  }

  interface BridgeFetchOptions {
    schema?: Record<string, string>;
    retries?: number;
    retryDelay?: number;
    cache?: CacheOptions;
    normalizer?: NormalizerOptions;
    validator?: ValidatorOptions;
  }

  interface TransformOptions {
    schema?: Record<string, string>;
    direction?: 'toFrontend' | 'toBackend';
    convention?: string;
  }

  interface CacheOptions {
    maxSize?: number;
    ttl?: number;
    enabled?: boolean;
  }

  interface ValidatorOptions {
    strict?: boolean;
    coerce?: boolean;
    throwOnError?: boolean;
  }

  interface NormalizerOptions {
    envelope?: boolean;
  }

  // ─── Fetch Instance ──────────────────────────────────────────────────────

  interface BridgeFetchInstance {
    get(url: string, config?: RequestInit): Promise<any>;
    post(url: string, body?: any, config?: RequestInit): Promise<any>;
    put(url: string, body?: any, config?: RequestInit): Promise<any>;
    patch(url: string, body?: any, config?: RequestInit): Promise<any>;
    delete(url: string, body?: any, config?: RequestInit): Promise<any>;
    head(url: string, config?: RequestInit): Promise<any>;
    options(url: string, config?: RequestInit): Promise<any>;
    request(method: string, url: string, body?: any, config?: RequestInit): Promise<any>;
    approve(source: string, target: string): void;
    reject(source: string, wrong: string, correct: string): void;
    exportCSV(path?: string): string;
    exportJSON(path?: string): string;
    getStats(): { transformer: any; cache: any; learning: any };
    getPending(): any[];
    validate(data: Record<string, any>, schema: Record<string, SchemaField>): ValidationResult;
    normalize(body: any, status: number): any;
    use(name: string, fn: Function, phase?: string): void;
    clearCache(): void;
    resetSession(): void;
    bulkImport(mappings: Record<string, string>[]): void;
    bulkExport(): Record<string, string>[];
  }

  // ─── Core Classes ────────────────────────────────────────────────────────

  class APIBridgeTransformer {
    constructor(options?: TransformOptions);
    transform(data: Record<string, any>, schema: Record<string, string> | null, direction: string): Record<string, any>;
    approve(source: string, target: string): void;
    reject(source: string, wrong: string, correct: string): void;
    getStats(): any;
    getPending(): any[];
    resetSession(): void;
    readonly mismatches: any[];
    readonly learning: LearningEngine;
  }

  class LearningEngine {
    constructor(options?: any);
    learn(source: string, target: string, confidence: number): void;
    lookup(source: string): { target: string; confidence: number } | null;
    bulkImport(mappings: Record<string, string>[]): void;
    bulkExport(): Record<string, string>[];
    getStats(): any;
  }

  class ResponseNormalizer {
    constructor(options?: NormalizerOptions);
    normalize(body: any, status: number): any;
  }

  class SchemaValidator {
    constructor(options?: ValidatorOptions);
    validate(data: Record<string, any>, schema: Record<string, SchemaField>): ValidationResult;
  }

  class SchemaInference {
    constructor();
    infer(samples: Record<string, any>[]): Record<string, SchemaField>;
  }

  class FuzzyMatcher {
    constructor(options?: any);
    findBestMatch(source: string, candidates: string[]): { match: string; confidence: number } | null;
  }

  class CrypticResolver {
    constructor(options?: any);
    resolve(source: string, candidates: string[]): { match: string; confidence: number } | null;
  }

  class TypeCoercer {
    constructor(options?: any);
    coerceValue(value: any, targetType: string, field?: string): any;
  }

  class FieldAliaser {
    constructor();
    register(canonical: string, aliases: string[]): void;
    resolve(field: string): { canonical: string; matched: boolean };
    getAliases(canonical: string): string[];
  }

  class ConditionalTransform {
    constructor();
    when(name: string, condition: (value: any) => boolean, transform: (value: any) => any): void;
    apply(value: any): any;
  }

  class SchemaMigrator {
    constructor();
    define(fromVersion: string, toVersion: string, migration: MigrationDef): void;
    migrate(data: Record<string, any>, fromVersion: string, toVersion: string): Record<string, any>;
  }

  // ─── Utils Classes ───────────────────────────────────────────────────────

  class ResponseCache {
    constructor(options?: CacheOptions);
    get(key: any, meta?: any): any | null;
    set(key: any, meta: any, value: any): void;
    clear(): void;
    getStats(): any;
  }

  class RequestDeduplicator {
    constructor();
    deduplicate<T>(key: string, fn: () => Promise<T>): Promise<T>;
  }

  class SchemaDiff {
    constructor();
    diff(oldSchema: Record<string, any>, newSchema: Record<string, any>): any;
  }

  function exportMismatchCSV(mismatches: any[], path?: string): string;
  function exportMismatchJSON(mismatches: any[], path?: string): string;
  function exportSchemaSuggestions(mismatches: any[]): any;

  class DataMasker {
    constructor(options?: any);
    mask(data: Record<string, any>, rules: Record<string, string>): Record<string, any>;
  }

  class MetricsCollector {
    constructor();
    startTimer(name: string): () => number;
    increment(name: string, amount?: number): void;
    record(name: string, value: number): void;
    getMetrics(): any;
    reset(): void;
  }

  class JSONPatchGenerator {
    constructor();
    generate(source: any, target: any): PatchOperation[];
    apply(target: any, patches: PatchOperation[]): any;
  }

  class TypeGenerator {
    constructor();
    generate(schema: Record<string, SchemaField>, name?: string): string;
  }

  class DeepMerge {
    constructor(options?: { arrayStrategy?: string; maxDepth?: number });
    merge(target: any, source: any): any;
  }

  class OutputFormatter {
    constructor();
    toCSV(data: any[]): string;
    toJSON(data: any, indent?: number): string;
    toKeyValue(data: Record<string, any>): string;
    toTable(data: any[]): string;
    toXML(data: any, options?: { root?: string; item?: string }): string;
    format(data: any, template: string): string;
  }

  class FieldStats {
    constructor();
    record(field: string, matched: boolean, confidence?: number): void;
    getStats(field?: string): any;
    getCoverageReport(): any;
  }

  class FieldProjection {
    constructor();
    pick(data: Record<string, any>, fields: string[]): Record<string, any>;
    omit(data: Record<string, any>, fields: string[]): Record<string, any>;
    rename(data: Record<string, any>, mapping: Record<string, string>): Record<string, any>;
    reshape(data: Record<string, any>, template: any): any;
    flatten(data: Record<string, any>, prefix?: string): Record<string, any>;
    compact(data: Record<string, any>): Record<string, any>;
  }

  class RequestLogger {
    constructor(options?: any);
    log(entry: any): void;
    getEntries(): any[];
  }

  // ─── Adapter Classes ─────────────────────────────────────────────────────

  class GraphQLBridge {
    constructor(options?: any);
    transformResponse(response: any): any;
    transformVariables(variables: any): any;
  }

  class WebhookHandler {
    constructor(options?: any);
    register(provider: string, config: any): void;
    handle(provider: string, payload: any, headers?: any): any;
  }

  class OpenAPIImporter {
    constructor();
    import(spec: any): Record<string, SchemaField>;
  }

  class MockServer {
    constructor();
    register(method: string, path: string, response: any): void;
    handle(method: string, path: string, body?: any): any;
    getRecordings(): any[];
  }

  class ResponseStreamer {
    constructor(options?: any);
    stream(chunks: any[], transform?: (chunk: any) => any): any[];
  }

  class MiddlewarePipeline {
    constructor();
    use(name: string, fn: Function, phase?: string): void;
    run(phase: string, context: any): Promise<void>;
  }

  class ComposablePipeline {
    constructor();
    pipe(name: string, fn: (data: any) => any): ComposablePipeline;
    execute(data: any): Promise<any>;
  }

  class PluginManager {
    constructor();
    register(plugin: PluginDef): PluginManager;
    unregister(name: string): PluginManager;
    execute(hookName: string, data: any, context?: any): Promise<any>;
    executeSync(hookName: string, data: any, context?: any): any;
    has(name: string): boolean;
    list(): string[];
    get(name: string): PluginDef | null;
    size(): number;
  }

  class RequestInterceptor {
    constructor();
    use(name: string, fn: (ctx: any) => any, options?: { priority?: number; group?: string }): void;
    execute(context: any): Promise<any>;
  }

  class BatchOrchestrator {
    constructor(options?: { concurrency?: number; failureStrategy?: string });
    executeParallel(tasks: BatchTask[]): Promise<any[]>;
    executeSequential(tasks: BatchTask[]): Promise<any[]>;
  }

  class DependencyGraph {
    constructor();
    addNode(name: string, fn: () => Promise<any>, deps?: string[]): void;
    execute(): Promise<Record<string, any>>;
  }

  class EventBus {
    constructor(options?: { recordHistory?: boolean });
    on(event: string, handler: (data: any) => void, options?: { priority?: number }): void;
    off(event: string, handler?: (data: any) => void): void;
    emit(event: string, data?: any): Promise<void>;
    once(event: string, handler: (data: any) => void): void;
    waitFor(event: string, timeout?: number): Promise<any>;
    getHistory(): any[];
  }

  class APIVersionManager {
    constructor();
    register(version: string, config: any): void;
    resolve(version: string): any;
  }

  class CircuitBreaker {
    constructor(options?: { failureThreshold?: number; resetTimeout?: number });
    execute<T>(fn: () => Promise<T>): Promise<T>;
    getState(): string;
    reset(): void;
  }

  class RetryStrategy {
    constructor(options?: RetryOptions);
    execute<T>(fn: () => Promise<T>): Promise<T>;
  }

  class RateLimiter {
    constructor(options?: { maxTokens?: number; refillRate?: number });
    acquire(): boolean;
    waitForToken(timeout?: number): Promise<boolean>;
  }

  class HealthCheck {
    constructor(options?: { failureThreshold?: number; interval?: number });
    register(name: string, checkFn: () => Promise<boolean>): void;
    check(name?: string): Promise<any>;
    getStatus(): any;
  }

  class SchemaRegistry {
    constructor();
    register(name: string, version: string, schema: Record<string, SchemaField>): void;
    get(name: string, version?: string): Record<string, SchemaField> | null;
    listVersions(name: string): string[];
  }

  // ─── Error Classes ───────────────────────────────────────────────────────

  class ApiBridgeError extends Error {
    code: string;
    details: Record<string, any>;
    timestamp: string;
    constructor(message: string, code: string, details?: Record<string, any>);
    toJSON(): { name: string; code: string; message: string; details: any; timestamp: string };
  }

  class ValidationError extends ApiBridgeError {
    constructor(message: string, field: string, expected: string, received: string);
  }

  class TransformError extends ApiBridgeError {
    constructor(message: string, sourceKey: string, details?: Record<string, any>);
  }

  class CacheError extends ApiBridgeError {
    constructor(message: string, key: string);
  }

  class MiddlewareError extends ApiBridgeError {
    constructor(message: string, middlewareName: string, originalError?: Error);
  }

  class NetworkError extends ApiBridgeError {
    constructor(message: string, url: string, attempt: number, maxRetries: number);
  }

  class PluginError extends ApiBridgeError {
    constructor(message: string, pluginName: string, originalError?: Error);
  }

  class RateLimitError extends ApiBridgeError {
    constructor(message: string, limit: number, retryAfterMs: number);
  }

  class InferenceError extends ApiBridgeError {
    constructor(message: string, reason: string);
  }

  class CircuitBreakerError extends ApiBridgeError {
    constructor(message: string, state: string, failures: number);
  }

  class PipelineError extends ApiBridgeError {
    constructor(message: string, stageName: string, originalError?: Error);
  }

  class WebhookError extends ApiBridgeError {
    constructor(message: string, provider: string, reason: string);
  }

  class VersioningError extends ApiBridgeError {
    constructor(message: string, version: string, reason: string);
  }

  class RetryError extends ApiBridgeError {
    constructor(message: string, attempt: number, maxRetries: number, reason: string);
  }

  class SchemaRegistryError extends ApiBridgeError {
    constructor(message: string, schemaName: string, reason: string);
  }

  class DependencyGraphError extends ApiBridgeError {
    constructor(message: string, nodeName: string, reason: string);
  }

  class MockServerError extends ApiBridgeError {
    constructor(message: string, operation: string, reason: string);
  }

  class HealthCheckError extends ApiBridgeError {
    constructor(message: string, endpoint: string, reason: string);
  }

  class EventBusError extends ApiBridgeError {
    constructor(message: string, event: string, reason: string);
  }

  class FuzzyMatchError extends ApiBridgeError {
    constructor(message: string, sourceKey: string, candidates: string[]);
  }

  class TypeCoercionError extends ApiBridgeError {
    constructor(message: string, field: string, sourceType: string, targetType: string);
  }

  class CrypticResolverError extends ApiBridgeError {
    constructor(message: string, sourceKey: string, reason: string);
  }

  class FieldAliaserError extends ApiBridgeError {
    constructor(message: string, field: string, reason: string);
  }

  class SchemaMigrationError extends ApiBridgeError {
    constructor(message: string, fromVersion: string, toVersion: string, reason: string);
  }

  class BatchOrchestratorError extends ApiBridgeError {
    constructor(message: string, batchId: string, reason: string);
  }

  class DeepMergeError extends ApiBridgeError {
    constructor(message: string, path: string, reason: string);
  }

  class InterceptorError extends ApiBridgeError {
    constructor(message: string, interceptorName: string, reason: string);
  }

  // ─── v16 Security Classes ─────────────────────────────────────────────

  class SSRFGuard {
    constructor(options?: SSRFGuardOptions);
    enabled: boolean;
    validateURL(url: string): true;
  }

  class HeaderValidator {
    constructor(options?: HeaderValidatorOptions);
    maxHeadersCount: number;
    maxHeaderSize: number;
    validateHeaderName(name: string): true;
    validateHeaderValue(value: string): true;
    validateHeaders(headers: Record<string, string>): true;
  }

  class RequestRateLimiter {
    constructor(options?: RateLimiterOptions);
    maxRequests: number;
    windowMs: number;
    acquire(endpoint?: string): boolean;
    reset(endpoint?: string): void;
  }

  class ResponseSizeGuard {
    constructor(options?: ResponseSizeGuardOptions);
    maxResponseSize: number;
    checkSize(contentLength: number | string): true;
    createSizeTracker(): SizeTracker;
  }

  class SensitiveDataRedactor {
    constructor(options?: SensitiveDataRedactorOptions);
    isSensitiveHeader(name: string): boolean;
    redactHeaders(headers: Record<string, string>): Record<string, string>;
    redactConfig(config: Record<string, any>): Record<string, any>;
    redactURL(url: string): string;
  }

  class RequestFingerprinter {
    fingerprint(config: { method?: string; url?: string; data?: any; params?: any }): string;
    isDuplicate(config: { method?: string; url?: string; data?: any; params?: any }, windowMs: number): boolean;
    reset(): void;
  }

  function safeMerge(target: Record<string, any>, source: Record<string, any>): Record<string, any>;
  function sanitizeObject(obj: any): any;
  function isPrivateIP(ip: string): boolean;

  // ─── v17 Advanced Security Classes ──────────────────────────────────────

  class ContentSecurityPolicy {
    constructor(options?: ContentSecurityPolicyOptions);
    defaultSrc: string[];
    scriptSrc: string[];
    styleSrc: string[];
    imgSrc: string[];
    connectSrc: string[];
    fontSrc: string[];
    objectSrc: string[];
    frameSrc: string[];
    baseUri: string[];
    formAction: string[];
    reportUri: string | null;
    reportOnly: boolean;
    customDirectives: Record<string, string[]>;
    buildHeader(): string;
    getHeaderName(): string;
    validateSource(source: string): boolean;
    addNonce(): string;
    toJSON(): Record<string, string[]>;
  }

  class CertificatePinning {
    constructor(options?: CertificatePinningOptions);
    enforceMode: 'enforce' | 'report';
    maxAge: number;
    includeSubdomains: boolean;
    addPin(host: string, sha256Hash: string): void;
    removePin(host: string): void;
    verify(host: string, certHash: string): CertPinVerifyResult;
    getPins(host: string): string[];
    buildHPKPHeader(host: string): string;
    toJSON(): Record<string, any>;
  }

  class RequestSigning {
    constructor(options?: RequestSigningOptions);
    headerName: string;
    signedHeaders: string[];
    timestampTolerance: number;
    sign(config: { method?: string; url?: string; headers?: Record<string, string>; data?: any }): SignResult;
    verify(config: { method?: string; url?: string; headers?: Record<string, string>; data?: any }, signature: string, timestamp: number): VerifyResult;
    createCanonicalString(method: string, url: string, timestamp: number, headers: Record<string, string>, signedHeaderNames: string[]): string;
  }

  class InputSanitizer {
    constructor(options?: InputSanitizerOptions);
    mode: 'escape' | 'strip' | 'reject';
    maxDepth: number;
    maxStringLength: number;
    allowHTML: boolean;
    sanitizeString(str: string): string;
    sanitize(input: any, depth?: number): any;
    detectThreats(input: any): ThreatDetection[];
    isClean(input: any): boolean;
  }

  class SecurityAuditLogger {
    constructor(options?: SecurityAuditLoggerOptions);
    log(event: { event: string; severity: 'info' | 'warn' | 'error' | 'critical'; details?: Record<string, any> }): AuditLogEntry;
    verify(): AuditVerifyResult;
    getEntries(filter?: { severity?: string; event?: string; since?: number; limit?: number }): AuditLogEntry[];
    getStats(): AuditLogStats;
    clear(): void;
  }

  class PermissionPolicy {
    constructor(options?: PermissionPolicyOptions);
    defaultAllow: boolean;
    caseSensitive: boolean;
    addPolicy(role: string, methods: string[], endpoints: string[]): void;
    removePolicy(role: string): void;
    check(role: string, method: string, endpoint: string): PermissionCheckResult;
    checkMultiple(roles: string[], method: string, endpoint: string): PermissionCheckMultipleResult;
    listPolicies(role?: string): Array<{ role: string; methods: string[]; endpoints: string[] }>;
  }

  class PayloadEncryptor {
    constructor(options?: PayloadEncryptorOptions);
    encrypt(plaintext: string | object): EncryptResult;
    decrypt(encrypted: string, iv: string, tag: string): string;
    encryptObject(obj: object): EncryptResult;
    decryptObject(encrypted: string, iv: string, tag: string): object;
    getKeyFingerprint(): string;
    rotateKey(newKey?: Buffer | string): void;
  }

  class IdempotencyManager {
    constructor(options?: IdempotencyManagerOptions);
    headerName: string;
    ttl: number;
    maxEntries: number;
    methods: string[];
    generateKey(config?: object): string;
    shouldEnforce(method: string): boolean;
    recordResponse(key: string, response: any): void;
    getStoredResponse(key: string): any | null;
    cleanup(): number;
    hasKey(key: string): boolean;
    reset(): void;
  }

  // ─── v18: Elite Security Classes ──────────────────────────────────────────

  class ZeroTrustEngine {
    constructor(options?: ZeroTrustEngineOptions);
    defaultTrustScore: number;
    trustThreshold: number;
    maxTrustScore: number;
    decayRate: number;
    decayIntervalMs: number;
    evaluate(context: { contextId: string; ip?: string; userAgent?: string; method?: string; url?: string }): ZeroTrustEvaluation;
    updateTrust(contextId: string, delta: number, reason: string): void;
    revokeTrust(contextId: string): void;
    getTrustInfo(contextId: string): { score: number; lastActivity: number; factors: string[] } | null;
    reset(): void;
  }

  class ThreatIntelligence {
    constructor(options?: ThreatIntelligenceOptions);
    suspiciousThreshold: number;
    autoBlock: boolean;
    assess(request: { ip?: string; url?: string; method?: string; headers?: Record<string, string> }): ThreatAssessment;
    reportActivity(ip: string, event: string): void;
    blockIP(ip: string): void;
    unblockIP(ip: string): void;
    isBlocked(ip: string): boolean;
    getActivityLog(ip: string): { count: number; events: Array<{ event: string; timestamp: number }>; blocked: boolean } | null;
    addPattern(pattern: string | RegExp): void;
    reset(): void;
  }

  class SecureSessionManager {
    constructor(options?: SecureSessionManagerOptions);
    tokenLength: number;
    maxAge: number;
    rotationInterval: number;
    maxSessions: number;
    bindToIP: boolean;
    bindToUserAgent: boolean;
    createSession(context: { contextId: string; ip?: string; userAgent?: string; metadata?: any }): SessionInfo;
    validateSession(token: string, context: { ip?: string; userAgent?: string }): SessionValidation;
    rotateSession(oldToken: string): string | null;
    revokeSession(token: string): void;
    revokeAllSessions(contextId: string): void;
    getSession(token: string): { contextId: string; ip?: string; userAgent?: string; createdAt: number; metadata?: any } | null;
    cleanup(): number;
    getActiveCount(): number;
  }

  class RequestIntegrityChain {
    constructor(options?: RequestIntegrityChainOptions);
    addRequest(request: { method: string; url: string; timestamp: number; headers?: Record<string, string>; bodyHash?: string }): IntegrityEntry;
    verify(): IntegrityVerification;
    verifyEntry(index: number): { valid: boolean };
    getChain(): IntegrityEntry[];
    getEntry(index: number): IntegrityEntry | null;
    getLength(): number;
    getLatestHash(): string;
    reset(): void;
  }

  class AdaptiveRateLimiter {
    constructor(options?: AdaptiveRateLimiterOptions);
    baseRate: number;
    windowMs: number;
    burstMultiplier: number;
    anomalyThreshold: number;
    adaptationRate: number;
    minRate: number;
    maxRate: number;
    acquire(key: string): AdaptiveAcquireResult;
    getStats(key: string): AdaptiveStats | null;
    adjustRate(key: string, newRate: number): void;
    resetKey(key: string): void;
    reset(): void;
  }

  class SecurityHeadersManager {
    constructor(options?: SecurityHeadersManagerOptions);
    hsts: { maxAge: number; includeSubDomains: boolean; preload: boolean };
    xFrameOptions: string;
    xContentTypeOptions: boolean;
    referrerPolicy: string;
    buildHeaders(): Record<string, string>;
    getHeader(name: string): string | undefined;
    setHeader(name: string, value: string): void;
    removeHeader(name: string): void;
    applyToResponse(responseHeaders: Record<string, string>): Record<string, string>;
    validate(): SecurityValidation;
    toJSON(): Record<string, any>;
  }

  class EncryptedConfigVault {
    constructor(options?: EncryptedConfigVaultOptions);
    store(key: string, value: any): boolean;
    retrieve(key: string): any | null;
    has(key: string): boolean;
    remove(key: string): boolean;
    list(): string[];
    rotateMasterKey(newKey: string): void;
    getFingerprint(): string;
    clear(): void;
    export(): Record<string, string>;
    import(data: Record<string, string>): void;
  }

  class MutualTLSManager {
    constructor(options?: MutualTLSManagerOptions);
    requireClientCert: boolean;
    allowExpired: boolean;
    maxCertAge: number;
    validateClientCert(cert: { fingerprint: string; issuer?: string; subject?: string; notBefore: number; notAfter: number; serialNumber?: string }): CertValidation;
    addTrustedCert(fingerprint: string): void;
    removeTrustedCert(fingerprint: string): void;
    revokeCert(fingerprint: string): void;
    isRevoked(fingerprint: string): boolean;
    getTrustedCerts(): string[];
    getRevocationList(): string[];
    generateFingerprint(certData: string): string;
    reset(): void;
  }

  // ─── Supporting Types ────────────────────────────────────────────────────

  interface SchemaField {
    type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'json' | 'object' | 'any';
    required?: boolean;
    default?: any;
  }

  interface ValidationResult {
    valid: boolean;
    errors: ValidationIssue[];
    data: Record<string, any>;
  }

  interface ValidationIssue {
    field: string;
    message: string;
    expected?: string;
    received?: string;
  }

  interface MigrationDef {
    rename?: Record<string, string>;
    add?: Record<string, any>;
    remove?: string[];
  }

  interface PatchOperation {
    op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test';
    path: string;
    value?: any;
    from?: string;
  }

  interface PluginDef {
    name: string;
    version?: string;
    hooks?: Record<string, (data: any, context?: any) => any>;
    init?: () => void;
    destroy?: () => void;
  }

  interface BatchTask {
    id: string;
    fn: (prevResults?: any) => Promise<any>;
  }

  interface RetryOptions {
    strategy?: 'linear' | 'exponential' | 'exponentialJitter' | 'custom';
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: Error) => boolean;
    onRetry?: (attempt: number, error: Error) => void;
    backoffFn?: (attempt: number) => number;
  }

  // ─── v12: Axios Class Aliases ─────────────────────────────────────────

  /**
   * Axios class alias (same as APIBridgeClient).
   */
  const Axios: typeof APIBridgeClient;

  /**
   * AxiosError alias (same as ClientError, with error code constants).
   */
  const AxiosError: typeof ClientError;

  /**
   * Check if an error is an AxiosError (alias for isClientError).
   */
  function isAxiosError(err: any): boolean;

  // ─── v12: Callable Default Export ──────────────────────────────────────

  /**
   * Callable default export — use like axios:
   *   apiBridge('/api/users')
   *   apiBridge({ method: 'post', url: '/api/users', data: { name: 'John' } })
   */
  interface ApiBridgeCallable {
    (config: ClientRequestConfig): Promise<ClientResponse>;
    (url: string, config?: ClientRequestConfig): Promise<ClientResponse>;

    request(config: ClientRequestConfig): Promise<ClientResponse>;
    request(url: string, config?: ClientRequestConfig): Promise<ClientResponse>;
    get<T = any>(url: string, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
    post<T = any>(url: string, data?: any, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
    put<T = any>(url: string, data?: any, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
    patch<T = any>(url: string, data?: any, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
    delete<T = any>(url: string, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
    head<T = any>(url: string, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
    options<T = any>(url: string, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
    postForm<T = any>(url: string, data?: any, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
    putForm<T = any>(url: string, data?: any, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
    patchForm<T = any>(url: string, data?: any, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
    getUri(config?: ClientRequestConfig): string;

    defaults: ClientDefaults;
    interceptors: InterceptorManager;
    create(options?: ClientOptions): APIBridgeClient;
    createClient(options?: ClientOptions): APIBridgeClient;

    all<T>(promises: Promise<T>[]): Promise<T[]>;
    spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R;

    isClientError(err: any): boolean;
    isApiBridgeError(err: any): boolean;
    isAxiosError(err: any): boolean;
    isCancel(value: any): boolean;
    isCancelToken(value: any): boolean;

    Axios: typeof APIBridgeClient;
    AxiosError: typeof ClientError;
    APIBridgeClient: typeof APIBridgeClient;
    ClientError: typeof ClientError;
    CancelToken: typeof CancelToken;
    Cancel: typeof Cancel;
    AxiosHeaders: typeof AxiosHeaders;
    HttpStatusCode: typeof HttpStatusCode;
    InterceptorManager: typeof InterceptorManager;

    SSRFGuard: typeof SSRFGuard;
    HeaderValidator: typeof HeaderValidator;
    RequestRateLimiter: typeof RequestRateLimiter;
    ResponseSizeGuard: typeof ResponseSizeGuard;
    SensitiveDataRedactor: typeof SensitiveDataRedactor;
    RequestFingerprinter: typeof RequestFingerprinter;
    safeMerge: typeof safeMerge;
    sanitizeObject: typeof sanitizeObject;
    isPrivateIP: typeof isPrivateIP;

    ContentSecurityPolicy: typeof ContentSecurityPolicy;
    CertificatePinning: typeof CertificatePinning;
    RequestSigning: typeof RequestSigning;
    InputSanitizer: typeof InputSanitizer;
    SecurityAuditLogger: typeof SecurityAuditLogger;
    PermissionPolicy: typeof PermissionPolicy;
    PayloadEncryptor: typeof PayloadEncryptor;
    IdempotencyManager: typeof IdempotencyManager;

    ZeroTrustEngine: typeof ZeroTrustEngine;
    ThreatIntelligence: typeof ThreatIntelligence;
    SecureSessionManager: typeof SecureSessionManager;
    RequestIntegrityChain: typeof RequestIntegrityChain;
    AdaptiveRateLimiter: typeof AdaptiveRateLimiter;
    SecurityHeadersManager: typeof SecurityHeadersManager;
    EncryptedConfigVault: typeof EncryptedConfigVault;
    MutualTLSManager: typeof MutualTLSManager;

    toFormData: typeof toFormData;
    toURLEncodedForm: typeof toURLEncodedForm;
    formToJSON: typeof formToJSON;
    mergeConfig: typeof mergeConfig;
    getAdapter: typeof getAdapter;
    buildURL: typeof buildURL;
    VERSION: string;
  }

  const apiBridge: ApiBridgeCallable;

  // ─── v12: Module-level shorthand methods ───────────────────────────────

  function request(config: ClientRequestConfig): Promise<ClientResponse>;
  function request(url: string, config?: ClientRequestConfig): Promise<ClientResponse>;
  function get<T = any>(url: string, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
  function post<T = any>(url: string, data?: any, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
  function put<T = any>(url: string, data?: any, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
  function patch<T = any>(url: string, data?: any, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
  // Note: 'delete' is a reserved word, use the module export
  function head<T = any>(url: string, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
  function options<T = any>(url: string, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
  function postForm<T = any>(url: string, data?: any, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
  function putForm<T = any>(url: string, data?: any, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
  function patchForm<T = any>(url: string, data?: any, config?: ClientRequestConfig): Promise<ClientResponse<T>>;
  function getUri(config?: ClientRequestConfig): string;

  const interceptors: InterceptorManager;
}
