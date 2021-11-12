/**
 * Maybe is a haskell structure defined to describe a value that we either have or not.
 * Hence we either have `Just<value>` or `Nothing`
 */
export type Maybe<T> = Just<T> | Nothing<T>;

interface MaybeUtilities<T> {
  /**
   * Maps over a `Maybe` value. If the value is a `Just`, it will apply the given
   * function to the value. Otherwise, it will return the `Nothing`
   * that is already there.
   * @param f Mapping function
   */
  map<U>(f: (t: T) => U): Maybe<U>;
  /**
   * Takes the value of the `Maybe`, if it is `Just` it will apply the given function
   * over it, returning a new `Maybe` of type `<U>`. Otherwise it will return the
   * `Nothing` that is already there.
   * @param f Transformer function
   */
  bind<U>(f: (t: T) => Maybe<U>): Maybe<U>;
  /**
   * Takes the value of the `Maybe`, if it is `Just` it will apply the given function
   * over it and return the result, if it is `Nothing` it will return the supplied
   * default value.
   * @param f Function
   * @param onNothing Default value if the value of `Maybe` is `Nothing`
   */
  fold<U>(onNothing: U, f: (t: T) => U): U;
  /**
   * Maps over a `Maybe` value. If the value is a `Just`, it will apply the given
   * async function to the value. Otherwise, it will return the `Nothing`
   * that is already there.
   * @param f Mapping async function
   */
  mapAsync<U>(f: (t: T) => Promise<U>): Promise<Maybe<U>>;
  /**
   * Takes the value of the `Maybe`, if it is `Just` it will apply the given async
   * function over it, returning a new `Maybe` of type `<U>`.
   * Otherwise it will return the `Nothing` that is already there.
   * @param f Transformer async function
   */
  bindAsync<U>(f: (t: T) => Promise<Maybe<U>>): Promise<Maybe<U>>;
  /**
   * Takes the value of the `Maybe`, if it is `Just` it will apply the given async
   * function over it, if it is `Nothing` it will return the supplied default value.
   * @param f Mapping async function
   * @param onNothing Default value if the value of `Maybe` is `Nothing`
   */
  foldAsync<U>(onNothing: U, f: (t: T) => Promise<U>): Promise<U>;
  /**
   * If the value of the `Maybe` is `Nothing` it will return a `Just`
   * with the supplied value, if it is `Just` it will return it
   * @param onNothing Default value if the value of `Maybe` is `Nothing`
   */
  otherwise(onNothing: T): T;
  /**
   * Executes a callback function if the value of the `Maybe` is `Just`
   * @param f Callback function
   */
  onJust(f: (t: T) => void): Maybe<T>;
  /**
   * Executes a callback function if the value of the `Maybe` is `Nothing`
   * @param f Callback function
   */
  onNothing(f: () => void): Maybe<T>;
  isJust(): this is Just<T>;
  isNothing(): this is Nothing<T>;
}

export type Just<T> = {
  type: "Just";
  value: T;
} & MaybeUtilities<T>;

export function Just<T>(t: T): Maybe<T> {
  return {
    type: "Just",
    value: t,
    map: (f) => Just(f(t)),
    bind: (f) => f(t),
    fold: (_t, f) => f(t),
    mapAsync: async (f) => Just(await f(t)),
    bindAsync: async (f) => await f(t),
    foldAsync: async (_t, f) => await f(t),
    onJust: (f) => {
      f(t);
      return Just(t);
    },
    onNothing: (_f) => Just(t),
    otherwise: (_t) => t,
    isJust: () => true,
    isNothing: () => false,
  };
}

export type Nothing<T> = {
  type: "Nothing";
} & MaybeUtilities<T>;

export function Nothing<T>(): Maybe<T> {
  return {
    type: "Nothing",
    map: (_f) => Nothing(),
    bind: (_f) => Nothing(),
    fold: (t, _f) => t,
    mapAsync: async (_f) => Nothing(),
    bindAsync: async (_f) => Nothing(),
    foldAsync: async (t, _f) => t,
    onJust: (_f) => Nothing(),
    onNothing: (f) => {
      f();
      return Nothing();
    },
    otherwise: (t) => t,
    isJust: () => false,
    isNothing: () => true,
  };
}
