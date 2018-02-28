export const holdSeat = (classId, action, db) => {
  if (action === "hold") {
    seats = seats -= 1;
  }
  db.database().ref('classes/' + classId + '/reservations/')
  .set(seats.toString());
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
