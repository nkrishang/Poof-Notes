import React from 'react';
import '../App.css';
import '../output.css'

import deleteicon from '../assets/x.svg'

import { TwitterShareButton, TwitterIcon } from 'react-share'

import userbase from 'userbase-js'

function StickyNote({itemId, title, noteText, noteStyle}) {
  
  const [hover, setHover] = React.useState(false);

  function handleDelete() {
    userbase.deleteItem({databaseName: "notes", itemId: itemId})
    .then(() => {})
  }

  return (
    <div className="Sticky-Note mx-4 my-6">

      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className={noteStyle} style={{height: "400px", width: "360px"}}>

        <button onClick={handleDelete} style={{display: `${hover ? '' : `none`}`}} className=" my-2 mx-4 float-right">
          <img style={{opacity:"0.3"}} src={deleteicon} alt="delete"/>
        </button>

        <div className="font-bold mx-2 px-4 py-4 leading-6 text-lg h-20">
          {title}
        </div>

        <div className="mx-2 px-4 font-mono h-56">
          {noteText}
        </div>

        <div className="flex justify-end mx-4 my-10">
          <TwitterShareButton
            url="https://poofnotes.com/"
            title={noteText}
            className="">
            <TwitterIcon
              size={32}
              round={true} />
          </TwitterShareButton>
        </div>
      </div>
      
    </div>
  );
}

export default StickyNote;