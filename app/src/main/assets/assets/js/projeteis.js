
/*
 * CHOQUE NO SISTEMA 2.0
 * Sistema de Projeteis - Fireball Eletrica
 * Alencar Game Studio
 */

window.Projeteis = {

  lista: [],
  proximoId: 10000,

  velocidade: 10,
  alcance: 550,
  dano: 20,

  // ==================================
  // DISPARAR FIREBALL
  // ==================================

  disparar(jogador, direcao) {

    const sentido =
      direcao === -1 ? -1 : 1;

    const x =
      jogador.x +
      jogador.largura / 2 +
      sentido * 49;

    const y =
      jogador.y +
      jogador.altura - 110 + 14 + 110 * 0.45;

    const bola = {
      id: this.proximoId++,
      x: x,
      y: y,
      inicioX: x,
      direcao: sentido,
      raio: 11,
      ativa: true
    };

    this.lista.push(bola);

    return bola;
  },

  // ==================================
  // ATUALIZAR PROJETEIS
  // ==================================

  atualizar(dt, inimigos) {

    const fator =
      Math.min(dt / 16.67, 3);

    for (const bola of this.lista) {

      if (!bola.ativa) {
        continue;
      }

      const xAnterior = bola.x;

      bola.x +=
        this.velocidade *
        bola.direcao *
        fator;

      // Hitbox que cobre todo o
      // deslocamento do projetil.
      const esquerda = Math.min(
        xAnterior,
        bola.x
      ) - bola.raio;

      const direita = Math.max(
        xAnterior,
        bola.x
      ) + bola.raio;

      const hitbox = {
        x: esquerda,
        y: bola.y - bola.raio,
        w: direita - esquerda,
        h: bola.raio * 2,
        dano: this.dano
      };

      // Verificar colisao com NPCs.
      const atingidos =
        inimigos.receberAtaque(
          hitbox,
          bola.id
        ) || [];

      if (atingidos.length > 0) {
        bola.ativa = false;
        continue;
      }

      
      // ==========================================
      // COLISÃO DA BOLA DE RAIO COM O CHEFÃO
      // ==========================================

      if (
        typeof RaioDeFogo !== "undefined" &&
        RaioDeFogo.ativo &&
        !RaioDeFogo.derrotado &&
        !Cutscenes.ativa
      ) {

        
        // Área de colisão mais próxima do corpo visível
        const margemX = 25;
        const margemY = 15;

        const corpoX = RaioDeFogo.x + margemX;
        const corpoY = RaioDeFogo.y + margemY;

        const corpoLargura =
          RaioDeFogo.largura - margemX * 2;

        const corpoAltura =
          RaioDeFogo.altura - margemY * 2;

        const colisaoChefao =
          hitbox.x < corpoX + corpoLargura &&
          hitbox.x + hitbox.w > corpoX &&
          hitbox.y < corpoY + corpoAltura &&
          hitbox.y + hitbox.h > corpoY;


        if (colisaoChefao) {

          RaioDeFogo.receberDano(this.dano);

          bola.ativa = false;

          console.log(
            "BOLA DE RAIO ATINGIU O CHEFÃO!",
            "Dano:", this.dano,
            "Vida restante:", RaioDeFogo.vida
          );

          continue;
        }
      }


      // Limite de alcance.
      if (
        Math.abs(
          bola.x - bola.inicioX
        ) >= this.alcance
      ) {
        bola.ativa = false;
      }

      // Limites do mundo.
      if (
        typeof Mundo1 !== "undefined" &&
        (
          bola.x < 0 ||
          bola.x > Mundo1.largura
        )
      ) {
        bola.ativa = false;
      }
    }

    // Remover projeteis inativos.
    this.lista = this.lista.filter(
      bola => bola.ativa
    );
  },

  // ==================================
  // DESENHAR FIREBALL
  // ==================================

  desenhar(ctx, cameraX, cameraY) {

    for (const bola of this.lista) {

      const x = bola.x - cameraX;
      const y = bola.y - cameraY;

      const raio = bola.raio;

      ctx.save();

      ctx.globalCompositeOperation =
        "lighter";

      // Rastro eletrico.
      const rastro = ctx.createLinearGradient(
        x - bola.direcao * 35,
        y,
        x,
        y
      );

      rastro.addColorStop(
        0,
        "rgba(59,130,246,0)"
      );

      rastro.addColorStop(
        1,
        "rgba(168,85,247,0.8)"
      );

      ctx.strokeStyle = rastro;
      ctx.lineWidth = 10;
      ctx.lineCap = "round";

      ctx.beginPath();

      ctx.moveTo(
        x - bola.direcao * 20,
        y
      );

      ctx.lineTo(x, y);
      ctx.stroke();

      // Brilho externo.
      const brilho =
        ctx.createRadialGradient(
          x, y, 0,
          x, y, raio * 1.4
        );

      brilho.addColorStop(
        0,
        "rgba(255,255,255,1)"
      );

      brilho.addColorStop(
        0.2,
        "rgba(125,211,252,1)"
      );

      brilho.addColorStop(
        0.5,
        "rgba(168,85,247,0.8)"
      );

      brilho.addColorStop(
        1,
        "rgba(59,130,246,0)"
      );

      ctx.fillStyle = brilho;

      ctx.beginPath();
      ctx.arc(
        x,
        y,
        raio * 1.15,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Nucleo da Fireball.
      ctx.fillStyle = "#ffffff";

      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 18;

      ctx.beginPath();
      ctx.arc(
        x,
        y,
        raio * 1.15,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Faiscas eletricas.
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#c084fc";
      ctx.lineWidth = 2;

      for (let i = 0; i < 5; i++) {

        const angulo =
          performance.now() / 150 +
          i * Math.PI * 2 / 5;

        const x1 =
          x + Math.cos(angulo) * raio;

        const y1 =
          y + Math.sin(angulo) * raio;

        const x2 =
          x + Math.cos(angulo) *
          (raio + 10);

        const y2 =
          y + Math.sin(angulo) *
          (raio + 10);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      ctx.restore();
    }
  }
};
