// ÍCONES
const icons = {
    local: "fas fa-map-marker-alt",
    categoria: "fas fa-box",
    tela: "fas fa-desktop",
    entrada: "fas fa-plug",
    saída: "fas fa-sign-out-alt"
};

// GERAR CARD
function criarCardEquipamento(equipamento) {
    const card = document.createElement("div");
    card.className = "equipamento-card";
    card.id = `equip-${equipamento.id}`;

    card.innerHTML = `
        <div class="equipamento-header">
            <span class="tag">${equipamento.tag}</span>
            <span class="id-badge">${equipamento.id}</span>
        </div>

        <div class="equipamento-info">
            <div class="info-item">
                <span class="info-label"><i class="${icons.local}"></i> Local:</span>
                <span class="info-value"> ${equipamento.local}</span>
            </div>
            <div class="info-item">
                <span class="info-label"><i class="${icons.categoria}"></i> Categoria:</span>
                <span class="info-value"> ${equipamento.categoria}</span>
            </div>
            <div class="info-item">
                <span class="info-label"><i class="${icons.tela}"></i> Tela:</span>
                <span class="info-value"> ${equipamento.tela}</span>
            </div>
            <div class="info-item">
                <span class="info-label"><i class="${icons.entrada}"></i> Entrada:</span>
                <span class="info-value"> ${equipamento.entrada}</span>
            </div>
            <div class="info-item">
                <span class="info-label"><i class="${icons.saída}"></i> Saída:</span>
                <span class="info-value"> ${equipamento.saída}</span>
            </div>
        </div>

        <button class="btn-voltar-indice" onclick="window.location.hash='topo-indice'">
            <i class="fas fa-arrow-up"></i> Voltar ao Índice
        </button>
    `;

    return card;
}

// GERAR ÍNDICE
function gerarIndice(equipamentos) {
    const indice = document.getElementById("indiceEquipamentos");
    indice.innerHTML = "";

    equipamentos.forEach(equip => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="#equip-${equip.id}">${equip.tag}</a>`;
        indice.appendChild(li);
    });
}

// CARREGAR JSON E MONTAR TELA
async function carregarEquipamentos() {
    const resposta = await fetch("lista.json");
    const equipamentos = await resposta.json();

    const lista = document.getElementById("listaEquipamentos");
    lista.innerHTML = "";

    equipamentos.forEach(equip => {
        lista.appendChild(criarCardEquipamento(equip));
    });

    gerarIndice(equipamentos);
}

carregarEquipamentos();
