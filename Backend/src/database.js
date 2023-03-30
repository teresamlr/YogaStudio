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
                    phone: "+49 123 456789",
                    memberID: "0",
                },
                {
                    first_name: "Michael",
                    last_name: "Knight",
                    phone: "+49 721 554194",
                    memberID: "michael@knight-rider.com",
                },
                {
                    first_name: "Fox",
                    last_name: "Mulder",
                    phone: "+49 721 553181",
                    memberID: "mulder@xfiles.com",
                },
                {
                    first_name: "Dana",
                    last_name: "Scully",
                    phone: "+49 721 572287",
                    memberID: "scully@xfiles.com",
                },
                {
                    first_name: "Elwood",
                    last_name: "Blues",
                    phone: "+49 721 957338",
                    memberID: "elwood@blues-brothers.com",
                },
            ]);
        }
    }
}

export default new DatabaseFactory();

