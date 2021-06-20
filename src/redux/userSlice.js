import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const APIENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export const loginUserAsync = createAsyncThunk(
	'users/loginUserAsync',
	async (payload) => {
		const resp = await fetch(`${APIENDPOINT}/api/v1/user/auth`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});

		const user = await resp.json();
		return user;
	}
);

export const registerUserAsync = createAsyncThunk(
	'users/registerUserAsync',
	async (payload) => {
		console.log(JSON.stringify(payload));
		const resp = await fetch(`${APIENDPOINT}/api/v1/user`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});
		const user = await resp.json();
		console.log('User res', user);
		return user;
	}
);

export const userSlice = createSlice({
	name: 'users',
	initialState: [],
	reducers: {
		loginUser: (state, action) => {
			const user =
				action.payload;
			state.push(user);
		},
		registerUser: (state, action) => {
			const user =
				action.payload;
			state.push(user);
		},
	},
	extraReducers: {
		[loginUserAsync.fulfilled]: (state, action) => {
			return action.payload;
		},
		[registerUserAsync.fulfilled]: (state, action) => {
			return action.payload;
		},
	},
});

export const { loginUser } = userSlice.actions;

export default userSlice.reducer;
