let removedHistory = [];

// SALVAR NO HISTÓRICO
function saveToHistory(layer) {
    if (layer) {
        // Armazenamos os dados crus para poder reconstruir a classe depois
        removedHistory.push({
            id: layer.id,
            img: layer.img,
            x: layer.x,
            y: layer.y,
            width: layer.width,
            height: layer.height,
            rotation: layer.rotation,
            aspectRatio: layer.aspectRatio // Importante para a classe Layer
        });
        
        if (removedHistory.length > 10) {
            removedHistory.shift();
        }
        
        console.log(`💾 Salva no histórico: ID ${layer.id}`);
    }
}

// REMOVER ÚLTIMA CAMADA
function layerLastRemove() {
    if (AppState.layers.length > 0) {
        const removida = AppState.layers.pop();
        saveToHistory(removida);
        
        // Resetar seleção se a camada removida era a selecionada
        if (AppState.selectLayers >= AppState.layers.length) {
            AppState.selectLayers = AppState.layers.length > 0 ? AppState.layers.length - 1 : null;
        }
        
        console.log(`🗑️ Removida ID: ${removida.id}`);
    } else {
        console.log('📭 Nenhuma imagem para remover');
    }
}

// APAGAR TODAS AS CAMADAS
function layerAllRemove() {
    if (AppState.layers.length > 0) {
        AppState.layers.forEach(layer => saveToHistory(layer));
        AppState.layers = [];
        AppState.selectLayers = null;
        console.log(`🧹 Todas as imagens removidas`);
    }
}

// REMOVER POR ID
function layerIdRemove(id) {
    const index = AppState.layers.findIndex(l => l.id === id);
    if (index !== -1) {
        const removida = AppState.layers.splice(index, 1)[0];
        saveToHistory(removida);
        
        if (AppState.selectLayers === index) {
            AppState.selectLayers = null;
        } else if (AppState.selectLayers > index) {
            AppState.selectLayers--;
        }
        return true;
    }
    return false;
}

// REFAZER ÚLTIMA REMOÇÃO (UNDO)
function layerLastRedo() {
    if (removedHistory.length > 0) {
        const dados = removedHistory.pop();
        
        // RECONSTRUÇÃO: Criamos uma nova instância da classe Layer
        const novaLayer = new Layer(dados.img, dados.x, dados.y);
        novaLayer.id = dados.id; // Mantém o ID original
        novaLayer.width = dados.width;
        novaLayer.height = dados.height;
        novaLayer.rotation = dados.rotation;
        novaLayer.aspectRatio = dados.aspectRatio;

        AppState.layers.push(novaLayer);
        AppState.selectLayers = AppState.layers.length - 1;
        
        console.log(`↩️ Refazer ID: ${dados.id}`);
    } else {
        console.log('📭 Nada para refazer');
    }
}

// REFAZER TODAS
function layerAllRedo() {
    if (removedHistory.length > 0) {
        while (removedHistory.length > 0) {
            layerLastRedo();
        }
    }
}

// VER HISTÓRICO
function layerHistoryView() {
    console.table(removedHistory);
    return removedHistory;
}

// LIMPAR HISTÓRICO
function layerHistoryClear() {
    removedHistory = [];
    console.log(`🧹 Histórico limpo`);
}

// Exportar para o escopo global (caso precise chamar via console ou HTML)
window.layerLastRemove = layerLastRemove;
window.layerAllRemove = layerAllRemove;
window.layerIdRemove = layerIdRemove;
window.layerLastRedo = layerLastRedo;
window.layerAllRedo = layerAllRedo;
window.layerHistoryView = layerHistoryView;
window.layerHistoryClear = layerHistoryClear;
