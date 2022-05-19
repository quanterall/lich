import { Either, Left, Right } from "./either";

/**
 * The `Maybe` type encapsulates an optional value. A value of type `Maybe<J>`
 * either contains a value of type <J> (represented as `Just<J>`),
 * or it is empty (represented as `Nothing`). Using `Maybe` is a good way
 * to deal with errors or exceptional cases without resorting to drastic measures such as error.
 * The `Maybe` type is also a `monad`. It is a simple kind of error `monad`,
 * where all errors are represented by `Nothing`.
 * A richer error `monad` can be built using the `Either` type.
 */
export type Maybe<J> = Just<J> | Nothing<J>;

interface MaybeUtilities<J> {
  /**
   * Maps over a `Maybe` value. If the value is a `Just`, it will apply the given
   * function to the value. Otherwise, it will return the `Nothing`
   * that is already there.
   *
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
   *
   * @param f Transformer function
   * @example
   * const just = Just(" hello ").bind(nonEmptyString) // Just("hello")
   * const nothing = Just("   ").bind(nonEmptyString); // Nothing
   * const nothing2 = Nothing<string>().bind(nonEmptyString); // Nothing
   *
   * function safeTrim(s: string): Maybe<string> {
   *   const trimmedS = s.trim();
   *   if (trimmedS.length === 0) return Nothing();
   *
   *   return Just(trimmedS);
   * }
   */
  bind<T>(f: (j: J) => Maybe<T>): Maybe<T>;
  /**
   * Takes the value of the `Maybe`, if it is `Just` it will apply the given function
   * over it and return the result, if it is `Nothing` it will return the supplied
   * default value.
   *
   * @param onNothing Default value if the value of `Maybe` is `Nothing`
   * @param f Function
   * @example
   * const just = Just("hello world")
   * just.fold(100, (value) => value.length) // 11
   *
   * const nothing = Nothing()
   * nothing.fold(11, (value) => value.length) // 11
   */
  fold<T>(onNothing: T, f: (j: J) => T): T;
  /**
   * Maps over a `Maybe` value. If the value is a `Just`, it will apply the given
   * async function to the value. Otherwise, it will return the `Nothing`
   * that is already there.
   *
   * @param f Mapping async function
   */
  mapAsync<T>(f: (j: J) => Promise<T>): Promise<Maybe<T>>;
  /**
   * Takes the value of the `Maybe`, if it is `Just` it will apply the given async
   * function over it, returning a new `Maybe` of type `<T>`.
   * Otherwise it will return the `Nothing` that is already there.
   *
   * @param f Transformer async function
   */
  bindAsync<T>(f: (j: J) => Promise<Maybe<T>>): Promise<Maybe<T>>;
  /**
   * Takes the value of the `Maybe`, if it is `Just` it will apply the given async
   * function over it, if it is `Nothing` it will return the supplied default value.
   *
   * @param f Mapping async function
   * @param onNothing Default value if the value of `Maybe` is `Nothing`
   */
  foldAsync<T>(onNothing: T, f: (j: J) => Promise<T>): Promise<T>;
  /**
   * If the value of the `Maybe` is `Nothing` it will return the
   * supplied default value, if it is `Just` it will return it's value.
   *
   * @param onNothing Default value if the value of `Maybe` is `Nothing`
   * @example
   * const nothing = Nothing()
   * nothing.otherwise(11) // 11
   *
   * const just = Just(10)
   * just.otherwise(100) // 11
   */
  otherwise(onNothing: J): J;
  /**
   * Executes a callback function if the value of the `Maybe` is `Just` and returns the `Maybe`.
   *
   * @param f Callback function
   * @example
   * const just = Just(10)
   * just.onJust((value) => console.info(value)) // This will execute successfully.
   *
   * const nothing = Nothing()
   * nothing.onJust((value) => console.info(value)) // This `console.info` will not execute,
   * because we have a `Nothing`.
   */
  onJust(f: (j: J) => void): Maybe<J>;
  /**
   * Executes a callback function if the value of the `Maybe` is `Nothing` and returns the `Maybe`.
   *
   * @param f Callback function
   * @example
   * const nothing = Nothing()
   * nothing.onNothing((reason) => console.error(reason)) // This will execute successfully.
   *
   * const just = Just(10)
   * just.onNothing((reason) => console.error(reason)) // This `console.error` will not execute,
   * because we have a `Just`.
   */
  onNothing(f: () => void): Maybe<J>;
  /**
   * Checks if the `Maybe` is `Just`. If this checks to true, typescript will allow to access
   * the `value` key of the `Just`.
   *
   * @example
   * const just = Just(10)
   * // just.value <-- typescript will complain if you try to access `value` here.
   *
   * if (just.isJust()) {
   *   console.info(just.value) // Here typescript allows you to access the `value` field.
   * }
   *
   * // It works with `Nothing` as well
   * const nothing = Nothing()
   * if (!nothing.isJust()) {
   *   console.error("The 'Maybe' is 'Nothing'!!")
   * }
   */
  isJust(): this is Just<J>;
  /**
   * Checks if the `Maybe` is `Nothing`. If this checks to false, typescript will allow to access
   * the `value` key of the `Just`.
   *
   * @example
   * const nothing = Nothing()
   * if (nothing.isNothing()) {
   *   console.error("The 'Maybe' is 'Nothing'!!")
   * }
   *
   * // We can use it the opposite way to access the `value` key of a `Just`
   * const just = Just(10)
   * // just.value <-- typescript will complain if you try to access `value` here.
   *
   * if (!just.isLeft()) {
   *   console.info(just.value) // Here typescript allows you to access the `value` field.
   * }
   */
  isNothing(): this is Nothing<J>;
  /**
   * Takes a `Maybe` and with given default `Left` value, it will either
   * return `Right` if the `Maybe` was `Just`
   * or it will return `Left` with the provided default value
   * if the `Maybe` was `Nothing`.
   *
   * @param onNothing Default error value
   * @example
   * const either = Just(10).toEither("error") // Right(10)
   *
   * const either2 = Nothing().toEither("error") // Left("error")
   */
  toEither<L>(onNothing: L): Either<L, J>;
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
    mapAsync: async (_f) => Promise.resolve(Nothing()),
    bindAsync: async (_f) => Promise.resolve(Nothing()),
    foldAsync: async (j, _f) => Promise.resolve(j),
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

/**
 * Take a list of `Maybe`s and return all the `Just`s that are inside.
 *
 * @param ms A list of `Maybe`s
 * @returns A list with the values of the `Just`s
 * @example
 * const maybes = [Just(1), Just(2)]
 * justs(maybes) // [1, 2]
 *
 * const maybes1 = [Just(1), Nothing(), Just(3)]
 * justs(maybes1) // [1, 3]
 *
 * const maybes2 = [Nothing(), Nothing()]
 * justs(maybes2) // []
 */
export function justs<J>(ms: Maybe<J>[]): J[] {
  return ms.reduce((acc, m) => m.fold(acc, (j) => [...acc, j]), [] as J[]);
}

/**
 * Take a list of `Maybe`s and either return all `Just`s or a `Nothing`.
 *
 * @param ms A list of `Maybe`s
 * @returns `Maybe` with a list of all `Just` values
 * @example
 * const maybes = [Just(1), Just(2)]
 * sequenceMaybe(maybes) // Just([1, 2])
 *
 * const maybes1 = [Just(1), Nothing(), Just(3)]
 * sequenceMaybe(maybes1) // Nothing()
 *
 * const maybes2 = [Nothing(), Nothing()]
 * sequenceMaybe(maybes2) // Nothing()
 */
export function sequenceMaybe<J>(ms: Maybe<J>[]): Maybe<J[]> {
  const js: J[] = [];
  for (const m of ms) {
    if (m.isNothing()) return Nothing();
    js.push(m.value);
  }

  return Just(js);
}

/**
 * Takes a list of `Maybe`s and it returns either
 * a list with all `Just`s or a `Nothing` if there are no `Just`s in the list.
 *
 * @param ms A list of `Maybe`s
 * @returns `Maybe` with either all `Just`s or a `Nothing`.
 * @example
 * const justs = [Just(1), Just(2), Just(3)];
 * mergeMaybe(justs) // Just([1, 2, 3])
 *
 * const maybesWithNothing = [Just(1), Nothing(), Just(3)];
 * mergeMaybe(maybesWithNothing) // Right([1, 3])
 *
 * const maybesWithOnlyLefts = [Nothing(), Nothing(), Nothing()];
 * mergeMaybe(maybesWithOnlyLefts) // Nothing()
 */
export function mergeMaybe<J>(ms: Maybe<J>[]): Maybe<J[]> {
  const js: J[] = [];
  for (const m of ms) {
    if (m.isJust()) {
      js.push(m.value);
    }
  }

  if (js.length === 0) return Nothing();

  return Just(js);
}

/**
 * Takes a nullable value, if the value is not equal ot `null` or `undefined`
 * it returns `Just` with the value inside
 * otherwise it returns `Nothing`.
 *
 * @param j A nullable value, i.e. _value that can hold `null` or `undefined` or both_
 * @returns `Maybe` of the given value
 * @example
 * const p: number | undefined = undefined
 * nullableToMaybe(p) // Nothing()
 *
 * p = 10
 * nullableToMaybe(p) // Just(10)
 */
export function nullableToMaybe<J>(j: J | null | undefined): Maybe<J> {
  if (j === null || j === undefined) return Nothing();

  return Just(j);
}

/**
 * Takes a `throwable` function and executes it. If it throws return `Nothing`,
 * otherwise return `Just` with the result.
 *
 * @param f `throwable` function
 * @returns Maybe of the result
 */
export function maybeFromTry<J>(f: () => J): Maybe<J> {
  try {
    return Just(f());
  } catch (_e) {
    return Nothing();
  }
}

/**
 * Takes a `Promise` and wraps the result in an `Maybe`.
 *
 * @param p A `Promise`
 * @returns A `Just` with the result on promise resolve or `Nothing` on promise reject
 */
export async function maybeFromPromise<J>(p: Promise<J>): Promise<Maybe<J>> {
  return await p.then<Maybe<J>>((j) => Just(j)).catch((_e) => Nothing());
}

/**
 * Finds the first `Just` in a list of `Maybe`s
 *
 * @param ms List of `Maybe`s
 * @returns `Maybe` with the first `Just` or `Nothing`
 */
export function firstJust<J>(ms: Maybe<J>[]): Maybe<J> {
  for (const m of ms) {
    if (m.isJust()) return m;
  }

  return Nothing();
}

/**
 * Filter a list of elements where the predicate returns `Just`.
 *
 * @param ms List of `Maybe`s
 * @param predicate Function that takes an element of type `T` and returns a `Maybe` of type `U`
 * @returns List of all filtered elements
 */
export function filterMaybes<J, U>(ms: J[], predicate: (v: J) => Maybe<U>): J[] {
  return ms.reduce((acc, m) => {
    const value = predicate(m);

    return value.isJust() ? [...acc, m] : acc;
  }, [] as J[]);
}
