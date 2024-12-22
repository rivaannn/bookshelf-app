const books = [];
const RENDER_EVENT = "render-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function findBook(bookId) {
  for (const book of books) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData !== null) {
    const data = JSON.parse(serializedData);
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("bookForm");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
    event.target.reset();
  });

  const searchForm = document.getElementById("searchBook");

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = parseInt(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    title,
    author,
    year,
    isComplete
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function makeBookElement(bookObject) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = bookObject.title;
  bookTitle.setAttribute("data-testid", "bookItemTitle");

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = `Penulis: ${bookObject.author}`;
  bookAuthor.setAttribute("data-testid", "bookItemAuthor");

  const bookYear = document.createElement("p");
  bookYear.innerText = `Tahun: ${bookObject.year}`;
  bookYear.setAttribute("data-testid", "bookItemYear");

  const container = document.createElement("div");
  container.append(bookTitle, bookAuthor, bookYear);

  const actionContainer = document.createElement("div");

  const toggleButton = document.createElement("button");
  toggleButton.innerHTML = bookObject.isComplete
    ? '<i class="fas fa-undo-alt"></i>'
    : '<i class="fas fa-check"></i>';
  toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
  toggleButton.addEventListener("click", function () {
    toggleBookStatus(bookObject.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.addEventListener("click", function () {
    removeBook(bookObject.id);
  });

  actionContainer.append(toggleButton, deleteButton);
  container.append(actionContainer);

  container.setAttribute("data-bookid", bookObject.id);
  container.setAttribute("data-testid", "bookItem");

  return container;
}

function toggleBookStatus(bookId) {
  const book = findBook(bookId);
  if (book == null) return;
  book.isComplete = !book.isComplete;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(bookId) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex === -1) return;
  books.splice(bookIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function searchBook() {
  const query = document.getElementById("searchBookTitle").value.toLowerCase();
  const incompleteBooks = document.getElementById("incompleteBookList");
  const completeBooks = document.getElementById("completeBookList");

  incompleteBooks.innerHTML = "";
  completeBooks.innerHTML = "";

  for (const book of books) {
    if (book.title.toLowerCase().includes(query)) {
      const bookElement = makeBookElement(book);
      if (!book.isComplete) {
        incompleteBooks.append(bookElement);
      } else {
        completeBooks.append(bookElement);
      }
    }
  }
}

function displayEmptyMessage() {
  const incompleteBooks = document.getElementById("incompleteBookList");
  const completeBooks = document.getElementById("completeBookList");

  if (incompleteBooks.children.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.innerText = "Tidak ada buku yang ditemukan.";
    incompleteBooks.append(emptyMessage);
  }

  if (completeBooks.children.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.innerText = "Tidak ada buku yang ditemukan.";
    completeBooks.append(emptyMessage);
  }
}

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBooks = document.getElementById("incompleteBookList");
  const completeBooks = document.getElementById("completeBookList");

  incompleteBooks.innerHTML = "";
  completeBooks.innerHTML = "";

  for (const book of books) {
    const bookElement = makeBookElement(book);
    if (!book.isComplete) {
      incompleteBooks.append(bookElement);
    } else {
      completeBooks.append(bookElement);
    }
  }

  displayEmptyMessage();
});
