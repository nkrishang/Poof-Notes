import React from 'react';
import '../App.css';
import '../output.css'

import { Collapse } from '@material-ui/core';

import attachLogo from '../assets/paperclip.svg';
import micLogo from '../assets/mic.svg';

import io from 'socket.io-client';
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import ss from 'socket.io-stream';

function NoteInput({handleNoteText, handleNoteTitle, handleStyle, handleSubmit, handleFiles, handleTranscription, color, noteState}) {

    const {noteText, title, file} = noteState;
    const collapseState = (title || noteText) ? true : false; 

    const [recording, setRecording] = React.useState(false)
    const [audioObjects, setAudioObjects] = React.useState({
        socket: null,
        recordRtc: null,
        mediaStream: null
    })

    React.useEffect(() => {
        const socketio = (
            window.location.hostname === "localhost"
                ? io("http://localhost:8080")
            // Insert own server endpoint
                : io("https://myapp.herokuapp.com")
        )
        
        const socket = socketio.on('connect', () => {
          setRecording(false)
          console.log('React socket client connected.')
        });
        setAudioObjects(audioObjects => {
          const newObj = {...audioObjects, socket: socket};
          return newObj;
        });
    
        socket.on('results', (data) => {
          if(data && data.results[0] && data.results[0].alternatives[0]) {
            const newText = data.results[0].alternatives[0].transcript;
            handleTranscription(newText);
          }
        });
    
        return () => socketio.disconnect();
// eslint-disable-next-line
    }, [])

    function startRecording() {

        setRecording(true)
    
        navigator.getUserMedia({
          audio: true
        }, (stream) => {
    
          const recordAudio = RecordRTC(stream, {
            type: 'audio',
            mimeType: 'audio/webm',
            sampleRate: 44100, 
    
            recorderType: StereoAudioRecorder,
    
            numberOfAudioChannels: 1,
    
            timeSlice: 3000,
    
            desiredSampRate: 16000,
    
            ondataavailable: function(blob) {
    
              const stream = ss.createStream();
    
              ss(audioObjects.socket).emit('stream-transcribe', stream, {
                  name: 'stream.wav', 
                  size: blob.size
              });
              ss.createBlobReadStream(blob).pipe(stream);
            }
          });
    
          recordAudio.startRecording();
          setAudioObjects({...audioObjects, recordRtc: recordAudio, mediaStream: stream})
    
        }, function(error) {
            console.error(JSON.stringify(error));
        });
    
    }
    
    function stopRecording() {
    
        audioObjects.recordRtc.stopRecording();
        
        audioObjects.mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
    
        setAudioObjects({...audioObjects, recordRtc: null, mediaStream: null});
        setRecording(false)
    }
      

    return (
        <div className="Note m-4">
            
            <div className="h-auto rounded-md shadow-lg bg-white" style={{width: "500px"}}>

                {/* <div>
                    <input value={title} className="mx-6 my-2 p-4 leading-5 font-bold text-gray-900 border border-solid-2 border-black" maxLength="30" style={{width: "450px", height: "50px"}} placeholder={noteText ? "Enter title" : "Take a note..."} onChange={handleNoteTitle}/>
                </div> */}

                <div className="flex space-around">
                    <input value={title} className="mx-6 my-2 p-4 leading-5 font-bold text-gray-900" maxLength="30" style={{width: "450px", height: "50px"}} placeholder={noteText ? "Enter title" : "Take a note..."} onChange={handleNoteTitle}/>

                    <button className="px-4 m-2 rounded" onClick={!recording ? startRecording : stopRecording} style={{backgroundColor: `${recording ? "#FC8181" : ""}`, height: "50px"}}>
                        <img src={micLogo} alt="mic" className="opacity-25"/>
                    </button>
                </div>

                <Collapse in={collapseState} timeout='auto'>
                    <div>
                        <textarea value={noteText} onChange={recording ? () => {} : handleNoteText} style={{resize: "none", width: "450px"}} wrap="hard" rows="7" className="mx-6 my-2 p-4 font-mono" maxLength="255" placeholder={collapseState ? 'Take a note...' : ''}>
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
                </Collapse>
            </div>
        </div>
    );
}

export default NoteInput;
