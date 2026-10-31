
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
