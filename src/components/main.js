import React from 'react';

import '../App.css';
import '../output.css'

import {useLocalStorageState} from '../utils/hooks'

import NoteInput from './input';
import StickyNote from './sticky';

import userbase from 'userbase-js';
import sha256 from 'js-sha256';

function Main({user, loading}) {
  //Clean up state
  const [notes, setNotes] = React.useState([])

  const [noteState, setNoteState] = useLocalStorageState('noteContent', {
    title: '',
    noteText: '',
    noteStyle: "rounded-lg shadow-lg bg-indigo-200",
    color: "indigo"
  })
  const [noteFile, setNoteFile] = React.useState(null);

  React.useEffect(() => {

    if(!user) {
      return
    }

    userbase.openDatabase({databaseName: "notes", changeHandler})
  }, [user])

  function changeHandler(items) {
    const reversedItems = items.reverse();
    setNotes(reversedItems)
  }

  function handleNoteText(event) {

    const value = event.target.value;
    if(value.split('\n').length > 7) {
      return
      // Maybe add error alert?
    }
    setNoteState({...noteState, noteText: value});
  }

  function handleTranscription(newText) {
    
    setNoteState((noteState) => {
      const {noteText} = noteState;
      const preAudioText = noteText ? noteText + ' ' : '';
      const newState = {...noteState, noteText: (preAudioText + newText)};
      setNoteState(newState);
    })
  }

  function handleNoteTitle(event) {
    setNoteState({...noteState, title: event.target.value});
  }

  function handleStyle(event) {
    const selectedColor = event.target.getAttribute('name');
    
    switch(selectedColor) {
      case "indigo" :
        setNoteState({...noteState, color: selectedColor, noteStyle: "rounded-lg shadow-lg bg-indigo-200"})
        break;
      case "green" :
        setNoteState({...noteState, color: selectedColor, noteStyle: "rounded-lg shadow-lg bg-green-200"})
        break;
      case "yellow" :
        setNoteState({...noteState, color: selectedColor, noteStyle: "rounded-lg shadow-lg bg-yellow-200"})
        break;
      case "pink" :
        setNoteState({...noteState, color: selectedColor, noteStyle: "rounded-lg shadow-lg bg-pink-200"})
        break;
      default:
      break;
    }
  }

  function handleFiles(event) {        
    const file = event.target.files[0];
    // setNoteState({...noteState, file:file});
    setNoteFile(file)

    const {name, size, type} = file;
    console.log(name, size, type);
  }

  function handleSubmit() {
    let newItem;

    if(!noteState.title) {
      newItem = {...noteState, file: noteFile, title: "New Note"};
    } else {
      newItem = {...noteState, file: noteFile}
    }
    const {title, noteText} = noteState
    const itemId = sha256((title.concat(noteText)).concat(Math.random().toString().substring(2))).toString();

    userbase.insertItem({databaseName: "notes", item: newItem, itemId: itemId})
    .then(() => {
      if(noteFile) {
        userbase.uploadFile({databaseName: "notes", itemId: itemId, file: noteFile})
        .then(() => {
          setNoteFile(null)
          console.log("file successfully uploaded");
        })
        .catch((e) => {
          alert("Sorry, there was an error when uploading your file. Please try again.")
          console.log(e);
        })
      }
      setNoteState({...noteState, title: "", noteText: ""})
    })
    .catch((e) => {
      alert("Sorry, there was an error when making your note. Please try again.")
      console.log(e)
    })

  } 

  return (
    <div className="Main" style={{display: `${(user && !loading) ? '' : 'none'}`}}>
      
      <div className="flex justify-center">
          <NoteInput handleNoteText={handleNoteText} handleNoteTitle={handleNoteTitle} handleTranscription={handleTranscription}
          handleStyle={handleStyle} handleSubmit={handleSubmit} handleFiles={handleFiles} file={noteFile} noteState={noteState}/>
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
