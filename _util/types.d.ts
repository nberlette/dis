export { Buffer } from "../deps.ts";

export type Falsy = false | 0 | 0n | "" | null | undefined;

export type ArrayMethod = (
  fn: (value: unknown, index: number, array: unknown[]) => boolean,
  thisArg?: unknown,
) => boolean;

export interface ArrayAssertion<T = unknown> {
  (element: unknown): asserts element is T;
  (element: unknown, index: number): asserts element is T;
  (element: unknown, index: number, array: T[]): asserts element is T;
}

/**
 * Matches a `class` constructor.
 * @see https://mdn.io/Classes.
 */
export interface Class<
  Proto = unknown,
  Args extends any[] = any[],
> extends Constructor<Proto, Args> {
  readonly prototype: Proto;
}

export interface Constructor<Proto = unknown, Args extends any[] = any[]> {
  new (...args: Args): Proto;
}

export type Predicate<T = unknown> = (value: unknown) => value is T;

/**
 * Matches any primitive value.
 * @see https://mdn.io/Primitive
 */
export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;

/**
 * @see {@link Printable} for more information on Printable Primitive types.
 */
export type MaybePrintable = Exclude<Primitive, symbol>;

/**
 * The "Printable" Primitives - `string`, `number`, `boolean`, `bigint` - are
 * the subset of the Primitive types that can be printed in Template Literal
 * types (a feature of TypeScript 4.1+).
 *
 * _Technically_ `null` and `undefined` are also printable, but only as the
 * literal strings `"null"` and `"undefined"`, respectively. As such, they
 * are not included in this type.
 *
 * @see {@linkcode MaybePrintable} if you need to include `null` and `undefined` in the Printable type for your use case.
 */
export type Printable = NonNullable<MaybePrintable>;

/**
 * Matches any [typed array](https://mdn.io/TypedArray).
 * @see https://mdn.io/TypedArray
 */
export type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

// built-ins
export type MapIterator<K = unknown, V = unknown> = IterableIterator<[K, V]>;
export type SetIterator<T = unknown> = IterableIterator<T>;

/**
 * Describes the general shape of a JavaScript / TypeScript module that was
 * imported using the namespace syntax, e.g. `import * as is from ...`
 *
 * @see {@linkcode is.namespaceModule}
 */
export interface Module {
  [name: string]: unknown;
  exports?: {
    [name: string]: unknown;
  };
  default?: unknown;
  readonly __esModule?: boolean;
  readonly [Symbol.toStringTag]: "Module";
}

type Accessors<T> = {
  get: () => T;
  set: (value: T | {}) => void;
};

export type AccessorDescriptor<T = any> = Flatten<
  & {
    enumerable?: boolean;
    configurable?: boolean;
  }
  & (
    | Accessors<T>
    | PartialByKeys<Accessors<T>, "set">
  )
>;

export type ReadonlyAccessorDescriptor<T = any> = Flatten<
  & Omit<AccessorDescriptor<T>, "set">
  & RequiredByKeys<AccessorDescriptor<T>, "get">
  & { set?: never }
>;

export type DataDescriptor<T = any> = Flatten<
  & {
    enumerable?: boolean;
    configurable?: boolean;
  }
  & (
    | { writable: boolean; value: T }
    | { writable: boolean; value?: T }
    | { writable?: boolean; value: T }
  )
>;

export type ReadonlyDataDescriptor<T = any> = Flatten<
  & Omit<DataDescriptor<T>, "writable" | "configurable">
  & RequiredByKeys<DataDescriptor<T>, "value">
  & { writable?: false; configurable?: false }
>;

/**
 * Matches a value that is like an Observable.
 * @see https://github.com/tc39/proposal-observable
 */
export interface ObservableLike {
  subscribe(observer: (value: unknown) => void): void;
  [Symbol.observable](): ObservableLike;
}

export interface WeakRef<T extends object> {
  readonly [Symbol.toStringTag]: "WeakRef";
  deref(): T | undefined;
}

export type AsyncFunction<T extends any = any> = <U extends T>(
  ...args: any[]
) => Promise<U>;

// numeric

export type Zero = 0 | 0n;
export type PositiveInfinity = 1e999;
export type NegativeInfinity = -1e999;
export type Infinity = PositiveInfinity | NegativeInfinity;
export type Numeric = bigint | number | `${bigint}` | `${number}`;

/**
 * @category Numeric
 */
