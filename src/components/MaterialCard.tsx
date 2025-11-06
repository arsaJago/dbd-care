'use client';

import React from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { Material } from '@/types';
import { formatDate, truncateText } from '@/lib/utils';

interface MaterialCardProps {
  material: Material;
}

export default function MaterialCard({ material }: MaterialCardProps) {
  return (
    <Link href={`/materi/${material.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden h-full">
        <div className="relative h-48 overflow-hidden">
          <img
            src={material.thumbnailUrl}
            alt={material.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
              {material.category}
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
            {material.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {truncateText(material.content.replace(/<[^>]*>/g, ''), 150)}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye size={16} />
              <span>{material.views} views</span>
            </div>
            <span>{formatDate(material.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
