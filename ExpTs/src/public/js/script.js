function deletarCurso(idDoCursoParaDeletar) {
    const confirmacao = window.confirm("Você tem certeza que deseja deletar este curso? Esta ação não pode ser desfeita.");

    if (confirmacao) {
        fetch(`/major/remove/${idDoCursoParaDeletar}`, {
            method: 'POST'
        })
        .then(response => {
            if (response.ok) {
                console.log('Curso deletado com sucesso');
                window.location.reload();
            } else {
                console.error('Ocorreu um erro ao tentar deletar o curso.');
                alert('Não foi possível deletar o curso. Tente novamente.');
            }
        })
        .catch(error => {
            console.error('Erro na requisição fetch:', error);
            alert('Um erro de conexão impediu a exclusão do curso.');
        });
    } else {
        console.log('Ação de deletar foi cancelada pelo usuário.');
    }
}