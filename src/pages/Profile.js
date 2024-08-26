import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { userSelector } from '../features/user/userSlice';
import { updateUserDetailAsync,fetchUserDetailsAsync } from '../features/user/userSlice';
import Loader from '../componenets/loader';
import React from 'react';

const Profile = () => {
  const SERVER_DOMAIN = process.env.REACT_APP_SERVER_DOMAIN;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading } = useSelector(userSelector);
  const [newName, setNewName] = useState(user?.name || '');
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [showFileInput, setShowFileInput] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };



  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserDetailAsync({ name: newName, email: newEmail, file: selectedFile }));
      await dispatch(fetchUserDetailsAsync());

    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  return (

    loading ? <div className="flex justify-center items-center min-h-screen">
      <Loader />
    </div>
      : <form className='p-5 sm:mx-auto sm:w-full sm:max-w-sm w-full' onSubmit={handleUpdateUser} encType='multipart/form-data'>
        <div className="space-y-12 flex flex-col items-start sm:w-full sm:max-w-sm w-full">
          <div className="border-b border-gray-900/10 pb-12 sm:mx-auto sm:w-full sm:max-w-sm w-full">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full flex flex-col">
                <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">Photo</label>
                <div className="mt-2 flex items-center gap-x-3">
                  {user?.imageUrl ? (
                    <img
                      alt=""
                      src={`${SERVER_DOMAIN}${user.imageUrl}`}
                      className="h-14 w-14 rounded-full"
                    />
                  ) : (
                    <UserCircleIcon aria-hidden="true" className="h-16 w-16 text-gray-300" />
                  )}
                  <button
                    type="button"
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => setShowFileInput(!showFileInput)}
                  >
                    Change
                  </button>
                </div>
                {showFileInput && (
                  <div className="mt-2">
                    <input type="file" onChange={handleFileChange} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12 sm:mx-auto sm:w-full sm:max-w-sm w-full">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Name</label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={() => navigate('/')}>Cancel</button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
  );
};

export default Profile;
