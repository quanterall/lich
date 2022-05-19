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
   *
   * @param f Mapping function
   * @example
   * const right = Right("hello world")
   * right.map((value) => value.length) // Right(11)
   *
   * const left = Left("string is empty")
   * left.map((value) => value.length) // Left("string is empty")
   */
  map<T>(f: (r: R) => T): Either<L, T>;
  /**
   * Maps over a `Either` value. If the value is a `Right`, it will apply the given
   * function to the value. Otherwise, it will return the `Left` that is already there.
   *
   * @param f Mapping function
   * @example
   * const left = Left("string is empty")
   * left.map((e) => `error: '${e}'`) // Left("error: 'string is empty'")
   *
   * const right = Right("hello world")
   * right.mapLeft((e) => `this is critical error: '${e}'`) // Right("hello world")
   */
  mapLeft<T>(f: (l: L) => T): Either<T, R>;
  /**
   * Takes the value of the `Either`, if it is `Right` it will apply the given function
   * over it, returning a new `Either` of type `<T>`. Otherwise it will return the
   * `Left` that is already there.
   *
   * @param f Transformer function
   * @example
   * const right = Right(" hello world  ")
   * right.bind(safeTrim) // Right("hello world")
   *
   * const right1 = Right("   ")
   * right1.bind(safeTrim) // Left("string is empty")
   *
   * const left = Left("unable to fetch string from function..")
   * left.bind(safeTrim) // Left("unable to fetch string from function..")
   *
   * function safeTrim(s: string): Either<string, string> {
   *   const trimmedS = s.trim();
   *   if (trimmedS.length === 0) return Left("string is empty");
   *
   *   return Right(trimmedS);
   * }
   */
  bind<T>(f: (r: R) => Either<L, T>): Either<L, T>;
  /**
   * Takes the value of the `Either`, and applies the appropriate function
   * depending on the type of the `Either`.
   *
   * @param onLeft Function called if `Either` is `Left`
   * @param onRight Function called if `Either` is `Right`
   * @example
   * const right = Right("hello world")
   * right.fold(100, (value) => value.length) // 11
   *
   * const left = Left("string is empty")
   * left.fold(11, (value) => value.length) // 11
   */
  fold<T>(onLeft: (l: L) => T, onRight: (r: R) => T): T;
  /**
   * Maps over a `Either` value. If the value is a `Right`, it will apply the given
   * async function to the value. Otherwise, it will return the `Left`
   * that is already there.
   *
   * @param f Mapping async function
   */
  mapAsync<T>(f: (r: R) => Promise<T>): Promise<Either<L, T>>;
  /**
   * Takes the value of the `Either`, if it is `Right` it will apply the given async
   * function over it, returning a new `Either` of type `<U>`.
   * Otherwise it will return the `Left` that is already there.
   *
   * @param f Transformer async function
   */
  bindAsync<T>(f: (r: R) => Promise<Either<L, T>>): Promise<Either<L, T>>;
  /**
   * Takes the value of the `Either`, if it is `Right` it will apply the given async
   * function over it, if it is `Left` it will return the supplied default value.
   *
   * @param f Mapping async function
   * @param onNothing Default value if the value of `Either` is `Left`
   */
  foldAsync<T>(onLeft: (l: L) => Promise<T>, onRight: (r: R) => Promise<T>): Promise<T>;
  /**
   * If the value of the `Either` is `Left` it will return the
   * supplied default value, if it is `Right` it will return it's value.
   *
   * @param onNothing Default return value if the `Either` is `Left`
   * @example
   * const either1 = Left("error")
   * either1.otherwise(11) // 11
   *
   * const either2 = Right(10)
   * either2.otherwise(100) // 11
   */
  otherwise(onLeft: R): R;
  /**
   * Executes a callback function if the value of the `Either` is `Right` and returns the `Either`.
   *
   * @param f Callback function
   * @example
   * const right = Right(10)
   * right.onRight((value) => console.info(value)) // This will execute successfully.
   *
   * const left = Left("my error goes here..")
   * left.onRight((value) => console.info(value)) // This `console.info` will not execute,
   * because we have a `Left`.
   */
  onRight(f: (r: R) => void): Either<L, R>;
  /**
   * Executes a callback function if the value of the `Either` is `Left` and returns the `Either`.
   *
   * @param f Callback function
   * @example
   * const left = Left("my error goes here..")
   * left.onLeft((reason) => console.error(reason)) // This will execute successfully.
   *
   * const right = Right(10)
   * right.onLeft((reason) => console.error(reason)) // This `console.error` will not execute,
   * because we have a `Right`.
   */
  onLeft(f: (l: L) => void): Either<L, R>;
  /**
   * Return the contents of a `Right` value or a default value otherwise.
   *
   * @param d default value if `Either` is `Left`
   * @example
   * const right = Right("hello world".length)
   * right.fromRight(100) // 11
   *
   * const left = Left("my reason goes here..")
   * left.fromRight(11) // 11
   */
  fromRight(d: R): R;
  /**
   * Return the contents of a `Left` value or a default value otherwise.
   *
   * @param d default value if `Either` is `Right`
   * @example
   * const left = Left("my reason goes here..")
   * left.fromLeft("another reason if this was 'Right'") // "my reason goes here.."
   *
   * const right = Right(10)
   * right.fromLeft("default value if 'Either' is 'Right'") // "default value if 'Either' is 'Right'"
   */
  fromLeft(d: L): L;
  /**
   * Checks if the `Either` is `Right`. If this checks to true, typescript will allow to access
   * the `value` key of the `Right`.
   *
   * @example
   * const right = Right(10)
   * // right.value <-- typescript will complain if you try to access `value` here.
   *
   * if (right.isRight()) {
   *   console.info(right.value) // Here typescript allows you to access the `value` field.
   * }
   *
   * // The other way works as well
   * const left = Left("some error reason..")
   * // left.reason <-- typescript will complain if you try to access `reason` here.
   *
   * if (!left.isRight()) {
   *   console.error(left.reason) // Here typescript allows you to access the `reason` field.
   * }
   */
  isRight(): this is Right<L, R>;
  /**
   * Checks if the `Either` is `Left`. If this checks to true, typescript will allow to access
   * the `reason` key of the `Left`.
   *
   * @example
   * const left = Left("some error reason..")
   * // left.reason <-- typescript will complain if you try to access `reason` here.
   *
   * if (left.isLeft()) {
   *   console.error(left.reason) // Here typescript allows you to access the `reason` field.
   * }
   *
   * // The other way works as well
   * const right = Right(10)
   * // right.value <-- typescript will complain if you try to access `value` here.
   *
   * if (!right.isLeft()) {
   *   console.info(right.value) // Here typescript allows you to access the `value` field.
   * }
   */
  isLeft(): this is Left<L, R>;
  /**
   * Transforms `Either` type to `Maybe`. If it's a `Right` it will return
   * a `Just` with the same value inside. If it's a `Left` it will return Nothing.
   *
   * @example
   * const right = Right(10)
   * const maybe = right.toMaybe() // Just(10)
   *
   * const left = Left("some reason here..")
   * const nothing = left.toMaybe() // Nothing()
   */
  toMaybe(): Maybe<R>;
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
    mapLeft: (_f) => Right(r),
    bind: (f) => f(r),
    fold: (_, f) => f(r),
    mapAsync: async (f) => Right(await f(r)),
    bindAsync: async (f) => await f(r),
    foldAsync: async (_, f) => await f(r),
    otherwise: (_) => r,
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
    map: (_) => Left(l),
    mapLeft: (f) => Left(f(l)),
    bind: (_) => Left(l),
    fold: (f, _) => f(l),
    mapAsync: async (_) => Promise.resolve(Left(l)),
    bindAsync: async (_) => Promise.resolve(Left(l)),
    foldAsync: async (f, _) => await f(l),
    otherwise: (d) => d,
    onRight: () => Left(l),
    onLeft: (f) => {
      f(l);

      return Left(l);
    },
    fromRight: (d) => d,
    fromLeft: (_) => l,
    toMaybe: () => Nothing(),
    isRight: () => false,
    isLeft: () => true,
  };
}

