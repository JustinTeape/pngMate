import React from 'react';
import './TextBox.css';

interface TextBoxProps {
  children: React.ReactNode;
}

const TextBox: React.FC<TextBoxProps> = ({ children }) => {
  return <div className="text-box">{children}</div>;
};

export default TextBox;
