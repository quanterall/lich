## Error handling

Let's say that your program has an input of a string. That string should be a JSON and should have specific keys and type of values. If you want to make sure that the input string is what it should be, you should:

- **Step 1.**: Validate that the string is an actual JSON.
- **Step 2.**: Validate that all the keys are present and are the correct type.
- Additionally, you want to log an error if any of the steps fails.

There are numbers of ways we could go about this problem in Typescript:

- [Throw + try/catch](#throw+try/catch)
- [Return data or null](#return-data-or-null)
- [Create CustomError type and return data ot CustomError](#create-customerror-type)
- [Using lich](#using-lich)

## Throw + try/catch

Here is how we may go about it using `throw + try/catch`:

```ts
export function maybeParsePost(input: string): Post {
  try {
    const res = JSON.parse(input);
    return validatePost(res);
  } catch (error) {
    if (!error instanceof Error) throw new Error(error);

    console.error(`'maybeParsePost' Failed with: ${error.message}`);
    throw new Error(error.message);
  }
}

type Post = {
  title: string;
  subtitle: string;
  likes: number;
};

function validatePost(json: Record<string, unknown>): Post {
  const fields = ["title", "subtitle", "likes"];
  for (let field of fields) {
    if (!Object.hasOwnProperty.call(json, field)) {
      throw new Error(`Missing field '${field}': ${JSON.stringify(json)}`);
    }
  }

  // We need to explicitly type out these, so that we can use them as these types
  if (typeof json.title !== "string") {
    throw new Error(`Failed to parse title as string: ${JSON.stringify(json)}`);
  }
  if (typeof json.subtitle !== "string") {
    throw new Error(`Failed to parse subtitle as string: ${JSON.stringify(json)}`);
  }
  if (typeof json.likes !== "number") {
    throw new Error(`Failed to parse likes as number: ${JSON.stringify(json)}`);
  }

  return {
    title: json.title,
    subtitle: json.subtitle,
    likes: json.likes,
  };
}
```

The issue with this approach is the `try/catch` nesting that we end up with, if we want to handle the various errors that might happen from each 'throwable' function we call, especially when the input of one 'throwable' function depends on another 'throwable' function.
Additionally, you might forget that your function can actually throw, and call it without `try/catch`, or expect that somewhere on an upper level, some caller function will catch it. And now we are starting to make assumptions, which is already bad.
This means that if you don't want to handle the `try/catch`, you have to verify that some other upper function will catch your throw. (_This doesn't scale. At some point it will be too hard to follow._)

---

## Return data or null

Here is how we may go about it if we return either `Post` or `null`:

```ts
export function maybeParsePost(input: string): Post | null {
  return validatePost(JSON.parse(input));
}

type Post = {
  title: string;
  subtitle: string;
  likes: number;
};

function parseJson(s: string): Record<string, unknown> | null {
  try {
    return JSON.parse(s);
  } catch (e) {
    console.error(`Failed to parse json: ${JSON.stringify(e)}`);
    return null;
  }
}

function validatePost(json: Record<string, unknown> | null): Post | null {
  if (json === null) return null;

  const fields = ["title", "subtitle", "likes"];
  for (let field of fields) {
    if (!Object.hasOwnProperty.call(json, field)) {
      console.error(`Missing field '${field}': ${JSON.stringify(json)}`);
      return null;
    }
  }

  // We need to explicitly type out these, so that we can use them as these types
  if (typeof json.title !== "string") {
    console.error(`Failed to parse title as string: ${JSON.stringify(json)}`);
    return null;
  }
  if (typeof json.subtitle !== "string") {
    console.error(`Failed to parse subtitle as string: ${JSON.stringify(json)}`);
    return null;
  }
  if (typeof json.likes !== "number") {
    console.error(`Failed to parse likes as number: ${JSON.stringify(json)}`);
    return null;
  }

  return {
    title: json.title,
    subtitle: json.subtitle,
    likes: json.likes,
  };
}
```

The issue here is that we need to do our logging in the function itself, because if it fails, we don't get a response with the reason. So if we wish to log the error it needs to happen inside the function.

---

## Create CustomError type

Another approach might be to solve this by introducing our own `CustomError` type. Which will at least solve our issues with not knowing that a function might return an 'unsuccessful' response. So here, we want to lay out either a so called `Happy` path or `Sad` path.

So let's see an example implementation of that:

```ts
export function maybeParsePost(input: string): CustomError | Record<string, unknown> {
  const maybeJson = parseJson(input);
  if (isCustomError(maybeJson)) {
    console.error(`'maybeParsePost' Failed with: ${maybeJson}`);
    return maybeJson;
  }

  const maybePost = validatePost(maybeJson);
  if (isCustomError(maybePost)) console.error(`'maybeParsePost' Failed with: ${maybePost}`);

  return maybePost;
}

// Create our own custom Error type
type CustomError = {
  error: string;
};

// We need to create custom function to know if we got a 'CustomError'
export function isCustomError(e: CustomError | Record<string, unknown>): e is CustomError {
  return e.error !== undefined;
}

type Post = {
  title: string;
  subtitle: string;
  likes: number;
};

function parseJson(s: string): CustomError | Record<string, unknown> {
  try {
    return JSON.parse(s);
  } catch (e) {
    if (e instanceof Error) return { error: e.message, value: s };
    return { error: JSON.stringify(e), value: s };
  }
}

function validatePost(json: Record<string, unknown>): CustomError | Post {
  const fields = ["title", "subtitle", "likes"];
  for (let field of fields) {
    if (!Object.hasOwnProperty.call(json, field)) {
      return { error: `Missing field '${field}': ${JSON.stringify(json)}` };
    }
  }

  // We need to explicitly type out these, so that we can use them as these types
  if (typeof json.title !== "string") {
    return { error: `Failed to parse title as string: ${JSON.stringify(json)}` };
  }
  if (typeof json.subtitle !== "string") {
    return { error: `Failed to parse subtitle as string: ${JSON.stringify(json)}` };
  }
  if (typeof json.likes !== "number") {
    return { error: `Failed to parse likes as number: ${JSON.stringify(json)}` };
  }

  return {
    title: json.title,
    subtitle: json.subtitle,
    likes: json.likes,
  };
}
```

Now when we call our functions, the compiler will not allow us to expect that it finished successfully. We'll need to check what is the return type and only then we would be able to work with the value. This is good, because the compiler will save us from making a mistake.
But it's still not the best, because we still have this `if` nesting in order to work with the errors.

---

## Using lich

Now let's see how `lich` fixes these issues:

```ts
export function maybeParsePost(input: string): Either<string, Post> {
  return maybeJson(input)
    .bind(validatePost)
    .onLeft((l) => console.error(`'maybeParsePost' Failed with: ${l}`));
}

type Post = {
  title: string;
  subtitle: string;
  likes: number;
};

function maybeJson(s: string): Either<string, Record<string, unknown>> {
  try {
    return Right(JSON.parse(s));
  } catch (e) {
    return Left(`Failed to parse string as JSON: ${JSON.stringify(e)}`);
  }
}

function validatePost(json: Record<string, unknown>): Either<string, Post> {
  const fields = ["title", "subtitle", "likes"];
  for (let field of fields) {
    if (!Object.hasOwnProperty.call(json, field)) {
      return Left(`Missing field '${field}': ${JSON.stringify(json)}`);
    }
  }

  // We need to explicitly type out these, so that we can use them as these types
  if (typeof json.title !== "string") {
    return Left(`Failed to parse title as string: ${JSON.stringify(json)}`);
  }
  if (typeof json.subtitle !== "string") {
    return Left(`Failed to parse subtitle as string: ${JSON.stringify(json)}`);
  }
  if (typeof json.likes !== "number") {
    return Left(`Failed to parse likes as number: ${JSON.stringify(json)}`);
  }

  return Right({
    title: json.title,
    subtitle: json.subtitle,
    likes: json.likes,
  });
}
```

In this scenario we would use `Either`, because we want to carry an `Error` with us. The `Either` construction helps us return either the `Happy` or the `Sad` path of the response.
As you can see here the implementation of `maybeParsePost` is much simpler and straight forward.

Let's examine what is happening

```ts
export function maybeParsePost(input: string): Either<string, Post> {
  return (
    maybeJson(input) // first we call `maybeJson` which will return Either<string, Record<string, unknown>>
      // `bind` lets us call a function over an `Either` if it is a `Right`, so if `maybeJson` returns a `Right`, this bind will be called
      // and the function validatePost will get the Record<string, unknown> as an input value
      .bind(validatePost) // a more explicit way to write this would be `.bind((json) => validatePost(json))`
      // Lastly, if we ever get a `Left` of either of the upper calls, this function will be called, so we can `console.error` the failure
      .onLeft((l) => console.error(`'maybeParsePost' Failed with: ${l}`))
  );
}
```

As you can see it's easy to work with Errors using `lich` because it has the tools to help you chain `Happy` paths together.
If at some point we get to a `Sad` path, it will short circuit our chain of methods and won't call any succeeding `bind` or `map`s.
And at the end we can deal with the `Sad` path.
The best thing is that this is type safe. Typescript will not allow us to use an `Either` as a `Right` or `Left` unless we make sure that this is the case.

So for example if we want our `maybeParsePost` to return a parsed Post or a default one (in case the parsing fails), we'll need to do the following:

```ts
export function maybeParsePost(input: string): Post {
  const eitherPost = maybeJson(input)
    .bind(validatePost)
    .onLeft((l) => console.error(`'maybeParsePost' Failed with: ${l}`));

  if (eitherPost.isRight()) return eitherPost.value;

  return {
    title: "Lich is awesome",
    subtitle: "Just try it out!",
    likes: 1024,
  };
}
```

But `lich` has a better way of dealing with such scenarios:

```ts
export function maybeParsePost(input: string): Post {
  return maybeJson(input)
    .bind(validatePost)
    .onLeft((l) => console.error(`'maybeParsePost' Failed with: ${l}`))
    .otherwise({
      title: "Lich is awesome",
      subtitle: "Just try it out!",
      likes: 1024,
    });
}
```
