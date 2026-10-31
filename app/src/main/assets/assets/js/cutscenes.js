// =========================================================================================
// CHOQUE NO SISTEMA 2.0
// ==========================================================================================
window.Cutscenes = {
    //Estado inicial da história
    estado: "intro",

    // Indica se uma cena está acontecendo
    ativa: true,

    // Tempo da cena atual
    tempo: 0,

    //Posição inicial, à direita da avenida
    entradaRaioX: 1050,

    //Posição onde o chefão vai parar
    paradaRaioX: 80,

    //Velocidade da corrida cinematográfica
    velocidadeRaio: 3, 

    //Controle da chegada
    raioChegou: false,

    //ENTRADA DO SAQUEADOR
    //saqueador que participara da introduçao
    saqueadorIntro: null,

    //posicao inicial
    entradaSaqueadorX: 900,

    //posicao onde ele parara
    paradaSaqueadorX: 90,
    
    // velocidade da corrida
    velocidadeSaqueador: 2.5,

    // controle da chegada
    saqueadorChegou: false,

    //INICIAR ENTRADA DO RAIO DE FOGO
    iniciarEntradaRaio(){
        //Preparar as sprites do chefão
        RaioDeFogo.carregarSprites();
           
        // Posicionar na entrada da avenida
        RaioDeFogo.x = this.entradaRaioX;
        RaioDeFogo.y = 870;

        // Tornar o chefão visível
        RaioDeFogo.ativo = true;

        // Impedir que o combate comece
        RaioDeFogo.estado = "cutscene";
        RaioDeFogo.heroiDetectado = false;
        RaioDeFogo.atacando = false;
        RaioDeFogo.movendo = true;

        // Começar pela animção de corrida
        RaioDeFogo.animacaoAtual = "run";
        RaioDeFogo.animacaoAnterior = "run";

        RaioDeFogo.frame = 0;
        RaioDeFogo.tempoAnimacao = 0;

        // Olhar para a esquerda
        RaioDeFogo.direcao = -1;
        this.raioChegou = false;

        console.log("Raio de Fogo preparado para a entrada!");

    },

        // MOVIMENTO CINEMATOGRÁFICO DO RAIO DE FOGO
        atualizarEntradaRaio(dt) {

            if(this.estado !== "intro")
                return;
            if (this.raioChegou) return;

            // Correr da direita para a esquerda
            RaioDeFogo.x -= this.velocidadeRaio * (dt / 16.67);

            RaioDeFogo.direcao = -1;
            RaioDeFogo.movendo = true;
            RaioDeFogo.animacaoAtual = "run";

            //Atualizar os frames da corrida
            RaioDeFogo.tempoAnimacao += dt;

            if (
                RaioDeFogo.tempoAnimacao >=
                RaioDeFogo.velocidadeAnimacao
            ){
                RaioDeFogo.tempoAnimacao = 0;

                RaioDeFogo.frame = (RaioDeFogo.frame + 1) %
                RaioDeFogo.sprites.run.length;

            }

            // Chegou ao ponto de parada
            if (RaioDeFogo.x <= this.paradaRaioX){
                RaioDeFogo.x = this.paradaRaioX;

                RaioDeFogo.movendo = false;
                RaioDeFogo.tempoAnimacao = 0;

                this.raioChegou = true;

                // Iniciar o primeiro diálogo
                this.estado = "dialogo_intro";
                this.dialogoAtual = 0;

                // Chefão parado durante a conversa
                RaioDeFogo.movendo = false;
                RaioDeFogo.animacaoAtual = "idle";
                RaioDeFogo.frame = 0;
                RaioDeFogo.tempoAnimacao = 0

                console.log("DIÁLOGO INICIADO!");

                console.log(
                    this.dialogosIntroducao[this.dialogoAtual].personagem + ": " + this.dialogosIntroducao[this.dialogoAtual].texto
                );
            }
        },
        

    // Controle de diálogos
    dialogoAtual: 0,

    // DIÁLOGO 1 - HERÓI E RAIO DE FOGO
    dialogosIntroducao: [
        {
            personagem: "HERÓI", 
            texto: "Ei! Quem é você? O que está fazendo nesta cidade?"
        },

        {
            personagem: "RAIO DE FOGO",
            texto: "Hahaha! Então você é o tal herói elétrico?"
        },

        {
            personagem: "HEÓI",
            texto: "Responda minha pergunta! O que você quer?" 
        },

        {
            personagem: "RAIO DE FOGO",
            texto: "Esta cidade agora pertence a mim! E ninguém vai me impedir!"
        },

        {
            personagem: "HERÓI",
            texto: "Enquanto eu estiver aqui, você não vai machucar ninguém!"
        },

        {
            personagem: "RAIO DE FOGO",
            texto: "Veremos! Primeiro, tente sobreviver aos meus Saqueadores!"
        }

    
    ],

        // DIÁLOGO 2 - HERÓI E SAQUEADOR
    dialogosSaqueador: [
        {
            personagem: "SAQUEADOR",
            texto: "Então você é o herói que quer impedir nosso chefe?"
        },
        {
            personagem: "HERÓI",
            texto: "Seu chefe fugiu! Agora é sua vez de sair daqui!"
        },
        {
            personagem: "SAQUEADOR",
            texto: "Hahaha! Você não sabe com quem está mexendo!"
        },
        {
            personagem: "HERÓI",
            texto: "Não tenho medo de vocês! Deixem esta cidade em paz!"
        },
        {
            personagem: "SAQUEADOR",
            texto: "Então venha me enfrentar, herói!"
        },
        {
            personagem: "HERÓI",
            texto: "Você pediu por isso!"
        }
    ],

    
    dialogosRetornoRaio: [
        {
            personagem: "RAIO DE FOGO",
            texto: "Então você conseguiu derrotar todos os meus homens..."
        },
        {
            personagem: "HERÓI",
            texto: "Acabou, Raio de Fogo! Sua destruição termina aqui!"
        },
        {
            personagem: "RAIO DE FOGO",
            texto: "Hahaha! Você realmente acredita que pode me vencer?"
        },
        {
            personagem: "HERÓI",
            texto: "Não preciso acreditar. Vou provar!"
        },
        {
            personagem: "RAIO DE FOGO",
            texto: "Então prepare-se! Você vai sentir o verdadeiro poder das minhas chamas!"
        },
        {
            personagem: "HERÓI",
            texto: "E você vai descobrir o poder de um verdadeiro herói!"
        }
    ],

    
    dialogosDerrotaRaio: [
        {
            personagem: "RAIO DE FOGO",
            texto: "Impossível... Como você conseguiu superar minhas chamas?!"
        },
        {
            personagem: "HERÓI",
            texto: "Seu fogo pode destruir muita coisa... mas nunca vai apagar a esperança desta cidade!"
        },
        {
            personagem: "RAIO DE FOGO",
            texto: "Você venceu esta batalha... mas existem forças muito maiores do que eu..."
        },
        {
            personagem: "HERÓI",
            texto: "Então estarei pronto quando elas aparecerem!"
        }
    ],



    // Verificar se o jogadopr pode controlar o heroi
    podeControlar(){
        return !this.ativa;
    },

    //Iniciar uma nova cena
    iniciar(estado){
        this.estado = estado;
        this.ativa = true;
        this.tempo = 0;
        this.dialogoAtual = 0;

        console.log(
            "CUTSCENE INICIADA:",
            estado
        );
    },

    // PREPARAR ENTRADA DO PRIMEIRO SAQUEADOR
    iniciarEntradaSaqueador(){
        // usar o primeiro saqueador ja criado
        const npc = Inimigos.lista[0];
        if(!npc) {
            console.error("Primeiro Saquador não encontrado!");
            return;
        }

        this.saqueadorIntro = npc;

        // Colocar o Saqueador á direita da avenida
        npc.x = this.entradaSaqueadorX;

        //Manter a altura original do personagem
        npc.y = 945;

        // Olhar e correr para a esquerda
        npc.direcao = -1;

        // Garantir que esteja visível
        npc.vivo = true;
        npc.liberado = true;

        // Preparar a animação de corrida
        Inimigos.mudarEstado(npc, "run");
        npc.frame = 0;
        npc.tempoAnimacao = 0;

        this.saqueadorChegou = false;

        console.log(
            "Primeiro Saqueador preparado para entrada cinematografica!"
        );
    },

    // Animar Entrada do primeiro saqueador
    atualizarEntradaSaqueador(dt){
        if (this.estado !== "entrada_saqueador") return;

        // Preparar apenas uma vez
        if (!this.saqueadorIntro){
            this.iniciarEntradaSaqueador();
        }

        const npc = this.saqueadorIntro;

        if (!npc || this.saqueadorChegou) return;

        // Correr para a esquerda
        npc.x -= this.velocidadeSaqueador * (dt / 16.67);
        npc.direcao = -1;

        // Atualizar animação de corrida
        Inimigos.mudarEstado(npc, "run");
        Inimigos.atualizarAnimacao(npc, dt);

        // Parar diante do heroi
        if (npc.x <= this.paradaSaqueadorX){
            npc.x = this.paradaSaqueadorX;

            Inimigos.mudarEstado(npc, "idle");

            this.saqueadorChegou = true;
            this.estado = "dialogo_saqueador";

            this.dialogoAtual = 0;

            console.log("Diálogo do Saqueador iniciado!");
        }

    },

    // FUGA CINEMATOGRAFICA DO RAIO DE FOGO
    atualizarFugaRaio(dt){
        if (this.estado !== "fuga_raio")
            return;
        // Correr para a direita
        RaioDeFogo.x += this.velocidadeRaio * (dt / 16.67);
        RaioDeFogo.direcao = 1;
        RaioDeFogo.movendo = true;
        RaioDeFogo.animacaoAtual = "run";

        // Animar a corrida
        const frames = RaioDeFogo.sprites.run;

        if(frames && frames.length > 0){
            RaioDeFogo.tempoAnimacao += dt;

            if (
                RaioDeFogo.tempoAnimacao >= RaioDeFogo.velocidadeAnimacao
            ){
                RaioDeFogo.tempoAnimacao = 0;
                RaioDeFogo.frame = (RaioDeFogo.frame + 1) % frames.length;
            }
        }

        // Sair completamente da Avenida Central
        if (RaioDeFogo.x >= 1200){
            RaioDeFogo.ativo = false;
            RaioDeFogo.movendo = false;
            RaioDeFogo.frame = 0;

            this.estado = "entrada_saqueador";

            console.log(
                "Raio de Fogo fugiu! Preparar primeiro Saqueador."
            );
        }

    },


    // AVANÇAR DIÁLOGOS CINEMATOGRÁFICOS
    avancarDialogo() {

        
        console.log(
            "TESTE AVANÇAR DIÁLOGO:",
            "Estado:", this.estado,
            "Fala atual:", this.dialogoAtual
        );


        // Permitir apenas os dois diálogos
        if (
            this.estado !== "dialogo_intro" &&
            this.estado !== "dialogo_saqueador" &&
            this.estado !== "dialogo_retorno_raio" &&
            this.estado !== "dialogo_derrota_raio"
        ) {
            return;
        }

        // Identificar qual diálogo está acontecendo
        
        const falas =
            this.estado === "dialogo_derrota_raio"
                ? this.dialogosDerrotaRaio
                : this.estado === "dialogo_retorno_raio"
                ? this.dialogosRetornoRaio
                : this.estado === "dialogo_saqueador"
                ? this.dialogosSaqueador
                : this.dialogosIntroducao;


        // Avançar para a próxima fala
        this.dialogoAtual++;

        // Verificar se todas as falas terminaram
        if (this.dialogoAtual >= falas.length) {
            
            if (this.estado === "dialogo_derrota_raio") {

                console.log("RAIO DE FOGO DERROTADO!");

                RaioDeFogo.ativo = false;



                this.estado = "pos_derrota_raio";

                this.finalizar();

                return;
            }

            
            // Diálogo final: começar batalha contra o chefão
            if (this.estado === "dialogo_retorno_raio") {
                console.log("BATALHA FINAL CONTRA RAIO DE FOGO!");

                this.estado = "combate_raio";
                RaioDeFogo.estado = "combate";
                RaioDeFogo.movendo = false;
                RaioDeFogo.atacando = false;
                RaioDeFogo.frame = 0;

                this.finalizar();
                return;
            }


            // Primeiro diálogo: Raio de Fogo foge
            if (this.estado === "dialogo_intro") {
                console.log("Diálogo do Raio de Fogo concluído!");

                this.estado = "fuga_raio";
                return;
            }

            // Segundo diálogo: Saqueador
            if (this.estado === "dialogo_saqueador") {
                console.log("Diálogo do Saqueador concluído!");

                // Por enquanto, manter a cena parada
                this.estado = "combate_saqueadores";

                this.finalizar();
                console.log("Combate contra os Saqueadores liberado!");
                return;
            }
        }

        // Mostrar a próxima fala
        const fala = falas[this.dialogoAtual];

        console.log(
            fala.personagem + ": " + fala.texto
        );
    },

    // DESENHAR CAIXA DE DIALÓGO
    desenharDialogo(ctx){

        if (
            this.estado !== "dialogo_intro" &&
            this.estado !== "dialogo_saqueador" &&
            this.estado !== "dialogo_retorno_raio" &&
            this.estado !== "dialogo_derrota_raio"
        ) {
            return;
        }

        const falas =

        this.estado === "dialogo_derrota_raio"
            ? this.dialogosDerrotaRaio
            : this.estado === "dialogo_retorno_raio"
            ? this.dialogosRetornoRaio
            : this.estado === "dialogo_saqueador"
            ? this.dialogosSaqueador
            : this.dialogosIntroducao;
        
        const fala = falas[this.dialogoAtual];

        if (!fala) return;

        
        const largura = ctx.canvas.width;
        const altura = ctx.canvas.height;

        // CAIXA DE DIÁLOGO RESPONSIVA
        const caixaLargura = largura * 0.92;
        const caixaAltura = altura * 0.24;

        const x = (largura - caixaLargura) / 2;
        const y = altura - caixaAltura - altura * 0.02;


        ctx.save();

        // Restaurar coordenadas e alinhamento
        // para desenhar o diálogo corretamente
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.direction = "ltr";

        // Fundo escuro da caixa
        ctx.fillStyle = "rgba(5, 12, 30, 0.93)";
        ctx.fillRect(x, y, caixaLargura, caixaAltura

        );

        // Borda azul elétrica
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, caixaLargura, caixaAltura);

        // Nome do personagem
        ctx.fillStyle = fala.personagem === "RAIO DE FOGO" ? "#fb923c" : "#38bdf8";

        ctx.font = `bold ${Math.round(altura * 0.043)}px Arial`;

        ctx.fillText(
            fala.personagem,
            x + 20,
            y + 35

        );

        //Texto do diálogo
        ctx.fillStyle = "#ffffff";
        ctx.font = `${Math.round(altura * 0.035)}px Arial`;

                // Quebrar o texto automaticamente
        // para não ultrapassar a caixa azul

        const palavras = fala.texto.split(" ");
        const larguraMaxima = caixaLargura - 40;

        let linha = "";
        let posicaoY = y + caixaAltura * 0.56;

        for (const palavra of palavras) {

            const testeLinha = linha
                ? linha + " " + palavra
                : palavra;

            if (
                ctx.measureText(testeLinha).width > larguraMaxima &&
                linha !== ""
            ) {
                ctx.fillText(linha, x + 20, posicaoY);

                linha = palavra;
                posicaoY += altura * 0.042;

            } else {
                linha = testeLinha;
            }
        }

        // Desenhar a última linha
        if (linha !== "") {
            ctx.fillText(linha, x + 20, posicaoY);
        }

        // Indicador de continuação
        ctx.fillStyle = "#facc15";
        ctx.font = `${Math.round(altura * 0.030)}px Arial`;

        
        ctx.fillText(
            "CONTINUAR >",
            x + caixaLargura - caixaLargura * 0.17,
            y + caixaAltura * 0.90
        );


        ctx.restore();

    },

    
    // ==========================================
    // RETORNO CINEMATOGRÁFICO DO RAIO DE FOGO
    // ==========================================

    atualizarRetornoRaio(dt) {

        if (this.estado !== "retorno_raio") {
            return;
        }

        // Posição inicial da entrada
        if (!this.retornoRaioPreparado) {

            RaioDeFogo.x = 4700;
            RaioDeFogo.y = 870;
            RaioDeFogo.direcao = -1;

            RaioDeFogo.movendo = true;
            RaioDeFogo.atacando = false;
            RaioDeFogo.frame = 0;
            RaioDeFogo.tempoAnimacao = 0;

            this.retornoRaioPreparado = true;

            console.log("Raio de Fogo começou seu retorno!");
        }

        // Correr em direção ao herói
        RaioDeFogo.x -= 3 * (dt / 16.67);

        RaioDeFogo.movendo = true;
        RaioDeFogo.direcao = -1;

        // Atualizar sprites de corrida
        const frames = RaioDeFogo.sprites.run;

        if (frames && frames.length > 0) {

            RaioDeFogo.tempoAnimacao += dt;

            if (
                RaioDeFogo.tempoAnimacao >=
                RaioDeFogo.velocidadeAnimacao
            ) {
                RaioDeFogo.tempoAnimacao = 0;

                RaioDeFogo.frame =
                    (RaioDeFogo.frame + 1) % frames.length;
            }
        }

        // Ponto de parada na Usina Elétrica
        if (RaioDeFogo.x <= 4300) {

            RaioDeFogo.x = 4300;
            RaioDeFogo.movendo = false;
            RaioDeFogo.frame = 0;
            RaioDeFogo.tempoAnimacao = 0;

            this.estado = "dialogo_retorno_raio";
            this.dialogoAtual = 0;

            console.log(
                "Raio de Fogo chegou! Preparar diálogo final."
            );
        }
    },



    finalizar(){
        this.ativa = false;

        console.log(
        "CUTSCENE FINALIZADA:",
        this.estado
        );
    }
};