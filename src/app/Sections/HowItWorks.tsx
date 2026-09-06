import { howItWorks } from "@/constants"

const HowItWorks = () => {
  return (
    <div className='mt-8'>
        <h2 className='text-3xl md:text-4xl text-black font-bold text-center'>How it Works</h2>
        <p className='text-gray-700 font-bold text-center md:text-lg'>From upload to doorstep in four simple steps.</p>
        <div className="grid grid-cols-1 md:grid-cols-2
        lg:md:grid-cols-4 gap-2 mt-5">
        {howItWorks.map((item)=>(
            <div key={item.title} className="mt-2 bg-green-200 p-5 border border-gray-500 rounded">
                {item.icon}
                <h3 className="text-black font-bold">{item.title}</h3>
                <p className="text-gray-800">{item.description}</p>
            </div>
        ))}
        </div>
    </div>
  )
}

export default HowItWorks