export declare type Finite<T extends Numeric> = T extends
  PositiveInfinity | NegativeInfinity ? never : T;

/**
 * @category Numeric
 */
export declare type Infinite<T extends Numeric> = T extends
  PositiveInfinity | NegativeInfinity ? T : never;

/**
 * @category Numeric
 */
export declare type Integer<T extends Numeric> = `${T}` extends `${bigint}` ? T
  : never;

/**
 * @category Numeric
 */
export declare type Float<T extends Numeric> = T extends Integer<T> ? never
  : T;

/**
 * A negative (`-∞ < x < 0`) `number` that is not an integer.
 * Equivalent to `Negative<Float<T>>`.
 *
 * Use-case: Validating and documenting parameters.
 *
 * @see {@linkcode Negative}
 * @see {@linkcode Float}
 *
 * @category Numeric
 */
export declare type NegativeFloat<T extends Numeric> = Negative<
  Float<T>
>;

/**
 * A negative `number`/`bigint` (`-∞ < x < 0`)
 *
 * Use-case: Validating and documenting parameters.
 *
 * @see {@linkcode NegativeInteger}
 * @see {@linkcode NonNegative}
 *
 * @category Numeric
 */
export declare type Negative<T extends Numeric> = T extends Zero ? never
  : `${T}` extends `-${string}` ? T
  : never;

// export declare type Absolute<T extends Numeric> = `${T}` extends
// `-${infer N extends Numeric}` ? N : ParseInt<`${T}`>;

// type AbsTest1 = Absolute<-200>; // 200
// type AbsTest2 = Absolute<"-200">; // error
// type AbsTest3 = Absolute<200>; // 200

/**
 * A negative (`-∞ < x < 0`) `number` that is an integer.
 * Equivalent to `Negative<Integer<T>>`.
 *
 * You can't pass a `bigint` as they are already guaranteed to be integers,
 * instead use `Negative<T>`.
 *
 * Use-case: Validating and documenting parameters.
 *
 * @see {@linkcode Negative}
 * @see {@linkcode Integer}
 *
 * @category Numeric
 */
export declare type NegativeInteger<T extends Numeric> = Negative<
  Integer<T>
>;

/**
 * A non-negative `number`/`bigint` (`0 <= x < ∞`).
 *
 * Use-case: Validating and documenting parameters.
 *
 * @see {@linkcode NonNegativeInteger}
 * @see {@linkcode Negative}
 *
 * @example ```ts
 * import type {NonNegative} from 'type-fest';
 *
 * declare function setLength<T extends Numeric>(length: NonNegative<T>): void;
 * ```
 *
 * @category Numeric
 */
export declare type NonNegative<T extends Numeric> = T extends Zero ? T
  : Negative<T> extends never ? T
  : never;

/**
 * A non-negative (`0 <= x < ∞`) `number` that is an integer.
 * Equivalent to `NonNegative<Integer<T>>`.
 *
 * You can't pass a `bigint` as they are already guaranteed to be integers,
 * instead use `NonNegative<T>`.
 *
 * Use-case: Validating and documenting parameters.
 *
 * @see {@linkcode NonNegative}
 * @see {@linkcode Integer}
 * @example ```ts
 * declare function setLength<T extends Numeric>(length: NonNegativeInteger<T>): void;
 * ```
 * @category Numeric
 */
export declare type NonNegativeInteger<T extends Numeric> = NonNegative<
  Integer<T>
>;

// utilities

export type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends (
    k: infer I,
  ) => void ? I
    : never;

export type UnionToFunction<T> = T extends any ? () => T : never;

export type LastOf<T> = UnionToIntersection<UnionToFunction<T>> extends
  () => infer R ? R
  : never;

export type Push<T extends unknown[], V> = [
  ...T,
  ...(V extends unknown[] ? V : [V]),
];

export type UnionToTuple<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false,
> = true extends N ? [] : Push<UnionToTuple<Exclude<T, L>>, L>;

export type nullish = null | undefined;

/**
 * Obtain the parameters of a constructor function type in a tuple
 */
// deno-fmt-ignore
export type ConstructorArgs<T extends Constructor> =
  | T extends Constructor<any, infer P extends unknown[]> ? P : never;

/**
 * Obtain the return type of a constructor function type
 */
// deno-fmt-ignore
export type Instance<ConstructorFn extends Constructor> =
  | ConstructorFn extends Constructor<infer InstanceType> ? InstanceType : any;

