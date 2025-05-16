import React from 'react';

const Navbar = () => {
  return (
    <header>
  
    <nav className="bg-white border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3 ">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/public/Images/logo.jpg" className="w-24 mt-4" />
        </a>

   {/* <!-- Responsive toggle button --> */}
<button id="menu-toggle" 
className="md:hidden items-center p-2 w-16 h-16 justify-center text-sm text-gray-500 rounded-lg hover:bg-white md:block">
{/* <!-- Icon 3 gạch --> */}
<svg className="w-10 h-10" fill="none" stroke="currentColor" stroke-width="2" 
  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path stroke-linecap="round" stroke-linejoin="round" 
    d="M4 6h16M4 12h16M4 18h16"></path>
</svg>
</button>


{/* <!-- Overlay Menu --> */}
<div id="overlay-menu" className="fixed inset-y-0 left-0 w-1/3 bg-white z-50 hidden flex flex-col items-start justify-start space-y-6 p-10 transition-transform duration-300 ease-in-out transform">
<button id="close-overlay" className="absolute top-5 right-5 text-4xl font-bold text-black border-none shadow-none">×</button>

{/* <!-- Demo Dropdown --> */}
<div className="relative group">
  <a href="#" id="demo-link" className="font-bold flex justify-between items-center w-full py-2 px-3 text-gray-900 cursor-pointer">
    Demo
    <svg className="ml-2 w-3 h-3 transition-transform duration-300 group-hover:-rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </a>
  {/* <!-- Dropdown Menu --> */}
  <div className="absolute left-full ml-2 z-20 w-44 rounded-lg bg-white shadow-md opacity-0 invisible translate-y-3 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out">
    <ul className="py-2 text-sm text-gray-700">
      <li><a href="#" className="font-bold block px-4 py-2 hover:text-red-500">Home 01</a></li>
      <li><a href="#" className="font-bold block px-4 py-2 hover:text-red-500">Home 02</a></li>
      <li><a href="#" className="font-bold block px-4 py-2 hover:text-red-500">Home 03</a></li>
      <li><a href="#" className="font-bold block px-4 py-2 hover:text-red-500">Home 04</a></li>
    </ul>
  </div>
</div>

{/* <!-- About --> */}
<a href="#" className="mt-[-20px] font-bold w-full py-2 px-3 text-gray-900 cursor-pointer">About</a>

{/* <!-- Services Dropdown --> */}
<div className="relative group">
  <a href="#" className="mt-[-14px] font-bold flex justify-between items-center w-full py-2 px-3 text-gray-900 cursor-pointer">
    Services
    <svg className="ml-2 w-3 h-3 transition-transform duration-300 group-hover:-rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </a>
  {/* <!-- Dropdown Menu --> */}
  <div className="absolute left-full ml-2 z-20 w-44 rounded-lg bg-white shadow-md opacity-0 invisible translate-y-0 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out">
    <ul className="py-2 text-sm text-gray-700">
      <li><a href="#" className="font-bold block px-4 py-2 hover:text-red-500">Services</a></li>
      <li><a href="#" className="font-bold block px-4 py-2 hover:text-red-500">Service Details</a></li>
    </ul>
  </div>
</div>

{/* <!-- Pages Dropdown --> */}
<div className="relative group">
  <a href="#" className="mt-[-14px] font-bold w-full py-2 px-3 text-gray-900 cursor-pointer flex justify-between items-center">
    Pages
    {/* <!-- Dấu mũi tên nằm bên phải --> */}
    <svg className="ml-2 w-3 h-3 transition-transform duration-300 group-hover:-rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </a>

  {/* <!-- Submenu --> */}
  <div className="absolute left-full top-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-md w-44 opacity-0 invisible translate-y-3 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out">
    <div className="py-2 text-sm text-gray-700">
      {/* <!-- Blogs --> */}
      <div className="relative group">
        <div className="font-bold flex justify-between items-center px-4 py-2 hover:text-red-500 cursor-pointer">
          Blogs
          <svg className="w-3 h-3 ml-2 transition-transform duration-300 group-hover:rotate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* <!-- Teams --> */}
      <div className="relative group">
        <div className="font-bold flex justify-between items-center px-4 py-2 hover:text-red-500 cursor-pointer">
          Teams
          <svg className="w-3 h-3 ml-2 transition-transform duration-300 group-hover:rotate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* <!-- FAQ --> */}
      <div className="relative group">
        <div className="font-bold flex justify-between items-center px-4 py-2 hover:text-red-500 cursor-pointer">
          FAQ
          <svg className="w-3 h-3 ml-2 transition-transform duration-300 group-hover:rotate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
       

      {/* <!-- Portfolio --> */}
      <div className="relative group">
        <div className="font-bold flex justify-between items-center px-4 py-2 hover:text-red-500 cursor-pointer">
          Portfolio
          <svg className="w-3 h-3 ml-2 transition-transform duration-300 group-hover:rotate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>

      </div>
        
      {/* <!-- Pricing --> */}
      <div className="font-bold flex justify-between items-center px-4 py-2 hover:text-red-500 cursor-pointer">
        Pricing
      </div>
       

       {/* <!-- Utilities --> */}
       <div className="relative group">
        <div className="font-bold flex justify-between items-center px-4 py-2 hover:text-red-500 cursor-pointer">
          Utilities
          <svg className="w-3 h-3 ml-2 transition-transform duration-300 group-hover:rotate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

    </div>
  </div>
</div>
           
       {/* <!-- Contact --> */}
<a href="#" className="mt-[-14px] font-bold w-full py-2 px-3 text-gray-900 cursor-pointer">Contact</a>
</div>







        
        {/* <!-- Nav items --> */}
        <div className="hidden w-full md:block md:w-auto" id="navbar-multi-level">
          <ul
            className="flex flex-col md:flex-row md:space-x-8 font-medium p-4 md:p-0 mt-4 border rounded-lg md:border-0 bg-white">

            {/* <!-- Demo Dropdown --> */}
            <li className="relative group">
              <div className="font-bold flex items-center w-full py-2 px-3 text-gray-900 md:p-0 cursor-pointer">
                Demo
                <svg className="ml-2 w-3 h-3 transition-transform duration-300 group-hover:-rotate-90" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            
              {/* <!-- Dropdown Menu --> */}
              <div
                className="absolute left-0 z-10 w-44 rounded-lg bg-white shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out">
                <ul className="py-2 text-sm text-gray-700">
                  <li><a href="#" className="font-bold block px-4 py-2 hover:text-red-500">Home 01</a></li>
                  <li><a href="#" className="font-bold block px-4 py-2 hover:text-red-500">Home 02</a></li>
                  <li><a href="#" className="font-bold block px-4 py-2 hover:text-red-500">Home 03</a></li>
                  <li><a href="#" className="font-bold block px-4 py-2 hover:text-red-500">Home 04</a></li>
                </ul>
              </div>
            </li>
            

            <li><a href="#" className="font-bold block py-2 px-3 text-gray-700 md:p-0 dark:text-black">About</a></li>

            {/* <!-- Services Dropdown --> */}
            <li className="relative group">
              <div className="font-bold flex items-center w-full py-2 px-3 text-gray-900 md:p-0 cursor-pointer">
                Services
                <svg className="ml-2 w-3 h-3 transition-transform duration-300 group-hover:-rotate-90 " fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div
                className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-md w-44 opacity-0 invisible translate-y-3 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out">
                <ul className="py-2 text-sm text-gray-700">
                  <li><a href="#" className="font-bold block px-4 py-2 hover:text-red-500">Services</a></li>
                  <li><a href="#" className="font-bold block px-4 py-2 hover:text-red-500">Service Details</a></li>
                </ul>
              </div>
            </li>

            {/* <!-- Pages Dropdown --> */}
            <li className="relative group">
              <div className="font-bold flex items-center w-full py-2 px-3 text-gray-900 md:p-0 cursor-pointer">
                Pages
                <svg className="ml-2 w-3 h-3 transition-transform duration-300 group-hover:-rotate-90" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* <!-- Pages Submenu --> */}
              <div
                className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-md w-44 opacity-0 invisible translate-y-3 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out">
                <ul className="py-2 text-sm text-gray-700">

                  {/* <!-- Blogs --> */}
                  <li className="relative group">
                    <div
                      className="font-bold flex justify-between items-center px-4 py-2 hover:text-red-500 cursor-pointer">
                      Blogs
                      <svg className="w-3 h-3 ml-2 transition-transform duration-300 group-hover:rotate " fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </li>

                  {/* <!-- Teams --> */}
                  <li className="relative group">
                    <div
                      className="font-bold flex justify-between items-center px-4 py-2 hover:text-red-500 cursor-pointer">
                      Teams
                      <svg className="w-3 h-3 ml-2 transition-transform duration-300 group-hover:rotate" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </li>

                  {/* <!-- FAQ --> */}
                  <li className="relative group">
                    <div
                      className="font-bold flex justify-between items-center px-4 py-2 hover:text-red-500 cursor-pointer">
                      FAQ
                      <svg className="w-3 h-3 ml-2 transition-transform duration-300 group-hover:rotate" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </li>

                  {/* <!-- Portfolio --> */}
                  <li className="relative group">
                    <div
                      className="font-bold flex justify-between items-center px-4 py-2 hover:text-red-500 cursor-pointer">
                      Portfolio
                      <svg className="w-3 h-3 ml-2 transition-transform duration-300 group-hover:rotate" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </li>

                  {/* <!-- Pricing --> */}
                  <li><a href="#" className="font-bold block px-4 py-2 hover:text-red-500">Pricing</a></li>

                  {/* <!-- Utilities --> */}
                  <li className="relative group">
                    <div
                      className="font-bold flex justify-between items-center px-4 py-2 hover:text-red-500 cursor-pointer">
                      Utilities
                      <svg className="w-3 h-3 ml-2 transition-transform duration-300 group-hover:rotate" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </li>

                </ul>
              </div>
            </li>
            <li><a href="#" className="font-bold block py-2 px-3 text-gray-900 md:p-0 dark:text-black">Contact</a></li>
          </ul>
        </div>

        {/* <!-- Buttons --> */}
        <div id="navbar-multi-level" className="hidden md:flex space-x-5 mt-5 md:mt-0">
          <button type="button"
          className="hover:border-[#FE330A] opacity-0 animate__animated fadeIn  relative overflow-hidden font-bold mt-3 text-black bg-blue-700 hover:bg-white focus:ring-4 focus:outline-none focus:ring-blue-300 border-1 border-black rounded-full text-base px-6 py-3 dark:bg-white dark:focus:ring-blue-800 group">
          {/* <!-- Overlay for red color effect --> */}
          <span
            className=" opacity-0 animate__animated fadeIn  absolute top-0 left-0 w-full h-0 bg-[#FE330A] transition-all duration-500 ease-in-out group-hover:h-full z-0"></span>
          {/* <!-- Text content above the overlay --> */}
          <span className="relative z-10 group-hover:text-white ">Login</span>
        </button>
        
          <button type="button"
          className="relative overflow-hidden font-bold mt-3 text-white bg-blue-700 hover:bg-whitefocus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-base px-7 py-3 dark:bg-black  dark:focus:ring-blue-800 group">
          {/* <!-- Overlay for red color effect --> */}
          <span
            className=" absolute top-0 left-0 w-full h-0 bg-[#FE330A] transition-all duration-500 ease-in-out group-hover:h-full z-0"></span>
          {/* <!-- Text content above the overlay --> */}
          <span className="relative z-10">Sign up free</span>
        </button>
        </div>
        
        
        
      </div>
    </nav>
  </header>
  );
};

export default Navbar;