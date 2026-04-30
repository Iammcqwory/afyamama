import React from 'react';
import { Construction } from 'lucide-react';

export const SectionPlaceholder: React.FC<{ title: string }> = ({ title }) => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 px-4">
    <div className="p-6 sm:p-8 bg-zinc-900 rounded-full text-zinc-700">
      <Construction className="w-12 h-12 sm:w-20 sm:h-20" />
    </div>
    <h1 className="text-3xl sm:text-4xl font-bold capitalize">{title}</h1>
    <p className="text-zinc-500 text-sm sm:text-base max-w-md">
      This feature is currently under development to provide you with the best parenting experience. Stay tuned!
    </p>
  </div>
);
