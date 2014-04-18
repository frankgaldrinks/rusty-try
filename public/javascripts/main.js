$(document).ready(function () {
  $sortable = $("#sortable");
  $draggable = $("#draggable");
  
  //SOCKET STUFF ----------------------->

  var socket = io.connect('http://192.168.1.9');

  socket.on('connect', function () {
    console.log("Connected to the socket");
    socket.emit('enterroom', $("#uuid").text(), function (response) {
      $.ajax({
        method: "post",
        url: "/roomdata",
        data: {
          uuid: $("#uuid").text()
        },
        success: function (data) {
          $("#ajaxload").html(data);
          initJqueryUi();
          console.log(data);
        },
        error: function (data) {

        }
      });
    });
  });

  socket.on('updateusercount', function (data) {
    console.log(data.count);
    $("#usercount").text(data.count);
  });

  socket.on('changeorderclients', function (data) {
    //we could do a $( ".selector" ).sortable( "refresh" ); instead of redoing our whole page 
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

  //we run init the jquery ui stuff after the ajax loaded the data
  var initJqueryUi = function () {
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

      $("#sortable").sortable("option", "cancel", ':input,button,a');
      // $( "#sortable" ).disableSelection();

      $draggable.draggable({
        drag: function( event, ui ) {
          socket.emit('changedrag', ui.position);
        },
        stop: function( event, ui ) {
          socket.emit('stopdrag', ui.position);
        }
      });
  };

 

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

  //we might need to toggle the class .itemtext incase we refocus into an element
  $(document).on('click', '.itemtext', function () {
    // if ($(".newtext").is(":focus")) {
    //   var oldVal = $(".newtext").val();
    //   $(".newtext").parent().html("").text(oldVal);
    // }
    
    var oldVal = $(this).text();
    $(this).html("<input class='newtext' type='text' name='itemtext' data-oldval='" + oldVal + "'' />");
    // $(".dragarea").after("<input class='newtext' type='text' name='itemtext' />");
    $(this).find('.newtext').val(oldVal);
    $(this).find('.newtext').focus();

  });

  $(document).on('blur', '.newtext', function () {
    var oldVal = $(this).data("oldval");
    var newVal = $(this).val();

    console.log("blurred");
    console.log("Old val: " + oldVal);
    console.log("New Val: " + newVal);
    if (!$(".newtext").is(":focus")) {
      $(this).parent().html("").text(newVal);
    }
    
    if (oldVal !== newVal) {

      socket.emit("changeitemname", {oldName: oldVal, newName: newVal}, function (response) {

      });
    }
    $(this).parent().html("").text(newVal);
    
  });
});