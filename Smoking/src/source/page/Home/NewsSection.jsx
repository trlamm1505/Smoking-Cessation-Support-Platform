import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

const NewsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const containerRef = useRef(null);
  const { ref: sectionRef, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const newsItems = [
    {
      id: 1,
      category: "Bộ Y tế Việt Nam",
      title: "Hút thuốc lá thụ động gây 18.800 ca tử vong mỗi năm",
      date: "Ngày 26 tháng 10 năm 2024",
      author: "Theo Bộ Y tế Việt Nam",
      excerpt: "Dù đã có những tiến bộ tích cực trong việc giảm phơi nhiễm, hút thuốc lá thụ động vẫn là một mối đe dọa chết người. Cần tiếp tục hành động để đảm bảo môi trường không khói thuốc trên toàn quốc.",
      image: "/Images/News1.jpg",
      link: "https://short.com.vn/T3Zu"
    },
    {
      id: 2,
      category: "Sức khỏe Cộng đồng",
      title: "Tác hại của việc hút thuốc lá",
      date: "Ngày 17 tháng 5 năm 2024",
      author: "Theo CDC",
      excerpt: "Hút thuốc lá gây ra hơn 480.000 ca tử vong hàng năm tại Hoa Kỳ và gây hại cho hầu hết các cơ quan. Bỏ thuốc mang lại lợi ích sức khỏe ngay lập tức.",
      image: "/Images/news2.jpg",
      link: "https://www.cdc.gov/tobacco/about/index.html"
    },
    {
      id: 3,
      category: "Sức khỏe Cộng đồng",
      title: "Tác hại của khói thuốc lá thụ động",
      date: "Ngày 10 tháng 1 năm 2025",
      author: "Nhà thuốc Long Châu",
      excerpt: "Khói thuốc lá thụ động có tác động nghiêm trọng đến sức khỏe, đặc biệt đối với trẻ em và những người không hút thuốc.",
      image: "/Images/News3.jpg",
      link: "https://nhathuoclongchau.com.vn/bai-viet/song-chung-voi-nguoi-hut-thuoc-la-tac-hai-cua-hut-thuoc-la-thu-dong-doi-suc-khoe.html"
    },
    {
      id: 4,
      category: "Sức khỏe Cộng đồng",
      title: "Lợi ích sức khỏe của việc bỏ thuốc lá",
      date: "Ngày 18 tháng 5 năm 2025",
      author: "Tổ chức Y tế Thế giới",
      excerpt: "Bỏ thuốc lá ở mọi lứa tuổi đều có thể cải thiện đáng kể sức khỏe và tăng tuổi thọ.",
      image: "/Images/News4.jpg",
      link: "https://www.who.int/news-room/questions-and-answers/item/tobacco-health-benefits-of-smoking-cessation"
    },
    {
      id: 5,
      category: "Tâm lý Trẻ em",
      title: "Hiểu hành vi của trẻ",
      date: "Ngày 3 tháng 10 năm 2023",
      author: "Theo admin",
      excerpt: "Tìm hiểu cách diễn giải hành động và phản ứng của con bạn",
      image: "https://images.unsplash.com/photo-1541692641319-98172f5a1cae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 6,
      category: "Giáo dục",
      title: "Công cụ học tập kỹ thuật số",
      date: "Ngày 28 tháng 9 năm 2023",
      author: "Theo admin",
      excerpt: "Các công cụ kỹ thuật số tốt nhất để nâng cao khả năng học tập của con bạn",
      image: "https://images.unsplash.com/photo-1588072432904-843af37f03ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  useEffect(() => {
    const updateSlideWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setSlideWidth(containerWidth / 2);
      }
    };

    updateSlideWidth();
    window.addEventListener('resize', updateSlideWidth);
    return () => window.removeEventListener('resize', updateSlideWidth);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex(prev => (prev === Math.ceil(newsItems.length / 2) - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [newsItems.length]);

  const goToSlide = (index) => {
    clearInterval(intervalRef.current);
    setActiveIndex(index);
    intervalRef.current = setInterval(() => {
      setActiveIndex(prev => (prev === Math.ceil(newsItems.length / 2) - 1 ? 0 : prev + 1));
    }, 5000);
  };

  return (
    <section
      ref={sectionRef}
      className={`py-16 px-4 sm:px-6 lg:px-8 relative transition-all duration-700 ${inView ? 'animate__animated animate__flipInX' : 'opacity-0'
        }`}
    >
      {/* Title */}
      <div className="text-center mb-16">
        <div className="inline-block rounded-full bg-blue-100 px-4 py-2">
          <span className="font-medium text-black">TIN TỨC & BLOGS</span>
        </div>
        <h2 className="text-4xl font-bold text-black mt-5">Tin tức & Blogs Mới nhất</h2>
        <p className="mt-5 font-light text-gray-600 max-w-2xl mx-auto">
          Cập nhật tin tức mới nhất, lời khuyên từ chuyên gia và những câu chuyện thực tế để hỗ trợ hành trình cai thuốc lá của bạn.
        </p>
      </div>

      {/* Carousel */}
      <div className="container mx-auto max-w-6xl overflow-hidden relative" ref={containerRef}>
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${activeIndex * slideWidth}px)`,
            width: `${newsItems.length * (slideWidth / 2)}px`,
          }}
        >
          {newsItems.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 px-4"
              style={{ width: `${slideWidth}px` }}
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group h-full">
                <div className="h-60 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{item.date}</span>
                    <span className="mx-2">•</span>
                    <span>{item.author}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-[#63c3c3] font-medium">{item.category}</span>
                    <h3 className="text-xl font-bold text-gray-800 mt-1 group-hover:text-[#63c3c3] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">{item.excerpt}</p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#63c3c3] hover:text-[#4da8a8] font-medium transition-colors"
                  >
                    Đọc thêm
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: Math.ceil(newsItems.length / 2) }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${activeIndex === index ? 'bg-[#63c3c3]' : 'bg-gray-300'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
