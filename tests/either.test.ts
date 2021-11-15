import {
  Right,
  Left,
  Either,
  rights,
  rightsOrAllLeft,
  lefts,
  rightsOrLeft,
  firstRight,
  nullableToEither,
} from "../src/either";
import { Just, Nothing } from "../src/maybe";

test("'isRight'", () => {
  const right = Right<string, string>("hello");

  expect(right.isRight()).toBe(true);
  expect(right.isLeft()).toBe(false);
});

test("'isLeft'", () => {
  const left = Left<string, string>("error");

  expect(left.isRight()).toBe(false);
  expect(left.isLeft()).toBe(true);
});

test("'map'", () => {
  const right = Right<string, string>("hello").map((r) => r + " world");
  const left = Left<string, string>("error").map((r) => r + " world");

  expect(right.isRight()).toBe(true);
  if (right.isRight()) expect(right.value).toBe("hello world");

  expect(left.isLeft()).toBe(true);
  if (left.isLeft()) expect(left.reason).toBe("error");
});

test("'bind'", () => {
  const right1 = Right<string, string>("hello").bind((r) => Right(r.length));
  const right2 = Right<string, string>("hello").bind((r) => Left("error"));
  const left = Left<string, string>("error").bind((r) => Right(r.length));

  expect(right1.isRight()).toBe(true);
  if (right1.isRight()) expect(right1.value).toBe(5);

  expect(right2.isLeft()).toBe(true);
  if (right2.isLeft()) expect(right2.reason).toBe("error");

  expect(left.isLeft()).toBe(true);
  if (left.isLeft()) expect(left.reason).toBe("error");
});

test("'fold'`", () => {
  const right = Right<string, string>("hello").fold(5, (r) => r.length);
  const left = Left<string, string>("error").fold(5, (r) => r.length);

  expect(right).toBe(5);
  expect(left).toBe(5);
});

test("'mapAsync'", async () => {
  const asyncFunc = (r: string) => new Promise((resolve) => resolve(r.length));
  const right = await Right<string, string>("hello").mapAsync(asyncFunc);
  const left = await Left<string, string>("error").mapAsync(asyncFunc);

  expect(right.isRight()).toBe(true);
  if (right.isRight()) expect(right.value).toBe(5);

  expect(left.isLeft()).toBe(true);
  if (left.isLeft()) expect(left.reason).toBe("error");
});

test("'bindAsync'", async () => {
  const asyncFunc = (r: string) =>
    new Promise<Either<string, number>>((resolve) => resolve(Right(r.length)));
  const right1 = await Right<string, string>("hello").bindAsync(asyncFunc);

  const right2 = await Right<string, string>("hello").bindAsync(
    (r: string) => new Promise<Either<string, number>>((resolve) => resolve(Left("error"))),
  );
  const left = await Left<string, string>("error").bindAsync(asyncFunc);

  expect(right1.isRight()).toBe(true);
  if (right1.isRight()) expect(right1.value).toBe(5);

  expect(right2.isLeft()).toBe(true);
  if (right2.isLeft()) expect(right2.reason).toBe("error");

  expect(left.isLeft()).toBe(true);
  if (left.isLeft()) expect(left.reason).toBe("error");
});

test("'foldAsync'", async () => {
  const asyncFunc = (r: string) => new Promise((resolve) => resolve(r.length));
  const right = await Right<string, string>("hello").foldAsync(5, asyncFunc);
  const left = await Left<string, string>("error").foldAsync(5, asyncFunc);

  expect(right).toBe(5);
  expect(left).toBe(5);
});

test("'onRight/onLeft' with `Right`", () => {
  let val = 0;
  const right = Right<string, string>("hello")
    .onRight((_r) => (val = 10))
    .onLeft((_l) => (val = 20));

  expect(right.isRight()).toBe(true);
  if (right.isRight()) expect(right.value).toBe("hello");

  expect(val).toBe(10);
});

