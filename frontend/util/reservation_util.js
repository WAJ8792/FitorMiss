export const holdSeat = (classId, seats, action, db) => {
  seats = parseInt(seats);
  if (action === "hold") {
    seats = seats -= 1;
  }
  db.database().ref('classes/' + classId + '/seats_available').set(seats.toString());
}

export const confirmReserve = (db, thisClass, seats) => {
  const resId = db.ref("reservations").push().getKey()
  db.ref('reservations/' + resId).set({
    class_id: thisClass.id,
    customer_id: thisClass.user,
    date: thisClass.date,
    time: thisClass.time,
    created_at: new Date().getTime(),
  })
  db.ref(`classes/${thisClass.id}/reservations/${thisClass.date}/${resId}`)
    .set(true)

}

export const hitReserve = reservation => {
  return $.ajax({
    method: 'POST',
    url: '/reservations',
    data: reservation
  });
};
