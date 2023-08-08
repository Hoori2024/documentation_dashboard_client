import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userData } from '../requests/requests';
import { IuserData } from '../Utils/entities';

export const fetchUserData = createAsyncThunk('user/fetchUserData', async (userId: string) => {
    try {
        const response = await userData(userId);
        return response;
    } catch (error) {
        throw new Error('Failed to fetch user data.');
    }
});


interface UserState {
    data: IuserData | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    data: null,
    isLoading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {// Action pour mettre à jour une propriété spécifique de data
        updateUserFN: (state, action) => {
            const { firstName } = action.payload;
            if (state.data) {
                state.data.existingUser.firstName = firstName;
            }
        },
        updateUserLN: (state, action) => {
            const { lastName } = action.payload;
            if (state.data) {
                state.data.existingUser.lastName = lastName;
            }
        },
        updateUserTel: (state, action) => {
            const { phoneNumber } = action.payload;
            if (state.data) {
                state.data.existingUser.phoneNumber = phoneNumber;
            }
        },
        updateUserEmail: (state, action) => {
            const { email } = action.payload;
            if (state.data) {
                state.data.existingUser.email = email;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchUserData.rejected, (state) => {
                state.isLoading = false;
                state.error = 'Failed to fetch user data.';
            });
    },
});

export const { updateUserFN, updateUserLN, updateUserTel, updateUserEmail } = userSlice.actions;
export default userSlice.reducer;