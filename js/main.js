document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  // 1. CAPTURA DOS PARÂMETROS DINÂMICOS DA URL
  const urlParams = new URLSearchParams(window.location.search);
  let nomeConvidado = urlParams.get('nome') || "Convidado Especial";
  let totalVagas = parseInt(urlParams.get('vagas')) || 2;

  // Injetar dados lidos diretamente no painel inferior
  $("nomeConvidadoTela").textContent = nomeConvidado;
  $("textoVagasTela").textContent = totalVagas > 1
    ? `Este convite é válido para até ${totalVagas} pessoas.`
    : `Este convite é válido para 1 pessoa.`;

  // 2. CONTROLO DO SELETOR DE VAGAS ADICIONAIS
  const wrapperAcompanhantes = $("wrapperAcompanhantes");
  const selectAcompanhantes = $("selectAcompanhantes");
  const radioSim = $("radioSim");
  const radioNao = $("radioNao");

  selectAcompanhantes.innerHTML = "";
  if (totalVagas > 1) {
    for (let i = 1; i <= totalVagas; i++) {
      let option = document.createElement("option");
      option.value = i;
      option.textContent = i === 1 ? "Apenas 1 pessoa (Eu sozinho/a)" : `${i} pessoas`;
      selectAcompanhantes.appendChild(option);
    }
  }

  radioSim.addEventListener("change", () => {
    if (totalVagas > 1) {
      wrapperAcompanhantes.classList.remove("hidden");
    }
  });

  radioNao.addEventListener("change", () => {
    wrapperAcompanhantes.classList.add("hidden");
    selectAcompanhantes.value = "";
  });

  // 3. ENVIO DOS DADOS DIRETO PARA O WHATSAPP
  const whatsappDono = "258873144454";

  $("whatsappLink").addEventListener("click", (e) => {
    e.preventDefault();

    if (!radioSim.checked && !radioNao.checked) {
      alert("Por favor, seleciona se vais comparecer ou não antes de enviar!");
      return;
    }

    let presencaStatus = radioSim.checked ? "Confirmado" : "Ausente";
    let textoAcompanhantes = "";

    if (presencaStatus === "Confirmado") {
      let quantidadeSelecionada = totalVagas > 1 ? selectAcompanhantes.value : 1;
      textoAcompanhantes = `\nTotal de pessoas: ${quantidadeSelecionada}`;
    } else {
      textoAcompanhantes = `\nInfelizmente não poderei comparecer.`;
    }

    const mensagem = `Olá Ana Lúcia!\n\nEstou a responder ao convite do teu aniversário de 25 anos.\n\nStatus: ${presencaStatus}\nConvidado: ${nomeConvidado}${textoAcompanhantes}`;

    const urlFinal = `https://wa.me/${whatsappDono}?text=${encodeURIComponent(mensagem)}`;

    window.open(urlFinal, '_blank');
  });

  // 4. ANIMAÇÃO DE ABERTURA HORIZONTAL DO ENVELOPE
  $("openEnvelope").addEventListener("click", () => {
    const button = $("openEnvelope");
    if (button.classList.contains("opened")) return;

    button.classList.add("opened");
    $("openHint").textContent = "A abrir o teu convite…";

    window.setTimeout(() => {
      $("invitation").classList.remove("hidden");
      $("invitation").scrollIntoView({ behavior: "smooth", block: "start" });
      $("openHint").textContent = "Convite aberto";
    }, 1100);
  });

  // 5. CONTAGEM DECRESCENTE DO RELÓGIO (Festa a 21 de Novembro de 2026)
  const dataEvento = new Date("2026-11-21T14:00:00").getTime();

  function updateCountdown() {
    const diff = dataEvento - Date.now();

    if (diff <= 0) {
      $("countdown").innerHTML = "<p style='color:var(--rose-dark); font-weight:600;'>É hoje! Chegou o grande dia! ♡</p>";
      return;
    }

    const dias = Math.floor(diff / 86400000);
    const horas = Math.floor((diff % 86400000) / 3600000);
    const minutos = Math.floor((diff % 3600000) / 60000);
    const segundos = Math.floor((diff % 60000) / 1000);

    $("days").textContent = String(dias).padStart(2, "0");
    $("hours").textContent = String(horas).padStart(2, "0");
    $("minutes").textContent = String(minutos).padStart(2, "0");
    $("seconds").textContent = String(segundos).padStart(2, "0");
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // 6. DOWNLOAD DO CONVITE EM PDF (link direto para o ficheiro)
  const botaoPdf = $("downloadPdf");

  if (botaoPdf) {
    botaoPdf.addEventListener("click", (e) => {
      // Se o botão for um <a>, deixa o browser tratar do download.
      // Se for um <button>, força o download via window.location.
      if (botaoPdf.tagName === "A") {
        // Já tem href="convite.pdf" e download — nada a fazer.
        return;
      }

      e.preventDefault();
      const link = document.createElement("a");
      link.href = "convite.pdf";
      link.download = "Convite-Ana-Lucia-25-Anos.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
});