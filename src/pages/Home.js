import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllRecipesAsync, searchRecipes,recipeActions } from '../features/recipe/recipeSlice';
import { recipeSelector } from '../features/recipe/recipeSlice';
import { useNavigate } from 'react-router-dom';
import Loader from '../componenets/loader';
import Filter from '../componenets/filters';
import RecipeCard from '../componenets/recipecard';

const Home = () => {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {clearSearchResults}= recipeActions;
  const { recipes, searchResults, loading, error } = useSelector(recipeSelector);

  useEffect(() => {
    dispatch(fetchAllRecipesAsync()); // Fetch all recipes on initial load
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(searchRecipes({ title }));
  };

  const handleClearSearch = () => {
    setTitle('');
    dispatch(clearSearchResults()); // Clear search results
    dispatch(fetchAllRecipesAsync()); // Fetch all recipes again
  };



  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="hero bg-cover bg-center h-96 flex items-center justify-center text-center transition-opacity duration-1000 ease-in-out opacity-100" style={{ backgroundImage: 'url(https://graphicgoogle.com/wp-content/uploads/2016/06/Free-Food-Hero-Stock-Photos-3.jpg)' }}>
        <div className="bg-gray-800 bg-opacity-75 p-10 rounded-lg shadow-lg w-full max-w-3xl transition-transform duration-500 ease-in-out transform translate-y-0 opacity-100">
          <h1 className="text-4xl font-bold mb-6 text-white transition-opacity duration-1000 ease-in-out opacity-100">Find Your Perfect Recipe</h1>
          <form onSubmit={handleSearch} className='flex flex-col md:flex-row items-center gap-4'>
            <input
              type="text"
              placeholder="Search your recipes..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-300 ease-in-out transform hover:scale-105 focus:scale-105"
            />
            <div className="flex flex-col md:flex-row gap-4">
              <button type="submit" className="p-3 bg-blue-600 rounded-lg text-white font-semibold shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105 focus:scale-105">Search</button>
              <button type="button" onClick={handleClearSearch} className="p-3 bg-gray-600 rounded-lg text-white font-semibold shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105 focus:scale-105">Clear</button>
            </div>
          </form>
        </div>
      </section>



      {/* Display Recipes */}
      {loading && <div className='flex items-center justify-center h-screen'><Loader /></div>}
      {!loading && (
        <section className="search-results my-10 flex flex-col md:flex-row gap-4">
          {/* Recipes Section */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-6">Recipes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(searchResults.length > 0 ? searchResults : recipes).length > 0 ? (
                (searchResults.length > 0 ? searchResults : recipes).map((recipe) => (
                  <RecipeCard recipe={recipe} key={recipe._id} />
                ))
              ) : (
                <div>No recipes available.</div>
              )}
            </div>
          </div>

          {/* Filter Section */}
          {/* <div className="w-full md:w-1/4">
            <Filter />
          </div> */}
        </section>
      )}
    </div>
  );
};

export default Home;