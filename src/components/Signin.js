import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import "./general.css"

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { signIn } = UserAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signIn(email, password);
      navigate("/Dashboard");
    } catch (e) {
      console.log(e.message);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="max-w-[700px] mx-auto my-16 p-4">
      <img className="mx-auto h-50 w-50" src="quicktrack_logo.png" />
      <div>
        <h3 className="text-2xl font-bold py-2">Sign in to your account</h3>
        <p className="py-2">
          Don't have an account yet?
          <Link to="/Signup" className="underline">
            {" "}
            Sign Up.
          </Link>
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col py-2">
          <label className="py-2 font-medium">Email Address</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2"
            type="email"
          />
        </div>
        <div className="flex flex-col py-2">
          <label className="py-2 font-medium">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2"
            type="password"
          />
        </div>
        <button className="border border-blue-500 bg-blue-600 hover:bg-blue-500 w-full p-4 my-2 text-white">
          Sign In
        </button>
      </form>
      <div>
        {error ? <label class="danger">{error}</label> : null}
      </div>
    </div>
  );
};

export default Signin;
