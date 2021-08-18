// 원본 이미지 사이즈는 28*28로 통일
function load_image(image_name) {
  var can = document.getElementById("Inputcanvas");
  var ctx = canvas.getContext("2d");
  var image = new Image();
  image.src = "./preset_image/" + image_name;
  image.addEventListener("load", () => {
    ctx.drawImage(image, 0, 0, 28, 28);
  });
}
/* 1번
var canvas, context;
var AEcan, AEcon;
var NAEcan, NAEcon;

function init() {
  document.getElementById("AErecon").innerHTML = "0";
  document.getElementById("NAErecon").innerHTML = "0";

  canvas = document.getElementById("Inputcanvas");
  context = canvas.getContext("2d");

  AEcan = document.getElementById("AEcanvas");
  AEcon = AEcan.getContext("2d");

  NAEcan = document.getElementById("NAEcanvas");
  NAEcon = NAEcan.getContext("2d");

  context.lineWidth = 1.5; // 선 굵기를 1.5로 설정
  context.strokeStyle = "white";
  context.lineCap = "round";

  // 마우스 리스너 등록. e는 MouseEvent 객체
  canvas.addEventListener(
    "mousemove",
    function (e) {
      move(e);
    },
    false
  ); //  캔버스에서 마우스가 움직이는 동안 발생되는 이벤트
  canvas.addEventListener(
    "mousedown",
    function (e) {
      down(e);
    },
    false
  ); // 캔버스에서 마우스를 눌렀을 때 발생되는 이벤트
  canvas.addEventListener(
    "mouseup",
    function (e) {
      up(e);
    },
    false
  ); // 캔버스에서 눌러진 마우스를 떼었을 때 발생되는 이벤트
  canvas.addEventListener(
    "mouseout",
    function (e) {
      out(e);
    },
    false
  ); // 캔버스에서 마우스가 벗어났을 때 발생되는 이벤트
}

var startX = 0,
  startY = 0; // 드래깅동안, 처음 마우스가 눌러진 좌표
var drawing = false;

function canvasX(clientX) {
  var bound = canvas.getBoundingClientRect();
  console.log(canvas.width);
  console.log(bound.width);
  return (clientX - bound.left) * (canvas.width / bound.width);
}

function canvasY(clientY) {
  var bound = canvas.getBoundingClientRect();
  return (clientY - bound.top) * (canvas.height / bound.height);
}

function draw(curX, curY) {
  context.beginPath(); // 마우스를 누르고 움직일 때마다 시작점을 재지정
  context.moveTo(startX, startY);
  context.lineTo(curX, curY); // 마우스 시작점부터 현재 점까지 라인 그리기
  context.stroke();
}

function down(e) {
  e.preventDefault(); // 더블클릭했을 때 캔버스 지정하게 되어서 파란색으로 반전되는 것 막음
  startX = canvasX(e.clientX);
  startY = canvasY(e.clientY);
  drawing = true;
}

function up(e) {
  drawing = false;
}

function move(e) {
  if (!drawing) return; // 마우스가 눌러지지 않았으면 리턴
  var curX = canvasX(e.clientX),
    curY = canvasY(e.clientY);
  draw(curX, curY);
  startX = curX;
  startY = curY;
}

function out(e) {
  drawing = false;
}
*/

var canvas, context, tool;
var AEcan, AEcon;
var NAEcan, NAEcon;

function init() {
  document.getElementById("AErecon").innerHTML = "0";
  document.getElementById("NAErecon").innerHTML = "0";

  canvas = document.getElementById("Inputcanvas");
  context = canvas.getContext("2d");

  AEcan = document.getElementById("AEcanvas");
  AEcon = AEcan.getContext("2d");

  NAEcan = document.getElementById("NAEcanvas");
  NAEcon = NAEcan.getContext("2d");

  context.lineWidth = 1.5; // 선 굵기를 1.5로 설정
  context.strokeStyle = "white";
  context.lineCap = "round";

  tool = new tool_pencil();
  canvas.addEventListener("mousedown", ev_canvas, false);
  canvas.addEventListener("mousemove", ev_canvas, false);
  canvas.addEventListener("mouseup", ev_canvas, false);
  canvas.addEventListener("touchstart", ev_canvas, false);
  canvas.addEventListener("touchmove", ev_canvas, false);
  canvas.addEventListener("touchend", ev_canvas, false);
}

