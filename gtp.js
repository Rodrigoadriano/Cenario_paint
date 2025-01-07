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





///////////////segunda ideia 


class Bloco {
    constructor(chave, tileWidth, tileHeight) {
        this.chave = chave; // Chave no formato "linha + coluna", ex: "45"
        this.linha = parseInt(chave.charAt(0)); // Extrai a linha a partir da chave
        this.coluna = parseInt(chave.charAt(1)); // Extrai a coluna a partir da chave
        this.x = (this.coluna - 1) * tileWidth; // Coordenada X no tileset
        this.y = (this.linha - 1) * tileHeight; // Coordenada Y no tileset
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

// Gerenciador para armazenar os blocos e buscá-los pela chave
class GerenciadorDeBlocos {
    constructor(blocos) {
        this.blocos = new Map(); // Usamos um Map para associar chaves aos blocos
        blocos.forEach(bloco => {
            this.blocos.set(bloco.chave, bloco); // Adiciona cada bloco ao Map pela chave
        });
    }

    buscar(chave) {
        return this.blocos.get(chave); // Retorna o bloco com a chave correspondente
    }
}

function gerarBlocosComChaves(tilesetWidth, tilesetHeight, tileWidth, tileHeight) {
    const blocos = [];
    const linhas = tilesetHeight / tileHeight; // Número de linhas
    const colunas = tilesetWidth / tileWidth; // Número de colunas

    for (let linha = 1; linha <= linhas; linha++) {
        for (let coluna = 1; coluna <= colunas; coluna++) {
            const chave = `${linha}${coluna}`; // Gera a chave concatenando linha e coluna
            blocos.push(new Bloco(chave, tileWidth, tileHeight));
        }
    }

    return blocos;
}

// Exemplo de uso
const tilesetImage = new Image();
tilesetImage.src = "tileset.png"; // Caminho para sua imagem

tilesetImage.onload = () => {
    const blocos = gerarBlocosComChaves(
        tilesetImage.width,
        tilesetImage.height,
        16, // Largura do bloco
        16  // Altura do bloco
    );

    const gerenciador = new GerenciadorDeBlocos(blocos);

    // Desenhar no canvas
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Buscar bloco pela chave e desenhar no canvas
    const bloco = gerenciador.buscar("23"); // Linha 2, Coluna 3
    if (bloco) {
        bloco.draw(ctx, 100, 100); // Desenha em (100, 100)
    }
};
