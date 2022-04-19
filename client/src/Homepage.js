import React, { useState } from 'react'
import GameRoom from './GameRoom'
import JoinModal from './JoinModal';
import PopUp from './PopUp';
import logo from './dist/logo.png'

export default function Homepage() {
    const [open, setOpen] = useState(false);
    const onClickHandle = () => {
        document.getElementById("button-container").remove();
        setOpen(true);
    };

    const [roomId, setState] = useState("");
    const [username, setUsername] = useState("");

    const handleCallback = (childData) => {
        setState(childData)
    }
    const handleUsernameCallback = (username) => {
        setUsername(username)
    }
    const handleOnClickAlert = (username) => {
        alert("Under Construction. Please use 'Play with Friends' and Create Room for solo experience.")
    }
    return (
        <>
            <div className=' bg-zinc-800 w-screen h-screen text-white'>
                <div id='button-container' className='flex flex-col gap-4 items-center pt-24 min-h-screen bg-black text-white'>
                    <img className='p-10' src={logo}></img>
                    <button className=' w-24 border-2 border-white hover:bg-white hover:text-black' onClick={handleOnClickAlert}>Play Solo</button>
                    <JoinModal parentCallback={handleCallback} usernameCallback={handleUsernameCallback} gameRoomCallback={onClickHandle} />

                </div>
                <GameRoom open={open} roomId={roomId} username={username} />
            </div>
        </>
    )
}
