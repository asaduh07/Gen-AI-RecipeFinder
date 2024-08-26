import React from 'react';
import { useLocation } from 'react-router-dom';

const RecipeDetails = () => {
  const { state } = useLocation();
  const { recipe } = state || {}; // Destructure the recipe from state

  if (!recipe) {
    return <div>Recipe not found.</div>;
  }

  const formatInstructions = (instructions) => {
    const lines = instructions.split('\n').filter(instruction => instruction.trim() !== '');
    return lines.map(line => {
        const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return { __html: formattedLine };
    });
};

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-5xl font-bold text-gray-800">{recipe.title}</h1>
      <img src={recipe.imageUrl || '/path/to/default-image.jpg'} alt={recipe.title} className="w-full h-96 object-cover rounded-lg mt-6" />
      <div className="mt-8">
        <p className="text-lg text-gray-600 mb-4">
          <strong>Description:</strong> {recipe.description || 'No description available.'}
        </p>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Ingredients:</h2>
          <ul className="list-disc list-inside space-y-1">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-gray-600">{ingredient}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Instructions:</h2>
          <ul className="space-y-2 text-gray-600">
            {formatInstructions(recipe.instructions).map((instruction, index) => (
              <li key={index} dangerouslySetInnerHTML={instruction} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
