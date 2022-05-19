import {
  Right,
  Left,
  Either,
  rights,
  lefts,
  firstRight,
  nullableToEither,
  sequenceEither,
  rightsOr,
  eitherFromTry,
  eitherFromPromise,
  mergeRights,
} from "../src/either";

describe("'isRight", () => {
  test("should return 'true' when called on 'Right'", () => {
    expect(Right("hello world").isRight()).toBe(true);
  });

  test("should return 'false' when called on 'Left'", () => {
    expect(Left("error").isRight()).toBe(false);
  });
});

describe("'isLeft'", () => {
  test("should return 'true' when called on 'Left'", () => {
    expect(Left("error").isLeft()).toBe(true);
  });

  test("should return 'false' when called on 'Right'", () => {
    expect(Right("hello world").isLeft()).toBe(false);
  });
});

describe("'onRight'", () => {
  test("should call a given callback function when called on 'Right'", () => {
    let p = 0;
    const either = Right("hello world");
    either.onRight((_) => (p = 10));

    expect(p).toBe(10);
  });

  test("should NOT call a given callback function when called on 'Left'", () => {
    let p = 0;
    const either = Left("some error");
    either.onRight((_) => (p = 10));

    expect(p).toBe(0);
  });
});

describe("'onLeft'", () => {
  test("should call a given callback function when called on 'Left'", () => {
    let p = 0;
    const either = Left("some error");
    either.onLeft((_) => (p = 10));

    expect(p).toBe(10);
  });

  test("should NOT call a given callback function when called on 'Right'", () => {
    let p = 0;
    const either = Right("hello world");
    either.onLeft((_) => (p = 10));

    expect(p).toBe(0);
  });
});

describe("'map'", () => {
  test("should apply a given function over a value inside a 'Right'", () => {
    const either = Right("hello").map((r) => r + " world");

    expect(either.isRight()).toBe(true);
    expect(either.isLeft()).toBe(false);
    either.onRight((r) => expect(r).toBe("hello world"));
  });

  test("should not be called on 'Left'", () => {
    let p = 0;
    const either = Left<string, string>("error").map((r) => {
      p = 10;
      return r + " world";
    });

    expect(p).toBe(0);
    expect(either.isRight()).toBe(false);
    expect(either.isLeft()).toBe(true);
    either.onLeft((l) => expect(l).toBe("error"));
  });
});

describe("'mapLeft'", () => {
  test("should apply a given function over a value inside a 'Left'", () => {
    const either = Left("some error").mapLeft((l) => `The error is: '${l}'`);

    expect(either.isRight()).toBe(false);
    expect(either.isLeft()).toBe(true);
    either.onLeft((l) => expect(l).toBe("The error is: 'some error'"));
  });

  test("should not be called on 'Right'", () => {
    let p = 0;
    const either = Right("hello world").mapLeft((l) => {
      p = 10;
      return l + " world";
    });

    expect(p).toBe(0);
    expect(either.isRight()).toBe(true);
    expect(either.isLeft()).toBe(false);
    either.onRight((r) => expect(r).toBe("hello world"));
  });
});

describe("'bind'", () => {
  test("should apply a given function over a value inside a 'Right'", () => {
    const either = Right("hello").bind((r) => Right(r + " world"));

    expect(either.isRight()).toBe(true);
    expect(either.isLeft()).toBe(false);
    either.onRight((r) => expect(r).toBe("hello world"));
  });

  test("should turn a 'Right' into a 'Left' if the 'bind' function returns so", () => {
    const either = Right("hello").bind((_) => Left("error"));

    expect(either.isRight()).toBe(false);
    expect(either.isLeft()).toBe(true);
    either.onLeft((l) => expect(l).toBe("error"));
  });

  test("should NOT call provided function on 'Left'", () => {
    let p = 0;
    const either = Left("error").bind((r) => {
      p = 10;
      return Right(r + " world");
    });

    expect(p).toBe(0);
    expect(either.isRight()).toBe(false);
    expect(either.isLeft()).toBe(true);
    either.onLeft((l) => expect(l).toBe("error"));
  });
});

