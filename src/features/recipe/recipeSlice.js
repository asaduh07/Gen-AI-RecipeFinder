import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from "react-toastify";

const SERVER_DOMAIN = process.env.REACT_APP_SERVER_DOMAIN;

export const generateRecipesAsync = createAsyncThunk(
    'recipes/fetchByIngredients',
    async (ingredients, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('jwt'));
            const response = await axios.post(`${SERVER_DOMAIN}/api/recipe/generate`, { ingredients },
                {
                    headers: {
                        Authorization: `${token}`
                    }
                }
            );
            const{instructions}=response.data.res[0];
            if (!instructions || instructions === "Instructions not found in generated text.") {
                return rejectWithValue("Recipe cannot be generated, please enter valid ingredients.");
            }
            return response.data.res;
        } catch (error) {
            return rejectWithValue(error.response.data.res);
        }
    }
);

// Async thunk for posting selected recipes
export const postRecipesAsync = createAsyncThunk(
    'recipes/post',
    async (selectedRecipes, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('jwt'));
            const response = await axios.post(`${SERVER_DOMAIN}/api/recipe/save`, { selectedRecipes },
                {
                    headers: {
                        Authorization: `${token}`
                    }
                }
            );
            toast.success("Recipes saved successfully!");
            return response.data.res;
        } catch (error) {
            toast.error("Failed to save recipes.");
            return rejectWithValue(error.response.data.res);
        }
    }
);

// Async thunk for fetching all recipes from the database
export const fetchAllRecipesAsync = createAsyncThunk(
    'recipes/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('jwt'));
            const response = await axios.get(`${SERVER_DOMAIN}/api/recipe/`,

                {
                    headers: {
                        Authorization: `${token}`
                    }
                }

            );

            return response.data.res;
        } catch (error) {
            return rejectWithValue(error.response.data.res);
        }
    }
);

export const fetchRecipeById = createAsyncThunk('recipe/fetch', async (payload, { rejectWithValue }) => {
    try {
        const token = JSON.parse(localStorage.getItem('jwt'));
        const { recipeId } = payload;
        const response = await axios.get(`${SERVER_DOMAIN}/api/recipe/${recipeId}`,

            {
                headers: {
                    Authorization: `${token}`
                }
            }

        );

        return response.data.res;


    } catch (error) {
        return rejectWithValue(error.response.data.res);
    }
})

export const searchRecipes = createAsyncThunk(
    'recipes/searchRecipes',
    async ({ title }) => {
        const token = JSON.parse(localStorage.getItem('jwt'));
        const response = await axios.get(`${SERVER_DOMAIN}/api/recipe/search`, {
            params: {
                title,
            },
            headers: {
                Authorization: `${token}`
            }
        }
        );
        return response.data.res;
    }
);

export const deleteRecipe = createAsyncThunk('recipe/delete', async (payload, { rejectWithValue }) => {
    try {
        const { recipeId } = payload;
        const token = JSON.parse(localStorage.getItem('jwt'));
        const response = await axios.delete(`${SERVER_DOMAIN}/api/recipe/${recipeId}`, {

            headers: {
                Authorization: `${token}`
            }
        })
        if (response.data.success) {
            toast.success("Recipe deleted successfully");
            return recipeId;
        }

    } catch (error) {
        toast.error("Something went wrong,try again later");
        return rejectWithValue(error.message);
    }
})

export const updateFavoriteAsync = createAsyncThunk(
    'recipe/updateFavorite',
    async ({ id }, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('jwt'));
            const response = await axios.put(`${SERVER_DOMAIN}/api/recipe/toggleFav/${id}`, {}, {
                headers: {
                    Authorization: `${token}`
                }
            })

            
            return response.data.res;

        } catch (error) {
            toast.error("Something went wrong,try again later");
            return rejectWithValue(error.message);
        }
    }
);

export const getfavouriteRecipes = createAsyncThunk('recipe/getRecipe', async (_, { rejectWithValue }) => {

    try {
        const token = JSON.parse(localStorage.getItem('jwt'));
        const response = await axios.get(`${SERVER_DOMAIN}/api/recipe/favourites/`, {
            headers: {
                Authorization: `${token}`
            }
        })
        return response.data.res;

    } catch (error) {
        return rejectWithValue(error.message);
    }
})

const recipeSlice = createSlice({
    name: 'recipe',
    initialState: {
        recipes: [],
        searchResults: [],
        generatedRecipes: [],
        favouriteRecipes: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearSearchResults: (state) => {
            state.searchResults = []; // Clear the search results
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(generateRecipesAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateRecipesAsync.fulfilled, (state, action) => {
                state.generatedRecipes = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(generateRecipesAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle post recipes async thunk
            .addCase(postRecipesAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postRecipesAsync.fulfilled, (state, action) => {
                state.recipes = [...state.recipes, ...action.payload];
                state.generatedRecipes = [];
                state.loading = false;
                state.error = null;
            })
            .addCase(postRecipesAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle fetch all recipes async thunk
            .addCase(fetchAllRecipesAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllRecipesAsync.fulfilled, (state, action) => {
                state.recipes = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchAllRecipesAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(searchRecipes.pending, (state) => {
                state.loading = true;
            })
            .addCase(searchRecipes.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults = action.payload; // Set search results
            })
            .addCase(searchRecipes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            //Handle recipe delete
            .addCase(deleteRecipe.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(deleteRecipe.fulfilled, (state, action) => {
                state.loading = false;
                const recipeId = action.payload;
                state.recipes = state.recipes.filter(recipe => recipe._id !== recipeId);
            })
            .addCase(deleteRecipe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateFavoriteAsync.fulfilled, (state, action) => {
                const recipeToUpdate = state.recipes.find(recipe => recipe._id === action.payload._id);
                if (recipeToUpdate) {
                    recipeToUpdate.fav = action.payload.fav;
                }
            })
            .addCase(updateFavoriteAsync.rejected, (state, action) => {

                state.error = action.payload;
            })
            .addCase(updateFavoriteAsync.pending, (state) => {

                state.error = null;
            })
            .addCase(getfavouriteRecipes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getfavouriteRecipes.fulfilled, (state, action) => {
                state.favouriteRecipes = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getfavouriteRecipes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
});

const recipeReducer = recipeSlice.reducer;
export const recipeActions = recipeSlice.actions;
export default recipeReducer;
export const recipeSelector = (state) => state.recipeReducer;
