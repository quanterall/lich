import { Just, Maybe, Nothing } from "./maybe";
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
  bind<E, T>(f: (r: R) => Either<E, T>): Either<E, T>;
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
  bindAsync<E, T>(f: (r: R) => Promise<Either<E, T>>): Promise<Either<E, T>>;
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
  onLeft(f: () => void): Either<L, R>;
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
    toMaybe: () => Just(r),
    isRight: () => true,
    isLeft: () => false,
  };
}

export type Left<L, R> = {
  type: "Left";
} & EitherUtilities<L, R>;

export function Left<L, R>(): Either<L, R> {
  return {
    type: "Left",
    map: (_f) => Left(),
    bind: (_f) => Left(),
    fold: (d, _f) => d,
    mapAsync: async (_f) => Left(),
    bindAsync: async (_f) => Left(),
    foldAsync: async (d, _f) => d,
    onRight: () => Left(),
    onLeft: (f) => {
      f();
      return Left();
    },
    toMaybe: () => Nothing(),
    isRight: () => false,
    isLeft: () => true,
  };
}
