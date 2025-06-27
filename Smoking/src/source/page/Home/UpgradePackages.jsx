import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const UpgradePackages = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/packages")
      .then((res) => res.json())
      .then((data) => {
        // Map lại cho phù hợp UI cũ
        const mapped = data.map((pkg) => ({
          id: pkg.packageID,
          name: pkg.packageName,
          price: pkg.price.toLocaleString() + " VND",
          duration: pkg.durationDays === 30 ? "1 tháng" : pkg.durationDays === 180 ? "6 tháng" : pkg.durationDays === 365 ? "12 tháng" : pkg.durationDays + " ngày",
          features: pkg.description ? pkg.description.split(';').map(f => f.trim()).filter(Boolean) : [],
          highlight: pkg.description ? pkg.description.split(';')[0] : '',
        }));
        setPackages(mapped);
      });
  }, []);

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

          return (
            <div
              key={pkg.id}
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpgradePackages;
