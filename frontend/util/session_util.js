export const createUser = function(user, db) {
  db.database().ref('vendor/' + user.user.uid).set({
    gym_name: "",
    neighborhood: "",
  });
  db.database().ref('amenities').push({
    vendor_id: user.user.uid,
    parking: false,
    showers: false,
    lockers: false,
    towels: false,
    mat_rentals: false,
  })
}
