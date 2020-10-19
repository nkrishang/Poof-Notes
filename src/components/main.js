import React from 'react';

import '../App.css';
import '../output.css'

import NoteInput from './input';
import StickyNote from './sticky';

import userbase from 'userbase-js'

function Main({user}) {
  //Clean up state
  const [notes, setNotes] = React.useState([])

  const [noteState, setNoteState] = React.useState({
    title: '',
    noteText: '',
    noteStyle: "rounded-lg shadow-lg bg-indigo-200"
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

  function handleSubmit() {
    if(!noteState.title) {
      setNoteState({...noteState, title: "New note"})
    }

    const newItem = {...noteState};
    userbase.insertItem({databaseName: "notes", item: newItem})

    setNoteState({...noteState, title: "", noteText: ""});
  } 

  return (
    <div className="Main" style={{display: `${user ? '' : 'none'}`}}>
      
      <div className="flex justify-center">
          <NoteInput handleNoteText={handleNoteText} handleNoteTitle={handleNoteTitle} 
          handleStyle={handleStyle} color={color} title={noteState.title} noteText={noteState.noteText} handleSubmit={handleSubmit}/>
      </div>

      <div className="m-auto my-4 w-4/5 h-auto">
        <ul className="flex justify-center flex-wrap">

          {notes.map((note, index) => {

            const {title, noteText, noteStyle} = note.item;
            return <li key={index}>
              <StickyNote itemId={note.itemId} title={title} noteText={noteText} noteStyle={noteStyle}/>
            </li>
          })}
        </ul>
      </div>

    </div>
  );
}

export default Main;