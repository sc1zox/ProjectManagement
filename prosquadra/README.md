# Prosquadra

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.10.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


# Max's explanation corner

# Christian's explanation corner

- safe project button in team roadmap nur verfügbar für sm oder po ? -> ne für alle aber nicht alle dürfen editieren
- current project in der rechten sidebar wird momentan gepolled also alle 30 sekunden gefetched. Funktioniert aber ist das gut?
- momentan ist es nicht möglich einen User ohne Team zu erstellen und ein Team ohne User/oder das nachträgliche ändern, hinzufügen. How to do? -> nachträglich geht nun also passt? 
- Projekt löschen impl
- FIX: Fehlerabfangen damit es nicht zu prisma error kommt aber es sollte auch kein null ans backend geschickt werden :D 
- breakpoints sind momentan bei 1000px.
- Bereichsleiter fehlt bei Berechtigungen
- Gantt diagramm für analyse SM einbauen -> Backend für update nachziehen und dann im FE aktualisieren (sollen hier projekte bearbeitet werden können ? also verschieben auf der zeitleiste)
- Teamübersicht visual bug bei kleinerem Screen (kann momentan vernachlässigt werden, da wir uns auf mobile oder desktop screensize fokussieren und nicht dazwischen)
- Teamraodmap hat bei den projekten den mauszeiger auf drag and drop obwohl die rolle dafür nicht gegeben ist. (Klasse dynamisch setzen?)
- generell Berechtigungen überprüfen, wer darf wo was sehen bearbeiten usw.
- Notifications aktualisieren mit event emitter


### BUGS
- BUG: mobile ansicht bricht Gantt komplett
- BUG: sm plant projekt ein und submitted. Datepicker verschwindet.+ fehlermeldung "Die Dauer darf nicht 0 Stunden und 0 Tage sein" aber erstes datumsetzen funktioniert und ab fresh wieder
- BUG: bei projekt erstellen. Wenn ich ein projekt erstelle und danach die reihenfolge anpasse und dann nochmal ein projekt erstelle resetted sich die reihenfolge. Im backend stimmt es also muss das frontend vermutlich neu pullen oder so.
- BUG: wenn ich einen Nutzer erstellen will und als rolle sm auswähle aber ihm nur ein Team(scheinbar egal) zuweise wird null and backend geschickt bei Team. Somit schlägt die erstellung fehl.
- BUG: wenn ich als sm neue Daten eintrage erscheint danach die erste Roadmap nochmal? Bei refresh stimmt es wieder. bzw. wenn ich nochmal welche eingeben will kommt der snackbar error ?
- PO: kann momentan Projekte erstellen für alle Teams und die Roadmap aller Teams bearbeiten. Bei Team-Roadmap sieht er nur die seines Teams. Wie ist hier das gewünschte Verhalten?
- Wenn ich das letzte Projekt in einer Roadmap lösche ist die Roadmap leer. Darf das sein? Wenn ja Fehlerabfragen!

### perspektivisch
- calc(var()) durch neue variable ersetzen?
- PRIO: app-init-service aufsetzen und dort die fetches gestalten, bzw. aufjedenfall die fetches reduzieren.
- roadmap scrolling horizontal erst ab overflow? damit vertikales scrollen nicht gefangen wird und man dadurch nicht horizontal scrollen kann 
- unimportant bug: ERROR TypeError: this.projectList is undefined beheben
- modals einbauen zur Informationsbestätigung?
- services refaktorieren für eine gute auth und api struktur
- Idee: Bilder einfügbar machen für projektboxen in roadmap
- darkmode? sollte nicht zu aufwendig sein
- Websockets??

### Fragen
- Was heißt Arbeitszeit? Stunden von dann bis dann? Oder maximale Stunden/Woche oder gearbeitete Zeit?


## Routing

Das Dashboard ist so aufgebaut, dass die linke und rechte Seitenleiste (Sidebar) unverändert bleiben, während nur der mittlere Hauptinhalt bei der Navigation neu geladen wird.

### Routenstruktur

* ````/dashboard```` oder ````/dashboard/home````: Lädt die Standard-Ansicht des Dashboards (````DashboardHomeComponent````).
* ````/dashboard/create-project````: Lädt die Projekt-Erstellungsansicht (````CreateProjectComponent````).

Dieses Routing-Konzept sorgt für eine einfache Navigation innerhalb des Dashboards und ermöglicht ein schnelles Umschalten zwischen Ansichten, ohne die allgemeine Seitenstruktur zu beeinträchtigen :)

## Standalone Components

* Dieses Projekt nutzt Standalone Components, sodass jede Komponente ihre eigenen Abhängigkeiten verwaltet.
* RouterModule und andere Angular-Module (z. B. ````MatButtonModule````) müssen direkt in der ````imports````-Liste jeder Komponente angegeben werden, wenn sie benötigt werden.

## Preview

![](https://web06.iis.uni-bamberg.de/gitlab/wip2425g1/wip2425_g1/-/raw/main/prosquadra/readme_preview.gif)