describe("'fold'", () => {
  test("should apply a given function over a value on a 'Right' and return the result", () => {
    const value = Right<string, string>("hello world").fold(
      (l) => l.length,
      (r) => r.length,
    );
    expect(value).toBe(11);
  });

  test("should return the default value when called on 'Left'", () => {
    const value = Left<string, string>("error").fold(
      (l) => l.length,
      (r) => r.length,
    );
    expect(value).toBe(5);
  });

  test("should NOT execute 'onLeft' function when called on 'Right'", () => {
    let p = 0;
    Right<string, string>("hello world").fold(
      (_l) => {
        p = 10;
        return 1000;
      },
      (r) => r.length,
    );

    expect(p).toBe(0);
  });

  test("should NOT execute 'onRight' function when called on 'Left'", () => {
    let p = 0;
    Left<string, string>("error").fold(
      (l) => l.length,
      (_r) => {
        p = 10;
        return 1000;
      },
    );

    expect(p).toBe(0);
  });
});

describe("'otherwise'", () => {
  test("should return the value of a 'Right' when called on a 'Right'", () => {
    const either = Right("hello world").otherwise("hello world!!!");
    expect(either).toBe("hello world");
  });

  test("should return the provided default value when called on a 'Nothing'", () => {
    const either = Left("error").otherwise("hello world!!!");
    expect(either).toBe("hello world!!!");
  });
});

describe("'mapAsync'", () => {
  const asyncFunc = (r: string) => new Promise((resolve) => resolve(r.length));

  test("should apply a given function over a value inside a 'Right'", async () => {
    const either = await Right<string, string>("hello world").mapAsync(asyncFunc);

    expect(either.isRight()).toBe(true);
    expect(either.isLeft()).toBe(false);
    either.onRight((r) => expect(r).toBe(11));
  });

  test("should not be called on 'Left'", async () => {
    const either = await Left<string, string>("error").mapAsync(asyncFunc);

    expect(either.isRight()).toBe(false);
    expect(either.isLeft()).toBe(true);
    either.onLeft((l) => expect(l).toBe("error"));
  });
});

describe("'bindAsync'", () => {
  test("should apply a given function over a value inside a 'Right'", async () => {
    const either = await Right<string, string>("hello world").bindAsync(
      (r: string) => new Promise<Either<string, number>>((resolve) => resolve(Right(r.length))),
    );

    expect(either.isRight()).toBe(true);
    expect(either.isLeft()).toBe(false);
    either.onRight((r) => expect(r).toBe(11));
  });

  test("should turn a 'Right' into a 'Left' if the 'bind' function returns so", async () => {
    const either = await Right<string, string>("hello world").bindAsync(
      (_r) => new Promise<Either<string, number>>((resolve) => resolve(Left("error"))),
    );

    expect(either.isRight()).toBe(false);
    expect(either.isLeft()).toBe(true);
    either.onLeft((l) => expect(l).toBe("error"));
  });

  test("should NOT be called if called on 'Left'", async () => {
    let p = 0;
    const either = await Left<string, string>("error").bindAsync(
      (_r) =>
        new Promise<Either<string, number>>((resolve) => {
          p = 10;
          resolve(Right(100));
        }),
    );

    expect(either.isRight()).toBe(false);
    expect(either.isLeft()).toBe(true);
    either.onLeft((l) => expect(l).toBe("error"));
    expect(p).toBe(0);
  });
});

describe("'foldAsync'", () => {
  const asyncFunc = (r: string) => new Promise((resolve) => resolve(r.length));

  test("should apply a given function over a value on a 'Right' and return the result", async () => {
    const value = await Right<string, string>("hello world").foldAsync(asyncFunc, asyncFunc);
    expect(value).toBe(11);
  });

  test("should return the default value when called on 'Left'", async () => {
    const value = await Left<string, string>("error").foldAsync(asyncFunc, asyncFunc);
    expect(value).toBe(5);
  });

  test("should NOT call 'onLeft' function when called on 'Right'", async () => {
    let p = 0;
    await Right<string, string>("hello world").foldAsync(
      (_l) =>
        new Promise((resolve) => {
          p = 10;
          resolve(101);
        }),
      asyncFunc,
    );
    expect(p).toBe(0);
  });

  test("should NOT call 'onRight' function when called on 'Left'", async () => {
    let p = 0;
    await Left<string, string>("error").foldAsync(
      asyncFunc,
      (_r) =>
        new Promise((resolve) => {
          p = 10;
          resolve(101);
        }),
    );
    expect(p).toBe(0);
  });
});

