import React from "react";
import { useInView } from "react-intersection-observer";

const teamMembers = [
  {
    id: 1,
    name: "James Wilson",
    position: "Chuyên gia tư vấn Cai thuốc lá",
    img: "/Images/chuyengia1.png",
  },
  {
    id: 2,
    name: "Emily Clark",
    position: "Nhà nghiên cứu Nghiện thuốc lá",
    img: "/Images/chuyengia2.jpg",
  },
  {
    id: 3,
    name: "Laura Bennett",
    position: "Chuyên gia Y tế Công cộng",
    img: "/Images/chuyengia3.png",
  },
];

const TeamSection = () => {
  const { ref: refTitle, inView: inViewTitle } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const { ref: refCards, inView: inViewCards } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section className="py-16 px-8 bg-white">
      {/* Tiêu đề */}
      <div
        ref={refTitle}
        className={`max-w-7xl mx-auto text-center mb-16 transition-all duration-700 ${inViewTitle ? "animate__animated animate__fadeIn" : "opacity-0"
          }`}
      >
        <p className="text-teal-500 font-semibold text-base uppercase tracking-widest">
          Gặp gỡ Chuyên gia của chúng tôi
        </p>
        <h2 className="text-4xl font-extrabold text-black mt-4 leading-snug">
          Đội ngũ Chuyên nghiệp Tận tâm <br /> Hỗ trợ Cai thuốc lá
        </h2>
      </div>

      {/* Danh sách chuyên gia */}
      <div
        ref={refCards}
        className={`grid grid-cols-1 md:grid-cols-3 gap-16 max-w-7xl mx-auto transition-all duration-700 ${inViewCards ? "animate__animated animate__fadeInUp" : "opacity-0"
          }`}
      >
        {teamMembers.map(({ id, img, name, position }) => (
          <div
            key={id}
            className="group bg-white rounded-tl-[1.5rem] rounded-br-[1.5rem] shadow-xl p-8 flex flex-col items-center min-h-[420px]
              border-2 border-transparent hover:border-green-500
              hover:rounded-tl-[1.5rem] hover:rounded-br-[1.5rem]
              transition-all duration-300"
          >
            <div
              className="w-64 h-64 overflow-hidden rounded-tl-[1.5rem] rounded-br-[1.5rem] transition-all duration-300"
            >
              <img src={img} alt={name} className="w-full h-full object-cover" />
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-2xl font-semibold text-black">{name}</h3>
              <p className="text-gray-600 mt-2 text-lg">{position}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
