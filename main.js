const APIURL = 'https://livros.acilab.com.br/api/livros/';
let books = [];
let maxId = 0;

function setReload() {
  // TODO: make reload
}

function cleanBooks() {
  // TODO: take out all the books currently visible
}

function insertBook(book) {
  // TODO: insert book to show
}

async function getBooks() {
  setReload();
  const response = await fetch(APIURL);

  if (!response.ok) {
    // TODO: something
  }

  cleanBooks();
  const result = await response.json();
  for (let i = 0; i < result.length; i++) {
    insertBook(result[i]);
  }
}

async function getBooks(books) {
  setReload();
  cleanBooks();
  for (let i = 0; i < books.length; i++) {
    insertBook(result[i]);
  }
}

async function getBook(id) {
  const response = await fetch(APIURL + id.toString());

  if (!response.ok) {
    // TODO: something
  }

  const result = await response.json();
  return result;
}

async function postBook(book) {
  const response = await fetch(APIURL, {
    method: "POST",
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    // TODO: something
  }

  books.push(book);
  await getBooks(book);
}

async function editBook(id, book) {
  const response = await fetch(APIURL + id.toString(), {
    method: "PUT",
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    // TODO: something
  }

  for (let i = 0; i < books.length; i++) {
    if (books[i].id === id) {
      books[i] = book;
    }
  }
}

async function deleteBook(book) {
  const response = await fetch(APIURL + id.toString(), {
    method: "DELETE",
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    // TODO: something
  }

  for (let i = 0; i < books.length; i++) {
    if (books[i].id === id) {
      books.splice(i, 1);
    }
  }
}
