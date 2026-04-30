
import React from 'react';

export const Disclaimer: React.FC = () => {
  return (
    <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4" role="alert">
      <p className="font-bold">Important Disclaimer</p>
      <p>
        Mamabora is an AI assistant and not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
      </p>
    </div>
  );
};