function tool_pencil() {
  var tool = this;
  this.started = false;
  this.mousedown = function (ev) {
    context.beginPath();
    context.moveTo(ev._x, ev._y);
    tool.started = true;
  };
  // 마우스가 이동하는 동안 계속 호출하여 Canvas에 Line을 그려 나간다
  this.mousemove = function (ev) {
    if (tool.started) {
      context.lineTo(ev._x, ev._y);
      context.stroke();
    }
  };
  // 마우스 떼면 그리기 작업을 중단한다
  this.mouseup = function (ev) {
    if (tool.started) {
      tool.mousemove(ev);
      tool.started = false;
    }
  };
  // 마우스를 누르는 순간 그리기 작업을 시작 한다.
  this.touchstart = function (ev) {
    context.beginPath();
    context.moveTo(ev._x, ev._y);
    tool.started = true;
  };
  // 마우스가 이동하는 동안 계속 호출하여 Canvas에 Line을 그려 나간다
  this.touchmove = function (ev) {
    if (tool.started) {
      ev.preventDefault();
      ev.stopPropagation();

      context.lineTo(ev._x, ev._y);
      context.stroke();
    }
  };
  // 마우스 떼면 그리기 작업을 중단한다
  this.touchend = function (ev) {
    if (tool.started) {
      tool.touchmove(ev);
      tool.started = false;
    }
  };
}

// Canvas요소 내의 좌표를 결정 한다.
function ev_canvas(ev) {
  if (ev.layerX || ev.layerX == 0) {
    // Firefox 브라우저
    var bound = canvas.getBoundingClientRect();

    //ev._x = ev.layerX;
    //ev._y = ev.layerY;

    ev._x = (ev.clientX - bound.left) * (canvas.width / bound.width);
    ev._y = (ev.clientY - bound.top) * (canvas.height / bound.height);

    //ev._x = ev.pageX - canvas.offsetLeft;
    //ev._y = ev.pageY - canvas.offsetTop;
  } else if (ev.offsetX || ev.offsetX == 0) {
    // Opera 브라우저
    //var bound = canvas.getBoundingClientRect();
    //ev._x = ev.offsetX;
    //ev._x = (ev.layerX - bound.left) * (canvas.width / bound.width);
    //ev._y = ev.offsetY;
    //ev._y = (ev.layerY - bound.top) * (canvas.height / bound.height);
  } else if (ev.targetTouches[0] || ev.targetTouches[0].pageX == 0) {
    //핸드폰

    var bound = canvas.getBoundingClientRect();
    //ev._x = ev.targetTouches[0].pageX - left;
    //ev._y = ev.targetTouches[0].pageY - top;
    //ev._x = ev.targetTouches[0].pageX - canvas.offsetLeft;
    //ev._y = ev.targetTouches[0].pageY - canvas.offsetTop;
    ev._x = (ev.touches[0].clientX - bound.left) * (canvas.width / bound.width);
    ev._y =
      (ev.touches[0].clientY - bound.top) * (canvas.height / bound.height);
    //ev._x =(ev.targetTouches[0].pageX - bound.left) * (canvas.width / bound.width);
    //ev._y =(ev.targetTouches[0].pageY - bound.right) *(canvas.height / bound.height);
  }
  // tool의 이벤트 핸들러를 호출한다.
  var func = tool[ev.type];
  if (func) {
    func(ev);
  }
}

var startX = 0,
  startY = 0; // 드래깅동안, 처음 마우스가 눌러진 좌표
var drawing = false;

function canvasX(clientX) {
  var bound = canvas.getBoundingClientRect();
  return (clientX - bound.left) * (canvas.width / bound.width);
}

function canvasY(clientY) {
  var bound = canvas.getBoundingClientRect();
  return (clientY - bound.top) * (canvas.height / bound.height);
}

