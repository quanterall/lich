import { Just, Maybe, Nothing } from "./maybe";

/**
 * The `Either` type represents values with two possibilities:
 * a value of type `Either<L, R>` is either `Left` with error type `<L>`
 * or `Right` with value type `<R>`.
 * The `Either` type is sometimes used to represent a value which is either correct or an error;
 * by convention, the `Left` constructor is used to hold an error value and
 * the `Right` constructor is used to hold a correct value (mnemonic: "right" also means "correct").
 */
export type Either<L, R> = Left<L, R> | Right<L, R>;

interface EitherUtilities<L, R> {
  /**
   * Maps over a `Either` value. If the value is a `Right`, it will apply the given
   * function to the value. Otherwise, it will return the `Left` that is already there.
   * @param f Mapping function
   */
  map<T>(f: (r: R) => T): Either<L, T>;
  /**
   * Takes the value of the `Either`, if it is `Right` it will apply the given function
   * over it, returning a new `Either` of type `<T>`. Otherwise it will return the
   * `Left` that is already there.
   * @param f Transformer function
   */
  bind<T>(f: (r: R) => Either<L, T>): Either<L, T>;
  /**
   * Takes the value of the `Either`, if it is `Right` it will apply the given function
   * over it and return the result, if it is `Left` it will return the supplied
   * default value.
   * @param f Function
   * @param onNothing Default value if the value of `Either` is `Left`
   */
  fold<T>(defaultR: T, f: (r: R) => T): T;
  /**
   * Maps over a `Either` value. If the value is a `Right`, it will apply the given
   * async function to the value. Otherwise, it will return the `Left`
   * that is already there.
   * @param f Mapping async function
   */
  mapAsync<T>(f: (r: R) => Promise<T>): Promise<Either<L, T>>;
  /**
   * Takes the value of the `Either`, if it is `Right` it will apply the given async
   * function over it, returning a new `Either` of type `<U>`.
   * Otherwise it will return the `Left` that is already there.
   * @param f Transformer async function
   */
  bindAsync<T>(f: (r: R) => Promise<Either<L, T>>): Promise<Either<L, T>>;
  /**
   * Takes the value of the `Either`, if it is `Right` it will apply the given async
   * function over it, if it is `Left` it will return the supplied default value.
   * @param f Mapping async function
   * @param onNothing Default value if the value of `Either` is `Left`
   */
  foldAsync<T>(defaultR: T, f: (r: R) => Promise<T>): Promise<T>;
  /**
   * Executes a callback function if the value of the `Either` is `Right`
   * @param f Callback function
   */
  onRight(f: (r: R) => void): Either<L, R>;
  /**
   * Executes a callback function if the value of the `Either` is `Left`
   * @param f Callback function
   */
  onLeft(f: (l: L) => void): Either<L, R>;
  fromRight(d: R): R;
  fromLeft(d: L): L;
  /**
   * Transforms `Either` type to `Maybe`. If it's a `Right` it will return
   * a `Just` with the same value inside. If it's a `Left` it will return
   * Nothing.
   */
  toMaybe(): Maybe<R>;
  isRight(): this is Right<L, R>;
  isLeft(): this is Left<L, R>;
}

export type Right<L, R> = {
  type: "Right";
  value: R;
} & EitherUtilities<L, R>;

export function Right<L, R>(r: R): Either<L, R> {
  return {
    type: "Right",
    value: r,
    map: (f) => Right(f(r)),
    bind: (f) => f(r),
    fold: (_d, f) => f(r),
    mapAsync: async (f) => Right(await f(r)),
    bindAsync: async (f) => await f(r),
    foldAsync: async (_d, f) => await f(r),
    onRight: (f) => {
      f(r);
      return Right(r);
    },
    onLeft: () => Right(r),
    fromRight: (_d) => r,
    fromLeft: (d) => d,
    toMaybe: () => Just(r),
    isRight: () => true,
    isLeft: () => false,
  };
}

export type Left<L, R> = {
  type: "Left";
  reason: L;
} & EitherUtilities<L, R>;

export function Left<L, R>(l: L): Either<L, R> {
  return {
    type: "Left",
    reason: l,
    map: (_f) => Left(l),
    bind: (_f) => Left(l),
    fold: (d, _f) => d,
    mapAsync: async (_f) => Left(l),
    bindAsync: async (_f) => Left(l),
    foldAsync: async (d, _f) => d,
    onRight: () => Left(l),
    onLeft: (f) => {
      f(l);
      return Left(l);
    },
    fromRight: (d) => d,
    fromLeft: (_d) => l,
    toMaybe: () => Nothing(),
    isRight: () => false,
    isLeft: () => true,
  };
}

export function rights<L, R>(es: Either<L, R>[]): R[] {
  return es.reduce((acc, e) => e.fold(acc, (r) => [...acc, r]), [] as R[]);
}

export function rightsOrLeft<L, R>(es: Either<L, R>[], onAllLefts: L): Either<L, R[]> {
  const allRights = rights(es);
  if (allRights.length === 0) return Left(onAllLefts);

  return Right(allRights);
}

export function lefts<L, R>(es: Either<L, R>[]): L[] {
  return es.reduce((acc, e) => {
    if (e.isLeft()) return [...acc, e.reason];

    return acc;
  }, [] as L[]);
}
