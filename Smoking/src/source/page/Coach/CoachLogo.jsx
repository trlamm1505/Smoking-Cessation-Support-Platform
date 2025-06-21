import React from 'react';
import { Link } from 'react-router';


const CoachLogo = () => {
  return (
    // Use Tailwind classes
    <Link to="/coach/home" className="flex items-center space-x-2 flex-shrink-0 no-underline">
      <img src="/Images/logo.jpg" alt="SmokeFree Logo" className="w-8 h-8 rounded-full"/>
      <span className="text-xl font-semibold text-[#5FB8B3]">SmokeFree</span>
    </Link>
  );
};

export default CoachLogo; 