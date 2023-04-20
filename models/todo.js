const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  value: String, // 할 일이 어떤 것인지
  donAt: Date, // 할 일이 언제 완료되었는지
  order: Number, // 몇 번째 할 일인지
});

// _id 는 mongoDB에서 제공하는 고유한 id값인데
// 이를 todoId 라는 가상의 컬럼으로 사람들에게 보여주는 작업
TodoSchema.virtual("todoId").get(function () {
  return this._id.toHexString();
});

// 해당하는 모델 바탕으로 조회하거나 생성할 때
// todoId 값을 JSON 타입으로 변경했을 떄 보여준다
TodoSchema.set("toJSON", {
  virtuals: true,
});

// 실제 데이터에는 todoId 라는 데이터 값은 없지만
// 조회할 때 가상의 컬럼으로 생성해서 보여준다
//(express 내부에서면 보여주는 가상의 컬럼이다)

module.exports = mongoose.model("Todo", TodoSchema);
