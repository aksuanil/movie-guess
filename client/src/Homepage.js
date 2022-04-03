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
    // let idStack =[]
    // const func = async () => {
    // for (let i=1 ; i <20 ; i++){
    //     let response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=946d32131d3e345d057d1d753c5c8a06&language=en-US&page=${i}`);
    //     let data = await response.json()
    //     console.log(data)
    //     data.results.map( (item) => idStack.push(item.id))
    // }
    // }
    // func();
    // console.log(idStack)

    const [buttonPopup, setButtonPopup] = useState(false)
    return (
        <>
                <div id='button-container' className='flex flex-col gap-4 items-center justify-center min-h-screen bg-black text-white'>
                    <button className=' w-24 border-2 border-white hover:bg-white hover:text-black' onClick={onClickHandle}>Play Solo</button>
                    <button className=' w-36 border-2 border-white hover:bg-white hover:text-black' onClick={() => setButtonPopup(true)}>Play with Friends</button>
                </div>
                <PopUp trigger={buttonPopup} setTrigger={setButtonPopup} parentCallback={handleCallback} gameRoomCallback={onClickHandle} />
                <GameRoom open={open} roomId={roomId} />
        </>
    )
}
