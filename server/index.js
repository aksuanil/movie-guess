let MovieList = require('./MovieList')
let fetch = require('node-fetch')
const io = require('socket.io')(5000, {
    cors: {
        origin: "*",
    },
})

let imageUrl = [];

io.on('connection', socket => {
    console.log(socket.id)
    socket.on('send-message', (message, room) => {
        if (room === '') {
            socket.broadcast.emit('received-message', message)
        }
        else {
            //check every received message if its correct
            io.to(room).emit('received-message', message, socket.id)
            let roomUrl = Object.values(imageUrl).filter((obj) => {
                return obj.currentRoom == room
            });
            let roomData = roomUrl[roomUrl.length-1]
            if (message === roomData?.movieName) {
                io.in(room).emit('correct-answer', socket.id)
                getMovieImg(room);
                console.log(message)
            }
        }
    })
    
    const getMovieImg = async (roomId) => {
        let imageData = null
        let movieData = null

        const list = MovieList
        const movieId = list.MovieList[Math.floor(Math.random() * list.MovieList.length)];

        let movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=946d32131d3e345d057d1d753c5c8a06&language=en-US`);
        movieData = await movieResponse.json()
        console.log(movieData.title)
        let imageResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=946d32131d3e345d057d1d753c5c8a06&language=null`);
        imageData = await imageResponse.json()

        imageData.backdrops.map((item) => {
            if (item.width === 1920 && item.height === 1080) { imageUrl.push({"filePath": item.file_path, "currentRoom": roomId, "movieName": movieData.title}) }
        })

        let a = Object.values(imageUrl).filter((obj) => {
            return obj.currentRoom == roomId
        });
        console.log(a)
        let lobbyData = a[a.length-1]

        io.in(roomId).emit('data', lobbyData?.filePath, lobbyData?.currentRoom, lobbyData?.movieName)

    }

    socket.on('leave-room', roomId => {
        socket.leave(roomId)
        const connectedSockets = socket.adapter.rooms.get(roomId)
        io.in(roomId).emit('room-sockets', connectedSockets)
    })

    socket.on('join-room', async (roomId) => {
        socket.join(roomId)

        const socketsInRoom = await io.in(roomId).fetchSockets();
        console.log(socketsInRoom)
        const connectedSockets = socket.adapter.rooms.get(roomId)
        let roomSockeId = socketsInRoom.map(item => item.id)
        io.in(roomId).emit('room-sockets', roomSockeId)

        const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id)
        if (socketRooms.length > 0 && connectedSockets.size === 1) {
            getMovieImg(roomId);
        }
        else {
            let a = Object.values(imageUrl).filter((obj) => {
                return obj.currentRoom == roomId
            });
            let lobbyData = a[a.length-1]

            socket.emit('data', lobbyData?.filePath, lobbyData?.currentRoom, lobbyData?.movieName)
        }
        console.log(connectedSockets.size)
        console.log(`Socket ${socket.id} joined room ${roomId}`)
    })
})
