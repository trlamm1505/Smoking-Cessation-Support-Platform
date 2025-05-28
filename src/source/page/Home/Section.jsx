import React from 'react'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'

// Component đếm số có hiệu ứng khi vào viewport
const AnimatedCounter = ({ end, suffix = '%', decimals = 1 }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })
  return (
    <div ref={ref}>
      {inView ? (
        <CountUp end={end} duration={3} decimals={decimals} suffix={suffix} />
      ) : (
        `0${suffix}`
      )}
    </div>
  )
}

const Section = () => {
  const { ref: refTop, inView: inViewTop } = useInView({ threshold: 0.2, triggerOnce: true })
  const { ref: refCards, inView: inViewCards } = useInView({ threshold: 0.2, triggerOnce: true })
  const { ref: refFeatures, inView: inViewFeatures } = useInView({ threshold: 0.2, triggerOnce: true })

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
      {/* Section Intro + Stats */}
      <section className=" mt-10 px-6 md:px-16 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        <div
          ref={refTop}
          className={`flex flex-col justify-center transition-all duration-700 ease-in-out ${
            inViewTop ? 'animate__animated animate__fadeInLeft' : 'opacity-0'
          }`}
        >
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

        <div
          ref={refTop}
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-700 ease-in-out ${
            inViewTop ? 'animate__animated animate__fadeInRight' : 'opacity-0'
          }`}
        >
          {/* Count Boxes */}
          {[{
            src: "/Images/nam.jpg", alt: "Male smokers", value: 38.9, label: "Male smokers"
          }, {
            src: "/Images/nu.jpg", alt: "Female smokers", value: 1.1, label: "Female smokers"
          }, {
            src: "/Images/bothuoc.jpg", alt: "Quit successfully", value: 19.4, label: "Quit successfully"
          }, {
            src: "/Images/cainghien.jpg", alt: "Want to quit", value: 56.6, label: "Want to quit"
          }].map((box, idx) => (
            <div key={idx} className="flex items-center gap-6 p-6 border border-gray-200 rounded-xl shadow-sm">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <img src={box.src} alt={box.alt} className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold">
                  <AnimatedCounter end={box.value} />
                </p>
                <p className="text-gray-600">{box.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lower Section: Image + Text */}
        <div className="flex flex-col items-center lg:flex-row lg:items-stretch lg:col-span-2 gap-8 mt-12">
          <div
            ref={refCards}
            className={`relative w-full max-w-3xl h-[400px] transition-all duration-700 ${
              inViewCards ? 'animate__animated animate__fadeInLeft' : 'opacity-0'
            }`}
          >
            <img
              src="/Images/khoemanh.jpg"
              alt="Healthy life"
              className="rounded-xl object-cover w-full h-full"
            />
          </div>

         <div id="about"
  className={`flex flex-col justify-center max-w-xl transition-all duration-700 ${
    inViewCards ? 'animate__animated animate__fadeInRight' : 'opacity-0'
  }`}
>
  <p className="text-cyan-600 font-semibold text-base md:text-lg lg:text-xl">
    About Us
  </p>
  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 leading-tight">
    Empowering You to Break Free from Smoking and Reclaim Your Health
  </h3>
  <p className="mt-4 text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed">
    At our core, we are passionate about transforming lives by supporting smokers on their journey to quit. 
    We combine cutting-edge research, expert advice, and a vibrant community to provide personalized plans tailored 
    to your unique needs. Every small step counts — from reducing cravings to celebrating smoke-free milestones. 
    Join us to embrace a healthier lifestyle, breathe easier, and build a future where smoking no longer holds power over you.
  </p>
</div>

        </div>
      </section>

      {/* Feature Cards */}
      <section id="services"
        ref={refFeatures}
        className={`bg-white py-35 relative overflow-hidden transition-all duration-700 ${
          inViewFeatures ? 'animate__animated animate__fadeInUp' : 'opacity-0'
        }`}
      >
        <div className="absolute top-[70px] right-[30px] z-10 hidden md:block">
          <img
            src="/Images/Saynosmoking.png"
            alt="Say No to Smoking"
            className="w-[200px] md:w-[320px] object-contain float-x-animation"
          />
        </div>

        <div className="text-center mb-12 px-4 relative z-20">
          <p className="text-green-600 text-lg font-semibold mb-2">Quit Smoking Support</p>
          <h2 className="text-3xl md:text-4xl font-bold leading-snug">
            A Strong Foundation for Quitting Smoking <br /> and Reclaiming Health
          </h2>
        </div>

        <div className="w-full px-4 mx-auto relative z-20">
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
