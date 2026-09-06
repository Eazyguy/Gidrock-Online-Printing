import { SparklesIcon,ClockIcon, TruckIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { ArrowLongRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="mt-20  md:flex md:flex-row">
        <div>
        <div className="mt-10 bg-white text-black rounded-full text-sm  font-bold p-2 w-fit flex gap-2">
            <SparklesIcon className="w-5"/> NATIONWIDE PRINTING ON DEMAND</div>
        <div className="text-4xl font-bold mt-5 ">
        <span className='text-black'>Print with </span><span className="text-green-700">confidence.</span>
        </div>
        
        <p className='text-slate-700 font-bold text-xl mt-2'>High-quality printing delivered anywhere in Nigeria. Fast turnaround, affordable prices, professional finishing — all from one online shop.</p>

        <div className='mt-5 flex gap-10 text-lg font-bold'>
            <button className='py-3 px-4 bg-green-800 rounded shadow shadow-lg shadow-gray-900'>Order Now <ArrowLongRightIcon className="w-5 inline ml-2"/></button>
            <button className='py-3 px-4 bg-white text-black rounded-lg shadow shadow-xs shadow-gray-900'>Browse Products</button>
        </div>

        <div className="mt-5 text-gray-700 font-bold">
            <span className="me-10"><ClockIcon className="w-5 inline"/> Fast Delivery</span> 
            <span className="me-10"><TruckIcon className="w-5 inline"/> Delivery Nationwide</span>

            <span><ShieldCheckIcon className="w-5 inline"/> Secure Payment</span>
        </div>
        </div>
        <div id="hero-img" className="relative w-full h-100 rounded-lg bg-green-800 mt-5 mx-auto md:mx-10 shadow shadow-lg shadow-gray-700">
        <Image 
        src="/hero.jpeg"
        fill
        alt=""
        className="rounded"
        />
        <div id="trusted" className="bg-white px-4 py-3 relative top-80 w-fit rounded-xl text-center"><span className="text-gray-600 font-bold text-lg">Trusted by</span> <br/>
        <span className="text-black text-xl font-extrabold">2400+ brands</span></div>
        </div>
        </div>
  )
}

export default Hero