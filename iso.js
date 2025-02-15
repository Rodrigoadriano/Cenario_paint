

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Tamanho de cada tile no grid
const tileWidth = 50;
const tileHeight = 25;

// Tamanho do grid
const gridWidth = 10;
const gridHeight = 10;

function cartesianToIsometric(x, y) {
    const isoX = (x - y) * tileWidth / 2;
    const isoY = (x + y) * tileHeight / 2;
    return { x: isoX, y: isoY };
}

function drawIsoGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'gray';

    // Desenhar linhas horizontais
    for (let y = 0; y <= gridHeight; y++) {
        let start = cartesianToIsometric(0, y);
        let end = cartesianToIsometric(gridWidth, y);
        ctx.beginPath();
        ctx.moveTo(start.x + canvas.width / 2, start.y + canvas.height / 4);
        ctx.lineTo(end.x + canvas.width / 2, end.y + canvas.height / 4);
        ctx.stroke();
    }

    // Desenhar linhas verticais
    for (let x = 0; x <= gridWidth; x++) {
        let start = cartesianToIsometric(x, 0);
        let end = cartesianToIsometric(x, gridHeight);
        ctx.beginPath();
        ctx.moveTo(start.x + canvas.width / 2, start.y + canvas.height / 4);
        ctx.lineTo(end.x + canvas.width / 2, end.y + canvas.height / 4);
        ctx.stroke();
    }
}

drawIsoGrid();
