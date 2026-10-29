
/*
 * CHOQUE NO SISTEMA 2.0
 * ALENCAR GAME STUDIO
 *
 * MUNDO 1 - AVENIDA CENTRAL DE DAKOTA
 *
 * PASSO 10.13.4
 * SURGIMENTO PROGRESSIVO DOS SAQUEADORES
 *
 * 20 INIMIGOS NO TOTAL
 * 2 INIMIGOS LIBERADOS NO INICIO
 * CADA DERROTA LIBERA MAIS 1
 */

window.Inimigos = {

  lista: [],
  proximoId: 1,
  sprites: {},

  // ==========================================
  // SISTEMA DE LIBERACAO PROGRESSIVA
  // ==========================================

  quantidadeInicial: 2,
  totalDerrotados: 0,

  // Margem de renderizacao fora da tela.
  margemRenderizacao: 150,

  animacoes: {

    idle: {
      total: 8,
      velocidade: 130
    },

    run: {
      total: 4,
      velocidade: 110
    },

    attack: {
      total: 6,
      velocidade: 150
    },

    damage: {
      total: 6,
      velocidade: 100
    },

    death: {
      total: 7,
      velocidade: 120
    }

  },

  configuracaoIA: {

    alcanceDeteccao: 220,
    alcanceAtaque: 35,
    alcancePerda: 280,

    velocidadePatrulha: 1.2,
    velocidadePerseguicao: 1.65,
    velocidadeRetorno: 1.35,

    tempoEsperaPatrulha: 450,
    tempoEsperaRetorno: 350

  },

  // ==========================================
  // CARREGAR SPRITES
  // ==========================================

  carregarSprites() {

    const base =
      "sprites/inimigos/saqueador/";

    this.sprites = {};

    for (const estado in this.animacoes) {

      this.sprites[estado] = [];

      const total =
        this.animacoes[estado].total;

      for (let i = 1; i <= total; i++) {

        const numero =
          String(i).padStart(2, "0");

        const img = new Image();

        img.src =
          `${base}${estado}/${estado}_${numero}.png`;

        img.onerror = () => {

          console.error(
            "Sprite nao encontrado:",
            img.src
          );

        };

        this.sprites[estado].push(img);

      }

    }

  },

  // ==========================================
  // LIBERAR NOVOS INIMIGOS
  // ==========================================

  atualizarLiberacao() {

    const quantidadeLiberada = Math.min(
      this.lista.length,
      this.quantidadeInicial +
      this.totalDerrotados
    );

    for (let i = 0; i < this.lista.length; i++) {

      const npc = this.lista[i];

      if (
        i < quantidadeLiberada &&
        !npc.liberado
      ) {

        npc.liberado = true;

        console.log(
          "SAQUEADOR LIBERADO:",
          npc.id
        );

      }

    }

  },

  // ==========================================
  // INICIALIZAR OS 20 SAQUEADORES
  // ==========================================

  iniciar() {

    this.lista = [];
    this.proximoId = 1;
    this.totalDerrotados = 0;

    this.carregarSprites();

    const posicoes = [


      // AREA 2 - PRIMEIRO PREDIO
      {
        x: 320,
        y: 945,
        esquerda: 265,
        direita: 405
      },

      {
        x: 450,
        y: 945,
        esquerda: 415,
        direita: 540
      },

      // AREA 3 - SEGUNDO PREDIO
      {
        x: 720,
        y: 945,
        esquerda: 660,
        direita: 815
      },

      {
        x: 850,
        y: 945,
        esquerda: 825,
        direita: 990
      },

      // AREA 4 - TERCEIRO PREDIO
      {
        x: 1170,
        y: 945,
        esquerda: 1110,
        direita: 1270
      },

      {
        x: 1320,
        y: 945,
        esquerda: 1280,
        direita: 1440
      },

      // AREA 5 - QUARTO PREDIO
      {
        x: 1620,
        y: 945,
        esquerda: 1560,
        direita: 1710
      },

      {
        x: 1770,
        y: 945,
        esquerda: 1720,
        direita: 1890
      },

      // AREA 6 - AVENIDA CENTRAL
      {
        x: 2050,
        y: 945,
        esquerda: 1980,
        direita: 2180
      },

      {
        x: 2250,
        y: 945,
        esquerda: 2190,
        direita: 2390
      },

      {
        x: 2450,
        y: 945,
        esquerda: 2400,
        direita: 2590
      },

      {
        x: 2650,
        y: 945,
        esquerda: 2600,
        direita: 2790
      },

      {
        x: 2850,
        y: 945,
        esquerda: 2800,
        direita: 2990
      },

      // AREA 7 - AVENIDA AVANCADA
      {
        x: 3100,
        y: 945,
        esquerda: 3030,
        direita: 3230
      },

      {
        x: 3350,
        y: 945,
        esquerda: 3270,
        direita: 3480
      },

      {
        x: 3600,
        y: 945,
        esquerda: 3520,
        direita: 3740
      },

      // AREA 8 - FINAL DA FASE
      {
        x: 3900,
        y: 945,
        esquerda: 3820,
        direita: 4050
      },

      {
        x: 4200,
        y: 945,
        esquerda: 4120,
        direita: 4350
      },

      {
        x: 4550,
        y: 945,
        esquerda: 4450,
        direita: 4690
      }

    ];

    for (const p of posicoes) {

      this.criar({

        x: p.x,
        y: p.y,

        largura: 35,
        altura: 55,

        vida: 100,

        velocidade:
          this.configuracaoIA.velocidadePatrulha,

        limiteEsquerdo: p.esquerda,
        limiteDireito: p.direita

      });

    }

    // Liberar os dois primeiros.
    this.atualizarLiberacao();

    console.log(
      "TOTAL DE SAQUEADORES:",
      this.lista.length
    );

  },

  // ==========================================
  // CRIAR SAQUEADOR
  // ==========================================

  criar(config) {

    const npc = {

      id: this.proximoId++,

      x: config.x,
      y: config.y,

      origemX: config.x,
      origemY: config.y,

      largura: config.largura,
      altura: config.altura,

      vida: config.vida,
      vidaMaxima: config.vida,

      velocidade: config.velocidade,
      direcao: -1,

      limiteEsquerdo:
        config.limiteEsquerdo,

      limiteDireito:
        config.limiteDireito,

      vivo: true,
      derrotado: false,

      // NOVO SISTEMA
      liberado: false,
      derrotaContabilizada: false,

      estado: "run",
      estadoIA: "patrulha",

      frame: 0,
      tempoAnimacao: 0,
      tempoEspera: 0,

      ultimoAtaqueRecebido: -1,

      alcanceDeteccao:
        this.configuracaoIA.alcanceDeteccao,

      alcanceAtaque:
        this.configuracaoIA.alcanceAtaque,

      alcancePerda:
        this.configuracaoIA.alcancePerda,

      dano: 10,

      recargaAtaque: 1500,
      tempoRecarga: 0,

      acertouNesteAtaque: false

    };

    this.lista.push(npc);

    return npc;

  },

  // ==========================================
  // ALTERAR ESTADO DA ANIMACAO
  // ==========================================

  mudarEstado(npc, estado) {

    if (npc.estado === estado) {
      return;
    }

    npc.estado = estado;
    npc.frame = 0;
    npc.tempoAnimacao = 0;

  },

  // ==========================================
  // ATUALIZAR ANIMACAO
  // ==========================================

  atualizarAnimacao(npc, dt) {

    const config =
      this.animacoes[npc.estado];

    if (!config) {
      return;
    }

    npc.tempoAnimacao += dt;

    while (
      npc.tempoAnimacao >= config.velocidade
    ) {

      npc.tempoAnimacao -=
        config.velocidade;

      npc.frame++;

      if (npc.frame >= config.total) {

        if (npc.estado === "death") {

          npc.frame =
            config.total - 1;

          npc.derrotado = true;

          break;
        }

        if (npc.estado === "damage") {

          this.mudarEstado(
            npc,
            "idle"
          );

          break;
        }

        if (npc.estado === "attack") {

          npc.tempoRecarga =
            npc.recargaAtaque;

          this.mudarEstado(
            npc,
            "idle"
          );

          break;
        }

        npc.frame = 0;

      }

    }

  },

  // ==========================================
  // LIMITES DE MOVIMENTO
  // ==========================================

  limitarMovimento(npc) {

    const minimo =
      npc.limiteEsquerdo;

    const maximo =
      npc.limiteDireito -
      npc.largura;

    npc.x = Math.max(
      minimo,
      Math.min(npc.x, maximo)
    );

  },

  // ==========================================
  // PATRULHA
  // ==========================================

  patrulhar(npc, fator, dt) {

    if (npc.tempoEspera > 0) {

      npc.tempoEspera = Math.max(
        0,
        npc.tempoEspera - dt
      );

      this.mudarEstado(npc, "idle");

      return;
    }

    const velocidade =
      this.configuracaoIA.velocidadePatrulha;

    npc.x +=
      velocidade *
      npc.direcao *
      fator;

    this.mudarEstado(npc, "run");

    if (npc.x <= npc.limiteEsquerdo) {

      npc.x = npc.limiteEsquerdo;
      npc.direcao = 1;

      npc.tempoEspera =
        this.configuracaoIA.tempoEsperaPatrulha;

    }

    if (
      npc.x + npc.largura >=
      npc.limiteDireito
    ) {

      npc.x =
        npc.limiteDireito -
        npc.largura;

      npc.direcao = -1;

      npc.tempoEspera =
        this.configuracaoIA.tempoEsperaPatrulha;

    }

  },

  // ==========================================
  // PERSEGUICAO
  // ==========================================

  perseguir(npc, jogador, fator) {

    const centroNpc =
      npc.x + npc.largura / 2;

    const centroHeroi =
      jogador.x + jogador.largura / 2;

    const distancia =
      centroHeroi - centroNpc;

    npc.direcao =
      distancia >= 0 ? 1 : -1;

    if (
      Math.abs(distancia) <=
      npc.alcanceAtaque
    ) {

      this.mudarEstado(npc, "idle");

      return;
    }

    const velocidade =
      this.configuracaoIA.velocidadePerseguicao;

    npc.x +=
      velocidade *
      npc.direcao *
      fator;

    this.limitarMovimento(npc);

    const naBordaEsquerda =
      npc.x <= npc.limiteEsquerdo &&
      npc.direcao === -1;

    const naBordaDireita =
      npc.x + npc.largura >=
        npc.limiteDireito &&
      npc.direcao === 1;

    if (
      naBordaEsquerda ||
      naBordaDireita
    ) {

      this.mudarEstado(npc, "idle");

    } else {

      this.mudarEstado(npc, "run");

    }

  },

  // ==========================================
  // RETORNO A ORIGEM
  // ==========================================

  retornarOrigem(npc, fator, dt) {

    if (npc.tempoEspera > 0) {

      npc.tempoEspera = Math.max(
        0,
        npc.tempoEspera - dt
      );

      this.mudarEstado(npc, "idle");

      return;
    }

    const distancia =
      npc.origemX - npc.x;

    const velocidade =
      this.configuracaoIA.velocidadeRetorno;

    if (Math.abs(distancia) <= 3) {

      npc.x = npc.origemX;

      npc.estadoIA = "patrulha";

      npc.tempoEspera =
        this.configuracaoIA.tempoEsperaRetorno;

      this.mudarEstado(npc, "idle");

      return;
    }

    npc.direcao =
      distancia >= 0 ? 1 : -1;

    const deslocamento =
      Math.min(
        Math.abs(distancia),
        velocidade * fator
      );

    npc.x +=
      deslocamento * npc.direcao;

    this.limitarMovimento(npc);

    this.mudarEstado(npc, "run");

  },

  // ==========================================
  // ATUALIZAR INTELIGENCIA ARTIFICIAL
  // ==========================================

  atualizar(dt, jogador, vidaHeroi) {

    const fator =
      Math.min(dt / 16.67, 3);

    for (const npc of this.lista) {

      // Inimigos ainda nao liberados.
      if (!npc.liberado) {
        continue;
      }

      if (!npc.vivo) {
        continue;
      }

      // Registrar cada derrota apenas uma vez.
      if (
        npc.estado === "death" &&
        !npc.derrotaContabilizada
      ) {

        npc.derrotaContabilizada = true;

        this.totalDerrotados++;

        this.atualizarLiberacao();

        console.log(
          "SAQUEADORES DERROTADOS:",
          this.totalDerrotados
        );

      }

      if (npc.derrotado) {

        npc.vivo = false;

        continue;
      }

      npc.tempoRecarga = Math.max(
        0,
        npc.tempoRecarga - dt
      );

      // ======================================
      // MORTE
      // ======================================

      if (npc.estado === "death") {

        this.atualizarAnimacao(
          npc,
          dt
        );

        if (npc.derrotado) {
          npc.vivo = false;
        }

        continue;
      }

      // ======================================
      // DANO RECEBIDO
      // ======================================

      if (npc.estado === "damage") {

        this.atualizarAnimacao(
          npc,
          dt
        );

        continue;
      }

      // ======================================
      // ATAQUE DO SAQUEADOR
      // ======================================

      if (npc.estado === "attack") {

        this.atualizarAnimacao(
          npc,
          dt
        );

        if (
          npc.estado === "attack" &&
          npc.frame >= 2 &&
          npc.frame <= 3 &&
          !npc.acertouNesteAtaque
        ) {

          npc.acertouNesteAtaque = true;

          const alcance = 20;

          const hitbox = {

            x:
              npc.direcao === 1
                ? npc.x + npc.largura
                : npc.x - alcance,

            y: npc.y + 12,

            w: alcance,
            h: 30

          };

          const corpoHeroi = {

            x: jogador.x,
            y: jogador.y,

            w: jogador.largura,
            h: jogador.altura

          };

          if (
            vidaHeroi.valor > 0 &&
            (vidaHeroi.tempoDano || 0) <= 0 &&
            Combate.colidiu(
              hitbox,
              corpoHeroi
            )
          ) {

            vidaHeroi.valor = Math.max(
              0,
              vidaHeroi.valor - npc.dano
            );

            vidaHeroi.tempoDano = 1000;

            if (vidaHeroi.valor <= 0) {

              AnimacoesHeroi.iniciarMorte();

            } else {

              AnimacoesHeroi.iniciarDano();

              
            }

          }

        }

        continue;

      }

      // ======================================
      // DETECCAO DO HEROI
      // ======================================

      const centroNpc =
        npc.x + npc.largura / 2;

      const centroHeroi =
        jogador.x + jogador.largura / 2;

      const distanciaX =
        centroHeroi - centroNpc;

      const distanciaY = Math.abs(

        (
          jogador.y +
          jogador.altura / 2
        ) -

        (
          npc.y +
          npc.altura / 2
        )

      );

      const mesmoNivel =
        distanciaY < 65;

      const distanciaHorizontal =
        Math.abs(distanciaX);

      const heroiVivo =
        vidaHeroi.valor > 0;

      if (npc.estadoIA === "perseguicao") {

        const perdeuHeroi =
          !heroiVivo ||
          !mesmoNivel ||
          distanciaHorizontal >
            npc.alcancePerda;

        if (perdeuHeroi) {

          npc.estadoIA = "retorno";
          npc.tempoEspera = 0;

        }

      } else {

        const detectouHeroi =
          heroiVivo &&
          mesmoNivel &&
          distanciaHorizontal <=
            npc.alcanceDeteccao;

        if (detectouHeroi) {

          npc.estadoIA = "perseguicao";
          npc.tempoEspera = 0;

        }

      }

      // ======================================
      // EXECUTAR COMPORTAMENTO
      // ======================================

      if (npc.estadoIA === "perseguicao") {

        npc.direcao =
          distanciaX >= 0 ? 1 : -1;

        if (
          distanciaHorizontal <=
            npc.alcanceAtaque
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

          this.perseguir(
            npc,
            jogador,
            fator
          );

        }

      } else if (
        npc.estadoIA === "retorno"
      ) {

        this.retornarOrigem(
          npc,
          fator,
          dt
        );

      } else {

        this.patrulhar(
          npc,
          fator,
          dt
        );

      }

      this.limitarMovimento(npc);

      this.atualizarAnimacao(
        npc,
        dt
      );

    }

  },

  // ==========================================
  // RECEBER ATAQUE DO HEROI OU FIREBALL
  // ==========================================

  receberAtaque(hitbox, idAtaque) {

    if (!hitbox) {
      return [];
    }

    const inimigosAtingidos = [];

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
        !Combate.colidiu(
          hitbox,
          corpo
        )
      ) {

        continue;
      }

      npc.ultimoAtaqueRecebido =
        idAtaque;

      inimigosAtingidos.push(
        npc.id
      );

      npc.vida = Math.max(
        0,
        npc.vida - hitbox.dano
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

    return inimigosAtingidos;

  },

  // ==========================================
  // RENDERIZACAO INTELIGENTE
  // ==========================================

  desenhar(ctx, cameraX = 0, cameraY = 0) {

    const larguraTela =
      ctx.canvas.width;

    const alturaTela =
      ctx.canvas.height;

    const margem =
      this.margemRenderizacao;

    const tamanho = 110;

    for (const npc of this.lista) {
      if (window.Cutscenes && Cutscenes.ativa &&(
        Cutscenes.estado === "entrada_saqueador" || Cutscenes.estado === "dialogo_saqueador"
      ) && npc !== Cutscenes.saqueadorIntro){
        continue;
      }

      // Nao desenhar inimigos bloqueados.
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

      const centroX =
        x + npc.largura / 2;

      const spriteX =
        centroX - tamanho / 2;

      const spriteY =
        y +
        npc.altura -
        tamanho +
        14;

      const foraHorizontal =
        spriteX + tamanho < -margem ||
        spriteX > larguraTela + margem;

      const foraVertical =
        spriteY + tamanho < -margem ||
        spriteY > alturaTela + margem;

      if (
        foraHorizontal ||
        foraVertical
      ) {

        continue;
      }

      const imagem =
        this.sprites[npc.estado]?.[
          npc.frame
        ];

      ctx.save();

      if (
        imagem &&
        imagem.complete &&
        imagem.naturalWidth > 0
      ) {

        if (npc.direcao === -1) {

          ctx.translate(
            centroX,
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

        } else {

          ctx.drawImage(
            imagem,
            spriteX,
            spriteY,
            tamanho,
            tamanho
          );

        }

      } else {

        ctx.fillStyle = "#b91c1c";

        ctx.fillRect(
          x,
          y,
          npc.largura,
          npc.altura
        );

      }

      ctx.restore();

      // ======================================
      // BARRA DE VIDA
      // ======================================

      if (npc.estado !== "death") {

        const barraX =
          centroX - 27.5;

        ctx.fillStyle = "#222";

        ctx.fillRect(
          barraX,
          y - 24,
          55,
          8
        );

        ctx.fillStyle = "#22c55e";

        ctx.fillRect(
          barraX,
          y - 24,
          55 * (
            npc.vida /
            npc.vidaMaxima
          ),
          8
        );

        ctx.fillStyle = "#fff";

        ctx.font = "12px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
          "SAQUEADOR",
          centroX,
          y - 31
        );

      }

    }

  },

  // ==========================================
  // CONTAR INIMIGOS VIVOS E LIBERADOS
  // ==========================================

  contarVivos() {

    return this.lista.filter(
      npc =>
        npc.liberado &&
        npc.vivo &&
        npc.estado !== "death"
    ).length;

  },

  // ==========================================
  // CONSULTAR PROGRESSO
  // ==========================================

  obterProgresso() {

    return {

      total: this.lista.length,

      derrotados:
        this.totalDerrotados,

      liberados:
        this.lista.filter(
          npc => npc.liberado
        ).length,

      vivos:
        this.contarVivos(),

      restantes:
        this.lista.length -
        this.totalDerrotados

    };

  },

  totalDerrotados(){
    return (
      this.lista.length > 0 && this.lista.every(
        npc => npc.derrotaContabilizada
      )
    );
  },

    // VERIFICAR INIMIGOS DA AVENIDA CENTRAL
  avenidaCentralConcluida() {

    if (this.lista.length === 0) {
      return false;
    }

    const inimigosAvenida = this.lista.filter(
      npc => npc.origemX < 1200
    );

    return (
      inimigosAvenida.length > 0 &&
      inimigosAvenida.every(
        npc => npc.derrotaContabilizada
      )
    );

  }

    ,

  // VERIFICAR SE UMA REGIÃO FOI CONCLUÍDA
  regiaoConcluida(inicio, fim) {

    if (this.lista.length === 0) {
      return false;
    }

    const inimigosRegiao = this.lista.filter(
      npc =>
        npc.origemX >= inicio &&
        npc.origemX < fim
    );

    return (
      inimigosRegiao.length > 0 &&
      inimigosRegiao.every(
        npc => npc.derrotaContabilizada
      )
    );

  },

  // LIBERAÇÃO DO DISTRITO COMERCIAL
  distritoComercialConcluido() {
    return this.regiaoConcluida(1200, 2400);
  },

  // LIBERAÇÃO DO BAIRRO INDUSTRIAL
  bairroIndustrialConcluido() {
    return this.regiaoConcluida(2400, 3600);
  },

  // ==========================================
  // CONCLUSÃO DOS SAQUEADORES DA USINA
  // ==========================================

  usinaEletricaConcluida() {

    return this.regiaoConcluida(3600, 4800);

  },

  // ==========================================
  // VERIFICAR SE O CHEFÃO PODE APARECER
  // ==========================================

  podeIniciarChefao() {

    return (
      this.avenidaCentralConcluida() &&
      this.distritoComercialConcluido() &&
      this.bairroIndustrialConcluido() &&
      this.usinaEletricaConcluida()
    );

  }

};
