import React from 'react';
import '../App.css';
import '../output.css'

import deleteicon from '../assets/x.svg'
import attachLogo from '../assets/paperclip.svg';

import { TwitterShareButton, TwitterIcon } from 'react-share'

import Image from './media';

import userbase from 'userbase-js'

function StickyNote({itemId, fileId, noteState}) {
  
  const [hover, setHover] = React.useState(false);
  const [source, setSource] = React.useState('');

  const [mediaDisplay, setMediaDisplay] = React.useState(false);

  const {title, noteText, noteStyle, file}  = noteState;

  function handleDelete() {
    userbase.deleteItem({databaseName: "notes", itemId: itemId})
    .then(() => {})
  }

  function handleMedia() {

    if(!source) {
      userbase.getFile({databaseName: "notes", fileId: fileId})
      .then(({ file }) => {
        
        const url = URL.createObjectURL(file)

        if(!file.type.includes("image")) {
          window.open(url, "_blank")
        } else {
          setSource(url)
        }
      })
      .catch((e) => {
        alert("Sorry, there was an error in loading media. Please try again.")
        console.log(e)
      })
    }

    setMediaDisplay(!mediaDisplay)
  }

  return (
    <div className="Sticky-Note mx-4 my-6 flex">

      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className={noteStyle} style={{height: "360px", width: "320px"}}>

        <button onClick={handleDelete} style={{display: `${hover ? '' : `none`}`}} className=" my-2 mx-4 float-right">
          <img style={{opacity:"0.3"}} src={deleteicon} alt="delete"/>
        </button>

        <div className="font-bold mx-2 px-4 py-4 leading-6 text-lg h-16">
          {title}
        </div>

        <div className="mx-2 px-4 font-mono h-48">
          {noteText}
        </div>

        <div className="flex justify-end mx-4 my-10">

          <button className="" onClick={handleMedia}>
            <img style={{opacity: `${mediaDisplay ? '0.8' : '0.3'}`, display: `${file ? '' : 'none'}`}} src={attachLogo} alt="attach" className="m-2"/>
          </button>

          <TwitterShareButton
            url="https://poofnotes.com/"
            title={noteText}
            className="m-2">
            <TwitterIcon
              size={32}
              round={true} />
          </TwitterShareButton>
        </div>
      </div>

      <div style={{height: "350px", width: "auto", display: `${mediaDisplay ? '' : 'none'}`}} className="">
        <Image src={source}/>
      </div>
      
    </div>
  );
}

export default StickyNote;
