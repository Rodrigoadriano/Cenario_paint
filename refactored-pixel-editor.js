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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasManager = exports.BlockSelector = exports.BorderProcessor = exports.Block = exports.TextureManager = exports.TEXTURES = exports.SCALE_FACTOR = exports.INITIAL_ZOOM = exports.GRID_SIZE = void 0;
// src/config/constants.ts
exports.GRID_SIZE = 32;
exports.INITIAL_ZOOM = 1;
exports.SCALE_FACTOR = 1.1;
exports.TEXTURES = [
    { name: "gravel", texturaURL: "../assets/textures/gravel.png" }
];
// src/classes/TextureManager.ts
class TextureManager {
    constructor() {
        this.loadedTextures = {};
    }
    static getInstance() {
        if (!TextureManager_1.TextureManager.instance) {
            TextureManager_1.TextureManager.instance = new TextureManager_1.TextureManager();
        }
        return TextureManager_1.TextureManager.instance;
    }
    loadTextures(textures) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = textures.map(t => {
                if (!this.loadedTextures[t.name]) {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.src = t.texturaURL;
                        img.onload = () => {
                            this.loadedTextures[t.name] = img;
                            resolve();
                        };
                        img.onerror = () => reject(`Failed to load texture: ${t.name}`);
                    });
                }
                return Promise.resolve();
            });
            yield Promise.all(promises);
        });
    }
    getTexture(name) {
        return this.loadedTextures[name];
    }
}
exports.TextureManager = TextureManager;
// src/classes/Block.ts
class Block {
    constructor(name, familia, sx, sy, sw, sh, dx, dy, dw, dh) {
        this.name = name;
        this.familia = familia;
        this.sx = sx;
        this.sy = sy;
        this.sw = sw;
        this.sh = sh;
        this.dx = dx;
        this.dy = dy;
        this.dw = dw;
        this.dh = dh;
    }
    clone() {
        return new Block(this.name, this.familia, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
    }
}
exports.Block = Block;
// src/classes/BorderProcessor.ts
class BorderProcessor {
    constructor(canvas, gridSize) {
        this.canvas = canvas;
        this.gridSize = gridSize;
    }
    processBlockBorders(block, allBlocks) {
        const esquerda = block.dx - this.gridSize;
        const direita = block.dx + this.gridSize;
        const cima = block.dy - this.gridSize;
        const baixo = block.dy + this.gridSize;
        const esquerdaVazia = esquerda > 0 && !this.hasBlockAt(allBlocks, esquerda, block.dy);
        const direitaVazia = direita < this.canvas.width && !this.hasBlockAt(allBlocks, direita, block.dy);
        const cimaVazia = cima > 0 && !this.hasBlockAt(allBlocks, block.dx, cima);
        const baixoVazia = baixo < this.canvas.height && !this.hasBlockAt(allBlocks, block.dx, baixo);
        return this.selectAppropriateBlock(esquerdaVazia, direitaVazia, cimaVazia, baixoVazia, block);
    }
    hasBlockAt(blocks, x, y) {
        return blocks.some(b => b.dx === x && b.dy === y);
    }
    selectAppropriateBlock(esquerda, direita, cima, baixo, originalBlock) {
        // Implementar lógica de seleção de bloco baseada nas bordas
        // Esta lógica deve ser adaptada aos seus blocos específicos
        return originalBlock; // Placeholder
    }
}
exports.BorderProcessor = BorderProcessor;
// src/classes/BlockSelector.ts
class BlockSelector {
    constructor(containerSelector) {
        this.selectedBlock = null;
        this.container = document.querySelector(containerSelector);
        this.textureManager = TextureManager_1.TextureManager.getInstance();
    }
    createBlockElements(blocks) {
        blocks.forEach((block, index) => {
            const div = document.createElement('div');
            div.className = 'blocos';
            div.id = (index + 1).toString();
            const texture = this.textureManager.getTexture(block.name);
            if (texture) {
                this.applyTextureStyle(div, texture, block);
            }
            div.addEventListener('click', () => this.handleBlockSelection(div, block));
            this.container.appendChild(div);
        });
    }
    applyTextureStyle(div, texture, block) {
        div.style.backgroundImage = `url(${texture.src})`;
        div.style.backgroundSize = `${texture.width * (64 / block.sw)}px ${texture.height * (64 / block.sh)}px`;
        div.style.backgroundPosition = `-${block.sx * (64 / block.sw)}px -${block.sy * (64 / block.sh)}px`;
        div.style.backgroundRepeat = 'no-repeat';
    }
    handleBlockSelection(div, block) {
        document.querySelectorAll('.blocos').forEach(b => b.style.border = 'none');
        div.style.border = "4px solid #3b59c0";
        this.selectedBlock = block;
    }
    getSelectedBlock() {
        return this.selectedBlock;
    }
}
exports.BlockSelector = BlockSelector;
// src/classes/CanvasManager.ts
class CanvasManager {
    constructor(canvasId, containerClass) {
        this.zoom = exports.INITIAL_ZOOM;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.blocks = [];
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.container = document.getElementsByClassName(containerClass)[0];
        this.borderProcessor = new BorderProcessor(this.canvas, exports.GRID_SIZE);
        this.textureManager = TextureManager_1.TextureManager.getInstance();
        this.setupCanvas();
        this.setupEventListeners();
    }
    setupCanvas() {
        this.ctx.imageSmoothingEnabled = false;
    }
    setupEventListeners() {
        this.canvas.addEventListener('wheel', this.handleZoom.bind(this));
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    // Implementar métodos de eventos (handleZoom, handleMouseDown, etc.)
    drawGrid() {
        for (let x = 0; x < this.canvas.width; x += exports.GRID_SIZE) {
            for (let y = 0; y < this.canvas.height; y += exports.GRID_SIZE) {
                this.ctx.strokeRect(x, y, exports.GRID_SIZE, exports.GRID_SIZE);
            }
        }
    }
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.renderBlocks();
    }
}
exports.CanvasManager = CanvasManager;
// src/main.ts
const CanvasManager_1 = require("./classes/CanvasManager");
const BlockSelector_1 = require("./classes/BlockSelector");
const TextureManager_1 = require("./classes/TextureManager");
const constants_1 = require("./config/constants");
function initializeApp() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const textureManager = TextureManager_1.TextureManager.getInstance();
            yield textureManager.loadTextures(exports.TEXTURES);
            const canvasManager = new CanvasManager_1.CanvasManager('canvas', 'canvas_container');
            const blockSelector = new BlockSelector_1.BlockSelector('.bloco');
            // Inicializar blocos e começar renderização
            canvasManager.render();
        }
        catch (error) {
            console.error('Failed to initialize app:', error);
        }
    });
}
document.addEventListener('DOMContentLoaded', initializeApp);
