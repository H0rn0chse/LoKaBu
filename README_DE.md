Available Languages: [Deutsch](./README_DE.md), [English](./README.md)
# LoKaBu [![Latest Release](https://img.shields.io/github/v/release/H0rn0chse/LoKaBu.svg)](https://github.com/H0rn0chse/LoKaBu/releases/latest) [![Release status](https://github.com/H0rn0chse/LoKaBu/workflows/Release/badge.svg?branch=feature%2FelectronTransformation)](https://github.com/H0rn0chse/LoKaBu/actions?query=workflow%3ARelease) [![GitHub Actions status](https://github.com/H0rn0chse/LoKaBu/workflows/Test/badge.svg?branch=feature%2FelectronTransformation)](https://github.com/H0rn0chse/LoKaBu/actions?query=workflow%3ATest)

Dieses Projekt realisiert ein Kassenbuch für den normalen Haushalt. Die Grundidee des Projektes ist über die abgespeicherten Daten volle Kontrolle zu haben. Das Projekt basiert auf der Kombination aus dem Framework Electron und der dateibasierten Datenbank SQLite3.
## Funktionalitäten
### Erstellen/ Öffnen von Datenbanken
Du kannst zusätzlich zur Standard Datenbank eine weitere anlegen, welche an einem beliebigen Ort abgelegt werden kann. Damit kannst du das Kassenbuch auch über Netzwerkordner wie OneDrive oder Dropbox teilen. Um Fehler zu vermeiden ist nur ein Nutzer auf einmal gestattet. Sollte eine andere Person die Datenbank öffnen, bekommst du eine Mitteilung.

### Belege hinzufügen
Du kannst Belege hinzufügen, bearbeiten und löschen. Um bessere Analyseergebnisse zu erreichen werden vordefinierte Auswahllisten verwendet. Um später die Belege einfacher zu finden oder um den Belegen einfach nur weitere Daten anzuhängen kannst du ein Kommentar hinzufügen.

### Verlauf
Im Verlauf kannst du die Belege anhand unterschiedlicher Filtermöglichkeiten durchsuchen.

### Konfiguration von statischen Listen und Werten
Nachdem du ein weiteres Kassenbuch hinzugefügt hast kannst dieses Kassenbuch als deinen Standard festlegen. Desweiteren kannst du eine Standardauswahl für alle Listen angeben Einträge hinzufügen oder bearbeiten.
  *	Abrechnungspersonen
  *	Konten (welche einer Person gehören)
  *	Läden
  *	Abrechnungstypen

### Sprachenunterstützung
Es gibt die Möglichkeit die Übersetzungen um weitere Sprachen zu erweitern. Derzeit sind folgende Sprachen verfügbar:
  * Deutsch
  * Englisch

## Nutzung auf anderen Platformen als Windows
Du musst deinen plattformabhängigen Build selber bauen (und signieren) oder nutzt dieses Repository einfach lokal.

## Weitere Pläne
  * Implementierung des Analysesicht
  * Scanner zur Unterstützung beim Anlegen neuer Belege
  * Unit Tests und E2E Tests
  * Automatische Updates
  * Dokumentation

## Mitwirkende
  * Das Logo wurde von [Kirschdrache](https://www.deviantart.com/kirschdrache) erstellt

## Bildschirmfots
  <img src="./docu/screenshots/details_de.png" title="Beleg Details" />
  <img src="./docu/screenshots/history_de.png" title="Belegverlauf" />
  <img src="./docu/screenshots/settings_de.png" title="SettEinstellungenings" />