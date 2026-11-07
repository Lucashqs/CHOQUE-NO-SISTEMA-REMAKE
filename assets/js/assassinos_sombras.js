
/*
========================================
CHOQUE NO SISTEMA REMAKE
MUNDO 2 — ASSASSINOS DAS SOMBRAS
ALENCAR GAME STUDIO
========================================
*/

window.AssassinosSombras = {

    lista: [],
    sprites: {},
    coracoes: [],

    proximoId: 1,
    totalDerrotados: 0,
    quantidadeInicial: 2,

    derrotadosPorArea: [0, 0, 0, 0],
    coracoesGerados: [false, false, false, false],

    margemRenderizacao: 150,

    // CAMINHO CORRIGIDO DAS SPRITES
    baseSprites:
        "sprites/inimigos/assassino_das_sombras/animations/",

    // =====================================
    // CONFIGURAÇÕES DAS ANIMAÇÕES
    // =====================================

    animacoes: {

        idle: {
            pasta: "Fight_Stance_Idle",
            total: 8,
            velocidade: 130
        },

        run: {
            pasta: "Running",
            total: 4,
            velocidade: 110
        },

        attack: {
            pasta: "Cross_Punch",
            total: 6,
            velocidade: 150
        },

        damage: {
            pasta: "Taking_Punch",
            total: 6,
            velocidade: 100
        },

        death: {
            pasta: "Falling_Back_Death",
            total: 7,
            velocidade: 120
        }

    },

    // =====================================
    // INTELIGÊNCIA ARTIFICIAL
    // =====================================

    configuracaoIA: {

        alcanceDeteccao: 220,
        alcanceAtaque: 35,
        distanciaSeguranca: 45,
        alcancePerda: 280,

        velocidadePatrulha: 1.2,
        velocidadePerseguicao: 1.65,
        velocidadeRetorno: 1.35,

        tempoEsperaPatrulha: 450,
        tempoEsperaRetorno: 350

    },

    // =====================================
    // CARREGAR SPRITES
    // =====================================

    carregarSprites() {

        this.sprites = {};

        for (const estado in this.animacoes) {

            const config = this.animacoes[estado];

            this.sprites[estado] = [];

            for (let i = 0; i < config.total; i++) {

                const imagem = new Image();

                const numero =
                    String(i).padStart(3, "0");

                imagem.src =
                    this.baseSprites +
                    config.pasta +
                    "/east/frame_" +
                    numero +
                    ".png";

                imagem.onerror = () => {

                    console.error(
                        "Erro ao carregar sprite:",
                        imagem.src
                    );

                };

                this.sprites[estado].push(imagem);

            }

        }

    },

    // =====================================
    // INICIALIZAR OS 20 ASSASSINOS
    // =====================================

    iniciar() {

        this.lista = [];
        this.coracoes = [];

        this.proximoId = 1;
        this.totalDerrotados = 0;

        this.derrotadosPorArea = [0, 0, 0, 0];
        this.coracoesGerados = [false, false, false, false];

        this.carregarSprites();

        const posicoes = [

            // ÁREA 1
            [320, 450, 650, 850, 1000],

            // ÁREA 2
            [1400, 1550, 1750, 2000, 2200],

            // ÁREA 3
            [2600, 2750, 2950, 3150, 3400],

            // ÁREA 4
            [3800, 4000, 4200, 4400, 4600]

        ];

        for (let area = 0; area < 4; area++) {

            for (const x of posicoes[area]) {

                this.lista.push({

                    id: this.proximoId++,

                    x: x,
                    y: 895,

                    origemX: x,
                    origemY: 895,

                    area: area,

                    largura: 35,
                    altura: 55,

                    vida: 100,
                    vidaMaxima: 100,

                    direcao: -1,

                    vivo: true,
                    derrotado: false,
                    liberado: false,
                    derrotaContabilizada: false,

                    estado: "run",
                    estadoIA: "patrulha",

                    frame: 0,
                    tempoAnimacao: 0,
                    tempoEspera: 0,

                    tempoRecarga: 0,
                    recargaAtaque: 1500,

                    acertouNesteAtaque: false,
                    ultimoAtaqueRecebido: null,

                    dano: 10,

                    limiteEsquerdo: area * 1200,
                    limiteDireito: (area + 1) * 1200

                });

            }

        }

        this.atualizarLiberacao({
            x: 0,
            largura: 35
        });

        console.log(
            "Assassinos das Sombras criados:",
            this.lista.length
        );

    },

    // =====================================
    // ALTERAR ESTADO
    // =====================================

    mudarEstado(npc, estado) {

        if (npc.estado === estado) return;

        npc.estado = estado;
        npc.frame = 0;
        npc.tempoAnimacao = 0;

    },

    // =====================================
    // ATUALIZAR ANIMAÇÕES
    // =====================================

    atualizarAnimacao(npc, dt) {

        const config = this.animacoes[npc.estado];

        if (!config) return;

        npc.tempoAnimacao += dt;

        while (
            npc.tempoAnimacao >= config.velocidade
        ) {

            npc.tempoAnimacao -= config.velocidade;

            npc.frame++;

            if (npc.frame < config.total) {
                continue;
            }

            if (npc.estado === "death") {

                npc.frame = config.total - 1;
                npc.derrotado = true;
                break;

            }

            if (npc.estado === "attack") {

                npc.tempoRecarga = npc.recargaAtaque;

                this.mudarEstado(npc, "idle");
                break;

            }

            if (npc.estado === "damage") {

                this.mudarEstado(npc, "idle");
                break;

            }

            npc.frame = 0;

        }

    },

    // =====================================
    // LIBERAÇÃO PROGRESSIVA
    // =====================================

    atualizarLiberacao(jogador) {

        if (!jogador) return;

        const area = Math.max(
            0,
            Math.min(
                3,
                Math.floor(
                    (
                        jogador.x +
                        (jogador.largura || 0) / 2
                    ) / 1200
                )
            )
        );

        const grupo = this.lista.filter(
            npc => npc.area === area
        );

        const derrotados = grupo.filter(
            npc => npc.derrotaContabilizada
        ).length;

        const quantidade = Math.min(
            grupo.length,
            this.quantidadeInicial + derrotados
        );

        for (let i = 0; i < quantidade; i++) {

            if (!grupo[i].derrotaContabilizada) {

                grupo[i].liberado = true;

            }

        }

    },

    // =====================================
    // LIMITAR MOVIMENTO POR ÁREA
    // =====================================

    limitarMovimento(npc) {

        npc.x = Math.max(
            npc.limiteEsquerdo,
            Math.min(
                npc.x,
                npc.limiteDireito - npc.largura
            )
        );

    },

    // =====================================
    // COLISÃO ENTRE INIMIGOS
    // =====================================

    
    // =====================================
    // EVITAR SOBREPOSIÇÃO DOS ASSASSINOS
    // =====================================

    resolverColisao(npc, anterior) {

        const distanciaMinima = 75;

        for (const outro of this.lista) {

            if (
                outro === npc ||
                !outro.vivo ||
                !outro.liberado ||
                outro.estado === "death" ||
                npc.area !== outro.area
            ) {
                continue;
            }

            // Verificar se estão no mesmo nível
            const mesmoNivel =
                npc.y < outro.y + outro.altura &&
                npc.y + npc.altura > outro.y;

            if (!mesmoNivel) {
                continue;
            }

            const centroNpc =
                npc.x + npc.largura / 2;

            const centroOutro =
                outro.x + outro.largura / 2;

            const distancia =
                Math.abs(centroNpc - centroOutro);

            const separacaoNecessaria =
                (npc.largura + outro.largura) / 2 +
                distanciaMinima;

            // Se estiverem suficientemente separados,
            // não fazer nenhuma correção
            if (distancia >= separacaoNecessaria) {
                continue;
            }

            // Determinar o lado de separação
            let lado;

            if (centroNpc < centroOutro) {
                lado = -1;
            } else if (centroNpc > centroOutro) {
                lado = 1;
            } else {
                lado = npc.id < outro.id ? -1 : 1;
            }

            // Reposicionar o assassino
            if (lado === -1) {

                npc.x =
                    outro.x -
                    npc.largura -
                    distanciaMinima;

            } else {

                npc.x =
                    outro.x +
                    outro.largura +
                    distanciaMinima;

            }

            // Respeitar os limites da área
            this.limitarMovimento(npc);

        }

    },


    // =====================================
    // CRIAR CORAÇÃO DE VIDA
    // =====================================

    criarCoracao(npc, area) {

        this.coracoes.push({

            x: npc.x + 3,
            y: npc.y + 0,

            largura: 28,
            altura: 28,

            cura: 25,
            area: area,
            coletado: false

        });

    },

    // =====================================
    // ATUALIZAR INTELIGÊNCIA ARTIFICIAL
    // =====================================

    atualizar(dt, jogador, vidaHeroi) {

        if (!jogador) return;

        dt = Math.max(
            0,
            Math.min(Number(dt) || 0, 100)
        );

        const fator = Math.min(
            dt / 16.67,
            3
        );

        this.atualizarLiberacao(jogador);

        for (const npc of this.lista) {

            if (!npc.liberado || !npc.vivo) {
                continue;
            }

            // MORTE

            if (npc.estado === "death") {

                if (!npc.derrotaContabilizada) {

                    npc.derrotaContabilizada = true;

                    this.totalDerrotados++;

                    this.derrotadosPorArea[npc.area]++;

                    if (
                        this.derrotadosPorArea[npc.area] === 2 &&
                        !this.coracoesGerados[npc.area]
                    ) {

                        this.coracoesGerados[npc.area] = true;

                        this.criarCoracao(
                            npc,
                            npc.area
                        );

                    }

                    this.atualizarLiberacao(jogador);

                }

                this.atualizarAnimacao(npc, dt);

                if (npc.derrotado) {
                    npc.vivo = false;
                }

                continue;

            }

            // RECARGA DE ATAQUE

            npc.tempoRecarga = Math.max(
                0,
                npc.tempoRecarga - dt
            );

            // RECEBENDO DANO

            if (npc.estado === "damage") {

                this.atualizarAnimacao(npc, dt);
                continue;

            }

            // EXECUTANDO ATAQUE

            if (npc.estado === "attack") {

                this.atualizarAnimacao(npc, dt);

                if (
                    npc.estado === "attack" &&
                    npc.frame >= 2 &&
                    npc.frame <= 3 &&
                    !npc.acertouNesteAtaque
                ) {

                    npc.acertouNesteAtaque = true;

                    const hitbox = {

                        x: npc.direcao === 1
                            ? npc.x + npc.largura
                            : npc.x - 20,

                        y: npc.y + 12,

                        w: 20,
                        h: 30

                    };

                    const corpoHeroi = {

                        x: jogador.x,
                        y: jogador.y,

                        w: jogador.largura,
                        h: jogador.altura

                    };

                    if (
                        vidaHeroi &&
                        vidaHeroi.valor > 0 &&
                        (vidaHeroi.tempoDano || 0) <= 0 &&
                        this.colidiu(
                            hitbox,
                            corpoHeroi
                        )
                    ) {

                        vidaHeroi.valor = Math.max(
                            0,
                            vidaHeroi.valor - npc.dano
                        );

                        vidaHeroi.tempoDano = 1000;

                        if (window.AnimacoesHeroi) {

                            if (
                                vidaHeroi.valor <= 0 &&
                                typeof AnimacoesHeroi.iniciarMorte === "function"
                            ) {

                                AnimacoesHeroi.iniciarMorte();

                            } else if (
                                vidaHeroi.valor > 0 &&
                                typeof AnimacoesHeroi.iniciarDano === "function"
                            ) {

                                AnimacoesHeroi.iniciarDano();

                            }

                        }

                    }

                }

                continue;

            }

            // DETECTAR HERÓI

            const dx =
                jogador.x + jogador.largura / 2 -
                (npc.x + npc.largura / 2);

            const dy = Math.abs(

                jogador.y + jogador.altura / 2 -

                (npc.y + npc.altura / 2)

            );

            const heroiVivo =
                !vidaHeroi || vidaHeroi.valor > 0;

            if (npc.estadoIA === "perseguicao") {

                if (
                    !heroiVivo ||
                    dy >= 65 ||
                    Math.abs(dx) >
                        this.configuracaoIA.alcancePerda
                ) {

                    npc.estadoIA = "retorno";

                }

            } else if (

                heroiVivo &&
                dy < 65 &&
                Math.abs(dx) <=
                    this.configuracaoIA.alcanceDeteccao

            ) {

                npc.estadoIA = "perseguicao";
                npc.tempoEspera = 0;

            }

            const anterior = npc.x;

            // PERSEGUIÇÃO

            if (npc.estadoIA === "perseguicao") {

                npc.direcao = dx >= 0 ? 1 : -1;

                if (
                    Math.abs(dx) <= Math.max(
                        this.configuracaoIA.distanciaSeguranca,
                        this.configuracaoIA.alcanceAtaque
                    )
                ) {

                    if (npc.tempoRecarga <= 0) {

                        npc.acertouNesteAtaque = false;

                        this.mudarEstado(
                            npc,
                            "attack"
                        );

                    } else {

                        this.mudarEstado(
                            npc,
                            "idle"
                        );

                    }

                } else {

                    npc.x +=
                        npc.direcao *
                        this.configuracaoIA.velocidadePerseguicao *
                        fator;

                    this.mudarEstado(
                        npc,
                        "run"
                    );

                }

            }

            // RETORNO À ORIGEM

            else if (
                npc.estadoIA === "retorno"
            ) {

                const distancia =
                    npc.origemX - npc.x;

                if (
                    Math.abs(distancia) <= 3
                ) {

                    npc.x = npc.origemX;

                    npc.estadoIA = "patrulha";

                    npc.tempoEspera =
                        this.configuracaoIA.tempoEsperaRetorno;

                    this.mudarEstado(
                        npc,
                        "idle"
                    );

                } else {

                    npc.direcao =
                        distancia >= 0 ? 1 : -1;

                    npc.x +=
                        npc.direcao *
                        Math.min(
                            Math.abs(distancia),
                            this.configuracaoIA.velocidadeRetorno *
                            fator
                        );

                    this.mudarEstado(
                        npc,
                        "run"
                    );

                }

            }

            // ESPERA DE PATRULHA

            else if (
                npc.tempoEspera > 0
            ) {

                npc.tempoEspera = Math.max(
                    0,
                    npc.tempoEspera - dt
                );

                this.mudarEstado(
                    npc,
                    "idle"
                );

            }

            // PATRULHA NORMAL

            else {

                npc.x +=
                    npc.direcao *
                    this.configuracaoIA.velocidadePatrulha *
                    fator;

                this.mudarEstado(
                    npc,
                    "run"
                );

                const esquerda =
                    npc.limiteEsquerdo + 100;

                const direita =
                    npc.limiteDireito -
                    100 -
                    npc.largura;

                if (
                    npc.x <= esquerda
                ) {

                    npc.x = esquerda;

                    npc.direcao = 1;

                    npc.tempoEspera =
                        this.configuracaoIA.tempoEsperaPatrulha;

                }

                if (
                    npc.x >= direita
                ) {

                    npc.x = direita;

                    npc.direcao = -1;

                    npc.tempoEspera =
                        this.configuracaoIA.tempoEsperaPatrulha;

                }

            }

            this.limitarMovimento(npc);

            this.resolverColisao(
                npc,
                anterior
            );

            this.atualizarAnimacao(
                npc,
                dt
            );

        }

    },

    // =====================================
    // VERIFICAR COLISÃO
    // =====================================

    colidiu(a, b) {

        return (

            a.x < b.x + b.w &&
            a.x + a.w > b.x &&

            a.y < b.y + b.h &&
            a.y + a.h > b.y

        );

    },

    // =====================================
    // RECEBER ATAQUES DO HERÓI
    // =====================================

    receberAtaque(hitbox, idAtaque) {

        if (!hitbox) return [];

        const atingidos = [];

        for (const npc of this.lista) {

            if (
                !npc.liberado ||
                !npc.vivo ||
                npc.estado === "death" ||
                npc.ultimoAtaqueRecebido === idAtaque
            ) {
                continue;
            }

            const corpo = {

                x: npc.x,
                y: npc.y,

                w: npc.largura,
                h: npc.altura

            };

            if (
                !this.colidiu(
                    hitbox,
                    corpo
                )
            ) {
                continue;
            }

            npc.ultimoAtaqueRecebido = idAtaque;

            atingidos.push(npc.id);

            npc.vida = Math.max(
                0,
                npc.vida -
                (Number(hitbox.dano) || 0)
            );

            if (npc.vida <= 0) {

                this.mudarEstado(
                    npc,
                    "death"
                );

            } else {

                this.mudarEstado(
                    npc,
                    "damage"
                );

                const centroGolpe =
                    hitbox.x + hitbox.w / 2;

                const centroNpc =
                    npc.x + npc.largura / 2;

                npc.x +=
                    centroGolpe < centroNpc
                        ? 12
                        : -12;

                this.limitarMovimento(npc);

            }

        }

        return atingidos;

    },

    // =====================================
    // DESENHAR ASSASSINOS NO CANVAS
    // =====================================

    desenhar(ctx, cameraX = 0, cameraY = 0) {

        const tamanho = 110;

        for (const npc of this.lista) {

            if (
                !npc.liberado ||
                !npc.vivo ||
                npc.derrotado
            ) {
                continue;
            }

            const x =
                npc.x - cameraX;

            const y =
                npc.y - cameraY;

            const centro =
                x + npc.largura / 2;

            const spriteX =
                centro - tamanho / 2;

            const spriteY =
                y +
                npc.altura -
                tamanho +
                14 - 40;

            // NÃO DESENHAR FORA DA TELA

            if (

                spriteX + tamanho <
                    -this.margemRenderizacao ||

                spriteX >
                    ctx.canvas.width +
                    this.margemRenderizacao ||

                spriteY + tamanho <
                    -this.margemRenderizacao ||

                spriteY >
                    ctx.canvas.height +
                    this.margemRenderizacao

            ) {
                continue;
            }

            const imagem =
                this.sprites[npc.estado]?.[npc.frame];

            ctx.save();

            if (
                imagem &&
                imagem.complete &&
                imagem.naturalWidth > 0
            ) {

                // OLHANDO PARA ESQUERDA

                if (npc.direcao === -1) {

                    ctx.translate(
                        centro,
                        0
                    );

                    ctx.scale(
                        -1,
                        1
                    );

                    ctx.drawImage(
                        imagem,
                        -tamanho / 2,
                        spriteY,
                        tamanho,
                        tamanho
                    );

                }

                // OLHANDO PARA DIREITA

                else {

                    ctx.drawImage(
                        imagem,
                        spriteX,
                        spriteY,
                        tamanho,
                        tamanho
                    );

                }

            } else {

                // RETÂNGULO TEMPORÁRIO
                // SE A IMAGEM NÃO CARREGAR

                ctx.fillStyle = "#6d28d9";

                ctx.fillRect(
                    x,
                    y,
                    npc.largura,
                    npc.altura
                );

            }

            ctx.restore();

            // =====================================
            // BARRA DE VIDA
            // =====================================

            // =====================================
            // NOME E BARRA DE VIDA ACIMA DA SPRITE
            // =====================================

            if (npc.estado !== "death") {

                // Posição acima da cabeça do assassino
                const barraY = spriteY - 15;
                const nomeY = barraY - 8;

                // Fundo da barra de vida
                ctx.fillStyle = "#222";

                ctx.fillRect(
                    centro - 27.5,
                    barraY,
                    55,
                    8
                );

                // Vida atual do assassino
                ctx.fillStyle = "#a855f7";

                ctx.fillRect(
                    centro - 27.5,
                    barraY,
                    55 * npc.vida / npc.vidaMaxima,
                    8
                );

                // Nome do inimigo
                ctx.fillStyle = "#ffffff";
                ctx.font = "12px Arial";
                ctx.textAlign = "center";

                ctx.fillText(
                    "ASSASSINO DAS SOMBRAS",
                    centro,
                    nomeY
                );
            }

        }

    },

    // =====================================
    // COLETAR CORAÇÕES
    // =====================================

    atualizarCoracoes(jogador, vidaHeroi) {

        if (
            !jogador ||
            !vidaHeroi ||
            vidaHeroi.valor <= 0
        ) {
            return;
        }

        for (const coracao of this.coracoes) {

            if (coracao.coletado) {
                continue;
            }

            const colisao = this.colidiu(

                {
                    x: coracao.x,
                    y: coracao.y,
                    w: coracao.largura,
                    h: coracao.altura
                },

                {
                    x: jogador.x,
                    y: jogador.y,
                    w: jogador.largura,
                    h: jogador.altura
                }

            );

            if (!colisao) {
                continue;
            }

            if (
                !Number.isFinite(
                    vidaHeroi.maxima
                )
            ) {
                continue;
            }

            vidaHeroi.valor = Math.min(
                vidaHeroi.maxima,
                vidaHeroi.valor + coracao.cura
            );

            coracao.coletado = true;

        }

    },

    // =====================================
    // DESENHAR CORAÇÕES
    // =====================================

    desenharCoracoes(
        ctx,
        cameraX = 0,
        cameraY = 0
    ) {

        for (const coracao of this.coracoes) {

            if (coracao.coletado) {
                continue;
            }

            const x =
                coracao.x - cameraX;

            const y =
                coracao.y - cameraY;

            const tamanho =
                coracao.largura;

            ctx.save();

            ctx.shadowColor = "#ff1744";
            ctx.shadowBlur = 15;

            ctx.fillStyle = "#ff1744";
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;

            ctx.beginPath();

            ctx.moveTo(
                x + tamanho / 2,
                y + tamanho
            );

            ctx.bezierCurveTo(
                x - tamanho * 0.35,
                y + tamanho * 0.45,
                x,
                y - tamanho * 0.2,
                x + tamanho / 2,
                y + tamanho * 0.25
            );

            ctx.bezierCurveTo(
                x + tamanho,
                y - tamanho * 0.2,
                x + tamanho * 1.35,
                y + tamanho * 0.45,
                x + tamanho / 2,
                y + tamanho
            );

            ctx.closePath();

            ctx.fill();
            ctx.stroke();

            ctx.restore();

        }

    },

    // =====================================
    // CONTAR INIMIGOS VIVOS
    // =====================================

    contarVivos() {

        return this.lista.filter(
            npc =>
                npc.liberado &&
                npc.vivo &&
                npc.estado !== "death"
        ).length;

    },

    // =====================================
    // CONSULTAR PROGRESSO
    // =====================================

    obterProgresso() {

        return {

            total: this.lista.length,

            derrotados: this.totalDerrotados,

            liberados: this.lista.filter(
                npc => npc.liberado
            ).length,

            vivos: this.contarVivos(),

            restantes:
                this.lista.length -
                this.totalDerrotados

        };

    },

    // =====================================
    // VERIFICAR REGIÃO CONCLUÍDA
    // =====================================

    regiaoConcluida(inicio, fim) {

        const grupo = this.lista.filter(
            npc =>
                npc.origemX >= inicio &&
                npc.origemX < fim
        );

        return (

            grupo.length > 0 &&

            grupo.every(
                npc => npc.derrotaContabilizada
            )

        );

    },

    // =====================================
    // VERIFICAR ÁREA CONCLUÍDA
    // =====================================

    areaConcluida(area) {

        return this.regiaoConcluida(
            area * 1200,
            (area + 1) * 1200
        );

    },

    // =====================================
    // LIBERAR CHEFÃO
    // =====================================

    podeIniciarChefao() {

        return [0, 1, 2, 3].every(
            area => this.areaConcluida(area)
        );

    }

};