/**
 * Take a list of `Either`s and return all the `Right`s that are inside.
 *
 * @param es A list of `Either`s
 * @returns A list with the values of the `Right`s
 * @example
 * const eithers = [Right(1), Right(2)]
 * rights(eithers) // [1, 2]
 *
 * const eithers1 = [Right(1), Left("error"), Right(3)]
 * rights(eithers1) // [1, 3]
 *
 * const eithers2 = [Left("error"), Left("error 2")]
 * rights(eithers2) // []
 */
export function rights<L, R>(es: Either<L, R>[]): R[] {
  return es.reduce(
    (acc, e) =>
      e.fold(
        () => acc,
        (r) => [...acc, r],
      ),
    [] as R[],
  );
}

/**
 * Takes a list of `Either`s and a default error value and return an `Either` with
 * either all `Right`s or a `Left` with the default error value.
 *
 * @param es A list of `Either`s
 * @param onAllLefts Default error value if there is not a single `Right`
 * @returns `Either` with either all `Right`s or a default `Left`
 * @example
 * const eithers = [Left("NaN"), Right(2), Right(3), Left("NaN")]
 * rightsOr(eithers, "all empty") // Right([2, 3])
 *
 * const eithers2 = [Left("NaN"), Left("NaN")]
 * rightsOr(eithers2, "all empty") // Left("all empty")
 */
export function rightsOr<L, R>(es: Either<L, R>[], onAllLefts: L): Either<L, R[]> {
  const allRights = rights(es);
  if (allRights.length === 0) return Left(onAllLefts);

  return Right(allRights);
}

