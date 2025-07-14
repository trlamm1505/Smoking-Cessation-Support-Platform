import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

const FAQWithImage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const faqs = [
    {
      question: "Làm thế nào để bắt đầu cai thuốc lá?",
      answer:
        "Chỉ cần đăng ký để nhận một kế hoạch cai thuốc được cá nhân hóa phù hợp với thói quen hút thuốc của bạn. Bạn sẽ nhận được hướng dẫn từng bước, mẹo hàng ngày và hỗ trợ chuyên nghiệp.",
    },
    {
      question: "Tôi có nhận được sự giúp đỡ của chuyên gia trong quá trình này không?",
      answer:
        "Có, nền tảng của chúng tôi kết nối bạn với các bác sĩ và huấn luyện viên sức khỏe được chứng nhận, những người cung cấp hỗ trợ theo thời gian thực trong suốt hành trình cai thuốc của bạn.",
    },
    {
      question: "Nền tảng làm thế nào để giữ động lực cho tôi?",
      answer:
        "Bạn sẽ theo dõi tiến trình sức khỏe và số tiền tiết kiệm được, tham gia một cộng đồng hỗ trợ và nhận phần thưởng khi đạt được các cột mốc — tất cả để giữ cho bạn có cảm hứng mỗi ngày.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section
      ref={ref}
      className={`max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-12 transition-all duration-700 ${inView ? "animate__animated animate__backInLeft" : "opacity-0"
        }`}
    >
      {/* Left Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="bg-gray-100 max-w-[800px] h-[500px] md:h-[400px] overflow-hidden flex items-center justify-center rounded-lg shadow-lg">
          <img
            src="/Images/Why1.jpg"
            alt="Smoking Cessation Support"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23e2e8f0' width='200' height='200'/%3E%3Ctext fill='%236b7280' font-family='sans-serif' font-size='16' x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'%3EImage not found%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>
      </div>

      {/* Right FAQ Section */}
      <div className="w-full md:w-1/2">
        <p className="text-teal-500 font-semibold mb-2">
          Các câu hỏi thường gặp
        </p>
        <h2 className="text-3xl font-extrabold mb-8 leading-snug">
          Hành trình cai thuốc của bạn <br /> Bắt đầu với sự hỗ trợ đúng đắn
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full flex justify-between items-center px-6 py-4 font-semibold text-left focus:outline-none transition-colors duration-300 ${isActive
                    ? "bg-teal-500 text-white"
                    : "bg-white text-gray-900 hover:bg-gray-100"
                    }`}
                  aria-expanded={isActive}
                  aria-controls={`faq-content-${index}`}
                >
                  <span>{faq.question}</span>
                  {isActive ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                <div
                  id={`faq-content-${index}`}
                  className={`transition-all duration-300 ease-in-out ${isActive ? "block py-4 px-6 bg-gray-50" : "hidden"
                    }`}
                >
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQWithImage;
