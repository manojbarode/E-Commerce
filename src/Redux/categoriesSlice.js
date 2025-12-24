import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCategories, getSubcategories } from "../api/categoriesApi";

export const fetchCategories1 = createAsyncThunk(
  "categories/fetchCategories1",
  async (_, { rejectWithValue }) => {
    try {
      const cats = await getCategories(); // [{id, name}]
      // Only fetch subcategories if needed
      const categoriesWithSubs = await Promise.all(
        cats.map(async (cat) => {
          try {
            const subs = await getSubcategories(cat.id);
            return { ...cat, subcategories: subs || [] };
          } catch (err) {
            // console.error(`Failed to fetch subcategories for ${cat.id}:`, err);
            return { ...cat, subcategories: [] };
          }
        })
      );
      return categoriesWithSubs;
    } catch (err) {
      return rejectWithValue("Failed to fetch categories");
    }
  }
);


const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    data: [], // [{name, id, subcategories: []}]
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories1.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories1.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchCategories1.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default categoriesSlice.reducer;
