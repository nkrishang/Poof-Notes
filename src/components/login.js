import React from 'react';

import '../App.css';
import '../output.css'

function Login({user, loading, info, authType, changeAuthType, changeInfo, handleSubmit, handlePasswordRecovery}) {


  return (
    <div className="Login" style={{display: `${loading || user ? 'none' : ''}`}}>

      <div className="w-full max-w-xs mx-auto my-4" >
        <form className="bg-white shadow-xl rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input name="username" value={info.username} onChange={changeInfo} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-snug focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input name="password" value={info.password} onChange={changeInfo} className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
            <p style={{display: 'none'}} className="text-red-500 text-xs italic">Please choose a password.</p>
          </div>

          <div className="mb-6" style={{display: `${authType === 'login' ? 'none' : ''}`}}>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input name="email" value={info.email} onChange={changeInfo} className="shadow appearance-none text-sm rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="For password recovery (optional)" />
          </div>

          <div className="flex items-center justify-between">
            <button className=" bg-transparent hover:bg-gray-800 text-gray-600 font-semibold hover:text-white py-2 px-4 border border-gray-600 hover:border-transparent rounded" type="submit">
              {authType === 'login' ? "Log in" : "Sign Up"}
            </button>
            <button type="button" className="inline-block align-baseline text-sm text-gray-600 hover:text-blue-800" onClick={handlePasswordRecovery}>
              Forgot Password?
            </button>
          </div>

          <button onClick={changeAuthType} className="text-xs text-gray-500 hover:text-blue-800 my-2" type="button">
              {authType === 'login' ? "Sign Up?" : "Log in?"}
          </button>
        </form> 
        <p className="text-center text-gray-500 text-xs m-10">
          This project is opensource.
        </p>
      </div>
    </div>
  );
}

export default Login;
