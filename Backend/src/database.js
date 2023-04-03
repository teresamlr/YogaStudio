"use strict"

import { MongoClient } from "mongodb";

/**
 * Singleton-Klasse zum Zugriff auf das MongoDB-Datenbankobjekt, ohne dieses
 * ständig als Methodenparameter durchreichen zu müssen. Stattdessen kann
 * einfach das Singleton-Objekt dieser Klasse importiert und das Attribut
 * `mongodb` oder `database` ausgelesen werden.
 */
class DatabaseFactory {
    /**
     * Ersatz für den Konstruktor, damit aus dem Hauptprogramm heraus die
     * Verbindungs-URL der MongoDB übergeben werden kann. Hier wird dann
     * auch gleich die Verbindung hergestellt.
     *
     * @param {String} connectionUrl URL-String mit den Verbindungsdaten
     */
    async init(connectionUrl) {
        // Datenbankverbindung herstellen
        this.client = new MongoClient(connectionUrl);
        await this.client.connect();
        this.database = this.client.db("registrationlist");
        this.database = this.client.db("reviewlist");

        await this._createDemoData();
    }

    /**
     * Hilfsmethode zum Anlegen von Demodaten. Würde man so in einer
     * Produktivanwendung natürlich nicht machen, aber so sehen wir
     * wenigstens gleich ein paar Daten.
     */
    async _createDemoData() {
        let registrations = this.database.collection("registration");

        if (await registrations.estimatedDocumentCount() === 0) {
            registrations.insertMany([
                {
                    first_name: "Teresa",
                    last_name: "Müller",
                    course_name: "Yoga für Fortgeschrittene",
                    phone: "+49 123 456789",
                    memberID: "222",
                },
                {
                    first_name: "Lisa",
                    last_name: "Huck",
                    course_name: "Weekend Flow",
                    phone: "+49 123 123123",
                    memberID: "875",
                },
                {
                    first_name: "Rebecca",
                    last_name: "Denz",
                    course_name: "Functional Yoga",
                    phone: "+49 135 791357",
                    memberID: "37",
                }
            ]);
        }

        let reviews = this.database.collection("review");

        if (await reviews.estimatedDocumentCount() === 0) {
            reviews.insertMany([
                {
                    first_name: "Max",
                    last_name: "Mustermann",
                    course_name: "Yoga für Fortgeschrittene",
                    text: "Tolle Atmosphäre und sehr nette Leute."
                },
                {
                    first_name: "Erika",
                    last_name: "Mustermann",
                    course_name: "Weekend Flow",
                    text: "Sehr gut auch für Einsteiger. Die Trainerin ist sehr kompetent."
                }
            ]);
        }
    }
}

export default new DatabaseFactory();