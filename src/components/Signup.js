import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from '../context/AuthContext'
import { getDatabase, ref, set, child, get, push, update, remove, onValue } from "firebase/database";

function writeUserData(userId, email) {
  const db = getDatabase();
  // handling userId to get unique Id
  const slicedUser = (userId.split("@")[0] + userId.split("@")[1]).split(".")[0]; 
  set(ref(db, 'users/' + slicedUser), {
    userId: slicedUser,
    email: email,
    cash: 0,
    history: 'CREATED',
    pnlHistory: 'CREATED',
    pnl: 0
  });
}

const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const { createUser } = UserAuth();
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await createUser(email, password);
            writeUserData(email, email); // handled above for userId
            navigate('/Dashboard')
        } catch (e) {
            setError(e.message);
            console.log(e.message);
        }
    }

  return (
    <div className="max-w-[700px] mx-auto my-16 p-4">
        <h1 className="text-4xl font-bold py-2 text-center">quickTrack</h1>
      <div>
        <h3 className="text-2xl font-bold py-2">Sign up for an account</h3>
        <p className="py-2">
          Already have an account?
          <Link to="/" className="underline">
            {" "}
            Sign In.
          </Link>
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col py-2">
          <label className="py-2 font-medium">Email Address</label>
          <input onChange={(e) => setEmail(e.target.value)} className="border p-2" type="email" />
        </div>
        <div className="flex flex-col py-2">
          <label className="py-2 font-medium">Password</label>
          <input onChange={(e) => setPassword(e.target.value)} className="border p-2" type="password" />
        </div>
        <button className="border border-blue-500 bg-blue-600 hover:bg-blue-500 w-full p-4 my-2 text-white">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
