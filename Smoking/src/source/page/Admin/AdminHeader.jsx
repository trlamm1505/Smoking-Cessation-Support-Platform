import React from 'react';

const AdminHeader = ({ className }) => {
  return (
    <header className={`bg-white p-4 flex items-center justify-end shadow-sm ${className}`}>
      {/* Add other header elements like notification or user icons here if needed */}
    </header>
  );
};

export default AdminHeader; 