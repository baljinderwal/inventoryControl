export const sizePresets = {
  adult: ['6', '7', '8', '9'],
  boy: ['4', '5'],
  toddler: ['8', '9', '10', '11', '12', '1', '2', '3'],
};

export const getSizePreset = (preset) => {
  return sizePresets[preset] || [];
};
