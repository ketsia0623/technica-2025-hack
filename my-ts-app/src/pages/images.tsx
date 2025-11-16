import React from "react";
import pumpkinPNG from "../images/technica-pumpkin-transparent.png";
import batPNG from "../images/technica-bat-transparent.png";
import ghostPNG from "../images/technica-ghost-transparent.png";

interface ImagesProps {
  onClick: () => void;
}

function Images({ onClick }: ImagesProps) {
  return (
    <div className="images-row">

      <div className="image-wrapper" onClick={onClick}>
        <img src={batPNG} alt="Bat" className="sim-image" />
        <b><u className="image-caption">High School Student</u></b>

        <p className="image-caption">earning $15/hr</p>
      </div>

      <div className="image-wrapper" onClick={onClick}>
        <img src={ghostPNG} alt="Ghost" className="sim-image" />
        <b><u className="image-caption">College Student</u></b>
        <p className="image-caption">Earning $15/hr</p>
        <p className="image-caption">have to pay for tuition</p>
      </div>


      <div className="image-wrapper" onClick={onClick}>
      <div className="image-container">
       <img src={pumpkinPNG} alt="Pumpkin" className="sim-image pumpkin" />
      </div>
        <div className="caption-container">
        <p className="image-caption"><b><u>New Grad</u></b></p>
        <p className="image-caption">Earning $30/hr</p>
        <p className="image-caption">have to pay for rent and groceries</p>
      </div>
    </div>

    </div>
  );
}

export default Images;
