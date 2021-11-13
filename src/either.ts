import { Just, Maybe, Nothing } from "./maybe";
export type Either<L, R> = Left<L, R> | Right<L, R>;

interface EitherUtilities<L, R> {
  map<T>(f: (r: R) => T): Either<L, T>;
  bind<E, T>(f: (r: R) => Either<E, T>): Either<E, T>;
  fold<T>(defaultR: T, f: (r: R) => T): T;
  mapAsync<T>(f: (r: R) => Promise<T>): Promise<Either<L, T>>;
  bindAsync<E, T>(f: (r: R) => Promise<Either<E, T>>): Promise<Either<E, T>>;
  foldAsync<T>(defaultR: T, f: (r: R) => Promise<T>): Promise<T>;
  onRight(f: (r: R) => void): Either<L, R>;
  onLeft(f: () => void): Either<L, R>;
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
    fold: (_default, f) => f(r),
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
