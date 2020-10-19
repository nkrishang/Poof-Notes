import React from 'react';

import './App.css';
import './output.css';

import Login from './components/login';
import Main from './components/main';

import userbase from 'userbase-js'
import AppID from './appid';

function App() {

  const [authType, setAuthType] = React.useState('signup')
  const [loading, setLoading] = React.useState(true)

  const [user, setUser] = React.useState(null);
  const [info, setInfo] = React.useState({
    username: '',
    password: '',
    email: ''
  })

  const {username, password, email} = info;

  React.useEffect(() => {
    console.log("rendered effect")

    userbase.init({appId: AppID})
    .then((session) => {
      if(session.user) {
        setUser(session.user)
        setLoading(false)
      } else {
        setLoading(false)
      }
      
    })
  }, [])

  function handleSubmit(event) {
    event.preventDefault();

    if(!username || !password) {
      return
    }

    if(authType === "signup") {
      
      userbase.signUp({username: username, password: password, email: email, rememberMe: "local"})
      .then((user) => {
        setUser(user);
      })
      .catch((error) => {
        alert("Invalid username. Please try again with a different username.");
        console.log(error)
      })

    } else if (authType === "login") {

      userbase.signIn({username: username, password: password})
      .then((user) => {
        setUser(user);
      })
      .catch((error) => {
        alert("Invalid username or password. Please try again.");
        console.log(error);
      })

    }    

  }

  function handleLogout() {;

    userbase.signOut()
    .then(() => {
      setUser(null);
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
        

      <div style={{display: `${loading ? '' : 'none'}`}} className="m-auto text-center text-md">
        Loading...
      </div>

      <Login user={user} loading={loading} info={info} authType={authType} changeAuthType={changeAuthType} 
      handleSubmit={handleSubmit} changeInfo={changeInfo} handlePasswordRecovery={handlePasswordRecovery}/>

      <Main user={user}/>

    </div>
  );
}

export default App;
