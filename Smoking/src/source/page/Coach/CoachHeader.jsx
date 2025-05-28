import React from 'react';
// import styled from 'styled-components'; // Remove styled-components
import CoachLogo from './CoachLogo';
import CoachSearchBar from './CoachSearchBar';
import CoachNavIcons from './CoachNavIcons';

/*
// Remove styled component definition
const HeaderContainer = styled.header`
  background: white;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;
*/

const CoachHeader = () => {
  return (
    // Use Tailwind classes
    <header className="bg-white p-4 flex items-center justify-between shadow-md">
      
      <CoachSearchBar />
      <CoachNavIcons />
    </header>
  );
};

export default CoachHeader; 