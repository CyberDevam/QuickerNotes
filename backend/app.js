const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user.route');
const noteRoutes = require('./routes/note.route');
const connectDB = require('./DBconnection/db');
dotenv.config();
connectDB();

app.use(express.json());
app.use(cors());
app.use("/auth",userRoutes);
app.use("/note",noteRoutes);
app.listen(process.env.PORT,()=>{
  console.log("the server is running on localhost:3000");
})
