const canvas = document.getElementById('canvas') as HTMLCanvasElement ;
const canvasContainer = document.getElementsByClassName('canvas_container')[0] as HTMLElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const gridSize = 32;
let Zoom = 1;
const scaleFactor = 1.1;
let cordenadas: Bloco[] = [];
let forma: Bloco[] = [];
let isDragging = false;
let startX: number, startY: number;
const loadedTextures: Record<string, HTMLImageElement> = {};
let blocos: NodeListOf<HTMLDivElement> = document.querySelectorAll('.blocos');
let Blocoselected: Bloco | null = null;
let deletar = false;
let clicked = false;
let lastDx: number | null = null;
let lastDy: number | null = null;

if (canvas) {
    if (ctx) {
        ctx.imageSmoothingEnabled = false;
    }
}
canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });
class Bloco {

    // image: HTMLImageElement;
    sx: number;
    sy: number;
    sw: number;
    sh: number;
    name: string;
    familia : string;
    dx?: number;
    dy?: number;
    dw?: number;
    dh?: number;

    constructor(name: string, familia: string, sx: number, sy: number, sw: number, sh: number) {
        this.name = name;
        this.familia = familia;
        this.sx = sx;
        this.sy = sy;
        this.sw = sw;
        this.sh = sh;
    }


}
class textura {
    name: string;
   
    texturaURL: string;

