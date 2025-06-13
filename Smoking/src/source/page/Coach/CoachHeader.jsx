import React, { useState } from 'react';
import CoachNavIcons from './CoachNavIcons';
import { BellOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import Notification from './Notification';

const CoachHeader = ({ className }) => {
  const [notiOpen, setNotiOpen] = useState(false);

  return (
    <header className={`bg-white p-4 flex items-center justify-end shadow-md ${className}`}>
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