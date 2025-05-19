import React from "react";

const teamMembers = [
  {
    id: 1,
    name: "James Wilson",
    position: "Smoking Cessation Consultant",
    img: "/Images/chuyengia1.png",
  },
  {
    id: 2,
    name: "Emily Clark",
    position: "Smoking Addiction Researcher",
    img: "/Images/chuyengia2.jpg",
  },
  {
    id: 3,
    name: "Laura Bennett",
    position: "Public Health Specialist",
    img: "/Images/chuyengia3.png",
  },
];

const TeamSection = () => {
  return (
    <section className="py-16 px-8 bg-white">
      <div className="max-w-7xl mx-auto text-center mb-16 animate__animated animate__fadeIn ">
  <p className="text-teal-500 font-semibold text-base uppercase tracking-widest">
    Meet Our Experts
  </p>
  <h2 className="text-4xl font-extrabold text-black mt-4 leading-snug">
    Professional Team Dedicated <br /> to Smoking Cessation Support
  </h2>
</div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-7xl mx-auto animate__animated animate__fadeInUp">
        {teamMembers.map(({ id, img, name, position }) => (
          <div
            key={id}
            className="group bg-white rounded-tl-[1.5rem] rounded-br-[1.5rem] shadow-xl p-8 flex flex-col items-center min-h-[420px]
              border-2 border-transparent
              hover:border-green-500
              hover:rounded-tl-[1.5rem] hover:rounded-br-[1.5rem]
              transition-all duration-300"
          >
            <div
              className="w-64 h-64 overflow-hidden
                         rounded-tl-[1.5rem] rounded-br-[1.5rem]
                         rounded-toggle-corners
                         transition-all duration-300"
            >
              <img
                src={img}
                alt={name}
                className="w-full h-full object-cover"
              />
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