/**
 * Obtain the parameters of a function type in a tuple
 */
export type FunctionArgs<T extends (...args: any) => any> = T extends
  (...args: infer P extends unknown[]) => any ? P : never;

/**
 * Obtain the return type of a function type
 */
// deno-fmt-ignore
export type Returns<T extends (...args: any) => any> =
  | T extends (...args: any) => infer R ? R : any;

/**
 * Recursively unwraps the "awaited type" of a type. Non-promise "thenables" should resolve to `never`. This emulates the behavior of `await`.
 */
export type Await<T> = T extends nullish ? T
  : T extends object & { then(resolver: infer F): any }
    ? F extends ((val: infer V, ...args: any[]) => any) ? Await<V> : never
  : T;

export interface ArrayLike<T> {
  readonly length: number;
  readonly [n: number]: T;
}

/**
 * Make all properties in T optional. If Deep is true, then all sub-properties
 * will be optional, and sub-properties of those sub-properties, and so on.
 * @see {@linkcode Require} for the opposite transformation.
 * @see {@linkcode DeepOptional} for the shorthand of `Optional<T, true>`.
 */
export type Optional<T, Deep = false> = T extends Keyable ? {
    [P in keyof T]?: Deep extends true ? Optional<T[P]> : T[P];
  }
  : T;

/**
 * Make all properties in T required. If Deep is true, then all sub-properties
 * will be required, and sub-properties of those sub-properties, and so on.
 * @see {@linkcode Optional} for the opposite transformation.
 * @see {@linkcode DeepRequire} for the shorthand of `Require<T, true>`.
 */
export type Require<T, Deep = false> = T extends Keyable ? {
    [P in keyof T]-?: Deep extends true ? Require<T[P], true> : T[P];
  }
  : T;

/**
 * Make all properties in T readonly. If Deep is true, then all sub-properties
 * will be readonly, and sub-properties of those sub-properties, and so on.
 * @see {@linkcode Writable} for the opposite transformation.
 * @see {@linkcode DeepReadOnly} for the shorthand of `ReadOnly<T, true>`.
 */
export type ReadOnly<T, Deep = false> = T extends Keyable ? {
    readonly [P in keyof T]: Deep extends true ? ReadOnly<T[P], true> : T[P];
  }
  : T;

/**
 * Make all properties in T mutable. If Deep is true, then all sub-properties
 * will be mutable, and sub-properties of those sub-properties, and so on.
 * @see {@linkcode ReadOnly} for the opposite transformation.
 * @see {@linkcode DeepWritable} for the shorthand of `Writable<T, true>`.
 */
export type Writable<T, Deep = false> = T extends Keyable ? {
    -readonly [P in keyof T]: Deep extends true ? Writable<T[P], true> : T[P];
  }
  : T;

export type Keyable = { [key: string]: any } | readonly unknown[] | unknown[];

/**
 * Make all properties in T optional. This is a shorthand for `Partial<T, true>`.
 *
 * @example
 * ```ts
 * type Foo = {
 *   bar: number;
 *   baz: { qux: string };
 * };
 *
 * type FooPartial = DeepPartial<Foo>;
 * // type FooPartial = {
 * //   bar?: number | undefined;
 * //   baz?: {
 * //     qux?: string | undefined;
 * //   } | undefined;
 * // }
 * ```
 *
 * @see {@linkcode Optional} for the underlying type this relies on.
 * @see {@linkcode DeepRequired} for the opposite transformation.
 */
export type DeepPartial<T> = Optional<T, true>;

/**
 * Make all properties in T required, using the `-?` modifier after property
 * names. This is a shorthand for `Required<T, true>`.
 *
 * @example
 * ```ts
 * type Foo = {
 *   bar?: number;
 *   baz?: { qux?: string };
 * };
 *
 * type FooRequired = DeepRequired<Foo>;
 * // type FooRequired = {
 * //   bar: number;
 * //   baz: {
 * //     qux: string;
 * //   };
 * // }
 * ```
 *
 * @see {@linkcode Require} for the underlying type this relies on.
 * @see {@linkcode DeepPartial} for the opposite transformation.
 */
export type DeepRequired<T> = Require<T, true>;

