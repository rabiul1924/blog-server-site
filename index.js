const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const postRoute = require('./routes/post');
const categoryRoute = require('./routes/categories');
const adminRoute = require('./routes/admin');
const multer = require('multer')

dotenv.config();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Connect")
})

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(console.log('Connect to mongoDB'))
    .catch(err => console.log(err))

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    }, filename: (req, file, callback) => {
        callback(null, req.body.name)
    }
})

const upload = multer({ storage: storage })
app.post('/api/upload', upload.single("file"), (req, res) => {
    res.status(200).json('File has been uploaded')
})

app.use("/api/auth", authRoute)
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)
app.use('/api/categories', categoryRoute)
app.use('/api/admin', adminRoute);

app.listen(process.env.PORT || 5000)