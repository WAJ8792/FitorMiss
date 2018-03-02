export const maxOutClass = (db, thisClass, action) => {
  const numReservations = Object.keys(thisClass.reservations[thisClass.date]).length;

  if (thisClass.reservations && action === "hold") {
    if (numReservations + 1 >= thisClass.seats) {
      db.ref('classes/' + thisClass.id + '/max').set(true);
    }
  } else if (thisClass.reservations) {
    db.ref('classes/' + thisClass.id + '/max').set(false);
  }
}

export const confirmReserve = (db, thisClass, seats) => {
  const resId = db.ref("reservations").push().getKey();
  db.ref('reservations/' + resId).set({
    class_id: thisClass.id,
    customer_id: thisClass.user,
    date: thisClass.date,
    time: thisClass.time,
    created_at: new Date().getTime(),
  })
  const ref = db.ref(`classes/${thisClass.id}/reservations/${thisClass.date}/${resId}`)
    .set(true)
}

export const hitReserve = reservation => {
  return $.ajax({
    method: 'POST',
    url: '/reservations',
    data: reservation
  });
};
