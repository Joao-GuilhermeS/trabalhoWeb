const APIURL = 'https://livros.acilab.com.br/api/livros/';

const bookTable = document.getElementById('tabela-livros');
const bookList = bookTable.children[1];
const loadingMessage = document.getElementById('loading');
const emptyList = document.getElementById('lista-vazia');
const titleFormInput = document.getElementById('titulo');
const authorFormInput = document.getElementById('autor');
const ocultoTag = 'oculto';

function toggleReload() {
  bookTable.classList.toggle(ocultoTag);
  loadingMessage.classList.toggle(ocultoTag);
  emptyList.classList.toggle(ocultoTag);
}

function cleanBooks() {
  bookList.innerHTML = '';
}

function insertBook(book) {
  const row = document.createElement('tr');

  const id = document.createElement('td');
  id.textContent = book.id;
  row.appendChild(id);

  const title = document.createElement('td');
  title.textContent = book.title;
  row.appendChild(title);

  const author = document.createElement('td');
  author.textContent = book.author;
  row.appendChild(author);

  const actions = document.createElement('td');

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'X';
  deleteButton.onclick = async () => {
    await deleteBook(book.id);
  }
  actions.appendChild(deleteButton);

  const editButton = document.createElement('button');
  editButton.style.backgroundColor = 'orange';
  editButton.onclick = () => {
    const titleRowInput = document.createElement('input');
    titleRowInput.type = 'text';
    titleRowInput.value = book.title;
    title.textContent = '';
    title.appendChild(titleRowInput);

    const authorRowInput = document.createElement('input');
    authorRowInput.type = 'text';
    authorRowInput.value = book.author;
    author.textContent = '';
    author.appendChild(authorRowInput);

    // Fiz assim para evitar criar mais um elemnto, e eu ja vou recarregar tudo de qualquer forma
    // faria diferente se tivesse mais tempo
    deleteButton.style.backgroundColor = 'green';
    deleteButton.innerHTML = '&#10004;';
    deleteButton.onclick = async () => {
      await editBook({
        id: book.id,
        titulo: titleRowInput.value,
        autor: authorRowInput.value,
      });
    };

    editButton.style.backgroundColor = 'red';
    editButton.innerHTML = '&#10006;';
    editButton.onclick = getBooks;
  };
  const editIcon = document.createElement('img');
  editIcon.src = './prancheta.png';
  editIcon.height = 12;
  editIcon.width = 16;
  editButton.appendChild(editIcon);
  actions.appendChild(editButton);

  row.appendChild(actions);

  bookList.appendChild(row);
}

async function getBooks() {
  toggleReload();
  await fetch(APIURL).then(blob => blob.json()).then(json => {
    toggleReload();
    cleanBooks();
    for (let i = 0; i < json.length; i++) {
      const book = { title: json[i].titulo, id: json[i].id, author: json[i].autor };
      insertBook(book);
    }
  })
    .catch(e => { console.log(e) });
}

async function getBooksCache() {
  toggleReload();
  cleanBooks();
  for (let i = 0; i < books.length; i++) {
    insertBook(books[i]);
  }
  toggleReload();
}

async function postBook(book) {
  await fetch(APIURL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(book),
  }).then(getBooks).catch(e => { console.log(e) });
}

async function editBook(book) {
  await fetch(APIURL + book.id.toString(), {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(book),
  }).then(getBooks).catch(e => { console.log(e) });
}

async function deleteBook(id) {
  await fetch(APIURL + id.toString(), {
    method: "DELETE",
  }).then(getBooks)
    .catch(e => { console.log(e) })
}

// load inicial
getBooks();

document.getElementById('livro-form').onsubmit = async (event) => {
  event.preventDefault();
  const result = {};
  result.id = 0;

  const data = new FormData(event.target);
  for (const [key, value] of data.entries()) {
    result[key] = value;
  }
  titleFormInput.value = '';
  authorFormInput.value = '';
  await postBook(result);
}
