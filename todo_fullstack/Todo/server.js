const express = require('express');
const app = express();
const port = 3000;
const Task = require("./models/Task");


app.use(express.json());

const sequelize = require("./config/db");

app.get('/', (req,res)=> {
  res.send("Node is running");
});


app.get('/tasks', async (req,res) => {
  try {
    const tasks = await Task.findAll();
    // res.json(tasks);
    res.status(200).json({success: true,data: tasks});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
});

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