const APIURL = 'https://livros.acilab.com.br/api/livros/';

const bookTable = document.getElementById('tabela-livros');
const bookList = bookTable.children[1];
const loadingMessage = document.getElementById('loading');
const emptyList = document.getElementById('lista-vazia');
const ocultoTag = 'oculto';

let books = [];
let maxId = -1;

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
      books.push(book);
      if (maxId < book.id) maxId = book.id;
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
}

async function getBook(id) {
  const response = await fetch(APIURL + id.toString());

  if (!response.ok) {
    console.log("error");
    return;
    // TODO: something
  }

  const result = await response.json();
  return result;
}

async function postBook(book) {
  await fetch(APIURL, {
    method: "POST",
    body: JSON.stringify(book),
  }).then(blob => blob.json()).then(json => {
    console.log(json);
    books.push(json);
    if (json.id > maxId) maxId = json.id;
    getBooksCache();
  }).catch(e => { console.log(e) });
}

async function editBook(id, book) {
  const response = await fetch(APIURL + id.toString(), {
    method: "PUT",
    body: JSON.stringify(book),
  })

  if (!response.ok) {
    console.log("error");
    return;
    // TODO: something
  }

  for (let i = 0; i < books.length; i++) {
    if (books[i].id === id) {
      books[i] = book;
    }
  }
}

async function deleteBook(book) {
  await fetch(APIURL + id.toString(), {
    method: "DELETE",
    body: JSON.stringify(book),
  }).then(blob => blob.json()).then(json => {
    for (let i = 0; i < books.length; i++) {
      if (books[i].id === json.id) {
        books.splice(i, 1);
      }
      cleanBooks();
      getBooksCache();
    }
  })
}

getBooks();

document.getElementById('livro-form').onsubmit = async (event) => {
  event.preventDefault();
  const result = {};

  const data = new FormData(event.target);
  for (const [key, value] of data.entries()) {
    result[key] = value;
  }
  result.id = maxId + 1;
  await postBook(result);
}
