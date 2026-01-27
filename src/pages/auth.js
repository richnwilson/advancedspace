import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import common from '../helpers/common';

const Auth = () => {
  const [ stateVal, setStateVal ] = useState({
    email: '',
    password: '',
    loading: false
  });
  const { email, password, loading }  = stateVal;
  
  const isFormValid = email.trim().length > 0 && password.trim().length > 0

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate()

  const handleAuth = async (endpoint) => {
    try {
        setStateVal((prev) => ({ ...prev, loading: true}))

        const { data : { token = null, message = ""} } = await axios.post(`http://${process.env.REACT_APP_BACKEND}:5000/${endpoint}`, {
            email,
            password
        });
        setSearchParams({});
        setStateVal((prev) => ({ ...prev, loading: false}))

        if (token) {
            localStorage.setItem('myAdvancedSpaceAccess', token);
            common.displayMessage('success',"Login successfull")

        } else {
            common.displayMessage('success',message || '')
            setSearchParams({});
        }
        navigate('/data');
    } catch (err) {
        setStateVal((prev) => ({ ...prev, loading: false}))
        setSearchParams({});
        common.displayMessage('error', err?.response?.data?.message || 'Authentication failed')
    }
  };

  return (
    <>
        { loading && <div className="dot-pulse"></div>}
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Advanced Space" className="mx-auto h-10 w-auto" />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">Sign in to your account</h2>
            </div>  
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <div>
                <label htmlFor="email" className="block text-sm/6 font-medium">Email address</label>
                <div className="mt-2">
                    <input id="email" type="email"  onChange={(e) => setStateVal((prev) => ({ ...prev, email: e.target.value}))} name="email" required autoComplete="email" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                </div>
            </div>     
            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm/6 font-medium">Password</label>
                </div>
                <div className="mt-2">
                <input id="password" type="password" onChange={(e) => setStateVal((prev) => ({ ...prev, password: e.target.value}))} name="password" required autoComplete="current-password" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                </div>
            </div>  
            <div className='mt-6'>
                <button type="submit" disabled = { !isFormValid } onClick={() => handleAuth('login')} className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
            </div>                                         
            <p className="mt-10 text-center text-sm/6">
                <button disabled = { !isFormValid } onClick={() => handleAuth('register')} className="font-semibold text-indigo-600 hover:text-indigo-500">Register</button>
            </p>            
            </div>      
        </div>
    </>
  );
};

export default Auth;