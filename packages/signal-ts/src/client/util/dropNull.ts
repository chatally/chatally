export function dropNull<T>(value: NonNullable<T> | null | undefined):
  T | undefined {
  return (value === null) ? undefined : value;
}