function draw(curX, curY) {
  context.beginPath(); // 마우스를 누르고 움직일 때마다 시작점을 재지정
  context.moveTo(startX, startY);
  context.lineTo(curX, curY); // 마우스 시작점부터 현재 점까지 라인 그리기
  context.stroke();
}

function down(e) {
  e.preventDefault(); // 더블클릭했을 때 캔버스 지정하게 되어서 파란색으로 반전되는 것 막음
  startX = canvasX(e.clientX);
  startY = canvasY(e.clientY);
  drawing = true;
}

function up(e) {
  drawing = false;
}

function move(e) {
  if (!drawing) return; // 마우스가 눌러지지 않았으면 리턴
  var curX = canvasX(e.clientX),
    curY = canvasY(e.clientY);
  draw(curX, curY);
  startX = curX;
  startY = curY;
}

function out(e) {
  drawing = false;
}

/* 3번
var canvas, context;
var AEcan, AEcon;
var NAEcan, NAEcon;

function init() {
  document.getElementById("AErecon").innerHTML = "0";
  document.getElementById("NAErecon").innerHTML = "0";

  canvas = document.getElementById("Inputcanvas");
  context = canvas.getContext("2d");

  AEcan = document.getElementById("AEcanvas");
  AEcon = AEcan.getContext("2d");

  NAEcan = document.getElementById("NAEcanvas");
  NAEcon = NAEcan.getContext("2d");

  context.lineWidth = 1.5; // 선 굵기를 1.5로 설정
  context.strokeStyle = "white";
  context.lineCap = "round";

  // 마우스 리스너 등록. e는 MouseEvent 객체
  canvas.addEventListener("mousemove", draw, false); //  캔버스에서 마우스가 움직이는 동안 발생되는 이벤트
  canvas.addEventListener("mousedown", draw, false); // 캔버스에서 마우스를 눌렀을 때 발생되는 이벤트
  canvas.addEventListener("mouseup", draw, false); // 캔버스에서 눌러진 마우스를 떼었을 때 발생되는 이벤트
  canvas.addEventListener("mouseout", draw, false); // 캔버스에서 마우스가 벗어났을 때 발생되는 이벤트
  canvas.addEventListener("touchstart", touchdraw, false);
  canvas.addEventListener("touchmove", touchdraw, false);
  canvas.addEventListener("touchend", touchdraw, false);
}

var startX = 0;
var startY = 0;
var drawing = false;

function draw(e) {
  function canvasX(clientX) {
    var bound = canvas.getBoundingClientRect();
    return (clientX - bound.left) * (canvas.width / bound.width);
  }

  function canvasY(clientY) {
    var bound = canvas.getBoundingClientRect();
    return (clientY - bound.top) * (canvas.height / bound.height);
  }

  function draw(curX, curY) {
    context.beginPath(); // 마우스를 누르고 움직일 때마다 시작점을 재지정
    context.moveTo(startX, startY);
    context.lineTo(curX, curY); // 마우스 시작점부터 현재 점까지 라인 그리기
    context.stroke();
  }

  switch (e.type) {
    case "mousedown":
      {
        e.preventDefault(); // 더블클릭했을 때 캔버스 지정하게 되어서 파란색으로 반전되는 것 막음
        startX = canvasX(e.clientX);
        startY = canvasY(e.clientY);
        drawing = true;
      }
      break;

    case "mouseup":
      {
        drawing = false;
      }
      break;

    case "mousemove":
      {
        if (!drawing) return; // 마우스가 눌러지지 않았으면 리턴
        var curX = canvasX(e.clientX),
          curY = canvasY(e.clientY);
        draw(curX, curY);
        startX = curX;
        startY = curY;
      }
      break;

    case "mouseout":
      {
        drawing = false;
      }
      break;
  }
}

var tstartX = 0;
var tstartY = 0;
var tdrawing = false;

function touchdraw(e) {
  function canvasX(clientX) {
    var bound = canvas.getBoundingClientRect();
    return (clientX - bound.left) * (canvas.width / bound.width);
  }

  function canvasY(clientY) {
    var bound = canvas.getBoundingClientRect();
    return (clientY - bound.top) * (canvas.height / bound.height);
  }

  function draw(curX, curY) {
    context.beginPath(); // 마우스를 누르고 움직일 때마다 시작점을 재지정
    context.moveTo(tstartX, tstartY);
    context.lineTo(curX, curY); // 마우스 시작점부터 현재 점까지 라인 그리기
    context.stroke();
  }
  switch (e.type) {
    case "touchstart":
      {
        e.preventDefault(); // 더블클릭했을 때 캔버스 지정하게 되어서 파란색으로 반전되는 것 막음
        tstartX = canvasX(e.changedTouches[0].pageX);
        tstartY = canvasY(e.changedTouches[0].pageY);
        tdrawing = true;
      }
      break;
    case "touchend":
      {
        tdrawing = false;
      }
      break;

    case "touchmove": {
      if (!tdrawing) return; // 마우스가 눌러지지 않았으면 리턴
      var curX = canvasX(e.changedTouches[0].pageX),
        curY = canvasY(e.changedTouches[0].pageY);
      draw(curX, curY);
      tstartX = curX;
      tstartY = curY;
    }
  }
}
*/

