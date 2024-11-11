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

- safe project button in team roadmap nur verfügbar für sm oder po ?
- projekt icon läd langsam. icon datei vllt besser? zugroß?
- skills an backend schicken(skill.service aufsetzen)
- current project wird momentan gepolled also alle 5 sekunden gefetched. Funktioniert aber ist das gut?
- arbeitszeit verarbeiten uns ans backend schicken + eingabe
- git pushup alias setzen
- momentan ist es nicht möglich einen User ohne Team zu erstellen und ein Team ohne User/oder das nachträgliche ändern, hinzufügen. How to do?
- Projekt löschen impl
- BUG: sm plant projekt ein und submitted. Datepicker verschwindet.+ fehlermeldung "Die Dauer darf nicht 0 Stunden und 0 Tage sein" aber erstes datumsetzen funktioniert und ab fresh wieder
- Idee: Bilder einfügbar machen für projektboxen in roadmap
- darkmode? sollte nicht zu aufwendig sein
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
