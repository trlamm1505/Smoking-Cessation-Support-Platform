import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import axios from "axios";

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { ref: refTitle, inView: inViewTitle } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const { ref: refCards, inView: inViewCards } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/coaches/all');
        setTeamMembers(response.data);
      } catch (err) {
        console.error('Error fetching coaches:', err);
        setError('Không thể tải dữ liệu chuyên gia');
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

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
        {loading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu chuyên gia...</p>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-600">Chưa có dữ liệu chuyên gia</p>
          </div>
        ) : (
          teamMembers.map(({ coachId, fullName, specialization, profilePictureUrl, experience, rating, bio }) => (
            <div
              key={coachId}
              className="group bg-white rounded-tl-[1.5rem] rounded-br-[1.5rem] shadow-xl p-8 flex flex-col items-center min-h-[420px]
                border-2 border-transparent hover:border-green-500
                hover:rounded-tl-[1.5rem] hover:rounded-br-[1.5rem]
                transition-all duration-300"
            >
              <div
                className="w-64 h-64 overflow-hidden rounded-tl-[1.5rem] rounded-br-[1.5rem] transition-all duration-300"
              >
                <img
                  src={profilePictureUrl || "/Images/default-avatar.png"}
                  alt={fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/Images/default-avatar.png";
                  }}
                />
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-semibold text-black">{fullName}</h3>
                <p className="text-gray-600 mt-2 text-lg">{specialization}</p>
                {experience && (
                  <p className="text-gray-500 mt-1 text-sm">{experience} năm kinh nghiệm</p>
                )}
                {rating && (
                  <div className="flex justify-center items-center mt-2">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="text-gray-600 ml-1">{rating}/5</span>
                  </div>
                )}
                {bio && (
                  <p className="text-gray-600 mt-3 text-sm line-clamp-3">{bio}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default TeamSection;
