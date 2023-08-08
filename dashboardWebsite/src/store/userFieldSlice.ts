import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fieldData } from '../requests/requests';
import { IField } from '../Utils/entities';

export const fetchUserFieldData = createAsyncThunk('user/fetchUserFieldData', async (userId: string) => {
    try {
        const response = await fieldData(userId);
        return response;
    } catch (error) {
        throw new Error('Failed to fetch user data.');
    }
});

interface UserFieldState {
    fieldData: IField | null;
    fieldisLoading: boolean;
    fielderror: string | null;
}

const initialState: UserFieldState = {
    fieldData: null,
    fieldisLoading: false,
    fielderror: null,
};

const userFieldSlice = createSlice({
    name: 'userField',
    initialState,
    reducers: {// Action pour mettre à jour une propriété spécifique de data
        updateFieldName(state, action) {
            const { fieldId, fieldName } = action.payload;
            if (state.fieldData && state.fieldData.existingField) {
              const existingFieldIndex = state.fieldData.existingField.findIndex(
                (field) => field._id === fieldId
              );
          
              if (existingFieldIndex !== -1) {
                console.log("INSIDE EXISTINGFIELDINDEX")
                // Créez une copie du champ existant
                const updatedField = { ...state.fieldData.existingField[existingFieldIndex] };
          
                // Mettez à jour la propriété fieldName avec la nouvelle valeur
                updatedField.fieldName = fieldName;
          
                // Mettez à jour le champ dans le tableau existingField en utilisant l'index
                state.fieldData.existingField[existingFieldIndex] = updatedField;
              }
            }
          },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserFieldData.pending, (state) => {
                state.fieldisLoading = true;
                state.fielderror = null;
            })
            .addCase(fetchUserFieldData.fulfilled, (state, action) => {
                state.fieldisLoading = false;
                state.fieldData = action.payload;
                state.fielderror = null;
            })
            .addCase(fetchUserFieldData.rejected, (state) => {
                state.fieldisLoading = false;
                state.fielderror = 'Failed to fetch user data.';
            });
    },
});

// export const {} = userFieldSlice.actions;
export const userFieldReducer = userFieldSlice.reducer;
export const { updateFieldName } = userFieldSlice.actions;
export default userFieldSlice.reducer;