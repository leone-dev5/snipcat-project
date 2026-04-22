const handles = document.querySelectorAll(".handle");
const grids = document.querySelectorAll(".grip");

const MIN = 40;

let active = null;
let start = { x: 0, y: 0, w: 0, h: 0, l: 0, t: 0 };

const getEventPoint = e => e.touches ? e.touches[0] : e;

function stopResize() {
  active = null;
  ['mousemove', 'mouseup', 'touchmove', 'touchend'].forEach(event =>
    window.removeEventListener(event, arguments.callee.caller === resize ? resize : stopResize)
  );
}

function startResize(e, handle) {
  e.preventDefault();
  active = handle.classList[1];
  const point = getEventPoint(e);
  
  start.x = point.clientX;
  start.y = point.clientY;
  start.w = boxWorkers.offsetWidth;
  start.h = boxWorkers.offsetHeight;
  start.l = boxWorkers.offsetLeft;
  start.t = boxWorkers.offsetTop;
  
  window.addEventListener("mousemove", resize);
  window.addEventListener("mouseup", stopResize);
  window.addEventListener("touchmove", resize, { passive: false });
  window.addEventListener("touchend", stopResize);
  
}

function resize(e) {
  if (!active) return;
  e.preventDefault();
  
  const point = getEventPoint(e);
  const dx = point.clientX - start.x;
  const dy = point.clientY - start.y;
  
  const actions = {
    right: () => boxWorkers.style.width = Math.max(MIN, start.w + dx) + "px",
    left: () => {
      if (start.w - dx >= MIN) {
        boxWorkers.style.width = (start.w - dx) + "px";
        boxWorkers.style.left = (start.l + dx) + "px";
      }
    },
    bottom: () => boxWorkers.style.height = Math.max(MIN, start.h + dy) + "px",
    top: () => {
      if (start.h - dy >= MIN) {
        boxWorkers.style.height = (start.h - dy) + "px";
        boxWorkers.style.top = (start.t + dy) + "px";
      }
    }
  };
  
  actions[active]?.();
}


// Event listeners
handles.forEach(h => {
  h.addEventListener("mousedown", e => startResize(e, h));
  h.addEventListener("touchstart", e => startResize(e, h), { passive: false });
});

// Aplicar configurações
const linesOn = localStorage.getItem("linesOn") === "true";

const linesOff = localStorage.getItem("linesOn");

if (linesOff === "false") {
  
  grids.forEach(g => {
    
    g.style.display = "none";
    
  });
  
}

handles.forEach(h => {
  
  h.style.display = linesOn ? "block" : "none";
  
  h.style.border = linesOn ? "2px dashed white" : "none";
  
  document.getElementById("work-image").addEventListener('dblclick', () => {
    
    h.style.display = linesOn ? "none" : "block";
    
  });
  
  document.getElementById("workspace").addEventListener('click', () => {
    
    h.style.display = linesOn ? "flex" : "none";
    
  });
  
});

handles.forEach(h => {
  
  
  
  h.addEventListener('click', () => {
    boxWorkers.removeEventListener('mousedown', mouseDownHandler);
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    
    boxWorkers.removeEventListener('touchstart', touchStartHandler);
    boxWorkers.removeEventListener('touchmove', touchMoveHandler);
    boxWorkers.removeEventListener('touchend', touchEndHandler);
  });
  
});

//Essa parte são criadas as bordas do workspace ainda em desenvolvimento.