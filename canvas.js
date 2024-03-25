class Canvas {
  canvas;
  ctx;
  width = 800;
  height = 800;
  interval = { x: 5, y: 10 };
  intensity = 5;
  lineWidth = 2;
  opacity = 255;
  threshold = 0.01;
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
  setThreshold(t) {
    this.threshold = t;
    this.update();
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
  setIntensity(s) {
    this.intensity = s;
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
    img.src = src;
    img.addEventListener("load", () => {
      this.width = img.width;
      this.height = img.height;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
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
        const color_data = data[positiony][positionx][color_position];
        if (color_data < this.threshold) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y + color_data * this.intensity);
        }
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