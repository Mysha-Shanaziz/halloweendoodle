const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ghosts = [];
let particles = [];
let drawing = false;
let path = [];
let score = 0;
let health = 3;

// Spawn ghosts
function spawnGhost() {
  ghosts.push({
    x: Math.random() * 800 + 50,
    y: -50,
    r: 20,
    speed: Math.random() * 1 + 0.5
  });
}
setInterval(spawnGhost, 1200);

// Get mouse/touch position
function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  if (e.touches) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    };
  }
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

// Mouse controls
canvas.addEventListener("mousedown", () => {
  drawing = true;
  path = [];
});
canvas.addEventListener("mouseup", () => {
  drawing = false;
  recognizeGesture();
});
canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  path.push(getPos(e));
});

// Touch controls
canvas.addEventListener("touchstart", () => {
  drawing = true;
  path = [];
});
canvas.addEventListener("touchend", () => {
  drawing = false;
  recognizeGesture();
});
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (!drawing) return;
  path.push(getPos(e));
});

// Gesture recognition
function recognizeGesture() {
  if (path.length < 10) return;

  const start = path[0];
  const end = path[path.length - 1];

  const dx = start.x - end.x;
  const dy = start.y - end.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Circle spell
  if (dist < 30) {
    ghosts = [];
    explode(start.x, start.y);
  }
  // Lightning spell
  else {
    ghosts.forEach(g => {
      if (Math.abs(g.x - start.x) < 50) {
        explode(g.x, g.y);
        score++;
      }
    });
    ghosts = ghosts.filter(g => Math.abs(g.x - start.x) >= 50);
  }
}

// Particle effect
function explode(x, y) {
  for (let i = 0; i < 20; i++) {
    particles.push({
      x: x,
      y: y,
      dx: (Math.random() - 0.5) * 4,
      dy: (Math.random() - 0.5) * 4,
      life: 30
    });
  }
}

// Update game
function update() {
  ghosts.forEach(g => {
    g.y += g.speed;

    if (g.y > canvas.height) {
      health--;
      document.getElementById("health").innerText = "❤️ " + health;
      g.y = -50;
    }
  });

  particles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;
    p.life--;
  });

  particles = particles.filter(p => p.life > 0);
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Ghosts
  ghosts.forEach(g => {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(g.x - 5, g.y - 5, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(g.x + 5, g.y - 5, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw path
  if (path.length > 1) {
    ctx.strokeStyle = "cyan";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    path.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();
  }

  // Particles
  particles.forEach(p => {
    ctx.fillStyle = "orange";
    ctx.fillRect(p.x, p.y, 3, 3);
  });

  // Score
  document.getElementById("score").innerText = "Score: " + score;
}

// Game loop
function loop() {
  update();
  draw();

  if (health <= 0) {
    alert("Game Over! Score: " + score);
    location.reload();
  }

  requestAnimationFrame(loop);
}

loop();
