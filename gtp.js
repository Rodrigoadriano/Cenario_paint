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


//////////terceira ideia, array para sprites maiores

class Bloco {
    constructor(linhas, colunas, tileWidth, tileHeight) {
        this.linhas = linhas; // Array com as linhas ocupadas pelo bloco
        this.colunas = colunas; // Array com as colunas ocupadas pelo bloco
        this.width = tileWidth * colunas.length; // Largura total do bloco
        this.height = tileHeight * linhas.length; // Altura total do bloco
        this.x = colunas.map(coluna => (coluna - 1) * tileWidth); // Coordenadas X no tileset
        this.y = linhas.map(linha => (linha - 1) * tileHeight); // Coordenadas Y no tileset
    }

    draw(ctx, targetX, targetY) {
        // Percorre cada célula do bloco e desenha no canvas
        this.y.forEach((yCoord, i) => {
            this.x.forEach((xCoord, j) => {
                ctx.drawImage(
                    tilesetImage, // A imagem do tileset carregada
                    xCoord, yCoord, this.width / this.colunas.length, this.height / this.linhas.length, // Recorte do tileset
                    targetX + j * (this.width / this.colunas.length), targetY + i * (this.height / this.linhas.length), // Posição no canvas
                    this.width / this.colunas.length, this.height / this.linhas.length // Tamanho do bloco
                );
            });
        });
    }
}

// Gerenciador para armazenar e buscar blocos
class GerenciadorDeBlocos {
    constructor(blocos) {
        this.blocos = []; // Array de blocos
        blocos.forEach(bloco => {
            this.blocos.push(bloco); // Adiciona cada bloco ao array
        });
    }

    buscar_bloco(linha, coluna) {
        // Encontra o bloco que ocupa a linha e coluna especificada
        return this.blocos.find(
            bloco => bloco.linhas.includes(linha) && bloco.colunas.includes(coluna)
        );
    }

    buscar_sprite(linhas, colunas) {
        // Encontra o bloco que ocupa as linhas e colunas especificadas
        return this.blocos.find(
            bloco =>
                linhas.every(l => bloco.linhas.includes(l)) &&
                colunas.every(c => bloco.colunas.includes(c))
        );
    }
}

function gerarBlocosComLinhasEColunas(tilesetWidth, tilesetHeight, tileWidth, tileHeight) {
    const blocos = [];
    const linhas = tilesetHeight / tileHeight; // Número de linhas
    const colunas = tilesetWidth / tileWidth; // Número de colunas

    for (let linha = 1; linha <= linhas; linha++) {
        for (let coluna = 1; coluna <= colunas; coluna++) {
            blocos.push(new Bloco([linha], [coluna], tileWidth, tileHeight)); // Bloco padrão 1x1
        }
    }

    return blocos;
}

// Exemplo de uso
const tilesetImage = new Image();
tilesetImage.src = "tileset.png"; // Caminho para sua imagem

tilesetImage.onload = () => {
    const blocos = gerarBlocosComLinhasEColunas(
        tilesetImage.width,
        tilesetImage.height,
        16, // Largura do bloco
        16  // Altura do bloco
    );

    const gerenciador = new GerenciadorDeBlocos(blocos);

    // Desenhar um bloco 1x1 no canvas
    const bloco1 = gerenciador.buscar_bloco(1, 2); // Linha 1, Coluna 2
    if (bloco1) {
        bloco1.draw(ctx, 100, 100); // Desenha em (100, 100)
    }

    // Desenhar um bloco maior 2x3 no canvas
    const bloco2 = gerenciador.buscar_sprite([2], [5, 6, 7]); // Linha 2, Colunas 5, 6, 7
    if (bloco2) {
        bloco2.draw(ctx, 200, 200); // Desenha em (200, 200)
    }
};
