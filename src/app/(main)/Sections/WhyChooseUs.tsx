import { whyChooseUs } from '@/constants'

const WhyChooseUs = () => {
  return (
    <div className='mt-15 '>
            <h2 className='text-3xl md:text-4xl text-black font-bold text-center mb-10'>Why choose Gidrock</h2>
        <div className='flex flex-col md:flex-row gap-4'>
            {whyChooseUs.map((item)=>(
                <div key={item.title} className="mt-2 bg-green-100 p-5 border border-gray-500 rounded">
                    {item.icon}
                    <h3 className="text-black font-bold">{item.title}</h3>
                    <p className="text-gray-800">{item.description}</p>
                </div>
                
            ))}
            </div>
            </div>
  )
}

export default WhyChooseUs