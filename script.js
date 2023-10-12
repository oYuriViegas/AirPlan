document.querySelectorAll(".mostrarBtn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var targetId = btn.getAttribute("data-target");
    var conteudo = document.getElementById(targetId);

    // Se o botão clicado estiver na raiz (ou seja, não é um botão interno), esconda todas as seções principais
    if (btn.closest(".conteudoEscondido") === null) {
      document
        .querySelectorAll(".conteudoEscondido")
        .forEach(function (section) {
          section.style.display = "none";
        });
    } else {
      // Se é um botão interno, esconda apenas os outros botões internos dentro da mesma seção principal
      btn
        .closest(".conteudoEscondido")
        .querySelectorAll(".conteudoEscondido")
        .forEach(function (section) {
          section.style.display = "none";
        });
    }

    // Mostra ou esconde a seção alvo, dependendo do seu estado atual
    if (conteudo.style.display === "none" || conteudo.style.display === "") {
      conteudo.style.display = "block";
    } else {
      conteudo.style.display = "none";
    }
  });
});
