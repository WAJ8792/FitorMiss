export const indexOfDay = day => {
  switch (day) {
    case "Sunday":
      return 0
    case "Monday":
      return 1
    case "Tuesday":
      return 2
    case "Wednesday":
      return 3
    case "Thursday":
      return 4
    case "Friday":
      return 5
    case "Saturday":
      return 6
    default:
      console.log("Not a day");
  }
}

export const isThisMonth = date => {
  const classDate = new Date(date);

  if (classDate.getMonth() === new Date().getMonth()
    && classDate.getYear() === new Date().getYear()) {
    return true;
  } else {
    return false;
   }
}

export const indexOfTomorrow = idx => {
  if (idx + 1 === 7) { return 0; }
  else { return idx + 1; }
}

export const in24Hours = classTime => {
  let now = new Date().getHours();
  if (parseInt(classTime.slice(0, 2)) > now) { return false; }
  else { return true; }
}

export const afterCurrentHours = classTime => {
  let now = new Date().getHours();
  if (parseInt(classTime.slice(0, 2) - 1) < now) { return false; }
  else { return true; }
}

export const getTimeRange = (classTime, duration) => {
  const startHour = parseInt(classTime.slice(0, 2));
  const startMin = parseInt(classTime.slice(3, 5));

  const ampm = ((startHour + duration.hours) > 12) ? ' PM' : ' AM'
  const start = formatTime([startHour, startMin]);
  const finish = endsAt(startHour, startMin, duration);

  return start + " - " + finish + ampm;
}

function endsAt(startHour, startMin, duration) {
  let endHour = startHour + duration.hours;
  let endMin = startMin + duration.min;

  if (endHour > 24) { endHour -= 24; }
  if (endMin > 60) {
    endHour += 1;
    endMin -= 60;
   }

  return formatTime([endHour, endMin]);
}

export const formatTime = time => {
  let hours = time[0];
  let min = time[1];

  if (hours > 12) {
    hours -= 12;
  }

  if (min < 1) {
    min = "00"
  } else if (min < 10) {
    min = "0" + min.toString();
  }

  return hours.toString() + ":" + min.toString();
}

export const getTime = (time) => {
  let hour = parseInt(time.slice(0, 2))
  if (hour > 12 ) {
    hour -= 12
    let min = time.slice(2, 5);
    time = hour.toString() + min;
    time += " PM";
  } else { time += " AM" }

  let firstDigit = time.slice(0, 1);
  if (firstDigit === '0') {
    time = time.slice(1, 8);
  }
  return time;
}

export const getTimes = () => {
  let times = [];
  for (let i = 0; i < 24; i++) {
    let time;
    if (i === 0) {
      time = "12:";
    } else if (i < 10) {
      time = '0' + i.toString() + ':';
    } else {
      time = i.toString() + ':';
    }
    for (let j = 0; j < 4; j++) {
      if (j === 0) {
        times.push(<option
          key={time+j+i}
          value={time + '00'}
          >{ getTime(time + '00')}</option>);
      } else {
        let min = j * 15;
        times.push(<option
          key={time+j+i}
          value={time + min.toString()}
          >{ getTime(time + min.toString())}</option>);
      }
    }
  }
  return times;
}

export const getHoursOut = (time) => {
  let hoursOut = parseInt(time.slice(0, 2)) - new Date().getHours();
  switch (hoursOut) {
    case 0:
      return 0;
    case 1:
      return 1;
    case 2:
      return 2;
    default:
      return 3;
  }
}

export const getReservationDate = (daysAway) => {
  let classDate = new Date();
  classDate.setDate(classDate.getDate() + daysAway);
  return classDate.toString().slice(4, 15);
}
