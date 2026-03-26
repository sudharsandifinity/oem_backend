const currentTime = (timestamp) => {
  const currentDate = timestamp ? new Date(timestamp) : new Date();
  const formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, '');
  const formattedTime = currentDate.getHours().toString().padStart(2, '0') + currentDate.getMinutes().toString().padStart(2, '0') + currentDate.getSeconds().toString().padStart(2, '0');
  return { date: formattedDate, time: formattedTime };
};

const addMinutes = (time, mins) => {
  const formatted = `${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4, 6)}`;

  const d = new Date(`1970-01-01T${formatted}`);
  d.setMinutes(d.getMinutes() + mins);

  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  const s = d.getSeconds().toString().padStart(2, '0');

  return `${h}${m}${s}`;
};

module.exports = { currentTime, addMinutes };
