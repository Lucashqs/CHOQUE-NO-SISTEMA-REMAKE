
/*
 * CHOQUE NO SISTEMA REMAKE
 * CHEFÃO 1 — RAIO DE FOGO
 * ALENCAR GAME STUDIO
 */

window.RaioDeFogo = {

  nome: "RAIO DE FOGO",

  x: 4200,
  y: 870,
  largura: 100,
  altura: 150,

  obterCaixaColisao() {
    return {
      x: this.x,
      y: this.y,
      w: this.largura,
      h: this.altura
    };
  },

  // ==========================================
  // VIDA DO CHEFÃO
  // ==========================================

  vida: 300,
  vidaMaxima: 300,

  
  // ==========================================
  // CORAÇÃO ESPECIAL DO CHEFÃO
  // ==========================================

  coracaoEspecialGerado: false,


  // ==========================================
  // ENERGIA DO CHEFÃO
  // ==========================================

  energia: 100,
  energiaMaxima: 100,
  custoBolaDeFogo: 25,
  regeneracaoEnergia: 5,

  atualizarEnergia(dt) {
    if (!this.ativo || this.derrotado) return;

    this.energia = Math.min(
      this.energiaMaxima,
      this.energia +
        this.regeneracaoEnergia *
        Math.max(0, dt) / 1000
    );
  },

  consumirEnergia(valor) {
    if (this.energia < valor) {
      return false;
    }

    this.energia -= valor;
    return true;
  },

  // ==========================================
  // CONTROLE DA DERROTA
  // ==========================================

  frameDerrota: 0,
  tempoDerrota: 0,
  intervaloDerrota: 120,
  animacaoDerrotaFinalizada: false,
  cutsceneDerrotaIniciada: false,

  ativo: false,
  derrotado: false,
  estado: "aguardando",

  // ==========================================
  // ANIMAÇÕES
  // ==========================================

  sprites: {
    idle: [],
    run: [],
    attack_01: [],
    death: []
  },

  frame: 0,
  tempoAnimacao: 0,
  velocidadeAnimacao: 130,

  // ==========================================
  // CONTROLE DO ATAQUE
  // ==========================================

  atacando: false,
  movendo: false,
  bolaDisparada: false,

  tempoRecarga: 0,
  recargaAtaque: 1500,

  // ==========================================
  // BOLAS DE FOGO
  // ==========================================

  projeteis: [],

  criarBolaDeFogo() {

    if (!this.ativo || this.derrotado) {
      return;
    }

    const larguraBola = 32;
    const alturaBola = 32;

    const posicaoX =
      this.direcao === 1
        ? this.x + this.largura
        : this.x - larguraBola;

    const posicaoY =
      this.y + this.altura * 0.4;

    const bola = {
      x: posicaoX,
      y: posicaoY,

      largura: larguraBola,
      altura: alturaBola,

      velocidade: 7,
      direcao: this.direcao,
      dano: 15,
      ativa: true
    };

    this.projeteis.push(bola);

    console.log("BOLA DE FOGO CRIADA!");
  },

  // ==========================================
  // ATUALIZAR BOLAS DE FOGO
  // ==========================================

  atualizarProjeteis(dt, jogador, vidaHeroi) {

    const fatorTempo = dt / 16.67;

    for (const bola of this.projeteis) {

      if (!bola.ativa) continue;

      bola.x +=
        bola.velocidade *
        bola.direcao *
        fatorTempo;

      // COLISÃO DA BOLA DE FOGO COM O HERÓI

      if (jogador && bola.ativa) {

        const centroBolaX =
          bola.x + bola.largura / 2;

        const centroBolaY =
          bola.y + bola.altura / 2;

        const raioBola = 10;

        const margemX =
          jogador.largura * 0.25;

        const margemY =
          jogador.altura * 0.15;

        const esquerda =
          jogador.x +
          jogador.largura -
          margemX;

        const direita =
          jogador.x +
          jogador.largura -
          margemX;

        const topo =
          jogador.y + margemY;

        const baixo =
          jogador.y +
          jogador.altura -
          margemY;

        const pontoX = Math.max(
          esquerda,
          Math.min(centroBolaX, direita)
        );

        const pontoY = Math.max(
          topo,
          Math.min(centroBolaY, baixo)
        );

        const distanciaX =
          centroBolaX - pontoX;

        const distanciaY =
          centroBolaY - pontoY;

        const colisao =
          distanciaX * distanciaX +
          distanciaY * distanciaY <=
          raioBola * raioBola;

        if (colisao) {

          bola.ativa = false;

          if (
            vidaHeroi &&
            vidaHeroi.valor > 0 &&
            vidaHeroi.tempoDano <= 0
          ) {

            vidaHeroi.valor = Math.max(
              0,
              vidaHeroi.valor - bola.dano
            );

            vidaHeroi.tempoDano = 1000;

            console.log(
              "RAIO DE FOGO ATINGIU O HERÓI!",
              "Dano:", bola.dano,
              "Vida restante:", vidaHeroi.valor
            );
          }
        }
      }

      // LIMITES DO MUNDO

      if (
        bola.x < -bola.largura ||
        bola.x > Mundo1.largura
      ) {
        bola.ativa = false;
      }
    }

    this.projeteis = this.projeteis.filter(
      bola => bola.ativa
    );
  },

  // ==========================================
  // DESENHAR BOLAS DE FOGO
  // ==========================================

  desenharProjeteis(ctx, cameraX, cameraY) {

    for (const bola of this.projeteis) {

      if (!bola.ativa) continue;

      const x = bola.x - cameraX;
      const y = bola.y - cameraY;

      const centroX =
        x + bola.largura / 2;

      const centroY =
        y + bola.altura / 2;

      ctx.save();

      ctx.shadowColor = "#ff4500";
      ctx.shadowBlur = 25;

      const gradiente =
        ctx.createRadialGradient(
          centroX,
          centroY,
          2,
          centroX,
          centroY,
          bola.largura / 2
        );

      gradiente.addColorStop(
        0, "#ffffff"
      );

      gradiente.addColorStop(
        0.3, "#ffff00"
      );

      gradiente.addColorStop(
        0.6, "#ff8800"
      );

      gradiente.addColorStop(
        1, "#ff2200"
      );

      ctx.fillStyle = gradiente;

      ctx.beginPath();

      ctx.arc(
        centroX,
        centroY,
        bola.largura / 2,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.restore();
    }
  },

  // ==========================================
  // ATAQUE COM CONSUMO DE ENERGIA
  // ==========================================

  atacar() {

    if (
      this.atacando ||
      !this.ativo ||
      this.derrotado
    ) {
      return false;
    }

    if (
      !this.consumirEnergia(
        this.custoBolaDeFogo
      )
    ) {
      console.log(
        "RAIO DE FOGO SEM ENERGIA!"
      );

      return false;
    }

    this.atacando = true;
    this.estado = "attack_01";
    this.bolaDisparada = false;

    this.frame = 0;
    this.tempoAnimacao = 0;

    console.log(
      "RAIO DE FOGO: ATAQUE!",
      "Energia restante:",
      this.energia
    );

    return true;
  },

  // ==========================================
  // INTELIGÊNCIA ARTIFICIAL
  // ==========================================

  distanciaDeteccao: 700,
  velocidadeMovimento: 1.5,
  distanciaCombate: 180,

  limiteEsquerdo: 3600,
  limiteDireito: 4800,

  heroiDetectado: false,
  direcao: -1,

  moverEmDirecaoAoHeroi(dt, jogador) {

    this.movendo = false;

    if (
      !this.ativo ||
      this.derrotado ||
      this.atacando ||
      !jogador ||
      !this.heroiDetectado
    ) {
      return;
    }

    const centroChefao =
      this.x + this.largura / 2;

    const centroHeroi =
      jogador.x + jogador.largura / 2;

    const distancia = Math.abs(
      centroHeroi - centroChefao
    );

    if (
      distancia <= this.distanciaCombate
    ) {
      return;
    }

    const direcao =
      centroHeroi < centroChefao
        ? -1
        : 1;

    const movimento =
      this.velocidadeMovimento *
      direcao *
      (dt / 16.67);

    const xAnterior = this.x;

    this.x += movimento;

    this.x = Math.max(
      this.limiteEsquerdo,
      Math.min(
        this.limiteDireito - this.largura,
        this.x
      )
    );

    // COLISÃO FÍSICA COM O HERÓI

    const sobrepostoY =
      this.y + this.altura > jogador.y &&
      this.y < jogador.y + jogador.altura;

    const sobrepostoX =
      this.x + this.largura > jogador.x &&
      this.x < jogador.x + jogador.largura;

    if (sobrepostoX && sobrepostoY) {

      if (
        movimento > 0 &&
        xAnterior + this.largura <= jogador.x
      ) {

        this.x =
          jogador.x - this.largura;

      } else if (
        movimento < 0 &&
        xAnterior >=
          jogador.x + jogador.largura
      ) {

        this.x =
          jogador.x + jogador.largura;
      }
    }

    this.movendo =
      Math.abs(this.x - xAnterior) > 0.01;
  },

  // ==========================================
  // DETECTAR O HERÓI
  // ==========================================

  detectarHeroi(jogador) {

    if (!this.ativo || this.derrotado) {
      return;
    }

    const centroChefao =
      this.x + this.largura / 2;

    const centroHeroi =
      jogador.x + jogador.largura / 2;

    const distancia = Math.abs(
      centroHeroi - centroChefao
    );

    this.heroiDetectado =
      distancia <= this.distanciaDeteccao;

    this.direcao =
      centroHeroi < centroChefao
        ? -1
        : 1;

    if (this.heroiDetectado) {
      this.estado = "combate";
    } else {
      this.estado = "aguardando";
    }
  },

  // ==========================================
  // CARREGAR SPRITES
  // ==========================================

  carregarSprites() {

    const pasta =
      "sprites/chefoes/raio_de_fogo/idle/";

    this.sprites.idle = [];

    for (let i = 1; i <= 8; i++) {

      const numero =
        String(i).padStart(2, "0");

      const imagem = new Image();

      imagem.src =
        `${pasta}idle_${numero}.png`;

      imagem.onerror = () => {
        console.error(
          "Sprite do Raio de Fogo não encontrada:",
          imagem.src
        );
      };

      this.sprites.idle.push(imagem);
    }

    // ANIMAÇÃO DE ATAQUE

    this.sprites.attack_01 = [];

    for (let i = 1; i <= 6; i++) {

      const numero =
        String(i).padStart(2, "0");

      const imagem = new Image();

      imagem.src =
        `sprites/chefoes/raio_de_fogo/attack_01/attack_01_${numero}.png`;

      imagem.onerror = () => {
        console.error(
          "Erro ao carregar ataque 1:",
          imagem.src
        );
      };

      this.sprites.attack_01.push(imagem);
    }

    // ANIMAÇÃO DE CORRIDA

    this.sprites.run = [];

    for (let i = 1; i <= 4; i++) {

      const numero =
        String(i).padStart(2, "0");

      const imagem = new Image();

      imagem.src =
        `sprites/chefoes/raio_de_fogo/run/run_${numero}.png`;

      imagem.onerror = () => {
        console.error(
          "Erro ao carregar sprite de corrida:",
          imagem.src
        );
      };

      this.sprites.run.push(imagem);
    }

    // ANIMAÇÃO DE DERROTA

    this.sprites.death = [];

    for (let i = 1; i <= 7; i++) {

      const imagem = new Image();

      imagem.src =
        "sprites/chefoes/raio_de_fogo/death/death_" +
        String(i).padStart(2, "0") +
        ".png";

      this.sprites.death.push(imagem);
    }
  },

  // ==========================================
  // RECEBER DANO
  // ==========================================

  receberDano(dano) {

    if (!this.ativo || this.derrotado) {
      return;
    }

    this.vida = Math.max(
      0,
      this.vida - dano
    );

    
    // LIBERAR CORAÇÃO ESPECIAL AOS 50% DE VIDA

    if (
      this.vida <= this.vidaMaxima / 2 &&
      this.vida > 0 &&
      !this.coracaoEspecialGerado
    ) {

      this.coracaoEspecialGerado = true;

      console.log(
        "❤️ CORAÇÃO ESPECIAL DESBLOQUEADO!",
        "Vida do chefão:", this.vida

      );

      
      // CRIAR CORAÇÃO ESPECIAL NA ARENA

      if (window.Inimigos) {

        const tamanho = 36;

        Inimigos.coracoes.push({
          x: this.x + this.largura / 2 - tamanho / 2,
          y: this.y + this.altura - tamanho,

          largura: tamanho,
          altura: tamanho,

          cura: 70,
          area: 3,
          especial: true,
          coletado: false
        });

        console.log(
          "❤️ Coração especial criado! Cura: 70 HP"
        );
      }


      // No próximo passo criaremos o coração
      // que recupera 70% da vida máxima do herói.
    }


    console.log(
      "RAIO DE FOGO RECEBEU DANO!",
      "Dano:", dano,
      "Vida restante:", this.vida
    );

    if (this.vida <= 0) {

      this.vida = 0;
      this.derrotado = true;
      this.estado = "derrota";

      this.atacando = false;
      this.movendo = false;
      this.projeteis = [];

      console.log(
        "RAIO DE FOGO FOI DERROTADO!"
      );
    }
  },

  // ==========================================
  // INICIAR O CHEFÃO
  // ==========================================

  iniciar() {

    if (this.ativo || this.derrotado) {
      return;
    }

    this.x = 4200;
    this.y = 870;
    this.direcao = -1;

    this.ativo = true;
    this.estado = "entrada";

    this.heroiDetectado = false;
    this.atacando = false;
    this.movendo = false;
    this.bolaDisparada = false;

    this.projeteis = [];
    this.tempoRecarga = 0;

    // ENERGIA CHEIA AO INICIAR
    this.energia = this.energiaMaxima;

    this.carregarSprites();

    this.frame = 0;
    this.tempoAnimacao = 0;
    this.animacaoAnterior = null;

    console.log(
      "CHEFÃO RAIO DE FOGO INICIADO!",
      "Posição X:", this.x,
      "Posição Y:", this.y
    );
  },

  // ==========================================
  // ATUALIZAR O CHEFÃO
  // ==========================================

  atualizar(dt, jogador, vidaHeroi) {

    // ANIMAÇÃO DE DERROTA

    if (this.estado === "derrota") {

      if (
        !this.animacaoDerrotaFinalizada
      ) {

        this.tempoDerrota += dt;

        if (
          this.tempoDerrota >=
          this.intervaloDerrota
        ) {

          this.tempoDerrota = 0;

          if (this.frameDerrota < 6) {

            this.frameDerrota++;

          } else {

            this.animacaoDerrotaFinalizada = true;

            console.log(
              "ANIMAÇÃO DE DERROTA FINALIZADA!"
            );

            if (
              !this.cutsceneDerrotaIniciada
            ) {

              this.cutsceneDerrotaIniciada = true;

              Cutscenes.iniciar(
                "dialogo_derrota_raio"
              );

              console.log(
                "CUTSCENE FINAL INICIADA!"
              );
            }
          }
        }
      }

      return;
    }

    if (!this.ativo || this.derrotado) {
      return;
    }

    // RECUPERAR ENERGIA
    this.atualizarEnergia(dt);

    // ATUALIZAR BOLAS DE FOGO
    this.atualizarProjeteis(
      dt,
      jogador,
      vidaHeroi
    );

    // DETECTAR O HERÓI
    if (jogador) {
      this.detectarHeroi(jogador);
    }

    // MOVIMENTAÇÃO
    if (jogador) {
      this.moverEmDirecaoAoHeroi(
        dt,
        jogador
      );
    }

    // ==========================================
    // RECARGA DO ATAQUE
    // ==========================================

    if (this.tempoRecarga > 0) {

      this.tempoRecarga = Math.max(
        0,
        this.tempoRecarga - dt
      );
    }

    // ==========================================
    // ATAQUE AUTOMÁTICO
    // ==========================================

    if (
      this.heroiDetectado &&
      !this.atacando &&
      this.tempoRecarga <= 0 &&
      vidaHeroi &&
      vidaHeroi.valor > 0
    ) {

      // SÓ RECARREGA SE ATACAR
      if (this.atacar()) {

        this.tempoRecarga =
          this.recargaAtaque;
      }
    }

    // ==========================================
    // CONTROLE DAS ANIMAÇÕES
    // ==========================================

    const animacaoAtual =
      this.atacando
        ? "attack_01"
        : this.movendo
          ? "run"
          : "idle";

    if (
      this.animacaoAnterior !==
      animacaoAtual
    ) {

      this.frame = 0;
      this.tempoAnimacao = 0;

      this.animacaoAnterior =
        animacaoAtual;
    }

    this.tempoAnimacao += dt;

    if (
      this.tempoAnimacao >=
      this.velocidadeAnimacao
    ) {

      this.tempoAnimacao = 0;
      this.frame++;

      // DISPARAR BOLA NO FRAME 3

      if (
        this.atacando &&
        this.frame === 3 &&
        !this.bolaDisparada
      ) {

        this.criarBolaDeFogo();
        this.bolaDisparada = true;
      }

      // FINALIZAR ANIMAÇÃO DE ATAQUE

      if (
        this.atacando &&
        this.frame >=
          this.sprites.attack_01.length
      ) {

        this.atacando = false;
        this.frame = 0;
        this.animacaoAnterior = null;

      } else if (!this.atacando) {

        const quantidade =
          this.sprites[animacaoAtual].length;

        if (quantidade > 0) {
          this.frame %= quantidade;
        }
      }
    }
  },

  // ==========================================
  // DESENHAR O CHEFÃO
  // ==========================================

  desenhar(ctx, cameraX, cameraY) {

    if (!this.ativo) {
      return;
    }

    // ANIMAÇÃO DE DERROTA

    if (this.estado === "derrota") {

      const imagem =
        this.sprites.death[
          this.frameDerrota
        ];

      if (
        imagem &&
        imagem.complete &&
        imagem.naturalWidth > 0
      ) {

        ctx.save();

        const ajusteQuedaY = 35;

        ctx.drawImage(
          imagem,
          this.x - cameraX,
          this.y - cameraY + ajusteQuedaY,
          this.largura,
          this.altura
        );

        ctx.restore();
      }

      return;
    }

    // ESCOLHER ANIMAÇÃO ATUAL

    const animacao =
      this.atacando
        ? this.sprites.attack_01
        : this.movendo
          ? this.sprites.run
          : this.sprites.idle;

    const imagem = animacao[this.frame];

    if (
      !imagem ||
      !imagem.complete ||
      imagem.naturalWidth === 0
    ) {
      return;
    }

    ctx.save();

    const centroX =
      this.x - cameraX +
      this.largura / 2;

    const posicaoY =
      this.y - cameraY;

    ctx.translate(
      centroX,
      posicaoY
    );

    if (this.direcao === -1) {
      ctx.scale(-1, 1);
    }

    ctx.drawImage(
      imagem,
      -this.largura / 2,
      0,
      this.largura,
      this.altura
    );

    ctx.restore();
  }
};
