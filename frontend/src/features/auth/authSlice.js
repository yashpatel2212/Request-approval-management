import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginApi, meApi } from "../../api/authApi";

export const loginThunk = createAsyncThunk("auth/login", async (payload) => {
  const response = await loginApi(payload);
  return response.data.data;
});

export const loadMeThunk = createAsyncThunk("auth/me", async () => {
  const response = await meApi();
  return response.data.data;
});

const initialState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
  loading: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(loadMeThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
