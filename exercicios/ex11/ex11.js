const maxPontos = 8;
const pontos = [];

document.addEventListener("mousemove", function(event) {
    const ponto = document.createElement("div");
    ponto.className = "ponto";
    ponto.style.left = event.pageX + "px";
    ponto.style.top = event.pageY + "px";
    document.body.appendChild(ponto);

    pontos.push(ponto);

    if (pontos.length > maxPontos) {
        const antigo = pontos.shift();
        document.body.removeChild(antigo);
    }
});