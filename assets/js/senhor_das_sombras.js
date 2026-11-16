
/*
 CHOQUE NO SISTEMA REMAKE
 MUNDO 2 — SENHOR DAS SOMBRAS
 ALENCAR GAME STUDIO
*/

window.SenhorDasSombras = (() => {
    "use strict";

    const BASE =
    "/assets/sprites/chefoes/senhor_das_sombras/animations/";

    // =====================================
    // CARREGAR SPRITES
    // =====================================

    function carregar(caminhos) {
        return caminhos.map(caminho => {
            const imagem = new Image();

            imagem.src = BASE + caminho;

            imagem.onerror = () => {
                console.warn(
                    "Sprite não encontrada:",
                    imagem.src
                );
            };

            return imagem;
        });
    }

    // CROSS PUNCH — 6 FRAMES

    const soco = carregar(
        Array.from({ length: 6 }, (_, i) =>
            `Cross_Punch/east/frame_${String(i).padStart(3, "0")}.png`
        )
    );

    // TENTÁCULOS DAS SOMBRAS — 16 FRAMES

    const tentaculos = carregar(
        Array.from({ length: 16 }, (_, i) =>
            `Tentaculos_Sombras/tentaculos_sombras_${String(i + 1).padStart(2, "0")}.png`
        )
    );


    // =====================================
    // CONFIGURAÇÕES DO CHEFÃO
    // =====================================

    const chefe = {
        x: 4280,
        y: 800,

        largura: 72,
        altura: 110,


        vida: 300,
        vidaMaxima: 300,

        ativo: false,
        derrotado: false,

        direcao: -1,

        estado: "parado",

        frame: 0,
        tempoFrame: 0,

        espera: 900,
        acertou: false,

        ultimoGolpe: null
    };

    // =====================================
    // COLISÕES
    // =====================================

    function colide(a, b) {
        return (
            a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y < b.y + b.h &&
            a.y + a.h > b.y
        );
    }

    function hitHeroi(heroi) {
        return {
            x: heroi.x,
            y: heroi.y,
            w: heroi.largura,
            h: heroi.altura
        };
    }

    // =====================================
    // INICIAR ATAQUE
    // =====================================

    function iniciarAtaque(tipo) {
        chefe.estado = tipo;
        chefe.frame = 0;
        chefe.tempoFrame = 0;
        chefe.acertou = false;
    }

    // =====================================
    // INTELIGÊNCIA ARTIFICIAL
    // =====================================

    function atualizar(dt, heroi, vidaHeroi) {

        if (
            chefe.derrotado ||
            !heroi ||
            !vidaHeroi
        ) {
            return;
        }

        // Ativar somente na Área 4

        if (
            heroi.x < 3600 ||
            vidaHeroi.valor <= 0
        ) {
            return;
        }

        chefe.ativo = true;

        const distancia =
            (heroi.x + heroi.largura / 2) -
            (chefe.x + 70);

        chefe.direcao =
            distancia < 0 ? -1 : 1;

        // =================================
        // ESCOLHER ATAQUE
        // =================================

        if (chefe.estado === "parado") {

            chefe.espera -= dt;

            if (chefe.espera > 0) {
                return;
            }

            const abs = Math.abs(distancia);

            if (abs > 500) {

                chefe.x +=
                    Math.sign(distancia) *
                    Math.min(
                        1.6 * dt / 16.6667,
                        abs - 470
                    );

                chefe.x = Math.max(
                    3650,
                    Math.min(4600, chefe.x)
                );

                chefe.espera = 80;

            } else if (abs < 120) {

                iniciarAtaque("soco");

            } else {

                iniciarAtaque("tentaculos");

            }

            return;
        }

        // =================================
        // ATUALIZAR ANIMAÇÃO
        // =================================

        const atacandoSoco =
            chefe.estado === "soco";

        const total =
            atacandoSoco ? 6 : 16;

        const msFrame =
            atacandoSoco ? 105 : 85;

        chefe.tempoFrame += dt;

        while (
            chefe.tempoFrame >= msFrame &&
            chefe.estado !== "parado"
        ) {

            chefe.tempoFrame -= msFrame;

            chefe.frame++;

            if (chefe.frame >= total) {

                chefe.estado = "parado";
                chefe.frame = 0;
                chefe.espera = 950;

            }
        }

        if (
            chefe.estado === "parado" ||
            chefe.acertou ||
            vidaHeroi.tempoDano > 0
        ) {
            return;
        }

        // =================================
        // DANO DOS ATAQUES
        // =================================

        let golpe = null;

        if (
            atacandoSoco &&
            chefe.frame >= 2 &&
            chefe.frame <= 4
        ) {

            golpe = {
                x: chefe.direcao === 1
                    ? chefe.x + 105
                    : chefe.x - 55,

                y: chefe.y + 55,
                w: 70,
                h: 80
            };

        } else if (
            !atacandoSoco &&
            chefe.frame >= 3 &&
            chefe.frame <= 13
        ) {

            // Tentáculos crescem e retornam

            const alcance = [
                0, 0, 0, 90,
                160, 240, 330, 420,
                500, 500, 420, 330,
                230, 130, 0, 0
            ][chefe.frame];

            golpe = {
                x: chefe.direcao === 1
                    ? chefe.x + 110
                    : chefe.x + 45 - alcance,

                y: chefe.y + 35,
                w: alcance,
                h: 125
            };
        }

        if (
            golpe &&
            colide(golpe, hitHeroi(heroi))
        ) {

            const dano =
                atacandoSoco ? 20 : 25;

            vidaHeroi.valor = Math.max(
                0,
                vidaHeroi.valor - dano
            );

            vidaHeroi.tempoDano = 750;

            chefe.acertou = true;
        }
    }

    // =====================================
    // RECEBER DANO DO HERÓI
    // =====================================

    function receberAtaque(hitbox, idGolpe) {

        if (
            !chefe.ativo ||
            chefe.derrotado ||
            !hitbox
        ) {
            return;
        }

        const corpo = {
            x: chefe.x + 30,
            y: chefe.y + 15,
            w: 90,
            h: 160
        };

        const golpe = {
            x: hitbox.x,
            y: hitbox.y,
            w: hitbox.w ?? hitbox.largura ?? 0,
            h: hitbox.h ?? hitbox.altura ?? 0
        };

        if (
            !colide(corpo, golpe) ||
            idGolpe === chefe.ultimoGolpe
        ) {
            return;
        }

        chefe.ultimoGolpe = idGolpe;

        chefe.vida = Math.max(
            0,
            chefe.vida - 20
        );

        if (chefe.vida === 0) {
            chefe.derrotado = true;
            chefe.estado = "parado";
        }
    }

    // =====================================
    // DESENHAR CHEFÃO
    // =====================================

    function desenhar(ctx, cameraX, cameraY) {
        console.log(
            "CHEFÃO:",
            "ativo =", chefe.ativo,
            "x =", chefe.x,
            "y =", chefe.y,
            "estado =", chefe.estado
        );

        if (
            !chefe.ativo ||
            chefe.derrotado
        ) {
            return;
        }

        const lista =
            chefe.estado === "soco"
                ? soco
                : tentaculos;

        const img =
            lista[chefe.frame] || lista[0];

        const largura =
            chefe.estado === "soco"
                ? 110
                : 574;

        const px = chefe.x - cameraX;
        const py = chefe.y - cameraY;

  
        ctx.save();

        ctx.imageSmoothingEnabled = false;

        if (chefe.direcao === -1) {

            ctx.translate(px + 72, 0);
            ctx.scale(-1, 1);

            if (
                img.complete &&
                img.naturalWidth > 0
            ) {
                ctx.drawImage(
                    img,
                    0,
                    py,
                    largura,
                    110
                );
            }

        } else if (
            img.complete &&
            img.naturalWidth > 0
        ) {

            ctx.drawImage(
                img,
                px,
                py,
                largura,
                110
            );
        }

        ctx.restore();

        // =================================
        // BARRA DE VIDA DO CHEFÃO
        // =================================

        const bw = 240;

        const bx = Math.max(
            8,
            (ctx.canvas.width - bw) / 2
        );

        ctx.fillStyle =
            "rgba(0,0,0,0.8)";

        ctx.fillRect(
            bx - 5,
            12,
            bw + 10,
            40
        );

        ctx.fillStyle = "#ffffff";

        ctx.font = "bold 14px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            "SENHOR DAS SOMBRAS",
            ctx.canvas.width / 2,
            27
        );

        ctx.fillStyle = "#40124f";

        ctx.fillRect(
            bx,
            34,
            bw,
            12
        );

        ctx.fillStyle = "#b44cff";

        ctx.fillRect(
            bx,
            34,
            bw * chefe.vida / chefe.vidaMaxima,
            12
        );
    }

    // =====================================
    // EXPORTAR SISTEMA
    // =====================================

    return {
        chefe,
        atualizar,
        desenhar,
        receberAtaque
    };

})();
