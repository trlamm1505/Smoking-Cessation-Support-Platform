import React, { useState } from "react";
import { useInView } from "react-intersection-observer";

const UpgradePackages = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);

  const packages = [
    {
      id: "basic",
      name: "BASIC PACKAGE",
      price: "100,000 VND",
      duration: "1 month",
      features: [
        "Track your quitting progress",
        "Basic quitting techniques guidance",
        "Access to shared experience articles",
        "Join supportive community",
        "Receive daily motivation notifications",
      ],
      highlight: "Detailed quitting progress tracking",
    },
    {
      id: "pro",
      name: "PROFESSIONAL PACKAGE",
      price: "550,000 VND",
      duration: "6 months",
      features: [
        "All benefits from Basic Package",
        "Direct consultation with healthcare experts",
        "Weekly quitting challenges program",
        "Priority support via chat and email",
        "Reward points and prizes system",
      ],
      highlight: "Expert consultation and priority support",
    },
    {
      id: "premium",
      name: "PREMIUM PACKAGE",
      price: "1000,000 VND",
      duration: "1 years",
      features: [
        "All benefits from Professional Package",
        "Personalized coaching program",
        "Access to advanced health courses",
        "Special effects for account and community",
        "24/7 priority support",
      ],
      highlight: "High-level personalized coaching and support",
    },
  ];

  return (
    <div id="package" className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-extrabold text-black text-center mb-6">
        Choose Your Smoking Cessation Package
      </h1>
      <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
        Subscribe to a membership package to unlock special features and
        access valuable resources to help you quit smoking effectively and
        sustainably.
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
                <span className="text-lg text-gray-500">for {pkg.duration}</span>
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
                  alert(`You selected the ${pkg.name}. Proceed to payment.`);
                }}
                className={`mt-6 self-start rounded-full bg-[#4da8a8] px-10 py-3 text-white font-semibold text-lg shadow-lg transition-all duration-500 ${
                  inView ? "animate-heartBeat" : ""
                } cursor-pointer`}
              >
                Pay Now ♥
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
