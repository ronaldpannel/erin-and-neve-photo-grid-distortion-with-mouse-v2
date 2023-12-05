/**@type{HTMLCanvasElement} */
class Cell {
  constructor(effect, x, y, index) {
    this.effect = effect;
    this.index = index
    this.x = x;
    this.y = y;
    this.positionX = this.effect.width * 0.5;
    this.positionY = this.effect.height * 0.5;
    this.speedX;
    this.speedY;
    this.width = this.effect.cellWidth;
    this.height = this.effect.cellHeight;
    this.image = document.getElementById("erinImg");
    this.slideX = 0;
    this.slideY = 0;
    this.vx = 0;
    this.vy = 0;
    this.ease = 0.012;
    this.friction = 0.985;
    this.randomize = Math.random() * 50 + 2;
    this.start()
  }
  draw(context) {
    context.drawImage(
      this.image,
      this.x + this.slideX,
      this.y + this.slideY,
      this.width,
      this.height,
      this.positionX,
      this.positionY,
      this.width,
      this.height
    );
    // context.strokeStyle = "white";
    // context.rect(this.positionX, this.positionY, this.width, this.height);
    // context.stroke();
  }
  start(){
     this.speedX = (this.x - this.positionX) / this.randomize;
     this.speedY = (this.y - this.positionY) / this.randomize;
  }
  update() {
    //cell position
    if (Math.abs(this.speedX) > 0.01 || Math.abs(this.speedY) > 0.01) {
      this.speedX = (this.x - this.positionX) / this.randomize;
      this.speedY = (this.y - this.positionY) / this.randomize;
      this.positionX += this.speedX;
      this.positionY += this.speedY;
    }

    this.dx = this.effect.pointer.x - this.x;
    this.dy = this.effect.pointer.y - this.y;
    const distance = Math.hypot(this.dx, this.dy);
    if (distance < this.effect.pointer.radius) {
      let angle = Math.atan2(this.dy, this.dx);
      const force = distance / this.effect.pointer.radius;

      this.vx = force * Math.cos(angle);
      this.vy = force * Math.sin(angle);
    }

    this.slideX += (this.vx *= this.friction) - this.slideX * this.ease;
    this.slideY += (this.vy *= this.friction) - this.slideY * this.ease;
  }
}

class Effect {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.cellWidth = this.width / 25;
    this.cellHeight = this.height / 40;
    this.imageGrid = [];
    this.createGrid();
    this.cell = new Cell(this, 0, 0);

    this.pointer = {
      x: undefined,
      y: undefined,
      radius: 75,
    };
    this.canvas.addEventListener("pointermove", (e) => {
      this.pointer.x = e.offsetX;
      this.pointer.y = e.offsetY;
    });
    this.canvas.addEventListener("pointerleave", (e) => {
      this.pointer.x = undefined;
      this.pointer.y = undefined;
    });
  }
  createGrid() {
    for (let x = 0; x < this.width; x += this.cellWidth) {
      for (let y = 0; y < this.height; y += this.cellHeight) {
        this.imageGrid.push(new Cell(this, x, y));
      }
    }
  }

  render(context) {
    let index = 0
    this.imageGrid.forEach((cell, i) => {
      index++
      cell.draw(context);
      cell.update();
    });
  }
}

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 700;

  const effect = new Effect(canvas);
  effect.render(ctx);

  function animate() {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.render(ctx);

    requestAnimationFrame(animate);
  }
  animate();

  //load function end
});
