Available Languages: [Deutsch](../blob/master/README_DE.md), [English](../blob/master/README.md)
# LoKaBu
Dieses Projekt realisiert ein Kassenbuch für den normalen Haushalt. Dabei ist die Kernidee des Projektes, ein Kassenbuch ohne Installation, Abhängigkeiten und Setup einrichten und transportieren zu können.

Es basiert auf einer SQLite Datenbank, welche durch einen python Container ausgelesen und beschrieben wird. Die Oberfläche wird dynamisch mit HTML und JavaScript aufgebaut und interagiert mit dem python Container.
## Funktionalitäten
### Definierbare Variablen und Auswahlmöglichkeiten
Neben der bloßen Ablage von Belegen, lassen sich weitere Eigenschaften bzgl. des Gesamtbeleges und einzelner Belegpositionen definieren. Aktuell werden folgende Felder unterstützt:
#### Beleg
  * Datum (Text/ Datepicker)
  * ID (automatisch vergeben)
  *	Kommentar (Freitext)
  *	Konto (definierbare Auswahl)
  *	Laden (definierbare Auswahl)
#### Belegposition
  *	ID (automatisch vergeben)
  *	Abzurechnende Person (definierbare Auswahl)
  *	Abrechnungskategorie (definierbare Auswahl)
  *	Betrag (Freitext/ Formel)
## Nutzung auf Windows
Voraussetzungen: Installation der Projekt Abhängigkeiten

Das Projekt kann unter Windows mit der Datei build.bat in eine einzige ausführbare Datei gepackt werden.

Alternativ mit dem Befehl:

```
pyinstaller client.spec --onefile –noconsole
```
## Geplante Funktionen
### Gesamt
  *	Unterstützung weiterer Sprachen: Englisch, eigene Sprachpakete
### Belegerstellung
  *	Kompakteres Design
### Belegverlauf
  *	Suchfunktion
### Belegbearbeitung
  *	Kompakteres Design
### Visualisierung
  *	Weitere Diagrammmöglichkeiten
  *	Feldauswahl zur dynamischen Visualisierung
### Einstellungen
  *	Kompakteres Design
  *	Zurücksetzen der Datenbank
  *	Einbindung von Datenbanken mit anderen Namen