import React from 'react'
import Header from './Header';
import Homepage from './Homepage';

function App() {

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <body className='flex flex-col h-screen max-h-screen overflow-hidden'>
        <Header />
        <Homepage />
      </body>
    </>
  )
}

export default App;
