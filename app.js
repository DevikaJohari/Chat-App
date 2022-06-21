const express = require('express');
const bodyParser = require('body-parser');
const socket = require('socket.io');

const app=express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.set('view engine','ejs');
var port = process.env.PORT || 3000;

//Render Index page
app.get('/', (req, res) => {
    res.render('index')
})

//Start Server
const server = app.listen(port, () => {
    console.log(`Server Running on port ${port}`)
})

app.post('/room', (req,res)=>{
    RoomName = req.body.RoomName;
    UserName = req.body.UserName;
    res.redirect(`/room?UserName=${UserName}&RoomName=${RoomName}`)
})

app.get('/room',(req,res)=>{
    res.render('room')
})

const io = socket(server);
require('./utils/socket')(io);