/* 4번
var canvas, context, tool;
var AEcan, AEcon, NAEcan, NAEcon;
function init() {
  canvas = document.getElementById("Inputcanvas");
  context = canvas.getContext("2d");

  document.getElementById("AErecon").innerHTML = "0";
  document.getElementById("NAErecon").innerHTML = "0";

  AEcan = document.getElementById("AEcanvas");
  AEcon = AEcan.getContext("2d");

  NAEcan = document.getElementById("NAEcanvas");
  NAEcon = NAEcan.getContext("2d");

  context.lineWidth = 1; // 선 굵기를 1.5로 설정
  context.strokeStyle = "white";
  context.lineCap = "round";

  // Pencil tool 객체를 생성 한다.
  tool = new tool_pencil();
  canvas.addEventListener("mousedown", ev_canvas, false);
  canvas.addEventListener("mousemove", ev_canvas, false);
  canvas.addEventListener("mouseup", ev_canvas, false);
  canvas.addEventListener("touchstart", ev_canvas, false);
  canvas.addEventListener("touchmove", ev_canvas, false);
  canvas.addEventListener("touchend", ev_canvas, false);
}
function tool_pencil() {
  var tool = this;
  this.started = false;

  // 마우스를 누르는 순간 그리기 작업을 시작 한다.
  this.mousedown = function (ev) {
    context.beginPath();
    context.moveTo(ev._x, ev._y);
    tool.started = true;
  };
  // 마우스가 이동하는 동안 계속 호출하여 Canvas에 Line을 그려 나간다
  this.mousemove = function (ev) {
    if (tool.started) {
      context.lineTo(ev._x, ev._y);
      context.stroke();
    }
  };
  // 마우스 떼면 그리기 작업을 중단한다
  this.mouseup = function (ev) {
    if (tool.started) {
      tool.mousemove(ev);
      tool.started = false;
    }
  };

  // 마우스를 누르는 순간 그리기 작업을 시작 한다.
  this.touchstart = function (ev) {
    context.beginPath();
    context.moveTo(ev._x, ev._y);
    tool.started = true;
  };
  // 마우스가 이동하는 동안 계속 호출하여 Canvas에 Line을 그려 나간다
  this.touchmove = function (ev) {
    if (tool.started) {
      context.lineTo(ev._x, ev._y);
      context.stroke();
    }
  };
  // 마우스 떼면 그리기 작업을 중단한다
  this.touchend = function (ev) {
    if (tool.started) {
      tool.touchmove(ev);
      tool.started = false;
    }
  };
}
// Canvas요소 내의 좌표를 결정 한다.
function ev_canvas(ev) {
  if (ev.layerX || ev.layerX == 0) {
    // Firefox 브라우저
    ev._x = ev.layerX;
    ev._y = ev.layerY;
  } else if (ev.offsetX || ev.offsetX == 0) {
    // Opera 브라우저
    ev._x = ev.offsetX;
    ev._y = ev.offsetY;
  } else if (ev.targetTouches[0] || ev.targetTouches[0].pageX == 0) {
    //핸드폰
    var left = 0;
    var top = 0;
    var elem = document.getElementById("Inputcanvas");

    while (elem) {
      left = left + parseInt(elem.offsetLeft);
      top = top + parseInt(elem.offsetTop);
      elem = elem.offsetParent;
    }

    ev._x = ev.targetTouches[0].pageX - left;
    ev._y = ev.targetTouches[0].pageY - top;
  }
  // tool의 이벤트 핸들러를 호출한다.
  var func = tool[ev.type];
  if (func) {
    func(ev);
  }
}
*/

