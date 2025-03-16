

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


  interface BlocoOptions {
    name: string;
    texture_name: string;
    familia: string;
    linha:number;
    coluna:number;
    altura?:number;
    largura: number;
    gap?: number;
    sx?: number;
    sy?: number;
    sw?: number;
    sh?: number;
    selectable?: boolean;
    layer?: number;
    dx?: number;
    dy?: number;
    dw?: number;
    dh?: number;
    mix?: boolean;
    mix_id?: string;
}

  class Bloco {

    // image: HTMLImageElement;
    sx?: number;
    sy?: number;
    sw?: number;
    sh?: number;

    name: string;
    texture_name : string;
    familia : string;

    linha:number;
    coluna:number;

    altura?:number;
    largura: number;

    gap?: number;

    selectable?: boolean;
    dx?: number;
    dy?: number;
    dw?: number;
    dh?: number;
    mix?: boolean;
    mix_id?: string;
    layer?: number;

    constructor(options: BlocoOptions) {
        const {
            name,
            texture_name,
            familia,
            linha,
            coluna,
            altura,
            largura,
            gap =0,
            sw,
            sh,
            selectable = false,
            layer = 0,
            dx,
            dy,
            dw,
            dh,
            mix,
            mix_id
        } = options;

        this.name = name;
        this.texture_name = texture_name;
        this.familia = familia;
        this.linha = linha;
        this.coluna= coluna;
        this.altura = altura! > 0 ? altura:largura;
        this.largura= largura;
        this.gap = gap
        this.selectable = selectable;
        this.layer = layer;
        this.sx = (this.largura * this.coluna) - this.largura + this.gap;
        this.sy = (this.altura! * this.linha) - this.altura! + this.gap;
        this.sw = this.largura;
        this.sh = this.altura;
        this.dx = dx;
        this.dy = dy;
        this.dw = dw;
        this.dh = dh;
        this.mix = mix;
        this.mix_id = mix_id;
    }


}
class textura {
    name: string;
    path: string;
    width?: Number;

    constructor({name, path}: {name: string; path: string}) {
        this.name = name;
        this.path = path; // Apenas armazenamos o URL
    }
}

