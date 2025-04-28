function jogar() {
    let pontuacao = 0;
    const opcoes = ["Papel", "Pedra", "Tesoura"];

    while (true) {
        let jogador = parseInt(prompt("Escolha sua jogada:\n1 - Papel\n2 - Pedra\n3 - Tesoura"));

        if (jogador < 1 || jogador > 3 || isNaN(jogador)) {
            alert("Jogada inválida! Você perdeu o jogo.");
            break;
        }

        let computador = Math.floor(Math.random() * 3) + 1;

        alert(`Você escolheu: ${opcoes[jogador - 1]}\nComputador escolheu: ${opcoes[computador - 1]}`);

        if (jogador === computador) {
            alert("Empate! Continue jogando.");
            continue;
        } else if (
            (jogador === 1 && computador === 2) ||
            (jogador === 2 && computador === 3) ||
            (jogador === 3 && computador === 1)
        ) {
            pontuacao++;
            alert(`Você ganhou essa rodada! Pontuação atual: ${pontuacao}`);
        } else {
            alert("Você perdeu essa rodada! Fim de jogo.");
            continue;
        }
    }

    alert(`Sua pontuação final foi: ${pontuacao}`);
}