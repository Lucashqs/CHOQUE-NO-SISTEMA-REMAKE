
// =====================================
// CHOQUE NO SISTEMA REMAKE
// ABERTURA ANIMADA - CENA 1
// =====================================

const canvas = document.getElementById("canvasAbertura");
const ctx = canvas.getContext("2d");

const btnIniciar = document.getElementById("btnIniciar");
const btnPular = document.getElementById("btnPular");

const cidade = new Image();
cidade.src = "assets/cidade.png";


const heroi = new Image();
heroi.src = "assets/heroi_idle.png";


const assassino = new Image();
assassino.src = "assets/assassino_idle.png";


const senhorSombras = new Image();
senhorSombras.src = "assets/senhor_sombras_idle.png";


const logoChoque = new Image();
logoChoque.src = "assets/logo_choque.png";

const logoAlencar = new Image();
logoAlencar.src = "assets/logo_alencar.png";



const musicaAbertura = new Audio("assets/musica_abertura.mp3");

musicaAbertura.preload = "auto";
musicaAbertura.volume = 0.8;


// CONFIGURAÇÕES
const DURACAO_CENA = 60000;
const LARGURA = canvas.width;
const ALTURA = canvas.height;

let aberturaIniciada = false;
let inicioCena = 0;
let idAnimacao = null;

// CRIAR GOTAS DE CHUVA
const gotas = [];

for (let i = 0; i < 180; i++) {
    gotas.push({
        x: Math.random() * LARGURA,
        y: Math.random() * ALTURA,
        velocidade: 180 + Math.random() * 300,
        tamanho: 6 + Math.random() * 12
    });
}

// DESENHAR CIDADE COM ZOOM
function desenharCidade(progresso) {

    const zoom = 1 + progresso * 0.12;

    const largura = LARGURA * zoom;
    const altura = ALTURA * zoom;

    const x = (LARGURA - largura) / 2;
    const y = (ALTURA - altura) / 2;

    ctx.drawImage(cidade, x, y, largura, altura);
}

// DESENHAR CHUVA
function desenharChuva(delta) {

    ctx.strokeStyle = "rgba(150, 200, 255, 0.45)";
    ctx.lineWidth = 1.5;

    ctx.beginPath();

    gotas.forEach(gota => {

        ctx.moveTo(gota.x, gota.y);
        ctx.lineTo(gota.x - 3, gota.y + gota.tamanho);

        gota.y += gota.velocidade * delta;
        gota.x -= 40 * delta;

        if (gota.y > ALTURA || gota.x < -10) {
            gota.y = -20;
            gota.x = Math.random() * (LARGURA + 40);
        }
    });

    ctx.stroke();
}

// RELÂMPAGOS
function desenharRelampago(tempo) {

    const momentos = [2300, 5100, 7800];

    for (const momento of momentos) {

        const diferenca = tempo - momento;

        if (diferenca >= 0 && diferenca < 180) {

            const intensidade =
                diferenca < 80 ? 0.35 : 0.12;

            ctx.fillStyle =
                `rgba(140, 200, 255, ${intensidade})`;

            ctx.fillRect(0, 0, LARGURA, ALTURA);

            break;
        }
    }
}


// =====================================
// CENA 2 - HERÓI NO TOPO DO PRÉDIO
// ================================ =====

