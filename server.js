const app = require('express')()
const http = require('http').createServer(app)
const cors = require('cors')
const req = require('express/lib/request')
const PORT = 3000

const io = require('socket.io')(http)

app.use(cors())

app.get("/", (req, res) =>{
    res.send("<h1>Welcome to the Chat Room Application</h1>")
})

app.get("/index.html", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

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