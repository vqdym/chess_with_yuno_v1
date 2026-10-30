interface IGAME_SCENE {
  position: [number,number,number],
  target: [number, number, number]
}

export const GAME_SCENE: IGAME_SCENE = {
  position: [0,6.7,9.4], 
  target: [0,6.67,9.3],
}

interface ICHESS_MATERIAL {
  roughness: number;
  metalness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  reflectivity: number;
}

export const CHESS_MATERIAL: ICHESS_MATERIAL = {
  roughness: 0.15,
  metalness: 0.2,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
  reflectivity: 0.6,
}

interface ICAMERA_ANGLES {
  minAzimuthAngle: number;
  maxAzimuthAngle: number;
  minPolarAngle: number;
  maxPolarAngle: number;
  minDistance: number;
  maxDistance: number;
}
export const CAMERA_ANGLES: ICAMERA_ANGLES = {
    minAzimuthAngle: -Math.PI/4,
    maxAzimuthAngle: Math.PI/4 ,
    minPolarAngle: Math.PI / 2 - 0.7,
    maxPolarAngle: Math.PI / 2 + 1 ,
    minDistance: 0.1 ,
    maxDistance: 0.1 ,
  };