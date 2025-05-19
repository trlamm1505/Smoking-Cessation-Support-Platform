import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQWithImage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How can I start quitting smoking?",
      answer:
        "Simply sign up to receive a personalized quit plan tailored to your smoking habits. You’ll get step-by-step guidance, daily tips, and professional support.",
    },
    {
      question: "Will I get expert help during the process?",
      answer:
        "Yes, our platform connects you with certified doctors and wellness coaches who provide real-time support throughout your quitting journey.",
    },
    {
      question: "How does the platform keep me motivated?",
      answer:
        "You’ll track your health progress and money saved, join a supportive community, and earn rewards as you reach milestones — all to keep you inspired every day.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="animate__animated animate__backInLeft  max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-12">
      {/* Left Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="bg-gray-100 w-[500px] h-[350px] md:w-[400px] md:h-[400px] overflow-hidden flex items-center justify-center rounded-lg shadow-lg">
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
        <p className="text-teal-500 font-semibold mb-2">Frequently Asked Questions</p>
        <h2 className="text-3xl font-extrabold mb-8 leading-snug">
          Your Journey to Quit Smoking <br /> Starts with the Right Support
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
                  className={`w-full flex justify-between items-center px-6 py-4 font-semibold text-left focus:outline-none transition-colors duration-300 ${
                    isActive
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
                  className={`transition-all duration-300 ease-in-out ${
                    isActive ? "block py-4 px-6 bg-gray-50" : "hidden"
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
