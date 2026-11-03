
/*
 * CHOQUE NO SISTEMA 2.0
 * SISTEMA DE COMBATE E COMBOS ELETRICOS
 * ALENCAR GAME STUDIO
 *
 * Versao 10.11.2
 *
 * COMBO:
 * Golpe 1: 10 HP
 * Golpe 2: 15 HP
 * Golpe 3: 25 HP
 *
 * FIREBALL:
 * 20 HP - controlada por projeteis.js
 */

window.Combate = {

  // ==========================================
  // CONFIGURACOES DE DANO
  // ==========================================

  danoAtaque1: 10,
  danoAtaque2: 20,

  danosCombo: [
    10,
    15,
    25
  ],

  alcancesCombo: [
    18,
    20,
    24
  ],

  mostrarHitbox: false,

  // ==========================================
  // OBTER HITBOX DO ATAQUE
  // ==========================================

  obterHitbox(jogador, animacoes) {

    if (!animacoes.atacando) {
      return null;
    }

    const tipo = animacoes.tipoAtaque;
    const frame = animacoes.frame;

    // Fireball utiliza projeteis.js.
    if (tipo !== "attack") {
      return null;
    }

    // O impacto acontece nos frames
    // attack_05 e attack_06.
    if (frame < 4 || frame > 5) {
      return null;
    }

    // Identificar a etapa do combo.
    const etapa = Math.max(
      1,
      Math.min(
        3,
        animacoes.comboEtapa || 1
      )
    );

    const dano =
      this.danosCombo[etapa - 1];

    const alcance =
      this.alcancesCombo[etapa - 1];

    const altura = 30;

    const direcao =
      animacoes.direcao === -1 ? -1 : 1;

    // Posicionar a hitbox na frente
    // do protagonista.
    const x =
      direcao === 1
        ? jogador.x + jogador.largura
        : jogador.x - alcance;

    const y = jogador.y + 12;

    return {
      x: x,
      y: y,
      w: alcance,
      h: altura,

      dano: dano,
      comboEtapa: etapa,

      idGolpe: animacoes.idGolpe,
      direcao: direcao
    };
  },

  // ==========================================
  // VERIFICAR COLISAO
  // ==========================================

  colidiu(a, b) {

    if (!a || !b) {
      return false;
    }

    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  },

  // ==========================================
  // DESENHAR RAIO ELETRICO
  // ==========================================

  desenharRaio(
    ctx,
    inicioX,
    inicioY,
    fimX,
    fimY,
    cor,
    espessura,
    segmentos = 7
  ) {

    const pontos = [];

    const dx = fimX - inicioX;
    const dy = fimY - inicioY;

    const comprimento =
      Math.hypot(dx, dy) || 1;

    const normalX = -dy / comprimento;
    const normalY = dx / comprimento;

    for (
      let i = 0;
      i <= segmentos;
      i++
    ) {

      const t = i / segmentos;

      const desvio =
        i === 0 || i === segmentos
          ? 0
          : (Math.random() - 0.5) * 18;

      pontos.push({

        x:
          inicioX +
          dx * t +
          normalX * desvio,

        y:
          inicioY +
          dy * t +
          normalY * desvio
      });
    }

    ctx.save();

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Brilho externo.
    ctx.beginPath();

    pontos.forEach((ponto, i) => {

      if (i === 0) {

        ctx.moveTo(
          ponto.x,
          ponto.y
        );

      } else {

        ctx.lineTo(
          ponto.x,
          ponto.y
        );
      }
    });

    ctx.strokeStyle = cor;
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = espessura * 4;
    ctx.stroke();

    // Raio principal.
    ctx.globalAlpha = 1;
    ctx.lineWidth = espessura;

    ctx.shadowColor = cor;
    ctx.shadowBlur = 16;

    ctx.strokeStyle = cor;
    ctx.stroke();

    // Centro branco.
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#ffffff";

    ctx.lineWidth = Math.max(
      1,
      espessura * 0.3
    );

    ctx.stroke();

    ctx.restore();
  },

  // ==========================================
  // DESENHAR FAISCAS
  // ==========================================

  desenharFaiscas(
    ctx,
    x,
    y,
    quantidade,
    cor,
    raio = 18
  ) {

    ctx.save();

    ctx.strokeStyle = cor;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    for (
      let i = 0;
      i < quantidade;
      i++
    ) {

      const angulo =
        Math.random() * Math.PI * 2;

      const distancia =
        Math.random() * raio;

      const px =
        x + Math.cos(angulo) * distancia;

      const py =
        y + Math.sin(angulo) * distancia;

      const tamanho =
        3 + Math.random() * 8;

      ctx.beginPath();

      ctx.moveTo(px, py);

      ctx.lineTo(
        px + Math.cos(angulo) * tamanho,
        py + Math.sin(angulo) * tamanho
      );

      ctx.stroke();
    }

    ctx.restore();
  },

  // ==========================================
  // DESENHAR EFEITO ELETRICO DO COMBO
  // ==========================================

  desenharEfeitoEletrico(
    ctx,
    jogador,
    animacoes,
    cameraX,
    cameraY
  ) {

    if (!animacoes.atacando) {
      return;
    }

    const tipo = animacoes.tipoAtaque;

    if (
      tipo !== "attack" &&
      tipo !== "attack_02"
    ) {
      return;
    }

    // Sincronizar com o soco.
    if (
      tipo === "attack" &&
      (animacoes.frame < 4 ||
       animacoes.frame > 5)
    ) {
      return;
    }

    // Manter compatibilidade com
    // a animacao da Fireball.
    if (
      tipo === "attack_02" &&
      (animacoes.frame < 2 ||
       animacoes.frame > 4)
    ) {
      return;
    }

    const forte =
      tipo === "attack_02";

    const etapa = forte
      ? 1
      : Math.max(
          1,
          Math.min(
            3,
            animacoes.comboEtapa || 1
          )
        );

    const direcao =
      animacoes.direcao === -1 ? -1 : 1;

    const alcance = forte
      ? 75
      : this.alcancesCombo[etapa - 1];

    // Posicao aproximada da mao,
    // considerando sprite de 110x110.
    const origemX =
      jogador.x +
      jogador.largura / 2 +
      direcao * 48 -
      cameraX;

    const origemY =
      jogador.y +
      jogador.altura -
      110 +
      14 +
      110 * 0.38 -
      cameraY;

    const destinoX =
      origemX +
      direcao * Math.max(
        8,
        alcance - 48
      );

    const destinoY =
      origemY +
      (Math.random() - 0.5) * 12;

    // Cores diferentes para os combos.
    let cor = "#38bdf8";

    if (etapa === 2) {
      cor = "#60a5fa";
    }

    if (etapa === 3) {
      cor = "#a855f7";
    }

    if (forte) {
      cor = "#a855f7";
    }

    const espessura = forte
      ? 5
      : etapa === 3
        ? 5
        : etapa === 2
          ? 4
          : 3;

    ctx.save();

    ctx.globalCompositeOperation = "lighter";

    // Raio principal.
    this.desenharRaio(
      ctx,
      origemX,
      origemY,
      destinoX,
      destinoY,
      cor,
      espessura,
      forte ? 10 : 7
    );

    // Descargas adicionais no
    // terceiro golpe ou Fireball.
    if (forte || etapa === 3) {

      this.desenharRaio(
        ctx,
        origemX,
        origemY - 7,
        destinoX - direcao * 7,
        destinoY - 17,
        "#38bdf8",
        2,
        8
      );

      this.desenharRaio(
        ctx,
        origemX,
        origemY + 7,
        destinoX - direcao * 10,
        destinoY + 18,
        "#c084fc",
        2,
        8
      );
    }

    // Faiscas na mao.
    this.desenharFaiscas(
      ctx,
      origemX,
      origemY,
      forte ? 8 : etapa * 4,
      cor,
      forte ? 18 : 10 + etapa * 3
    );

    // Faiscas no impacto.
    this.desenharFaiscas(
      ctx,
      destinoX,
      destinoY,
      forte ? 14 : etapa * 5 + 2,
      etapa === 3
        ? "#c084fc"
        : "#7dd3fc",
      forte ? 25 : 12 + etapa * 4
    );

    // ======================================
    // BRILHO DO IMPACTO
    // ======================================

    const raioFlash = forte
      ? 12
      : etapa === 3
        ? 14
        : etapa === 2
          ? 10
          : 7;

    const gradiente =
      ctx.createRadialGradient(
        destinoX,
        destinoY,
        0,
        destinoX,
        destinoY,
        raioFlash * 2
      );

    gradiente.addColorStop(
      0,
      "rgba(255,255,255,0.9)"
    );

    gradiente.addColorStop(
      0.35,
      forte || etapa === 3
        ? "rgba(168,85,247,0.6)"
        : "rgba(56,189,248,0.6)"
    );

    gradiente.addColorStop(
      1,
      "rgba(0,0,0,0)"
    );

    ctx.fillStyle = gradiente;

    ctx.beginPath();

    ctx.arc(
      destinoX,
      destinoY,
      raioFlash * 2,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
  },

  // ==========================================
  // DESENHAR HITBOX DE TESTE
  // ==========================================

  desenharHitbox(
    ctx,
    hitbox,
    cameraX,
    cameraY
  ) {

    if (
      !hitbox ||
      !this.mostrarHitbox
    ) {
      return;
    }

    ctx.save();

    ctx.fillStyle =
      "rgba(255,60,60,0.25)";

    ctx.strokeStyle = "#ff4444";
    ctx.lineWidth = 2;

    ctx.fillRect(
      hitbox.x - cameraX,
      hitbox.y - cameraY,
      hitbox.w,
      hitbox.h
    );

    ctx.strokeRect(
      hitbox.x - cameraX,
      hitbox.y - cameraY,
      hitbox.w,
      hitbox.h
    );

    ctx.restore();
  }
};
