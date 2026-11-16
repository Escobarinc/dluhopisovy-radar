'use strict';
// Offline demonstrator. Illustrative records are explicitly NOT verified issuers or real bond offerings.
const issuerNames = [
  'Rezidence Orion — ukázka','Mosty Development — ukázka','Park Capital — ukázka','Horizon Reality — ukázka',
  'Modrá Čtvrť — ukázka','Stavby Sever — ukázka','Nové Zahrady — ukázka','Urban Point — ukázka',
  'Bydlení Jih — ukázka','City Growth — ukázka','Křišťál Estate — ukázka','Labe Projekt — ukázka',
  'Dům & Město — ukázka','Green Tower — ukázka','Orbis Centrum — ukázka','Metropole Group — ukázka'
];
const issuers = issuerNames.map((name,index)=>({id:index+1,name,type:'Emitent',city:['Praha','Brno','Ostrava','Plzeň','Hradec Králové','Olomouc'][index%6],field:index%3===0?'Rezidenční development':index%3===1?'Komerční nemovitosti':'Smíšené projekty'}));
const bonds = issuerNames.map((name,index)=>({id:index+1,name:`Emise ${String(index+1).padStart(2,'0')} – ${name.split(' —')[0]}`,type:'Emise',issuer:name,interest:(5.1+(index%8)*.45).toFixed(2).replace('.',','),maturity:2027+(index%6)}));
const articles={
  'article-risks':{title:'Jak číst emisní podmínky a odhalit klíčová rizika',date:'2. listopadu 2026',kind:'ANALÝZA',intro:'Emisní podmínky jsou základním dokumentem investice do dluhopisu. Jejich obsah je důležitější než marketingový slib výnosu.',bullets:['Zjistěte, kdo skutečně dluhopis vydává a kdo ručí za jeho splácení.','Prověřte účel emise, možnosti předčasného splacení a pořadí věřitelů.','Sledujte zajištění, finanční výsledky a vztahy s dalšími společnostmi ve skupině.']},
  'article-returns':{title:'Výnos není všechno. Na co si dát pozor u realitních dluhopisů',date:'27. října 2026',kind:'KOMENTÁŘ',intro:'Vyšší slíbený úrok může znamenat také vyšší riziko. Samotné procento nikdy nestačí k porovnání dvou emisí.',bullets:['Porovnejte výnos se splatností a tím, na co emitent peníze použije.','Zajímejte se o cash-flow projektu, dluh společnosti a možnost refinancování.','Před rozhodnutím si přečtěte dokumentaci a zvažte diverzifikaci portfolia.']},
  'article-developers':{title:'Dluhopisy developerských skupin: jak posoudit jejich kvalitu?',date:'20. října 2026',kind:'VZDĚLÁVÁNÍ',intro:'U developerských skupin je klíčové rozumět jednotlivým projektům, jejich financování a propojení s konkrétní emisí.',bullets:['Oddělte historii skupiny od právní a finanční situace konkrétního emitenta.','Zkontrolujte stav projektu, vlastnictví pozemků, povolení a předpokládaný harmonogram.','Ověřte smluvní zajištění, existující zástavy a další závazky.']}
};

