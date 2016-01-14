$(document).ready(function() {
  function commandConsumer(evt) {
    $("#statusline").html("keypressed: " + evt.which + ', ' + String.fromCharCode(evt.which) + ', ' + evt.metaKey);
    console.log("keypressed: " + evt.which + ', ' + String.fromCharCode(evt.which) + ', ' + evt.metaKey);
  }

  $("body").keypress(function(evt) {
    commandConsumer(evt);
  })
})
