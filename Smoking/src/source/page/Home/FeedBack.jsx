import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useInView } from 'react-intersection-observer';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    id: 1,
    stat: '66',
    rating: 5,
    quote: 'Nhờ chương trình này, tôi đã cai thuốc thành công sau 10 năm nghiện.',
    author: 'Triết Lê',
    role: 'Cai thuốc thành công',
    duration: '66 ngày không hút thuốc',
    avatar: '/Images/Fb1.jpg',
  },
  {
    id: 2,
    stat: '120+',
    rating: 4,
    quote: "Bác sĩ của tôi không thể tin được sự cải thiện dung tích phổi của tôi - các con số trông như thể tôi đã trẻ lại 5 tuổi!",
    author: 'Hoang Vu',
    role: 'Người đạt thành tích cao nhất',
    duration: '4 tháng không hút thuốc',
    avatar: '/Images/Fb2.jpg',
  },
  {
    id: 3,
    stat: '92%',
    rating: 5,
    quote: 'Tuần đầu tiên thật khó khăn - thèm thuốc, nghi ngờ, đủ thứ. Nhưng bây giờ? Tôi thức dậy tràn đầy năng lượng, đồ ăn ngon tuyệt, và tôi thậm chí còn ngửi thấy mùi mưa lần nữa. Tôi chỉ tự hỏi một điều: tại sao tôi không bỏ thuốc sớm hơn?',
    author: 'Lam Alex',
    role: 'Người từng hút 15 năm',
    duration: '6 tháng không hút thuốc',
    avatar: '/Images/Fb4.jpg',
  },
];

const SmokingCessationTestimonials = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section
      ref={ref}
      className={`py-16 bg-white transition-all duration-700 ${inView ? 'animate__animated animate__backInRight' : 'opacity-0'
        }`}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <span className="inline-block px-5 py-2 text-sm font-medium text-white bg-[#4da8a8] rounded-full mb-4 shadow-md transform hover:scale-105 transition-transform">
            CÂU CHUYỆN THÀNH CÔNG
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Hành trình Cai thuốc lá
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Những câu chuyện có thật từ những người đã cai thuốc lá thành công
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={30}
          loop={true}
          className="max-w-4xl mx-auto"
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl md:flex">
                {/* Avatar */}
                <div className="md:w-2/5 bg-gray-50 p-8 flex flex-col items-center justify-center relative">
                  <img
                    src={item.avatar}
                    alt={item.author}
                    className="w-48 h-48 rounded-full object-top border-8 border-white shadow-md"
                  />
                  <div className="flex space-x-1 text-xl mt-4">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={i < item.rating ? 'text-yellow-400' : 'text-gray-300'}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-4xl font-bold text-[#63c3c3]">{item.stat}</div>
                    <div className="text-sm text-gray-700">{item.duration}</div>
                  </div>
                </div>

                {/* Quote */}
                <div className="md:w-3/5 p-8 flex flex-col justify-between">
                  <blockquote className="text-gray-700 text-xl leading-relaxed mb-6">
                    “{item.quote}”
                  </blockquote>
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-lg font-bold text-gray-800">{item.author}</h4>
                    <p className="text-[#4da8a8] font-medium">{item.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default SmokingCessationTestimonials;
