import React from 'react';
import { Badge } from 'antd';
import { BellOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons';
import { Link } from 'react-router';

const CoachNavIcons = () => {
  return (
    <div className="flex items-center space-x-5 flex-shrink-0">
      <Link to="/coach/messages" className="text-gray-600 text-xl transition-colors hover:text-[#5FB8B3]">
        <Badge count={3} size="small" offset={[0, -2]}>
          <BellOutlined className="text-xl" />
        </Badge>
      </Link>
      <Link to="/coach/profile" className="text-gray-600 text-xl transition-colors hover:text-[#5FB8B3]">
        <UserOutlined className="text-xl" />
      </Link>
    </div>
  );
};

export default CoachNavIcons; 