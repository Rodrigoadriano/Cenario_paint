class Bloco {
    constructor(linha, coluna, tileWidth, tileHeight) {
        this.linha = linha; // Índice da linha
        this.coluna = coluna; // Índice da coluna
        this.x = (coluna - 1) * tileWidth; // Coordenada X no tileset
        this.y = (linha - 1) * tileHeight; // Coordenada Y no tileset
        this.width = tileWidth;
        this.height = tileHeight;
    }

    draw(ctx, targetX, targetY) {
        ctx.drawImage(
            tilesetImage, // A imagem do tileset carregada
            this.x, this.y, this.width, this.height, // Recorte do tileset
            targetX, targetY, this.width, this.height // Posição no canvas
        );
    }
}

// Função para gerar blocos com base em linhas e colunas
function gerarBlocosEmLinhasEColunas(tilesetWidth, tilesetHeight, tileWidth, tileHeight) {
    const blocos = [];

    const linhas = tilesetHeight / tileHeight; // Número de linhas
    const colunas = tilesetWidth / tileWidth; // Número de colunas

    for (let linha = 1; linha <= linhas; linha++) {
        for (let coluna = 1; coluna <= colunas; coluna++) {
            blocos.push(new Bloco(linha, coluna, tileWidth, tileHeight));
        }
    }

    return blocos;
}

// Exemplo de uso
const tilesetImage = new Image();
tilesetImage.src = "tileset.png"; // Caminho para sua imagem

tilesetImage.onload = () => {
    const blocos = gerarBlocosEmLinhasEColunas(
        tilesetImage.width,
        tilesetImage.height,
        16, // Largura do bloco
        16  // Altura do bloco
    );

    // Desenhar no canvas
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Exemplo: desenhar o bloco da linha 2, coluna 3 no canvas em (100, 100)
    const bloco = blocos.find(b => b.linha === 2 && b.coluna === 3);
    bloco.draw(ctx, 100, 100);
};
