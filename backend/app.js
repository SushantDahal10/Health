const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRouter = require('./routes/userroute.js');

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const mongo_connect = process.env.mongo_connect;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api/user', userRouter);

mongoose.connect(mongo_connect, {}).then(() => {
  console.log('mongodb connected successfully');
}).catch((err) => {
  console.log(err);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
