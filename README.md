Available Languages: [Deutsch](../master/README_DE.md), [English](../master/README.md)
# LoKaBu
This project realizes a cash book for the ordinary household. The core idea of the project is to be able to set up and transport a cash book without any installation, dependencies and setup.

It is based on a SQLite database, which is read and written through a python container. The interface is built dynamically with HTML and JavaScript interacting with the python container.
## Features
### Configurable Variables and Options
In addition to simply storing receipts, you can define additional properties for the entire receipt and individual receipt items. The following fields are currently supported:
#### Receipt
  * Date (Text/ Date Picker)
  * ID (automatically assigned)
  *	Comment (user-defined Text)
  *	Account (definable Selection)
  *	Store (definable Selection)
#### Receipt Items
  *	ID (automatically assigned)
  *	Person to be charged (definable Selection)
  *	Payment Group (definable Selection)
  *	Sum (user-defined Text / Formula)
## Usage on Windows
Prerequisites: Installation of the project dependencies

The project can be packed into a single executable file on Windows using the build.bat file.

Alternatively with the command:

```
pyinstaller client.spec --onefile –noconsole
```
## Planned Features
### Overall
  *	Support of other languages: English, custom language packs
### Receipt Creation
  *	More compact design
### Receipt History
  *	Search option
### Receipt Editing
  *	More compact design
### Visualization
  *	Further chart options
  *	Field selection for dynamic visualization
### Settings
  *	More compact design
  *	Reset of the database
  *	Integration of databases with other names
