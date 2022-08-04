const basePath = process.cwd();
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const { createCanvas, loadImage } = require(`${basePath}/node_modules/canvas`);
const buildDir = `${basePath}/build`;
const dataDir = `${basePath}/data`;
const imagesDir = `${dataDir}/images`;
const sideLogoDir = `${dataDir}/sides`;
const {
  logoSetting,
  imageSetting,
  text1Setting,
  text2Setting,
  text3Setting,
  text4Setting,
  titlePosSetting,
  backgroundSetting,
  sideLogoSetting,
  textArea,
} = require(`${basePath}/src/config.js`);
const jsonData = require(`${dataDir}/synthesis.json`);
const canvas = createCanvas(backgroundSetting.width, backgroundSetting.height);
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = backgroundSetting.smoothing;

const buildSetup = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
  fs.mkdirSync(`${buildDir}/images`);
};

const saveImage = (filename) => {
  let name = path.parse(filename).name;
  fs.writeFileSync(
    `${buildDir}/images/${name}.png`,
    canvas.toBuffer("image/png")
  );
};

const genColor = () => {
  let hue = Math.floor(Math.random() * 360);
  let pastel = `hsl(${hue}, 100%, ${background.brightness})`;
  return pastel;
};

const drawBackground = (_background) => {
  ctx.drawImage(
    _background.loadedImage,
    0,
    0,
    backgroundSetting.width,
    backgroundSetting.height
  );
};

const loadLayerImg = async (filename) => {
  try {
    return new Promise(async (resolve) => {
      const path = `${filename}`;
      const image = await loadImage(path);
      resolve({ loadedImage: image });
    });
  } catch (error) {
    console.error("Error loading image:", error);
  }
};

const addText = async (
  textSetting1,
  text1,
  x1,
  y1,
  size1,
  textSetting2,
  text2,
  x2,
  y2,
  size2
) => {
  let letters = text1.split("");
  let w = 0;
  let h = 0;
  let prev_w = 0;
  let y = 0;
  let x = x1;
  let base_y = y1;
  for (let i = 0; i < letters.length; i++) {
    ctx.fillStyle = textSetting1.color;
    ctx.font = `${textSetting1.weight} ${size1 + i * 1}pt ${
      textSetting1.family
    }`;
    ctx.textBaseline = textSetting1.baseline;
    ctx.textAlign = textSetting1.align;
    ctx.save();
    let metrics = ctx.measureText(letters[i]);
    h = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    w = metrics.width;
    if (i == 0) base_y = y1 + h;
    x = i == 0 ? x : x + prev_w + textSetting1.spacing;
    y = i == 0 ? y1 : base_y - h - i * 0.5;
    prev_w = w;
    ctx.transform(1, -0.02, -0.01, 1, x, y);
    ctx.fillText(letters[i], 0, 0);
    ctx.restore();
  }
  w = 0;
  h = 0;
  prev_w = 0;
  y = 0;
  x = x2;
  base_y = y2;
  letters = text2.split("");
  for (let i = 0; i < letters.length; i++) {
    ctx.fillStyle = textSetting2.color;
    ctx.font = `${textSetting2.weight} ${size2 + i * 0.8}pt ${
      textSetting2.family
    }`;
    ctx.textBaseline = textSetting2.baseline;
    ctx.textAlign = textSetting2.align;
    ctx.save();
    let metrics = ctx.measureText(letters[i]);
    h = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    w = metrics.width;
    if (i == 0) base_y = y2;
    x = i == 0 ? x : x + prev_w + textSetting2.spacing;
    y = i == 0 ? y2 : base_y - i * 0.3;
    prev_w = w;
    ctx.transform(1, 0.01, -0.01, 1, x, y);
    ctx.fillText(letters[i], 0, 0);
    ctx.restore();
  }
};

const addRotatedText = (text, _sig, x, y, size, degree) => {
  ctx.fillStyle = text.color;
  ctx.font = `${text.weight} ${size}pt ${text.family}`;
  ctx.textBaseline = text.baseline;
  ctx.textAlign = text.align;
  ctx.save();
  ctx.translate(text.xPos, text.yPos);
  ctx.rotate((2 * Math.PI * degree) / 360);
  ctx.transform(1, 0.0, -0.02, 0.8, 0, 0);
  ctx.fillText(_sig, 0, 0);
  ctx.restore();
};

const drawFrontImage = (_renderObject) => {
  ctx.save();
  drawTriangle(
    ctx,
    _renderObject.loadedImage,
    imageSetting.x1,
    imageSetting.y1,
    imageSetting.x2,
    imageSetting.y2,
    imageSetting.x3,
    imageSetting.y3,
    0,
    0,
    _renderObject.loadedImage.width,
    0,
    0,
    _renderObject.loadedImage.height
  );
  drawTriangle(
    ctx,
    _renderObject.loadedImage,
    imageSetting.x4,
    imageSetting.y4,
    imageSetting.x2,
    imageSetting.y2,
    imageSetting.x3,
    imageSetting.y3,
    _renderObject.loadedImage.width,
    _renderObject.loadedImage.height,
    _renderObject.loadedImage.width,
    0,
    0,
    _renderObject.loadedImage.height
  );
  ctx.restore();
};

