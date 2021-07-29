export const delay = (time) => {
  let timer;
  const promise = new Promise((resolve, reject) => {
    timer = window.setTimeout(() => resolve(), time);
  });
  return {
    promise,
    disposer: () => window.clearTimeout(timer),
  }
};
