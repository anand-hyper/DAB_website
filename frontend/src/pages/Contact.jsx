import React from 'react'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'

const Contact = () => {

  const handleJobs = () =>{
       toast.info('Job posts is yet to be added')
  }
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500 '>
         <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
         <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt=""/>
         <div className='flex flex-col justify-center items-start gap-6'>
           <p className='font-semibold text-lg text-gray-600'>Our OFFICE</p>
           <p className='text-gray-500'>1F/1 - Williams Street ,<br/> Washington, USA</p>
           <p className='text-gray-500'>Tel: (415) 555-0132 <br/> Email:prescriptonewinnov@gmail.com</p>
           <p className='font-semibold text-lg text-gray-600'> CAREERS AT PRESCRIPTO</p>
           <p className='text-gray-500'>Learn more about our teams and job openings.</p>
           <button onClick={handleJobs} className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
         </div>
      </div>
    </div>
  )
}

export default Contact
