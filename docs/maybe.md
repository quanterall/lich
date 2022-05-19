## Maybe

`Maybe` can be either `Just<T>` or `Nothing`. It is helpful to know precisely that you either have a value or you don't. You may think that it is just an optional in javascript, but it's much more, because it builds over this concept of having/not having a value and export some useful function we can combine with this concept.

The `Maybe` type export couple of useful function, let's examine what they are and how to use them in practice:

- [Maybe](#maybe)
  - [Just](#just)
  - [Nothing](#nothing)
  - [map](#map)
  - [bind](#bind)
  - [fold](#fold)
  - [mapAsync](#mapasync)
  - [bindAsync](#bindasync)
  - [foldAsync](#foldasync)
  - [otherwise](#otherwise)
  - [onJust](#onjust)
  - [onNothing](#onnothing)
  - [isJust](#isjust)
  - [isNothing](#isnothing)
  - [toEither](#toeither)

### Just

`Just` is a function that returns a `Maybe` with the type `Just`. It will hold the value you pass to it.

```ts
import { Maybe, Just } from "lich";

const maybeNumber: Maybe<string> = Just("hello world");
```

### Nothing

`Nothing` is a function that returns a `Maybe` with the type `Nothing`. It doesn't hold any value.
It indicated that you don't have a value in that variable. It's similar with how some people use `null` or `undefined`.

```ts
import { Maybe, Nothing } from "lich";

const maybeNumber: Maybe<string> = Nothing();
```

### map

`map` is a function that takes another `mapping` function that will be applied to our `Maybe` only if the value inside is a `Just` (this means that we know that we are transforming our value only when there is actually a value inside). If the value inside our `Maybe` is `Nothing`, nothing will change, we'll still have our `Nothing` as the value.

```ts
import { Just, Nothing } from "lich";

const maybe = Just("hello world");
maybe.map((v) => v + "!"); // Just("hello world!")

const maybe = Nothing();
maybe.map((v) => v + "!"); // Nothing
```

And you can call as much of these `map` function as you like:

```ts
import { Just } from "lich";

const maybe = Just("hello world");
maybe
  .map((v) => v + "!") // Just("hello world!")
  .map((v) => v.charAt(0).toUpperCase() + v.slice(1)); // Just("Hello world!")
```

Another cool thing about map is that you can even change the type of the value inside:

```ts
import { Just } from "lich";

const maybe = Just("hello world");
maybe.map((v) => v.length); // Just(11)
```

### bind

`bind` takes a function and a applies it to the value of the `Maybe` and returns a new `Maybe`. This means that you can call a 'transform' type of a function that taking a value x, could either return a `Just` with the transformed x or return `Nothing`.

Lets see an example of this:

```ts
import { Maybe, Just, Nothing } from "lich";

const maybe1 = Just(" Hello World  ").bind(nonEmptyString); // Just("Hello World")
const maybe2 = Just("   ").bind(nonEmptyString); // Nothing

// And of course you can chain these calls
maybe1.map((v) => v + " !"); // Just("Hello World!")

// or at the same time
const maybe3 = Just(" Hello World  ")
  .bind(nonEmptyString)
  .map((v) => v + " !"); // Just("Hello World!")

function nonEmptyString(s: string): Maybe<string> {
  const trimmedS = s.trim();
  if (trimmedS.length === 0) return Nothing();

  return Just(trimmedS);
}
```

### fold

`fold` takes a default value and a function. If the `Maybe` on which we call the fold is a `Nothing` it will return the default value, if it's a `Just` it will return the result of the function applied to the value inside the `Just`.

Lets see this in action:

```ts
import { Just, Nothing } from "lich";

const maybe1 = Just("Hello ").fold("Hello World", (v) => v + " World"); // "Hello World"
const maybe2 = Nothing().fold("Hello World", (v) => v + " World"); // "Hello World"
```

_You cannot chain the `fold` function since it return a pure value and not a `Maybe`._

### mapAsync

`mapAsync` is just the same as `map` but you can call an `async` function inside it.

Example:

```ts
import { Just } from "lich";

const maybe = await Just(1).mapAsync(myAsyncFunc); // Just(11)

async function myAsyncFunc(v: number): Promise<number> {
  return new Promise((resolve) => resolve(v + 10));
}
```

### bindAsync

`bindAsync` is just the same as `bind` but you can call an `async` function inside it.

Lets see:

```ts
import { Maybe, Just } from "lich";

const maybe = await Just("hello world").bindAsync(myAsyncFunc); // Just(12)

async function myAsyncFunc(s: string): Promise<Maybe<number>> {
  return new Promise<Maybe<number>>((resolve) => resolve(Just(v.length + 1)));
}
```

### foldAsync

`foldAsync` is just the same as `fold` but you can call an `async` function inside it.

In action:

```ts
import { Just, Nothing } from "lich";

const maybe1 = await Just("hello world").foldAsync(100, myAsyncFunc); // 12

async function myAsyncFunc(s: string): Promise<number> {
  return new Promise((resolve) => resolve(v.length + 1));
}

const maybe2 = await Just("hello").foldAsync("hello world", (v) => {
  return new Promise((resolve) => resolve(v + "world"));
}); // "hello world"

const maybe3 = await Nothing().foldAsync("hello world", (v) => {
  return new Promise((resolve) => resolve(v + "world"));
}); // "hello world"
```

### otherwise

`otherwise` takes a default value and if it's called on `Nothing` it will return that default value. If it's a `Just` it will return the value of the `Just`.

Example here:

```ts
import { Just, Nothing } from "lich";

const maybe1 = Just("hello").or("hello world"); // "hello"
const maybe2 = Nothing().or("hello world"); // "hello world"
```

### onJust

`onJust` is a function that takes a callback function that will execute only if the `Maybe` is a `Just` and it will return the `Just` as it was. If the `Maybe` is a `Nothing`, this function will not be called and it will still return you the `Nothing`.

Let's see how to use it:

```ts
import { Just } from "lich";

const maybe = Just("hello")
  .map((v) => v + " world")
  .onJust((v) => console.info(`We have a just with value: ${v}`)); // Just("hello world")
```

### onNothing

`onNothing` works exactly the same a `onJust` but the opposite way. The only difference is that we cannot access a value (like we do on `onJust`)

Lets see:

```ts
import { Just, Nothing } from "lich";

const maybe = Just("hey")
  .bind((_v) => Nothing())
  .onNothing(() => console.error("dang it, it's a Nothing")); // Nothing()
```

### isJust

`isJust` is a function that will check if the `Maybe` is a `Just` or not. It's written in such a way, that if we check this, the ts compiler will know that it's a `Just` and give us access to the `value` key.

Let's see how this goes:

```ts
import { Just } from "lich";

const maybe = Just("this is awesome");

// here if we try to access maybe.value, ts will complain to us
if (maybe.isJust()) {
  const nice = maybe.value; // here it's fine
}
```

Or we can do it the other way around

```ts
import { Maybe } from "lich";

function justOrThrow(maybe: Maybe<string>): string {
  if (!maybe.isJust()) {
    throw new Error("Maybe is not Just"); // before this line we cannot access `value` field
  }

  return maybe.value;
}
```

### isNothing

`isNothing` is just the opposite of `isJust`

```ts
import { Just } from "lich";

const maybe = Just("hello world");

// here if we try to access maybe.value, ts will complain to us
if (!maybe.isNothing()) {
  const nice = maybe.value; // here it's fine
}
```

### toEither

Turn a `Maybe` into `Either`. If we call it on `Nothing` it takes the default value as a reason for `Left`:

```ts
import { Just, Nothing } from "lich";
const either1 = Just("hello world").toEither(); // Right("hello world")
const either2 = Nothing().toEither("error"); // Left("error")
```
