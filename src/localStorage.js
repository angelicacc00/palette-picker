
const setLocalStorageKey = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
const getLocalStorageKey = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.error(error);
    return null;
  }
}
export const removeDefaultPalettesLS = () => {
  localStorage.removeItem('defaultPalette-0');
  localStorage.removeItem('defaultPalette-1');
  localStorage.removeItem('defaultPalette-2');
}

export const setPalette = (paletteName, palette) => {
  setLocalStorageKey(paletteName, palette)
}


export const getPalettes = () => {
  return {...localStorage}
}


