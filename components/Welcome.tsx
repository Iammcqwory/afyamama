import React from 'react';

export const Welcome: React.FC = () => {
  return (
    <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-stone-200 text-center">
      <h2 className="text-2xl font-bold text-brand-dark mb-3">
        Everything you need for confident parenting
      </h2>
      <p className="max-w-2xl mx-auto text-stone-700 mb-4">
        Mamabora combines AI technology with expert knowledge to support you through every parenting challenge.
      </p>
      <p className="max-w-3xl mx-auto text-stone-600">
        Expert guidance, milestone tracking, and AI-powered support for every stage of your parenting journey. From newborn care to developmental milestones, we're here to help you navigate parenthood with confidence.
      </p>
    </div>
  );
};
