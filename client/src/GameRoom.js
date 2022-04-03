import { io } from 'socket.io-client'
import React, { useEffect, useState } from 'react'

let isFirstTime = true;

const socket = io('http://localhost:5000')
socket.on('connect', () => {
    console.log(`You connected with id: ${socket.id}`)
})

function displayMessage(message, socketId) {
    if (socketId === 'correct')
    {
        const div = document.createElement("div")
        div.classList.add("text-green-800")
        div.classList.add("font-bold")
        div.textContent = message
        document.getElementById("message-container").append(div)
    }
    else{
        const div = document.createElement("div")
        div.textContent = `${socketId === undefined ? "Me" : socketId === 'correct' ? "" : socketId} :  ${message}`
        document.getElementById("message-container").append(div)
    }
}

// receive message from server
socket.on('received-message', (receivedMessage, socketId) => {
    //message from server
    displayMessage(receivedMessage, socketId)
})

// trigger if answer is correct from server
socket.on('correct-answer', (socketId) => {
    if (socketId === socket.id){
        displayMessage(`You found the answer!`, 'correct')
    }
    else {
        displayMessage(`${socketId} found the answer :(`, 'correct')
    }
    
})

function GameRoom(props) {
    const { open, roomId } = props;
    const [message, setMessage] = useState("");
    const [room, setRoom] = useState("");
    const [users, setUsers] = useState("");
    if (roomId && isFirstTime) {
        setRoom(roomId);
        isFirstTime = false;
        socket.emit('join-room', roomId)
    }

    const exitClickHandler = () =>{
        socket.emit('leave-room', roomId)
    }

    socket.on('room-sockets', (roomUsers) => {
        debugger
        setUsers(roomUsers);
        console.log(roomUsers);
        console.log(users);

    })

    const [img, setImg] = useState("");
    const [movieName, setMovieName] = useState("");
    socket.on('data', (imgPath, room, movieName) => {
        setImg(imgPath)
        setMovieName(movieName)
    })


    const handleMessageSubmit = (event) => {
        displayMessage(message);
        event.preventDefault();
        socket.emit('send-message', message, roomId)
    }
    return (
        <>
            {open && (
                <>
                    <div className=' text-green-800 font-bold'></div>
                    <div className='flex flex-row w-screen h-screen'>
                        <div className='flex border-2 border-black h-4/5 w-2/5 m-8'>

                        </div>
                        <div className='flex flex-col items-center mt-8 w-full h-full'>
                            <div className='flex justify-start w-3/5 h-auto'>
                                {img === undefined ? "" : <img className='' src={"https://www.themoviedb.org/t/p/original" + img}></img>}
                            </div>
                            <div className='w-full p-8'>
                                <h2>Room ID: {roomId}</h2>
                                <div id='message-container' className='border-2 border-black h-40 overflow-y-auto'>
                                </div>
                                <form onSubmit={handleMessageSubmit}>
                                        <input
                                            className='w-11/12 border-2 border-black'
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                        />
                                        <input type="submit" value="Send" className='w-1/12 border-2 border-black' />
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default GameRoom;
