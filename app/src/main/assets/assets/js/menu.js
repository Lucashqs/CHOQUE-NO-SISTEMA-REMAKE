
/* =====================================
   CHOQUE NO SISTEMA REMAKE
   CONTROLE DO MENU PRINCIPAL
===================================== */

// Botões
const btnConfiguracoes =
  document.getElementById("btnConfiguracoes");

const btnVoltarConfig =
  document.getElementById("btnVoltarConfig");

// Painel
const painelConfiguracoes =
  document.getElementById("painelConfiguracoes");

// Abrir configurações
btnConfiguracoes.addEventListener("click", () => {
  painelConfiguracoes.hidden = false;
});

// Voltar ao menu principal
btnVoltarConfig.addEventListener("click", () => {
  painelConfiguracoes.hidden = true;
});

/* =====================================
   SALVAR CONFIGURAÇÕES DE ÁUDIO
===================================== */

const volumeMusica =
  document.getElementById("volumeMusica");

const volumeEfeitos =
  document.getElementById("volumeEfeitos");

// Recuperar os volumes salvos
const musicaSalva =
  localStorage.getItem("choque_volume_musica");

const efeitosSalvos =
  localStorage.getItem("choque_volume_efeitos");

// Aplicar as preferências anteriores
if (musicaSalva !== null) {
  volumeMusica.value = musicaSalva;
}

if (efeitosSalvos !== null) {
  volumeEfeitos.value = efeitosSalvos;
}

// Salvar quando o jogador alterar a música
volumeMusica.addEventListener("input", () => {
  localStorage.setItem(
    "choque_volume_musica",
    volumeMusica.value
  );
});

// Salvar quando o jogador alterar os efeitos
volumeEfeitos.addEventListener("input", () => {
  localStorage.setItem(
    "choque_volume_efeitos",
    volumeEfeitos.value
  );
});

/* =====================================
   MÚSICA DO MENU PRINCIPAL
===================================== */

// Encontrar o áudio do menu
const musicaMenu =
  document.getElementById("musicaMenu");

// Aplicar o volume salvo
musicaMenu.volume = volumeMusica.value / 100;

// Atualizar o volume em tempo real
volumeMusica.addEventListener("input", () => {
  musicaMenu.volume = volumeMusica.value / 100;
});

// Iniciar a música após interação do jogador
function iniciarMusicaMenu() {

  musicaMenu.play().catch(erro => {
    console.log(
      "Aguardando permissão para reproduzir música:",
      erro
    );
  });

}

// Primeira interação com o menu
document.addEventListener(
  "pointerdown",
  iniciarMusicaMenu,
  { once: true }
);

// Também permitir iniciar pelo teclado
document.addEventListener(
  "keydown",
  iniciarMusicaMenu,
  { once: true }
);

/* =====================================
   BOTÃO CONTINUAR
===================================== */

const btnContinuar =
  document.getElementById("btnContinuar");

// Verificar se existe checkpoint salvo
function atualizarBotaoContinuar() {

  const possuiSalvamento = Salvamento.existe();

  btnContinuar.disabled = !possuiSalvamento;

  console.log(
    "Checkpoint disponível:",
    possuiSalvamento
  );
}

// Verificar ao abrir o menu
atualizarBotaoContinuar();

// Continuar a partida salva
btnContinuar.addEventListener("click", () => {

  if (!Salvamento.existe()) return;

  window.location.href =
    "teste_mundo1.html?continuar=1";

});
// =====================================
// CHOQUE NO SISTEMA REMAKE - NATAL 2026
// SISTEMA DE NEVE ANIMADA
// =====================================

function iniciarNeveNatal() {

    const camadaNeve = document.getElementById("neve-natal");

    if (!camadaNeve) {
        console.warn("Camada de neve não encontrada!");
        return;
    }

    // Evitar criar flocos duplicados
    camadaNeve.innerHTML = "";

    // Quantidade de flocos conforme o dispositivo
    const quantidadeFlocos =
        window.innerWidth < 600 ? 25 : 50;

    for (let i = 0; i < quantidadeFlocos; i++) {

        const floco = document.createElement("span");

        floco.className = "floco";
        floco.textContent = "❄";

        // Posição horizontal aleatória
        floco.style.left = Math.random() * 100 + "%";

        // Tamanho aleatório
        floco.style.fontSize =
            (6 + Math.random() * 12) + "px";

        // Velocidade da queda
        floco.style.animationDuration =
            (6 + Math.random() * 8) + "s";

        // Distribuir flocos pela tela desde o início
        floco.style.animationDelay =
            (-Math.random() * 14) + "s";

        // Transparência variada
        floco.style.opacity =
            0.4 + Math.random() * 0.6;

        camadaNeve.appendChild(floco);
    }

    console.log("❄️ Neve natalina iniciada!");
}

// Iniciar quando o HTML estiver pronto
if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarNeveNatal
    );
} else {
    iniciarNeveNatal();
}