import React from 'react'

export default function PopUp(props) {

    const handleJoinRoomSubmit = (event) => {
        if (event.target.roomId.value !== null) {
            props.parentCallback(event.target.roomId.value);
            props.setTrigger(false);
            event.preventDefault();
            props.gameRoomCallback();
        }
        props.setTrigger(false);
    }
    const handleGameRoomSubmit = () => {
        // props.gameRoomCallback();
    }

    const handleCreateRoomSubmit = () => {
        props.setTrigger(false);
        props.gameRoomCallback();
        createRoomId(8);
    }
    function createRoomId(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        props.parentCallback(result);
    }


    return props.trigger ? (
        <>
            <div className='flex justify-center'>
                <div className=' fixed top-36 w-96 h-96 bg-gray-200'>
                    <div className='flex flex-col items-center justify-center min-h-full gap-6'>
                        <label>Username:</label>
                        <input type="text" id="username" name="username" required />
                        <button onClick={handleCreateRoomSubmit} className='border-black border-2 hover:bg-black hover:text-white mt-2 w-32'>Create Room</button>
                        <h1>OR</h1>

                        <form onSubmit={handleJoinRoomSubmit} action="#" className='flex flex-col gap-1'>
                            <label>Join a game with Room ID:</label>
                            <input
                                name="roomId"
                                placeholder="Enter Room ID"
                                required
                            />
                            <button onClick={handleGameRoomSubmit} className='border-black border-2 hover:bg-black hover:text-white mt-2' type="submit" value="Join">Join</button>
                        </form>
                        <div className='absolute p-8 right-0 top-0 bg-white'>
                            <button className='absolute top-4 right-4' onClick={() => props.setTrigger(false)}>close</button>
                            {props.childeren}
                        </div>
                    </div>
                </div>
            </div>
        </>
    ) : "";
}
