import { fromTry, Just, justs, Maybe, Nothing, nullableToMaybe, sequenceMaybe } from "../src/maybe";

describe("'isJust'", () => {
  test("should return 'true' when called on 'Just'", () => {
    expect(Just("hello world").isJust()).toBe(true);
  });

  test("should return 'false' when called on 'Nothing'", () => {
    expect(Nothing().isJust()).toBe(false);
  });
});

describe("'isNothing'", () => {
  test("should return 'true' when called on 'Nothing'", () => {
    expect(Nothing().isNothing()).toBe(true);
  });

  test("should return 'false' when called on 'Just'", () => {
    expect(Just("hello world").isNothing()).toBe(false);
  });
});

describe("'onJust'", () => {
  test("should call provided callback function when called on 'Just'", () => {
    let p = 0;
    const maybe = Just("hello world").onJust((j) => {
      p = j.length;
    });

    expect(maybe.isJust()).toBe(true);
    expect(maybe.isNothing()).toBe(false);
    expect(p).toBe(11);
  });

  test("should NOT call provided callback function when called on 'Nothing'", () => {
    let p = 0;
    const maybe = Nothing().onJust((_x) => (p = 11));

    expect(maybe.isJust()).toBe(false);
    expect(maybe.isNothing()).toBe(true);
    expect(p).toBe(0);
  });
});

describe("'onNothing'", () => {
  test("should call provided callback function when called on 'Nothing'", () => {
    let p = 0;
    const maybe = Nothing().onNothing(() => {
      p = 11;
    });

    expect(maybe.isJust()).toBe(false);
    expect(maybe.isNothing()).toBe(true);
    expect(p).toBe(11);
  });

  test("should NOT call provided callback function when called on 'Just'", () => {
    let p = 0;
    const maybe = Just("hello world").onNothing(() => (p = 11));

    expect(maybe.isJust()).toBe(true);
    expect(maybe.isNothing()).toBe(false);
    expect(p).toBe(0);
  });
});

describe("'map'", () => {
  test("should apply a given function over a value inside a 'Just'", () => {
    const maybe = Just("hello world").map((j) => j.length);

    expect(maybe.isJust()).toBe(true);
    expect(maybe.isNothing()).toBe(false);
    maybe.onJust((j) => expect(j).toBe(11));
  });

  test("should NOT call provided function on 'Nothing'", () => {
    let p = 0;
    const maybe = Nothing<string>().map((_j) => (p = 10));

    expect(maybe.isJust()).toBe(false);
    expect(maybe.isNothing()).toBe(true);
    expect(p).toBe(0);
  });
});

describe("'bind'", () => {
  test("should apply a given function over a value inside a 'Just'", () => {
    const maybe = Just("hello world").bind((j) => Just(j.length));

    expect(maybe.isJust()).toBe(true);
    expect(maybe.isNothing()).toBe(false);
    maybe.onJust((j) => expect(j).toBe(11));
  });

  test("should turn a 'Just' into a 'Noting' if the 'bind' function returns so", () => {
    const maybe = Just("hello world").bind((_) => Nothing());

    expect(maybe.isJust()).toBe(false);
    expect(maybe.isNothing()).toBe(true);
  });

  test("should NOT call provided function on 'Nothing'", () => {
    let p = 0;
    const maybe = Nothing().bind((_) => {
      p = 11;
      return Just(p);
    });

    expect(maybe.isJust()).toBe(false);
    expect(maybe.isNothing()).toBe(true);
    expect(p).toBe(0);
  });
});

describe("'fold'", () => {
  test("should apply a given function over a value on a 'Just' and return the result", () => {
    const value = Just("hello world").fold(100, (r) => r.length);
    expect(value).toBe(11);
  });

  test("should return the default value when called on 'Nothing'", () => {
    const value = Nothing<string>().fold(100, (r) => r.length);
    expect(value).toBe(100);
  });

  test("should NOT execute the given function and return the default value when called on 'Nothing'", () => {
    let p = 0;
    Nothing().fold(100, (r) => {
      p = 10;
      return 1000;
    });

    expect(p).toBe(0);
  });
});

describe("'otherwise'", () => {
  test("should return the value of a 'Just' when called on a 'Just'", () => {
    const maybe = Just("hello world").otherwise("hello world!!!");
    expect(maybe).toBe("hello world");
  });

  test("should return the provided default value when called on a 'Nothing'", () => {
    const maybe = Nothing().otherwise("hello world!!!");
    expect(maybe).toBe("hello world!!!");
  });
});

describe("'mapAsync'", () => {
  const asyncFunc = (r: string) => new Promise((resolve) => resolve(r.length));

  test("should apply a given function over a value inside a 'Just'", async () => {
    const maybe = await Just("hello world").mapAsync(asyncFunc);

    expect(maybe.isJust()).toBe(true);
    expect(maybe.isNothing()).toBe(false);
    maybe.onJust((r) => expect(r).toBe(11));
  });

  test("should not be called on 'Nothing'", async () => {
    const maybe = await Nothing<string>().mapAsync(asyncFunc);

    expect(maybe.isJust()).toBe(false);
    expect(maybe.isNothing()).toBe(true);
  });
});

