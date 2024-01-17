const formatDate = () => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "Feburary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dateObj = new Date();
  dateObj.setDate(dateObj.getDate() + 7);
  const day = dateObj.getDay();
  const date = dateObj.getDate();
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();
  const formattedDate = `${days[day]} ${date}, ${months[month]} ${year}`;
  return formattedDate;
};
module.exports = formatDate;
