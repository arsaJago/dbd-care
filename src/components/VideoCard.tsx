'use client';

import React from 'react';
import { Play, Eye, Clock } from 'lucide-react';
import { Video } from '@/types';

interface VideoCardProps {
  video: Video;
  onWatch: () => void;
}

export default function VideoCard({ video, onWatch }: VideoCardProps) {
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden h-full">
      <div className="relative h-48 overflow-hidden cursor-pointer group" onClick={onWatch}>
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
            <Play size={32} className="text-white ml-1" fill="white" />
          </div>
        </div>
        <div className="absolute top-3 right-3 flex items-center space-x-1 bg-black bg-opacity-70 px-2 py-1 rounded text-white text-xs">
          <Clock size={12} />
          <span>{video.duration}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {video.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {video.description}
        </p>
        <div className="flex items-center justify-between">
          <button
            onClick={onWatch}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-2"
          >
            <Play size={18} />
            <span>Tonton</span>
          </button>
        </div>
        <div className="mt-3 flex items-center justify-center space-x-1 text-xs text-gray-500">
          <Eye size={14} />
          <span>{video.views} views</span>
        </div>
      </div>
    </div>
  );
}
