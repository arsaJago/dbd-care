'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { Poster } from '@/types';

interface PosterCardProps {
  poster: Poster;
  onView: () => void;
  onDownload: () => void;
}

export default function PosterCard({ poster, onView, onDownload }: PosterCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
      <div className="relative h-64 overflow-hidden cursor-pointer" onClick={onView}>
        <img
          src={poster.fileUrl}
          alt={poster.title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
            {poster.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {poster.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {poster.description}
        </p>
        <div className="flex items-center justify-between">
          <button
            onClick={onView}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition"
          >
            Lihat Detail
          </button>
          <button
            onClick={onDownload}
            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            title="Download"
          >
            <Download size={18} />
          </button>
        </div>
        <div className="mt-3 text-xs text-gray-500 text-center">
          {poster.downloads} downloads
        </div>
      </div>
    </div>
  );
}
