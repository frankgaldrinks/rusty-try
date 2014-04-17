$(document).ready(function () {
  $sortable = $("#sortable");
  $draggable = $("#draggable");
  
  //SOCKET STUFF ----------------------->

  var socket = io.connect('http://192.168.1.9');

  socket.on('connect', function () {
    console.log("Connected to the socket");
    socket.emit('enterroom', $("ul").data("uuid"), function (response) {

    });
  });

  socket.on('changeorderclients', function (data) {
    $sortable.html("");
    var newItems = "";
    console.log(data.serial);
    for (var i = 0; i < data.serial.length; i++) {
      newItems += "<li data-item='" + i + "' class='ui-state-default item'>"
      newItems += "<span class='itemtext'>" + data.serial[i] + "</span>";
      newItems += "<span class='removeitem glyphicon glyphicon-remove'></span></li>";
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

  //VANILLA JQUERY STUFF ----------------->
  $(document).on("click", ".removeitem", function () {
    console.log($(this).parent().text());
    socket.emit("removeitem", {item: $(this).parent().text()});
  });

  // $("#newbutt").on("click", function () {
  //   var newItem = $(this).parent().find("input").val();
  //   $(this).parent().find("input").val("");
  //   console.log(newItem);
  //   socket.emit("newitem", {newItem: newItem});
  // });

  $('#submitnew').submit(function(event) {
    event.preventDefault();
    var newItem = $(this).parent().find("#newitem").val();
    $(this).parent().find("#newitem").val("");
    console.log(newItem);
    socket.emit("newitem", {newItem: newItem}, function (response) {
      if (response) {
        console.log(response);
      }
    });
  });
});