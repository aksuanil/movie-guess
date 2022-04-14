import React, { useState, useEffect } from 'react'

export default function Loader() {
    const [counter, setCounter] = useState(6);
    const loaderTexts = ['Prepare for another one!', "Searching movies you haven't seen...", "Even I don't know the next one", 'text-green-500', 'text-yellow-600']
    const text = loaderTexts[Math.floor(Math.random() * loaderTexts.length)]
    const loaderColors = ['text-red-600', 'text-blue-500', 'text-purple-500', 'text-green-500', 'text-yellow-600']

    useEffect(() => {
        counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    }, [counter]);
    return (
        <>
            <div class="mt-16 flex items-center justify-center w-3/5">
                <div class="fixed spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full" role="status">
                </div>
                <div class={"fixed spinner-grow inline-block w-12 h-12 bg-current rounded-full opacity-0 " + loaderColors[Math.floor(Math.random() * loaderColors.length)]} role="status">
                </div>
            </div>
            <span class="mt-12 text-center">{counter} <br />Searching movies you haven't seen...</span>

        </>)
}

