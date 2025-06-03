const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv-flow').config();

const PORT = process.env.PORT ?? 3333;
const diretorio = process.argv[2];

if (!diretorio) {
    console.error('Uso: node listarArquivosServidor.js <caminho-do-diretorio>');
    process.exit(1);
}


function createLink(filename) {
    return `<a href="/${encodeURIComponent(filename)}">${filename}</a><br>\n`;
}

const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url);

    if (urlPath === '/') {
        fs.readdir(diretorio, { withFileTypes: true }, (err, arquivos) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Erro ao ler o diretório: ${err.message}`);
                return;
            }

            const lista = arquivos.map(arquivo => {
                const tipo = arquivo.isDirectory() ? '📁' : '📄';
                return `<li>${tipo} ${createLink(arquivo.name)}</li>`;
            }).join('');

            const html = `
                <html>
                    <head><meta charset="utf-8"><title>Conteúdo de ${diretorio}</title></head>
                    <body>
                        <h1>Conteúdo de: ${diretorio}</h1>
                        <ul>${lista}</ul>
                    </body>
                </html>
            `;

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        });

    } else {
        const arquivoPath = path.join(diretorio, urlPath);

        fs.stat(arquivoPath, (err, stats) => {
            if (err || !stats.isFile()) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Arquivo não encontrado.');
                return;
            }

            fs.readFile(arquivoPath, 'utf8', (err, conteudo) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end(`Erro ao ler o arquivo: ${err.message}`);
                    return;
                }

                const html = `
                    <html>
                        <head><meta charset="utf-8"><title>${urlPath}</title></head>
                        <body>
                            <h1>Conteúdo de: ${urlPath}</h1>
                            <pre style="background:#eee; padding:1em;">${conteudo.replace(/</g, '&lt;')}</pre>
                            <p><a href="/">Voltar</a></p>
                        </body>
                    </html>
                `;

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html);
            });
        });
    }
});

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}/`);
    console.log(`Listando conteúdo de: ${diretorio}`);
});