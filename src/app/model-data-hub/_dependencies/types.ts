export type CommonProps<T, U> = {
  [K in Extract<keyof T, keyof U>]: T[K];
};
