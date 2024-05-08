import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className='bg-gray-800 text-white p-3'>
      <ul className='flex justify-between items-center space-x-4'>
        {user && (
          <>
            <li className='hover:bg-gray-700 p-2 rounded'>
              <a
                href='/'
                onClick={() => {
                  logout();
                }}
              >
                Logout
              </a>
            </li>
            <div className='flex self-end'>
              <li className='hover:bg-gray-700 p-2 rounded'>
                <a href='/sources'>Sources</a>
              </li>
              <li className='hover:bg-gray-700 p-2 rounded'>
                <a href='/citations'>Citations</a>
              </li>
            </div>
          </>
        )}
      </ul>
    </nav>
  );
};
export default Navbar;
