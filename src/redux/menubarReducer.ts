import { createSlice } from '@reduxjs/toolkit';

// Define a type for the slice state
export interface MenubarState {
  sidebarIsOpen: boolean;
}

// Define the initial state using that type
const initialState: MenubarState = {
  sidebarIsOpen: false,
};

export const menubarSlice = createSlice({
  name: 'menubar',
  initialState,
  reducers: {
    sideBarClose: (state) => {
      state.sidebarIsOpen = false;
    },
    sideBarOpen: (state) => {
      state.sidebarIsOpen = true;
    },
    sidebarToggle: (state) => {
      state.sidebarIsOpen = !state.sidebarIsOpen;
    },
  },
});

export const { sideBarClose, sideBarOpen, sidebarToggle } =
  menubarSlice.actions;

export default menubarSlice.reducer;
