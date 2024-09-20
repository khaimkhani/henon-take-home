import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'


const Home = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate()

  const mutation = useMutation({
    onSuccess: (data) => {
      setName('');
      setEmail('');
      navigate(`/dashboard`)
      // set localstorage user
      localStorage.setItem('userID', data.user_id)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ endpoint: 'get_or_create_user', data: { name, email } })
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};


export default Home;

