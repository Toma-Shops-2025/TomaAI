import React from 'react';

interface StylePresetProps {
  name: string;
  description: string;
  previewImage: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function StylePreset({ name, description, previewImage, isSelected, onClick }: StylePresetProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-blue-500 shadow-lg transform scale-105' 
          : 'hover:shadow-md hover:scale-102'
      }`}
    >
      <div className="relative">
        <img 
          src={previewImage} 
          alt={name}
          className="w-full h-24 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <h3 className="text-white font-semibold text-sm">{name}</h3>
          <p className="text-gray-300 text-xs">{description}</p>
        </div>
      </div>
    </div>
  );
}