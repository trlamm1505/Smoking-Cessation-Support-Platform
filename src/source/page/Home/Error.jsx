import React from 'react';

const Error = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#4fd1c5]">
     <div className="bg-white rounded-lg p-10 md:p-20 w-full max-w-[1400px] min-h-[700px] flex flex-col md:flex-row items-center shadow-xl">
  
  {/* Text Section */}
  <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0 space-y-15">
  <h1 className="text-5xl md:text-6xl font-extrabold text-black">
    O O P S . . . D O N ' T  W O R R Y .
  </h1>
  <p className="text-gray-600 text-2xl">
    The page you're looking for isn't available. Please return to the Home page.
  </p>
  <a
  href="/"
  className="inline-block bg-[#f8f8f8] hover:bg-white text-black text-xl font-semibold px-10 py-4 rounded-lg shadow transition"
>
  ← Go back
</a>

</div>


  {/* Image Section */}
  <div className="md:w-1/2 flex justify-center">
  <img
    src="/Images/error.png"
    alt="Cute error chick"
    className="max-w-[700px] w-full"
  />
</div>

</div>

    </div>
  );
};

export default Error;
