## What is lich?

Lich is a library for chaining computations in TypeScript. It's heavily inspired by the monadic structures in Haskell. In particular `Maybe` and `Either`.
The goal of lich is to improve flow, quality and reliability of your code.

## Why lich?

Because it will bring new and refreshing concepts that will add safety and reliability to your code base.

## How does it work?

Let's say you want to apply several functions to a string, but you only want to work with it, if it's not empty at the end of each one of them?
This is how you may go about it, using `lich`:

```ts
function main(s: string): void {
  safeTrim(s)
    .map((j) => j.toUpperCase())
    .bind(removePs) // Maybe remove the 'p's in the text.
    .bind(clearSpaces); // Maybe clear up the spaces.
}

function safeTrim(s: string): Maybe<string> {
  const trimmed = s.trim();
  if (trimmed.length === 0) return Nothing();

  return Just(trimmed);
}

function removePs(s: string): Maybe<string> {
  const res = s.replace(/p/g, "");
  if (res.length === 0) return Nothing();

  return Just(res);
}

function clearSpaces(s: string): Maybe<string> {
  const res = s.replace(/ +/g, " ").trim(); // We want only one space between words
  if (res.length === 0) return Nothing();

  return Just(res);
}
```

If you care about in which step things went wrong you can use `Either` to track your errors:

```ts
function main(s: string): void {
  safeTrim(s)
    .map((j) => j.toUpperCase())
    .bind(removePs) // Either remove the 'p's in the text or return a `Left` with a reason.
    .bind(clearSpaces) // Either clear up the spaces or return `Left` with a reason.
    .onLeft((l) => console.error(l)); // Log the error to the console
}

function safeTrim(s: string): Either<string, string> {
  const trimmed = s.trim();
  if (trimmed.length === 0) return Left("Error in 'safeTrim': String is empty");

  return Right(trimmed);
}

function removePs(s: string): Either<string, string> {
  const res = s.replace(/p/g, "");
  if (res.length === 0) return Left("Error in 'removePs': String is empty");

  return Right(res);
}

function clearSpaces(s: string): Either<string, string> {
  const res = s.replace(/ +/g, " ").trim(); // We want only one space between words.
  if (res.length === 0) return Left("Error in 'clearSpaces': String is empty");

  return Right(res);
}
```

A more deep comparison against other error handling practices could be found **[here](comparison.md)**.

## Documentation

- [Maybe](maybe.md/#maybe)
  - [map](maybe.md/#map)
  - [bind](maybe.md/#bind)
  - [fold](maybe.md/#fold)
  - [mapAsync](maybe.md/#mapasync)
  - [bindAsync](maybe.md/#bindasync)
  - [foldAsync](maybe.md/#foldasync)
  - [otherwise](maybe.md/#otherwise)
  - [onJust](maybe.md/#onjust)
  - [onNothing](maybe.md/#onnothing)
  - [isJust](maybe.md/#isjust)
  - [isNothing](maybe.md/#isnothing)
- [Either](either.md/#either)
  - [map](either.md/#map)
  - [bind](either.md/#bind)
  - [fold](either.md/#fold)
  - [mapAsync](either.md/#mapasync)
  - [bindAsync](either.md/#bindasync)
  - [foldAsync](either.md/#foldasync)
  - [otherwise](either.md/#otherwise)
  - [onRight](either.md/#onright)
  - [onLeft](either.md/#onleft)
  - [isRight](either.md/#isright)
  - [isLeft](either.md/#isleft)
