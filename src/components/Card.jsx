import React from "react";

function Card({ title, description, icon }) {
  return (
    <div className="flex flex-col bg-[#131314] py-[12px] px-[16px] rounded-[16px]
         hover:bg-[#1A1A1D] transition-colors duration-300 coursor-pointer">
      <img src={icon} alt={title} className="w-[40px] h-[40px] mb-[8px] rounded-full" />
      <h2 className="text-white text-[17px] font-medium">{title}</h2>
      <p className="text-[14px] text-[#7D7D85]">{description}</p>
    </div>
  );
}

export default Card;