import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userActions, userSelector } from '../features/user/userSlice';

const Navbar = () => {
  const SERVER_DOMAIN = process.env.REACT_APP_SERVER_DOMAIN;
  const { loggedIn, user } = useSelector(userSelector);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleSignOut = () => {
    dispatch(userActions.signOut());
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left side with logo and links */}
        <div className="flex items-center space-x-4 flex-grow">
          <Link to="/" className="text-white font-semibold text-xl">
            Recipe AI
          </Link>
          <span className="text-sm text-green-400 px-2 py-1 bg-green-900 rounded-lg">
            Powered by AI
          </span>
          <div className="hidden lg:flex lg:items-center lg:space-x-4 flex-grow">
            {loggedIn && (
              <>
                <Link to="/recipes" className="text-white hover:text-gray-300">
                  Generate Recipes
                </Link>
                <Link to="/favourites" className="text-white hover:text-gray-300">
                  Favourites
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Toggle Button for Mobile Menu */}
        <div className="block lg:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {/* User Menu */}
        <div className="hidden lg:flex lg:items-center">
          {loggedIn ? (
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center space-x-2 text-white focus:outline-none">
                {user ? (
                  <>
                    <div className='text-white'>{user.name}</div>
                    <img
                      alt="User avatar"
                      src={`${SERVER_DOMAIN}${user.imageUrl}`}
                      className="h-10 w-10 rounded-full"
                    />
                  </>
                ) : (
                  <div className='text-white'>Loading...</div>
                )}
              </MenuButton>
              <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                <MenuItem>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Your Profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <div onClick={handleSignOut} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                    Sign out
                  </div>
                </MenuItem>
              </MenuItems>
            </Menu>
          ) : (
            <div className='flex space-x-4'>
              <Link to={'/signin'} className="text-white hover:text-gray-300">
                Sign In
              </Link>
              <Link to={'/signup'} className="text-white hover:text-gray-300">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden ${open ? 'block' : 'hidden'} mt-4`}>
        <div className="flex flex-col space-y-2">
          {loggedIn ? (
            <>
              <Link to="/recipes" className="text-white hover:text-gray-300">
                Generate Recipes
              </Link>
              <Link to="/favourites" className="text-white hover:text-gray-300">
                Favourites
              </Link>
              <Link to="/profile" className="text-white hover:text-gray-300">
                Profile
              </Link>
              <div onClick={handleSignOut} className="text-white hover:text-gray-300 cursor-pointer">
                Sign out
              </div>
            </>
          ) : (
            <>
              <Link to={'/signin'} className="text-white hover:text-gray-300">
                Sign In
              </Link>
              <Link to={'/signup'} className="text-white hover:text-gray-300">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
