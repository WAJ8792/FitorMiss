import {
  indexOfDay,
  indexOfTomorrow,
  in24Hours,
  getTime,
  getReservationDate,
  afterCurrentHours,
} from './time_and_date_util';

export const getClassesByDay = classes => {
  let today = [];
  let tomorrow = [];
  let todaysIndex = new Date().getDay();
  let tomorrowsIndex = indexOfTomorrow(todaysIndex);
  Object.keys(classes).forEach(id => {
    let thisClass = classes[id];
    if (thisClass.max) { return; }
    switch (indexOfDay(thisClass.day)) {
      case todaysIndex:
        if (afterCurrentHours(thisClass.time)) {
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

export const orderClassesByDate = (reservations) => {
  let upcomingList = [];
  let pastList = [];
  Object.keys(reservations).forEach(id => {
    const thisClass = reservations[id];
    if (isUpcoming(thisClass)) {
      upcomingList = setClassByTime(upcomingList, thisClass);
    } else if (!thisClass.canceled){
      pastList = setClassByTime(pastList, thisClass);
    }
  });
  return {upcomingList, pastList};
}

function setClassByTime(list, thisClass) {
  const length = list.length;
  let front = [];
  for (let i = 0; i <= length; i++) {
    if (i === length)
    {
      list.push(thisClass);
      return list;
    }
    else if (list[i].time > thisClass.time)
    {
      front = list.slice(0, i);
      front.push(thisClass);
      front.concat(list.slice(i, list.length + 1));
      return front;
    }
  }
}

function isUpcoming(reservation) {
  if (reservation.canceled) { return false; }
  const now = Math.round(new Date().getTime() / 1000);
  const next24Hours = Math.round(new Date().getTime() / 1000) + (24 * 3600);
  const classTimestamp = Date.parse(
    reservation.date + " " + reservation.time + " EST"
  ) / 1000;

  if (classTimestamp > now && classTimestamp < next24Hours) {
    return true;
  } else { return false; }
}

export const filterClasses = (classes, filters) => {
  if (classes.length > 0) {
    classes = filterByType(classes, filters.workoutType);
  }
  if (classes.length > 0) {
    classes = filterByAmenities(classes, filters.amenities);
  }
  return classes;
}

function filterByAmenities(classes, amenities) {
  let filterList = [];
  let filteredClasses = [];
  Object.keys(amenities).forEach( amenity => {
    if (amenities[amenity] === true) { filterList.push(amenity)}
  });
  if (filterList.length < 1) { return classes }
  else {
    classes.forEach( thisClass => {
      let amenities = thisClass.props.thisClass.amenities;
      for (let i = 0; i < filterList.length; i++) {
        let amenity = filterList[i];
        if (amenities[amenity]) {
          filteredClasses.push(thisClass);
          break;
        }
      }
    });
  }
  return filteredClasses;
}

function filterByType(classes, types) {
  let filterList = [];
  let filteredClasses = [];
  Object.keys(types).forEach( type => {
    if (types[type] === true) { filterList.push(type)}
  });
  if (filterList.length < 1) { return classes }
  else {
    classes.forEach( thisClass => {
      let workoutType = thisClass.props.thisClass.type;
      if (workoutType != undefined && filterList.includes(workoutType)) {
        filteredClasses.push(thisClass);
      }
    })
  }
  return filteredClasses;
}
