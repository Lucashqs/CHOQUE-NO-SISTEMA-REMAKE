// ==========================================
// CHOQUE NO SISTEMA 2.0
// CHEFÃO 1 — RAIO DE FOGO
// ALENCAR GAME STUDIO
// ==========================================

window.RaioDeFogo = {

  nome: "RAIO DE FOGO",

  x: 4200,
  y: 870,

  largura: 100,
  altura: 150,

  vida: 1000,
  vidaMaxima: 1000,
  
  // Controle da animação de derrota
  frameDerrota: 0,
  tempoDerrota: 0,
  intervaloDerrota: 120,
  animacaoDerrotaFinalizada: false,

  
  // Controla o início da cutscene final
  cutsceneDerrotaIniciada: false,



  ativo: false,
  derrotado: false,

  estado: "aguardando",

  // ==========================================
 // ANIMAÇÃO DO CHEFÃO
 // ==========================================

    sprites: {
    idle: [],
    run: [],
    attack_01: [],
    death: [],
    },

    frame: 0,
    tempoAnimacao: 0,
    velocidadeAnimacao: 130,

    // ==========================================
    // CONTROLE DO ATAQUE 1
    // ==========================================

    atacando: false,
    movendo: false,
    bolaDisparada: false,
    tempoRecarga: 0,
    recargaAtaque: 2500,

    // ==========================================
    // PROJÉTEIS DO RAIO DE FOGO
    // ==========================================

    // Lista de bolas de fogo ativas
    projeteis: [],

    // Criar uma nova bola de fogo
    criarBolaDeFogo() {

        if (!this.ativo || this.derrotado) {
            return;
        }

        const larguraBola = 32;
        const alturaBola = 32;

        // Posição inicial na frente do chefão
        const posicaoX = this.direcao === 1
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
    // MOVIMENTAÇÃO DOS PROJÉTEIS
    // ==========================================

    atualizarProjeteis(dt, jogador, vidaHeroi) {

        // Ajusta a velocidade conforme o tempo
        const fatorTempo = dt / 16.67;

        for (const bola of this.projeteis) {

            if (!bola.ativa) {
            continue;
            }

            // Movimenta a bola na direção do disparo
            bola.x += bola.velocidade
            * bola.direcao
            * fatorTempo;
            
            // ==============================================================
            // COLISAO DA BOLA DE FOGO COM O HEROI
            //===============================================================
            if(jogador && bola.ativa){
                // COLISAO PRECISA - BOLA DE FOGO

                const centroBolaX = bola.x + bola.largura / 2;
                const centroBolaY = bola.y + bola.altura / 2;

                const raioBola = 10;

                const margemX = jogador.largura * 0.25;
                const margemY = jogador.altura * 0.15;

                const esquerda = jogador.x + jogador.largura - margemX;
                const direita = jogador.x + jogador.largura - margemX;

                const topo = jogador.y + margemY;
                const baixo = jogador.y + jogador.altura - margemY;

                const pontoX = Math.max(
                    esquerda,
                    Math.min(centroBolaX, direita)
                );

                const pontoY = Math.max(
                    topo,
                    Math.min(centroBolaY, baixo)
                );

                const distanciaX = centroBolaX - pontoX;
                const distanciaY = centroBolaY - pontoY;

                const colisao = 
                distanciaX * distanciaX + distanciaY * distanciaY <= raioBola * raioBola;



                if (colisao){
                    // Desativa o projétil após atingir o héroi
                    bola.ativa = false;

                    if (vidaHeroi && vidaHeroi.valor > 0 && vidaHeroi.tempoDano <= 0){
                        vidaHeroi.valor = Math.max(0, vidaHeroi.valor - bola.dano);

                        vidaHeroi.tempoDano = 1000;

                        console.log("RAIO DE FOGO ATINGIU O HEROI!", "Dano:", bola.dano, "vida restante:", vidaHeroi.valor);
                    }
                }
            }

            // Desativa a bola ao sair do mundo
            if (
            bola.x < -bola.largura ||
            bola.x > Mundo1.largura
            ) {
            bola.ativa = false;
            }

        }

        // Remove os projéteis desativados
        this.projeteis = this.projeteis.filter(
            bola => bola.ativa
        );

    },

    // ==========================================
    // DESENHAR BOLAS DE FOGO
    // ==========================================

    desenharProjeteis(ctx, cameraX, cameraY) {

        for (const bola of this.projeteis) {

            if (!bola.ativa) {
            continue;
            }

            const x = bola.x - cameraX;
            const y = bola.y - cameraY;

            const centroX = x + bola.largura / 2;
            const centroY = y + bola.altura / 2;

            ctx.save();

            // Brilho externo
            ctx.shadowColor = "#ff4500";
            ctx.shadowBlur = 25;

            // Gradiente da bola de fogo
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

    atacar() {

        // Impede ataques simultâneos
        if (this.atacando || !this.ativo || this.derrotado) {
            return;
        }

        // Inicia o ataque
        this.atacando = true;
        this.estado = "attack_01";
        this.bolaDisparada = false;

        // Reinicia a animação
        this.frame = 0;
        this.tempoAnimacao = 0;

        console.log("RAIO DE FOGO: ATAQUE 1!");

    },

    // ==========================================
    // INTELIGÊNCIA ARTIFICIAL DO CHEFÃO
    // ==========================================

    // Distância máxima para detectar o herói
    distanciaDeteccao: 350,

    velocidadeMovimento: 1.5,

    distanciaCombate: 180,

    limiteEsquerdo: 3600,
    limiteDireito: 4800,

    moverEmDirecaoAoHeroi(dt, jogador){

        this.movendo = false;

        if (!this.ativo || this.derrotado || this.atacando || !jogador || !this.heroiDetectado){
            return;
        }

        const centroChefao = this.x + this.largura / 2;

        const centroHeroi = jogador.x + jogador.largura / 2;

        const distancia = Math.abs(centroHeroi - centroChefao);

        if (distancia <= this.distanciaCombate){
            return;
        }

        const direcao = centroHeroi < centroChefao ? -1 : 1;

        const movimento = this.velocidadeMovimento * direcao * (dt / 16.67);

        this.x += movimento;
        this.movendo = Math.abs(movimento) > 0;

        this.x = Math.max(this.limiteEsquerdo, Math.min(this.limiteDireito - this.largura, this.x));

    },

    // Indica se o herói foi detectado
    heroiDetectado: false,

    // Direção para a qual o chefão olha
    direcao: -1,

    detectarHeroi(jogador) {

    if (!this.ativo || this.derrotado) {
        return;
    }

    // Calcula o centro dos personagens
    const centroChefao = this.x + this.largura / 2;
    const centroHeroi = jogador.x + jogador.largura / 2;

    // Calcula a distância horizontal
    const distancia = Math.abs(centroHeroi - centroChefao);

    // Verifica se o herói está próximo
    this.heroiDetectado = distancia <= this.distanciaDeteccao;

    // Define para qual lado o chefão deve olhar
    this.direcao = centroHeroi < centroChefao ? -1 : 1;

    if (this.heroiDetectado) {
        this.estado = "combate";
    } else {
        this.estado = "aguardando";
    }

    },

    carregarSprites() {

    const pasta =
        "sprites/chefoes/raio_de_fogo/idle/";

    this.sprites.idle = [];

    for (let i = 1; i <= 8; i++) {

        const numero = String(i).padStart(2, "0");

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

        // ==========================================
        // CARREGAR ANIMAÇÃO DO ATAQUE 1
        // ==========================================

        this.sprites.attack_01 = [];

        for (let i = 1; i <= 6; i++) {

        const numero = String(i).padStart(2, "0");

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

        //================================================================================================
        //CARREGAR ANIMAÇÃO DE CORRIDA
        //================================================================================================
        this.sprites.run = [];

        for (let i = 1; i <= 4; i++){
            const numero = String(i).padStart(2, "0");

            const imagem = new Image();

            imagem.src = `sprites/chefoes/raio_de_fogo/run/run_${numero}.png`;

            imagem.onerror = () => {
                console.error("Erro ao carregar sprite de corrida:", imagem.src);
            };
            
            this.sprites.run.push(imagem);
        }

        
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
    // SISTEMA DE VIDA DO RAIO DE FOGO
    // ==========================================

    receberDano(dano) {

        if (!this.ativo || this.derrotado) {
            return;
        }

        this.vida = Math.max(
            0,
            this.vida - dano
        );

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
                "RAIO DE FOGO FOI DERROTADO! Iniciando sequência final."
            );
        }
    },


    iniciar() {

        if (this.ativo || this.derrotado) {
            return;
        }

        // Reposicionar o chefão na Usina Elétrica
        this.x = 4200;
        this.y = 870;
        this.direcao = -1;

        // Restaurar o estado do combate
        this.ativo = true;
        this.estado = "entrada";
        this.heroiDetectado = false;
        this.atacando = false;
        this.movendo = false;
        this.bolaDisparada = false;
        this.projeteis = [];
        this.tempoRecarga = 0;

        // Preparar animações
        this.carregarSprites();
        this.frame = 0;
        this.tempoAnimacao = 0;
        this.animacaoAnterior = null;

        console.log(
            "CHEFÃO RAIO DE FOGO INICIADO NA USINA!",
            "Posição X:", this.x,
            "Posição Y:", this.y
        );
    },


    atualizar(dt, jogador, vidaHeroi) {

        
        // Atualizar animação de derrota
        if (this.estado === "derrota") {

            if (!this.animacaoDerrotaFinalizada) {

                this.tempoDerrota += dt;

                if (this.tempoDerrota >= this.intervaloDerrota) {

                    this.tempoDerrota = 0;

                    if (this.frameDerrota < 6) {
                        this.frameDerrota++;
                    } else {
                        this.animacaoDerrotaFinalizada = true;

                        console.log(
                            "ANIMAÇÃO DE DERROTA FINALIZADA!"
                        );

                        
                        
                        if (!this.cutsceneDerrotaIniciada) {

                            this.cutsceneDerrotaIniciada = true;

                            // Iniciar o diálogo final após a queda
                            Cutscenes.iniciar("dialogo_derrota_raio");

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

        // Atualizar as bolas de fogo
        this.atualizarProjeteis(dt, jogador, vidaHeroi);

        // Detectar a posição do herói
        if (jogador) {
            this.detectarHeroi(jogador);
        }

        if (jogador) {
            this.moverEmDirecaoAoHeroi(dt, jogador);
        }

        // ==========================================
        // CONTROLE AUTOMÁTICO DO ATAQUE 1
        // ==========================================

        // Diminuir o tempo de recarga
        if (this.tempoRecarga > 0) {
            this.tempoRecarga = Math.max(
                0,
                this.tempoRecarga - dt
            );
        }

        // Atacar somente quando o herói estiver perto
        if (
            this.heroiDetectado &&
            !this.atacando &&
            this.tempoRecarga <= 0 &&
            vidaHeroi &&
            vidaHeroi.valor > 0
        ) {


            // Iniciar animação de ataque
            this.atacar();

            // Aguardar 2,5 segundos para outro ataque
            this.tempoRecarga = this.recargaAtaque;

        }

        //CONTROLE DAS ANIMAÇOES

        const animacaoAtual = this.atacando ? "attack_01" : this.movendo ? "run" : "idle";

        if(this.animacaoAnterior !== animacaoAtual){
            this.frame = 0;
            this.tempoAnimacao = 0;
            this.animacaoAnterior = animacaoAtual;

        }

        this.tempoAnimacao += dt;
        if(this.tempoAnimacao >= this.velocidadeAnimacao){
            this.tempoAnimacao = 0;
            this.frame++;

            if (
                this.atacando && this.frame === 3 && !this.bolaDisparada
            ){
                this.criarBolaDeFogo();
                this.bolaDisparada = true;
            }

            if(
                this.atacando && this.frame >= this.sprites.attack_01.length
            ){
                this.atacando = false;
                this.frame = 0;
                this.animacaoAnterior = null;
            } else if (!this.atacando) {
                this.frame %= this.sprites[animacaoAtual].length;
            }
        }

    },

    desenhar(ctx, cameraX, cameraY) {


    if (!this.ativo) {
        return;
    }

    
    // Desenhar animação de derrota
    if (this.estado === "derrota") {

        const imagem = this.sprites.death[this.frameDerrota];

        if (imagem && imagem.complete && imagem.naturalWidth > 0) {

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


    // Escolher a animação atual
    const animacao = this.atacando
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
    const centroX = this.x - cameraX + this.largura / 2;

    const posicaoY = this.y - cameraY;

    ctx.translate (centroX, posicaoY);

    if(this.direcao === -1){
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