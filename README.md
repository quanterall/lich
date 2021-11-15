# lich

A library for chaining computations in TypeScript.
The inspiration for this library comes from the `Maybe` | `Either` monads from Haskell.

## Maybe

`Maybe` can be either `Just<T>` or `Nothing`. It is helpful to know precisely that you either have a value or you don't. You may think that it is just an optional in javascript, but it's much more, because it builds over this concept of having/not having a value and export some useful function we can combine with this concept.

The `Maybe` type export couple of useful function, let's examine what they are and how to use them in practice:

### map

`map` is a function that takes another `mapping` function that will be applied to our `Maybe` only if the value inside is a `Just` (this means that we know that we are transforming our value only when there is actually a value inside). If the value inside our `Maybe` is `Nothing`, nothing will change, we'll still have our `Nothing` as the value.

```ts
const value = Just("hello world");
value.map((v) => v + "!"); // Just("hello world!")

const value = Nothing();
value.map((v) => v + "!"); // Nothing
```

And you can call as much of these `map` function as you like:

```ts
const value = Just("hello world");
value
  .map((v) => v + "!") // Just("hello world!")
  .map((v) => v.charAt(0).toUpperCase() + v.slice(1)); // Just("Hello world!")
```

Another cool thing about map is that you can even change the type of the value inside:

```ts
const value = Just("hello world");
value.map((v) => v.length); // Just(11)
```

### bind

`bind` takes a function and a applies it to the value of the `Maybe` and returns a new `Maybe`. This means that you can call a 'transform' type of a function that taking a value x, could either return a `Just` with the transformed x or return `Nothing`.

Lets see an example of this:

```ts
const just = Just(" Hello World  ").bind(nonEmptyString); // Just("Hello World")
const nothing = Just("   ").bind(nonEmptyString); // Nothing

// And of course you can chain these calls
just.map((v) => v + " !"); // Just("Hello World!")

// or at the same time
const just = Just(" Hello World  ")
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
const just = Just("Hello ").fold("Hello World", (v) => v + " World"); // "Hello World"
const nothing = Nothing().fold("Hello World", (v) => v + " World"); // "Hello World"
```

_You cannot chain the `fold` function since it return a pure value and not a `Maybe`._

### otherwise

`otherwise` takes a default value and if it's called on `Nothing` it will return that default value. If it's a `Just` it will return the value of the `Just`.

Example here:

```ts
const just = Just("hello").or("hello world"); // "hello"
const nothing = Nothing().or("hello world"); // "hello world"
```

### onJust

`onJust` is a function that takes a callback function that will execute only if the `Maybe` is a `Just` and it will return the `Just` as it was. If the `Maybe` is a `Nothing`, this function will not be called and it will still return you the `Nothing`.

Let's see how to use it:

```ts
const just = Just("hello")
  .map((v) => v + " world")
  .onJust((v) => console.info(`We have a just with value: ${v}`)); // Just("hello world")
```

### onNothing

`onNothing` works exactly the same a `onJust` but the opposite way. The only difference is that we cannot access a value (like we do on `onJust`)

Lets see:

```ts
const nothing = Just("hey")
  .bind((_v) => Nothing())
  .onNothing(() => console.error("dang it, it's a Nothing")); // Nothing()
```

### mapAsync

`mapAsync` is just the same as `map` but you can call an `async` function inside it.

Example:

```ts
const just = await Just(1).mapAsync(myAsyncFunc); // Just(11)

async function myAsyncFunc(v: number): Promise<number> {
  return new Promise((resolve) => resolve(v + 10));
}
```

### bindAsync

`bindAsync` is just the same as `bind` but you can call an `async` function inside it.

Lets see:

```ts
const just = await Just("hello world").bindAsync(myAsyncFunc); // Just(12)

async function myAsyncFunc(s: string): Promise<Maybe<number>> {
  return new Promise<Maybe<number>>((resolve) => resolve(Just(v.length + 1)));
}
```

### foldAsync

`foldAsync` is just the same as `fold` but you can call an `async` function inside it.

In action:

```ts
const just = await Just("hello world").foldAsync(100, myAsyncFunc); // 12

async function myAsyncFunc(s: string): Promise<number> {
  return new Promise((resolve) => resolve(v.length + 1));
}

const just = await Just("hello").foldAsync("hello world", (v) => {
  return new Promise((resolve) => resolve(v + "world"));
}); // "hello world"

const nothing = await Nothing().foldAsync("hello world", (v) => {
  return new Promise((resolve) => resolve(v + "world"));
}); // "hello world"
```

### isJust

`isJust` is a function that will check if the `Maybe` is a `Just` or not. It's written in such a way, that if we check this, the ts compiler will know that it's a `Just` and give us access to the `value` key.

Let's see how this goes:

```ts
const just = Just("this is awesome");

// here if we try to access just.value, ts will complain to us
if (just.isJust()) {
  const nice = just.value; // here it's fine
}
```

Or we can do it the other way around

```ts
function justOrThrow(maybe: Maybe<string>): string {
  if (maybe.isNothing()) throw new Error("Maybe is not Just"); // before this line we cannot access `value` field

  return maybe.value;
}
```

### isNothing

`isNothing` is just the opposite of `isJust`

## Either

