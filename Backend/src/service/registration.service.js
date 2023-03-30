"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Anmeldungen. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Anmeldungen werden in einer MongoDB abgelegt.
 */
export default class RegistrationService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._registrations = DatabaseFactory.database.collection("registration");
    }

    /**
     * Anmeldung suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     * Zwar unterstützt MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Anmeldungen
     */
    async search(query) {
        let cursor = this._registrations.find(query, {
            sort: {
                first_name: 1,
                last_name: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern einer neuen Anmeldung.
     *
     * @param {Object} registration Zu speichernde Anmeldedaten
     * @return {Promise} Gespeicherte Anmeldedaten
     */
    async create(registration) {
        r = registration || {};

        let newRegistration = {
            first_name:  registration.first_name || "",
            last_name:   registration.last_name  || "",
            phone:       registration.phone      || "",
            memberID:    registration.memberID      || "",
        };

        let result = await this._registrations.insertOne(newRegistration);
        return await this._registrations.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen einer vorhandenen Anmeldung anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Anmeldung
     * @return {Promise} Gefundene Anmeldedaten
     */
    async read(id) {
        let result = await this._registrations.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung einer Anmeldung, durch Überschreiben einzelner Felder
     * oder des gesamten Anmeldeobjekts (ohne die ID).
     *
     * @param {String} id ID der gesuchten Anmeldung
     * @param {[type]} registration Zu speichernde Anmeldung
     * @return {Promise} Gespeicherte Anmeldung oder undefined
     */
    async update(id, registration) {
        let oldRegistration = await this._registrations.findOne({_id: new ObjectId(id)});
        if (!oldRegistration) return;

        let updateDoc = {
            $set: {},
        }

        if (registration.first_name) updateDoc.$set.first_name = registration.first_name;
        if (registration.last_name)  updateDoc.$set.last_name  = registration.last_name;
        if (registration.phone)      updateDoc.$set.phone      = registration.phone;
        if (registration.memberID)   updateDoc.$set.memberID      = registration.memberID;

        await this._registrations.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._registrations.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen einer Anmeldung anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Anmeldung
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._registrations.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
