# Testovací protokol – Dluhopisový Radar

## Stav

- **VERIFIED:** `node --check script.js` bez chyby syntaxe.
- **VERIFIED:** dodaný `verify.py` ukončen kódem `0`; všechny kontroly souborů/assetů/geometrie jsou úspěšné.
- **VERIFIED:** vykreslení desktopového rozvržení při 1440 px: skutečný screenshot z Chromium, výška DOM cca 1807 px proti návrhovým 1799 px (rozdíl +0,4 %).
- **VERIFIED:** mobilní rozvržení při 390 px: obsah se vejde na šířku 390 px bez horizontálního scrollování, výška cca 3258 px.
- **VERIFIED:** otevření vyhledávání, hledání "Praha" (3 výsledky z ukázkových dat), filtr emitentů (3 výsledky), zavření Esc.
- **VERIFIED:** formulář: otevření, zobrazení validačních chyb, zadání korektních údajů, stažení `dluhopisovy-radar-poptavka.txt` a zobrazení výsledného stavu.
- **VERIFIED:** otevření článku v dialogu, zavření klávesou Esc, mobilní menu otevřeno/zavřeno.
- **VERIFIED:** žádná zaznamenaná JavaScriptová chyba ve funkčních testech.
- **ASSUMED:** přímé spuštění URL `file://` v běžném prohlížeči bude fungovat (prohlížeč v testovacím prostředí je blokuje, ale statické relativní assety a žádný local `fetch` to umožňují).
- **NOT_DONE:** integrace na skutečnou databázi firem, serverový kontaktní formulář a napojení reklamy – není součástí offline repliky.

## Přesný výstup kontrolního skriptu

```

  manifest entries: 10   asset files on disk: 10   referenced files: 12

  GEOMETRY  (reference width 1440px, tolerance +/-3%)
  section                spec        css     delta
  ------------------------------------------------
  header                 82px       82px     +0.0%
  hero                  430px      430px     +0.0%
  process               413px      413px     +0.0%
  actions               184px      184px     +0.0%
  insights              310px      310px     +0.0%
  databases             139px      139px     +0.0%
  adbanner              103px      103px     +0.0%
  footer                138px      138px     +0.0%
  ------------------------------------------------
  total: spec 1799px   css 1799px   +0.0%
  page ratio: spec 1.25   css 1.25


====================================================================
  VERIFY REPORT
====================================================================
  [PASS] entry point index.html             
  [PASS] all referenced files exist         
  [PASS] stylesheet linked                  
  [PASS] stylesheets non-trivial            
  [PASS] scripts non-empty                  
  [PASS] no absolute/sandbox paths          
  [PASS] no embedded base64 images          
  [PASS] no orphaned assets                 
  [PASS] manifest assets exist on disk      
  [PASS] manifest assets used in code       
  [PASS] every section has a fixed height   
  [PASS] section heights match spec         
  [PASS] total page height matches spec     spec 1799px vs css 1799px (+0.0%)
--------------------------------------------------------------------
  RESULT: ALL CHECKS PASSED
====================================================================

```
