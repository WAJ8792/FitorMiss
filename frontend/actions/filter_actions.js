export const TOGGLE_TYPE = "TOGGLE_TYPE";
export const TOGGLE_AMENITY = "TOGGLE_AMENITY";

export const toggleType = (data) => ({
  type: TOGGLE_TYPE,
  data
})

export const toggleAmenities = (data) => ({
  type: TOGGLE_AMENITY,
  data
})
