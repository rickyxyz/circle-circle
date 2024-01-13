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
    updateCircle: (
      state,
      action: PayloadAction<{ circleId: string; circle: Circle }>
    ) => {
      state.circles[action.payload.circleId] = action.payload.circle;
    },
  },
});

export const { addCircles } = cacheSlice.actions;

export default cacheSlice.reducer;
