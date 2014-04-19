$(document).ready(function () {

  $(document).on('click', '.removeroom', function () {
    var room = $(this).parent().find("a").text();
    var link = $(this).parent();
    $.ajax({
      method: "post",
      url: "/removeroom",
      data: {
        room: room
      },
      success: function (data) {
        link.remove();
      }
    });
  });
});