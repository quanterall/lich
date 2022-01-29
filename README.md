## Lich - Chaining computations in TypeScript

Lich is a library for chaining computations in TypeScript. It's heavily inspired by the monadic structures in Haskell. In particular `Maybe` and `Either`.
The goal of lich is to improve flow, safety and reliability of your code.

## Installing

Via npm:

```
$ npm install lich
```

Via yarn:

```
$ yarn add lich
```

## How does it work?

Let's say you want to apply several functions to a string, but you only want to work with it, if it's not empty at the end of each one of them?
This is how you may go about it, using `lich`:

```ts
import { Maybe, Just, Nothing } from "lich";

export function parseString(s: string): Maybe<string> {
  return safeTrim(s)
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
import { Either, Right, Left } from "lich";

export function parseString(s: string): Either<string, string> {
  return safeTrim(s)
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

A more deep comparison against other error handling practices could be found **[here](docs/comparison.md)**.

## Documentation

- [Maybe](docs/maybe.md/#maybe)
  - [Just](docs/maybe.md/#just)
  - [Nothing](docs/maybe.md/#nothing)
  - [map](docs/maybe.md/#map)
  - [bind](docs/maybe.md/#bind)
  - [fold](docs/maybe.md/#fold)
  - [mapAsync](docs/maybe.md/#mapasync)
  - [bindAsync](docs/maybe.md/#bindasync)
  - [foldAsync](docs/maybe.md/#foldasync)
  - [otherwise](docs/maybe.md/#otherwise)
  - [onJust](docs/maybe.md/#onjust)
  - [onNothing](docs/maybe.md/#onnothing)
  - [isJust](docs/maybe.md/#isjust)
  - [isNothing](docs/maybe.md/#isnothing)
  - [toEither](docs/maybe.md/#toeither)
- [Either](docs/either.md/#either)
  - [Right](docs/either.md/#right)
  - [Left](docs/either.md/#left)
  - [map](docs/either.md/#map)
  - [bind](docs/either.md/#bind)
  - [fold](docs/either.md/#fold)
  - [mapAsync](docs/either.md/#mapasync)
  - [bindAsync](docs/either.md/#bindasync)
  - [foldAsync](docs/either.md/#foldasync)
  - [otherwise](docs/either.md/#otherwise)
  - [onRight](docs/either.md/#onright)
  - [onLeft](docs/either.md/#onleft)
  - [fromRight](docs/either.md/#fromright)
  - [fromLeft](docs/either.md/#fromleft)
  - [isRight](docs/either.md/#isright)
  - [isLeft](docs/either.md/#isleft)
  - [toMaybe](docs/either.md/#tomaybe)
