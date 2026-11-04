
/*
 * CHOQUE NO SISTEMA 2.0
 * Mundo 1 — Avenida Central de Dakota
 * Alencar Game Studio
 *
 * Sistema de cenários com rolagem horizontal
 * e chão visual contínuo.
 */

window.Mundo1 = {

  // CONFIGURAÇÕES DO MUNDO
  largura: 4800,
  altura: 1100,
  gravidade: 0.65,

  // ==========================================
  // MUNDO 1 — CENÁRIO PANORÂMICO NATAL 2026
  // ==========================================

  cenarioCompletoImagem: (() => {
    const imagem = new Image();

    imagem.src =
      "sprites/cenarios/mundo1/mundo1_natal_2026.png";

    return imagem;
  })(),

  // CENÁRIO 2 — DISTRITO COMERCIAL
  distritoComercialImagem: (() => {
    const imagem = new Image();

    imagem.src =
      "sprites/cenarios/mundo1/distrito_comercial.png";

    return imagem;
  })(),


  // ==========================================
  // CENÁRIO 3 — BAIRRO INDUSTRIAL
  // ==========================================

  bairroIndustrialImagem: (() => {

    const imagem = new Image();

    imagem.src =
      "sprites/cenarios/mundo1/bairro_industrial.png";

    return imagem;

  })(),


  // ==========================================
  // CENÁRIO 4 — USINA ELÉTRICA
  // ARENA DO CHEFÃO RAIO DE FOGO
  // ==========================================

  usinaEletricaImagem: (() => {

    const imagem = new Image();

    imagem.src =
      "sprites/cenarios/mundo1/usina_eletrica.png";

    return imagem;

  })(),

  // PLATAFORMA FÍSICA
  plataformas: [
    {
      x: 0,
      y: 1000,
      w: 4800,
      h: 100
    }
  ],

  // ==========================================
  // CONFIGURAÇÃO DOS QUATRO CENÁRIOS
  // ==========================================

  obterCenarios() {

    return [

      // CENÁRIO 1 — AVENIDA CENTRAL
      {
        imagem: this.ceuImagem,
        inicio: 0,
        largura: 1200,
        linhaChao: 0.96,
        ajusteY: 0
      },

      // CENÁRIO 2 — DISTRITO COMERCIAL
      {
        imagem: this.distritoComercialImagem,
        inicio: 1200,
        largura: 1200,
        linhaChao: 0.91,
        ajusteY: 0
      },

      // CENÁRIO 3 — BAIRRO INDUSTRIAL
      {
        imagem: this.bairroIndustrialImagem,
        inicio: 2400,
        largura: 1200,
        linhaChao: 0.87,
        ajusteY: 0
      },

      // CENÁRIO 4 — USINA ELÉTRICA
      // ARENA DO RAIO DE FOGO
      {
        imagem: this.usinaEletricaImagem,
        inicio: 3600,
        largura: 1200,
        linhaChao: 0.87,
        ajusteY: 0
      }

    ];

  },


  // DESENHAR FUNDO NOTURNO
  desenharFundo(ctx) {

    const larguraTela = ctx.canvas.width;
    const alturaTela = ctx.canvas.height;

    const fundo = ctx.createLinearGradient(
      0,
      0,
      0,
      alturaTela
    );

    fundo.addColorStop(0, "#101a46");
    fundo.addColorStop(0.5, "#25356b");
    fundo.addColorStop(1, "#47345f");

    ctx.fillStyle = fundo;

    ctx.fillRect(
      0,
      0,
      larguraTela,
      alturaTela
    );

  },

  // DESENHAR CENÁRIOS
  
  // ==========================================
  // DESENHAR CENÁRIO PANORÂMICO — NATAL 2026
  // ==========================================

  desenharCenarios(ctx, cameraX, cameraY) {

    const imagem = this.cenarioCompletoImagem;

    if (
      !imagem ||
      !imagem.complete ||
      imagem.naturalWidth <= 0 ||
      imagem.naturalHeight <= 0
    ) {
      return;
    }

    // Uma imagem cobre todo o Mundo 1
    const larguraMundo = this.largura; // 4800
    const alturaMundo = this.altura;   // 1100

    // Posição do cenário acompanhando a câmera.
    const x = -cameraX;
    const y = 1000 - cameraY - (alturaMundo * 0.73);

    ctx.drawImage(
      imagem,
      x,
      y,
      larguraMundo,
      alturaMundo
    );

  },


  // DESENHAR CHÃO VISUAL CONTÍNUO
  desenharChao(ctx, cameraX, cameraY) {

    const larguraTela = ctx.canvas.width;
    const alturaTela = ctx.canvas.height;

    // Chão físico permanece em y = 1000.
    // Este ajuste altera somente a aparência.
    const ajusteChaoVisual = 0;

    const chaoY =
      1000 - cameraY - ajusteChaoVisual;

    // Evitar altura negativa
    const alturaConcreto = Math.max(
      0,
      alturaTela - chaoY
    );

    // CONCRETO PRINCIPAL
    ctx.fillStyle = "#344b68";

    ctx.fillRect(
      0,
      chaoY,
      larguraTela,
      alturaConcreto
    );

    // BORDA SUPERIOR DA CALÇADA
    ctx.fillStyle = "#a8c9df";

    ctx.fillRect(
      0,
      chaoY,
      larguraTela,
      5
    );

    // SOMBRA ABAIXO DA BORDA
    ctx.fillStyle = "#20354f";

    ctx.fillRect(
      0,
      chaoY + 5,
      larguraTela,
      7
    );

    // DETALHE HORIZONTAL DO CONCRETO
    ctx.fillStyle = "#587896";

    ctx.fillRect(
      0,
      chaoY + 35,
      larguraTela,
      3
    );

    // DIVISÕES DO CONCRETO
    ctx.strokeStyle = "#263b55";
    ctx.lineWidth = 2;

    const espacamento = 180;

    const primeiroX =
      Math.floor(cameraX / espacamento) *
      espacamento;

    for (
      let mundoX = primeiroX;
      mundoX < cameraX + larguraTela;
      mundoX += espacamento
    ) {

      const telaX = mundoX - cameraX;

      ctx.beginPath();

      ctx.moveTo(
        telaX,
        chaoY + 5
      );

      ctx.lineTo(
        telaX,
        alturaTela
      );

      ctx.stroke();

    }

    // FAIXA INFERIOR DA RUA
    ctx.fillStyle = "#1c3048";

    ctx.fillRect(
      0,
      chaoY + 95,
      larguraTela,
      Math.max(0, alturaTela - chaoY - 95)
    );

    // LINHA LUMINOSA DA RUA
    ctx.fillStyle = "#6cb6cf";

    ctx.fillRect(
      0,
      chaoY + 100,
      larguraTela,
      3
    );

  },

  // DESENHAR MUNDO COMPLETO
  desenhar(ctx, cameraX = 0, cameraY = 0) {

    // 1 — Fundo noturno
    this.desenharFundo(ctx);

    // 2 — Prédios e cenários
    this.desenharCenarios(
      ctx,
      cameraX,
      cameraY
    );

    // 3 — Rua contínua
    //this.desenharChao(
     // ctx,
      //cameraX,
      //cameraY
    //);

  },

  // RETORNAR PLATAFORMAS
  obterPlataformas() {

    return this.plataformas;

  }

};


// ESCADAS DO MUNDO 1
Mundo1.escadas = [];


// DESENHAR ESCADAS
Mundo1.desenharEscadas = function(
  ctx,
  cameraX,
  cameraY
) {

  ctx.save();

  ctx.translate(
    -cameraX,
    -cameraY
  );

  this.escadas.forEach(escada => {

    ctx.fillStyle = "#a4b8c7";

    // Lado esquerdo
    ctx.fillRect(
      escada.x,
      escada.y,
      5,
      escada.h
    );

    // Lado direito
    ctx.fillRect(
      escada.x + escada.w - 5,
      escada.y,
      5,
      escada.h
    );

    // Degraus
    for (
      let y = escada.y + 12;
      y < escada.y + escada.h;
      y += 20
    ) {

      ctx.fillStyle = "#e2b86b";

      ctx.fillRect(
        escada.x,
        y,
        escada.w,
        5
      );

    }

  });

  ctx.restore();

};
