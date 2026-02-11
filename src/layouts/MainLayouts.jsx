import React from 'react'
import Navbar from '../components/Navbar'

const MainLayouts = ({children}) => {
  return (
    <div className='min-h-screen bg-slate-50'>
        <Navbar />
        <main className='px-6 py-8'>
            {children}
        </main>
    </div>
  )
}

export default MainLayouts



