
/*
 * CHOQUE NO SISTEMA 2.0
 * Jogador — Movimento, Colisoes e Knockback
 * Alencar Game Studio
 */

window.Jogador = {
  x: 40,
  y: 900,
  largura: 32,
  altura: 55,

  
  // Caixa de colisão física do herói
  obterCaixaColisao() {
    return {
      x: this.x,
      y: this.y,
      w: this.largura,
      h: this.altura
    };
  },


  vx: 0,
  vy: 0,
  velocidade: 5,
  forcaPulo: -14,
  velocidadeEscada: 3,

  noChao: false,
  subindoEscada: false,
  escadaAtual: null,
  pulosRestantes: 2,
  botaoPuloAnterior: false,

  // Sistema de recuo.
  tempoImpacto: 0,
  velocidadeImpacto: 0,
  duracaoImpacto: 220,
  forcaImpacto: 6,
  impulsoVertical: -5,

  receberImpacto(direcao) {
    if (this.tempoImpacto > 0) return;

    this.subindoEscada = false;
    this.escadaAtual = null;

    this.tempoImpacto = this.duracaoImpacto;
    this.velocidadeImpacto =
      direcao >= 0
        ? this.forcaImpacto
        : -this.forcaImpacto;

    this.vx = this.velocidadeImpacto;
    this.vy = this.impulsoVertical;
    this.noChao = false;
  },

  atualizar(teclas, plataformas) {
    const esquerda = !!(
      teclas.ArrowLeft || teclas.a
    );

    const direita = !!(
      teclas.ArrowRight || teclas.d
    );

    const subir = !!(
      teclas.ArrowUp || teclas.w
    );

    const descer = !!(
      teclas.ArrowDown || teclas.s
    );

    const pular = !!teclas.Space;

    const novoPulo =
      pular && !this.botaoPuloAnterior;

    this.botaoPuloAnterior = pular;

    // Durante o impacto, os controles
    // nao interrompem o recuo.
    const emImpacto = this.tempoImpacto > 0;

    if (emImpacto) {
      this.tempoImpacto = Math.max(
        0,
        this.tempoImpacto - 16.67
      );
    }

    const escadas = Mundo1.escadas || [];

    const centroX =
      this.x + this.largura / 2;

    const pes = this.y + this.altura;

    const escadaProxima = escadas.find(e => {
      const pertoX =
        centroX >= e.x - 18 &&
        centroX <= e.x + e.w + 18;

      const pertoY =
        pes >= e.y - 8 &&
        this.y <= e.y + e.h + 8;

      return pertoX && pertoY;
    });

    // Entrada na escada.
    if (
      !emImpacto &&
      !this.subindoEscada &&
      escadaProxima &&
      (subir || descer)
    ) {
      this.subindoEscada = true;
      this.escadaAtual = escadaProxima;
      this.noChao = false;
      this.vx = 0;
      this.vy = 0;

      this.x =
        escadaProxima.x +
        (escadaProxima.w - this.largura) / 2;
    }

    // Movimento na escada.
    if (
      !emImpacto &&
      this.subindoEscada &&
      this.escadaAtual
    ) {
      const e = this.escadaAtual;

      this.vx = 0;
      this.vy = 0;

      if (novoPulo) {
        this.subindoEscada = false;
        this.escadaAtual = null;
        this.vy = this.forcaPulo;
        this.pulosRestantes = 1;
      } else {
        if (subir) {
          this.y -= this.velocidadeEscada;
        }

        if (descer) {
          this.y += this.velocidadeEscada;
        }

        const topo = e.y - this.altura;
        const base = e.y + e.h - this.altura;

        this.y = Math.max(
          topo,
          Math.min(base, this.y)
        );

        // Sair pelo topo do predio.
        if (this.y <= topo && direita) {
          const predio = plataformas.find(p =>
            p.x >= e.x + e.w - 2 &&
            p.x <= e.x + e.w + 5 &&
            Math.abs(p.y - e.y) <= 2
          );

          if (predio) {
            this.x = predio.x + 2;
            this.y = predio.y - this.altura;
            this.noChao = true;
            this.pulosRestantes = 2;
            this.subindoEscada = false;
            this.escadaAtual = null;
          }
        }

        // Sair pela base.
        if (
          this.subindoEscada &&
          this.y >= base &&
          esquerda
        ) {
          this.subindoEscada = false;
          this.escadaAtual = null;
        }

        if (this.subindoEscada) {

          

          return;
          
        }
      }
    }

    // Movimento horizontal.
    if (emImpacto) {
      this.vx = this.velocidadeImpacto;
    } else {
      this.vx = 0;

      if (esquerda) {
        this.vx = -this.velocidade;
      }

      if (direita) {
        this.vx = this.velocidade;
      }

      // Pulo duplo.
      if (
        novoPulo &&
        this.pulosRestantes > 0 &&
        this.vy >= 0
      ) {
        this.vy = this.forcaPulo;
        this.noChao = false;
        this.pulosRestantes--;
      }
    }

    const xAnterior = this.x;

    this.x += this.vx;

    
    // COLISÃO FÍSICA: HERÓI X SAQUEADORES
    if (window.Inimigos && Array.isArray(Inimigos.lista)) {
      for (const npc of Inimigos.lista) {

        // Ignorar inimigos não liberados ou derrotados
        if (
          !npc.liberado ||
          !npc.vivo ||
          npc.estado === "death"
        ) {
          continue;
        }

        const sobrepostoY =
          this.y + this.altura > npc.y &&
          this.y < npc.y + npc.altura;

        if (!sobrepostoY) continue;

        const sobrepostoX =
          this.x + this.largura > npc.x &&
          this.x < npc.x + npc.largura;

        if (!sobrepostoX) continue;

        // Herói vindo pela esquerda
        if (
          this.vx > 0 &&
          xAnterior + this.largura <= npc.x
        ) {
          this.x = npc.x - this.largura;
          this.vx = 0;
        }

        // Herói vindo pela direita
        else if (
          this.vx < 0 &&
          xAnterior >= npc.x + npc.largura
        ) {
          this.x = npc.x + npc.largura;
          this.vx = 0;
        }

        
        // Corrigir sobreposição já existente
        else {
          const centroHeroi =
            this.x + this.largura / 2;

          const centroNpc =
            npc.x + npc.largura / 2;

          if (centroHeroi <= centroNpc) {
            this.x = npc.x - this.largura;
          } else {
            this.x = npc.x + npc.largura;
          }

          this.vx = 0;
        }

      }
    }


    // COLISÃO FÍSICA: HERÓI X RAIO DE FOGO
    if (
      window.RaioDeFogo &&
      RaioDeFogo.ativo &&
      !RaioDeFogo.derrotado
    ) {
      const chefe = RaioDeFogo.obterCaixaColisao();

      const sobrepostoY =
        this.y + this.altura > chefe.y &&
        this.y < chefe.y + chefe.h;

      const sobrepostoX =
        this.x + this.largura > chefe.x &&
        this.x < chefe.x + chefe.w;

      if (sobrepostoX && sobrepostoY) {

        // Herói se aproximando pela esquerda
        if (
          this.vx > 0 &&
          xAnterior + this.largura <= chefe.x
        ) {
          this.x = chefe.x - this.largura;
          this.vx = 0;
        }

        // Herói se aproximando pela direita
        else if (
          this.vx < 0 &&
          xAnterior >= chefe.x + chefe.w
        ) {
          this.x = chefe.x + chefe.w;
          this.vx = 0;
        }

        // Corrigir sobreposição já existente
        else {
          const centroHeroi =
            this.x + this.largura / 2;

          const centroChefe =
            chefe.x + chefe.w / 2;

          if (centroHeroi <= centroChefe) {
            this.x = chefe.x - this.largura;
          } else {
            this.x = chefe.x + chefe.w;
          }

          this.vx = 0;
        }
      }
    }

    // Colisao horizontal.
    for (const p of plataformas) {
      if (
        p.y === 1000 &&
        p.w === Mundo1.largura
      ) {
        continue;
      }

      const sobrepostoY =
        this.y + this.altura > p.y &&
        this.y < p.y + p.h;

      if (!sobrepostoY) continue;

      const sobrepostoX =
        this.x + this.largura > p.x &&
        this.x < p.x + p.w;

      if (!sobrepostoX) continue;

      if (
        this.vx > 0 &&
        xAnterior + this.largura <= p.x
      ) {
        this.x = p.x - this.largura;
        this.velocidadeImpacto = 0;
      } else if (
        this.vx < 0 &&
        xAnterior >= p.x + p.w
      ) {
        this.x = p.x + p.w;
        this.velocidadeImpacto = 0;
      }
    }

    // Limites horizontais do mundo.
    this.x = Math.max(
      0,
      Math.min(
        Mundo1.largura - this.largura,
        this.x
      )
    );

    // ==========================================
    // BLOQUEIO DO DISTRITO COMERCIAL
    // ==========================================

    const entradaDistrito = 1200;

    const avenidaConcluida =
      window.Inimigos &&
      typeof Inimigos.avenidaCentralConcluida === "function" &&
      Inimigos.avenidaCentralConcluida();

    if (!avenidaConcluida) {

      const limiteHeroi =
        entradaDistrito - this.largura;

      // Bloquear apenas a travessia da esquerda
      // para a direita.
      if (
        xAnterior + this.largura <= entradaDistrito &&
        this.x + this.largura > entradaDistrito
      ) {

        this.x = limiteHeroi;
        this.vx = 0;

      }

    }

    // ==========================================
    // BLOQUEIO — ENTRADA DO BAIRRO INDUSTRIAL
    // ==========================================

    const entradaIndustrial = 2400;

    const distritoConcluido =
      window.Inimigos &&
      typeof Inimigos.distritoComercialConcluido === "function" &&
      Inimigos.distritoComercialConcluido();

    if (!distritoConcluido) {

      const limiteHeroi =
        entradaIndustrial - this.largura;

      if (
        xAnterior + this.largura <= entradaIndustrial &&
        this.x + this.largura > entradaIndustrial
      ) {

        this.x = limiteHeroi;
        this.vx = 0;

      }

    }

        // ==========================================
    // BLOQUEIO — ENTRADA DA USINA ELÉTRICA
    // ==========================================

    const entradaUsina = 3600;

    const industrialConcluido =
      window.Inimigos &&
      typeof Inimigos.bairroIndustrialConcluido === "function" &&
      Inimigos.bairroIndustrialConcluido();

    if (!industrialConcluido) {

      const limiteHeroi =
        entradaUsina - this.largura;

      if (
        xAnterior + this.largura <= entradaUsina &&
        this.x + this.largura > entradaUsina
      ) {

        this.x = limiteHeroi;
        this.vx = 0;

      }

    }

    // Gravidade.
    const yAnterior = this.y;

    this.vy += Mundo1.gravidade;
    this.vy = Math.min(this.vy, 16);
    this.y += this.vy;
    this.noChao = false;

    // Colisao com topo das plataformas.
    for (const p of plataformas) {
      const sobrepostoX =
        this.x + this.largura > p.x &&
        this.x < p.x + p.w;

      const estavaAcima =
        yAnterior + this.altura <= p.y;

      const atingiuTopo =
        this.y + this.altura >= p.y;

      if (
        sobrepostoX &&
        estavaAcima &&
        atingiuTopo &&
        this.vy >= 0
      ) {
        this.y = p.y - this.altura;
        this.vy = 0;
        this.noChao = true;
        this.pulosRestantes = 2;
      }
    }

    // Impedir subida atraves da parte
    // inferior de uma plataforma.
    if (this.vy < 0) {
      for (const p of plataformas) {
        const sobrepostoX =
          this.x + this.largura > p.x &&
          this.x < p.x + p.w;

        const estavaAbaixo =
          yAnterior >= p.y + p.h;

        const atingiuBase =
          this.y <= p.y + p.h;

        if (
          sobrepostoX &&
          estavaAbaixo &&
          atingiuBase
        ) {
          this.y = p.y + p.h;
          this.vy = 0;
        }
      }
    }

    // Encerrar o recuo.
    if (this.tempoImpacto <= 0) {
      this.velocidadeImpacto = 0;
    }

    // Reaparecer ao cair do mundo.
    if (this.y > Mundo1.altura + 200) {
      this.x = 40;
      this.y = 900;
      this.vx = 0;
      this.vy = 0;
      this.noChao = false;
      this.subindoEscada = false;
      this.escadaAtual = null;
      this.pulosRestantes = 2;
      this.tempoImpacto = 0;
      this.velocidadeImpacto = 0;
    }

  
    
  },

  desenhar(ctx, cameraX, cameraY) {
    const x = this.x - cameraX;
    const y = this.y - cameraY;

    ctx.save();

    // Corpo.
    ctx.fillStyle = "#168bdf";
    ctx.fillRect(x + 5, y + 17, 22, 25);

    // Cabeca.
    ctx.fillStyle = "#e7ae86";
    ctx.fillRect(x + 8, y, 16, 18);

    // Mascara.
    ctx.fillStyle = "#172a59";
    ctx.fillRect(x + 6, y + 3, 20, 8);

    // Bracos.
    ctx.fillStyle = "#168bdf";
    ctx.fillRect(x, y + 20, 7, 20);
    ctx.fillRect(x + 25, y + 20, 7, 20);

    // Pernas.
    ctx.fillStyle = "#14254a";
    ctx.fillRect(x + 6, y + 42, 8, 13);
    ctx.fillRect(x + 19, y + 42, 8, 13);

    ctx.restore();
  }
};
