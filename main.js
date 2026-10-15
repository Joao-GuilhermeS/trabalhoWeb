const APIURL = 'https://livros.acilab.com.br/api/livros/';
let books = [];
let maxId = 0;

function clearMessage() {
  const message = document.getElementById('mensagem');
  message.textContent = '';
  message.className = 'oculto';
}

function showError(error) {
  const message = document.getElementById('mensagem');
  const errorMessage = error instanceof Error && error.message
    ? error.message
    : 'Ocorreu um erro. Tente novamente.';

  message.textContent = errorMessage;
  message.className = 'erro';
  console.error(error);
}

async function requestApi(url, options) {
  let response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique sua conexão e tente novamente.');
  }

  if (!response.ok) {
    throw new Error(`A API retornou um erro (HTTP ${response.status}).`);
  }

  return response;
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    throw new Error('A API retornou uma resposta inválida. Tente novamente.');
  }
}

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
  clearMessage();

  try {
    setReload();
    const response = await requestApi(APIURL);
    const result = await readJson(response);

    cleanBooks();
    for (let i = 0; i < result.length; i++) {
      insertBook(result[i]);
    }
  } catch (error) {
    showError(error);
    throw error;
  }
}

async function getBook(id) {
  clearMessage();

  try {
    const response = await requestApi(APIURL + id.toString());
    return await readJson(response);
  } catch (error) {
    showError(error);
    throw error;
  }
}

async function postBook(book) {
  clearMessage();

  try {
    await requestApi(APIURL, {
      method: "POST",
      body: JSON.stringify(book),
    });

    books.push(book);
    await getBooks();
  } catch (error) {
    showError(error);
    throw error;
  }
}

async function editBook(id, book) {
  clearMessage();

  try {
    await requestApi(APIURL + id.toString(), {
      method: "PUT",
      body: JSON.stringify(book),
    });

    for (let i = 0; i < books.length; i++) {
      if (books[i].id === id) {
        books[i] = book;
      }
    }
  } catch (error) {
    showError(error);
    throw error;
  }
}

async function deleteBook(book) {
  clearMessage();

  try {
    await requestApi(APIURL + book.id.toString(), {
      method: "DELETE",
      body: JSON.stringify(book),
    });

    for (let i = 0; i < books.length; i++) {
      if (books[i].id === book.id) {
        books.splice(i, 1);
      }
    }
  } catch (error) {
    showError(error);
    throw error;
  }
}
