document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  // 1. CAPTURA DOS PARÂMETROS DA URL
  const urlParams = new URLSearchParams(window.location.search);
  let nomeConvidado = urlParams.get('nome') || "fabiao Joao ";
  let totalVagas = parseInt(urlParams.get('vagas')) || 1;

  // Injetar dados lidos diretamente no bloco inferior
  $("nomeConvidadoTela").textContent = nomeConvidado;
  $("textoVagasTela").textContent = totalVagas > 1 
    ? `Este convite é válido para até ${totalVagas} pessoas.` 
    : `Este convite é válido para 1 pessoa.`;

  // 2. CONTROLO DO SELETOR DE VAGAS COM BASE NO LINK
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

  // 3. ENVIO DOS DADOS DIRETO PARA O WHATSAPP DA ANA LÚCIA
  const whatsappDono = "258841234567"; // Insere o número com o indicativo do país

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
    
    const urlFinal = `https://wa.me{whatsappDono}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlFinal, '_blank');
  });

  // 4. ANIMAÇÃO DO ENVELOPE
  $("openEnvelope").addEventListener("click", () => {
    const button = $("openEnvelope");
    if (button.classList.contains("opened")) return;
    
    button.classList.add("opened");
    $("openHint").textContent = "A abrir o teu convite…";
    
    window.setTimeout(() => {
      $("invitation").classList.remove("hidden");
      $("invitation").scrollIntoView({ behavior: "smooth", block: "start" });
      $("openHint").textContent = "Convite aberto";
    }, 850);
  });
});
