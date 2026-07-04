
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Auction
 * 
 */
export type Auction = $Result.DefaultSelection<Prisma.$AuctionPayload>
/**
 * Model JoinedAuction
 * 
 */
export type JoinedAuction = $Result.DefaultSelection<Prisma.$JoinedAuctionPayload>
/**
 * Model Category
 * 
 */
export type Category = $Result.DefaultSelection<Prisma.$CategoryPayload>
/**
 * Model Team
 * 
 */
export type Team = $Result.DefaultSelection<Prisma.$TeamPayload>
/**
 * Model Player
 * 
 */
export type Player = $Result.DefaultSelection<Prisma.$PlayerPayload>
/**
 * Model BidHistory
 * 
 */
export type BidHistory = $Result.DefaultSelection<Prisma.$BidHistoryPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>
/**
 * Model Feedback
 * 
 */
export type Feedback = $Result.DefaultSelection<Prisma.$FeedbackPayload>
/**
 * Model AuctionInsight
 * 
 */
export type AuctionInsight = $Result.DefaultSelection<Prisma.$AuctionInsightPayload>
/**
 * Model ContactMessage
 * 
 */
export type ContactMessage = $Result.DefaultSelection<Prisma.$ContactMessagePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

export type Role = (typeof Role)[keyof typeof Role]


export const PlanTier: {
  FREE: 'FREE',
  BASIC: 'BASIC',
  STANDARD: 'STANDARD',
  PREMIUM: 'PREMIUM',
  ELITE: 'ELITE',
  ULTIMATE: 'ULTIMATE',
  MEGA: 'MEGA'
};

export type PlanTier = (typeof PlanTier)[keyof typeof PlanTier]


export const AuctionStatus: {
  DRAFT: 'DRAFT',
  UPCOMING: 'UPCOMING',
  LIVE: 'LIVE',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED'
};

export type AuctionStatus = (typeof AuctionStatus)[keyof typeof AuctionStatus]


export const PlayerRole: {
  BATSMAN: 'BATSMAN',
  BOWLER: 'BOWLER',
  WICKET_KEEPER: 'WICKET_KEEPER',
  ALL_ROUNDER: 'ALL_ROUNDER',
  BATTING_ALL_ROUNDER: 'BATTING_ALL_ROUNDER',
  BOWLING_ALL_ROUNDER: 'BOWLING_ALL_ROUNDER',
  ALL_ROUNDER_WICKET_KEEPER: 'ALL_ROUNDER_WICKET_KEEPER',
  BATTER: 'BATTER',
  GOALKEEPER: 'GOALKEEPER',
  DEFENDER: 'DEFENDER',
  MIDFIELDER: 'MIDFIELDER',
  FORWARD: 'FORWARD',
  OTHER: 'OTHER'
};

export type PlayerRole = (typeof PlayerRole)[keyof typeof PlayerRole]


export const PlayerStatus: {
  UPCOMING: 'UPCOMING',
  BIDDING: 'BIDDING',
  SOLD: 'SOLD',
  UNSOLD: 'UNSOLD'
};

export type PlayerStatus = (typeof PlayerStatus)[keyof typeof PlayerStatus]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type PlanTier = $Enums.PlanTier

export const PlanTier: typeof $Enums.PlanTier

export type AuctionStatus = $Enums.AuctionStatus

export const AuctionStatus: typeof $Enums.AuctionStatus

export type PlayerRole = $Enums.PlayerRole

export const PlayerRole: typeof $Enums.PlayerRole

export type PlayerStatus = $Enums.PlayerStatus

export const PlayerStatus: typeof $Enums.PlayerStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auction`: Exposes CRUD operations for the **Auction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Auctions
    * const auctions = await prisma.auction.findMany()
    * ```
    */
  get auction(): Prisma.AuctionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.joinedAuction`: Exposes CRUD operations for the **JoinedAuction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more JoinedAuctions
    * const joinedAuctions = await prisma.joinedAuction.findMany()
    * ```
    */
  get joinedAuction(): Prisma.JoinedAuctionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.category`: Exposes CRUD operations for the **Category** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.category.findMany()
    * ```
    */
  get category(): Prisma.CategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.team`: Exposes CRUD operations for the **Team** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Teams
    * const teams = await prisma.team.findMany()
    * ```
    */
  get team(): Prisma.TeamDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.player`: Exposes CRUD operations for the **Player** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Players
    * const players = await prisma.player.findMany()
    * ```
    */
  get player(): Prisma.PlayerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bidHistory`: Exposes CRUD operations for the **BidHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BidHistories
    * const bidHistories = await prisma.bidHistory.findMany()
    * ```
    */
  get bidHistory(): Prisma.BidHistoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.feedback`: Exposes CRUD operations for the **Feedback** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Feedbacks
    * const feedbacks = await prisma.feedback.findMany()
    * ```
    */
  get feedback(): Prisma.FeedbackDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auctionInsight`: Exposes CRUD operations for the **AuctionInsight** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuctionInsights
    * const auctionInsights = await prisma.auctionInsight.findMany()
    * ```
    */
  get auctionInsight(): Prisma.AuctionInsightDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.contactMessage`: Exposes CRUD operations for the **ContactMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ContactMessages
    * const contactMessages = await prisma.contactMessage.findMany()
    * ```
    */
  get contactMessage(): Prisma.ContactMessageDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.1
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Auction: 'Auction',
    JoinedAuction: 'JoinedAuction',
    Category: 'Category',
    Team: 'Team',
    Player: 'Player',
    BidHistory: 'BidHistory',
    AuditLog: 'AuditLog',
    Feedback: 'Feedback',
    AuctionInsight: 'AuctionInsight',
    ContactMessage: 'ContactMessage'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "auction" | "joinedAuction" | "category" | "team" | "player" | "bidHistory" | "auditLog" | "feedback" | "auctionInsight" | "contactMessage"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Auction: {
        payload: Prisma.$AuctionPayload<ExtArgs>
        fields: Prisma.AuctionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuctionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuctionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPayload>
          }
          findFirst: {
            args: Prisma.AuctionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuctionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPayload>
          }
          findMany: {
            args: Prisma.AuctionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPayload>[]
          }
          create: {
            args: Prisma.AuctionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPayload>
          }
          createMany: {
            args: Prisma.AuctionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuctionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPayload>[]
          }
          delete: {
            args: Prisma.AuctionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPayload>
          }
          update: {
            args: Prisma.AuctionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPayload>
          }
          deleteMany: {
            args: Prisma.AuctionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuctionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuctionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPayload>[]
          }
          upsert: {
            args: Prisma.AuctionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPayload>
          }
          aggregate: {
            args: Prisma.AuctionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuction>
          }
          groupBy: {
            args: Prisma.AuctionGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuctionGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuctionCountArgs<ExtArgs>
            result: $Utils.Optional<AuctionCountAggregateOutputType> | number
          }
        }
      }
      JoinedAuction: {
        payload: Prisma.$JoinedAuctionPayload<ExtArgs>
        fields: Prisma.JoinedAuctionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JoinedAuctionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JoinedAuctionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JoinedAuctionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JoinedAuctionPayload>
          }
          findFirst: {
            args: Prisma.JoinedAuctionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JoinedAuctionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JoinedAuctionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JoinedAuctionPayload>
          }
          findMany: {
            args: Prisma.JoinedAuctionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JoinedAuctionPayload>[]
          }
          create: {
            args: Prisma.JoinedAuctionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JoinedAuctionPayload>
          }
          createMany: {
            args: Prisma.JoinedAuctionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JoinedAuctionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JoinedAuctionPayload>[]
          }
          delete: {
            args: Prisma.JoinedAuctionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JoinedAuctionPayload>
          }
          update: {
            args: Prisma.JoinedAuctionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JoinedAuctionPayload>
          }
          deleteMany: {
            args: Prisma.JoinedAuctionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JoinedAuctionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.JoinedAuctionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JoinedAuctionPayload>[]
          }
          upsert: {
            args: Prisma.JoinedAuctionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JoinedAuctionPayload>
          }
          aggregate: {
            args: Prisma.JoinedAuctionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJoinedAuction>
          }
          groupBy: {
            args: Prisma.JoinedAuctionGroupByArgs<ExtArgs>
            result: $Utils.Optional<JoinedAuctionGroupByOutputType>[]
          }
          count: {
            args: Prisma.JoinedAuctionCountArgs<ExtArgs>
            result: $Utils.Optional<JoinedAuctionCountAggregateOutputType> | number
          }
        }
      }
      Category: {
        payload: Prisma.$CategoryPayload<ExtArgs>
        fields: Prisma.CategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findFirst: {
            args: Prisma.CategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findMany: {
            args: Prisma.CategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          create: {
            args: Prisma.CategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          createMany: {
            args: Prisma.CategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          delete: {
            args: Prisma.CategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          update: {
            args: Prisma.CategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          deleteMany: {
            args: Prisma.CategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CategoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          upsert: {
            args: Prisma.CategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          aggregate: {
            args: Prisma.CategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategory>
          }
          groupBy: {
            args: Prisma.CategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoryCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryCountAggregateOutputType> | number
          }
        }
      }
      Team: {
        payload: Prisma.$TeamPayload<ExtArgs>
        fields: Prisma.TeamFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TeamFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TeamFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          findFirst: {
            args: Prisma.TeamFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TeamFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          findMany: {
            args: Prisma.TeamFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          create: {
            args: Prisma.TeamCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          createMany: {
            args: Prisma.TeamCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TeamCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          delete: {
            args: Prisma.TeamDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          update: {
            args: Prisma.TeamUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          deleteMany: {
            args: Prisma.TeamDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TeamUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TeamUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          upsert: {
            args: Prisma.TeamUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          aggregate: {
            args: Prisma.TeamAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTeam>
          }
          groupBy: {
            args: Prisma.TeamGroupByArgs<ExtArgs>
            result: $Utils.Optional<TeamGroupByOutputType>[]
          }
          count: {
            args: Prisma.TeamCountArgs<ExtArgs>
            result: $Utils.Optional<TeamCountAggregateOutputType> | number
          }
        }
      }
      Player: {
        payload: Prisma.$PlayerPayload<ExtArgs>
        fields: Prisma.PlayerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlayerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlayerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          findFirst: {
            args: Prisma.PlayerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlayerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          findMany: {
            args: Prisma.PlayerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>[]
          }
          create: {
            args: Prisma.PlayerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          createMany: {
            args: Prisma.PlayerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlayerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>[]
          }
          delete: {
            args: Prisma.PlayerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          update: {
            args: Prisma.PlayerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          deleteMany: {
            args: Prisma.PlayerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlayerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PlayerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>[]
          }
          upsert: {
            args: Prisma.PlayerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          aggregate: {
            args: Prisma.PlayerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlayer>
          }
          groupBy: {
            args: Prisma.PlayerGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlayerGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlayerCountArgs<ExtArgs>
            result: $Utils.Optional<PlayerCountAggregateOutputType> | number
          }
        }
      }
      BidHistory: {
        payload: Prisma.$BidHistoryPayload<ExtArgs>
        fields: Prisma.BidHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BidHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BidHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BidHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BidHistoryPayload>
          }
          findFirst: {
            args: Prisma.BidHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BidHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BidHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BidHistoryPayload>
          }
          findMany: {
            args: Prisma.BidHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BidHistoryPayload>[]
          }
          create: {
            args: Prisma.BidHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BidHistoryPayload>
          }
          createMany: {
            args: Prisma.BidHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BidHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BidHistoryPayload>[]
          }
          delete: {
            args: Prisma.BidHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BidHistoryPayload>
          }
          update: {
            args: Prisma.BidHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BidHistoryPayload>
          }
          deleteMany: {
            args: Prisma.BidHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BidHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BidHistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BidHistoryPayload>[]
          }
          upsert: {
            args: Prisma.BidHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BidHistoryPayload>
          }
          aggregate: {
            args: Prisma.BidHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBidHistory>
          }
          groupBy: {
            args: Prisma.BidHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<BidHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.BidHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<BidHistoryCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
      Feedback: {
        payload: Prisma.$FeedbackPayload<ExtArgs>
        fields: Prisma.FeedbackFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FeedbackFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FeedbackFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          findFirst: {
            args: Prisma.FeedbackFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FeedbackFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          findMany: {
            args: Prisma.FeedbackFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>[]
          }
          create: {
            args: Prisma.FeedbackCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          createMany: {
            args: Prisma.FeedbackCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FeedbackCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>[]
          }
          delete: {
            args: Prisma.FeedbackDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          update: {
            args: Prisma.FeedbackUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          deleteMany: {
            args: Prisma.FeedbackDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FeedbackUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FeedbackUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>[]
          }
          upsert: {
            args: Prisma.FeedbackUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          aggregate: {
            args: Prisma.FeedbackAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFeedback>
          }
          groupBy: {
            args: Prisma.FeedbackGroupByArgs<ExtArgs>
            result: $Utils.Optional<FeedbackGroupByOutputType>[]
          }
          count: {
            args: Prisma.FeedbackCountArgs<ExtArgs>
            result: $Utils.Optional<FeedbackCountAggregateOutputType> | number
          }
        }
      }
      AuctionInsight: {
        payload: Prisma.$AuctionInsightPayload<ExtArgs>
        fields: Prisma.AuctionInsightFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuctionInsightFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionInsightPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuctionInsightFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionInsightPayload>
          }
          findFirst: {
            args: Prisma.AuctionInsightFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionInsightPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuctionInsightFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionInsightPayload>
          }
          findMany: {
            args: Prisma.AuctionInsightFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionInsightPayload>[]
          }
          create: {
            args: Prisma.AuctionInsightCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionInsightPayload>
          }
          createMany: {
            args: Prisma.AuctionInsightCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuctionInsightCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionInsightPayload>[]
          }
          delete: {
            args: Prisma.AuctionInsightDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionInsightPayload>
          }
          update: {
            args: Prisma.AuctionInsightUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionInsightPayload>
          }
          deleteMany: {
            args: Prisma.AuctionInsightDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuctionInsightUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuctionInsightUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionInsightPayload>[]
          }
          upsert: {
            args: Prisma.AuctionInsightUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionInsightPayload>
          }
          aggregate: {
            args: Prisma.AuctionInsightAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuctionInsight>
          }
          groupBy: {
            args: Prisma.AuctionInsightGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuctionInsightGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuctionInsightCountArgs<ExtArgs>
            result: $Utils.Optional<AuctionInsightCountAggregateOutputType> | number
          }
        }
      }
      ContactMessage: {
        payload: Prisma.$ContactMessagePayload<ExtArgs>
        fields: Prisma.ContactMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ContactMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ContactMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>
          }
          findFirst: {
            args: Prisma.ContactMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ContactMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>
          }
          findMany: {
            args: Prisma.ContactMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>[]
          }
          create: {
            args: Prisma.ContactMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>
          }
          createMany: {
            args: Prisma.ContactMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ContactMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>[]
          }
          delete: {
            args: Prisma.ContactMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>
          }
          update: {
            args: Prisma.ContactMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>
          }
          deleteMany: {
            args: Prisma.ContactMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ContactMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ContactMessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>[]
          }
          upsert: {
            args: Prisma.ContactMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>
          }
          aggregate: {
            args: Prisma.ContactMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContactMessage>
          }
          groupBy: {
            args: Prisma.ContactMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ContactMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ContactMessageCountArgs<ExtArgs>
            result: $Utils.Optional<ContactMessageCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    auction?: AuctionOmit
    joinedAuction?: JoinedAuctionOmit
    category?: CategoryOmit
    team?: TeamOmit
    player?: PlayerOmit
    bidHistory?: BidHistoryOmit
    auditLog?: AuditLogOmit
    feedback?: FeedbackOmit
    auctionInsight?: AuctionInsightOmit
    contactMessage?: ContactMessageOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    auctions: number
    joinedAuctions: number
    auditLogs: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auctions?: boolean | UserCountOutputTypeCountAuctionsArgs
    joinedAuctions?: boolean | UserCountOutputTypeCountJoinedAuctionsArgs
    auditLogs?: boolean | UserCountOutputTypeCountAuditLogsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAuctionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuctionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountJoinedAuctionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JoinedAuctionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }


  /**
   * Count Type AuctionCountOutputType
   */

  export type AuctionCountOutputType = {
    teams: number
    players: number
    categories: number
    bidhistories: number
    joinedAuctions: number
  }

  export type AuctionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    teams?: boolean | AuctionCountOutputTypeCountTeamsArgs
    players?: boolean | AuctionCountOutputTypeCountPlayersArgs
    categories?: boolean | AuctionCountOutputTypeCountCategoriesArgs
    bidhistories?: boolean | AuctionCountOutputTypeCountBidhistoriesArgs
    joinedAuctions?: boolean | AuctionCountOutputTypeCountJoinedAuctionsArgs
  }

  // Custom InputTypes
  /**
   * AuctionCountOutputType without action
   */
  export type AuctionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionCountOutputType
     */
    select?: AuctionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AuctionCountOutputType without action
   */
  export type AuctionCountOutputTypeCountTeamsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamWhereInput
  }

  /**
   * AuctionCountOutputType without action
   */
  export type AuctionCountOutputTypeCountPlayersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerWhereInput
  }

  /**
   * AuctionCountOutputType without action
   */
  export type AuctionCountOutputTypeCountCategoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
  }

  /**
   * AuctionCountOutputType without action
   */
  export type AuctionCountOutputTypeCountBidhistoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BidHistoryWhereInput
  }

  /**
   * AuctionCountOutputType without action
   */
  export type AuctionCountOutputTypeCountJoinedAuctionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JoinedAuctionWhereInput
  }


  /**
   * Count Type CategoryCountOutputType
   */

  export type CategoryCountOutputType = {
    players: number
  }

  export type CategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    players?: boolean | CategoryCountOutputTypeCountPlayersArgs
  }

  // Custom InputTypes
  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryCountOutputType
     */
    select?: CategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeCountPlayersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerWhereInput
  }


  /**
   * Count Type TeamCountOutputType
   */

  export type TeamCountOutputType = {
    players: number
    bidHistories: number
  }

  export type TeamCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    players?: boolean | TeamCountOutputTypeCountPlayersArgs
    bidHistories?: boolean | TeamCountOutputTypeCountBidHistoriesArgs
  }

  // Custom InputTypes
  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamCountOutputType
     */
    select?: TeamCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeCountPlayersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerWhereInput
  }

  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeCountBidHistoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BidHistoryWhereInput
  }


  /**
   * Count Type PlayerCountOutputType
   */

  export type PlayerCountOutputType = {
    bidHistory: number
  }

  export type PlayerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bidHistory?: boolean | PlayerCountOutputTypeCountBidHistoryArgs
  }

  // Custom InputTypes
  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerCountOutputType
     */
    select?: PlayerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeCountBidHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BidHistoryWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    firebaseUid: string | null
    name: string | null
    email: string | null
    role: $Enums.Role | null
    password: string | null
    mobile: string | null
    city: string | null
    profileUrl: string | null
    createdAt: Date | null
    stripeCustomerId: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    firebaseUid: string | null
    name: string | null
    email: string | null
    role: $Enums.Role | null
    password: string | null
    mobile: string | null
    city: string | null
    profileUrl: string | null
    createdAt: Date | null
    stripeCustomerId: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    firebaseUid: number
    name: number
    email: number
    role: number
    password: number
    mobile: number
    city: number
    profileUrl: number
    createdAt: number
    stripeCustomerId: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    firebaseUid?: true
    name?: true
    email?: true
    role?: true
    password?: true
    mobile?: true
    city?: true
    profileUrl?: true
    createdAt?: true
    stripeCustomerId?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    firebaseUid?: true
    name?: true
    email?: true
    role?: true
    password?: true
    mobile?: true
    city?: true
    profileUrl?: true
    createdAt?: true
    stripeCustomerId?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    firebaseUid?: true
    name?: true
    email?: true
    role?: true
    password?: true
    mobile?: true
    city?: true
    profileUrl?: true
    createdAt?: true
    stripeCustomerId?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    firebaseUid: string
    name: string
    email: string
    role: $Enums.Role
    password: string | null
    mobile: string | null
    city: string | null
    profileUrl: string | null
    createdAt: Date
    stripeCustomerId: string | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firebaseUid?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    password?: boolean
    mobile?: boolean
    city?: boolean
    profileUrl?: boolean
    createdAt?: boolean
    stripeCustomerId?: boolean
    auctions?: boolean | User$auctionsArgs<ExtArgs>
    joinedAuctions?: boolean | User$joinedAuctionsArgs<ExtArgs>
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    feedback?: boolean | User$feedbackArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firebaseUid?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    password?: boolean
    mobile?: boolean
    city?: boolean
    profileUrl?: boolean
    createdAt?: boolean
    stripeCustomerId?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firebaseUid?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    password?: boolean
    mobile?: boolean
    city?: boolean
    profileUrl?: boolean
    createdAt?: boolean
    stripeCustomerId?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    firebaseUid?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    password?: boolean
    mobile?: boolean
    city?: boolean
    profileUrl?: boolean
    createdAt?: boolean
    stripeCustomerId?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "firebaseUid" | "name" | "email" | "role" | "password" | "mobile" | "city" | "profileUrl" | "createdAt" | "stripeCustomerId", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auctions?: boolean | User$auctionsArgs<ExtArgs>
    joinedAuctions?: boolean | User$joinedAuctionsArgs<ExtArgs>
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    feedback?: boolean | User$feedbackArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      auctions: Prisma.$AuctionPayload<ExtArgs>[]
      joinedAuctions: Prisma.$JoinedAuctionPayload<ExtArgs>[]
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
      feedback: Prisma.$FeedbackPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      firebaseUid: string
      name: string
      email: string
      role: $Enums.Role
      password: string | null
      mobile: string | null
      city: string | null
      profileUrl: string | null
      createdAt: Date
      stripeCustomerId: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    auctions<T extends User$auctionsArgs<ExtArgs> = {}>(args?: Subset<T, User$auctionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    joinedAuctions<T extends User$joinedAuctionsArgs<ExtArgs> = {}>(args?: Subset<T, User$joinedAuctionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JoinedAuctionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    auditLogs<T extends User$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    feedback<T extends User$feedbackArgs<ExtArgs> = {}>(args?: Subset<T, User$feedbackArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly firebaseUid: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly password: FieldRef<"User", 'String'>
    readonly mobile: FieldRef<"User", 'String'>
    readonly city: FieldRef<"User", 'String'>
    readonly profileUrl: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly stripeCustomerId: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.auctions
   */
  export type User$auctionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInclude<ExtArgs> | null
    where?: AuctionWhereInput
    orderBy?: AuctionOrderByWithRelationInput | AuctionOrderByWithRelationInput[]
    cursor?: AuctionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuctionScalarFieldEnum | AuctionScalarFieldEnum[]
  }

  /**
   * User.joinedAuctions
   */
  export type User$joinedAuctionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinedAuction
     */
    select?: JoinedAuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JoinedAuction
     */
    omit?: JoinedAuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinedAuctionInclude<ExtArgs> | null
    where?: JoinedAuctionWhereInput
    orderBy?: JoinedAuctionOrderByWithRelationInput | JoinedAuctionOrderByWithRelationInput[]
    cursor?: JoinedAuctionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JoinedAuctionScalarFieldEnum | JoinedAuctionScalarFieldEnum[]
  }

  /**
   * User.auditLogs
   */
  export type User$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * User.feedback
   */
  export type User$feedbackArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    where?: FeedbackWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Auction
   */

  export type AggregateAuction = {
    _count: AuctionCountAggregateOutputType | null
    _avg: AuctionAvgAggregateOutputType | null
    _sum: AuctionSumAggregateOutputType | null
    _min: AuctionMinAggregateOutputType | null
    _max: AuctionMaxAggregateOutputType | null
  }

  export type AuctionAvgAggregateOutputType = {
    budgetPerTeam: Decimal | null
    minBid: Decimal | null
    bidIncrease: Decimal | null
    minPlayersPerTeam: number | null
    maxPlayersPerTeam: number | null
    boosterAmount: number | null
    boosterTriggerPlayerCount: number | null
  }

  export type AuctionSumAggregateOutputType = {
    budgetPerTeam: Decimal | null
    minBid: Decimal | null
    bidIncrease: Decimal | null
    minPlayersPerTeam: number | null
    maxPlayersPerTeam: number | null
    boosterAmount: number | null
    boosterTriggerPlayerCount: number | null
  }

  export type AuctionMinAggregateOutputType = {
    id: string | null
    auctionCode: string | null
    organizerId: string | null
    name: string | null
    location: string | null
    logo: string | null
    sportsType: string | null
    season: string | null
    auctionDate: Date | null
    auctionStartTime: string | null
    budgetPerTeam: Decimal | null
    minBid: Decimal | null
    bidIncrease: Decimal | null
    minPlayersPerTeam: number | null
    maxPlayersPerTeam: number | null
    isBoosterEnabled: boolean | null
    boosterAmount: number | null
    boosterTriggerPlayerCount: number | null
    planTier: $Enums.PlanTier | null
    isPaid: boolean | null
    razorpayOrderId: string | null
    razorpayPaymentId: string | null
    razorpaySignature: string | null
    status: $Enums.AuctionStatus | null
    liveTheme: string | null
    soldEffect: string | null
    overlayTheme: string | null
    overlayLayout: string | null
    createdAt: Date | null
    ArchivedAt: Date | null
  }

  export type AuctionMaxAggregateOutputType = {
    id: string | null
    auctionCode: string | null
    organizerId: string | null
    name: string | null
    location: string | null
    logo: string | null
    sportsType: string | null
    season: string | null
    auctionDate: Date | null
    auctionStartTime: string | null
    budgetPerTeam: Decimal | null
    minBid: Decimal | null
    bidIncrease: Decimal | null
    minPlayersPerTeam: number | null
    maxPlayersPerTeam: number | null
    isBoosterEnabled: boolean | null
    boosterAmount: number | null
    boosterTriggerPlayerCount: number | null
    planTier: $Enums.PlanTier | null
    isPaid: boolean | null
    razorpayOrderId: string | null
    razorpayPaymentId: string | null
    razorpaySignature: string | null
    status: $Enums.AuctionStatus | null
    liveTheme: string | null
    soldEffect: string | null
    overlayTheme: string | null
    overlayLayout: string | null
    createdAt: Date | null
    ArchivedAt: Date | null
  }

  export type AuctionCountAggregateOutputType = {
    id: number
    auctionCode: number
    organizerId: number
    name: number
    location: number
    logo: number
    sportsType: number
    season: number
    auctionDate: number
    auctionStartTime: number
    budgetPerTeam: number
    minBid: number
    bidIncrease: number
    minPlayersPerTeam: number
    maxPlayersPerTeam: number
    isBoosterEnabled: number
    boosterAmount: number
    boosterTriggerPlayerCount: number
    bidRules: number
    planTier: number
    isPaid: number
    razorpayOrderId: number
    razorpayPaymentId: number
    razorpaySignature: number
    status: number
    liveTheme: number
    soldEffect: number
    overlayTheme: number
    overlayLayout: number
    createdAt: number
    ArchivedAt: number
    _all: number
  }


  export type AuctionAvgAggregateInputType = {
    budgetPerTeam?: true
    minBid?: true
    bidIncrease?: true
    minPlayersPerTeam?: true
    maxPlayersPerTeam?: true
    boosterAmount?: true
    boosterTriggerPlayerCount?: true
  }

  export type AuctionSumAggregateInputType = {
    budgetPerTeam?: true
    minBid?: true
    bidIncrease?: true
    minPlayersPerTeam?: true
    maxPlayersPerTeam?: true
    boosterAmount?: true
    boosterTriggerPlayerCount?: true
  }

  export type AuctionMinAggregateInputType = {
    id?: true
    auctionCode?: true
    organizerId?: true
    name?: true
    location?: true
    logo?: true
    sportsType?: true
    season?: true
    auctionDate?: true
    auctionStartTime?: true
    budgetPerTeam?: true
    minBid?: true
    bidIncrease?: true
    minPlayersPerTeam?: true
    maxPlayersPerTeam?: true
    isBoosterEnabled?: true
    boosterAmount?: true
    boosterTriggerPlayerCount?: true
    planTier?: true
    isPaid?: true
    razorpayOrderId?: true
    razorpayPaymentId?: true
    razorpaySignature?: true
    status?: true
    liveTheme?: true
    soldEffect?: true
    overlayTheme?: true
    overlayLayout?: true
    createdAt?: true
    ArchivedAt?: true
  }

  export type AuctionMaxAggregateInputType = {
    id?: true
    auctionCode?: true
    organizerId?: true
    name?: true
    location?: true
    logo?: true
    sportsType?: true
    season?: true
    auctionDate?: true
    auctionStartTime?: true
    budgetPerTeam?: true
    minBid?: true
    bidIncrease?: true
    minPlayersPerTeam?: true
    maxPlayersPerTeam?: true
    isBoosterEnabled?: true
    boosterAmount?: true
    boosterTriggerPlayerCount?: true
    planTier?: true
    isPaid?: true
    razorpayOrderId?: true
    razorpayPaymentId?: true
    razorpaySignature?: true
    status?: true
    liveTheme?: true
    soldEffect?: true
    overlayTheme?: true
    overlayLayout?: true
    createdAt?: true
    ArchivedAt?: true
  }

  export type AuctionCountAggregateInputType = {
    id?: true
    auctionCode?: true
    organizerId?: true
    name?: true
    location?: true
    logo?: true
    sportsType?: true
    season?: true
    auctionDate?: true
    auctionStartTime?: true
    budgetPerTeam?: true
    minBid?: true
    bidIncrease?: true
    minPlayersPerTeam?: true
    maxPlayersPerTeam?: true
    isBoosterEnabled?: true
    boosterAmount?: true
    boosterTriggerPlayerCount?: true
    bidRules?: true
    planTier?: true
    isPaid?: true
    razorpayOrderId?: true
    razorpayPaymentId?: true
    razorpaySignature?: true
    status?: true
    liveTheme?: true
    soldEffect?: true
    overlayTheme?: true
    overlayLayout?: true
    createdAt?: true
    ArchivedAt?: true
    _all?: true
  }

  export type AuctionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Auction to aggregate.
     */
    where?: AuctionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auctions to fetch.
     */
    orderBy?: AuctionOrderByWithRelationInput | AuctionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuctionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auctions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auctions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Auctions
    **/
    _count?: true | AuctionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuctionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuctionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuctionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuctionMaxAggregateInputType
  }

  export type GetAuctionAggregateType<T extends AuctionAggregateArgs> = {
        [P in keyof T & keyof AggregateAuction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuction[P]>
      : GetScalarType<T[P], AggregateAuction[P]>
  }




  export type AuctionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuctionWhereInput
    orderBy?: AuctionOrderByWithAggregationInput | AuctionOrderByWithAggregationInput[]
    by: AuctionScalarFieldEnum[] | AuctionScalarFieldEnum
    having?: AuctionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuctionCountAggregateInputType | true
    _avg?: AuctionAvgAggregateInputType
    _sum?: AuctionSumAggregateInputType
    _min?: AuctionMinAggregateInputType
    _max?: AuctionMaxAggregateInputType
  }

  export type AuctionGroupByOutputType = {
    id: string
    auctionCode: string
    organizerId: string
    name: string
    location: string | null
    logo: string | null
    sportsType: string
    season: string | null
    auctionDate: Date
    auctionStartTime: string | null
    budgetPerTeam: Decimal
    minBid: Decimal
    bidIncrease: Decimal
    minPlayersPerTeam: number
    maxPlayersPerTeam: number
    isBoosterEnabled: boolean
    boosterAmount: number | null
    boosterTriggerPlayerCount: number | null
    bidRules: JsonValue | null
    planTier: $Enums.PlanTier
    isPaid: boolean
    razorpayOrderId: string | null
    razorpayPaymentId: string | null
    razorpaySignature: string | null
    status: $Enums.AuctionStatus
    liveTheme: string
    soldEffect: string
    overlayTheme: string
    overlayLayout: string
    createdAt: Date
    ArchivedAt: Date | null
    _count: AuctionCountAggregateOutputType | null
    _avg: AuctionAvgAggregateOutputType | null
    _sum: AuctionSumAggregateOutputType | null
    _min: AuctionMinAggregateOutputType | null
    _max: AuctionMaxAggregateOutputType | null
  }

  type GetAuctionGroupByPayload<T extends AuctionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuctionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuctionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuctionGroupByOutputType[P]>
            : GetScalarType<T[P], AuctionGroupByOutputType[P]>
        }
      >
    >


  export type AuctionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    auctionCode?: boolean
    organizerId?: boolean
    name?: boolean
    location?: boolean
    logo?: boolean
    sportsType?: boolean
    season?: boolean
    auctionDate?: boolean
    auctionStartTime?: boolean
    budgetPerTeam?: boolean
    minBid?: boolean
    bidIncrease?: boolean
    minPlayersPerTeam?: boolean
    maxPlayersPerTeam?: boolean
    isBoosterEnabled?: boolean
    boosterAmount?: boolean
    boosterTriggerPlayerCount?: boolean
    bidRules?: boolean
    planTier?: boolean
    isPaid?: boolean
    razorpayOrderId?: boolean
    razorpayPaymentId?: boolean
    razorpaySignature?: boolean
    status?: boolean
    liveTheme?: boolean
    soldEffect?: boolean
    overlayTheme?: boolean
    overlayLayout?: boolean
    createdAt?: boolean
    ArchivedAt?: boolean
    organizer?: boolean | UserDefaultArgs<ExtArgs>
    teams?: boolean | Auction$teamsArgs<ExtArgs>
    players?: boolean | Auction$playersArgs<ExtArgs>
    categories?: boolean | Auction$categoriesArgs<ExtArgs>
    bidhistories?: boolean | Auction$bidhistoriesArgs<ExtArgs>
    AuctionInsight?: boolean | Auction$AuctionInsightArgs<ExtArgs>
    joinedAuctions?: boolean | Auction$joinedAuctionsArgs<ExtArgs>
    _count?: boolean | AuctionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auction"]>

  export type AuctionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    auctionCode?: boolean
    organizerId?: boolean
    name?: boolean
    location?: boolean
    logo?: boolean
    sportsType?: boolean
    season?: boolean
    auctionDate?: boolean
    auctionStartTime?: boolean
    budgetPerTeam?: boolean
    minBid?: boolean
    bidIncrease?: boolean
    minPlayersPerTeam?: boolean
    maxPlayersPerTeam?: boolean
    isBoosterEnabled?: boolean
    boosterAmount?: boolean
    boosterTriggerPlayerCount?: boolean
    bidRules?: boolean
    planTier?: boolean
    isPaid?: boolean
    razorpayOrderId?: boolean
    razorpayPaymentId?: boolean
    razorpaySignature?: boolean
    status?: boolean
    liveTheme?: boolean
    soldEffect?: boolean
    overlayTheme?: boolean
    overlayLayout?: boolean
    createdAt?: boolean
    ArchivedAt?: boolean
    organizer?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auction"]>

  export type AuctionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    auctionCode?: boolean
    organizerId?: boolean
    name?: boolean
    location?: boolean
    logo?: boolean
    sportsType?: boolean
    season?: boolean
    auctionDate?: boolean
    auctionStartTime?: boolean
    budgetPerTeam?: boolean
    minBid?: boolean
    bidIncrease?: boolean
    minPlayersPerTeam?: boolean
    maxPlayersPerTeam?: boolean
    isBoosterEnabled?: boolean
    boosterAmount?: boolean
    boosterTriggerPlayerCount?: boolean
    bidRules?: boolean
    planTier?: boolean
    isPaid?: boolean
    razorpayOrderId?: boolean
    razorpayPaymentId?: boolean
    razorpaySignature?: boolean
    status?: boolean
    liveTheme?: boolean
    soldEffect?: boolean
    overlayTheme?: boolean
    overlayLayout?: boolean
    createdAt?: boolean
    ArchivedAt?: boolean
    organizer?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auction"]>

  export type AuctionSelectScalar = {
    id?: boolean
    auctionCode?: boolean
    organizerId?: boolean
    name?: boolean
    location?: boolean
    logo?: boolean
    sportsType?: boolean
    season?: boolean
    auctionDate?: boolean
    auctionStartTime?: boolean
    budgetPerTeam?: boolean
    minBid?: boolean
    bidIncrease?: boolean
    minPlayersPerTeam?: boolean
    maxPlayersPerTeam?: boolean
    isBoosterEnabled?: boolean
    boosterAmount?: boolean
    boosterTriggerPlayerCount?: boolean
    bidRules?: boolean
    planTier?: boolean
    isPaid?: boolean
    razorpayOrderId?: boolean
    razorpayPaymentId?: boolean
    razorpaySignature?: boolean
    status?: boolean
    liveTheme?: boolean
    soldEffect?: boolean
    overlayTheme?: boolean
    overlayLayout?: boolean
    createdAt?: boolean
    ArchivedAt?: boolean
  }

  export type AuctionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "auctionCode" | "organizerId" | "name" | "location" | "logo" | "sportsType" | "season" | "auctionDate" | "auctionStartTime" | "budgetPerTeam" | "minBid" | "bidIncrease" | "minPlayersPerTeam" | "maxPlayersPerTeam" | "isBoosterEnabled" | "boosterAmount" | "boosterTriggerPlayerCount" | "bidRules" | "planTier" | "isPaid" | "razorpayOrderId" | "razorpayPaymentId" | "razorpaySignature" | "status" | "liveTheme" | "soldEffect" | "overlayTheme" | "overlayLayout" | "createdAt" | "ArchivedAt", ExtArgs["result"]["auction"]>
  export type AuctionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organizer?: boolean | UserDefaultArgs<ExtArgs>
    teams?: boolean | Auction$teamsArgs<ExtArgs>
    players?: boolean | Auction$playersArgs<ExtArgs>
    categories?: boolean | Auction$categoriesArgs<ExtArgs>
    bidhistories?: boolean | Auction$bidhistoriesArgs<ExtArgs>
    AuctionInsight?: boolean | Auction$AuctionInsightArgs<ExtArgs>
    joinedAuctions?: boolean | Auction$joinedAuctionsArgs<ExtArgs>
    _count?: boolean | AuctionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AuctionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organizer?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AuctionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organizer?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AuctionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Auction"
    objects: {
      organizer: Prisma.$UserPayload<ExtArgs>
      teams: Prisma.$TeamPayload<ExtArgs>[]
      players: Prisma.$PlayerPayload<ExtArgs>[]
      categories: Prisma.$CategoryPayload<ExtArgs>[]
      bidhistories: Prisma.$BidHistoryPayload<ExtArgs>[]
      AuctionInsight: Prisma.$AuctionInsightPayload<ExtArgs> | null
      joinedAuctions: Prisma.$JoinedAuctionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      auctionCode: string
      organizerId: string
      name: string
      location: string | null
      logo: string | null
      sportsType: string
      season: string | null
      auctionDate: Date
      auctionStartTime: string | null
      budgetPerTeam: Prisma.Decimal
      minBid: Prisma.Decimal
      bidIncrease: Prisma.Decimal
      minPlayersPerTeam: number
      maxPlayersPerTeam: number
      isBoosterEnabled: boolean
      boosterAmount: number | null
      boosterTriggerPlayerCount: number | null
      bidRules: Prisma.JsonValue | null
      planTier: $Enums.PlanTier
      isPaid: boolean
      razorpayOrderId: string | null
      razorpayPaymentId: string | null
      razorpaySignature: string | null
      status: $Enums.AuctionStatus
      liveTheme: string
      soldEffect: string
      overlayTheme: string
      overlayLayout: string
      createdAt: Date
      ArchivedAt: Date | null
    }, ExtArgs["result"]["auction"]>
    composites: {}
  }

  type AuctionGetPayload<S extends boolean | null | undefined | AuctionDefaultArgs> = $Result.GetResult<Prisma.$AuctionPayload, S>

  type AuctionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuctionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuctionCountAggregateInputType | true
    }

  export interface AuctionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Auction'], meta: { name: 'Auction' } }
    /**
     * Find zero or one Auction that matches the filter.
     * @param {AuctionFindUniqueArgs} args - Arguments to find a Auction
     * @example
     * // Get one Auction
     * const auction = await prisma.auction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuctionFindUniqueArgs>(args: SelectSubset<T, AuctionFindUniqueArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Auction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuctionFindUniqueOrThrowArgs} args - Arguments to find a Auction
     * @example
     * // Get one Auction
     * const auction = await prisma.auction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuctionFindUniqueOrThrowArgs>(args: SelectSubset<T, AuctionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Auction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionFindFirstArgs} args - Arguments to find a Auction
     * @example
     * // Get one Auction
     * const auction = await prisma.auction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuctionFindFirstArgs>(args?: SelectSubset<T, AuctionFindFirstArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Auction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionFindFirstOrThrowArgs} args - Arguments to find a Auction
     * @example
     * // Get one Auction
     * const auction = await prisma.auction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuctionFindFirstOrThrowArgs>(args?: SelectSubset<T, AuctionFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Auctions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Auctions
     * const auctions = await prisma.auction.findMany()
     * 
     * // Get first 10 Auctions
     * const auctions = await prisma.auction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auctionWithIdOnly = await prisma.auction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuctionFindManyArgs>(args?: SelectSubset<T, AuctionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Auction.
     * @param {AuctionCreateArgs} args - Arguments to create a Auction.
     * @example
     * // Create one Auction
     * const Auction = await prisma.auction.create({
     *   data: {
     *     // ... data to create a Auction
     *   }
     * })
     * 
     */
    create<T extends AuctionCreateArgs>(args: SelectSubset<T, AuctionCreateArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Auctions.
     * @param {AuctionCreateManyArgs} args - Arguments to create many Auctions.
     * @example
     * // Create many Auctions
     * const auction = await prisma.auction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuctionCreateManyArgs>(args?: SelectSubset<T, AuctionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Auctions and returns the data saved in the database.
     * @param {AuctionCreateManyAndReturnArgs} args - Arguments to create many Auctions.
     * @example
     * // Create many Auctions
     * const auction = await prisma.auction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Auctions and only return the `id`
     * const auctionWithIdOnly = await prisma.auction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuctionCreateManyAndReturnArgs>(args?: SelectSubset<T, AuctionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Auction.
     * @param {AuctionDeleteArgs} args - Arguments to delete one Auction.
     * @example
     * // Delete one Auction
     * const Auction = await prisma.auction.delete({
     *   where: {
     *     // ... filter to delete one Auction
     *   }
     * })
     * 
     */
    delete<T extends AuctionDeleteArgs>(args: SelectSubset<T, AuctionDeleteArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Auction.
     * @param {AuctionUpdateArgs} args - Arguments to update one Auction.
     * @example
     * // Update one Auction
     * const auction = await prisma.auction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuctionUpdateArgs>(args: SelectSubset<T, AuctionUpdateArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Auctions.
     * @param {AuctionDeleteManyArgs} args - Arguments to filter Auctions to delete.
     * @example
     * // Delete a few Auctions
     * const { count } = await prisma.auction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuctionDeleteManyArgs>(args?: SelectSubset<T, AuctionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Auctions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Auctions
     * const auction = await prisma.auction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuctionUpdateManyArgs>(args: SelectSubset<T, AuctionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Auctions and returns the data updated in the database.
     * @param {AuctionUpdateManyAndReturnArgs} args - Arguments to update many Auctions.
     * @example
     * // Update many Auctions
     * const auction = await prisma.auction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Auctions and only return the `id`
     * const auctionWithIdOnly = await prisma.auction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuctionUpdateManyAndReturnArgs>(args: SelectSubset<T, AuctionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Auction.
     * @param {AuctionUpsertArgs} args - Arguments to update or create a Auction.
     * @example
     * // Update or create a Auction
     * const auction = await prisma.auction.upsert({
     *   create: {
     *     // ... data to create a Auction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Auction we want to update
     *   }
     * })
     */
    upsert<T extends AuctionUpsertArgs>(args: SelectSubset<T, AuctionUpsertArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Auctions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionCountArgs} args - Arguments to filter Auctions to count.
     * @example
     * // Count the number of Auctions
     * const count = await prisma.auction.count({
     *   where: {
     *     // ... the filter for the Auctions we want to count
     *   }
     * })
    **/
    count<T extends AuctionCountArgs>(
      args?: Subset<T, AuctionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuctionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Auction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuctionAggregateArgs>(args: Subset<T, AuctionAggregateArgs>): Prisma.PrismaPromise<GetAuctionAggregateType<T>>

    /**
     * Group by Auction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuctionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuctionGroupByArgs['orderBy'] }
        : { orderBy?: AuctionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuctionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuctionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Auction model
   */
  readonly fields: AuctionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Auction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuctionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organizer<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    teams<T extends Auction$teamsArgs<ExtArgs> = {}>(args?: Subset<T, Auction$teamsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    players<T extends Auction$playersArgs<ExtArgs> = {}>(args?: Subset<T, Auction$playersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    categories<T extends Auction$categoriesArgs<ExtArgs> = {}>(args?: Subset<T, Auction$categoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    bidhistories<T extends Auction$bidhistoriesArgs<ExtArgs> = {}>(args?: Subset<T, Auction$bidhistoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BidHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    AuctionInsight<T extends Auction$AuctionInsightArgs<ExtArgs> = {}>(args?: Subset<T, Auction$AuctionInsightArgs<ExtArgs>>): Prisma__AuctionInsightClient<$Result.GetResult<Prisma.$AuctionInsightPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    joinedAuctions<T extends Auction$joinedAuctionsArgs<ExtArgs> = {}>(args?: Subset<T, Auction$joinedAuctionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JoinedAuctionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Auction model
   */
  interface AuctionFieldRefs {
    readonly id: FieldRef<"Auction", 'String'>
    readonly auctionCode: FieldRef<"Auction", 'String'>
    readonly organizerId: FieldRef<"Auction", 'String'>
    readonly name: FieldRef<"Auction", 'String'>
    readonly location: FieldRef<"Auction", 'String'>
    readonly logo: FieldRef<"Auction", 'String'>
    readonly sportsType: FieldRef<"Auction", 'String'>
    readonly season: FieldRef<"Auction", 'String'>
    readonly auctionDate: FieldRef<"Auction", 'DateTime'>
    readonly auctionStartTime: FieldRef<"Auction", 'String'>
    readonly budgetPerTeam: FieldRef<"Auction", 'Decimal'>
    readonly minBid: FieldRef<"Auction", 'Decimal'>
    readonly bidIncrease: FieldRef<"Auction", 'Decimal'>
    readonly minPlayersPerTeam: FieldRef<"Auction", 'Int'>
    readonly maxPlayersPerTeam: FieldRef<"Auction", 'Int'>
    readonly isBoosterEnabled: FieldRef<"Auction", 'Boolean'>
    readonly boosterAmount: FieldRef<"Auction", 'Int'>
    readonly boosterTriggerPlayerCount: FieldRef<"Auction", 'Int'>
    readonly bidRules: FieldRef<"Auction", 'Json'>
    readonly planTier: FieldRef<"Auction", 'PlanTier'>
    readonly isPaid: FieldRef<"Auction", 'Boolean'>
    readonly razorpayOrderId: FieldRef<"Auction", 'String'>
    readonly razorpayPaymentId: FieldRef<"Auction", 'String'>
    readonly razorpaySignature: FieldRef<"Auction", 'String'>
    readonly status: FieldRef<"Auction", 'AuctionStatus'>
    readonly liveTheme: FieldRef<"Auction", 'String'>
    readonly soldEffect: FieldRef<"Auction", 'String'>
    readonly overlayTheme: FieldRef<"Auction", 'String'>
    readonly overlayLayout: FieldRef<"Auction", 'String'>
    readonly createdAt: FieldRef<"Auction", 'DateTime'>
    readonly ArchivedAt: FieldRef<"Auction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Auction findUnique
   */
  export type AuctionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInclude<ExtArgs> | null
    /**
     * Filter, which Auction to fetch.
     */
    where: AuctionWhereUniqueInput
  }

  /**
   * Auction findUniqueOrThrow
   */
  export type AuctionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInclude<ExtArgs> | null
    /**
     * Filter, which Auction to fetch.
     */
    where: AuctionWhereUniqueInput
  }

  /**
   * Auction findFirst
   */
  export type AuctionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInclude<ExtArgs> | null
    /**
     * Filter, which Auction to fetch.
     */
    where?: AuctionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auctions to fetch.
     */
    orderBy?: AuctionOrderByWithRelationInput | AuctionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Auctions.
     */
    cursor?: AuctionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auctions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auctions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Auctions.
     */
    distinct?: AuctionScalarFieldEnum | AuctionScalarFieldEnum[]
  }

  /**
   * Auction findFirstOrThrow
   */
  export type AuctionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInclude<ExtArgs> | null
    /**
     * Filter, which Auction to fetch.
     */
    where?: AuctionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auctions to fetch.
     */
    orderBy?: AuctionOrderByWithRelationInput | AuctionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Auctions.
     */
    cursor?: AuctionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auctions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auctions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Auctions.
     */
    distinct?: AuctionScalarFieldEnum | AuctionScalarFieldEnum[]
  }

  /**
   * Auction findMany
   */
  export type AuctionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInclude<ExtArgs> | null
    /**
     * Filter, which Auctions to fetch.
     */
    where?: AuctionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auctions to fetch.
     */
    orderBy?: AuctionOrderByWithRelationInput | AuctionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Auctions.
     */
    cursor?: AuctionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auctions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auctions.
     */
    skip?: number
    distinct?: AuctionScalarFieldEnum | AuctionScalarFieldEnum[]
  }

  /**
   * Auction create
   */
  export type AuctionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInclude<ExtArgs> | null
    /**
     * The data needed to create a Auction.
     */
    data: XOR<AuctionCreateInput, AuctionUncheckedCreateInput>
  }

  /**
   * Auction createMany
   */
  export type AuctionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Auctions.
     */
    data: AuctionCreateManyInput | AuctionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Auction createManyAndReturn
   */
  export type AuctionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * The data used to create many Auctions.
     */
    data: AuctionCreateManyInput | AuctionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Auction update
   */
  export type AuctionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInclude<ExtArgs> | null
    /**
     * The data needed to update a Auction.
     */
    data: XOR<AuctionUpdateInput, AuctionUncheckedUpdateInput>
    /**
     * Choose, which Auction to update.
     */
    where: AuctionWhereUniqueInput
  }

  /**
   * Auction updateMany
   */
  export type AuctionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Auctions.
     */
    data: XOR<AuctionUpdateManyMutationInput, AuctionUncheckedUpdateManyInput>
    /**
     * Filter which Auctions to update
     */
    where?: AuctionWhereInput
    /**
     * Limit how many Auctions to update.
     */
    limit?: number
  }

  /**
   * Auction updateManyAndReturn
   */
  export type AuctionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * The data used to update Auctions.
     */
    data: XOR<AuctionUpdateManyMutationInput, AuctionUncheckedUpdateManyInput>
    /**
     * Filter which Auctions to update
     */
    where?: AuctionWhereInput
    /**
     * Limit how many Auctions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Auction upsert
   */
  export type AuctionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInclude<ExtArgs> | null
    /**
     * The filter to search for the Auction to update in case it exists.
     */
    where: AuctionWhereUniqueInput
    /**
     * In case the Auction found by the `where` argument doesn't exist, create a new Auction with this data.
     */
    create: XOR<AuctionCreateInput, AuctionUncheckedCreateInput>
    /**
     * In case the Auction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuctionUpdateInput, AuctionUncheckedUpdateInput>
  }

  /**
   * Auction delete
   */
  export type AuctionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInclude<ExtArgs> | null
    /**
     * Filter which Auction to delete.
     */
    where: AuctionWhereUniqueInput
  }

  /**
   * Auction deleteMany
   */
  export type AuctionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Auctions to delete
     */
    where?: AuctionWhereInput
    /**
     * Limit how many Auctions to delete.
     */
    limit?: number
  }

  /**
   * Auction.teams
   */
  export type Auction$teamsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    where?: TeamWhereInput
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    cursor?: TeamWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Auction.players
   */
  export type Auction$playersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    where?: PlayerWhereInput
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    cursor?: PlayerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Auction.categories
   */
  export type Auction$categoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    cursor?: CategoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Auction.bidhistories
   */
  export type Auction$bidhistoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BidHistory
     */
    select?: BidHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BidHistory
     */
    omit?: BidHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidHistoryInclude<ExtArgs> | null
    where?: BidHistoryWhereInput
    orderBy?: BidHistoryOrderByWithRelationInput | BidHistoryOrderByWithRelationInput[]
    cursor?: BidHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BidHistoryScalarFieldEnum | BidHistoryScalarFieldEnum[]
  }

  /**
   * Auction.AuctionInsight
   */
  export type Auction$AuctionInsightArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionInsight
     */
    select?: AuctionInsightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionInsight
     */
    omit?: AuctionInsightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInsightInclude<ExtArgs> | null
    where?: AuctionInsightWhereInput
  }

  /**
   * Auction.joinedAuctions
   */
  export type Auction$joinedAuctionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinedAuction
     */
    select?: JoinedAuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JoinedAuction
     */
    omit?: JoinedAuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinedAuctionInclude<ExtArgs> | null
    where?: JoinedAuctionWhereInput
    orderBy?: JoinedAuctionOrderByWithRelationInput | JoinedAuctionOrderByWithRelationInput[]
    cursor?: JoinedAuctionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JoinedAuctionScalarFieldEnum | JoinedAuctionScalarFieldEnum[]
  }

  /**
   * Auction without action
   */
  export type AuctionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auction
     */
    select?: AuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auction
     */
    omit?: AuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInclude<ExtArgs> | null
  }


  /**
   * Model JoinedAuction
   */

  export type AggregateJoinedAuction = {
    _count: JoinedAuctionCountAggregateOutputType | null
    _min: JoinedAuctionMinAggregateOutputType | null
    _max: JoinedAuctionMaxAggregateOutputType | null
  }

  export type JoinedAuctionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    auctionId: string | null
    joinedAt: Date | null
  }

  export type JoinedAuctionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    auctionId: string | null
    joinedAt: Date | null
  }

  export type JoinedAuctionCountAggregateOutputType = {
    id: number
    userId: number
    auctionId: number
    joinedAt: number
    _all: number
  }


  export type JoinedAuctionMinAggregateInputType = {
    id?: true
    userId?: true
    auctionId?: true
    joinedAt?: true
  }

  export type JoinedAuctionMaxAggregateInputType = {
    id?: true
    userId?: true
    auctionId?: true
    joinedAt?: true
  }

  export type JoinedAuctionCountAggregateInputType = {
    id?: true
    userId?: true
    auctionId?: true
    joinedAt?: true
    _all?: true
  }

  export type JoinedAuctionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JoinedAuction to aggregate.
     */
    where?: JoinedAuctionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JoinedAuctions to fetch.
     */
    orderBy?: JoinedAuctionOrderByWithRelationInput | JoinedAuctionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JoinedAuctionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JoinedAuctions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JoinedAuctions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned JoinedAuctions
    **/
    _count?: true | JoinedAuctionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JoinedAuctionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JoinedAuctionMaxAggregateInputType
  }

  export type GetJoinedAuctionAggregateType<T extends JoinedAuctionAggregateArgs> = {
        [P in keyof T & keyof AggregateJoinedAuction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJoinedAuction[P]>
      : GetScalarType<T[P], AggregateJoinedAuction[P]>
  }




  export type JoinedAuctionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JoinedAuctionWhereInput
    orderBy?: JoinedAuctionOrderByWithAggregationInput | JoinedAuctionOrderByWithAggregationInput[]
    by: JoinedAuctionScalarFieldEnum[] | JoinedAuctionScalarFieldEnum
    having?: JoinedAuctionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JoinedAuctionCountAggregateInputType | true
    _min?: JoinedAuctionMinAggregateInputType
    _max?: JoinedAuctionMaxAggregateInputType
  }

  export type JoinedAuctionGroupByOutputType = {
    id: string
    userId: string
    auctionId: string
    joinedAt: Date
    _count: JoinedAuctionCountAggregateOutputType | null
    _min: JoinedAuctionMinAggregateOutputType | null
    _max: JoinedAuctionMaxAggregateOutputType | null
  }

  type GetJoinedAuctionGroupByPayload<T extends JoinedAuctionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JoinedAuctionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JoinedAuctionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JoinedAuctionGroupByOutputType[P]>
            : GetScalarType<T[P], JoinedAuctionGroupByOutputType[P]>
        }
      >
    >


  export type JoinedAuctionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    auctionId?: boolean
    joinedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["joinedAuction"]>

  export type JoinedAuctionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    auctionId?: boolean
    joinedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["joinedAuction"]>

  export type JoinedAuctionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    auctionId?: boolean
    joinedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["joinedAuction"]>

  export type JoinedAuctionSelectScalar = {
    id?: boolean
    userId?: boolean
    auctionId?: boolean
    joinedAt?: boolean
  }

  export type JoinedAuctionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "auctionId" | "joinedAt", ExtArgs["result"]["joinedAuction"]>
  export type JoinedAuctionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }
  export type JoinedAuctionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }
  export type JoinedAuctionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }

  export type $JoinedAuctionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "JoinedAuction"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      auction: Prisma.$AuctionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      auctionId: string
      joinedAt: Date
    }, ExtArgs["result"]["joinedAuction"]>
    composites: {}
  }

  type JoinedAuctionGetPayload<S extends boolean | null | undefined | JoinedAuctionDefaultArgs> = $Result.GetResult<Prisma.$JoinedAuctionPayload, S>

  type JoinedAuctionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<JoinedAuctionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: JoinedAuctionCountAggregateInputType | true
    }

  export interface JoinedAuctionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['JoinedAuction'], meta: { name: 'JoinedAuction' } }
    /**
     * Find zero or one JoinedAuction that matches the filter.
     * @param {JoinedAuctionFindUniqueArgs} args - Arguments to find a JoinedAuction
     * @example
     * // Get one JoinedAuction
     * const joinedAuction = await prisma.joinedAuction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JoinedAuctionFindUniqueArgs>(args: SelectSubset<T, JoinedAuctionFindUniqueArgs<ExtArgs>>): Prisma__JoinedAuctionClient<$Result.GetResult<Prisma.$JoinedAuctionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one JoinedAuction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {JoinedAuctionFindUniqueOrThrowArgs} args - Arguments to find a JoinedAuction
     * @example
     * // Get one JoinedAuction
     * const joinedAuction = await prisma.joinedAuction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JoinedAuctionFindUniqueOrThrowArgs>(args: SelectSubset<T, JoinedAuctionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JoinedAuctionClient<$Result.GetResult<Prisma.$JoinedAuctionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JoinedAuction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JoinedAuctionFindFirstArgs} args - Arguments to find a JoinedAuction
     * @example
     * // Get one JoinedAuction
     * const joinedAuction = await prisma.joinedAuction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JoinedAuctionFindFirstArgs>(args?: SelectSubset<T, JoinedAuctionFindFirstArgs<ExtArgs>>): Prisma__JoinedAuctionClient<$Result.GetResult<Prisma.$JoinedAuctionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JoinedAuction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JoinedAuctionFindFirstOrThrowArgs} args - Arguments to find a JoinedAuction
     * @example
     * // Get one JoinedAuction
     * const joinedAuction = await prisma.joinedAuction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JoinedAuctionFindFirstOrThrowArgs>(args?: SelectSubset<T, JoinedAuctionFindFirstOrThrowArgs<ExtArgs>>): Prisma__JoinedAuctionClient<$Result.GetResult<Prisma.$JoinedAuctionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more JoinedAuctions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JoinedAuctionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all JoinedAuctions
     * const joinedAuctions = await prisma.joinedAuction.findMany()
     * 
     * // Get first 10 JoinedAuctions
     * const joinedAuctions = await prisma.joinedAuction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const joinedAuctionWithIdOnly = await prisma.joinedAuction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JoinedAuctionFindManyArgs>(args?: SelectSubset<T, JoinedAuctionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JoinedAuctionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a JoinedAuction.
     * @param {JoinedAuctionCreateArgs} args - Arguments to create a JoinedAuction.
     * @example
     * // Create one JoinedAuction
     * const JoinedAuction = await prisma.joinedAuction.create({
     *   data: {
     *     // ... data to create a JoinedAuction
     *   }
     * })
     * 
     */
    create<T extends JoinedAuctionCreateArgs>(args: SelectSubset<T, JoinedAuctionCreateArgs<ExtArgs>>): Prisma__JoinedAuctionClient<$Result.GetResult<Prisma.$JoinedAuctionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many JoinedAuctions.
     * @param {JoinedAuctionCreateManyArgs} args - Arguments to create many JoinedAuctions.
     * @example
     * // Create many JoinedAuctions
     * const joinedAuction = await prisma.joinedAuction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JoinedAuctionCreateManyArgs>(args?: SelectSubset<T, JoinedAuctionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many JoinedAuctions and returns the data saved in the database.
     * @param {JoinedAuctionCreateManyAndReturnArgs} args - Arguments to create many JoinedAuctions.
     * @example
     * // Create many JoinedAuctions
     * const joinedAuction = await prisma.joinedAuction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many JoinedAuctions and only return the `id`
     * const joinedAuctionWithIdOnly = await prisma.joinedAuction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JoinedAuctionCreateManyAndReturnArgs>(args?: SelectSubset<T, JoinedAuctionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JoinedAuctionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a JoinedAuction.
     * @param {JoinedAuctionDeleteArgs} args - Arguments to delete one JoinedAuction.
     * @example
     * // Delete one JoinedAuction
     * const JoinedAuction = await prisma.joinedAuction.delete({
     *   where: {
     *     // ... filter to delete one JoinedAuction
     *   }
     * })
     * 
     */
    delete<T extends JoinedAuctionDeleteArgs>(args: SelectSubset<T, JoinedAuctionDeleteArgs<ExtArgs>>): Prisma__JoinedAuctionClient<$Result.GetResult<Prisma.$JoinedAuctionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one JoinedAuction.
     * @param {JoinedAuctionUpdateArgs} args - Arguments to update one JoinedAuction.
     * @example
     * // Update one JoinedAuction
     * const joinedAuction = await prisma.joinedAuction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JoinedAuctionUpdateArgs>(args: SelectSubset<T, JoinedAuctionUpdateArgs<ExtArgs>>): Prisma__JoinedAuctionClient<$Result.GetResult<Prisma.$JoinedAuctionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more JoinedAuctions.
     * @param {JoinedAuctionDeleteManyArgs} args - Arguments to filter JoinedAuctions to delete.
     * @example
     * // Delete a few JoinedAuctions
     * const { count } = await prisma.joinedAuction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JoinedAuctionDeleteManyArgs>(args?: SelectSubset<T, JoinedAuctionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JoinedAuctions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JoinedAuctionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many JoinedAuctions
     * const joinedAuction = await prisma.joinedAuction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JoinedAuctionUpdateManyArgs>(args: SelectSubset<T, JoinedAuctionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JoinedAuctions and returns the data updated in the database.
     * @param {JoinedAuctionUpdateManyAndReturnArgs} args - Arguments to update many JoinedAuctions.
     * @example
     * // Update many JoinedAuctions
     * const joinedAuction = await prisma.joinedAuction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more JoinedAuctions and only return the `id`
     * const joinedAuctionWithIdOnly = await prisma.joinedAuction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends JoinedAuctionUpdateManyAndReturnArgs>(args: SelectSubset<T, JoinedAuctionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JoinedAuctionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one JoinedAuction.
     * @param {JoinedAuctionUpsertArgs} args - Arguments to update or create a JoinedAuction.
     * @example
     * // Update or create a JoinedAuction
     * const joinedAuction = await prisma.joinedAuction.upsert({
     *   create: {
     *     // ... data to create a JoinedAuction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the JoinedAuction we want to update
     *   }
     * })
     */
    upsert<T extends JoinedAuctionUpsertArgs>(args: SelectSubset<T, JoinedAuctionUpsertArgs<ExtArgs>>): Prisma__JoinedAuctionClient<$Result.GetResult<Prisma.$JoinedAuctionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of JoinedAuctions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JoinedAuctionCountArgs} args - Arguments to filter JoinedAuctions to count.
     * @example
     * // Count the number of JoinedAuctions
     * const count = await prisma.joinedAuction.count({
     *   where: {
     *     // ... the filter for the JoinedAuctions we want to count
     *   }
     * })
    **/
    count<T extends JoinedAuctionCountArgs>(
      args?: Subset<T, JoinedAuctionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JoinedAuctionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a JoinedAuction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JoinedAuctionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JoinedAuctionAggregateArgs>(args: Subset<T, JoinedAuctionAggregateArgs>): Prisma.PrismaPromise<GetJoinedAuctionAggregateType<T>>

    /**
     * Group by JoinedAuction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JoinedAuctionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JoinedAuctionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JoinedAuctionGroupByArgs['orderBy'] }
        : { orderBy?: JoinedAuctionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JoinedAuctionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJoinedAuctionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the JoinedAuction model
   */
  readonly fields: JoinedAuctionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for JoinedAuction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JoinedAuctionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    auction<T extends AuctionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuctionDefaultArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the JoinedAuction model
   */
  interface JoinedAuctionFieldRefs {
    readonly id: FieldRef<"JoinedAuction", 'String'>
    readonly userId: FieldRef<"JoinedAuction", 'String'>
    readonly auctionId: FieldRef<"JoinedAuction", 'String'>
    readonly joinedAt: FieldRef<"JoinedAuction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * JoinedAuction findUnique
   */
  export type JoinedAuctionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinedAuction
     */
    select?: JoinedAuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JoinedAuction
     */
    omit?: JoinedAuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinedAuctionInclude<ExtArgs> | null
    /**
     * Filter, which JoinedAuction to fetch.
     */
    where: JoinedAuctionWhereUniqueInput
  }

  /**
   * JoinedAuction findUniqueOrThrow
   */
  export type JoinedAuctionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinedAuction
     */
    select?: JoinedAuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JoinedAuction
     */
    omit?: JoinedAuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinedAuctionInclude<ExtArgs> | null
    /**
     * Filter, which JoinedAuction to fetch.
     */
    where: JoinedAuctionWhereUniqueInput
  }

  /**
   * JoinedAuction findFirst
   */
  export type JoinedAuctionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinedAuction
     */
    select?: JoinedAuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JoinedAuction
     */
    omit?: JoinedAuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinedAuctionInclude<ExtArgs> | null
    /**
     * Filter, which JoinedAuction to fetch.
     */
    where?: JoinedAuctionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JoinedAuctions to fetch.
     */
    orderBy?: JoinedAuctionOrderByWithRelationInput | JoinedAuctionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JoinedAuctions.
     */
    cursor?: JoinedAuctionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JoinedAuctions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JoinedAuctions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JoinedAuctions.
     */
    distinct?: JoinedAuctionScalarFieldEnum | JoinedAuctionScalarFieldEnum[]
  }

  /**
   * JoinedAuction findFirstOrThrow
   */
  export type JoinedAuctionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinedAuction
     */
    select?: JoinedAuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JoinedAuction
     */
    omit?: JoinedAuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinedAuctionInclude<ExtArgs> | null
    /**
     * Filter, which JoinedAuction to fetch.
     */
    where?: JoinedAuctionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JoinedAuctions to fetch.
     */
    orderBy?: JoinedAuctionOrderByWithRelationInput | JoinedAuctionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JoinedAuctions.
     */
    cursor?: JoinedAuctionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JoinedAuctions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JoinedAuctions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JoinedAuctions.
     */
    distinct?: JoinedAuctionScalarFieldEnum | JoinedAuctionScalarFieldEnum[]
  }

  /**
   * JoinedAuction findMany
   */
  export type JoinedAuctionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinedAuction
     */
    select?: JoinedAuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JoinedAuction
     */
    omit?: JoinedAuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinedAuctionInclude<ExtArgs> | null
    /**
     * Filter, which JoinedAuctions to fetch.
     */
    where?: JoinedAuctionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JoinedAuctions to fetch.
     */
    orderBy?: JoinedAuctionOrderByWithRelationInput | JoinedAuctionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing JoinedAuctions.
     */
    cursor?: JoinedAuctionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JoinedAuctions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JoinedAuctions.
     */
    skip?: number
    distinct?: JoinedAuctionScalarFieldEnum | JoinedAuctionScalarFieldEnum[]
  }

  /**
   * JoinedAuction create
   */
  export type JoinedAuctionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinedAuction
     */
    select?: JoinedAuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JoinedAuction
     */
    omit?: JoinedAuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinedAuctionInclude<ExtArgs> | null
    /**
     * The data needed to create a JoinedAuction.
     */
    data: XOR<JoinedAuctionCreateInput, JoinedAuctionUncheckedCreateInput>
  }

  /**
   * JoinedAuction createMany
   */
  export type JoinedAuctionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many JoinedAuctions.
     */
    data: JoinedAuctionCreateManyInput | JoinedAuctionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * JoinedAuction createManyAndReturn
   */
  export type JoinedAuctionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinedAuction
     */
    select?: JoinedAuctionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JoinedAuction
     */
    omit?: JoinedAuctionOmit<ExtArgs> | null
    /**
     * The data used to create many JoinedAuctions.
     */
    data: JoinedAuctionCreateManyInput | JoinedAuctionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinedAuctionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * JoinedAuction update
   */
  export type JoinedAuctionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinedAuction
     */
    select?: JoinedAuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JoinedAuction
     */
    omit?: JoinedAuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinedAuctionInclude<ExtArgs> | null
    /**
     * The data needed to update a JoinedAuction.
     */
    data: XOR<JoinedAuctionUpdateInput, JoinedAuctionUncheckedUpdateInput>
    /**
     * Choose, which JoinedAuction to update.
     */
    where: JoinedAuctionWhereUniqueInput
  }

  /**
   * JoinedAuction updateMany
   */
  export type JoinedAuctionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update JoinedAuctions.
     */
    data: XOR<JoinedAuctionUpdateManyMutationInput, JoinedAuctionUncheckedUpdateManyInput>
    /**
     * Filter which JoinedAuctions to update
     */
    where?: JoinedAuctionWhereInput
    /**
     * Limit how many JoinedAuctions to update.
     */
    limit?: number
  }

  /**
   * JoinedAuction updateManyAndReturn
   */
  export type JoinedAuctionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinedAuction
     */
    select?: JoinedAuctionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JoinedAuction
     */
    omit?: JoinedAuctionOmit<ExtArgs> | null
    /**
     * The data used to update JoinedAuctions.
     */
    data: XOR<JoinedAuctionUpdateManyMutationInput, JoinedAuctionUncheckedUpdateManyInput>
    /**
     * Filter which JoinedAuctions to update
     */
    where?: JoinedAuctionWhereInput
    /**
     * Limit how many JoinedAuctions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinedAuctionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * JoinedAuction upsert
   */
  export type JoinedAuctionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinedAuction
     */
    select?: JoinedAuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JoinedAuction
     */
    omit?: JoinedAuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinedAuctionInclude<ExtArgs> | null
    /**
     * The filter to search for the JoinedAuction to update in case it exists.
     */
    where: JoinedAuctionWhereUniqueInput
    /**
     * In case the JoinedAuction found by the `where` argument doesn't exist, create a new JoinedAuction with this data.
     */
    create: XOR<JoinedAuctionCreateInput, JoinedAuctionUncheckedCreateInput>
    /**
     * In case the JoinedAuction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JoinedAuctionUpdateInput, JoinedAuctionUncheckedUpdateInput>
  }

  /**
   * JoinedAuction delete
   */
  export type JoinedAuctionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinedAuction
     */
    select?: JoinedAuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JoinedAuction
     */
    omit?: JoinedAuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinedAuctionInclude<ExtArgs> | null
    /**
     * Filter which JoinedAuction to delete.
     */
    where: JoinedAuctionWhereUniqueInput
  }

  /**
   * JoinedAuction deleteMany
   */
  export type JoinedAuctionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JoinedAuctions to delete
     */
    where?: JoinedAuctionWhereInput
    /**
     * Limit how many JoinedAuctions to delete.
     */
    limit?: number
  }

  /**
   * JoinedAuction without action
   */
  export type JoinedAuctionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JoinedAuction
     */
    select?: JoinedAuctionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JoinedAuction
     */
    omit?: JoinedAuctionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JoinedAuctionInclude<ExtArgs> | null
  }


  /**
   * Model Category
   */

  export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  export type CategoryAvgAggregateOutputType = {
    baseBid: Decimal | null
    minIncrement: Decimal | null
    maxPlayersPerTeam: number | null
    minPlayersPerTeam: number | null
  }

  export type CategorySumAggregateOutputType = {
    baseBid: Decimal | null
    minIncrement: Decimal | null
    maxPlayersPerTeam: number | null
    minPlayersPerTeam: number | null
  }

  export type CategoryMinAggregateOutputType = {
    id: string | null
    auctionId: string | null
    name: string | null
    color: string | null
    baseBid: Decimal | null
    minIncrement: Decimal | null
    maxPlayersPerTeam: number | null
    minPlayersPerTeam: number | null
  }

  export type CategoryMaxAggregateOutputType = {
    id: string | null
    auctionId: string | null
    name: string | null
    color: string | null
    baseBid: Decimal | null
    minIncrement: Decimal | null
    maxPlayersPerTeam: number | null
    minPlayersPerTeam: number | null
  }

  export type CategoryCountAggregateOutputType = {
    id: number
    auctionId: number
    name: number
    color: number
    baseBid: number
    minIncrement: number
    maxPlayersPerTeam: number
    minPlayersPerTeam: number
    _all: number
  }


  export type CategoryAvgAggregateInputType = {
    baseBid?: true
    minIncrement?: true
    maxPlayersPerTeam?: true
    minPlayersPerTeam?: true
  }

  export type CategorySumAggregateInputType = {
    baseBid?: true
    minIncrement?: true
    maxPlayersPerTeam?: true
    minPlayersPerTeam?: true
  }

  export type CategoryMinAggregateInputType = {
    id?: true
    auctionId?: true
    name?: true
    color?: true
    baseBid?: true
    minIncrement?: true
    maxPlayersPerTeam?: true
    minPlayersPerTeam?: true
  }

  export type CategoryMaxAggregateInputType = {
    id?: true
    auctionId?: true
    name?: true
    color?: true
    baseBid?: true
    minIncrement?: true
    maxPlayersPerTeam?: true
    minPlayersPerTeam?: true
  }

  export type CategoryCountAggregateInputType = {
    id?: true
    auctionId?: true
    name?: true
    color?: true
    baseBid?: true
    minIncrement?: true
    maxPlayersPerTeam?: true
    minPlayersPerTeam?: true
    _all?: true
  }

  export type CategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Category to aggregate.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Categories
    **/
    _count?: true | CategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CategoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CategorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryMaxAggregateInputType
  }

  export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategory[P]>
      : GetScalarType<T[P], AggregateCategory[P]>
  }




  export type CategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithAggregationInput | CategoryOrderByWithAggregationInput[]
    by: CategoryScalarFieldEnum[] | CategoryScalarFieldEnum
    having?: CategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryCountAggregateInputType | true
    _avg?: CategoryAvgAggregateInputType
    _sum?: CategorySumAggregateInputType
    _min?: CategoryMinAggregateInputType
    _max?: CategoryMaxAggregateInputType
  }

  export type CategoryGroupByOutputType = {
    id: string
    auctionId: string
    name: string
    color: string | null
    baseBid: Decimal | null
    minIncrement: Decimal | null
    maxPlayersPerTeam: number | null
    minPlayersPerTeam: number | null
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  type GetCategoryGroupByPayload<T extends CategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryGroupByOutputType[P]>
        }
      >
    >


  export type CategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    auctionId?: boolean
    name?: boolean
    color?: boolean
    baseBid?: boolean
    minIncrement?: boolean
    maxPlayersPerTeam?: boolean
    minPlayersPerTeam?: boolean
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    players?: boolean | Category$playersArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>

  export type CategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    auctionId?: boolean
    name?: boolean
    color?: boolean
    baseBid?: boolean
    minIncrement?: boolean
    maxPlayersPerTeam?: boolean
    minPlayersPerTeam?: boolean
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>

  export type CategorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    auctionId?: boolean
    name?: boolean
    color?: boolean
    baseBid?: boolean
    minIncrement?: boolean
    maxPlayersPerTeam?: boolean
    minPlayersPerTeam?: boolean
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>

  export type CategorySelectScalar = {
    id?: boolean
    auctionId?: boolean
    name?: boolean
    color?: boolean
    baseBid?: boolean
    minIncrement?: boolean
    maxPlayersPerTeam?: boolean
    minPlayersPerTeam?: boolean
  }

  export type CategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "auctionId" | "name" | "color" | "baseBid" | "minIncrement" | "maxPlayersPerTeam" | "minPlayersPerTeam", ExtArgs["result"]["category"]>
  export type CategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    players?: boolean | Category$playersArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }
  export type CategoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }

  export type $CategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Category"
    objects: {
      auction: Prisma.$AuctionPayload<ExtArgs>
      players: Prisma.$PlayerPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      auctionId: string
      name: string
      color: string | null
      baseBid: Prisma.Decimal | null
      minIncrement: Prisma.Decimal | null
      maxPlayersPerTeam: number | null
      minPlayersPerTeam: number | null
    }, ExtArgs["result"]["category"]>
    composites: {}
  }

  type CategoryGetPayload<S extends boolean | null | undefined | CategoryDefaultArgs> = $Result.GetResult<Prisma.$CategoryPayload, S>

  type CategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CategoryCountAggregateInputType | true
    }

  export interface CategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Category'], meta: { name: 'Category' } }
    /**
     * Find zero or one Category that matches the filter.
     * @param {CategoryFindUniqueArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryFindUniqueArgs>(args: SelectSubset<T, CategoryFindUniqueArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Category that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoryFindUniqueOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryFindFirstArgs>(args?: SelectSubset<T, CategoryFindFirstArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.category.findMany()
     * 
     * // Get first 10 Categories
     * const categories = await prisma.category.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoryWithIdOnly = await prisma.category.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoryFindManyArgs>(args?: SelectSubset<T, CategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Category.
     * @param {CategoryCreateArgs} args - Arguments to create a Category.
     * @example
     * // Create one Category
     * const Category = await prisma.category.create({
     *   data: {
     *     // ... data to create a Category
     *   }
     * })
     * 
     */
    create<T extends CategoryCreateArgs>(args: SelectSubset<T, CategoryCreateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Categories.
     * @param {CategoryCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoryCreateManyArgs>(args?: SelectSubset<T, CategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Categories and returns the data saved in the database.
     * @param {CategoryCreateManyAndReturnArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, CategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Category.
     * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
     * @example
     * // Delete one Category
     * const Category = await prisma.category.delete({
     *   where: {
     *     // ... filter to delete one Category
     *   }
     * })
     * 
     */
    delete<T extends CategoryDeleteArgs>(args: SelectSubset<T, CategoryDeleteArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Category.
     * @param {CategoryUpdateArgs} args - Arguments to update one Category.
     * @example
     * // Update one Category
     * const category = await prisma.category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoryUpdateArgs>(args: SelectSubset<T, CategoryUpdateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Categories.
     * @param {CategoryDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoryDeleteManyArgs>(args?: SelectSubset<T, CategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoryUpdateManyArgs>(args: SelectSubset<T, CategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories and returns the data updated in the database.
     * @param {CategoryUpdateManyAndReturnArgs} args - Arguments to update many Categories.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CategoryUpdateManyAndReturnArgs>(args: SelectSubset<T, CategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Category.
     * @param {CategoryUpsertArgs} args - Arguments to update or create a Category.
     * @example
     * // Update or create a Category
     * const category = await prisma.category.upsert({
     *   create: {
     *     // ... data to create a Category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Category we want to update
     *   }
     * })
     */
    upsert<T extends CategoryUpsertArgs>(args: SelectSubset<T, CategoryUpsertArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.category.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
    **/
    count<T extends CategoryCountArgs>(
      args?: Subset<T, CategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoryAggregateArgs>(args: Subset<T, CategoryAggregateArgs>): Prisma.PrismaPromise<GetCategoryAggregateType<T>>

    /**
     * Group by Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryGroupByArgs['orderBy'] }
        : { orderBy?: CategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Category model
   */
  readonly fields: CategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    auction<T extends AuctionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuctionDefaultArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    players<T extends Category$playersArgs<ExtArgs> = {}>(args?: Subset<T, Category$playersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Category model
   */
  interface CategoryFieldRefs {
    readonly id: FieldRef<"Category", 'String'>
    readonly auctionId: FieldRef<"Category", 'String'>
    readonly name: FieldRef<"Category", 'String'>
    readonly color: FieldRef<"Category", 'String'>
    readonly baseBid: FieldRef<"Category", 'Decimal'>
    readonly minIncrement: FieldRef<"Category", 'Decimal'>
    readonly maxPlayersPerTeam: FieldRef<"Category", 'Int'>
    readonly minPlayersPerTeam: FieldRef<"Category", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Category findUnique
   */
  export type CategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findUniqueOrThrow
   */
  export type CategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findFirst
   */
  export type CategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findFirstOrThrow
   */
  export type CategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findMany
   */
  export type CategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category create
   */
  export type CategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a Category.
     */
    data: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
  }

  /**
   * Category createMany
   */
  export type CategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category createManyAndReturn
   */
  export type CategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Category update
   */
  export type CategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a Category.
     */
    data: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
    /**
     * Choose, which Category to update.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category updateMany
   */
  export type CategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
  }

  /**
   * Category updateManyAndReturn
   */
  export type CategoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Category upsert
   */
  export type CategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the Category to update in case it exists.
     */
    where: CategoryWhereUniqueInput
    /**
     * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
     */
    create: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
    /**
     * In case the Category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
  }

  /**
   * Category delete
   */
  export type CategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter which Category to delete.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category deleteMany
   */
  export type CategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categories to delete
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to delete.
     */
    limit?: number
  }

  /**
   * Category.players
   */
  export type Category$playersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    where?: PlayerWhereInput
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    cursor?: PlayerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Category without action
   */
  export type CategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
  }


  /**
   * Model Team
   */

  export type AggregateTeam = {
    _count: TeamCountAggregateOutputType | null
    _avg: TeamAvgAggregateOutputType | null
    _sum: TeamSumAggregateOutputType | null
    _min: TeamMinAggregateOutputType | null
    _max: TeamMaxAggregateOutputType | null
  }

  export type TeamAvgAggregateOutputType = {
    originalPurse: Decimal | null
    purseSpent: Decimal | null
    playersCount: number | null
  }

  export type TeamSumAggregateOutputType = {
    originalPurse: Decimal | null
    purseSpent: Decimal | null
    playersCount: number | null
  }

  export type TeamMinAggregateOutputType = {
    id: string | null
    auctionId: string | null
    name: string | null
    shortName: string | null
    shortcutKey: string | null
    logo: string | null
    originalPurse: Decimal | null
    purseSpent: Decimal | null
    playersCount: number | null
  }

  export type TeamMaxAggregateOutputType = {
    id: string | null
    auctionId: string | null
    name: string | null
    shortName: string | null
    shortcutKey: string | null
    logo: string | null
    originalPurse: Decimal | null
    purseSpent: Decimal | null
    playersCount: number | null
  }

  export type TeamCountAggregateOutputType = {
    id: number
    auctionId: number
    name: number
    shortName: number
    shortcutKey: number
    logo: number
    originalPurse: number
    purseSpent: number
    playersCount: number
    _all: number
  }


  export type TeamAvgAggregateInputType = {
    originalPurse?: true
    purseSpent?: true
    playersCount?: true
  }

  export type TeamSumAggregateInputType = {
    originalPurse?: true
    purseSpent?: true
    playersCount?: true
  }

  export type TeamMinAggregateInputType = {
    id?: true
    auctionId?: true
    name?: true
    shortName?: true
    shortcutKey?: true
    logo?: true
    originalPurse?: true
    purseSpent?: true
    playersCount?: true
  }

  export type TeamMaxAggregateInputType = {
    id?: true
    auctionId?: true
    name?: true
    shortName?: true
    shortcutKey?: true
    logo?: true
    originalPurse?: true
    purseSpent?: true
    playersCount?: true
  }

  export type TeamCountAggregateInputType = {
    id?: true
    auctionId?: true
    name?: true
    shortName?: true
    shortcutKey?: true
    logo?: true
    originalPurse?: true
    purseSpent?: true
    playersCount?: true
    _all?: true
  }

  export type TeamAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Team to aggregate.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Teams
    **/
    _count?: true | TeamCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TeamAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TeamSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TeamMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TeamMaxAggregateInputType
  }

  export type GetTeamAggregateType<T extends TeamAggregateArgs> = {
        [P in keyof T & keyof AggregateTeam]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTeam[P]>
      : GetScalarType<T[P], AggregateTeam[P]>
  }




  export type TeamGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamWhereInput
    orderBy?: TeamOrderByWithAggregationInput | TeamOrderByWithAggregationInput[]
    by: TeamScalarFieldEnum[] | TeamScalarFieldEnum
    having?: TeamScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TeamCountAggregateInputType | true
    _avg?: TeamAvgAggregateInputType
    _sum?: TeamSumAggregateInputType
    _min?: TeamMinAggregateInputType
    _max?: TeamMaxAggregateInputType
  }

  export type TeamGroupByOutputType = {
    id: string
    auctionId: string
    name: string
    shortName: string
    shortcutKey: string | null
    logo: string | null
    originalPurse: Decimal
    purseSpent: Decimal
    playersCount: number
    _count: TeamCountAggregateOutputType | null
    _avg: TeamAvgAggregateOutputType | null
    _sum: TeamSumAggregateOutputType | null
    _min: TeamMinAggregateOutputType | null
    _max: TeamMaxAggregateOutputType | null
  }

  type GetTeamGroupByPayload<T extends TeamGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TeamGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TeamGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TeamGroupByOutputType[P]>
            : GetScalarType<T[P], TeamGroupByOutputType[P]>
        }
      >
    >


  export type TeamSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    auctionId?: boolean
    name?: boolean
    shortName?: boolean
    shortcutKey?: boolean
    logo?: boolean
    originalPurse?: boolean
    purseSpent?: boolean
    playersCount?: boolean
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    players?: boolean | Team$playersArgs<ExtArgs>
    bidHistories?: boolean | Team$bidHistoriesArgs<ExtArgs>
    _count?: boolean | TeamCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["team"]>

  export type TeamSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    auctionId?: boolean
    name?: boolean
    shortName?: boolean
    shortcutKey?: boolean
    logo?: boolean
    originalPurse?: boolean
    purseSpent?: boolean
    playersCount?: boolean
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["team"]>

  export type TeamSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    auctionId?: boolean
    name?: boolean
    shortName?: boolean
    shortcutKey?: boolean
    logo?: boolean
    originalPurse?: boolean
    purseSpent?: boolean
    playersCount?: boolean
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["team"]>

  export type TeamSelectScalar = {
    id?: boolean
    auctionId?: boolean
    name?: boolean
    shortName?: boolean
    shortcutKey?: boolean
    logo?: boolean
    originalPurse?: boolean
    purseSpent?: boolean
    playersCount?: boolean
  }

  export type TeamOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "auctionId" | "name" | "shortName" | "shortcutKey" | "logo" | "originalPurse" | "purseSpent" | "playersCount", ExtArgs["result"]["team"]>
  export type TeamInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    players?: boolean | Team$playersArgs<ExtArgs>
    bidHistories?: boolean | Team$bidHistoriesArgs<ExtArgs>
    _count?: boolean | TeamCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TeamIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }
  export type TeamIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }

  export type $TeamPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Team"
    objects: {
      auction: Prisma.$AuctionPayload<ExtArgs>
      players: Prisma.$PlayerPayload<ExtArgs>[]
      bidHistories: Prisma.$BidHistoryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      auctionId: string
      name: string
      shortName: string
      shortcutKey: string | null
      logo: string | null
      originalPurse: Prisma.Decimal
      purseSpent: Prisma.Decimal
      playersCount: number
    }, ExtArgs["result"]["team"]>
    composites: {}
  }

  type TeamGetPayload<S extends boolean | null | undefined | TeamDefaultArgs> = $Result.GetResult<Prisma.$TeamPayload, S>

  type TeamCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TeamFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TeamCountAggregateInputType | true
    }

  export interface TeamDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Team'], meta: { name: 'Team' } }
    /**
     * Find zero or one Team that matches the filter.
     * @param {TeamFindUniqueArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TeamFindUniqueArgs>(args: SelectSubset<T, TeamFindUniqueArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Team that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TeamFindUniqueOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TeamFindUniqueOrThrowArgs>(args: SelectSubset<T, TeamFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Team that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindFirstArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TeamFindFirstArgs>(args?: SelectSubset<T, TeamFindFirstArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Team that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindFirstOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TeamFindFirstOrThrowArgs>(args?: SelectSubset<T, TeamFindFirstOrThrowArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Teams that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Teams
     * const teams = await prisma.team.findMany()
     * 
     * // Get first 10 Teams
     * const teams = await prisma.team.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const teamWithIdOnly = await prisma.team.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TeamFindManyArgs>(args?: SelectSubset<T, TeamFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Team.
     * @param {TeamCreateArgs} args - Arguments to create a Team.
     * @example
     * // Create one Team
     * const Team = await prisma.team.create({
     *   data: {
     *     // ... data to create a Team
     *   }
     * })
     * 
     */
    create<T extends TeamCreateArgs>(args: SelectSubset<T, TeamCreateArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Teams.
     * @param {TeamCreateManyArgs} args - Arguments to create many Teams.
     * @example
     * // Create many Teams
     * const team = await prisma.team.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TeamCreateManyArgs>(args?: SelectSubset<T, TeamCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Teams and returns the data saved in the database.
     * @param {TeamCreateManyAndReturnArgs} args - Arguments to create many Teams.
     * @example
     * // Create many Teams
     * const team = await prisma.team.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Teams and only return the `id`
     * const teamWithIdOnly = await prisma.team.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TeamCreateManyAndReturnArgs>(args?: SelectSubset<T, TeamCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Team.
     * @param {TeamDeleteArgs} args - Arguments to delete one Team.
     * @example
     * // Delete one Team
     * const Team = await prisma.team.delete({
     *   where: {
     *     // ... filter to delete one Team
     *   }
     * })
     * 
     */
    delete<T extends TeamDeleteArgs>(args: SelectSubset<T, TeamDeleteArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Team.
     * @param {TeamUpdateArgs} args - Arguments to update one Team.
     * @example
     * // Update one Team
     * const team = await prisma.team.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TeamUpdateArgs>(args: SelectSubset<T, TeamUpdateArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Teams.
     * @param {TeamDeleteManyArgs} args - Arguments to filter Teams to delete.
     * @example
     * // Delete a few Teams
     * const { count } = await prisma.team.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TeamDeleteManyArgs>(args?: SelectSubset<T, TeamDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Teams
     * const team = await prisma.team.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TeamUpdateManyArgs>(args: SelectSubset<T, TeamUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Teams and returns the data updated in the database.
     * @param {TeamUpdateManyAndReturnArgs} args - Arguments to update many Teams.
     * @example
     * // Update many Teams
     * const team = await prisma.team.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Teams and only return the `id`
     * const teamWithIdOnly = await prisma.team.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TeamUpdateManyAndReturnArgs>(args: SelectSubset<T, TeamUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Team.
     * @param {TeamUpsertArgs} args - Arguments to update or create a Team.
     * @example
     * // Update or create a Team
     * const team = await prisma.team.upsert({
     *   create: {
     *     // ... data to create a Team
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Team we want to update
     *   }
     * })
     */
    upsert<T extends TeamUpsertArgs>(args: SelectSubset<T, TeamUpsertArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamCountArgs} args - Arguments to filter Teams to count.
     * @example
     * // Count the number of Teams
     * const count = await prisma.team.count({
     *   where: {
     *     // ... the filter for the Teams we want to count
     *   }
     * })
    **/
    count<T extends TeamCountArgs>(
      args?: Subset<T, TeamCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TeamCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TeamAggregateArgs>(args: Subset<T, TeamAggregateArgs>): Prisma.PrismaPromise<GetTeamAggregateType<T>>

    /**
     * Group by Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TeamGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TeamGroupByArgs['orderBy'] }
        : { orderBy?: TeamGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TeamGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Team model
   */
  readonly fields: TeamFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Team.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TeamClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    auction<T extends AuctionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuctionDefaultArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    players<T extends Team$playersArgs<ExtArgs> = {}>(args?: Subset<T, Team$playersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    bidHistories<T extends Team$bidHistoriesArgs<ExtArgs> = {}>(args?: Subset<T, Team$bidHistoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BidHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Team model
   */
  interface TeamFieldRefs {
    readonly id: FieldRef<"Team", 'String'>
    readonly auctionId: FieldRef<"Team", 'String'>
    readonly name: FieldRef<"Team", 'String'>
    readonly shortName: FieldRef<"Team", 'String'>
    readonly shortcutKey: FieldRef<"Team", 'String'>
    readonly logo: FieldRef<"Team", 'String'>
    readonly originalPurse: FieldRef<"Team", 'Decimal'>
    readonly purseSpent: FieldRef<"Team", 'Decimal'>
    readonly playersCount: FieldRef<"Team", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Team findUnique
   */
  export type TeamFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team findUniqueOrThrow
   */
  export type TeamFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team findFirst
   */
  export type TeamFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Teams.
     */
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team findFirstOrThrow
   */
  export type TeamFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Teams.
     */
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team findMany
   */
  export type TeamFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Teams to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team create
   */
  export type TeamCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The data needed to create a Team.
     */
    data: XOR<TeamCreateInput, TeamUncheckedCreateInput>
  }

  /**
   * Team createMany
   */
  export type TeamCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Teams.
     */
    data: TeamCreateManyInput | TeamCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Team createManyAndReturn
   */
  export type TeamCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * The data used to create many Teams.
     */
    data: TeamCreateManyInput | TeamCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Team update
   */
  export type TeamUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The data needed to update a Team.
     */
    data: XOR<TeamUpdateInput, TeamUncheckedUpdateInput>
    /**
     * Choose, which Team to update.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team updateMany
   */
  export type TeamUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Teams.
     */
    data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyInput>
    /**
     * Filter which Teams to update
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to update.
     */
    limit?: number
  }

  /**
   * Team updateManyAndReturn
   */
  export type TeamUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * The data used to update Teams.
     */
    data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyInput>
    /**
     * Filter which Teams to update
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Team upsert
   */
  export type TeamUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The filter to search for the Team to update in case it exists.
     */
    where: TeamWhereUniqueInput
    /**
     * In case the Team found by the `where` argument doesn't exist, create a new Team with this data.
     */
    create: XOR<TeamCreateInput, TeamUncheckedCreateInput>
    /**
     * In case the Team was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TeamUpdateInput, TeamUncheckedUpdateInput>
  }

  /**
   * Team delete
   */
  export type TeamDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter which Team to delete.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team deleteMany
   */
  export type TeamDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Teams to delete
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to delete.
     */
    limit?: number
  }

  /**
   * Team.players
   */
  export type Team$playersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    where?: PlayerWhereInput
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    cursor?: PlayerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Team.bidHistories
   */
  export type Team$bidHistoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BidHistory
     */
    select?: BidHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BidHistory
     */
    omit?: BidHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidHistoryInclude<ExtArgs> | null
    where?: BidHistoryWhereInput
    orderBy?: BidHistoryOrderByWithRelationInput | BidHistoryOrderByWithRelationInput[]
    cursor?: BidHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BidHistoryScalarFieldEnum | BidHistoryScalarFieldEnum[]
  }

  /**
   * Team without action
   */
  export type TeamDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
  }


  /**
   * Model Player
   */

  export type AggregatePlayer = {
    _count: PlayerCountAggregateOutputType | null
    _avg: PlayerAvgAggregateOutputType | null
    _sum: PlayerSumAggregateOutputType | null
    _min: PlayerMinAggregateOutputType | null
    _max: PlayerMaxAggregateOutputType | null
  }

  export type PlayerAvgAggregateOutputType = {
    age: number | null
    jerseyNumber: number | null
    basePrice: Decimal | null
    soldPrice: Decimal | null
  }

  export type PlayerSumAggregateOutputType = {
    age: number | null
    jerseyNumber: number | null
    basePrice: Decimal | null
    soldPrice: Decimal | null
  }

  export type PlayerMinAggregateOutputType = {
    id: string | null
    auctionId: string | null
    categoryId: string | null
    name: string | null
    mobile: string | null
    age: number | null
    fatherName: string | null
    profilePic: string | null
    role: $Enums.PlayerRole | null
    battingStyle: string | null
    bowlingStyle: string | null
    tshirtSize: string | null
    trouserSize: string | null
    jerseyName: string | null
    jerseyNumber: number | null
    status: $Enums.PlayerStatus | null
    basePrice: Decimal | null
    teamId: string | null
    soldPrice: Decimal | null
  }

  export type PlayerMaxAggregateOutputType = {
    id: string | null
    auctionId: string | null
    categoryId: string | null
    name: string | null
    mobile: string | null
    age: number | null
    fatherName: string | null
    profilePic: string | null
    role: $Enums.PlayerRole | null
    battingStyle: string | null
    bowlingStyle: string | null
    tshirtSize: string | null
    trouserSize: string | null
    jerseyName: string | null
    jerseyNumber: number | null
    status: $Enums.PlayerStatus | null
    basePrice: Decimal | null
    teamId: string | null
    soldPrice: Decimal | null
  }

  export type PlayerCountAggregateOutputType = {
    id: number
    auctionId: number
    categoryId: number
    name: number
    mobile: number
    age: number
    fatherName: number
    profilePic: number
    role: number
    battingStyle: number
    bowlingStyle: number
    tshirtSize: number
    trouserSize: number
    jerseyName: number
    jerseyNumber: number
    status: number
    basePrice: number
    teamId: number
    soldPrice: number
    _all: number
  }


  export type PlayerAvgAggregateInputType = {
    age?: true
    jerseyNumber?: true
    basePrice?: true
    soldPrice?: true
  }

  export type PlayerSumAggregateInputType = {
    age?: true
    jerseyNumber?: true
    basePrice?: true
    soldPrice?: true
  }

  export type PlayerMinAggregateInputType = {
    id?: true
    auctionId?: true
    categoryId?: true
    name?: true
    mobile?: true
    age?: true
    fatherName?: true
    profilePic?: true
    role?: true
    battingStyle?: true
    bowlingStyle?: true
    tshirtSize?: true
    trouserSize?: true
    jerseyName?: true
    jerseyNumber?: true
    status?: true
    basePrice?: true
    teamId?: true
    soldPrice?: true
  }

  export type PlayerMaxAggregateInputType = {
    id?: true
    auctionId?: true
    categoryId?: true
    name?: true
    mobile?: true
    age?: true
    fatherName?: true
    profilePic?: true
    role?: true
    battingStyle?: true
    bowlingStyle?: true
    tshirtSize?: true
    trouserSize?: true
    jerseyName?: true
    jerseyNumber?: true
    status?: true
    basePrice?: true
    teamId?: true
    soldPrice?: true
  }

  export type PlayerCountAggregateInputType = {
    id?: true
    auctionId?: true
    categoryId?: true
    name?: true
    mobile?: true
    age?: true
    fatherName?: true
    profilePic?: true
    role?: true
    battingStyle?: true
    bowlingStyle?: true
    tshirtSize?: true
    trouserSize?: true
    jerseyName?: true
    jerseyNumber?: true
    status?: true
    basePrice?: true
    teamId?: true
    soldPrice?: true
    _all?: true
  }

  export type PlayerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Player to aggregate.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Players
    **/
    _count?: true | PlayerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PlayerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PlayerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlayerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlayerMaxAggregateInputType
  }

  export type GetPlayerAggregateType<T extends PlayerAggregateArgs> = {
        [P in keyof T & keyof AggregatePlayer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlayer[P]>
      : GetScalarType<T[P], AggregatePlayer[P]>
  }




  export type PlayerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerWhereInput
    orderBy?: PlayerOrderByWithAggregationInput | PlayerOrderByWithAggregationInput[]
    by: PlayerScalarFieldEnum[] | PlayerScalarFieldEnum
    having?: PlayerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlayerCountAggregateInputType | true
    _avg?: PlayerAvgAggregateInputType
    _sum?: PlayerSumAggregateInputType
    _min?: PlayerMinAggregateInputType
    _max?: PlayerMaxAggregateInputType
  }

  export type PlayerGroupByOutputType = {
    id: string
    auctionId: string
    categoryId: string | null
    name: string
    mobile: string | null
    age: number
    fatherName: string | null
    profilePic: string | null
    role: $Enums.PlayerRole
    battingStyle: string | null
    bowlingStyle: string | null
    tshirtSize: string | null
    trouserSize: string | null
    jerseyName: string | null
    jerseyNumber: number | null
    status: $Enums.PlayerStatus
    basePrice: Decimal | null
    teamId: string | null
    soldPrice: Decimal | null
    _count: PlayerCountAggregateOutputType | null
    _avg: PlayerAvgAggregateOutputType | null
    _sum: PlayerSumAggregateOutputType | null
    _min: PlayerMinAggregateOutputType | null
    _max: PlayerMaxAggregateOutputType | null
  }

  type GetPlayerGroupByPayload<T extends PlayerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlayerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlayerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlayerGroupByOutputType[P]>
            : GetScalarType<T[P], PlayerGroupByOutputType[P]>
        }
      >
    >


  export type PlayerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    auctionId?: boolean
    categoryId?: boolean
    name?: boolean
    mobile?: boolean
    age?: boolean
    fatherName?: boolean
    profilePic?: boolean
    role?: boolean
    battingStyle?: boolean
    bowlingStyle?: boolean
    tshirtSize?: boolean
    trouserSize?: boolean
    jerseyName?: boolean
    jerseyNumber?: boolean
    status?: boolean
    basePrice?: boolean
    teamId?: boolean
    soldPrice?: boolean
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    category?: boolean | Player$categoryArgs<ExtArgs>
    team?: boolean | Player$teamArgs<ExtArgs>
    bidHistory?: boolean | Player$bidHistoryArgs<ExtArgs>
    _count?: boolean | PlayerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["player"]>

  export type PlayerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    auctionId?: boolean
    categoryId?: boolean
    name?: boolean
    mobile?: boolean
    age?: boolean
    fatherName?: boolean
    profilePic?: boolean
    role?: boolean
    battingStyle?: boolean
    bowlingStyle?: boolean
    tshirtSize?: boolean
    trouserSize?: boolean
    jerseyName?: boolean
    jerseyNumber?: boolean
    status?: boolean
    basePrice?: boolean
    teamId?: boolean
    soldPrice?: boolean
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    category?: boolean | Player$categoryArgs<ExtArgs>
    team?: boolean | Player$teamArgs<ExtArgs>
  }, ExtArgs["result"]["player"]>

  export type PlayerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    auctionId?: boolean
    categoryId?: boolean
    name?: boolean
    mobile?: boolean
    age?: boolean
    fatherName?: boolean
    profilePic?: boolean
    role?: boolean
    battingStyle?: boolean
    bowlingStyle?: boolean
    tshirtSize?: boolean
    trouserSize?: boolean
    jerseyName?: boolean
    jerseyNumber?: boolean
    status?: boolean
    basePrice?: boolean
    teamId?: boolean
    soldPrice?: boolean
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    category?: boolean | Player$categoryArgs<ExtArgs>
    team?: boolean | Player$teamArgs<ExtArgs>
  }, ExtArgs["result"]["player"]>

  export type PlayerSelectScalar = {
    id?: boolean
    auctionId?: boolean
    categoryId?: boolean
    name?: boolean
    mobile?: boolean
    age?: boolean
    fatherName?: boolean
    profilePic?: boolean
    role?: boolean
    battingStyle?: boolean
    bowlingStyle?: boolean
    tshirtSize?: boolean
    trouserSize?: boolean
    jerseyName?: boolean
    jerseyNumber?: boolean
    status?: boolean
    basePrice?: boolean
    teamId?: boolean
    soldPrice?: boolean
  }

  export type PlayerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "auctionId" | "categoryId" | "name" | "mobile" | "age" | "fatherName" | "profilePic" | "role" | "battingStyle" | "bowlingStyle" | "tshirtSize" | "trouserSize" | "jerseyName" | "jerseyNumber" | "status" | "basePrice" | "teamId" | "soldPrice", ExtArgs["result"]["player"]>
  export type PlayerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    category?: boolean | Player$categoryArgs<ExtArgs>
    team?: boolean | Player$teamArgs<ExtArgs>
    bidHistory?: boolean | Player$bidHistoryArgs<ExtArgs>
    _count?: boolean | PlayerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PlayerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    category?: boolean | Player$categoryArgs<ExtArgs>
    team?: boolean | Player$teamArgs<ExtArgs>
  }
  export type PlayerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    category?: boolean | Player$categoryArgs<ExtArgs>
    team?: boolean | Player$teamArgs<ExtArgs>
  }

  export type $PlayerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Player"
    objects: {
      auction: Prisma.$AuctionPayload<ExtArgs>
      category: Prisma.$CategoryPayload<ExtArgs> | null
      team: Prisma.$TeamPayload<ExtArgs> | null
      bidHistory: Prisma.$BidHistoryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      auctionId: string
      categoryId: string | null
      name: string
      mobile: string | null
      age: number
      fatherName: string | null
      profilePic: string | null
      role: $Enums.PlayerRole
      battingStyle: string | null
      bowlingStyle: string | null
      tshirtSize: string | null
      trouserSize: string | null
      jerseyName: string | null
      jerseyNumber: number | null
      status: $Enums.PlayerStatus
      basePrice: Prisma.Decimal | null
      teamId: string | null
      soldPrice: Prisma.Decimal | null
    }, ExtArgs["result"]["player"]>
    composites: {}
  }

  type PlayerGetPayload<S extends boolean | null | undefined | PlayerDefaultArgs> = $Result.GetResult<Prisma.$PlayerPayload, S>

  type PlayerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlayerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlayerCountAggregateInputType | true
    }

  export interface PlayerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Player'], meta: { name: 'Player' } }
    /**
     * Find zero or one Player that matches the filter.
     * @param {PlayerFindUniqueArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlayerFindUniqueArgs>(args: SelectSubset<T, PlayerFindUniqueArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Player that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlayerFindUniqueOrThrowArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlayerFindUniqueOrThrowArgs>(args: SelectSubset<T, PlayerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Player that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindFirstArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlayerFindFirstArgs>(args?: SelectSubset<T, PlayerFindFirstArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Player that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindFirstOrThrowArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlayerFindFirstOrThrowArgs>(args?: SelectSubset<T, PlayerFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Players that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Players
     * const players = await prisma.player.findMany()
     * 
     * // Get first 10 Players
     * const players = await prisma.player.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const playerWithIdOnly = await prisma.player.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlayerFindManyArgs>(args?: SelectSubset<T, PlayerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Player.
     * @param {PlayerCreateArgs} args - Arguments to create a Player.
     * @example
     * // Create one Player
     * const Player = await prisma.player.create({
     *   data: {
     *     // ... data to create a Player
     *   }
     * })
     * 
     */
    create<T extends PlayerCreateArgs>(args: SelectSubset<T, PlayerCreateArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Players.
     * @param {PlayerCreateManyArgs} args - Arguments to create many Players.
     * @example
     * // Create many Players
     * const player = await prisma.player.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlayerCreateManyArgs>(args?: SelectSubset<T, PlayerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Players and returns the data saved in the database.
     * @param {PlayerCreateManyAndReturnArgs} args - Arguments to create many Players.
     * @example
     * // Create many Players
     * const player = await prisma.player.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Players and only return the `id`
     * const playerWithIdOnly = await prisma.player.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlayerCreateManyAndReturnArgs>(args?: SelectSubset<T, PlayerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Player.
     * @param {PlayerDeleteArgs} args - Arguments to delete one Player.
     * @example
     * // Delete one Player
     * const Player = await prisma.player.delete({
     *   where: {
     *     // ... filter to delete one Player
     *   }
     * })
     * 
     */
    delete<T extends PlayerDeleteArgs>(args: SelectSubset<T, PlayerDeleteArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Player.
     * @param {PlayerUpdateArgs} args - Arguments to update one Player.
     * @example
     * // Update one Player
     * const player = await prisma.player.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlayerUpdateArgs>(args: SelectSubset<T, PlayerUpdateArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Players.
     * @param {PlayerDeleteManyArgs} args - Arguments to filter Players to delete.
     * @example
     * // Delete a few Players
     * const { count } = await prisma.player.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlayerDeleteManyArgs>(args?: SelectSubset<T, PlayerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Players.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Players
     * const player = await prisma.player.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlayerUpdateManyArgs>(args: SelectSubset<T, PlayerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Players and returns the data updated in the database.
     * @param {PlayerUpdateManyAndReturnArgs} args - Arguments to update many Players.
     * @example
     * // Update many Players
     * const player = await prisma.player.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Players and only return the `id`
     * const playerWithIdOnly = await prisma.player.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PlayerUpdateManyAndReturnArgs>(args: SelectSubset<T, PlayerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Player.
     * @param {PlayerUpsertArgs} args - Arguments to update or create a Player.
     * @example
     * // Update or create a Player
     * const player = await prisma.player.upsert({
     *   create: {
     *     // ... data to create a Player
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Player we want to update
     *   }
     * })
     */
    upsert<T extends PlayerUpsertArgs>(args: SelectSubset<T, PlayerUpsertArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Players.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerCountArgs} args - Arguments to filter Players to count.
     * @example
     * // Count the number of Players
     * const count = await prisma.player.count({
     *   where: {
     *     // ... the filter for the Players we want to count
     *   }
     * })
    **/
    count<T extends PlayerCountArgs>(
      args?: Subset<T, PlayerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlayerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Player.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlayerAggregateArgs>(args: Subset<T, PlayerAggregateArgs>): Prisma.PrismaPromise<GetPlayerAggregateType<T>>

    /**
     * Group by Player.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlayerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlayerGroupByArgs['orderBy'] }
        : { orderBy?: PlayerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlayerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlayerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Player model
   */
  readonly fields: PlayerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Player.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlayerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    auction<T extends AuctionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuctionDefaultArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    category<T extends Player$categoryArgs<ExtArgs> = {}>(args?: Subset<T, Player$categoryArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    team<T extends Player$teamArgs<ExtArgs> = {}>(args?: Subset<T, Player$teamArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    bidHistory<T extends Player$bidHistoryArgs<ExtArgs> = {}>(args?: Subset<T, Player$bidHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BidHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Player model
   */
  interface PlayerFieldRefs {
    readonly id: FieldRef<"Player", 'String'>
    readonly auctionId: FieldRef<"Player", 'String'>
    readonly categoryId: FieldRef<"Player", 'String'>
    readonly name: FieldRef<"Player", 'String'>
    readonly mobile: FieldRef<"Player", 'String'>
    readonly age: FieldRef<"Player", 'Int'>
    readonly fatherName: FieldRef<"Player", 'String'>
    readonly profilePic: FieldRef<"Player", 'String'>
    readonly role: FieldRef<"Player", 'PlayerRole'>
    readonly battingStyle: FieldRef<"Player", 'String'>
    readonly bowlingStyle: FieldRef<"Player", 'String'>
    readonly tshirtSize: FieldRef<"Player", 'String'>
    readonly trouserSize: FieldRef<"Player", 'String'>
    readonly jerseyName: FieldRef<"Player", 'String'>
    readonly jerseyNumber: FieldRef<"Player", 'Int'>
    readonly status: FieldRef<"Player", 'PlayerStatus'>
    readonly basePrice: FieldRef<"Player", 'Decimal'>
    readonly teamId: FieldRef<"Player", 'String'>
    readonly soldPrice: FieldRef<"Player", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * Player findUnique
   */
  export type PlayerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player findUniqueOrThrow
   */
  export type PlayerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player findFirst
   */
  export type PlayerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Players.
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Players.
     */
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Player findFirstOrThrow
   */
  export type PlayerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Players.
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Players.
     */
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Player findMany
   */
  export type PlayerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Players to fetch.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Players.
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Player create
   */
  export type PlayerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * The data needed to create a Player.
     */
    data: XOR<PlayerCreateInput, PlayerUncheckedCreateInput>
  }

  /**
   * Player createMany
   */
  export type PlayerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Players.
     */
    data: PlayerCreateManyInput | PlayerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Player createManyAndReturn
   */
  export type PlayerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * The data used to create many Players.
     */
    data: PlayerCreateManyInput | PlayerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Player update
   */
  export type PlayerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * The data needed to update a Player.
     */
    data: XOR<PlayerUpdateInput, PlayerUncheckedUpdateInput>
    /**
     * Choose, which Player to update.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player updateMany
   */
  export type PlayerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Players.
     */
    data: XOR<PlayerUpdateManyMutationInput, PlayerUncheckedUpdateManyInput>
    /**
     * Filter which Players to update
     */
    where?: PlayerWhereInput
    /**
     * Limit how many Players to update.
     */
    limit?: number
  }

  /**
   * Player updateManyAndReturn
   */
  export type PlayerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * The data used to update Players.
     */
    data: XOR<PlayerUpdateManyMutationInput, PlayerUncheckedUpdateManyInput>
    /**
     * Filter which Players to update
     */
    where?: PlayerWhereInput
    /**
     * Limit how many Players to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Player upsert
   */
  export type PlayerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * The filter to search for the Player to update in case it exists.
     */
    where: PlayerWhereUniqueInput
    /**
     * In case the Player found by the `where` argument doesn't exist, create a new Player with this data.
     */
    create: XOR<PlayerCreateInput, PlayerUncheckedCreateInput>
    /**
     * In case the Player was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlayerUpdateInput, PlayerUncheckedUpdateInput>
  }

  /**
   * Player delete
   */
  export type PlayerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter which Player to delete.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player deleteMany
   */
  export type PlayerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Players to delete
     */
    where?: PlayerWhereInput
    /**
     * Limit how many Players to delete.
     */
    limit?: number
  }

  /**
   * Player.category
   */
  export type Player$categoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    where?: CategoryWhereInput
  }

  /**
   * Player.team
   */
  export type Player$teamArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    where?: TeamWhereInput
  }

  /**
   * Player.bidHistory
   */
  export type Player$bidHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BidHistory
     */
    select?: BidHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BidHistory
     */
    omit?: BidHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidHistoryInclude<ExtArgs> | null
    where?: BidHistoryWhereInput
    orderBy?: BidHistoryOrderByWithRelationInput | BidHistoryOrderByWithRelationInput[]
    cursor?: BidHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BidHistoryScalarFieldEnum | BidHistoryScalarFieldEnum[]
  }

  /**
   * Player without action
   */
  export type PlayerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
  }


  /**
   * Model BidHistory
   */

  export type AggregateBidHistory = {
    _count: BidHistoryCountAggregateOutputType | null
    _avg: BidHistoryAvgAggregateOutputType | null
    _sum: BidHistorySumAggregateOutputType | null
    _min: BidHistoryMinAggregateOutputType | null
    _max: BidHistoryMaxAggregateOutputType | null
  }

  export type BidHistoryAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type BidHistorySumAggregateOutputType = {
    amount: Decimal | null
  }

  export type BidHistoryMinAggregateOutputType = {
    id: string | null
    playerId: string | null
    auctionId: string | null
    teamId: string | null
    amount: Decimal | null
    timestamp: Date | null
  }

  export type BidHistoryMaxAggregateOutputType = {
    id: string | null
    playerId: string | null
    auctionId: string | null
    teamId: string | null
    amount: Decimal | null
    timestamp: Date | null
  }

  export type BidHistoryCountAggregateOutputType = {
    id: number
    playerId: number
    auctionId: number
    teamId: number
    amount: number
    timestamp: number
    _all: number
  }


  export type BidHistoryAvgAggregateInputType = {
    amount?: true
  }

  export type BidHistorySumAggregateInputType = {
    amount?: true
  }

  export type BidHistoryMinAggregateInputType = {
    id?: true
    playerId?: true
    auctionId?: true
    teamId?: true
    amount?: true
    timestamp?: true
  }

  export type BidHistoryMaxAggregateInputType = {
    id?: true
    playerId?: true
    auctionId?: true
    teamId?: true
    amount?: true
    timestamp?: true
  }

  export type BidHistoryCountAggregateInputType = {
    id?: true
    playerId?: true
    auctionId?: true
    teamId?: true
    amount?: true
    timestamp?: true
    _all?: true
  }

  export type BidHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BidHistory to aggregate.
     */
    where?: BidHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BidHistories to fetch.
     */
    orderBy?: BidHistoryOrderByWithRelationInput | BidHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BidHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BidHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BidHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BidHistories
    **/
    _count?: true | BidHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BidHistoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BidHistorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BidHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BidHistoryMaxAggregateInputType
  }

  export type GetBidHistoryAggregateType<T extends BidHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateBidHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBidHistory[P]>
      : GetScalarType<T[P], AggregateBidHistory[P]>
  }




  export type BidHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BidHistoryWhereInput
    orderBy?: BidHistoryOrderByWithAggregationInput | BidHistoryOrderByWithAggregationInput[]
    by: BidHistoryScalarFieldEnum[] | BidHistoryScalarFieldEnum
    having?: BidHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BidHistoryCountAggregateInputType | true
    _avg?: BidHistoryAvgAggregateInputType
    _sum?: BidHistorySumAggregateInputType
    _min?: BidHistoryMinAggregateInputType
    _max?: BidHistoryMaxAggregateInputType
  }

  export type BidHistoryGroupByOutputType = {
    id: string
    playerId: string
    auctionId: string
    teamId: string
    amount: Decimal
    timestamp: Date
    _count: BidHistoryCountAggregateOutputType | null
    _avg: BidHistoryAvgAggregateOutputType | null
    _sum: BidHistorySumAggregateOutputType | null
    _min: BidHistoryMinAggregateOutputType | null
    _max: BidHistoryMaxAggregateOutputType | null
  }

  type GetBidHistoryGroupByPayload<T extends BidHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BidHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BidHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BidHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], BidHistoryGroupByOutputType[P]>
        }
      >
    >


  export type BidHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    playerId?: boolean
    auctionId?: boolean
    teamId?: boolean
    amount?: boolean
    timestamp?: boolean
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bidHistory"]>

  export type BidHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    playerId?: boolean
    auctionId?: boolean
    teamId?: boolean
    amount?: boolean
    timestamp?: boolean
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bidHistory"]>

  export type BidHistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    playerId?: boolean
    auctionId?: boolean
    teamId?: boolean
    amount?: boolean
    timestamp?: boolean
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bidHistory"]>

  export type BidHistorySelectScalar = {
    id?: boolean
    playerId?: boolean
    auctionId?: boolean
    teamId?: boolean
    amount?: boolean
    timestamp?: boolean
  }

  export type BidHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "playerId" | "auctionId" | "teamId" | "amount" | "timestamp", ExtArgs["result"]["bidHistory"]>
  export type BidHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }
  export type BidHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }
  export type BidHistoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }

  export type $BidHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BidHistory"
    objects: {
      player: Prisma.$PlayerPayload<ExtArgs>
      auction: Prisma.$AuctionPayload<ExtArgs>
      team: Prisma.$TeamPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      playerId: string
      auctionId: string
      teamId: string
      amount: Prisma.Decimal
      timestamp: Date
    }, ExtArgs["result"]["bidHistory"]>
    composites: {}
  }

  type BidHistoryGetPayload<S extends boolean | null | undefined | BidHistoryDefaultArgs> = $Result.GetResult<Prisma.$BidHistoryPayload, S>

  type BidHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BidHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BidHistoryCountAggregateInputType | true
    }

  export interface BidHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BidHistory'], meta: { name: 'BidHistory' } }
    /**
     * Find zero or one BidHistory that matches the filter.
     * @param {BidHistoryFindUniqueArgs} args - Arguments to find a BidHistory
     * @example
     * // Get one BidHistory
     * const bidHistory = await prisma.bidHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BidHistoryFindUniqueArgs>(args: SelectSubset<T, BidHistoryFindUniqueArgs<ExtArgs>>): Prisma__BidHistoryClient<$Result.GetResult<Prisma.$BidHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BidHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BidHistoryFindUniqueOrThrowArgs} args - Arguments to find a BidHistory
     * @example
     * // Get one BidHistory
     * const bidHistory = await prisma.bidHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BidHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, BidHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BidHistoryClient<$Result.GetResult<Prisma.$BidHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BidHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BidHistoryFindFirstArgs} args - Arguments to find a BidHistory
     * @example
     * // Get one BidHistory
     * const bidHistory = await prisma.bidHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BidHistoryFindFirstArgs>(args?: SelectSubset<T, BidHistoryFindFirstArgs<ExtArgs>>): Prisma__BidHistoryClient<$Result.GetResult<Prisma.$BidHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BidHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BidHistoryFindFirstOrThrowArgs} args - Arguments to find a BidHistory
     * @example
     * // Get one BidHistory
     * const bidHistory = await prisma.bidHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BidHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, BidHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__BidHistoryClient<$Result.GetResult<Prisma.$BidHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BidHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BidHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BidHistories
     * const bidHistories = await prisma.bidHistory.findMany()
     * 
     * // Get first 10 BidHistories
     * const bidHistories = await prisma.bidHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bidHistoryWithIdOnly = await prisma.bidHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BidHistoryFindManyArgs>(args?: SelectSubset<T, BidHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BidHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BidHistory.
     * @param {BidHistoryCreateArgs} args - Arguments to create a BidHistory.
     * @example
     * // Create one BidHistory
     * const BidHistory = await prisma.bidHistory.create({
     *   data: {
     *     // ... data to create a BidHistory
     *   }
     * })
     * 
     */
    create<T extends BidHistoryCreateArgs>(args: SelectSubset<T, BidHistoryCreateArgs<ExtArgs>>): Prisma__BidHistoryClient<$Result.GetResult<Prisma.$BidHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BidHistories.
     * @param {BidHistoryCreateManyArgs} args - Arguments to create many BidHistories.
     * @example
     * // Create many BidHistories
     * const bidHistory = await prisma.bidHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BidHistoryCreateManyArgs>(args?: SelectSubset<T, BidHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BidHistories and returns the data saved in the database.
     * @param {BidHistoryCreateManyAndReturnArgs} args - Arguments to create many BidHistories.
     * @example
     * // Create many BidHistories
     * const bidHistory = await prisma.bidHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BidHistories and only return the `id`
     * const bidHistoryWithIdOnly = await prisma.bidHistory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BidHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, BidHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BidHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BidHistory.
     * @param {BidHistoryDeleteArgs} args - Arguments to delete one BidHistory.
     * @example
     * // Delete one BidHistory
     * const BidHistory = await prisma.bidHistory.delete({
     *   where: {
     *     // ... filter to delete one BidHistory
     *   }
     * })
     * 
     */
    delete<T extends BidHistoryDeleteArgs>(args: SelectSubset<T, BidHistoryDeleteArgs<ExtArgs>>): Prisma__BidHistoryClient<$Result.GetResult<Prisma.$BidHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BidHistory.
     * @param {BidHistoryUpdateArgs} args - Arguments to update one BidHistory.
     * @example
     * // Update one BidHistory
     * const bidHistory = await prisma.bidHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BidHistoryUpdateArgs>(args: SelectSubset<T, BidHistoryUpdateArgs<ExtArgs>>): Prisma__BidHistoryClient<$Result.GetResult<Prisma.$BidHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BidHistories.
     * @param {BidHistoryDeleteManyArgs} args - Arguments to filter BidHistories to delete.
     * @example
     * // Delete a few BidHistories
     * const { count } = await prisma.bidHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BidHistoryDeleteManyArgs>(args?: SelectSubset<T, BidHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BidHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BidHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BidHistories
     * const bidHistory = await prisma.bidHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BidHistoryUpdateManyArgs>(args: SelectSubset<T, BidHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BidHistories and returns the data updated in the database.
     * @param {BidHistoryUpdateManyAndReturnArgs} args - Arguments to update many BidHistories.
     * @example
     * // Update many BidHistories
     * const bidHistory = await prisma.bidHistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BidHistories and only return the `id`
     * const bidHistoryWithIdOnly = await prisma.bidHistory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BidHistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, BidHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BidHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BidHistory.
     * @param {BidHistoryUpsertArgs} args - Arguments to update or create a BidHistory.
     * @example
     * // Update or create a BidHistory
     * const bidHistory = await prisma.bidHistory.upsert({
     *   create: {
     *     // ... data to create a BidHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BidHistory we want to update
     *   }
     * })
     */
    upsert<T extends BidHistoryUpsertArgs>(args: SelectSubset<T, BidHistoryUpsertArgs<ExtArgs>>): Prisma__BidHistoryClient<$Result.GetResult<Prisma.$BidHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BidHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BidHistoryCountArgs} args - Arguments to filter BidHistories to count.
     * @example
     * // Count the number of BidHistories
     * const count = await prisma.bidHistory.count({
     *   where: {
     *     // ... the filter for the BidHistories we want to count
     *   }
     * })
    **/
    count<T extends BidHistoryCountArgs>(
      args?: Subset<T, BidHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BidHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BidHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BidHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BidHistoryAggregateArgs>(args: Subset<T, BidHistoryAggregateArgs>): Prisma.PrismaPromise<GetBidHistoryAggregateType<T>>

    /**
     * Group by BidHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BidHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BidHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BidHistoryGroupByArgs['orderBy'] }
        : { orderBy?: BidHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BidHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBidHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BidHistory model
   */
  readonly fields: BidHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BidHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BidHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    player<T extends PlayerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlayerDefaultArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    auction<T extends AuctionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuctionDefaultArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    team<T extends TeamDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TeamDefaultArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BidHistory model
   */
  interface BidHistoryFieldRefs {
    readonly id: FieldRef<"BidHistory", 'String'>
    readonly playerId: FieldRef<"BidHistory", 'String'>
    readonly auctionId: FieldRef<"BidHistory", 'String'>
    readonly teamId: FieldRef<"BidHistory", 'String'>
    readonly amount: FieldRef<"BidHistory", 'Decimal'>
    readonly timestamp: FieldRef<"BidHistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BidHistory findUnique
   */
  export type BidHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BidHistory
     */
    select?: BidHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BidHistory
     */
    omit?: BidHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidHistoryInclude<ExtArgs> | null
    /**
     * Filter, which BidHistory to fetch.
     */
    where: BidHistoryWhereUniqueInput
  }

  /**
   * BidHistory findUniqueOrThrow
   */
  export type BidHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BidHistory
     */
    select?: BidHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BidHistory
     */
    omit?: BidHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidHistoryInclude<ExtArgs> | null
    /**
     * Filter, which BidHistory to fetch.
     */
    where: BidHistoryWhereUniqueInput
  }

  /**
   * BidHistory findFirst
   */
  export type BidHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BidHistory
     */
    select?: BidHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BidHistory
     */
    omit?: BidHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidHistoryInclude<ExtArgs> | null
    /**
     * Filter, which BidHistory to fetch.
     */
    where?: BidHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BidHistories to fetch.
     */
    orderBy?: BidHistoryOrderByWithRelationInput | BidHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BidHistories.
     */
    cursor?: BidHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BidHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BidHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BidHistories.
     */
    distinct?: BidHistoryScalarFieldEnum | BidHistoryScalarFieldEnum[]
  }

  /**
   * BidHistory findFirstOrThrow
   */
  export type BidHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BidHistory
     */
    select?: BidHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BidHistory
     */
    omit?: BidHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidHistoryInclude<ExtArgs> | null
    /**
     * Filter, which BidHistory to fetch.
     */
    where?: BidHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BidHistories to fetch.
     */
    orderBy?: BidHistoryOrderByWithRelationInput | BidHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BidHistories.
     */
    cursor?: BidHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BidHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BidHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BidHistories.
     */
    distinct?: BidHistoryScalarFieldEnum | BidHistoryScalarFieldEnum[]
  }

  /**
   * BidHistory findMany
   */
  export type BidHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BidHistory
     */
    select?: BidHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BidHistory
     */
    omit?: BidHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidHistoryInclude<ExtArgs> | null
    /**
     * Filter, which BidHistories to fetch.
     */
    where?: BidHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BidHistories to fetch.
     */
    orderBy?: BidHistoryOrderByWithRelationInput | BidHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BidHistories.
     */
    cursor?: BidHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BidHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BidHistories.
     */
    skip?: number
    distinct?: BidHistoryScalarFieldEnum | BidHistoryScalarFieldEnum[]
  }

  /**
   * BidHistory create
   */
  export type BidHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BidHistory
     */
    select?: BidHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BidHistory
     */
    omit?: BidHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a BidHistory.
     */
    data: XOR<BidHistoryCreateInput, BidHistoryUncheckedCreateInput>
  }

  /**
   * BidHistory createMany
   */
  export type BidHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BidHistories.
     */
    data: BidHistoryCreateManyInput | BidHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BidHistory createManyAndReturn
   */
  export type BidHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BidHistory
     */
    select?: BidHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BidHistory
     */
    omit?: BidHistoryOmit<ExtArgs> | null
    /**
     * The data used to create many BidHistories.
     */
    data: BidHistoryCreateManyInput | BidHistoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BidHistory update
   */
  export type BidHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BidHistory
     */
    select?: BidHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BidHistory
     */
    omit?: BidHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a BidHistory.
     */
    data: XOR<BidHistoryUpdateInput, BidHistoryUncheckedUpdateInput>
    /**
     * Choose, which BidHistory to update.
     */
    where: BidHistoryWhereUniqueInput
  }

  /**
   * BidHistory updateMany
   */
  export type BidHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BidHistories.
     */
    data: XOR<BidHistoryUpdateManyMutationInput, BidHistoryUncheckedUpdateManyInput>
    /**
     * Filter which BidHistories to update
     */
    where?: BidHistoryWhereInput
    /**
     * Limit how many BidHistories to update.
     */
    limit?: number
  }

  /**
   * BidHistory updateManyAndReturn
   */
  export type BidHistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BidHistory
     */
    select?: BidHistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BidHistory
     */
    omit?: BidHistoryOmit<ExtArgs> | null
    /**
     * The data used to update BidHistories.
     */
    data: XOR<BidHistoryUpdateManyMutationInput, BidHistoryUncheckedUpdateManyInput>
    /**
     * Filter which BidHistories to update
     */
    where?: BidHistoryWhereInput
    /**
     * Limit how many BidHistories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidHistoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BidHistory upsert
   */
  export type BidHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BidHistory
     */
    select?: BidHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BidHistory
     */
    omit?: BidHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the BidHistory to update in case it exists.
     */
    where: BidHistoryWhereUniqueInput
    /**
     * In case the BidHistory found by the `where` argument doesn't exist, create a new BidHistory with this data.
     */
    create: XOR<BidHistoryCreateInput, BidHistoryUncheckedCreateInput>
    /**
     * In case the BidHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BidHistoryUpdateInput, BidHistoryUncheckedUpdateInput>
  }

  /**
   * BidHistory delete
   */
  export type BidHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BidHistory
     */
    select?: BidHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BidHistory
     */
    omit?: BidHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidHistoryInclude<ExtArgs> | null
    /**
     * Filter which BidHistory to delete.
     */
    where: BidHistoryWhereUniqueInput
  }

  /**
   * BidHistory deleteMany
   */
  export type BidHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BidHistories to delete
     */
    where?: BidHistoryWhereInput
    /**
     * Limit how many BidHistories to delete.
     */
    limit?: number
  }

  /**
   * BidHistory without action
   */
  export type BidHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BidHistory
     */
    select?: BidHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BidHistory
     */
    omit?: BidHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BidHistoryInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    userId: string | null
    action: string | null
    endpoint: string | null
    ipAddress: string | null
    createdAt: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    action: string | null
    endpoint: string | null
    ipAddress: string | null
    createdAt: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    userId: number
    action: number
    endpoint: number
    details: number
    ipAddress: number
    createdAt: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    endpoint?: true
    ipAddress?: true
    createdAt?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    endpoint?: true
    ipAddress?: true
    createdAt?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    endpoint?: true
    details?: true
    ipAddress?: true
    createdAt?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    userId: string
    action: string
    endpoint: string
    details: JsonValue | null
    ipAddress: string | null
    createdAt: Date
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    endpoint?: boolean
    details?: boolean
    ipAddress?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    endpoint?: boolean
    details?: boolean
    ipAddress?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    endpoint?: boolean
    details?: boolean
    ipAddress?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    userId?: boolean
    action?: boolean
    endpoint?: boolean
    details?: boolean
    ipAddress?: boolean
    createdAt?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "action" | "endpoint" | "details" | "ipAddress" | "createdAt", ExtArgs["result"]["auditLog"]>
  export type AuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AuditLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      action: string
      endpoint: string
      details: Prisma.JsonValue | null
      ipAddress: string | null
      createdAt: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly userId: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly endpoint: FieldRef<"AuditLog", 'String'>
    readonly details: FieldRef<"AuditLog", 'Json'>
    readonly ipAddress: FieldRef<"AuditLog", 'String'>
    readonly createdAt: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
  }


  /**
   * Model Feedback
   */

  export type AggregateFeedback = {
    _count: FeedbackCountAggregateOutputType | null
    _avg: FeedbackAvgAggregateOutputType | null
    _sum: FeedbackSumAggregateOutputType | null
    _min: FeedbackMinAggregateOutputType | null
    _max: FeedbackMaxAggregateOutputType | null
  }

  export type FeedbackAvgAggregateOutputType = {
    rating: number | null
  }

  export type FeedbackSumAggregateOutputType = {
    rating: number | null
  }

  export type FeedbackMinAggregateOutputType = {
    id: string | null
    userId: string | null
    rating: number | null
    message: string | null
    createdAt: Date | null
  }

  export type FeedbackMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    rating: number | null
    message: string | null
    createdAt: Date | null
  }

  export type FeedbackCountAggregateOutputType = {
    id: number
    userId: number
    rating: number
    message: number
    createdAt: number
    _all: number
  }


  export type FeedbackAvgAggregateInputType = {
    rating?: true
  }

  export type FeedbackSumAggregateInputType = {
    rating?: true
  }

  export type FeedbackMinAggregateInputType = {
    id?: true
    userId?: true
    rating?: true
    message?: true
    createdAt?: true
  }

  export type FeedbackMaxAggregateInputType = {
    id?: true
    userId?: true
    rating?: true
    message?: true
    createdAt?: true
  }

  export type FeedbackCountAggregateInputType = {
    id?: true
    userId?: true
    rating?: true
    message?: true
    createdAt?: true
    _all?: true
  }

  export type FeedbackAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Feedback to aggregate.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Feedbacks
    **/
    _count?: true | FeedbackCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FeedbackAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FeedbackSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FeedbackMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FeedbackMaxAggregateInputType
  }

  export type GetFeedbackAggregateType<T extends FeedbackAggregateArgs> = {
        [P in keyof T & keyof AggregateFeedback]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFeedback[P]>
      : GetScalarType<T[P], AggregateFeedback[P]>
  }




  export type FeedbackGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FeedbackWhereInput
    orderBy?: FeedbackOrderByWithAggregationInput | FeedbackOrderByWithAggregationInput[]
    by: FeedbackScalarFieldEnum[] | FeedbackScalarFieldEnum
    having?: FeedbackScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FeedbackCountAggregateInputType | true
    _avg?: FeedbackAvgAggregateInputType
    _sum?: FeedbackSumAggregateInputType
    _min?: FeedbackMinAggregateInputType
    _max?: FeedbackMaxAggregateInputType
  }

  export type FeedbackGroupByOutputType = {
    id: string
    userId: string
    rating: number
    message: string | null
    createdAt: Date
    _count: FeedbackCountAggregateOutputType | null
    _avg: FeedbackAvgAggregateOutputType | null
    _sum: FeedbackSumAggregateOutputType | null
    _min: FeedbackMinAggregateOutputType | null
    _max: FeedbackMaxAggregateOutputType | null
  }

  type GetFeedbackGroupByPayload<T extends FeedbackGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FeedbackGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FeedbackGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FeedbackGroupByOutputType[P]>
            : GetScalarType<T[P], FeedbackGroupByOutputType[P]>
        }
      >
    >


  export type FeedbackSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    rating?: boolean
    message?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["feedback"]>

  export type FeedbackSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    rating?: boolean
    message?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["feedback"]>

  export type FeedbackSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    rating?: boolean
    message?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["feedback"]>

  export type FeedbackSelectScalar = {
    id?: boolean
    userId?: boolean
    rating?: boolean
    message?: boolean
    createdAt?: boolean
  }

  export type FeedbackOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "rating" | "message" | "createdAt", ExtArgs["result"]["feedback"]>
  export type FeedbackInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FeedbackIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FeedbackIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $FeedbackPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Feedback"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      rating: number
      message: string | null
      createdAt: Date
    }, ExtArgs["result"]["feedback"]>
    composites: {}
  }

  type FeedbackGetPayload<S extends boolean | null | undefined | FeedbackDefaultArgs> = $Result.GetResult<Prisma.$FeedbackPayload, S>

  type FeedbackCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FeedbackFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FeedbackCountAggregateInputType | true
    }

  export interface FeedbackDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Feedback'], meta: { name: 'Feedback' } }
    /**
     * Find zero or one Feedback that matches the filter.
     * @param {FeedbackFindUniqueArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FeedbackFindUniqueArgs>(args: SelectSubset<T, FeedbackFindUniqueArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Feedback that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FeedbackFindUniqueOrThrowArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FeedbackFindUniqueOrThrowArgs>(args: SelectSubset<T, FeedbackFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Feedback that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackFindFirstArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FeedbackFindFirstArgs>(args?: SelectSubset<T, FeedbackFindFirstArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Feedback that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackFindFirstOrThrowArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FeedbackFindFirstOrThrowArgs>(args?: SelectSubset<T, FeedbackFindFirstOrThrowArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Feedbacks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Feedbacks
     * const feedbacks = await prisma.feedback.findMany()
     * 
     * // Get first 10 Feedbacks
     * const feedbacks = await prisma.feedback.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const feedbackWithIdOnly = await prisma.feedback.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FeedbackFindManyArgs>(args?: SelectSubset<T, FeedbackFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Feedback.
     * @param {FeedbackCreateArgs} args - Arguments to create a Feedback.
     * @example
     * // Create one Feedback
     * const Feedback = await prisma.feedback.create({
     *   data: {
     *     // ... data to create a Feedback
     *   }
     * })
     * 
     */
    create<T extends FeedbackCreateArgs>(args: SelectSubset<T, FeedbackCreateArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Feedbacks.
     * @param {FeedbackCreateManyArgs} args - Arguments to create many Feedbacks.
     * @example
     * // Create many Feedbacks
     * const feedback = await prisma.feedback.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FeedbackCreateManyArgs>(args?: SelectSubset<T, FeedbackCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Feedbacks and returns the data saved in the database.
     * @param {FeedbackCreateManyAndReturnArgs} args - Arguments to create many Feedbacks.
     * @example
     * // Create many Feedbacks
     * const feedback = await prisma.feedback.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Feedbacks and only return the `id`
     * const feedbackWithIdOnly = await prisma.feedback.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FeedbackCreateManyAndReturnArgs>(args?: SelectSubset<T, FeedbackCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Feedback.
     * @param {FeedbackDeleteArgs} args - Arguments to delete one Feedback.
     * @example
     * // Delete one Feedback
     * const Feedback = await prisma.feedback.delete({
     *   where: {
     *     // ... filter to delete one Feedback
     *   }
     * })
     * 
     */
    delete<T extends FeedbackDeleteArgs>(args: SelectSubset<T, FeedbackDeleteArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Feedback.
     * @param {FeedbackUpdateArgs} args - Arguments to update one Feedback.
     * @example
     * // Update one Feedback
     * const feedback = await prisma.feedback.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FeedbackUpdateArgs>(args: SelectSubset<T, FeedbackUpdateArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Feedbacks.
     * @param {FeedbackDeleteManyArgs} args - Arguments to filter Feedbacks to delete.
     * @example
     * // Delete a few Feedbacks
     * const { count } = await prisma.feedback.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FeedbackDeleteManyArgs>(args?: SelectSubset<T, FeedbackDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Feedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Feedbacks
     * const feedback = await prisma.feedback.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FeedbackUpdateManyArgs>(args: SelectSubset<T, FeedbackUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Feedbacks and returns the data updated in the database.
     * @param {FeedbackUpdateManyAndReturnArgs} args - Arguments to update many Feedbacks.
     * @example
     * // Update many Feedbacks
     * const feedback = await prisma.feedback.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Feedbacks and only return the `id`
     * const feedbackWithIdOnly = await prisma.feedback.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FeedbackUpdateManyAndReturnArgs>(args: SelectSubset<T, FeedbackUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Feedback.
     * @param {FeedbackUpsertArgs} args - Arguments to update or create a Feedback.
     * @example
     * // Update or create a Feedback
     * const feedback = await prisma.feedback.upsert({
     *   create: {
     *     // ... data to create a Feedback
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Feedback we want to update
     *   }
     * })
     */
    upsert<T extends FeedbackUpsertArgs>(args: SelectSubset<T, FeedbackUpsertArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Feedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackCountArgs} args - Arguments to filter Feedbacks to count.
     * @example
     * // Count the number of Feedbacks
     * const count = await prisma.feedback.count({
     *   where: {
     *     // ... the filter for the Feedbacks we want to count
     *   }
     * })
    **/
    count<T extends FeedbackCountArgs>(
      args?: Subset<T, FeedbackCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FeedbackCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Feedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FeedbackAggregateArgs>(args: Subset<T, FeedbackAggregateArgs>): Prisma.PrismaPromise<GetFeedbackAggregateType<T>>

    /**
     * Group by Feedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FeedbackGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FeedbackGroupByArgs['orderBy'] }
        : { orderBy?: FeedbackGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FeedbackGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFeedbackGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Feedback model
   */
  readonly fields: FeedbackFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Feedback.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FeedbackClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Feedback model
   */
  interface FeedbackFieldRefs {
    readonly id: FieldRef<"Feedback", 'String'>
    readonly userId: FieldRef<"Feedback", 'String'>
    readonly rating: FieldRef<"Feedback", 'Int'>
    readonly message: FieldRef<"Feedback", 'String'>
    readonly createdAt: FieldRef<"Feedback", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Feedback findUnique
   */
  export type FeedbackFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where: FeedbackWhereUniqueInput
  }

  /**
   * Feedback findUniqueOrThrow
   */
  export type FeedbackFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where: FeedbackWhereUniqueInput
  }

  /**
   * Feedback findFirst
   */
  export type FeedbackFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Feedbacks.
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Feedbacks.
     */
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
  }

  /**
   * Feedback findFirstOrThrow
   */
  export type FeedbackFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Feedbacks.
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Feedbacks.
     */
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
  }

  /**
   * Feedback findMany
   */
  export type FeedbackFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter, which Feedbacks to fetch.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Feedbacks.
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
  }

  /**
   * Feedback create
   */
  export type FeedbackCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * The data needed to create a Feedback.
     */
    data: XOR<FeedbackCreateInput, FeedbackUncheckedCreateInput>
  }

  /**
   * Feedback createMany
   */
  export type FeedbackCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Feedbacks.
     */
    data: FeedbackCreateManyInput | FeedbackCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Feedback createManyAndReturn
   */
  export type FeedbackCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * The data used to create many Feedbacks.
     */
    data: FeedbackCreateManyInput | FeedbackCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Feedback update
   */
  export type FeedbackUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * The data needed to update a Feedback.
     */
    data: XOR<FeedbackUpdateInput, FeedbackUncheckedUpdateInput>
    /**
     * Choose, which Feedback to update.
     */
    where: FeedbackWhereUniqueInput
  }

  /**
   * Feedback updateMany
   */
  export type FeedbackUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Feedbacks.
     */
    data: XOR<FeedbackUpdateManyMutationInput, FeedbackUncheckedUpdateManyInput>
    /**
     * Filter which Feedbacks to update
     */
    where?: FeedbackWhereInput
    /**
     * Limit how many Feedbacks to update.
     */
    limit?: number
  }

  /**
   * Feedback updateManyAndReturn
   */
  export type FeedbackUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * The data used to update Feedbacks.
     */
    data: XOR<FeedbackUpdateManyMutationInput, FeedbackUncheckedUpdateManyInput>
    /**
     * Filter which Feedbacks to update
     */
    where?: FeedbackWhereInput
    /**
     * Limit how many Feedbacks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Feedback upsert
   */
  export type FeedbackUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * The filter to search for the Feedback to update in case it exists.
     */
    where: FeedbackWhereUniqueInput
    /**
     * In case the Feedback found by the `where` argument doesn't exist, create a new Feedback with this data.
     */
    create: XOR<FeedbackCreateInput, FeedbackUncheckedCreateInput>
    /**
     * In case the Feedback was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FeedbackUpdateInput, FeedbackUncheckedUpdateInput>
  }

  /**
   * Feedback delete
   */
  export type FeedbackDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter which Feedback to delete.
     */
    where: FeedbackWhereUniqueInput
  }

  /**
   * Feedback deleteMany
   */
  export type FeedbackDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Feedbacks to delete
     */
    where?: FeedbackWhereInput
    /**
     * Limit how many Feedbacks to delete.
     */
    limit?: number
  }

  /**
   * Feedback without action
   */
  export type FeedbackDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
  }


  /**
   * Model AuctionInsight
   */

  export type AggregateAuctionInsight = {
    _count: AuctionInsightCountAggregateOutputType | null
    _min: AuctionInsightMinAggregateOutputType | null
    _max: AuctionInsightMaxAggregateOutputType | null
  }

  export type AuctionInsightMinAggregateOutputType = {
    id: string | null
    auctionId: string | null
    createdAt: Date | null
  }

  export type AuctionInsightMaxAggregateOutputType = {
    id: string | null
    auctionId: string | null
    createdAt: Date | null
  }

  export type AuctionInsightCountAggregateOutputType = {
    id: number
    auctionId: number
    data: number
    createdAt: number
    _all: number
  }


  export type AuctionInsightMinAggregateInputType = {
    id?: true
    auctionId?: true
    createdAt?: true
  }

  export type AuctionInsightMaxAggregateInputType = {
    id?: true
    auctionId?: true
    createdAt?: true
  }

  export type AuctionInsightCountAggregateInputType = {
    id?: true
    auctionId?: true
    data?: true
    createdAt?: true
    _all?: true
  }

  export type AuctionInsightAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuctionInsight to aggregate.
     */
    where?: AuctionInsightWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuctionInsights to fetch.
     */
    orderBy?: AuctionInsightOrderByWithRelationInput | AuctionInsightOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuctionInsightWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuctionInsights from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuctionInsights.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuctionInsights
    **/
    _count?: true | AuctionInsightCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuctionInsightMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuctionInsightMaxAggregateInputType
  }

  export type GetAuctionInsightAggregateType<T extends AuctionInsightAggregateArgs> = {
        [P in keyof T & keyof AggregateAuctionInsight]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuctionInsight[P]>
      : GetScalarType<T[P], AggregateAuctionInsight[P]>
  }




  export type AuctionInsightGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuctionInsightWhereInput
    orderBy?: AuctionInsightOrderByWithAggregationInput | AuctionInsightOrderByWithAggregationInput[]
    by: AuctionInsightScalarFieldEnum[] | AuctionInsightScalarFieldEnum
    having?: AuctionInsightScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuctionInsightCountAggregateInputType | true
    _min?: AuctionInsightMinAggregateInputType
    _max?: AuctionInsightMaxAggregateInputType
  }

  export type AuctionInsightGroupByOutputType = {
    id: string
    auctionId: string
    data: JsonValue
    createdAt: Date
    _count: AuctionInsightCountAggregateOutputType | null
    _min: AuctionInsightMinAggregateOutputType | null
    _max: AuctionInsightMaxAggregateOutputType | null
  }

  type GetAuctionInsightGroupByPayload<T extends AuctionInsightGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuctionInsightGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuctionInsightGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuctionInsightGroupByOutputType[P]>
            : GetScalarType<T[P], AuctionInsightGroupByOutputType[P]>
        }
      >
    >


  export type AuctionInsightSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    auctionId?: boolean
    data?: boolean
    createdAt?: boolean
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auctionInsight"]>

  export type AuctionInsightSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    auctionId?: boolean
    data?: boolean
    createdAt?: boolean
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auctionInsight"]>

  export type AuctionInsightSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    auctionId?: boolean
    data?: boolean
    createdAt?: boolean
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auctionInsight"]>

  export type AuctionInsightSelectScalar = {
    id?: boolean
    auctionId?: boolean
    data?: boolean
    createdAt?: boolean
  }

  export type AuctionInsightOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "auctionId" | "data" | "createdAt", ExtArgs["result"]["auctionInsight"]>
  export type AuctionInsightInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }
  export type AuctionInsightIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }
  export type AuctionInsightIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auction?: boolean | AuctionDefaultArgs<ExtArgs>
  }

  export type $AuctionInsightPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuctionInsight"
    objects: {
      auction: Prisma.$AuctionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      auctionId: string
      data: Prisma.JsonValue
      createdAt: Date
    }, ExtArgs["result"]["auctionInsight"]>
    composites: {}
  }

  type AuctionInsightGetPayload<S extends boolean | null | undefined | AuctionInsightDefaultArgs> = $Result.GetResult<Prisma.$AuctionInsightPayload, S>

  type AuctionInsightCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuctionInsightFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuctionInsightCountAggregateInputType | true
    }

  export interface AuctionInsightDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuctionInsight'], meta: { name: 'AuctionInsight' } }
    /**
     * Find zero or one AuctionInsight that matches the filter.
     * @param {AuctionInsightFindUniqueArgs} args - Arguments to find a AuctionInsight
     * @example
     * // Get one AuctionInsight
     * const auctionInsight = await prisma.auctionInsight.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuctionInsightFindUniqueArgs>(args: SelectSubset<T, AuctionInsightFindUniqueArgs<ExtArgs>>): Prisma__AuctionInsightClient<$Result.GetResult<Prisma.$AuctionInsightPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuctionInsight that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuctionInsightFindUniqueOrThrowArgs} args - Arguments to find a AuctionInsight
     * @example
     * // Get one AuctionInsight
     * const auctionInsight = await prisma.auctionInsight.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuctionInsightFindUniqueOrThrowArgs>(args: SelectSubset<T, AuctionInsightFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuctionInsightClient<$Result.GetResult<Prisma.$AuctionInsightPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuctionInsight that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionInsightFindFirstArgs} args - Arguments to find a AuctionInsight
     * @example
     * // Get one AuctionInsight
     * const auctionInsight = await prisma.auctionInsight.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuctionInsightFindFirstArgs>(args?: SelectSubset<T, AuctionInsightFindFirstArgs<ExtArgs>>): Prisma__AuctionInsightClient<$Result.GetResult<Prisma.$AuctionInsightPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuctionInsight that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionInsightFindFirstOrThrowArgs} args - Arguments to find a AuctionInsight
     * @example
     * // Get one AuctionInsight
     * const auctionInsight = await prisma.auctionInsight.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuctionInsightFindFirstOrThrowArgs>(args?: SelectSubset<T, AuctionInsightFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuctionInsightClient<$Result.GetResult<Prisma.$AuctionInsightPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuctionInsights that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionInsightFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuctionInsights
     * const auctionInsights = await prisma.auctionInsight.findMany()
     * 
     * // Get first 10 AuctionInsights
     * const auctionInsights = await prisma.auctionInsight.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auctionInsightWithIdOnly = await prisma.auctionInsight.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuctionInsightFindManyArgs>(args?: SelectSubset<T, AuctionInsightFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuctionInsightPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuctionInsight.
     * @param {AuctionInsightCreateArgs} args - Arguments to create a AuctionInsight.
     * @example
     * // Create one AuctionInsight
     * const AuctionInsight = await prisma.auctionInsight.create({
     *   data: {
     *     // ... data to create a AuctionInsight
     *   }
     * })
     * 
     */
    create<T extends AuctionInsightCreateArgs>(args: SelectSubset<T, AuctionInsightCreateArgs<ExtArgs>>): Prisma__AuctionInsightClient<$Result.GetResult<Prisma.$AuctionInsightPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuctionInsights.
     * @param {AuctionInsightCreateManyArgs} args - Arguments to create many AuctionInsights.
     * @example
     * // Create many AuctionInsights
     * const auctionInsight = await prisma.auctionInsight.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuctionInsightCreateManyArgs>(args?: SelectSubset<T, AuctionInsightCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuctionInsights and returns the data saved in the database.
     * @param {AuctionInsightCreateManyAndReturnArgs} args - Arguments to create many AuctionInsights.
     * @example
     * // Create many AuctionInsights
     * const auctionInsight = await prisma.auctionInsight.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuctionInsights and only return the `id`
     * const auctionInsightWithIdOnly = await prisma.auctionInsight.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuctionInsightCreateManyAndReturnArgs>(args?: SelectSubset<T, AuctionInsightCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuctionInsightPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuctionInsight.
     * @param {AuctionInsightDeleteArgs} args - Arguments to delete one AuctionInsight.
     * @example
     * // Delete one AuctionInsight
     * const AuctionInsight = await prisma.auctionInsight.delete({
     *   where: {
     *     // ... filter to delete one AuctionInsight
     *   }
     * })
     * 
     */
    delete<T extends AuctionInsightDeleteArgs>(args: SelectSubset<T, AuctionInsightDeleteArgs<ExtArgs>>): Prisma__AuctionInsightClient<$Result.GetResult<Prisma.$AuctionInsightPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuctionInsight.
     * @param {AuctionInsightUpdateArgs} args - Arguments to update one AuctionInsight.
     * @example
     * // Update one AuctionInsight
     * const auctionInsight = await prisma.auctionInsight.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuctionInsightUpdateArgs>(args: SelectSubset<T, AuctionInsightUpdateArgs<ExtArgs>>): Prisma__AuctionInsightClient<$Result.GetResult<Prisma.$AuctionInsightPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuctionInsights.
     * @param {AuctionInsightDeleteManyArgs} args - Arguments to filter AuctionInsights to delete.
     * @example
     * // Delete a few AuctionInsights
     * const { count } = await prisma.auctionInsight.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuctionInsightDeleteManyArgs>(args?: SelectSubset<T, AuctionInsightDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuctionInsights.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionInsightUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuctionInsights
     * const auctionInsight = await prisma.auctionInsight.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuctionInsightUpdateManyArgs>(args: SelectSubset<T, AuctionInsightUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuctionInsights and returns the data updated in the database.
     * @param {AuctionInsightUpdateManyAndReturnArgs} args - Arguments to update many AuctionInsights.
     * @example
     * // Update many AuctionInsights
     * const auctionInsight = await prisma.auctionInsight.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuctionInsights and only return the `id`
     * const auctionInsightWithIdOnly = await prisma.auctionInsight.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuctionInsightUpdateManyAndReturnArgs>(args: SelectSubset<T, AuctionInsightUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuctionInsightPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuctionInsight.
     * @param {AuctionInsightUpsertArgs} args - Arguments to update or create a AuctionInsight.
     * @example
     * // Update or create a AuctionInsight
     * const auctionInsight = await prisma.auctionInsight.upsert({
     *   create: {
     *     // ... data to create a AuctionInsight
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuctionInsight we want to update
     *   }
     * })
     */
    upsert<T extends AuctionInsightUpsertArgs>(args: SelectSubset<T, AuctionInsightUpsertArgs<ExtArgs>>): Prisma__AuctionInsightClient<$Result.GetResult<Prisma.$AuctionInsightPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuctionInsights.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionInsightCountArgs} args - Arguments to filter AuctionInsights to count.
     * @example
     * // Count the number of AuctionInsights
     * const count = await prisma.auctionInsight.count({
     *   where: {
     *     // ... the filter for the AuctionInsights we want to count
     *   }
     * })
    **/
    count<T extends AuctionInsightCountArgs>(
      args?: Subset<T, AuctionInsightCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuctionInsightCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuctionInsight.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionInsightAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuctionInsightAggregateArgs>(args: Subset<T, AuctionInsightAggregateArgs>): Prisma.PrismaPromise<GetAuctionInsightAggregateType<T>>

    /**
     * Group by AuctionInsight.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionInsightGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuctionInsightGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuctionInsightGroupByArgs['orderBy'] }
        : { orderBy?: AuctionInsightGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuctionInsightGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuctionInsightGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuctionInsight model
   */
  readonly fields: AuctionInsightFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuctionInsight.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuctionInsightClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    auction<T extends AuctionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuctionDefaultArgs<ExtArgs>>): Prisma__AuctionClient<$Result.GetResult<Prisma.$AuctionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuctionInsight model
   */
  interface AuctionInsightFieldRefs {
    readonly id: FieldRef<"AuctionInsight", 'String'>
    readonly auctionId: FieldRef<"AuctionInsight", 'String'>
    readonly data: FieldRef<"AuctionInsight", 'Json'>
    readonly createdAt: FieldRef<"AuctionInsight", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuctionInsight findUnique
   */
  export type AuctionInsightFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionInsight
     */
    select?: AuctionInsightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionInsight
     */
    omit?: AuctionInsightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInsightInclude<ExtArgs> | null
    /**
     * Filter, which AuctionInsight to fetch.
     */
    where: AuctionInsightWhereUniqueInput
  }

  /**
   * AuctionInsight findUniqueOrThrow
   */
  export type AuctionInsightFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionInsight
     */
    select?: AuctionInsightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionInsight
     */
    omit?: AuctionInsightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInsightInclude<ExtArgs> | null
    /**
     * Filter, which AuctionInsight to fetch.
     */
    where: AuctionInsightWhereUniqueInput
  }

  /**
   * AuctionInsight findFirst
   */
  export type AuctionInsightFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionInsight
     */
    select?: AuctionInsightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionInsight
     */
    omit?: AuctionInsightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInsightInclude<ExtArgs> | null
    /**
     * Filter, which AuctionInsight to fetch.
     */
    where?: AuctionInsightWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuctionInsights to fetch.
     */
    orderBy?: AuctionInsightOrderByWithRelationInput | AuctionInsightOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuctionInsights.
     */
    cursor?: AuctionInsightWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuctionInsights from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuctionInsights.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuctionInsights.
     */
    distinct?: AuctionInsightScalarFieldEnum | AuctionInsightScalarFieldEnum[]
  }

  /**
   * AuctionInsight findFirstOrThrow
   */
  export type AuctionInsightFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionInsight
     */
    select?: AuctionInsightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionInsight
     */
    omit?: AuctionInsightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInsightInclude<ExtArgs> | null
    /**
     * Filter, which AuctionInsight to fetch.
     */
    where?: AuctionInsightWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuctionInsights to fetch.
     */
    orderBy?: AuctionInsightOrderByWithRelationInput | AuctionInsightOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuctionInsights.
     */
    cursor?: AuctionInsightWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuctionInsights from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuctionInsights.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuctionInsights.
     */
    distinct?: AuctionInsightScalarFieldEnum | AuctionInsightScalarFieldEnum[]
  }

  /**
   * AuctionInsight findMany
   */
  export type AuctionInsightFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionInsight
     */
    select?: AuctionInsightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionInsight
     */
    omit?: AuctionInsightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInsightInclude<ExtArgs> | null
    /**
     * Filter, which AuctionInsights to fetch.
     */
    where?: AuctionInsightWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuctionInsights to fetch.
     */
    orderBy?: AuctionInsightOrderByWithRelationInput | AuctionInsightOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuctionInsights.
     */
    cursor?: AuctionInsightWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuctionInsights from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuctionInsights.
     */
    skip?: number
    distinct?: AuctionInsightScalarFieldEnum | AuctionInsightScalarFieldEnum[]
  }

  /**
   * AuctionInsight create
   */
  export type AuctionInsightCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionInsight
     */
    select?: AuctionInsightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionInsight
     */
    omit?: AuctionInsightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInsightInclude<ExtArgs> | null
    /**
     * The data needed to create a AuctionInsight.
     */
    data: XOR<AuctionInsightCreateInput, AuctionInsightUncheckedCreateInput>
  }

  /**
   * AuctionInsight createMany
   */
  export type AuctionInsightCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuctionInsights.
     */
    data: AuctionInsightCreateManyInput | AuctionInsightCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuctionInsight createManyAndReturn
   */
  export type AuctionInsightCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionInsight
     */
    select?: AuctionInsightSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionInsight
     */
    omit?: AuctionInsightOmit<ExtArgs> | null
    /**
     * The data used to create many AuctionInsights.
     */
    data: AuctionInsightCreateManyInput | AuctionInsightCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInsightIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuctionInsight update
   */
  export type AuctionInsightUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionInsight
     */
    select?: AuctionInsightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionInsight
     */
    omit?: AuctionInsightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInsightInclude<ExtArgs> | null
    /**
     * The data needed to update a AuctionInsight.
     */
    data: XOR<AuctionInsightUpdateInput, AuctionInsightUncheckedUpdateInput>
    /**
     * Choose, which AuctionInsight to update.
     */
    where: AuctionInsightWhereUniqueInput
  }

  /**
   * AuctionInsight updateMany
   */
  export type AuctionInsightUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuctionInsights.
     */
    data: XOR<AuctionInsightUpdateManyMutationInput, AuctionInsightUncheckedUpdateManyInput>
    /**
     * Filter which AuctionInsights to update
     */
    where?: AuctionInsightWhereInput
    /**
     * Limit how many AuctionInsights to update.
     */
    limit?: number
  }

  /**
   * AuctionInsight updateManyAndReturn
   */
  export type AuctionInsightUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionInsight
     */
    select?: AuctionInsightSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionInsight
     */
    omit?: AuctionInsightOmit<ExtArgs> | null
    /**
     * The data used to update AuctionInsights.
     */
    data: XOR<AuctionInsightUpdateManyMutationInput, AuctionInsightUncheckedUpdateManyInput>
    /**
     * Filter which AuctionInsights to update
     */
    where?: AuctionInsightWhereInput
    /**
     * Limit how many AuctionInsights to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInsightIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuctionInsight upsert
   */
  export type AuctionInsightUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionInsight
     */
    select?: AuctionInsightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionInsight
     */
    omit?: AuctionInsightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInsightInclude<ExtArgs> | null
    /**
     * The filter to search for the AuctionInsight to update in case it exists.
     */
    where: AuctionInsightWhereUniqueInput
    /**
     * In case the AuctionInsight found by the `where` argument doesn't exist, create a new AuctionInsight with this data.
     */
    create: XOR<AuctionInsightCreateInput, AuctionInsightUncheckedCreateInput>
    /**
     * In case the AuctionInsight was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuctionInsightUpdateInput, AuctionInsightUncheckedUpdateInput>
  }

  /**
   * AuctionInsight delete
   */
  export type AuctionInsightDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionInsight
     */
    select?: AuctionInsightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionInsight
     */
    omit?: AuctionInsightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInsightInclude<ExtArgs> | null
    /**
     * Filter which AuctionInsight to delete.
     */
    where: AuctionInsightWhereUniqueInput
  }

  /**
   * AuctionInsight deleteMany
   */
  export type AuctionInsightDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuctionInsights to delete
     */
    where?: AuctionInsightWhereInput
    /**
     * Limit how many AuctionInsights to delete.
     */
    limit?: number
  }

  /**
   * AuctionInsight without action
   */
  export type AuctionInsightDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionInsight
     */
    select?: AuctionInsightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionInsight
     */
    omit?: AuctionInsightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionInsightInclude<ExtArgs> | null
  }


  /**
   * Model ContactMessage
   */

  export type AggregateContactMessage = {
    _count: ContactMessageCountAggregateOutputType | null
    _min: ContactMessageMinAggregateOutputType | null
    _max: ContactMessageMaxAggregateOutputType | null
  }

  export type ContactMessageMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    mobile: string | null
    message: string | null
    isRead: boolean | null
    createdAt: Date | null
  }

  export type ContactMessageMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    mobile: string | null
    message: string | null
    isRead: boolean | null
    createdAt: Date | null
  }

  export type ContactMessageCountAggregateOutputType = {
    id: number
    name: number
    email: number
    mobile: number
    message: number
    isRead: number
    createdAt: number
    _all: number
  }


  export type ContactMessageMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    mobile?: true
    message?: true
    isRead?: true
    createdAt?: true
  }

  export type ContactMessageMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    mobile?: true
    message?: true
    isRead?: true
    createdAt?: true
  }

  export type ContactMessageCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    mobile?: true
    message?: true
    isRead?: true
    createdAt?: true
    _all?: true
  }

  export type ContactMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContactMessage to aggregate.
     */
    where?: ContactMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactMessages to fetch.
     */
    orderBy?: ContactMessageOrderByWithRelationInput | ContactMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ContactMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ContactMessages
    **/
    _count?: true | ContactMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContactMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContactMessageMaxAggregateInputType
  }

  export type GetContactMessageAggregateType<T extends ContactMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateContactMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContactMessage[P]>
      : GetScalarType<T[P], AggregateContactMessage[P]>
  }




  export type ContactMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContactMessageWhereInput
    orderBy?: ContactMessageOrderByWithAggregationInput | ContactMessageOrderByWithAggregationInput[]
    by: ContactMessageScalarFieldEnum[] | ContactMessageScalarFieldEnum
    having?: ContactMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContactMessageCountAggregateInputType | true
    _min?: ContactMessageMinAggregateInputType
    _max?: ContactMessageMaxAggregateInputType
  }

  export type ContactMessageGroupByOutputType = {
    id: string
    name: string
    email: string
    mobile: string | null
    message: string
    isRead: boolean
    createdAt: Date
    _count: ContactMessageCountAggregateOutputType | null
    _min: ContactMessageMinAggregateOutputType | null
    _max: ContactMessageMaxAggregateOutputType | null
  }

  type GetContactMessageGroupByPayload<T extends ContactMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ContactMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContactMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContactMessageGroupByOutputType[P]>
            : GetScalarType<T[P], ContactMessageGroupByOutputType[P]>
        }
      >
    >


  export type ContactMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    mobile?: boolean
    message?: boolean
    isRead?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["contactMessage"]>

  export type ContactMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    mobile?: boolean
    message?: boolean
    isRead?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["contactMessage"]>

  export type ContactMessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    mobile?: boolean
    message?: boolean
    isRead?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["contactMessage"]>

  export type ContactMessageSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    mobile?: boolean
    message?: boolean
    isRead?: boolean
    createdAt?: boolean
  }

  export type ContactMessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "mobile" | "message" | "isRead" | "createdAt", ExtArgs["result"]["contactMessage"]>

  export type $ContactMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ContactMessage"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      mobile: string | null
      message: string
      isRead: boolean
      createdAt: Date
    }, ExtArgs["result"]["contactMessage"]>
    composites: {}
  }

  type ContactMessageGetPayload<S extends boolean | null | undefined | ContactMessageDefaultArgs> = $Result.GetResult<Prisma.$ContactMessagePayload, S>

  type ContactMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ContactMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ContactMessageCountAggregateInputType | true
    }

  export interface ContactMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ContactMessage'], meta: { name: 'ContactMessage' } }
    /**
     * Find zero or one ContactMessage that matches the filter.
     * @param {ContactMessageFindUniqueArgs} args - Arguments to find a ContactMessage
     * @example
     * // Get one ContactMessage
     * const contactMessage = await prisma.contactMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ContactMessageFindUniqueArgs>(args: SelectSubset<T, ContactMessageFindUniqueArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ContactMessage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ContactMessageFindUniqueOrThrowArgs} args - Arguments to find a ContactMessage
     * @example
     * // Get one ContactMessage
     * const contactMessage = await prisma.contactMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ContactMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, ContactMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContactMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactMessageFindFirstArgs} args - Arguments to find a ContactMessage
     * @example
     * // Get one ContactMessage
     * const contactMessage = await prisma.contactMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ContactMessageFindFirstArgs>(args?: SelectSubset<T, ContactMessageFindFirstArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContactMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactMessageFindFirstOrThrowArgs} args - Arguments to find a ContactMessage
     * @example
     * // Get one ContactMessage
     * const contactMessage = await prisma.contactMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ContactMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, ContactMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ContactMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ContactMessages
     * const contactMessages = await prisma.contactMessage.findMany()
     * 
     * // Get first 10 ContactMessages
     * const contactMessages = await prisma.contactMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const contactMessageWithIdOnly = await prisma.contactMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ContactMessageFindManyArgs>(args?: SelectSubset<T, ContactMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ContactMessage.
     * @param {ContactMessageCreateArgs} args - Arguments to create a ContactMessage.
     * @example
     * // Create one ContactMessage
     * const ContactMessage = await prisma.contactMessage.create({
     *   data: {
     *     // ... data to create a ContactMessage
     *   }
     * })
     * 
     */
    create<T extends ContactMessageCreateArgs>(args: SelectSubset<T, ContactMessageCreateArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ContactMessages.
     * @param {ContactMessageCreateManyArgs} args - Arguments to create many ContactMessages.
     * @example
     * // Create many ContactMessages
     * const contactMessage = await prisma.contactMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ContactMessageCreateManyArgs>(args?: SelectSubset<T, ContactMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ContactMessages and returns the data saved in the database.
     * @param {ContactMessageCreateManyAndReturnArgs} args - Arguments to create many ContactMessages.
     * @example
     * // Create many ContactMessages
     * const contactMessage = await prisma.contactMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ContactMessages and only return the `id`
     * const contactMessageWithIdOnly = await prisma.contactMessage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ContactMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, ContactMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ContactMessage.
     * @param {ContactMessageDeleteArgs} args - Arguments to delete one ContactMessage.
     * @example
     * // Delete one ContactMessage
     * const ContactMessage = await prisma.contactMessage.delete({
     *   where: {
     *     // ... filter to delete one ContactMessage
     *   }
     * })
     * 
     */
    delete<T extends ContactMessageDeleteArgs>(args: SelectSubset<T, ContactMessageDeleteArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ContactMessage.
     * @param {ContactMessageUpdateArgs} args - Arguments to update one ContactMessage.
     * @example
     * // Update one ContactMessage
     * const contactMessage = await prisma.contactMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ContactMessageUpdateArgs>(args: SelectSubset<T, ContactMessageUpdateArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ContactMessages.
     * @param {ContactMessageDeleteManyArgs} args - Arguments to filter ContactMessages to delete.
     * @example
     * // Delete a few ContactMessages
     * const { count } = await prisma.contactMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ContactMessageDeleteManyArgs>(args?: SelectSubset<T, ContactMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContactMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ContactMessages
     * const contactMessage = await prisma.contactMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ContactMessageUpdateManyArgs>(args: SelectSubset<T, ContactMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContactMessages and returns the data updated in the database.
     * @param {ContactMessageUpdateManyAndReturnArgs} args - Arguments to update many ContactMessages.
     * @example
     * // Update many ContactMessages
     * const contactMessage = await prisma.contactMessage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ContactMessages and only return the `id`
     * const contactMessageWithIdOnly = await prisma.contactMessage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ContactMessageUpdateManyAndReturnArgs>(args: SelectSubset<T, ContactMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ContactMessage.
     * @param {ContactMessageUpsertArgs} args - Arguments to update or create a ContactMessage.
     * @example
     * // Update or create a ContactMessage
     * const contactMessage = await prisma.contactMessage.upsert({
     *   create: {
     *     // ... data to create a ContactMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ContactMessage we want to update
     *   }
     * })
     */
    upsert<T extends ContactMessageUpsertArgs>(args: SelectSubset<T, ContactMessageUpsertArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ContactMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactMessageCountArgs} args - Arguments to filter ContactMessages to count.
     * @example
     * // Count the number of ContactMessages
     * const count = await prisma.contactMessage.count({
     *   where: {
     *     // ... the filter for the ContactMessages we want to count
     *   }
     * })
    **/
    count<T extends ContactMessageCountArgs>(
      args?: Subset<T, ContactMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContactMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ContactMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ContactMessageAggregateArgs>(args: Subset<T, ContactMessageAggregateArgs>): Prisma.PrismaPromise<GetContactMessageAggregateType<T>>

    /**
     * Group by ContactMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ContactMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ContactMessageGroupByArgs['orderBy'] }
        : { orderBy?: ContactMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ContactMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContactMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ContactMessage model
   */
  readonly fields: ContactMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ContactMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ContactMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ContactMessage model
   */
  interface ContactMessageFieldRefs {
    readonly id: FieldRef<"ContactMessage", 'String'>
    readonly name: FieldRef<"ContactMessage", 'String'>
    readonly email: FieldRef<"ContactMessage", 'String'>
    readonly mobile: FieldRef<"ContactMessage", 'String'>
    readonly message: FieldRef<"ContactMessage", 'String'>
    readonly isRead: FieldRef<"ContactMessage", 'Boolean'>
    readonly createdAt: FieldRef<"ContactMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ContactMessage findUnique
   */
  export type ContactMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
    /**
     * Filter, which ContactMessage to fetch.
     */
    where: ContactMessageWhereUniqueInput
  }

  /**
   * ContactMessage findUniqueOrThrow
   */
  export type ContactMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
    /**
     * Filter, which ContactMessage to fetch.
     */
    where: ContactMessageWhereUniqueInput
  }

  /**
   * ContactMessage findFirst
   */
  export type ContactMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
    /**
     * Filter, which ContactMessage to fetch.
     */
    where?: ContactMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactMessages to fetch.
     */
    orderBy?: ContactMessageOrderByWithRelationInput | ContactMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContactMessages.
     */
    cursor?: ContactMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContactMessages.
     */
    distinct?: ContactMessageScalarFieldEnum | ContactMessageScalarFieldEnum[]
  }

  /**
   * ContactMessage findFirstOrThrow
   */
  export type ContactMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
    /**
     * Filter, which ContactMessage to fetch.
     */
    where?: ContactMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactMessages to fetch.
     */
    orderBy?: ContactMessageOrderByWithRelationInput | ContactMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContactMessages.
     */
    cursor?: ContactMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContactMessages.
     */
    distinct?: ContactMessageScalarFieldEnum | ContactMessageScalarFieldEnum[]
  }

  /**
   * ContactMessage findMany
   */
  export type ContactMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
    /**
     * Filter, which ContactMessages to fetch.
     */
    where?: ContactMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactMessages to fetch.
     */
    orderBy?: ContactMessageOrderByWithRelationInput | ContactMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ContactMessages.
     */
    cursor?: ContactMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactMessages.
     */
    skip?: number
    distinct?: ContactMessageScalarFieldEnum | ContactMessageScalarFieldEnum[]
  }

  /**
   * ContactMessage create
   */
  export type ContactMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
    /**
     * The data needed to create a ContactMessage.
     */
    data: XOR<ContactMessageCreateInput, ContactMessageUncheckedCreateInput>
  }

  /**
   * ContactMessage createMany
   */
  export type ContactMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ContactMessages.
     */
    data: ContactMessageCreateManyInput | ContactMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContactMessage createManyAndReturn
   */
  export type ContactMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
    /**
     * The data used to create many ContactMessages.
     */
    data: ContactMessageCreateManyInput | ContactMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContactMessage update
   */
  export type ContactMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
    /**
     * The data needed to update a ContactMessage.
     */
    data: XOR<ContactMessageUpdateInput, ContactMessageUncheckedUpdateInput>
    /**
     * Choose, which ContactMessage to update.
     */
    where: ContactMessageWhereUniqueInput
  }

  /**
   * ContactMessage updateMany
   */
  export type ContactMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ContactMessages.
     */
    data: XOR<ContactMessageUpdateManyMutationInput, ContactMessageUncheckedUpdateManyInput>
    /**
     * Filter which ContactMessages to update
     */
    where?: ContactMessageWhereInput
    /**
     * Limit how many ContactMessages to update.
     */
    limit?: number
  }

  /**
   * ContactMessage updateManyAndReturn
   */
  export type ContactMessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
    /**
     * The data used to update ContactMessages.
     */
    data: XOR<ContactMessageUpdateManyMutationInput, ContactMessageUncheckedUpdateManyInput>
    /**
     * Filter which ContactMessages to update
     */
    where?: ContactMessageWhereInput
    /**
     * Limit how many ContactMessages to update.
     */
    limit?: number
  }

  /**
   * ContactMessage upsert
   */
  export type ContactMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
    /**
     * The filter to search for the ContactMessage to update in case it exists.
     */
    where: ContactMessageWhereUniqueInput
    /**
     * In case the ContactMessage found by the `where` argument doesn't exist, create a new ContactMessage with this data.
     */
    create: XOR<ContactMessageCreateInput, ContactMessageUncheckedCreateInput>
    /**
     * In case the ContactMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ContactMessageUpdateInput, ContactMessageUncheckedUpdateInput>
  }

  /**
   * ContactMessage delete
   */
  export type ContactMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
    /**
     * Filter which ContactMessage to delete.
     */
    where: ContactMessageWhereUniqueInput
  }

  /**
   * ContactMessage deleteMany
   */
  export type ContactMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContactMessages to delete
     */
    where?: ContactMessageWhereInput
    /**
     * Limit how many ContactMessages to delete.
     */
    limit?: number
  }

  /**
   * ContactMessage without action
   */
  export type ContactMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    firebaseUid: 'firebaseUid',
    name: 'name',
    email: 'email',
    role: 'role',
    password: 'password',
    mobile: 'mobile',
    city: 'city',
    profileUrl: 'profileUrl',
    createdAt: 'createdAt',
    stripeCustomerId: 'stripeCustomerId'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AuctionScalarFieldEnum: {
    id: 'id',
    auctionCode: 'auctionCode',
    organizerId: 'organizerId',
    name: 'name',
    location: 'location',
    logo: 'logo',
    sportsType: 'sportsType',
    season: 'season',
    auctionDate: 'auctionDate',
    auctionStartTime: 'auctionStartTime',
    budgetPerTeam: 'budgetPerTeam',
    minBid: 'minBid',
    bidIncrease: 'bidIncrease',
    minPlayersPerTeam: 'minPlayersPerTeam',
    maxPlayersPerTeam: 'maxPlayersPerTeam',
    isBoosterEnabled: 'isBoosterEnabled',
    boosterAmount: 'boosterAmount',
    boosterTriggerPlayerCount: 'boosterTriggerPlayerCount',
    bidRules: 'bidRules',
    planTier: 'planTier',
    isPaid: 'isPaid',
    razorpayOrderId: 'razorpayOrderId',
    razorpayPaymentId: 'razorpayPaymentId',
    razorpaySignature: 'razorpaySignature',
    status: 'status',
    liveTheme: 'liveTheme',
    soldEffect: 'soldEffect',
    overlayTheme: 'overlayTheme',
    overlayLayout: 'overlayLayout',
    createdAt: 'createdAt',
    ArchivedAt: 'ArchivedAt'
  };

  export type AuctionScalarFieldEnum = (typeof AuctionScalarFieldEnum)[keyof typeof AuctionScalarFieldEnum]


  export const JoinedAuctionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    auctionId: 'auctionId',
    joinedAt: 'joinedAt'
  };

  export type JoinedAuctionScalarFieldEnum = (typeof JoinedAuctionScalarFieldEnum)[keyof typeof JoinedAuctionScalarFieldEnum]


  export const CategoryScalarFieldEnum: {
    id: 'id',
    auctionId: 'auctionId',
    name: 'name',
    color: 'color',
    baseBid: 'baseBid',
    minIncrement: 'minIncrement',
    maxPlayersPerTeam: 'maxPlayersPerTeam',
    minPlayersPerTeam: 'minPlayersPerTeam'
  };

  export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum]


  export const TeamScalarFieldEnum: {
    id: 'id',
    auctionId: 'auctionId',
    name: 'name',
    shortName: 'shortName',
    shortcutKey: 'shortcutKey',
    logo: 'logo',
    originalPurse: 'originalPurse',
    purseSpent: 'purseSpent',
    playersCount: 'playersCount'
  };

  export type TeamScalarFieldEnum = (typeof TeamScalarFieldEnum)[keyof typeof TeamScalarFieldEnum]


  export const PlayerScalarFieldEnum: {
    id: 'id',
    auctionId: 'auctionId',
    categoryId: 'categoryId',
    name: 'name',
    mobile: 'mobile',
    age: 'age',
    fatherName: 'fatherName',
    profilePic: 'profilePic',
    role: 'role',
    battingStyle: 'battingStyle',
    bowlingStyle: 'bowlingStyle',
    tshirtSize: 'tshirtSize',
    trouserSize: 'trouserSize',
    jerseyName: 'jerseyName',
    jerseyNumber: 'jerseyNumber',
    status: 'status',
    basePrice: 'basePrice',
    teamId: 'teamId',
    soldPrice: 'soldPrice'
  };

  export type PlayerScalarFieldEnum = (typeof PlayerScalarFieldEnum)[keyof typeof PlayerScalarFieldEnum]


  export const BidHistoryScalarFieldEnum: {
    id: 'id',
    playerId: 'playerId',
    auctionId: 'auctionId',
    teamId: 'teamId',
    amount: 'amount',
    timestamp: 'timestamp'
  };

  export type BidHistoryScalarFieldEnum = (typeof BidHistoryScalarFieldEnum)[keyof typeof BidHistoryScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    action: 'action',
    endpoint: 'endpoint',
    details: 'details',
    ipAddress: 'ipAddress',
    createdAt: 'createdAt'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const FeedbackScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    rating: 'rating',
    message: 'message',
    createdAt: 'createdAt'
  };

  export type FeedbackScalarFieldEnum = (typeof FeedbackScalarFieldEnum)[keyof typeof FeedbackScalarFieldEnum]


  export const AuctionInsightScalarFieldEnum: {
    id: 'id',
    auctionId: 'auctionId',
    data: 'data',
    createdAt: 'createdAt'
  };

  export type AuctionInsightScalarFieldEnum = (typeof AuctionInsightScalarFieldEnum)[keyof typeof AuctionInsightScalarFieldEnum]


  export const ContactMessageScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    mobile: 'mobile',
    message: 'message',
    isRead: 'isRead',
    createdAt: 'createdAt'
  };

  export type ContactMessageScalarFieldEnum = (typeof ContactMessageScalarFieldEnum)[keyof typeof ContactMessageScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'PlanTier'
   */
  export type EnumPlanTierFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlanTier'>
    


  /**
   * Reference to a field of type 'PlanTier[]'
   */
  export type ListEnumPlanTierFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlanTier[]'>
    


  /**
   * Reference to a field of type 'AuctionStatus'
   */
  export type EnumAuctionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuctionStatus'>
    


  /**
   * Reference to a field of type 'AuctionStatus[]'
   */
  export type ListEnumAuctionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuctionStatus[]'>
    


  /**
   * Reference to a field of type 'PlayerRole'
   */
  export type EnumPlayerRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlayerRole'>
    


  /**
   * Reference to a field of type 'PlayerRole[]'
   */
  export type ListEnumPlayerRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlayerRole[]'>
    


  /**
   * Reference to a field of type 'PlayerStatus'
   */
  export type EnumPlayerStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlayerStatus'>
    


  /**
   * Reference to a field of type 'PlayerStatus[]'
   */
  export type ListEnumPlayerStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlayerStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    firebaseUid?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    password?: StringNullableFilter<"User"> | string | null
    mobile?: StringNullableFilter<"User"> | string | null
    city?: StringNullableFilter<"User"> | string | null
    profileUrl?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    stripeCustomerId?: StringNullableFilter<"User"> | string | null
    auctions?: AuctionListRelationFilter
    joinedAuctions?: JoinedAuctionListRelationFilter
    auditLogs?: AuditLogListRelationFilter
    feedback?: XOR<FeedbackNullableScalarRelationFilter, FeedbackWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    password?: SortOrderInput | SortOrder
    mobile?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    profileUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    auctions?: AuctionOrderByRelationAggregateInput
    joinedAuctions?: JoinedAuctionOrderByRelationAggregateInput
    auditLogs?: AuditLogOrderByRelationAggregateInput
    feedback?: FeedbackOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    firebaseUid?: string
    email?: string
    mobile?: string
    stripeCustomerId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    password?: StringNullableFilter<"User"> | string | null
    city?: StringNullableFilter<"User"> | string | null
    profileUrl?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    auctions?: AuctionListRelationFilter
    joinedAuctions?: JoinedAuctionListRelationFilter
    auditLogs?: AuditLogListRelationFilter
    feedback?: XOR<FeedbackNullableScalarRelationFilter, FeedbackWhereInput> | null
  }, "id" | "firebaseUid" | "email" | "mobile" | "stripeCustomerId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    password?: SortOrderInput | SortOrder
    mobile?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    profileUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    firebaseUid?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    password?: StringNullableWithAggregatesFilter<"User"> | string | null
    mobile?: StringNullableWithAggregatesFilter<"User"> | string | null
    city?: StringNullableWithAggregatesFilter<"User"> | string | null
    profileUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    stripeCustomerId?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type AuctionWhereInput = {
    AND?: AuctionWhereInput | AuctionWhereInput[]
    OR?: AuctionWhereInput[]
    NOT?: AuctionWhereInput | AuctionWhereInput[]
    id?: StringFilter<"Auction"> | string
    auctionCode?: StringFilter<"Auction"> | string
    organizerId?: StringFilter<"Auction"> | string
    name?: StringFilter<"Auction"> | string
    location?: StringNullableFilter<"Auction"> | string | null
    logo?: StringNullableFilter<"Auction"> | string | null
    sportsType?: StringFilter<"Auction"> | string
    season?: StringNullableFilter<"Auction"> | string | null
    auctionDate?: DateTimeFilter<"Auction"> | Date | string
    auctionStartTime?: StringNullableFilter<"Auction"> | string | null
    budgetPerTeam?: DecimalFilter<"Auction"> | Decimal | DecimalJsLike | number | string
    minBid?: DecimalFilter<"Auction"> | Decimal | DecimalJsLike | number | string
    bidIncrease?: DecimalFilter<"Auction"> | Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: IntFilter<"Auction"> | number
    maxPlayersPerTeam?: IntFilter<"Auction"> | number
    isBoosterEnabled?: BoolFilter<"Auction"> | boolean
    boosterAmount?: IntNullableFilter<"Auction"> | number | null
    boosterTriggerPlayerCount?: IntNullableFilter<"Auction"> | number | null
    bidRules?: JsonNullableFilter<"Auction">
    planTier?: EnumPlanTierFilter<"Auction"> | $Enums.PlanTier
    isPaid?: BoolFilter<"Auction"> | boolean
    razorpayOrderId?: StringNullableFilter<"Auction"> | string | null
    razorpayPaymentId?: StringNullableFilter<"Auction"> | string | null
    razorpaySignature?: StringNullableFilter<"Auction"> | string | null
    status?: EnumAuctionStatusFilter<"Auction"> | $Enums.AuctionStatus
    liveTheme?: StringFilter<"Auction"> | string
    soldEffect?: StringFilter<"Auction"> | string
    overlayTheme?: StringFilter<"Auction"> | string
    overlayLayout?: StringFilter<"Auction"> | string
    createdAt?: DateTimeFilter<"Auction"> | Date | string
    ArchivedAt?: DateTimeNullableFilter<"Auction"> | Date | string | null
    organizer?: XOR<UserScalarRelationFilter, UserWhereInput>
    teams?: TeamListRelationFilter
    players?: PlayerListRelationFilter
    categories?: CategoryListRelationFilter
    bidhistories?: BidHistoryListRelationFilter
    AuctionInsight?: XOR<AuctionInsightNullableScalarRelationFilter, AuctionInsightWhereInput> | null
    joinedAuctions?: JoinedAuctionListRelationFilter
  }

  export type AuctionOrderByWithRelationInput = {
    id?: SortOrder
    auctionCode?: SortOrder
    organizerId?: SortOrder
    name?: SortOrder
    location?: SortOrderInput | SortOrder
    logo?: SortOrderInput | SortOrder
    sportsType?: SortOrder
    season?: SortOrderInput | SortOrder
    auctionDate?: SortOrder
    auctionStartTime?: SortOrderInput | SortOrder
    budgetPerTeam?: SortOrder
    minBid?: SortOrder
    bidIncrease?: SortOrder
    minPlayersPerTeam?: SortOrder
    maxPlayersPerTeam?: SortOrder
    isBoosterEnabled?: SortOrder
    boosterAmount?: SortOrderInput | SortOrder
    boosterTriggerPlayerCount?: SortOrderInput | SortOrder
    bidRules?: SortOrderInput | SortOrder
    planTier?: SortOrder
    isPaid?: SortOrder
    razorpayOrderId?: SortOrderInput | SortOrder
    razorpayPaymentId?: SortOrderInput | SortOrder
    razorpaySignature?: SortOrderInput | SortOrder
    status?: SortOrder
    liveTheme?: SortOrder
    soldEffect?: SortOrder
    overlayTheme?: SortOrder
    overlayLayout?: SortOrder
    createdAt?: SortOrder
    ArchivedAt?: SortOrderInput | SortOrder
    organizer?: UserOrderByWithRelationInput
    teams?: TeamOrderByRelationAggregateInput
    players?: PlayerOrderByRelationAggregateInput
    categories?: CategoryOrderByRelationAggregateInput
    bidhistories?: BidHistoryOrderByRelationAggregateInput
    AuctionInsight?: AuctionInsightOrderByWithRelationInput
    joinedAuctions?: JoinedAuctionOrderByRelationAggregateInput
  }

  export type AuctionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    auctionCode?: string
    razorpayPaymentId?: string
    AND?: AuctionWhereInput | AuctionWhereInput[]
    OR?: AuctionWhereInput[]
    NOT?: AuctionWhereInput | AuctionWhereInput[]
    organizerId?: StringFilter<"Auction"> | string
    name?: StringFilter<"Auction"> | string
    location?: StringNullableFilter<"Auction"> | string | null
    logo?: StringNullableFilter<"Auction"> | string | null
    sportsType?: StringFilter<"Auction"> | string
    season?: StringNullableFilter<"Auction"> | string | null
    auctionDate?: DateTimeFilter<"Auction"> | Date | string
    auctionStartTime?: StringNullableFilter<"Auction"> | string | null
    budgetPerTeam?: DecimalFilter<"Auction"> | Decimal | DecimalJsLike | number | string
    minBid?: DecimalFilter<"Auction"> | Decimal | DecimalJsLike | number | string
    bidIncrease?: DecimalFilter<"Auction"> | Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: IntFilter<"Auction"> | number
    maxPlayersPerTeam?: IntFilter<"Auction"> | number
    isBoosterEnabled?: BoolFilter<"Auction"> | boolean
    boosterAmount?: IntNullableFilter<"Auction"> | number | null
    boosterTriggerPlayerCount?: IntNullableFilter<"Auction"> | number | null
    bidRules?: JsonNullableFilter<"Auction">
    planTier?: EnumPlanTierFilter<"Auction"> | $Enums.PlanTier
    isPaid?: BoolFilter<"Auction"> | boolean
    razorpayOrderId?: StringNullableFilter<"Auction"> | string | null
    razorpaySignature?: StringNullableFilter<"Auction"> | string | null
    status?: EnumAuctionStatusFilter<"Auction"> | $Enums.AuctionStatus
    liveTheme?: StringFilter<"Auction"> | string
    soldEffect?: StringFilter<"Auction"> | string
    overlayTheme?: StringFilter<"Auction"> | string
    overlayLayout?: StringFilter<"Auction"> | string
    createdAt?: DateTimeFilter<"Auction"> | Date | string
    ArchivedAt?: DateTimeNullableFilter<"Auction"> | Date | string | null
    organizer?: XOR<UserScalarRelationFilter, UserWhereInput>
    teams?: TeamListRelationFilter
    players?: PlayerListRelationFilter
    categories?: CategoryListRelationFilter
    bidhistories?: BidHistoryListRelationFilter
    AuctionInsight?: XOR<AuctionInsightNullableScalarRelationFilter, AuctionInsightWhereInput> | null
    joinedAuctions?: JoinedAuctionListRelationFilter
  }, "id" | "auctionCode" | "razorpayPaymentId">

  export type AuctionOrderByWithAggregationInput = {
    id?: SortOrder
    auctionCode?: SortOrder
    organizerId?: SortOrder
    name?: SortOrder
    location?: SortOrderInput | SortOrder
    logo?: SortOrderInput | SortOrder
    sportsType?: SortOrder
    season?: SortOrderInput | SortOrder
    auctionDate?: SortOrder
    auctionStartTime?: SortOrderInput | SortOrder
    budgetPerTeam?: SortOrder
    minBid?: SortOrder
    bidIncrease?: SortOrder
    minPlayersPerTeam?: SortOrder
    maxPlayersPerTeam?: SortOrder
    isBoosterEnabled?: SortOrder
    boosterAmount?: SortOrderInput | SortOrder
    boosterTriggerPlayerCount?: SortOrderInput | SortOrder
    bidRules?: SortOrderInput | SortOrder
    planTier?: SortOrder
    isPaid?: SortOrder
    razorpayOrderId?: SortOrderInput | SortOrder
    razorpayPaymentId?: SortOrderInput | SortOrder
    razorpaySignature?: SortOrderInput | SortOrder
    status?: SortOrder
    liveTheme?: SortOrder
    soldEffect?: SortOrder
    overlayTheme?: SortOrder
    overlayLayout?: SortOrder
    createdAt?: SortOrder
    ArchivedAt?: SortOrderInput | SortOrder
    _count?: AuctionCountOrderByAggregateInput
    _avg?: AuctionAvgOrderByAggregateInput
    _max?: AuctionMaxOrderByAggregateInput
    _min?: AuctionMinOrderByAggregateInput
    _sum?: AuctionSumOrderByAggregateInput
  }

  export type AuctionScalarWhereWithAggregatesInput = {
    AND?: AuctionScalarWhereWithAggregatesInput | AuctionScalarWhereWithAggregatesInput[]
    OR?: AuctionScalarWhereWithAggregatesInput[]
    NOT?: AuctionScalarWhereWithAggregatesInput | AuctionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Auction"> | string
    auctionCode?: StringWithAggregatesFilter<"Auction"> | string
    organizerId?: StringWithAggregatesFilter<"Auction"> | string
    name?: StringWithAggregatesFilter<"Auction"> | string
    location?: StringNullableWithAggregatesFilter<"Auction"> | string | null
    logo?: StringNullableWithAggregatesFilter<"Auction"> | string | null
    sportsType?: StringWithAggregatesFilter<"Auction"> | string
    season?: StringNullableWithAggregatesFilter<"Auction"> | string | null
    auctionDate?: DateTimeWithAggregatesFilter<"Auction"> | Date | string
    auctionStartTime?: StringNullableWithAggregatesFilter<"Auction"> | string | null
    budgetPerTeam?: DecimalWithAggregatesFilter<"Auction"> | Decimal | DecimalJsLike | number | string
    minBid?: DecimalWithAggregatesFilter<"Auction"> | Decimal | DecimalJsLike | number | string
    bidIncrease?: DecimalWithAggregatesFilter<"Auction"> | Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: IntWithAggregatesFilter<"Auction"> | number
    maxPlayersPerTeam?: IntWithAggregatesFilter<"Auction"> | number
    isBoosterEnabled?: BoolWithAggregatesFilter<"Auction"> | boolean
    boosterAmount?: IntNullableWithAggregatesFilter<"Auction"> | number | null
    boosterTriggerPlayerCount?: IntNullableWithAggregatesFilter<"Auction"> | number | null
    bidRules?: JsonNullableWithAggregatesFilter<"Auction">
    planTier?: EnumPlanTierWithAggregatesFilter<"Auction"> | $Enums.PlanTier
    isPaid?: BoolWithAggregatesFilter<"Auction"> | boolean
    razorpayOrderId?: StringNullableWithAggregatesFilter<"Auction"> | string | null
    razorpayPaymentId?: StringNullableWithAggregatesFilter<"Auction"> | string | null
    razorpaySignature?: StringNullableWithAggregatesFilter<"Auction"> | string | null
    status?: EnumAuctionStatusWithAggregatesFilter<"Auction"> | $Enums.AuctionStatus
    liveTheme?: StringWithAggregatesFilter<"Auction"> | string
    soldEffect?: StringWithAggregatesFilter<"Auction"> | string
    overlayTheme?: StringWithAggregatesFilter<"Auction"> | string
    overlayLayout?: StringWithAggregatesFilter<"Auction"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Auction"> | Date | string
    ArchivedAt?: DateTimeNullableWithAggregatesFilter<"Auction"> | Date | string | null
  }

  export type JoinedAuctionWhereInput = {
    AND?: JoinedAuctionWhereInput | JoinedAuctionWhereInput[]
    OR?: JoinedAuctionWhereInput[]
    NOT?: JoinedAuctionWhereInput | JoinedAuctionWhereInput[]
    id?: StringFilter<"JoinedAuction"> | string
    userId?: StringFilter<"JoinedAuction"> | string
    auctionId?: StringFilter<"JoinedAuction"> | string
    joinedAt?: DateTimeFilter<"JoinedAuction"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    auction?: XOR<AuctionScalarRelationFilter, AuctionWhereInput>
  }

  export type JoinedAuctionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    auctionId?: SortOrder
    joinedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    auction?: AuctionOrderByWithRelationInput
  }

  export type JoinedAuctionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_auctionId?: JoinedAuctionUserIdAuctionIdCompoundUniqueInput
    AND?: JoinedAuctionWhereInput | JoinedAuctionWhereInput[]
    OR?: JoinedAuctionWhereInput[]
    NOT?: JoinedAuctionWhereInput | JoinedAuctionWhereInput[]
    userId?: StringFilter<"JoinedAuction"> | string
    auctionId?: StringFilter<"JoinedAuction"> | string
    joinedAt?: DateTimeFilter<"JoinedAuction"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    auction?: XOR<AuctionScalarRelationFilter, AuctionWhereInput>
  }, "id" | "userId_auctionId">

  export type JoinedAuctionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    auctionId?: SortOrder
    joinedAt?: SortOrder
    _count?: JoinedAuctionCountOrderByAggregateInput
    _max?: JoinedAuctionMaxOrderByAggregateInput
    _min?: JoinedAuctionMinOrderByAggregateInput
  }

  export type JoinedAuctionScalarWhereWithAggregatesInput = {
    AND?: JoinedAuctionScalarWhereWithAggregatesInput | JoinedAuctionScalarWhereWithAggregatesInput[]
    OR?: JoinedAuctionScalarWhereWithAggregatesInput[]
    NOT?: JoinedAuctionScalarWhereWithAggregatesInput | JoinedAuctionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"JoinedAuction"> | string
    userId?: StringWithAggregatesFilter<"JoinedAuction"> | string
    auctionId?: StringWithAggregatesFilter<"JoinedAuction"> | string
    joinedAt?: DateTimeWithAggregatesFilter<"JoinedAuction"> | Date | string
  }

  export type CategoryWhereInput = {
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    id?: StringFilter<"Category"> | string
    auctionId?: StringFilter<"Category"> | string
    name?: StringFilter<"Category"> | string
    color?: StringNullableFilter<"Category"> | string | null
    baseBid?: DecimalNullableFilter<"Category"> | Decimal | DecimalJsLike | number | string | null
    minIncrement?: DecimalNullableFilter<"Category"> | Decimal | DecimalJsLike | number | string | null
    maxPlayersPerTeam?: IntNullableFilter<"Category"> | number | null
    minPlayersPerTeam?: IntNullableFilter<"Category"> | number | null
    auction?: XOR<AuctionScalarRelationFilter, AuctionWhereInput>
    players?: PlayerListRelationFilter
  }

  export type CategoryOrderByWithRelationInput = {
    id?: SortOrder
    auctionId?: SortOrder
    name?: SortOrder
    color?: SortOrderInput | SortOrder
    baseBid?: SortOrderInput | SortOrder
    minIncrement?: SortOrderInput | SortOrder
    maxPlayersPerTeam?: SortOrderInput | SortOrder
    minPlayersPerTeam?: SortOrderInput | SortOrder
    auction?: AuctionOrderByWithRelationInput
    players?: PlayerOrderByRelationAggregateInput
  }

  export type CategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    auctionId?: StringFilter<"Category"> | string
    name?: StringFilter<"Category"> | string
    color?: StringNullableFilter<"Category"> | string | null
    baseBid?: DecimalNullableFilter<"Category"> | Decimal | DecimalJsLike | number | string | null
    minIncrement?: DecimalNullableFilter<"Category"> | Decimal | DecimalJsLike | number | string | null
    maxPlayersPerTeam?: IntNullableFilter<"Category"> | number | null
    minPlayersPerTeam?: IntNullableFilter<"Category"> | number | null
    auction?: XOR<AuctionScalarRelationFilter, AuctionWhereInput>
    players?: PlayerListRelationFilter
  }, "id">

  export type CategoryOrderByWithAggregationInput = {
    id?: SortOrder
    auctionId?: SortOrder
    name?: SortOrder
    color?: SortOrderInput | SortOrder
    baseBid?: SortOrderInput | SortOrder
    minIncrement?: SortOrderInput | SortOrder
    maxPlayersPerTeam?: SortOrderInput | SortOrder
    minPlayersPerTeam?: SortOrderInput | SortOrder
    _count?: CategoryCountOrderByAggregateInput
    _avg?: CategoryAvgOrderByAggregateInput
    _max?: CategoryMaxOrderByAggregateInput
    _min?: CategoryMinOrderByAggregateInput
    _sum?: CategorySumOrderByAggregateInput
  }

  export type CategoryScalarWhereWithAggregatesInput = {
    AND?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    OR?: CategoryScalarWhereWithAggregatesInput[]
    NOT?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Category"> | string
    auctionId?: StringWithAggregatesFilter<"Category"> | string
    name?: StringWithAggregatesFilter<"Category"> | string
    color?: StringNullableWithAggregatesFilter<"Category"> | string | null
    baseBid?: DecimalNullableWithAggregatesFilter<"Category"> | Decimal | DecimalJsLike | number | string | null
    minIncrement?: DecimalNullableWithAggregatesFilter<"Category"> | Decimal | DecimalJsLike | number | string | null
    maxPlayersPerTeam?: IntNullableWithAggregatesFilter<"Category"> | number | null
    minPlayersPerTeam?: IntNullableWithAggregatesFilter<"Category"> | number | null
  }

  export type TeamWhereInput = {
    AND?: TeamWhereInput | TeamWhereInput[]
    OR?: TeamWhereInput[]
    NOT?: TeamWhereInput | TeamWhereInput[]
    id?: StringFilter<"Team"> | string
    auctionId?: StringFilter<"Team"> | string
    name?: StringFilter<"Team"> | string
    shortName?: StringFilter<"Team"> | string
    shortcutKey?: StringNullableFilter<"Team"> | string | null
    logo?: StringNullableFilter<"Team"> | string | null
    originalPurse?: DecimalFilter<"Team"> | Decimal | DecimalJsLike | number | string
    purseSpent?: DecimalFilter<"Team"> | Decimal | DecimalJsLike | number | string
    playersCount?: IntFilter<"Team"> | number
    auction?: XOR<AuctionScalarRelationFilter, AuctionWhereInput>
    players?: PlayerListRelationFilter
    bidHistories?: BidHistoryListRelationFilter
  }

  export type TeamOrderByWithRelationInput = {
    id?: SortOrder
    auctionId?: SortOrder
    name?: SortOrder
    shortName?: SortOrder
    shortcutKey?: SortOrderInput | SortOrder
    logo?: SortOrderInput | SortOrder
    originalPurse?: SortOrder
    purseSpent?: SortOrder
    playersCount?: SortOrder
    auction?: AuctionOrderByWithRelationInput
    players?: PlayerOrderByRelationAggregateInput
    bidHistories?: BidHistoryOrderByRelationAggregateInput
  }

  export type TeamWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TeamWhereInput | TeamWhereInput[]
    OR?: TeamWhereInput[]
    NOT?: TeamWhereInput | TeamWhereInput[]
    auctionId?: StringFilter<"Team"> | string
    name?: StringFilter<"Team"> | string
    shortName?: StringFilter<"Team"> | string
    shortcutKey?: StringNullableFilter<"Team"> | string | null
    logo?: StringNullableFilter<"Team"> | string | null
    originalPurse?: DecimalFilter<"Team"> | Decimal | DecimalJsLike | number | string
    purseSpent?: DecimalFilter<"Team"> | Decimal | DecimalJsLike | number | string
    playersCount?: IntFilter<"Team"> | number
    auction?: XOR<AuctionScalarRelationFilter, AuctionWhereInput>
    players?: PlayerListRelationFilter
    bidHistories?: BidHistoryListRelationFilter
  }, "id">

  export type TeamOrderByWithAggregationInput = {
    id?: SortOrder
    auctionId?: SortOrder
    name?: SortOrder
    shortName?: SortOrder
    shortcutKey?: SortOrderInput | SortOrder
    logo?: SortOrderInput | SortOrder
    originalPurse?: SortOrder
    purseSpent?: SortOrder
    playersCount?: SortOrder
    _count?: TeamCountOrderByAggregateInput
    _avg?: TeamAvgOrderByAggregateInput
    _max?: TeamMaxOrderByAggregateInput
    _min?: TeamMinOrderByAggregateInput
    _sum?: TeamSumOrderByAggregateInput
  }

  export type TeamScalarWhereWithAggregatesInput = {
    AND?: TeamScalarWhereWithAggregatesInput | TeamScalarWhereWithAggregatesInput[]
    OR?: TeamScalarWhereWithAggregatesInput[]
    NOT?: TeamScalarWhereWithAggregatesInput | TeamScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Team"> | string
    auctionId?: StringWithAggregatesFilter<"Team"> | string
    name?: StringWithAggregatesFilter<"Team"> | string
    shortName?: StringWithAggregatesFilter<"Team"> | string
    shortcutKey?: StringNullableWithAggregatesFilter<"Team"> | string | null
    logo?: StringNullableWithAggregatesFilter<"Team"> | string | null
    originalPurse?: DecimalWithAggregatesFilter<"Team"> | Decimal | DecimalJsLike | number | string
    purseSpent?: DecimalWithAggregatesFilter<"Team"> | Decimal | DecimalJsLike | number | string
    playersCount?: IntWithAggregatesFilter<"Team"> | number
  }

  export type PlayerWhereInput = {
    AND?: PlayerWhereInput | PlayerWhereInput[]
    OR?: PlayerWhereInput[]
    NOT?: PlayerWhereInput | PlayerWhereInput[]
    id?: StringFilter<"Player"> | string
    auctionId?: StringFilter<"Player"> | string
    categoryId?: StringNullableFilter<"Player"> | string | null
    name?: StringFilter<"Player"> | string
    mobile?: StringNullableFilter<"Player"> | string | null
    age?: IntFilter<"Player"> | number
    fatherName?: StringNullableFilter<"Player"> | string | null
    profilePic?: StringNullableFilter<"Player"> | string | null
    role?: EnumPlayerRoleFilter<"Player"> | $Enums.PlayerRole
    battingStyle?: StringNullableFilter<"Player"> | string | null
    bowlingStyle?: StringNullableFilter<"Player"> | string | null
    tshirtSize?: StringNullableFilter<"Player"> | string | null
    trouserSize?: StringNullableFilter<"Player"> | string | null
    jerseyName?: StringNullableFilter<"Player"> | string | null
    jerseyNumber?: IntNullableFilter<"Player"> | number | null
    status?: EnumPlayerStatusFilter<"Player"> | $Enums.PlayerStatus
    basePrice?: DecimalNullableFilter<"Player"> | Decimal | DecimalJsLike | number | string | null
    teamId?: StringNullableFilter<"Player"> | string | null
    soldPrice?: DecimalNullableFilter<"Player"> | Decimal | DecimalJsLike | number | string | null
    auction?: XOR<AuctionScalarRelationFilter, AuctionWhereInput>
    category?: XOR<CategoryNullableScalarRelationFilter, CategoryWhereInput> | null
    team?: XOR<TeamNullableScalarRelationFilter, TeamWhereInput> | null
    bidHistory?: BidHistoryListRelationFilter
  }

  export type PlayerOrderByWithRelationInput = {
    id?: SortOrder
    auctionId?: SortOrder
    categoryId?: SortOrderInput | SortOrder
    name?: SortOrder
    mobile?: SortOrderInput | SortOrder
    age?: SortOrder
    fatherName?: SortOrderInput | SortOrder
    profilePic?: SortOrderInput | SortOrder
    role?: SortOrder
    battingStyle?: SortOrderInput | SortOrder
    bowlingStyle?: SortOrderInput | SortOrder
    tshirtSize?: SortOrderInput | SortOrder
    trouserSize?: SortOrderInput | SortOrder
    jerseyName?: SortOrderInput | SortOrder
    jerseyNumber?: SortOrderInput | SortOrder
    status?: SortOrder
    basePrice?: SortOrderInput | SortOrder
    teamId?: SortOrderInput | SortOrder
    soldPrice?: SortOrderInput | SortOrder
    auction?: AuctionOrderByWithRelationInput
    category?: CategoryOrderByWithRelationInput
    team?: TeamOrderByWithRelationInput
    bidHistory?: BidHistoryOrderByRelationAggregateInput
  }

  export type PlayerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PlayerWhereInput | PlayerWhereInput[]
    OR?: PlayerWhereInput[]
    NOT?: PlayerWhereInput | PlayerWhereInput[]
    auctionId?: StringFilter<"Player"> | string
    categoryId?: StringNullableFilter<"Player"> | string | null
    name?: StringFilter<"Player"> | string
    mobile?: StringNullableFilter<"Player"> | string | null
    age?: IntFilter<"Player"> | number
    fatherName?: StringNullableFilter<"Player"> | string | null
    profilePic?: StringNullableFilter<"Player"> | string | null
    role?: EnumPlayerRoleFilter<"Player"> | $Enums.PlayerRole
    battingStyle?: StringNullableFilter<"Player"> | string | null
    bowlingStyle?: StringNullableFilter<"Player"> | string | null
    tshirtSize?: StringNullableFilter<"Player"> | string | null
    trouserSize?: StringNullableFilter<"Player"> | string | null
    jerseyName?: StringNullableFilter<"Player"> | string | null
    jerseyNumber?: IntNullableFilter<"Player"> | number | null
    status?: EnumPlayerStatusFilter<"Player"> | $Enums.PlayerStatus
    basePrice?: DecimalNullableFilter<"Player"> | Decimal | DecimalJsLike | number | string | null
    teamId?: StringNullableFilter<"Player"> | string | null
    soldPrice?: DecimalNullableFilter<"Player"> | Decimal | DecimalJsLike | number | string | null
    auction?: XOR<AuctionScalarRelationFilter, AuctionWhereInput>
    category?: XOR<CategoryNullableScalarRelationFilter, CategoryWhereInput> | null
    team?: XOR<TeamNullableScalarRelationFilter, TeamWhereInput> | null
    bidHistory?: BidHistoryListRelationFilter
  }, "id">

  export type PlayerOrderByWithAggregationInput = {
    id?: SortOrder
    auctionId?: SortOrder
    categoryId?: SortOrderInput | SortOrder
    name?: SortOrder
    mobile?: SortOrderInput | SortOrder
    age?: SortOrder
    fatherName?: SortOrderInput | SortOrder
    profilePic?: SortOrderInput | SortOrder
    role?: SortOrder
    battingStyle?: SortOrderInput | SortOrder
    bowlingStyle?: SortOrderInput | SortOrder
    tshirtSize?: SortOrderInput | SortOrder
    trouserSize?: SortOrderInput | SortOrder
    jerseyName?: SortOrderInput | SortOrder
    jerseyNumber?: SortOrderInput | SortOrder
    status?: SortOrder
    basePrice?: SortOrderInput | SortOrder
    teamId?: SortOrderInput | SortOrder
    soldPrice?: SortOrderInput | SortOrder
    _count?: PlayerCountOrderByAggregateInput
    _avg?: PlayerAvgOrderByAggregateInput
    _max?: PlayerMaxOrderByAggregateInput
    _min?: PlayerMinOrderByAggregateInput
    _sum?: PlayerSumOrderByAggregateInput
  }

  export type PlayerScalarWhereWithAggregatesInput = {
    AND?: PlayerScalarWhereWithAggregatesInput | PlayerScalarWhereWithAggregatesInput[]
    OR?: PlayerScalarWhereWithAggregatesInput[]
    NOT?: PlayerScalarWhereWithAggregatesInput | PlayerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Player"> | string
    auctionId?: StringWithAggregatesFilter<"Player"> | string
    categoryId?: StringNullableWithAggregatesFilter<"Player"> | string | null
    name?: StringWithAggregatesFilter<"Player"> | string
    mobile?: StringNullableWithAggregatesFilter<"Player"> | string | null
    age?: IntWithAggregatesFilter<"Player"> | number
    fatherName?: StringNullableWithAggregatesFilter<"Player"> | string | null
    profilePic?: StringNullableWithAggregatesFilter<"Player"> | string | null
    role?: EnumPlayerRoleWithAggregatesFilter<"Player"> | $Enums.PlayerRole
    battingStyle?: StringNullableWithAggregatesFilter<"Player"> | string | null
    bowlingStyle?: StringNullableWithAggregatesFilter<"Player"> | string | null
    tshirtSize?: StringNullableWithAggregatesFilter<"Player"> | string | null
    trouserSize?: StringNullableWithAggregatesFilter<"Player"> | string | null
    jerseyName?: StringNullableWithAggregatesFilter<"Player"> | string | null
    jerseyNumber?: IntNullableWithAggregatesFilter<"Player"> | number | null
    status?: EnumPlayerStatusWithAggregatesFilter<"Player"> | $Enums.PlayerStatus
    basePrice?: DecimalNullableWithAggregatesFilter<"Player"> | Decimal | DecimalJsLike | number | string | null
    teamId?: StringNullableWithAggregatesFilter<"Player"> | string | null
    soldPrice?: DecimalNullableWithAggregatesFilter<"Player"> | Decimal | DecimalJsLike | number | string | null
  }

  export type BidHistoryWhereInput = {
    AND?: BidHistoryWhereInput | BidHistoryWhereInput[]
    OR?: BidHistoryWhereInput[]
    NOT?: BidHistoryWhereInput | BidHistoryWhereInput[]
    id?: StringFilter<"BidHistory"> | string
    playerId?: StringFilter<"BidHistory"> | string
    auctionId?: StringFilter<"BidHistory"> | string
    teamId?: StringFilter<"BidHistory"> | string
    amount?: DecimalFilter<"BidHistory"> | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFilter<"BidHistory"> | Date | string
    player?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
    auction?: XOR<AuctionScalarRelationFilter, AuctionWhereInput>
    team?: XOR<TeamScalarRelationFilter, TeamWhereInput>
  }

  export type BidHistoryOrderByWithRelationInput = {
    id?: SortOrder
    playerId?: SortOrder
    auctionId?: SortOrder
    teamId?: SortOrder
    amount?: SortOrder
    timestamp?: SortOrder
    player?: PlayerOrderByWithRelationInput
    auction?: AuctionOrderByWithRelationInput
    team?: TeamOrderByWithRelationInput
  }

  export type BidHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BidHistoryWhereInput | BidHistoryWhereInput[]
    OR?: BidHistoryWhereInput[]
    NOT?: BidHistoryWhereInput | BidHistoryWhereInput[]
    playerId?: StringFilter<"BidHistory"> | string
    auctionId?: StringFilter<"BidHistory"> | string
    teamId?: StringFilter<"BidHistory"> | string
    amount?: DecimalFilter<"BidHistory"> | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFilter<"BidHistory"> | Date | string
    player?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
    auction?: XOR<AuctionScalarRelationFilter, AuctionWhereInput>
    team?: XOR<TeamScalarRelationFilter, TeamWhereInput>
  }, "id">

  export type BidHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    playerId?: SortOrder
    auctionId?: SortOrder
    teamId?: SortOrder
    amount?: SortOrder
    timestamp?: SortOrder
    _count?: BidHistoryCountOrderByAggregateInput
    _avg?: BidHistoryAvgOrderByAggregateInput
    _max?: BidHistoryMaxOrderByAggregateInput
    _min?: BidHistoryMinOrderByAggregateInput
    _sum?: BidHistorySumOrderByAggregateInput
  }

  export type BidHistoryScalarWhereWithAggregatesInput = {
    AND?: BidHistoryScalarWhereWithAggregatesInput | BidHistoryScalarWhereWithAggregatesInput[]
    OR?: BidHistoryScalarWhereWithAggregatesInput[]
    NOT?: BidHistoryScalarWhereWithAggregatesInput | BidHistoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BidHistory"> | string
    playerId?: StringWithAggregatesFilter<"BidHistory"> | string
    auctionId?: StringWithAggregatesFilter<"BidHistory"> | string
    teamId?: StringWithAggregatesFilter<"BidHistory"> | string
    amount?: DecimalWithAggregatesFilter<"BidHistory"> | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeWithAggregatesFilter<"BidHistory"> | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    userId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    endpoint?: StringFilter<"AuditLog"> | string
    details?: JsonNullableFilter<"AuditLog">
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    endpoint?: SortOrder
    details?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    userId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    endpoint?: StringFilter<"AuditLog"> | string
    details?: JsonNullableFilter<"AuditLog">
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    endpoint?: SortOrder
    details?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    userId?: StringWithAggregatesFilter<"AuditLog"> | string
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    endpoint?: StringWithAggregatesFilter<"AuditLog"> | string
    details?: JsonNullableWithAggregatesFilter<"AuditLog">
    ipAddress?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type FeedbackWhereInput = {
    AND?: FeedbackWhereInput | FeedbackWhereInput[]
    OR?: FeedbackWhereInput[]
    NOT?: FeedbackWhereInput | FeedbackWhereInput[]
    id?: StringFilter<"Feedback"> | string
    userId?: StringFilter<"Feedback"> | string
    rating?: IntFilter<"Feedback"> | number
    message?: StringNullableFilter<"Feedback"> | string | null
    createdAt?: DateTimeFilter<"Feedback"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type FeedbackOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    rating?: SortOrder
    message?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type FeedbackWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: FeedbackWhereInput | FeedbackWhereInput[]
    OR?: FeedbackWhereInput[]
    NOT?: FeedbackWhereInput | FeedbackWhereInput[]
    rating?: IntFilter<"Feedback"> | number
    message?: StringNullableFilter<"Feedback"> | string | null
    createdAt?: DateTimeFilter<"Feedback"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type FeedbackOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    rating?: SortOrder
    message?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: FeedbackCountOrderByAggregateInput
    _avg?: FeedbackAvgOrderByAggregateInput
    _max?: FeedbackMaxOrderByAggregateInput
    _min?: FeedbackMinOrderByAggregateInput
    _sum?: FeedbackSumOrderByAggregateInput
  }

  export type FeedbackScalarWhereWithAggregatesInput = {
    AND?: FeedbackScalarWhereWithAggregatesInput | FeedbackScalarWhereWithAggregatesInput[]
    OR?: FeedbackScalarWhereWithAggregatesInput[]
    NOT?: FeedbackScalarWhereWithAggregatesInput | FeedbackScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Feedback"> | string
    userId?: StringWithAggregatesFilter<"Feedback"> | string
    rating?: IntWithAggregatesFilter<"Feedback"> | number
    message?: StringNullableWithAggregatesFilter<"Feedback"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Feedback"> | Date | string
  }

  export type AuctionInsightWhereInput = {
    AND?: AuctionInsightWhereInput | AuctionInsightWhereInput[]
    OR?: AuctionInsightWhereInput[]
    NOT?: AuctionInsightWhereInput | AuctionInsightWhereInput[]
    id?: StringFilter<"AuctionInsight"> | string
    auctionId?: StringFilter<"AuctionInsight"> | string
    data?: JsonFilter<"AuctionInsight">
    createdAt?: DateTimeFilter<"AuctionInsight"> | Date | string
    auction?: XOR<AuctionScalarRelationFilter, AuctionWhereInput>
  }

  export type AuctionInsightOrderByWithRelationInput = {
    id?: SortOrder
    auctionId?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    auction?: AuctionOrderByWithRelationInput
  }

  export type AuctionInsightWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    auctionId?: string
    AND?: AuctionInsightWhereInput | AuctionInsightWhereInput[]
    OR?: AuctionInsightWhereInput[]
    NOT?: AuctionInsightWhereInput | AuctionInsightWhereInput[]
    data?: JsonFilter<"AuctionInsight">
    createdAt?: DateTimeFilter<"AuctionInsight"> | Date | string
    auction?: XOR<AuctionScalarRelationFilter, AuctionWhereInput>
  }, "id" | "auctionId">

  export type AuctionInsightOrderByWithAggregationInput = {
    id?: SortOrder
    auctionId?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    _count?: AuctionInsightCountOrderByAggregateInput
    _max?: AuctionInsightMaxOrderByAggregateInput
    _min?: AuctionInsightMinOrderByAggregateInput
  }

  export type AuctionInsightScalarWhereWithAggregatesInput = {
    AND?: AuctionInsightScalarWhereWithAggregatesInput | AuctionInsightScalarWhereWithAggregatesInput[]
    OR?: AuctionInsightScalarWhereWithAggregatesInput[]
    NOT?: AuctionInsightScalarWhereWithAggregatesInput | AuctionInsightScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuctionInsight"> | string
    auctionId?: StringWithAggregatesFilter<"AuctionInsight"> | string
    data?: JsonWithAggregatesFilter<"AuctionInsight">
    createdAt?: DateTimeWithAggregatesFilter<"AuctionInsight"> | Date | string
  }

  export type ContactMessageWhereInput = {
    AND?: ContactMessageWhereInput | ContactMessageWhereInput[]
    OR?: ContactMessageWhereInput[]
    NOT?: ContactMessageWhereInput | ContactMessageWhereInput[]
    id?: StringFilter<"ContactMessage"> | string
    name?: StringFilter<"ContactMessage"> | string
    email?: StringFilter<"ContactMessage"> | string
    mobile?: StringNullableFilter<"ContactMessage"> | string | null
    message?: StringFilter<"ContactMessage"> | string
    isRead?: BoolFilter<"ContactMessage"> | boolean
    createdAt?: DateTimeFilter<"ContactMessage"> | Date | string
  }

  export type ContactMessageOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    mobile?: SortOrderInput | SortOrder
    message?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
  }

  export type ContactMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ContactMessageWhereInput | ContactMessageWhereInput[]
    OR?: ContactMessageWhereInput[]
    NOT?: ContactMessageWhereInput | ContactMessageWhereInput[]
    name?: StringFilter<"ContactMessage"> | string
    email?: StringFilter<"ContactMessage"> | string
    mobile?: StringNullableFilter<"ContactMessage"> | string | null
    message?: StringFilter<"ContactMessage"> | string
    isRead?: BoolFilter<"ContactMessage"> | boolean
    createdAt?: DateTimeFilter<"ContactMessage"> | Date | string
  }, "id">

  export type ContactMessageOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    mobile?: SortOrderInput | SortOrder
    message?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    _count?: ContactMessageCountOrderByAggregateInput
    _max?: ContactMessageMaxOrderByAggregateInput
    _min?: ContactMessageMinOrderByAggregateInput
  }

  export type ContactMessageScalarWhereWithAggregatesInput = {
    AND?: ContactMessageScalarWhereWithAggregatesInput | ContactMessageScalarWhereWithAggregatesInput[]
    OR?: ContactMessageScalarWhereWithAggregatesInput[]
    NOT?: ContactMessageScalarWhereWithAggregatesInput | ContactMessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ContactMessage"> | string
    name?: StringWithAggregatesFilter<"ContactMessage"> | string
    email?: StringWithAggregatesFilter<"ContactMessage"> | string
    mobile?: StringNullableWithAggregatesFilter<"ContactMessage"> | string | null
    message?: StringWithAggregatesFilter<"ContactMessage"> | string
    isRead?: BoolWithAggregatesFilter<"ContactMessage"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ContactMessage"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    firebaseUid: string
    name: string
    email: string
    role?: $Enums.Role
    password?: string | null
    mobile?: string | null
    city?: string | null
    profileUrl?: string | null
    createdAt?: Date | string
    stripeCustomerId?: string | null
    auctions?: AuctionCreateNestedManyWithoutOrganizerInput
    joinedAuctions?: JoinedAuctionCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    feedback?: FeedbackCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    firebaseUid: string
    name: string
    email: string
    role?: $Enums.Role
    password?: string | null
    mobile?: string | null
    city?: string | null
    profileUrl?: string | null
    createdAt?: Date | string
    stripeCustomerId?: string | null
    auctions?: AuctionUncheckedCreateNestedManyWithoutOrganizerInput
    joinedAuctions?: JoinedAuctionUncheckedCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    feedback?: FeedbackUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    password?: NullableStringFieldUpdateOperationsInput | string | null
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    profileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    auctions?: AuctionUpdateManyWithoutOrganizerNestedInput
    joinedAuctions?: JoinedAuctionUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    feedback?: FeedbackUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    password?: NullableStringFieldUpdateOperationsInput | string | null
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    profileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    auctions?: AuctionUncheckedUpdateManyWithoutOrganizerNestedInput
    joinedAuctions?: JoinedAuctionUncheckedUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    feedback?: FeedbackUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    firebaseUid: string
    name: string
    email: string
    role?: $Enums.Role
    password?: string | null
    mobile?: string | null
    city?: string | null
    profileUrl?: string | null
    createdAt?: Date | string
    stripeCustomerId?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    password?: NullableStringFieldUpdateOperationsInput | string | null
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    profileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    password?: NullableStringFieldUpdateOperationsInput | string | null
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    profileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuctionCreateInput = {
    id?: string
    auctionCode?: string
    name: string
    location?: string | null
    logo?: string | null
    sportsType?: string
    season?: string | null
    auctionDate: Date | string
    auctionStartTime?: string | null
    budgetPerTeam?: Decimal | DecimalJsLike | number | string
    minBid?: Decimal | DecimalJsLike | number | string
    bidIncrease?: Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: number
    maxPlayersPerTeam?: number
    isBoosterEnabled?: boolean
    boosterAmount?: number | null
    boosterTriggerPlayerCount?: number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: $Enums.PlanTier
    isPaid?: boolean
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null
    razorpaySignature?: string | null
    status?: $Enums.AuctionStatus
    liveTheme?: string
    soldEffect?: string
    overlayTheme?: string
    overlayLayout?: string
    createdAt?: Date | string
    ArchivedAt?: Date | string | null
    organizer: UserCreateNestedOneWithoutAuctionsInput
    teams?: TeamCreateNestedManyWithoutAuctionInput
    players?: PlayerCreateNestedManyWithoutAuctionInput
    categories?: CategoryCreateNestedManyWithoutAuctionInput
    bidhistories?: BidHistoryCreateNestedManyWithoutAuctionInput
    AuctionInsight?: AuctionInsightCreateNestedOneWithoutAuctionInput
    joinedAuctions?: JoinedAuctionCreateNestedManyWithoutAuctionInput
  }

  export type AuctionUncheckedCreateInput = {
    id?: string
    auctionCode?: string
    organizerId: string
    name: string
    location?: string | null
    logo?: string | null
    sportsType?: string
    season?: string | null
    auctionDate: Date | string
    auctionStartTime?: string | null
    budgetPerTeam?: Decimal | DecimalJsLike | number | string
    minBid?: Decimal | DecimalJsLike | number | string
    bidIncrease?: Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: number
    maxPlayersPerTeam?: number
    isBoosterEnabled?: boolean
    boosterAmount?: number | null
    boosterTriggerPlayerCount?: number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: $Enums.PlanTier
    isPaid?: boolean
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null
    razorpaySignature?: string | null
    status?: $Enums.AuctionStatus
    liveTheme?: string
    soldEffect?: string
    overlayTheme?: string
    overlayLayout?: string
    createdAt?: Date | string
    ArchivedAt?: Date | string | null
    teams?: TeamUncheckedCreateNestedManyWithoutAuctionInput
    players?: PlayerUncheckedCreateNestedManyWithoutAuctionInput
    categories?: CategoryUncheckedCreateNestedManyWithoutAuctionInput
    bidhistories?: BidHistoryUncheckedCreateNestedManyWithoutAuctionInput
    AuctionInsight?: AuctionInsightUncheckedCreateNestedOneWithoutAuctionInput
    joinedAuctions?: JoinedAuctionUncheckedCreateNestedManyWithoutAuctionInput
  }

  export type AuctionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionCode?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    sportsType?: StringFieldUpdateOperationsInput | string
    season?: NullableStringFieldUpdateOperationsInput | string | null
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    auctionStartTime?: NullableStringFieldUpdateOperationsInput | string | null
    budgetPerTeam?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minBid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bidIncrease?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    maxPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    isBoosterEnabled?: BoolFieldUpdateOperationsInput | boolean
    boosterAmount?: NullableIntFieldUpdateOperationsInput | number | null
    boosterTriggerPlayerCount?: NullableIntFieldUpdateOperationsInput | number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: EnumPlanTierFieldUpdateOperationsInput | $Enums.PlanTier
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    razorpayOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpaySignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAuctionStatusFieldUpdateOperationsInput | $Enums.AuctionStatus
    liveTheme?: StringFieldUpdateOperationsInput | string
    soldEffect?: StringFieldUpdateOperationsInput | string
    overlayTheme?: StringFieldUpdateOperationsInput | string
    overlayLayout?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ArchivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organizer?: UserUpdateOneRequiredWithoutAuctionsNestedInput
    teams?: TeamUpdateManyWithoutAuctionNestedInput
    players?: PlayerUpdateManyWithoutAuctionNestedInput
    categories?: CategoryUpdateManyWithoutAuctionNestedInput
    bidhistories?: BidHistoryUpdateManyWithoutAuctionNestedInput
    AuctionInsight?: AuctionInsightUpdateOneWithoutAuctionNestedInput
    joinedAuctions?: JoinedAuctionUpdateManyWithoutAuctionNestedInput
  }

  export type AuctionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionCode?: StringFieldUpdateOperationsInput | string
    organizerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    sportsType?: StringFieldUpdateOperationsInput | string
    season?: NullableStringFieldUpdateOperationsInput | string | null
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    auctionStartTime?: NullableStringFieldUpdateOperationsInput | string | null
    budgetPerTeam?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minBid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bidIncrease?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    maxPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    isBoosterEnabled?: BoolFieldUpdateOperationsInput | boolean
    boosterAmount?: NullableIntFieldUpdateOperationsInput | number | null
    boosterTriggerPlayerCount?: NullableIntFieldUpdateOperationsInput | number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: EnumPlanTierFieldUpdateOperationsInput | $Enums.PlanTier
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    razorpayOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpaySignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAuctionStatusFieldUpdateOperationsInput | $Enums.AuctionStatus
    liveTheme?: StringFieldUpdateOperationsInput | string
    soldEffect?: StringFieldUpdateOperationsInput | string
    overlayTheme?: StringFieldUpdateOperationsInput | string
    overlayLayout?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ArchivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    teams?: TeamUncheckedUpdateManyWithoutAuctionNestedInput
    players?: PlayerUncheckedUpdateManyWithoutAuctionNestedInput
    categories?: CategoryUncheckedUpdateManyWithoutAuctionNestedInput
    bidhistories?: BidHistoryUncheckedUpdateManyWithoutAuctionNestedInput
    AuctionInsight?: AuctionInsightUncheckedUpdateOneWithoutAuctionNestedInput
    joinedAuctions?: JoinedAuctionUncheckedUpdateManyWithoutAuctionNestedInput
  }

  export type AuctionCreateManyInput = {
    id?: string
    auctionCode?: string
    organizerId: string
    name: string
    location?: string | null
    logo?: string | null
    sportsType?: string
    season?: string | null
    auctionDate: Date | string
    auctionStartTime?: string | null
    budgetPerTeam?: Decimal | DecimalJsLike | number | string
    minBid?: Decimal | DecimalJsLike | number | string
    bidIncrease?: Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: number
    maxPlayersPerTeam?: number
    isBoosterEnabled?: boolean
    boosterAmount?: number | null
    boosterTriggerPlayerCount?: number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: $Enums.PlanTier
    isPaid?: boolean
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null
    razorpaySignature?: string | null
    status?: $Enums.AuctionStatus
    liveTheme?: string
    soldEffect?: string
    overlayTheme?: string
    overlayLayout?: string
    createdAt?: Date | string
    ArchivedAt?: Date | string | null
  }

  export type AuctionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionCode?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    sportsType?: StringFieldUpdateOperationsInput | string
    season?: NullableStringFieldUpdateOperationsInput | string | null
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    auctionStartTime?: NullableStringFieldUpdateOperationsInput | string | null
    budgetPerTeam?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minBid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bidIncrease?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    maxPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    isBoosterEnabled?: BoolFieldUpdateOperationsInput | boolean
    boosterAmount?: NullableIntFieldUpdateOperationsInput | number | null
    boosterTriggerPlayerCount?: NullableIntFieldUpdateOperationsInput | number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: EnumPlanTierFieldUpdateOperationsInput | $Enums.PlanTier
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    razorpayOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpaySignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAuctionStatusFieldUpdateOperationsInput | $Enums.AuctionStatus
    liveTheme?: StringFieldUpdateOperationsInput | string
    soldEffect?: StringFieldUpdateOperationsInput | string
    overlayTheme?: StringFieldUpdateOperationsInput | string
    overlayLayout?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ArchivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AuctionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionCode?: StringFieldUpdateOperationsInput | string
    organizerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    sportsType?: StringFieldUpdateOperationsInput | string
    season?: NullableStringFieldUpdateOperationsInput | string | null
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    auctionStartTime?: NullableStringFieldUpdateOperationsInput | string | null
    budgetPerTeam?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minBid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bidIncrease?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    maxPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    isBoosterEnabled?: BoolFieldUpdateOperationsInput | boolean
    boosterAmount?: NullableIntFieldUpdateOperationsInput | number | null
    boosterTriggerPlayerCount?: NullableIntFieldUpdateOperationsInput | number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: EnumPlanTierFieldUpdateOperationsInput | $Enums.PlanTier
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    razorpayOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpaySignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAuctionStatusFieldUpdateOperationsInput | $Enums.AuctionStatus
    liveTheme?: StringFieldUpdateOperationsInput | string
    soldEffect?: StringFieldUpdateOperationsInput | string
    overlayTheme?: StringFieldUpdateOperationsInput | string
    overlayLayout?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ArchivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type JoinedAuctionCreateInput = {
    id?: string
    joinedAt?: Date | string
    user: UserCreateNestedOneWithoutJoinedAuctionsInput
    auction: AuctionCreateNestedOneWithoutJoinedAuctionsInput
  }

  export type JoinedAuctionUncheckedCreateInput = {
    id?: string
    userId: string
    auctionId: string
    joinedAt?: Date | string
  }

  export type JoinedAuctionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutJoinedAuctionsNestedInput
    auction?: AuctionUpdateOneRequiredWithoutJoinedAuctionsNestedInput
  }

  export type JoinedAuctionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JoinedAuctionCreateManyInput = {
    id?: string
    userId: string
    auctionId: string
    joinedAt?: Date | string
  }

  export type JoinedAuctionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JoinedAuctionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryCreateInput = {
    id?: string
    name: string
    color?: string | null
    baseBid?: Decimal | DecimalJsLike | number | string | null
    minIncrement?: Decimal | DecimalJsLike | number | string | null
    maxPlayersPerTeam?: number | null
    minPlayersPerTeam?: number | null
    auction: AuctionCreateNestedOneWithoutCategoriesInput
    players?: PlayerCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUncheckedCreateInput = {
    id?: string
    auctionId: string
    name: string
    color?: string | null
    baseBid?: Decimal | DecimalJsLike | number | string | null
    minIncrement?: Decimal | DecimalJsLike | number | string | null
    maxPlayersPerTeam?: number | null
    minPlayersPerTeam?: number | null
    players?: PlayerUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    baseBid?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    minIncrement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxPlayersPerTeam?: NullableIntFieldUpdateOperationsInput | number | null
    minPlayersPerTeam?: NullableIntFieldUpdateOperationsInput | number | null
    auction?: AuctionUpdateOneRequiredWithoutCategoriesNestedInput
    players?: PlayerUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    baseBid?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    minIncrement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxPlayersPerTeam?: NullableIntFieldUpdateOperationsInput | number | null
    minPlayersPerTeam?: NullableIntFieldUpdateOperationsInput | number | null
    players?: PlayerUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryCreateManyInput = {
    id?: string
    auctionId: string
    name: string
    color?: string | null
    baseBid?: Decimal | DecimalJsLike | number | string | null
    minIncrement?: Decimal | DecimalJsLike | number | string | null
    maxPlayersPerTeam?: number | null
    minPlayersPerTeam?: number | null
  }

  export type CategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    baseBid?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    minIncrement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxPlayersPerTeam?: NullableIntFieldUpdateOperationsInput | number | null
    minPlayersPerTeam?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type CategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    baseBid?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    minIncrement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxPlayersPerTeam?: NullableIntFieldUpdateOperationsInput | number | null
    minPlayersPerTeam?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type TeamCreateInput = {
    id?: string
    name: string
    shortName: string
    shortcutKey?: string | null
    logo?: string | null
    originalPurse: Decimal | DecimalJsLike | number | string
    purseSpent?: Decimal | DecimalJsLike | number | string
    playersCount?: number
    auction: AuctionCreateNestedOneWithoutTeamsInput
    players?: PlayerCreateNestedManyWithoutTeamInput
    bidHistories?: BidHistoryCreateNestedManyWithoutTeamInput
  }

  export type TeamUncheckedCreateInput = {
    id?: string
    auctionId: string
    name: string
    shortName: string
    shortcutKey?: string | null
    logo?: string | null
    originalPurse: Decimal | DecimalJsLike | number | string
    purseSpent?: Decimal | DecimalJsLike | number | string
    playersCount?: number
    players?: PlayerUncheckedCreateNestedManyWithoutTeamInput
    bidHistories?: BidHistoryUncheckedCreateNestedManyWithoutTeamInput
  }

  export type TeamUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    shortcutKey?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    originalPurse?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purseSpent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    playersCount?: IntFieldUpdateOperationsInput | number
    auction?: AuctionUpdateOneRequiredWithoutTeamsNestedInput
    players?: PlayerUpdateManyWithoutTeamNestedInput
    bidHistories?: BidHistoryUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    shortcutKey?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    originalPurse?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purseSpent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    playersCount?: IntFieldUpdateOperationsInput | number
    players?: PlayerUncheckedUpdateManyWithoutTeamNestedInput
    bidHistories?: BidHistoryUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type TeamCreateManyInput = {
    id?: string
    auctionId: string
    name: string
    shortName: string
    shortcutKey?: string | null
    logo?: string | null
    originalPurse: Decimal | DecimalJsLike | number | string
    purseSpent?: Decimal | DecimalJsLike | number | string
    playersCount?: number
  }

  export type TeamUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    shortcutKey?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    originalPurse?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purseSpent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    playersCount?: IntFieldUpdateOperationsInput | number
  }

  export type TeamUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    shortcutKey?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    originalPurse?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purseSpent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    playersCount?: IntFieldUpdateOperationsInput | number
  }

  export type PlayerCreateInput = {
    id?: string
    name: string
    mobile?: string | null
    age: number
    fatherName?: string | null
    profilePic?: string | null
    role?: $Enums.PlayerRole
    battingStyle?: string | null
    bowlingStyle?: string | null
    tshirtSize?: string | null
    trouserSize?: string | null
    jerseyName?: string | null
    jerseyNumber?: number | null
    status?: $Enums.PlayerStatus
    basePrice?: Decimal | DecimalJsLike | number | string | null
    soldPrice?: Decimal | DecimalJsLike | number | string | null
    auction: AuctionCreateNestedOneWithoutPlayersInput
    category?: CategoryCreateNestedOneWithoutPlayersInput
    team?: TeamCreateNestedOneWithoutPlayersInput
    bidHistory?: BidHistoryCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUncheckedCreateInput = {
    id?: string
    auctionId: string
    categoryId?: string | null
    name: string
    mobile?: string | null
    age: number
    fatherName?: string | null
    profilePic?: string | null
    role?: $Enums.PlayerRole
    battingStyle?: string | null
    bowlingStyle?: string | null
    tshirtSize?: string | null
    trouserSize?: string | null
    jerseyName?: string | null
    jerseyNumber?: number | null
    status?: $Enums.PlayerStatus
    basePrice?: Decimal | DecimalJsLike | number | string | null
    teamId?: string | null
    soldPrice?: Decimal | DecimalJsLike | number | string | null
    bidHistory?: BidHistoryUncheckedCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    age?: IntFieldUpdateOperationsInput | number
    fatherName?: NullableStringFieldUpdateOperationsInput | string | null
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole
    battingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    bowlingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    tshirtSize?: NullableStringFieldUpdateOperationsInput | string | null
    trouserSize?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyName?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyNumber?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus
    basePrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    soldPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    auction?: AuctionUpdateOneRequiredWithoutPlayersNestedInput
    category?: CategoryUpdateOneWithoutPlayersNestedInput
    team?: TeamUpdateOneWithoutPlayersNestedInput
    bidHistory?: BidHistoryUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    age?: IntFieldUpdateOperationsInput | number
    fatherName?: NullableStringFieldUpdateOperationsInput | string | null
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole
    battingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    bowlingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    tshirtSize?: NullableStringFieldUpdateOperationsInput | string | null
    trouserSize?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyName?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyNumber?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus
    basePrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    soldPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bidHistory?: BidHistoryUncheckedUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerCreateManyInput = {
    id?: string
    auctionId: string
    categoryId?: string | null
    name: string
    mobile?: string | null
    age: number
    fatherName?: string | null
    profilePic?: string | null
    role?: $Enums.PlayerRole
    battingStyle?: string | null
    bowlingStyle?: string | null
    tshirtSize?: string | null
    trouserSize?: string | null
    jerseyName?: string | null
    jerseyNumber?: number | null
    status?: $Enums.PlayerStatus
    basePrice?: Decimal | DecimalJsLike | number | string | null
    teamId?: string | null
    soldPrice?: Decimal | DecimalJsLike | number | string | null
  }

  export type PlayerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    age?: IntFieldUpdateOperationsInput | number
    fatherName?: NullableStringFieldUpdateOperationsInput | string | null
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole
    battingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    bowlingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    tshirtSize?: NullableStringFieldUpdateOperationsInput | string | null
    trouserSize?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyName?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyNumber?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus
    basePrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    soldPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type PlayerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    age?: IntFieldUpdateOperationsInput | number
    fatherName?: NullableStringFieldUpdateOperationsInput | string | null
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole
    battingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    bowlingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    tshirtSize?: NullableStringFieldUpdateOperationsInput | string | null
    trouserSize?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyName?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyNumber?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus
    basePrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    soldPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type BidHistoryCreateInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    timestamp?: Date | string
    player: PlayerCreateNestedOneWithoutBidHistoryInput
    auction: AuctionCreateNestedOneWithoutBidhistoriesInput
    team: TeamCreateNestedOneWithoutBidHistoriesInput
  }

  export type BidHistoryUncheckedCreateInput = {
    id?: string
    playerId: string
    auctionId: string
    teamId: string
    amount: Decimal | DecimalJsLike | number | string
    timestamp?: Date | string
  }

  export type BidHistoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    player?: PlayerUpdateOneRequiredWithoutBidHistoryNestedInput
    auction?: AuctionUpdateOneRequiredWithoutBidhistoriesNestedInput
    team?: TeamUpdateOneRequiredWithoutBidHistoriesNestedInput
  }

  export type BidHistoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    teamId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BidHistoryCreateManyInput = {
    id?: string
    playerId: string
    auctionId: string
    teamId: string
    amount: Decimal | DecimalJsLike | number | string
    timestamp?: Date | string
  }

  export type BidHistoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BidHistoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    teamId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    id?: string
    action: string
    endpoint: string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    userId: string
    action: string
    endpoint: string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: string
    userId: string
    action: string
    endpoint: string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeedbackCreateInput = {
    id?: string
    rating: number
    message?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutFeedbackInput
  }

  export type FeedbackUncheckedCreateInput = {
    id?: string
    userId: string
    rating: number
    message?: string | null
    createdAt?: Date | string
  }

  export type FeedbackUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    message?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutFeedbackNestedInput
  }

  export type FeedbackUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    message?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeedbackCreateManyInput = {
    id?: string
    userId: string
    rating: number
    message?: string | null
    createdAt?: Date | string
  }

  export type FeedbackUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    message?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeedbackUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    message?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuctionInsightCreateInput = {
    id?: string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    auction: AuctionCreateNestedOneWithoutAuctionInsightInput
  }

  export type AuctionInsightUncheckedCreateInput = {
    id?: string
    auctionId: string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuctionInsightUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auction?: AuctionUpdateOneRequiredWithoutAuctionInsightNestedInput
  }

  export type AuctionInsightUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuctionInsightCreateManyInput = {
    id?: string
    auctionId: string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuctionInsightUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuctionInsightUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactMessageCreateInput = {
    id?: string
    name: string
    email: string
    mobile?: string | null
    message: string
    isRead?: boolean
    createdAt?: Date | string
  }

  export type ContactMessageUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    mobile?: string | null
    message: string
    isRead?: boolean
    createdAt?: Date | string
  }

  export type ContactMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    message?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    message?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactMessageCreateManyInput = {
    id?: string
    name: string
    email: string
    mobile?: string | null
    message: string
    isRead?: boolean
    createdAt?: Date | string
  }

  export type ContactMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    message?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    message?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AuctionListRelationFilter = {
    every?: AuctionWhereInput
    some?: AuctionWhereInput
    none?: AuctionWhereInput
  }

  export type JoinedAuctionListRelationFilter = {
    every?: JoinedAuctionWhereInput
    some?: JoinedAuctionWhereInput
    none?: JoinedAuctionWhereInput
  }

  export type AuditLogListRelationFilter = {
    every?: AuditLogWhereInput
    some?: AuditLogWhereInput
    none?: AuditLogWhereInput
  }

  export type FeedbackNullableScalarRelationFilter = {
    is?: FeedbackWhereInput | null
    isNot?: FeedbackWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AuctionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type JoinedAuctionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    password?: SortOrder
    mobile?: SortOrder
    city?: SortOrder
    profileUrl?: SortOrder
    createdAt?: SortOrder
    stripeCustomerId?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    password?: SortOrder
    mobile?: SortOrder
    city?: SortOrder
    profileUrl?: SortOrder
    createdAt?: SortOrder
    stripeCustomerId?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    password?: SortOrder
    mobile?: SortOrder
    city?: SortOrder
    profileUrl?: SortOrder
    createdAt?: SortOrder
    stripeCustomerId?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EnumPlanTierFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanTier | EnumPlanTierFieldRefInput<$PrismaModel>
    in?: $Enums.PlanTier[] | ListEnumPlanTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanTier[] | ListEnumPlanTierFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanTierFilter<$PrismaModel> | $Enums.PlanTier
  }

  export type EnumAuctionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AuctionStatus | EnumAuctionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AuctionStatus[] | ListEnumAuctionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuctionStatus[] | ListEnumAuctionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAuctionStatusFilter<$PrismaModel> | $Enums.AuctionStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type TeamListRelationFilter = {
    every?: TeamWhereInput
    some?: TeamWhereInput
    none?: TeamWhereInput
  }

  export type PlayerListRelationFilter = {
    every?: PlayerWhereInput
    some?: PlayerWhereInput
    none?: PlayerWhereInput
  }

  export type CategoryListRelationFilter = {
    every?: CategoryWhereInput
    some?: CategoryWhereInput
    none?: CategoryWhereInput
  }

  export type BidHistoryListRelationFilter = {
    every?: BidHistoryWhereInput
    some?: BidHistoryWhereInput
    none?: BidHistoryWhereInput
  }

  export type AuctionInsightNullableScalarRelationFilter = {
    is?: AuctionInsightWhereInput | null
    isNot?: AuctionInsightWhereInput | null
  }

  export type TeamOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PlayerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CategoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BidHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuctionCountOrderByAggregateInput = {
    id?: SortOrder
    auctionCode?: SortOrder
    organizerId?: SortOrder
    name?: SortOrder
    location?: SortOrder
    logo?: SortOrder
    sportsType?: SortOrder
    season?: SortOrder
    auctionDate?: SortOrder
    auctionStartTime?: SortOrder
    budgetPerTeam?: SortOrder
    minBid?: SortOrder
    bidIncrease?: SortOrder
    minPlayersPerTeam?: SortOrder
    maxPlayersPerTeam?: SortOrder
    isBoosterEnabled?: SortOrder
    boosterAmount?: SortOrder
    boosterTriggerPlayerCount?: SortOrder
    bidRules?: SortOrder
    planTier?: SortOrder
    isPaid?: SortOrder
    razorpayOrderId?: SortOrder
    razorpayPaymentId?: SortOrder
    razorpaySignature?: SortOrder
    status?: SortOrder
    liveTheme?: SortOrder
    soldEffect?: SortOrder
    overlayTheme?: SortOrder
    overlayLayout?: SortOrder
    createdAt?: SortOrder
    ArchivedAt?: SortOrder
  }

  export type AuctionAvgOrderByAggregateInput = {
    budgetPerTeam?: SortOrder
    minBid?: SortOrder
    bidIncrease?: SortOrder
    minPlayersPerTeam?: SortOrder
    maxPlayersPerTeam?: SortOrder
    boosterAmount?: SortOrder
    boosterTriggerPlayerCount?: SortOrder
  }

  export type AuctionMaxOrderByAggregateInput = {
    id?: SortOrder
    auctionCode?: SortOrder
    organizerId?: SortOrder
    name?: SortOrder
    location?: SortOrder
    logo?: SortOrder
    sportsType?: SortOrder
    season?: SortOrder
    auctionDate?: SortOrder
    auctionStartTime?: SortOrder
    budgetPerTeam?: SortOrder
    minBid?: SortOrder
    bidIncrease?: SortOrder
    minPlayersPerTeam?: SortOrder
    maxPlayersPerTeam?: SortOrder
    isBoosterEnabled?: SortOrder
    boosterAmount?: SortOrder
    boosterTriggerPlayerCount?: SortOrder
    planTier?: SortOrder
    isPaid?: SortOrder
    razorpayOrderId?: SortOrder
    razorpayPaymentId?: SortOrder
    razorpaySignature?: SortOrder
    status?: SortOrder
    liveTheme?: SortOrder
    soldEffect?: SortOrder
    overlayTheme?: SortOrder
    overlayLayout?: SortOrder
    createdAt?: SortOrder
    ArchivedAt?: SortOrder
  }

  export type AuctionMinOrderByAggregateInput = {
    id?: SortOrder
    auctionCode?: SortOrder
    organizerId?: SortOrder
    name?: SortOrder
    location?: SortOrder
    logo?: SortOrder
    sportsType?: SortOrder
    season?: SortOrder
    auctionDate?: SortOrder
    auctionStartTime?: SortOrder
    budgetPerTeam?: SortOrder
    minBid?: SortOrder
    bidIncrease?: SortOrder
    minPlayersPerTeam?: SortOrder
    maxPlayersPerTeam?: SortOrder
    isBoosterEnabled?: SortOrder
    boosterAmount?: SortOrder
    boosterTriggerPlayerCount?: SortOrder
    planTier?: SortOrder
    isPaid?: SortOrder
    razorpayOrderId?: SortOrder
    razorpayPaymentId?: SortOrder
    razorpaySignature?: SortOrder
    status?: SortOrder
    liveTheme?: SortOrder
    soldEffect?: SortOrder
    overlayTheme?: SortOrder
    overlayLayout?: SortOrder
    createdAt?: SortOrder
    ArchivedAt?: SortOrder
  }

  export type AuctionSumOrderByAggregateInput = {
    budgetPerTeam?: SortOrder
    minBid?: SortOrder
    bidIncrease?: SortOrder
    minPlayersPerTeam?: SortOrder
    maxPlayersPerTeam?: SortOrder
    boosterAmount?: SortOrder
    boosterTriggerPlayerCount?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumPlanTierWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanTier | EnumPlanTierFieldRefInput<$PrismaModel>
    in?: $Enums.PlanTier[] | ListEnumPlanTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanTier[] | ListEnumPlanTierFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanTierWithAggregatesFilter<$PrismaModel> | $Enums.PlanTier
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlanTierFilter<$PrismaModel>
    _max?: NestedEnumPlanTierFilter<$PrismaModel>
  }

  export type EnumAuctionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuctionStatus | EnumAuctionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AuctionStatus[] | ListEnumAuctionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuctionStatus[] | ListEnumAuctionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAuctionStatusWithAggregatesFilter<$PrismaModel> | $Enums.AuctionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuctionStatusFilter<$PrismaModel>
    _max?: NestedEnumAuctionStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type AuctionScalarRelationFilter = {
    is?: AuctionWhereInput
    isNot?: AuctionWhereInput
  }

  export type JoinedAuctionUserIdAuctionIdCompoundUniqueInput = {
    userId: string
    auctionId: string
  }

  export type JoinedAuctionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    auctionId?: SortOrder
    joinedAt?: SortOrder
  }

  export type JoinedAuctionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    auctionId?: SortOrder
    joinedAt?: SortOrder
  }

  export type JoinedAuctionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    auctionId?: SortOrder
    joinedAt?: SortOrder
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type CategoryCountOrderByAggregateInput = {
    id?: SortOrder
    auctionId?: SortOrder
    name?: SortOrder
    color?: SortOrder
    baseBid?: SortOrder
    minIncrement?: SortOrder
    maxPlayersPerTeam?: SortOrder
    minPlayersPerTeam?: SortOrder
  }

  export type CategoryAvgOrderByAggregateInput = {
    baseBid?: SortOrder
    minIncrement?: SortOrder
    maxPlayersPerTeam?: SortOrder
    minPlayersPerTeam?: SortOrder
  }

  export type CategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    auctionId?: SortOrder
    name?: SortOrder
    color?: SortOrder
    baseBid?: SortOrder
    minIncrement?: SortOrder
    maxPlayersPerTeam?: SortOrder
    minPlayersPerTeam?: SortOrder
  }

  export type CategoryMinOrderByAggregateInput = {
    id?: SortOrder
    auctionId?: SortOrder
    name?: SortOrder
    color?: SortOrder
    baseBid?: SortOrder
    minIncrement?: SortOrder
    maxPlayersPerTeam?: SortOrder
    minPlayersPerTeam?: SortOrder
  }

  export type CategorySumOrderByAggregateInput = {
    baseBid?: SortOrder
    minIncrement?: SortOrder
    maxPlayersPerTeam?: SortOrder
    minPlayersPerTeam?: SortOrder
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type TeamCountOrderByAggregateInput = {
    id?: SortOrder
    auctionId?: SortOrder
    name?: SortOrder
    shortName?: SortOrder
    shortcutKey?: SortOrder
    logo?: SortOrder
    originalPurse?: SortOrder
    purseSpent?: SortOrder
    playersCount?: SortOrder
  }

  export type TeamAvgOrderByAggregateInput = {
    originalPurse?: SortOrder
    purseSpent?: SortOrder
    playersCount?: SortOrder
  }

  export type TeamMaxOrderByAggregateInput = {
    id?: SortOrder
    auctionId?: SortOrder
    name?: SortOrder
    shortName?: SortOrder
    shortcutKey?: SortOrder
    logo?: SortOrder
    originalPurse?: SortOrder
    purseSpent?: SortOrder
    playersCount?: SortOrder
  }

  export type TeamMinOrderByAggregateInput = {
    id?: SortOrder
    auctionId?: SortOrder
    name?: SortOrder
    shortName?: SortOrder
    shortcutKey?: SortOrder
    logo?: SortOrder
    originalPurse?: SortOrder
    purseSpent?: SortOrder
    playersCount?: SortOrder
  }

  export type TeamSumOrderByAggregateInput = {
    originalPurse?: SortOrder
    purseSpent?: SortOrder
    playersCount?: SortOrder
  }

  export type EnumPlayerRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerRole | EnumPlayerRoleFieldRefInput<$PrismaModel>
    in?: $Enums.PlayerRole[] | ListEnumPlayerRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlayerRole[] | ListEnumPlayerRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumPlayerRoleFilter<$PrismaModel> | $Enums.PlayerRole
  }

  export type EnumPlayerStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerStatus | EnumPlayerStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlayerStatus[] | ListEnumPlayerStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlayerStatus[] | ListEnumPlayerStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPlayerStatusFilter<$PrismaModel> | $Enums.PlayerStatus
  }

  export type CategoryNullableScalarRelationFilter = {
    is?: CategoryWhereInput | null
    isNot?: CategoryWhereInput | null
  }

  export type TeamNullableScalarRelationFilter = {
    is?: TeamWhereInput | null
    isNot?: TeamWhereInput | null
  }

  export type PlayerCountOrderByAggregateInput = {
    id?: SortOrder
    auctionId?: SortOrder
    categoryId?: SortOrder
    name?: SortOrder
    mobile?: SortOrder
    age?: SortOrder
    fatherName?: SortOrder
    profilePic?: SortOrder
    role?: SortOrder
    battingStyle?: SortOrder
    bowlingStyle?: SortOrder
    tshirtSize?: SortOrder
    trouserSize?: SortOrder
    jerseyName?: SortOrder
    jerseyNumber?: SortOrder
    status?: SortOrder
    basePrice?: SortOrder
    teamId?: SortOrder
    soldPrice?: SortOrder
  }

  export type PlayerAvgOrderByAggregateInput = {
    age?: SortOrder
    jerseyNumber?: SortOrder
    basePrice?: SortOrder
    soldPrice?: SortOrder
  }

  export type PlayerMaxOrderByAggregateInput = {
    id?: SortOrder
    auctionId?: SortOrder
    categoryId?: SortOrder
    name?: SortOrder
    mobile?: SortOrder
    age?: SortOrder
    fatherName?: SortOrder
    profilePic?: SortOrder
    role?: SortOrder
    battingStyle?: SortOrder
    bowlingStyle?: SortOrder
    tshirtSize?: SortOrder
    trouserSize?: SortOrder
    jerseyName?: SortOrder
    jerseyNumber?: SortOrder
    status?: SortOrder
    basePrice?: SortOrder
    teamId?: SortOrder
    soldPrice?: SortOrder
  }

  export type PlayerMinOrderByAggregateInput = {
    id?: SortOrder
    auctionId?: SortOrder
    categoryId?: SortOrder
    name?: SortOrder
    mobile?: SortOrder
    age?: SortOrder
    fatherName?: SortOrder
    profilePic?: SortOrder
    role?: SortOrder
    battingStyle?: SortOrder
    bowlingStyle?: SortOrder
    tshirtSize?: SortOrder
    trouserSize?: SortOrder
    jerseyName?: SortOrder
    jerseyNumber?: SortOrder
    status?: SortOrder
    basePrice?: SortOrder
    teamId?: SortOrder
    soldPrice?: SortOrder
  }

  export type PlayerSumOrderByAggregateInput = {
    age?: SortOrder
    jerseyNumber?: SortOrder
    basePrice?: SortOrder
    soldPrice?: SortOrder
  }

  export type EnumPlayerRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerRole | EnumPlayerRoleFieldRefInput<$PrismaModel>
    in?: $Enums.PlayerRole[] | ListEnumPlayerRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlayerRole[] | ListEnumPlayerRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumPlayerRoleWithAggregatesFilter<$PrismaModel> | $Enums.PlayerRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlayerRoleFilter<$PrismaModel>
    _max?: NestedEnumPlayerRoleFilter<$PrismaModel>
  }

  export type EnumPlayerStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerStatus | EnumPlayerStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlayerStatus[] | ListEnumPlayerStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlayerStatus[] | ListEnumPlayerStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPlayerStatusWithAggregatesFilter<$PrismaModel> | $Enums.PlayerStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlayerStatusFilter<$PrismaModel>
    _max?: NestedEnumPlayerStatusFilter<$PrismaModel>
  }

  export type PlayerScalarRelationFilter = {
    is?: PlayerWhereInput
    isNot?: PlayerWhereInput
  }

  export type TeamScalarRelationFilter = {
    is?: TeamWhereInput
    isNot?: TeamWhereInput
  }

  export type BidHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    playerId?: SortOrder
    auctionId?: SortOrder
    teamId?: SortOrder
    amount?: SortOrder
    timestamp?: SortOrder
  }

  export type BidHistoryAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type BidHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    playerId?: SortOrder
    auctionId?: SortOrder
    teamId?: SortOrder
    amount?: SortOrder
    timestamp?: SortOrder
  }

  export type BidHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    playerId?: SortOrder
    auctionId?: SortOrder
    teamId?: SortOrder
    amount?: SortOrder
    timestamp?: SortOrder
  }

  export type BidHistorySumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    endpoint?: SortOrder
    details?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    endpoint?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    endpoint?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type FeedbackCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    rating?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
  }

  export type FeedbackAvgOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type FeedbackMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    rating?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
  }

  export type FeedbackMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    rating?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
  }

  export type FeedbackSumOrderByAggregateInput = {
    rating?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AuctionInsightCountOrderByAggregateInput = {
    id?: SortOrder
    auctionId?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
  }

  export type AuctionInsightMaxOrderByAggregateInput = {
    id?: SortOrder
    auctionId?: SortOrder
    createdAt?: SortOrder
  }

  export type AuctionInsightMinOrderByAggregateInput = {
    id?: SortOrder
    auctionId?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type ContactMessageCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    mobile?: SortOrder
    message?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
  }

  export type ContactMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    mobile?: SortOrder
    message?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
  }

  export type ContactMessageMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    mobile?: SortOrder
    message?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
  }

  export type AuctionCreateNestedManyWithoutOrganizerInput = {
    create?: XOR<AuctionCreateWithoutOrganizerInput, AuctionUncheckedCreateWithoutOrganizerInput> | AuctionCreateWithoutOrganizerInput[] | AuctionUncheckedCreateWithoutOrganizerInput[]
    connectOrCreate?: AuctionCreateOrConnectWithoutOrganizerInput | AuctionCreateOrConnectWithoutOrganizerInput[]
    createMany?: AuctionCreateManyOrganizerInputEnvelope
    connect?: AuctionWhereUniqueInput | AuctionWhereUniqueInput[]
  }

  export type JoinedAuctionCreateNestedManyWithoutUserInput = {
    create?: XOR<JoinedAuctionCreateWithoutUserInput, JoinedAuctionUncheckedCreateWithoutUserInput> | JoinedAuctionCreateWithoutUserInput[] | JoinedAuctionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: JoinedAuctionCreateOrConnectWithoutUserInput | JoinedAuctionCreateOrConnectWithoutUserInput[]
    createMany?: JoinedAuctionCreateManyUserInputEnvelope
    connect?: JoinedAuctionWhereUniqueInput | JoinedAuctionWhereUniqueInput[]
  }

  export type AuditLogCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type FeedbackCreateNestedOneWithoutUserInput = {
    create?: XOR<FeedbackCreateWithoutUserInput, FeedbackUncheckedCreateWithoutUserInput>
    connectOrCreate?: FeedbackCreateOrConnectWithoutUserInput
    connect?: FeedbackWhereUniqueInput
  }

  export type AuctionUncheckedCreateNestedManyWithoutOrganizerInput = {
    create?: XOR<AuctionCreateWithoutOrganizerInput, AuctionUncheckedCreateWithoutOrganizerInput> | AuctionCreateWithoutOrganizerInput[] | AuctionUncheckedCreateWithoutOrganizerInput[]
    connectOrCreate?: AuctionCreateOrConnectWithoutOrganizerInput | AuctionCreateOrConnectWithoutOrganizerInput[]
    createMany?: AuctionCreateManyOrganizerInputEnvelope
    connect?: AuctionWhereUniqueInput | AuctionWhereUniqueInput[]
  }

  export type JoinedAuctionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<JoinedAuctionCreateWithoutUserInput, JoinedAuctionUncheckedCreateWithoutUserInput> | JoinedAuctionCreateWithoutUserInput[] | JoinedAuctionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: JoinedAuctionCreateOrConnectWithoutUserInput | JoinedAuctionCreateOrConnectWithoutUserInput[]
    createMany?: JoinedAuctionCreateManyUserInputEnvelope
    connect?: JoinedAuctionWhereUniqueInput | JoinedAuctionWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type FeedbackUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<FeedbackCreateWithoutUserInput, FeedbackUncheckedCreateWithoutUserInput>
    connectOrCreate?: FeedbackCreateOrConnectWithoutUserInput
    connect?: FeedbackWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AuctionUpdateManyWithoutOrganizerNestedInput = {
    create?: XOR<AuctionCreateWithoutOrganizerInput, AuctionUncheckedCreateWithoutOrganizerInput> | AuctionCreateWithoutOrganizerInput[] | AuctionUncheckedCreateWithoutOrganizerInput[]
    connectOrCreate?: AuctionCreateOrConnectWithoutOrganizerInput | AuctionCreateOrConnectWithoutOrganizerInput[]
    upsert?: AuctionUpsertWithWhereUniqueWithoutOrganizerInput | AuctionUpsertWithWhereUniqueWithoutOrganizerInput[]
    createMany?: AuctionCreateManyOrganizerInputEnvelope
    set?: AuctionWhereUniqueInput | AuctionWhereUniqueInput[]
    disconnect?: AuctionWhereUniqueInput | AuctionWhereUniqueInput[]
    delete?: AuctionWhereUniqueInput | AuctionWhereUniqueInput[]
    connect?: AuctionWhereUniqueInput | AuctionWhereUniqueInput[]
    update?: AuctionUpdateWithWhereUniqueWithoutOrganizerInput | AuctionUpdateWithWhereUniqueWithoutOrganizerInput[]
    updateMany?: AuctionUpdateManyWithWhereWithoutOrganizerInput | AuctionUpdateManyWithWhereWithoutOrganizerInput[]
    deleteMany?: AuctionScalarWhereInput | AuctionScalarWhereInput[]
  }

  export type JoinedAuctionUpdateManyWithoutUserNestedInput = {
    create?: XOR<JoinedAuctionCreateWithoutUserInput, JoinedAuctionUncheckedCreateWithoutUserInput> | JoinedAuctionCreateWithoutUserInput[] | JoinedAuctionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: JoinedAuctionCreateOrConnectWithoutUserInput | JoinedAuctionCreateOrConnectWithoutUserInput[]
    upsert?: JoinedAuctionUpsertWithWhereUniqueWithoutUserInput | JoinedAuctionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: JoinedAuctionCreateManyUserInputEnvelope
    set?: JoinedAuctionWhereUniqueInput | JoinedAuctionWhereUniqueInput[]
    disconnect?: JoinedAuctionWhereUniqueInput | JoinedAuctionWhereUniqueInput[]
    delete?: JoinedAuctionWhereUniqueInput | JoinedAuctionWhereUniqueInput[]
    connect?: JoinedAuctionWhereUniqueInput | JoinedAuctionWhereUniqueInput[]
    update?: JoinedAuctionUpdateWithWhereUniqueWithoutUserInput | JoinedAuctionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: JoinedAuctionUpdateManyWithWhereWithoutUserInput | JoinedAuctionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: JoinedAuctionScalarWhereInput | JoinedAuctionScalarWhereInput[]
  }

  export type AuditLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type FeedbackUpdateOneWithoutUserNestedInput = {
    create?: XOR<FeedbackCreateWithoutUserInput, FeedbackUncheckedCreateWithoutUserInput>
    connectOrCreate?: FeedbackCreateOrConnectWithoutUserInput
    upsert?: FeedbackUpsertWithoutUserInput
    disconnect?: FeedbackWhereInput | boolean
    delete?: FeedbackWhereInput | boolean
    connect?: FeedbackWhereUniqueInput
    update?: XOR<XOR<FeedbackUpdateToOneWithWhereWithoutUserInput, FeedbackUpdateWithoutUserInput>, FeedbackUncheckedUpdateWithoutUserInput>
  }

  export type AuctionUncheckedUpdateManyWithoutOrganizerNestedInput = {
    create?: XOR<AuctionCreateWithoutOrganizerInput, AuctionUncheckedCreateWithoutOrganizerInput> | AuctionCreateWithoutOrganizerInput[] | AuctionUncheckedCreateWithoutOrganizerInput[]
    connectOrCreate?: AuctionCreateOrConnectWithoutOrganizerInput | AuctionCreateOrConnectWithoutOrganizerInput[]
    upsert?: AuctionUpsertWithWhereUniqueWithoutOrganizerInput | AuctionUpsertWithWhereUniqueWithoutOrganizerInput[]
    createMany?: AuctionCreateManyOrganizerInputEnvelope
    set?: AuctionWhereUniqueInput | AuctionWhereUniqueInput[]
    disconnect?: AuctionWhereUniqueInput | AuctionWhereUniqueInput[]
    delete?: AuctionWhereUniqueInput | AuctionWhereUniqueInput[]
    connect?: AuctionWhereUniqueInput | AuctionWhereUniqueInput[]
    update?: AuctionUpdateWithWhereUniqueWithoutOrganizerInput | AuctionUpdateWithWhereUniqueWithoutOrganizerInput[]
    updateMany?: AuctionUpdateManyWithWhereWithoutOrganizerInput | AuctionUpdateManyWithWhereWithoutOrganizerInput[]
    deleteMany?: AuctionScalarWhereInput | AuctionScalarWhereInput[]
  }

  export type JoinedAuctionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<JoinedAuctionCreateWithoutUserInput, JoinedAuctionUncheckedCreateWithoutUserInput> | JoinedAuctionCreateWithoutUserInput[] | JoinedAuctionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: JoinedAuctionCreateOrConnectWithoutUserInput | JoinedAuctionCreateOrConnectWithoutUserInput[]
    upsert?: JoinedAuctionUpsertWithWhereUniqueWithoutUserInput | JoinedAuctionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: JoinedAuctionCreateManyUserInputEnvelope
    set?: JoinedAuctionWhereUniqueInput | JoinedAuctionWhereUniqueInput[]
    disconnect?: JoinedAuctionWhereUniqueInput | JoinedAuctionWhereUniqueInput[]
    delete?: JoinedAuctionWhereUniqueInput | JoinedAuctionWhereUniqueInput[]
    connect?: JoinedAuctionWhereUniqueInput | JoinedAuctionWhereUniqueInput[]
    update?: JoinedAuctionUpdateWithWhereUniqueWithoutUserInput | JoinedAuctionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: JoinedAuctionUpdateManyWithWhereWithoutUserInput | JoinedAuctionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: JoinedAuctionScalarWhereInput | JoinedAuctionScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type FeedbackUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<FeedbackCreateWithoutUserInput, FeedbackUncheckedCreateWithoutUserInput>
    connectOrCreate?: FeedbackCreateOrConnectWithoutUserInput
    upsert?: FeedbackUpsertWithoutUserInput
    disconnect?: FeedbackWhereInput | boolean
    delete?: FeedbackWhereInput | boolean
    connect?: FeedbackWhereUniqueInput
    update?: XOR<XOR<FeedbackUpdateToOneWithWhereWithoutUserInput, FeedbackUpdateWithoutUserInput>, FeedbackUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutAuctionsInput = {
    create?: XOR<UserCreateWithoutAuctionsInput, UserUncheckedCreateWithoutAuctionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuctionsInput
    connect?: UserWhereUniqueInput
  }

  export type TeamCreateNestedManyWithoutAuctionInput = {
    create?: XOR<TeamCreateWithoutAuctionInput, TeamUncheckedCreateWithoutAuctionInput> | TeamCreateWithoutAuctionInput[] | TeamUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: TeamCreateOrConnectWithoutAuctionInput | TeamCreateOrConnectWithoutAuctionInput[]
    createMany?: TeamCreateManyAuctionInputEnvelope
    connect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
  }

  export type PlayerCreateNestedManyWithoutAuctionInput = {
    create?: XOR<PlayerCreateWithoutAuctionInput, PlayerUncheckedCreateWithoutAuctionInput> | PlayerCreateWithoutAuctionInput[] | PlayerUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutAuctionInput | PlayerCreateOrConnectWithoutAuctionInput[]
    createMany?: PlayerCreateManyAuctionInputEnvelope
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
  }

  export type CategoryCreateNestedManyWithoutAuctionInput = {
    create?: XOR<CategoryCreateWithoutAuctionInput, CategoryUncheckedCreateWithoutAuctionInput> | CategoryCreateWithoutAuctionInput[] | CategoryUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutAuctionInput | CategoryCreateOrConnectWithoutAuctionInput[]
    createMany?: CategoryCreateManyAuctionInputEnvelope
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
  }

  export type BidHistoryCreateNestedManyWithoutAuctionInput = {
    create?: XOR<BidHistoryCreateWithoutAuctionInput, BidHistoryUncheckedCreateWithoutAuctionInput> | BidHistoryCreateWithoutAuctionInput[] | BidHistoryUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: BidHistoryCreateOrConnectWithoutAuctionInput | BidHistoryCreateOrConnectWithoutAuctionInput[]
    createMany?: BidHistoryCreateManyAuctionInputEnvelope
    connect?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
  }

  export type AuctionInsightCreateNestedOneWithoutAuctionInput = {
    create?: XOR<AuctionInsightCreateWithoutAuctionInput, AuctionInsightUncheckedCreateWithoutAuctionInput>
    connectOrCreate?: AuctionInsightCreateOrConnectWithoutAuctionInput
    connect?: AuctionInsightWhereUniqueInput
  }

  export type JoinedAuctionCreateNestedManyWithoutAuctionInput = {
    create?: XOR<JoinedAuctionCreateWithoutAuctionInput, JoinedAuctionUncheckedCreateWithoutAuctionInput> | JoinedAuctionCreateWithoutAuctionInput[] | JoinedAuctionUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: JoinedAuctionCreateOrConnectWithoutAuctionInput | JoinedAuctionCreateOrConnectWithoutAuctionInput[]
    createMany?: JoinedAuctionCreateManyAuctionInputEnvelope
    connect?: JoinedAuctionWhereUniqueInput | JoinedAuctionWhereUniqueInput[]
  }

  export type TeamUncheckedCreateNestedManyWithoutAuctionInput = {
    create?: XOR<TeamCreateWithoutAuctionInput, TeamUncheckedCreateWithoutAuctionInput> | TeamCreateWithoutAuctionInput[] | TeamUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: TeamCreateOrConnectWithoutAuctionInput | TeamCreateOrConnectWithoutAuctionInput[]
    createMany?: TeamCreateManyAuctionInputEnvelope
    connect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
  }

  export type PlayerUncheckedCreateNestedManyWithoutAuctionInput = {
    create?: XOR<PlayerCreateWithoutAuctionInput, PlayerUncheckedCreateWithoutAuctionInput> | PlayerCreateWithoutAuctionInput[] | PlayerUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutAuctionInput | PlayerCreateOrConnectWithoutAuctionInput[]
    createMany?: PlayerCreateManyAuctionInputEnvelope
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
  }

  export type CategoryUncheckedCreateNestedManyWithoutAuctionInput = {
    create?: XOR<CategoryCreateWithoutAuctionInput, CategoryUncheckedCreateWithoutAuctionInput> | CategoryCreateWithoutAuctionInput[] | CategoryUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutAuctionInput | CategoryCreateOrConnectWithoutAuctionInput[]
    createMany?: CategoryCreateManyAuctionInputEnvelope
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
  }

  export type BidHistoryUncheckedCreateNestedManyWithoutAuctionInput = {
    create?: XOR<BidHistoryCreateWithoutAuctionInput, BidHistoryUncheckedCreateWithoutAuctionInput> | BidHistoryCreateWithoutAuctionInput[] | BidHistoryUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: BidHistoryCreateOrConnectWithoutAuctionInput | BidHistoryCreateOrConnectWithoutAuctionInput[]
    createMany?: BidHistoryCreateManyAuctionInputEnvelope
    connect?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
  }

  export type AuctionInsightUncheckedCreateNestedOneWithoutAuctionInput = {
    create?: XOR<AuctionInsightCreateWithoutAuctionInput, AuctionInsightUncheckedCreateWithoutAuctionInput>
    connectOrCreate?: AuctionInsightCreateOrConnectWithoutAuctionInput
    connect?: AuctionInsightWhereUniqueInput
  }

  export type JoinedAuctionUncheckedCreateNestedManyWithoutAuctionInput = {
    create?: XOR<JoinedAuctionCreateWithoutAuctionInput, JoinedAuctionUncheckedCreateWithoutAuctionInput> | JoinedAuctionCreateWithoutAuctionInput[] | JoinedAuctionUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: JoinedAuctionCreateOrConnectWithoutAuctionInput | JoinedAuctionCreateOrConnectWithoutAuctionInput[]
    createMany?: JoinedAuctionCreateManyAuctionInputEnvelope
    connect?: JoinedAuctionWhereUniqueInput | JoinedAuctionWhereUniqueInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumPlanTierFieldUpdateOperationsInput = {
    set?: $Enums.PlanTier
  }

  export type EnumAuctionStatusFieldUpdateOperationsInput = {
    set?: $Enums.AuctionStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutAuctionsNestedInput = {
    create?: XOR<UserCreateWithoutAuctionsInput, UserUncheckedCreateWithoutAuctionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuctionsInput
    upsert?: UserUpsertWithoutAuctionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAuctionsInput, UserUpdateWithoutAuctionsInput>, UserUncheckedUpdateWithoutAuctionsInput>
  }

  export type TeamUpdateManyWithoutAuctionNestedInput = {
    create?: XOR<TeamCreateWithoutAuctionInput, TeamUncheckedCreateWithoutAuctionInput> | TeamCreateWithoutAuctionInput[] | TeamUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: TeamCreateOrConnectWithoutAuctionInput | TeamCreateOrConnectWithoutAuctionInput[]
    upsert?: TeamUpsertWithWhereUniqueWithoutAuctionInput | TeamUpsertWithWhereUniqueWithoutAuctionInput[]
    createMany?: TeamCreateManyAuctionInputEnvelope
    set?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    disconnect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    delete?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    connect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    update?: TeamUpdateWithWhereUniqueWithoutAuctionInput | TeamUpdateWithWhereUniqueWithoutAuctionInput[]
    updateMany?: TeamUpdateManyWithWhereWithoutAuctionInput | TeamUpdateManyWithWhereWithoutAuctionInput[]
    deleteMany?: TeamScalarWhereInput | TeamScalarWhereInput[]
  }

  export type PlayerUpdateManyWithoutAuctionNestedInput = {
    create?: XOR<PlayerCreateWithoutAuctionInput, PlayerUncheckedCreateWithoutAuctionInput> | PlayerCreateWithoutAuctionInput[] | PlayerUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutAuctionInput | PlayerCreateOrConnectWithoutAuctionInput[]
    upsert?: PlayerUpsertWithWhereUniqueWithoutAuctionInput | PlayerUpsertWithWhereUniqueWithoutAuctionInput[]
    createMany?: PlayerCreateManyAuctionInputEnvelope
    set?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    disconnect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    delete?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    update?: PlayerUpdateWithWhereUniqueWithoutAuctionInput | PlayerUpdateWithWhereUniqueWithoutAuctionInput[]
    updateMany?: PlayerUpdateManyWithWhereWithoutAuctionInput | PlayerUpdateManyWithWhereWithoutAuctionInput[]
    deleteMany?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
  }

  export type CategoryUpdateManyWithoutAuctionNestedInput = {
    create?: XOR<CategoryCreateWithoutAuctionInput, CategoryUncheckedCreateWithoutAuctionInput> | CategoryCreateWithoutAuctionInput[] | CategoryUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutAuctionInput | CategoryCreateOrConnectWithoutAuctionInput[]
    upsert?: CategoryUpsertWithWhereUniqueWithoutAuctionInput | CategoryUpsertWithWhereUniqueWithoutAuctionInput[]
    createMany?: CategoryCreateManyAuctionInputEnvelope
    set?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    disconnect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    delete?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    update?: CategoryUpdateWithWhereUniqueWithoutAuctionInput | CategoryUpdateWithWhereUniqueWithoutAuctionInput[]
    updateMany?: CategoryUpdateManyWithWhereWithoutAuctionInput | CategoryUpdateManyWithWhereWithoutAuctionInput[]
    deleteMany?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
  }

  export type BidHistoryUpdateManyWithoutAuctionNestedInput = {
    create?: XOR<BidHistoryCreateWithoutAuctionInput, BidHistoryUncheckedCreateWithoutAuctionInput> | BidHistoryCreateWithoutAuctionInput[] | BidHistoryUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: BidHistoryCreateOrConnectWithoutAuctionInput | BidHistoryCreateOrConnectWithoutAuctionInput[]
    upsert?: BidHistoryUpsertWithWhereUniqueWithoutAuctionInput | BidHistoryUpsertWithWhereUniqueWithoutAuctionInput[]
    createMany?: BidHistoryCreateManyAuctionInputEnvelope
    set?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    disconnect?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    delete?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    connect?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    update?: BidHistoryUpdateWithWhereUniqueWithoutAuctionInput | BidHistoryUpdateWithWhereUniqueWithoutAuctionInput[]
    updateMany?: BidHistoryUpdateManyWithWhereWithoutAuctionInput | BidHistoryUpdateManyWithWhereWithoutAuctionInput[]
    deleteMany?: BidHistoryScalarWhereInput | BidHistoryScalarWhereInput[]
  }

  export type AuctionInsightUpdateOneWithoutAuctionNestedInput = {
    create?: XOR<AuctionInsightCreateWithoutAuctionInput, AuctionInsightUncheckedCreateWithoutAuctionInput>
    connectOrCreate?: AuctionInsightCreateOrConnectWithoutAuctionInput
    upsert?: AuctionInsightUpsertWithoutAuctionInput
    disconnect?: AuctionInsightWhereInput | boolean
    delete?: AuctionInsightWhereInput | boolean
    connect?: AuctionInsightWhereUniqueInput
    update?: XOR<XOR<AuctionInsightUpdateToOneWithWhereWithoutAuctionInput, AuctionInsightUpdateWithoutAuctionInput>, AuctionInsightUncheckedUpdateWithoutAuctionInput>
  }

  export type JoinedAuctionUpdateManyWithoutAuctionNestedInput = {
    create?: XOR<JoinedAuctionCreateWithoutAuctionInput, JoinedAuctionUncheckedCreateWithoutAuctionInput> | JoinedAuctionCreateWithoutAuctionInput[] | JoinedAuctionUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: JoinedAuctionCreateOrConnectWithoutAuctionInput | JoinedAuctionCreateOrConnectWithoutAuctionInput[]
    upsert?: JoinedAuctionUpsertWithWhereUniqueWithoutAuctionInput | JoinedAuctionUpsertWithWhereUniqueWithoutAuctionInput[]
    createMany?: JoinedAuctionCreateManyAuctionInputEnvelope
    set?: JoinedAuctionWhereUniqueInput | JoinedAuctionWhereUniqueInput[]
    disconnect?: JoinedAuctionWhereUniqueInput | JoinedAuctionWhereUniqueInput[]
    delete?: JoinedAuctionWhereUniqueInput | JoinedAuctionWhereUniqueInput[]
    connect?: JoinedAuctionWhereUniqueInput | JoinedAuctionWhereUniqueInput[]
    update?: JoinedAuctionUpdateWithWhereUniqueWithoutAuctionInput | JoinedAuctionUpdateWithWhereUniqueWithoutAuctionInput[]
    updateMany?: JoinedAuctionUpdateManyWithWhereWithoutAuctionInput | JoinedAuctionUpdateManyWithWhereWithoutAuctionInput[]
    deleteMany?: JoinedAuctionScalarWhereInput | JoinedAuctionScalarWhereInput[]
  }

  export type TeamUncheckedUpdateManyWithoutAuctionNestedInput = {
    create?: XOR<TeamCreateWithoutAuctionInput, TeamUncheckedCreateWithoutAuctionInput> | TeamCreateWithoutAuctionInput[] | TeamUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: TeamCreateOrConnectWithoutAuctionInput | TeamCreateOrConnectWithoutAuctionInput[]
    upsert?: TeamUpsertWithWhereUniqueWithoutAuctionInput | TeamUpsertWithWhereUniqueWithoutAuctionInput[]
    createMany?: TeamCreateManyAuctionInputEnvelope
    set?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    disconnect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    delete?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    connect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    update?: TeamUpdateWithWhereUniqueWithoutAuctionInput | TeamUpdateWithWhereUniqueWithoutAuctionInput[]
    updateMany?: TeamUpdateManyWithWhereWithoutAuctionInput | TeamUpdateManyWithWhereWithoutAuctionInput[]
    deleteMany?: TeamScalarWhereInput | TeamScalarWhereInput[]
  }

  export type PlayerUncheckedUpdateManyWithoutAuctionNestedInput = {
    create?: XOR<PlayerCreateWithoutAuctionInput, PlayerUncheckedCreateWithoutAuctionInput> | PlayerCreateWithoutAuctionInput[] | PlayerUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutAuctionInput | PlayerCreateOrConnectWithoutAuctionInput[]
    upsert?: PlayerUpsertWithWhereUniqueWithoutAuctionInput | PlayerUpsertWithWhereUniqueWithoutAuctionInput[]
    createMany?: PlayerCreateManyAuctionInputEnvelope
    set?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    disconnect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    delete?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    update?: PlayerUpdateWithWhereUniqueWithoutAuctionInput | PlayerUpdateWithWhereUniqueWithoutAuctionInput[]
    updateMany?: PlayerUpdateManyWithWhereWithoutAuctionInput | PlayerUpdateManyWithWhereWithoutAuctionInput[]
    deleteMany?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
  }

  export type CategoryUncheckedUpdateManyWithoutAuctionNestedInput = {
    create?: XOR<CategoryCreateWithoutAuctionInput, CategoryUncheckedCreateWithoutAuctionInput> | CategoryCreateWithoutAuctionInput[] | CategoryUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutAuctionInput | CategoryCreateOrConnectWithoutAuctionInput[]
    upsert?: CategoryUpsertWithWhereUniqueWithoutAuctionInput | CategoryUpsertWithWhereUniqueWithoutAuctionInput[]
    createMany?: CategoryCreateManyAuctionInputEnvelope
    set?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    disconnect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    delete?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    update?: CategoryUpdateWithWhereUniqueWithoutAuctionInput | CategoryUpdateWithWhereUniqueWithoutAuctionInput[]
    updateMany?: CategoryUpdateManyWithWhereWithoutAuctionInput | CategoryUpdateManyWithWhereWithoutAuctionInput[]
    deleteMany?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
  }

  export type BidHistoryUncheckedUpdateManyWithoutAuctionNestedInput = {
    create?: XOR<BidHistoryCreateWithoutAuctionInput, BidHistoryUncheckedCreateWithoutAuctionInput> | BidHistoryCreateWithoutAuctionInput[] | BidHistoryUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: BidHistoryCreateOrConnectWithoutAuctionInput | BidHistoryCreateOrConnectWithoutAuctionInput[]
    upsert?: BidHistoryUpsertWithWhereUniqueWithoutAuctionInput | BidHistoryUpsertWithWhereUniqueWithoutAuctionInput[]
    createMany?: BidHistoryCreateManyAuctionInputEnvelope
    set?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    disconnect?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    delete?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    connect?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    update?: BidHistoryUpdateWithWhereUniqueWithoutAuctionInput | BidHistoryUpdateWithWhereUniqueWithoutAuctionInput[]
    updateMany?: BidHistoryUpdateManyWithWhereWithoutAuctionInput | BidHistoryUpdateManyWithWhereWithoutAuctionInput[]
    deleteMany?: BidHistoryScalarWhereInput | BidHistoryScalarWhereInput[]
  }

  export type AuctionInsightUncheckedUpdateOneWithoutAuctionNestedInput = {
    create?: XOR<AuctionInsightCreateWithoutAuctionInput, AuctionInsightUncheckedCreateWithoutAuctionInput>
    connectOrCreate?: AuctionInsightCreateOrConnectWithoutAuctionInput
    upsert?: AuctionInsightUpsertWithoutAuctionInput
    disconnect?: AuctionInsightWhereInput | boolean
    delete?: AuctionInsightWhereInput | boolean
    connect?: AuctionInsightWhereUniqueInput
    update?: XOR<XOR<AuctionInsightUpdateToOneWithWhereWithoutAuctionInput, AuctionInsightUpdateWithoutAuctionInput>, AuctionInsightUncheckedUpdateWithoutAuctionInput>
  }

  export type JoinedAuctionUncheckedUpdateManyWithoutAuctionNestedInput = {
    create?: XOR<JoinedAuctionCreateWithoutAuctionInput, JoinedAuctionUncheckedCreateWithoutAuctionInput> | JoinedAuctionCreateWithoutAuctionInput[] | JoinedAuctionUncheckedCreateWithoutAuctionInput[]
    connectOrCreate?: JoinedAuctionCreateOrConnectWithoutAuctionInput | JoinedAuctionCreateOrConnectWithoutAuctionInput[]
    upsert?: JoinedAuctionUpsertWithWhereUniqueWithoutAuctionInput | JoinedAuctionUpsertWithWhereUniqueWithoutAuctionInput[]
    createMany?: JoinedAuctionCreateManyAuctionInputEnvelope
    set?: JoinedAuctionWhereUniqueInput | JoinedAuctionWhereUniqueInput[]
    disconnect?: JoinedAuctionWhereUniqueInput | JoinedAuctionWhereUniqueInput[]
    delete?: JoinedAuctionWhereUniqueInput | JoinedAuctionWhereUniqueInput[]
    connect?: JoinedAuctionWhereUniqueInput | JoinedAuctionWhereUniqueInput[]
    update?: JoinedAuctionUpdateWithWhereUniqueWithoutAuctionInput | JoinedAuctionUpdateWithWhereUniqueWithoutAuctionInput[]
    updateMany?: JoinedAuctionUpdateManyWithWhereWithoutAuctionInput | JoinedAuctionUpdateManyWithWhereWithoutAuctionInput[]
    deleteMany?: JoinedAuctionScalarWhereInput | JoinedAuctionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutJoinedAuctionsInput = {
    create?: XOR<UserCreateWithoutJoinedAuctionsInput, UserUncheckedCreateWithoutJoinedAuctionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutJoinedAuctionsInput
    connect?: UserWhereUniqueInput
  }

  export type AuctionCreateNestedOneWithoutJoinedAuctionsInput = {
    create?: XOR<AuctionCreateWithoutJoinedAuctionsInput, AuctionUncheckedCreateWithoutJoinedAuctionsInput>
    connectOrCreate?: AuctionCreateOrConnectWithoutJoinedAuctionsInput
    connect?: AuctionWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutJoinedAuctionsNestedInput = {
    create?: XOR<UserCreateWithoutJoinedAuctionsInput, UserUncheckedCreateWithoutJoinedAuctionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutJoinedAuctionsInput
    upsert?: UserUpsertWithoutJoinedAuctionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutJoinedAuctionsInput, UserUpdateWithoutJoinedAuctionsInput>, UserUncheckedUpdateWithoutJoinedAuctionsInput>
  }

  export type AuctionUpdateOneRequiredWithoutJoinedAuctionsNestedInput = {
    create?: XOR<AuctionCreateWithoutJoinedAuctionsInput, AuctionUncheckedCreateWithoutJoinedAuctionsInput>
    connectOrCreate?: AuctionCreateOrConnectWithoutJoinedAuctionsInput
    upsert?: AuctionUpsertWithoutJoinedAuctionsInput
    connect?: AuctionWhereUniqueInput
    update?: XOR<XOR<AuctionUpdateToOneWithWhereWithoutJoinedAuctionsInput, AuctionUpdateWithoutJoinedAuctionsInput>, AuctionUncheckedUpdateWithoutJoinedAuctionsInput>
  }

  export type AuctionCreateNestedOneWithoutCategoriesInput = {
    create?: XOR<AuctionCreateWithoutCategoriesInput, AuctionUncheckedCreateWithoutCategoriesInput>
    connectOrCreate?: AuctionCreateOrConnectWithoutCategoriesInput
    connect?: AuctionWhereUniqueInput
  }

  export type PlayerCreateNestedManyWithoutCategoryInput = {
    create?: XOR<PlayerCreateWithoutCategoryInput, PlayerUncheckedCreateWithoutCategoryInput> | PlayerCreateWithoutCategoryInput[] | PlayerUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutCategoryInput | PlayerCreateOrConnectWithoutCategoryInput[]
    createMany?: PlayerCreateManyCategoryInputEnvelope
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
  }

  export type PlayerUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<PlayerCreateWithoutCategoryInput, PlayerUncheckedCreateWithoutCategoryInput> | PlayerCreateWithoutCategoryInput[] | PlayerUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutCategoryInput | PlayerCreateOrConnectWithoutCategoryInput[]
    createMany?: PlayerCreateManyCategoryInputEnvelope
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type AuctionUpdateOneRequiredWithoutCategoriesNestedInput = {
    create?: XOR<AuctionCreateWithoutCategoriesInput, AuctionUncheckedCreateWithoutCategoriesInput>
    connectOrCreate?: AuctionCreateOrConnectWithoutCategoriesInput
    upsert?: AuctionUpsertWithoutCategoriesInput
    connect?: AuctionWhereUniqueInput
    update?: XOR<XOR<AuctionUpdateToOneWithWhereWithoutCategoriesInput, AuctionUpdateWithoutCategoriesInput>, AuctionUncheckedUpdateWithoutCategoriesInput>
  }

  export type PlayerUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<PlayerCreateWithoutCategoryInput, PlayerUncheckedCreateWithoutCategoryInput> | PlayerCreateWithoutCategoryInput[] | PlayerUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutCategoryInput | PlayerCreateOrConnectWithoutCategoryInput[]
    upsert?: PlayerUpsertWithWhereUniqueWithoutCategoryInput | PlayerUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: PlayerCreateManyCategoryInputEnvelope
    set?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    disconnect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    delete?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    update?: PlayerUpdateWithWhereUniqueWithoutCategoryInput | PlayerUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: PlayerUpdateManyWithWhereWithoutCategoryInput | PlayerUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
  }

  export type PlayerUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<PlayerCreateWithoutCategoryInput, PlayerUncheckedCreateWithoutCategoryInput> | PlayerCreateWithoutCategoryInput[] | PlayerUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutCategoryInput | PlayerCreateOrConnectWithoutCategoryInput[]
    upsert?: PlayerUpsertWithWhereUniqueWithoutCategoryInput | PlayerUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: PlayerCreateManyCategoryInputEnvelope
    set?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    disconnect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    delete?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    update?: PlayerUpdateWithWhereUniqueWithoutCategoryInput | PlayerUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: PlayerUpdateManyWithWhereWithoutCategoryInput | PlayerUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
  }

  export type AuctionCreateNestedOneWithoutTeamsInput = {
    create?: XOR<AuctionCreateWithoutTeamsInput, AuctionUncheckedCreateWithoutTeamsInput>
    connectOrCreate?: AuctionCreateOrConnectWithoutTeamsInput
    connect?: AuctionWhereUniqueInput
  }

  export type PlayerCreateNestedManyWithoutTeamInput = {
    create?: XOR<PlayerCreateWithoutTeamInput, PlayerUncheckedCreateWithoutTeamInput> | PlayerCreateWithoutTeamInput[] | PlayerUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutTeamInput | PlayerCreateOrConnectWithoutTeamInput[]
    createMany?: PlayerCreateManyTeamInputEnvelope
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
  }

  export type BidHistoryCreateNestedManyWithoutTeamInput = {
    create?: XOR<BidHistoryCreateWithoutTeamInput, BidHistoryUncheckedCreateWithoutTeamInput> | BidHistoryCreateWithoutTeamInput[] | BidHistoryUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: BidHistoryCreateOrConnectWithoutTeamInput | BidHistoryCreateOrConnectWithoutTeamInput[]
    createMany?: BidHistoryCreateManyTeamInputEnvelope
    connect?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
  }

  export type PlayerUncheckedCreateNestedManyWithoutTeamInput = {
    create?: XOR<PlayerCreateWithoutTeamInput, PlayerUncheckedCreateWithoutTeamInput> | PlayerCreateWithoutTeamInput[] | PlayerUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutTeamInput | PlayerCreateOrConnectWithoutTeamInput[]
    createMany?: PlayerCreateManyTeamInputEnvelope
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
  }

  export type BidHistoryUncheckedCreateNestedManyWithoutTeamInput = {
    create?: XOR<BidHistoryCreateWithoutTeamInput, BidHistoryUncheckedCreateWithoutTeamInput> | BidHistoryCreateWithoutTeamInput[] | BidHistoryUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: BidHistoryCreateOrConnectWithoutTeamInput | BidHistoryCreateOrConnectWithoutTeamInput[]
    createMany?: BidHistoryCreateManyTeamInputEnvelope
    connect?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
  }

  export type AuctionUpdateOneRequiredWithoutTeamsNestedInput = {
    create?: XOR<AuctionCreateWithoutTeamsInput, AuctionUncheckedCreateWithoutTeamsInput>
    connectOrCreate?: AuctionCreateOrConnectWithoutTeamsInput
    upsert?: AuctionUpsertWithoutTeamsInput
    connect?: AuctionWhereUniqueInput
    update?: XOR<XOR<AuctionUpdateToOneWithWhereWithoutTeamsInput, AuctionUpdateWithoutTeamsInput>, AuctionUncheckedUpdateWithoutTeamsInput>
  }

  export type PlayerUpdateManyWithoutTeamNestedInput = {
    create?: XOR<PlayerCreateWithoutTeamInput, PlayerUncheckedCreateWithoutTeamInput> | PlayerCreateWithoutTeamInput[] | PlayerUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutTeamInput | PlayerCreateOrConnectWithoutTeamInput[]
    upsert?: PlayerUpsertWithWhereUniqueWithoutTeamInput | PlayerUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: PlayerCreateManyTeamInputEnvelope
    set?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    disconnect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    delete?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    update?: PlayerUpdateWithWhereUniqueWithoutTeamInput | PlayerUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: PlayerUpdateManyWithWhereWithoutTeamInput | PlayerUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
  }

  export type BidHistoryUpdateManyWithoutTeamNestedInput = {
    create?: XOR<BidHistoryCreateWithoutTeamInput, BidHistoryUncheckedCreateWithoutTeamInput> | BidHistoryCreateWithoutTeamInput[] | BidHistoryUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: BidHistoryCreateOrConnectWithoutTeamInput | BidHistoryCreateOrConnectWithoutTeamInput[]
    upsert?: BidHistoryUpsertWithWhereUniqueWithoutTeamInput | BidHistoryUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: BidHistoryCreateManyTeamInputEnvelope
    set?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    disconnect?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    delete?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    connect?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    update?: BidHistoryUpdateWithWhereUniqueWithoutTeamInput | BidHistoryUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: BidHistoryUpdateManyWithWhereWithoutTeamInput | BidHistoryUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: BidHistoryScalarWhereInput | BidHistoryScalarWhereInput[]
  }

  export type PlayerUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: XOR<PlayerCreateWithoutTeamInput, PlayerUncheckedCreateWithoutTeamInput> | PlayerCreateWithoutTeamInput[] | PlayerUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutTeamInput | PlayerCreateOrConnectWithoutTeamInput[]
    upsert?: PlayerUpsertWithWhereUniqueWithoutTeamInput | PlayerUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: PlayerCreateManyTeamInputEnvelope
    set?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    disconnect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    delete?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    update?: PlayerUpdateWithWhereUniqueWithoutTeamInput | PlayerUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: PlayerUpdateManyWithWhereWithoutTeamInput | PlayerUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
  }

  export type BidHistoryUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: XOR<BidHistoryCreateWithoutTeamInput, BidHistoryUncheckedCreateWithoutTeamInput> | BidHistoryCreateWithoutTeamInput[] | BidHistoryUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: BidHistoryCreateOrConnectWithoutTeamInput | BidHistoryCreateOrConnectWithoutTeamInput[]
    upsert?: BidHistoryUpsertWithWhereUniqueWithoutTeamInput | BidHistoryUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: BidHistoryCreateManyTeamInputEnvelope
    set?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    disconnect?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    delete?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    connect?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    update?: BidHistoryUpdateWithWhereUniqueWithoutTeamInput | BidHistoryUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: BidHistoryUpdateManyWithWhereWithoutTeamInput | BidHistoryUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: BidHistoryScalarWhereInput | BidHistoryScalarWhereInput[]
  }

  export type AuctionCreateNestedOneWithoutPlayersInput = {
    create?: XOR<AuctionCreateWithoutPlayersInput, AuctionUncheckedCreateWithoutPlayersInput>
    connectOrCreate?: AuctionCreateOrConnectWithoutPlayersInput
    connect?: AuctionWhereUniqueInput
  }

  export type CategoryCreateNestedOneWithoutPlayersInput = {
    create?: XOR<CategoryCreateWithoutPlayersInput, CategoryUncheckedCreateWithoutPlayersInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutPlayersInput
    connect?: CategoryWhereUniqueInput
  }

  export type TeamCreateNestedOneWithoutPlayersInput = {
    create?: XOR<TeamCreateWithoutPlayersInput, TeamUncheckedCreateWithoutPlayersInput>
    connectOrCreate?: TeamCreateOrConnectWithoutPlayersInput
    connect?: TeamWhereUniqueInput
  }

  export type BidHistoryCreateNestedManyWithoutPlayerInput = {
    create?: XOR<BidHistoryCreateWithoutPlayerInput, BidHistoryUncheckedCreateWithoutPlayerInput> | BidHistoryCreateWithoutPlayerInput[] | BidHistoryUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: BidHistoryCreateOrConnectWithoutPlayerInput | BidHistoryCreateOrConnectWithoutPlayerInput[]
    createMany?: BidHistoryCreateManyPlayerInputEnvelope
    connect?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
  }

  export type BidHistoryUncheckedCreateNestedManyWithoutPlayerInput = {
    create?: XOR<BidHistoryCreateWithoutPlayerInput, BidHistoryUncheckedCreateWithoutPlayerInput> | BidHistoryCreateWithoutPlayerInput[] | BidHistoryUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: BidHistoryCreateOrConnectWithoutPlayerInput | BidHistoryCreateOrConnectWithoutPlayerInput[]
    createMany?: BidHistoryCreateManyPlayerInputEnvelope
    connect?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
  }

  export type EnumPlayerRoleFieldUpdateOperationsInput = {
    set?: $Enums.PlayerRole
  }

  export type EnumPlayerStatusFieldUpdateOperationsInput = {
    set?: $Enums.PlayerStatus
  }

  export type AuctionUpdateOneRequiredWithoutPlayersNestedInput = {
    create?: XOR<AuctionCreateWithoutPlayersInput, AuctionUncheckedCreateWithoutPlayersInput>
    connectOrCreate?: AuctionCreateOrConnectWithoutPlayersInput
    upsert?: AuctionUpsertWithoutPlayersInput
    connect?: AuctionWhereUniqueInput
    update?: XOR<XOR<AuctionUpdateToOneWithWhereWithoutPlayersInput, AuctionUpdateWithoutPlayersInput>, AuctionUncheckedUpdateWithoutPlayersInput>
  }

  export type CategoryUpdateOneWithoutPlayersNestedInput = {
    create?: XOR<CategoryCreateWithoutPlayersInput, CategoryUncheckedCreateWithoutPlayersInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutPlayersInput
    upsert?: CategoryUpsertWithoutPlayersInput
    disconnect?: CategoryWhereInput | boolean
    delete?: CategoryWhereInput | boolean
    connect?: CategoryWhereUniqueInput
    update?: XOR<XOR<CategoryUpdateToOneWithWhereWithoutPlayersInput, CategoryUpdateWithoutPlayersInput>, CategoryUncheckedUpdateWithoutPlayersInput>
  }

  export type TeamUpdateOneWithoutPlayersNestedInput = {
    create?: XOR<TeamCreateWithoutPlayersInput, TeamUncheckedCreateWithoutPlayersInput>
    connectOrCreate?: TeamCreateOrConnectWithoutPlayersInput
    upsert?: TeamUpsertWithoutPlayersInput
    disconnect?: TeamWhereInput | boolean
    delete?: TeamWhereInput | boolean
    connect?: TeamWhereUniqueInput
    update?: XOR<XOR<TeamUpdateToOneWithWhereWithoutPlayersInput, TeamUpdateWithoutPlayersInput>, TeamUncheckedUpdateWithoutPlayersInput>
  }

  export type BidHistoryUpdateManyWithoutPlayerNestedInput = {
    create?: XOR<BidHistoryCreateWithoutPlayerInput, BidHistoryUncheckedCreateWithoutPlayerInput> | BidHistoryCreateWithoutPlayerInput[] | BidHistoryUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: BidHistoryCreateOrConnectWithoutPlayerInput | BidHistoryCreateOrConnectWithoutPlayerInput[]
    upsert?: BidHistoryUpsertWithWhereUniqueWithoutPlayerInput | BidHistoryUpsertWithWhereUniqueWithoutPlayerInput[]
    createMany?: BidHistoryCreateManyPlayerInputEnvelope
    set?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    disconnect?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    delete?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    connect?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    update?: BidHistoryUpdateWithWhereUniqueWithoutPlayerInput | BidHistoryUpdateWithWhereUniqueWithoutPlayerInput[]
    updateMany?: BidHistoryUpdateManyWithWhereWithoutPlayerInput | BidHistoryUpdateManyWithWhereWithoutPlayerInput[]
    deleteMany?: BidHistoryScalarWhereInput | BidHistoryScalarWhereInput[]
  }

  export type BidHistoryUncheckedUpdateManyWithoutPlayerNestedInput = {
    create?: XOR<BidHistoryCreateWithoutPlayerInput, BidHistoryUncheckedCreateWithoutPlayerInput> | BidHistoryCreateWithoutPlayerInput[] | BidHistoryUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: BidHistoryCreateOrConnectWithoutPlayerInput | BidHistoryCreateOrConnectWithoutPlayerInput[]
    upsert?: BidHistoryUpsertWithWhereUniqueWithoutPlayerInput | BidHistoryUpsertWithWhereUniqueWithoutPlayerInput[]
    createMany?: BidHistoryCreateManyPlayerInputEnvelope
    set?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    disconnect?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    delete?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    connect?: BidHistoryWhereUniqueInput | BidHistoryWhereUniqueInput[]
    update?: BidHistoryUpdateWithWhereUniqueWithoutPlayerInput | BidHistoryUpdateWithWhereUniqueWithoutPlayerInput[]
    updateMany?: BidHistoryUpdateManyWithWhereWithoutPlayerInput | BidHistoryUpdateManyWithWhereWithoutPlayerInput[]
    deleteMany?: BidHistoryScalarWhereInput | BidHistoryScalarWhereInput[]
  }

  export type PlayerCreateNestedOneWithoutBidHistoryInput = {
    create?: XOR<PlayerCreateWithoutBidHistoryInput, PlayerUncheckedCreateWithoutBidHistoryInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutBidHistoryInput
    connect?: PlayerWhereUniqueInput
  }

  export type AuctionCreateNestedOneWithoutBidhistoriesInput = {
    create?: XOR<AuctionCreateWithoutBidhistoriesInput, AuctionUncheckedCreateWithoutBidhistoriesInput>
    connectOrCreate?: AuctionCreateOrConnectWithoutBidhistoriesInput
    connect?: AuctionWhereUniqueInput
  }

  export type TeamCreateNestedOneWithoutBidHistoriesInput = {
    create?: XOR<TeamCreateWithoutBidHistoriesInput, TeamUncheckedCreateWithoutBidHistoriesInput>
    connectOrCreate?: TeamCreateOrConnectWithoutBidHistoriesInput
    connect?: TeamWhereUniqueInput
  }

  export type PlayerUpdateOneRequiredWithoutBidHistoryNestedInput = {
    create?: XOR<PlayerCreateWithoutBidHistoryInput, PlayerUncheckedCreateWithoutBidHistoryInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutBidHistoryInput
    upsert?: PlayerUpsertWithoutBidHistoryInput
    connect?: PlayerWhereUniqueInput
    update?: XOR<XOR<PlayerUpdateToOneWithWhereWithoutBidHistoryInput, PlayerUpdateWithoutBidHistoryInput>, PlayerUncheckedUpdateWithoutBidHistoryInput>
  }

  export type AuctionUpdateOneRequiredWithoutBidhistoriesNestedInput = {
    create?: XOR<AuctionCreateWithoutBidhistoriesInput, AuctionUncheckedCreateWithoutBidhistoriesInput>
    connectOrCreate?: AuctionCreateOrConnectWithoutBidhistoriesInput
    upsert?: AuctionUpsertWithoutBidhistoriesInput
    connect?: AuctionWhereUniqueInput
    update?: XOR<XOR<AuctionUpdateToOneWithWhereWithoutBidhistoriesInput, AuctionUpdateWithoutBidhistoriesInput>, AuctionUncheckedUpdateWithoutBidhistoriesInput>
  }

  export type TeamUpdateOneRequiredWithoutBidHistoriesNestedInput = {
    create?: XOR<TeamCreateWithoutBidHistoriesInput, TeamUncheckedCreateWithoutBidHistoriesInput>
    connectOrCreate?: TeamCreateOrConnectWithoutBidHistoriesInput
    upsert?: TeamUpsertWithoutBidHistoriesInput
    connect?: TeamWhereUniqueInput
    update?: XOR<XOR<TeamUpdateToOneWithWhereWithoutBidHistoriesInput, TeamUpdateWithoutBidHistoriesInput>, TeamUncheckedUpdateWithoutBidHistoriesInput>
  }

  export type UserCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAuditLogsNestedInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    upsert?: UserUpsertWithoutAuditLogsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAuditLogsInput, UserUpdateWithoutAuditLogsInput>, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type UserCreateNestedOneWithoutFeedbackInput = {
    create?: XOR<UserCreateWithoutFeedbackInput, UserUncheckedCreateWithoutFeedbackInput>
    connectOrCreate?: UserCreateOrConnectWithoutFeedbackInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutFeedbackNestedInput = {
    create?: XOR<UserCreateWithoutFeedbackInput, UserUncheckedCreateWithoutFeedbackInput>
    connectOrCreate?: UserCreateOrConnectWithoutFeedbackInput
    upsert?: UserUpsertWithoutFeedbackInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFeedbackInput, UserUpdateWithoutFeedbackInput>, UserUncheckedUpdateWithoutFeedbackInput>
  }

  export type AuctionCreateNestedOneWithoutAuctionInsightInput = {
    create?: XOR<AuctionCreateWithoutAuctionInsightInput, AuctionUncheckedCreateWithoutAuctionInsightInput>
    connectOrCreate?: AuctionCreateOrConnectWithoutAuctionInsightInput
    connect?: AuctionWhereUniqueInput
  }

  export type AuctionUpdateOneRequiredWithoutAuctionInsightNestedInput = {
    create?: XOR<AuctionCreateWithoutAuctionInsightInput, AuctionUncheckedCreateWithoutAuctionInsightInput>
    connectOrCreate?: AuctionCreateOrConnectWithoutAuctionInsightInput
    upsert?: AuctionUpsertWithoutAuctionInsightInput
    connect?: AuctionWhereUniqueInput
    update?: XOR<XOR<AuctionUpdateToOneWithWhereWithoutAuctionInsightInput, AuctionUpdateWithoutAuctionInsightInput>, AuctionUncheckedUpdateWithoutAuctionInsightInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumPlanTierFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanTier | EnumPlanTierFieldRefInput<$PrismaModel>
    in?: $Enums.PlanTier[] | ListEnumPlanTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanTier[] | ListEnumPlanTierFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanTierFilter<$PrismaModel> | $Enums.PlanTier
  }

  export type NestedEnumAuctionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AuctionStatus | EnumAuctionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AuctionStatus[] | ListEnumAuctionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuctionStatus[] | ListEnumAuctionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAuctionStatusFilter<$PrismaModel> | $Enums.AuctionStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumPlanTierWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanTier | EnumPlanTierFieldRefInput<$PrismaModel>
    in?: $Enums.PlanTier[] | ListEnumPlanTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanTier[] | ListEnumPlanTierFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanTierWithAggregatesFilter<$PrismaModel> | $Enums.PlanTier
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlanTierFilter<$PrismaModel>
    _max?: NestedEnumPlanTierFilter<$PrismaModel>
  }

  export type NestedEnumAuctionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuctionStatus | EnumAuctionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AuctionStatus[] | ListEnumAuctionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuctionStatus[] | ListEnumAuctionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAuctionStatusWithAggregatesFilter<$PrismaModel> | $Enums.AuctionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuctionStatusFilter<$PrismaModel>
    _max?: NestedEnumAuctionStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedEnumPlayerRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerRole | EnumPlayerRoleFieldRefInput<$PrismaModel>
    in?: $Enums.PlayerRole[] | ListEnumPlayerRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlayerRole[] | ListEnumPlayerRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumPlayerRoleFilter<$PrismaModel> | $Enums.PlayerRole
  }

  export type NestedEnumPlayerStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerStatus | EnumPlayerStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlayerStatus[] | ListEnumPlayerStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlayerStatus[] | ListEnumPlayerStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPlayerStatusFilter<$PrismaModel> | $Enums.PlayerStatus
  }

  export type NestedEnumPlayerRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerRole | EnumPlayerRoleFieldRefInput<$PrismaModel>
    in?: $Enums.PlayerRole[] | ListEnumPlayerRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlayerRole[] | ListEnumPlayerRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumPlayerRoleWithAggregatesFilter<$PrismaModel> | $Enums.PlayerRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlayerRoleFilter<$PrismaModel>
    _max?: NestedEnumPlayerRoleFilter<$PrismaModel>
  }

  export type NestedEnumPlayerStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerStatus | EnumPlayerStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlayerStatus[] | ListEnumPlayerStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlayerStatus[] | ListEnumPlayerStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPlayerStatusWithAggregatesFilter<$PrismaModel> | $Enums.PlayerStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlayerStatusFilter<$PrismaModel>
    _max?: NestedEnumPlayerStatusFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AuctionCreateWithoutOrganizerInput = {
    id?: string
    auctionCode?: string
    name: string
    location?: string | null
    logo?: string | null
    sportsType?: string
    season?: string | null
    auctionDate: Date | string
    auctionStartTime?: string | null
    budgetPerTeam?: Decimal | DecimalJsLike | number | string
    minBid?: Decimal | DecimalJsLike | number | string
    bidIncrease?: Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: number
    maxPlayersPerTeam?: number
    isBoosterEnabled?: boolean
    boosterAmount?: number | null
    boosterTriggerPlayerCount?: number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: $Enums.PlanTier
    isPaid?: boolean
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null
    razorpaySignature?: string | null
    status?: $Enums.AuctionStatus
    liveTheme?: string
    soldEffect?: string
    overlayTheme?: string
    overlayLayout?: string
    createdAt?: Date | string
    ArchivedAt?: Date | string | null
    teams?: TeamCreateNestedManyWithoutAuctionInput
    players?: PlayerCreateNestedManyWithoutAuctionInput
    categories?: CategoryCreateNestedManyWithoutAuctionInput
    bidhistories?: BidHistoryCreateNestedManyWithoutAuctionInput
    AuctionInsight?: AuctionInsightCreateNestedOneWithoutAuctionInput
    joinedAuctions?: JoinedAuctionCreateNestedManyWithoutAuctionInput
  }

  export type AuctionUncheckedCreateWithoutOrganizerInput = {
    id?: string
    auctionCode?: string
    name: string
    location?: string | null
    logo?: string | null
    sportsType?: string
    season?: string | null
    auctionDate: Date | string
    auctionStartTime?: string | null
    budgetPerTeam?: Decimal | DecimalJsLike | number | string
    minBid?: Decimal | DecimalJsLike | number | string
    bidIncrease?: Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: number
    maxPlayersPerTeam?: number
    isBoosterEnabled?: boolean
    boosterAmount?: number | null
    boosterTriggerPlayerCount?: number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: $Enums.PlanTier
    isPaid?: boolean
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null
    razorpaySignature?: string | null
    status?: $Enums.AuctionStatus
    liveTheme?: string
    soldEffect?: string
    overlayTheme?: string
    overlayLayout?: string
    createdAt?: Date | string
    ArchivedAt?: Date | string | null
    teams?: TeamUncheckedCreateNestedManyWithoutAuctionInput
    players?: PlayerUncheckedCreateNestedManyWithoutAuctionInput
    categories?: CategoryUncheckedCreateNestedManyWithoutAuctionInput
    bidhistories?: BidHistoryUncheckedCreateNestedManyWithoutAuctionInput
    AuctionInsight?: AuctionInsightUncheckedCreateNestedOneWithoutAuctionInput
    joinedAuctions?: JoinedAuctionUncheckedCreateNestedManyWithoutAuctionInput
  }

  export type AuctionCreateOrConnectWithoutOrganizerInput = {
    where: AuctionWhereUniqueInput
    create: XOR<AuctionCreateWithoutOrganizerInput, AuctionUncheckedCreateWithoutOrganizerInput>
  }

  export type AuctionCreateManyOrganizerInputEnvelope = {
    data: AuctionCreateManyOrganizerInput | AuctionCreateManyOrganizerInput[]
    skipDuplicates?: boolean
  }

  export type JoinedAuctionCreateWithoutUserInput = {
    id?: string
    joinedAt?: Date | string
    auction: AuctionCreateNestedOneWithoutJoinedAuctionsInput
  }

  export type JoinedAuctionUncheckedCreateWithoutUserInput = {
    id?: string
    auctionId: string
    joinedAt?: Date | string
  }

  export type JoinedAuctionCreateOrConnectWithoutUserInput = {
    where: JoinedAuctionWhereUniqueInput
    create: XOR<JoinedAuctionCreateWithoutUserInput, JoinedAuctionUncheckedCreateWithoutUserInput>
  }

  export type JoinedAuctionCreateManyUserInputEnvelope = {
    data: JoinedAuctionCreateManyUserInput | JoinedAuctionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AuditLogCreateWithoutUserInput = {
    id?: string
    action: string
    endpoint: string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUncheckedCreateWithoutUserInput = {
    id?: string
    action: string
    endpoint: string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type AuditLogCreateOrConnectWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogCreateManyUserInputEnvelope = {
    data: AuditLogCreateManyUserInput | AuditLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type FeedbackCreateWithoutUserInput = {
    id?: string
    rating: number
    message?: string | null
    createdAt?: Date | string
  }

  export type FeedbackUncheckedCreateWithoutUserInput = {
    id?: string
    rating: number
    message?: string | null
    createdAt?: Date | string
  }

  export type FeedbackCreateOrConnectWithoutUserInput = {
    where: FeedbackWhereUniqueInput
    create: XOR<FeedbackCreateWithoutUserInput, FeedbackUncheckedCreateWithoutUserInput>
  }

  export type AuctionUpsertWithWhereUniqueWithoutOrganizerInput = {
    where: AuctionWhereUniqueInput
    update: XOR<AuctionUpdateWithoutOrganizerInput, AuctionUncheckedUpdateWithoutOrganizerInput>
    create: XOR<AuctionCreateWithoutOrganizerInput, AuctionUncheckedCreateWithoutOrganizerInput>
  }

  export type AuctionUpdateWithWhereUniqueWithoutOrganizerInput = {
    where: AuctionWhereUniqueInput
    data: XOR<AuctionUpdateWithoutOrganizerInput, AuctionUncheckedUpdateWithoutOrganizerInput>
  }

  export type AuctionUpdateManyWithWhereWithoutOrganizerInput = {
    where: AuctionScalarWhereInput
    data: XOR<AuctionUpdateManyMutationInput, AuctionUncheckedUpdateManyWithoutOrganizerInput>
  }

  export type AuctionScalarWhereInput = {
    AND?: AuctionScalarWhereInput | AuctionScalarWhereInput[]
    OR?: AuctionScalarWhereInput[]
    NOT?: AuctionScalarWhereInput | AuctionScalarWhereInput[]
    id?: StringFilter<"Auction"> | string
    auctionCode?: StringFilter<"Auction"> | string
    organizerId?: StringFilter<"Auction"> | string
    name?: StringFilter<"Auction"> | string
    location?: StringNullableFilter<"Auction"> | string | null
    logo?: StringNullableFilter<"Auction"> | string | null
    sportsType?: StringFilter<"Auction"> | string
    season?: StringNullableFilter<"Auction"> | string | null
    auctionDate?: DateTimeFilter<"Auction"> | Date | string
    auctionStartTime?: StringNullableFilter<"Auction"> | string | null
    budgetPerTeam?: DecimalFilter<"Auction"> | Decimal | DecimalJsLike | number | string
    minBid?: DecimalFilter<"Auction"> | Decimal | DecimalJsLike | number | string
    bidIncrease?: DecimalFilter<"Auction"> | Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: IntFilter<"Auction"> | number
    maxPlayersPerTeam?: IntFilter<"Auction"> | number
    isBoosterEnabled?: BoolFilter<"Auction"> | boolean
    boosterAmount?: IntNullableFilter<"Auction"> | number | null
    boosterTriggerPlayerCount?: IntNullableFilter<"Auction"> | number | null
    bidRules?: JsonNullableFilter<"Auction">
    planTier?: EnumPlanTierFilter<"Auction"> | $Enums.PlanTier
    isPaid?: BoolFilter<"Auction"> | boolean
    razorpayOrderId?: StringNullableFilter<"Auction"> | string | null
    razorpayPaymentId?: StringNullableFilter<"Auction"> | string | null
    razorpaySignature?: StringNullableFilter<"Auction"> | string | null
    status?: EnumAuctionStatusFilter<"Auction"> | $Enums.AuctionStatus
    liveTheme?: StringFilter<"Auction"> | string
    soldEffect?: StringFilter<"Auction"> | string
    overlayTheme?: StringFilter<"Auction"> | string
    overlayLayout?: StringFilter<"Auction"> | string
    createdAt?: DateTimeFilter<"Auction"> | Date | string
    ArchivedAt?: DateTimeNullableFilter<"Auction"> | Date | string | null
  }

  export type JoinedAuctionUpsertWithWhereUniqueWithoutUserInput = {
    where: JoinedAuctionWhereUniqueInput
    update: XOR<JoinedAuctionUpdateWithoutUserInput, JoinedAuctionUncheckedUpdateWithoutUserInput>
    create: XOR<JoinedAuctionCreateWithoutUserInput, JoinedAuctionUncheckedCreateWithoutUserInput>
  }

  export type JoinedAuctionUpdateWithWhereUniqueWithoutUserInput = {
    where: JoinedAuctionWhereUniqueInput
    data: XOR<JoinedAuctionUpdateWithoutUserInput, JoinedAuctionUncheckedUpdateWithoutUserInput>
  }

  export type JoinedAuctionUpdateManyWithWhereWithoutUserInput = {
    where: JoinedAuctionScalarWhereInput
    data: XOR<JoinedAuctionUpdateManyMutationInput, JoinedAuctionUncheckedUpdateManyWithoutUserInput>
  }

  export type JoinedAuctionScalarWhereInput = {
    AND?: JoinedAuctionScalarWhereInput | JoinedAuctionScalarWhereInput[]
    OR?: JoinedAuctionScalarWhereInput[]
    NOT?: JoinedAuctionScalarWhereInput | JoinedAuctionScalarWhereInput[]
    id?: StringFilter<"JoinedAuction"> | string
    userId?: StringFilter<"JoinedAuction"> | string
    auctionId?: StringFilter<"JoinedAuction"> | string
    joinedAt?: DateTimeFilter<"JoinedAuction"> | Date | string
  }

  export type AuditLogUpsertWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutUserInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutUserInput>
  }

  export type AuditLogScalarWhereInput = {
    AND?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    OR?: AuditLogScalarWhereInput[]
    NOT?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    userId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    endpoint?: StringFilter<"AuditLog"> | string
    details?: JsonNullableFilter<"AuditLog">
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type FeedbackUpsertWithoutUserInput = {
    update: XOR<FeedbackUpdateWithoutUserInput, FeedbackUncheckedUpdateWithoutUserInput>
    create: XOR<FeedbackCreateWithoutUserInput, FeedbackUncheckedCreateWithoutUserInput>
    where?: FeedbackWhereInput
  }

  export type FeedbackUpdateToOneWithWhereWithoutUserInput = {
    where?: FeedbackWhereInput
    data: XOR<FeedbackUpdateWithoutUserInput, FeedbackUncheckedUpdateWithoutUserInput>
  }

  export type FeedbackUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    message?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeedbackUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    message?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutAuctionsInput = {
    id?: string
    firebaseUid: string
    name: string
    email: string
    role?: $Enums.Role
    password?: string | null
    mobile?: string | null
    city?: string | null
    profileUrl?: string | null
    createdAt?: Date | string
    stripeCustomerId?: string | null
    joinedAuctions?: JoinedAuctionCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    feedback?: FeedbackCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAuctionsInput = {
    id?: string
    firebaseUid: string
    name: string
    email: string
    role?: $Enums.Role
    password?: string | null
    mobile?: string | null
    city?: string | null
    profileUrl?: string | null
    createdAt?: Date | string
    stripeCustomerId?: string | null
    joinedAuctions?: JoinedAuctionUncheckedCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    feedback?: FeedbackUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAuctionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAuctionsInput, UserUncheckedCreateWithoutAuctionsInput>
  }

  export type TeamCreateWithoutAuctionInput = {
    id?: string
    name: string
    shortName: string
    shortcutKey?: string | null
    logo?: string | null
    originalPurse: Decimal | DecimalJsLike | number | string
    purseSpent?: Decimal | DecimalJsLike | number | string
    playersCount?: number
    players?: PlayerCreateNestedManyWithoutTeamInput
    bidHistories?: BidHistoryCreateNestedManyWithoutTeamInput
  }

  export type TeamUncheckedCreateWithoutAuctionInput = {
    id?: string
    name: string
    shortName: string
    shortcutKey?: string | null
    logo?: string | null
    originalPurse: Decimal | DecimalJsLike | number | string
    purseSpent?: Decimal | DecimalJsLike | number | string
    playersCount?: number
    players?: PlayerUncheckedCreateNestedManyWithoutTeamInput
    bidHistories?: BidHistoryUncheckedCreateNestedManyWithoutTeamInput
  }

  export type TeamCreateOrConnectWithoutAuctionInput = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutAuctionInput, TeamUncheckedCreateWithoutAuctionInput>
  }

  export type TeamCreateManyAuctionInputEnvelope = {
    data: TeamCreateManyAuctionInput | TeamCreateManyAuctionInput[]
    skipDuplicates?: boolean
  }

  export type PlayerCreateWithoutAuctionInput = {
    id?: string
    name: string
    mobile?: string | null
    age: number
    fatherName?: string | null
    profilePic?: string | null
    role?: $Enums.PlayerRole
    battingStyle?: string | null
    bowlingStyle?: string | null
    tshirtSize?: string | null
    trouserSize?: string | null
    jerseyName?: string | null
    jerseyNumber?: number | null
    status?: $Enums.PlayerStatus
    basePrice?: Decimal | DecimalJsLike | number | string | null
    soldPrice?: Decimal | DecimalJsLike | number | string | null
    category?: CategoryCreateNestedOneWithoutPlayersInput
    team?: TeamCreateNestedOneWithoutPlayersInput
    bidHistory?: BidHistoryCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUncheckedCreateWithoutAuctionInput = {
    id?: string
    categoryId?: string | null
    name: string
    mobile?: string | null
    age: number
    fatherName?: string | null
    profilePic?: string | null
    role?: $Enums.PlayerRole
    battingStyle?: string | null
    bowlingStyle?: string | null
    tshirtSize?: string | null
    trouserSize?: string | null
    jerseyName?: string | null
    jerseyNumber?: number | null
    status?: $Enums.PlayerStatus
    basePrice?: Decimal | DecimalJsLike | number | string | null
    teamId?: string | null
    soldPrice?: Decimal | DecimalJsLike | number | string | null
    bidHistory?: BidHistoryUncheckedCreateNestedManyWithoutPlayerInput
  }

  export type PlayerCreateOrConnectWithoutAuctionInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutAuctionInput, PlayerUncheckedCreateWithoutAuctionInput>
  }

  export type PlayerCreateManyAuctionInputEnvelope = {
    data: PlayerCreateManyAuctionInput | PlayerCreateManyAuctionInput[]
    skipDuplicates?: boolean
  }

  export type CategoryCreateWithoutAuctionInput = {
    id?: string
    name: string
    color?: string | null
    baseBid?: Decimal | DecimalJsLike | number | string | null
    minIncrement?: Decimal | DecimalJsLike | number | string | null
    maxPlayersPerTeam?: number | null
    minPlayersPerTeam?: number | null
    players?: PlayerCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUncheckedCreateWithoutAuctionInput = {
    id?: string
    name: string
    color?: string | null
    baseBid?: Decimal | DecimalJsLike | number | string | null
    minIncrement?: Decimal | DecimalJsLike | number | string | null
    maxPlayersPerTeam?: number | null
    minPlayersPerTeam?: number | null
    players?: PlayerUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type CategoryCreateOrConnectWithoutAuctionInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutAuctionInput, CategoryUncheckedCreateWithoutAuctionInput>
  }

  export type CategoryCreateManyAuctionInputEnvelope = {
    data: CategoryCreateManyAuctionInput | CategoryCreateManyAuctionInput[]
    skipDuplicates?: boolean
  }

  export type BidHistoryCreateWithoutAuctionInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    timestamp?: Date | string
    player: PlayerCreateNestedOneWithoutBidHistoryInput
    team: TeamCreateNestedOneWithoutBidHistoriesInput
  }

  export type BidHistoryUncheckedCreateWithoutAuctionInput = {
    id?: string
    playerId: string
    teamId: string
    amount: Decimal | DecimalJsLike | number | string
    timestamp?: Date | string
  }

  export type BidHistoryCreateOrConnectWithoutAuctionInput = {
    where: BidHistoryWhereUniqueInput
    create: XOR<BidHistoryCreateWithoutAuctionInput, BidHistoryUncheckedCreateWithoutAuctionInput>
  }

  export type BidHistoryCreateManyAuctionInputEnvelope = {
    data: BidHistoryCreateManyAuctionInput | BidHistoryCreateManyAuctionInput[]
    skipDuplicates?: boolean
  }

  export type AuctionInsightCreateWithoutAuctionInput = {
    id?: string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuctionInsightUncheckedCreateWithoutAuctionInput = {
    id?: string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuctionInsightCreateOrConnectWithoutAuctionInput = {
    where: AuctionInsightWhereUniqueInput
    create: XOR<AuctionInsightCreateWithoutAuctionInput, AuctionInsightUncheckedCreateWithoutAuctionInput>
  }

  export type JoinedAuctionCreateWithoutAuctionInput = {
    id?: string
    joinedAt?: Date | string
    user: UserCreateNestedOneWithoutJoinedAuctionsInput
  }

  export type JoinedAuctionUncheckedCreateWithoutAuctionInput = {
    id?: string
    userId: string
    joinedAt?: Date | string
  }

  export type JoinedAuctionCreateOrConnectWithoutAuctionInput = {
    where: JoinedAuctionWhereUniqueInput
    create: XOR<JoinedAuctionCreateWithoutAuctionInput, JoinedAuctionUncheckedCreateWithoutAuctionInput>
  }

  export type JoinedAuctionCreateManyAuctionInputEnvelope = {
    data: JoinedAuctionCreateManyAuctionInput | JoinedAuctionCreateManyAuctionInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutAuctionsInput = {
    update: XOR<UserUpdateWithoutAuctionsInput, UserUncheckedUpdateWithoutAuctionsInput>
    create: XOR<UserCreateWithoutAuctionsInput, UserUncheckedCreateWithoutAuctionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAuctionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAuctionsInput, UserUncheckedUpdateWithoutAuctionsInput>
  }

  export type UserUpdateWithoutAuctionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    password?: NullableStringFieldUpdateOperationsInput | string | null
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    profileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    joinedAuctions?: JoinedAuctionUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    feedback?: FeedbackUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAuctionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    password?: NullableStringFieldUpdateOperationsInput | string | null
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    profileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    joinedAuctions?: JoinedAuctionUncheckedUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    feedback?: FeedbackUncheckedUpdateOneWithoutUserNestedInput
  }

  export type TeamUpsertWithWhereUniqueWithoutAuctionInput = {
    where: TeamWhereUniqueInput
    update: XOR<TeamUpdateWithoutAuctionInput, TeamUncheckedUpdateWithoutAuctionInput>
    create: XOR<TeamCreateWithoutAuctionInput, TeamUncheckedCreateWithoutAuctionInput>
  }

  export type TeamUpdateWithWhereUniqueWithoutAuctionInput = {
    where: TeamWhereUniqueInput
    data: XOR<TeamUpdateWithoutAuctionInput, TeamUncheckedUpdateWithoutAuctionInput>
  }

  export type TeamUpdateManyWithWhereWithoutAuctionInput = {
    where: TeamScalarWhereInput
    data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyWithoutAuctionInput>
  }

  export type TeamScalarWhereInput = {
    AND?: TeamScalarWhereInput | TeamScalarWhereInput[]
    OR?: TeamScalarWhereInput[]
    NOT?: TeamScalarWhereInput | TeamScalarWhereInput[]
    id?: StringFilter<"Team"> | string
    auctionId?: StringFilter<"Team"> | string
    name?: StringFilter<"Team"> | string
    shortName?: StringFilter<"Team"> | string
    shortcutKey?: StringNullableFilter<"Team"> | string | null
    logo?: StringNullableFilter<"Team"> | string | null
    originalPurse?: DecimalFilter<"Team"> | Decimal | DecimalJsLike | number | string
    purseSpent?: DecimalFilter<"Team"> | Decimal | DecimalJsLike | number | string
    playersCount?: IntFilter<"Team"> | number
  }

  export type PlayerUpsertWithWhereUniqueWithoutAuctionInput = {
    where: PlayerWhereUniqueInput
    update: XOR<PlayerUpdateWithoutAuctionInput, PlayerUncheckedUpdateWithoutAuctionInput>
    create: XOR<PlayerCreateWithoutAuctionInput, PlayerUncheckedCreateWithoutAuctionInput>
  }

  export type PlayerUpdateWithWhereUniqueWithoutAuctionInput = {
    where: PlayerWhereUniqueInput
    data: XOR<PlayerUpdateWithoutAuctionInput, PlayerUncheckedUpdateWithoutAuctionInput>
  }

  export type PlayerUpdateManyWithWhereWithoutAuctionInput = {
    where: PlayerScalarWhereInput
    data: XOR<PlayerUpdateManyMutationInput, PlayerUncheckedUpdateManyWithoutAuctionInput>
  }

  export type PlayerScalarWhereInput = {
    AND?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
    OR?: PlayerScalarWhereInput[]
    NOT?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
    id?: StringFilter<"Player"> | string
    auctionId?: StringFilter<"Player"> | string
    categoryId?: StringNullableFilter<"Player"> | string | null
    name?: StringFilter<"Player"> | string
    mobile?: StringNullableFilter<"Player"> | string | null
    age?: IntFilter<"Player"> | number
    fatherName?: StringNullableFilter<"Player"> | string | null
    profilePic?: StringNullableFilter<"Player"> | string | null
    role?: EnumPlayerRoleFilter<"Player"> | $Enums.PlayerRole
    battingStyle?: StringNullableFilter<"Player"> | string | null
    bowlingStyle?: StringNullableFilter<"Player"> | string | null
    tshirtSize?: StringNullableFilter<"Player"> | string | null
    trouserSize?: StringNullableFilter<"Player"> | string | null
    jerseyName?: StringNullableFilter<"Player"> | string | null
    jerseyNumber?: IntNullableFilter<"Player"> | number | null
    status?: EnumPlayerStatusFilter<"Player"> | $Enums.PlayerStatus
    basePrice?: DecimalNullableFilter<"Player"> | Decimal | DecimalJsLike | number | string | null
    teamId?: StringNullableFilter<"Player"> | string | null
    soldPrice?: DecimalNullableFilter<"Player"> | Decimal | DecimalJsLike | number | string | null
  }

  export type CategoryUpsertWithWhereUniqueWithoutAuctionInput = {
    where: CategoryWhereUniqueInput
    update: XOR<CategoryUpdateWithoutAuctionInput, CategoryUncheckedUpdateWithoutAuctionInput>
    create: XOR<CategoryCreateWithoutAuctionInput, CategoryUncheckedCreateWithoutAuctionInput>
  }

  export type CategoryUpdateWithWhereUniqueWithoutAuctionInput = {
    where: CategoryWhereUniqueInput
    data: XOR<CategoryUpdateWithoutAuctionInput, CategoryUncheckedUpdateWithoutAuctionInput>
  }

  export type CategoryUpdateManyWithWhereWithoutAuctionInput = {
    where: CategoryScalarWhereInput
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyWithoutAuctionInput>
  }

  export type CategoryScalarWhereInput = {
    AND?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
    OR?: CategoryScalarWhereInput[]
    NOT?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
    id?: StringFilter<"Category"> | string
    auctionId?: StringFilter<"Category"> | string
    name?: StringFilter<"Category"> | string
    color?: StringNullableFilter<"Category"> | string | null
    baseBid?: DecimalNullableFilter<"Category"> | Decimal | DecimalJsLike | number | string | null
    minIncrement?: DecimalNullableFilter<"Category"> | Decimal | DecimalJsLike | number | string | null
    maxPlayersPerTeam?: IntNullableFilter<"Category"> | number | null
    minPlayersPerTeam?: IntNullableFilter<"Category"> | number | null
  }

  export type BidHistoryUpsertWithWhereUniqueWithoutAuctionInput = {
    where: BidHistoryWhereUniqueInput
    update: XOR<BidHistoryUpdateWithoutAuctionInput, BidHistoryUncheckedUpdateWithoutAuctionInput>
    create: XOR<BidHistoryCreateWithoutAuctionInput, BidHistoryUncheckedCreateWithoutAuctionInput>
  }

  export type BidHistoryUpdateWithWhereUniqueWithoutAuctionInput = {
    where: BidHistoryWhereUniqueInput
    data: XOR<BidHistoryUpdateWithoutAuctionInput, BidHistoryUncheckedUpdateWithoutAuctionInput>
  }

  export type BidHistoryUpdateManyWithWhereWithoutAuctionInput = {
    where: BidHistoryScalarWhereInput
    data: XOR<BidHistoryUpdateManyMutationInput, BidHistoryUncheckedUpdateManyWithoutAuctionInput>
  }

  export type BidHistoryScalarWhereInput = {
    AND?: BidHistoryScalarWhereInput | BidHistoryScalarWhereInput[]
    OR?: BidHistoryScalarWhereInput[]
    NOT?: BidHistoryScalarWhereInput | BidHistoryScalarWhereInput[]
    id?: StringFilter<"BidHistory"> | string
    playerId?: StringFilter<"BidHistory"> | string
    auctionId?: StringFilter<"BidHistory"> | string
    teamId?: StringFilter<"BidHistory"> | string
    amount?: DecimalFilter<"BidHistory"> | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFilter<"BidHistory"> | Date | string
  }

  export type AuctionInsightUpsertWithoutAuctionInput = {
    update: XOR<AuctionInsightUpdateWithoutAuctionInput, AuctionInsightUncheckedUpdateWithoutAuctionInput>
    create: XOR<AuctionInsightCreateWithoutAuctionInput, AuctionInsightUncheckedCreateWithoutAuctionInput>
    where?: AuctionInsightWhereInput
  }

  export type AuctionInsightUpdateToOneWithWhereWithoutAuctionInput = {
    where?: AuctionInsightWhereInput
    data: XOR<AuctionInsightUpdateWithoutAuctionInput, AuctionInsightUncheckedUpdateWithoutAuctionInput>
  }

  export type AuctionInsightUpdateWithoutAuctionInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuctionInsightUncheckedUpdateWithoutAuctionInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JoinedAuctionUpsertWithWhereUniqueWithoutAuctionInput = {
    where: JoinedAuctionWhereUniqueInput
    update: XOR<JoinedAuctionUpdateWithoutAuctionInput, JoinedAuctionUncheckedUpdateWithoutAuctionInput>
    create: XOR<JoinedAuctionCreateWithoutAuctionInput, JoinedAuctionUncheckedCreateWithoutAuctionInput>
  }

  export type JoinedAuctionUpdateWithWhereUniqueWithoutAuctionInput = {
    where: JoinedAuctionWhereUniqueInput
    data: XOR<JoinedAuctionUpdateWithoutAuctionInput, JoinedAuctionUncheckedUpdateWithoutAuctionInput>
  }

  export type JoinedAuctionUpdateManyWithWhereWithoutAuctionInput = {
    where: JoinedAuctionScalarWhereInput
    data: XOR<JoinedAuctionUpdateManyMutationInput, JoinedAuctionUncheckedUpdateManyWithoutAuctionInput>
  }

  export type UserCreateWithoutJoinedAuctionsInput = {
    id?: string
    firebaseUid: string
    name: string
    email: string
    role?: $Enums.Role
    password?: string | null
    mobile?: string | null
    city?: string | null
    profileUrl?: string | null
    createdAt?: Date | string
    stripeCustomerId?: string | null
    auctions?: AuctionCreateNestedManyWithoutOrganizerInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    feedback?: FeedbackCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutJoinedAuctionsInput = {
    id?: string
    firebaseUid: string
    name: string
    email: string
    role?: $Enums.Role
    password?: string | null
    mobile?: string | null
    city?: string | null
    profileUrl?: string | null
    createdAt?: Date | string
    stripeCustomerId?: string | null
    auctions?: AuctionUncheckedCreateNestedManyWithoutOrganizerInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    feedback?: FeedbackUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutJoinedAuctionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutJoinedAuctionsInput, UserUncheckedCreateWithoutJoinedAuctionsInput>
  }

  export type AuctionCreateWithoutJoinedAuctionsInput = {
    id?: string
    auctionCode?: string
    name: string
    location?: string | null
    logo?: string | null
    sportsType?: string
    season?: string | null
    auctionDate: Date | string
    auctionStartTime?: string | null
    budgetPerTeam?: Decimal | DecimalJsLike | number | string
    minBid?: Decimal | DecimalJsLike | number | string
    bidIncrease?: Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: number
    maxPlayersPerTeam?: number
    isBoosterEnabled?: boolean
    boosterAmount?: number | null
    boosterTriggerPlayerCount?: number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: $Enums.PlanTier
    isPaid?: boolean
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null
    razorpaySignature?: string | null
    status?: $Enums.AuctionStatus
    liveTheme?: string
    soldEffect?: string
    overlayTheme?: string
    overlayLayout?: string
    createdAt?: Date | string
    ArchivedAt?: Date | string | null
    organizer: UserCreateNestedOneWithoutAuctionsInput
    teams?: TeamCreateNestedManyWithoutAuctionInput
    players?: PlayerCreateNestedManyWithoutAuctionInput
    categories?: CategoryCreateNestedManyWithoutAuctionInput
    bidhistories?: BidHistoryCreateNestedManyWithoutAuctionInput
    AuctionInsight?: AuctionInsightCreateNestedOneWithoutAuctionInput
  }

  export type AuctionUncheckedCreateWithoutJoinedAuctionsInput = {
    id?: string
    auctionCode?: string
    organizerId: string
    name: string
    location?: string | null
    logo?: string | null
    sportsType?: string
    season?: string | null
    auctionDate: Date | string
    auctionStartTime?: string | null
    budgetPerTeam?: Decimal | DecimalJsLike | number | string
    minBid?: Decimal | DecimalJsLike | number | string
    bidIncrease?: Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: number
    maxPlayersPerTeam?: number
    isBoosterEnabled?: boolean
    boosterAmount?: number | null
    boosterTriggerPlayerCount?: number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: $Enums.PlanTier
    isPaid?: boolean
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null
    razorpaySignature?: string | null
    status?: $Enums.AuctionStatus
    liveTheme?: string
    soldEffect?: string
    overlayTheme?: string
    overlayLayout?: string
    createdAt?: Date | string
    ArchivedAt?: Date | string | null
    teams?: TeamUncheckedCreateNestedManyWithoutAuctionInput
    players?: PlayerUncheckedCreateNestedManyWithoutAuctionInput
    categories?: CategoryUncheckedCreateNestedManyWithoutAuctionInput
    bidhistories?: BidHistoryUncheckedCreateNestedManyWithoutAuctionInput
    AuctionInsight?: AuctionInsightUncheckedCreateNestedOneWithoutAuctionInput
  }

  export type AuctionCreateOrConnectWithoutJoinedAuctionsInput = {
    where: AuctionWhereUniqueInput
    create: XOR<AuctionCreateWithoutJoinedAuctionsInput, AuctionUncheckedCreateWithoutJoinedAuctionsInput>
  }

  export type UserUpsertWithoutJoinedAuctionsInput = {
    update: XOR<UserUpdateWithoutJoinedAuctionsInput, UserUncheckedUpdateWithoutJoinedAuctionsInput>
    create: XOR<UserCreateWithoutJoinedAuctionsInput, UserUncheckedCreateWithoutJoinedAuctionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutJoinedAuctionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutJoinedAuctionsInput, UserUncheckedUpdateWithoutJoinedAuctionsInput>
  }

  export type UserUpdateWithoutJoinedAuctionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    password?: NullableStringFieldUpdateOperationsInput | string | null
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    profileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    auctions?: AuctionUpdateManyWithoutOrganizerNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    feedback?: FeedbackUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutJoinedAuctionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    password?: NullableStringFieldUpdateOperationsInput | string | null
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    profileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    auctions?: AuctionUncheckedUpdateManyWithoutOrganizerNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    feedback?: FeedbackUncheckedUpdateOneWithoutUserNestedInput
  }

  export type AuctionUpsertWithoutJoinedAuctionsInput = {
    update: XOR<AuctionUpdateWithoutJoinedAuctionsInput, AuctionUncheckedUpdateWithoutJoinedAuctionsInput>
    create: XOR<AuctionCreateWithoutJoinedAuctionsInput, AuctionUncheckedCreateWithoutJoinedAuctionsInput>
    where?: AuctionWhereInput
  }

  export type AuctionUpdateToOneWithWhereWithoutJoinedAuctionsInput = {
    where?: AuctionWhereInput
    data: XOR<AuctionUpdateWithoutJoinedAuctionsInput, AuctionUncheckedUpdateWithoutJoinedAuctionsInput>
  }

  export type AuctionUpdateWithoutJoinedAuctionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionCode?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    sportsType?: StringFieldUpdateOperationsInput | string
    season?: NullableStringFieldUpdateOperationsInput | string | null
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    auctionStartTime?: NullableStringFieldUpdateOperationsInput | string | null
    budgetPerTeam?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minBid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bidIncrease?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    maxPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    isBoosterEnabled?: BoolFieldUpdateOperationsInput | boolean
    boosterAmount?: NullableIntFieldUpdateOperationsInput | number | null
    boosterTriggerPlayerCount?: NullableIntFieldUpdateOperationsInput | number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: EnumPlanTierFieldUpdateOperationsInput | $Enums.PlanTier
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    razorpayOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpaySignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAuctionStatusFieldUpdateOperationsInput | $Enums.AuctionStatus
    liveTheme?: StringFieldUpdateOperationsInput | string
    soldEffect?: StringFieldUpdateOperationsInput | string
    overlayTheme?: StringFieldUpdateOperationsInput | string
    overlayLayout?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ArchivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organizer?: UserUpdateOneRequiredWithoutAuctionsNestedInput
    teams?: TeamUpdateManyWithoutAuctionNestedInput
    players?: PlayerUpdateManyWithoutAuctionNestedInput
    categories?: CategoryUpdateManyWithoutAuctionNestedInput
    bidhistories?: BidHistoryUpdateManyWithoutAuctionNestedInput
    AuctionInsight?: AuctionInsightUpdateOneWithoutAuctionNestedInput
  }

  export type AuctionUncheckedUpdateWithoutJoinedAuctionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionCode?: StringFieldUpdateOperationsInput | string
    organizerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    sportsType?: StringFieldUpdateOperationsInput | string
    season?: NullableStringFieldUpdateOperationsInput | string | null
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    auctionStartTime?: NullableStringFieldUpdateOperationsInput | string | null
    budgetPerTeam?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minBid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bidIncrease?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    maxPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    isBoosterEnabled?: BoolFieldUpdateOperationsInput | boolean
    boosterAmount?: NullableIntFieldUpdateOperationsInput | number | null
    boosterTriggerPlayerCount?: NullableIntFieldUpdateOperationsInput | number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: EnumPlanTierFieldUpdateOperationsInput | $Enums.PlanTier
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    razorpayOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpaySignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAuctionStatusFieldUpdateOperationsInput | $Enums.AuctionStatus
    liveTheme?: StringFieldUpdateOperationsInput | string
    soldEffect?: StringFieldUpdateOperationsInput | string
    overlayTheme?: StringFieldUpdateOperationsInput | string
    overlayLayout?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ArchivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    teams?: TeamUncheckedUpdateManyWithoutAuctionNestedInput
    players?: PlayerUncheckedUpdateManyWithoutAuctionNestedInput
    categories?: CategoryUncheckedUpdateManyWithoutAuctionNestedInput
    bidhistories?: BidHistoryUncheckedUpdateManyWithoutAuctionNestedInput
    AuctionInsight?: AuctionInsightUncheckedUpdateOneWithoutAuctionNestedInput
  }

  export type AuctionCreateWithoutCategoriesInput = {
    id?: string
    auctionCode?: string
    name: string
    location?: string | null
    logo?: string | null
    sportsType?: string
    season?: string | null
    auctionDate: Date | string
    auctionStartTime?: string | null
    budgetPerTeam?: Decimal | DecimalJsLike | number | string
    minBid?: Decimal | DecimalJsLike | number | string
    bidIncrease?: Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: number
    maxPlayersPerTeam?: number
    isBoosterEnabled?: boolean
    boosterAmount?: number | null
    boosterTriggerPlayerCount?: number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: $Enums.PlanTier
    isPaid?: boolean
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null
    razorpaySignature?: string | null
    status?: $Enums.AuctionStatus
    liveTheme?: string
    soldEffect?: string
    overlayTheme?: string
    overlayLayout?: string
    createdAt?: Date | string
    ArchivedAt?: Date | string | null
    organizer: UserCreateNestedOneWithoutAuctionsInput
    teams?: TeamCreateNestedManyWithoutAuctionInput
    players?: PlayerCreateNestedManyWithoutAuctionInput
    bidhistories?: BidHistoryCreateNestedManyWithoutAuctionInput
    AuctionInsight?: AuctionInsightCreateNestedOneWithoutAuctionInput
    joinedAuctions?: JoinedAuctionCreateNestedManyWithoutAuctionInput
  }

  export type AuctionUncheckedCreateWithoutCategoriesInput = {
    id?: string
    auctionCode?: string
    organizerId: string
    name: string
    location?: string | null
    logo?: string | null
    sportsType?: string
    season?: string | null
    auctionDate: Date | string
    auctionStartTime?: string | null
    budgetPerTeam?: Decimal | DecimalJsLike | number | string
    minBid?: Decimal | DecimalJsLike | number | string
    bidIncrease?: Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: number
    maxPlayersPerTeam?: number
    isBoosterEnabled?: boolean
    boosterAmount?: number | null
    boosterTriggerPlayerCount?: number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: $Enums.PlanTier
    isPaid?: boolean
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null
    razorpaySignature?: string | null
    status?: $Enums.AuctionStatus
    liveTheme?: string
    soldEffect?: string
    overlayTheme?: string
    overlayLayout?: string
    createdAt?: Date | string
    ArchivedAt?: Date | string | null
    teams?: TeamUncheckedCreateNestedManyWithoutAuctionInput
    players?: PlayerUncheckedCreateNestedManyWithoutAuctionInput
    bidhistories?: BidHistoryUncheckedCreateNestedManyWithoutAuctionInput
    AuctionInsight?: AuctionInsightUncheckedCreateNestedOneWithoutAuctionInput
    joinedAuctions?: JoinedAuctionUncheckedCreateNestedManyWithoutAuctionInput
  }

  export type AuctionCreateOrConnectWithoutCategoriesInput = {
    where: AuctionWhereUniqueInput
    create: XOR<AuctionCreateWithoutCategoriesInput, AuctionUncheckedCreateWithoutCategoriesInput>
  }

  export type PlayerCreateWithoutCategoryInput = {
    id?: string
    name: string
    mobile?: string | null
    age: number
    fatherName?: string | null
    profilePic?: string | null
    role?: $Enums.PlayerRole
    battingStyle?: string | null
    bowlingStyle?: string | null
    tshirtSize?: string | null
    trouserSize?: string | null
    jerseyName?: string | null
    jerseyNumber?: number | null
    status?: $Enums.PlayerStatus
    basePrice?: Decimal | DecimalJsLike | number | string | null
    soldPrice?: Decimal | DecimalJsLike | number | string | null
    auction: AuctionCreateNestedOneWithoutPlayersInput
    team?: TeamCreateNestedOneWithoutPlayersInput
    bidHistory?: BidHistoryCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUncheckedCreateWithoutCategoryInput = {
    id?: string
    auctionId: string
    name: string
    mobile?: string | null
    age: number
    fatherName?: string | null
    profilePic?: string | null
    role?: $Enums.PlayerRole
    battingStyle?: string | null
    bowlingStyle?: string | null
    tshirtSize?: string | null
    trouserSize?: string | null
    jerseyName?: string | null
    jerseyNumber?: number | null
    status?: $Enums.PlayerStatus
    basePrice?: Decimal | DecimalJsLike | number | string | null
    teamId?: string | null
    soldPrice?: Decimal | DecimalJsLike | number | string | null
    bidHistory?: BidHistoryUncheckedCreateNestedManyWithoutPlayerInput
  }

  export type PlayerCreateOrConnectWithoutCategoryInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutCategoryInput, PlayerUncheckedCreateWithoutCategoryInput>
  }

  export type PlayerCreateManyCategoryInputEnvelope = {
    data: PlayerCreateManyCategoryInput | PlayerCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type AuctionUpsertWithoutCategoriesInput = {
    update: XOR<AuctionUpdateWithoutCategoriesInput, AuctionUncheckedUpdateWithoutCategoriesInput>
    create: XOR<AuctionCreateWithoutCategoriesInput, AuctionUncheckedCreateWithoutCategoriesInput>
    where?: AuctionWhereInput
  }

  export type AuctionUpdateToOneWithWhereWithoutCategoriesInput = {
    where?: AuctionWhereInput
    data: XOR<AuctionUpdateWithoutCategoriesInput, AuctionUncheckedUpdateWithoutCategoriesInput>
  }

  export type AuctionUpdateWithoutCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionCode?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    sportsType?: StringFieldUpdateOperationsInput | string
    season?: NullableStringFieldUpdateOperationsInput | string | null
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    auctionStartTime?: NullableStringFieldUpdateOperationsInput | string | null
    budgetPerTeam?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minBid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bidIncrease?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    maxPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    isBoosterEnabled?: BoolFieldUpdateOperationsInput | boolean
    boosterAmount?: NullableIntFieldUpdateOperationsInput | number | null
    boosterTriggerPlayerCount?: NullableIntFieldUpdateOperationsInput | number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: EnumPlanTierFieldUpdateOperationsInput | $Enums.PlanTier
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    razorpayOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpaySignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAuctionStatusFieldUpdateOperationsInput | $Enums.AuctionStatus
    liveTheme?: StringFieldUpdateOperationsInput | string
    soldEffect?: StringFieldUpdateOperationsInput | string
    overlayTheme?: StringFieldUpdateOperationsInput | string
    overlayLayout?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ArchivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organizer?: UserUpdateOneRequiredWithoutAuctionsNestedInput
    teams?: TeamUpdateManyWithoutAuctionNestedInput
    players?: PlayerUpdateManyWithoutAuctionNestedInput
    bidhistories?: BidHistoryUpdateManyWithoutAuctionNestedInput
    AuctionInsight?: AuctionInsightUpdateOneWithoutAuctionNestedInput
    joinedAuctions?: JoinedAuctionUpdateManyWithoutAuctionNestedInput
  }

  export type AuctionUncheckedUpdateWithoutCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionCode?: StringFieldUpdateOperationsInput | string
    organizerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    sportsType?: StringFieldUpdateOperationsInput | string
    season?: NullableStringFieldUpdateOperationsInput | string | null
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    auctionStartTime?: NullableStringFieldUpdateOperationsInput | string | null
    budgetPerTeam?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minBid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bidIncrease?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    maxPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    isBoosterEnabled?: BoolFieldUpdateOperationsInput | boolean
    boosterAmount?: NullableIntFieldUpdateOperationsInput | number | null
    boosterTriggerPlayerCount?: NullableIntFieldUpdateOperationsInput | number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: EnumPlanTierFieldUpdateOperationsInput | $Enums.PlanTier
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    razorpayOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpaySignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAuctionStatusFieldUpdateOperationsInput | $Enums.AuctionStatus
    liveTheme?: StringFieldUpdateOperationsInput | string
    soldEffect?: StringFieldUpdateOperationsInput | string
    overlayTheme?: StringFieldUpdateOperationsInput | string
    overlayLayout?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ArchivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    teams?: TeamUncheckedUpdateManyWithoutAuctionNestedInput
    players?: PlayerUncheckedUpdateManyWithoutAuctionNestedInput
    bidhistories?: BidHistoryUncheckedUpdateManyWithoutAuctionNestedInput
    AuctionInsight?: AuctionInsightUncheckedUpdateOneWithoutAuctionNestedInput
    joinedAuctions?: JoinedAuctionUncheckedUpdateManyWithoutAuctionNestedInput
  }

  export type PlayerUpsertWithWhereUniqueWithoutCategoryInput = {
    where: PlayerWhereUniqueInput
    update: XOR<PlayerUpdateWithoutCategoryInput, PlayerUncheckedUpdateWithoutCategoryInput>
    create: XOR<PlayerCreateWithoutCategoryInput, PlayerUncheckedCreateWithoutCategoryInput>
  }

  export type PlayerUpdateWithWhereUniqueWithoutCategoryInput = {
    where: PlayerWhereUniqueInput
    data: XOR<PlayerUpdateWithoutCategoryInput, PlayerUncheckedUpdateWithoutCategoryInput>
  }

  export type PlayerUpdateManyWithWhereWithoutCategoryInput = {
    where: PlayerScalarWhereInput
    data: XOR<PlayerUpdateManyMutationInput, PlayerUncheckedUpdateManyWithoutCategoryInput>
  }

  export type AuctionCreateWithoutTeamsInput = {
    id?: string
    auctionCode?: string
    name: string
    location?: string | null
    logo?: string | null
    sportsType?: string
    season?: string | null
    auctionDate: Date | string
    auctionStartTime?: string | null
    budgetPerTeam?: Decimal | DecimalJsLike | number | string
    minBid?: Decimal | DecimalJsLike | number | string
    bidIncrease?: Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: number
    maxPlayersPerTeam?: number
    isBoosterEnabled?: boolean
    boosterAmount?: number | null
    boosterTriggerPlayerCount?: number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: $Enums.PlanTier
    isPaid?: boolean
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null
    razorpaySignature?: string | null
    status?: $Enums.AuctionStatus
    liveTheme?: string
    soldEffect?: string
    overlayTheme?: string
    overlayLayout?: string
    createdAt?: Date | string
    ArchivedAt?: Date | string | null
    organizer: UserCreateNestedOneWithoutAuctionsInput
    players?: PlayerCreateNestedManyWithoutAuctionInput
    categories?: CategoryCreateNestedManyWithoutAuctionInput
    bidhistories?: BidHistoryCreateNestedManyWithoutAuctionInput
    AuctionInsight?: AuctionInsightCreateNestedOneWithoutAuctionInput
    joinedAuctions?: JoinedAuctionCreateNestedManyWithoutAuctionInput
  }

  export type AuctionUncheckedCreateWithoutTeamsInput = {
    id?: string
    auctionCode?: string
    organizerId: string
    name: string
    location?: string | null
    logo?: string | null
    sportsType?: string
    season?: string | null
    auctionDate: Date | string
    auctionStartTime?: string | null
    budgetPerTeam?: Decimal | DecimalJsLike | number | string
    minBid?: Decimal | DecimalJsLike | number | string
    bidIncrease?: Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: number
    maxPlayersPerTeam?: number
    isBoosterEnabled?: boolean
    boosterAmount?: number | null
    boosterTriggerPlayerCount?: number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: $Enums.PlanTier
    isPaid?: boolean
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null
    razorpaySignature?: string | null
    status?: $Enums.AuctionStatus
    liveTheme?: string
    soldEffect?: string
    overlayTheme?: string
    overlayLayout?: string
    createdAt?: Date | string
    ArchivedAt?: Date | string | null
    players?: PlayerUncheckedCreateNestedManyWithoutAuctionInput
    categories?: CategoryUncheckedCreateNestedManyWithoutAuctionInput
    bidhistories?: BidHistoryUncheckedCreateNestedManyWithoutAuctionInput
    AuctionInsight?: AuctionInsightUncheckedCreateNestedOneWithoutAuctionInput
    joinedAuctions?: JoinedAuctionUncheckedCreateNestedManyWithoutAuctionInput
  }

  export type AuctionCreateOrConnectWithoutTeamsInput = {
    where: AuctionWhereUniqueInput
    create: XOR<AuctionCreateWithoutTeamsInput, AuctionUncheckedCreateWithoutTeamsInput>
  }

  export type PlayerCreateWithoutTeamInput = {
    id?: string
    name: string
    mobile?: string | null
    age: number
    fatherName?: string | null
    profilePic?: string | null
    role?: $Enums.PlayerRole
    battingStyle?: string | null
    bowlingStyle?: string | null
    tshirtSize?: string | null
    trouserSize?: string | null
    jerseyName?: string | null
    jerseyNumber?: number | null
    status?: $Enums.PlayerStatus
    basePrice?: Decimal | DecimalJsLike | number | string | null
    soldPrice?: Decimal | DecimalJsLike | number | string | null
    auction: AuctionCreateNestedOneWithoutPlayersInput
    category?: CategoryCreateNestedOneWithoutPlayersInput
    bidHistory?: BidHistoryCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUncheckedCreateWithoutTeamInput = {
    id?: string
    auctionId: string
    categoryId?: string | null
    name: string
    mobile?: string | null
    age: number
    fatherName?: string | null
    profilePic?: string | null
    role?: $Enums.PlayerRole
    battingStyle?: string | null
    bowlingStyle?: string | null
    tshirtSize?: string | null
    trouserSize?: string | null
    jerseyName?: string | null
    jerseyNumber?: number | null
    status?: $Enums.PlayerStatus
    basePrice?: Decimal | DecimalJsLike | number | string | null
    soldPrice?: Decimal | DecimalJsLike | number | string | null
    bidHistory?: BidHistoryUncheckedCreateNestedManyWithoutPlayerInput
  }

  export type PlayerCreateOrConnectWithoutTeamInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutTeamInput, PlayerUncheckedCreateWithoutTeamInput>
  }

  export type PlayerCreateManyTeamInputEnvelope = {
    data: PlayerCreateManyTeamInput | PlayerCreateManyTeamInput[]
    skipDuplicates?: boolean
  }

  export type BidHistoryCreateWithoutTeamInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    timestamp?: Date | string
    player: PlayerCreateNestedOneWithoutBidHistoryInput
    auction: AuctionCreateNestedOneWithoutBidhistoriesInput
  }

  export type BidHistoryUncheckedCreateWithoutTeamInput = {
    id?: string
    playerId: string
    auctionId: string
    amount: Decimal | DecimalJsLike | number | string
    timestamp?: Date | string
  }

  export type BidHistoryCreateOrConnectWithoutTeamInput = {
    where: BidHistoryWhereUniqueInput
    create: XOR<BidHistoryCreateWithoutTeamInput, BidHistoryUncheckedCreateWithoutTeamInput>
  }

  export type BidHistoryCreateManyTeamInputEnvelope = {
    data: BidHistoryCreateManyTeamInput | BidHistoryCreateManyTeamInput[]
    skipDuplicates?: boolean
  }

  export type AuctionUpsertWithoutTeamsInput = {
    update: XOR<AuctionUpdateWithoutTeamsInput, AuctionUncheckedUpdateWithoutTeamsInput>
    create: XOR<AuctionCreateWithoutTeamsInput, AuctionUncheckedCreateWithoutTeamsInput>
    where?: AuctionWhereInput
  }

  export type AuctionUpdateToOneWithWhereWithoutTeamsInput = {
    where?: AuctionWhereInput
    data: XOR<AuctionUpdateWithoutTeamsInput, AuctionUncheckedUpdateWithoutTeamsInput>
  }

  export type AuctionUpdateWithoutTeamsInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionCode?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    sportsType?: StringFieldUpdateOperationsInput | string
    season?: NullableStringFieldUpdateOperationsInput | string | null
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    auctionStartTime?: NullableStringFieldUpdateOperationsInput | string | null
    budgetPerTeam?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minBid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bidIncrease?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    maxPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    isBoosterEnabled?: BoolFieldUpdateOperationsInput | boolean
    boosterAmount?: NullableIntFieldUpdateOperationsInput | number | null
    boosterTriggerPlayerCount?: NullableIntFieldUpdateOperationsInput | number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: EnumPlanTierFieldUpdateOperationsInput | $Enums.PlanTier
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    razorpayOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpaySignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAuctionStatusFieldUpdateOperationsInput | $Enums.AuctionStatus
    liveTheme?: StringFieldUpdateOperationsInput | string
    soldEffect?: StringFieldUpdateOperationsInput | string
    overlayTheme?: StringFieldUpdateOperationsInput | string
    overlayLayout?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ArchivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organizer?: UserUpdateOneRequiredWithoutAuctionsNestedInput
    players?: PlayerUpdateManyWithoutAuctionNestedInput
    categories?: CategoryUpdateManyWithoutAuctionNestedInput
    bidhistories?: BidHistoryUpdateManyWithoutAuctionNestedInput
    AuctionInsight?: AuctionInsightUpdateOneWithoutAuctionNestedInput
    joinedAuctions?: JoinedAuctionUpdateManyWithoutAuctionNestedInput
  }

  export type AuctionUncheckedUpdateWithoutTeamsInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionCode?: StringFieldUpdateOperationsInput | string
    organizerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    sportsType?: StringFieldUpdateOperationsInput | string
    season?: NullableStringFieldUpdateOperationsInput | string | null
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    auctionStartTime?: NullableStringFieldUpdateOperationsInput | string | null
    budgetPerTeam?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minBid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bidIncrease?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    maxPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    isBoosterEnabled?: BoolFieldUpdateOperationsInput | boolean
    boosterAmount?: NullableIntFieldUpdateOperationsInput | number | null
    boosterTriggerPlayerCount?: NullableIntFieldUpdateOperationsInput | number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: EnumPlanTierFieldUpdateOperationsInput | $Enums.PlanTier
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    razorpayOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpaySignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAuctionStatusFieldUpdateOperationsInput | $Enums.AuctionStatus
    liveTheme?: StringFieldUpdateOperationsInput | string
    soldEffect?: StringFieldUpdateOperationsInput | string
    overlayTheme?: StringFieldUpdateOperationsInput | string
    overlayLayout?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ArchivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    players?: PlayerUncheckedUpdateManyWithoutAuctionNestedInput
    categories?: CategoryUncheckedUpdateManyWithoutAuctionNestedInput
    bidhistories?: BidHistoryUncheckedUpdateManyWithoutAuctionNestedInput
    AuctionInsight?: AuctionInsightUncheckedUpdateOneWithoutAuctionNestedInput
    joinedAuctions?: JoinedAuctionUncheckedUpdateManyWithoutAuctionNestedInput
  }

  export type PlayerUpsertWithWhereUniqueWithoutTeamInput = {
    where: PlayerWhereUniqueInput
    update: XOR<PlayerUpdateWithoutTeamInput, PlayerUncheckedUpdateWithoutTeamInput>
    create: XOR<PlayerCreateWithoutTeamInput, PlayerUncheckedCreateWithoutTeamInput>
  }

  export type PlayerUpdateWithWhereUniqueWithoutTeamInput = {
    where: PlayerWhereUniqueInput
    data: XOR<PlayerUpdateWithoutTeamInput, PlayerUncheckedUpdateWithoutTeamInput>
  }

  export type PlayerUpdateManyWithWhereWithoutTeamInput = {
    where: PlayerScalarWhereInput
    data: XOR<PlayerUpdateManyMutationInput, PlayerUncheckedUpdateManyWithoutTeamInput>
  }

  export type BidHistoryUpsertWithWhereUniqueWithoutTeamInput = {
    where: BidHistoryWhereUniqueInput
    update: XOR<BidHistoryUpdateWithoutTeamInput, BidHistoryUncheckedUpdateWithoutTeamInput>
    create: XOR<BidHistoryCreateWithoutTeamInput, BidHistoryUncheckedCreateWithoutTeamInput>
  }

  export type BidHistoryUpdateWithWhereUniqueWithoutTeamInput = {
    where: BidHistoryWhereUniqueInput
    data: XOR<BidHistoryUpdateWithoutTeamInput, BidHistoryUncheckedUpdateWithoutTeamInput>
  }

  export type BidHistoryUpdateManyWithWhereWithoutTeamInput = {
    where: BidHistoryScalarWhereInput
    data: XOR<BidHistoryUpdateManyMutationInput, BidHistoryUncheckedUpdateManyWithoutTeamInput>
  }

  export type AuctionCreateWithoutPlayersInput = {
    id?: string
    auctionCode?: string
    name: string
    location?: string | null
    logo?: string | null
    sportsType?: string
    season?: string | null
    auctionDate: Date | string
    auctionStartTime?: string | null
    budgetPerTeam?: Decimal | DecimalJsLike | number | string
    minBid?: Decimal | DecimalJsLike | number | string
    bidIncrease?: Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: number
    maxPlayersPerTeam?: number
    isBoosterEnabled?: boolean
    boosterAmount?: number | null
    boosterTriggerPlayerCount?: number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: $Enums.PlanTier
    isPaid?: boolean
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null
    razorpaySignature?: string | null
    status?: $Enums.AuctionStatus
    liveTheme?: string
    soldEffect?: string
    overlayTheme?: string
    overlayLayout?: string
    createdAt?: Date | string
    ArchivedAt?: Date | string | null
    organizer: UserCreateNestedOneWithoutAuctionsInput
    teams?: TeamCreateNestedManyWithoutAuctionInput
    categories?: CategoryCreateNestedManyWithoutAuctionInput
    bidhistories?: BidHistoryCreateNestedManyWithoutAuctionInput
    AuctionInsight?: AuctionInsightCreateNestedOneWithoutAuctionInput
    joinedAuctions?: JoinedAuctionCreateNestedManyWithoutAuctionInput
  }

  export type AuctionUncheckedCreateWithoutPlayersInput = {
    id?: string
    auctionCode?: string
    organizerId: string
    name: string
    location?: string | null
    logo?: string | null
    sportsType?: string
    season?: string | null
    auctionDate: Date | string
    auctionStartTime?: string | null
    budgetPerTeam?: Decimal | DecimalJsLike | number | string
    minBid?: Decimal | DecimalJsLike | number | string
    bidIncrease?: Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: number
    maxPlayersPerTeam?: number
    isBoosterEnabled?: boolean
    boosterAmount?: number | null
    boosterTriggerPlayerCount?: number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: $Enums.PlanTier
    isPaid?: boolean
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null
    razorpaySignature?: string | null
    status?: $Enums.AuctionStatus
    liveTheme?: string
    soldEffect?: string
    overlayTheme?: string
    overlayLayout?: string
    createdAt?: Date | string
    ArchivedAt?: Date | string | null
    teams?: TeamUncheckedCreateNestedManyWithoutAuctionInput
    categories?: CategoryUncheckedCreateNestedManyWithoutAuctionInput
    bidhistories?: BidHistoryUncheckedCreateNestedManyWithoutAuctionInput
    AuctionInsight?: AuctionInsightUncheckedCreateNestedOneWithoutAuctionInput
    joinedAuctions?: JoinedAuctionUncheckedCreateNestedManyWithoutAuctionInput
  }

  export type AuctionCreateOrConnectWithoutPlayersInput = {
    where: AuctionWhereUniqueInput
    create: XOR<AuctionCreateWithoutPlayersInput, AuctionUncheckedCreateWithoutPlayersInput>
  }

  export type CategoryCreateWithoutPlayersInput = {
    id?: string
    name: string
    color?: string | null
    baseBid?: Decimal | DecimalJsLike | number | string | null
    minIncrement?: Decimal | DecimalJsLike | number | string | null
    maxPlayersPerTeam?: number | null
    minPlayersPerTeam?: number | null
    auction: AuctionCreateNestedOneWithoutCategoriesInput
  }

  export type CategoryUncheckedCreateWithoutPlayersInput = {
    id?: string
    auctionId: string
    name: string
    color?: string | null
    baseBid?: Decimal | DecimalJsLike | number | string | null
    minIncrement?: Decimal | DecimalJsLike | number | string | null
    maxPlayersPerTeam?: number | null
    minPlayersPerTeam?: number | null
  }

  export type CategoryCreateOrConnectWithoutPlayersInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutPlayersInput, CategoryUncheckedCreateWithoutPlayersInput>
  }

  export type TeamCreateWithoutPlayersInput = {
    id?: string
    name: string
    shortName: string
    shortcutKey?: string | null
    logo?: string | null
    originalPurse: Decimal | DecimalJsLike | number | string
    purseSpent?: Decimal | DecimalJsLike | number | string
    playersCount?: number
    auction: AuctionCreateNestedOneWithoutTeamsInput
    bidHistories?: BidHistoryCreateNestedManyWithoutTeamInput
  }

  export type TeamUncheckedCreateWithoutPlayersInput = {
    id?: string
    auctionId: string
    name: string
    shortName: string
    shortcutKey?: string | null
    logo?: string | null
    originalPurse: Decimal | DecimalJsLike | number | string
    purseSpent?: Decimal | DecimalJsLike | number | string
    playersCount?: number
    bidHistories?: BidHistoryUncheckedCreateNestedManyWithoutTeamInput
  }

  export type TeamCreateOrConnectWithoutPlayersInput = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutPlayersInput, TeamUncheckedCreateWithoutPlayersInput>
  }

  export type BidHistoryCreateWithoutPlayerInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    timestamp?: Date | string
    auction: AuctionCreateNestedOneWithoutBidhistoriesInput
    team: TeamCreateNestedOneWithoutBidHistoriesInput
  }

  export type BidHistoryUncheckedCreateWithoutPlayerInput = {
    id?: string
    auctionId: string
    teamId: string
    amount: Decimal | DecimalJsLike | number | string
    timestamp?: Date | string
  }

  export type BidHistoryCreateOrConnectWithoutPlayerInput = {
    where: BidHistoryWhereUniqueInput
    create: XOR<BidHistoryCreateWithoutPlayerInput, BidHistoryUncheckedCreateWithoutPlayerInput>
  }

  export type BidHistoryCreateManyPlayerInputEnvelope = {
    data: BidHistoryCreateManyPlayerInput | BidHistoryCreateManyPlayerInput[]
    skipDuplicates?: boolean
  }

  export type AuctionUpsertWithoutPlayersInput = {
    update: XOR<AuctionUpdateWithoutPlayersInput, AuctionUncheckedUpdateWithoutPlayersInput>
    create: XOR<AuctionCreateWithoutPlayersInput, AuctionUncheckedCreateWithoutPlayersInput>
    where?: AuctionWhereInput
  }

  export type AuctionUpdateToOneWithWhereWithoutPlayersInput = {
    where?: AuctionWhereInput
    data: XOR<AuctionUpdateWithoutPlayersInput, AuctionUncheckedUpdateWithoutPlayersInput>
  }

  export type AuctionUpdateWithoutPlayersInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionCode?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    sportsType?: StringFieldUpdateOperationsInput | string
    season?: NullableStringFieldUpdateOperationsInput | string | null
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    auctionStartTime?: NullableStringFieldUpdateOperationsInput | string | null
    budgetPerTeam?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minBid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bidIncrease?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    maxPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    isBoosterEnabled?: BoolFieldUpdateOperationsInput | boolean
    boosterAmount?: NullableIntFieldUpdateOperationsInput | number | null
    boosterTriggerPlayerCount?: NullableIntFieldUpdateOperationsInput | number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: EnumPlanTierFieldUpdateOperationsInput | $Enums.PlanTier
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    razorpayOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpaySignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAuctionStatusFieldUpdateOperationsInput | $Enums.AuctionStatus
    liveTheme?: StringFieldUpdateOperationsInput | string
    soldEffect?: StringFieldUpdateOperationsInput | string
    overlayTheme?: StringFieldUpdateOperationsInput | string
    overlayLayout?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ArchivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organizer?: UserUpdateOneRequiredWithoutAuctionsNestedInput
    teams?: TeamUpdateManyWithoutAuctionNestedInput
    categories?: CategoryUpdateManyWithoutAuctionNestedInput
    bidhistories?: BidHistoryUpdateManyWithoutAuctionNestedInput
    AuctionInsight?: AuctionInsightUpdateOneWithoutAuctionNestedInput
    joinedAuctions?: JoinedAuctionUpdateManyWithoutAuctionNestedInput
  }

  export type AuctionUncheckedUpdateWithoutPlayersInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionCode?: StringFieldUpdateOperationsInput | string
    organizerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    sportsType?: StringFieldUpdateOperationsInput | string
    season?: NullableStringFieldUpdateOperationsInput | string | null
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    auctionStartTime?: NullableStringFieldUpdateOperationsInput | string | null
    budgetPerTeam?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minBid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bidIncrease?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    maxPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    isBoosterEnabled?: BoolFieldUpdateOperationsInput | boolean
    boosterAmount?: NullableIntFieldUpdateOperationsInput | number | null
    boosterTriggerPlayerCount?: NullableIntFieldUpdateOperationsInput | number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: EnumPlanTierFieldUpdateOperationsInput | $Enums.PlanTier
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    razorpayOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpaySignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAuctionStatusFieldUpdateOperationsInput | $Enums.AuctionStatus
    liveTheme?: StringFieldUpdateOperationsInput | string
    soldEffect?: StringFieldUpdateOperationsInput | string
    overlayTheme?: StringFieldUpdateOperationsInput | string
    overlayLayout?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ArchivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    teams?: TeamUncheckedUpdateManyWithoutAuctionNestedInput
    categories?: CategoryUncheckedUpdateManyWithoutAuctionNestedInput
    bidhistories?: BidHistoryUncheckedUpdateManyWithoutAuctionNestedInput
    AuctionInsight?: AuctionInsightUncheckedUpdateOneWithoutAuctionNestedInput
    joinedAuctions?: JoinedAuctionUncheckedUpdateManyWithoutAuctionNestedInput
  }

  export type CategoryUpsertWithoutPlayersInput = {
    update: XOR<CategoryUpdateWithoutPlayersInput, CategoryUncheckedUpdateWithoutPlayersInput>
    create: XOR<CategoryCreateWithoutPlayersInput, CategoryUncheckedCreateWithoutPlayersInput>
    where?: CategoryWhereInput
  }

  export type CategoryUpdateToOneWithWhereWithoutPlayersInput = {
    where?: CategoryWhereInput
    data: XOR<CategoryUpdateWithoutPlayersInput, CategoryUncheckedUpdateWithoutPlayersInput>
  }

  export type CategoryUpdateWithoutPlayersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    baseBid?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    minIncrement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxPlayersPerTeam?: NullableIntFieldUpdateOperationsInput | number | null
    minPlayersPerTeam?: NullableIntFieldUpdateOperationsInput | number | null
    auction?: AuctionUpdateOneRequiredWithoutCategoriesNestedInput
  }

  export type CategoryUncheckedUpdateWithoutPlayersInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    baseBid?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    minIncrement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxPlayersPerTeam?: NullableIntFieldUpdateOperationsInput | number | null
    minPlayersPerTeam?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type TeamUpsertWithoutPlayersInput = {
    update: XOR<TeamUpdateWithoutPlayersInput, TeamUncheckedUpdateWithoutPlayersInput>
    create: XOR<TeamCreateWithoutPlayersInput, TeamUncheckedCreateWithoutPlayersInput>
    where?: TeamWhereInput
  }

  export type TeamUpdateToOneWithWhereWithoutPlayersInput = {
    where?: TeamWhereInput
    data: XOR<TeamUpdateWithoutPlayersInput, TeamUncheckedUpdateWithoutPlayersInput>
  }

  export type TeamUpdateWithoutPlayersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    shortcutKey?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    originalPurse?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purseSpent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    playersCount?: IntFieldUpdateOperationsInput | number
    auction?: AuctionUpdateOneRequiredWithoutTeamsNestedInput
    bidHistories?: BidHistoryUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateWithoutPlayersInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    shortcutKey?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    originalPurse?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purseSpent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    playersCount?: IntFieldUpdateOperationsInput | number
    bidHistories?: BidHistoryUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type BidHistoryUpsertWithWhereUniqueWithoutPlayerInput = {
    where: BidHistoryWhereUniqueInput
    update: XOR<BidHistoryUpdateWithoutPlayerInput, BidHistoryUncheckedUpdateWithoutPlayerInput>
    create: XOR<BidHistoryCreateWithoutPlayerInput, BidHistoryUncheckedCreateWithoutPlayerInput>
  }

  export type BidHistoryUpdateWithWhereUniqueWithoutPlayerInput = {
    where: BidHistoryWhereUniqueInput
    data: XOR<BidHistoryUpdateWithoutPlayerInput, BidHistoryUncheckedUpdateWithoutPlayerInput>
  }

  export type BidHistoryUpdateManyWithWhereWithoutPlayerInput = {
    where: BidHistoryScalarWhereInput
    data: XOR<BidHistoryUpdateManyMutationInput, BidHistoryUncheckedUpdateManyWithoutPlayerInput>
  }

  export type PlayerCreateWithoutBidHistoryInput = {
    id?: string
    name: string
    mobile?: string | null
    age: number
    fatherName?: string | null
    profilePic?: string | null
    role?: $Enums.PlayerRole
    battingStyle?: string | null
    bowlingStyle?: string | null
    tshirtSize?: string | null
    trouserSize?: string | null
    jerseyName?: string | null
    jerseyNumber?: number | null
    status?: $Enums.PlayerStatus
    basePrice?: Decimal | DecimalJsLike | number | string | null
    soldPrice?: Decimal | DecimalJsLike | number | string | null
    auction: AuctionCreateNestedOneWithoutPlayersInput
    category?: CategoryCreateNestedOneWithoutPlayersInput
    team?: TeamCreateNestedOneWithoutPlayersInput
  }

  export type PlayerUncheckedCreateWithoutBidHistoryInput = {
    id?: string
    auctionId: string
    categoryId?: string | null
    name: string
    mobile?: string | null
    age: number
    fatherName?: string | null
    profilePic?: string | null
    role?: $Enums.PlayerRole
    battingStyle?: string | null
    bowlingStyle?: string | null
    tshirtSize?: string | null
    trouserSize?: string | null
    jerseyName?: string | null
    jerseyNumber?: number | null
    status?: $Enums.PlayerStatus
    basePrice?: Decimal | DecimalJsLike | number | string | null
    teamId?: string | null
    soldPrice?: Decimal | DecimalJsLike | number | string | null
  }

  export type PlayerCreateOrConnectWithoutBidHistoryInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutBidHistoryInput, PlayerUncheckedCreateWithoutBidHistoryInput>
  }

  export type AuctionCreateWithoutBidhistoriesInput = {
    id?: string
    auctionCode?: string
    name: string
    location?: string | null
    logo?: string | null
    sportsType?: string
    season?: string | null
    auctionDate: Date | string
    auctionStartTime?: string | null
    budgetPerTeam?: Decimal | DecimalJsLike | number | string
    minBid?: Decimal | DecimalJsLike | number | string
    bidIncrease?: Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: number
    maxPlayersPerTeam?: number
    isBoosterEnabled?: boolean
    boosterAmount?: number | null
    boosterTriggerPlayerCount?: number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: $Enums.PlanTier
    isPaid?: boolean
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null
    razorpaySignature?: string | null
    status?: $Enums.AuctionStatus
    liveTheme?: string
    soldEffect?: string
    overlayTheme?: string
    overlayLayout?: string
    createdAt?: Date | string
    ArchivedAt?: Date | string | null
    organizer: UserCreateNestedOneWithoutAuctionsInput
    teams?: TeamCreateNestedManyWithoutAuctionInput
    players?: PlayerCreateNestedManyWithoutAuctionInput
    categories?: CategoryCreateNestedManyWithoutAuctionInput
    AuctionInsight?: AuctionInsightCreateNestedOneWithoutAuctionInput
    joinedAuctions?: JoinedAuctionCreateNestedManyWithoutAuctionInput
  }

  export type AuctionUncheckedCreateWithoutBidhistoriesInput = {
    id?: string
    auctionCode?: string
    organizerId: string
    name: string
    location?: string | null
    logo?: string | null
    sportsType?: string
    season?: string | null
    auctionDate: Date | string
    auctionStartTime?: string | null
    budgetPerTeam?: Decimal | DecimalJsLike | number | string
    minBid?: Decimal | DecimalJsLike | number | string
    bidIncrease?: Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: number
    maxPlayersPerTeam?: number
    isBoosterEnabled?: boolean
    boosterAmount?: number | null
    boosterTriggerPlayerCount?: number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: $Enums.PlanTier
    isPaid?: boolean
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null
    razorpaySignature?: string | null
    status?: $Enums.AuctionStatus
    liveTheme?: string
    soldEffect?: string
    overlayTheme?: string
    overlayLayout?: string
    createdAt?: Date | string
    ArchivedAt?: Date | string | null
    teams?: TeamUncheckedCreateNestedManyWithoutAuctionInput
    players?: PlayerUncheckedCreateNestedManyWithoutAuctionInput
    categories?: CategoryUncheckedCreateNestedManyWithoutAuctionInput
    AuctionInsight?: AuctionInsightUncheckedCreateNestedOneWithoutAuctionInput
    joinedAuctions?: JoinedAuctionUncheckedCreateNestedManyWithoutAuctionInput
  }

  export type AuctionCreateOrConnectWithoutBidhistoriesInput = {
    where: AuctionWhereUniqueInput
    create: XOR<AuctionCreateWithoutBidhistoriesInput, AuctionUncheckedCreateWithoutBidhistoriesInput>
  }

  export type TeamCreateWithoutBidHistoriesInput = {
    id?: string
    name: string
    shortName: string
    shortcutKey?: string | null
    logo?: string | null
    originalPurse: Decimal | DecimalJsLike | number | string
    purseSpent?: Decimal | DecimalJsLike | number | string
    playersCount?: number
    auction: AuctionCreateNestedOneWithoutTeamsInput
    players?: PlayerCreateNestedManyWithoutTeamInput
  }

  export type TeamUncheckedCreateWithoutBidHistoriesInput = {
    id?: string
    auctionId: string
    name: string
    shortName: string
    shortcutKey?: string | null
    logo?: string | null
    originalPurse: Decimal | DecimalJsLike | number | string
    purseSpent?: Decimal | DecimalJsLike | number | string
    playersCount?: number
    players?: PlayerUncheckedCreateNestedManyWithoutTeamInput
  }

  export type TeamCreateOrConnectWithoutBidHistoriesInput = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutBidHistoriesInput, TeamUncheckedCreateWithoutBidHistoriesInput>
  }

  export type PlayerUpsertWithoutBidHistoryInput = {
    update: XOR<PlayerUpdateWithoutBidHistoryInput, PlayerUncheckedUpdateWithoutBidHistoryInput>
    create: XOR<PlayerCreateWithoutBidHistoryInput, PlayerUncheckedCreateWithoutBidHistoryInput>
    where?: PlayerWhereInput
  }

  export type PlayerUpdateToOneWithWhereWithoutBidHistoryInput = {
    where?: PlayerWhereInput
    data: XOR<PlayerUpdateWithoutBidHistoryInput, PlayerUncheckedUpdateWithoutBidHistoryInput>
  }

  export type PlayerUpdateWithoutBidHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    age?: IntFieldUpdateOperationsInput | number
    fatherName?: NullableStringFieldUpdateOperationsInput | string | null
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole
    battingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    bowlingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    tshirtSize?: NullableStringFieldUpdateOperationsInput | string | null
    trouserSize?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyName?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyNumber?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus
    basePrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    soldPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    auction?: AuctionUpdateOneRequiredWithoutPlayersNestedInput
    category?: CategoryUpdateOneWithoutPlayersNestedInput
    team?: TeamUpdateOneWithoutPlayersNestedInput
  }

  export type PlayerUncheckedUpdateWithoutBidHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    age?: IntFieldUpdateOperationsInput | number
    fatherName?: NullableStringFieldUpdateOperationsInput | string | null
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole
    battingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    bowlingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    tshirtSize?: NullableStringFieldUpdateOperationsInput | string | null
    trouserSize?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyName?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyNumber?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus
    basePrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    soldPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type AuctionUpsertWithoutBidhistoriesInput = {
    update: XOR<AuctionUpdateWithoutBidhistoriesInput, AuctionUncheckedUpdateWithoutBidhistoriesInput>
    create: XOR<AuctionCreateWithoutBidhistoriesInput, AuctionUncheckedCreateWithoutBidhistoriesInput>
    where?: AuctionWhereInput
  }

  export type AuctionUpdateToOneWithWhereWithoutBidhistoriesInput = {
    where?: AuctionWhereInput
    data: XOR<AuctionUpdateWithoutBidhistoriesInput, AuctionUncheckedUpdateWithoutBidhistoriesInput>
  }

  export type AuctionUpdateWithoutBidhistoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionCode?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    sportsType?: StringFieldUpdateOperationsInput | string
    season?: NullableStringFieldUpdateOperationsInput | string | null
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    auctionStartTime?: NullableStringFieldUpdateOperationsInput | string | null
    budgetPerTeam?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minBid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bidIncrease?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    maxPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    isBoosterEnabled?: BoolFieldUpdateOperationsInput | boolean
    boosterAmount?: NullableIntFieldUpdateOperationsInput | number | null
    boosterTriggerPlayerCount?: NullableIntFieldUpdateOperationsInput | number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: EnumPlanTierFieldUpdateOperationsInput | $Enums.PlanTier
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    razorpayOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpaySignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAuctionStatusFieldUpdateOperationsInput | $Enums.AuctionStatus
    liveTheme?: StringFieldUpdateOperationsInput | string
    soldEffect?: StringFieldUpdateOperationsInput | string
    overlayTheme?: StringFieldUpdateOperationsInput | string
    overlayLayout?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ArchivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organizer?: UserUpdateOneRequiredWithoutAuctionsNestedInput
    teams?: TeamUpdateManyWithoutAuctionNestedInput
    players?: PlayerUpdateManyWithoutAuctionNestedInput
    categories?: CategoryUpdateManyWithoutAuctionNestedInput
    AuctionInsight?: AuctionInsightUpdateOneWithoutAuctionNestedInput
    joinedAuctions?: JoinedAuctionUpdateManyWithoutAuctionNestedInput
  }

  export type AuctionUncheckedUpdateWithoutBidhistoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionCode?: StringFieldUpdateOperationsInput | string
    organizerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    sportsType?: StringFieldUpdateOperationsInput | string
    season?: NullableStringFieldUpdateOperationsInput | string | null
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    auctionStartTime?: NullableStringFieldUpdateOperationsInput | string | null
    budgetPerTeam?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minBid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bidIncrease?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    maxPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    isBoosterEnabled?: BoolFieldUpdateOperationsInput | boolean
    boosterAmount?: NullableIntFieldUpdateOperationsInput | number | null
    boosterTriggerPlayerCount?: NullableIntFieldUpdateOperationsInput | number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: EnumPlanTierFieldUpdateOperationsInput | $Enums.PlanTier
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    razorpayOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpaySignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAuctionStatusFieldUpdateOperationsInput | $Enums.AuctionStatus
    liveTheme?: StringFieldUpdateOperationsInput | string
    soldEffect?: StringFieldUpdateOperationsInput | string
    overlayTheme?: StringFieldUpdateOperationsInput | string
    overlayLayout?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ArchivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    teams?: TeamUncheckedUpdateManyWithoutAuctionNestedInput
    players?: PlayerUncheckedUpdateManyWithoutAuctionNestedInput
    categories?: CategoryUncheckedUpdateManyWithoutAuctionNestedInput
    AuctionInsight?: AuctionInsightUncheckedUpdateOneWithoutAuctionNestedInput
    joinedAuctions?: JoinedAuctionUncheckedUpdateManyWithoutAuctionNestedInput
  }

  export type TeamUpsertWithoutBidHistoriesInput = {
    update: XOR<TeamUpdateWithoutBidHistoriesInput, TeamUncheckedUpdateWithoutBidHistoriesInput>
    create: XOR<TeamCreateWithoutBidHistoriesInput, TeamUncheckedCreateWithoutBidHistoriesInput>
    where?: TeamWhereInput
  }

  export type TeamUpdateToOneWithWhereWithoutBidHistoriesInput = {
    where?: TeamWhereInput
    data: XOR<TeamUpdateWithoutBidHistoriesInput, TeamUncheckedUpdateWithoutBidHistoriesInput>
  }

  export type TeamUpdateWithoutBidHistoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    shortcutKey?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    originalPurse?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purseSpent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    playersCount?: IntFieldUpdateOperationsInput | number
    auction?: AuctionUpdateOneRequiredWithoutTeamsNestedInput
    players?: PlayerUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateWithoutBidHistoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    shortcutKey?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    originalPurse?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purseSpent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    playersCount?: IntFieldUpdateOperationsInput | number
    players?: PlayerUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type UserCreateWithoutAuditLogsInput = {
    id?: string
    firebaseUid: string
    name: string
    email: string
    role?: $Enums.Role
    password?: string | null
    mobile?: string | null
    city?: string | null
    profileUrl?: string | null
    createdAt?: Date | string
    stripeCustomerId?: string | null
    auctions?: AuctionCreateNestedManyWithoutOrganizerInput
    joinedAuctions?: JoinedAuctionCreateNestedManyWithoutUserInput
    feedback?: FeedbackCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    firebaseUid: string
    name: string
    email: string
    role?: $Enums.Role
    password?: string | null
    mobile?: string | null
    city?: string | null
    profileUrl?: string | null
    createdAt?: Date | string
    stripeCustomerId?: string | null
    auctions?: AuctionUncheckedCreateNestedManyWithoutOrganizerInput
    joinedAuctions?: JoinedAuctionUncheckedCreateNestedManyWithoutUserInput
    feedback?: FeedbackUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAuditLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
  }

  export type UserUpsertWithoutAuditLogsInput = {
    update: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type UserUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    password?: NullableStringFieldUpdateOperationsInput | string | null
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    profileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    auctions?: AuctionUpdateManyWithoutOrganizerNestedInput
    joinedAuctions?: JoinedAuctionUpdateManyWithoutUserNestedInput
    feedback?: FeedbackUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    password?: NullableStringFieldUpdateOperationsInput | string | null
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    profileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    auctions?: AuctionUncheckedUpdateManyWithoutOrganizerNestedInput
    joinedAuctions?: JoinedAuctionUncheckedUpdateManyWithoutUserNestedInput
    feedback?: FeedbackUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutFeedbackInput = {
    id?: string
    firebaseUid: string
    name: string
    email: string
    role?: $Enums.Role
    password?: string | null
    mobile?: string | null
    city?: string | null
    profileUrl?: string | null
    createdAt?: Date | string
    stripeCustomerId?: string | null
    auctions?: AuctionCreateNestedManyWithoutOrganizerInput
    joinedAuctions?: JoinedAuctionCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutFeedbackInput = {
    id?: string
    firebaseUid: string
    name: string
    email: string
    role?: $Enums.Role
    password?: string | null
    mobile?: string | null
    city?: string | null
    profileUrl?: string | null
    createdAt?: Date | string
    stripeCustomerId?: string | null
    auctions?: AuctionUncheckedCreateNestedManyWithoutOrganizerInput
    joinedAuctions?: JoinedAuctionUncheckedCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutFeedbackInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFeedbackInput, UserUncheckedCreateWithoutFeedbackInput>
  }

  export type UserUpsertWithoutFeedbackInput = {
    update: XOR<UserUpdateWithoutFeedbackInput, UserUncheckedUpdateWithoutFeedbackInput>
    create: XOR<UserCreateWithoutFeedbackInput, UserUncheckedCreateWithoutFeedbackInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFeedbackInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFeedbackInput, UserUncheckedUpdateWithoutFeedbackInput>
  }

  export type UserUpdateWithoutFeedbackInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    password?: NullableStringFieldUpdateOperationsInput | string | null
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    profileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    auctions?: AuctionUpdateManyWithoutOrganizerNestedInput
    joinedAuctions?: JoinedAuctionUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutFeedbackInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    password?: NullableStringFieldUpdateOperationsInput | string | null
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    profileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    auctions?: AuctionUncheckedUpdateManyWithoutOrganizerNestedInput
    joinedAuctions?: JoinedAuctionUncheckedUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AuctionCreateWithoutAuctionInsightInput = {
    id?: string
    auctionCode?: string
    name: string
    location?: string | null
    logo?: string | null
    sportsType?: string
    season?: string | null
    auctionDate: Date | string
    auctionStartTime?: string | null
    budgetPerTeam?: Decimal | DecimalJsLike | number | string
    minBid?: Decimal | DecimalJsLike | number | string
    bidIncrease?: Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: number
    maxPlayersPerTeam?: number
    isBoosterEnabled?: boolean
    boosterAmount?: number | null
    boosterTriggerPlayerCount?: number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: $Enums.PlanTier
    isPaid?: boolean
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null
    razorpaySignature?: string | null
    status?: $Enums.AuctionStatus
    liveTheme?: string
    soldEffect?: string
    overlayTheme?: string
    overlayLayout?: string
    createdAt?: Date | string
    ArchivedAt?: Date | string | null
    organizer: UserCreateNestedOneWithoutAuctionsInput
    teams?: TeamCreateNestedManyWithoutAuctionInput
    players?: PlayerCreateNestedManyWithoutAuctionInput
    categories?: CategoryCreateNestedManyWithoutAuctionInput
    bidhistories?: BidHistoryCreateNestedManyWithoutAuctionInput
    joinedAuctions?: JoinedAuctionCreateNestedManyWithoutAuctionInput
  }

  export type AuctionUncheckedCreateWithoutAuctionInsightInput = {
    id?: string
    auctionCode?: string
    organizerId: string
    name: string
    location?: string | null
    logo?: string | null
    sportsType?: string
    season?: string | null
    auctionDate: Date | string
    auctionStartTime?: string | null
    budgetPerTeam?: Decimal | DecimalJsLike | number | string
    minBid?: Decimal | DecimalJsLike | number | string
    bidIncrease?: Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: number
    maxPlayersPerTeam?: number
    isBoosterEnabled?: boolean
    boosterAmount?: number | null
    boosterTriggerPlayerCount?: number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: $Enums.PlanTier
    isPaid?: boolean
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null
    razorpaySignature?: string | null
    status?: $Enums.AuctionStatus
    liveTheme?: string
    soldEffect?: string
    overlayTheme?: string
    overlayLayout?: string
    createdAt?: Date | string
    ArchivedAt?: Date | string | null
    teams?: TeamUncheckedCreateNestedManyWithoutAuctionInput
    players?: PlayerUncheckedCreateNestedManyWithoutAuctionInput
    categories?: CategoryUncheckedCreateNestedManyWithoutAuctionInput
    bidhistories?: BidHistoryUncheckedCreateNestedManyWithoutAuctionInput
    joinedAuctions?: JoinedAuctionUncheckedCreateNestedManyWithoutAuctionInput
  }

  export type AuctionCreateOrConnectWithoutAuctionInsightInput = {
    where: AuctionWhereUniqueInput
    create: XOR<AuctionCreateWithoutAuctionInsightInput, AuctionUncheckedCreateWithoutAuctionInsightInput>
  }

  export type AuctionUpsertWithoutAuctionInsightInput = {
    update: XOR<AuctionUpdateWithoutAuctionInsightInput, AuctionUncheckedUpdateWithoutAuctionInsightInput>
    create: XOR<AuctionCreateWithoutAuctionInsightInput, AuctionUncheckedCreateWithoutAuctionInsightInput>
    where?: AuctionWhereInput
  }

  export type AuctionUpdateToOneWithWhereWithoutAuctionInsightInput = {
    where?: AuctionWhereInput
    data: XOR<AuctionUpdateWithoutAuctionInsightInput, AuctionUncheckedUpdateWithoutAuctionInsightInput>
  }

  export type AuctionUpdateWithoutAuctionInsightInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionCode?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    sportsType?: StringFieldUpdateOperationsInput | string
    season?: NullableStringFieldUpdateOperationsInput | string | null
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    auctionStartTime?: NullableStringFieldUpdateOperationsInput | string | null
    budgetPerTeam?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minBid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bidIncrease?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    maxPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    isBoosterEnabled?: BoolFieldUpdateOperationsInput | boolean
    boosterAmount?: NullableIntFieldUpdateOperationsInput | number | null
    boosterTriggerPlayerCount?: NullableIntFieldUpdateOperationsInput | number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: EnumPlanTierFieldUpdateOperationsInput | $Enums.PlanTier
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    razorpayOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpaySignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAuctionStatusFieldUpdateOperationsInput | $Enums.AuctionStatus
    liveTheme?: StringFieldUpdateOperationsInput | string
    soldEffect?: StringFieldUpdateOperationsInput | string
    overlayTheme?: StringFieldUpdateOperationsInput | string
    overlayLayout?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ArchivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organizer?: UserUpdateOneRequiredWithoutAuctionsNestedInput
    teams?: TeamUpdateManyWithoutAuctionNestedInput
    players?: PlayerUpdateManyWithoutAuctionNestedInput
    categories?: CategoryUpdateManyWithoutAuctionNestedInput
    bidhistories?: BidHistoryUpdateManyWithoutAuctionNestedInput
    joinedAuctions?: JoinedAuctionUpdateManyWithoutAuctionNestedInput
  }

  export type AuctionUncheckedUpdateWithoutAuctionInsightInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionCode?: StringFieldUpdateOperationsInput | string
    organizerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    sportsType?: StringFieldUpdateOperationsInput | string
    season?: NullableStringFieldUpdateOperationsInput | string | null
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    auctionStartTime?: NullableStringFieldUpdateOperationsInput | string | null
    budgetPerTeam?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minBid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bidIncrease?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    maxPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    isBoosterEnabled?: BoolFieldUpdateOperationsInput | boolean
    boosterAmount?: NullableIntFieldUpdateOperationsInput | number | null
    boosterTriggerPlayerCount?: NullableIntFieldUpdateOperationsInput | number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: EnumPlanTierFieldUpdateOperationsInput | $Enums.PlanTier
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    razorpayOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpaySignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAuctionStatusFieldUpdateOperationsInput | $Enums.AuctionStatus
    liveTheme?: StringFieldUpdateOperationsInput | string
    soldEffect?: StringFieldUpdateOperationsInput | string
    overlayTheme?: StringFieldUpdateOperationsInput | string
    overlayLayout?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ArchivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    teams?: TeamUncheckedUpdateManyWithoutAuctionNestedInput
    players?: PlayerUncheckedUpdateManyWithoutAuctionNestedInput
    categories?: CategoryUncheckedUpdateManyWithoutAuctionNestedInput
    bidhistories?: BidHistoryUncheckedUpdateManyWithoutAuctionNestedInput
    joinedAuctions?: JoinedAuctionUncheckedUpdateManyWithoutAuctionNestedInput
  }

  export type AuctionCreateManyOrganizerInput = {
    id?: string
    auctionCode?: string
    name: string
    location?: string | null
    logo?: string | null
    sportsType?: string
    season?: string | null
    auctionDate: Date | string
    auctionStartTime?: string | null
    budgetPerTeam?: Decimal | DecimalJsLike | number | string
    minBid?: Decimal | DecimalJsLike | number | string
    bidIncrease?: Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: number
    maxPlayersPerTeam?: number
    isBoosterEnabled?: boolean
    boosterAmount?: number | null
    boosterTriggerPlayerCount?: number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: $Enums.PlanTier
    isPaid?: boolean
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null
    razorpaySignature?: string | null
    status?: $Enums.AuctionStatus
    liveTheme?: string
    soldEffect?: string
    overlayTheme?: string
    overlayLayout?: string
    createdAt?: Date | string
    ArchivedAt?: Date | string | null
  }

  export type JoinedAuctionCreateManyUserInput = {
    id?: string
    auctionId: string
    joinedAt?: Date | string
  }

  export type AuditLogCreateManyUserInput = {
    id?: string
    action: string
    endpoint: string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type AuctionUpdateWithoutOrganizerInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionCode?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    sportsType?: StringFieldUpdateOperationsInput | string
    season?: NullableStringFieldUpdateOperationsInput | string | null
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    auctionStartTime?: NullableStringFieldUpdateOperationsInput | string | null
    budgetPerTeam?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minBid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bidIncrease?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    maxPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    isBoosterEnabled?: BoolFieldUpdateOperationsInput | boolean
    boosterAmount?: NullableIntFieldUpdateOperationsInput | number | null
    boosterTriggerPlayerCount?: NullableIntFieldUpdateOperationsInput | number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: EnumPlanTierFieldUpdateOperationsInput | $Enums.PlanTier
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    razorpayOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpaySignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAuctionStatusFieldUpdateOperationsInput | $Enums.AuctionStatus
    liveTheme?: StringFieldUpdateOperationsInput | string
    soldEffect?: StringFieldUpdateOperationsInput | string
    overlayTheme?: StringFieldUpdateOperationsInput | string
    overlayLayout?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ArchivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    teams?: TeamUpdateManyWithoutAuctionNestedInput
    players?: PlayerUpdateManyWithoutAuctionNestedInput
    categories?: CategoryUpdateManyWithoutAuctionNestedInput
    bidhistories?: BidHistoryUpdateManyWithoutAuctionNestedInput
    AuctionInsight?: AuctionInsightUpdateOneWithoutAuctionNestedInput
    joinedAuctions?: JoinedAuctionUpdateManyWithoutAuctionNestedInput
  }

  export type AuctionUncheckedUpdateWithoutOrganizerInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionCode?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    sportsType?: StringFieldUpdateOperationsInput | string
    season?: NullableStringFieldUpdateOperationsInput | string | null
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    auctionStartTime?: NullableStringFieldUpdateOperationsInput | string | null
    budgetPerTeam?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minBid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bidIncrease?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    maxPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    isBoosterEnabled?: BoolFieldUpdateOperationsInput | boolean
    boosterAmount?: NullableIntFieldUpdateOperationsInput | number | null
    boosterTriggerPlayerCount?: NullableIntFieldUpdateOperationsInput | number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: EnumPlanTierFieldUpdateOperationsInput | $Enums.PlanTier
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    razorpayOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpaySignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAuctionStatusFieldUpdateOperationsInput | $Enums.AuctionStatus
    liveTheme?: StringFieldUpdateOperationsInput | string
    soldEffect?: StringFieldUpdateOperationsInput | string
    overlayTheme?: StringFieldUpdateOperationsInput | string
    overlayLayout?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ArchivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    teams?: TeamUncheckedUpdateManyWithoutAuctionNestedInput
    players?: PlayerUncheckedUpdateManyWithoutAuctionNestedInput
    categories?: CategoryUncheckedUpdateManyWithoutAuctionNestedInput
    bidhistories?: BidHistoryUncheckedUpdateManyWithoutAuctionNestedInput
    AuctionInsight?: AuctionInsightUncheckedUpdateOneWithoutAuctionNestedInput
    joinedAuctions?: JoinedAuctionUncheckedUpdateManyWithoutAuctionNestedInput
  }

  export type AuctionUncheckedUpdateManyWithoutOrganizerInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionCode?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    sportsType?: StringFieldUpdateOperationsInput | string
    season?: NullableStringFieldUpdateOperationsInput | string | null
    auctionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    auctionStartTime?: NullableStringFieldUpdateOperationsInput | string | null
    budgetPerTeam?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minBid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bidIncrease?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    maxPlayersPerTeam?: IntFieldUpdateOperationsInput | number
    isBoosterEnabled?: BoolFieldUpdateOperationsInput | boolean
    boosterAmount?: NullableIntFieldUpdateOperationsInput | number | null
    boosterTriggerPlayerCount?: NullableIntFieldUpdateOperationsInput | number | null
    bidRules?: NullableJsonNullValueInput | InputJsonValue
    planTier?: EnumPlanTierFieldUpdateOperationsInput | $Enums.PlanTier
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    razorpayOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpaySignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAuctionStatusFieldUpdateOperationsInput | $Enums.AuctionStatus
    liveTheme?: StringFieldUpdateOperationsInput | string
    soldEffect?: StringFieldUpdateOperationsInput | string
    overlayTheme?: StringFieldUpdateOperationsInput | string
    overlayLayout?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ArchivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type JoinedAuctionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auction?: AuctionUpdateOneRequiredWithoutJoinedAuctionsNestedInput
  }

  export type JoinedAuctionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JoinedAuctionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamCreateManyAuctionInput = {
    id?: string
    name: string
    shortName: string
    shortcutKey?: string | null
    logo?: string | null
    originalPurse: Decimal | DecimalJsLike | number | string
    purseSpent?: Decimal | DecimalJsLike | number | string
    playersCount?: number
  }

  export type PlayerCreateManyAuctionInput = {
    id?: string
    categoryId?: string | null
    name: string
    mobile?: string | null
    age: number
    fatherName?: string | null
    profilePic?: string | null
    role?: $Enums.PlayerRole
    battingStyle?: string | null
    bowlingStyle?: string | null
    tshirtSize?: string | null
    trouserSize?: string | null
    jerseyName?: string | null
    jerseyNumber?: number | null
    status?: $Enums.PlayerStatus
    basePrice?: Decimal | DecimalJsLike | number | string | null
    teamId?: string | null
    soldPrice?: Decimal | DecimalJsLike | number | string | null
  }

  export type CategoryCreateManyAuctionInput = {
    id?: string
    name: string
    color?: string | null
    baseBid?: Decimal | DecimalJsLike | number | string | null
    minIncrement?: Decimal | DecimalJsLike | number | string | null
    maxPlayersPerTeam?: number | null
    minPlayersPerTeam?: number | null
  }

  export type BidHistoryCreateManyAuctionInput = {
    id?: string
    playerId: string
    teamId: string
    amount: Decimal | DecimalJsLike | number | string
    timestamp?: Date | string
  }

  export type JoinedAuctionCreateManyAuctionInput = {
    id?: string
    userId: string
    joinedAt?: Date | string
  }

  export type TeamUpdateWithoutAuctionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    shortcutKey?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    originalPurse?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purseSpent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    playersCount?: IntFieldUpdateOperationsInput | number
    players?: PlayerUpdateManyWithoutTeamNestedInput
    bidHistories?: BidHistoryUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateWithoutAuctionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    shortcutKey?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    originalPurse?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purseSpent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    playersCount?: IntFieldUpdateOperationsInput | number
    players?: PlayerUncheckedUpdateManyWithoutTeamNestedInput
    bidHistories?: BidHistoryUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateManyWithoutAuctionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    shortcutKey?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    originalPurse?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purseSpent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    playersCount?: IntFieldUpdateOperationsInput | number
  }

  export type PlayerUpdateWithoutAuctionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    age?: IntFieldUpdateOperationsInput | number
    fatherName?: NullableStringFieldUpdateOperationsInput | string | null
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole
    battingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    bowlingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    tshirtSize?: NullableStringFieldUpdateOperationsInput | string | null
    trouserSize?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyName?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyNumber?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus
    basePrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    soldPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    category?: CategoryUpdateOneWithoutPlayersNestedInput
    team?: TeamUpdateOneWithoutPlayersNestedInput
    bidHistory?: BidHistoryUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateWithoutAuctionInput = {
    id?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    age?: IntFieldUpdateOperationsInput | number
    fatherName?: NullableStringFieldUpdateOperationsInput | string | null
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole
    battingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    bowlingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    tshirtSize?: NullableStringFieldUpdateOperationsInput | string | null
    trouserSize?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyName?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyNumber?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus
    basePrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    soldPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bidHistory?: BidHistoryUncheckedUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateManyWithoutAuctionInput = {
    id?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    age?: IntFieldUpdateOperationsInput | number
    fatherName?: NullableStringFieldUpdateOperationsInput | string | null
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole
    battingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    bowlingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    tshirtSize?: NullableStringFieldUpdateOperationsInput | string | null
    trouserSize?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyName?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyNumber?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus
    basePrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    soldPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type CategoryUpdateWithoutAuctionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    baseBid?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    minIncrement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxPlayersPerTeam?: NullableIntFieldUpdateOperationsInput | number | null
    minPlayersPerTeam?: NullableIntFieldUpdateOperationsInput | number | null
    players?: PlayerUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateWithoutAuctionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    baseBid?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    minIncrement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxPlayersPerTeam?: NullableIntFieldUpdateOperationsInput | number | null
    minPlayersPerTeam?: NullableIntFieldUpdateOperationsInput | number | null
    players?: PlayerUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateManyWithoutAuctionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    baseBid?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    minIncrement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxPlayersPerTeam?: NullableIntFieldUpdateOperationsInput | number | null
    minPlayersPerTeam?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type BidHistoryUpdateWithoutAuctionInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    player?: PlayerUpdateOneRequiredWithoutBidHistoryNestedInput
    team?: TeamUpdateOneRequiredWithoutBidHistoriesNestedInput
  }

  export type BidHistoryUncheckedUpdateWithoutAuctionInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    teamId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BidHistoryUncheckedUpdateManyWithoutAuctionInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    teamId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JoinedAuctionUpdateWithoutAuctionInput = {
    id?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutJoinedAuctionsNestedInput
  }

  export type JoinedAuctionUncheckedUpdateWithoutAuctionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JoinedAuctionUncheckedUpdateManyWithoutAuctionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerCreateManyCategoryInput = {
    id?: string
    auctionId: string
    name: string
    mobile?: string | null
    age: number
    fatherName?: string | null
    profilePic?: string | null
    role?: $Enums.PlayerRole
    battingStyle?: string | null
    bowlingStyle?: string | null
    tshirtSize?: string | null
    trouserSize?: string | null
    jerseyName?: string | null
    jerseyNumber?: number | null
    status?: $Enums.PlayerStatus
    basePrice?: Decimal | DecimalJsLike | number | string | null
    teamId?: string | null
    soldPrice?: Decimal | DecimalJsLike | number | string | null
  }

  export type PlayerUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    age?: IntFieldUpdateOperationsInput | number
    fatherName?: NullableStringFieldUpdateOperationsInput | string | null
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole
    battingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    bowlingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    tshirtSize?: NullableStringFieldUpdateOperationsInput | string | null
    trouserSize?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyName?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyNumber?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus
    basePrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    soldPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    auction?: AuctionUpdateOneRequiredWithoutPlayersNestedInput
    team?: TeamUpdateOneWithoutPlayersNestedInput
    bidHistory?: BidHistoryUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    age?: IntFieldUpdateOperationsInput | number
    fatherName?: NullableStringFieldUpdateOperationsInput | string | null
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole
    battingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    bowlingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    tshirtSize?: NullableStringFieldUpdateOperationsInput | string | null
    trouserSize?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyName?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyNumber?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus
    basePrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    soldPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bidHistory?: BidHistoryUncheckedUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    age?: IntFieldUpdateOperationsInput | number
    fatherName?: NullableStringFieldUpdateOperationsInput | string | null
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole
    battingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    bowlingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    tshirtSize?: NullableStringFieldUpdateOperationsInput | string | null
    trouserSize?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyName?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyNumber?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus
    basePrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    soldPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type PlayerCreateManyTeamInput = {
    id?: string
    auctionId: string
    categoryId?: string | null
    name: string
    mobile?: string | null
    age: number
    fatherName?: string | null
    profilePic?: string | null
    role?: $Enums.PlayerRole
    battingStyle?: string | null
    bowlingStyle?: string | null
    tshirtSize?: string | null
    trouserSize?: string | null
    jerseyName?: string | null
    jerseyNumber?: number | null
    status?: $Enums.PlayerStatus
    basePrice?: Decimal | DecimalJsLike | number | string | null
    soldPrice?: Decimal | DecimalJsLike | number | string | null
  }

  export type BidHistoryCreateManyTeamInput = {
    id?: string
    playerId: string
    auctionId: string
    amount: Decimal | DecimalJsLike | number | string
    timestamp?: Date | string
  }

  export type PlayerUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    age?: IntFieldUpdateOperationsInput | number
    fatherName?: NullableStringFieldUpdateOperationsInput | string | null
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole
    battingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    bowlingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    tshirtSize?: NullableStringFieldUpdateOperationsInput | string | null
    trouserSize?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyName?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyNumber?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus
    basePrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    soldPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    auction?: AuctionUpdateOneRequiredWithoutPlayersNestedInput
    category?: CategoryUpdateOneWithoutPlayersNestedInput
    bidHistory?: BidHistoryUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    age?: IntFieldUpdateOperationsInput | number
    fatherName?: NullableStringFieldUpdateOperationsInput | string | null
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole
    battingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    bowlingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    tshirtSize?: NullableStringFieldUpdateOperationsInput | string | null
    trouserSize?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyName?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyNumber?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus
    basePrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    soldPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bidHistory?: BidHistoryUncheckedUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateManyWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    age?: IntFieldUpdateOperationsInput | number
    fatherName?: NullableStringFieldUpdateOperationsInput | string | null
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole
    battingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    bowlingStyle?: NullableStringFieldUpdateOperationsInput | string | null
    tshirtSize?: NullableStringFieldUpdateOperationsInput | string | null
    trouserSize?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyName?: NullableStringFieldUpdateOperationsInput | string | null
    jerseyNumber?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus
    basePrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    soldPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type BidHistoryUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    player?: PlayerUpdateOneRequiredWithoutBidHistoryNestedInput
    auction?: AuctionUpdateOneRequiredWithoutBidhistoriesNestedInput
  }

  export type BidHistoryUncheckedUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BidHistoryUncheckedUpdateManyWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BidHistoryCreateManyPlayerInput = {
    id?: string
    auctionId: string
    teamId: string
    amount: Decimal | DecimalJsLike | number | string
    timestamp?: Date | string
  }

  export type BidHistoryUpdateWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    auction?: AuctionUpdateOneRequiredWithoutBidhistoriesNestedInput
    team?: TeamUpdateOneRequiredWithoutBidHistoriesNestedInput
  }

  export type BidHistoryUncheckedUpdateWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    teamId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BidHistoryUncheckedUpdateManyWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    auctionId?: StringFieldUpdateOperationsInput | string
    teamId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}