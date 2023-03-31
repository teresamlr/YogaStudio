"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Anmeldungen. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Anmeldungen werden in einer MongoDB abgelegt.
 */
export default class ReviewService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._reviews = DatabaseFactory.database.collection("reviews");
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
        let cursor = this._reviews.find(query, {
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
     * @param {Object} review Zu speichernde Anmeldedaten
     * @return {Promise} Gespeicherte Anmeldedaten
     */
    async create(review) {
        review = review || {};

        let newReview = {
            first_name:  review.first_name || "",
            last_name:   review.last_name  || "",
            text:        review.text       || "",
        };

        let result = await this._reviews.insertOne(newReview);
        return await this._reviews.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen einer vorhandenen Anmeldung anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Anmeldung
     * @return {Promise} Gefundene Anmeldedaten
     */
    async read(id) {
        let result = await this._reviews.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung einer Anmeldung, durch Überschreiben einzelner Felder
     * oder des gesamten Anmeldeobjekts (ohne die ID).
     *
     * @param {String} id ID der gesuchten Anmeldung
     * @param {[type]} review Zu speichernde Anmeldung
     * @return {Promise} Gespeicherte Anmeldung oder undefined
     */
    async update(id, review) {
        let oldReview = await this._reviews.findOne({_id: new ObjectId(id)});
        if (!oldReview) return;

        let updateDoc = {
            $set: {},
        }

        if (review.first_name) updateDoc.$set.first_name = review.first_name;
        if (review.last_name)  updateDoc.$set.last_name  = review.last_name;
        if (review.text)      updateDoc.$set.text      = review.text;

        await this._reviews.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._reviews.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen einer Anmeldung anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Anmeldung
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._reviews.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
