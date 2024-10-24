import React from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Footer = () => {
  const navigate = useNavigate();
  const handlePrivacyPolicy = () => {
    toast.info("Privacy policy is yet to be added");
  };
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* -- leftsection---*/}
        <div>
          <img className="mb-4 w-40" src={assets.logo} alt="" />
          <p className="w-full  text-gray-600 ">
            Prescripto is a user-friendly platform designed to simplify the
            process of booking doctor appointments. It allows patients to search
            for doctors by specialty and availability, making it easy to find
            the right healthcare professional.
          </p>
        </div>
        {/*---centr section---*/}

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <NavLink onClick={() => scrollTo(0, 0)} to="/">
              Home
            </NavLink>
            <NavLink onClick={() => scrollTo(0, 0)} to="/about">
              About us
            </NavLink>
            <NavLink onClick={() => scrollTo(0, 0)} to="/contact">
              Contact us
            </NavLink>
            <NavLink onClick={handlePrivacyPolicy}>Privacy policy</NavLink>
          </ul>
        </div>
        {/* --right section---*/}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+91-8943512369</li>
            <li>
              <a
                href="mailto:prescriptonewinnov@gmail.com"
                className="hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                prescriptonewinnov@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <hr></hr>
        <p className="py-5 text-sm text-center">
          Copyright 2024@ Prescripto - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
