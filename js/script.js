$(document).ready(function(){
  var curTime;
  var endPom;
  var endBreak;
  var totalPoms= 0;
  var goalPoms =1;
  var pomLength = 25;
  var breakLength = 5;
  var pomRunning = false;
  var breakRunning = false;

  setInterval(function() {

    function r(el, deg) {
      el.setAttribute('transform', 'rotate('+ deg +' 50 50)');
    }
    var d = new Date();
    r(sec, 6*d.getSeconds());
    r(min, 6*d.getMinutes() + d.getSeconds()/10);
    r(hour, 30*(d.getHours()%12) + d.getMinutes()/2);


    if(pomRunning){
      document.getElementById("pomArc")
      .setAttribute("d", describeArc(50, 50, 43.1, 6*d.getMinutes() + d.getSeconds()/10, endPom));
      document.getElementById("breakArc")
      .setAttribute("d", describeArc(50, 50, 43.1, endPom, endBreak));
    }

    if(6*d.getMinutes() + d.getSeconds()/10 === endPom && pomRunning){

      pomRunning = false;
      document.getElementById("bell").play();

      totalPoms++;

      document.getElementById("breakArc").setAttribute("d", describeArc(0, 0, 0, 0, 0));

      swal({
        title: "Good job!",
        text: "You have completed <b>" + totalPoms + " pomodoros</b> of work! Are you ready for a relaxing <b>" + breakLength + " minutes</b> of whatever the heck you feel like?",
        type: "success",
        html: true,
        confirmButtonText: "Yes, I can't wait!"
      },
      function(){
        breakRunning = true;
        var popTime = new Date();
        endBreak = 6*popTime.getMinutes() + popTime.getSeconds()/10 + 6*breakLength;
      });
    }

    if(breakRunning){
      document.getElementById("breakArc")
      .setAttribute("d", describeArc(50, 50, 43.1, 6*d.getMinutes() + d.getSeconds()/10, endBreak));
    }

    if(6*d.getMinutes() + d.getSeconds()/10 === endBreak && breakRunning){

      breakRunning = false;
      document.getElementById("bell").play();

      swal({
        title: "Back to work!",
        text: "Hope that break left you feeling refreshed! Now it's time to get back to accomplishing your goals. Ready for<b> " + pomLength + " more minutes</b> of work?",
        html: true,
        confirmButtonText: "Let me at it!"
      },
      function(){
        pomRunning = true;
        var popTime = new Date();
        endPom = 6*popTime.getMinutes() + popTime.getSeconds()/10 + 6*pomLength;
        endBreak = endPom + 6 * breakLength;
      });
    }
  }, 1000)

  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  function describeArc(x, y, radius, startAngle, endAngle){

      var start = polarToCartesian(x, y, radius, endAngle);
      var end = polarToCartesian(x, y, radius, startAngle);

      var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

      var d = [
          "M", start.x, start.y,
          "A", radius, radius, 0, arcSweep, 0, end.x, end.y
      ].join(" ");

      return d;
  }

  function updateTimeParagraph(){
    var longBreak = breakLength*3;
    var isAnd = "";
    var hourAmmount = Math.floor(((pomLength+breakLength)*goalPoms + (Math.floor(goalPoms/4) * longBreak))/60);
    var minuteAmmount =  ((pomLength+breakLength)*goalPoms + (Math.floor(goalPoms/4) * longBreak)) % 60;
    var hourString = "";
    var minuteString = "";

    if(hourAmmount && minuteAmmount){
      isAnd = "and";
    }
    if(hourAmmount === 1 && isAnd === ""){
      hourString = " <b>hour</b> "
    }
    else if(hourAmmount === 1){
      hourString = " <b>" + hourAmmount + " hour</b> "
    }
    else if(hourAmmount>1){
      hourString = " <b>" + hourAmmount + " hours</b> "
    }

    if(minuteAmmount === 1){
      minuteString = " <b>" + minuteAmmount + " minute</b> "
    }
    else if(minuteAmmount>1){
      minuteString = " <b>" + minuteAmmount + " minutes</b> "
    }

    $("#workTime").html("Reserve the next"+ hourString + isAnd + minuteString +"for accomplishing your goals!");
  }

  updateTimeParagraph();


  $("#clock").click(function(){

    if(pomRunning || breakRunning){

      if(totalPoms<goalPoms){
        swal({
          title: "You're not finished yet!",
          type: "warning",
          text: "You are still " + (goalPoms-totalPoms) + " pomodoros short of your goal of " + goalPoms + " pomodoros! Think you could stand " + (goalPoms-totalPoms)*pomLength + " more minutes of work?",
          html: true,
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          closeOnCancel: false
        },
        function(isConfirm){
          if(!isConfirm){
            sweetAlert({
              title: "You fell short.",
              text: "You didn't do the " + goalPoms + " pomodoros you planned on doing. Sometimes life gets in the way, we get it! Better luck next time!",
              html: true,
              type: "error"
            });
            totalPoms = 0;
            pomRunning = false;
            breakRunning = false;
            document.getElementById("pomArc").setAttribute("d", describeArc(0, 0, 0, 0, 0));
            document.getElementById("breakArc").setAttribute("d", describeArc(0, 0, 0, 0, 0));
          }
        });
      }

      else{
        swal({
          title: "Are you sure you want to quit?",
          type: "warning",
          text: "You have reached your goal of " + goalPoms + " pomodoros, but are you really sure you want off this productivity train?",
          html: true,
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          closeOnConfirm: false
        },
        function(isConfirm){
          if(isConfirm){
            sweetAlert({
              title: "Great job!",
              text: "You did " + totalPoms + " pomodoros, for a total of " + totalPoms*pomLength + " minutes of work! You're awesome!",
              html: true,
              type: "success"
            });
            totalPoms = 0;
            pomRunning = false;
            breakRunning = false;
            document.getElementById("pomArc").setAttribute("d", describeArc(0, 0, 0, 0, 0));
            document.getElementById("breakArc").setAttribute("d", describeArc(0, 0, 0, 0, 0));
          }
        });
      }

    }
    else{
      $('#startModal').modal();
    }
  });

  $("#startPom").click(function(){
    curTime = new Date();
    endPom = 6*curTime.getMinutes() + curTime.getSeconds()/10 + 6*pomLength;
    endBreak = endPom + 6 * breakLength;
    pomRunning = true;

  });

  $('#pomNumSlider').on('input', function(){
    $('#pomQuantity').val($('#pomNumSlider').val());
    goalPoms = $('#pomNumSlider').val();
    updateTimeParagraph();
  });

  $('#pomQuantity').on('input', function(){
    $('#pomNumSlider').val($('#pomQuantity').val());
    goalPoms = $('#pomQuantity').val();
    updateTimeParagraph();
  });

  $("#settingsBtn").click(function(){
    $("#settings").toggle();
    $("#goalDiv").toggle();
    if ($("#modalTitle").html() === "How many Pomodoros are you going to do?"){
      $("#modalTitle").html("In each cycle, how long do you want to...");
    }
    else{
      $("#modalTitle").html("How many Pomodoros are you going to do?");
    }

  });

  $('#workLength').on('input', function(){
    $('#workSlider').val($('#workLength').val());
    pomLength = parseInt($('#workLength').val(), 10);

    updateTimeParagraph();
  });

  $('#workSlider').on('input', function(){
    $('#workLength').val($('#workSlider').val());
    pomLength = parseInt($('#workSlider').val(), 10);
    updateTimeParagraph();
  });

  $('#playLength').on('input', function(){
    $('#playSlider').val($('#playLength').val());
    breakLength =  parseInt($('#playLength').val(), 10);
    updateTimeParagraph();
  });

  $('#playSlider').on('input', function(){
    $('#playLength').val($('#playSlider').val());
    breakLength = parseInt($('#playSlider').val(), 10);
    updateTimeParagraph();
  });







  $("#runPom").click(function(){
    if($(this).hasClass("fa-play")){

      curTime = new Date();
      endPom = 6*curTime.getMinutes() + curTime.getSeconds()/10 + 6*pomLength;
      endBreak = endPom + 6 * breakLength;
      pomRunning = true;

    }
    else{
      pomRunning = false;
      breakRunning = false;
      document.getElementById("pomArc").setAttribute("d", describeArc(0, 0, 0, 0, 0));
      document.getElementById("breakArc").setAttribute("d", describeArc(0, 0, 0, 0, 0));
    }
    $(this).toggleClass("fa-play").toggleClass("fa-stop");
  });

  $("#pomPlus").click(function(){
    if(pomLength>=1 && pomLength < 59){
      pomLength++;
      $("#pomLen").html(pomLength);
      if(pomLength+breakLength>60){
        breakLength--;
        $("#breakLen").html(breakLength);
      }
    }

  });
  $("#pomMinus").click(function(){
    if(pomLength>1 && pomLength <= 59){
      pomLength--;
      $("#pomLen").html(pomLength);
    }
  });
  $("#breakPlus").click(function(){
    if(breakLength>=1 && breakLength < 59){
      breakLength++;
      $("#breakLen").html(breakLength);
      if(pomLength+breakLength>60){
        pomLength--;
        $("#pomLen").html(pomLength);
      }
    }
  });

  $("#breakMinus").click(function(){
    if(breakLength>1 && breakLength <= 59){
      breakLength--;
      $("#breakLen").html(breakLength);
    }
  });




});
