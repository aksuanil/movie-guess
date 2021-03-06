import React, { useState, useEffect } from 'react'

export default function Loader() {
    const [counter, setCounter] = useState(6);
    const loaderColors = ['text-red-600', 'text-blue-500', 'text-purple-500', 'text-green-500', 'text-yellow-600']

    useEffect(() => {
        counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    }, [counter]);
    return (
        <>
            <div className="mt-4 sm:mt-16 flex items-center justify-center">
                <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full" role="status">
                </div>
                <div className={"absolute spinner-grow inline-block w-12 h-12 bg-current rounded-full opacity-0 " + loaderColors[Math.floor(Math.random() * loaderColors.length)]} role="status">
                </div>
            </div>
            <span className="mt-4 sm:mt-12 text-center">{counter} <br />Searching movies you haven't seen...</span>
        </>
        )
}

