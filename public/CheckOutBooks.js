// let availableBooks = [
//     { title: "Pride and Prejudice", copies: 3 },
//     { title: "1984", copies: 2 },
//     { title: "The Catcher in the Rye", copies: 1 }
// ];

// let checkedOutBooks = [
//     { title: "The Great Gatsby", dueDate: "April 30, 2024" },
//     { title: "To Kill a Mockingbird", dueDate: "May 15, 2024" },
//     { title: "Pride and Prejudice", dueDate: "May 16, 2024" }
// ];

let selectedBook = null;
let clientEmail = '';

function showOptions(bookElement) {
    selectedBook = bookElement;
    document.getElementById('modal').style.display = 'block';
}

function hideModal() {
    document.getElementById('modal').style.display = 'none';
}

// function returnBook() {
//     const titleElement = selectedBook.querySelector('.title');
//     if (!titleElement) {
//         console.error('Title element not found:', selectedBook);
//         return; // Exit the function if the title element is not found
//     }
//     const title = titleElement.textContent.trim();
//     const bookEntries = document.querySelectorAll('.available-books .book-entry');

//     let found = false;
//     bookEntries.forEach(entry => {
//         const bookTitleElement = entry.querySelector('.title');
//         if (bookTitleElement && bookTitleElement.textContent.trim() === title) {
//             const copiesCount = entry.querySelector('.copies');
//             if (copiesCount) {
//                 const matches = copiesCount.textContent.match(/\d+/); // Get the first match for digits
//                 if (matches) {
//                     const currentCopies = parseInt(matches[0], 10);
//                     copiesCount.textContent = 'copies: ' + (currentCopies + 1);
//                     found = true;
//                 } else {
//                     console.error('No numeric value found in copies text:', copiesCount.textContent);
//                 }
//             } else {
//                 console.error('Copies element not found in entry:', entry);
//             }
//         }
//     });

//     if (!found) {
//         const newLi = document.createElement('li');
//         newLi.innerHTML = `<div class="book-entry">
//             <span class="title">${title}</span>
//             <span class="copies">copies: 1</span>
//         </div>`;
//         document.querySelector('.available-books ul').appendChild(newLi);
//     }

//     selectedBook.remove(); // Remove the book from the checked-out section
//     hideModal();
// }

function returnBook() {
    const titleElement = selectedBook.querySelector('.title');
    const documentID = selectedBook.getAttribute('id');

    if (!titleElement) {
        console.error('Title element not found:', selectedBook);
        return;
    }

    const title = titleElement.textContent.trim();

    // Call the server to update the book's status
    fetch('/return-book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ documentID: documentID}) // Send document ID to the server
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            updateAvailableBooksUI(title); // Update UI to reflect the return
            selectedBook.remove(); // Remove the book from the checked-out section
            hideModal();
        } else {
            alert('Failed to return the book. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error returning the book:', error);
    });
}

function updateAvailableBooksUI(title) {
    const bookEntries = document.querySelectorAll('.available-books .book-entry');
    let found = false;

    bookEntries.forEach(entry => {
        const bookTitleElement = entry.querySelector('.title');
        if (bookTitleElement && bookTitleElement.textContent.trim() === title) {
            const copiesCount = entry.querySelector('.copies');
            if (copiesCount) {
                const matches = copiesCount.textContent.match(/\d+/);
                if (matches) {
                    const currentCopies = parseInt(matches[0], 10);
                    copiesCount.textContent = 'copies: ' + (currentCopies + 1);
                    found = true;
                }
            }
        }
    });

    if (!found) {
        const newLi = document.createElement('li');
        newLi.innerHTML = `<div class="book-entry">
            <span class="title">${title}</span>
            <span class="copies">copies: 1</span>
        </div>`;
        document.querySelector('.available-books ul').appendChild(newLi);
    }
}



function showCheckoutOptions(bookElement) {
    selectedBook = bookElement;
    document.getElementById('checkoutModal').style.display = 'block';
}

function hideCheckoutModal() {
    document.getElementById('checkoutModal').style.display = 'none';
}

