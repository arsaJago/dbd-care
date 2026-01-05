'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface SequentialNavProps {
  step: number;
  total: number;
  nextHref: string;
  nextLabel: string;
  variant?: 'green' | 'red' | 'purple' | 'gray' | 'blue';
  className?: string;
}

const variantClasses: Record<string, string> = {
  green: 'bg-green-600 hover:bg-green-700 focus:ring-green-400',
  red: 'bg-red-600 hover:bg-red-700 focus:ring-red-400',
  purple: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-400',
  gray: 'bg-gray-700 hover:bg-gray-800 focus:ring-gray-400',
  blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-400',
};

export const SequentialNav: React.FC<SequentialNavProps> = ({
  step,
  total,
  nextHref,
  nextLabel,
  variant = 'green',
  className = '',
}) => {
  const router = useRouter();
  const btnClasses = variantClasses[variant] || variantClasses.green;

  return (
    <div className={`mt-12 flex flex-col items-center ${className}`} role="navigation" aria-label="Konten berikutnya">
      <div className="text-sm text-gray-500 mb-3">Langkah {step} dari {total}</div>
      <button
        onClick={() => router.push(nextHref)}
        className={`inline-flex items-center gap-2 px-8 py-4 rounded-lg text-white font-semibold shadow transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${btnClasses}`}
      >
        Lanjut ke {nextLabel}
        <span aria-hidden="true">➡️</span>
      </button>
    </div>
  );
};

export default SequentialNav;
