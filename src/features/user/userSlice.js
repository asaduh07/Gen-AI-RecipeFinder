import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from "react-toastify";

// Load the environment variable
const SERVER_DOMAIN = process.env.REACT_APP_SERVER_DOMAIN;

//Initial global user state
const INITIAL_STATE = {
    user: null,
    token: null,
    loggedIn: false,
    loading: false,
    error: null
}

// Async thunk for user signup
export const userSignupAsync = createAsyncThunk(
    'user/signup',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${SERVER_DOMAIN}/api/user/signup`, userData);
            toast.success("Signup Successful");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk for user signin
export const userSigninAsync = createAsyncThunk(
    'user/signin',
    async (credentials, { rejectWithValue }) => {
        try {

            const response = await axios.post(`${SERVER_DOMAIN}/api/user/signin`, credentials);
            toast.success("Signin Successful");
            const { token } = response.data;
            localStorage.setItem('jwt', JSON.stringify(token));
            // Fetch user details after signing in
            const userData = await axios.get(`${SERVER_DOMAIN}/api/user/me`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            return { token, userData: userData.data.res };
        } catch (error) {
            if (!error.response.data.success) {
                toast.error(error.response.data.res);
            } else {
                toast.error("Something went wrong, try again later");
            }
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for fetching user details (on app load)
export const fetchUserDetailsAsync = createAsyncThunk(
    'user/fetchDetails',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().userReducer.token; // Fetch token from state
            const response = await axios.get(`${SERVER_DOMAIN}/api/user/me`, {
                headers: { Authorization: `${token}` },
            });
            
            return response.data.res;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateUserDetailAsync = createAsyncThunk('user/update', async (payload, {getState, rejectWithValue }) => {
    try {
        const token = getState().userReducer.token;
        const { name, email, file } = payload;
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        if (file) {
            formData.append('imageUrl', file);
        }
        const response = await axios.put(`${SERVER_DOMAIN}/api/user/`, formData,
            {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;

    } catch (error) {
        toast.error("Something went wrong,try again later");
        return rejectWithValue(error.message);
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState: INITIAL_STATE,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.loggedIn = true;
        },
        signOut: (state) => {
            state.user = null;
            state.token = null;
            state.loggedIn = false;
            state.loading = false;
            state.error = null;
            localStorage.removeItem('jwt');

        },
        initializeUser: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.userData;
            state.loggedIn = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(userSignupAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userSignupAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(userSignupAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle Sign-In
            .addCase(userSigninAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userSigninAsync.fulfilled, (state, action) => {
                state.user = action.payload.userData;
                state.loggedIn = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(userSigninAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUserDetailAsync.pending,(state,action)=>{
                state.loading=true;
                state.error=null;
                
            })
            .addCase(updateUserDetailAsync.fulfilled,(state,action)=>{
                state.user.name=action.payload.name;
                state.user.email=action.payload.email;
                state.user.imageUrl=action.payload.imageUrl;
                state.loading=false;

            })
            .addCase(updateUserDetailAsync.rejected,(state,action)=>{
                state.error=action.payload;
                state.loading=true;

            })
    }
});

const userReducer = userSlice.reducer;
export const userActions = userSlice.actions;
export const userSelector = (state) => state.userReducer;
export default userReducer;