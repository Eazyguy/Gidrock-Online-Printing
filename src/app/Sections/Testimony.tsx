import { testimony } from '@/constants'

const Testimony = () => {
  return (
    <div className='mt-10 bg-green-300 -mx-5 pt-5 pb-20 px-5'>
        <h2 className='text-black text-3xl text-center font-bold my-5 '>What our clients say</h2>
        <div className='flex flex-col md:flex-row gap-4'>
        {
            testimony.map((item)=>(
                <div key={item.name} className='bg-green-200 p-4 border border-gray-700 rounded-lg shadow shadow-gray-900 shadow-sm'>
                    <p className='text-black'>{item.content}</p>
                    <span className='text-black mt-2 font-bold text-lg block'>{item.name}</span>
                    <span className='text-xs text-gray-600 block'>{item.Occupation}</span>
                </div>
            ))
        }
        </div>
        <div className='bg-green-900 p-10 mt-10 rounded-xl flex flex-col gap-5 md:flex-row justify-between'>
        <div className='lg:w-[50%]'>
            <p className='text-2xl font-bold md:text-3xl lg:text-4xl'>Ready to print something great?</p>
            <p className='text-gray-300'>Configure your job, upload your design and check out — all in under 5 minutes.</p>
            </div>
            <div className='flex gap-3 mt-5 items-center'>
                <button className='p-3 bg-gray-900 rounded-lg hover:outline hover:bg-green-900 h-fit'>Start an order</button> <button className='p-3 rounded-lg outline outline-2 hover:bg-gray-900 h-fit'>Talk to us</button>
            </div>
        </div>
    </div>
  )
}

export default Testimony