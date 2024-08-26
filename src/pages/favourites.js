import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getfavouriteRecipes } from '../features/recipe/recipeSlice';  // Import your async thunk
import RecipeCard from '../componenets/recipecard';  // Assuming you are reusing the RecipeCard component
import Loader from '../componenets/loader';
import { recipeSelector } from '../features/recipe/recipeSlice';
export default function FavoritesPage() {
    const dispatch = useDispatch();

    // Fetching favorite recipes from the state
    const { favouriteRecipes, loading, error } = useSelector(recipeSelector);

    // Dispatch the getfavouriteRecipes action on component mount
    useEffect(() => {
        dispatch(getfavouriteRecipes());
    }, [dispatch]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">My Favorite Recipes</h1>

            {/* Show loading spinner */}
            {loading && <div className='flex items-center justify-center h-screen'><Loader /></div>}

            {/* Show error message */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Show a message if there are no favorite recipes */}
            {favouriteRecipes.length === 0 && !loading && !error && (
                <p>You have no favorite recipes yet.</p>
            )}

            {/* Render favorite recipes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favouriteRecipes.map(recipe => (
                    <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
            </div>
        </div>
    );
}
