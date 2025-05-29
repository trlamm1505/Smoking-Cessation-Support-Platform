import React, { useState } from "react";
import { useInView } from "react-intersection-observer";

const UpgradePackages = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);

  const packages = [
    {
      id: "basic",
      name: "GÓI CƠ BẢN",
      price: "100,000 VND",
      duration: "1 tháng",
      features: [
        "Theo dõi tiến trình cai thuốc",
        "Hướng dẫn các kỹ thuật cai thuốc cơ bản",
        "Truy cập các bài viết chia sẻ kinh nghiệm",
        "Tham gia cộng đồng hỗ trợ",
        "Nhận thông báo động lực hàng ngày",
      ],
      highlight: "Theo dõi chi tiết tiến trình cai thuốc",
    },
    {
      id: "pro",
      name: "GÓI CHUYÊN NGHIỆP",
      price: "550,000 VND",
      duration: "6 tháng",
      features: [
        "Tất cả các lợi ích từ Gói Cơ bản",
        "Tư vấn trực tiếp với chuyên gia y tế",
        "Chương trình thử thách cai thuốc hàng tuần",
        "Hỗ trợ ưu tiên qua chat và email",
        "Hệ thống điểm thưởng và giải thưởng",
      ],
      highlight: "Tư vấn chuyên gia và hỗ trợ ưu tiên",
    },
    {
      id: "premium",
      name: "GÓI CAO CẤP",
      price: "1000,000 VND",
      duration: "1 năm",
      features: [
        "Tất cả các lợi ích từ Gói Chuyên nghiệp",
        "Chương trình huấn luyện cá nhân hóa",
        "Truy cập các khóa học sức khỏe nâng cao",
        "Hiệu ứng đặc biệt cho tài khoản và cộng đồng",
        "Hỗ trợ ưu tiên 24/7",
      ],
      highlight: "Huấn luyện và hỗ trợ cá nhân hóa cấp cao",
    },
  ];

  return (
    <div id="package" className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-extrabold text-black text-center mb-6">
        Chọn Gói Cai thuốc lá của Bạn
      </h1>
      <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
        Đăng ký gói thành viên để mở khóa các tính năng đặc biệt và
        truy cập các tài nguyên quý giá giúp bạn cai thuốc lá hiệu quả và
        bền vững.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg) => {
          const isSelected = selectedPackage === pkg.id;

          // useInView hook để theo dõi phần tử có trong viewport chưa
          const { ref, inView } = useInView({
            triggerOnce: true,
            threshold: 0.3,
          });

          return (
            <div
              key={pkg.id}
              ref={ref}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`cursor-pointer rounded-xl border-2 border-[#4da8a8] bg-white p-6 flex flex-col shadow-sm transition-shadow duration-300
  ${isSelected ? "shadow-lg" : "hover:shadow-md"}`}
            >
              <h2 className="text-2xl font-extrabold text-black mb-3">
                {pkg.name}
              </h2>
              <div className="flex items-baseline gap-3 mb-4 text-[#4da8a8]">
                <span className="text-3xl font-bold">{pkg.price}</span>
                <span className="text-lg text-gray-500">trong {pkg.duration}</span>
              </div>

              <p className="mb-4 border-l-4 border-[#4da8a8] pl-3 font-semibold text-[#4da8a8]">
                {pkg.highlight}
              </p>

              <ul className="flex-grow space-y-3 text-gray-700 text-base relative pl-6 before:absolute before:left-0 before:top-1/2 before:h-2 before:w-2 before:-translate-y-1/2 before:rounded-full before:bg-[#4da8a8]">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="relative">
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Bạn đã chọn ${pkg.name}. Tiến hành thanh toán.`);
                }}
                className={`mt-6 self-start rounded-full bg-[#4da8a8] px-10 py-3 text-white font-semibold text-lg shadow-lg transition-all duration-500 ${inView ? "animate-heartBeat" : ""
                  } cursor-pointer`}
              >
                Thanh toán ngay ♥
              </button>
            </div>
          );
        })}
      </div>

      {/* Thêm CSS animation heartbeat bằng Tailwind dạng @keyframes */}
      <style>{`
        @keyframes heartBeat {
          0%, 100% {
            transform: scale(1);
          }
          14%, 42% {
            transform: scale(1.3);
          }
          28%, 70% {
            transform: scale(1);
          }
        }
        .animate-heartBeat {
          animation: heartBeat 8s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default UpgradePackages;
