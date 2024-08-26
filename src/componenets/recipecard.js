import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteRecipe, updateFavoriteAsync } from "../features/recipe/recipeSlice";
import Modal from "./modal";
import Options from "./optionDropdown";
export default function RecipeCard({ recipe }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [favorite, setFavorite] = useState(recipe.fav);
    const handleRecipeClick = (recipe) => {
        navigate(`/recipe/${recipe._id}`, { state: { recipe } });
    };
    const handleOpenDeleteModal = () => {
        setDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
    };
    const handleDelete = () => {
        dispatch(deleteRecipe({ recipeId: recipe._id }));
        setDeleteModalOpen(false);
    };

    const handleToggleFavorite = () => {
        const newFavStatus = !favorite;
        setFavorite(newFavStatus);
        dispatch(updateFavoriteAsync({ id: recipe._id }));
    };


    return (
        <>
            <div
                key={recipe._id}
                className="recipe-card bg-white shadow-lg rounded-lg overflow-hidden group relative transform transition-transform hover:scale-105 hover:shadow-2xl"
            >
                {/* Options Dropdown */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <Options handleOpenDeleteModal={handleOpenDeleteModal} />
                </div>

                {/* Recipe Image */}
                <img
                    src={recipe.imageUrl || '/path/to/default-image.jpg'}
                    alt="Recipe"
                    className="w-full h-40 object-cover rounded-t-lg transition-transform duration-300 transform group-hover:scale-105"
                />

                {/* Content Section */}
                <div className="p-4 space-y-2">
                    {/* Recipe Title */}
                    <h3 className="font-bold text-xl text-gray-900 leading-snug">{recipe.title}</h3>

                    {/* Favorite Button */}
                    <div className="flex justify-between items-center">
                        <p className="text-gray-600 leading-relaxed">
                            {recipe.description}
                        </p>
                        <button
                            onClick={handleToggleFavorite}
                            className={`focus:outline-none transition-colors duration-300 ${favorite ? 'text-yellow-500' : 'text-gray-400'
                                } hover:text-yellow-600`}
                        >
                            <img
                                src={favorite ? 'https://cdn-icons-png.flaticon.com/128/1828/1828884.png' : 'https://cdn-icons-png.flaticon.com/128/1828/1828970.png'}
                                alt="favorite"
                                className="w-6 h-6"
                            />
                        </button>
                    </div>

                    {/* View Recipe Link */}
                    <div
                        className="text-blue-600 font-semibold hover:underline cursor-pointer transition-colors duration-300"
                        onClick={() => handleRecipeClick(recipe)}
                    >
                        View Recipe
                    </div>
                </div>

            </div>
            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
                    <h1 className="font-bold text-lg mb-2">Delete Recipe</h1>
                    <p>Are you sure you want to delete this recipe?</p>
                    <div className="flex justify-end space-x-4 mt-4">
                        <button
                            className="bg-gray-300 text-black rounded-md px-4 py-2 hover:bg-gray-400 transition-colors"
                            onClick={handleCloseDeleteModal}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-red-600 text-white rounded-md px-4 py-2 hover:bg-red-700 transition-colors"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                </Modal>
            )}
        </>


    )
}