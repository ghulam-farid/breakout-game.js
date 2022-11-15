/* 
   Step to create a canvas
* 1. Create canva context
* 2. Create and draw ball
* 3. Create and draw paddle
* 4. Create bricks
* 5. Draw score
* 6. Add update() - Animate - requestAnimationFrame(update)
* 7. Move paddle
* 8. Keyboard event handlers to move paddle
* 9. Move ball
* 10. Add wall bounderies
* 11. Increase score when ball hits brick
* 12. lose - redraw bricks, reset score
*/

const rules_btn = document.querySelector("#rules-btn");
const close_btn = document.querySelector("#close-btn");
const rules = document.querySelector("#rules");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

let score = 1;
let brick_row_count = 9;
let brick_column_count = 5;

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 90,
  h: 15,
  speed: 8,
  dx: 0,
};

const brick = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

let bricks = [];

for (let i = 0; i < brick_row_count; i++) {
  bricks[i] = [];
  for (let j = 0; j < brick_column_count; j++) {
    const x = i * (brick.w + brick.padding) + brick.offsetX;
    const y = j * (brick.h + brick.padding) + brick.offsetY;
    bricks[i][j] = { x, y, ...brick };
  }
}

const drawBall = () => {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
};

const drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
};

const drawScore = () => {
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
};

const drawBricks = () => {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#0095dd" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
};

const movePaddle = () => {
  paddle.x += paddle.dx;

  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
};

const moveBall = () => {
  ball.x += ball.dx;
  ball.y += ball.dy;
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.h
        ) {
          ball.dy *= -1;
          brick.visible = false;
            increaseScore();
        }
      }
    });
  });

   if (ball.y + ball.size > canvas.height) {
      showAllBricks();
      score = 0;
   }

};

const increaseScore = () => {
   score++;
   if (score % (brick_row_count * brick_column_count) === 0) {
      showAllBricks();
   }
};

const showAllBricks = () => {
   bricks.forEach((column) => {
      column.forEach((brick) => (brick.visible = true));
   });
};

const update = () => {
  movePaddle();
  moveBall();
  draw();
  requestAnimationFrame(update);
};
update();

const keydown = (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
};

const keyup = (e) => {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
};
document.addEventListener("keydown", keydown);
document.addEventListener("keyup", keyup);

rules_btn.addEventListener("click", () => rules.classList.add("show"));
close_btn.addEventListener("click", () => rules.classList.remove("show"));
