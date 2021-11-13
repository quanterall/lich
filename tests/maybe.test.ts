import { Just, Maybe, Nothing } from "../src/maybe";

test("'isJust'", () => {
  const just = Just(1).map((_x) => 2);

  expect(just.isJust()).toBe(true);
  expect(just.isNothing()).toBe(false);
});

test("'isNothing'", () => {
  const nothing = Nothing().map((_x) => 2);

  expect(nothing.isNothing()).toBe(true);
  expect(nothing.isJust()).toBe(false);
});

test("'map'", () => {
  const just = Just("hello").map((x) => x.length);
  const nothing = Nothing<string>().map((x) => x.length);

  expect(just.isJust()).toBe(true);
  if (just.isJust()) expect(just.value).toBe(5);

  expect(nothing.isNothing()).toBe(true);
});

test("'bind'", () => {
  const just1 = Just(1).bind((x) => Just(x + 10));
  const just2 = Just(1).bind((_x) => Nothing());
  const just3 = Just("hey").bind((x) => Just(x.length + 10));
  const nothing1 = Nothing().bind((x) => Just(x));
  const nothing2 = Nothing().bind((_x) => Nothing());

  expect(just1.isJust()).toBe(true);
  if (just1.isJust()) expect(just1.value).toBe(11);

  expect(just3.isJust()).toBe(true);
  if (just3.isJust()) expect(just3.value).toBe(13);

  expect(just2.isJust()).toBe(false);
  expect(nothing1.isNothing()).toBe(true);
  expect(nothing2.isNothing()).toBe(true);
});

test("'fold'", () => {
  const just1 = Just("hello").fold(25, (x) => x.length);
  const just2 = Just("hello").fold("hello world!", (x) => x + " world");

  const nothing1 = Nothing().fold(25, (x) => x);
  const nothing2 = Nothing().fold("hello world!", (x) => x + " world");

  expect(just1).toBe(5);
  expect(just2).toBe("hello world");
  expect(nothing1).toBe(25);
  expect(nothing2).toBe("hello world!");
});

test("'otherwise'", () => {
  const just = Just("hello")
    .map((x) => x + " world!")
    .otherwise("hello world");

  const nothing = Nothing().otherwise("hello world!");

  expect(just).toBe("hello world!");
  expect(nothing).toBe("hello world!");
});

test("'onJust'", () => {
  let a: number = 0;
  const just = Just(1)
    .onJust((x) => (a = x))
    .onNothing(() => (a = 3));

  expect(a).toBe(1);
  expect(just.isJust()).toBe(true);
  if (just.isJust()) expect(just.value).toBe(1);
});

test("'onNothing'", () => {
  let a = 0;
  const nothing = Nothing()
    .onJust((_x) => (a = 10))
    .onNothing(() => (a = 3));

  expect(a).toBe(3);
  expect(nothing.isNothing()).toBe(true);
});

test("'mapAsync'", async () => {
  const just = await Just(1).mapAsync((v) => {
    return new Promise((resolve) => resolve(v + 10));
  });

  const nothing = await Nothing().mapAsync((_v) => {
    return new Promise((resolve) => resolve(1));
  });

  expect(just.isJust()).toBe(true);
  if (just.isJust()) expect(just.value).toBe(11);

  expect(nothing.isNothing()).toBe(true);
});

test("'bindAsync'", async () => {
  const just1 = await Just("hello world").bindAsync((v) => {
    return new Promise<Maybe<number>>((resolve) => resolve(Just(v.length + 1)));
  });

  const just2 = await Just("hello world").bindAsync((_v) => {
    return new Promise<Maybe<number>>((resolve) => resolve(Nothing()));
  });

  const nothing = await Nothing().bindAsync((_v) => {
    return new Promise<Maybe<number>>((resolve) => resolve(Just(10)));
  });

  expect(just1.isJust()).toBe(true);
  if (just1.isJust()) expect(just1.value).toBe(12);

  expect(just2.isJust()).toBe(false);
  expect(nothing.isNothing()).toBe(true);
});

test("'foldAsync'", async () => {
  const just = await Just("hello world").foldAsync(100, (v) => {
    return new Promise((resolve) => resolve(v.length + 1));
  });

  const nothing = await Nothing().foldAsync("default", (v) => {
    return new Promise((resolve) => resolve(v + "hey"));
  });

  expect(just).toBe(12);
  expect(nothing).toBe("default");
});