describe("'bindAsync'", () => {
  test("should apply a given function over a value inside a 'Just'", async () => {
    const just = await Just("hello world").bindAsync(
      (r: string) => new Promise<Maybe<number>>((resolve) => resolve(Just(r.length))),
    );

    expect(just.isJust()).toBe(true);
    expect(just.isNothing()).toBe(false);
    just.onJust((r) => expect(r).toBe(11));
  });

  test("should turn a 'Just' into a 'Nothing' if the 'bind' function returns so", async () => {
    const maybe = await Just("hello world").bindAsync(
      (_r) => new Promise<Maybe<number>>((resolve) => resolve(Nothing())),
    );

    expect(maybe.isJust()).toBe(false);
    expect(maybe.isNothing()).toBe(true);
  });

  test("should NOT be called if called on 'Nothing'", async () => {
    let p = 0;
    const maybe = await Nothing().bindAsync(
      (_r) =>
        new Promise<Maybe<number>>((resolve) => {
          p = 10;
          resolve(Just(100));
        }),
    );

    expect(maybe.isJust()).toBe(false);
    expect(maybe.isNothing()).toBe(true);
    expect(p).toBe(0);
  });
});

describe("'foldAsync'", () => {
  const asyncFunc = (r: string) => new Promise((resolve) => resolve(r.length));

  test("should apply a given function over a value on a 'Just' and return the result", async () => {
    const value = await Just("hello world").foldAsync(100, asyncFunc);
    expect(value).toBe(11);
  });

  test("should return the default value when called on 'Nothing'", async () => {
    const value = await Nothing<string>().foldAsync(100, asyncFunc);
    expect(value).toBe(100);
  });

  test("should NOT call the given function when called on 'Nothing'", async () => {
    let p = 0;
    await Nothing().foldAsync(
      100,
      (_r) =>
        new Promise((resolve) => {
          p = 10;
          resolve(100);
        }),
    );
    expect(p).toBe(0);
  });
});

describe("'toEither'", () => {
  test("should return 'Right' when called on 'Just'", () => {
    const maybe = Just<string>("hello world")
      .map((r) => r.length)
      .toEither("default error");

    expect(maybe.isRight()).toBe(true);
    expect(maybe.isLeft()).toBe(false);
    maybe.onRight((r) => expect(r).toBe(11));
  });

  test("should return 'Left' with provided default reason when called on 'Nothing'", () => {
    const maybe = Nothing<string>()
      .map((r) => r.length)
      .toEither("default error");

    expect(maybe.isRight()).toBe(false);
    expect(maybe.isLeft()).toBe(true);
    maybe.onLeft((l) => expect(l).toBe("default error"));
  });
});

describe("'justs'", () => {
  test("should return all 'Just' values out of list of 'Maybe's with only 'Just's", () => {
    const maybes = [Just(1), Just(2)];
    expect(justs(maybes)).toEqual([1, 2]);
  });

  test("should return all 'Just' values out of list of 'Maybe's", () => {
    const maybes = [Just(1), Just(2), Just(3), Nothing(), Just(5), Nothing()];
    expect(justs(maybes)).toEqual([1, 2, 3, 5]);
  });

  test("should return an empty list when called on 'Maybe's with no 'Just's", () => {
    const maybes = [Nothing(), Nothing()];
    expect(justs(maybes)).toEqual([]);
  });
});

describe("sequenceMaybe", () => {
  test("should return an 'Just' with a list of 'Just's if all values are 'Just'", () => {
    const es = [Just(1), Just(2), Just(3)];
    const maybe = sequenceMaybe(es);

    expect(maybe.isJust()).toBe(true);
    expect(maybe.isNothing()).toBe(false);
    maybe.onJust((r) => expect(r).toEqual([1, 2, 3]));
  });

  test("should return on the first 'Nothing' it encounters if there is a 'Nothing'", () => {
    const es = [Just(1), Nothing(), Just(3), Nothing()];
    const maybe = sequenceMaybe(es);

    expect(maybe.isJust()).toBe(false);
    expect(maybe.isNothing()).toBe(true);
  });
});

describe("'nullableToMaybe", () => {
  test("should return 'Just' with it's value if it's not 'null' nor 'undefined'", () => {
    let p = 10;
    const maybe = nullableToMaybe(p);

    expect(maybe.isJust()).toBe(true);
    expect(maybe.isNothing()).toBe(false);
    maybe.onJust((j) => expect(j).toBe(10));
  });

  test("should return 'Nothing' with provided default reason when called on null", () => {
    let p: number | null = null;
    const maybe = nullableToMaybe(p);

    expect(maybe.isJust()).toBe(false);
    expect(maybe.isNothing()).toBe(true);
  });

  test("should return 'Nothing' with provided default reason when called on undefined", () => {
    let p: number | undefined = undefined;
    const maybe = nullableToMaybe(p);

    expect(maybe.isJust()).toBe(false);
    expect(maybe.isNothing()).toBe(true);
  });
});

describe("'fromTry'", () => {
  test("should return a 'Just' if no exception is thrown", () => {
    const p = 1;
    const maybe = fromTry(() => p.toPrecision(3));

    expect(maybe.isJust()).toBe(true);
    expect(maybe.isNothing()).toBe(false);
    maybe.onJust((j) => expect(j).toBe("1.00"));
  });

  test("should return a 'Nothing' if an exception is thrown", () => {
    const p = 1;
    const maybe = fromTry(() => p.toPrecision(300));

    expect(maybe.isJust()).toBe(false);
    expect(maybe.isNothing()).toBe(true);
  });
});
