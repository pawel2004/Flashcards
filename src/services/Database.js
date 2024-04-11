import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("flashcards_P_G_1_1.db");

export default class Database {
    static prepareDatabase() {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS Decks (
                    DeckId INTEGER PRIMARY KEY NOT NULL,
                    Name varchar(255) NOT NULL
                );`
            );
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS Flashcards (
                    FlashcardId INTEGER PRIMARY KEY NOT NULL,
                    DeckId INTEGER NOT NULL,
                    Front text NOT NULL,
                    Rear text NOT NULL
                );`
            );
        }, (err) => reject(err), () => resolve()));
    }

    static addDeck(name) {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`INSERT INTO Decks (Name) VALUES (?);`, [name]);
        }, (err) => reject(err), () => resolve()));
    }

    static addFlashCard(deckId, front, rear) {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`INSERT INTO Flashcards (DeckId, Front, Rear) VALUES (?, ?, ?);`, [deckId, front, rear]);
        }, (err) => reject(err), () => resolve()));
    }

    static editDeck(id, newName) {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql("UPDATE Decks SET Name = ? WHERE DeckId = ?;", [newName, id]);
        }, (err) => reject(err), () => resolve()));
    }

    static editFlashCard(id, newFront, newRear) {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql("UPDATE Flashcards SET Front=?, Rear=? WHERE FlashcardId = ?;", [newFront, newRear, id]);
        }, (err) => reject(err), () => resolve()));
    }

    static getDecks() {
        const query = "SELECT * FROM Decks;"
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(query, [], (_, results) => {
                resolve(results.rows._array);
            }, (_, error) => {
                reject(error);
            });
        }))
    }

    static getFlashCardsFromDeck(deckId) {
        const query = `SELECT FlashcardId, Front, Rear FROM Flashcards WHERE DeckId = ${deckId};`;
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(query, [], (_, results) => {
                resolve(results.rows._array);
            }, (_, error) => {
                reject(error);
            });
        }))
    }

    static deleteDeck(id) {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`DELETE FROM Decks WHERE DeckId = ?;`, [id]);
            tx.executeSql('DELETE FROM Flashcards WHERE DeckId = ?;', [id]);
        }, (err) => reject(err), () => resolve()));
    }

    static deleteFlashCard(id) {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`DELETE FROM Flashcards WHERE FlashcardId = ?;`, [id]);
        }, (err) => reject(err), () => resolve()));
    }
}