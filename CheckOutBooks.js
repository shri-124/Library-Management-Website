function showOptions(bookElement) {
    selectedBook = bookElement;
    document.getElementById('modal').style.display = 'block';
}

function hideModal() {
    document.getElementById('modal').style.display = 'none';
}

function returnBook() {
    const titleElement = selectedBook.querySelector('.title');
    if (!titleElement) {
        console.error('Title element not found:', selectedBook);
        return; // Exit the function if the title element is not found
    }
    const title = titleElement.textContent.trim();
    const bookEntries = document.querySelectorAll('.available-books .book-entry');

    let found = false;
    bookEntries.forEach(entry => {
        const bookTitleElement = entry.querySelector('.title');
        if (bookTitleElement && bookTitleElement.textContent.trim() === title) {
            const copiesCount = entry.querySelector('.copies');
            if (copiesCount) {
                const matches = copiesCount.textContent.match(/\d+/); // Get the first match for digits
                if (matches) {
                    const currentCopies = parseInt(matches[0], 10);
                    copiesCount.textContent = 'copies: ' + (currentCopies + 1);
                    found = true;
                } else {
                    console.error('No numeric value found in copies text:', copiesCount.textContent);
                }
            } else {
                console.error('Copies element not found in entry:', entry);
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

    selectedBook.remove(); // Remove the book from the checked-out section
    hideModal();
}
