import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

const itemsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.index > a.index
})

const initialState = itemsAdapter.getInitialState({
    status: 'idle',
    error: null
})

export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
    const response = await axios.get('http://localhost:3001/api/v1/items')
    console.log(response.data)
    return response.data
})

export const addNewItem = createAsyncThunk(
    'items/addNewItem',
    async initialItem => {
        const response = await axios.post('http://localhost:3001/api/v1/items', initialItem)
        console.log(response)
        return response.data
    }
)

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        itemUpdated(state, action) {
            const { id, title } = action.payload
            const existingItem = state.entities[id]
            if (existingItem) {
                existingItem.title = title
            }
        },
    },
    extraReducers: {
        [fetchItems.pending]: (state, action) => {
            state.status = 'loading'
        },
        [fetchItems.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            itemsAdapter.upsertMany(state, action.payload)
        },
        [fetchItems.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        },
        [addNewItem.fulfilled]: itemsAdapter.addOne
    }
});

export const { itemAdded, itemUpdated } = itemsSlice.actions;
export default itemsSlice.reducer;

export const {
    selectAll: selectAllItems,
    selectById: selectItemById,
    selectIds: selectItemIds
} = itemsAdapter.getSelectors(state => state.items)
