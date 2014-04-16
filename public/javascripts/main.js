$(document).ready(function () {
  $sortable = $("#sortable");
  $draggable = $("#draggable");
  
  //SOCKET STUFF ----------------------->

  var socket = io.connect('http://192.168.1.9');

  socket.on('changeorderclients', function (data) {
    $sortable.html("");
    var newItems = "";
    for (var i = 0; i < data.serial.length; i++) {
      newItems += "<li data-item='" + i + "' class='ui-state-default'>"
      newItems += "<span></span>"
      newItems += data.serial[i] + "</li>";
    }
    $sortable.append(newItems);
  });

  socket.on('changedragclient', function (data) {
    $draggable.css({"top": data.top, "left": data.left});
  });

  //JQUERYUI STUFF ----------------------->

  $( "#sortable" ).sortable({
    update: function (event, ui) {
      var serial = $("#sortable").sortable( "toArray", { attribute: "data-item" });

      socket.emit('changeorder', {serial: serial});
      // $.ajax({
      //   method: "post",
      //   url: "/sort",
      //   data: {
      //     serial: serial
      //   },
      //   success: function (data) {
      //     console.log(data);
      //   },
      //   error: function (data) {

      //   }
      // });
      console.log("Changed!");
    }
  });
  $( "#sortable" ).disableSelection();

  $draggable.draggable({
    drag: function( event, ui ) {
      socket.emit('changedrag', {dragdata: ui.position})
    }
  });
});