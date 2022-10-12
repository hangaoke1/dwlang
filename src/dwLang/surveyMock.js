// 模拟题目数据
const mock = {
  name: "hello world",
  questions: new Array(30).fill(1).map((v, index) => {
    return {
      index,
      title: "问题标题信息" + (index + 1),
    };
  }),
};

export default mock;
