const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const todoRoutes = express.Router();
const PORT = 4000;

let Todo = require('./todo.model');

// DataBase
// mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true }); // deprecated
// mongoose.connect("mongodb://10.10.50.116:27017/todos", { useUnifiedTopology: true, useNewUrlParser: true });
mongoose
  .connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
  .then(() => console.log('Database Connected'))
  .catch(err => console.log(err));

const connection = mongoose.connection;

connection.once('open', function() {
  console.log("MongoDB database connection established successfully");
})

// Routes
todoRoutes.route('/').get(function(req, res) {
  Todo.find(function(err, todos) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(todos)
    }
  });
});

todoRoutes.route('/:id').get(function(req, res) {
  let id = req.params.id;
  Todo.findById(id, function(err, todo) {
    if (!todo)
      res.status(404).send("data is not found");
    else
      res.json(todo);
  });
});

todoRoutes.route('/add').post(function(req, res) {
  let todo = new Todo(req.body);
  todo.save()
  .then(todo => {
    res.status(200).json({'todo': 'todo added successfully'});
  })
  .catch(err => {
    res.status(400).send('adding new todo failed');
  });
});

todoRoutes.route('/update/:id').post(function(req, res) {
  Todo.findById(req.params.id, function(err, todo) {
    if (!todo)
      res.status(404).send("data is not found");
    else {
      todo.todo_description = req.body.todo_description;
      todo.todo_responsible = req.body.todo_responsible;
      todo.todo_priority = req.body.todo_priority;
      todo.todo_completed = req.body.todo_completed;

      todo.save()
      .then(todo => {
          res.json('Todo updated!');
      })
      .catch(err => {
          res.status(400).send("Update not possible");
      });
    }
  });
});

// App
app.use(cors());
app.use(bodyParser.json());
app.use('/api/v1/todos', todoRoutes);
if (process.env.NODE_ENV === 'production') {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    // res.sendFile(path.resolve(__dirname, "client", "build", "index.html")); //PROD
    res.sendFile(path.resolve(__dirname, "client", "index.html"));
  });
}


app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
