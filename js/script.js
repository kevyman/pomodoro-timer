$(document).ready(function(){
  var curTime;
  var endPom = 0;
  var endBreak = 0;
  var totalPoms= 0;
  var goalPoms =1;
  var pomBeginAngle =0;
  var breakBeginAngle = 0;
  var pomLength = 25;
  var breakLength = 5;
  var pomRunning = false;
  var breakRunning = false;

  setInterval(function() {


    function r(el, deg) {
      el.setAttribute('transform', 'rotate('+ deg +' 50 50)');
    }
    var d = new Date();
    // r(sec, 6*d.getSeconds());
    r(min, 6*d.getMinutes() + d.getSeconds()/10);
    r(hour, 30*(d.getHours()%12) + d.getMinutes()/2);

    if(d.getMinutes()===0 && d.getSeconds()===0){
      if(endPom>=360) endPom -= 360;
      if(endBreak>=360) endBreak -= 360;
      // console.log("endPom:"+endPom);
      // console.log("endBreak" + endBreak);
    }



    if(pomRunning){
      document.getElementById("progressArc")
      .setAttribute("d", describeArc(50, 50, 44, pomBeginAngle, endPom));
      document.getElementById("pomArc")
      .setAttribute("d", describeArc(50, 50, 44, 6*d.getMinutes() + d.getSeconds()/10, endPom));
      document.getElementById("breakArc")
      .setAttribute("d", describeArc(50, 50, 44, endPom, endBreak));

    }

    if(6*d.getMinutes() + d.getSeconds()/10 === endPom && pomRunning){
      // console.log("current angle:"+ 6*d.getMinutes() + d.getSeconds()/10);


      pomRunning = false;

      document.getElementById("bell").play();

      totalPoms++;

      document.getElementById("progressArc").setAttribute("d", describeArc(0, 0, 0, 0, 0));

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
        breakBeginAngle = 6*popTime.getMinutes() + popTime.getSeconds()/10;
        endBreak = 6*popTime.getMinutes() + popTime.getSeconds()/10 + 6*breakLength;
      });
    }

    if(breakRunning){
      document.getElementById("progressArc")
      .setAttribute("d", describeArc(50, 50, 44, breakBeginAngle, endBreak));
      document.getElementById("breakArc")
      .setAttribute("d", describeArc(50, 50, 44, 6*d.getMinutes() + d.getSeconds()/10, endBreak));
    }

    if(6*d.getMinutes() + d.getSeconds()/10 === endBreak && breakRunning){
      // console.log("current angle:"+ 6*d.getMinutes() + d.getSeconds()/10);

      breakRunning = false;

      document.getElementById("bell").play();

      document.getElementById("progressArc").setAttribute("d", describeArc(0, 0, 0, 0, 0));

      if((totalPoms+1)%4===0){
        breakLength *= 3;
      }
      else if(totalPoms % 4 === 0){
        breakLength /= 3;
      }



      swal({
        title: "Break's over!",
        text: "Hope that break left you feeling refreshed! Now it's time to get back to accomplishing your goals. Ready for<b> " + pomLength + " more minutes</b> of work?",
        html: true,
        confirmButtonText: "Let me at it!"
      },
      function(){
        pomRunning = true;
        var popTime = new Date();
        endPom = 6*popTime.getMinutes() + popTime.getSeconds()/10 + 6*pomLength;
        endBreak = endPom + 6 * breakLength;
        pomBeginAngle = 6*popTime.getMinutes() + popTime.getSeconds()/10;

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

    $("#workTime").html("Reserve the next"+ hourString + isAnd + minuteString +"for excellence!");
  }

  updateTimeParagraph();


  $("#clock").click(function(){

    document.getElementById("chromeMobile").play();

    $("#clock").removeClass();

    if(pomRunning || breakRunning){

      if(totalPoms<goalPoms){
        swal({
          title: "Not so fast!",
          type: "warning",
          text: "You are still <b>" + (goalPoms-totalPoms) + " pomodoros</b> short of your goal of <b>" + goalPoms + " pomodoros</b>! <br><br>Come on, you can do <b>" + (goalPoms-totalPoms)*pomLength + " more minutes</b> of work!",
          html: true,
          showCancelButton: true,
          confirmButtonText: "Continue!",
          cancelButtonText: "Stop.",
          closeOnCancel: false
        },
        function(isConfirm){
          if(!isConfirm){
            document.getElementById("failure").play();
            sweetAlert({
              title: "You didn't make it.",
              text: "You couldn't complete the <b>" + goalPoms + " pomodoros</b> you planned on doing. Sometimes life gets in the way, we get it! See you back here later!",
              html: true,
              type: "error"
            });
            totalPoms = 0;
            pomRunning = false;
            breakRunning = false;
            document.getElementById("progressArc").setAttribute("d", describeArc(0, 0, 0, 0, 0));
            document.getElementById("pomArc").setAttribute("d", describeArc(0, 0, 0, 0, 0));
            document.getElementById("breakArc").setAttribute("d", describeArc(0, 0, 0, 0, 0));
          }
        });
      }

      else{
        swal({
          title: "Stop the productivity train?",
          type: "warning",
          text: "Hey, you've reached your goal of <b>" + goalPoms + " pomodoros</b>! You've built up some good momentum, sure you want to stop?",
          html: true,
          showCancelButton: true,
          confirmButtonText: "Stop.",
          cancelButtonText: "Continue!",
          closeOnConfirm: false
        },
        function(isConfirm){
          if(isConfirm){
            document.getElementById("success").play();
            sweetAlert({
              title: "Great job!",
              text: "You did <b>" + totalPoms + " pomodoros</b>, for a total of <b>" + totalPoms*pomLength + " minutes</b> of work! You are awesome!",
              html: true,
              type: "success"
            });
            totalPoms = 0;
            pomRunning = false;
            breakRunning = false;
            document.getElementById("progressArc").setAttribute("d", describeArc(0, 0, 0, 0, 0));
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

  $("#startModal").on('hidden.bs.modal', function(){
    curTime = new Date();
    endPom = (6*curTime.getMinutes() + curTime.getSeconds()/10 + 6*pomLength);
    endBreak = (endPom + 6 * breakLength);
    pomRunning = true;
    pomBeginAngle = 6*curTime.getMinutes() + curTime.getSeconds()/10;
    // console.log("start angle:"+ 6*curTime.getMinutes() + curTime.getSeconds()/10);
    // console.log("endPom:"+endPom);
    // console.log("endBreak" + endBreak);

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
    if ($("#modalTitle").html() === "Set your goal!"){
      $("#modalTitle").html("How long?");
    }
    else{
      $("#modalTitle").html("Set your goal!");
    }

  });

  $('#workLength').on('input', function(){
    $('#workSlider').val($('#workLength').val());
    pomLength = parseInt($('#workLength').val(), 10);

    if (pomLength+breakLength>60) {
      breakLength= 60-pomLength;
      $('#playLength').val(breakLength);
      $('#playSlider').val(breakLength);
    }
    updateTimeParagraph();
  });

  $('#workSlider').on('input', function(){
    $('#workLength').val($('#workSlider').val());
    pomLength = parseInt($('#workSlider').val(), 10);
    if (pomLength+breakLength>60) {
      breakLength= 60-pomLength;
      $('#playLength').val(breakLength);
      $('#playSlider').val(breakLength);
    }
    updateTimeParagraph();
  });

  $('#playLength').on('input', function(){
    $('#playSlider').val($('#playLength').val());
    breakLength =  parseInt($('#playLength').val(), 10);
    if (pomLength+breakLength>60) {
      pomLength= 60-breakLength;
      $('#workLength').val(pomLength);
      $('#workSlider').val(pomLength);
    }
    updateTimeParagraph();
  });

  $('#playSlider').on('input', function(){
    $('#playLength').val($('#playSlider').val());
    breakLength = parseInt($('#playSlider').val(), 10);
    if (pomLength+breakLength>60) {
      pomLength= 60-breakLength;
      $('#workLength').val(pomLength);
      $('#workSlider').val(pomLength);
    }
    updateTimeParagraph();
  });



  //
  //
  // $("#runPom").click(function(){
  //   if($(this).hasClass("fa-play")){
  //
  //     curTime = new Date();
  //     endPom = 6*curTime.getMinutes() + curTime.getSeconds()/10 + 6*pomLength;
  //     endBreak = endPom + 6 * breakLength;
  //     pomRunning = true;
  //
  //   }
  //   else{
  //     pomRunning = false;
  //     breakRunning = false;
  //     document.getElementById("pomArc").setAttribute("d", describeArc(0, 0, 0, 0, 0));
  //     document.getElementById("breakArc").setAttribute("d", describeArc(0, 0, 0, 0, 0));
  //   }
  //   $(this).toggleClass("fa-play").toggleClass("fa-stop");
  // });
  //
  // $("#pomPlus").click(function(){
  //   if(pomLength>=1 && pomLength < 59){
  //     pomLength++;
  //     $("#pomLen").html(pomLength);
  //     if(pomLength+breakLength>60){
  //       breakLength--;
  //       $("#breakLen").html(breakLength);
  //     }
  //   }
  //
  // });
  // $("#pomMinus").click(function(){
  //   if(pomLength>1 && pomLength <= 59){
  //     pomLength--;
  //     $("#pomLen").html(pomLength);
  //   }
  // });
  // $("#breakPlus").click(function(){
  //   if(breakLength>=1 && breakLength < 59){
  //     breakLength++;
  //     $("#breakLen").html(breakLength);
  //     if(pomLength+breakLength>60){
  //       pomLength--;
  //       $("#pomLen").html(pomLength);
  //     }
  //   }
  // });
  //
  // $("#breakMinus").click(function(){
  //   if(breakLength>1 && breakLength <= 59){
  //     breakLength--;
  //     $("#breakLen").html(breakLength);
  //   }
  // });
  //
  //


});
