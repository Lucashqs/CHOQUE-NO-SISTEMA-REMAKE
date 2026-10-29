
/*
 * CHOQUE NO SISTEMA 2.0
 * ALENCAR GAME STUDIO
 * ARENAS COM BARREIRAS ELETRICAS
 *
 * Configuracao para 19 Saqueadores,
 * apos remover o inimigo inicial.
 */

window.Arenas = {

  ativa: null,
  tempo: 0,

  areas: [
    { id: 1, inicio: 260, fim: 600, primeiro: 0, quantidade: 2 },
    { id: 2, inicio: 650, fim: 1050, primeiro: 2, quantidade: 2 },
    { id: 3, inicio: 1090, fim: 1500, primeiro: 4, quantidade: 2 },
    { id: 4, inicio: 1540, fim: 1940, primeiro: 6, quantidade: 2 },
    { id: 5, inicio: 1970, fim: 3010, primeiro: 8, quantidade: 5 },
    { id: 6, inicio: 3020, fim: 3790, primeiro: 13, quantidade: 3 },
    { id: 7, inicio: 3810, fim: 4750, primeiro: 16, quantidade: 3 }
  ],

  iniciar() {

    this.ativa = null;
    this.tempo = 0;

    for (const area of this.areas) {
      area.iniciada = false;
      area.concluida = false;
    }

    // Todas as arenas começam bloqueadas.
    if (window.Inimigos) {
      for (const npc of Inimigos.lista) {
        npc.liberado = false;
      }
    }
  },

  inimigosDaArea(area) {

    if (!window.Inimigos) return [];

    return Inimigos.lista.slice(
      area.primeiro,
      area.primeiro + area.quantidade
    );
  },

  iniciarArea(area) {

    if (area.iniciada || area.concluida) return;

    area.iniciada = true;
    this.ativa = area;

    const inimigos = this.inimigosDaArea(area);

    // Libera o primeiro inimigo da arena.
    if (inimigos.length > 0) {
      inimigos[0].liberado = true;
    }

    console.log("ARENA INICIADA:", area.id);
  },

  atualizar(jogador, dt = 16.67) {

    this.tempo += dt;

    if (!window.Inimigos || !jogador) return;

    // Detectar entrada em uma nova arena.
    if (!this.ativa) {

      const centro =
        jogador.x + jogador.largura / 2;

      for (const area of this.areas) {

        if (area.concluida) continue;

        if (
          centro >= area.inicio + 20 &&
          centro <= area.fim - 20
        ) {
          this.iniciarArea(area);
          break;
        }
      }
    }

    if (!this.ativa) return;

    const area = this.ativa;
    const inimigos = this.inimigosDaArea(area);

    // Contar inimigos cuja vida chegou a zero.
    const derrotados = inimigos.filter(
      npc => npc.vida <= 0 || npc.derrotado
    ).length;

    // Liberar mais um por derrota.
    const quantidadeLiberada = Math.min(
      inimigos.length,
      1 + derrotados
    );

    for (let i = 0; i < quantidadeLiberada; i++) {
      inimigos[i].liberado = true;
    }

    // Abrir as barreiras quando todos morrerem.
    if (
      inimigos.length > 0 &&
      derrotados === inimigos.length
    ) {

      area.concluida = true;
      this.ativa = null;

      console.log("ARENA CONCLUIDA:", area.id);
    }
  },

  // Impede atravessar as barreiras.
  limitarJogador(jogador) {

    if (!this.ativa || !jogador) return;

    const area = this.ativa;

    const limiteEsquerdo = area.inicio + 12;

    const limiteDireito =
      area.fim - 12 - jogador.largura;

    jogador.x = Math.max(
      limiteEsquerdo,
      Math.min(jogador.x, limiteDireito)
    );

    // Impedir velocidade horizontal residual
    // quando o personagem encostar na barreira.
    if (
      jogador.x <= limiteEsquerdo &&
      jogador.vx < 0
    ) {
      jogador.vx = 0;
    }

    if (
      jogador.x >= limiteDireito &&
      jogador.vx > 0
    ) {
      jogador.vx = 0;
    }
  },

  desenhar(ctx, cameraX = 0, cameraY = 0) {

    if (!this.ativa) return;

    const area = this.ativa;

    const alturaMundo =
      window.Mundo1?.altura || 1100;

    const oscilacao =
      Math.sin(this.tempo * 0.012);

    const paredes = [
      area.inicio,
      area.fim
    ];

    ctx.save();

    for (const posicao of paredes) {

      const x = posicao - cameraX;
      const y = -cameraY;

      // Não desenhar barreiras fora da câmera.
      if (
        x < -30 ||
        x > ctx.canvas.width + 30
      ) {
        continue;
      }

      const largura = 12;

      // Brilho externo.
      ctx.shadowColor = "#ff1538";
      ctx.shadowBlur = 20 + oscilacao * 8;

      ctx.fillStyle = "rgba(255, 0, 35, 0.35)";

      ctx.fillRect(
        x - 8,
        y,
        largura + 16,
        alturaMundo
      );

      // Parede central.
      ctx.fillStyle = "#ff173b";

      ctx.fillRect(
        x,
        y,
        largura,
        alturaMundo
      );

      // Núcleo luminoso.
      ctx.fillStyle = "#ffe3e7";

      ctx.fillRect(
        x + 4,
        y,
        4,
        alturaMundo
      );

      // Faixas elétricas animadas.
      ctx.strokeStyle = "#ffb4bf";
      ctx.lineWidth = 2;

      ctx.beginPath();

      for (let i = 0; i < alturaMundo; i += 28) {

        const deslocamento =
          Math.sin(
            this.tempo * 0.02 + i * 0.1
          ) * 6;

        ctx.moveTo(
          x + 6,
          y + i
        );

        ctx.lineTo(
          x + 6 + deslocamento,
          y + i + 14
        );
      }

      ctx.stroke();
    }

    ctx.restore();

    // Indicador no alto da tela.
    const inimigos = this.inimigosDaArea(area);

    const derrotados = inimigos.filter(
      npc => npc.vida <= 0 || npc.derrotado
    ).length;

    ctx.save();

    ctx.fillStyle = "rgba(20, 10, 20, 0.8)";

    ctx.fillRect(
      ctx.canvas.width / 2 - 115,
      12,
      230,
      35
    );

    ctx.strokeStyle = "#ff334c";
    ctx.lineWidth = 2;

    ctx.strokeRect(
      ctx.canvas.width / 2 - 115,
      12,
      230,
      35
    );

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
      `AREA ${area.id} - ${derrotados}/${inimigos.length}`,
      ctx.canvas.width / 2,
      35
    );

    ctx.restore();
  }

};
