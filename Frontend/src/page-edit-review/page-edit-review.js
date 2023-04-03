"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-edit-review.html";

/**
 * Klasse PageEdit: Stellt die Seite zum Anlegen oder Bearbeiten einer Bewertung
 * zur Verfügung.
 */
export default class PageEdit extends Page {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     * @param {Integer} editId ID des bearbeiteten Datensatzes
     */
    constructor(app, editId) {
        super(app, HtmlTemplate);

        // Bearbeiteter Datensatz
        this._editId = editId;

        this._dataset = {
            first_name: "",
            last_name: "",
            course_name: "",
            text: "",
        };

        // Eingabefelder
        this._firstNameInput  = null;
        this._lastNameInput   = null;
        this._courseNameInput = null;
        this._textInput       = null;
    }

    /**
     * HTML-Inhalt und anzuzeigende Daten laden.
     *
     * HINWEIS: Durch die geerbte init()-Methode wird `this._mainElement` mit
     * dem <main>-Element aus der nachgeladenen HTML-Datei versorgt. Dieses
     * Element wird dann auch von der App-Klasse verwendet, um die Seite
     * anzuzeigen. Hier muss daher einfach mit dem üblichen DOM-Methoden
     * `this._mainElement` nachbearbeitet werden, um die angezeigten Inhalte
     * zu beeinflussen.
     *
     * HINWEIS: In dieser Version der App wird mit dem üblichen DOM-Methoden
     * gearbeitet, um den finalen HTML-Code der Seite zu generieren. In größeren
     * Apps würde man ggf. eine Template Engine wie z.B. Nunjucks integrieren
     * und den JavaScript-Code dadurch deutlich vereinfachen.
     */
    async init() {
        // HTML-Inhalt nachladen
        await super.init();

        // Bearbeiteten Datensatz laden
        if (this._editId) {
            this._url = `/registration/${this._editId}`;
            this._dataset = await this._app.backend.fetch("GET", this._url);
            this._title = `${this._dataset.first_name} ${this._dataset.last_name}`;
        } else {
            this._url = `/review`;
            this._title = "Bewertung hinzufügen";
        }

        // Platzhalter im HTML-Code ersetzen
        let html = this._mainElement.innerHTML;
        html = html.replace("$LAST_NAME$", this._dataset.last_name);
        html = html.replace("$FIRST_NAME$", this._dataset.first_name);
        html = html.replace("$COURSE_NAME$", this._dataset.course_name);
        html = html.replace("$TEXT$", this._dataset.text);
        this._mainElement.innerHTML = html;

        // Event Listener registrieren
        let saveButton = this._mainElement.querySelector(".action.save");
        saveButton.addEventListener("click", () => this._saveAndExit());

        // Eingabefelder zur späteren Verwendung merken
        this._firstNameInput  = this._mainElement.querySelector("input.first_name");
        this._lastNameInput   = this._mainElement.querySelector("input.last_name");
        this._courseNameInput = this._mainElement.querySelector("input.course_name");
        this._textInput       = this._mainElement.querySelector("input.text");
    }

    /**
     * Speichert den aktuell bearbeiteten Datensatz und kehrt dann wieder
     * in die Listenübersicht zurück.
     */
    async _saveAndExit() {
        // Eingegebene Werte prüfen
        this._dataset._id         = this._editId;
        this._dataset.first_name  = this._firstNameInput.value.trim();
        this._dataset.last_name   = this._lastNameInput.value.trim();
        this._dataset.course_name = this._courseNameInput.value.trim();
        this._dataset.text        = this._textInput.value.trim();

        if (!this._dataset.first_name) {
            alert("Geben Sie erst einen Vornamen ein.");
            return;
        }

        if (!this._dataset.last_name) {
            alert("Geben Sie erst einen Nachnamen ein.");
            return;
        }

        // Datensatz speichern
        try {
            if (this._editId) {
                await this._app.backend.fetch("PUT", this._url, {body: this._dataset});
            } else {
                await this._app.backend.fetch("POST", this._url, {body: this._dataset});
            }
        } catch (ex) {
            this._app.showException(ex);
            return;
        }

        // Zurück zur Übersicht
        location.hash = "#/";
    }
};