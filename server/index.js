let MovieList = require('./MovieList')
let fetch = require('node-fetch')
let cors = require('cors');
const PORT = process.env.PORT || 5000

const io = require('socket.io')(PORT, {
    cors: {
        origin: "*",
    },
})

let lobbyData = [];
let currentRoomData = [];
let usernameData = [];
let list = MovieList;

// let MovieNames = [];
// const movies = MovieList
// movies.MovieList.map (async (item) => {
//     let movieName = await fetch(`https://api.themoviedb.org/3/movie/${item}?api_key=946d32131d3e345d057d1d753c5c8a06&language=en-US`);
//     movieData = await movieName.json();
//     MovieNames.push(movieData.title);
// })
// setTimeout(() => console.dir(MovieNames, {'maxArrayLength': null})
// , 3000);

async function getMovieImg(roomId) {
    let imageData = null
    let movieData = null

    const movieId = list.MovieList[Math.floor(Math.random() * list.MovieList.length)];
    let filteredList = list.MovieList.filter(e => e !== movieId)
    list.MovieList = filteredList;

    let movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=946d32131d3e345d057d1d753c5c8a06&language=en-US`);
    movieData = await movieResponse.json()
    let imageResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=946d32131d3e345d057d1d753c5c8a06&language=null`);
    imageData = await imageResponse.json()

    imageData.backdrops.map((item) => {
        // if (item.width === 1920 && item.height === 1080) 
        { lobbyData.push({ "filePath": item.file_path, "currentRoom": roomId, "movieName": movieData.title }) }
    })
    let a = []
    a = Object.values(lobbyData).filter((obj) => {
        return obj.currentRoom == roomId && obj.movieName == lobbyData[lobbyData.length - 1].movieName
    });
    let currentData = a[Math.floor(Math.random() * a.length)]
    storeCurrentRoomData(roomId, currentData)
    sendCurrentRoomData(roomId, isAdmin = true);
}
function storeCurrentRoomData(roomId, currentData) {
    currentRoomData = currentRoomData.filter(e => e.roomId !== roomId)
    currentRoomData.push({ "roomId": roomId, "currentData": currentData });
}
function getCurrentRoomData(roomId) {
    return currentRoomData.find(element => element.roomId == roomId);
}
function sendCurrentRoomData(roomId, isAdmin) {
    let currentRoomData = getCurrentRoomData(roomId);
    io.in(roomId).emit('data', currentRoomData?.currentData.filePath, currentRoomData?.currentData.currentRoom, currentRoomData?.currentData.movieName, isAdmin);
    console.log(currentRoomData?.currentData.movieName)
}

async function getAllPlayers(roomId) {
    let players = [];
    const socketsInRoom = await io.in(roomId).fetchSockets();
    let roomSockeId = socketsInRoom.map(item => item.id)
    players.push(roomSockeId);
    return players;
}

async function getUsernames(roomId) {
    let roomUsernames = usernameData.filter(e => e.roomId == roomId);
    let usernameArray = roomUsernames.map(function(item) { return item["username"]; });

    return usernameArray;
}

io.on('connection', socket => {
    let username = "anonymous";

    socket.on("register-username", newUsername => {
        username = newUsername;
    });

    socket.on('send-message', (message, room, isTimeout) => {
        if (room === '') {
            socket.broadcast.emit('received-message', message, username)
        }
        if (isTimeout === true) {
            io.in(room).emit('correct-answer', username, isTimeout = true)
            getMovieImg(room);
        }
        else {
            //check every received message if its correct
            io.to(room).emit('received-message', message, username )
            let roomUrl = Object.values(lobbyData).filter((obj) => {
                return obj.currentRoom == room
            });
            let roomData = roomUrl[roomUrl.length - 1]
            if (message.toLowerCase() === roomData?.movieName.toLowerCase()) {
                io.in(room).emit('correct-answer', username, isTimeout = false)
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
        usernameData.push({ "roomId": roomId, "username": username });
        const connectedSockets = await getUsernames(roomId)
        io.in(roomId).emit('room-sockets', connectedSockets)
        connectedSockets.length === 1 ? getMovieImg(roomId) : sendCurrentRoomData(roomId, isAdmin = false);
    })
})
