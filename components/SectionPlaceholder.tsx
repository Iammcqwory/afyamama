import React from 'react';
import { Construction } from 'lucide-react';

export const SectionPlaceholder: React.FC<{ title: string }> = ({ title }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
    <div className="p-8 bg-zinc-900 rounded-full text-zinc-700">
      <Construction className="w-20 h-20" />
    </div>
    <h1 className="text-4xl font-bold capitalize">{title}</h1>
    <p className="text-zinc-500 max-w-md">
      This feature is currently under development to provide you with the best parenting experience. Stay tuned!
    </p>
  </div>
);