describe("'toMaybe'", () => {
  test("should return 'Just' when called on 'Right'", () => {
    const maybe = Right<string, string>("hello world")
      .map((r) => r.length)
      .toMaybe();

    expect(maybe.isJust()).toBe(true);
    expect(maybe.isNothing()).toBe(false);
    maybe.onJust((j) => expect(j).toBe(11));
  });

  test("should return 'Nothing' when called on 'Left'", () => {
    const maybe = Left<string, string>("error")
      .map((r) => r.length)
      .toMaybe();

    expect(maybe.isJust()).toBe(false);
    expect(maybe.isNothing()).toBe(true);
  });
});

describe("'fromRight", () => {
  test("should return it's value when called on 'Right'", () => {
    const either = Right("hello world").fromRight("default value");
    expect(either).toBe("hello world");
  });

  test("should return provided default value when called on 'Left'", () => {
    const either = Left("error").fromRight("default value");
    expect(either).toBe("default value");
  });
});

describe("'fromLeft'", () => {
  test("should return it's reason when called on 'Left'", () => {
    const either = Left("error").fromLeft("default error");
    expect(either).toBe("error");
  });

  test("should return provided default value when called on 'Right'", () => {
    const either = Right("hello world").fromLeft("default error");
    expect(either).toBe("default error");
  });
});

describe("'rights'", () => {
  test("should return all 'Right' elements from a list of 'Either's", () => {
    const es = [Right(1), Right(2), Left("NaN"), Right(4), Right(5), Left("NaN"), Left("NaN")];
    expect(rights(es)).toEqual([1, 2, 4, 5]);
  });

  test("should return empty list if no 'Right' values are present", () => {
    const es = [Left("error"), Left("error"), Left("error")];
    expect(rights(es)).toEqual([]);
  });
});

describe("'rightsOr'", () => {
  test("should return all 'Right's from a list of 'Either's", () => {
    const es = [Right(1), Left("NaN"), Right(3)];
    const either = rightsOr(es, "default error");

    expect(either.isRight()).toBe(true);
    expect(either.isLeft()).toBe(false);
    either.onRight((r) => expect(r).toEqual([1, 3]));
  });

  test("should return a 'Left' with the provided default reason if all values are 'Left's", () => {
    const list = [Left("NaN"), Left("NaN"), Left("NaN")];
    const either = rightsOr(list, "default error");

    expect(either.isRight()).toBe(false);
    expect(either.isLeft()).toBe(true);
    either.onLeft((l) => expect(l).toEqual("default error"));
  });
});

describe("sequenceEither", () => {
  test("should return an 'Right' with a list of 'Right' if all values are 'Right's", () => {
    const list = [Right(1), Right(2), Right(3)];
    const either = sequenceEither(list);

    expect(either.isRight()).toBe(true);
    expect(either.isLeft()).toBe(false);
    either.onRight((r) => expect(r).toEqual([1, 2, 3]));
  });

  test("should return the first 'Left' it encounters if there is a 'Left'", () => {
    const es = [Right(1), Left("NaN1"), Right(3), Left("NaN2")];
    const either = sequenceEither(es);

    expect(either.isRight()).toBe(false);
    expect(either.isLeft()).toBe(true);
    either.onLeft((l) => expect(l).toBe("NaN1"));
  });

  test("should return the first 'Left' it there are only 'Left's", () => {
    const list = [Left("NaN0"), Left("NaN1"), Left("NaN2"), Left("NaN3")];
    const either = sequenceEither(list);

    expect(either.isRight()).toBe(false);
    expect(either.isLeft()).toBe(true);
    either.onLeft((l) => expect(l).toBe("NaN0"));
  });
});

describe("'firstRight'", () => {
  test("should return the first 'Right' out of list of 'Either's 1", () => {
    const es = [Left("NaN"), Left("NaN"), Right(3)];
    const either = firstRight(es, "default error");

    expect(either.isRight()).toBe(true);
    expect(either.isLeft()).toBe(false);
    either.onRight((r) => expect(r).toBe(3));
  });

  test("should return the first 'Right' out of list of 'Either's 2", () => {
    const es = [Right(1), Left("NaN"), Right(3)];
    const either = firstRight(es, "default error");

    expect(either.isRight()).toBe(true);
    expect(either.isLeft()).toBe(false);
    either.onRight((r) => expect(r).toBe(1));
  });

  test("should return a 'Left' with the provided default reason from a list of 'Either's with no 'Right's", () => {
    const es = [Left("NaN"), Left("NaN"), Left("NaN")];
    const either = firstRight(es, "default error");

    expect(either.isRight()).toBe(false);
    expect(either.isLeft()).toBe(true);
    either.onLeft((l) => expect(l).toBe("default error"));
  });
});

