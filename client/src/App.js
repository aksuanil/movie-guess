import React from 'react'
import Header from './Header';
import Homepage from './Homepage';

function App() {

  return (
    <>
      {/* <body class="debug-screens" /> */}
      <div className='flex flex-col h-screen max-h-screen overflow-hidden'>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <Header />
        <Homepage />
      </div>
    </>
  )
}

export default App;