The `Either` type represents values with two possibilities: a value of type `Either<L, R>` is either `Left` with error type `<L>` or `Right` with value type `<R>`. The `Either` type is sometimes used to represent a value which is either correct or an error; by convention, the `Left` constructor is used to hold an error value and the `Right` constructor is used to hold a correct value (mnemonic: "right" also means "correct").

The `Either` type export couple of useful function, let's examine what they are and how to use them in practice:

### map

`map` is a function that takes another `mapping` function that will be applied to our `Either` only if the value inside is a `Right` (this means that we know that we are transforming our value only when there is actually a value inside). If the value inside our `Either` is `Left`, nothing will change, we'll still have our `Left` as the value.

```ts
const right = Right("hello world");
right.map((v) => v + "!"); // Right("hello world!")

const left = Left("string is empty");
left.map((v) => v + "!"); // Left("string is empty")
```

And you can call as much of these `map` function as you like:

```ts
const right = Right("hello world");
right
  .map((v) => v + "!") // Right("hello world!")
  .map((v) => v.charAt(0).toUpperCase() + v.slice(1)); // Right("Hello world!")
```

Another cool thing about map is that you can even change the type of the returned value:

```ts
const right = Right("hello world");
right.map((v) => v.length); // Right(11)
```

### bind

`bind` takes a function and a applies it to the value of the `Either<L, R>` and returns a new `Either<L, T>`. This means that you can call a 'transform' type of a function that taking a value x, could either return a `Right` with the transformed x or return a `Left`.

Lets see an example of this:

```ts
const right = Right(" Hello World  ").bind(nonEmptyString); // Right("Hello World")
const left = Right("   ").bind(nonEmptyString); // Left("string is empty)

// And of course you can chain these calls
right.map((v) => v + " !"); // Right("Hello World!")

// or at the same time
const right = Right(" Hello World  ")
  .bind(nonEmptyString)
  .map((v) => v + " !"); // Right("Hello World!")

function safeTrim(s: string): Either<string, string> {
  const trimmedS = s.trim();
  if (trimmedS.length === 0) return Left("string is empty");

  return Right(trimmedS);
}
```

### fold

`fold` takes a default value and a function. If the `Either` on which we call the fold is a `Left` it will return the default value, if it's a `Right` it will return the result of the function applied to the value inside the `Right`.

Lets see this in action:

```ts
const right = Right("Hello ").fold("Hello World", (v) => v + " World"); // "Hello World"
const left = Left("some error..").fold("Hello World", (v) => v + " World"); // "some error.."
```

_You cannot chain the `fold` function since it return a pure value and not an `Either`._

### onRight

`onRight` is a function that takes a callback function that will execute only if the `Either` is a `Right` and it will return the `Right` as it was. If the `Either` is a `Left`, this function will not be called and it will still return you the `Left`.

Let's see how to use it:

```ts
const right = Right("hello")
  .map((v) => v + " world")
  .onJust((v) => console.info(`We have a just with value: ${v}`)); // Right("hello world")
```

### onLeft

`onLeft` is the opposite of `onRight`

Lets see:

```ts
const right = Right("hello world")
  .bind((_v) => Left("some error.."))
  .onLeft((l) => console.error("Failed with error: " + l)); // Left("some error..")
```

### mapAsync

`mapAsync` is just the same as `map` but you can call an `async` function inside it.

Example:

```ts
const right = await Right(1).mapAsync(myAsyncFunc); // Right(11)

async function myAsyncFunc(v: number): Promise<number> {
  return new Promise((resolve) => resolve(v + 10));
}
```

### bindAsync

`bindAsync` is just the same as `bind` but you can call an `async` function inside it.

Lets see:

```ts
const right = await Right("hello world").bindAsync(myAsyncFunc); // Right(12)

async function myAsyncFunc(s: string): Promise<Maybe<number>> {
  return new Promise<Maybe<number>>((resolve) => resolve(Right(v.length + 1)));
}
```

### foldAsync

`foldAsync` is just the same as `fold` but you can call an `async` function inside it.

In action:

```ts
const right = await Right("hello world").foldAsync(100, myAsyncFunc); // 12

async function myAsyncFunc(s: string): Promise<number> {
  return new Promise((resolve) => resolve(v.length + 1));
}

const right = await Right("hello").foldAsync("hello world", (v) => {
  return new Promise((resolve) => resolve(v + "world"));
}); // "hello world"

const left = await Left("some error..").foldAsync("hello world", (v) => {
  return new Promise((resolve) => resolve(v + "world"));
}); // "hello world"
```

### isRight

`isRight` is a function that will check if the `Either` is a `Right` or not. It's written in such a way, that if we check this, the typescript compiler will know that it's a `Right` and give us access to the `value` key.

Let's see how this goes:

```ts
const right = Right("this is awesome");
// right.value <-- if you try to access 'value' here typescript will complain

if (right.isRight()) {
  const nice = right.value; // here it's fine
}

// it works the opposite way as well

const left = Left("some error..");
// left.reason <-- if you try to access 'reason' here typescript will complain

if (!left.isRight()) {
  const myError = left.reason; // here it's fine
}
```

Or we can do it the other way around

```ts
function rightOrThrow(either: Either<string, string>): string {
  if (either.isLeft()) {
    throw new Error("Failed with: " + either.reason); // before this line we cannot access `value` field
  }

  return either.value;
}
```

### isNothing

`isNothing` is just the opposite of `isJust`
