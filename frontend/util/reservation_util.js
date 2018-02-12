export const holdSeat = (classId, seats, action, db) => {
  seats = parseInt(seats);
  if (action === "hold") {
    seats = seats -= 1;
  } else if (action === "removeHold") {
    seats = seats += 1
  }
  db.database().ref('classes/' + classId + '/seats_available').set(seats.toString());
}
