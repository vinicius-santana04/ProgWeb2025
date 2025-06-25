function excluirItemEredirecionar(tipo, id, urlDeRedirecionamento) {
    fetch(`/${tipo}/remove/${id}`, {
        method: 'POST'
    })
    .then(async (response) => {
        if (response.ok) {
            console.log(`${tipo} com id ${id} foi excluído com sucesso.`);
            window.location.href = urlDeRedirecionamento;
        } else {
            const errorData = await response.json();
            alert(errorData.message || `Erro ao excluir o ${tipo}.`);
        }
    })
    .catch(error => {
        console.error('Erro de conexão:', error);
        alert('Um erro de conexão impediu a exclusão.');
    });
}

function excluirItem(tipo, id) {
    fetch(`/${tipo}/remove/${id}`, {
        method: 'POST'
    })
    .then(async (response) => {
        if (response.ok) {
            console.log(`${tipo} com id ${id} foi excluído com sucesso.`);
            window.location.reload();
        } else {
            const errorData = await response.json();
            console.error(`Erro ao excluir o ${tipo}. Status: ${response.status}`);
            
            alert(errorData.message); 
        }
    })
    .catch(error => {
        console.error('Erro de conexão na requisição fetch:', error);
        alert('Um erro de conexão impediu a exclusão.');
    });
}