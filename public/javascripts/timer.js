$(document).ready(function () {
  var $timer = $("#timer");
  var startTime = +$timer.text();

  setInterval(function() {
    $timer.text(startTime--);
    console.log(startTime);
  }, 1000);
});