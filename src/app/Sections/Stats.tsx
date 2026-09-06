import React from 'react'

const Stats = () => {
  return (
    <div className='bg-green-400/50 p-5 md:p-10 my-4 -mx-5 grid grid-cols-2 md:grid-cols-4 gap-4'>
        <div className='text-center'>
            <span className=' text-3xl md:text-4xl font-extrabold text-black'>2400+</span><br/> <span className='md:text-sm text-xs text-gray-600 font-bold'>BRANDS SERVED</span>
        </div>

        <div className='text-center'>
            <span className=' text-3xl md:text-4xl font-extrabold text-black'>36</span><br/> <span className='md:text-sm text-xs text-gray-600 font-bold'>STATES DELIVERED</span>
        </div>

        <div className='text-center'>
            <span className=' text-3xl md:text-4xl font-extrabold text-black'>48hr</span><br/> <span className='md:text-sm text-gray-600 text-xs font-bold'>AVG. TURNAROUND</span>
        </div>

        <div className='text-center'>
            <span className=' text-3xl md:text-4xl font-extrabold text-black'>99%</span><br/> <span className='md:text-sm text-xs text-gray-600 font-bold'>ON-TIME RATE</span>
        </div>
        
    </div>
  )
}

export default Stats