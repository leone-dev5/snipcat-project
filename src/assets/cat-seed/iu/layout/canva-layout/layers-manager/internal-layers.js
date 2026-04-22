const canvas = document.getElementById('work-image');
const ctx = canvas.getContext('2d');
const input = document.getElementById('inputImagem');
const botao = document.getElementById('matters');
const buttonOn = document.getElementById("button-active");

const CONFIG = {
    HANDLE_SIZE: 20,
    MIN_SIZE: 50,
    ROTATION_HANDLE_DIST: 40,
    COLORS: {
        PRIMARY: "#0066ff",
        LOCKED: "#ff0000"
    }
};

const RESIZE_HANDLES = [
    { x: -1, y: -1 },
    { x:  1, y: -1 },
    { x:  1, y:  1 },
    { x: -1, y:  1 },
    { x:  0, y: -1 },
    { x:  1, y:  0 },
    { x:  0, y:  1 },
    { x: -1, y:  0 }  
];

const AppState = {
    layers: [],
    selectedIndex: null,
    isLocked: true,
    interaction: {
        type: null,
        activeHandle: null,
        startX: 0,
        startY: 0,
        startAngle: 0,
        initialDist: 0,
        startLayer: null
    }
};

class Layer {
    constructor(img, x, y) {
        this.img = img;
        this.id = Math.random().toString(36);
        this.aspectRatio = img.width / img.height;
        this.width = Math.min(img.width, 300);
        this.height = this.width / this.aspectRatio;
        this.x = x;
        this.y = y;
        this.rotation = 0;
    }

    getLocalCoords(globalX, globalY) {
        const dx = globalX - this.x;
        const dy = globalY - this.y;
        const cos = Math.cos(-this.rotation);
        const sin = Math.sin(-this.rotation);
        return {
            x: dx * cos - dy * sin,
            y: dx * sin + dy * cos
        };
    }

