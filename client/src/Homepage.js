import React, { useState } from 'react'
import GameRoom from './GameRoom'
import PopUp from './PopUp';

export default function Homepage() {
    const [open, setOpen] = useState(false);
    const onClickHandle = () => {
        document.getElementById("button-container").remove();
        setOpen(true);
    };

    const [roomId, setState] = useState("");
    const handleCallback = (childData) => {
        setState(childData)
    }
    console.log(roomId)
    const [buttonPopup, setButtonPopup] = useState(false)
    return (
        <>
            <div className='bg-gradient-to-tl from-slate-500 via-slate-400 to-slate-300 w-screen h-screen'>
                <div id='button-container' className='flex flex-col gap-4 items-center justify-center min-h-screen bg-black text-white'>
                    <button className=' w-24 border-2 border-white hover:bg-white hover:text-black' onClick={onClickHandle}>Play Solo</button>
                    <button className=' w-36 border-2 border-white hover:bg-white hover:text-black' onClick={() => setButtonPopup(true)}>Play with Friends</button>
                </div>
                <PopUp trigger={buttonPopup} setTrigger={setButtonPopup} parentCallback={handleCallback} gameRoomCallback={onClickHandle} />
                <GameRoom open={open} roomId={roomId} />
            </div>
        </>
    )
}
