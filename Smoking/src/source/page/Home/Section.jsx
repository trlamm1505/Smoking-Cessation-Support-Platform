import React from 'react'
import CountUp from 'react-countup'

const Section = () => {
  const cards = [
    {
      title: "Quit Smoking Plan",
      description: "Create a personalized and clear roadmap to quit smoking effectively and sustainably.",
    },
    {
      title: "Expert Consultation",
      description: "Get direct support from health and mental wellness experts throughout your quitting journey.",
    },
    {
      title: "Supportive Community",
      description: "Join a community of users to share experiences, gain motivation, and receive helpful advice every day.",
    },
    {
      title: "Reward System",
      description: "Earn motivational or tangible rewards as you overcome cravings and achieve milestones.",
    },
  ]

  return (
<> 
<section className="px-6 md:px-16 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
  {/* Left Section */}
  <div className="flex flex-col justify-center animate__animated animate__fadeInLeft">
  <p className="text-cyan-600 font-semibold text-base md:text-lg lg:text-xl">
    The current state of tobacco addiction
  </p>
  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 leading-tight">
    Let’s talk about something millions struggle with – quitting smoking.
  </h2>
  <p className="mt-4 text-gray-600 text-sm md:text-base lg:text-lg leading-relaxed">
    Vietnam has one of the highest smoking rates in the world, with over half of smokers intending to quit. 
    However, quitting remains a major challenge. Smoking causes over 104,000 deaths each year in Vietnam, 
    including those from secondhand smoke. This is a serious public health issue that needs urgent attention.
  </p>
</div>

{/* Right Stats */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate__animated  animate__fadeInRight">
  {/* Box 1 */}
  <div className="flex items-center gap-6 p-6 border border-gray-200 rounded-xl shadow-sm">
    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
      <img src="/Images/nam.jpg" alt="Male smokers" className="w-full h-full object-cover" />
    </div>
    <div className="text-left">
      <p className="text-2xl font-bold">
        <CountUp end={38.9} duration={4} decimals={1} suffix="%" />
      </p>
      <p className="text-gray-600">Male smokers</p>
    </div>
  </div>

  {/* Box 2 */}
  <div className="flex items-center gap-6 p-6 border border-gray-200 rounded-xl shadow-sm">
    <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center overflow-hidden">
      <img src="/Images/nu.jpg" alt="Female smokers" className="w-full h-full object-cover" />
    </div>
    <div className="text-left">
      <p className="text-2xl font-bold">
        <CountUp end={1.1} duration={4} decimals={1} suffix="%" />
      </p>
      <p className="text-gray-600">Female smokers</p>
    </div>
  </div>

  {/* Box 3 */}
  <div className="flex items-center gap-6 p-6 border border-gray-200 rounded-xl shadow-sm">
    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
      <img src="/Images/bothuoc.jpg" alt="Quit successfully" className="w-full h-full object-cover" />
    </div>
    <div className="text-left">
      <p className="text-2xl font-bold">
        <CountUp end={19.4} duration={4} decimals={1} suffix="%" />
      </p>
      <p className="text-gray-600">Quit successfully</p>
    </div>
  </div>

  {/* Box 4 */}
  <div className="flex items-center gap-6 p-6 border border-gray-200 rounded-xl shadow-sm">
    <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center overflow-hidden">
      <img src="/Images/cainghien.jpg" alt="Want to quit" className="w-full h-full object-cover" />
    </div>
    <div className="text-left">
      <p className="text-2xl font-bold">
        <CountUp end={56.6} duration={4} decimals={1} suffix="%" />
      </p>
      <p className="text-gray-600">Want to quit</p>
    </div>
  </div>
</div>




{/* Lower Section */}
<div className="flex flex-col items-center lg:flex-row lg:items-stretch lg:col-span-2 gap-8 mt-12">
  {/* Ảnh trái */}
  <div className="relative w-full max-w-3xl h-[400px] animate__animated animate__fadeInLeft">
    <img
      src="/Images/khoemanh.jpg"
      alt="Healthy life"
      className="rounded-xl object-cover w-full h-full"
    />
  </div>

  {/* Nội dung phải */}
  <div className="flex flex-col justify-center max-w-xl animate__animated animate__fadeInRight">
    <p className="text-cyan-600 font-semibold text-base md:text-lg lg:text-xl">
      The health benefits of quitting smoking
    </p>
    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 leading-tight">
      Quit smoking today – breathe better, live longer.
    </h3>
    <p className="mt-4 text-gray-600 text-sm md:text-base lg:text-lg leading-relaxed">
      Quitting smoking boosts lung and heart function, reduces the risk of cancer,
      and allows your body to start healing immediately. You'll enjoy healthier skin,
      fresher breath, better sleep, and more energy. Most importantly, you protect
      your loved ones from harmful secondhand smoke and save money in the long run.
    </p>
  </div>
</div>

</section>

































    <section className="bg-white py-35 relative overflow-hidden">
      {/* Hình ảnh nổi (ẩn khi màn hình nhỏ hơn md) */}
      <div className="absolute top-[70px] right-[30px] z-10 hidden md:block">
        <img
          src="/Images/Saynosmoking.png"
          alt="Say No to Smoking"
          className="w-[200px] md:w-[320px] object-contain float-x-animation"
        />
      </div>

      {/* Tiêu đề chính */}
      <div className="text-center mb-12 px-4 relative z-20 animate__animated animate__fadeIn">
        <p className="text-green-600 text-lg font-semibold mb-2">Quit Smoking Support</p>
        <h2 className="text-3xl md:text-4xl font-bold leading-snug">
          A Strong Foundation for Quitting Smoking <br /> and Reclaiming Health
        </h2>
      </div>

      {/* Grid Card */}
      <div className="animate__animated fadeInUp w-full px-4 mx-auto relative z-20  animate__animated animate__fadeInUp">
        <div className="p-4 flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[70px] gap-y-10">
            {cards.map((card, index) => (
              <div
                key={index}
                className="p-4 bg-white shadow-md rounded-md flex flex-col justify-between w-full max-w-[590px] min-h-[260px] transition duration-300 ease-in-out hover:bg-black hover:text-white group"
              >
                <div className="Feature relative">
                  <img
                    src={`/Images/service-icon-black-${index + 1}.svg`}
                    alt={`Icon ${index + 1}`}
                    className="w-14 h-14 mb-4 absolute top-0 left-0 transition duration-300 opacity-100 group-hover:opacity-0"
                  />
                  <img
                    src={`/Images/service-icon-orange-${index + 1}.svg`}
                    alt={`Icon hover ${index + 1}`}
                    className="w-14 h-14 mb-4 absolute top-0 left-0 transition duration-300 opacity-0 group-hover:opacity-100"
                  />
                  <div className="w-14 h-14 mb-4" />
                  <h3 className="text-2xl font-bold mb-2 hover:text-[#FE330A]">{card.title}</h3>
                  <p className="text-base leading-relaxed">{card.description}</p>
                </div>
                <div className="mt-6 relative">
                  <a href="/service-details" className="inline-block h-[30px] w-[30px] relative">
                    <img
                      src="/Images/arrow-right-black.svg"
                      alt="arrow-black"
                      className="absolute top-0 left-0 w-[30px] h-[30px] transition duration-300 opacity-100 group-hover:opacity-0"
                    />
                    <img
                      src="/Images/arrow-right-orange.svg"
                      alt="arrow-orange"
                      className="absolute top-0 left-0 w-[30px] h-[30px] transition duration-300 opacity-0 group-hover:opacity-100"
                    />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>








    
    </>
  )
}

export default Section
