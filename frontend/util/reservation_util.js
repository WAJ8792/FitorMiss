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
  return $.ajax({
    method: 'POST',
    url: '/charges',
    data
  }).done(() => {
      makeReservation();
    }).fail(() => {
      logError("Unable to complete your request");
    })
}

export const confirmReserve = (db, thisClass, user) => {
  const resId = db.ref("reservations").push().getKey();
  db.ref('reservations/' + resId).set({
    class_id: thisClass.id,
    customer_id: thisClass.user,
    date: thisClass.date,
    time: thisClass.time,
    created_at: new Date().getTime(),
  });
  db.ref('classes').orderByKey().equalTo(thisClass.id).once('value', snap => {
    if (snap.val() != null) {
      db.ref(`classes/${thisClass.id}/reservations/${thisClass.date}/${user}`).set(true);
    } else {
      thisClass.classInfo.reservations = {[thisClass.date]: {[user]: true}}
      db.ref('classes/' + thisClass.id).set(thisClass.classInfo);
    }
  })
};

export const hitReserve = reservation => {
  return $.ajax({
    method: 'POST',
    url: '/reservations',
    data: reservation
  });
};
