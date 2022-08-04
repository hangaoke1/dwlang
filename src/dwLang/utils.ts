export const dslLog = (...messages) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...messages);
  }
};
