const boxWorkers = document.getElementById("box-work");

let isDragging = false;
let isPinching = false;

const MIN_WIDTH = 100;
const MIN_HEIGHT = 100;
const MAX_WIDTH = 550;
const MAX_HEIGHT = 550;

// ===== Utilitário =====
function getDistance(t1, t2) {
  const dx = t2.clientX - t1.clientX;
  const dy = t2.clientY - t1.clientY;
  return Math.hypot(dx, dy);
}


// ===== HANDLERS =====
function mouseDownHandler(e) {
  isDragging = true;
  offsetX = e.clientX - boxWorkers.offsetLeft;
  offsetY = e.clientY - boxWorkers.offsetTop;
}

function mouseMoveHandler(e) {
  if (!isDragging || isPinching) return;
  boxWorkers.style.left = (e.clientX - offsetX) + 'px';
  boxWorkers.style.top = (e.clientY - offsetY) + 'px';
}

function mouseUpHandler() {
  isDragging = false;
}

function touchStartHandler(e) {
  if (e.touches.length === 1) {
    isDragging = true;
    isPinching = false;
    const touch = e.touches[0];
    offsetX = touch.clientX - boxWorkers.offsetLeft;
    offsetY = touch.clientY - boxWorkers.offsetTop;
  }
  
  if (e.touches.length === 2) {
    isDragging = false;
    isPinching = true;
  }
}

function touchMoveHandler(e) {
  if (isPinching && e.touches.length === 2) {
    e.preventDefault();
    const currentDistance = getDistance(e.touches[0], e.touches[1]);
  }
  
  if (isDragging && e.touches.length === 1) {
    e.preventDefault();
    const touch = e.touches[0];
    boxWorkers.style.left = (touch.clientX - offsetX) + "px";
    boxWorkers.style.top = (touch.clientY - offsetY) + "px";
  }
}

function touchEndHandler(e) {
  if (e.touches.length === 0) {
    isDragging = false;
    isPinching = false;
  }
}
function stopMove() {
  
  boxWorkers.removeEventListener('mousedown', mouseDownHandler);
  document.removeEventListener('mousemove', mouseMoveHandler);
  document.removeEventListener('mouseup', mouseUpHandler);
  
  boxWorkers.removeEventListener('touchstart', touchStartHandler, { passive: false });
  boxWorkers.removeEventListener('touchmove', touchMoveHandler, { passive: false });
  boxWorkers.removeEventListener('touchend', touchEndHandler);
  
}

canvas.addEventListener("click", () => {
  
  stopMove();
  
});

