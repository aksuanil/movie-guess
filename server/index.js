let MovieList = require('./MovieList')
let fetch = require('node-fetch')
let cors = require('cors');

const PORT = process.env.PORT || 5000

const io = require('socket.io')(PORT, {
    cors: {
        origin: "*",
    },
})

let imageUrl = [];

async function getMovieImg(roomId) {
    let imageData = null
    let movieData = null

    const list = MovieList
    const movieId = list.MovieList[Math.floor(Math.random() * list.MovieList.length)];

    let movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=946d32131d3e345d057d1d753c5c8a06&language=en-US`);
    movieData = await movieResponse.json()
    let imageResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=946d32131d3e345d057d1d753c5c8a06&language=null`);
    imageData = await imageResponse.json()

    imageData.backdrops.map((item) => {
        if (item.width === 1920 && item.height === 1080) { imageUrl.push({"filePath": item.file_path, "currentRoom": roomId, "movieName": movieData.title}) }
    })
    sendRoomImg(roomId, isAdmin = true);
}

function sendRoomImg(roomId, isAdmin) {
    let a = Object.values(imageUrl).filter((obj) => {
        return obj.currentRoom == roomId });
    let lobbyData = a[a.length-1]
    lobbyData?.movieName == undefined ? getMovieImg(roomId) : io.in(roomId).emit('data', lobbyData?.filePath, lobbyData?.currentRoom, lobbyData?.movieName, isAdmin);
    console.log(lobbyData?.movieName)
}

async function getAllPlayers(roomId) {
    let players = [];
    const socketsInRoom = await io.in(roomId).fetchSockets();
    let roomSockeId = socketsInRoom.map(item => item.id)
    players.push(roomSockeId);
    return players;
}

io.on('connection', socket => {
    console.log(socket.id)
    socket.on('send-message', (message, room, isTimeout) => {
        if (room === '') {
            socket.broadcast.emit('received-message', message, socket.id)
        }
        if(isTimeout === true){
            io.in(room).emit('correct-answer', socket.id, isTimeout)
            getMovieImg(room);
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

    socket.on('leave-room', roomId => {
        socket.leave(roomId)
        const connectedSockets = getAllPlayers(roomId)
        io.in(roomId).emit('room-sockets', connectedSockets)
    })

    socket.on('join-room', async (roomId) => {
        socket.join(roomId)
        const connectedSockets = await getAllPlayers(roomId)
        io.in(roomId).emit('room-sockets', connectedSockets)
        connectedSockets[0].length === 1 ? getMovieImg(roomId) : sendRoomImg(roomId, isAdmin = false);
    })
})
