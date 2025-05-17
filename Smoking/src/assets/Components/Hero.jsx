import React from 'react'

const Hero = () => {
  return (
    <section className="bg-[#FDEBE7] pt-6 pb-12 px-6 md:px-20">

      
      {/* Layout hình trái - nội dung giữa - hình phải */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-6 md:gap-12 text-center md:text-left -mt-[350px]">


        
        {/* Hình bên trái */}
        <div className="w-full max-w-[220px] sm:max-w-[240px] md:max-w-[260px] aspect-[5/7] relative float-animation mt-[10px] md:mt-[190px]">
  <img
    src="/Images/hauqua.jpg"
    alt="Lung effect"
    className="rounded-[50%] object-cover w-full h-full relative z-10"
  />
  <div className="absolute inset-0 rounded-[50%] border-2 border-[#081329] z-20 transform -translate-x-3 translate-y-3"></div>
</div>





        {/* Tiêu đề giữa */}
        <div className="text-center w-full max-w-2xl">
  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-gray-900 leading-tight font-bold">
    Platform For <br />
    <span className="text-black font-extrabold">
      Quitting Smoking <span className="text-pink-600">Support</span>
    </span>
  </h2>
</div>



      {/* Hình bên phải */}
      <div className="w-full max-w-[220px] sm:max-w-[240px] md:max-w-[260px] aspect-[5/7] relative float-animation mt-[500px] md:mt-[700px]">
  <img
    src="/Images/doctor.jpg"
    alt="Doctor"
    className="rounded-[50%] object-cover w-full h-full relative z-10"
  />
  <div className="absolute inset-0 rounded-[50%] border-2 border-[#B1C5C6] z-20 transform -translate-x-4 translate-y-4"></div>
</div>





      </div>

      {/* Ảnh chạy bộ phía dưới */}
      <div className="mt-[-300px] flex justify-center">
  <img
    src="/Images/runRun.png"
    alt="Running people"
    className="w-full max-w-[1200px] h-auto"
  />
</div>




    </section>
  )
}

export default Hero