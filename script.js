document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    carregarEquipamentos();
    configurarFiltros();
});

// CARREGAR EQUIPAMENTOS
async function carregarEquipamentos() {
    try {
        const response = await fetch('lista.json');
        const equipamentos = await response.json();

        document.getElementById('totalEquipamentos').textContent = 
            `${equipamentos.length} equipamento${equipamentos.length !== 1 ? 's' : ''}`;

        preencherCategorias(equipamentos);
        exibirEquipamentos(equipamentos);
        gerarIndice(equipamentos);

        document.getElementById('searchInput').addEventListener('input', function(e) {
            filtrarEquipamentos(equipamentos);
        });

        document.getElementById('filterCategory').addEventListener('change', function() {
            filtrarEquipamentos(equipamentos);
        });

        // BOTÃO FLUTUANTE
        window.addEventListener("scroll", () => {
            const botao = document.getElementById("btnFlutuanteTopo");
            if (window.scrollY > 250) {
                botao.classList.add("mostrar");
            } else {
                botao.classList.remove("mostrar");
            }
        });

    } catch (error) {
        console.error('Erro ao carregar equipamentos:', error);
        document.getElementById('equipamentosContainer').innerHTML = 
            '<div class="error">Erro ao carregar os dados dos equipamentos.</div>';
    }
}

function preencherCategorias(equipamentos) {
    const categorias = [...new Set(equipamentos.map(e => e.categoria))].sort();
    const select = document.getElementById('filterCategory');
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        select.appendChild(option);
    });
}

function exibirEquipamentos(equipamentos) {
    const container = document.getElementById('equipamentosContainer');
    container.innerHTML = '';

    if (equipamentos.length === 0) {
        container.innerHTML = '<div class="no-results">Nenhum equipamento encontrado.</div>';
        return;
    }

    equipamentos.forEach(e => {
        container.appendChild(criarCardEquipamento(e));
    });
}

function criarCardEquipamento(equipamento) {
    const card = document.createElement('div');
    card.className = 'equipamento-card';
    card.id = `equip-${equipamento.id}`;

    const icons = {
        local: 'fas fa-map-marker-alt',
        categoria: 'fas fa-cog',
        tela: 'fas fa-tv',
        entrada: 'fas fa-arrow-right',
        saída: 'fas fa-arrow-left'
    };

    card.innerHTML = `
        <div class="equipamento-header">
            <span class="tag">${equipamento.tag}</span>
            <span class="id-badge">${equipamento.id}</span>
        </div>
        <div class="equipamento-info">
            <div class="info-item">
                <span class="info-label"><i class="${icons.local}"></i> Local:</span>
                <span class="info-value">${equipamento.local}</span>
            </div>
            <div class="info-item">
                <span class="info-label"><i class="${icons.categoria}"></i> Categoria:</span>
                <span class="info-value">${equipamento.categoria}</span>
            </div>
            <div class="info-item">
                <span class="info-label"><i class="${icons.tela}"></i> Tela:</span>
                <span class="info-value">${equipamento.tela}</span>
            </div>
            <div class="info-item">
                <span class="info-label"><i class="${icons.entrada}"></i> Entrada:</span>
                <span class="info-value">${equipamento.entrada}</span>
            </div>
            <div class="info-item">
                <span class="info-label"><i class="${icons.saída}"></i> Saída:</span>
                <span class="info-value">${equipamento.saída}</span>
            </div>
        </div>

        <button class="btn-voltar-indice" onclick="window.location.hash='topo-indice'">
            <i class="fas fa-arrow-up"></i> Voltar ao Índice
        </button>
    `;

    return card;
}

function filtrarEquipamentos(equipamentos) {
    const termoBusca = document.getElementById('searchInput').value.toLowerCase();
    const categoriaSelecionada = document.getElementById('filterCategory').value;

    const filtrados = equipamentos.filter(e => {
        const buscaMatch =
            e.tag.toLowerCase().includes(termoBusca) ||
            e.local.toLowerCase().includes(termoBusca) ||
            e.categoria.toLowerCase().includes(termoBusca) ||
            e.tela.toLowerCase().includes(termoBusca);

        const categoriaMatch = !categoriaSelecionada || e.categoria === categoriaSelecionada;

        return buscaMatch && categoriaMatch;
    });

    exibirEquipamentos(filtrados);
}

function configurarFiltros() {
    const estilo = document.createElement('style');
    estilo.textContent = `
        .no-results {
            grid-column: 1 / -1;
            text-align: center;
            padding: 40px;
            color: #7f8c8d;
            font-size: 1.2rem;
        }
        .error {
            grid-column: 1 / -1;
            text-align: center;
            padding: 40px;
            color: #e74c3c;
            font-size: 1.2rem;
        }
    `;
    document.head.appendChild(estilo);
}

function gerarIndice(equipamentos) {
    const indice = document.getElementById('indiceEquipamentos');
    indice.innerHTML = '';
    equipamentos.forEach(e => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#equip-${e.id}">${e.tag}</a>`;
        indice.appendChild(li);
    });
}
