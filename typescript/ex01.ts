function calcular(): void {
    const inputRaio = document.getElementById("raio") as HTMLInputElement | null;
    const inputArea = document.getElementById("area") as HTMLInputElement | null;
    const inputCircunferencia = document.getElementById("circunferencia") as HTMLInputElement | null;

    if (!inputRaio || !inputArea || !inputCircunferencia) {
        alert("Erro ao acessar os elementos do formulário.");
        return;
    }

    const raio = parseFloat(inputRaio.value);
    if (isNaN(raio) || raio < 0) {
        alert("Por favor, informe um raio válido.");
        return;
    }

    const area = Math.PI * Math.pow(raio, 2);
    const circunferencia = 2 * Math.PI * raio;

    inputArea.value = area.toFixed(2);
    inputCircunferencia.value = circunferencia.toFixed(2);
}