// src/components/DraggableImage.tsx

import React from 'react';
import '../renderer/App.css';
interface DraggableImageProps {
  src: string;
  alt: string;
  width: number;
  onClick: () => void;
}

const DraggableImage: React.FC<DraggableImageProps> = ({
  src,
  alt,
  width,
  onClick,
}) => {
  return (
    // This div is the handle that moves the entire window
    <div className="drag-region">
      <img
        src={src} // Use the prop
        alt={alt} // Use the prop
        width={width}
        className="draggable-png"
        onClick={onClick} // Use the prop
      />
    </div>
  );
};

export default DraggableImage;
