// 원본 이미지 사이즈는 28*28로 통일
async function load_image(image_name) {
  var can = document.getElementById("Inputcanvas");
  var ctx = can.getContext("2d");
  var image = new Image();
  image.src = "./preset_image/" + image_name;
  image.addEventListener("load", () => {
    ctx.drawImage(image, 0, 0, 28, 28);
  });
  await new Promise(r => setTimeout(r, 200));
  make_prediction();
}

var canvas, context;
var AEcan, AEcon;
var NAEcan, NAEcon;

function init() {
  // document.getElementById("AErecon").innerHTML = "0";
  // document.getElementById("NAErecon").innerHTML = "0";

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

  function touchdraw(curX, curY) {
    context.beginPath();
    context.moveTo(tstartX, tstartY);
    context.lineTo(curX, curY);
    context.stroke();
  }
  switch (e.type) {
    case "touchstart":
      {
        e.preventDefault();
        e.stopPropagation();
        tstartX = canvasX(e.touches[0].clientX);
        tstartY = canvasY(e.touches[0].clientY);
        tdrawing = true;
      }
      break;
    case "touchend":
      {
        tdrawing = false;
      }
      break;

    case "touchmove": {
      if (!tdrawing) return;
      var curX = canvasX(e.touches[0].clientX),
        curY = canvasY(e.touches[0].clientY);
      touchdraw(curX, curY);
      tstartX = curX;
      tstartY = curY;
    }
  }
}

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

  // AErecon.innerHTML = "0";
  // NAErecon.innerHTML = "0";
}
