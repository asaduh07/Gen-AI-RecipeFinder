import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { recipeSelector, fetchAllRecipesAsync, postRecipesAsync } from '../features/recipe/recipeSlice';
import axios from 'axios';
import Loader from './loader';

const RecipeList = ({ setIngredients }) => {
    const dispatch = useDispatch();
    const {generatedRecipes, loading, error } = useSelector(recipeSelector);
    const [selectedRecipes, setSelectedRecipes] = useState([]);
    const [imageUrls, setImageUrls] = useState({});
    const [selectedImages, setSelectedImages] = useState({});

    useEffect(() => {
        dispatch(fetchAllRecipesAsync());
    }, [dispatch]);

    const handleCheckboxChange = (recipe) => {
        setSelectedRecipes(prevSelectedRecipes => {
            if (prevSelectedRecipes.includes(recipe)) {
                return prevSelectedRecipes.filter(item => item !== recipe);
            } else {
                return [...prevSelectedRecipes, recipe];
            }
        });
    };

    const handleSaveRecipes = () => {
        // Add the selected images to the recipes before saving
        const recipesWithImages = selectedRecipes.map(recipe => ({
            ...recipe,
            imageUrl: selectedImages[recipe.title] || '' // Use selected image URL if available
        }));

        dispatch(postRecipesAsync(recipesWithImages));
        setIngredients('');
    };

    const fetchImagesForRecipe = async (title) => {
        try {
            const token = JSON.parse(localStorage.getItem('jwt'));
            const response = await axios.get(`${process.env.REACT_APP_SERVER_DOMAIN}/api/recipe/images?query=${encodeURIComponent(title)}`,{
                headers: {
                    Authorization: `${token}`
                }
            });
            if(response.data.success){
                setImageUrls(prev => ({ ...prev, [title]: response.data.images }));
            } else {
                // Handle case where no images are found
                setImageUrls(prev => ({ ...prev, [title]: [] }));
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const handleImageSelect = (title, url) => {
        setSelectedImages(prev => ({ ...prev, [title]: url }));
    };

    useEffect(() => {
        if (generatedRecipes.length > 0) {
            generatedRecipes.forEach(recipe => {
                fetchImagesForRecipe(recipe.title);
            });
        }
    }, [generatedRecipes]);

    if (loading) return <div className='flex items-center justify-center h-screen'><Loader/></div>
    if(error) return <div className='flex items-center justify-center h-screen'><h1>{error}</h1></div>

    const formatInstructions = (instructions) => {
        const lines = instructions.split('\n').filter(instruction => instruction.trim() !== '');
        return lines.map(line => {
            const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            return { __html: formattedLine };
        });
    };

    return (
        <div className="max-w-3xl mx-auto mt-8 px-4">
  <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">Generated Recipes</h2>
  {generatedRecipes.length > 0 ? (
    <div>
      {generatedRecipes.map((recipe, index) => (
        <div
          key={index}
          className="mb-8 p-6 shadow-lg rounded-lg bg-white border border-gray-200 transition transform hover:scale-102 hover:shadow-2xl"
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">{recipe.title}</h3>

          <h4 className="text-xl font-medium text-gray-800">Ingredients</h4>
          <ul className="list-disc list-inside pl-5 mt-2 space-y-1 text-gray-700">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>

          <h4 className="text-xl font-medium mt-6 text-gray-800">Instructions</h4>
          <ul className="mt-2 space-y-2 text-gray-700">
            {formatInstructions(recipe.instructions).map((instruction, index) => (
              <li key={index} className="relative pl-5">
                <span className="absolute left-0 top-0 mt-1 h-2 w-2 rounded-full bg-green-500"></span>
                <div dangerouslySetInnerHTML={instruction}></div>
              </li>
            ))}
          </ul>

          {/* Image Selection Section */}
          <div className="mt-6">
            <h4 className="text-xl font-medium text-gray-800">Select an Image</h4>
            <div className="flex overflow-x-auto space-x-4 mt-3">
              {imageUrls[recipe.title]?.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Option ${i + 1}`}
                  className={`w-24 h-24 object-cover rounded-lg cursor-pointer border-4 transition-transform duration-300 ${
                    selectedImages[recipe.title] === url ? 'border-green-600 scale-110' : 'border-gray-300'
                  }`}
                  onClick={() => handleImageSelect(recipe.title, url)}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center">
            <input
              type="checkbox"
              checked={selectedRecipes.includes(recipe)}
              onChange={() => handleCheckboxChange(recipe)}
              className="form-checkbox h-5 w-5 text-green-600"
            />
            <label className="ml-3 text-lg text-gray-700">Select this recipe</label>
          </div>
        </div>
      ))}
      <button
        onClick={handleSaveRecipes}
        className="mt-8 w-full bg-green-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Save Selected Recipes
      </button>
    </div>
  ) : (
    <p className="text-center text-lg text-gray-600">Generate new recipes to get started!</p>
  )}
</div>

    );
};

export default RecipeList;
