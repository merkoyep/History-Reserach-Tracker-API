import { useState } from 'react';
import SignUp from '../components/SignUp.jsx';
const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const handleModalOpen = () => {
    setIsSignUpOpen(true);
  };
  const handleModalClose = () => {
    setIsSignUpOpen(false);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: email, password }),
      });
      if (response.ok) {
        window.location.href = '/sources';
      } else {
        alert('Failed to Login');
      }
    } catch (error) {
      alert('login error', error);
    }
  };
  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  return (
    <main className='flex flex-col items-start justify-center m-5 lg:m-10 lg:w-3/4'>
      {isSignUpOpen && (
        <div
          className='fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:flex lg:items-center lg:justify-center'
          aria-hidden='true'
          onClick={handleModalClose}
        >
          <div
            onClick={handleModalClick}
            className='my-10 mx-8 p-5 bg-white rounded-lg shadow-lg max-w-md lg:w-1/4'
          >
            <SignUp onClose={handleModalClose} />
          </div>
        </div>
      )}
      <div className='w-3/4 lg:w-1/3'>
        <h1 className='text-7xl text-start px-3 mt-8'>Research Buddy</h1>
        <p className='text-start py-5 px-3'>
          Whether you are researching the colonial history of South East Asia,
          or the works of Shakespeare, Research Buddy is here to keep you
          organized!
        </p>
      </div>

      <form onSubmit={handleLogin} className='flex flex-col items-start w-full'>
        <div className='py-5 flex flex-col items-start w-full px-3 gap-2'>
          <label for='email'>Email</label>
          <input
            type='text'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='bg-gray-200 rounded-lg w-full px-3 py-1'
          />
        </div>
        <div className='py-5 flex flex-col items-start w-full px-3 gap-2'>
          <label for='password'>Password</label>
          <input
            type='password'
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='bg-gray-200 rounded-lg w-full px-3 py-1'
          />
        </div>
        <div className='flex gap-5 px-3 my-3 w-1/2'>
          <button
            type='submit'
            className='bg-gray-200 px-3 py-1 rounded-xl drop-shadow-xl w-1/2'
          >
            Login
          </button>
          <button
            type='button'
            onClick={handleModalOpen}
            className='underline w-1/2'
          >
            Sign Up
          </button>
        </div>
      </form>
    </main>
  );
};

export default Home;
