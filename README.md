# QR Hunt
QR Hunt is a game where multiple teams compete to the most quartet sets. A quartet piece can be found as QR codes in a physical area set out by the game master.
By scanning a QR code a team can claim a quartet piece. There are also special QR codes giving the team a power up or a power down to apply to another team.

## Requirements
Requirements other than the normal Laravel 11 requirements.
- php8.3-imagick
- [Soketi](https://docs.soketi.app/)

## Todo
### MVP
- Power up/downs testen.
- Alles ff door testen

### Leuk voor erbij
- Scan cooldown.
- Opdrachten bij sommige QR codes.
- Een paar hints over waar een QR code bevindt. Voor elke hint is x aantal punten aftrek.
- Push notificaties
- Makkelijk point modifiers toevoegen voor de game master.
- Haptics? (@capacitor/haptics)
- Notificaties? (@capacitor/local-notifications)
- 'Ongelezen' QR codes. Mocht je een QR code krijgen zonder dat je het door hebt.
- Pagina met info / regels.
- Grafiekjes op dashboard over spel verloop.
- Keertje de breadcrumbs fixen in dashboard.
- Verander qr received van toast naar modal zoals scanned qr.

## Also
This project is made with a very tight deadline. So don't expect quality ;p. Shortcuts and mistakes were made.
