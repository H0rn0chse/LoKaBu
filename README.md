Available Languages: [Deutsch](./README_DE.md), [English](./README.md)
# LoKaBu [![Latest Release](https://img.shields.io/github/v/release/H0rn0chse/LoKaBu.svg)](https://github.com/H0rn0chse/LoKaBu/releases/latest) [![Release status](https://github.com/H0rn0chse/LoKaBu/workflows/Release/badge.svg?branch=feature%2FelectronTransformation)](https://github.com/H0rn0chse/LoKaBu/actions?query=workflow%3ARelease) [![GitHub Actions status](https://github.com/H0rn0chse/LoKaBu/workflows/Test/badge.svg?branch=feature%2FelectronTransformation)](https://github.com/H0rn0chse/LoKaBu/actions?query=workflow%3ATest)

This project realizes a cash book for the normal household. The core idea of the project is to have full control over the data that is stored. This Project is based on the combination of the framework Electron and the file based database SQLite3
## Features
### Create/ Open Database
You can add in addition to the user default another database which can be loacted wherever you want. With this you can share the cash book across the network e.g. via a cloud service. There are checks implemented to allow only one user at a time to avoid constant changing data. You get notified if there is concurrent work going on.

### Adding Receipt
You can add, update and delete receipts. The categorization gets unified by predefined lists to achieve better analytic results. You can also make use of the Chrome date picker and calculations (instead of values) within the receipt positions to get your receipt updates faster done. You are able to add comments to an receipt to find them later easier or to store other informations.

### History
Within the history you can filter the receipts via various filter fields and options.

### Configuration of static Lists and Values
After you have added another cash book you are able to mark this cash book as the default one. You can also save default values for used language, person and payment group.
There is also the possibility to add and rename the the entries in the predefined lists.
  *	Persons
  *	Accounts (which are owned by a person)
  *	Stores
  *	Payment Groups

### Language support
Currently there is only support for english and german, but the database is easily extendable for other LTR languages.

## Usage on other Platforms then Windows
You have to build (and sign) your platform-dependent build yourself or just use this repository locally.

## Roadmap
  * Implementation of the analyitcal view
  * Refactoring/ overhaul of the design
  * Scanner for adding receipts
  * Migration paths for database upgrades
  * Unit tests and E2E tests
  * Automatic updates

  ## Screenshots
  
  ![details][details]
  ![history][history]
  ![settings][settings]

[details]: ./docu/screenshots/details.png "Receipt details"
[history]: ./docu/screenshots/history.png "Receipt history"
[settings]: ./docu/screenshots/settings.png "Settings"
