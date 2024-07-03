import * as SQLite from 'expo-sqlite';

const databaseName = 'flashcards_P_G_2_0.db';

const prepareDatabase = async () => {
    const db = await SQLite.openDatabaseAsync(databaseName);
    await db.withExclusiveTransactionAsync(async () => {
        await db.execAsync(`CREATE TABLE IF NOT EXISTS Decks (
                    DeckId INTEGER PRIMARY KEY NOT NULL,
                    Name varchar(255) NOT NULL
                );`);
        await db.execAsync(`CREATE TABLE IF NOT EXISTS Flashcards (
                    FlashcardId INTEGER PRIMARY KEY NOT NULL,
                    DeckId INTEGER NOT NULL,
                    Front text NOT NULL,
                    Rear text NOT NULL
                );`);
    });
}

const addDeck = async (name) => {
    const db = await SQLite.openDatabaseAsync(databaseName);
    let insertId = 0;
    await db.withExclusiveTransactionAsync(async () => {
        const statement = await db.prepareAsync(`INSERT INTO Decks (Name) VALUES ($name);`);
        insertId = (await statement.executeAsync({ $name: name })).lastInsertRowId;
    });
    return insertId;
}

const addFlashCard = async (deckId, front, rear) => {
    const db = await SQLite.openDatabaseAsync(databaseName);
    let insertId = 0;
    await db.withExclusiveTransactionAsync(async () => {
        const statement = await db.prepareAsync(`INSERT INTO Flashcards (DeckId, Front, Rear) VALUES ($deckId, $front, $rear);`);
        insertId = (await statement.executeAsync({ $deckId: deckId, $front: front, $rear: rear })).lastInsertRowId;
    });
    return insertId;
}

const addFlashCards = async (deckId, flashcardsArray) => {
    const db = await SQLite.openDatabaseAsync(databaseName);
    let insertId = 0;
    await db.withExclusiveTransactionAsync(async () => {
        const statement = await db.prepareAsync(`INSERT INTO Flashcards (DeckId, Front, Rear) VALUES ($deckId, $front, $rear);`);
        for (let flashcard of flashcardsArray)
            insertId = (await statement.executeAsync({ $deckId: deckId, $front: flashcard[0], $rear: flashcard[1] })).lastInsertRowId;
    });
    return insertId;
}

const editDeck = async (id, newName) => {
    const db = await SQLite.openDatabaseAsync(databaseName);
    await db.withExclusiveTransactionAsync(async () => {
        const statement = await db.prepareAsync(`UPDATE Decks SET Name = $newName WHERE DeckId = $deckId;`);
        await statement.executeAsync({ $newName: newName, $deckId: id });
    });
}

const editFlashCard = async (id, newFront, newRear) => {
    const db = await SQLite.openDatabaseAsync(databaseName);
    await db.withExclusiveTransactionAsync(async () => {
        const statement = await db.prepareAsync(`UPDATE Flashcards SET Front=$newFront, Rear=$newRear WHERE FlashcardId = $flashcardId;`);
        await statement.executeAsync({ $newFront: newFront, $newRear: newRear, $flashcardId: id });
    });
}

const getDecks = async () => {
    const db = await SQLite.openDatabaseAsync(databaseName);
    let rows = [];
    await db.withExclusiveTransactionAsync(async () => {
        const statement = await db.prepareAsync('SELECT * FROM Decks;');
        const result = await statement.executeAsync();
        rows = await result.getAllAsync();
    });
    return rows;
}

const getFlashCardsFromDeck = async (deckId) => {
    const db = await SQLite.openDatabaseAsync(databaseName);
    let rows = [];
    await db.withExclusiveTransactionAsync(async () => {
        const statement = await db.prepareAsync('SELECT FlashcardId, Front, Rear FROM Flashcards WHERE DeckId = $deckId;');
        const result = await statement.executeAsync({ $deckId: deckId });
        rows = await result.getAllAsync();
    });
    return rows;
}

const deleteDeck = async (id) => {
    const db = await SQLite.openDatabaseAsync(databaseName);
    await db.withExclusiveTransactionAsync(async () => {
        const statement1 = await db.prepareAsync(`DELETE FROM Decks WHERE DeckId = $deckId;`);
        await statement1.executeAsync({ $deckId: id });
        const statement2 = await db.prepareAsync(`DELETE FROM Flashcards WHERE DeckId = $deckId;`);
        await statement2.executeAsync({ $deckId: id });
    });
}

const deleteFlashCard = async (id) => {
    const db = await SQLite.openDatabaseAsync(databaseName);
    await db.withExclusiveTransactionAsync(async () => {
        const statement = await db.prepareAsync(`DELETE FROM Flashcards WHERE FlashcardId = $flashcardId;`);
        await statement.executeAsync({ $flashcardId: id });
    });
}

export {
    prepareDatabase,
    addDeck,
    addFlashCard,
    addFlashCards,
    deleteDeck,
    deleteFlashCard,
    editDeck,
    editFlashCard,
    getDecks,
    getFlashCardsFromDeck
}