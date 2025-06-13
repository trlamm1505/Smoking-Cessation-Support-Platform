import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
// import styled from 'styled-components'; // Remove styled-components

/*
// Remove styled component definition
const SearchBarContainer = styled(Input)`
  max-width: 500px;
  width: 100%;
  margin: 0 24px;
  border-radius: 25px;
  height: 40px;
  font-size: 1rem;
  flex-grow: 1;
  
  .ant-input-prefix {
    color: #999;
  }

  .ant-input {
    height: 40px;
    line-height: 40px;
  }
  .ant-input-affix-wrapper {
      height: 40px;
      border-radius: 25px;
  }
`;
*/

// const CoachSearchBar = () => {
//   return (
//     // Use Tailwind classes for container and Ant Design className for specific styles
//     <div className="flex-grow max-w-[700px] mx-6">
//       <Input
//         placeholder="Tìm kiếm khách hàng..."
//         prefix={<SearchOutlined className="text-gray-400 text-[1.2rem]" />} // Adjust icon size
//         className="rounded-lg h-[45px] text-[1.1rem]"
//         style={{ width: '100%' }} 
//       />
//     </div>
//   );
// };

// export default CoachSearchBar; 