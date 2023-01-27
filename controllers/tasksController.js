import Task from "../models/Task.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";
import mongoose from "mongoose";
import moment from "moment";
const createTask = async (req, res) => {
  const { description, client } = req.body;

  if (!description || !client) {
    throw new BadRequestError("Please provide all values");
  }
  req.body.createdBy = req.user.userId;
  const task = await Task.create(req.body);
  res.status(StatusCodes.CREATED).json({ task });
};
const getAllTasks = async (req, res) => {
  const { status, taskType, sort, search } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };
  // add stuff based on condition

  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (taskType && taskType !== "all") {
    queryObject.taskType = taskType;
  }
  if (search) {
    queryObject.description = { $regex: search, $options: "i" };
  }
  // NO AWAIT

  let result = Task.find(queryObject);

  // chain sort conditions

  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("description");
  }
  if (sort === "z-a") {
    result = result.sort("-description");
  }

  //

  // setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const tasks = await result;

  const totalTasks = await Task.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalTasks / limit);

  res.status(StatusCodes.OK).json({ tasks, totalTasks, numOfPages });
};
const updateTask = async (req, res) => {
  const { id: taskId } = req.params;
  const { client, description } = req.body;

  if (!description || !client) {
    throw new BadRequestError("Please provide all values");
  }
  const task = await Task.findOne({ _id: taskId });

  if (!task) {
    throw new NotFoundError(`No task with id :${taskId}`);
  }
  // check permissions

  checkPermissions(req.user, task.createdBy);

  const updatedTask = await Task.findOneAndUpdate({ _id: taskId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ updatedTask });
};
const deleteTask = async (req, res) => {
  const { id: taskId } = req.params;

  const task = await Task.findOne({ _id: taskId });

  if (!task) {
    throw new NotFoundError(`No task with id :${taskId}`);
  }

  checkPermissions(req.user, task.createdBy);

  await task.remove();

  res.status(StatusCodes.OK).json({ msg: "Success! Task removed" });
};
const showStats = async (req, res) => {
  let stats = await Task.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    completed: stats.completed || 0,
    rejected: stats.rejected || 0,
  };

  let monthlyTasks = await Task.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);
  monthlyTasks = monthlyTasks
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyTasks });
};

export { createTask, deleteTask, getAllTasks, updateTask, showStats };
