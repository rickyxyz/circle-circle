import { configureStore } from '@reduxjs/toolkit';
import menubarReducer from '@/redux/menubarReducer';

const store = configureStore({
  reducer: {
    menubar: menubarReducer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
