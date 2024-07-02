function getTime(time: number) {
  const date = new Date(time);

  return `${prefix(date.getHours())}:${prefix(date.getMinutes())}`;
}

export default getTime;

function prefix(num: number) {
  if (num < 10) return `0${num}`;
  return num;
}
