import React from "react";
import pumpkinPNG from './images/technica-pumpkin-transparent.png'
import batPNG from './images/technica-bat-transparent.png'


function Images() {
    return (

        <div>
            <img src = {pumpkinPNG} alt= "" />
            {/*or src = './images/technica-pumpkin-transparent.png' */}

            <img src = {batPNG} alt = ""/>
        </div>

        
    )
}

export default Images;