describe("'lefts'", () => {
  test("should return a list with all 'Left' reasons from a list of 'Either's", () => {
    const es = [Right(1), Left("NaN1"), Right(3), Right(4), Left("NaN2"), Left("NaN3")];
    expect(lefts(es)).toEqual(["NaN1", "NaN2", "NaN3"]);
  });

  test("should return an empty list from a list of 'Either's with no 'Left's", () => {
    const es = [Right(1), Right(2)];
    expect(lefts(es)).toEqual([]);
  });
});

describe("'nullableToEither", () => {
  test("should return 'Right' with it's value if it's not 'null' nor 'undefined'", () => {
    let p = 10;
    const either = nullableToEither(p, "default, error");

    expect(either.isRight()).toBe(true);
    expect(either.isLeft()).toBe(false);
    either.onRight((r) => expect(r).toBe(10));
  });

  test("should return 'Left' with provided default reason when called on null", () => {
    let p: number | null = null;
    const either = nullableToEither(p, "default error");

    expect(either.isRight()).toBe(false);
    expect(either.isLeft()).toBe(true);
    either.onLeft((l) => expect(l).toBe("default error"));
  });

  test("should return 'Left' with provided default reason when called on undefined", () => {
    let p: number | undefined = undefined;
    const either = nullableToEither(p, "default error");

    expect(either.isRight()).toBe(false);
    expect(either.isLeft()).toBe(true);
    either.onLeft((l) => expect(l).toBe("default error"));
  });
});

describe("'eitherFromTry'", () => {
  test("should return a 'Right' if no exception is thrown", () => {
    const p = 1;
    const either = eitherFromTry(() => p.toPrecision(3), "error");

    expect(either.isRight()).toBe(true);
    expect(either.isLeft()).toBe(false);
    either.onRight((r) => expect(r).toBe("1.00"));
  });

  test("should return a 'Left' with the default value if an exception is thrown", () => {
    const p = 1;
    const either = eitherFromTry(() => p.toPrecision(300), "error");

    expect(either.isRight()).toBe(false);
    expect(either.isLeft()).toBe(true);
    either.onLeft((l) => expect(l).toBe("error"));
  });
});

describe("'eitherFromPromise'", () => {
  test("should return a 'Right' if Promise resolves", async () => {
    const promise = new Promise<string>((resolve, _reject) => resolve("hello world"));

    const either = await eitherFromPromise(promise);
    expect(either.isRight()).toBe(true);
    expect(either.isLeft()).toBe(false);
    either.onRight((r) => expect(r).toBe("hello world"));
  });

  test("should return a 'Left' if Promise rejects", async () => {
    const promise = new Promise<string>((_resolve, reject) => reject("error"));

    const either = await eitherFromPromise<string, string>(promise);

    expect(either.isRight()).toBe(false);
    expect(either.isLeft()).toBe(true);
    either.onLeft((l) => expect(l).toBe("error"));
  });
});

describe("'mergeRights' should return", () => {
  test("'Right' if all elements are 'Right'", async () => {
    const rights = [Right(1), Right(2), Right(3)];
    const result = mergeRights(rights, "No valid numbers");

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    result.onRight((r) => expect(r).toEqual([1, 2, 3]));
  });

  test("'Right' if one element is 'Left', but the rest are 'Right'", async () => {
    const eithersWithLeft = [Right(1), Left("NaN"), Right(3)];
    const result = mergeRights(eithersWithLeft, "No valid numbers");

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    result.onRight((r) => expect(r).toEqual([1, 3]));
  });

  test("'Right' if one element is 'Right' and the rest are 'Left'", async () => {
    const eithersWithLeft = [Left("NaN"), Left("NaN"), Right(3)];
    const result = mergeRights(eithersWithLeft, "No valid numbers");

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    result.onRight((r) => expect(r).toEqual([3]));
  });

  test("'Left' if all element are 'Left'", async () => {
    const eithersWithOnlyLefts = [Left("NaN"), Left("NaN"), Left("NaN")];
    const result = mergeRights(eithersWithOnlyLefts, "No valid numbers");

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    result.onLeft((l) => expect(l).toEqual("No valid numbers"));
  });
});