const backdrop=document.getElementById('dialog-backdrop');
const dialog=backdrop.querySelector('.dialog');
const dialogTitle=document.getElementById('dialog-title');
const dialogKicker=document.getElementById('dialog-kicker');
const dialogContent=document.getElementById('dialog-content');
const closeButton=document.getElementById('close-dialog');
const menuButton=document.getElementById('menu-trigger');
const mobileNav=document.getElementById('mobile-nav');
let returnFocus=null;
let state={type:'all',query:'',kind:'search'};
const escapeHTML=(v)=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function openDialog(title,kicker,html){
  returnFocus=document.activeElement;
  dialogTitle.textContent=title;
  dialogKicker.textContent=kicker;
  dialogContent.innerHTML=html;
  backdrop.hidden=false;
  document.body.classList.add('dialog-open');
  dialog.scrollTop=0;
  closeButton.focus();
}
function closeDialog(){
  backdrop.hidden=true;
  document.body.classList.remove('dialog-open');
  dialogContent.innerHTML='';
  if(returnFocus&&typeof returnFocus.focus==='function')returnFocus.focus();
}
function formHTML(kind){
  let isAdvert=kind==='advertise';let compare=kind==='compare';
  return `<p class="dialog-lead">${isAdvert?'Napište, jakou reklamní spolupráci plánujete.':compare?'Uveďte emise nebo emitenty, které chcete porovnat.':'Uveďte emitenta nebo emisi a oblast, kterou potřebujete prověřit.'} Formulář funguje i bez internetu a připraví soubor s poptávkou.</p>
  <form id="lead-form" novalidate data-kind="${kind}"><div class="form-grid">
  <div class="field"><label for="lead-name">Jméno a příjmení *</label><input id="lead-name" name="jmeno" autocomplete="name" required maxlength="100" placeholder="Vaše jméno"><span class="form-error" data-error="jmeno"></span></div>
  <div class="field"><label for="lead-email">E-mail *</label><input id="lead-email" name="email" type="email" autocomplete="email" required maxlength="150" placeholder="vas@email.cz"><span class="form-error" data-error="email"></span></div>
  <div class="field span-two"><label for="lead-topic">${isAdvert?'Společnost / reklamní plocha':'Emitent / emise / předmět analýzy'} *</label><input id="lead-topic" name="predmet" required maxlength="200" placeholder="${isAdvert?'Vaše značka a požadované umístění':'Název emitenta, ISIN nebo více emisí'}"><span class="form-error" data-error="predmet"></span></div>
  <div class="field span-two"><label for="lead-message">Podrobnosti</label><textarea id="lead-message" name="zprava" maxlength="2500" placeholder="Doplňte informace k požadavku"></textarea></div>
  </div><div class="form-actions"><button type="submit" class="btn btn-primary">Uložit poptávku <svg class="ico"><use href="#i-arrow"/></svg></button><button type="reset" class="dialog-secondary">Vymazat údaje</button></div><p class="form-note">Offline ukázka: data nejsou odesílána. Stisknutím „Uložit poptávku“ vznikne textový soubor na vašem zařízení. Pro reálné doručování je třeba připojit server.</p><div id="form-status" role="status" aria-live="polite"></div></form>`;
}
function openForm(kind){
 const names={request:'Prověření emitenta',compare:'Srovnání emisí',advertise:'Reklama na portálu',contact:'Kontakt'};
 openDialog(names[kind]||'Kontakt','NEZÁVAZNÝ POŽADAVEK',formHTML(kind));
 dialog.querySelector('input').focus();
}
function modalStatic(kind){
 const page={
  about:['O projektu','NEZÁVISLÝ PORTÁL',`<p class="dialog-lead">Dluhopisový Radar představuje prostředí pro lepší orientaci v emitentech a firemních dluhopisech. Smyslem portálu je porovnávat dostupné informace, vysvětlovat rozdíly a pomáhat rozpoznávat rizika.</p><h3>Na co se zaměřujeme</h3><ul><li>Informace o emitentech, jejich hospodaření a vlastnické struktuře.</li><li>Rozbor emisních podmínek a parametrů dluhopisů.</li><li>Srozumitelné vzdělávací články a komentáře.</li></ul><p>Údaje v tomto stažitelném prototypu jsou jen ilustrativní. Nejde o nabídku investování ani investiční poradenství.</p>`],
  privacy:['Ochrana osobních údajů','PRÁVNÍ INFORMACE',`<p class="dialog-lead">Tento lokální prototyp neodesílá osobní údaje na žádný server a nepoužívá externí analytické nebo reklamní skripty.</p><p>Vyplněný formulář se ukládá pouze do souboru, který si stáhnete na své zařízení. Po zavření okna nejsou data formuláře na stránce uchovávána.</p><p>Před veřejným spuštěním je nutné doplnit skutečnou identifikaci provozovatele, účel a dobu zpracování údajů, kontaktní informace a úplné právní dokumenty.</p>`],
  terms:['Podmínky používání','PRÁVNÍ INFORMACE',`<p class="dialog-lead">Stránka je demonstrační prototyp uživatelského rozhraní, nikoliv živý finanční portál.</p><p>Zobrazené ukázkové emise a emitenti jsou fiktivní. Žádný obsah zde neslouží jako doporučení ke koupi či prodeji dluhopisů. Reálné analýzy, právní texty a ověřená data musí být doplněna před spuštěním produkčního webu.</p>`]
 }[kind];
 if(page)openDialog(page[0],page[1],page[2]);
}
function openArticle(id){
 const a=articles[id];if(!a)return;
 openDialog(a.title,a.kind,`<p class="article-detail-date">${a.date}</p><p class="dialog-lead">${a.intro}</p><h3>Na co se zaměřit</h3><ul class="detail-bullets">${a.bullets.map(v=>`<li>${escapeHTML(v)}</li>`).join('')}</ul><p>Text slouží jako stručná vzdělávací demonstrace části článku.</p><div class="form-actions"><button class="btn btn-primary" data-open="request" type="button">Požádat o prověření <svg class="ico"><use href="#i-arrow"/></svg></button></div>`);
}
function openArticles(){
 openDialog('Články, analýzy a komentáře','ČLÁNKY',`<p class="dialog-lead">Odborné pohledy a praktická témata související s investicemi do firemních dluhopisů.</p><ul class="result-list">${Object.entries(articles).map(([id,a])=>`<li class="result-item"><div><strong>${escapeHTML(a.title)}</strong><small>${a.kind} · ${a.date}</small></div><button class="dialog-secondary" type="button" data-open="${id}">Číst</button></li>`).join('')}</ul>`);
}
function openExplorer(kind){
 state={kind,type:kind==='bonds'?'bonds':kind==='emitters'?'emitters':'all',query:''};
 const title=kind==='emitters'?'Databáze emitentů':kind==='bonds'?'Databáze emisí':'Vyhledávání na Radaru';
 openDialog(title,'PROHLEDÁVÁNÍ DATABÁZE',`<div class="notice-sample">Ukázková databáze: záznamy níže jsou fiktivní, vytvořené jen pro ověření vyhledávání. Nejsou prověřené ani aktuální investiční nabídky.</div><label class="search-field"><svg class="ico"><use href="#i-search"/></svg><input id="search-query" type="search" placeholder="Zadejte emitenta, emisi nebo město" autocomplete="off" aria-label="Hledat v databázi"></label><div class="filters" role="group" aria-label="Filtrovat záznamy"><button class="filter-pill" data-filter="all" aria-pressed="false" type="button">Vše</button><button class="filter-pill" data-filter="emitters" aria-pressed="false" type="button">Emitenti</button><button class="filter-pill" data-filter="bonds" aria-pressed="false" type="button">Emise</button></div><p id="result-count" class="form-note" aria-live="polite"></p><ul class="result-list" id="result-list"></ul>`);
 updateResults();
 document.getElementById('search-query').focus();
}
function updateResults(){
 const list=document.getElementById('result-list');if(!list)return;
 document.querySelectorAll('.filter-pill').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.filter===state.type)));
 const raw=(state.type==='emitters'?issuers:state.type==='bonds'?bonds:[...issuers,...bonds]);
 const q=state.query.trim().toLocaleLowerCase('cs');
 const found=raw.filter(r=>[r.name,r.city,r.field,r.issuer,r.interest,r.maturity].filter(v=>v!==undefined).join(' ').toLocaleLowerCase('cs').includes(q));
 document.getElementById('result-count').textContent=`Zobrazeno ${found.length} z ${raw.length} ukázkových záznamů`;
 list.innerHTML=found.length?found.map(r=>`<li class="result-item"><div><strong>${escapeHTML(r.name)}</strong><small>${r.type==='Emitent'?escapeHTML(`${r.city} · ${r.field}`):`Modelový výnos ${r.interest} % p.a. · splatnost ${r.maturity}`}</small></div><span class="result-tag">${r.type}</span></li>`).join(''):'<li class="no-results">Pro zadaný výraz nebyl v ukázkových záznamech nalezen žádný výsledek.</li>';
}
function openByType(kind){
 if(['request','compare','advertise','contact'].includes(kind))return openForm(kind);
 if(['emitters','bonds','search'].includes(kind))return openExplorer(kind);
 if(kind==='articles')return openArticles();
 if(articles[kind])return openArticle(kind);
 modalStatic(kind);
}
function downloadLead(form){
 const d=new FormData(form);const row=[`Dluhopisový Radar – lokálně uložená poptávka`,`Typ: ${form.dataset.kind}`,`Datum: ${new Date().toLocaleString('cs-CZ')}`,...['jmeno','email','predmet','zprava'].map(k=>`${k}: ${d.get(k)||''}`),``, `Toto je offline výstup. Poptávka nebyla odeslána.`];
 const blob=new Blob([row.join('\n')],{type:'text/plain;charset=utf-8'});
 const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='dluhopisovy-radar-poptavka.txt';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),800);
}
function submitLead(form){
 const formStatus=document.getElementById('form-status');formStatus.innerHTML='';
 const name=form.elements.namedItem('jmeno'),email=form.elements.namedItem('email'),subject=form.elements.namedItem('predmet');
 const fields=[name,email,subject];let valid=true;
 fields.forEach(el=>{
  const missing=!el.value.trim();const badEmail=el===email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
  const error=el.parentElement.querySelector('.form-error');error.textContent=missing?'Toto pole je povinné.':badEmail?'Zadejte platnou e-mailovou adresu.':'';
  el.setAttribute('aria-invalid',String(missing||badEmail));
  if(missing||badEmail){valid=false;if(!form.dataset.firstError)form.dataset.firstError=el.name;}
 });
 if(!valid){form.elements.namedItem(form.dataset.firstError).focus();delete form.dataset.firstError;return;}
 downloadLead(form);
 formStatus.innerHTML='<div class="form-status"><strong>Soubor s poptávkou byl připraven ke stažení.</strong><br>Údaje se nikam neposlaly. Pro skutečné odesílání je potřeba doplnit backend.</div>';
}

