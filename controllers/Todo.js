const ToDo = require('../models/Todo');

const todoPerPage = 5;
let page;

const getPaginatedToDos = (req, res) => {
  page = req.query.page;

  ToDo.find({})
    .skip((page - 1) * todoPerPage)
    .limit(todoPerPage)
    .exec((err, todoitems) => {
      if (err) {
        return res.json(err);
      }
      ToDo.countDocuments({}).exec((count_error, count) => {
        if (err) {
          return res.json(count_error);
        }
        return res.json({
          total: count,
          //   page: page,
          //   pageSize: todoitems.length,
          todoitems,
        });
      });
    });

  //   res.status(200).json({todos});
};

const getToDo = async (req, res) => {
  const {id: todoId} = req.params;
  const todo = await ToDo.findOne({_id: todoId});

  res.status(200).json({todo});
};

const createToDo = async (req, res) => {
  const newToDoItem = await ToDo.create(req.body);
  const totalRecordsCount = await ToDo.find({}).count();
  const todoItems = await ToDo.find({});
  const latestCount = totalRecordsCount % todoPerPage;
  const latestItems = await ToDo.find({})
    .limit(latestCount === 0 ? 5 : latestCount)
    .sort({$natural: -1});
  res
    .status(200)
    .json({todoItems, totalRecordsCount, latestItems, newToDoItem});
};

const updateToDo = async (req, res) => {
  const {id: todoId} = req.params;
  const todo = await ToDo.findByIdAndUpdate({_id: todoId}, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({todo});
};

const deleteToDo = async (req, res) => {
  const {id: todoId} = req.params;
  await ToDo.deleteOne({_id: todoId});
  const totalRecordsCount = await ToDo.find({}).count();
  const todoItems = await ToDo.find({});
  res.status(200).json({todoItems, totalRecordsCount});
};

module.exports = {
  getPaginatedToDos,
  getToDo,
  createToDo,
  updateToDo,
  deleteToDo,
};
