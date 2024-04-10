-- Create LIBRARIAN Table
CREATE TABLE LIBRARIAN (
    SSN VARCHAR(255) PRIMARY KEY,
    Name VARCHAR(255),
    Email VARCHAR(255) UNIQUE,
    Salary FLOAT
);

-- Create CLIENT Table
CREATE TABLE CLIENT (
    Email VARCHAR(255) PRIMARY KEY,
    Name VARCHAR(255)
);

-- Create CREDIT_CARD Table
CREATE TABLE CREDIT_CARD (
    CreditCard SERIAL PRIMARY KEY,
    CardNumber VARCHAR(255),
    PaymentAddress VARCHAR(255),
    Email VARCHAR(255) REFERENCES CLIENT(Email)
);

-- Create DOCUMENT Table
CREATE TABLE DOCUMENT (
    DocumentID SERIAL PRIMARY KEY,
    Title VARCHAR(255),
    Publisher VARCHAR(255),
    YearReleased INT
);

-- Create BOOK Table
CREATE TABLE BOOK (
    BookId SERIAL PRIMARY KEY,
    Authors VARCHAR(255),
    ISBN VARCHAR(255),
    Edition VARCHAR(255),
    NumberOfPages INT,
    DocumentID INT UNIQUE REFERENCES DOCUMENT(DocumentID) ON DELETE CASCADE
);

-- Create MAGAZINE Table
CREATE TABLE MAGAZINE (
    MagazineID SERIAL PRIMARY KEY,
    ISBN VARCHAR(255),
    MonthOfIssue VARCHAR(255),
    DocumentID INT UNIQUE REFERENCES DOCUMENT(DocumentID) ON DELETE CASCADE
);

-- Create JOURNAL_ARTICLE Table
CREATE TABLE JOURNAL_ARTICLE (
    ArticleID SERIAL PRIMARY KEY,
    ArticleTitle VARCHAR(255),
    Authors VARCHAR(255),
    IssueNumber INT,
    VolumeNumber INT,
    DocumentID INT REFERENCES DOCUMENT(DocumentID)
);

-- Create COPY_OF_DOCUMENT Table
CREATE TABLE COPY_OF_DOCUMENT (
    CopyID VARCHAR(255) PRIMARY KEY,
    Status VARCHAR(255),
    LendDate DATE,
    DocumentID INT REFERENCES DOCUMENT(DocumentID),
    ClientEmail VARCHAR(255) REFERENCES CLIENT(Email)
);

-- Create ELECTRONIC_DOCUMENT Table
CREATE TABLE ELECTRONIC_DOCUMENT (
    ElectronicDocumentID INT PRIMARY KEY REFERENCES DOCUMENT(DocumentID),
    AccessURL VARCHAR(255)
);


-- Indexes for document searches by title and publisher
CREATE INDEX index_document_title ON DOCUMENT (Title);
CREATE INDEX index_document_publisher ON DOCUMENT (Publisher);
CREATE INDEX index_document_year ON DOCUMENT (YearReleased);

-- Indexes for unique identifiers and important attributes
CREATE INDEX index_book_isbn ON BOOK (ISBN);
CREATE INDEX index_magazine_isbn ON MAGAZINE (ISBN);

-- Email addresses are key for login operations
CREATE INDEX index_client_email ON CLIENT (Email);
CREATE INDEX index_librarian_email ON LIBRARIAN (Email);

-- Indexes for managing document copies
CREATE INDEX index_copy_status ON COPY_OF_DOCUMENT (Status);
CREATE INDEX index_copy_lend_date ON COPY_OF_DOCUMENT (LendDate);