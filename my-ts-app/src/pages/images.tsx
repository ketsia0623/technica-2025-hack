import React from "react";
import pumpkinPNG from './images/technica-pumpkin-transparent.png';
import batPNG from './images/technica-bat-transparent.png';

interface ImagesProps {
  onClick: () => void;
}

function Images({ onClick }: ImagesProps) {
  return (
    <div className="images-row">
      <img
        src={pumpkinPNG}
        alt="Pumpkin"
        className="sim-image"
        onClick={onClick}
      />
      <img
        src={batPNG}
        alt="Bat"
        className="sim-image"
        onClick={onClick}
      />
    </div>
  );
}

export default Images;
