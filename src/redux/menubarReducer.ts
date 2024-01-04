import { createSlice } from '@reduxjs/toolkit';

// Define a type for the slice state
export interface MenubarState {
  sidebarIsOpen: boolean;
  bottombarIsOpen: boolean;
}

// Define the initial state using that type
const initialState: MenubarState = {
  sidebarIsOpen: false,
  bottombarIsOpen: false,
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
      state.bottombarIsOpen = false;
    },
    sidebarToggle: (state) => {
      state.sidebarIsOpen = !state.sidebarIsOpen;
      state.bottombarIsOpen = false;
    },
    bottombarClose: (state) => {
      state.bottombarIsOpen = false;
    },
    bottombarOpen: (state) => {
      state.bottombarIsOpen = true;
      state.sidebarIsOpen = false;
    },
    bottombarToggle: (state) => {
      state.bottombarIsOpen = !state.bottombarIsOpen;
      state.sidebarIsOpen = false;
    },
  },
});

export const {
  sideBarClose,
  sideBarOpen,
  sidebarToggle,
  bottombarClose,
  bottombarOpen,
  bottombarToggle,
} = menubarSlice.actions;

export default menubarSlice.reducer;
