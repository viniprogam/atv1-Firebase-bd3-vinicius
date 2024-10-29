// FORMATAÇÃO DOS DADOS INSERIDOS NO INPUTS

document.getElementById('cpf').addEventListener('input', function (e) {
    e.target.value = e.target.value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
});

document.getElementById('rg').addEventListener('input', function (e) {
    e.target.value = e.target.value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1})/, '$1-$2')
        .replace(/(-\d{1})\d+?$/, '$1');
});

document.getElementById('telefoneAluno').addEventListener('input', function (e) {
    e.target.value = e.target.value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4,5})(\d{4})/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
});

document.getElementById('telefoneResponsavel').addEventListener('input', function (e) {
    e.target.value = e.target.value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4,5})(\d{4})/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
});

// EXECUÇÃO DAS TAREFAS

// RENDERIZAÇÃO DA LISTA DE DADOS
const listStudent = document.querySelector('#student-list');

function renderList(doc) {
    let li = document.createElement('li');
    let nome = document.createElement('h1');
    let cpf = document.createElement('span');
    let rg = document.createElement('span');
    let telefoneAluno = document.createElement('span');
    let telefoneResponsavel = document.createElement('span');
    let email = document.createElement('span');
    let dataNascimento = document.createElement('span');
    let excluir = document.createElement('div');

    //CRIA UM ELEMENTO DE TEXTO "X" PARA AÇÃO DE EXCLUSÃO DE ALUNOS
    excluir.textContent = 'Deletar';

    //CARREGA OS DADOS NOS ELEMENTOS HTML:
    li.setAttribute('data-id', doc.id);
    nome.textContent = `Nome: ${doc.data().nome}`;
    cpf.textContent = `CPF: ${doc.data().cpf}`;
    rg.textContent = `RG: ${doc.data().rg}`;
    telefoneAluno.textContent = `Telefone do aluno: ${doc.data().telefoneAluno}`;
    telefoneResponsavel.textContent = `Telefone do responsável: ${doc.data().telefoneResponsavel}`;
    email.textContent = `Email: ${doc.data().email}`;
    
    if (doc.data().dataNascimento && doc.data().dataNascimento.toDate) {
        dataNascimento.textContent = `Data de Nascimento: ${doc.data().dataNascimento.toDate().toLocaleDateString()}`;
    } else {
        dataNascimento.textContent = 'Data não disponível';
    }

    //ADICIONANDO OS DADOS DE AUTOR E TITULO NA TAG LI
    li.appendChild(nome);
    li.appendChild(cpf);
    li.appendChild(rg);
    li.appendChild(telefoneAluno);
    li.appendChild(telefoneResponsavel);
    li.appendChild(email);
    li.appendChild(dataNascimento);

    //INSERE O ELEMENTO DE TEXTO PARA A EXCLUSÃO
    li.appendChild(excluir);

    /* TRATA A AÇÃO DE CLIQUE NO BOTÃO X PARA EXCLUSÃO DO ALUNO */
    excluir.addEventListener('click', (event) => {
        event.stopPropagation();

        let id = event.target.parentElement.getAttribute('data-id');
        //alert(id);
        db.collection('bd3-noSQL-Firestore').doc(id).delete()
            .then(() => { window.location.reload() });
    });

    //ADICIONANDO O LI NA TAG UL:
    listStudent.appendChild(li);
}

// LISTA OS DADOS DA COLEÇÃO FIRESTORE
db.collection('bd3-noSQL-Firestore')
    .get()
    .then((snapshot) => {
        snapshot.docs.forEach(
            doc => {
                renderList(doc);
            }
        );
    });

// INSERÇÃO DE DADOS

/* CAPTURA O ELEMENTO HTML DE FORMULÁRIO */
const form = document.querySelector('#add-student-form');

/* CAPTURA OS DADOS DOS CAMPOS DO FORMULÁRIO PELO EVENTO SUBMIT PARA CADASTRO NO FIRESTORE */
form.addEventListener('submit', (event) => {
    event.preventDefault();

    db.collection('bd3-noSQL-Firestore').add({
        nome: form.nome.value,
        cpf: form.cpf.value,
        rg: form.rg.value,
        telefoneAluno: form.telefoneAluno.value,
        telefoneResponsavel: form.telefoneResponsavel.value,
        email: form.email.value,
        dataNascimento: firebase.firestore.Timestamp.fromDate(new Date(form.dataNascimento.value)), // Convert Date to Timestamp
    }).then(() => {
        form.nome.value = '';
        form.cpf.value = '';
        form.rg.value = '';
        form.telefoneAluno.value = '';
        form.telefoneResponsavel.value = '';
        form.email.value = '';
        form.dataNascimento.value = '';
        window.location.reload();
    });
});
