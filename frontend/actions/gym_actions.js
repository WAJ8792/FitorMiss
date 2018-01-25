export const RECEIVE_GYMS = "RECEIVE_GYMS";

export const receiveGym = (data) => ({
  type: RECEIVE_GYMS,
  data,
});

export function editGym(gym, gymRef) {
  gym_ref.push().set(gymId);
  gym_ref.on("value", function(snap) {
    dispatch(receiveGym(snap));
  });
}
