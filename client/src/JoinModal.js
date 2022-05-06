import { useState, Fragment } from 'react'
import { Dialog, Transition, RadioGroup } from '@headlessui/react'
const gameModes = [
    {
        name: 'Casual',
        description: 'For casual movie lovers',
    },
    {
        name: 'Cinephile',
        description: 'For real cinephiles who wants some challenge',
    },
]

export default function JoinModal(props) {

    let [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState(gameModes[0])

    function closeModal() {
        setIsOpen(false)
    }

    const handleJoinRoomSubmit = (event) => {
        if (event.target.roomId.value !== null) {
            props.usernameCallback(event.target.username.value);
            props.parentCallback(event.target.roomId.value);
            setIsOpen(false);
            event.preventDefault();
            props.gameRoomCallback();
        }
        // props.setTrigger(false);
    }
    const handleGameRoomSubmit = () => {
        // props.gameRoomCallback();
    }

    const handleCreateRoomSubmit = (event) => {
        props.usernameCallback(event.target.username.value);
        event.preventDefault()
        setIsOpen(false);
        props.gameRoomCallback();
        createRoomId(8);;
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


    return (
        <>
            <>
                <button className='border-2 px-3 py-[4px] border-white hover:bg-white hover:text-black rounded-sm' onClick={() => setIsOpen(true)}>Play with Friends</button>
                <Transition show={isOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="fixed inset-0 z-10 overflow-y-auto"
                        onClose={closeModal}
                    >
                        <div className="min-h-screen px-4 text-center">
                            {/* Overlay's transition */}
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-600"
                                enterFrom="opacity-0"
                                enterTo="opacity-70"
                                leave="ease-in duration-500"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Dialog.Overlay className="fixed inset-0 bg-zinc-800 opacity-80" />
                            </Transition.Child>

                            {/* This element is to trick the browser into centering the modal contents. */}
                            <span
                                className="inline-block h-screen align-middle"
                                aria-hidden="true"
                            >
                                &#8203;
                            </span>
                            {/* Modal's transition */}
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-600"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-400"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <div className="border-2 border-black inline-block w-full max-w-md p-6 my-8 overflow-hidden align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                    <form className=' border-2 border-zinc-400 p-4 rounded-md mt-3' onSubmit={handleCreateRoomSubmit}>
                                        <RadioGroup value={selected} onChange={setSelected}>
                                            <RadioGroup.Label className="sr-only">Game Mode</RadioGroup.Label>
                                            <div className="space-y-2">
                                                {gameModes.map((plan) => (
                                                    <RadioGroup.Option
                                                        key={plan.name}
                                                        value={plan}
                                                        className={({ active, checked }) =>
                                                            `${checked ? 'bg-black bg-opacity-90 text-white ' : 'bg-white border-[1px] border-gray-300 hover:bg-gray-200'
                                                            }
                                                        relative rounded-lg shadow-md px-5 py-4 cursor-pointer flex focus:outline-none justify-center`}
                                                    >
                                                        {({ active, checked }) => (
                                                            <>
                                                                <div>
                                                                    <RadioGroup.Label
                                                                        as="p"
                                                                        className={`font-semibold ${checked ? 'text-white' : 'text-gray-900'
                                                                            }`}
                                                                    >
                                                                        {plan.name}
                                                                    </RadioGroup.Label>
                                                                    <RadioGroup.Description
                                                                        as="span"
                                                                        className={`inline ${checked ? 'text-sky-100' : 'text-gray-500'
                                                                            }`}
                                                                    >
                                                                        <span>
                                                                            {plan.description}
                                                                        </span>
                                                                    </RadioGroup.Description>
                                                                </div>
                                                            </>
                                                        )}
                                                    </RadioGroup.Option>
                                                ))}
                                            </div>
                                        </RadioGroup>
                                        <div className='flex flex-col items-center justify-center mt-4'>
                                            <input
                                                className='text-center border-2 border-gray-600'
                                                type="text"
                                                name="username"
                                                placeholder="Enter username"
                                                required
                                            />
                                            <button type="submit" className='border-black border-2 hover:bg-black hover:text-white mt-2 w-32 rounded-sm'>Create Room</button>
                                        </div>
                                    </form>
                                    <p className='my-4'>
                                        OR
                                    </p>
                                    <form className=' border-2 border-gray-400 p-4 rounded-md' onSubmit={handleJoinRoomSubmit} action="#">
                                        <label>Join a game with Room ID:</label>
                                        <div className='flex flex-col items-center justify-center mt-4'>
                                            <input
                                                className='text-center border-2 border-gray-600'
                                                type="text"
                                                name="username"
                                                placeholder="Enter username"
                                                required
                                            />
                                            <input
                                                className='text-center border-2 border-gray-600 mt-2'
                                                name="roomId"
                                                placeholder="Enter Room ID"
                                                required
                                            />
                                            <button onClick={handleGameRoomSubmit} className='border-black border-2 hover:bg-black hover:text-white mt-2 w-16 rounded-sm' type="submit" value="Join">Join</button>
                                        </div>

                                    </form>
                                    <button className="absolute top-0 right-2 m-1"
                                        onClick={closeModal}
                                    >
                                        Close
                                    </button>
                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>
            </>
        </>
    )
}