    constructor(name: string, texturaURL: string) {
        this.name = name;
        this.texturaURL = texturaURL; // Apenas armazenamos o URL
    }
}
let blocosArray = [
    // new Bloco("xis",  0, 0, 16, 16),
    // new Bloco("xis",  17, 0, 16, 16),
    // new Bloco("xis",  34, 0, 16, 16),
    // new Bloco("brick",  0, 0, 16, 16),
    // new Bloco("brick_dark",  0, 0, 16, 16),
    // new Bloco("brick_sepia",  0, 0, 16, 16),
    new Bloco("gravel","gravel",  17, 0, 16, 16),
    new Bloco("gravel","gravel",  0, 17, 16, 16),
    new Bloco("gravel","gravel",  34, 17, 16, 16),
    new Bloco("gravel","gravel",  17, 34, 16, 16),
    new Bloco("gravel","gravel",  17, 17, 16, 16),
    new Bloco("gravel","gravel",  0, 0, 16, 16),

    new Bloco("gravel","gravel",  34, 0, 16, 16),
    new Bloco("gravel","gravel",  34, 34, 16, 16),
    new Bloco("gravel", "gravel", 0, 34, 16, 16),

]
let TexturasArray = [
    new textura("brick", "16.png"),
    new textura("xis", "00.png"),
    new textura("brick_dark", "17.png"),
    new textura("brick_sepia", "18.png"),
    new textura("gravel", "gravel.png")
];
async function preloadTextures(texturas: textura[]): Promise<void> {
    const promises = texturas.map((t) => {
        if (!loadedTextures[t.name]) {
            return new Promise<void>((resolve, reject) => {
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

    await Promise.all(promises); // Aguarda todas as Promises serem resolvidas
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
function seletorBlocos(bloco: Bloco[], texturas: textura[]) {
    // Seleciona o elemento pai que conterá os blocos
    const blocoContainer = document.querySelector('.bloco') as HTMLDivElement;

    // Itera sobre o array de blocos
    bloco.forEach((bloco, index) => {
        const div = document.createElement('div'); // Cria uma nova div
        div.className = 'blocos'; // Adiciona a classe 'blocos'
        div.id = (index + 1).toString(); // Define o ID como o índice + 1

        // Configura a textura se existir
        const texture = loadedTextures[bloco.name];
        if (texture) {
            div.style.backgroundImage = `url(${texture.src})`;
            div.style.backgroundSize = `${texture.width * (64 / bloco.sw)}px ${texture.height * (64 / bloco.sh)}px`;
            div.style.backgroundPosition = `-${bloco.sx * (64 / bloco.sw)}px -${bloco.sy * (64 / bloco.sh)}px`;
            div.style.backgroundRepeat = 'no-repeat';
        }

        // Adiciona o evento de clique ao criar o bloco
        div.addEventListener('click', (event: MouseEvent) => {
            const target = event.currentTarget as HTMLDivElement; // Garante que o target é um HTMLDivElement
            const clickedId: number = Number(target.id) - 1; // Obtém o ID do elemento clicado
            
            // Remove a borda de todos os blocos
            document.querySelectorAll('.blocos').forEach(bloco => (bloco as HTMLDivElement).style.border = 'none');
            
            // Adiciona uma borda ao bloco clicado
            target.style.border = "4px solid #3b59c0";
            
            // Define o bloco selecionado
            Blocoselected = blocosArray[clickedId];
        });

        // Adiciona a div ao elemento pai
        blocoContainer.appendChild(div);
    });
}
function DrawBloco(B1: Bloco, texturas: textura[]) {
        const texture = loadedTextures[B1.name];
        if (texture) {
            ctx.drawImage(
                texture,
                B1.sx,
                B1.sy,
                B1.sw,
                B1.sh,
                B1.dx!,
                B1.dy!,
                B1.dw!,
                B1.dh!
            );
        } else {
            console.error(`Textura não encontrada para: ${B1.name}`);
        }
}
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    forno();
// Clear the canvas

    forma.forEach((bloco) => {
     
        DrawBloco(bloco, TexturasArray);
    });

    forma = [];
    
}


function paint(event: MouseEvent) {

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / Zoom;
    const y = (event.clientY - rect.top) / Zoom;
    const dx = Math.floor(x / gridSize) * gridSize;
    const dy = Math.floor(y / gridSize) * gridSize;

    if (dx !== lastDx || dy !== lastDy) {
        // Atualizar as últimas posições processadas
        lastDx = dx;
        lastDy = dy;

    
        if (Blocoselected) {
            Blocoselected.dx = dx;
            Blocoselected.dy = dy;
            Blocoselected.dh = gridSize;
            Blocoselected.dw = gridSize;

        // Verificar se já existe um bloco nas mesmas coordenadas
        const index = cordenadas.findIndex(
            (Bloco) => Bloco.dx === Blocoselected!.dx && Bloco.dy === Blocoselected!.dy
        );

        if (index !== -1) {
            // Existe: remove o bloco
            cordenadas.splice(index, 1);
            
        }
        
    }
        if(!deletar){
            cordenadas.push({ ...Blocoselected! });
             
        }

        render();

        
    }
}
function forno() {
    let coringa: Bloco | null = null;

    cordenadas.forEach((bloco) => {

        let esquerda = bloco.dx! - gridSize 
        let direita = bloco.dx! + gridSize
        let cima = bloco.dy! - gridSize
        let baixo = bloco.dy! + gridSize

       
        const esquerdaVazia = esquerda > 0 && !cordenadas.some((b) => b.dx === esquerda && b.dy === bloco.dy);

        const direitaVazia = direita < canvas.width && !cordenadas.some((b) => b.dx === direita && b.dy === bloco.dy);

        const cimaVazia = cima > 0 && !cordenadas.some((b) => b.dy === cima && b.dx === bloco.dx);
        const baixoVazia = baixo < canvas.height && !cordenadas.some((b) => b.dy === baixo && b.dx === bloco.dx);


        switch (true) {
            case esquerdaVazia && direitaVazia && cimaVazia && baixoVazia:
            coringa = blocosArray[4]; // Exemplo: bloco para todos os lados vazios
            break;

            case esquerdaVazia && cimaVazia:
            coringa = blocosArray[5]; // Exemplo: bloco para esquerda e cima vazios
            break;
            case direitaVazia && cimaVazia:
            coringa = blocosArray[6]; // Exemplo: bloco para esquerda e cima vazios
            break;
            case baixoVazia && !direitaVazia && !cimaVazia && esquerdaVazia:
                coringa = blocosArray[8]; // Exemplo: bloco para esquerda e cima vazios
                break;
            case baixoVazia && !esquerdaVazia && !cimaVazia && direitaVazia:	
                coringa = blocosArray[7]; // Exemplo: bloco para esquerda e cima vazios
                break;

            case esquerdaVazia:
            coringa = blocosArray[1]; // Exemplo: bloco para esquerda vazia
            break;
            case direitaVazia:
            coringa = blocosArray[2]; // Exemplo: bloco para direita vazia
            break;
            case cimaVazia:
            coringa = blocosArray[0]; // Exemplo: bloco para cima vazia
            break;
            case baixoVazia:
            coringa = blocosArray[3]; // Exemplo: bloco para baixo vazia
            break;
            default:
            coringa = bloco; // Nenhum lado vazio
            break;
        }
  
    
        
      
            

        coringa.dx = bloco.dx;
        coringa.dy = bloco.dy;
        coringa.dh = gridSize;
        coringa.dw = gridSize;
            forma.push({ ...coringa });


  

        // forma.push({ ...BlocoEsquerda! });
        
    
    })

    

}

canvas.addEventListener('wheel', (event: WheelEvent) => {
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
canvas.addEventListener('mousedown', (event) => {
    if (event.button === 0) { // Botão esquerdo
        deletar = false;
        clicked = true;
        paint(event);
    } else if (event.button === 2) { // Botão direito
        deletar = true;
        clicked = true;
        paint(event);
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
        deletar = false
      }
    clicked= false;
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
        return;}
    paint(event);

});
canvasContainer.addEventListener('mouseleave', () => {
    isDragging = false;
    canvasContainer.style.cursor = 'default';
});

async function init() {
    try {
        await preloadTextures(TexturasArray); // Aguarda o carregamento das texturas
        seletorBlocos(blocosArray, TexturasArray); // Usa as texturas carregadas
        render(); // Renderiza a aplicação
    } catch (error) {
        console.error(error); // Lida com erros no carregamento
    }
}

init(); // Inicia o processo