
/* =====================================
   CHOQUE NO SISTEMA REMAKE
   SISTEMA DE SALVAMENTO V1.0
===================================== */

window.Salvamento = {

  chave: "choque_remake_save_v1",

  // Salvar progresso
  salvar(dados) {
    try {
      const progresso = {
        versao: 1,
        ...dados,
        dataSalvamento: Date.now()
      };

      localStorage.setItem(
        this.chave,
        JSON.stringify(progresso)
      );

      console.log("Checkpoint salvo!", progresso);
      return true;

    } catch (erro) {
      console.error("Erro ao salvar:", erro);
      return false;
    }
  },

  // Carregar progresso
  carregar() {
    try {
      const dados = localStorage.getItem(this.chave);

      if (!dados) return null;

      const progresso = JSON.parse(dados);

      if (
        !progresso ||
        progresso.versao !== 1 ||
        !Number.isFinite(progresso.checkpointX) ||
        !Number.isFinite(progresso.checkpointY)
      ) {
        return null;
      }

      return progresso;

    } catch (erro) {
      console.error("Erro ao carregar:", erro);
      return null;
    }
  },

  // Verificar se existe salvamento válido
  existe() {
    return this.carregar() !== null;
  }

};
