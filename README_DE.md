Available Languages: [Deutsch](./README_DE.md), [English](./README.md)
# LoKaBu [![Latest Release](https://img.shields.io/github/v/release/H0rn0chse/LoKaBu.svg)](https://github.com/H0rn0chse/LoKaBu/releases/latest) [![Release status](https://github.com/H0rn0chse/LoKaBu/workflows/Release/badge.svg?branch=feature%2FelectronTransformation)](https://github.com/H0rn0chse/LoKaBu/actions?query=workflow%3ARelease) [![GitHub Actions status](https://github.com/H0rn0chse/LoKaBu/workflows/Test/badge.svg?branch=feature%2FelectronTransformation)](https://github.com/H0rn0chse/LoKaBu/actions?query=workflow%3ATest)

Dieses Projekt realisiert ein Kassenbuch für den normalen Haushalt. Die Grundidee des Projektes ist über die abgespeicherten Daten volle Kontrolle zu haben. Das Projekt basiert auf der Kombination aus dem Framework Electron und der dateibasierten Datenbank SQLite3.
## Funktionalitäten
### Erstellen/ Öffnen von Datenbanken
Du kannst zusätzlich zur Standard Datenbank eine weitere anlegen, welche an einem belibiegen Ort abgelegt werden kann. Damit kannst du das KAssenbuch auch über das Netzwerk zB. über Cloudanbieter teilen. Um Fehler zu vermeiden ist nur ein Nutzer auf einmal gestattet. Sollte eine andere Person die Datenbank öffnen wirst bekommst du eine Mitteilung.

### Belege hinzufügen
Du kannst Belege hinzufügen, bearbeiten und löschen. Um bessere Analyseergebnisse zu erreichen werden vordefinierte Auswahllisten verwendet. Um Belege schneller und einfacher anlefgen zu können kannst du die Datumsauswahl und Berechnung (anstatt von Werten) verwenden. Um später die Belege einfacher zu finden oder um den Belegen einfach nur weitere Daten anzuhängen kannst du ein Kommentar hinzufügen.

### Verlauf
Im Verlauzf kannst du die Belege anhand unterschiedlicher Filtermöglichkeiten durchsuchen.

### Konfiguration von statischen Listen und Werten
Nachdem du ein weiteres Kassenbuch hinzugefügt hast kannst dieses Kassenbuch als deinen Standard festlegen. Desweiteren kannst du Standardauswahlen für Sprache, Abrechnungsperson und -typ festlegen.
Du kannst auch die Einträge der vordefinierten Listen erweitern oder bearbeiten.
  *	Abrechnungspersonen
  *	Konten (welche einer Person gehören)
  *	Läden
  *	Abrechnungstypen

### Sprachenunterstützung
Derzeit wird nur Englisch und Detusch unterstützt, aber die Datenbank kann einfach mit weiteren LTR Sprachen erweitert werden.

## Nutzung auf anderen Platformen als Windows
Du musst deinen plattformabhängigen Build selber bauen (und signieren) oder nutzt dieses Repository einfach lokal.

## Weitere Pläne
  * Implementierung des Analysesicht
  * Überarbeitung des gesamten Designs und Codes
  * Scanner zur Unterstützung beim Anlegen neuer Belege
  * Migrationspläne für Datenbankupgrades
  * Unit Tests und E2E Tests
  * Automatische Updates

## Bildschirmfots

  ![details][details]
  ![history][history]
  ![settings][settings]

[details]: ./screenshots/details_de.png "Beleg Details"
[history]: ./screenshots/history_de.png "Belegverlauf"
[settings]: ./screenshots/settings_de.png "Einstellungen"