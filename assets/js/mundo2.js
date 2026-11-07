
/*
 * CHOQUE NO SISTEMA REMAKE
 * MUNDO 2 — O DOMÍNIO DAS SOMBRAS
 * ALENCAR GAME STUDIO
 */

window.Mundo2 = {

    largura: 4800,
    altura: 1100,
    gravidade: 0.65,

    // Imagem panorâmica do Mundo 2
    cenarioCompletoImagem: (() => {
        const imagem = new Image();

        imagem.src =
            "sprites/cenarios/mundo2/mundo2_subterraneo_4800.png";

        return imagem;
    })(),

    // Plataforma física contínua
    plataformas: [
        {
            x: 0,
            y: 910,
            w: 4800,
            h: 100
        }
    ],

    // Quatro áreas do Mundo 2
    areas: [
        {
            numero: 1,
            nome: "Entrada dos Esgotos",
            inicio: 0,
            fim: 1200
        },
        {
            numero: 2,
            nome: "Túneis Abandonados",
            inicio: 1200,
            fim: 2400
        },
        {
            numero: 3,
            nome: "Galeria das Sombras",
            inicio: 2400,
            fim: 3600
        },
        {
            numero: 4,
            nome: "Covil do Senhor das Sombras",
            inicio: 3600,
            fim: 4800
        }
    ],

    // Fundo subterrâneo
    desenharFundo(ctx) {
        const fundo = ctx.createLinearGradient(
            0, 0, 0, ctx.canvas.height
        );

        fundo.addColorStop(0, "#080b1e");
        fundo.addColorStop(0.5, "#17112f");
        fundo.addColorStop(1, "#241334");

        ctx.fillStyle = fundo;
        ctx.fillRect(
            0, 0,
            ctx.canvas.width,
            ctx.canvas.height
        );
    },

    // Desenhar cenário panorâmico
    desenharCenarios(ctx, cameraX, cameraY) {

        const imagem = this.cenarioCompletoImagem;

        if (
            !imagem.complete ||
            imagem.naturalWidth <= 0
        ) {
            return;
        }

        const larguraVisual = this.largura;

        // Preservar a proporção da imagem
        const alturaVisual =
            larguraVisual *
            imagem.naturalHeight /
            imagem.naturalWidth;

        // Alinhar a superfície de caminhada
        // com o chão físico em Y = 1000.
        // Ajustável após teste visual.
        const linhaChaoImagem = 0.73;

        const x = -cameraX;

        const y =
            960 -
            cameraY -
            alturaVisual * linhaChaoImagem;

        ctx.save();
        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(
            imagem,
            x,
            y,
            larguraVisual,
            alturaVisual
        );

        ctx.restore();
    },

    // Desenhar mundo completo
    desenhar(ctx, cameraX = 0, cameraY = 0) {

        this.desenharFundo(ctx);

        this.desenharCenarios(
            ctx,
            cameraX,
            cameraY
        );
    },

    // Retornar plataformas para colisão
    obterPlataformas() {
        return this.plataformas;
    },

    // Identificar área atual
    obterArea(x) {
        return this.areas.find(
            area => x >= area.inicio && x < area.fim
        ) || this.areas[3];
    }
};

// Escadas do Mundo 2
Mundo2.escadas = [];
