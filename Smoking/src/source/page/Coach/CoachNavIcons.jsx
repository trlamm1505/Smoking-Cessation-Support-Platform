import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router';

const CoachNavIcons = () => {
  return (
    <div className="flex items-center space-x-5 flex-shrink-0">
      <Link to="/coach/profile" className="text-gray-600 text-xl transition-colors hover:text-[#5FB8B3]">
        <UserOutlined className="text-xl" />
      </Link>
    </div>
  );
};

export default CoachNavIcons; 