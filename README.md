# Dluhopisový Radar — funkční offline web

## Spuštění

1. Rozbalte ZIP.
2. Otevřete složku `website`.
3. Dvojklikem otevřete soubor `index.html` v Safari, Chrome, Firefox nebo Edge.
4. Web nepotřebuje instalaci balíčků ani internetové připojení.

## Ovládání

- **Prověřit emitenta** otevře poptávkový formulář.
- **Srovnání emisí** otevře formulář pro porovnání.
- **Lupa** otevře vyhledávání; vyhledávání i filtry fungují v ukázkové databázi 16 fiktivních emitentů a 16 fiktivních emisí.
- **Články** otevřou stručné příklady obsahu; odkazy na databáze zobrazí prohledávatelný přehled.
- **Reklama** otevře poptávkový formulář.
- **Menu** na mobilu se otevírá a zavírá dotykem; dialogy se zavírají i klávesou Esc.
- **Odeslání formuláře** není možné bez backendu. Demo umí validovat pole a stáhnout požadavek jako lokální soubor `.txt`. Nic se neodesílá.

## Součásti ZIP

- `index.html` — obsah stránky.
- `styles.css` — vzhled a responzivní styly.
- `script.js` — dialogy, vyhledávání, filtry a formuláře.
- `assets/` — 10 lokálních obrázků.
- `SPEC.md`, `geometry.json`, `assets.json`, `ASSUMPTIONS.md` — rekonstrukční dokumentace.
- `verify.py` — kontrolní skript od zadavatele.
- `TEST_REPORT.md` — ověřovací protokol.

## Před veřejným provozem

Nahradit ukázkové záznamy ověřenou databází; napojit formuláře na server a e-mail; doplnit provozovatele, skutečný obsah článků, právní dokumenty, odpovědné redakční procesy a případnou správu reklamy.
