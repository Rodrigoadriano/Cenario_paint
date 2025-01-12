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
let permitido: boolean;
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
    texture_name : string;
    familia : string;
    selectable: boolean;
    dx?: number;
    dy?: number;
    dw?: number;
    dh?: number;
    mix?: boolean;
    mix_id?: string;
    layer: number;

    constructor(name: string, texture_name: string,familia: string, sx: number, sy: number, sw: number, sh: number, selectable: boolean = false, layer:number = 0) {
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
    name: string;
   
    texturaURL: string;

    constructor(name: string, texturaURL: string) {
        this.name = name;
        this.texturaURL = texturaURL; // Apenas armazenamos o URL
    }
}





let blocosArray = [

    new Bloco("default","brick_dark","bloco_dark",  0, 0, 16, 16,true),
    new Bloco("default","brick", "bloco",  0, 0, 16, 16, true),


    new Bloco("cima","gravel", "gravel1", 16, 0, 16, 16, true),
    new Bloco("esquerda","gravel", "gravel1" , 0, 16, 16, 16,),
    new Bloco("direita","gravel", "gravel1",  32, 16, 16, 16),
    new Bloco("baixo","gravel", "gravel1",  16, 32, 16, 16),
    new Bloco("default","gravel", "gravel1",  16, 16, 16, 16),
    new Bloco("esquerda_cima","gravel", "gravel1",  0, 0, 16, 16),
    new Bloco("direita_cima","gravel", "gravel1",  32, 0, 16, 16),
    new Bloco("esquerda_baixo","gravel", "gravel1",  32, 32, 16, 16),
    new Bloco("direita_baixo", "gravel", "gravel1", 0, 32, 16, 16),

    new Bloco("cima","gravel2", "gravel2",  17, 0, 16, 16, true),
    new Bloco("esquerda","gravel2", "gravel2",  0, 17, 16, 16),
    new Bloco("direita","gravel2", "gravel2",  34, 17, 16, 16),
    new Bloco("baixo","gravel2", "gravel2",  17, 34, 16, 16),
    new Bloco("default","gravel2", "gravel2",  17, 17, 16, 16),
    new Bloco("esquerda_cima","gravel2", "gravel2",  0, 0, 16, 16),
    new Bloco("direita_cima","gravel2", "gravel2",  34, 0, 16, 16),
    new Bloco("esquerda_baixo","gravel2", "gravel2",  34, 34, 16, 16),
    new Bloco("direita_baixo", "gravel2", "gravel2", 0, 34, 16, 16),

    new Bloco("cima","grass3", "grass3",  17, 0, 16, 16, true),
    new Bloco("esquerda","grass3", "grass3",  0, 17, 16, 16),
    new Bloco("direita","grass3", "grass3",  34, 17, 16, 16),
    new Bloco("baixo","grass3", "grass3",  17, 34, 16, 16),
    new Bloco("default","grass3", "grass3",  17, 17, 16, 16),
    new Bloco("esquerda_cima","grass3", "grass3",  0, 0, 16, 16),
    new Bloco("direita_cima","grass3", "grass3",  34, 0, 16, 16),
    new Bloco("esquerda_baixo","grass3", "grass3",  34, 34, 16, 16),
    new Bloco("direita_baixo", "grass3", "grass3", 0, 34, 16, 16),
    
    new Bloco("coluna_topo", "grass3", "grass3", 48, 0, 16, 16 ),
    new Bloco("coluna_meio", "grass3", "grass3", 48, 16, 16, 16 ),
    new Bloco("coluna_baixo", "grass3", "grass3", 48, 32, 16, 16 ),

    new Bloco("plataforma_1", "grass3", "grass3", 0, 48, 16, 16 ),
    new Bloco("plataforma_2", "grass3", "grass3", 16, 48, 16, 16 ),
    new Bloco("plataforma_3", "grass3", "grass3", 32, 48, 16, 16 ),
    new Bloco("full", "grass3", "grass3", 48, 48, 16, 16 ),

    new Bloco("cima","guia", "guia",  16, 0, 16, 16, true),
    new Bloco("esquerda","guia", "guia",  0, 16, 16, 16),
    new Bloco("direita","guia", "guia",  32, 16, 16, 16),
    new Bloco("baixo","guia", "guia",  16, 32, 16, 16),
    new Bloco("default","guia", "guia",  16, 16, 16, 16),
    new Bloco("esquerda_cima","guia", "guia",  0, 0, 16, 16),
    new Bloco("direita_cima","guia", "guia",  32, 0, 16, 16),
    new Bloco("esquerda_baixo","guia", "guia",  32, 32, 16, 16),
    new Bloco("direita_baixo", "guia", "guia", 0, 32, 16, 16),
    
    new Bloco("coluna_topo", "guia", "guia", 48, 0, 16, 16 ),
    new Bloco("coluna_meio", "guia", "guia", 48, 16, 16, 16 ),
    new Bloco("coluna_baixo", "guia", "guia", 48, 32, 16, 16 ),

    new Bloco("plataforma_1", "guia", "guia", 0, 48, 16, 16 ),
    new Bloco("plataforma_2", "guia", "guia", 16, 48, 16, 16 ),
    new Bloco("plataforma_3", "guia", "guia", 32, 48, 16, 16 ),
    
    new Bloco("inter_1", "guia", "guia", 80, 16, 16, 16),
    new Bloco("inter_2", "guia", "guia", 80, 0, 16, 16 ),
    new Bloco("inter_3", "guia", "guia", 64, 16, 16, 16 ),
    new Bloco("inter_4", "guia", "guia", 64, 0, 16, 16 ),

    new Bloco("full", "guia", "guia", 48, 48, 16, 16 ),








    new Bloco("mix","mix", "mix",  16, 0, 16, 16, true),
    new Bloco("mix","mix", "mix", 0, 16, 16, 16),
    new Bloco("mix","mix", "mix", 32, 16, 16, 16),
    new Bloco("mix","mix", "mix", 16, 16, 16, 16),
    new Bloco("mix","mix", "mix", 0, 0, 16, 16),
    new Bloco("mix","mix","mix",  32, 0, 16, 16),
    new Bloco("mix","mix", "mix", 32, 0, 16, 16),


    new Bloco("default","escada","escada",  0, 0, 16, 16,true,1),
    new Bloco("default","grass","verde",  0, 0, 16, 15,true,2),
    new Bloco("cima","grass", "vermelha", 16, 0, 16, 16,true,2)

    
  

]
let TexturasArray = [
    new textura("brick", "src/assets/textures/16.png"),
    new textura("brick_dark", "src/assets/textures/17.png"),
    new textura("gravel", "src/assets/textures/Sprite-0002.png"),
    new textura("gravel2", "src/assets/textures/gravel.png"),
    new textura("mix", "src/assets/textures/bloco_pedra.png"),
    new textura("escada", "src/assets/textures/escada.png"),
    new textura("grass", "src/assets/textures/grass.png"),
    new textura("grass3", "src/assets/textures/grass3.png"),
    new textura("guia", "src/assets/textures/guia.png"),


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
    console.log('Texturas carregadas:', loadedTextures);
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
function selectBloco(id: string) {
    console.log('Selecionar o bloco id:',id);
    document.querySelectorAll('.blocos').forEach(bloco => (bloco as HTMLDivElement).style.border = 'none');
    let target = document.getElementById(String(id)) as HTMLDivElement;
    // Adiciona uma borda ao bloco clicado
    target.style.border = "4px solid #3b59c0";
    
    // Define o bloco selecionado
    Blocoselected = blocosArray[Number(id)];
};    

function seletorBlocos(bloco: Bloco[], texturas: textura[]) {
    // Seleciona o elemento pai que conterá os blocos
    const blocoContainer = document.querySelector('.bloco') as HTMLDivElement;

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
            div.addEventListener('click', (event: MouseEvent) => {

           
                const target = event.currentTarget as HTMLDivElement; // Garante que o target é um HTMLDivElement
                const clickedId: number = Number(target.id) ;
                 // Obtém o ID do elemento clicado
                permitido= true;
                // Remove a borda de todos os blocos
                

            selectBloco(String( clickedId));
            
            });

            // Adiciona a div ao elemento pai
            blocoContainer.appendChild(div);
    }});
}
function DrawBloco(B1: Bloco, texturas: textura[]) {
        const texture = loadedTextures[B1.texture_name];
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


function CordinateManager(event: MouseEvent) {
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
        const index = cordenadas.findIndex(
            (Bloco) =>
                Bloco.dx === dx &&
                Bloco.dy === dy &&
                Bloco.layer === Blocoselected!.layer
        );

        if (index !== -1) {
            cordenadas.splice(index, 1);
        }

        cordenadas.push({ ...Blocoselected! });
        
    }else{
        // Se for deletar, remove o bloco na posição clicada
        if(cordenadas.length === 0){
            return
        }

        const index =  cordenadas.length - 1 - cordenadas.slice().reverse().findIndex(
            (Bloco) =>
                Bloco.dx === dx &&
                Bloco.dy === dy
        );

        if (index !== -1  && index < cordenadas.length) {
            console.log('Deletar bloco:',index);
            let index_ = blocosArray.findIndex((x)=>
                x.name === cordenadas[index].name &&
                x.familia === cordenadas[index].familia &&
                x.texture_name === cordenadas[index].texture_name
            );
            if(index_ !== -1){
                selectBloco(String(index_));
            }
           
            cordenadas.splice(index, 1);
        }
      
    }
    permitido = false;

    render();
}
function forno() {
    let coringa: Bloco | null = null;

    cordenadas.sort((a, b) => a.layer - b.layer).forEach((bloco) => {

        const  esquerda = bloco.dx! - gridSize 
        const  direita = bloco.dx! + gridSize
        const  cima = bloco.dy! - gridSize
        const  baixo = bloco.dy! + gridSize
        const  familia = bloco.familia

    

        const  mix = bloco.mix
       
        const esquerdaVazia = esquerda > 0 && !cordenadas.some((b) => b.dx === esquerda && b.dy === bloco.dy && b.familia === familia);
        const ponta_1_vazia = esquerda > 0 && cima > 0 && !cordenadas.some((b) => b.dx === esquerda && b.dy === (bloco.dy! - gridSize) && b.familia === familia);
        const ponta_2_vazia = esquerda > 0  && baixo < canvas.height && !cordenadas.some((b) => b.dx === esquerda && b.dy === (bloco.dy! + gridSize) && b.familia === familia);

        const direitaVazia = direita < canvas.width && !cordenadas.some((b) => b.dx === direita && b.dy === bloco.dy && b.familia === familia);
        const ponta_3_vazia =  direita < canvas.width && cima > 0 && !cordenadas.some((b) => b.dx === direita && b.dy === (bloco.dy! - gridSize) && b.familia === familia);
        const ponta_4_vazia =  direita < canvas.width && baixo < canvas.height && !cordenadas.some((b) => b.dx === direita && b.dy === (bloco.dy! + gridSize) && b.familia === familia);

        const cimaVazia = cima > 0 && !cordenadas.some((b) => b.dy === cima && b.dx === bloco.dx && b.familia === familia);
        const baixoVazia = baixo < canvas.height && !cordenadas.some((b) => b.dy === baixo && b.dx === bloco.dx && b.familia === familia);


     

        function getBloco(name: string) {

            const bloco = blocosArray.find(item => item.familia === familia && item.name === name);

            const bloco2 = bloco ? bloco : blocosArray.find(item => item.familia === familia && item.name === "default")!;


            return bloco2
        }



        function getRandomBloco(id?: string) {
            if(id){
                return blocosArray.find(item => item.familia === familia && item.mix_id === id) || bloco;
            }
            const familyBlocos = blocosArray.filter(item => item.familia === familia);
            const random = Math.floor(Math.random() * familyBlocos.length);
            const sorteado = familyBlocos[random]
            sorteado.mix_id = String(random);
            return sorteado || bloco;
        }

        switch (true) {
            case bloco.name === "mix":
            //get random block 
            if(!mix){
                coringa = getRandomBloco();
                bloco.mix = true;
                bloco.mix_id = coringa.mix_id;
            } else {
                coringa = getRandomBloco(bloco.mix_id);
            }
            break;

            case esquerdaVazia && direitaVazia && cimaVazia && !baixoVazia:
            coringa = getBloco("coluna_topo")!;
    
            if (coringa) break;

            case esquerdaVazia && direitaVazia && !cimaVazia && baixoVazia:
            coringa = getBloco("coluna_baixo")!;
            if (coringa) break;

            case esquerdaVazia && direitaVazia && !cimaVazia && !baixoVazia:
            coringa = getBloco("coluna_meio")!;
            if (coringa) break;


            case esquerdaVazia && !direitaVazia && cimaVazia && baixoVazia:
            coringa = getBloco("plataforma_1")!;
            if (coringa) break;
            case !esquerdaVazia && !direitaVazia && cimaVazia && baixoVazia:
            coringa = getBloco("plataforma_2")!;
            if (coringa) break;
            case !esquerdaVazia && direitaVazia && cimaVazia && baixoVazia:
            coringa = getBloco("plataforma_3")!;
            if (coringa) break;

            case esquerdaVazia && direitaVazia && cimaVazia && baixoVazia:
            coringa = getBloco("full")!
            if (coringa) break;
            

            case !esquerdaVazia && !direitaVazia && !cimaVazia && !baixoVazia &&ponta_1_vazia:
            coringa = getBloco("inter_1")!;
            if (coringa) break;
                      
            case !esquerdaVazia && !direitaVazia && !cimaVazia && !baixoVazia &&ponta_2_vazia:
            coringa = getBloco("inter_2")!;
            if (coringa) break;
                      
            case !esquerdaVazia && !direitaVazia && !cimaVazia && !baixoVazia &&ponta_3_vazia:
            coringa = getBloco("inter_3")!;
            if (coringa) break;
                      
            case !esquerdaVazia && !direitaVazia && !cimaVazia && !baixoVazia &&ponta_4_vazia:
            coringa = getBloco("inter_4")!;
            if (coringa) break;
                      
 



            case esquerdaVazia && cimaVazia:
            coringa = getBloco("esquerda_cima")!;
    
            if (coringa) break;

            case direitaVazia && cimaVazia:
            coringa = getBloco("direita_cima")!;
            if (coringa) break;

            case baixoVazia && !direitaVazia && !cimaVazia && esquerdaVazia:
            coringa = getBloco("direita_baixo")!;
            if (coringa) break;

            case baixoVazia && !esquerdaVazia && !cimaVazia && direitaVazia:
            coringa = getBloco("esquerda_baixo")!;
            if (coringa) break;

            case esquerdaVazia:
            coringa = getBloco("esquerda")!;
            if (coringa) break;

            case direitaVazia:
            coringa = getBloco("direita")!;
            if (coringa) break;

            case cimaVazia:
            coringa = getBloco("cima")!;
            if (coringa) break;

            case baixoVazia:
            coringa = getBloco("baixo")!;
            if (coringa) break;

            default:
            coringa = getBloco("default")!;
            break;
        }
  
    
        
      
            

        if (coringa) {
            coringa.dx = bloco.dx;
            coringa.dy = bloco.dy;
            coringa.dh = gridSize;
            coringa.dw = gridSize;
            forma.push({ ...coringa });
        }


  

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
        permitido = true;
        clicked = true;
        CordinateManager(event);
    } else if (event.button === 2) { // Botão direito
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
    CordinateManager(event);

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