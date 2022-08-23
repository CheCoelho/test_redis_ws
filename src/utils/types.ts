export const assertExists = <T>(x: T | null | undefined): T => {
  if (x === null || typeof x === 'undefined') {
    throw new Error("Expected value to be defined");
  }
  return x;
};