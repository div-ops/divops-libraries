export function reduceConcat(acc = "", cur, key) {
  if (key == null) {
    return `${acc + cur}`;
  }

  if (cur == null || cur[key] == null) {
    throw new Error(
      `[reduceConcat] cur[key]가 올바르지 않습니다. (cur: ${cur}, key: ${key})`
    );
  }

  return `${acc + cur[key]}`;
}
