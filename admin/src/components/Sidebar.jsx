import React, { useContext } from 'react'
import { NavLink,useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { useEffect } from 'react'

const Sidebar = () => { 
  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)
  const navigate = useNavigate();

  useEffect(() => {
    if (!aToken && !dToken) {
      navigate('/login');
    }
  }, [aToken, dToken, navigate]);
 
  if ( aToken && !dToken){
  return (
    <div className='min-h-screen bg-white border-r'>
       
         <ul className='text-[#515151] mt-5'>
            <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive  ? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/admin-dashboard'}>
                <img src={assets.home_icon} alt=""/>
                <p className='hidden md:block'>Dashboard</p>
            </NavLink>
            <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive  ? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/all-appointments'}>
                <img src={assets.appointment_icon} alt=""/>
                <p className='hidden md:block'>Appointments</p>
            </NavLink>
            <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive  ? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/add-doctor'}>
                <img src={assets.add_icon} alt=""/>
                <p className='hidden md:block'>Add Doctor</p>
            </NavLink>
            <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive  ? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/doctor-list'}>
                <img src={assets.people_icon} alt=""/>
                <p className='hidden md:block'>Doctors List</p>
            </NavLink>
         </ul>
       
       
        
       
    </div>
  )
}

if(dToken && !aToken){
    return(
      <div className='min-h-screen bg-white border-r'>
        <ul className='text-[#515151] mt-5'>
            <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive  ? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/doctor-dashboard'}>
                <img src={assets.home_icon} alt=""/>
                <p className='hidden md:block'>Dashboard</p>
            </NavLink>
            <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive  ? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/doctor-appointments'}>
                <img src={assets.appointment_icon} alt=""/>
                <p className='hidden md:block'>Appointments</p>
            </NavLink>
            <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive  ? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/doctor-profile'}>
                <img src={assets.people_icon} alt=""/>
                <p className='hidden md:block'>Profile</p>
            </NavLink>
         </ul>
        </div>
   


    )
}
   return null;
};

export default Sidebar
