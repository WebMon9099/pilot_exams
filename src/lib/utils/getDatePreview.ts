function getDatePreview(time: number) {
  const date = new Date(time);

  const weekday = weekdays[date.getDay()];
  const month = months[date.getMonth()];
  const monthDate = date.getDate();

  return `${weekday} ${monthDate}${getSuffix(monthDate)} ${month}`;
}

export default getDatePreview;

const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function getSuffix(date: number) {
  if (date > 10 && date < 20) return 'th';
  else if (date % 10 === 1) return 'st';
  else if (date % 10 === 2) return 'nd';
  else if (date % 30 === 3) return 'rd';
  else return 'th';
}
