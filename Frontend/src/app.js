"use strict";

import Backend from "./backend.js";
import Router from "./router.js";
import "./app.css";

/**
 * Hauptklasse App: Steuert die gesamte Anwendung
 *
 * Diese Klasse erzeugt den Single Page Router zur Navigation innerhalb
 * der Anwendung und ein Datenbankobjekt zur Verwaltung der Adressliste.
 * Darüber hinaus beinhaltet sie verschiedene vom Single Page Router
 * aufgerufene Methoden, zum Umschalten der aktiven Seite.
 */
class App {
    /**
     * Konstruktor.
     */
    constructor() {
        // Datenbank-Klasse zur Verwaltung der Datensätze
        this.backend = new Backend();

        // Single Page Router zur Steuerung der sichtbaren Inhalte
        this.router = new Router([
            {
                url: "^/$",
                show: () => this._gotoList()
            },{
                url: "^/new/$",
                show: () => this._gotoNew()
            },{
                url: "^/edit/(.*)$",
                show: matches => this._gotoEdit(matches[1]),
            },{
                url: "^/review$",
                show: () => this._gotoListReview()
            }, {
                url: "^/newreview/$",
                show: () => this._gotoNewReview()
            }, {          
                url: "^/editreview/(.*)$",
                show: matches => this._gotoEditReview(matches[1]),
            }, {
                url: "^/course$",
                show: () => this._gotoListCourse()
            }, {
                url: "^/newcourse/$",
                show: () => this._gotoNewCourse()
            }, {          
                url: "^/editcourse/(.*)$",
                show: matches => this._gotoEditCourse(matches[1]),
            }, {            
                url: ".*",
                show: () => this._gotoList()
            }
        ]);

        // Fenstertitel merken, um später den Name der aktuellen Seite anzuhängen
        this._documentTitle = document.title;

        // Von dieser Klasse benötigte HTML-Elemente
        this._pageCssElement = document.querySelector("#page-css");
        this._bodyElement = document.querySelector("body");
        this._menuElement = document.querySelector("#app-menu");
    }

    /**
     * Initialisierung der Anwendung beim Start. Im Gegensatz zum Konstruktor
     * der Klasse kann diese Methode mit der vereinfachten async/await-Syntax
     * auf die Fertigstellung von Hintergrundaktivitäten warten, ohne dabei
     * mit den zugrunde liegenden Promise-Objekten direkt hantieren zu müssen.
     */
    async init() {
        try {
            await this.backend.init();
            this.router.start();
        } catch (ex) {
            this.showException(ex);
        }
    }

    /**
     * Übersichtsseite anzeigen. Wird vom Single Page Router aufgerufen.
     */
    async _gotoList() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageList} = await import("./page-list/page-list.js");

            let page = new PageList(this);
            await page.init();
            this._showPage(page, "list");
        } catch (ex) {
            this.showException(ex);
        }
    }

    async _gotoListReview() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageList} = await import("./page-list-review/page-list-review.js");

            let page = new PageList(this);
            await page.init();
            this._showPage(page, "list-review");
        } catch (ex) {
            this.showException(ex);
        }
    }

    async _gotoListCourse() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageList} = await import("./page-list-course/page-list-course.js");

            let page = new PageList(this);
            await page.init();
            this._showPage(page, "list-course");
        } catch (ex) {
            this.showException(ex);
        }
    }

    /**
     * Seite zum Anlegen einer neuen Anmeldung anzeigen.  Wird vom Single Page
     * Router aufgerufen.
     */
    async _gotoNew() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageEdit} = await import("./page-edit/page-edit.js");

            let page = new PageEdit(this);
            await page.init();
            this._showPage(page, "new");
        } catch (ex) {
            this.showException(ex);
        }
    }

    /**
     * Seite zum Bearbeiten einer Anmeldung anzeigen.  Wird vom Single Page
     * Router aufgerufen.
     *
     * @param {Number} id ID der zu bearbeitenden Anmeldung
     */
    async _gotoEdit(id) {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageEdit} = await import("./page-edit/page-edit.js");

            let page = new PageEdit(this, id);
            await page.init();
            this._showPage(page, "edit");
        } catch (ex) {
            this.showException(ex);
        }
    }

    async _gotoEditReview(id) {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageEditReview} = await import("./page-edit-review/page-edit-review.js");

            let page = new PageEditReview(this, id);
            await page.init();
            this._showPage(page, "editreview");
        } catch (ex) {
            this.showException(ex);
        }
    }

    async _gotoEditCourse(id) {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageEditCourse} = await import("./page-edit-course/page-edit-course.js");

            let page = new PageEditCourse(this, id);
            await page.init();
            this._showPage(page, "editcourse");
        } catch (ex) {
            this.showException(ex);
        }
    }

    async _gotoNewReview() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageEditReview} = await import("./page-edit-review/page-edit-review.js");

            let page = new PageEditReview(this);
            await page.init();
            this._showPage(page, "newreview");
        } catch (ex) {
            this.showException(ex);
        }
    }

    async _gotoNewCourse() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageEditCourse} = await import("./page-edit-course/page-edit-course.js");

            let page = new PageEditCourse(this);
            await page.init();
            this._showPage(page, "newcourse");
        } catch (ex) {
            this.showException(ex);
        }
    }


    /**
     * Interne Methode zum Umschalten der sichtbaren Seite.
     *
     * @param  {Page} page Objekt der anzuzeigenden Seiten
     * @param  {String} name Name zur Hervorhebung der Seite im Menü
     */
    _showPage(page, name) {
        // Fenstertitel aktualisieren
        document.title = `${this._documentTitle} – ${page.title}`;

        // Stylesheet der Seite einfügen
        this._pageCssElement.innerHTML = page.css;

        // Aktuelle Seite im Kopfbereich hervorheben
        this._menuElement.querySelectorAll("li").forEach(li => li.classList.remove("active"));
        this._menuElement.querySelectorAll(`li[data-page-name="${name}"]`).forEach(li => li.classList.add("active"));

        // Sichtbaren Hauptinhalt austauschen
        this._bodyElement.querySelector("main")?.remove();
        this._bodyElement.appendChild(page.mainElement);
    }

    /**
     * Hilfsmethode zur Anzeige eines Ausnahmefehlers. Der Fehler wird in der
     * Konsole protokolliert und als Popupmeldung angezeigt.
     *
     * @param {Object} ex Abgefangene Ausnahme
     */
    showException(ex) {
        console.error(ex);

        if (ex.message) {
            alert(ex.message)
        } else {
            alert(ex.toString());
        }
    }
}

/**
 * Anwendung starten
 */
window.addEventListener("load", async () => {
    let app = new App();
    await app.init();
});