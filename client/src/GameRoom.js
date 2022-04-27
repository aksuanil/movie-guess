import { io } from 'socket.io-client'
import React, { useEffect, useState, useRef } from 'react'
import Loader from './Loader';
import 'tw-elements';
import { ReactSearchAutocomplete } from 'react-reusable-autocomplete'
import movieNamesList from './assets/MovieNames.js'
import { Popover } from '@headlessui/react'


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
        return obj.socketId = socketId
    });
    let result = socketScore.map(a => a.points);
    const initialValue = 0;
    const sumWithInitial = result.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        initialValue
    );
    return sumWithInitial;
}
function Timer(props) {
    const { movieName, roomId, } = props;
    const [timer, setTimer] = useState(30);
    useEffect(() => {
        timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
        if (timer === 0) {
            let isTimeout = true;
            socket.emit('send-message', movieName, roomId, isTimeout)
        }
    });

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

// receive message from server
socket.on('received-message', (receivedMessage, socketId, status) => {
    //message from server
    displayMessage(receivedMessage, socketId, status = 'text')
    isFirst = true;
})
socket.on('data', async (imgPath, room, movieName, isAdmin) => {
    window.setAdminFunc(imgPath, room, movieName, isAdmin);
})

const indexed = movieNamesList.MovieList.map((item, id) => Object.assign(item, { id }))
const movieNames = indexed;

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

    const prevMovieRef = useRef();
    useEffect(() => {
        prevMovieRef.current = movieName;
    });
    const prevMovie = prevMovieRef.current;

    window.setAdminFunc = (imgPath, room, movieName, isAdmin) => setAdmin(imgPath, room, movieName, isAdmin);
    function setAdmin(imgPath, room, movieName, isAdmin) {
        if (isAdmin) {
            // setTimeout(() => setPrevMovie(movieName), 6000);
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
    socket.on('room-sockets', (roomUsers) => {
        setUsers(roomUsers);
    })
    const handleMessageSubmit = (event) => {
        event.preventDefault();
        if (message === "") {

        } else {
            socket.emit('send-message', message, roomId)
            const messageInput = document.getElementById('message-input');
            messageInput.value = '';
            setMessage("")
        }
    }
    const handleOnSelect = (item) => {
        setMessage(item.name)
    };

    const formatResult = (item) => {
        return (
            <>
                <span style={{ display: 'block', textAlign: 'left' }}>{item}</span>
            </>
        )
    }
    const [showPopover, setPopover] = useState(false)

    function copyToClipboard(roomId) {
        navigator.clipboard.writeText(roomId);
        setPopover(true)
        setTimeout(() => {
            setPopover(false);
        }, 2000);
    }

    function CopyPopover() {
        return (
            <>
                <div>Copied to clipboard!</div>
            </>
        )
    }
    return (
        <>
            {open && (
                <>
                    <div className='h-full'>
                        <div className=' text-green-800 font-bold'>
                        </div>
                        <div className='flex flex-col lg:flex-row h-full '>
                            <div className='border-2 order-2 lg:order-1 border-zinc-600 bg-zinc-700 lg:w-1/4 h-min mx-4 lg:m-8 px-4 py-2 mt-4 rounded-lg font-semibold lg:min-h-[200px]'>
                                {users === "" ? "" : <ul className='flex flex-col'>
                                    {users.map((item, index) => {
                                        return <li className='flex justify-between' key={index}><div className='underline underline-offset-1 tracking-wide'>{item}</div> <div className='mr-3 text-green-500'> {showPoints(item)}</div></li>
                                    })}
                                </ul>}
                            </div>
                            <div className='flex flex-col order-1 items-center pt-6 w-full h-fit lg:h-full'>
                                <div className='flex flex-col items-center w-full h-fit lg:h-full'>
                                    <div className='flex flex-col justify-center items-center w-10/12 lg:w-7/12 h-full max-h-full max-w-full'>
                                        {isLoading
                                            ?
                                            <div className='flex flex-col items-center h-full w-full lg:w-fit'>
                                                {prevMovie ? 'The movie was ' + prevMovie : ""}
                                                <Loader />
                                            </div>
                                            :
                                            <div className=' w-full lg:w-fit '>
                                                {img === undefined ? "" : <img className='h-full w-full object-contain rounded-md border-2 border-zinc-400' src={"https://www.themoviedb.org/t/p/original" + img} alt=""></img>}
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className='flex-col lg:flex-col w-full lg:w-full flex lg:pt-0 gap-1 px-6 max-h-96'>
                                    <div className='flex items-end h-12'>
                                        <div className='flex flex-row ml-4'><p className='font-semibold mr-2'>Room ID: </p>{roomId}</div>
                                        <div className='flex-col flex justify-start ml-2'>
                                            {showPopover && <CopyPopover data={roomId} />}
                                            <button onClick={() => copyToClipboard(roomId)}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg></button>
                                        </div>
                                    </div>
                                    <div className='flex-row lg:flex-row w-full flex gap-2 lg:mb-16'>
                                        <div className='w-full lg:w-3/5 justify-start'>
                                            <div id='message-container' className='border-2 rounded-t-xl p-2 border-zinc-600 h-40 overflow-y-auto bg-zinc-700'>
                                            </div>
                                            <form className='flex flex-row' onSubmit={handleMessageSubmit}>
                                                <div className='w-11/12 border-2 border-zinc-600 bg-zinc-700'
                                                    onChange={(e) => setMessage(e.target.value)}
                                                    id='message-input'
                                                    type="text">
                                                    <ReactSearchAutocomplete
                                                        inputSearchString={message}
                                                        items={movieNames}
                                                        onSelect={handleOnSelect}
                                                        // onSearch={handleOnSearch}
                                                        // onHover={handleOnHover}
                                                        // onFocus={handleOnFocus}
                                                        // formatResult={formatResult}
                                                        showIcon={false}
                                                        maxResults={3}
                                                        styling={{
                                                            height: "34px",
                                                            border: "1px solid black",
                                                            borderRadius: "4px",
                                                            backgroundColor: "gray-500",
                                                            hoverBackgroundColor: "gray",
                                                            color: "black",
                                                            fontSize: "14px",
                                                            iconColor: "black",
                                                            lineColor: "black",
                                                            placeholderColor: "black",
                                                            clearIconMargin: "3px 8px 0 0",
                                                            zIndex: 2,
                                                        }}
                                                    />
                                                </div>
                                                <input type="submit" value="Send" className='w-1/12 min-w-fit bg-zinc-700 hover:bg-gray-700 text-gray-300 font-semibold hover:text-white py-1 px-4 border border-gray-900 rounded' />
                                            </form>
                                        </div>
                                        <div className='border-2 rounded-xl border-slate-800 h-24 lg:h-40 w-2/5 lg:w-2/5 bg-zinc-700'>
                                            {isTimer ? <Timer movieName={movieName} roomId={roomId} /> : <p className='flex justify-center'>Get ready for next movie!</p>}
                                        </div>
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
