const CropModule = {
    isActived: false,
    area: { x: 0, y: 0, w: 100, h: 100 },
    
    start(layer) {
        if (!layer) return;
        this.isActived = true;
        
        this.area = {
            x: (layer.img.width / 2) - 100,
            y: (layer.img.height / 2) - 100,
            w: 200,
            h: 200
        };
        console.log("Modo de corte ativado. Use as teclas WASD ou setas para ajustar o tamanho");
        console.log("Pressione Enter para aplicar o corte ou Esc para cancelar");
    },

    apply(layer) {
        if (!this.isActived || !layer) return;

        const offCanvas = document.createElement('canvas');
        const offCtx = offCanvas.getContext('2d');
        
        // Garantir que a área não ultrapasse os limites da imagem
        this.area.x = Math.max(0, Math.min(this.area.x, layer.img.width - this.area.w));
        this.area.y = Math.max(0, Math.min(this.area.y, layer.img.height - this.area.h));
        this.area.w = Math.min(this.area.w, layer.img.width - this.area.x);
        this.area.h = Math.min(this.area.h, layer.img.height - this.area.y);

        offCanvas.width = this.area.w;
        offCanvas.height = this.area.h;

        offCtx.drawImage(
            layer.img, 
            this.area.x, this.area.y, this.area.w, this.area.h, 
            0, 0, this.area.w, this.area.h                   
        );

        const croppedImg = new Image();
        croppedImg.src = offCanvas.toDataURL();

        croppedImg.onload = () => {
            layer.img = croppedImg;
            layer.width = this.area.w;
            layer.height = this.area.h;
            layer.aspectRatio = this.area.w / this.area.h;
            
            this.isActived = false;
            AppState.moveLock = false; // Destravar movimento ao terminar
            if (typeof rendee === 'function') rendee();
        };
    },

    cancel() {
        this.isActived = false;
        AppState.moveLock = false;
        console.log("Modo de corte cancelado");
        if (typeof rendee === 'function') rendee();
    },

    updateArea(dx, dy, dw, dh) {
        const layer = AppState.layers[AppState.selectLayers];
        if (!layer) return;

        // Atualizar posição
        if (dx || dy) {
            this.area.x += dx || 0;
            this.area.y += dy || 0;
        }
        
        // Atualizar tamanho
        if (dw || dh) {
            this.area.w += dw || 0;
            this.area.h += dh || 0;
        }

        // Limitar área aos bounds da imagem
        this.area.x = Math.max(0, Math.min(this.area.x, layer.img.width - this.area.w));
        this.area.y = Math.max(0, Math.min(this.area.y, layer.img.height - this.area.h));
        this.area.w = Math.max(50, Math.min(this.area.w, layer.img.width - this.area.x));
        this.area.h = Math.max(50, Math.min(this.area.h, layer.img.height - this.area.y));

        if (typeof rendee === 'function') rendee();
    },

    drawPreview(ctx, layer) {
        if (!this.isActived || !layer) return;

        ctx.save();
        
        // Escurecer tudo fora da área de corte
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const scaleX = layer.width / layer.img.width;
        const scaleY = layer.height / layer.img.height;

        const screenX = layer.x + (this.area.x * scaleX);
        const screenY = layer.y + (this.area.y * scaleY);
        const screenW = this.area.w * scaleX;
        const screenH = this.area.h * scaleY;

        // "Limpa" a área de corte (abre um buraco no escuro)
        ctx.clearRect(screenX, screenY, screenW, screenH);
        
        // Desenha borda da área de corte
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(screenX, screenY, screenW, screenH);
        
        // Adicionar indicadores nos cantos
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(screenX - 3, screenY - 3, 6, 6);
        ctx.fillRect(screenX + screenW - 3, screenY - 3, 6, 6);
        ctx.fillRect(screenX - 3, screenY + screenH - 3, 6, 6);
        ctx.fillRect(screenX + screenW - 3, screenY + screenH - 3, 6, 6);
        
        ctx.restore();
    }
};

// ==========================================
// CONTROLES DE TECLADO PARA O CORTE
// ==========================================
document.addEventListener('keydown', (e) => {
    if (!CropModule.isActived) return;
    
    const step = e.shiftKey ? 10 : 1; // Shift para mover mais rápido
    
    switch(e.key) {
        // Mover área de corte (WASD ou setas)
        case 'ArrowLeft':
        case 'a':
        case 'A':
            CropModule.updateArea(-step, 0);
            e.preventDefault();
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            CropModule.updateArea(step, 0);
            e.preventDefault();
            break;
        case 'ArrowUp':
        case 'w':
        case 'W':
            CropModule.updateArea(0, -step);
            e.preventDefault();
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            CropModule.updateArea(0, step);
            e.preventDefault();
            break;
        
        // Aumentar/Diminuir tamanho
        case '+':
        case '=':
            CropModule.updateArea(0, 0, 10, 10);
            e.preventDefault();
            break;
        case '-':
        case '_':
            CropModule.updateArea(0, 0, -10, -10);
            e.preventDefault();
            break;
        
        // Aplicar ou cancelar
        case 'Enter':
            const layer = AppState.layers[AppState.selectLayers];
            CropModule.apply(layer);
            e.preventDefault();
            break;
        case 'Escape':
            CropModule.cancel();
            e.preventDefault();
            break;
    }
});

// ==========================================
// INTEGRAÇÃO COM O SEU RENDER (rendee)
// ==========================================
// Modifique sua função rendee para incluir a chamada do CropModule.drawPreview
/*
function rendee() {
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar todas as camadas
    AppState.layers.forEach((layer, index) => {
        if (layer.img && layer.img.complete) {
            // Aplicar transformações da camada
            ctx.save();
            ctx.globalAlpha = layer.opacity || 1;
            // ... outras configurações da camada
            
            ctx.drawImage(
                layer.img,
                layer.x, layer.y,
                layer.width, layer.height
            );
            
            ctx.restore();
        }
    });
    
    // Se o modo de corte estiver ativo, desenhar o preview por cima
    if (CropModule.isActived && AppState.selectLayers !== null) {
        CropModule.drawPreview(ctx, AppState.layers[AppState.selectLayers]);
    }
    
    requestAnimationFrame(rendee);
}
*/

const cropInit = document.getElementById("crop-init");

if (cropInit) {
    cropInit.addEventListener("click", () => {
        if (AppState.selectLayers !== null) {
            const layerAtiva = AppState.layers[AppState.selectLayers];
            
            // Ativa o módulo de corte
            CropModule.start(layerAtiva);
            
            // Travar movimento durante o corte
            AppState.moveLock = true;
            
            // Atualizar renderização
            if (typeof rendee === 'function') rendee();
            
        } else {
            alert("Selecione uma imagem primeiro!");
        }
    });
}

const cropCancelBtn = document.getElementById("crop-cancel");
if (cropCancelBtn) {
    cropCancelBtn.addEventListener("click", () => {
        CropModule.cancel();
    });
}

const cropApplyBtn = document.getElementById("crop-apply");
if (cropApplyBtn) {
    cropApplyBtn.addEventListener("click", () => {
        if (CropModule.isActived && AppState.selectLayers !== null) {
            const layer = AppState.layers[AppState.selectLayers];
            CropModule.apply(layer);
        }
    });
}