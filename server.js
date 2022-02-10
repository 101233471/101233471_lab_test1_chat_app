const app = require('express')()
const http = require('http').createServer(app)
const cors = require('cors')
const req = require('express/lib/request')
const PORT = 3000
const mongoose = require('mongoose')
const user = require('./models/user')

const io = require('socket.io')(http)

//cookies
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));


//mongodb
var labtest1db = "mongodb+srv://Nicole:Nic1974201@cluster0.3tmwe.mongodb.net/101233471_lab_test1_chat_app?retryWrites=true&w=majority"
mongoose.connect(labtest1db, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => console.log('database connection successful!'))
   .catch((err) => console.log(err));

//bodyparser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors())

app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/routes/static/login.html")
})

app.get("/index.html", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get("/signup.html", (req, res) => {
    res.sendFile(__dirname + "/routes/static/signup.html")
})

app.get("/login.html", (req, res) => {
    res.redirect("/")
})

//registrating a new user
app.post("/signup.html", async(req, res) => {
    let usernameTaken = await user.exists({username: req.body.username});
    if(usernameTaken === null) {
        let newUser = new user({username: req.body.username, password: req.body.password, name: req.body.name})
        newUser.save();
        res.redirect('/');
    }else {
        res.sendFile(__dirname + '/routes/static/signup.html');
    }
});

//login
app.post('/', async function(req, res) {
    const authenticated = await user.findOne({ username: req.body.username, password: req.body.password });
    if(authenticated) {
        req.session.username = authenticated.username;
        res.redirect('/index.html');
    }
    else
        res.redirect('/');
});



io.on('connection', (socket) => {
    console.log('Connection Successful...')
    //console.log(socket.id)
    //console.log(socket)

    //Send Welcome Msg
    socket.emit('welcome', `Welcome to Chat. Your ID is ${socket.id}`)

    socket.on('message', (data) => {
        //console.log(data)
        //socket.emit('newMessage', data)
        const msg = {
            sender: socket.id,
            message: data
        }

       // io.sockets.emit('newMessage', msg)
       socket.broadcast.emit('newMessage', msg)
    })

    //Join new Room
    socket.on('join', (roomName) => {
        socket.join(roomName)
        const msg = {
            sender: socket.id,
            message: 'Joined the room successfully'
        }
        io.sockets.emit('newMessage', msg)
    })

    socket.on('room_message', (data) => {
        //console.log(data)
        const msg = {
            sender: socket.id,
            message: data.message
        }
        //Direct 1 on 1 msg w socket ID
        //socket.broadcast.to(socketidtosend).emit('message', msg)
        //io.to('socketidtosend').emit('message', msg)

        //To all client in room
        socket.broadcast.to(data.room).emit('newMessage', msg)
    })

    socket.on('disconnect', ()=> {
        console.log(`${socket.id} Client Disconnected...`)

    })
})

http.listen(PORT, () => {
    console.log(`Server running at PORT ${PORT}`)
})


