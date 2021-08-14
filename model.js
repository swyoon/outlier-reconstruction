async function loadModel() {
  // conventional autoencoder
  ae_encoder = undefined;
  ae_decoder = undefined;
  ae_encoder = await tf.loadLayersModel("./ae_encoder/model.json");
  ae_decoder = await tf.loadLayersModel("./ae_decoder/model.json");

  nae_encoder = undefined;
  nae_decoder = undefined;
  nae_encoder = await tf.loadLayersModel("./nae_encoder/model.json");
  nae_decoder = await tf.loadLayersModel("./nae_decoder/model.json");
  console.log("model loaded");
}

function reconstruct(encoder, decoder, x) {
  z = encoder.predict(x);
  z = z.div(tf.norm(z, 2, 3, true));  // spherical projection
  return decoder.predict(z);
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
  var t3d = tf.reshape(resized, [-1, 28, 28, 1]);
  t3d = t3d.div(255);
  // const pred = model.predict(t3d);
  const ae_pred = reconstruct(ae_encoder, ae_decoder, t3d);
  const nae_pred = reconstruct(nae_encoder, nae_decoder, t3d);

  var ae_values = ae_pred.mul(255).asType("int32").arraySync();
  var nae_values = nae_pred.mul(255).asType("int32").arraySync();
  // map values from 0 -> 1 to 0 -> 255

  var img = new Image();
  img.src = "./preset_image/empty.jpg";

  img.onload = function () {
    var AEImageData = Inctx.getImageData(0, 0, 28, 28);
    var NAEImageData = Inctx.getImageData(0, 0, 28, 28);
    editPixels(AEImageData.data, ae_values);
    editPixels(NAEImageData.data, nae_values);
    drawEditedImage(AEctx, AEImageData);
    drawEditedImage(NAEctx, NAEImageData);
    reconError("AErecon", testimg.data, AEImageData.data);
    reconError("NAErecon", testimg.data, NAEImageData.data);
  };

  function reconError(elementid, beforeData, afterData) {
    var tf_result = 0;
    //tf_result = tf.squaredDifference(Array.from(beforeData), Array.from(afterData));
    tf_result = tf.losses.meanSquaredError(
      Array.from(beforeData),
      Array.from(afterData)
    );
    tf_result = tf_result.arraySync();
    tf_result = tf_result / 100;
    tf_result = tf_result.toFixed(1);
    document.getElementById(elementid).innerHTML = tf_result;
  }

  function editPixels(imgData, values) {
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

  function drawEditedImage(ctx, newData) {
    ctx.putImageData(newData, 0, 0);
  }
}
