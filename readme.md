# Editor de Mapas com Blocos

Um editor de mapas baseado em navegador, construído com TypeScript e HTML5 Canvas, que permite aos usuários criar e editar mapas 2D com vários blocos de textura e características de terreno.

## Funcionalidades

- **Sistema de Grade Interativo**: Posicione e edite blocos em uma grade customizável
- **Suporte a Múltiplas Texturas**: Suporte para várias texturas e folhas de sprites
- **Sistema de Camadas**: Múltiplas camadas para designs de mapa complexos
- **Posicionamento Inteligente**: Seleção automática de blocos baseada nos blocos vizinhos
- **Zoom e Movimentação**: Controles intuitivos de zoom e movimentação para edição precisa
- **Pré-carregamento de Texturas**: Gerenciamento eficiente de texturas com sistema de pré-carregamento

## Controles

- **Clique Esquerdo**: Posiciona o bloco selecionado
- **Clique Direito**: Remove o bloco
- **Botão do Meio do Mouse**: Move a tela
- **Roda do Mouse**: Aumenta/diminui o zoom
- **Seletor de Blocos**: Clique nos blocos na barra lateral para selecioná-los

## Detalhes Técnicos

### Sistema de Blocos
O editor utiliza um sistema sofisticado que inclui:
- Detecção automática de bordas
- Seleção inteligente de texturas
- Suporte para múltiplas famílias de blocos (grama, tijolo, etc.)
- Renderização baseada em camadas
- Tamanhos de bloco customizáveis (padrão: 32px)

### Tipos de Blocos Suportados
- Blocos básicos (tijolo, tijolo escuro)
- Blocos de grama com bordas automáticas
- Blocos de escada
- Blocos de terreno mistos
- Blocos guia para desenvolvimento

### Gerenciamento de Texturas
- Pré-carregamento automático de texturas
- Suporte para folhas de sprites
- Caminhos de textura configuráveis
- Múltiplas famílias de texturas

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```
3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```


## Adicionando Novas Texturas

1. Adicione seu arquivo de textura em `src/assets/textures/`
2. Atualize o array `TexturePool` no arquivo principal:
```typescript
let TexturePool: textura[] = [
    {
        name: 'nome-da-sua-textura',
        path: texturePath + "seu-arquivo-de-textura.png"
    },
    // ... outras texturas
];
```

## Requisitos Técnicos

- Navegador web moderno com suporte a canvas
- TypeScript
- Node.js e npm para desenvolvimento

## Como Contribuir

1. Faça um fork do repositório
2. Crie sua branch de feature (`git checkout -b feature/NovaFuncionalidade`)
3. Faça commit de suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request


