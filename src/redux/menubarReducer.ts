import { createSlice } from '@reduxjs/toolkit';

export interface MenubarState {
  sidebarIsOpen: boolean;
  bottombarIsOpen: boolean;
  hasMounted: boolean; // for animation state
}

const initialState: MenubarState = {
  sidebarIsOpen: false,
  bottombarIsOpen: false,
  hasMounted: false,
};

export const menubarSlice = createSlice({
  name: 'menubar',
  initialState,
  reducers: {
    sideBarClose: (state) => {
      state.sidebarIsOpen = false;
      state.hasMounted = false;
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
      state.hasMounted = false;
    },
    bottombarOpen: (state) => {
      state.bottombarIsOpen = true;
      state.sidebarIsOpen = false;
    },
    unMountMenubarAnimation: (state) => {
      state.hasMounted = false;
    },
  },
});

export const {
  sideBarClose,
  sideBarOpen,
  bottombarClose,
  bottombarOpen,
  sidebarToggle,
  unMountMenubarAnimation,
} = menubarSlice.actions;

export default menubarSlice.reducer;
