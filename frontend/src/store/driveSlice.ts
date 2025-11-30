import { createSlice } from "@reduxjs/toolkit";

const driveSlice = createSlice({
  name: "drive",
  initialState: {
    currentFolderId: null,
    folderStack: [],
    viewMode: "grid",
  },
  reducers: {
    setCurrentFolder: (state, action) => {
      const { folderId, folderName } = action.payload;

      if (folderId === null) {
        state.folderStack = [];
      } else {
        state.folderStack.push({ _id: folderId, name: folderName });
      }

      state.currentFolderId = folderId;
    },

    goBackFolder: (state, action) => {
      const index = action.payload;
      state.folderStack = state.folderStack.slice(0, index + 1);

      state.currentFolderId = state.folderStack.length
        ? state.folderStack[state.folderStack.length - 1]._id
        : null;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
  },
});

export const { setCurrentFolder, goBackFolder,setViewMode } = driveSlice.actions;
export default driveSlice.reducer;
