import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { generateRecipesAsync } from '../features/recipe/recipeSlice';

const RecipeSearchForm = ({ ingredients, setIngredients }) => {

  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    const ingredientsArray = ingredients.split(',').map(ingredient => ingredient.trim());
    dispatch(generateRecipesAsync(ingredientsArray));
  };

  return (
    <form onSubmit={handleSearch} className="max-w-md mx-auto p-4 shadow-md rounded bg-white">
      <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700" >
        Enter Ingredients (comma separated):
      </label>
      <input
        id="ingredients"
        type="text"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        required
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
      <button
        type="submit"
        disabled={ingredients.length === 0}
        className={`mt-4 w-full py-2 px-4 rounded-md 
    ${ingredients.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white cursor-pointer'}`
        }>
        Search Recipes
      </button>
    </form>
  );
};

export default RecipeSearchForm;