test("'onRight/onLeft' with `Left`", () => {
  let val = 0;
  const left = Left<string, string>("error")
    .onRight((_r) => (val = 10))
    .onLeft((_l) => (val = 20));

  expect(left.isLeft()).toBe(true);
  expect(val).toBe(20);
});

test("'toMaybe'", () => {
  const rightMaybe = Right<string, string>("hello")
    .map((r) => r.length)
    .toMaybe();
  const leftMaybe = Left<string, string>("error")
    .map((r) => r.length)
    .toMaybe();

  expect(rightMaybe.isJust()).toBe(true);
  if (rightMaybe.isJust()) expect(rightMaybe.value).toBe(5);

  expect(leftMaybe.isNothing()).toBe(true);
});

test("'fromRight'", () => {
  const right = Right("hello world").fromRight("empty");

  expect(right).toBe("hello world");
});

test("'fromLeft'", () => {
  const left = Left("some error here").fromLeft("there is no error");

  expect(left).toBe("some error here");
});

test("'rights'", () => {
  const eithers: Either<string, number>[] = [
    Right(1),
    Right(2),
    Left("NaN"),
    Right(4),
    Right(5),
    Left("NaN"),
    Left("NaN"),
  ];

  expect(rights(eithers)).toEqual([1, 2, 4, 5]);
});

test("'rightsOrAllLeft'", () => {
  const eithers: Either<string, number>[] = [Left("NaN"), Left("NaN"), Left("NaN")];

  const res = rightsOrAllLeft(eithers, "All are lefts");
  expect(res.isLeft()).toBe(true);
  if (res.isLeft()) expect(res.reason).toBe("All are lefts");
});

test("'rightsOrLeft'", () => {
  const rights: Either<string, number>[] = [Right(1), Right(2), Right(3)];
  const eithers: Either<string, number>[] = [Right(1), Right(2), Left("NaN")];

  const res = rightsOrLeft(rights);
  expect(res.isRight()).toBe(true);
  if (res.isRight()) expect(res.value).toEqual([1, 2, 3]);

  const res2 = rightsOrLeft(eithers);
  expect(res2.isRight()).toBe(false);
  if (res2.isLeft()) expect(res2.reason).toBe("NaN");
});

test("'firstRight'", () => {
  const hasRight1: Either<string, number>[] = [Left("NaN"), Left("NaN"), Right(3)];
  const hasRight2: Either<string, number>[] = [Right(1), Left("NaN"), Right(3)];
  const hasntRight: Either<string, number>[] = [Left("NaN"), Left("NaN"), Left("NaN")];

  const res = firstRight(hasRight1, "all are lefts");
  expect(res.isRight()).toBe(true);
  if (res.isRight()) expect(res.value).toBe(3);

  const res1 = firstRight(hasRight2, "all are lefts");
  expect(res1.isRight()).toBe(true);
  if (res1.isRight()) expect(res1.value).toBe(1);

  const res2 = firstRight(hasntRight, "all are lefts");
  expect(res2.isRight()).toBe(false);
  if (res2.isLeft()) expect(res2.reason).toBe("all are lefts");
});

test("'lefts'", () => {
  const eithers: Either<string, number>[] = [
    Right(1),
    Right(2),
    Left("NaN"),
    Right(4),
    Right(5),
    Left("NaN"),
    Left("NaN"),
  ];

  expect(lefts(eithers)).toEqual(["NaN", "NaN", "NaN"]);
});

test("'nullableToEither'", () => {
  let p: number | undefined = undefined;
  const left = nullableToEither(p, "Not defined");

  p = 10;
  const right = nullableToEither(p, "Not defined");

  expect(left.isLeft()).toBe(true);
  left.onLeft((l) => expect(l).toBe("Not defined"));

  expect(right.isRight()).toBe(true);
  right.onRight((r) => expect(r).toBe(10));
});
