import React from 'react';
import { Link } from 'react-router';
// import styled from 'styled-components'; // Remove styled-components

/*
// Remove styled component definition
const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
  
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
  
  span {
    font-size: 20px;
    font-weight: 600;
    color: #5FB8B3;
  }
`;
*/

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