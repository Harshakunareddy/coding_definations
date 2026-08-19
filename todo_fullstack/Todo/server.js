const express = require('express');
const app = express();
const port = 3000;
const Task = require("./models/Task");


app.use(express.json());


const rateLimit = require('express-rate-limit');
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// // only rate-limit the tasks endpoint
// app.use('/tasks', limiter);


const sequelize = require("./config/db");

app.get('/', (req,res)=> {
  res.send("Node is running");
});


app.get('/tasks', async (req,res) => {
  try {
    // const tasks = await Task.findAll();

    const cached = await client.get('tasks');
    if (cached) return res.json(JSON.parse(cached));

    //  await client.del('tasks');
    // await client.setEx('tasks', 60, JSON.stringify(tasks));
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page -1) * limit;

    const {count, rows } = await Task.findAndCountAll({limit,offset});

    // res.json(tasks);
    res.status(200).json({success: true,data: rows, total: count, page, totalPages: Math.ceil(count/limit)});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const lastId = parseInt(req.query.lastId) || 0;

    const tasks = await Task.findAll({
      where: { id: { [Op.gt]: lastId } },  // id > lastId
      order: [['id', 'ASC']],
      limit,
    });

    const nextLastId = tasks.length ? tasks[tasks.length - 1].id : null;

    res.status(200).json({
      success: true,
      data: tasks,
      nextCursor: nextLastId,  // client sends this back for next page
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// 1st request:  GET /tasks?limit=10              → returns ids 1-10,  nextCursor=10
// 2nd request:  GET /tasks?limit=10&lastId=10    → returns ids 11-20, nextCursor=20
// 3rd request:  GET /tasks?limit=10&lastId=20    → returns ids 21-30, nextCursor=30


app.post('/task', async(req,res) => {
  try{
    const task = await Task.create(req.body);
    res.status(200).json({success: true, message: "Task created"});
  }catch(err){
    res.status(500).json({success: false, message: err.message});
  }
});

app.put('/task/:id', async (req,res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const updated_task = await task.update(req.body);
    res.status(200).json({success: true, data: updated_task});
  } catch (err) {
    res.status(500).json({success: false, message: err.message});
  }
})

app.delete('/delete_task/:id', async (req,res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await task.destroy();
    res.status(201).json({
        success: true,
        data: task
    });
    
  } catch (err) {
    res.status(500).json({success: false, message: err.message});
  }
})

sequelize
  .authenticate()
  .then(() => {
    console.log("DB Connected");
    app.listen(port,()=>{
      console.log("server is running");
    })
  }).catch((err) => {
    console.error("DB Not Connected", err);
});