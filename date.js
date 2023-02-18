
exports.currDate = function () {
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  var today = new Date();
  var day = today.toLocaleDateString("en-US", options);
  return day;
};

exports.currDay = function () {
  var options = {
    weekday: "long",
  };

  var today = new Date();
  var day = today.toLocaleDateString("en-US", options);
  return day;
};
