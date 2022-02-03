<script lang="ts">
  import { Just, Nothing, nullableToEither } from "@quanterall/lich";

  let count: number = 0;
  let initial: number | undefined = undefined;
  $: someReactiveVariable = nullableToEither(initial, 0);

  $: maybeGoodCount = count > 0 ? Just(count) : Nothing();
  const increment = () => {
    count += 1;
    if (count > 4) initial = count;
  };
</script>

<button on:click={increment}>
  Clicks: {count}
</button>

<p>
  {maybeGoodCount.fold("Nothing", (count) => `Just(${count})`)}
</p>

<p>
  {someReactiveVariable.fold(
    (x) => -x,
    (x) => x,
  )}
</p>

<style>
  button {
    font-family: inherit;
    font-size: inherit;
    padding: 1em 2em;
    color: #ff3e00;
    background-color: rgba(255, 62, 0, 0.1);
    border-radius: 2em;
    border: 2px solid rgba(255, 62, 0, 0);
    outline: none;
    width: 200px;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
  }

  button:focus {
    border: 2px solid #ff3e00;
  }

  button:active {
    background-color: rgba(255, 62, 0, 0.2);
  }
</style>
