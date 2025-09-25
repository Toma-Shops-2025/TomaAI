import React from 'react';

interface GenerationControlsProps {
  aspectRatio: string;
  quality: string;
  numImages: number;
  onAspectRatioChange: (ratio: string) => void;
  onQualityChange: (quality: string) => void;
  onNumImagesChange: (num: number) => void;
}

export default function GenerationControls({ 
  aspectRatio, 
  quality, 
  numImages, 
  onAspectRatioChange, 
  onQualityChange, 
  onNumImagesChange 
}: GenerationControlsProps) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 space-y-4 border border-slate-700">
      <h3 className="text-white font-semibold text-lg mb-4">Generation Settings</h3>
      
      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">Aspect Ratio</label>
        <select
          value={aspectRatio}
          onChange={(e) => onAspectRatioChange(e.target.value)}
          className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none border border-slate-600"
        >
          <option value="1:1">Square (1:1)</option>
          <option value="16:9">Landscape (16:9)</option>
          <option value="9:16">Portrait (9:16)</option>
          <option value="4:3">Standard (4:3)</option>
        </select>
      </div>

      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">Quality</label>
        <select
          value={quality}
          onChange={(e) => onQualityChange(e.target.value)}
          className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none border border-slate-600"
        >
          <option value="standard">Standard</option>
          <option value="high">High Quality</option>
          <option value="ultra">Ultra HD</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">Number of Images</label>
        <input
          type="range"
          min="1"
          max="4"
          value={numImages}
          onChange={(e) => onNumImagesChange(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-slate-400 text-xs mt-1">
          <span>1</span>
          <span className="text-cyan-400 font-medium">{numImages}</span>
          <span>4</span>
        </div>
      </div>
    </div>
  );
}