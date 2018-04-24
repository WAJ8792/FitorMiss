export const maxOutClass = (db, thisClass, action) => {

  if (thisClass.reservations &&
      thisClass.reservations[thisClass.date] &&
      !thisClass.id.includes('mindbody') &&
      action === "hold") {
      const numReservations = Object.keys(thisClass.reservations[thisClass.date]).length;
      if (numReservations + 1 >= thisClass.seats) {
      db.ref('classes/' + thisClass.id + '/max').set(true);
    }
  } else if (thisClass.reservations) {
    db.ref('classes/' + thisClass.id + '/max').set(false);
  }
};

export const confirmPayment = (data, logCompletion) => {
  return $.ajax({
    method: 'POST',
    url: '/charges',
    data
  }).done(() => {
      logCompletion("Thank you for siging up! Check your email and show it at the door!")
    }).fail(() => {
      logCompletion("Unable to complete your request");
    })
}

const createReservation = (db, {user, userInfo, thisClass, discount}, succesCB) => {
  const resId = db.ref("reservations").push().getKey();
  db.ref('reservations/' + resId).set({
    class_id: thisClass.id,
    customer_id: user,
    date: thisClass.date,
    time: thisClass.time,
    discount_id: discount,
    created_at: new Date().getTime(),
  });
  db.ref('classes').orderByKey().equalTo(thisClass.id).once('value', snap => {
    if (snap.val() != null) {
      db.ref(`classes/${thisClass.id}/reservations/${thisClass.date}/${user}`).set(true);
      succesCB();
    } else {
      thisClass.classInfo.reservations = {[thisClass.date]: {[user]: true}}
      db.ref('classes/' + thisClass.id).set(thisClass.classInfo);
      succesCB();
    }
  });
}

export const confirmReserve = (db, resInfo, successCB) => {
  if (resInfo.thisClass.id.includes("mindbody")) {
    checkoutMindbody(resInfo, () => {
      createReservation(db, resInfo, successCB);
    })
  } else {
    createReservation(db, resInfo, successCB);
  }
};

const checkoutMindbody = ({thisClass, userInfo}, successCB) => {
  const classId = thisClass.id.slice(9, thisClass.id.length);
  const data = {
    siteID: thisClass.site_id,
    locationID: thisClass.location_id,
    serviceID: thisClass.serviceId,
    userInfo
  }
  currentMindbodyCustomer(data, (clientId) => {
    if (clientId) {
      addCustomerToClass({classId, clientId, data}, successCB)
    } else {
      createMindbodyCustomer(data, (newClientId) => {
        addCustomerToClass({classId, newClientId, data}, successCB);
      })
    }
  })
}

const currentMindbodyCustomer = (data, successCB) => {
  return $.ajax({
    method: 'GET',
    url: '/mindbody_customers',
    data
  }).done( response => {
    successCB(response);
  }).fail( error => {
    return false;
  })
}

export const createMindbodyCustomer = (data, registerOnSuccess) => {
  return $.ajax({
    method: 'POST',
    url: '/mindbody_customers',
    data
  }).done( response => {
    registerOnSuccess(response);
  }).fail( error => {
    console.log(error);
  })
}

export const addCustomerToClass = (data, successCB) => {
  return $.ajax({
    method: 'POST',
    url: '/schedules',
    data
  }).done( response => {
    successCB();
  });
}

export const hitReserve = reservation => {
  return $.ajax({
    method: 'POST',
    url: '/reservations',
    data: reservation
  });
};
