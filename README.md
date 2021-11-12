# lich

A library for chaining computations in TypeScript.
The inspiration for this library comes from the `Maybe` | `Either` monads from Haskell.

## Maybe

`Maybe` can be either `Just<T>` or `Nothing`. It is helpful to know precisely that you either have a value or you don't. You may think that it is just an optional in javascript, but it's much more, because it builds over this concept of having/not having a value and export some useful function we can combine with this concept.

The `Maybe` type export couple of useful function, let's examine what they are and how to use them in practice:

### map()

map() is a function that takes another `mapping` function that will be applied to our `Maybe` only if the value inside is a `Just` (this means that we know that we are transforming our value only when there is actually a value inside). If the value inside our `Maybe` is `Nothing`, nothing will change, we'll still have our `Nothing` as the value.

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

### bind()

TBD

### fold()

TBD

### otherwise()

TBD

### onJust()

TBD

### onNothing()

TBD

### mapAsync()

TBD

### bindAsync()

TBD

### foldAsync()

TBD

### isJust

TBD

### isNothing

TBD