/**
 * Recursively add the `readonly` directive to all properties of T.
 *
 * This is a shorthand for `Readonly<T, true>`.
 *
 * @example
 * ```ts
 * type Foo = {
 *   bar: {
 *     baz: number;
 *   };
 * };
 *
 * type FooReadonly = DeepReadonly<Foo>;
 * // FooReadonly = {
 * //   readonly bar: {
 * //     readonly baz: number;
 * //   };
 * // };
 * ```
 *
 * @see {@linkcode Readonly} for the underlying type this relies on.
 * @see {@linkcode DeepMutable} for the opposite transformation.
 */
export type DeepReadonly<T> = ReadOnly<T, true>;

/**
 * Recursively remove the `readonly` directive from all properties of T.
 *
 * This is a shorthand for `Mutable<T, true>`.
 *
 * @example
 * ```ts
 * type Foo = {
 *   readonly bar: {
 *     readonly qux: readonly [1, 2, 3];
 *   };
 * };
 *
 * type Bar = DeepMutable<Foo>;
 * // { bar: { qux: [1, 2, 3]; }; }
 *
 * // Notice the difference between this and "shallow" Mutable:
 * type Bar2 = Mutable<Foo>;
 * // { bar: { readonly qux: readonly [1, 2, 3]; }; }
 * ```
 *
 * @see {@linkcode Writable} for the underlying type this relies on.
 * @see {@linkcode DeepReadonly} for the opposite transformation.
 */
export type DeepMutable<T> = Writable<T, true>;

export type { DeepMutable as DeepWritable };

/**
 * From T, pick a set of properties whose keys are in the union K
 */
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

/**
 * Construct a type with a set of properties K of type T
 */
export type Record<K extends PropertyKey = string, T = unknown> = {
  [P in K]: T;
};

/**
 * Exclude from T those types that are assignable to U
 */
export type Exclude<T, U> = T extends U ? never : T;

/**
 * Extract from T those types that are assignable to U
 */
export type Extract<T, U> = T extends U ? T : never;

/**
 * Construct a type with the properties of T except for those in type K.
 */
export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

/**
 * Exclude null and undefined from T
 */
export type NonNullable<T> = T & {};

export type Awaitable<T> = T | Promise<T>;

export type Arrayable<T> = T | T[];

export type Args<T> = T extends ((...args: infer A) => any) ? A
  : T extends abstract new (...args: infer A) => any ? A
  : never;

export type Shift<T> = T extends [unknown, ...infer A extends unknown[]] ? A
  : never;

export type RestArgs<T> = Shift<Args<T>>;

// deno-fmt-ignore
export type Flatten<T, Deep = false, Infer = false> =
  | T extends Keyable
    ? Infer extends true 
      ? T extends infer U 
        ? Flatten<U, Deep, false> 
      : never
    : { [K in keyof T]: Deep extends true ? Flatten<T[K], true, Infer> : T[K] }
  : T;

export type PartialByKeys<T, K extends keyof T = keyof T, Deep = false> =
  Flatten<
    Optional<Pick<T, Extract<keyof T, K>>, Deep> & Omit<T, K>
  >;

export type RequiredByKeys<T, K extends keyof T = keyof T, Deep = false> =
  Flatten<
    Require<Pick<T, Extract<keyof T, K>>, Deep> & Omit<T, K>
  >;

// from lib.es5.d.ts

// interface TypedPropertyDescriptor<T> {
//   enumerable?: boolean;
//   configurable?: boolean;
//   writable?: boolean;
//   value?: T;
//   get?: () => T;
//   set?: (value: T) => void;
// }

export declare namespace Decorator {
  interface Class {
    (target: Function): Function | void;
    <T extends Function>(target: T): T | void;
  }

  interface Property {
    (target: Object, key: string | symbol): void;
    <T extends Object, K extends string | symbol>(
      target: T,
      propertyKey: K,
    ): void;
  }

  interface Method {
    (
      target: Object,
      key: string | symbol,
      desc: PropertyDescriptor,
    ): any | void;
    <T extends Object, K extends string | symbol, D>(
      target: T,
      propertyKey: K,
      descriptor: TypedPropertyDescriptor<D>,
    ): TypedPropertyDescriptor<D> | void;
  }

  interface Parameter {
    (target: Object, key: string | symbol, index: number): void;
    <T extends Object, K extends string | symbol, P extends number>(
      target: T,
      propertyKey: K,
      parameterIndex: P,
    ): void;
  }

  type Legacy = Class | Method | Property | Parameter;
}

export type Decorator =
  | Decorator.Class
  | Decorator.Method
  | Decorator.Property
  | Decorator.Parameter;

export type LegacyDecorator = Decorator.Legacy;