function checkOutBook() {
    const titleElement = selectedBook.querySelector('.title');
    if (!titleElement) {
        console.error('Title element not found:', selectedBook);
        return;
    }
    const title = titleElement.textContent.trim();
    const copiesElement = selectedBook.querySelector('.copies');
    if (!copiesElement) {
        alert('Copies element not found:', selectedBook);
        return; // Exit if no copies element found
    }
    const copies = parseInt(copiesElement.textContent.match(/\d+/)[0]);

    if (copies <= 0) {
        alert("No copies available.");
        hideCheckoutModal();
        return;
    }

    const checkedOutBooks = document.querySelectorAll('.checked-out .title');
    let alreadyCheckedOut = Array.from(checkedOutBooks).some(el => el.textContent.trim() === title);

    if (alreadyCheckedOut) {
        alert("You have already checked out a copy of this book.");
        hideCheckoutModal();
        return;
    }

    // Reduce copies or remove entry if only one left
    if (copies > 1) {
        copiesElement.textContent = 'copies: ' + (copies - 1);
    } else {
        selectedBook.remove(); // Remove the book entry if no more copies left
    }

    // Move or add book to the checked-out section
    const newLi = document.createElement('li');
    newLi.innerHTML = `<div class="book-entry">
        <span class="title">${title}</span>
        <span class="due-date">${calculateDueDate()}</span>
    </div>`;
    document.querySelector('.checked-out ul').appendChild(newLi);
    hideCheckoutModal();
}

function calculateDueDate() {
    let date = new Date();
    date.setDate(date.getDate() + 28); // Add four weeks to the current date

    // Create an array of month names to convert numeric months to their name equivalent
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    
    // Format the date as "Month Day, Year"
    const formattedDate = monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();

    return formattedDate; // Return the formatted date string
}

// function loadCheckedOutBooks() {
//     const booksList = document.querySelector('.checked-out ul');
//     booksList.innerHTML = ''; // Clear any existing list items

//     checkedOutBooks.forEach(book => {
//         const li = document.createElement('li');
//         li.innerHTML = `<div class="book-entry">
//             <span class="title">${book.title}</span>
//             <span class="due-date">Due back: ${book.dueDate}</span>
//         </div>`;
//         li.onclick = () => showOptions(li);
//         booksList.appendChild(li);
//     });
// }

async function loadCheckedOutBooks(clientEmail) {
    const booksList = document.querySelector('.checked-out ul');
    booksList.innerHTML = ''; // Clear any existing list items

    try {
        const response = await fetch(`/checked-out-books/${clientEmail}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const checkedOutBooks = await response.json();
        console.log('Received checked-out books:', checkedOutBooks); // Log the JSON data

        if (checkedOutBooks.length === 0) {
            booksList.innerHTML = '<li>No books checked out.</li>';
        }

        checkedOutBooks.forEach(book => {
            const li = document.createElement('li');
            li.innerHTML = `<div class="book-entry">
                <span class="title" id="${book.documentid}">${book.title}</span>
                <span class="due-date">Due back: ${new Date(book.lenddate).toLocaleDateString()}</span>
            </div>`;
            li.onclick = () => showOptions(li);
            booksList.appendChild(li);
        });
    } catch (error) {
        console.error('Failed to load checked-out books:', error);
        booksList.innerHTML = '<li>Error loading books.</li>';
    }
}


// function loadAvailableBooks() {
//     const booksList = document.querySelector('.available-books ul');
//     booksList.innerHTML = ''; // Clear existing list items

//     availableBooks.forEach(book => {
//         const li = document.createElement('li');
//         li.innerHTML = `<div class="book-entry">
//             <span class="title">${book.title}</span>
//             <span class="copies">copies: ${book.copies}</span>
//         </div>`;
//         li.onclick = () => showCheckoutOptions(li); // Attach the checkout function
//         booksList.appendChild(li);
//     });
// }

async function loadAvailableBooks() {
    const booksList = document.querySelector('.available-books ul');
    booksList.innerHTML = ''; // Clear existing list items

    try {
        const response = await fetch('/available-books');
        const availableBooks = await response.json();

        availableBooks.forEach(book => {
            const li = document.createElement('li');
            li.innerHTML = `<div class="book-entry">
                <span class="title" id="${book.documentid}">${book.title}</span>
                <span class="copies">copies: ${book.copies}</span>
            </div>`;
            li.onclick = () => showCheckoutOptions(li); // Attach the checkout function
            booksList.appendChild(li);
        });
    } catch (error) {
        console.error('Failed to load available books:', error);
        booksList.innerHTML = '<li>Error loading books.</li>';
    }
}

// document.addEventListener('DOMContentLoaded', function() {
//     loadCheckedOutBooks();
// });

document.addEventListener('DOMContentLoaded', function() {
    const clientEmail = sessionStorage.getItem('clientEmail'); // Retrieve the email from sessionStorage
    if (clientEmail) {
        loadCheckedOutBooks(clientEmail);
    } else {
        alert('No client email found');
    }

});



// function showCheckoutOptions(bookElement) {
//     selectedBook = bookElement;
//     console.log(selectedBook.innerHTML); // This should show the inner HTML of the clicked book element.
//     document.getElementById('modal').style.display = 'block';
// }

// newLi.onclick = () => {
//     selectedBook = newLi;
//     showCheckoutOptions();
// };