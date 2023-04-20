const express = require("express");
const Todo = require("../models/todo.js");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hi");
});

router.post("/todos", async (req, res) => {
  const { value } = req.body;
  const maxOrderByUserId = await Todo.findOne().sort("-order").exec();

  const order = maxOrderByUserId ? maxOrderByUserId.order + 1 : 1;

  const todo = new Todo({ value, order });
  await todo.save();

  return res.send({ todo });
});

router.get("/todos", async (req, res) => {
  const todos = await Todo.find().sort("-order").exec();

  res.send({ todos: todos });
});

router.patch("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;
  const { order } = req.body;

  //1. todoId 에 해당하는 할 일이 있는가?
  //1-1. todoId 에 해당하는 할 일이 없으면 에러를 출력한다
  const currentTodo = await Todo.findById(todoId); // _id 에서 비교해서 맞는 값을 반환
  if (!currentTodo) {
    return res.status(400).json({ errorMessage: "존재하지 않는 할 일 입니다" });
  }

  if (order) {
    const targetTodo = await Todo.findOne({ order }).exec();
    if (targetTodo) {
      targetTodo.order = currentTodo.order;
      await targetTodo.save();
    }
    currentTodo.order = order;
    await currentTodo.save();
  }

  res.send();
});

module.exports = router;
