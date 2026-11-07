
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
    defesa: [],
    death: []
  },

  frame: 0,
  tempoAnimacao: 0,
  velocidadeAnimacao: 130,

  // ==========================================
  // DEFESA ESPECIAL — SUPER RAIO DE FOGO
  // ==========================================

  defesaAtiva: false,
  defesaDesbloqueada: false,


  duracaoDefesa: 4000,
  tempoDefesa: 0,

  recargaDefesa: 8000,
  tempoRecargaDefesa: 0,

  // Dano por contato com o chefão
  danoDefesa: 20,

  // ==========================================
  // NOVA DEFESA — BOLAS DE FOGO EM 8 DIREÇÕES
  // ==========================================

  // Quantidade de direções por rajada
  quantidadeDirecoesDefesa: 24,

  // Intervalo entre rajadas (milissegundos)
  intervaloRajadaDefesa: 800,

  // Temporizador das rajadas
  tempoRajadaDefesa: 0,

  // Dano de cada bola de fogo
  danoBolaDefesa: 15,

  // Velocidade dos projéteis
  velocidadeBolaDefesa: 5,

  // Lista independente de projéteis
  projeteisDefesa: [],

  
  // ==========================================
  // EFEITOS CINEMATOGRÁFICOS DA DEFESA
  // ==========================================

  // Partículas das explosões
  particulasImpacto: [],

  // Clarões das explosões
  claroesImpacto: [],

  // Tremor de tela
  tremorImpacto: 0,

  // Intensidade máxima do tremor
  intensidadeTremor: 7,

  // Duração do tremor em milissegundos
  duracaoTremor: 200,


  // Controle da animação completa
  repetirAnimacaoDefesa: true,


  // ==========================================
  // CONTROLE DOS FRAMES DA DEFESA
  // ==========================================

  // Frame atual da defesa (0 = frame_01)
  frameDefesa: 0,

  // Tempo entre os frames
  tempoFrameDefesa: 0,

  // Velocidade da animação
  intervaloFrameDefesa: 130,

  // Fases: inicio, sustentando, finalizando
  faseDefesa: "inicio",

  // ==========================================
  // CONTROLE DO ATAQUE
  // ==========================================

  atacando: false,
  movendo: false,
  bolaDisparada: false,

  tempoRecarga: 0,
  recargaAtaque: 1500,

  // ==========================================
  // SOCO DO RAIO DE FOGO
  // ==========================================

  // Dano causado pelo soco
  danoSoco: 20,

  // Distância para iniciar o soco
  alcanceSoco: 110,

  // Impedir múltiplos danos no mesmo soco
  acertouNesteAtaque: false,

  // Identificar o tipo de ataque
  tipoAtaque: null,

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
  // TREMOR CINEMATOGRÁFICO DO IMPACTO
  // ==========================================

  ativarTremorImpacto() {

    // Reiniciar a duração a cada impacto
    this.tremorImpacto = this.duracaoTremor;

  },

  atualizarTremorImpacto(dt) {

    if (this.tremorImpacto > 0) {

      this.tremorImpacto = Math.max(
        0,
        this.tremorImpacto - Math.max(0, dt)
      );

    }

  },

  obterDeslocamentoTremor() {

    if (this.tremorImpacto <= 0) {
      return { x: 0, y: 0 };
    }

    // Diminuir a intensidade gradualmente
    const intensidade =
      this.intensidadeTremor *
      (this.tremorImpacto / this.duracaoTremor);

    return {
      x: (Math.random() * 2 - 1) * intensidade,
      y: (Math.random() * 2 - 1) * intensidade
    };

  },

  
  // ==========================================
  // CLARÃO CINEMATOGRÁFICO DO IMPACTO
  // ==========================================

  criarClaraoImpacto(x, y) {

    this.claroesImpacto.push({
      x: x,
      y: y,
      raio: 65,
      duracao: 150,
      tempoRestante: 150
    });

  },

  atualizarClaroesImpacto(dt) {

    for (const clarao of this.claroesImpacto) {
      clarao.tempoRestante -= Math.max(0, dt);
    }

    this.claroesImpacto =
      this.claroesImpacto.filter(
        clarao => clarao.tempoRestante > 0
      );

  },

  desenharClaroesImpacto(ctx, cameraX, cameraY) {

    for (const clarao of this.claroesImpacto) {

      const x = clarao.x - cameraX;
      const y = clarao.y - cameraY;

      const intensidade = Math.max(
        0,
        clarao.tempoRestante / clarao.duracao
      );

      ctx.save();

      ctx.globalAlpha = intensidade;

      const gradiente = ctx.createRadialGradient(
        x, y, 0,
        x, y, clarao.raio
      );

      gradiente.addColorStop(0, "rgba(255,255,255,1)");
      gradiente.addColorStop(0.25, "rgba(255,255,0,0.9)");
      gradiente.addColorStop(0.6, "rgba(255,120,0,0.6)");
      gradiente.addColorStop(1, "rgba(255,50,0,0)");

      ctx.fillStyle = gradiente;

      ctx.beginPath();
      ctx.arc(x, y, clarao.raio, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

  },

  
  // ==========================================
  // EXPLOSÃO DE PARTÍCULAS DE FOGO
  // ==========================================

  criarParticulasImpacto(x, y) {

    const cores = [
      "#ffff00",
      "#ffcc00",
      "#ff8800",
      "#ff4500",
      "#ff2200"
    ];

    const quantidade = 20;

    for (let i = 0; i < quantidade; i++) {

      // Espalhar partículas em todas as direções
      const angulo = Math.random() * Math.PI * 2;

      // Velocidade aleatória
      const velocidade = 2 + Math.random() * 5;

      // Criar partícula
      this.particulasImpacto.push({

        x: x,
        y: y,

        velocidadeX: Math.cos(angulo) * velocidade,
        velocidadeY: Math.sin(angulo) * velocidade,

        tamanho: 3 + Math.random() * 6,

        cor: cores[
          Math.floor(Math.random() * cores.length)
        ],

        tempoVida: 450 + Math.random() * 300,
        tempoMaximo: 750,

        ativa: true
      });
    }

    console.log(
      "🔥 EXPLOSÃO CRIADA: 20 PARTÍCULAS!"
    );
  },

  
  // ==========================================
  // ATUALIZAR PARTÍCULAS DA EXPLOSÃO
  // ==========================================

  atualizarParticulasImpacto(dt) {

    const tempo = Math.max(0, dt);
    const fatorTempo = Math.min(tempo / 16.67, 3);

    for (const particula of this.particulasImpacto) {

      if (!particula.ativa) continue;

      // Diminuir o tempo de vida
      particula.tempoVida -= tempo;

      if (particula.tempoVida <= 0) {
        particula.ativa = false;
        continue;
      }

      // Movimentar a partícula
      particula.x +=
        particula.velocidadeX * fatorTempo;

      particula.y +=
        particula.velocidadeY * fatorTempo;

      // Reduzir gradualmente a velocidade
      particula.velocidadeX *=
        Math.pow(0.96, fatorTempo);

      particula.velocidadeY *=
        Math.pow(0.96, fatorTempo);

      // Transparência proporcional ao tempo restante
      particula.opacidade = Math.max(
        0,
        Math.min(
          1,
          particula.tempoVida /
          particula.tempoMaximo
        )
      );
    }

    // Remover partículas que terminaram
    this.particulasImpacto =
      this.particulasImpacto.filter(
        particula => particula.ativa
      );
  },




  // ==========================================
  // DESENHAR PARTÍCULAS DA EXPLOSÃO
  // ==========================================

  desenharParticulasImpacto(ctx, cameraX, cameraY) {

    for (const particula of this.particulasImpacto) {

      if (!particula.ativa) continue;

      const x = particula.x - cameraX;
      const y = particula.y - cameraY;

      ctx.save();

      // Transparência gradual
      ctx.globalAlpha = particula.opacidade ?? 1;

      // Brilho da partícula
      ctx.shadowColor = particula.cor;
      ctx.shadowBlur = 12;

      // Desenhar partícula
      ctx.fillStyle = particula.cor;

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        particula.tamanho,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.restore();
    }
  },




  // ==========================================
  // DEFESA ESPECIAL — DISPARO MULTIDIRECIONAL
  // ==========================================

  criarRajadaDefesa() {

    if (
      !this.ativo ||
      this.derrotado ||
      !this.defesaAtiva
    ) {
      return;
    }

    const centroX = this.x + this.largura / 2;
    const centroY = this.y + this.altura / 2;

    const quantidade = this.quantidadeDirecoesDefesa;
    const velocidade = this.velocidadeBolaDefesa;
    const tamanho = 32;

    // Criar uma bola para cada direção
    for (let i = 0; i < quantidade; i++) {

      const angulo =
        (Math.PI * 2 * i) / quantidade;

      const direcaoX = Math.cos(angulo);
      const direcaoY = Math.sin(angulo);

      this.projeteisDefesa.push({

        x: centroX - tamanho / 2,
        y: centroY - tamanho / 2,

        largura: tamanho,
        altura: tamanho,

        velocidadeX: direcaoX * velocidade,
        velocidadeY: direcaoY * velocidade,

        dano: this.danoBolaDefesa,

        tempoVida: 2000,

        ativa: true
      });
    }

    console.log(
      "🔥 RAJADA MULTIDIRECIONAL CRIADA!",
      quantidade,
      "bolas de fogo",
      "Total ativo:",
      this.projeteisDefesa.length
    );
  },


  // ==========================================
  // MOVIMENTAÇÃO DAS BOLAS DA DEFESA ESPECIAL
  // ==========================================

  
  // ==========================================
  // PROJÉTEIS DA DEFESA ESPECIAL
  // MOVIMENTO + TEMPO DE VIDA + COLISÃO
  // ==========================================

  atualizarProjeteisDefesa(dt, jogador, vidaHeroi) {

    const fatorTempo = Math.min(
      Math.max(dt, 0) / 16.67,
      3
    );

    for (const bola of this.projeteisDefesa) {

      if (!bola.ativa) continue;

      // Tempo máximo de existência
      bola.tempoVida -= Math.max(0, dt);

      if (bola.tempoVida <= 0) {
        bola.ativa = false;
        continue;
      }

      // Movimentação
      bola.x += bola.velocidadeX * fatorTempo;
      bola.y += bola.velocidadeY * fatorTempo;

      // ======================================
      // COLISÃO COM O HERÓI
      // ======================================

      if (jogador && vidaHeroi) {

        

        const colisao =
          bola.x < jogador.x + jogador.largura &&
          bola.x + bola.largura > jogador.x &&
          bola.y < jogador.y + jogador.altura &&
          bola.y + bola.altura > jogador.y;

        if (colisao) {

          

          // A bola desaparece ao atingir o herói
          bola.ativa = false;

          
          // ==========================================
          // EXPLOSÃO AO ATINGIR O HERÓI
          // ==========================================

          this.criarParticulasImpacto(
            bola.x + bola.largura / 2,
            bola.y + bola.altura / 2
          );

          
          this.criarClaraoImpacto(
              bola.x + bola.largura / 2,
              bola.y + bola.altura / 2
          );

          
          this.ativarTremorImpacto();




          // Aplicar dano somente se vulnerável
          if (
            vidaHeroi.valor > 0 &&
            (vidaHeroi.tempoDano || 0) <= 0
          ) {

            vidaHeroi.valor = Math.max(
              0,
              vidaHeroi.valor - bola.dano
            );

            // 1 segundo de invulnerabilidade
            vidaHeroi.tempoDano = 1000;

            // Animação de dano ou morte
            if (window.AnimacoesHeroi) {

              if (vidaHeroi.valor <= 0) {
                AnimacoesHeroi.iniciarMorte();
              } else {
                AnimacoesHeroi.iniciarDano();
              }
            }

            console.log(
              "🔥 BOLA ESPECIAL ATINGIU O HERÓI!",
              "Dano:", bola.dano,
              "Vida restante:", vidaHeroi.valor
            );
          }

          continue;
        }
      }
    }

    // Remover todas as bolas desativadas
    this.projeteisDefesa =
      this.projeteisDefesa.filter(
        bola => bola.ativa
      );
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
  // DESENHAR BOLAS DA DEFESA MULTIDIRECIONAL
  // ==========================================

  desenharProjeteisDefesa(ctx, cameraX, cameraY) {

    for (const bola of this.projeteisDefesa) {

      if (!bola.ativa) continue;

      const centroX =
        bola.x - cameraX + bola.largura / 2;

      const centroY =
        bola.y - cameraY + bola.altura / 2;

      ctx.save();

      // Brilho externo
      ctx.shadowColor = "#ff4500";
      ctx.shadowBlur = 25;

      // Gradiente de fogo
      const gradiente = ctx.createRadialGradient(
        centroX,
        centroY,
        2,
        centroX,
        centroY,
        bola.largura / 2
      );

      gradiente.addColorStop(0, "#ffffff");
      gradiente.addColorStop(0.3, "#ffff00");
      gradiente.addColorStop(0.6, "#ff8800");
      gradiente.addColorStop(1, "#ff2200");

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

    this.tipoAtaque = "bola_de_fogo";

    this.estado = "attack_01";
    this.bolaDisparada = false;

    this.acertouNesteAtaque = false;

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
  // ATAQUE CORPO A CORPO — SOCO
  // ==========================================

  iniciarSoco() {

    if (
      !this.ativo ||
      this.derrotado ||
      this.atacando ||
      this.defesaAtiva
    ) {
      return false;
    }

    // Iniciar animação de soco
    this.atacando = true;
    this.tipoAtaque = "soco";
    this.estado = "attack_01";

    // Não lançar bola de fogo
    this.bolaDisparada = true;

    // Reiniciar controle do dano
    this.acertouNesteAtaque = false;

    // Reiniciar animação
    this.frame = 0;
    this.tempoAnimacao = 0;
    this.animacaoAnterior = "attack_01";

    this.movendo = false;

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

    // ==========================================
    // ANIMAÇÃO DE DEFESA — SUPER RAIO DE FOGO
    // ==========================================

    this.sprites.defesa = [];

    for (let i = 1; i <= 8; i++) {

      const numero = String(i).padStart(2, "0");

      const imagem = new Image();

      imagem.src =
        `sprites/chefoes/raio_de_fogo/defesa/explosao_fogo_frame_${numero}.png`;

      imagem.onerror = () => {
        console.error(
          "Erro ao carregar defesa do Raio de Fogo:",
          imagem.src
        );
      };

      this.sprites.defesa.push(imagem);
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
  // ATIVAR DEFESA — SUPER RAIO DE FOGO
  // ==========================================

  ativarDefesa() {

    // Impedir ativação indevida
    if (
      !this.ativo ||
      this.derrotado ||
      this.defesaAtiva ||
      !this.defesaDesbloqueada ||
      this.tempoRecargaDefesa > 0
    ) {
      return false;
    }

    // Ativar proteção
    this.defesaAtiva = true;

    // Interromper corrida e ataque
    this.atacando = false;
    this.movendo = false;
    this.bolaDisparada = false;

    // Definir estado
    this.estado = "defesa";

    // Começar pelo frame 01
    this.frameDefesa = 0;
    this.tempoFrameDefesa = 0;

    // Iniciar pela animação de entrada
    this.faseDefesa = "inicio";

    // Preparar duração da proteção
    this.tempoDefesa = this.duracaoDefesa;

    this.tempoRajadaDefesa = 0;

    console.log(
      "🔥 SUPER RAIO DE FOGO — DEFESA ATIVADA!"
    );

    return true;
  },

  // ==========================================
  // ATUALIZAR ANIMAÇÃO DA DEFESA ESPECIAL
  // ==========================================

  
  atualizarDefesa(dt) {

    if (!this.defesaAtiva || this.derrotado) {
      return;
    }

    
    // ==========================================
    // ATUALIZAR BOLAS DA DEFESA ESPECIAL
    // ==========================================

    // Continuar movimentando as bolas
    // mesmo depois que a defesa terminar
    this.atualizarProjeteisDefesa(dt);


    // Contar o tempo total da defesa
    this.tempoDefesa = Math.max(
      0,
      this.tempoDefesa - dt
    );

    // Atualizar o tempo da animação
    this.tempoFrameDefesa += dt;

    
    // ==========================================
    // DISPAROS AUTOMÁTICOS DA DEFESA ESPECIAL
    // ==========================================

    this.tempoRajadaDefesa += dt;

    while (
      this.tempoRajadaDefesa >=
      this.intervaloRajadaDefesa
    ) {

      this.tempoRajadaDefesa -=
        this.intervaloRajadaDefesa;

      // Disparar 8 bolas em direções diferentes
      this.criarRajadaDefesa();
    }


    // Reproduzir todos os 8 frames continuamente
    while (
      this.tempoFrameDefesa >= this.intervaloFrameDefesa
    ) {

      this.tempoFrameDefesa -=
        this.intervaloFrameDefesa;

      this.frameDefesa++;

      // Reiniciar após o último frame
      if (this.frameDefesa >= this.sprites.defesa.length) {
        this.frameDefesa = 0;
      }
    }

    // Encerrar a defesa após 4 segundos
    if (this.tempoDefesa <= 0) {

      this.defesaAtiva = false;

      this.estado = "aguardando";
      this.atacando = false;
      this.movendo = false;
      this.bolaDisparada = false;

      // Reiniciar animações
      this.frame = 0;
      this.tempoAnimacao = 0;
      this.animacaoAnterior = null;

      this.frameDefesa = 0;
      this.tempoFrameDefesa = 0;

      // Iniciar recarga da defesa
      this.tempoRecargaDefesa =
        this.recargaDefesa;

      console.log(
        "🔥 DEFESA FINALIZADA!"
      );
    }
  },


  // ==========================================
  // DANO POR CONTATO — DEFESA ESPECIAL
  // ==========================================

  verificarDanoDefesa(jogador, vidaHeroi) {

    // Verificar se a defesa está ativa
    if (
      !this.defesaAtiva ||
      !this.ativo ||
      this.derrotado ||
      !jogador ||
      !vidaHeroi
    ) {
      return;
    }

    // Verificar se o herói está vulnerável
    if (
      vidaHeroi.valor <= 0 ||
      vidaHeroi.tempoDano > 0
    ) {
      return;
    }

    // Caixa de colisão do Raio de Fogo
    const alcanceExtraX = 45;
    const alcanceExtraY = 20;

    const caixaChefao = {
      x: this.x - alcanceExtraX,
      y: this.y - alcanceExtraY,
      w: this.largura + alcanceExtraX * 2,
      h: this.altura + alcanceExtraY * 2
    };

    // Detectar colisão com o herói
    const colisao =
      jogador.x < caixaChefao.x + caixaChefao.w &&
      jogador.x + jogador.largura > caixaChefao.x &&
      jogador.y < caixaChefao.y + caixaChefao.h &&
      jogador.y + jogador.altura > caixaChefao.y;

    if (colisao) {

      // Aplicar dano ao herói
      vidaHeroi.valor = Math.max(
        0,
        vidaHeroi.valor - this.danoDefesa
      );

      // Invulnerabilidade temporária do herói
      vidaHeroi.tempoDano = 1000;

      console.log(
        "🔥 HERÓI ATINGIDO PELA DEFESA DO RAIO DE FOGO!",
        "Dano:", this.danoDefesa,
        "Vida restante:", vidaHeroi.valor
      );
    }
  },

  // ==========================================
  // RECEBER DANO
  // ==========================================

  receberDano(dano) {

    if (!this.ativo || this.derrotado) {
      return;
    }

    // ==========================================
    // INVULNERABILIDADE DURANTE A DEFESA
    // ==========================================

    if (this.defesaAtiva) {

      console.log(
        "🔥 RAIO DE FOGO PROTEGIDO! DANO BLOQUEADO!"
      );

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
        
    // ==========================================
    // REINICIAR DEFESA ESPECIAL
    // ==========================================

    // Defesa começa desativada
    this.defesaAtiva = false;

    // Será liberada aos 50% de vida
    this.defesaDesbloqueada = false;

    // Reiniciar temporizadores
    this.tempoDefesa = 0;
    this.tempoRecargaDefesa = 0;

    // Reiniciar animação no frame 01
    this.frameDefesa = 0;
    this.tempoFrameDefesa = 0;

    // Preparar fase inicial
    this.faseDefesa = "inicio";

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

    
    // Atualizar partículas das explosões
    this.atualizarParticulasImpacto(dt);

    
    this.atualizarClaroesImpacto(dt);

    
    this.atualizarTremorImpacto(dt);


    // ==========================================
    // ATUALIZAR BOLAS DA DEFESA ESPECIAL
    // ==========================================

    this.atualizarProjeteisDefesa(
      dt,
      jogador,
      vidaHeroi
    );

    // ==========================================
    // CONTROLE DA DEFESA ESPECIAL
    // ==========================================

    // Atualizar recarga da defesa
    if (this.tempoRecargaDefesa > 0) {

      this.tempoRecargaDefesa = Math.max(
        0,
        this.tempoRecargaDefesa - dt
      );

    }

    // ==========================================
    // ATIVAÇÃO AUTOMÁTICA AOS 50% DE VIDA
    // ==========================================

    // Liberar defesa quando atingir 50% de vida
    if (
      this.vida > 0 &&
      this.vida <= this.vidaMaxima * 0.5
    ) {
      this.defesaDesbloqueada = true;
    }

    // Ativar defesa quando estiver disponível
    if (
      this.defesaDesbloqueada &&
      !this.defesaAtiva &&
      this.tempoRecargaDefesa <= 0 &&
      vidaHeroi &&
      vidaHeroi.valor > 0
    ) {
      this.ativarDefesa();
    }

    // Se a defesa estiver ativa
    // ==========================================
    // DEFESA ESPECIAL ATIVA
    // ==========================================

    if (this.defesaAtiva) {

      // Atualizar animação da defesa
      this.atualizarDefesa(dt);

      // Verificar dano por contato com o herói
      this.verificarDanoDefesa(
        jogador,
        vidaHeroi
      );

      // Continuar atualizando bolas de fogo
      this.atualizarProjeteis(
        dt,
        jogador,
        vidaHeroi
      );

      // Bloquear RUN e ATQ1 durante a defesa
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

    // ==========================================
    // ATAQUE AUTOMÁTICO
    // SOCO OU BOLA DE FOGO
    // ==========================================

    if (
      this.heroiDetectado &&
      !this.atacando &&
      this.tempoRecarga <= 0 &&
      jogador &&
      vidaHeroi &&
      vidaHeroi.valor > 0
    ) {

      const centroChefao =
        this.x + this.largura / 2;

      const centroHeroi =
        jogador.x + jogador.largura / 2;

      const distanciaX = Math.abs(
        centroHeroi - centroChefao
      );

      const distanciaY = Math.abs(
        (this.y + this.altura / 2) -
        (jogador.y + jogador.altura / 2)
      );

      // Verificar se o herói está
      // ao alcance do soco
      const podeDarSoco =
        distanciaX <= this.alcanceSoco &&
        distanciaY <= 90;

      let ataqueIniciado = false;

      if (podeDarSoco) {

        // ATAQUE CORPO A CORPO
        ataqueIniciado = this.iniciarSoco();

      } else {

        // ATAQUE À DISTÂNCIA
        ataqueIniciado = this.atacar();

      }

      // Aplicar recarga somente
      // quando um ataque for iniciado
      if (ataqueIniciado) {

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

      // ==========================================
      // COLISÃO DO SOCO — RAIO DE FOGO
      // ==========================================

      if (
        this.atacando &&
        this.tipoAtaque === "soco" &&
        this.frame >= 2 &&
        this.frame <= 3 &&
        !this.acertouNesteAtaque &&
        jogador &&
        vidaHeroi
      ) {

        // Permitir apenas uma tentativa
        // de acerto por animação
        this.acertouNesteAtaque = true;

        const alcance = 45;

        // Caixa de colisão do soco
        const hitbox = {
          x: this.direcao === 1
            ? this.x + this.largura
            : this.x - alcance,

          y: this.y + 20,

          w: alcance,
          h: this.altura - 40
        };

        // Caixa de colisão do herói
        const corpoHeroi = {
          x: jogador.x,
          y: jogador.y,
          w: jogador.largura,
          h: jogador.altura
        };

        // Verificar colisão e invulnerabilidade
        const colisao =
          hitbox.x < corpoHeroi.x + corpoHeroi.w &&
          hitbox.x + hitbox.w > corpoHeroi.x &&
          hitbox.y < corpoHeroi.y + corpoHeroi.h &&
          hitbox.y + hitbox.h > corpoHeroi.y;

        if (
          colisao &&
          vidaHeroi.valor > 0 &&
          (vidaHeroi.tempoDano || 0) <= 0
        ) {

          vidaHeroi.valor = Math.max(
            0,
            vidaHeroi.valor - this.danoSoco
          );

          // Invulnerabilidade temporária
          vidaHeroi.tempoDano = 1000;

          // Animação de dano ou morte
          if (window.AnimacoesHeroi) {

            if (vidaHeroi.valor <= 0) {
              AnimacoesHeroi.iniciarMorte();
            } else {
              AnimacoesHeroi.iniciarDano();
            }
          }
        }
      }

      // DISPARAR BOLA NO FRAME 3

      // ==========================================
      // DISPARAR BOLA DE FOGO NO FRAME 3
      // ==========================================

      if (
        this.atacando &&
        this.tipoAtaque === "bola_de_fogo" &&
        this.frame === 3 &&
        !this.bolaDisparada
      ) {

        this.criarBolaDeFogo();

        this.bolaDisparada = true;
      }
      // FINALIZAR ANIMAÇÃO DE ATAQUE

      if (
        this.atacando &&
        this.frame >= this.sprites.attack_01.length
      ) {

        // Encerrar o ataque atual
        this.atacando = false;

        // Limpar o tipo de ataque
        this.tipoAtaque = null;

        // Reiniciar controle do soco
        this.acertouNesteAtaque = false;

        // Reiniciar animação
        this.frame = 0;
        this.tempoAnimacao = 0;
        this.animacaoAnterior = null;

      } 
      else if (!this.atacando) {

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

    
    // ==========================================
    // DESENHAR PROJÉTEIS DA DEFESA ESPECIAL
    // ==========================================

    this.desenharProjeteisDefesa(
      ctx,
      cameraX,
      cameraY
    );

    
    // Desenhar partículas das explosões
    this.desenharParticulasImpacto(ctx, cameraX, cameraY);

    
    this.desenharClaroesImpacto(ctx, cameraX, cameraY);




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


      // Impedir desenho de RUN, ATQ1 e IDLE
      return;
    }

    // ==========================================
    // DESENHAR DEFESA — SUPER RAIO DE FOGO
    // ==========================================

    if (this.defesaAtiva) {

      const imagem =
        this.sprites.defesa[this.frameDefesa];

      if (
        imagem &&
        imagem.complete &&
        imagem.naturalWidth > 0
      ) {

        ctx.save();

        const centroX =
          this.x - cameraX + this.largura / 2;

        const posicaoY =
          this.y - cameraY;

        ctx.translate(
          centroX,
          posicaoY
        );

        // Virar sprite conforme direção do chefão
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

      // Impedir desenho de RUN, ATQ1 e IDLE
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
