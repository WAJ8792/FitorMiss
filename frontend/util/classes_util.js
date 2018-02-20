function indexOfDay(day) {
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

function indexOfTomorrow(idx) {
  if (idx + 1 === 7) { return 0; }
  else { return idx + 1; }
}

function in24Hours(classTime) {
  let now = new Date().getHours();
  if (parseInt(classTime.slice(0, 2)) > now) { return false; }
  else { return true; }
}

function beforeCurrentHours(classTime) {
  let now = new Date().getHours();
  if (parseInt(classTime.slice(0, 2)) < now) { return false; }
  else { return true; }
}

export const getClassesByDay = classes => {
  let today = [];
  let tomorrow = [];
  let todaysIndex = new Date().getDay();
  let tomorrowsIndex = indexOfTomorrow(todaysIndex);
  Object.keys(classes).forEach(id => {
    let thisClass = classes[id];
    switch (indexOfDay(thisClass.day)) {
      case todaysIndex:
        if (beforeCurrentHours(thisClass.time)) {
          thisClass.date = getReservationDate(0);
          thisClass.id = id;
          today = orderByTime(today, thisClass);
        }
        break;
      case tomorrowsIndex:
        if (in24Hours(thisClass.time)) {
          thisClass.date = getReservationDate(1);
          thisClass.id = id;
          tomorrow = orderByTime(tomorrow, thisClass);
        }
        break;
      default:
        break;
    }
  })
  return today.concat(tomorrow);
}

function orderByTime(list, thisClass) {
  if (list.length < 1) {
    list.push(thisClass);
    return list;
  } else if (list.length === 1 ) {
      thisClass.time > list[0].time ? list.push(thisClass) : list.unshift(thisClass);
      return list;
  }

  let mid = parseInt(list.length / 2);
  let left = list.slice(0, mid);
  let right = list.slice(mid, list.length);

  if (thisClass.time >= left[left.length-1].time) {
    if (right.length < 1 || thisClass.time <= right[0].time) {
      left.push(thisClass);
    } else {
      right = orderByTime(right, thisClass);
    }
  } else {
    left = orderByTime(left, thisClass);
  }

  return left.concat(right);
}

export const orderClassesByDate = (classes) => {
  let list = []
  Object.keys(classes).forEach(id => {
    let thisClass = classes[id];
    let front = [];
    const length = list.length;
    classes[id].id = id;
    for (let i = 0; i <= length; i++) {
      if (i === length)
      {
        list.push(classes[id]);
        list = front.concat(list.slice(i, length+1));
        break;
      }
      else if (list[i].time < thisClass.time)
      {
        front.push(list[i]);
      }
      else
      {
        front.push(classes[id]);
        list = front.concat(list.slice(i, length+1));
        break;
      }
    }
  });
  return list;
}

export const getTime = (time) => {
  let hour = parseInt(time.slice(0, 2))
  if (hour > 12 ) {
    hour -= 12
    let min = time.slice(2, 5);
    time = hour.toString() + min;
    time += " PM";
  } else { time += " AM"}

  let firstDigit = time.slice(0, 1);
  if (firstDigit === '0') {
    time = time.slice(1, 8);
  }
  return time;
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
