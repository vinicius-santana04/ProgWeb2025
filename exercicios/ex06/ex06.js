for (let i = 1; i <= 10; i++) {
    const tabela = document.createElement('table');
    const thead = document.createElement('thead');
    const linhaHead = document.createElement('tr');
    const th = document.createElement('th');
    th.colSpan = 2;
    th.textContent = `Produtos de ${i}`;

    linhaHead.appendChild(th);
    thead.appendChild(linhaHead);
    tabela.appendChild(thead);

    for (let j = 1; j <= 10; j++) {

        const linha = document.createElement('tr');

        const coluna1 = document.createElement('td');
        coluna1.textContent = `${i}x${j}`;

        const coluna2 = document.createElement('td');
        coluna2.textContent = i * j;

        linha.appendChild(coluna1);
        linha.appendChild(coluna2);

        tabela.appendChild(linha);
    }

    document.body.appendChild(tabela);
}
