const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const userRoute = require('./Routes/users')
const authRoute = require('./Routes/auth');
const postRoute = require('./Routes/post');
const multer = require("multer");
const path = require("path");
const conversationRoute = require('./Routes/conversation');
const messageRoute = require('./Routes/messages');
const cors = require('cors');
const bodyParser = require('body-parser');


dotenv.config();
PORT = 8000;


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors())

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('database connect')
});


app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage= multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/images");
    },
    filename: (req,file,cb)=>{
        cb(null,req.body.name)
    },
});

app.use("/images",express.static(path.join(__dirname,"public/images")))

const upload = multer({storage});
app.post("/api/upload", upload.single("file"),(req,res)=>{
    try{
        return res.status(200).json("File upload successfully")

    }catch(err){
        console.log(err)
    }
})

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})