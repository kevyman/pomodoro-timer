$(document).ready(function(){
  var curTime;
  var endPom;
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
    if(6*d.getMinutes() + d.getSeconds()/10 === endPom){
      pomRunning = false;
    }
    if(pomRunning){
      document.getElementById("arc1")
      .setAttribute("d", describeArc(50, 50, 43.1, 6*d.getMinutes() + d.getSeconds()/10, endPom));
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
      console.log(curTime);
      endPom = 6*curTime.getMinutes() + curTime.getSeconds()/10 + 6;
      pomRunning = true;
    }
    else{
      pomRunning = false;
      document.getElementById("arc1").setAttribute("d", describeArc(0, 0, 0, 0, 0));
    }
    $(this).toggleClass("fa-play").toggleClass("fa-stop");


  });


});
