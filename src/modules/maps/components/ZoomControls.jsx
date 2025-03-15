import React from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const ZoomControls = ({ onZoomIn, onZoomOut }) => {
  return (
    <div className="absolute bottom-16 right-4 zoom-controls flex flex-col gap-2">
      <button onClick={onZoomIn} className="cursor-pointer" title="Zoom in">
        <FaPlus />
      </button>
      <button onClick={onZoomOut} className="cursor-pointer" title="Zoom out">
        <FaMinus />
      </button>
    </div>
  );
};

export default ZoomControls;