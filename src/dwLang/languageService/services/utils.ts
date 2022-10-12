export const getRangeInfo = (word) => {
  const questionLabels = /Q[0-9]+/i.exec(word);
  const endLabels = /~[0-9]+/.exec(word);
  const qNumber = +questionLabels?.[0].slice(1);
  const end = endLabels?.[0].slice(1);
  return {
    qNumber,
    end,
  };
};
