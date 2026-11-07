
/*
  CHOQUE NO SISTEMA REMAKE
  SUPER ONDA ELÉTRICA
  ALENCAR GAME STUDIO
*/

window.SuperOndaEletrica = {

  imagens: [],
  ativo: false,
  tempo: 0,
  recarga: 0,

  custo: 100,
  recargaMaxima: 12000,
  // Tempo da preparação do ataque
  cargaMs: 800,

  // Tempo de deslocamento da onda
  disparoMs: 2500,

  // Alternância dos frames 15 e 16
  velocidadeFramesProjetil: 100,

  alcance: 900,
  danoInicial: 80,
  danoFinal: 30,
  danoChefe: 45,

  direcao: 1,
  origemX: 0,
  centroY: 0,
  frente: 0,
  limite: 0,

  atingidos: new Set(),
  arrastados: new Set(),
  chefeAtingido: false,

  // CARREGAR OS 16 FRAMES

  iniciarSprites() {

    if (this.imagens.length) return;

    for (let i = 1; i <= 16; i++) {

      const numero = String(i).padStart(2, "0");

      const img = new Image();

      img.src =
        `sprites/heroi/super_onda_eletrica/onda_eletrica_${numero}.png`;

      img.onerror = () => {
        console.warn("Sprite ausente:", img.src);
      };

      this.imagens.push(img);
    }
  },

  // ATIVAR O SUPER ATAQUE

  iniciar(jogador, animacoes) {

    if (
      this.ativo ||
      this.recarga > 0 ||
      !jogador ||
      (
        animacoes &&
        (
          animacoes.morrendo ||
          animacoes.recebendoDano ||
          animacoes.atacando
        )
      ) ||
      !jogador.consumirEnergia ||
      jogador.energia < this.custo
    ) {
      return false;
    }

    this.iniciarSprites();

    if (!jogador.consumirEnergia(this.custo)) {
      return false;
    }

    this.ativo = true;
    this.tempo = 0;
    this.recarga = this.recargaMaxima;

    this.direcao =
      animacoes?.direcao === -1 ? -1 : 1;

    // =====================================
    // ORIGEM DA SUPER ONDA ELÉTRICA
    // =====================================

    // Posição horizontal das mãos
    this.origemX =
        jogador.x +
        jogador.largura / 2 +
        this.direcao * 55;

    // Altura do disparo em relação ao herói
    this.centroY =
        jogador.y +
        jogador.altura * 0.40;

    this.frente = this.origemX;

    const area = Math.max(
      0,
      Math.min(3, Math.floor(jogador.x / 1200))
    );

    this.limite =
      this.direcao === 1
        ? (area + 1) * 1200 - 12
        : area * 1200 + 12;

    this.atingidos.clear();
    this.arrastados.clear();

    this.chefeAtingido = false;

    return true;
  },

  // ATUALIZAR A ONDA

  atualizar(dt, jogador) {

    const passo = Math.max(
      0,
      Math.min(50, dt || 0)
    );

    this.recarga = Math.max(
      0,
      this.recarga - passo
    );

    if (!this.ativo) return;

    this.tempo += passo;

    // TEMPO DE CARREGAMENTO

    // =====================================
    // SUPER ONDA ELÉTRICA
    // IDENTIFICAR O FRAME ATUAL
    // =====================================

    const carregando = this.tempo < this.cargaMs;

    const frameAtual = carregando
        ? Math.min(14, Math.floor(this.tempo / 100) + 1)
        : 15 + (
            Math.floor(
                (this.tempo - this.cargaMs) /
                this.velocidadeFramesProjetil
            ) % 2
        );

    // Frames 1 a 16
    this.frameAtual = frameAtual;

    // CARREGAMENTO SEM COLISAO
    if(this.tempo < this.cargaMs){
      this.frente = this.origemX;
      return;
    }

    this.frameAtual = 16;

    // =====================================
    // FRAME 16 — DESLOCAMENTO DO PROJÉTIL
    // =====================================

    // Progresso do disparo: de 0 até 1
    const t = Math.max(
        0,
        Math.min(
            1,
            (this.tempo - this.cargaMs) / this.disparoMs
        )
    );

    // Identificar a distância até o limite
    // da área na direção do ataque
    const distanciaDisponivel = Math.max(
        0,
        (this.limite - this.origemX) * this.direcao
    );

    // O projétil percorre até 900 px
    const distancia = Math.min(
        this.alcance * t,
        distanciaDisponivel
    );

    // Posição da extremidade dianteira da onda
    this.frente =
        this.origemX +
        this.direcao * distancia;

    // CRESCIMENTO DA HITBOX

    // =====================================
    // SUPER ONDA ELÉTRICA
    // COLISÃO PROGRESSIVA DOS 16 FRAMES
    // =====================================

    // Tamanho da colisão durante o carregamento
    const largurasFrames = [
        45, 55, 65, 75,
        90, 110, 140, 175,
        210, 250, 300, 360,
        420, 500
    ];

    const alturasFrames = [
        35, 40, 45, 50,
        55, 60, 65, 70,
        80, 90, 100, 110,
        120, 130
    ];

    let larguraCaixa;
    let alturaCaixa;

    if (carregando) {

        // Frames 1 a 14
        const indice = Math.min(
            13,
            this.frameAtual - 1
        );

        larguraCaixa = largurasFrames[indice];
        alturaCaixa = alturasFrames[indice];

    } else {

        // Frames 15 e 16: projétil
        larguraCaixa = 500;
        alturaCaixa = 130;

    }

    // A caixa acompanha o crescimento e o avanço
    // =====================================
    // COLISÃO ALINHADA COM A SUPER ONDA
    // FRAMES 1 A 16
    // =====================================

    const centroCaixaX = carregando
        ? this.origemX
        : this.frente;

    // Frames 1 a 14: colisão cresce
    // à frente do herói.
    //
    // Frames 15 e 16: colisão acompanha
    // o corpo do projétil.

    // =====================================
    // FRAME 16 — CAIXA DE COLISÃO
    // =====================================

    // Mesma largura usada no desenho
    // =====================================
    // FRAME 16 — DIMENSÕES E ALINHAMENTO
    // =====================================

    // Dimensões usadas no Canvas
    const larguraProjetil = 330;
    const alturaProjetil = 130;

    // Compensação horizontal da sprite
    const deslocamentoSprite =
        larguraProjetil * (170 / 640);

    // Mesmo ajuste usado no desenho
    const ajusteHorizontal = 50;

    // A colisão acompanha o deslocamento
    // da onda elétrica
    // =====================================
    // COLISÃO ALINHADA AO DESENHO
    // =====================================

    // =====================================
    // FRAME 16 — COLISÃO AJUSTADA
    // =====================================

    // Margens internas da colisão
    const margemHorizontal = 35;
    const margemVertical = 20;

    // Posição da sprite no mundo
    const spriteX = this.direcao === 1
        ? this.frente - deslocamentoSprite + ajusteHorizontal
        : this.frente - larguraProjetil + deslocamentoSprite - ajusteHorizontal;

    // Caixa de colisão reduzida
    const caixa = {
        x: spriteX + margemHorizontal,

        y: this.centroY -
          alturaProjetil / 2 +
          margemVertical,

        w: larguraProjetil - margemHorizontal * 2,

        h: alturaProjetil - margemVertical * 2
    };

    this.caixaDebug = {...caixa };

    // =====================================
    // LIMITES DA SUPER ONDA ELÉTRICA
    // MUNDO 1 — 4 ÁREAS
    // =====================================

    // Identificar a área onde o ataque começou.
    const areaAtual = Math.max(
        0,
        Math.min(
            3,
            Math.floor(this.origemX / 1200)
        )
    );

    // Limites horizontais da área.
    const limiteEsquerdo = areaAtual * 1200 + 12;
    const limiteDireito = (areaAtual + 1) * 1200 - 12;

    // Limitar a caixa de colisão.
    const inicioLimitado = Math.max(
        caixa.x,
        limiteEsquerdo
    );

    // Permitir que a onda alcance o chefão
    // quando a batalha estiver ativa
    const batalhaChefeAtiva =
        window.RaioDeFogo &&
        RaioDeFogo.ativo &&
        !RaioDeFogo.derrotado;

    // Durante a batalha, permitir que a colisão
    // acompanhe a onda além do limite da área
    const fimLimitado = batalhaChefeAtiva
        ? caixa.x + caixa.w
        : Math.min(
            caixa.x + caixa.w,
            limiteDireito
        );

    // Atualizar a caixa sem permitir
    // largura negativa.
    caixa.x = inicioLimitado;

    caixa.w = Math.max(
        0,
        fimLimitado - inicioLimitado
    );

    // COLISÃO COM OS SAQUEADORES

    if (
      window.Inimigos &&
      Array.isArray(Inimigos.lista)
    ) {

      for (const npc of Inimigos.lista) {

        if (
          !npc.liberado ||
          !npc.vivo ||
          npc.estado === "death"
        ) {
          continue;
        }

        const toca =
          caixa.x < npc.x + npc.largura &&
          caixa.x + caixa.w > npc.x &&
          caixa.y < npc.y + npc.altura &&
          caixa.y + caixa.h > npc.y;

        if (
          toca &&
          !this.atingidos.has(npc)
        ) {

          this.atingidos.add(npc);
          this.arrastados.add(npc);

          npc.vida = Math.max(
            0,
            npc.vida - this.danoInicial
          );

          Inimigos.mudarEstado(
            npc,
            npc.vida <= 0
              ? "death"
              : "damage"
          );
        }
      }

      // EMPURRAR OS INIMIGOS COM A ONDA

      // =====================================
      // SUPER ONDA ELÉTRICA — ARRASTO
      // FRAME 16
      // =====================================

      const tempoProjetil = this.tempo - this.cargaMs;

      const frameProjetil = 15 + (
          Math.floor(
              tempoProjetil /
              this.velocidadeFramesProjetil
          ) % 2
      );

      for (const npc of this.arrastados) {

          if (
              !npc.vivo ||
              npc.vida <= 0 ||
              npc.estado === "death"
          ) {
              continue;
          }


          // =====================================
          // ARRASTO ALINHADO COM A COLISÃO
          // =====================================

          // Identificar a extremidade dianteira
          // da caixa de colisão atual.
          const frenteArrasto =
              this.direcao === 1
                  ? caixa.x + caixa.w
                  : caixa.x;

          // Manter o saqueador próximo à frente da onda
          const distanciaDoCentro = 20;

          npc.x =
              frenteArrasto +
              this.direcao * distanciaDoCentro -
              npc.largura / 2;

          // Respeitar os limites da área
          Inimigos.limitarMovimento(npc);

          // Impedir ataques e perseguição
          npc.estadoIA = "patrulha";
          npc.tempoEspera = 300;
          npc.tempoRecarga = Math.max(
              npc.tempoRecarga,
              300
          );

          // Manter a animação de dano
          if (npc.estado !== "damage") {
              Inimigos.mudarEstado(npc, "damage");
          }

      }
    }

    // COLISÃO COM O RAIO DE FOGO

    if (
      window.RaioDeFogo &&
      RaioDeFogo.ativo &&
      !RaioDeFogo.derrotado &&
      !this.chefeAtingido
    ) {

      const chefe =
        RaioDeFogo.obterCaixaColisao();


      const colisao =
        caixa.x < chefe.x + chefe.w &&
        caixa.x + caixa.w > chefe.x &&
        caixa.y < chefe.y + chefe.h &&
        caixa.y + caixa.h > chefe.y;

        // =====================================
      // DEBUG — COLISÃO COM RAIO DE FOGO
      // =====================================

      if (colisao) {
          console.log("✅ SUPER ONDA ATINGIU O RAIO DE FOGO!");
      } 

      if (colisao) {


        // Evitar dano duplicado
        this.chefeAtingido = true;

        // Aplicar 45 HP de dano
        RaioDeFogo.receberDano(
            this.danoChefe
        );

        // =====================================
        // EMPURRÃO NO CHEFÃO RAIO DE FOGO
        // =====================================

        // Distância do recuo
        const empurraoChefe = 30;

        // Empurrar na direção do disparo
        if (
            typeof RaioDeFogo.x === "number" &&
            !RaioDeFogo.derrotado
        ) {
            RaioDeFogo.x +=
                this.direcao * empurraoChefe;
        }

        // Encerrar o projétil imediatamente
        this.finalizar();

        console.log(
            "⚡ SUPER ONDA ATINGIU O CHEFÃO E DESAPARECEU!"
        );

        return;
      }
    }

    // ENCERRAR QUANDO ATINGIR O ALCANCE

    // =====================================
    // FINALIZAÇÃO DA SUPER ONDA ELÉTRICA
    // =====================================

    // Tempo decorrido desde o lançamento
    const tempoDisparo = Math.max(
        0,
        this.tempo - this.cargaMs
    );

    // O ataque termina quando completar
    // o tempo de deslocamento configurado.
    if (tempoDisparo >= this.disparoMs) {
        this.finalizar();
    }
  },

  // EXPLOSÃO FINAL

  finalizar() {

    for (const npc of this.arrastados) {

      if (
        !npc.vivo ||
        npc.estado === "death"
      ) {
        continue;
      }

      npc.vida = Math.max(
        0,
        npc.vida - this.danoFinal
      );

      if (window.Inimigos) {

        Inimigos.mudarEstado(
          npc,
          npc.vida <= 0
            ? "death"
            : "damage"
        );
      }
    }

    this.arrastados.clear();
    this.ativo = false;

    // =====================================
    // REINICIAR O ESTADO DO HERÓI
    // =====================================

    if (window.AnimacoesHeroi) {

        AnimacoesHeroi.superOndaAtiva = false;

        if (
            AnimacoesHeroi.estado ===
            "super_onda_eletrica"
        ) {
            AnimacoesHeroi.mudarEstado("idle");
            AnimacoesHeroi.frame = 0;
            AnimacoesHeroi.tempo = 0;
        }
    }
  },

  // DESENHAR A ONDA NO CANVAS

  desenhar(ctx, cameraX = 0, cameraY = 0) {

    if (!this.ativo) return;

    // =====================================
    // EVITAR DUPLICAÇÃO DO HERÓI
    // =====================================

    // Frames 1 a 14 são desenhados
    // exclusivamente pelo animacoes.js.
    //
    // Este arquivo desenha apenas
    // os frames 15 e 16 do projétil.

    if (this.tempo < this.cargaMs) {
        return;
    }

    const t = Math.max(
      0,
      (this.tempo - this.cargaMs) / this.disparoMs
    );

    // ESCOLHER O FRAME DA ANIMAÇÃO

    // =====================================
    // SUPER ONDA ELÉTRICA
    // FRAMES 15 E 16 — PROJÉTIL
    // =====================================

    const tempoProjetil = Math.max(
        0,
        this.tempo - this.cargaMs
    );

    const idx =  15;

    const img = this.imagens[idx];

    if (
      !img?.complete ||
      !img.naturalWidth
    ) {
      return;
    }

    // AUMENTAR A SPRITE PROGRESSIVAMENTE

    
    // CRESCIMENTO HORIZONTAL DO SUPER ATAQUE
    // Estilo Kamehameha

    const progresso = Math.min(1, t);

    // =====================================
    // TAMANHO VISUAL DA SUPER ONDA ELÉTRICA
    // =====================================

    // Frames 1 a 14: crescimento progressivo
    // Frames 15 e 16: onda com 500 px

    const largura = 300;

    const altura = this.tempo < this.cargaMs
        ? [
            35, 40, 45, 50,
            55, 60, 65, 70,
            80, 90, 100, 110,
            120, 75
          ][Math.min(13, Math.floor(this.tempo / 100))]
        : 130;

    // =====================================
    // POSIÇÃO HORIZONTAL DO PROJÉTIL
    // =====================================

    // Manter a onda inteira à frente do ponto
    // de avanço, respeitando a direção.
    // =====================================
    // POSICIONAMENTO VISUAL DA SUPER ONDA
    // =====================================

    // Frames 1 a 14: onda cresce a partir do herói.
    // Frames 15 e 16: onda acompanha o projétil.

    const carregando = this.tempo < this.cargaMs;

    // Alinhar o círculo elétrico às mãos do herói
    // Compensar a margem transparente do frame 16

    const deslocamentoSprite = largura * (170 / 640);

    const ajusteHorizontal = 50;

    const x = this.direcao === 1
        ? this.frente - deslocamentoSprite - cameraX + ajusteHorizontal
        : this.frente - largura + deslocamentoSprite - cameraX - ajusteHorizontal;

    const y =
      this.centroY -
      altura / 2 -
      cameraY;

    // =====================================
    // LIMITES DA SUPER ONDA ELÉTRICA
    // MUNDO 1 — 4 ÁREAS
    // =====================================

    // Identificar a área onde o ataque começou.
    const areaAtual = Math.max(
        0,
        Math.min(
            3,
            Math.floor(this.origemX / 1200)
        )
    );

    // Limites horizontais da área.
    const limiteEsquerdo = areaAtual * 1200 + 12;
    const limiteDireito = (areaAtual + 1) * 1200 - 12;

    // Limitar a caixa de colisão.
    // =====================================
    // RECORTE VISUAL DA SUPER ONDA ELÉTRICA
    // =====================================

    // Salvar o estado atual do Canvas
    ctx.save();

    // Manter os pixels nítidos
    ctx.imageSmoothingEnabled = false;

    // Converter os limites da área
    // para coordenadas da tela
    const inicioTela = limiteEsquerdo - cameraX;
    const fimTela = limiteDireito - cameraX;

    // Criar a região de recorte
    ctx.beginPath();

    ctx.rect(
        inicioTela,
        0,
        Math.max(0, fimTela - inicioTela),
        ctx.canvas.height
    );

    // Durante a batalha contra o chefão,
    // não recortar a imagem no limite da área.
    const batalhaChefeAtiva =
        window.RaioDeFogo &&
        RaioDeFogo.ativo &&
        !RaioDeFogo.derrotado;

    if (!batalhaChefeAtiva) {
        ctx.clip();
    }

    // INVERTER PARA A ESQUERDA

    if (this.direcao === -1) {

      ctx.translate(x + largura, 0);
      ctx.scale(-1, 1);

      ctx.drawImage(
        img,
        0,
        y,
        largura,
        altura
      );

    } else {

      ctx.drawImage(
        img,
        x,
        y,
        largura,
        altura
      );
    }

    ctx.restore();

    
  }
};
