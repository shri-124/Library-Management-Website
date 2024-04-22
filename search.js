function submitSearch() {
    var searchInput = document.getElementById('search-input');
    alert(searchInput.value);
    const words = searchInput.value.split(' ');
    let sqlQuery = "SELECT * FROM documents WHERE ";
    let andParts = []; // To store all "AND" conditions
    let orParts = [];  // To store all "OR" conditions
    let currentPart = []; // To build the current condition

    for (let i = 0; i < words.length; i++) {
        let word = words[i].toUpperCase(); // Make it case-insensitive

        if (word === 'AND') {
            // When 'AND' is found, join currentPart into andParts and reset currentPart
            if (currentPart.length > 0) {
                andParts.push(currentPart.join(' '));
                currentPart = [];
            }
        } else if (word === 'OR') {
            // When 'OR' is found, complete the AND part and reset for next condition
            if (currentPart.length > 0) {
                andParts.push(currentPart.join(' '));
                currentPart = [];
            }
            if (andParts.length > 0) {
                orParts.push('(' + andParts.join(' AND ') + ')');
                andParts = [];
            }
        } else {
            // Assume every other word is a keyword
            currentPart.push("attribute LIKE '%" + word + "%'");
        }
    }

    // Handle the final parts that were being built when the loop finished
    if (currentPart.length > 0) {
        andParts.push(currentPart.join(' '));
    }
    if (andParts.length > 0) {
        orParts.push('(' + andParts.join(' AND ') + ')');
    }

    // Build the full SQL query
    sqlQuery += orParts.join(' OR ');

    alert(sqlQuery);
}