let blocosArray: Bloco[] = [  

]
function PreloadBlocos(){


    const preblocos: Bloco[] = [
            { name: "default", familia: "bloco_dark", texture_name: "brick_dark", coluna: 1, linha: 1, largura: 16, altura: 16, selectable: true },
            { name: "default", familia: "bloco", texture_name: "brick", coluna: 1, linha: 1, largura: 16, altura: 16, selectable: true },
          

          
            { name: "cima", familia: "grass3", texture_name: "grass3", coluna: 2, linha: 1, largura: 16, altura: 16, selectable: true },
            { name: "esquerda", familia: "grass3", texture_name: "grass3", coluna: 1, linha: 2, largura: 16, altura: 16 },
            { name: "direita", familia: "grass3", texture_name: "grass3", coluna: 3, linha: 2, largura: 16, altura: 16 },
            { name: "baixo", familia: "grass3", texture_name: "grass3", coluna: 2, linha: 3, largura: 16, altura: 16 },
            { name: "default", familia: "grass3", texture_name: "grass3", coluna: 2, linha: 2, largura: 16, altura: 16 },
            { name: "esquerda_cima", familia: "grass3", texture_name: "grass3", coluna: 1, linha: 1, largura: 16, altura: 16 },
            { name: "direita_cima", familia: "grass3", texture_name: "grass3", coluna: 3, linha: 1, largura: 16, altura: 16 },
            { name: "esquerda_baixo", familia: "grass3", texture_name: "grass3", coluna: 3, linha: 3, largura: 16, altura: 16 },
            { name: "direita_baixo", familia: "grass3", texture_name: "grass3", coluna: 1, linha: 3, largura: 16, altura: 16 },
            { name: "coluna_topo", familia: "grass3", texture_name: "grass3", coluna: 4, linha: 1, largura: 16, altura: 16 },
            { name: "coluna_meio", familia: "grass3", texture_name: "grass3", coluna: 4, linha: 2, largura: 16, altura: 16 },
            { name: "coluna_baixo", familia: "grass3", texture_name: "grass3", coluna: 4, linha: 3, largura: 16, altura: 16 },
            { name: "plataforma_1", familia: "grass3", texture_name: "grass3", coluna: 1, linha: 4, largura: 16, altura: 16 },
            { name: "plataforma_2", familia: "grass3", texture_name: "grass3", coluna: 2, linha: 4, largura: 16, altura: 16 },
            { name: "plataforma_3", familia: "grass3", texture_name: "grass3", coluna: 3, linha: 4, largura: 16, altura: 16 },
            { name: "full", familia: "grass3", texture_name: "grass3", coluna: 4, linha: 4, largura: 16, altura: 16 },
            { name: "inter_1", familia: "grass3", texture_name: "grass3", coluna: 6, linha: 2, largura: 16, altura: 16 },
            { name: "inter_2", familia: "grass3", texture_name: "grass3", coluna: 6, linha: 1, largura: 16, altura: 16 },
            { name: "inter_3", familia: "grass3", texture_name: "grass3", coluna: 5, linha: 2, largura: 16, altura: 16 },
            { name: "inter_4", familia: "grass3", texture_name: "grass3", coluna: 5, linha: 1, largura: 16, altura: 16 },
          
            { name: "default", familia: "escada", texture_name: "escada", coluna: 1, linha: 1, largura: 16, altura: 16, selectable: true, layer: 1 },
            { name: "default", familia: "verde", texture_name: "grass", coluna: 1, linha: 1, largura: 16, altura: 15, selectable: true, layer: 2 },
            { name: "cima", familia: "vermelha", texture_name: "grass", coluna: 2, linha: 1, largura: 16, altura: 16, selectable: true, layer: 2 },


            { name: "cima", familia: "guia", texture_name: "guia", coluna: 2, linha: 1, largura: 16, altura: 16, selectable: true },
            { name: "esquerda", familia: "guia", texture_name: "guia", coluna: 1, linha: 2, largura: 16, altura: 16 },
            { name: "direita", familia: "guia", texture_name: "guia", coluna: 3, linha: 2, largura: 16, altura: 16 },
            { name: "baixo", familia: "guia", texture_name: "guia", coluna: 2, linha: 3, largura: 16, altura: 16 },
            { name: "default", familia: "guia", texture_name: "guia", coluna: 2, linha: 2, largura: 16, altura: 16 },
            { name: "esquerda_cima", familia: "guia", texture_name: "guia", coluna: 1, linha: 1, largura: 16, altura: 16 },
            { name: "direita_cima", familia: "guia", texture_name: "guia", coluna: 3, linha: 1, largura: 16, altura: 16 },
            { name: "esquerda_baixo", familia: "guia", texture_name: "guia", coluna: 3, linha: 3, largura: 16, altura: 16 },
            { name: "direita_baixo", familia: "guia", texture_name: "guia", coluna: 1, linha: 3, largura: 16, altura: 16 },
            { name: "coluna_topo", familia: "guia", texture_name: "guia", coluna: 4, linha: 1, largura: 16, altura: 16 },
            { name: "coluna_meio", familia: "guia", texture_name: "guia", coluna: 4, linha: 2, largura: 16, altura: 16 },
            { name: "coluna_baixo", familia: "guia", texture_name: "guia", coluna: 4, linha: 3, largura: 16, altura: 16 },
            { name: "plataforma_1", familia: "guia", texture_name: "guia", coluna: 1, linha: 4, largura: 16, altura: 16 },
            { name: "plataforma_2", familia: "guia", texture_name: "guia", coluna: 2, linha: 4, largura: 16, altura: 16 },
            { name: "plataforma_3", familia: "guia", texture_name: "guia", coluna: 3, linha: 4, largura: 16, altura: 16 },
            { name: "inter_1", familia: "guia", texture_name: "guia", coluna: 6, linha: 2, largura: 16, altura: 16 },
            { name: "inter_2", familia: "guia", texture_name: "guia", coluna: 6, linha: 1, largura: 16, altura: 16 },
            { name: "inter_3", familia: "guia", texture_name: "guia", coluna: 5, linha: 2, largura: 16, altura: 16 },
            { name: "inter_4", familia: "guia", texture_name: "guia", coluna: 5, linha: 1, largura: 16, altura: 16 },
            { name: "full", familia: "guia", texture_name: "guia", coluna: 4, linha: 4, largura: 16, altura: 16 },
    
            
            { name: "mix", familia: "mix", texture_name: "mix", coluna: 2, linha: 1, largura: 16, altura: 16, selectable: true },
            { name: "mix", familia: "mix", texture_name: "mix", coluna: 1, linha: 2, largura: 16, altura: 16 },
            { name: "mix", familia: "mix", texture_name: "mix", coluna: 3, linha: 2, largura: 16, altura: 16 },
            { name: "mix", familia: "mix", texture_name: "mix", coluna: 2, linha: 2, largura: 16, altura: 16 },
            { name: "mix", familia: "mix", texture_name: "mix", coluna: 1, linha: 1, largura: 16, altura: 16 },
            { name: "mix", familia: "mix", texture_name: "mix", coluna: 3, linha: 1, largura: 16, altura: 16 }
              
              
          
          
    ] 

    preblocos.forEach((pre)=>{

        let xxx = new Bloco(pre);
        console.log("new Bloco: "+xxx);
        blocosArray.push({...xxx})
    })

};


