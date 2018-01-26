export const retrieveAddress = function(uid, db) {
  let adress = {
    street: "",
    city: "",
    state: "",
    uid: "",
  };

  console.log(uid);
  db.database().ref('address').orderByChild("vendor_id")
    .equalTo(uid).on("value", snap => {
      let info = snap.val();
      adress = {
        user: info.vendor_id,
        street: info.street,
        city: info.city,
        state: info.state,
      }
    });

  return adress;
}
