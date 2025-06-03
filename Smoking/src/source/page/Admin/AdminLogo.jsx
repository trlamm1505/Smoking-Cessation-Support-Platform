import React from 'react';
import { Link } from 'react-router';
import { UserOutlined } from '@ant-design/icons'; // Example icon for Admin

const AdminLogo = () => {
  return (
    // Use Tailwind classes
    <Link to="/admin/dashboard" className="flex items-center space-x-2 flex-shrink-0 no-underline">
      {/* Replace with actual admin logo image if available */}
      <UserOutlined className="text-xl text-[#5FB8B3]" /> {/* Example Admin Icon */}
      <span className="text-xl font-semibold text-[#5FB8B3]">Admin Portal</span>
    </Link>
  );
};

export default AdminLogo; 