const texturePath = "src/assets/textures/";
let TexturePool: textura[] = [
    {name: 'brick', path: texturePath + "16.png"},
    {name: 'brick_dark', path: texturePath + "17.png"},
    {name: 'gravel', path: texturePath + "Sprite-0002.png"},
    {name: 'gravel2', path: texturePath + "gravel.png"},
    {name: 'mix', path: texturePath + "bloco_pedra.png"},
    {name: 'escada', path: texturePath + "escada.png"},
    {name: 'grass', path: texturePath + "grass.png"},
    {name: 'grass3', path: texturePath + "grass3.png"},
    {name: 'guia', path: texturePath + "guia.png"}
];

let TexturasArray: textura[] = [
    // new textura("brick", "src/assets/textures/16.png"),
    // new textura("brick_dark", "src/assets/textures/17.png"),
    // new textura("gravel", "src/assets/textures/Sprite-0002.png"),
    // new textura("gravel2", "src/assets/textures/gravel.png"),
    // new textura("mix", "src/assets/textures/bloco_pedra.png"),
    // new textura("escada", "src/assets/textures/escada.png"),
    // new textura("grass", "src/assets/textures/grass.png"),
    // new textura("grass3", "src/assets/textures/grass3.png"),
    // new textura("guia", "src/assets/textures/guia.png"),


];
async function preloadTextures(): Promise<void> {

    TexturePool.forEach( (text)=> {
        TexturasArray.push(new textura(text))
    })






    const promises = TexturasArray.map((t) => {
        if (!loadedTextures[t.name]) {
            return new Promise<void>((resolve, reject) => {
                const img = new Image();
                img.src = t.path; // Define o URL da imagem
                t.width = img.width;
                img.onload = () => {
                    loadedTextures[t.name] = img; // Armazena a imagem carregada
                    // t.width = img.width; // Armazena a largura
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

            ctx.strokeStyle = "rgba(168, 162, 162, 0.54)";



          
            
        }
    }
}

function drawIsoGrid() {

    
function cartesianToIsometric(x: number, y:number) {
    const isoX = (x - y) * canvas.width / 2;
    const isoY = (x + y) * canvas.height / 2;
    return { x: isoX, y: isoY };
}
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'gray';

    // Desenhar linhas horizontais
    for (let y = 0; y <= canvas.height; y+gridSize) {
        console.log("Y" + y);
        let start = cartesianToIsometric(0, y);
        let end = cartesianToIsometric(canvas.width, y);
        ctx.beginPath();
        ctx.moveTo(start.x + canvas.width / 2, start.y + canvas.height / 4);
        ctx.lineTo(end.x + canvas.width / 2, end.y + canvas.height / 4);
        ctx.stroke();
    }

    // Desenhar linhas verticais
    for (let x = 0; x <= canvas.width; x+gridSize) {
        let start = cartesianToIsometric(x, 0);
        let end = cartesianToIsometric(x, canvas.height);
        ctx.beginPath();
        ctx.moveTo(start.x + canvas.width / 2, start.y + canvas.height / 4);
        ctx.lineTo(end.x + canvas.width / 2, end.y + canvas.height / 4);
        ctx.stroke();
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

function seletorBlocos() {
    // Seleciona o elemento pai que conterá os blocos
    const blocoContainer = document.querySelector('.bloco') as HTMLDivElement;

    // Itera sobre o array de blocos
    blocosArray.forEach((bloco, index) => {
        if (bloco.selectable) {
            const div = document.createElement('div'); // Cria uma nova div
            div.className = 'blocos'; // Adiciona a classe 'blocos'
            div.id = (index).toString(); // Define o ID como o índice + 1

            // Configura a textura se existir
            const texture = loadedTextures[bloco.texture_name];
            if (texture) {
            div.style.backgroundImage = `url(${texture.src})`;
            div.style.backgroundSize = `${texture.width * (64 / bloco.sw!)}px ${texture.height * (64 / bloco.sh!)}px`;
            div.style.backgroundPosition = `-${bloco.sx! * (64 / bloco.sw!)}px -${bloco.sy! * (64 / bloco.sh!)}px`;
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
function DrawBloco(B1: Bloco) {
        const texture = loadedTextures[B1.texture_name];
        if (texture) {
            ctx.drawImage(
                texture,
                B1.sx!,
                B1.sy!,
                B1.sw!,
                B1.sh!,
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
    //drawIsoGrid();
    forno();
    forma.sort((a, b) => a.layer! - b.layer!).forEach((bloco) => {
     
        DrawBloco(bloco);
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

    cordenadas.sort((a, b) => a.layer! - b.layer!).forEach((bloco) => {

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
        await preloadTextures(); // Aguarda o carregamento das texturas

        PreloadBlocos();
        seletorBlocos(); // Usa as texturas carregadas
        render(); // Renderiza a aplicação
    } catch (error) {
        console.log("ERROS")
        console.error(error); // Lida com erros no carregamento
    }
}

init(); // Inicia o processo