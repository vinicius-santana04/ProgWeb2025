function desenharGrafico() {
    const inputs = document.querySelectorAll(".altura");
    const largura = parseInt(document.getElementById("largura").value.trim());

    const alturas = Array.from(inputs).map(input => parseInt(input.value));

    if (alturas.some(isNaN) || isNaN(largura)) {
        alert("Por favor, insira todos os valores corretamente.");
        return;
    }

    const grafico = document.getElementById("grafico");
    grafico.innerHTML = "";

    alturas.forEach(altura => {
        const barra = document.createElement("div");
        barra.className = "barra";
        barra.style.width = `${largura}px`;
        barra.style.height = `${altura}px`;
        grafico.appendChild(barra);
    });
}