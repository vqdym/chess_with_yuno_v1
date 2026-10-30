import { CHESS_MATERIAL } from "@/app/globals/globals";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface IMaterial {
  roughness: number;
  metalness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  reflectivity: number;
}

const initialState: IMaterial = {
  roughness: CHESS_MATERIAL.roughness,
  metalness: CHESS_MATERIAL.metalness,
  clearcoat: CHESS_MATERIAL.clearcoat,
  clearcoatRoughness: CHESS_MATERIAL.clearcoatRoughness,
  reflectivity: CHESS_MATERIAL.reflectivity,
}

export const chessSlice = createSlice({
  name: 'chess',
  initialState,
  reducers: {
  changeMaterial: (state, action: PayloadAction<IMaterial>) => {
    Object.assign(state, action.payload);
  }
}
});

export const {changeMaterial} = chessSlice.actions;
export default chessSlice.reducer;