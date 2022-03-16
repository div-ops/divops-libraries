export function reduceConcat(
  previousValue = "",
  currentValue: string,
  _currentIndex: number,
  _array: string[],
  key?: string
): string {
  if (key == null) {
    return `${previousValue}${currentValue}`;
  }

  if (currentValue == null || currentValue[key] == null) {
    throw new Error(
      `[reduceConcat] cur[key]가 올바르지 않습니다. (currentValue: ${currentValue}, key: ${key})`
    );
  }

  return `${previousValue}${currentValue[key]}`;
}
