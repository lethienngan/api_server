function expect(expectation: boolean, fn: Function) {
  if (expectation !== fn()) {
    throw Error(`Falsy`);
  }
}

// Engine rule

// From Blue, you can go with Green
// From Blue, you can go with Yellow
// From Green, you can only go to Blue
// From Yellow, you can only go to Blue
// You cannot visit Yellow consecutively

// engine(["blue"]) -> ok
// engine(["blue", "yellow", "blue"]) -> ok
// engine(["blue", "green", "blue", "green"]) -> ok
// engine(["blue", "green", "blue", "yellow"]) -> ok
// engine(["blue", "yellow", "blue", "green", "blue", "yellow"]) -> ok
// engine(["yellow", "green"]) -> not ok
// engine(["blue", "green", "blue", "yellow", "blue", "yellow"]) -> not ok
function checkConsecutively(i: number, arr: string[]): boolean {
  if ("yellow" === arr[i + 2] && "yellow" === arr[i + 4]) {
    return false;
  }
  return true;
}

function engine(input: string[]): boolean {
  let result = true;
  if (input.length === 0) return false;
  else {
    for (let i = 0; i < input.length - 1; i++) {
      if (input[i] === "yellow") {
        result = checkConsecutively(i, input);
        if (result === false) break;
      }
      if (input[i] === "green" && input[i + 1] === "yellow") {
        result = false;
      }
      if (input[i] === "yellow" && input[i + 1] === "green") {
        result = false;
      }
    }
  }
  return result;
}

function cases() {
  expect(true, () => engine(["blue"]));
  expect(true, () => engine(["blue", "yellow", "blue"]));
  expect(true, () => engine(["blue", "green", "blue", "green"]));
  expect(true, () => engine(["blue", "green", "blue", "yellow"]));
  expect(true, () =>
    engine(["blue", "yellow", "blue", "green", "blue", "yellow"])
  );
  expect(false, () => engine(["yellow", "green"]));
  expect(true, () =>
    engine(["blue", "green", "blue", "yellow", "blue", "yellow"])
  );
  // for dynamic inputs
  expect(false, () =>
    engine([
      "blue",
      "green",
      "blue",
      "yellow",
      "blue",
      "yellow",
      "blue",
      "yellow",
      "blue",
      "yellow"
    ])
  );
  // 2 continuos yellow
  expect(true, () =>
    engine([
      "blue",
      "green",
      "blue",
      "yellow", // original index
      "blue",
      "yellow", // next arr block
      "blue",
      "green", // final block
      "blue",
      "yellow"
    ])
  );
  // 2 continuos yellow
  expect(false, () =>
    engine([
      "blue",
      "green",
      "blue",
      "yellow", // original index
      "blue",
      "yellow", // next arr block
      "blue",
      "yellow",
      "blue",
      "green", // final block
      "blue",
      "yellow"
    ])
  );
  expect(false, () => engine([]));
}
cases();
