export const maxOutClass = (db, thisClass, action) => {

  if (thisClass.reservations && !thisClass.id.includes('mindbody') && action === "hold") {
      const numReservations = Object.keys(thisClass.reservations[thisClass.date]).length;
      if (numReservations + 1 >= thisClass.seats) {
      db.ref('classes/' + thisClass.id + '/max').set(true);
    }
  } else if (thisClass.reservations) {
    db.ref('classes/' + thisClass.id + '/max').set(false);
  }
};

export const confirmPayment = (data, makeReservation, logError) => {
  makeReservation();
  // return $.ajax({
  //   method: 'POST',
  //   url: '/charges',
  //   data
  // }).done(() => {
  //     makeReservation();
  //   }).fail(() => {
  //     logError("Unable to complete your request");
  //   })
}

export const confirmReserve = (db, thisClass, userInfo) => {
  const user = thisClass.user;
  // const resId = db.ref("reservations").push().getKey();
  // db.ref('reservations/' + resId).set({
  //   class_id: thisClass.id,
  //   customer_id: user,
  //   date: thisClass.date,
  //   time: thisClass.time,
  //   created_at: new Date().getTime(),
  // });
  // db.ref('classes').orderByKey().equalTo(thisClass.id).once('value', snap => {
  //   if (snap.val() != null) {
  //     db.ref(`classes/${thisClass.id}/reservations/${thisClass.date}/${user}`).set(true);
  //   } else {
  //     thisClass.classInfo.reservations = {[thisClass.date]: {[user]: true}}
  //     db.ref('classes/' + thisClass.id).set(thisClass.classInfo);
  //   }
  // });
  if (thisClass.id.includes("mindbody")) {
    console.log(thisClass.classInfo);
    const classId = thisClass.id.slice(9, thisClass.id.length);
    const data = {
      siteID: thisClass.site_id,
      locationID: thisClass.location_id,
      userInfo
    }
    currentMindbodyCustomer(data, (clientId) => {
      if (clientId) {
        console.log("Found client id:", clientId);
        // addCustomerToClass({classId, clientId})
      } else {
        // createMindbodyCustomer(data, (newClientId) => {
          // addCustomerToClass({classId, newClientId});
        // })
      }
    })
  }
};

const currentMindbodyCustomer = (data, successCB) => {
  return $.ajax({
    method: 'GET',
    url: '/mindbody_customers',
    data
  }).done( response => {
    console.log("success");
    successCB(response);
  }).fail( error => {
    console.log("failed", error);
    return false;
  })
}

export const createMindbodyCustomer = (data, registerOnSuccess) => {
  return $.ajax({
    method: 'POST',
    url: '/mindbody_customers',
    data
  }).done( response => {
    console.log(response);
    // registerOnSuccess(response.toString());
  })
}

export const addCustomerToClass = data => {
  console.log(4, "About to checkout with:", data);
  return $.ajax({
    method: 'POST',
    url: '/schedules',
    data
  });
}

export const hitReserve = reservation => {
  return $.ajax({
    method: 'POST',
    url: '/reservations',
    data: reservation
  });
};
