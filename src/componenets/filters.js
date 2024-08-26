import React, { useState } from 'react';

const Filter = () => {
  const [dietaryPreference, setDietaryPreference] = useState('');
  const [cuisine, setCuisine] = useState('');

  const handleDietaryChange = (event) => {
    setDietaryPreference(event.target.value);
  };

  const handleCuisineChange = (event) => {
    setCuisine(event.target.value);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <div className="mb-4">
        <label
          htmlFor="dietary-preference"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          Dietary Preference:
        </label>
        <select
          id="dietary-preference"
          value={dietaryPreference}
          onChange={handleDietaryChange}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a preference</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="poultry">Poultry</option>
          <option value="seafood">Seafood</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="cuisine"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          Cuisine:
        </label>
        <input
          type="text"
          id="cuisine"
          value={cuisine}
          onChange={handleCuisineChange}
          placeholder="Enter cuisine"
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default Filter;
