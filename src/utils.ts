export const delay = (time: number) => {
  let timer: number;
  const promise = new Promise((resolve, reject) => {
    timer = window.setTimeout(resolve, time);
  });
  return {
    promise,
    disposer: () => window.clearTimeout(timer),
  }
};
