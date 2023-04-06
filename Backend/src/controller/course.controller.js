"use strict"

import CourseService from "../service/course.service.js";
import {wrapHandler} from "../utils.js";
import RestifyError from "restify-errors";

/**
 * HTTP-Controller-Klasse für Kurse. Diese Klasse registriert
 * alle notwendigen URL-Handler beim Webserver für einen einfachen REST-
 * Webservice zum Lesen und Schreiben von Kursen.
 */
export default class CourseController {
    /**
     * Konstruktor. Hier werden die URL-Handler registrert.
     *
     * @param {Object} server Restify Serverinstanz
     * @param {String} prefix Gemeinsamer Prefix aller URLs
     */
    constructor(server, prefix) {
        this._service = new CourseService();
        this._prefix = prefix;

        // Collection: Kurs 
        server.get(prefix, wrapHandler(this, this.search));
        server.post(prefix, wrapHandler(this, this.create));

        // Entity
        server.get(prefix + "/:id", wrapHandler(this, this.read));
        server.put(prefix + "/:id", wrapHandler(this, this.update));
        server.patch(prefix + "/:id", wrapHandler(this, this.update));
        server.del(prefix + "/:id", wrapHandler(this, this.delete));
    }

    /**
     * Hilfsmethode zum Einfügen von HATEOAS-Links in einen Datensatz.
     * Dem Datensatz wird ein Attribut `_links` gemäß der OpenAPI-Spezifikation
     * hinzugefügt, damit ein Client erkennen kann, wie er die Entität lesen,
     * ändern oder löschen kann.
     *
     * @param {Object} entity Zu verändernder Datensatz.
     */
    _insertHateoasLinks(entity) {
        let url = `${this._prefix}/${entity._id}`;

        entity._links = {
            read:   {url: url, method: "GET"},
            update: {url: url, method: "PUT"},
            patch:  {url: url, method: "PATCH"},
            delete: {url: url, method: "DELETE"},
        }
    }

    /**
     * GET /course
     * Kurs suchen
     */
    async search(req, res, next) {
        let result = await this._service.search(req.query);
        result.forEach(entity => this._insertHateoasLinks(entity));
        res.send(result);
        return next();
    }

    /**
     * POST /course
     * Neuen Kurs anlegen
     */
    async create(req, res, next) {
        let result = await this._service.create(req.body);
        this._insertHateoasLinks(result);

        res.status(201);
        res.header("Location", `${this._prefix}/${result._id}`);
        res.send(result);

        return next();
    }

    /**
     * GET /course/:id
     * Kurse auslesen
     */
    async read(req, res, next) {
        let result = await this._service.read(req.params.id);

        if (result) {
            this._insertHateoasLinks(result);
            res.send(result);
        } else {
            throw new RestifyError.NotFoundError("Kurs nicht gefunden");
        }

        return next();
    }

    /**
     * PUT /course/:id
     * PATCH /course/:id
     * Kurs ändern
     */
    async update(req, res, next) {
        let result = await this._service.update(req.params.id, req.body);

        if (result) {
            this._insertHateoasLinks(result);
            res.send(result);
        } else {
            throw new RestifyError.NotFoundError("Kurs nicht gefunden");
        }

        return next();
    }

    /**
     * DELETE /course/:id
     * Kurs löschen
     */
    async delete(req, res, next) {
        await this._service.delete(req.params.id)
        res.status(204);
        res.send({});
        return next();
    }
}