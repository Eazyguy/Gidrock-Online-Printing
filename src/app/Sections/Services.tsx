import {services} from '@/constants'
import Image from 'next/image'

const Services = () => {
  return (
    <div id='services' className='mt-10 '>
        <h2 className='text-black text-3xl font-bold' >Our Services</h2>
    <p className='text-gray-700 text-lg font-bold'>We offer range of printing services such as:</p>
    <div className='grid grid-cols-1 sm:grid-cols-2  gap-4  mt-5  md:grid-cols-3 lg:grid-cols-4'>
    {
        services.map(item=>(
            <div key={item.title} className="border border-gray-500 rounded-lg mx-auto bg-green-200 max-w-95 ">
                <div className=' relative min-h-65 mx-auto bg-green-100 rounded'>
                <Image 
                src={item.image}
                alt='card'
                sizes=''
                fill
                        />
                </div> 
                <h3 className="text-black text-xl font-bold text-center my-2">{item.title}</h3>
                <p className='text-gray-600 font-bold text-normal text-center mx-5 mb-5'>{item.description }</p>
            </div>
        ))
    }
    </div>
    </div>
  )
}

export default Services