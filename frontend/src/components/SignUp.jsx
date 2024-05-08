import { useState } from 'react';
const SignUp = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSignUp = async (event) => {
    event.preventDefault(); // Prevent default form submission
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
        credentials: 'include',
      });
      if (response.ok) {
        window.location.href = '/'; // Redirect or show success message
      } else {
        alert('Failed to sign up');
      }
    } catch (error) {
      alert('Signup error:', error.message);
    }
  };
  return (
    <div className='flex flex-col gap-5'>
      <button onClick={onClose} className='self-end'>
        X
      </button>
      <h1 className='text-5xl self-start'>Sign Up</h1>
      <form
        onSubmit={handleSignUp}
        className='flex flex-col items-start w-full'
      >
        <label>Email</label>
        <input
          type='text'
          name='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='bg-gray-200 rounded-lg w-full px-3 py-1 mb-5'
        />
        <label>Password</label>
        <input
          type='password'
          name='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='bg-gray-200 rounded-lg w-full px-3 py-1 mb-5'
        />
        <button
          type='submit'
          className='bg-gray-200 px-3 py-1 rounded-xl drop-shadow-xl w-1/2 my-5'
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};
export default SignUp;
