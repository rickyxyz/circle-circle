import { createSlice } from '@reduxjs/toolkit';

export interface MenubarState {
  sidebarIsOpen: boolean;
  bottombarIsOpen: boolean;
}

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
    bottombarClose: (state) => {
      state.bottombarIsOpen = false;
    },
    bottombarOpen: (state) => {
      state.bottombarIsOpen = true;
      state.sidebarIsOpen = false;
    },
  },
});

export const { sideBarClose, sideBarOpen, bottombarClose, bottombarOpen } =
  menubarSlice.actions;

export default menubarSlice.reducer;
