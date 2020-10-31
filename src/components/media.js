import React from 'react';
import '../App.css';
import '../output.css'

function Image({src}) {

    return(
        <img src={src} alt="Note" style={{height: "350px", width: "auto"}} className="mx-2"/>
    )
}


export default Image;