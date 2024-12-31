const canvas = document.getElementById('canvas');
const canvasContainer = document.getElementsByClassName('canvas_container')[0];
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const gridSize = 64;
let Zoom = 1;
const scaleFactor = 1.1;

// Supondo que SelectedTexture seja uma instância de Image
const SelectedTexture = new Image();
SelectedTexture.src = "16.png"; // Substitua pelo caminho da sua imagem


// Draw the grid
function drawGrid() {
    for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.strokeRect(x, y, gridSize, gridSize);
        }
    }
}
drawGrid();

// Zoom functionality
canvas.addEventListener('wheel', (event) => {
    event.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const prevZoom = Zoom;

    if (event.deltaY < 0) {
        // Zoom in
        Zoom *= scaleFactor;
    } else {
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


// Paint the clicked quadrant with the selected texture
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / Zoom;
    const y = (event.clientY - rect.top) / Zoom;

    const gridX = Math.floor(x / gridSize) * gridSize;
    const gridY = Math.floor(y / gridSize) * gridSize;

    // Desenhar apenas os primeiros 16x16 pixels da imagem
    ctx.drawImage(SelectedTexture, 0, 0, 16, 16, gridX, gridY, gridSize, gridSize);
});


canvasContainer.addEventListener('wheel', (event) => {
    event.preventDefault();

    if (event.deltaY < 0) {
        // Zoom in
        Zoom *= scaleFactor;
    } else {
        // Zoom out
        Zoom /= scaleFactor;
    }

    canvas.style.transform = `scale(${Zoom})`;
    canvas.style.transformOrigin = 'center center';
});

let isDragging = false;
let startX, startY;

canvasContainer.addEventListener('mousedown', (event) => {
    if (event.button === 1) { // Middle mouse button
        isDragging = true;
        startX = event.clientX - canvas.offsetLeft;
        startY = event.clientY - canvas.offsetTop;
        canvasContainer.style.cursor = 'grabbing';
    }
});

canvasContainer.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const x = event.clientX - startX;
        const y = event.clientY - startY;
        canvas.style.left = `${x}px`;
        canvas.style.top = `${y}px`;
    }
});

canvasContainer.addEventListener('mouseup', () => {
    isDragging = false;
    canvasContainer.style.cursor = 'default';
});

canvasContainer.addEventListener('mouseleave', () => {
    isDragging = false;
    canvasContainer.style.cursor = 'default';
});
