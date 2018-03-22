export const createVendor = function(user, db, userInfo) {
  debugger;
  const amenities = userInfo.amenities;
  amenities.vendor_id = user.uid;

  const pricing_schema = userInfo.pricing_schema;
  pricing_schema.vendor_id = user.uid;

  const address = userInfo.address;
  address.vendor_id = user.uid;

  db.database().ref('vendor/' + user.uid).set({
    gym_name: userInfo.gym_name,
    neighborhood: userInfo.neighborhood,
    phone: userInfo.phone,
    email: userInfo.email,
  });
  db.database().ref('amenities').push(amenities);
  db.database().ref('pricing_schemas').push(pricing_schema);
  db.database().ref('user_type/' + user.uid).set("vendor");
  db.database().ref('address').push(address);
}

export const createCustomer = function(user, db, userInfo) {
  db.database().ref('customers/' + user.user.uid).set({
    first_name: userInfo.firstName,
    last_name: userInfo.lastName,
    email: userInfo.email,
    created_at: new Date(),
    neighborhood_id: "1",
  });
  db.database().ref('user_type/' + user.user.uid).set("customer");

  hitCreate(userInfo);
}

const hitCreate = (user) => {
  return $.ajax({
    method: 'POST',
    url: '/users',
    data: user
  });
};

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