    draw(ctx, isSelected, isLocked) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);

        if (isSelected) {
            this.drawControls(ctx, isLocked);
        }
        ctx.restore();
    }

    drawControls(ctx, isLocked) {
        const theme = isLocked ? CONFIG.COLORS.LOCKED : CONFIG.COLORS.PRIMARY;
        const w2 = this.width / 2;
        const h2 = this.height / 2;

        ctx.lineWidth = 2;
        ctx.strokeStyle = theme;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(-w2, -h2, this.width, this.height);
        ctx.setLineDash([]);

        ctx.fillStyle = "#ffffff";
        RESIZE_HANDLES.forEach((h) => {
            ctx.beginPath();
            ctx.arc(h.x * w2, h.y * h2, CONFIG.HANDLE_SIZE / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });

        const rotY = -h2 - CONFIG.ROTATION_HANDLE_DIST;
        ctx.beginPath();
        ctx.moveTo(0, -h2);
        ctx.lineTo(0, rotY);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(0, rotY, CONFIG.HANDLE_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = theme;
        ctx.beginPath();
        ctx.arc(0, rotY, CONFIG.HANDLE_SIZE / 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

function getDistance(t1, t2) {
    return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
}
function getTouchAngle(t1, t2) {
    return Math.atan2(t1.clientY - t2.clientY, t1.clientX - t2.clientX);
}

function getPointerCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
    };
}

function checkHitTest(x, y) {
    if (AppState.selectedIndex !== null) {
        const l = AppState.layers[AppState.selectedIndex];
        const local = l.getLocalCoords(x, y);
        const w2 = l.width / 2;
        const h2 = l.height / 2;
        
        if (Math.hypot(local.x, local.y - (-h2 - CONFIG.ROTATION_HANDLE_DIST)) < CONFIG.HANDLE_SIZE) {
            return { type: 'rotating' };
        }
        
        for (let i = 0; i < RESIZE_HANDLES.length; i++) {
            const h = RESIZE_HANDLES[i];
            if (Math.hypot(local.x - (h.x * w2), local.y - (h.y * h2)) < CONFIG.HANDLE_SIZE) {
                return { type: 'resizing', handleIndex: i };
            }
        }
    }

    for (let i = AppState.layers.length - 1; i >= 0; i--) {
        const l = AppState.layers[i];
        const local = l.getLocalCoords(x, y);
        if (local.x >= -l.width/2 && local.x <= l.width/2 &&
            local.y >= -l.height/2 && local.y <= l.height/2) {
            return { type: 'moving', index: i };
        }
    }
    return null;
}

function onPointerDown(e) {
    if (AppState.isLocked && !e.touches) return;

    if (e.touches && e.touches.length === 2 && AppState.selectedIndex !== null) {
        e.preventDefault();
        const layer = AppState.layers[AppState.selectedIndex];
        AppState.interaction.type = 'pinching';
        AppState.interaction.initialDist = getDistance(e.touches[0], e.touches[1]);
        AppState.interaction.startAngle = getTouchAngle(e.touches[0], e.touches[1]);
        AppState.interaction.startLayer = { ...layer };
        return;
    }

    const pos = getPointerCoords(e);
    const hit = checkHitTest(pos.x, pos.y);

    if (hit) {
        if (hit.type === 'moving') {
            const layer = AppState.layers.splice(hit.index, 1)[0];
            AppState.layers.push(layer);
            AppState.selectedIndex = AppState.layers.length - 1;
        }

        const layer = AppState.layers[AppState.selectedIndex];
        AppState.interaction.type = hit.type;
        AppState.interaction.activeHandle = hit.handleIndex;
        AppState.interaction.startX = pos.x;
        AppState.interaction.startY = pos.y;
        AppState.interaction.startLayer = { x: layer.x, y: layer.y, width: layer.width, height: layer.height, rotation: layer.rotation };

        if (hit.type === 'rotating') {
            AppState.interaction.startAngle = Math.atan2(pos.y - layer.y, pos.x - layer.x) - layer.rotation;
        }
    } else {
        AppState.selectedIndex = null;
    }
}

function onPointerMove(e) {
    if (AppState.isLocked || !AppState.interaction.type || AppState.selectedIndex === null) return;
    e.preventDefault();

    const layer = AppState.layers[AppState.selectedIndex];

    if (AppState.interaction.type === 'pinching' && e.touches && e.touches.length === 2) {
        const dist = getDistance(e.touches[0], e.touches[1]);
        const angle = getTouchAngle(e.touches[0], e.touches[1]);
        const scale = dist / AppState.interaction.initialDist;
        
        layer.width = Math.max(CONFIG.MIN_SIZE, AppState.interaction.startLayer.width * scale);
        layer.height = Math.max(CONFIG.MIN_SIZE, AppState.interaction.startLayer.height * scale);
        layer.rotation = AppState.interaction.startLayer.rotation + (angle - AppState.interaction.startAngle);
        return;
    }

    const pos = getPointerCoords(e);
    const start = AppState.interaction.startLayer;

    if (AppState.interaction.type === 'moving') {
        layer.x = start.x + (pos.x - AppState.interaction.startX);
        layer.y = start.y + (pos.y - AppState.interaction.startY);
    } 
    else if (AppState.interaction.type === 'rotating') {
        layer.rotation = Math.atan2(pos.y - layer.y, pos.x - layer.x) - AppState.interaction.startAngle;
    } 
    else if (AppState.interaction.type === 'resizing') {
        
        const handle = RESIZE_HANDLES[AppState.interaction.activeHandle];
        const dx = pos.x - AppState.interaction.startX;
        const dy = pos.y - AppState.interaction.startY;

        const cos = Math.cos(-start.rotation);
        const sin = Math.sin(-start.rotation);
        const localDx = dx * cos - dy * sin;
        const localDy = dx * sin + dy * cos;

        let deltaW = handle.x !== 0 ? localDx * handle.x : 0;
        let deltaH = handle.y !== 0 ? localDy * handle.y : 0;

        let newW = start.width + deltaW;
        let newH = start.height + deltaH;

        if (newW < CONFIG.MIN_SIZE) { newW = CONFIG.MIN_SIZE; deltaW = newW - start.width; }
        if (newH < CONFIG.MIN_SIZE) { newH = CONFIG.MIN_SIZE; deltaH = newH - start.height; }

        layer.width = newW;
        layer.height = newH;

        const localCx = (deltaW / 2) * handle.x;
        const localCy = (deltaH / 2) * handle.y;

        const globalCx = localCx * Math.cos(start.rotation) - localCy * Math.sin(start.rotation);
        const globalCy = localCx * Math.sin(start.rotation) + localCy * Math.cos(start.rotation);

        layer.x = start.x + globalCx;
        layer.y = start.y + globalCy;
    }
}

function onPointerUp() {
    AppState.interaction.type = null;
}

canvas.addEventListener("mousedown", onPointerDown);
window.addEventListener("mousemove", onPointerMove);
window.addEventListener("mouseup", onPointerUp);

canvas.addEventListener("touchstart", onPointerDown, { passive: false });
window.addEventListener("touchmove", onPointerMove, { passive: false });
window.addEventListener("touchend", onPointerUp);

botao.addEventListener('click', () => input.click());
buttonOn.addEventListener('click', () => AppState.isLocked = false);

document.querySelectorAll("button").forEach(btn => {
    if (btn.id !== "button-active" && btn.id !== "matters") {
        btn.addEventListener("click", () => AppState.isLocked = true);
    }
});

input.addEventListener('change', (e) => {
    const files = e.target.files;
    if (!files.length) return;
    
    Array.from(files).forEach(file => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            const layer = new Layer(img, canvas.width / 2, canvas.height / 2);
            AppState.layers.push(layer);
            AppState.selectedIndex = AppState.layers.length - 1;
        };
    });
});

function renderLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    AppState.layers.forEach((layer, index) => {
        layer.draw(ctx, index === AppState.selectedIndex, AppState.isLocked);
    });
    requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);
