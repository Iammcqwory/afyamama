
import React, { useState } from 'react';
import { SendIcon } from './icons';

interface ChatInputProps {
  onSend: (message: string) => void;
  isSending: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isSending }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue.trim() && !isSending) {
      onSend(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center p-4 bg-white border-t border-gray-200" role="search">
      <label htmlFor="chat-input" className="sr-only">Type your message</label>
      <input
        id="chat-input"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Describe your child's symptoms..."
        disabled={isSending}
        className="flex-grow p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-dark transition-shadow disabled:bg-gray-100 text-stone-900"
        aria-label="Describe your child's symptoms"
      />
      <button
        type="submit"
        disabled={isSending || !inputValue.trim()}
        className="ml-3 p-3 bg-brand-DEFAULT text-white rounded-full hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        aria-label="Send message"
      >
        <SendIcon className="w-6 h-6" />
      </button>
    </form>
  );
};
