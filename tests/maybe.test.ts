import { Just, justs, justsOrNothing, Maybe, Nothing, nullableToMaybe } from "../src/maybe";

test("'isJust'", () => {
  const just = Just("hello").map((j) => j.length);

  expect(just.isJust()).toBe(true);
  expect(just.isNothing()).toBe(false);
});

test("'isNothing'", () => {
  const nothing = Nothing<string>().map((j) => j.length);

  expect(nothing.isNothing()).toBe(true);
  expect(nothing.isJust()).toBe(false);
});

test("'map'", () => {
  const just = Just("hello").map((j) => j.length);
  const nothing = Nothing<string>().map((j) => j.length);

  expect(just.isJust()).toBe(true);
  if (just.isJust()) expect(just.value).toBe(5);

  expect(nothing.isNothing()).toBe(true);
});

test("'bind'", () => {
  const just1 = Just(1).bind((j) => Just(j + 10));
  const just2 = Just(1).bind((_j) => Nothing());
  const just3 = Just("hey").bind((j) => Just(j.length + 10));
  const nothing1 = Nothing().bind((j) => Just(j));
  const nothing2 = Nothing().bind((_j) => Nothing());

  expect(just1.isJust()).toBe(true);
  if (just1.isJust()) expect(just1.value).toBe(11);

  expect(just3.isJust()).toBe(true);
  if (just3.isJust()) expect(just3.value).toBe(13);

  expect(just2.isJust()).toBe(false);
  expect(nothing1.isNothing()).toBe(true);
  expect(nothing2.isNothing()).toBe(true);
});

test("'fold'", () => {
  const just1 = Just("hello").fold(25, (j) => j.length);
  const just2 = Just("hello").fold("hello world!", (j) => j + " world");

  const nothing1 = Nothing().fold(25, (j) => j);
  const nothing2 = Nothing().fold("hello world!", (j) => j + " world");

  expect(just1).toBe(5);
  expect(just2).toBe("hello world");
  expect(nothing1).toBe(25);
  expect(nothing2).toBe("hello world!");
});

test("'otherwise'", () => {
  const just = Just("hello")
    .map((j) => j + " world!")
    .otherwise("hello world");

  const nothing = Nothing().otherwise("hello world!");

  expect(just).toBe("hello world!");
  expect(nothing).toBe("hello world!");
});

test("'onJust/onNothing' with `Just`", () => {
  let val = 0;
  const just = Just(1)
    .onJust((j) => (val = j))
    .onNothing(() => (val = 3));

  expect(val).toBe(1);
  expect(just.isJust()).toBe(true);
  if (just.isJust()) expect(just.value).toBe(1);
});

test("'onJust/onNothing' with `Nothing`", () => {
  let val = 0;
  const nothing = Nothing()
    .onJust((_x) => (val = 10))
    .onNothing(() => (val = 3));

  expect(val).toBe(3);
  expect(nothing.isNothing()).toBe(true);
});

test("'mapAsync'", async () => {
  const asyncFunc = (v: number) => new Promise((resolve) => resolve(v + 10));

  const just = await Just(1).mapAsync(asyncFunc);
  const nothing = await Nothing<number>().mapAsync(asyncFunc);

  expect(just.isJust()).toBe(true);
  if (just.isJust()) expect(just.value).toBe(11);

  expect(nothing.isNothing()).toBe(true);
});

test("'bindAsync'", async () => {
  const asyncFunc = (v: string) =>
    new Promise<Maybe<number>>((resolve) => resolve(Just(v.length + 1)));

  const just1 = await Just("hello world").bindAsync(asyncFunc);

  const just2 = await Just("hello world").bindAsync((_v) => {
    return new Promise<Maybe<number>>((resolve) => resolve(Nothing()));
  });

  const nothing = await Nothing<string>().bindAsync(asyncFunc);

  expect(just1.isJust()).toBe(true);
  if (just1.isJust()) expect(just1.value).toBe(12);

  expect(just2.isJust()).toBe(false);
  expect(nothing.isNothing()).toBe(true);
});

test("'foldAsync'", async () => {
  const asyncFunc = (v: string) => new Promise((resolve) => resolve(v.length + 1));

  const just = await Just("hello world").foldAsync(100, asyncFunc);
  const nothing = await Nothing<string>().foldAsync("default", asyncFunc);

  expect(just).toBe(12);
  expect(nothing).toBe("default");
});

test("'toEither'", () => {
  const eitherJust = Just("hello world").toEither("something went wrong..");
  const eitherNothing = Nothing<string>().toEither("something went wrong..");

  expect(eitherJust.isRight()).toBe(true);
  if (eitherJust.isRight()) expect(eitherJust.value).toBe("hello world");

  expect(eitherNothing.isLeft()).toBe(true);
  if (eitherNothing.isLeft()) expect(eitherNothing.reason).toBe("something went wrong..");
});

test("'justs'", () => {
  const maybes1 = [Nothing(), Nothing()];
  const maybes2 = [Just(1), Just(2)];
  const maybes3 = [Just(1), Just(2), Just(3), Nothing(), Just(5), Nothing()];

  expect(justs(maybes1)).toEqual([]);
  expect(justs(maybes2)).toEqual([1, 2]);
  expect(justs(maybes3)).toEqual([1, 2, 3, 5]);
});

test("'justsOrNothing'", () => {
  const maybes1 = [Nothing(), Nothing()];
  const maybes2 = [Just(1), Just(2)];
  const maybes3 = [Just(1), Just(2), Just(3), Nothing(), Just(5), Nothing()];

  const res1 = justsOrNothing(maybes1);
  const res2 = justsOrNothing(maybes2);
  const res3 = justsOrNothing(maybes3);

  expect(res1.isNothing()).toBe(true);

  expect(res2.isJust()).toBe(true);
  res2.onJust((js) => expect(js).toEqual([1, 2]));

  expect(res3.isNothing()).toBe(true);
});

test("'nullableToMaybe'", () => {
  let p: number | undefined = undefined;

  expect(nullableToMaybe(p).isNothing()).toBe(true);

  p = 10;
  const maybe = nullableToMaybe(p);

  expect(maybe.isJust()).toBe(true);
  maybe.onJust((j) => expect(j).toBe(10));
});
