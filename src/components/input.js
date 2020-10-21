import React from 'react';
import '../App.css';
import '../output.css'

import attachLogo from '../assets/paperclip.svg';

function NoteInput({handleNoteText, handleNoteTitle, handleStyle, handleSubmit, handleFiles, color, noteState}) {

    const {noteText, title, file} = noteState;

    return (
        <div className="Note m-4">
            <div className="h-auto rounded-md shadow-lg bg-white" style={{width: "500px"}}>

                <div>
                    <input value={title} className="mx-6 my-2 p-4 leading-5 font-bold text-gray-900" maxLength="30" style={{width: "450px"}} placeholder={noteText ? "Enter title" : "Take a note..."} onChange={handleNoteTitle}/>
                </div>

                <div style={{display:`${title || noteText ? 'inline': 'none'}`}}>
                    <textarea value={noteText} onChange={handleNoteText} style={{resize: "none", width: "450px"}} rows="7" className="mx-6 my-2 p-4 font-mono" maxLength="255" placeholder="Take a note...">
                    </textarea>

                    <div className="flex justify-end">

                        <div className="m-4 flex w-24 justify-around items-center">
                            <button name="indigo" onClick={handleStyle} style={{height: `${color === 'indigo' ? "1.25rem" : "1rem"}`, width: `${color === 'indigo' ? "1.25rem" : "1rem"}`}} className="bg-indigo-300 rounded-full flex items-center justify-center" />
                            <button name="green" onClick={handleStyle} style={{height: `${color === 'green' ? "1.25rem" : "1rem"}`, width: `${color === 'green' ? "1.25rem" : "1rem"}`}} className="bg-green-300 rounded-full flex items-center justify-center" />
                            <button name="yellow" onClick={handleStyle} style={{height: `${color === 'yellow' ? "1.25rem" : "1rem"}`, width: `${color === 'yellow' ? "1.25rem" : "1rem"}`}} className="bg-yellow-300 rounded-full flex items-center justify-center" />
                            <button name="pink" onClick={handleStyle} style={{height: `${color === 'pink' ? "1.25rem" : "1rem"}`, width: `${color === 'pink' ? "1.25rem" : "1rem"}`}} className="bg-pink-300 rounded-full flex items-center justify-center" />
                        </div>

                        <div className="m-2 flex items-center">

                            <label htmlFor="fileInput">
                                <p className="text-xs">
                                    {file ? (file.name.length <= 10 ? file.name : `${file.name.slice(0, 7)}...`) : ''}
                                </p>
                                
                                <img style={{opacity: `${file ? '0.8' : '0.3'}`}} src={attachLogo} alt="attach" className="my-2"/>
                            </label>
                        </div>
                        
                        <input onChange={handleFiles} type="file" id="fileInput" className="bg-opacity-0 h-0 w-0 overflow-hidden"/>

                        <button onClick={handleSubmit} className="m-4 bg-transparent hover:bg-gray-800 text-gray-600 font-semibold hover:text-white py-2 px-4 border border-gray-600 hover:border-transparent rounded">
                            Make note
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NoteInput;
