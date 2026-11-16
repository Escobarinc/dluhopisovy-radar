# Předpoklady, omezení a odchylky

- Zdroj je celostránkový obrázek 1122 × 1402 px bez okraje; mód REPLICA. Geometrie se přepočítala na šířku 1440 px.
- Přesný autorský font z předlohy není k dispozici. Náhrady: Georgia a Arial.
- Hlavní fotka rezidenčního komplexu byla samostatně vygenerována. Zbývající fotografické regiony byly vyříznuty z **nově vygenerovaných alternativních AI vizualizací** odpovídajícího tématu, nikoli z uživatelské referenční fotografie. To je vědomá odchylka od požadavku MASTER na samostatné generování každé fotografie; některé dílčí fotografie proto mají omezenou původní detailnost.
- U některých odlišných architektonických ploch se může opakovat podobný motiv skleněných budov. Finální fotografie byly použity vždy jako samostatné soubory.
- Všechno hlavní rozhraní (texty, tlačítka, formuláře, menu, karty) je skutečné HTML/CSS/JS, ne obrázek stránky. Původní screenshot nebyl použit jako asset stránky.
- Drobný text ze spodní části reference byl opsán s maximální vizuální věrností; u nečitelných drobných detailů nelze garantovat shodu znaku po znaku.
- Emitenti, emise a modelové výnosy ve vyhledávání jsou **fiktivní ukázková data**; nejsou skutečně ověřenými investičními informacemi.
- Kontakt a poptávky: offline demo provádí kontrolu údajů a ukládá výsledek jako stažitelný soubor, **neodesílá** jej nikomu. Produkční doručování vyžaduje backend.
- V prostředí testovacího prohlížeče jsou navigace přímo na `file://` a `localhost` blokované administrativní politikou. Testy proto používaly ekvivalentní HTML s lokálními CSS/JS/obrázky vloženými pro účely QA do prohlížeče. V dodaných souborech žádné takové inline base64 obrázky nejsou; zůstávají jen relativní cesty.
- P5: Srovnání podle prohlížečových screenshotů pro desktop 1440 px a mobil 390 px proběhlo. Ověřeno vizuálně, není to strojově potvrzená pixel-perfect shoda.
