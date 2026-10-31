
/*
 * CHOQUE NO SISTEMA 2.0
 * ANIMACOES DO HEROI + SISTEMA DE COMBOS
 * ALENCAR GAME STUDIO
 *
 * COMBO:
 * J = primeiro soco
 * J + J = segundo soco
 * J + J + J = terceiro soco
 *
 * Attack 2 continua sendo a Fireball.
 */

window.AnimacoesHeroi = {

  // ==========================================
  // ESTADOS
  // ==========================================

  estado: "idle",
  frame: 0,
  tempo: 0,
  direcao: 1,

  imagens: {},
  imagensSemBola: {},
  carregadas: false,

  atacando: false,
  tipoAtaque: null,
  recebendoDano: false,
  morrendo: false,

  // ==========================================
  // SISTEMA DE COMBOS
  // ==========================================

  comboEtapa: 0,
  comboPendente: false,
  comboTempo: 0,
  comboJanela: 600,
  comboMaximo: 3,

  // Cada golpe possui um ID exclusivo.
  idGolpe: 0,

  // ==========================================
  // CONFIGURACOES DAS ANIMACOES
  // ==========================================

  configuracoes: {

    idle: {
      total: 8,
      velocidade: 130
    },

    run: {
      total: 4,
      velocidade: 90
    },

    jump: {
      total: 9,
      velocidade: 100
    },

    attack: {
      total: 6,
      velocidade: 83
    },

    attack_02: {
      total: 6,
      velocidade: 80
    },

    north: {
      total: 1,
      velocidade: 130
    },

    damage: {
      total: 6,
      velocidade: 100
    },

    death: {
      total: 7,
      velocidade: 160
    }
  },

  // ==========================================
  // REMOCAO DA ENERGIA LARANJA
  // ==========================================

  framesRemoverEnergia: [
    1, 3, 4, 5, 6
  ],

  regioesEnergia: {

    1: [
      {
        x1: 0.65,
        y1: 0.25,
        x2: 1.00,
        y2: 0.65
      }
    ],

    3: [
      {
        x1: 0.25,
        y1: 0.25,
        x2: 0.80,
        y2: 0.65
      }
    ],

    4: [
      {
        x1: 0.20,
        y1: 0.25,
        x2: 0.45,
        y2: 0.65
      },
      {
        x1: 0.65,
        y1: 0.25,
        x2: 1.00,
        y2: 0.65
      }
    ],

    5: [
      {
        x1: 0.65,
        y1: 0.25,
        x2: 1.00,
        y2: 0.65
      }
    ],

    6: [
      {
        x1: 0.65,
        y1: 0.25,
        x2: 1.00,
        y2: 0.65
      }
    ]
  },

  // ==========================================
  // INICIALIZAR
  // ==========================================

  iniciar() {

    let carregadas = 0;

    this.carregadas = false;
    this.imagens = {};
    this.imagensSemBola = {};

    this.estado = "idle";
    this.frame = 0;
    this.tempo = 0;
    this.direcao = 1;

    this.atacando = false;
    this.tipoAtaque = null;
    this.recebendoDano = false;
    this.morrendo = false;

    this.comboEtapa = 0;
    this.comboPendente = false;
    this.comboTempo = 0;
    this.idGolpe = 0;

    const estados =
      Object.keys(this.configuracoes);

    const totalImagens = estados.reduce(
      (soma, estado) => {
        return soma +
          this.configuracoes[estado].total;
      },
      0
    );

    estados.forEach(estado => {

      this.imagens[estado] = [];

      const total =
        this.configuracoes[estado].total;

      for (let i = 1; i <= total; i++) {

        const numero =
          String(i).padStart(2, "0");

        const imagem = new Image();

        imagem.onload = () => {

          if (
            estado === "attack_02" &&
            this.framesRemoverEnergia.includes(i)
          ) {

            try {

              this.imagensSemBola[i - 1] =
                this.removerEsferaLaranja(
                  imagem,
                  i
                );

            } catch (erro) {

              console.error(
                "Erro ao remover energia:",
                estado,
                i,
                erro
              );
            }
          }

          carregadas++;

          this.carregadas =
            carregadas === totalImagens;
        };

        imagem.onerror = () => {

          console.error(
            "Erro ao carregar sprite:",
            imagem.src
          );
        };

        imagem.src =
          `sprites/heroi/${estado}/${estado}_${numero}.png`;

        this.imagens[estado].push(imagem);
      }
    });
  },

  // ==========================================
  // IDENTIFICAR PIXELS DA ENERGIA
  // ==========================================

  pixelEnergia(r, g, b, a) {

    if (a < 15) {
      return false;
    }

    const laranja =
      r > 170 &&
      g > 55 &&
      r > g * 1.12 &&
      g > b * 1.25;

    const amarelo =
      r > 200 &&
      g > 125 &&
      b < 165;

    const centroClaro =
      r > 230 &&
      g > 185 &&
      b > 85 &&
      r > b * 1.08;

    return (
      laranja ||
      amarelo ||
      centroClaro
    );
  },

  // ==========================================
  // REMOVER ENERGIA PELO CANVAS
  // ==========================================

  removerEsferaLaranja(
    imagem,
    numeroFrame
  ) {

    const canvasAuxiliar =
      document.createElement("canvas");

    const largura =
      imagem.naturalWidth;

    const altura =
      imagem.naturalHeight;

    canvasAuxiliar.width = largura;
    canvasAuxiliar.height = altura;

    const ctxAuxiliar =
      canvasAuxiliar.getContext(
        "2d",
        {
          willReadFrequently: true
        }
      );

    ctxAuxiliar.drawImage(
      imagem,
      0,
      0
    );

    const imagemDados =
      ctxAuxiliar.getImageData(
        0,
        0,
        largura,
        altura
      );

    const pixels = imagemDados.data;

    const mascara =
      new Uint8Array(
        largura * altura
      );

    const regioes =
      this.regioesEnergia[numeroFrame] || [];

    // Procurar pixels alaranjados.
    for (const regiao of regioes) {

      const inicioX = Math.max(
        0,
        Math.floor(largura * regiao.x1)
      );

      const fimX = Math.min(
        largura,
        Math.ceil(largura * regiao.x2)
      );

      const inicioY = Math.max(
        0,
        Math.floor(altura * regiao.y1)
      );

      const fimY = Math.min(
        altura,
        Math.ceil(altura * regiao.y2)
      );

      for (
        let y = inicioY;
        y < fimY;
        y++
      ) {

        for (
          let x = inicioX;
          x < fimX;
          x++
        ) {

          const indice =
            (y * largura + x) * 4;

          const r = pixels[indice];
          const g = pixels[indice + 1];
          const b = pixels[indice + 2];
          const a = pixels[indice + 3];

          if (
            this.pixelEnergia(r, g, b, a)
          ) {

            mascara[
              y * largura + x
            ] = 1;
          }
        }
      }
    }

    // Expandir a mascara em 1 pixel.
    const mascaraExpandida =
      new Uint8Array(mascara);

    for (
      let y = 1;
      y < altura - 1;
      y++
    ) {

      for (
        let x = 1;
        x < largura - 1;
        x++
      ) {

        if (
          mascara[y * largura + x] !== 1
        ) {
          continue;
        }

        for (
          let dy = -1;
          dy <= 1;
          dy++
        ) {

          for (
            let dx = -1;
            dx <= 1;
            dx++
          ) {

            const px = x + dx;
            const py = y + dy;

            mascaraExpandida[
              py * largura + px
            ] = 1;
          }
        }
      }
    }

    // Tornar os pixels transparentes.
    for (
      let i = 0;
      i < mascaraExpandida.length;
      i++
    ) {

      if (
        mascaraExpandida[i] === 1
      ) {

        pixels[i * 4 + 3] = 0;
      }
    }

    ctxAuxiliar.putImageData(
      imagemDados,
      0,
      0
    );

    return canvasAuxiliar;
  },

  // ==========================================
  // MUDAR ESTADO
  // ==========================================

  mudarEstado(novoEstado) {

    if (this.estado === novoEstado) {
      return;
    }

    this.estado = novoEstado;
    this.frame = 0;
    this.tempo = 0;
  },

  // ==========================================
  // INICIAR GOLPE DO COMBO
  // ==========================================

  executarGolpe(etapa) {

    this.comboEtapa = etapa;

    this.comboTempo = 0;
    this.comboPendente = false;

    this.atacando = true;
    this.tipoAtaque = "attack";

    this.mudarEstado("attack");

    this.frame = 0;
    this.tempo = 0;

    // Novo identificador para cada soco.
    this.idGolpe++;
  },

  // ==========================================
  // INICIAR ATAQUE
  // ==========================================

  iniciarAtaque(tipo) {

    if (
      this.recebendoDano ||
      this.morrendo
    ) {
      return;
    }

    if (
      tipo !== "attack" &&
      tipo !== "attack_02"
    ) {
      return;
    }

    // ======================================
    // ATTACK 2 - FIREBALL
    // ======================================

    if (tipo === "attack_02") {

      if (this.atacando) {
        return;
      }

      this.comboEtapa = 0;
      this.comboTempo = 0;
      this.comboPendente = false;

      this.atacando = true;
      this.tipoAtaque = "attack_02";

      this.mudarEstado("attack_02");

      this.frame = 0;
      this.tempo = 0;

      this.idGolpe++;

      return;
    }

    // ======================================
    // ATTACK 1 - COMBO DE SOCOS
    // ======================================

    if (this.atacando) {

      // Permitir enfileirar o proximo
      // soco a partir do quarto frame.
      if (
        this.tipoAtaque === "attack" &&
        this.frame >= 3 &&
        this.comboEtapa < this.comboMaximo
      ) {

        this.comboPendente = true;
      }

      return;
    }

    // Continuar combo dentro da janela.
    if (
      this.comboTempo > 0 &&
      this.comboEtapa > 0 &&
      this.comboEtapa < this.comboMaximo
    ) {

      this.executarGolpe(
        this.comboEtapa + 1
      );

    } else {

      // Primeiro golpe.
      this.executarGolpe(1);
    }
  },

  // ==========================================
  // CANCELAR COMBO
  // ==========================================

  cancelarCombo() {

    this.comboEtapa = 0;
    this.comboTempo = 0;
    this.comboPendente = false;
  },

  // ==========================================
  // RECEBER DANO
  // ==========================================

  iniciarDano() {

    if (
      this.morrendo ||
      this.recebendoDano
    ) {
      return;
    }

    this.atacando = false;
    this.tipoAtaque = null;

    this.cancelarCombo();

    this.recebendoDano = true;

    this.mudarEstado("damage");

    this.frame = 0;
    this.tempo = 0;
  },

  // ==========================================
  // MORTE DO HEROI
  // ==========================================

  iniciarMorte() {

    if (this.morrendo) {
      return;
    }

    this.morrendo = true;

    this.recebendoDano = false;
    this.atacando = false;
    this.tipoAtaque = null;

    this.cancelarCombo();

    this.mudarEstado("death");

    this.frame = 0;
    this.tempo = 0;
  },

  // ==========================================
  // AVANCAR ANIMACAO
  // ==========================================

  avancarAnimacao(
    deltaTime,
    repetir = true
  ) {

    const config =
      this.configuracoes[this.estado];

    if (!config) {
      return false;
    }

    this.tempo += deltaTime;

    let terminou = false;

    while (
      this.tempo >= config.velocidade
    ) {

      this.tempo -= config.velocidade;

      this.frame++;

      if (
        this.frame >= config.total
      ) {

        if (repetir) {

          this.frame = 0;

        } else {

          this.frame =
            config.total - 1;

          terminou = true;

          break;
        }
      }
    }

    return terminou;
  },

  // ==========================================
  // ATUALIZAR ANIMACOES
  // ==========================================

  atualizar(jogador, deltaTime) {

    // ======================================
    // MORTE
    // ======================================

    if (this.morrendo) {

      this.mudarEstado("death");

      this.avancarAnimacao(
        deltaTime,
        false
      );

      return;
    }

    // ======================================
    // DANO
    // ======================================

    if (this.recebendoDano) {

      this.mudarEstado("damage");

      const terminou =
        this.avancarAnimacao(
          deltaTime,
          false
        );

      if (terminou) {

        this.recebendoDano = false;

        this.mudarEstado("idle");

      } else {

        return;
      }
    }

    // ======================================
    // DIRECAO DO HEROI
    // ======================================

    if (jogador.vx > 0) {

      this.direcao = 1;

    } else if (
      jogador.vx < 0
    ) {

      this.direcao = -1;
    }

    // ======================================
    // TEMPORIZADOR DO COMBO
    // ======================================

    if (
      !this.atacando &&
      this.comboTempo > 0
    ) {

      this.comboTempo = Math.max(
        0,
        this.comboTempo - deltaTime
      );

      if (this.comboTempo === 0) {

        this.cancelarCombo();
      }
    }

    // ======================================
    // ANIMACOES DE ATAQUE
    // ======================================

    if (this.atacando) {

      const terminou =
        this.avancarAnimacao(
          deltaTime,
          false
        );

      if (terminou) {

        // Executar proximo golpe
        // que foi enfileirado.
        if (
          this.tipoAtaque === "attack" &&
          this.comboPendente &&
          this.comboEtapa < this.comboMaximo
        ) {

          this.executarGolpe(
            this.comboEtapa + 1
          );

          return;
        }

        const terminouSoco =
          this.tipoAtaque === "attack";

        this.atacando = false;
        this.tipoAtaque = null;

        this.comboPendente = false;

        // Janela para continuar combo.
        if (
          terminouSoco &&
          this.comboEtapa < this.comboMaximo
        ) {

          this.comboTempo =
            this.comboJanela;

        } else {

          this.cancelarCombo();
        }

        this.mudarEstado("idle");

      } else {

        return;
      }
    }

    // ======================================
    // ESCADAS
    // ======================================

    if (jogador.subindoEscada) {

      this.mudarEstado("north");

      return;
    }

    // ======================================
    // ANIMACOES NORMAIS
    // ======================================

    let novoEstado = "idle";

    if (!jogador.noChao) {

      novoEstado = "jump";

    } else if (
      Math.abs(jogador.vx) > 0
    ) {

      novoEstado = "run";
    }

    this.mudarEstado(novoEstado);

    this.avancarAnimacao(
      deltaTime,
      true
    );
  },

  // ==========================================
  // DESENHAR HEROI
  // ==========================================

  desenhar(
    ctx,
    jogador,
    cameraX,
    cameraY
  ) {

    const frames =
      this.imagens[this.estado];

    let imagem =
      frames?.[this.frame];

    if (
      !imagem ||
      !imagem.complete ||
      imagem.naturalWidth === 0
    ) {
      return false;
    }

    // Remover energia laranja
    // somente no Attack 2.
    if (
      this.estado === "attack_02" &&
      this.framesRemoverEnergia.includes(
        this.frame + 1
      ) &&
      this.imagensSemBola[this.frame]
    ) {

      imagem =
        this.imagensSemBola[this.frame];
    }

    let larguraVisual = 110;
    let alturaVisual = 110;
    let ajustePes = 14;

    if (this.estado === "north") {

      larguraVisual = 80;
      alturaVisual = 80;
      ajustePes = 14;
    }

    const x =
      jogador.x -
      cameraX +
      jogador.largura / 2;

    const y =
      jogador.y -
      cameraY +
      jogador.altura -
      alturaVisual +
      ajustePes;

    ctx.save();

    // Espelhar para a esquerda.
    if (
      this.direcao === -1 &&
      this.estado !== "north"
    ) {

      ctx.translate(x, 0);

      ctx.scale(-1, 1);

      ctx.drawImage(
        imagem,
        -larguraVisual / 2,
        y,
        larguraVisual,
        alturaVisual
      );

    } else {

      ctx.drawImage(
        imagem,
        x - larguraVisual / 2,
        y,
        larguraVisual,
        alturaVisual
      );
    }

    ctx.restore();

    return true;
  }
};
