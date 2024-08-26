import { useState } from 'react';
import React from 'react';
import RecipeSearchForm from '../componenets/RecipeSearchForm';
import RecipeList from '../componenets/RecipeList';
const Recipes = () => {
  const [ingredients, setIngredients] = useState([]);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Found your recipe?</h1>
      <RecipeSearchForm ingredients={ingredients} setIngredients={setIngredients} />
      <RecipeList setIngredients={setIngredients} />
    </div>
  );
};

export default Recipes;