/* 5번
var canvas, context;
var AEcan, AEcon;
var NAEcan, NAEcon;

function init() {
  document.getElementById("AErecon").innerHTML = "0";
  document.getElementById("NAErecon").innerHTML = "0";

  canvas = document.getElementById("Inputcanvas");
  context = canvas.getContext("2d");

  AEcan = document.getElementById("AEcanvas");
  AEcon = AEcan.getContext("2d");

  NAEcan = document.getElementById("NAEcanvas");
  NAEcon = NAEcan.getContext("2d");

  context.lineWidth = 1.5; // 선 굵기를 1.5로 설정
  context.strokeStyle = "white";
  context.lineCap = "round";

  // 마우스 리스너 등록. e는 MouseEvent 객체
  canvas.addEventListener(
    "mousemove",
    function (e) {
      move(e);
    },
    false
  ); //  캔버스에서 마우스가 움직이는 동안 발생되는 이벤트
  canvas.addEventListener(
    "mousedown",
    function (e) {
      down(e);
    },
    false
  ); // 캔버스에서 마우스를 눌렀을 때 발생되는 이벤트
  canvas.addEventListener(
    "mouseup",
    function (e) {
      up(e);
    },
    false
  ); // 캔버스에서 눌러진 마우스를 떼었을 때 발생되는 이벤트
  canvas.addEventListener(
    "mouseout",
    function (e) {
      out(e);
    },
    false
  ); // 캔버스에서 마우스가 벗어났을 때 발생되는 이벤트
  canvas.addEventListener(
    "touchstart",
    function (e) {
      down(e);
    },
    false
  );
  canvas.addEventListener(
    "touchmove",
    function (e) {
      move(e);
    },
    false
  );
  canvas.addEventListener(
    "touchend",
    function (e) {
      up(e);
    },
    false
  );
}

var startX = 0,
  startY = 0; // 드래깅동안, 처음 마우스가 눌러진 좌표
var drawing = false;

function canvasX(clientX) {
  var bound = canvas.getBoundingClientRect();
  return (clientX - bound.left) * (canvas.width / bound.width);
}

function canvasY(clientY) {
  var bound = canvas.getBoundingClientRect();
  return (clientY - bound.top) * (canvas.height / bound.height);
}

function draw(curX, curY) {
  context.beginPath(); // 마우스를 누르고 움직일 때마다 시작점을 재지정
  context.moveTo(startX, startY);
  context.lineTo(curX, curY); // 마우스 시작점부터 현재 점까지 라인 그리기
  context.stroke();
}

function down(e) {
  e.preventDefault(); // 더블클릭했을 때 캔버스 지정하게 되어서 파란색으로 반전되는 것 막음
  startX = canvasX(e.clientX);
  startY = canvasY(e.clientY);
  drawing = true;
}

function up(e) {
  drawing = false;
}

function move(e) {
  if (!drawing) return; // 마우스가 눌러지지 않았으면 리턴
  var curX = canvasX(e.clientX),
    curY = canvasY(e.clientY);
  draw(curX, curY);
  startX = curX;
  startY = curY;
}

function out(e) {
  drawing = false;
}
*/

var AErecon = document.getElementById("AErecon");
var NAErecon = document.getElementById("NAErecon");

function clearArea() {
  // Use the identity matrix while clearing the canvas
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  AEcon.setTransform(1, 0, 0, 1, 0, 0);
  AEcon.clearRect(0, 0, context.canvas.width, context.canvas.height);

  NAEcon.setTransform(1, 0, 0, 1, 0, 0);
  NAEcon.clearRect(0, 0, context.canvas.width, context.canvas.height);

  AErecon.innerHTML = "0";
  NAErecon.innerHTML = "0";
}
