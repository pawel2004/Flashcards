import * as SQLite from 'expo-sqlite';

const databaseName = 'flashcards_P_G_1_4.db';

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
        const statement = await db.prepareAsync(`INSERT INTO Flashcards (DeckId, Front, Rear) VALUES ($deckId, front, rear);`);
        insertId = (await statement.executeAsync({ $name: name })).lastInsertRowId;
    });
    return insertId;
    return new Promise((resolve, reject) => db.transaction(tx => {
        const query = `INSERT INTO Flashcards (DeckId, Front, Rear) VALUES ($deckId, front, rear);`;
        const bindingArray = [];
        for (let e of flashcardsArray)
            bindingArray.push(deckId, e[0], e[1]);
        tx.executeSql(query, bindingArray, (_, result) => {
            resolve(result.insertId);
        }, (_, err) => reject(err));
    }, (err) => reject(err)));
}

const editDeck = (id, newName) => {
    return new Promise((resolve, reject) => db.transaction(tx => {
        tx.executeSql("UPDATE Decks SET Name = ? WHERE DeckId = ?;", [newName, id]);
    }, (err) => reject(err), () => resolve()));
}

const editFlashCard = (id, newFront, newRear) => {
    return new Promise((resolve, reject) => db.transaction(tx => {
        tx.executeSql("UPDATE Flashcards SET Front=?, Rear=? WHERE FlashcardId = ?;", [newFront, newRear, id]);
    }, (err) => reject(err), () => resolve()));
}

const getDecks = async () => {
    const db = await SQLite.openDatabaseAsync(databaseName);
    let rows = []
    await db.withExclusiveTransactionAsync(async () => {
        const statement = await db.prepareAsync('SELECT * FROM Decks;');
        const result = await statement.executeAsync();
        rows = await result.getAllAsync();
    });
    return rows
}

const getFlashCardsFromDeck = (deckId) => {
    const query = `SELECT FlashcardId, Front, Rear FROM Flashcards WHERE DeckId = ${deckId};`;
    return new Promise((resolve, reject) => db.transaction(tx => {
        tx.executeSql(query, [], (_, results) => {
            resolve(results.rows._array);
        }, (_, error) => {
            reject(error);
        });
    }))
}

const deleteDeck = (id) => {
    return new Promise((resolve, reject) => db.transaction(tx => {
        tx.executeSql(`DELETE FROM Decks WHERE DeckId = ?;`, [id]);
        tx.executeSql('DELETE FROM Flashcards WHERE DeckId = ?;', [id]);
    }, (err) => reject(err), () => resolve()));
}

const deleteFlashCard = (id) => {
    return new Promise((resolve, reject) => db.transaction(tx => {
        tx.executeSql(`DELETE FROM Flashcards WHERE FlashcardId = ?;`, [id]);
    }, (err) => reject(err), () => resolve()));
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