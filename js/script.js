$(document).ready(function(){
  var curTime;
  var endPom;
  var endBreak;
  var totalPoms= 0;
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
        title: "Good job!",
        text: "You have completed <b>" + totalPoms + " pomodoros</b> of work! Are you ready for a relaxing <b>" + breakLength + " minutes</b> of whatever the heck you feel like?",
        type: "success",
        html: true,
        confirmButtonText: "Yes, I can't wait!"
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
