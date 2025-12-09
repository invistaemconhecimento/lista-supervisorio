document.addEventListener('DOMContentLoaded', function() {
    // Ano atual no footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Carregar e exibir equipamentos
    carregarEquipamentos();
    
    // Configurar filtros
    configurarFiltros();
});

async function carregarEquipamentos() {
    try {
        const response = await fetch('lista.json');
        const equipamentos = await response.json();
        
        // Atualizar contador
        document.getElementById('totalEquipamentos').textContent = 
            `${equipamentos.length} equipamento${equipamentos.length !== 1 ? 's' : ''}`;
        
        // Preencher categorias no filtro
        preencherCategorias(equipamentos);
        
        // Exibir equipamentos
        exibirEquipamentos(equipamentos);
        
        // Configurar busca em tempo real
        document.getElementById('searchInput').addEventListener('input', function(e) {
            filtrarEquipamentos(equipamentos);
        });
        
        // Configurar filtro por categoria
        document.getElementById('filterCategory').addEventListener('change', function() {
            filtrarEquipamentos(equipamentos);
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
    
    equipamentos.forEach(equipamento => {
        const card = criarCardEquipamento(equipamento);
        container.appendChild(card);
    });
}

function criarCardEquipamento(equipamento) {
    const card = document.createElement('div');
    card.className = 'equipamento-card';
    
    // Ícones para cada campo
    const icons = {
        tag: 'fas fa-tag',
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
    `;
    
    return card;
}

function filtrarEquipamentos(equipamentos) {
    const termoBusca = document.getElementById('searchInput').value.toLowerCase();
    const categoriaSelecionada = document.getElementById('filterCategory').value;
    
    const equipamentosFiltrados = equipamentos.filter(equipamento => {
        const buscaMatch = 
            equipamento.tag.toLowerCase().includes(termoBusca) ||
            equipamento.local.toLowerCase().includes(termoBusca) ||
            equipamento.categoria.toLowerCase().includes(termoBusca) ||
            equipamento.tela.toLowerCase().includes(termoBusca);
        
        const categoriaMatch = !categoriaSelecionada || 
                              equipamento.categoria === categoriaSelecionada;
        
        return buscaMatch && categoriaMatch;
    });
    
    exibirEquipamentos(equipamentosFiltrados);
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
