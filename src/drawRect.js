export default function DrawRect (x, y, width, height, canvas) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.canvas = canvas;
}

DrawRect.prototype.draw = function() {
  let context = this.canvas.getContext('2d');

  context.beginPath();
  context.fillStyle = 'rgba(102, 170, 255, .2)';
  context.fillRect(this.x, this.y, this.width, this.height);

  context.beginPath();
  context.strokeStyle = 'rgba(102, 170, 255)';
  context.strokeRect(this.x, this.y, this.width, this.height);

  context.beginPath();
  context.arc(this.x, this.y+this.height/2, 2.5, 0, Math.PI*2, true);
  context.strokeStyle = 'rgb(102, 170, 255)';
  context.stroke();
  context.fillStyle = 'rgb(255, 255, 255)';
  context.fill();
  
  context.beginPath();
  context.arc(this.x+this.width, this.y+this.height/2, 2.5, 0, Math.PI*2, true);
  context.strokeStyle = 'rgb(102, 170, 255)';
  context.stroke();
  context.fillStyle = 'rgb(255, 255, 255)';
  context.fill();
  
  context.beginPath();
  context.arc(this.x+this.width/2, this.y, 2.5, 0, Math.PI*2, true);
  context.strokeStyle = 'rgb(102, 170, 255)';
  context.stroke();
  context.fillStyle = 'rgb(255, 255, 255)';
  context.fill();
  
  context.beginPath();
  context.arc(this.x+this.width/2, this.y+this.height, 2.5, 0, Math.PI*2, true);
  context.strokeStyle = 'rgb(102, 170, 255)';
  context.stroke();
  context.fillStyle = 'rgb(255, 255, 255)';
  context.fill();
  context.closePath();

}