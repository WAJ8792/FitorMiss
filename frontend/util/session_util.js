export const createVendor = function(user, db, userInfo) {
  db.database().ref('vendor/' + user.user.uid).set({
    gym_name: userInfo.gymName,
    neighborhood: userInfo.neighborhood,
    email: user.user.email,
  });
  db.database().ref('amenities').push({
    vendor_id: user.user.uid,
    parking: false,
    showers: false,
    lockers: false,
    towels: false,
    mat_rentals: false,
  });
  db.database().ref('address').push({
    city: "",
    state: "",
    street: "",
    vendor_id: user.user.uid,
  });
  db.database().ref('pricing_schemas').push({
    tier1: "10%",
    tier2: "20%",
    tier3: "30%",
    vendor_id: user.user.uid,
  });
  db.database().ref('user_type/' + user.user.uid).set("vendor");
}

export const createCustomer = function(user, db, userInfo) {
  db.database().ref('customers/' + user.user.uid).set({
    first_name: userInfo.firstName,
    last_name: userInfo.lastName,
    email: userInfo.email,
  });
  db.database().ref('user_type/' + user.user.uid).set("customer");
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
