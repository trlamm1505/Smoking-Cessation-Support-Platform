import React from 'react'
import { useInView } from 'react-intersection-observer'
const Hero = () => {
  const { ref, inView } = useInView({
    threshold: 0.2, // phần tử hiện 20% là bắt đầu
    triggerOnce: true, // chỉ thực hiện 1 lần
  })
  return (
    <section
      ref={ref}
      className={`mt-35 relative overflow-hidden bg-[#B7DDDF] pt-6 pb-12 px-6 md:px-20 transition-all duration-700 ease-in-out ${inView ? 'zoom-in' : 'opacity-0 scale-90'
        }`}
    >
      {/* Vòng tròn trang trí bên trái */}
      <img
        src="/Images/left-circle-1.png"
        alt=""
        className="absolute w-[70px] h-[100px] left-0 -translate-x-1 top-[10%] z-0 float-x-animation"
      />
      <img
        src="/Images/left-circle-2.png"
        alt=""
        className="absolute w-[60px] h-[60px] left-4 top-[23%] z-0 float-x-animation"
      />

      {/* Layout hình trái - nội dung giữa - hình phải */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-6 md:gap-12 text-center md:text-left -mt-[350px]">

        {/* Hình bên trái */}
        <div className="w-full max-w-[220px] sm:max-w-[240px] md:max-w-[240px] aspect-[5/7] relative float-animation mt-[10px] md:mt-[190px]">
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
        <div className="w-full max-w-[220px] sm:max-w-[240px] md:max-w-[240px] aspect-[5/7] relative float-animation mt-[500px] md:mt-[700px]">
          <img
            src="/Images/doctor.jpg"
            alt="Doctor"
            className="rounded-[50%] object-cover w-full h-full relative z-10"
          />
          <div className="absolute inset-0 rounded-[50%] border-2 border-[#B1C5C6] z-20 transform -translate-x-4 translate-y-4"></div>

        </div>

        <img
          src="/Images/right-circle.png"
          alt=""
          className="absolute w-[60px] h-[250px] right-1 translate-x-1 top-[35%] z-0 float-animation"
        />
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