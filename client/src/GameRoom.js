import { io } from 'socket.io-client'
import React, { useEffect, useState } from 'react'
import Loader from './Loader';
import 'tw-elements';


let isFirstTime = true;
let isFirst = true

const socket = io('http://localhost:5000')
socket.on('connect', () => {
    console.log(`You connected with id: ${socket.id}`)
})



function displayMessage(message, socketId, status) {
    if (status === 'correct') {
        const div = document.createElement("div")
        div.classList.add("text-green-800")
        div.classList.add("font-bold")
        div.textContent = message
        document.getElementById("message-container").append(div)
        document.getElementById('message-container').scrollTop = document.getElementById('message-container').scrollHeight

    }
    else {
        const div = document.createElement("div")
        div.textContent = `${socketId === undefined ? "" : socketId === socket.id ? "Me" : socketId} :  ${message}`
        document.getElementById("message-container").append(div)
        document.getElementById('message-container').scrollTop = document.getElementById('message-container').scrollHeight

    }
}

// receive message from server
socket.on('received-message', (receivedMessage, socketId, status) => {
    //message from server
    displayMessage(receivedMessage, socketId, status)
    isFirst = true;
})
function Timer() {
    const [timer, setTimer] = useState(60);
    useEffect(() => {
        timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
    }, [timer]);

    return (
        <>
            <div className='flex flex-col items-center gap-2 mt-2'>
                <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin h-10 w-10 bg-transparent" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="bg-transparent" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <div>{timer}</div>
            </div>
        </>
    )
}

function GameRoom(props) {
    const { open, roomId } = props;
    const [message, setMessage] = useState("");
    // const [room, setRoom] = useState("");
    const [users, setUsers] = useState("");
    const [img, setImg] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [isTimer, setTimer] = useState(false);
    const [movieName, setMovieName] = useState("");


    //TODO FIX Rendering too many times?
    // trigger if answer is correct from server
    socket.on('correct-answer', (socketId) => {
        setTimer(false)
        if (isFirst === true) {
            debugger
            if (socketId === socket.id) {
                displayMessage(`You found the answer!`, socketId, 'correct')
            }
            else {
                displayMessage(`${socketId} found the answer :(`, socketId, 'correct')
            }
            isFirst = false;
        }
    })

    if (roomId && isFirstTime) {
        // setRoom(roomId);
        isFirstTime = false;
        socket.emit('join-room', roomId)
    }

    const exitClickHandler = () => {
        socket.emit('leave-room', roomId)
    }

    socket.on('room-sockets', (roomUsers) => {
        setUsers(roomUsers);
        console.log(roomUsers)
    })

    socket.on('data', (imgPath, room, movieName, isAdmin) => {
        if (isAdmin) {
            setTimeout(() => setMovieName(movieName), 7000);
            setLoading(true);
            setTimeout(() => setImg(imgPath), 6000);
            setTimeout(() => setLoading(false), 6000);
            setTimeout(() => setTimer(true), 6000);
        }
        setImg(imgPath)
    })
    const handleMessageSubmit = (event) => {
        event.preventDefault();
        if (message == "") {

        } else {
            socket.emit('send-message', message, roomId)
            const messageInput = document.getElementById('message-input');
            messageInput.value = '';
            setMessage("")
        }
    }

    return (
        <>
            {open && (
                <>
                    {/* <UsernamePopup trigger={buttonPopup} setTrigger={setButtonPopup} /> */}
                    <div className=''>
                        <div className=' text-green-800 font-bold'>
                        </div>
                        <div className='flex flex-col sm:flex-row '>
                            <div className='flex border-2 order-2 sm:order-1 border-black h-4/5 w-1/4 max-w-sm	 m-8'>
                                {users === "" ? "" : <ul>
                                    {users[0].map((item, index) => {
                                        return <li key={index}>{item}</li>
                                    })}
                                </ul>}
                            </div>
                            <div className='flex flex-col order-1 items-center mt-6 w-full h-full'>
                                <div className='flex flex-col items-center w-4/5 sm:w-3/5 h-auto'>
                                    {isLoading
                                        ?
                                        <>
                                            {movieName ? 'The movie was ' + movieName : "" }
                                            <Loader />
                                        </>
                                        :
                                        <div>
                                            {img === undefined ? "" : <img className='' src={"https://www.themoviedb.org/t/p/original" + img}></img>}
                                        </div>
                                    }
                                </div>
                                <div className='flex-row w-full flex mt-4 p-2 gap-2'>
                                    <div className='w-3/5 justify-start'>
                                        <h2>Room ID: {roomId}</h2>
                                        <div id='message-container' className='border-2 border-slate-800 h-40 overflow-y-auto bg-slate-300'>
                                        </div>
                                        <form className='flex flex-row' onSubmit={handleMessageSubmit}>
                                            <input
                                                className='w-11/12 border-2 border-slate-800 bg-slate-300'
                                                id='message-input'
                                                type="text"
                                                onChange={(e) => setMessage(e.target.value)}
                                            />
                                            <input type="submit" value="Send" className='w-1/12 min-w-fit bg-slate-300 hover:bg-gray-700 text-gray-800 font-semibold hover:text-white py-2 px-4 border border-gray-900 rounded' />
                                        </form>
                                    </div>
                                    <div className=' border-2 border-slate-800 mt-6 h-40 w-2/5 max-w-sm bg-slate-300'>
                                        {isTimer ? <Timer /> : ""}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default GameRoom;
