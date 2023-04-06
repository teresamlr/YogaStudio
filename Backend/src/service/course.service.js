"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Kursen. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Kurse werden in einer MongoDB abgelegt.
 */
export default class CourseService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._courses = DatabaseFactory.database.collection("course");
    }

    /**
     * Kurs suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     * Zwar unterstützt MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Kurse
     */
    async search(query) {
        let cursor = this._courses.find(query, {
            sort: {
                course_name: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern eines neuen Kurses.
     *
     * @param {Object} course Zu speichernde Kursdaten
     * @return {Promise} Gespeicherte Kursdaten
     */
    async create(course) {
        course = course || {};

        let newCourse = {
            course_name: course.course_name || "",
            description: course.description        || "",
            date: course.date ||"",
        };

        let result = await this._courses.insertOne(newCourse);
        return await this._courses.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen eines vorhandenen Kurses anhand ihrer ID.
     *
     * @param {String} id ID des gesuchten Kurses
     * @return {Promise} Gefundene Kursdaten
     */
    async read(id) {
        let result = await this._courses.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung eines Kurses, durch Überschreiben einzelner Felder
     * oder des gesamten Kursobjekts (ohne die ID).
     *
     * @param {String} id ID des gesuchten Kurses
     * @param {[type]} course Zu speichernder Kurs
     * @return {Promise} Gespeicherter Kurs oder undefined
     */
    async update(id, course) {
        let oldCourse = await this._courses.findOne({_id: new ObjectId(id)});
        if (!oldCourse) return;

        let updateDoc = {
            $set: {},
        }

        if (course.course_name) updateDoc.$set.course_name = course.course_name;
        if (course.description) updateDoc.$set.description = course.description;
        if (course.date) updateDoc.$set.date = course.date;



        await this._courses.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._courses.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen eines Kurses anhand seiner ID.
     *
     * @param {String} id ID des gesuchten Kurses
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._courses.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}