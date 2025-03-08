// Função para calcular a distância entre dois pontos
function calcularDistancia(ponto1, ponto2) {
    return Math.sqrt(ponto1.reduce((sum, valor, index) => sum + Math.pow(valor - ponto2[index], 2), 0));
}

// Função para calcular os centróides dos clusters
function calcularCentroide(cluster) {
    const centroide = Array(cluster[0].length).fill(0);
    cluster.forEach(ponto => {
        ponto.forEach((valor, index) => {
            centroide[index] += valor;
        });
    });
    return centroide.map(valor => valor / cluster.length);
}

// Algoritmo K-Means
function kMeans(dados, k, maxIteracoes = 100) {
    // Inicializar os centróides aleatoriamente
    let centróides = dados.slice(0, k);
    
    let clusters;
    let iteracao = 0;

    // Iterações até convergir ou atingir o limite
    while (iteracao < maxIteracoes) {
        // Passo 1: Agrupar os pontos de acordo com os centróides
        clusters = Array(k).fill().map(() => []);
        dados.forEach(ponto => {
            const distancias = centróides.map(centroide => calcularDistancia(ponto, centroide));
            const clusterIndex = distancias.indexOf(Math.min(...distancias));
            clusters[clusterIndex].push(ponto);
        });

        // Passo 2: Recalcular os centróides
        const novosCentroides = clusters.map(cluster => calcularCentroide(cluster));
        
        // Verificar se os centróides não mudaram
        if (JSON.stringify(centróides) === JSON.stringify(novosCentroides)) {
            break;
        }

        centróides = novosCentroides;
        iteracao++;
    }

    return clusters;
}

/*=======================================================*/

// Função para mapear o comportamento para um valor numérico
function mapearComportamento(comportamento) {
    return comportamento === 'Ativo' ? 1 : 0;
}

// Função para adicionar os dados do animal na tabela
function adicionarAnimalNaTabela(raca, idade, peso, comportamento, cluster) {
    const tabela = document.querySelector('#animal-table tbody');
    const linha = document.createElement('tr');
    linha.innerHTML = `
        <td>${raca}</td>
        <td>${idade}</td>
        <td>${peso}</td>
        <td>${comportamento}</td>
        <td>${cluster}</td>
    `;
    tabela.appendChild(linha);
}

// Função para processar os dados e executar o K-Means
function processarDados() {
    // Dados dos animais
    const dados = [
        // Exemplo de dados iniciais
        [3, 30, 1], // (Idade, Peso, Comportamento) - Ativo
        [5, 12, 0], // (Idade, Peso, Comportamento) - Passivo
        [2, 8, 1],  // (Idade, Peso, Comportamento) - Ativo
        [4, 10, 0], // (Idade, Peso, Comportamento) - Passivo
        [6, 11, 0], // (Idade, Peso, Comportamento) - Passivo
        [1, 2, 1]   // (Idade, Peso, Comportamento) - Ativo
    ];

    // Executando o algoritmo de K-Means
    const k = 2; // Número de clusters
    const clusters = kMeans(dados, k);

    // Atribuindo clusters aos animais e exibindo na tabela
    clusters.forEach((cluster, index) => {
        cluster.forEach(animal => {
            // Adicionar o animal à tabela com o número do cluster
            adicionarAnimalNaTabela('Raça Exemplo', animal[0], animal[1], animal[2] === 1 ? 'Ativo' : 'Passivo', index + 1);
        });
    });
}

// Adicionando o evento de submit no formulário
document.getElementById('animal-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Capturando os dados inseridos pelo usuário
    const raca = document.getElementById('raca').value;
    const idade = parseInt(document.getElementById('idade').value);
    const peso = parseFloat(document.getElementById('peso').value);
    const comportamento = document.getElementById('comportamento').value;

    // Convertendo o comportamento para valor numérico
    const comportamentoNum = mapearComportamento(comportamento);

    // Adicionando os dados à tabela
    adicionarAnimalNaTabela(raca, idade, peso, comportamento, '-');

    // Recalcular e atualizar os clusters
    processarDados();
});
