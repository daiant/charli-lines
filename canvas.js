// const Color = {
//   Red: 0,
//   Green: 1,
//   Blue: 2,
// }

// function getColor(color) {
//   switch (color) {
//     case Color.Red: return 'rgba(253, 40, 252, 0.7)';
//     case Color.Green: return 'rgba(255, 253, 56, 0.7)';
//     case Color.Blue: return 'rgba(45, 255, 254, 0.7)';
//   }
// }

class Canvas {
  canvas;
  ctx;
  width = 800;
  height = 800;
  interval = { x: 5, y: 10 };
  sensitivity = 5;
  lineWidth = 2;
  opacity = 255;
  _src;
  color = {
    red: '#fd28fc',
    green: '#fffd38',
    blue: '#315e5e',
  }
  constructor() {
    this.canvas = document.querySelector('#canvas');
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
  }
  reset() {
    this.ctx.fillRect(0, 0, this.width, this.height);
  }
  update() {
    this.toCanvas(this._src);
  }
  setLineWidth(width) {
    this.lineWidth = width;
    this.update();
  }
  setColor(of, color) {
    if (!['red', 'green', 'blue'].includes(of)) return;
    this.color[of] = color;
    this.update();
  }
  setSensitivity(s) {
    this.sensitivity = s;
    this.update();
  }
  setOpacity(o) {
    this.opacity = o;
    this.update();
  }
  toCanvas(src) {
    this._src = src;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.width = this.width;
    img.height = this.height;
    img.src = src;
    img.addEventListener("load", () => {
      this.ctx.drawImage(img, 0, 0);
      const data = this.getImageData();
      this.ctx.fillRect(0, 0, this.width, this.height);

      this.printImageData(data, 0, this.color.red);
      this.printImageData(data, 1, this.color.green);
      this.printImageData(data, 2, this.color.blue);
      img.style.display = "none";
    });
  }
  getImageData() {
    const res = [];
    for (let y = 0; y <= this.height; y += this.interval.y) {
      const row_data = [];
      for (let x = 0; x <= this.width; x += this.interval.x) {
        const { data } = this.ctx.getImageData(x, y, 1, 1)
        row_data.push([data[0] / 255, data[1] / 255, data[2] / 255]);
      }
      res.push(row_data);
    }
    return res;
  }
  printImageData(data, color_position, color) {
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeStyle = color + this.decimalToHex(this.opacity);
    for (let y = 0; y <= this.height; y += this.interval.y) {
      this.ctx.beginPath(); // Start a new path
      this.ctx.moveTo(0, y);
      for (let x = 0; x <= this.width; x += this.interval.x) {
        const positionx = x / this.interval.x;
        const positiony = y / this.interval.y;
        this.ctx.lineTo(x, y + data[positiony][positionx][color_position] * this.sensitivity);
      }
      this.ctx.stroke();
    }
  }
  decimalToHex(d) {
    var hex = Number(d).toString(16);

    while (hex.length < 2) {
      hex = "0" + hex;
    }
    return hex;
  }
}