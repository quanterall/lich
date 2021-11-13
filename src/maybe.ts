import { Either, Left, Right } from "./either";

/**
 * The `Maybe` type encapsulates an optional value. A value of type `Maybe<J>`
 * either contains a value of type <J> (represented as `Just<J>`),
 * or it is empty (represented as `Nothing`). Using `Maybe` is a good way
 * to deal with errors or exceptional cases without resorting to drastic measures such as error.
 * The `Maybe` type is also a `monad`. It is a simple kind of error `monad`, where all errors are represented by `Nothing`.
 * A richer error `monad` can be built using the `Either` type.
 */
export type Maybe<J> = Just<J> | Nothing<J>;

interface MaybeUtilities<J> {
  /**
   * Maps over a `Maybe` value. If the value is a `Just`, it will apply the given
   * function to the value. Otherwise, it will return the `Nothing`
   * that is already there.
   * @param f Mapping function
   * @example
   * const just = Just("hello").map((j) => j.length) // returns Just(5)
   *
   * // Here we need to specify that the type is <string>
   * // so we can use `j.length` without ts compiler to complain
   * const nothing = Nothing<string>().map((j) => j.length) // returns Nothing()
   */
  map<T>(f: (j: J) => T): Maybe<T>;
  /**
   * Takes the value of the `Maybe`, if it is `Just` it will apply the given function
   * over it, returning a new `Maybe` of type `<T>`. Otherwise it will return the
   * `Nothing` that is already there.
   * @param f Transformer function
   * @example
   * const just = Just(" hello ").bind(nonEmptyString) // Just("hello")
   * const nothing = Just("   ").bind(nonEmptyString); // Nothing
   * const nothing2 = Nothing<string>().bind(nonEmptyString); // Nothing
   *
   * function nonEmptyString(s: string): Maybe<string> {
   *   const trimmedS = s.trim();
   *   if (trimmedS.length === 0) return Nothing();
   *
   *   return Just(trimmedS);
   *}
   */
  bind<T>(f: (j: J) => Maybe<T>): Maybe<T>;
  /**
   * Takes the value of the `Maybe`, if it is `Just` it will apply the given function
   * over it and return the result, if it is `Nothing` it will return the supplied
   * default value.
   * @param f Function
   * @param onNothing Default value if the value of `Maybe` is `Nothing`
   */
  fold<T>(onNothing: T, f: (j: J) => T): T;
  /**
   * Maps over a `Maybe` value. If the value is a `Just`, it will apply the given
   * async function to the value. Otherwise, it will return the `Nothing`
   * that is already there.
   * @param f Mapping async function
   */
  mapAsync<T>(f: (j: J) => Promise<T>): Promise<Maybe<T>>;
  /**
   * Takes the value of the `Maybe`, if it is `Just` it will apply the given async
   * function over it, returning a new `Maybe` of type `<T>`.
   * Otherwise it will return the `Nothing` that is already there.
   * @param f Transformer async function
   */
  bindAsync<T>(f: (j: J) => Promise<Maybe<T>>): Promise<Maybe<T>>;
  /**
   * Takes the value of the `Maybe`, if it is `Just` it will apply the given async
   * function over it, if it is `Nothing` it will return the supplied default value.
   * @param f Mapping async function
   * @param onNothing Default value if the value of `Maybe` is `Nothing`
   */
  foldAsync<T>(onNothing: T, f: (j: J) => Promise<T>): Promise<T>;
  /**
   * If the value of the `Maybe` is `Nothing` it will return a `Just`
   * with the supplied value, if it is `Just` it will return it
   * @param onNothing Default value if the value of `Maybe` is `Nothing`
   */
  otherwise(onNothing: J): J;
  /**
   * Executes a callback function if the value of the `Maybe` is `Just`
   * @param f Callback function
   */
  onJust(f: (j: J) => void): Maybe<J>;
  /**
   * Executes a callback function if the value of the `Maybe` is `Nothing`
   * @param f Callback function
   */
  onNothing(f: () => void): Maybe<J>;
  isJust(): this is Just<J>;
  isNothing(): this is Nothing<J>;
  toEither<L>(l: L): Either<L, J>;
}

export type Just<J> = {
  type: "Just";
  value: J;
} & MaybeUtilities<J>;

export function Just<J>(j: J): Maybe<J> {
  return {
    type: "Just",
    value: j,
    map: (f) => Just(f(j)),
    bind: (f) => f(j),
    fold: (_t, f) => f(j),
    mapAsync: async (f) => Just(await f(j)),
    bindAsync: async (f) => await f(j),
    foldAsync: async (_t, f) => await f(j),
    onJust: (f) => {
      f(j);
      return Just(j);
    },
    onNothing: (_f) => Just(j),
    otherwise: (_t) => j,
    isJust: () => true,
    isNothing: () => false,
    toEither: (_l) => Right(j),
  };
}

export type Nothing<J> = {
  type: "Nothing";
} & MaybeUtilities<J>;

export function Nothing<J>(): Maybe<J> {
  return {
    type: "Nothing",
    map: (_f) => Nothing(),
    bind: (_f) => Nothing(),
    fold: (j, _f) => j,
    mapAsync: async (_f) => Nothing(),
    bindAsync: async (_f) => Nothing(),
    foldAsync: async (j, _f) => j,
    onJust: (_f) => Nothing(),
    onNothing: (f) => {
      f();
      return Nothing();
    },
    otherwise: (j) => j,
    isJust: () => false,
    isNothing: () => true,
    toEither: (l) => Left(l),
  };
}

export function justs<J>(ms: Maybe<J>[]): J[] {
  return ms.reduce((acc, m) => m.fold(acc, (j) => [...acc, j]), [] as J[]);
}
