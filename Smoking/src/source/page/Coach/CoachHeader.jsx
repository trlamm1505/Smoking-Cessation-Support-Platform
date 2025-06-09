import React, { useState } from 'react';
// import styled from 'styled-components'; // Remove styled-components
import CoachLogo from './CoachLogo';
import CoachSearchBar from './CoachSearchBar';
import CoachNavIcons from './CoachNavIcons';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import Notification from './Notification'; // Import Notification component

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

const CoachHeader = ({ className }) => {
  const [notiOpen, setNotiOpen] = useState(false);

  return (
    // Use Tailwind classes
    <header className={`bg-white p-4 flex items-center justify-between shadow-md ${className}`}>
      
      <CoachSearchBar />
      <div className="flex items-center gap-6">
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={() => setNotiOpen((open) => !open)}
          aria-label="Thông báo"
        >
          <Badge count={2} style={{ backgroundColor: '#5FB8B3' }}>
            <BellOutlined style={{ color: notiOpen ? '#5FB8B3' : '#666' }} className="text-2xl" />
          </Badge>
        </button>
        <CoachNavIcons />
      </div>
      <Notification visible={notiOpen} onClose={() => setNotiOpen(false)} />
    </header>
  );
};

export default CoachHeader; 