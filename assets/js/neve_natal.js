
/*
 * CHOQUE NO SISTEMA REMAKE
 * EDIÇÃO DE NATAL 2026
 * Sistema de neve animada
 * Alencar Game Studio
 */

window.NeveNatal = {

  flocos: [],
  quantidade: 65,
  largura: 960,
  altura: 540,

  iniciar(largura = 960, altura = 540) {
    this.largura = largura;
    this.altura = altura;
    this.flocos = [];

    for (let i = 0; i < this.quantidade; i++) {
      this.flocos.push({
        x: Math.random() * largura,
        y: Math.random() * altura,
        raio: 1 + Math.random() * 2,
        velocidade: 0.3 + Math.random() * 0.9,
        vento: 0.1 + Math.random() * 0.3
      });
    }
  },

  
    atualizar(dt = 16.67) {
        const fator = Math.min(dt, 50) / 16.67;
        const tempo = performance.now() * 0.001;

        for (const floco of this.flocos) {

            // Queda suave
            floco.y += floco.velocidade * fator;

            // Vento variável e movimento lateral
            const ventoNatural =
            Math.sin(tempo * 0.8) * 0.5;

            const oscilacao =
            Math.sin(tempo * 2 + floco.y * 0.02) * 0.25;

            floco.x +=
            (floco.vento + ventoNatural + oscilacao) * fator;

            // Reaparecer no topo
            if (floco.y > this.altura + 5) {
            floco.y = -5;
            floco.x = Math.random() * this.largura;
            }

            // Reaparecer nas laterais
            if (floco.x > this.largura + 5) {
            floco.x = -5;
            }

            if (floco.x < -5) {
            floco.x = this.largura + 5;
            }
        }
    },


  desenhar(ctx) {
    ctx.save();

    ctx.fillStyle = "rgba(255,255,255,0.85)";

    for (const floco of this.flocos) {
      ctx.beginPath();
      ctx.arc(
        floco.x,
        floco.y,
        floco.raio,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.restore();
  }

};