function desenharHeroi(tempo) {

    if (!heroi.complete || heroi.naturalWidth === 0) {
        return;
    }

    // Tempo relativo à segunda cena
    const tempoCena = tempo - 10000;

    // Animação de respiração
    const respiracao = Math.sin(tempoCena / 350) * 3;

    // Tamanho do herói
    const larguraHeroi = 120;
    const alturaHeroi = 160;

    // Posição do herói
    const x = LARGURA * 0.68;
    const y = 310 + respiracao;


    
    // AURA ELÉTRICA DO HERÓI
    if (tempoCena >= 6000) {

        const forca = Math.min(
            (tempoCena - 6000) / 1000,
            1
        );

        const pulso = Math.sin(tempoCena / 120) * 8;

        const centroX = x + larguraHeroi / 2;
        const centroY = y + alturaHeroi / 2;

        const raio = 90 + pulso;

        const aura = ctx.createRadialGradient(
            centroX, centroY, 10,
            centroX, centroY, raio
        );

        aura.addColorStop(
            0,
            `rgba(0, 180, 255, ${0.45 * forca})`
        );

        aura.addColorStop(
            1,
            "rgba(0, 100, 255, 0)"
        );

        ctx.fillStyle = aura;

        ctx.beginPath();
        ctx.arc(
            centroX,
            centroY,
            raio,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }


    // Desenhar o herói
    ctx.drawImage(
        heroi,
        x,
        y,
        larguraHeroi,
        alturaHeroi
    );

    // Eletricidade começa após 13 segundos
    if (tempoCena >= 3000) {
        desenharEletricidade(
            x,
            y,
            larguraHeroi,
            alturaHeroi,
            tempoCena
        );
    }
}


// =====================================
// ELETRICIDADE AZUL DO HERÓI
// =====================================

function desenharEletricidade(x, y, largura, altura, tempo) {

    const intensidade = Math.min(
        (tempo - 3000) / 1500,
        1
    );

    const maos = [
        { x: x + 15, y: y + altura * 0.55 },
        { x: x + largura - 15, y: y + altura * 0.55 }
    ];

    maos.forEach(mao => {

        for (let i = 0; i < 4; i++) {

            const angulo =
                (i / 4) * Math.PI * 2 + tempo / 300;

            const distancia = 12 + Math.random() * 25;

            const destinoX =
                mao.x + Math.cos(angulo) * distancia;

            const destinoY =
                mao.y + Math.sin(angulo) * distancia;

            ctx.beginPath();

            ctx.moveTo(mao.x, mao.y);

            ctx.lineTo(
                (mao.x + destinoX) / 2 + Math.random() * 10,
                (mao.y + destinoY) / 2 - Math.random() * 10
            );

            ctx.lineTo(destinoX, destinoY);

            ctx.strokeStyle =
                `rgba(50, 190, 255, ${intensidade})`;

            ctx.lineWidth = 2 + Math.random() * 2;

            ctx.shadowColor = "#00bfff";
            ctx.shadowBlur = 12;

            ctx.stroke();
        }
    });

    ctx.shadowBlur = 0;
}


// =====================================
// EXPLOSÃO ELÉTRICA CINEMATOGRÁFICA
// =====================================

function desenharExplosaoEletrica(tempo) {

    // Começa aos 18 segundos
    const tempoExplosao = tempo - 18000;

    if (tempoExplosao < 0 || tempoExplosao > 2000) {
        return;
    }

    // Posição central da explosão
    const centroX = LARGURA * 0.68 + 60;
    const centroY = 310 + 80;

    // Intensidade progressiva
    const progresso = tempoExplosao / 2000;

    // Onda elétrica circular
    const raio = 20 + progresso * 350;

    ctx.save();

    ctx.beginPath();

    ctx.arc(
        centroX,
        centroY,
        raio,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle =
        `rgba(0, 200, 255, ${1 - progresso})`;

    ctx.lineWidth = 8;

    ctx.shadowColor = "#00ccff";
    ctx.shadowBlur = 30;

    ctx.stroke();

    // Raios elétricos
    for (let i = 0; i < 16; i++) {

        const angulo = (i / 16) * Math.PI * 2;

        const distancia = raio * 0.9;

        const xFinal =
            centroX + Math.cos(angulo) * distancia;

        const yFinal =
            centroY + Math.sin(angulo) * distancia;

        ctx.beginPath();

        ctx.moveTo(centroX, centroY);

        ctx.lineTo(
            centroX + Math.cos(angulo) * distancia * 0.5
                + Math.random() * 25,
            centroY + Math.sin(angulo) * distancia * 0.5
                - Math.random() * 25
        );

        ctx.lineTo(xFinal, yFinal);

        ctx.strokeStyle =
            `rgba(100, 220, 255, ${1 - progresso})`;

        ctx.lineWidth = 2 + Math.random() * 3;

        ctx.stroke();
    }

    ctx.restore();
}


// =====================================
// CENA 3 - ASSASSINOS DAS SOMBRAS
// =====================================

function desenharAssassinos(tempo) {

    if (!assassino.complete || assassino.naturalWidth === 0) {
        return;
    }

    const tempoCena = Math.max(0, tempo - 20000);
    const progresso = Math.min(tempoCena / 5000, 1);

    const largura = 110;
    const altura = 150;
    const y = 320 + Math.sin(tempoCena / 130) * 3;

    // Primeiro assassino: entra pela esquerda
    const x1 = -120 + progresso * 350;

    // Segundo assassino: entra pela direita
    const x2 = 1100;

    // Assassino 1
    
    if (tempo < 28000){

        ctx.drawImage(

            assassino,
            x1,
            y,
            largura,
            altura
        );
    }

    // Assassino 2, espelhado

    // SEGUNDO ASSASSINO - 30 A 33 SEGUNDOS
    if (tempo >= 30000 && tempo < 34000) {

        const progresso2 = Math.min(
            (tempo - 30000) / 2000,
            1
        );


        // Posição normal do segundo assassino
        const posicaoNormal = -120 + progresso2 * 560;

        // Recuo ao receber a descarga elétrica
        let recuo = 0;

        if (tempo >= 33800) {
            const progressoImpacto = Math.min(
                (tempo - 33800) / 200,
                1
            );

            // O inimigo é empurrado para a esquerda
            recuo = progressoImpacto * 25;
        }

        const xSegundo = posicaoNormal - recuo;


        // Pequena oscilação simulando corrida
        const movimento = Math.sin(tempo / 80) * 5;

        
        // O inimigo pisca quando o raio está chegando
        const recebendoImpacto = tempo >= 33800;

        // Alterna a visibilidade a cada 50 milissegundos
        const visivel = !recebendoImpacto ||
            Math.floor(tempo / 50) % 2 === 0;

        if (visivel) {

            ctx.save();

            if (recebendoImpacto) {
                ctx.shadowColor = "#00ccff";
                ctx.shadowBlur = 25;
            }

            ctx.drawImage(
                assassino,
                xSegundo,
                320 + movimento,
                largura,
                altura
            );

            ctx.restore();
        }

    }
}



// =====================================
// CENA 3 - PRIMEIRO ATAQUE ELÉTRICO
// =====================================

function desenharAtaqueEletrico(tempo) {

    // Ataque acontece entre 27 e 28 segundos
    if (tempo < 27000 || tempo >= 28000) {
        return;
    }

    const progresso = (tempo - 27000) / 1000;

    // Posição inicial: mão esquerda do herói
    const inicioX = LARGURA * 0.68 + 15;
    const inicioY = 310 + 160 * 0.55;

    // Posição do assassino
    const alvoX = 230 + 55;
    const alvoY = 320 + 75;

    // Movimento do raio
    const x = inicioX + (alvoX - inicioX) * progresso;
    const y = inicioY + (alvoY - inicioY) * progresso;

    ctx.save();

    ctx.strokeStyle = "#4deaff";
    ctx.lineWidth = 6;
    ctx.shadowColor = "#00bfff";
    ctx.shadowBlur = 20;

    ctx.beginPath();

    ctx.moveTo(x + 25, y);

    ctx.lineTo(x + 12, y - 8);
    ctx.lineTo(x, y + 5);
    ctx.lineTo(x - 18, y);

    ctx.stroke();

    // Núcleo luminoso
    ctx.fillStyle = "#d9ffff";

    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// =====================================
// IMPACTO NO ASSASSINO DAS SOMBRAS
// =====================================

function desenharImpactoEletrico(tempo) {

    if (tempo < 28000 || tempo >= 30000) {
        return;
    }

    const progresso = (tempo - 28000) / 2000;

    const centroX = 285;
    const centroY = 395;

    ctx.save();

    for (let i = 0; i < 24; i++) {

        const angulo = (i / 24) * Math.PI * 2;

        const distancia = progresso * 100;

        const x = centroX + Math.cos(angulo) * distancia;
        const y = centroY + Math.sin(angulo) * distancia;

        ctx.fillStyle =
            `rgba(60, 210, 255, ${1 - progresso})`;

        ctx.shadowColor = "#00ccff";
        ctx.shadowBlur = 12;

        ctx.fillRect(x, y, 5, 5);
    }

    ctx.restore();
}


// =====================================
// DESCARGA FINAL DA CENA 3
// =====================================

function desenharDescargaFinal(tempo) {

    if (tempo < 32000 || tempo >= 35000) {
        return;
    }

    const centroX = LARGURA * 0.68 + 60;
    const centroY = 390;

    ctx.save();

    // Carregamento da energia: 32 a 33 segundos
    if (tempo < 33000) {

        const progresso = (tempo - 32000) / 1000;

        const raio = 15 + progresso * 55;

        ctx.beginPath();
        ctx.arc(
            centroX,
            centroY,
            raio,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(0, 180, 255, ${0.35 * progresso})`;

        ctx.shadowColor = "#00ccff";
        ctx.shadowBlur = 30;

        ctx.fill();
    }

    // Descarga elétrica: 33 a 34 segundos
    else if (tempo < 34000) {

        const progresso = (tempo - 33000) / 1000;

        const alvoX = 495;
        const alvoY = 395;

        ctx.strokeStyle = "#80eeff";
        ctx.lineWidth = 8;
        ctx.shadowColor = "#00bfff";
        ctx.shadowBlur = 25;

        ctx.beginPath();
        ctx.moveTo(centroX, centroY);

        // Raio avançando até o inimigo
        const xFinal =
            centroX + (alvoX - centroX) * progresso;

        const yFinal =
            centroY + (alvoY - centroY) * progresso;

        ctx.lineTo(xFinal, yFinal);
        ctx.stroke();

        // Núcleo brilhante
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(xFinal, yFinal, 9, 0, Math.PI * 2);
        ctx.fill();
    }

    // Explosão final: 34 a 35 segundos
    else {
        
        // Explosão de partículas no ponto do impacto
        const tempoImpacto = (tempo - 34000) / 1000;

        for (let i = 0; i < 30; i++) {

            const angulo = (i / 30) * Math.PI * 2;

            const distancia = tempoImpacto * 120;

            const px = 495 + Math.cos(angulo) * distancia;
            const py = 395 + Math.sin(angulo) * distancia;

            ctx.fillStyle =
                `rgba(80, 220, 255, ${1 - tempoImpacto})`;

            ctx.fillRect(px, py, 6, 6);
        }


        const progresso = (tempo - 34000) / 1000;

        const raio = progresso * 230;

        ctx.beginPath();
        ctx.arc(495, 395, raio, 0, Math.PI * 2);

        ctx.strokeStyle =
            `rgba(100, 220, 255, ${1 - progresso})`;

        ctx.lineWidth = 12;
        ctx.shadowColor = "#00ccff";
        ctx.shadowBlur = 35;

        ctx.stroke();

        // Clarão de transição
        if (progresso > 0.65) {

            const intensidade =
                (progresso - 0.65) / 0.35;

            ctx.fillStyle =
                `rgba(170, 230, 255, ${Math.min(intensidade, 1)})`;

            ctx.fillRect(0, 0, LARGURA, ALTURA);
        }
    }

    ctx.restore();
}


// =====================================
// CENA 4 - ATMOSFERA SOMBRIA
// =====================================

function desenharAtmosferaSombria(tempo) {

    // Tempo relativo ao início da Cena 4
    const tempoCena = tempo - 35000;

    // Escurecimento gradual em 3 segundos
    const progresso = Math.min(
        Math.max(tempoCena / 3000, 0),
        1
    );

    ctx.save();

    // Escurecer a cidade
    ctx.fillStyle =
        `rgba(8, 0, 25, ${progresso * 0.75})`;

    ctx.fillRect(0, 0, LARGURA, ALTURA);

    // Névoa roxa em movimento
    for (let i = 0; i < 12; i++) {

        const x =
            (i * 130 + tempoCena * 0.025) %
            (LARGURA + 200) - 100;

        const y = 360 + Math.sin(
            tempoCena / 900 + i
        ) * 35;

        const raio = 80 + i * 8;

        const nevoa = ctx.createRadialGradient(
            x, y, 5,
            x, y, raio
        );

        nevoa.addColorStop(
            0,
            `rgba(110, 20, 180, ${progresso * 0.22})`
        );

        nevoa.addColorStop(
            1,
            "rgba(50, 0, 90, 0)"
        );

        ctx.fillStyle = nevoa;

        ctx.beginPath();
        ctx.arc(x, y, raio, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}


// =====================================
// CENA 4 - APARIÇÃO DO SENHOR DAS SOMBRAS
// =====================================

function desenharSenhorSombras(tempo) {

    // O chefão aparece a partir dos 38 segundos
    if (tempo < 38000) return;

    // Verificar se a imagem carregou
    if (!senhorSombras.complete ||
        senhorSombras.naturalWidth === 0) {
        return;
    }

    // Aparição gradual entre 38 e 42 segundos
    const progresso = Math.min(
        (tempo - 38000) / 4000,
        1
    );

    // Posição do chefão
    const largura = 160;
    const altura = 200;

    const x = 170;
    const yInicial = 400;
    const yFinal = 270;

    // Chefão sobe lentamente da névoa
    const y = yInicial +
        (yFinal - yInicial) * progresso;

    ctx.save();

    // Transparência progressiva
    ctx.globalAlpha = progresso;

    // Aura roxa
    ctx.shadowColor = "#a020f0";
    ctx.shadowBlur = 35;

    // Desenhar chefão
    ctx.drawImage(
        senhorSombras,
        x,
        y,
        largura,
        altura
    );

    ctx.restore();
}


// =====================================
// CENA 4 - CONFRONTO DOS PERSONAGENS
// =====================================

function desenharConfronto(tempo) {

    // O herói aparece a partir dos 42 segundos
    if (tempo < 42000) return;

    // Desenhar o herói à direita
    desenharHeroi(tempo);

    // Intensidade da energia durante o confronto
    const progresso = Math.min(
        (tempo - 42000) / 4000,
        1
    );

    ctx.save();

    // Energia roxa do Senhor das Sombras
    const centroX = 250;
    const centroY = 370;

    const raio = 70 + Math.sin(tempo / 150) * 10;

    const aura = ctx.createRadialGradient(
        centroX, centroY, 10,
        centroX, centroY, raio
    );

    aura.addColorStop(
        0,
        `rgba(150, 0, 255, ${progresso * 0.45})`
    );

    aura.addColorStop(
        1,
        "rgba(80, 0, 150, 0)"
    );

    ctx.fillStyle = aura;

    ctx.beginPath();
    ctx.arc(
        centroX,
        centroY,
        raio,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
}



function desenharChoquePoderes(tempo) {

    if (tempo < 46000 || tempo >= 50000) return;

    const heroiX = LARGURA * 0.68 + 15;
    const chefeX = 330;
    const centroX = (heroiX + chefeX) / 2;
    const altura = 390;

    ctx.save();

    // 46 a 48 segundos: poderes avançam
    if (tempo < 48000) {

        const progresso = (tempo - 46000) / 2000;

        const pontaAzul = heroiX +
            (centroX - heroiX) * progresso;

        const pontaSombra = chefeX +
            (centroX - chefeX) * progresso;

        // ==================================
        // RAIOS ELÉTRICOS DO HERÓI
        // ==================================

        for (let raio = 0; raio < 4; raio++) {

            const deslocamento = (raio - 1.5) * 12;

            ctx.beginPath();
            ctx.moveTo(heroiX, altura);

            const segmentos = 12;

            for (let i = 1; i <= segmentos; i++) {

                const p = i / segmentos;

                const x = heroiX +
                    (pontaAzul - heroiX) * p;

                const oscilacao =
                    Math.sin(tempo / 45 + i * 7 + raio * 3)
                    * 12;

                const y = altura +
                    deslocamento * p + oscilacao;

                ctx.lineTo(x, y);
            }

            ctx.strokeStyle =
                raio === 0 ? "#ffffff" : "#00cfff";

            ctx.lineWidth = raio === 0 ? 5 : 3;
            ctx.shadowColor = "#00bfff";
            ctx.shadowBlur = 20;

            ctx.stroke();
        }

        // ==================================
        // TENTÁCULOS DE SOMBRAS DO CHEFÃO
        // ==================================

        for (let sombra = 0; sombra < 5; sombra++) {

            const deslocamento = (sombra - 2) * 15;

            ctx.beginPath();
            ctx.moveTo(chefeX, altura);

            const segmentos = 16;

            for (let i = 1; i <= segmentos; i++) {

                const p = i / segmentos;

                const x = chefeX +
                    (pontaSombra - chefeX) * p;

                const ondulacao =
                    Math.sin(tempo / 180 + p * 10 + sombra)
                    * 18 * p;

                const y = altura +
                    deslocamento * p + ondulacao;

                ctx.lineTo(x, y);
            }

            // Núcleo negro com contorno roxo
            ctx.strokeStyle = "#10051f";
            ctx.lineWidth = 15;
            ctx.shadowColor = "#a000ff";
            ctx.shadowBlur = 22;
            ctx.lineCap = "round";
            ctx.stroke();

            // Energia roxa na superfície
            ctx.strokeStyle = "#8222d6";
            ctx.lineWidth = 3;
            ctx.shadowBlur = 8;
            ctx.stroke();
        }
    }

    // 48 a 50 segundos: colisão
    else {

        const progresso = (tempo - 48000) / 2000;

        // Esfera de sombras e eletricidade
        const raio = 25 + progresso * 220;

        const energia = ctx.createRadialGradient(
            centroX, altura, 5,
            centroX, altura, raio
        );

        energia.addColorStop(
            0, "rgba(235, 250, 255, 0.95)"
        );

        energia.addColorStop(
            0.25, "rgba(0, 180, 255, 0.8)"
        );

        energia.addColorStop(
            0.55, "rgba(110, 0, 190, 0.65)"
        );

        energia.addColorStop(
            1, "rgba(5, 0, 20, 0)"
        );

        ctx.fillStyle = energia;

        ctx.beginPath();
        ctx.arc(
            centroX, altura, raio,
            0, Math.PI * 2
        );
        ctx.fill();

        // Fragmentos de energia
        for (let i = 0; i < 50; i++) {

            const angulo = (i / 50) * Math.PI * 2;
            const distancia = progresso * 190;

            const x = centroX +
                Math.cos(angulo) * distancia;

            const y = altura +
                Math.sin(angulo) * distancia;

            ctx.fillStyle = i % 2 === 0
                ? `rgba(0, 220, 255, ${1 - progresso})`
                : `rgba(130, 20, 200, ${1 - progresso})`;

            ctx.fillRect(x, y, 6, 6);
        }

        // Clarão final
        if (progresso > 0.7) {

            const intensidade =
                (progresso - 0.7) / 0.3;

            ctx.fillStyle =
                `rgba(220, 230, 255, ${intensidade})`;

            ctx.fillRect(0, 0, LARGURA, ALTURA);
        }
    }

    ctx.restore();
}


// =====================================
// CENA 5 - ENCERRAMENTO DA ABERTURA
// =====================================

function desenharEncerramento(tempo) {

    const tempoCena = tempo - 50000;

    ctx.save();

    // Fundo escuro
    ctx.fillStyle = "#050b1c";
    ctx.fillRect(0, 0, LARGURA, ALTURA);

    // Brilho azul no centro
    const brilho = ctx.createRadialGradient(
        LARGURA / 2, ALTURA / 2, 10,
        LARGURA / 2, ALTURA / 2, 450
    );

    brilho.addColorStop(0, "rgba(0, 100, 220, 0.25)");
    brilho.addColorStop(1, "rgba(0, 0, 20, 0)");

    ctx.fillStyle = brilho;
    ctx.fillRect(0, 0, LARGURA, ALTURA);

    // Logo do jogo: 52 a 60 segundos
    if (tempoCena >= 2000 &&
        logoChoque.complete &&
        logoChoque.naturalWidth > 0) {

        const entrada = Math.min(
            (tempoCena - 2000) / 1000,
            1
        );

        const escala = 1.15 - entrada * 0.15;

        const largura = 650 * escala;
        const altura = 260 * escala;

        ctx.globalAlpha = entrada;

        ctx.shadowColor = "#00bfff";
        ctx.shadowBlur = 30;

        ctx.drawImage(
            logoChoque,
            (LARGURA - largura) / 2,
            90,
            largura,
            altura
        );

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }

    // Raios elétricos ao redor da logo
    if (tempoCena >= 2000 && tempoCena < 9000) {

        for (let i = 0; i < 8; i++) {

            const x = 150 + i * 95;
            const y = 120 + Math.sin(tempo / 100 + i) * 25;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 15, y + 20);
            ctx.lineTo(x - 5, y + 40);

            ctx.strokeStyle = "#00ccff";
            ctx.lineWidth = 2;
            ctx.shadowColor = "#00bfff";
            ctx.shadowBlur = 15;
            ctx.stroke();
        }

        ctx.shadowBlur = 0;
    }

    // Logo do estúdio: 57 a 60 segundos
    if (tempoCena >= 7000 &&
        logoAlencar.complete &&
        logoAlencar.naturalWidth > 0) {

        const entrada = Math.min(
            (tempoCena - 7000) / 1000,
            1
        );

        ctx.globalAlpha = entrada;

        ctx.drawImage(
            logoAlencar,
            LARGURA / 2 - 100,
            380,
            200,
            100
        );

        ctx.globalAlpha = 1;
    }

    // Escurecimento final
    if (tempoCena >= 9500) {

        const fade = (tempoCena - 9500) / 500;

        ctx.fillStyle =
            `rgba(0, 0, 0, ${Math.min(fade, 1)})`;

        ctx.fillRect(0, 0, LARGURA, ALTURA);
    }

    ctx.restore();
}


// LOOP DA ANIMAÇÃO
let ultimoFrame = 0;

function animar(timestamp) {

    if (!aberturaIniciada) return;

    const tempo = timestamp - inicioCena;

    const delta = Math.min(
        (timestamp - ultimoFrame) / 1000,
        0.05
    );

    ultimoFrame = timestamp;

    const progresso = Math.min(
        tempo / DURACAO_CENA,
        1
    );

    ctx.clearRect(0, 0, LARGURA, ALTURA);

    // CENA 1 - CIDADE (0 A 10 SEGUNDOS)
    if (tempo < 10000) {

        desenharCidade(tempo / 10000);
        desenharChuva(delta);
        desenharRelampago(tempo);

    }

    // CENA 2 - HERÓI (10 A 20 SEGUNDOS)
    else if (tempo < 20000){

        const tempoCena2 = tempo - 10000;

        // Aproximação da câmera nos últimos 3 segundos
        const zoom = 1 + Math.max(
            0,
            (tempoCena2 - 7000) / 3000
        ) * 0.15;

        ctx.save();

        ctx.translate(LARGURA / 2, ALTURA / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-LARGURA / 2, -ALTURA / 2);

        desenharCidade(1);
        desenharHeroi(tempo);
        desenharChuva(delta);

        // EXPLOSÃO ELÉTRICA
        if (tempo >= 18000){
            desenharExplosaoEletrica(tempo);
        }

        ctx.restore();

        // Clarão na transição para a próxima cena
        if (tempoCena2 >= 9500) {

            const intensidade =
                (tempoCena2 - 9500) / 500;

            ctx.fillStyle =
                `rgba(160, 220, 255, ${Math.min(intensidade, 1)})`;

            ctx.fillRect(0, 0, LARGURA, ALTURA);
        }
    }

    
    // CENA 3 - BATALHA (20 A 35 SEGUNDOS)
    else if (tempo < 35000) {

        desenharCidade(0);

        // Herói permanece à direita
        desenharHeroi(tempo);

        // Assassinos entram no cenário
        desenharAssassinos(tempo);

        
        // Ataque do herói
        desenharAtaqueEletrico(tempo);

        // Explosão quando o raio atinge o inimigo
        desenharImpactoEletrico(tempo);

        
        // Segunda descarga elétrica
        desenharDescargaFinal(tempo);


        desenharChuva(delta);
    }

    
    // CENA 4 - CHEGADA DO SENHOR DAS SOMBRAS
    else if (tempo < 50000) {

        // Cidade ao fundo
        desenharCidade(0);

        // Atmosfera escura e névoa roxa
        desenharAtmosferaSombria(tempo);

        // Energia roxa do confronto
        desenharConfronto(tempo);

        // Aparição do chefão
        desenharSenhorSombras(tempo);

        // Choque entre eletricidade e energia sombria
        desenharChoquePoderes(tempo);

        // Chuva continua
        desenharChuva(delta);
    }


    // CENA 5 - ENCERRAMENTO (50 A 60 SEGUNDOS)
    else if (tempo < 60000) {

        desenharEncerramento(tempo);
    }



    if (tempo < DURACAO_CENA) {
        idAnimacao = requestAnimationFrame(animar);
    } else {
        finalizarCena();
    }

    
}

// INICIAR
btnIniciar.addEventListener("click", function() {

    if (!cidade.complete || cidade.naturalWidth === 0) {
        alert("A imagem da cidade ainda não carregou.");
        return;
    }

    aberturaIniciada = true;

    
    // Reiniciar a música desde o começo
    musicaAbertura.currentTime = 0;

    // Reproduzir a música
    musicaAbertura.play().catch(erro => {
        console.error("Erro ao reproduzir música:", erro);
    });


    btnIniciar.style.display = "none";
    btnPular.style.display = "block";

    inicioCena = performance.now();
    ultimoFrame = inicioCena;

    idAnimacao = requestAnimationFrame(animar);
});

// FINALIZAR CENA
function finalizarCena() {

    aberturaIniciada = false;

    
    // Encerrar a música junto com a abertura
    musicaAbertura.pause();
    musicaAbertura.currentTime = 0;

    idAnimacao = null;

    console.log("Cena 1 concluída!");

    // Aqui conectaremos a Cena 2.

    
    window.location.href = "../assets/index.html";

}

// PULAR
btnPular.addEventListener("click", function() {

    aberturaIniciada = false;

    
    // Parar a música
    musicaAbertura.pause();

    // Voltar para o início
    musicaAbertura.currentTime = 0;

     // Abrir o menu principal do jogo
    window.location.href = "../assets/index.html";


    if (idAnimacao !== null) {
        cancelAnimationFrame(idAnimacao);
        idAnimacao = null;
    }

    btnPular.style.display = "none";
    btnIniciar.style.display = "block";

    ctx.clearRect(0, 0, LARGURA, ALTURA);
    ctx.drawImage(cidade, 0, 0, LARGURA, ALTURA);
});

// EXIBIR CIDADE INICIALMENTE
cidade.onload = function() {
    ctx.drawImage(cidade, 0, 0, LARGURA, ALTURA);
}