const drawLogo = (_logo) => {
  ctx.save();
  ctx.transform(1, -0.2, -0.01, 1, 0, 0);
  ctx.drawImage(
    _logo.loadedImage,
    logoSetting.logoX,
    logoSetting.logoY,
    logoSetting.logoWidth,
    logoSetting.logoHeight
  );
  ctx.restore();
};

const drawSideLogo = (_logo) => {
  ctx.save();
  ctx.transform(0.8, 0.08, -0.01, 1, 0, 0);
  ctx.drawImage(
    _logo.loadedImage,
    sideLogoSetting.xPos,
    sideLogoSetting.yPos,
    sideLogoSetting.width,
    sideLogoSetting.height
  );
  ctx.restore();
};

const startCreating = async () => {
  var files = fs
    .readdirSync(imagesDir)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .filter((item) => /\w+.png/g.test(item));
  let logoElement = loadLayerImg(`${dataDir}/logo.png`);
  let backgroundElement = loadLayerImg(`${dataDir}/background.png`);
  backgroundElement.then((backgroundImage) => {
    logoElement.then((logoImage) => {
      files.forEach((filename) => {
        let title1 = "";
        let title2 = "";
        let sideLogoPath = "";
        let synthesisData = jsonData.filter((v) => v.image === filename);
        if (synthesisData.length > 0) {
          title1 = synthesisData[0].title1;
          title2 = synthesisData[0].title2;
          title3 =
            title1.charAt(0).toUpperCase() + title1.slice(1).toLowerCase();
          title4 =
            title2.charAt(0).toUpperCase() + title2.slice(1).toLowerCase();
          sideLogoPath = `${sideLogoDir}/${synthesisData[0].sidelogo}`;
        }
        let loadedElement = loadLayerImg(`${imagesDir}/${filename}`);
        loadedElement.then((image) => {
          ctx.clearRect(
            0,
            0,
            backgroundSetting.width,
            backgroundSetting.height
          );
          drawBackground(backgroundImage);
          drawFrontImage(image);
          drawLogo(logoImage);
          addText(
            text1Setting,
            title1,
            text1Setting.xPos,
            text1Setting.yPos,
            text1Setting.size,
            text2Setting,
            title2,
            text2Setting.xPos,
            text2Setting.yPos,
            text2Setting.size
          );
          // addText(
          //   text2Setting,
          //   title2,
          //   text2Setting.xPos,
          //   text2Setting.yPos,
          //   text2Setting.size,
          //   -0.008
          // );
          addRotatedText(
            text3Setting,
            title3,
            text3Setting.xPos,
            text3Setting.yPos,
            text3Setting.size,
            -90
          );
          addRotatedText(
            text4Setting,
            title4,
            text4Setting.xPos,
            text4Setting.yPos,
            text4Setting.size,
            -90
          );
          let sideLogoElement = loadLayerImg(sideLogoPath);
          sideLogoElement
            .then((sidelogo) => {
              drawSideLogo(sidelogo);
              saveImage(filename);
            })
            .catch((error) => {
              alert("can not find side log file " + sideLogoPath);
              saveImage(filename);
            });
        });
      });
    });
  });
};

var drawTriangle = function (
  ctx,
  im,
  x0,
  y0,
  x1,
  y1,
  x2,
  y2,
  sx0,
  sy0,
  sx1,
  sy1,
  sx2,
  sy2
) {
  ctx.save();

  // Clip the output to the on-screen triangle boundaries.
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.closePath();
  //ctx.stroke();//xxxxxxx for wireframe
  ctx.clip();

  // TODO: eliminate common subexpressions.
  var denom = sx0 * (sy2 - sy1) - sx1 * sy2 + sx2 * sy1 + (sx1 - sx2) * sy0;
  if (denom == 0) {
    return;
  }
  var m11 = -(sy0 * (x2 - x1) - sy1 * x2 + sy2 * x1 + (sy1 - sy2) * x0) / denom;
  var m12 = (sy1 * y2 + sy0 * (y1 - y2) - sy2 * y1 + (sy2 - sy1) * y0) / denom;
  var m21 = (sx0 * (x2 - x1) - sx1 * x2 + sx2 * x1 + (sx1 - sx2) * x0) / denom;
  var m22 = -(sx1 * y2 + sx0 * (y1 - y2) - sx2 * y1 + (sx2 - sx1) * y0) / denom;
  var dx =
    (sx0 * (sy2 * x1 - sy1 * x2) +
      sy0 * (sx1 * x2 - sx2 * x1) +
      (sx2 * sy1 - sx1 * sy2) * x0) /
    denom;
  var dy =
    (sx0 * (sy2 * y1 - sy1 * y2) +
      sy0 * (sx1 * y2 - sx2 * y1) +
      (sx2 * sy1 - sx1 * sy2) * y0) /
    denom;

  ctx.transform(m11, m12, m21, m22, dx, dy);

  ctx.drawImage(im, 0, 0);
  ctx.restore();
};

module.exports = { startCreating, buildSetup };
