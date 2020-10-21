import React from 'react';

import '../App.css';
import '../output.css'

import NoteInput from './input';
import StickyNote from './sticky';

import userbase from 'userbase-js';
import sha256 from 'js-sha256';

function Main({user}) {
  //Clean up state
  const [notes, setNotes] = React.useState([])

  const [noteState, setNoteState] = React.useState({
    title: '',
    noteText: '',
    noteStyle: "rounded-lg shadow-lg bg-indigo-200",
    file: null
  })

  const [color, setColor] = React.useState("indigo");

  React.useEffect(() => {

    if(!user) {
      return
    }

    userbase.openDatabase({databaseName: "notes", changeHandler})
  }, [user])

  function changeHandler(items) {
    setNotes(items)
  }

  function handleNoteText(event) {
    setNoteState({...noteState, noteText: event.target.value});
  }

  function handleNoteTitle(event) {
    setNoteState({...noteState, title: event.target.value});
  }

  function handleStyle(event) {

    setColor(event.target.getAttribute('name'));

    switch(event.target.getAttribute('name')) {
      case "indigo" :
        setNoteState({...noteState, noteStyle: "rounded-lg shadow-lg bg-indigo-200"})
        break;
      case "green" :
        setNoteState({...noteState, noteStyle: "rounded-lg shadow-lg bg-green-200"})
        break;
      case "yellow" :
        setNoteState({...noteState, noteStyle: "rounded-lg shadow-lg bg-yellow-200"})
        break;
      case "pink" :
        setNoteState({...noteState, noteStyle: "rounded-lg shadow-lg bg-pink-200"})
        break;
      default:
      break;
    }
  }

  function handleFiles(event) {        
    const file = event.target.files[0];
    setNoteState({...noteState, file:file});

    const {name, size, type} = file;
    console.log(name, size, type);
  }

  function handleSubmit() {
    let newItem;

    if(!noteState.title) {
      newItem = {...noteState, title: "New Note"};
    } else {
      newItem = {...noteState}
    }
    const {title, noteText} = noteState
    const itemId = sha256((title.concat(noteText)).concat(Math.random().toString().substring(2))).toString();

    userbase.insertItem({databaseName: "notes", item: newItem, itemId: itemId})
    .then(() => {
      if(noteState.file) {
        userbase.uploadFile({databaseName: "notes", itemId: itemId, file: noteState.file})
        .then(() => {
          setNoteState({...noteState, title: "", noteText: "", file: null})
          // console.log("file successfully uploaded");
        })
        .catch((e) => {
          alert("Sorry, there was an error when uploading your file. Please try again.")
          console.log(e);
        })
      }
      setNoteState({...noteState, title: "", noteText: "", file: null})
    })
    .catch((e) => {
      alert("Sorry, there was an error when making your note. Please try again.")
      console.log(e)
    })

  } 

  return (
    <div className="Main" style={{display: `${user ? '' : 'none'}`}}>
      
      <div className="flex justify-center">
          <NoteInput handleNoteText={handleNoteText} handleNoteTitle={handleNoteTitle} 
          handleStyle={handleStyle} handleSubmit={handleSubmit} handleFiles={handleFiles} color={color} noteState={noteState}/>
      </div>

      <div className="m-auto my-4 w-4/5 h-auto">
        <ul className="flex justify-center flex-wrap">

          {notes.map((note, index) => {

            return <li key={index}>
              <StickyNote itemId={note.itemId} noteState={note.item} fileId={note.fileId}/>
            </li>
          })}
        </ul>
      </div>

    </div>
  );
}

export default Main;
