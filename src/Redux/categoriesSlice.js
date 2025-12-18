import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCategories, getSubcategories } from "../api/categoriesApi";

// Fetch categories along with their subcategories
export const fetchCategories1 = createAsyncThunk(
  "categories/fetchCategories1",
  async (_, { rejectWithValue }) => {
    try {
      const cats = await getCategories(); // [{id, name}, ...]
      const categoriesWithSubs = await Promise.all(
        cats.map(async (cat) => {
          const subs = await getSubcategories(cat.id); // fetch subcategories
          return { ...cat, subcategories: subs || [] };
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
