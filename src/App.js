import React from 'react';

import './App.css';
import './output.css';

import {useLocalStorageState} from './utils/hooks';

import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

import Login from './components/login';
import Main from './components/main';

import userbase from 'userbase-js'

require('dotenv').config()

function App() {

  const [authType, setAuthType] = useLocalStorageState('authType', 'signup')
  const [loading, setLoading] = React.useState(true)

  const [user, setUser] = React.useState(null);
  
  const [info, setInfo] = useLocalStorageState('auth', {
    username: '',
    password: '',
    email: ''
  })

  const {username, password, email} = info;

  React.useEffect(() => {

    const appId = process.env.REACT_APP_APP_ID
    userbase.init({appId: appId})
    .then((session) => {
      setUser(session.user)
        setLoading(false)
    })
  }, [])

  function handleSubmit(event) {
    event.preventDefault();

    if(!username || !password) {
      alert("You must enter both a username and passowrd.")
      return
    } else {
      setLoading(true)
    }

    if(authType === "signup") {
      
      userbase.signUp({username: username, password: password, email: email, rememberMe: "local"})
      .then((user) => {
        setUser(user);
        setLoading(false)
      })
      .catch((error) => {
        alert("Invalid username. Please try again with a different username.");
        console.log(error)
        setLoading(false)
      })

    } else if (authType === "login") {

      userbase.signIn({username: username, password: password})
      .then((user) => {
        setUser(user);
        setLoading(false)
      })
      .catch((error) => {
        alert("Invalid username or password. Please try again.");
        console.log(error);
        setLoading(false)
      })

    }    

  }

  function handleLogout() {;

    setLoading(true)
    userbase.signOut()
    .then(() => {
      setUser(null);
      setTimeout(() => {
        setLoading(false)
      }, 200)
    })
  }

  function changeAuthType() {
    setAuthType(`${authType === 'login' ? 'signup' : 'login'}`);
  }

  function changeInfo(event) {
    setInfo({...info, [event.target.name]: event.target.value})
  }

  function handlePasswordRecovery() {
    userbase.forgotPassword({username: info.username})
    .then(() => {})
    .catch((error) => {
      console.log(error);
      alert("Sorry, user email not found. Cannot recover password.")
    })
  }

  return (
    <div className="App">
      
      <div className="h-10 flex items-center justify-end">
        <button onClick={handleLogout} type="button" style={{display: `${user ? '' : 'none'}`}} className="mx-8 float-right inline-block align-baseline text-md text-gray-600 hover:text-blue-800">
          Log out
        </button>
      </div>
      
      <div className="m-auto text-center">
        <h1 className="font-mono text-4xl text-gray-900 font-black">Poof Notes</h1>
        <h3 className="font-serif text-lg text-gray-600">Make simple, tweet sized, shareable notes.</h3>
      </div>
        
      <div className="flex justify-center my-4" style={{display: `${loading ? '' : 'none'}`}}>
        <ClipLoader css={css} loading={loading} />
      </div>
      

      <Login user={user} loading={loading} info={info} authType={authType} changeAuthType={changeAuthType} 
      handleSubmit={handleSubmit} changeInfo={changeInfo} handlePasswordRecovery={handlePasswordRecovery}/>

      <Main user={user} loading={loading}/>

    </div>
  );
}

export default App;