document.addEventListener('click',(e)=>{
 const trigger=e.target.closest('[data-open]');
 if(trigger){e.preventDefault();openByType(trigger.dataset.open);mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false');return;}
 const filter=e.target.closest('[data-filter]');
 if(filter){state.type=filter.dataset.filter;updateResults();return;}
 const mobileAnchor=e.target.closest('#mobile-nav a');if(mobileAnchor){mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false');}
});
document.getElementById('open-search').addEventListener('click',()=>openExplorer('search'));
closeButton.addEventListener('click',closeDialog);
backdrop.addEventListener('click',e=>{if(e.target===backdrop)closeDialog()});
menuButton.addEventListener('click',()=>{const willOpen=mobileNav.hidden;mobileNav.hidden=!willOpen;menuButton.setAttribute('aria-expanded',String(willOpen));});
dialogContent.addEventListener('input',e=>{if(e.target.id==='search-query'){state.query=e.target.value;updateResults();}else if(e.target.matches('input[aria-invalid="true"]')){e.target.removeAttribute('aria-invalid');const error=e.target.parentElement.querySelector('.form-error');if(error)error.textContent='';}});
dialogContent.addEventListener('submit',e=>{if(e.target.id==='lead-form'){e.preventDefault();submitLead(e.target);}});
dialogContent.addEventListener('reset',e=>{setTimeout(()=>{e.target.querySelectorAll('.form-error').forEach(el=>el.textContent='');document.getElementById('form-status').innerHTML='';},0)});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){
  if(!backdrop.hidden){closeDialog();e.preventDefault()}
  else if(!mobileNav.hidden){mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false')}
 }
 if(e.key==='Tab'&&!backdrop.hidden){const focusables=[...dialog.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href]')].filter(el=>el.offsetParent!==null);if(!focusables.length)return;const first=focusables[0],last=focusables[focusables.length-1];if(e.shiftKey&&document.activeElement===first){last.focus();e.preventDefault()}else if(!e.shiftKey&&document.activeElement===last){first.focus();e.preventDefault()}}
});
