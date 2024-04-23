const commonWords = [
    "A", "ABOUT", "ABOVE", "AFTER", "AGAIN", "AGAINST", "ALL", "AM", "AN", "AND", "ANY", "ARE", "AREN'T", "AS", "AT", "BE", 
    "BECAUSE", "BEEN", "BEFORE", "BEING", "BELOW", "BETWEEN", "BOTH", "BUT", "BY", "CAN'T", "CANNOT", "COULD", "COULDN'T", 
    "DID", "DIDN'T", "DO", "DOES", "DOESN'T", "DOING", "DON'T", "DOWN", "DURING", "EACH", "FEW", "FOR", "FROM", "FURTHER", 
    "HAD", "HADN'T", "HAS", "HASN'T", "HAVE", "HAVEN'T", "HAVING", "HE", "HE'D", "HE'LL", "HE'S", "HER", "HERE", "HERE'S", 
    "HERS", "HERSELF", "HIM", "HIMSELF", "HIS", "HOW", "HOW'S", "I", "I'D", "I'LL", "I'M", "I'VE", "IF", "IN", "INTO", "IS", 
    "ISN'T", "IT", "IT'S", "ITS", "ITSELF", "LET'S", "ME", "MORE", "MOST", "MUSTN'T", "MY", "MYSELF", "NO", "NOR", "NOT", 
    "OF", "OFF", "ON", "ONCE", "ONLY", "OR", "OTHER", "OUGHT", "OUR", "OURS", "OURSELVES", "OUT", "OVER", "OWN", "SAME", 
    "SHAN'T", "SHE", "SHE'D", "SHE'LL", "SHE'S", "SHOULD", "SHOULDN'T", "SO", "SOME", "SUCH", "THAN", "THAT", "THAT'S", 
    "THE", "THEIR", "THEIRS", "THEM", "THEMSELVES", "THEN", "THERE", "THERE'S", "THESE", "THEY", "THEY'D", "THEY'LL", 
    "THEY'RE", "THEY'VE", "THIS", "THOSE", "THROUGH", "TO", "TOO", "UNDER", "UNTIL", "UP", "VERY", "WAS", "WASN'T", "WE", 
    "WE'D", "WE'LL", "WE'RE", "WE'VE", "WERE", "WEREN'T", "WHAT", "WHAT'S", "WHEN", "WHEN'S", "WHERE", "WHERE'S", "WHICH", 
    "WHILE", "WHO", "WHO'S", "WHOM", "WHY", "WHY'S", "WITH", "WON'T", "WOULD", "WOULDN'T", "YOU", "YOU'D", "YOU'LL", 
    "YOU'RE", "YOU'VE", "YOUR", "YOURS", "YOURSELF", "YOURSELVES"
];



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
            if (!commonWords.includes(word)) {
                if (currentPart.length > 0 && !currentPart[currentPart.length - 1].endsWith('AND') && !currentPart[currentPart.length - 1].endsWith('OR')) {
                    currentPart.push("OR attribute LIKE '%" + word + "%'");
                }
                else {
                    currentPart.push("attribute LIKE '%" + word + "%'");
                }
            
            }
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