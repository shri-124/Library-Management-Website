function showDocumentFields() {
    const documentType = document.getElementById('update-document-type').value;
    const updateFields = document.getElementById('update-fields');
    updateFields.innerHTML = ''; // Clear previous fields

    switch (documentType) {
        case 'book':
            updateFields.innerHTML = `
                <div class="input-group">
                    <label for="update-title">Book Title:</label>
                    <input type="text" id="update-title" name="update-title" required>
                </div>
                <div class="input-group">
                    <label for="update-authors">Authors:</label>
                    <input type="text" id="update-authors" name="update-authors" required>
                </div>
                <div class="input-group">
                    <label for="update-isbn">ISBN:</label>
                    <input type="text" id="update-isbn" name="update-isbn" required>
                </div>
                <div class="input-group">
                    <label for="update-publisher">Publisher:</label>
                    <input type="text" id="update-publisher" name="update-publisher" required>
                </div>
                <div class="input-group">
                    <label for="update-year">Year:</label>
                    <input type="text" id="update-year" name="update-year" required>
                </div>
                <div class="input-group">
                    <label for="update-pages">Number of Pages:</label>
                    <input type="text" id="update-pages" name="update-pages" required>
                </div>
            `;
            break;
        case 'magazine':
            updateFields.innerHTML = `
                <div class="input-group">
                    <label for="update-title">Magazine Title:</label>
                    <input type="text" id="update-title" name="update-title" required>
                </div>
                <div class="input-group">
                    <label for="update-isbn">ISBN:</label>
                    <input type="text" id="update-isbn" name="update-isbn" required>
                </div>
                <div class="input-group">
                    <label for="update-publisher">Publisher:</label>
                    <input type="text" id="update-publisher" name="update-publisher" required>
                </div>
                <div class="input-group">
                    <label for="update-year">Year:</label>
                    <input type="text" id="update-year" name="update-year" required>
                </div>
                <div class="input-group">
                    <label for="update-year">Month:</label>
                    <input type="text" id="update-month" name="update-month" required>
                </div>
            `;
            break;
        case 'journal':
            updateFields.innerHTML = `
                <div class="input-group">
                    <label for="update-title">Journal Title:</label>
                    <input type="text" id="update-title" name="update-title" required>
                </div>
                <div class="input-group">
                    <label for="update-name">Name:</label>
                    <input type="text" id="update-name" name="update-name" required>
                </div>
                <div class="input-group">
                    <label for="update-authors">Authors:</label>
                    <input type="text" id="update-authors" name="update-authors" required>
                </div>
                <div class="input-group">
                    <label for="update-year">Year:</label>
                    <input type="text" id="update-year" name="update-year" required>
                </div>
                <div class="input-group">
                    <label for="update-issue">Issue Number:</label>
                    <input type="text" id="update-issue" name="update-issue" required>
                </div>
                <div class="input-group">
                    <label for="update-publisher">Publisher:</label>
                    <input type="text" id="update-publisher" name="update-publisher" required>
                </div>
            `;
            break;
    }
}

function insertDocument() {
    alert('Inserting new document...');
}

function updateDocument() {
    alert('Updating document...');
}

function deleteCopies() {
    const title = document.getElementById('update-title').value;
    if (!title) {
        alert('Please specify the document title to update.');
        return;
    }
    document.getElementById('update-copies').value = 0;
    alert('Setting number of copies to zero for: ' + title);
}

function insertBook() {
    const title = document.getElementById('book-title').value;
    const authors = document.getElementById('book-authors').value;
    const isbn = document.getElementById('book-isbn').value;
    const publisher = document.getElementById('book-publisher').value;
    const year = document.getElementById('book-year').value;
    const pages = document.getElementById('book-pages').value;
    const copies = document.getElementById('book-copies').value;

    const data = {
        title, authors, isbn, publisher, year, pages, copies
    };

    fetch('/insert-book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Document successfully inserted');
            console.log(data.message);
        } else {
            throw new Error(data.message);
        }
    })
    .catch(error => {
        console.error('Error inserting document:', error);
        alert('Failed to insert document. Please try again.');
    });
}

