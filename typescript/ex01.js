function calcular() {
    var inputRaio = document.getElementById("raio");
    var inputArea = document.getElementById("area");
    var inputCircunferencia = document.getElementById("circunferencia");
    if (!inputRaio || !inputArea || !inputCircunferencia) {
        alert("Erro ao acessar os elementos do formulário.");
        return;
    }
    var raio = parseFloat(inputRaio.value);
    if (isNaN(raio) || raio < 0) {
        alert("Por favor, informe um raio válido.");
        return;
    }
    var area = Math.PI * Math.pow(raio, 2);
    var circunferencia = 2 * Math.PI * raio;
    inputArea.value = area.toFixed(2);
    inputCircunferencia.value = circunferencia.toFixed(2);
}
