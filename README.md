# What is lich?

Lich is a library for chaining computations in TypeScript. It's heavily inspired by the monadic structures in Haskell. In particular `Maybe` and `Either`.
The goal of lich is to improve code flow, quality and reliability.

# Why lich?

Because it will bring new and refreshing concepts and will add safety and reliability to your code base.

# How does it work?

Let's say we are supposed to do the following:

- Get an input
- Validate it using the following rules
  - It should not be empty. (Only spaces is considered empty)
  - It should begin with 'hello'
  - The last character should be either 'D' or 'd'
- If the validation is success we want to uppercase the input and do something with it, otherwise we want to use a default value of 'HELLO WORLD' and print out why the validation failed.

One way we can go about it is using `throw` with `try/catch`:

```ts
function parseString(input: string): string {
  if (input.trim().length === 0) throw new Error("String is empty");
  if (!input.startsWith("hello")) throw new Error("Doesn't start with 'hello'");
  if (!lastCharacterIsP(input)) throw new Error("Doesn't end with either 'D' nor 'd'");

  return input;
}

function lastCharacterIsD(s: string): boolean {
  s.toLowerCase().slice(-1) === "d";
}

function main(input: string) {
  let myInput = "HELLO WORLD";
  try {
    myInput = parseString(input).toUpperCase();
  } catch (error) {
    if (error.message === "String is empty") {
      console.error(error.message);
    } else if (error.message === "Doesn't start with 'hello'") {
      console.error(error.message);
    } else if (error.message === "Doesn't end with either 'D' nor 'd'") {
      console.error(error.message);
    }
  }

  // start using myInput...
}
```

This is not ideal, because after some time we might forget that `parseString` could `throw` and call it without `try/catch` (_which is truly something we wouldn't like to happen_).

Another way would be with a `Promise`:

```ts
async function parseString(input: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (input.trim().length === 0) reject("String is empty");
    if (!input.startsWith("hello")) reject("Doesn't start with 'hello'");
    if (!lastCharacterIsP(input)) reject("Doesn't end with either 'D' nor 'd'");

    return resolve(input);
  });
}

function lastCharacterIsD(s: string): boolean {
  s.toLowerCase().slice(-1) === "d";
}

async function main(input: string) {
  let myInput = "HELLO WORLD";
  await parseString(input)
    .then((s) => (myInput = s.toUpperCase()))
    .catch((e) => {
      if (error.message === "String is empty") {
        console.error(error.message);
      } else if (error.message === "Doesn't start with 'hello'") {
        console.error(error.message);
      } else if (error.message === "Doesn't end with either 'D' nor 'd'") {
        console.error(error.message);
      }
    });

  // start using myInput...
}
```

This is not ideal either, because now we have to deal with `async/await` (_which again might not be viable is all cases_).

But this is how we can do it using `lich`:

```ts
function parseString(input: string): Either<string, string> {
  if (input.trim().length === 0) Left("String is empty");
  if (!input.startsWith("hello")) Left("Doesn't start with 'hello'");
  if (!lastCharacterIsD(input)) Left("Doesn't end with either 'D' nor 'd'");

  return Right(input);
}

function lastCharacterIsD(s: string): boolean {
  s.toLowerCase().slice(-1) === "d";
}

function main(input: string) {
  const myInput = parseString(input)
    .map((r) => r.toUpperCase())
    .onLeft((l) => {
      if (error.message === "String is empty") {
        console.error(error.message);
      } else if (error.message === "Doesn't start with 'hello'") {
        console.error(error.message);
      } else if (error.message === "Doesn't end with either 'D' nor 'd'") {
        console.error(error.message);
      }
    })
    .otherwise("HELLO WORLD");

  // start using myInput..
}
```

Here, we don't have `throws` and we don't need `async/await`, but we still get a neat way to deal with such scenarios.

## Documentation

- [Maybe](maybe.md/#maybe)
  - [map](maybe.md/#map)
  - [mapAsync](maybe.md/#mapasync)
  - [bind](maybe.md/#bind)
  - [bindAsync](maybe.md/#bindasync)
  - [fold](maybe.md/#fold)
  - [foldAsync](maybe.md/#foldasync)
  - [otherwise](maybe.md/#otherwise)
  - [onJust](maybe.md/#onjust)
  - [onNothing](maybe.md/#onnothing)
  - [isJust](maybe.md/#isjust)
  - [isNothing](maybe.md/#isnothing)
- [Either](either.md/#either)
  - [map](either.md/#map)
  - [mapAsync](either.md/#mapasync)
  - [bind](either.md/#bind)
  - [bindAsync](either.md/#bindasync)
  - [fold](either.md/#fold)
  - [foldAsync](either.md/#foldasync)
  - [otherwise](either.md/#otherwise)
  - [onRight](either.md/#onright)
  - [onLeft](either.md/#onleft)
  - [isRight](either.md/#isright)
  - [isLeft](either.md/#isleft)
