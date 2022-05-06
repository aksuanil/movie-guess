import React, { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

function checkLogo() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    )
}

export default function InfoModal() {

    let [isOpen, setIsOpen] = useState(false)
    function closeModal() {
        setIsOpen(false)
    }
    return (
        <>
            <button className='fill-zinc-200  hover:fill-zinc-500' onClick={() => setIsOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg></button>
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
                            leaveFrom="opacity-40"
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
                                <ul className='text-left my-4'>
                                    <div className='flex flex-row gap-2 mb-2'>{checkLogo()} You can create a room by clicking play button</div>
                                    <div className='flex flex-row gap-2 mb-2'>{checkLogo()} Then simply share your Room ID with your friends</div>
                                    <div className='flex flex-row gap-2 mb-2'>{checkLogo()} And they can join your game session !</div>
                                </ul>

                                <button className="absolute top-0 right-2 m-1" onClick={closeModal}>
                                    Close
                                </button>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
