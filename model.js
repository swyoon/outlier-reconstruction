async function loadModel() {
  model = undefined;
  model = await tf.loadGraphModel("./tfjs_AEmodel/model.json");
  console.log("model loaded");
}

function make_prediction() {
  var Incan = document.getElementById("Inputcanvas");
  var Inctx = Incan.getContext("2d");

  var AEcan = document.getElementById("AEcanvas");
  var AEctx = AEcan.getContext("2d");

  var NAEcan = document.getElementById("NAEcanvas");
  var NAEctx = NAEcan.getContext("2d");

  var testimg = new Image();
  testimg = Inctx.getImageData(0, 0, 28, 28);

  const input = tf.tidy(() => {
    const img = tf.browser.fromPixels(testimg, 1);
    return img.expandDims(0);
  });

  const resized = tf.cast(input, "float32");
  var t3d = tf.reshape(resized, [-1, 28, 28]);
  t3d = t3d.div(255);
  const pred = model.predict(t3d);

  var a = pred;
  // map values from 0 -> 1 to 0 -> 255
  a = a.mul(255);

  var cast = a.asType("int32");
  var values = cast.arraySync();

  var img = new Image();
  img.src = "./preset_image/empty.jpg";

  img.onload = function () {
    var imageData = Inctx.getImageData(0, 0, 28, 28);
    NAEctx.putImageData(testimg, 0, 0);
    editPixels(imageData.data);
    drawEditedImage(imageData);
    reconError(testimg.data, imageData.data);
  };

  function reconError(beforeData, afterData) {
    var tf_result = 0;
    //tf_result = tf.squaredDifference(Array.from(beforeData), Array.from(afterData));
    tf_result = tf.losses.meanSquaredError(
      Array.from(beforeData),
      Array.from(afterData)
    );
    tf_result = tf_result.arraySync();
    tf_result = tf_result / 100;
    tf_result = tf_result.toFixed(3);
    document.getElementById("AErecon").innerHTML = tf_result;
  }

  function editPixels(imgData) {
    var x = 0;
    var y = 0;

    for (var i = 0; i < imgData.length; i += 4) {
      imgData[i] = values[0][x][y];
      imgData[i + 1] = values[0][x][y];
      imgData[i + 2] = values[0][x][y];
      //imgData[i + 3] = 255;

      y = y + 1;
      if (y == 28) {
        x = x + 1;
        y = 0;
      }
    }
  }

  function drawEditedImage(newData) {
    AEctx.putImageData(newData, 0, 0);
  }
}
