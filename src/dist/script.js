"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const canvas = document.getElementById('canvas');
const canvasContainer = document.getElementsByClassName('canvas_container')[0];
const ctx = canvas.getContext('2d');
const gridSize = 32;
let Zoom = 1;
const scaleFactor = 1.1;
let cordenadas = [];
let forma = [];
let isDragging = false;
let startX, startY;
const loadedTextures = {};
let blocos = document.querySelectorAll('.blocos');
let Blocoselected = null;
let deletar = false;
let clicked = false;
let lastDx = null;
let lastDy = null;
let permitido;
if (canvas) {
    if (ctx) {
        ctx.imageSmoothingEnabled = false;
    }
}
canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});
class Bloco {
    constructor(name, texture_name, familia, sx, sy, sw, sh, selectable = false, layer = 0) {
        this.name = name;
        this.familia = familia;
        this.selectable = selectable;
        this.texture_name = texture_name;
        this.layer = layer;
        this.sx = sx;
        this.sy = sy;
        this.sw = sw;
        this.sh = sh;
    }
}
class textura {
    constructor(name, texturaURL) {
        this.name = name;
        this.texturaURL = texturaURL; // Apenas armazenamos o URL
    }
}
let blocosArray = [
    // new Bloco("xis",  0, 0, 16, 16),
    // new Bloco("xis",  17, 0, 16, 16),
    // new Bloco("xis",  34, 0, 16, 16),
    // new Bloco("brick",  0, 0, 16, 16),
    new Bloco("brick_dark", "brick_dark", "bloco_dark", 0, 0, 16, 16, true),
    new Bloco("default", "brick", "bloco", 0, 0, 16, 16, true),
    // new Bloco("brick_sepia",  0, 0, 16, 16),
    new Bloco("cima", "gravel", "gravel1", 16, 0, 16, 16, true),
    new Bloco("esquerda", "gravel", "gravel1", 0, 16, 16, 16),
    new Bloco("direita", "gravel", "gravel1", 32, 16, 16, 16),
    new Bloco("baixo", "gravel", "gravel1", 16, 32, 16, 16),
    new Bloco("default", "gravel", "gravel1", 16, 16, 16, 16),
    new Bloco("esquerda_cima", "gravel", "gravel1", 0, 0, 16, 16),
    new Bloco("direita_cima", "gravel", "gravel1", 32, 0, 16, 16),
    new Bloco("esquerda_baixo", "gravel", "gravel1", 32, 32, 16, 16),
    new Bloco("direita_baixo", "gravel", "gravel1", 0, 32, 16, 16),
    new Bloco("cima", "gravel2", "gravel2", 17, 0, 16, 16, true),
    new Bloco("esquerda", "gravel2", "gravel2", 0, 17, 16, 16),
    new Bloco("direita", "gravel2", "gravel2", 34, 17, 16, 16),
    new Bloco("baixo", "gravel2", "gravel2", 17, 34, 16, 16),
    new Bloco("default", "gravel2", "gravel2", 17, 17, 16, 16),
    new Bloco("esquerda_cima", "gravel2", "gravel2", 0, 0, 16, 16),
    new Bloco("direita_cima", "gravel2", "gravel2", 34, 0, 16, 16),
    new Bloco("esquerda_baixo", "gravel2", "gravel2", 34, 34, 16, 16),
    new Bloco("direita_baixo", "gravel2", "gravel2", 0, 34, 16, 16),
    new Bloco("mix", "mix", "mix", 16, 0, 16, 16, true),
    new Bloco("mix", "mix", "mix", 0, 16, 16, 16),
    new Bloco("mix", "mix", "mix", 32, 16, 16, 16),
    new Bloco("mix", "mix", "mix", 16, 16, 16, 16),
    new Bloco("mix", "mix", "mix", 0, 0, 16, 16),
    new Bloco("mix", "mix", "mix", 32, 0, 16, 16),
    new Bloco("mix", "mix", "mix", 32, 0, 16, 16),
    new Bloco("default", "escada", "escada", 0, 0, 16, 16, true, 1),
    new Bloco("default", "grass", "verde", 0, 0, 16, 16, true, 2),
    new Bloco("cima", "grass", "vermelha", 16, 0, 16, 16, true, 2)
];
let TexturasArray = [
    new textura("brick", "../assets/textures/16.png"),
    // new textura("xis", "00.png"),
    new textura("brick_dark", "../assets/textures/17.png"),
    // new textura("brick_sepia", "18.png"),
    new textura("gravel", "../assets/textures/Sprite-0002.png"),
    new textura("gravel2", "../assets/textures/gravel.png"),
    new textura("mix", "../assets/textures/bloco_pedra.png"),
    new textura("escada", "../assets/textures/escada.png"),
    new textura("grass", "../assets/textures/grass.png"),
];
function preloadTextures(texturas) {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = texturas.map((t) => {
            if (!loadedTextures[t.name]) {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = t.texturaURL; // Define o URL da imagem
                    img.onload = () => {
                        loadedTextures[t.name] = img; // Armazena a imagem carregada
                        resolve();
                    };
                    img.onerror = (err) => reject(`Erro ao carregar textura: ${t.name}`);
                });
            }
            return Promise.resolve(); // Se já está carregada, retorna uma Promise resolvida
        });
        yield Promise.all(promises); // Aguarda todas as Promises serem resolvidas
        console.log('Texturas carregadas:', loadedTextures);
    });
}
function drawGrid() {
    for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.strokeRect(x, y, gridSize, gridSize);
            //color stroke gray 
            // ctx.strokeStyle = "rgba(78, 73, 73, 0.54)";
        }
    }
}
function selectBloco(id) {
    console.log('Selecionar o bloco id:', id);
    document.querySelectorAll('.blocos').forEach(bloco => bloco.style.border = 'none');
    let target = document.getElementById(String(id));
    // Adiciona uma borda ao bloco clicado
    target.style.border = "4px solid #3b59c0";
    // Define o bloco selecionado
    Blocoselected = blocosArray[Number(id)];
}
;
function seletorBlocos(bloco, texturas) {
    // Seleciona o elemento pai que conterá os blocos
    const blocoContainer = document.querySelector('.bloco');
    // Itera sobre o array de blocos
    bloco.forEach((bloco, index) => {
        if (bloco.selectable) {
            const div = document.createElement('div'); // Cria uma nova div
            div.className = 'blocos'; // Adiciona a classe 'blocos'
            div.id = (index).toString(); // Define o ID como o índice + 1
            // Configura a textura se existir
            const texture = loadedTextures[bloco.texture_name];
            if (texture) {
                div.style.backgroundImage = `url(${texture.src})`;
                div.style.backgroundSize = `${texture.width * (64 / bloco.sw)}px ${texture.height * (64 / bloco.sh)}px`;
                div.style.backgroundPosition = `-${bloco.sx * (64 / bloco.sw)}px -${bloco.sy * (64 / bloco.sh)}px`;
                div.style.backgroundRepeat = 'no-repeat';
                div.style.backgroundColor = 'transparent';
            }
            // Adiciona o evento de clique ao criar o bloco
            div.addEventListener('click', (event) => {
                const target = event.currentTarget; // Garante que o target é um HTMLDivElement
                const clickedId = Number(target.id);
                // Obtém o ID do elemento clicado
                permitido = true;
                // Remove a borda de todos os blocos
                selectBloco(String(clickedId));
            });
            // Adiciona a div ao elemento pai
            blocoContainer.appendChild(div);
        }
    });
}
function DrawBloco(B1, texturas) {
    const texture = loadedTextures[B1.texture_name];
    if (texture) {
        ctx.drawImage(texture, B1.sx, B1.sy, B1.sw, B1.sh, B1.dx, B1.dy, B1.dw, B1.dh);
    }
    else {
        console.error(`Textura não encontrada para: ${B1.texture_name}`);
    }
}
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    forno();
    forma.sort((a, b) => a.layer - b.layer).forEach((bloco) => {
        DrawBloco(bloco, TexturasArray);
    });
    forma = [];
}
function CordinateManager(event) {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / Zoom;
    const y = (event.clientY - rect.top) / Zoom;
    const dx = Math.floor(x / gridSize) * gridSize;
    const dy = Math.floor(y / gridSize) * gridSize;
    // Se não houve mudança nas coordenadas, retorna
    if (dx === lastDx && dy === lastDy && !permitido) {
        return;
    }
    // Atualiza últimas posições
    lastDx = dx;
    lastDy = dy;
    //Se tiver um bloco selecionado(seletor), E não for deletar completa as informações faltantes e faz o push no array
    if (Blocoselected && !deletar) {
        Blocoselected.dx = dx;
        Blocoselected.dy = dy;
        Blocoselected.dh = gridSize;
        Blocoselected.dw = gridSize;
        // Remove bloco existente na mesma posição se houver
        const index = cordenadas.findIndex((Bloco) => Bloco.dx === dx &&
            Bloco.dy === dy &&
            Bloco.layer === Blocoselected.layer);
        if (index !== -1) {
            cordenadas.splice(index, 1);
        }
        cordenadas.push(Object.assign({}, Blocoselected));
    }
    else {
        // Se for deletar, remove o bloco na posição clicada
        if (cordenadas.length === 0) {
            return;
        }
        const index = cordenadas.length - 1 - cordenadas.slice().reverse().findIndex((Bloco) => Bloco.dx === dx &&
            Bloco.dy === dy);
        if (index !== -1) {
            console.log('Deletar bloco:', index);
            let index_ = blocosArray.findIndex((x) => x.name === cordenadas[index].name &&
                x.familia === cordenadas[index].familia &&
                x.texture_name === cordenadas[index].texture_name);
            if (index_ !== -1) {
                selectBloco(String(index_));
            }
            cordenadas.splice(index, 1);
        }
    }
    permitido = false;
    render();
}
function forno() {
    let coringa = null;
    cordenadas.sort((a, b) => a.layer - b.layer).forEach((bloco) => {
        const esquerda = bloco.dx - gridSize;
        const direita = bloco.dx + gridSize;
        const cima = bloco.dy - gridSize;
        const baixo = bloco.dy + gridSize;
        const familia = bloco.familia;
        const esquerdaVazia = esquerda > 0 && !cordenadas.some((b) => b.dx === esquerda && b.dy === bloco.dy && b.familia === familia);
        const direitaVazia = direita < canvas.width && !cordenadas.some((b) => b.dx === direita && b.dy === bloco.dy && b.familia === familia);
        const cimaVazia = cima > 0 && !cordenadas.some((b) => b.dy === cima && b.dx === bloco.dx && b.familia === familia);
        const baixoVazia = baixo < canvas.height && !cordenadas.some((b) => b.dy === baixo && b.dx === bloco.dx && b.familia === familia);
        function getBloco(name) {
            return blocosArray.find(item => item.familia === familia && item.name === name) || bloco;
        }
        function getRandomBloco() {
            const familyBlocos = blocosArray.filter(item => item.familia === familia);
            const random = Math.floor(Math.random() * familyBlocos.length);
            return familyBlocos[random] || bloco;
        }
        switch (true) {
            case bloco.name === "mix":
                //get random block 
                coringa = getRandomBloco();
                break;
            case esquerdaVazia && direitaVazia && cimaVazia && baixoVazia:
                coringa = getBloco("default");
                break;
            case esquerdaVazia && cimaVazia:
                coringa = getBloco("esquerda_cima");
                break;
            case direitaVazia && cimaVazia:
                coringa = getBloco("direita_cima");
                break;
            case baixoVazia && !direitaVazia && !cimaVazia && esquerdaVazia:
                coringa = getBloco("direita_baixo");
                break;
            case baixoVazia && !esquerdaVazia && !cimaVazia && direitaVazia:
                coringa = getBloco("esquerda_baixo");
                break;
            case esquerdaVazia:
                coringa = getBloco("esquerda");
                break;
            case direitaVazia:
                coringa = getBloco("direita");
                break;
            case cimaVazia:
                coringa = getBloco("cima");
                break;
            case baixoVazia:
                coringa = getBloco("baixo");
                break;
            default:
                coringa = getBloco("default");
                break;
        }
        if (coringa) {
            coringa.dx = bloco.dx;
            coringa.dy = bloco.dy;
            coringa.dh = gridSize;
            coringa.dw = gridSize;
            forma.push(Object.assign({}, coringa));
        }
        // forma.push({ ...BlocoEsquerda! });
    });
}
canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const prevZoom = Zoom;
    if (event.deltaY < 0) {
        // Zoom in
        Zoom *= scaleFactor;
    }
    else {
        // Zoom out
        Zoom /= scaleFactor;
    }
    const dx = (mouseX / prevZoom) * (Zoom - prevZoom);
    const dy = (mouseY / prevZoom) * (Zoom - prevZoom);
    canvas.style.transform = `scale(${Zoom})`;
    canvas.style.transformOrigin = '0 0';
    canvas.style.left = `${canvas.offsetLeft - dx}px`;
    canvas.style.top = `${canvas.offsetTop - dy}px`;
});
canvas.addEventListener('mousedown', (event) => {
    if (event.button === 0) { // Botão esquerdo
        deletar = false;
        permitido = true;
        clicked = true;
        CordinateManager(event);
    }
    else if (event.button === 2) { // Botão direito
        deletar = true;
        permitido = true;
        clicked = true;
        CordinateManager(event);
    }
    if (event.button === 1) { // Middle mouse button
        isDragging = true;
        startX = event.clientX - canvas.offsetLeft;
        startY = event.clientY - canvas.offsetTop;
        canvasContainer.style.cursor = 'grabbing';
    }
});
document.addEventListener('mouseup', (event) => {
    if (event.button === 2) { // Botão direito
        deletar = false;
    }
    clicked = false;
    isDragging = false;
    canvasContainer.style.cursor = 'default';
});
canvasContainer.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const x = event.clientX - startX;
        const y = event.clientY - startY;
        canvas.style.left = `${x}px`;
        canvas.style.top = `${y}px`;
    }
    if (!clicked) {
        return;
    }
    CordinateManager(event);
});
canvasContainer.addEventListener('mouseleave', () => {
    isDragging = false;
    canvasContainer.style.cursor = 'default';
});
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield preloadTextures(TexturasArray); // Aguarda o carregamento das texturas
            seletorBlocos(blocosArray, TexturasArray); // Usa as texturas carregadas
            render(); // Renderiza a aplicação
        }
        catch (error) {
            console.error(error); // Lida com erros no carregamento
        }
    });
}
init(); // Inicia o processo