async function insertMagazine() {
    // Get the values from the form
    const title = document.getElementById('magazine-title').value;
    const isbn = document.getElementById('magazine-isbn').value;
    const publisher = document.getElementById('magazine-publisher').value;
    const year = document.getElementById('magazine-year').value;
    const month = document.getElementById('magazine-month').value; // ID corrected
    const copies = document.getElementById('magazine-copies').value;

    // Construct the body for the POST request
    const magazineData = {
        title: title,
        isbn: isbn,
        publisher: publisher,
        year: year,
        month: month,
        copies: parseInt(copies, 10)
    };

    // Call the server to insert the magazine
    fetch('/insert-magazine', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(magazineData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Magazine inserted successfully.');
            // Clear the form or redirect as needed
        } else {
            alert('Failed to insert the magazine. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error inserting the magazine:', error);
    });

    // Prevent the form from submitting traditionally
    return false;
}

function insertJournal() {
    const title = document.getElementById('journal-title').value;
    const name = document.getElementById('journal-name').value;
    const authors = document.getElementById('journal-authors').value;
    const year = document.getElementById('journal-year').value;
    const issueNumber = document.getElementById('journal-issue').value;
    const publisher = document.getElementById('journal-publisher').value;
    const copies = document.getElementById('journal-copies').value;

    const journalData = {
        title: title,
        name: name,
        authors: authors,
        year: year,
        issueNumber: parseInt(issueNumber, 10),
        publisher: publisher,
        copies: parseInt(copies, 10)
    };

    fetch('/insert-journal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(journalData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Journal article inserted successfully.');
        } else {
            alert('Failed to insert the journal article. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error inserting the journal article:', error);
    });

    return false; // Prevent default form submission
}

function updateDocument(event) {
    event.preventDefault();  // Prevent the default form submission

    const documentType = document.getElementById('update-document-type').value;
    const formData = new FormData(document.getElementById('update-document-form'));
    const url = '/update-document';  // Your server endpoint to handle updates

    // Creating an object to hold form data
    let data = {
        documentType: documentType,
        title: formData.get('update-title'),
        authors: formData.get('update-authors'),
        isbn: formData.get('update-isbn'),
        publisher: formData.get('update-publisher'),
        year: formData.get('update-year'),
    };

    if (documentType === 'book') {
        data.pages = formData.get('update-pages');
    } else if (documentType === 'magazine') {
        data.month = formData.get('update-month');
    } else if (documentType === 'journal') {
        data.name = formData.get('update-name');
        data.issue = formData.get('update-issue');
    }

    // Send data to the server
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Document updated successfully!');
        } else {
            alert('Failed to update document.');
        }
    })
    .catch(error => {
        console.error('Error updating document:', error);
        alert('Error updating document.');
    });
}


function deleteCopies() {
    const title = document.getElementById('delete-title').value;
    const copiesToDelete = document.getElementById('delete-copies').value;
    const documentType = document.getElementById('document-type').value;
    
    if (!title || !copiesToDelete || !documentType) {
      alert('Please fill in all fields.');
      return;
    }
  
    if (copiesToDelete <= 0) {
      alert('Number of copies to delete must be greater than 0.');
      return;
    }
  
    // Construct the data to send in the POST request
    const data = {
      title: title,
      copiesToDelete: parseInt(copiesToDelete, 10),
      documentType: documentType
    };
  
    // Call the server to delete the copies
    fetch('/delete-copies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Successfully deleted copies.');
      } else {
        alert('Failed to delete copies. ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error deleting copies:', error);
    });
  }

  // Initialize fields on document load
document.addEventListener('DOMContentLoaded', function() {
    showDocumentFields(); // Call initially to set up the correct fields
});