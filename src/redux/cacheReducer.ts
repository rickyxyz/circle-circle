import { Circle, User } from '@/types/db';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface CacheState {
  circles: Record<string, Circle>;
  users: Record<string, User>;
}

const initialState: CacheState = {
  circles: {},
  users: {},
};

export const cacheSlice = createSlice({
  name: 'cache',
  initialState,
  reducers: {
    addCircles: (state, action: PayloadAction<Circle[]>) => {
      const newCircles: Record<string, Circle> = {};
      action.payload.forEach((circle) => {
        newCircles[circle.name] = circle;
      });
      state.circles = { ...state.circles, ...newCircles };
    },
    addUsers: (state, action: PayloadAction<User[]>) => {
      const newUsers: Record<string, User> = {};
      action.payload.forEach((user) => {
        newUsers[user.uid] = user;
      });
      state.users = { ...state.users, ...newUsers };
    },
  },
});

export const { addCircles, addUsers } = cacheSlice.actions;

export default cacheSlice.reducer;
