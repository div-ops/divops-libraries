const lastIndex = (arr) => arr.length - 1;
const last = (arr) => arr[arr.length - 1];
const empty = (arr) => !(arr.length > 0);
const mapJoin = (x) => x.join("");

export function chunkStr(str, unit) {
  const arr = str.split("");

  return arr.reduce(
    (acc, cur) =>
      !empty(acc) && last(acc).length < unit
        ? acc.slice(0, lastIndex(acc)).concat(last(acc).concat(cur))
        : acc.concat([cur]),
    []
  );
}