/**
 * Takes a list of `Either`s and it returns either
 * a list with all `Right`s
 * or the first `Left` that it encounters.
 *
 * @param es A list of `Either`s
 * @returns `Either` with either all `Right`s or the first `Left`
 * @example
 * const rights = [Right(1), Right(2), Right(3)];
 * sequenceEither(rights) // Right([1, 2, 3])
 *
 * const eithers = [Right(1), Left("NaN"), Right(3)];
 * sequenceEither(eithers) // Left("NaN")
 */
export function sequenceEither<L, R>(es: Either<L, R>[]): Either<L, R[]> {
  const rs: R[] = [];
  for (const e of es) {
    if (e.isLeft()) return Left(e.reason);
    rs.push(e.value);
  }

  return Right(rs);
}

/**
 * Takes a list of `Either`s and it returns either
 * a list with all `Right`s or a `Left` with the provided error
 * if there are no `Right`s in the list.
 *
 * @param es A list of `Either`s
 * @returns `Either` with either all `Right`s or a `Left` with the provided error
 * @example
 * const rights = [Right(1), Right(2), Right(3)];
 * mergeEither(rights, "No valid numbers") // Right([1, 2, 3])
 *
 * const eithersWithLeft = [Right(1), Left("NaN"), Right(3)];
 * mergeEither(eithersWithLeft, "No valid numbers") // Right([1, 3])
 *
 * const eithersWithOnlyLefts = [Left("NaN"), Left("NaN"), Left("NaN")];
 * mergeEither(eithersWithOnlyLefts, "No valid numbers") // Left("No numbers")
 */
export function mergeEither<L, R>(es: Either<L, R>[], errorOnAllFailure: L): Either<L, R[]> {
  const rs: R[] = [];
  for (const e of es) {
    if (e.isRight()) {
      rs.push(e.value);
    }
  }

  if (rs.length === 0) return Left(errorOnAllFailure);

  return Right(rs);
}

/**
 * Takes a list of `Either`s and a default error value and returns
 * either the first `Right` that it finds
 * or a `Left` with the default error value if all are `Left`s.
 *
 * @param es A list of `Either`s
 * @param onAllLeft Default error value if all are `Left`s
 * @returns Either the first `Right` or a `Left` with the provided default error value
 * @example
 * const eithers = [Left("NaN"), Left("NaN"), Right(1), Right(2)]
 * firstRight(eithers, "all are left") // Right(1)
 *
 * const eithers2 = [Left("NaN"), Left("NaN")]
 * firstRight(eithers2, "all are left") // Left("all are left")
 */
export function firstRight<L, R>(es: Either<L, R>[], onAllLeft: L): Either<L, R> {
  for (const e of es) {
    if (e.isRight()) return e;
  }

  return Left(onAllLeft);
}

/**
 * Fetches all `Left`s from a list of `Either`s.
 *
 * @param es A list of `Either`s
 * @returns All `Left`s
 * @example
 * const eithers = [Left("NaN"), Right(2), Left("NaN")]
 * lefts(eithers) // ["NaN", "NaN"]
 *
 * const eithers2 = [Right(1), Right(2), Right(3)]
 * lefts(eithers2) // []
 */
export function lefts<L, R>(es: Either<L, R>[]): L[] {
  return es.reduce((acc, e) => {
    if (e.isRight()) return acc;

    return [...acc, e.reason];
  }, [] as L[]);
}

/**
 * Takes a nullable value and a default error value,
 * if the value is not equal ot `null` or `undefined` it returns `Right` with the value inside
 * otherwise it returns `Left` with the provided default error value.
 *
 * @param r A nullable value, i.e. _value that can hold `null` or `undefined` or both_
 * @param onNullable Default error value if the value is nullable
 * @returns `Either` with the value or the default error
 * @example
 * const p: number | undefined = undefined
 * nullableToEither(p, "still undefined") // Left("still undefined")
 *
 * p = 10
 * nullableToEither(p) // Right(10)
 */
export function nullableToEither<L, R>(r: R | null | undefined, onNullable: L): Either<L, R> {
  if (r === null || r === undefined) return Left(onNullable);

  return Right(r);
}

/**
 * Takes a `throwable` function and a default value. When executing the given function
 * if it throws return `Left` with the provided default value,
 * otherwise return `Right` with the result.
 *
 * @param f `throwable` function
 * @returns Either of the result
 */
export function eitherFromTry<L, R>(f: () => R, onCatch: L): Either<L, R> {
  try {
    return Right(f());
  } catch (_e) {
    return Left(onCatch);
  }
}

/**
 * Takes a `Promise` and wraps the result in an `Either`.
 *
 * @param p A `Promise`
 * @returns A `Right` with the result on promise resolve or `Left` on promise reject
 */
export async function eitherFromPromise<L, R>(p: Promise<R>): Promise<Either<L, R>> {
  return await p.then<Either<L, R>>((r) => Right(r)).catch((l) => Left(l));
}
