const express = require('express');
const app = express();
const sequelize = require('./config/db');
const redis = require('./config/redis');
const Task = require('./model/task');

app.use(express.json());

const rateLimit = require('express-rate-limit');
const rateLimiter = rateLimit({windowMs: 15 * 60 * 1000, max:100 });
app.use(rateLimiter);

app.get('/', (req,res)=> {
    console.log("Node is Running");
})


// get api
// app.get('/tasks', async (req,res) => {
//     const Tasks = await Task.findAll();
//     res.json({
//         "success" : true,
//         "data" : tasks,
//     })
// });

app.get('/tasks', async (req,res) => {
   const limit = parseInt(req.query.limit) || 10; 
   const last_id = parseInt(req.query.last_id) || 0;
   
    const where = { id: { [Op.gt]: last_id } };

    if (search) {
        where.name = { [Op.like]: `%${search}%` };
    }

   const tasks = await Task.findAll({
    // where: { id: { [Option.gt]: last_id } },
    where,
    order: [['id', 'ASC']],
    limit,
   })

   const next_last_id = tasks.length ? tasks[tasks.length - 1].id : null;
   

});


app.post('/task/create', async (req, res)=>{
    try{
        const {title, age} = req.body;
        const task = await Task.create({
            title: title,
            age: age,
        });

        res.json({
            'success': true,
            'data': task,
        });
        
    }catch(err){
        res.json({
            'success' : false,
            'message' : err.message,
        })
    }
});

app.post('/task/update/:id', async (req,res)=>{
    const Task = await Task.findByPk(req.params.id);
    const task = Task.update({
        'title': req.title,
        'age': req.age,
    });
    res.json();
})

app.get('/task/:id', async (req,res) => {
    const task = await Task.findByPk(req.params.id);
    if(!task) {
        res.json({
            'success' : false,
        });
    }
    else{
        res.json(task);
    }
});

app.delete('/task/delete/:id', async (req,res) => {
    const task = await Task.findByPk(req.params.id);
    if(!task) {
        res.json({
            'success' : false,
            'message' : "Not found",
        });
    }
    else{
        await task.destroy();
        res.json();
    }
})

sequelize
    .authenticate()
    .then(() => {
        console.log("db connected");
        app.listen(3000, ()=>{
            console.log("server is running");
        });
    });