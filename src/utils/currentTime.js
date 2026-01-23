const currentTime = (timestamp) => {
  const currentDate = timestamp ? new Date(timestamp) : new Date();
  const formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, '');
  const formattedTime = currentDate.getHours().toString().padStart(2, '0') + currentDate.getMinutes().toString().padStart(2, '0');
  return { date: formattedDate, time: formattedTime };
};

module.exports = { currentTime };
