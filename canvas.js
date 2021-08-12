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

var canvas, context;
var AEcan, AEcon;
var NAEcan, NAEcon;

function init() {
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

  AErecon.value = "";
  NAErecon.value = "";
}
