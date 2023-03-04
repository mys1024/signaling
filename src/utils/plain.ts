/**
 * get a random integer.
 * @param min minimum integer
 * @param max maximum integer
 * @returns an random integer in [min, max)
 */
export function randomInt(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min));
}

export async function asyncIgnoreError<T>(func: () => Promise<T>) {
  try {
    return await func();
  } catch (_err) {
    return undefined;
  }
}

export function syncIgnoreError<T>(func: () => T) {
  try {
    return func();
  } catch (_err) {
    return undefined;
  }
}
