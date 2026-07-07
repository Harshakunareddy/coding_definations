const express = require("express");
const cors = require("cors");
const { Op } = require("sequelize");
const sequelize = require("./config/db");
const Task = require("./model/task");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const VALID_STATUSES = ["pending", "in_progress", "completed"];

/* =======================
   GET ALL TASKS
   Supports: ?search=&status=&page=&limit=
======================= */
app.get("/tasks", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const offset = (page - 1) * limit;

    const where = {};

    if (req.query.search) {
      const term = `%${req.query.search}%`;
      where[Op.or] = [
        { title: { [Op.like]: term } },
        { description: { [Op.like]: term } },
      ];
    }

    if (req.query.status && VALID_STATUSES.includes(req.query.status)) {
      where.status = req.query.status;
    }

    const { count, rows } = await Task.findAndCountAll({
      where,
      order: [["id", "DESC"]],
      limit,
      offset,
    });

    res.json({
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

/* =======================
   GET TASK BY ID
======================= */
app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

/* =======================
   CREATE TASK
======================= */
app.post("/tasks", async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || null,
      status: status || "pending",
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

/* =======================
   UPDATE TASK
======================= */
app.put("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const { title, description, status } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ error: "Title is required" });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description?.trim() || null;
    }

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      task.status = status;
    }

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

/* =======================
   DELETE TASK
======================= */
app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await task.destroy();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

/* =======================
   DB CONNECT + START SERVER
======================= */
sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced");

  app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
  });
});
