import Image from 'next/image'
import React from 'react'
import { FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi' 
import { FaWhatsapp } from 'react-icons/fa6'


const Footer = () => {
  return (
    <div className='bg-green-900 px-5 py-8 z-10 -mt-10'>
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5'>
        <div>
            <div className='font-bold text-lg'>
                <Image
                src={'/uu.png'}
                width={150}
                height={75}
                alt='gidrock online printine'
                />
                
            </div>
            <p className='text-sm text-white'>High-quality printing delivered anywhere in Nigeria. Fast, affordable, professional.</p>

            <div id="socials" className='mt-2'>
                    <ul className='flex gap-4 '>
                        <li><a href="#"><FiFacebook size={35}/></a></li>
                        <li><a href="#"><FiTwitter size={35}/></a></li>
                        <li><a href=""><FiInstagram size={35}/></a></li>
                        <li><a href=""><FaWhatsapp size={35}/></a></li>
                    </ul>
                </div>
            </div>
            <div>
            <p className='text-gray-400'>COMPANY</p>
            <ul className='text-white'>
                <li>About</li>
                <li>Products</li>
                <li>Contact</li>
            </ul>
            </div>
            <div>
            <p className='text-gray-400'>SUPPORT</p>
            <ul className='text-white'>
                <li>Track Order</li>
                <li>FAQ</li>
                <li>Privacy Policy</li>
                <li>Terms and Conditions</li>
            </ul>
            </div>
            <div>
            <p className="text-gray-400" >CONTACT</p>
            <ul className='text-white'>
                <li>07017897866, 09133532790, 07070647836</li>
                <li>hello@gidrockprint.ng</li>
                <li>Lagos, Nigeria</li>
            </ul>
            </div>
        </div>
        <div className='border border-x-0 border-b-0 -mx-5 -mb-7 p-2'>
            <p className='text-sm text-gray-200'>© 2026 Gidrock Printing Service. All rights reserved.</p>
        </div>
    </div>
  )
}

export default Footer