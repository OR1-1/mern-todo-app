const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const todoRoutes = require('./routes/todo')
const PORT = 4000;

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
