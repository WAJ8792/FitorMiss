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

// getCurrentUser is not being used but might be a nice way to dry up code
// at a later point when there is time to configure this code to work alongside redux fow.
// export const getCurrentUser = function(db) {
//   app.auth().onAuthStateChanged((user) => {
//     if (user) {
//       console.log(user.uid);
//       this.setState({ user: user.uid, loggedOut: false });
//       return user;
//     } else {
//       this.setState({loggedOut: true})
//       return false;
//     }
//   });
// }
