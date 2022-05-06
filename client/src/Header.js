import React from 'react'
import icon from './assets/icon.png'
import InfoModal from './InfoModal'

export default function Header() {

    function openInfoPopup() {

    }

    return (
        <nav class="flex items-center justify-between flex-wrap bg-gradient-to-tr from-zinc-900 via-zinc-900 to-zinc-800 p-3 pl-6 border-b-2 border-zinc-900 ">
            <div class="flex items-center flex-no-shrink text-gray-400 mr-6">
                <img src={icon} class="h-10 w-auto mr-4" alt='' />
                <span class="font-semibold text-xl tracking-tight">Movie Guess</span>
            </div>
            <div className='mr-5'>
                <InfoModal />
            </div>
        </nav>
    )
}
