import { Right, Left, Either } from "../src/either";
import { Just, Nothing } from "../src/maybe";

test("'isRight'", () => {
  const right = Right<string, string>("hello");

  expect(right.isRight()).toBe(true);
  expect(right.isLeft()).toBe(false);
});

test("'isLeft'", () => {
  const left = Left<string, string>();

  expect(left.isRight()).toBe(false);
  expect(left.isLeft()).toBe(true);
});

test("'map'", () => {
  const right = Right<string, string>("hello").map((r) => r + " world");
  const left = Left<string, string>().map((r) => r + " world");

  expect(right.isRight()).toBe(true);
  if (right.isRight()) expect(right.value).toBe("hello world");

  expect(left.isLeft()).toBe(true);
});

test("'bind'", () => {
  const right = Right<string, string>("hello").bind((r) => Right(r.length));
  const left = Left<string, string>().bind((r) => Right(r.length));

  expect(right.isRight()).toBe(true);
  if (right.isRight()) expect(right.value).toBe(5);

  expect(left.isLeft()).toBe(true);
});

test("'fold'`", () => {
  const right = Right<string, string>("hello").fold(5, (r) => r.length);
  const left = Left<string, string>().fold(5, (r) => r.length);

  expect(right).toBe(5);
  expect(left).toBe(5);
});

test("'mapAsync'", async () => {
  const asyncFunc = (r: string) => new Promise((resolve) => resolve(r.length));
  const right = await Right<string, string>("hello").mapAsync(asyncFunc);
  const left = await Left<string, string>().mapAsync(asyncFunc);

  expect(right.isRight()).toBe(true);
  if (right.isRight()) expect(right.value).toBe(5);

  expect(left.isLeft()).toBe(true);
});

test("'bindAsync'", async () => {
  const asyncFunc = (r: string) =>
    new Promise<Either<string, number>>((resolve) => resolve(Right(r.length)));
  const right = await Right<string, string>("hello").bindAsync(asyncFunc);
  const left = await Left<string, string>().bindAsync(asyncFunc);

  expect(right.isRight()).toBe(true);
  if (right.isRight()) expect(right.value).toBe(5);

  expect(left.isLeft()).toBe(true);
});

test("'foldAsync'", async () => {
  const asyncFunc = (r: string) => new Promise((resolve) => resolve(r.length));
  const right = await Right<string, string>("hello").foldAsync(5, asyncFunc);
  const left = await Left<string, string>().foldAsync(5, asyncFunc);

  expect(right).toBe(5);
  expect(left).toBe(5);
});

test("'onRight/onLeft' with `Right`", () => {
  let val = 0;
  const right = Right<string, string>("hello")
    .onRight(() => (val = 10))
    .onLeft(() => (val = 20));

  expect(right.isRight()).toBe(true);
  if (right.isRight()) expect(right.value).toBe("hello");

  expect(val).toBe(10);
});

test("'onRight/onLeft' with `Left`", () => {
  let val = 0;
  const left = Left<string, string>()
    .onRight(() => (val = 10))
    .onLeft(() => (val = 20));

  expect(left.isLeft()).toBe(true);
  expect(val).toBe(20);
});

test("'toMaybe'", () => {
  const rightMaybe = Right<string, string>("hello")
    .map((r) => r.length)
    .toMaybe();
  const leftMaybe = Left<string, string>()
    .map((r) => r.length)
    .toMaybe();

  expect(rightMaybe.isJust()).toBe(true);
  if (rightMaybe.isJust()) expect(rightMaybe.value).toBe(5);

  expect(leftMaybe.isNothing()).toBe(true);
});
