import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import recipeReducer from '../features/recipe/recipeSlice';

export const store = configureStore({
  reducer: {
    userReducer,
    recipeReducer,
  },
});
