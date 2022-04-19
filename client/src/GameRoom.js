import { io } from 'socket.io-client'
import React, { useEffect, useState } from 'react'
import Loader from './Loader';
import 'tw-elements';


let isFirstTime = true;
let isFirst = true
let userScore = [];
const socket = io('https://morning-castle-74758.herokuapp.com/')

function displayMessage(message, socketId, status) {
    if (status === 'correct' || status === 'timeout') {
        const div = document.createElement("div")
        if (status === 'timeout') {
            div.classList.add("text-amber-700")
            div.classList.add("font-bold")
        }
        if (status === 'correct') {
            div.classList.add("text-green-800")
            div.classList.add("font-bold")
        }
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

function addPoints(socketId, points) {
    userScore.push({ "socketId": socketId, "points": points })
}
function showPoints(socketId) {
    let socketScore = Object.values(userScore).filter((obj) => {
        return obj.socketId == socketId
    });
    let result = socketScore.map(a => a.points);
    const initialValue = 0;
    const sumWithInitial = result.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        initialValue
      );
    return sumWithInitial;
}
// receive message from server
socket.on('received-message', (receivedMessage, socketId, status) => {
    //message from server
    displayMessage(receivedMessage, socketId, status = 'text')
    isFirst = true;
})
function Timer(props) {
    const { movieName, roomId, } = props;
    const [timer, setTimer] = useState(30);
    useEffect(() => {
        timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
        if (timer == 0) {
            let isTimeout = true;
            socket.emit('send-message', movieName, roomId, isTimeout)
        }
    }, [timer]);

    return (
        <>
            <div className='flex flex-col items-center gap-2 mt-2'>
                <svg xmlns="http://www.w3.org/2000/svg" className="animate-spin h-10 w-10 bg-transparent" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="bg-transparent" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <div>{timer}</div>
            </div>
        </>
    )
}
socket.on('data', async (imgPath, room, movieName, isAdmin) => {
        window.setAdminFunc(imgPath, room, movieName, isAdmin);
})

function GameRoom(props) {
    const { open, roomId, username } = props;
    window.userN = username;
    socket.emit("register-username", username);
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState("");
    const [img, setImg] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [isTimer, setTimer] = useState(false);
    const [movieName, setMovieName] = useState("");

    const [prevMovie, setPrevMovie] = useState("");
    window.setAdminFunc = (imgPath, room, movieName, isAdmin) => setAdmin(imgPath, room, movieName, isAdmin);
    function setAdmin(imgPath, room, movieName, isAdmin){
        if (isAdmin) {
            setTimeout(() => setPrevMovie(movieName), 6000);
            setMovieName(movieName);
            setLoading(true);
            setTimeout(() => setImg(imgPath), 6000);
            setTimeout(() => setLoading(false), 6000);
            setTimeout(() => setTimer(true), 6000);
        }
        setImg(imgPath)
    }

    useEffect(() => {
        console.log(movieName)
      }, [movieName]);

    //TODO FIX Rendering too many times?
    socket.on('correct-answer', (user, isTimeout) => {
        setTimer(false)
        if (isFirst === true) {
            if (isTimeout === true) {
                displayMessage(`Time is up!`, user, 'timeout')
            }
            else if (user === window.userN) {
                displayMessage(`You found the answer!`, user, 'correct')
                addPoints(user, 1)
            }
            else {
                displayMessage(`${user} found the answer :(`, user, 'correct')
                addPoints(user, 1)
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
                    <div className=''>
                        <div className=' text-green-800 font-bold'>
                        </div>
                        <div className='flex flex-col sm:flex-row'>
                            <div className='border-2 order-2 sm:order-1 border-black sm:w-1/4 h-4/5 m-8 '>
                                {users === "" ? "" : <ul className='flex flex-col'>
                                    {users.map((item, index) => {
                                        return <li className='flex justify-between' key={index}><div>{item}</div> <div className='mr-3'> {showPoints(item)}</div></li>
                                    })}
                                </ul>}
                            </div>
                            <div className='flex flex-col order-1 items-center pt-6 w-full sm:h-screen h-full'>
                                <div className='flex flex-col items-center w-4/5 sm:w-3/5 h-1/4 sm:h-3/6'>
                                    {isLoading
                                        ?
                                        <>
                                            {prevMovie ? 'The movie was ' + prevMovie : ""}
                                            <Loader />
                                        </>
                                        :
                                        <>
                                            {img === undefined ? "" : <img className=' rounded-md border-2 border-zinc-400' src={"https://www.themoviedb.org/t/p/original" + img}></img>}
                                        </>
                                    }
                                </div>
                                <div className='flex-row w-full flex mt-4 p-16 gap-2 bottom-0'>
                                    <div className='w-3/5 justify-start'>
                                        <h2>Room ID: {roomId}</h2>
                                        <div id='message-container' className='border-2 border-zinc-600 h-40 overflow-y-auto bg-zinc-700'>
                                        </div>
                                        <form className='flex flex-row' onSubmit={handleMessageSubmit}>
                                            <input
                                                className='w-11/12 border-2 border-zinc-600 bg-zinc-700'
                                                id='message-input'
                                                type="text"
                                                onChange={(e) => setMessage(e.target.value)}
                                            />
                                            <input type="submit" value="Send" className='w-1/12 min-w-fit bg-zinc-700 hover:bg-gray-700 text-gray-800 font-semibold hover:text-white py-1 px-4 border border-gray-900 rounded' />
                                        </form>
                                    </div>
                                    <div className=' border-2 border-slate-800 mt-6 h-40 w-2/5 max-w-sm bg-zinc-700'>
                                        {isTimer ? <Timer movieName={movieName} roomId={roomId} /> : ""}
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
