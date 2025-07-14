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
      title: "Kế hoạch Cai thuốc",
      description: "Tạo lộ trình cá nhân hóa và rõ ràng để cai thuốc hiệu quả và bền vững.",
    },
    {
      title: "Tư vấn Chuyên gia",
      description: "Nhận hỗ trợ trực tiếp từ các chuyên gia sức khỏe và tinh thần trong suốt hành trình cai thuốc.",
    },
    {
      title: "Cộng đồng Hỗ trợ",
      description: "Tham gia cộng đồng người dùng để chia sẻ kinh nghiệm, tìm động lực và nhận lời khuyên hữu ích mỗi ngày.",
    },
    {
      title: "Hệ thống Phần thưởng",
      description: "Nhận phần thưởng động viên hoặc vật chất khi vượt qua cơn thèm thuốc và đạt được các cột mốc.",
    },
  ]

  return (
    <>
      {/* Section Intro + Stats */}
      <section className=" mt-10 px-6 md:px-16 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        <div
          ref={refTop}
          className={`flex flex-col justify-center transition-all duration-700 ease-in-out ${inViewTop ? 'animate__animated animate__fadeInLeft' : 'opacity-0'
            }`}
        >
          <p className="text-cyan-600 font-semibold text-base md:text-lg lg:text-xl">
            Tình trạng nghiện thuốc lá hiện tại
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 leading-tight">
            Hãy cùng nói về vấn đề mà hàng triệu người đang phải đối mặt – cai thuốc lá.
          </h2>
          <p className="mt-4 text-gray-600 text-sm md:text-base lg:text-lg leading-relaxed">
            Việt Nam có tỷ lệ hút thuốc cao nhất thế giới, với hơn một nửa số người hút thuốc có ý định bỏ thuốc.
            Tuy nhiên, việc cai thuốc vẫn là một thách thức lớn. Hút thuốc gây ra hơn 104.000 ca tử vong mỗi năm tại Việt Nam,
            bao gồm cả những người hút thuốc thụ động. Đây là một vấn đề sức khỏe cộng đồng nghiêm trọng cần được quan tâm khẩn cấp.
          </p>
        </div>

        <div
          ref={refTop}
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-700 ease-in-out ${inViewTop ? 'animate__animated animate__fadeInRight' : 'opacity-0'
            }`}
        >
          {/* Count Boxes */}
          {[{
            src: "/Images/nam.jpg", alt: "Nam giới hút thuốc", value: 38.9, label: "Nam giới hút thuốc"
          }, {
            src: "/Images/nu.jpg", alt: "Nữ giới hút thuốc", value: 1.1, label: "Nữ giới hút thuốc"
          }, {
            src: "/Images/bothuoc.jpg", alt: "Cai thuốc thành công", value: 19.4, label: "Cai thuốc thành công"
          }, {
            src: "/Images/cainghien.jpg", alt: "Muốn cai thuốc", value: 56.6, label: "Muốn cai thuốc"
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
            className={`relative w-full max-w-3xl h-[400px] transition-all duration-700 ${inViewCards ? 'animate__animated animate__fadeInLeft' : 'opacity-0'
              }`}
          >
            <img
              src="/Images/khoemanh.jpg"
              alt="Healthy life"
              className="rounded-xl object-cover w-full h-full"
            />
          </div>

          <div id="about"
            className={`flex flex-col justify-center max-w-xl transition-all duration-700 ${inViewCards ? 'animate__animated animate__fadeInRight' : 'opacity-0'
              }`}
          >
            <p className="text-cyan-600 font-semibold text-base md:text-lg lg:text-xl">
              Về Chúng tôi
            </p>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 leading-tight">
              Trao quyền cho bạn thoát khỏi thuốc lá và lấy lại sức khỏe
            </h3>
            <p className="mt-4 text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed">
              Cốt lõi của chúng tôi là đam mê thay đổi cuộc sống bằng cách hỗ trợ người hút thuốc trong hành trình cai thuốc.
              Chúng tôi kết hợp nghiên cứu tiên tiến, tư vấn chuyên gia và một cộng đồng sôi nổi để cung cấp các kế hoạch cá nhân hóa
              phù hợp với nhu cầu riêng của bạn. Mỗi bước nhỏ đều có ý nghĩa — từ việc giảm cơn thèm thuốc đến việc kỷ niệm các cột mốc không khói thuốc.
              Hãy tham gia cùng chúng tôi để hướng tới lối sống lành mạnh hơn, thở dễ dàng hơn và xây dựng tương lai nơi thuốc lá không còn kiểm soát bạn.
            </p>
          </div>

        </div>
      </section>

      {/* Feature Cards */}
      <section id="services"
        ref={refFeatures}
        className={`bg-white py-35 relative overflow-hidden transition-all duration-700 ${inViewFeatures ? 'animate__animated animate__fadeInUp' : 'opacity-0'
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
          <p className="text-green-600 text-lg font-semibold mb-2">Hỗ trợ Cai thuốc lá</p>
          <h2 className="text-3xl md:text-4xl font-bold leading-snug">
            Nền tảng vững chắc để Cai thuốc lá <br /> và Lấy lại Sức khỏe
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
                    <a href="/login-required" className="inline-block h-[30px] w-[30px] relative">
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
