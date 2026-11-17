'use strict';
// Články na webu (stránky clanek-*.html) – používá je vyhledávání.
const RADAR_ARTICLES=[{"slug": "emitent-7-ukazatelu", "title": "Jak poznat kvalitního emitenta dluhopisů? Sedm klíčových ukazatelů", "perex": "Výše úroku je jen jedna část příběhu. Rozhodující je finanční síla skutečného dlužníka – a u projektových společností také to, zda za jejich závazky právně odpovídá silnější společnost skupiny.", "label": "Analýza", "date": "listopad 2026", "mins": 7}, {"slug": "zajisteni-firemnich-dluhopisu", "title": "Zajištění firemních dluhopisů: jaké existují možnosti a co znamenají pro investora?", "perex": "Zajištění patří k důležitým vlastnostem dluhopisové emise. Neříká však samo o sobě, zda emitent dokáže včas platit úroky a splatit jistinu. Jeho význam se nejlépe ukáže tehdy, když běžné splácení přestane fungovat.", "label": "Analýza", "date": "listopad 2026", "mins": 7}, {"slug": "statni-a-firemni-dluhopisy", "title": "Státní a firemní dluhopisy: v čem se skutečně liší?", "perex": "Dluhopis je vždy závazek někoho jiného. Někdy si prostřednictvím dluhopisů půjčuje stát, jindy podnik, který chce financovat své aktivity. Formálně jde o podobný nástroj, ekonomicky však o dvě odlišné situace. Rozhodující není samotný název cenného papíru, ale povaha dlužníka a zdroje, z nichž bude svůj dluh splácet.", "label": "Komentář", "date": "listopad 2026", "mins": 7}, {"slug": "dluhopisy-od-a-do-z", "title": "Dluhopisy od A do Z: Jak fungují a proč do nich lidé investují", "perex": "Dluhopisy patří mezi nejstarší a nejrozšířenější finanční nástroje na světě. Prostřednictvím dluhopisů získávají financování státy, města i soukromé společnosti. Pro investory představují možnost pravidelného úrokového příjmu a mohou tvořit důležitou součást investičního portfolia. Jak ale dluhopisy skutečně fungují, odkud se bere jejich výnos a jaká rizika jsou s nimi spojena?", "label": "Vzdělávání", "date": "listopad 2026", "mins": 10}, {"slug": "desatero-cnb", "title": "Desatero ČNB k podnikovým dluhopisům: Deset zásad, kterým je dobré rozumět", "perex": "Podnikové dluhopisy umožňují společnostem získávat kapitál přímo od investorů. Jejich držitelé se tím nestávají spoluvlastníky firmy, ale jejími věřiteli. Právě tato jednoduchá skutečnost je klíčem k porozumění výnosům, emisním podmínkám i rizikům, která s sebou firemní dluhopisy nesou.", "label": "Vzdělávání", "date": "listopad 2026", "mins": 6}];
// Napojení na CLARIX CRM: po doplnění klíče webu (CRM → Nastavení → Weby a měření) se načte měření
// a formuláře posílají poptávky rovnou do CRM. Bez klíče web funguje dál jako ukázka.
const CRM={origin:'https://crm.clarix.cz',key:''};
if(CRM.key){const t=document.createElement('script');t.src=`${CRM.origin}/api/t.js?k=${encodeURIComponent(CRM.key)}`;t.defer=true;document.head.appendChild(t);}
function sendToCrm(data){
  if(!(window.clarixTrack&&typeof window.clarixTrack.lead==='function'))return null;
  return window.clarixTrack.lead(data).then(r=>{if(r&&r.error)throw new Error(r.error);return r;});
}
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
 openDialog(title,'PROHLEDÁVÁNÍ DATABÁZE',`<div class="notice-sample">Ukázková databáze: záznamy níže jsou fiktivní, vytvořené jen pro ověření vyhledávání. Nejsou prověřené ani aktuální investiční nabídky.</div><label class="search-field"><svg class="ico"><use href="#i-search"/></svg><input id="search-query" type="search" placeholder="Zadejte emitenta, emisi, město nebo téma článku" autocomplete="off" aria-label="Hledat v databázi"></label><div class="filters" role="group" aria-label="Filtrovat záznamy"><button class="filter-pill" data-filter="all" aria-pressed="false" type="button">Vše</button><button class="filter-pill" data-filter="emitters" aria-pressed="false" type="button">Emitenti</button><button class="filter-pill" data-filter="bonds" aria-pressed="false" type="button">Emise</button><button class="filter-pill" data-filter="articles" aria-pressed="false" type="button">Články</button></div><p id="result-count" class="form-note" aria-live="polite"></p><ul class="result-list" id="result-list"></ul>`);
 updateResults();
 document.getElementById('search-query').focus();
}
function updateResults(){
 const list=document.getElementById('result-list');if(!list)return;
 document.querySelectorAll('.filter-pill').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.filter===state.type)));
 const arts=RADAR_ARTICLES.map(a=>({id:a.slug,name:a.title,type:'Článek',kind:a.label,date:a.date,text:a.perex}));
 const raw=(state.type==='emitters'?issuers:state.type==='bonds'?bonds:state.type==='articles'?arts:[...issuers,...bonds,...arts]);
 const q=state.query.trim().toLocaleLowerCase('cs');
 const found=raw.filter(r=>[r.name,r.city,r.field,r.issuer,r.interest,r.maturity,r.kind,r.text].filter(v=>v!==undefined).join(' ').toLocaleLowerCase('cs').includes(q));
 document.getElementById('result-count').textContent=`Zobrazeno ${found.length} z ${raw.length} záznamů`;
 list.innerHTML=found.length?found.map(r=>`<li class="result-item"><div><strong>${escapeHTML(r.name)}</strong><small>${r.type==='Emitent'?escapeHTML(`${r.city} · ${r.field}`):r.type==='Článek'?escapeHTML(`${r.kind} · ${r.date}`):`Modelový výnos ${r.interest} % p.a. · splatnost ${r.maturity}`}</small></div>${r.type==='Článek'?`<a class="dialog-secondary" href="clanek-${r.id}.html">Číst</a>`:`<span class="result-tag">${r.type}</span>`}</li>`).join(''):'<li class="no-results">Pro zadaný výraz nebyl v ukázkových záznamech nalezen žádný výsledek.</li>';
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
 const fd=new FormData(form);
 const crm=sendToCrm({name:fd.get('jmeno'),email:fd.get('email'),consent:true,formular:{request:'Prověření emitenta',compare:'Porovnání emisí',advertise:'Reklama',contact:'Kontakt'}[form.dataset.kind]||form.dataset.kind,message:[`Předmět: ${fd.get('predmet')||''}`,fd.get('zprava')||''].filter(Boolean).join('\n')});
 if(crm){formStatus.innerHTML='<div class="form-status">Odesílám…</div>';crm.then(()=>{formStatus.innerHTML='<div class="form-status"><strong>Děkujeme, poptávku jsme přijali.</strong><br>Ozveme se vám co nejdřív.</div>';form.reset();}).catch(e=>{formStatus.innerHTML=`<div class="form-status">Odeslání se nepodařilo: ${escapeHTML(e.message||'zkuste to prosím znovu')}</div>`;});return;}
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

// Podstránky: seznam emitentů a emisí s vyhledáváním
(function(){
  const box=document.getElementById('emitter-list')||document.getElementById('bond-list');
  if(!box)return;
  const isEmitters=box.id==='emitter-list';
  const clean=(n)=>n.replace(' — ukázka','');
  const rows=isEmitters
    ? issuers.map((r,i)=>({text:[clean(r.name),r.city,r.field].join(' '),html:`<div><strong>${escapeHTML(clean(r.name))}</strong><small>${escapeHTML(r.city)} · ${escapeHTML(r.field)}</small></div><div class="data-figures"><span>Výnos emise<b class="yield">${bonds[i].interest} %</b></span><span>Splatnost<b>${bonds[i].maturity}</b></span></div><a class="btn btn-primary" href="proverit-emitenta.html?emitent=${encodeURIComponent(clean(r.name))}">Prověřit emitenta</a>`}))
    : bonds.map(b=>({text:[b.name,clean(b.issuer),b.interest,b.maturity].join(' '),html:`<div><strong>${escapeHTML(b.name)}</strong><small>Emitent: ${escapeHTML(clean(b.issuer))}</small></div><div class="data-figures"><span>Výnos p.a.<b class="yield">${b.interest} %</b></span><span>Splatnost<b>${b.maturity}</b></span></div><a class="btn btn-outline" href="porovnat-emise.html?emise=${encodeURIComponent(b.name)}">Porovnat</a>`}));
  const q=document.getElementById('list-q'),count=document.getElementById('list-count');
  const render=()=>{
    const term=(q.value||'').trim().toLocaleLowerCase('cs');
    const found=rows.filter(r=>r.text.toLocaleLowerCase('cs').includes(term));
    box.innerHTML=found.length?found.map(r=>`<div class="data-row">${r.html}</div>`).join(''):`<p class="data-empty">Hledanému výrazu neodpovídá žádný záznam.</p>`;
    count.textContent=`Zobrazeno ${found.length} z ${rows.length}`;
  };
  q.addEventListener('input',render);render();
})();

// Rozbalovací menu (Databáze, Články a analýzy)
(function(){
  const groups=[...document.querySelectorAll('.nav-group')];
  const close=(except)=>groups.forEach(g=>{if(g!==except){g.classList.remove('open');g.querySelector('.nav-toggle').setAttribute('aria-expanded','false');}});
  groups.forEach(g=>g.querySelector('.nav-toggle').addEventListener('click',()=>{const open=!g.classList.contains('open');close(g);g.classList.toggle('open',open);g.querySelector('.nav-toggle').setAttribute('aria-expanded',String(open));}));
  document.addEventListener('click',e=>{if(!e.target.closest('.nav-group'))close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
})();

// Stránky s formulářem (Prověřit emitenta, Porovnat emise)
(function(){
  const form=document.getElementById('page-form');
  if(!form)return;
  const MAX_FILE=10*1024*1024;
  const params=new URLSearchParams(location.search);
  form.querySelectorAll('[data-prefill]').forEach(el=>{const v=params.get(el.dataset.prefill);if(v)el.value=v;});
  const errFor=el=>el.type==='checkbox'?form.querySelector(`[data-for="${el.name}"]`):el.closest('.field')&&el.closest('.field').querySelector('.form-error');
  const groupErr=g=>g.parentElement.querySelector('[data-group-error]');
  form.addEventListener('input',e=>{const el=e.target;if(el.getAttribute('aria-invalid')==='true'){el.removeAttribute('aria-invalid');const er=errFor(el);if(er)er.textContent='';}});
  form.addEventListener('change',e=>{
    const el=e.target;
    if(el.type==='checkbox'){const g=el.closest('[data-required-group]');if(g&&g.querySelector('input:checked')){const er=groupErr(g);if(er)er.textContent='';}
      if(el.required&&el.checked){const er=errFor(el);if(er)er.textContent='';}}
    if(el.type==='file')showFiles(el);
    markSteps();
  });
  // nahrané soubory: seznam a kontrola velikosti
  function showFiles(input){
    const box=input.closest('.doc-box')||form;
    const list=box.querySelector('.file-list')||document.getElementById('file-list'),er=box.querySelector('[data-file-error]');if(!list)return;
    const files=[...input.files];
    list.innerHTML=files.map(f=>`<li class="${f.size>MAX_FILE?'too-big':''}">${escapeHTML(f.name)} <small>${(f.size/1048576).toFixed(1).replace('.',',')} MB</small></li>`).join('');
    if(er)er.textContent=files.some(f=>f.size>MAX_FILE)?'Soubor je větší než 10 MB. Zmenšete ho nebo vložte odkaz.':'';
  }
  form.querySelectorAll('[data-reveal]').forEach(btn=>btn.addEventListener('click',()=>{const t=document.getElementById(btn.dataset.reveal);if(t){t.hidden=false;btn.hidden=true;const i=t.querySelector('input');if(i)i.focus();}}));
  form.addEventListener('input',e=>{const box=e.target.closest('[data-require-one]');if(box){const er=box.querySelector('[data-one-error]');if(er)er.textContent='';box.classList.remove('is-invalid');}});
  // kroky nahoře: aktuální část a vyplněné části
  const steps=[...form.querySelectorAll('.req-steps a')];
  const blocks=steps.map(a=>document.querySelector(a.getAttribute('href')));
  function filled(bl){return [...bl.querySelectorAll('input,textarea')].some(el=>el.type==='checkbox'?el.checked&&el.name!=='marketing':el.type==='file'?el.files.length>0:el.value.trim()!=='');}
  function markSteps(){steps.forEach((a,i)=>a.classList.toggle('is-done',!!blocks[i]&&filled(blocks[i])));}
  if(steps.length&&'IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){const i=blocks.indexOf(en.target);steps.forEach((a,j)=>a.classList.toggle('is-active',j===i));}}),{rootMargin:'-40% 0px -55% 0px'});
    blocks.forEach(b=>b&&io.observe(b));
  }
  form.addEventListener('input',markSteps);markSteps();

  form.addEventListener('submit',e=>{
    e.preventDefault();
    let first=null;
    const flag=(el,msg)=>{el.setAttribute('aria-invalid',String(!!msg));const er=errFor(el);if(er)er.textContent=msg;if(msg&&!first)first=el;};
    form.querySelectorAll('[required]').forEach(el=>{
      const v=el.type==='checkbox'?el.checked:el.value.trim();
      flag(el,!v?(el.type==='checkbox'?'Pro odeslání je potřeba souhlas.':'Vyplňte toto pole.'):(el.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim())?'Zadejte e-mail ve tvaru jmeno@domena.cz.':''));
    });
    form.querySelectorAll('input[type=url]').forEach(el=>{const v=el.value.trim();if(v)flag(el,/^https?:\/\/\S+\.\S+/.test(v)?'':'Zadejte celý odkaz začínající https://');});
    form.querySelectorAll('[data-required-group]').forEach(g=>{
      const ok=!!g.querySelector('input:checked'),er=groupErr(g);
      if(er)er.textContent=ok?'':'Vyberte alespoň jednu možnost.';
      if(!ok&&!first)first=g.querySelector('input');
    });
    form.querySelectorAll('[data-require-one]').forEach(box=>{
      const ok=[...box.querySelectorAll('input')].some(i=>i.value.trim()),er=box.querySelector('[data-one-error]');
      if(er)er.textContent=ok?'':'Vyplňte emitenta nebo název emise.';box.classList.toggle('is-invalid',!ok);
      if(!ok&&!first)first=box.querySelector('input');
    });
    const fileInputs=[...form.querySelectorAll('input[type=file]')];
    fileInputs.forEach(fi=>{if([...fi.files].some(f=>f.size>MAX_FILE)&&!first)first=fi;});
    const status=document.getElementById('form-status');
    if(first){first.focus();first.scrollIntoView({block:'center'});status.innerHTML='';return;}

    const d=new FormData(form),lines=[];
    form.querySelectorAll('select,input:not([type=checkbox]):not([type=file]),textarea').forEach(el=>{
      const label=form.querySelector(`label[for="${el.id}"]`);
      if(el.value.trim())lines.push(`${el.dataset.label?el.dataset.label:label?label.textContent.replace(/\s*\*|\(nepovinné\)/g,'').trim():el.name}: ${el.value.trim()}`);
    });
    form.querySelectorAll('.check-grid[data-label]').forEach(g=>{const v=[...g.querySelectorAll('input:checked')].map(i=>i.value);if(v.length)lines.push(`${g.dataset.label}: ${v.join('; ')}`);});
    fileInputs.forEach(fi=>{if(fi.files.length)lines.push(`${fi.dataset.label||'Přiložené dokumenty'}: ${[...fi.files].map(f=>f.name).join(', ')}`);});
    if(form.querySelector('[name=marketing]'))lines.push(`Marketingový souhlas: ${d.get('marketing')?'ano':'ne'}`);
    const email=String(d.get('email')||'').trim();
    const crm=sendToCrm({name:String(d.get('jmeno')||email),email,phone:d.get('telefon')||'',consent:true,formular:form.dataset.kind,message:lines.join('\n')});
    const btn=form.querySelector('[type=submit]');
    if(crm){
      btn.disabled=true;status.innerHTML='<div class="form-status">Odesílám…</div>';
      crm.then(()=>{status.innerHTML='<div class="form-status"><strong>Děkujeme, žádost jsme přijali.</strong><br>Výsledek vám pošleme na e-mail.</div>';form.reset();markSteps();form.querySelectorAll('.file-list').forEach(l=>l.innerHTML='');})
         .catch(e=>{status.innerHTML=`<div class="form-status">Odeslání se nepodařilo: ${escapeHTML(e.message||'zkuste to prosím znovu')}</div>`;})
         .finally(()=>{btn.disabled=false;});
      return;
    }
    const text=[`Dluhopisový Radar – ${form.dataset.kind}`,`Datum: ${new Date().toLocaleString('cs-CZ')}`,'',...lines,'','Ukázková verze: žádost nebyla nikam odeslána.'].join('\n');
    const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
    const a=Object.assign(document.createElement('a'),{href:url,download:'dluhopisovy-radar-zadost.txt'});
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),800);
    status.innerHTML='<div class="form-status"><strong>Žádost je připravená a stáhla se jako soubor.</strong><br>Ukázková verze ji zatím nikam neodesílá.</div>';
  });
})();

// Filtr článků podle typu (#analyzy, #komentare, #vzdelavani)
(function(){
  const bar=document.querySelector('.cat-filter');
  if(!bar)return;
  const apply=()=>{
    const cat=location.hash.replace('#','');
    const valid=['analyzy','komentare','vzdelavani'].includes(cat)?cat:'';
    document.querySelectorAll('.article-card[data-cat]').forEach(c=>c.hidden=!!valid&&c.dataset.cat!==valid);
    bar.querySelectorAll('a').forEach(a=>a.setAttribute('aria-current',String(a.dataset.cat===valid)));
  };
  addEventListener('hashchange',apply);apply();
})();

// Databáze: Emitenti a Emise (filtry, řazení, stránkování).
// Zatím ukázková data. Po napojení na CRM se sem načtou /api/public/ic/emitenti a /api/public/ic/emise
// – stačí naplnit pole DB.emitenti a DB.emise ve stejném tvaru a zavolat render().
(function(){
  const table=document.getElementById('db-table');
  if(!table)return;
  const KIND=table.dataset.kind, PER=25, YEAR=new Date().getFullYear();
  const clean=n=>n.replace(' — ukázka','');
  // IČO a ISIN v ukázce jsou záměrně neplatné, aby se nepletly se skutečnými firmami.
  const demoIco=i=>{for(let k=0;;k++){const d=String(91000000+i*137+k).split('').map(Number);const sum=d.slice(0,7).reduce((a,x,j)=>a+x*(8-j),0);const c=(11-sum%11)%10;if(d[7]!==c)return d.join('');}};
  const STREETS=['Ukázková','Vzorová','Příkladná','Demonstrační','Modelová','Testovací'];
  const emitenti=issuers.map((r,i)=>{
    const zalozeno=2006+((i*5)%17);
    return {ico:demoIco(i),nazev:clean(r.name),obor:r.field,mesto:r.city,sidlo:`${STREETS[i%6]} ${10+i*7}, ${r.city}`,
      forma:i%3===0?'s.r.o.':'a.s.',zalozeno,zaverky:i%7===3?0:Math.min(YEAR-zalozeno,1+(i*3)%6)};
  });
  const ZAJ=['zajistena','nezajistena','zajistena','nezjisteno'];
  const emise=[];
  emitenti.forEach((e,i)=>{
    const n=1+(i*3)%6;
    for(let k=0;k<n;k++){
      const idx=emise.length;
      const kupon=i%9===4&&k===0?null:+(5.2+((i+k*2)%9)*0.45).toFixed(2);
      const splatnost=2024+((i+k*3)%9);
      const jmen=[1000,10000,50000,100000][(i+k)%4];
      const zaj=ZAJ[(i+k)%4];
      const doloz=[kupon!=null,true,zaj!=='nezjisteno',e.zaverky>0,(i+k)%3!==1].filter(Boolean).length;
      emise.push({isin:'CZDEMO'+String(idx+1).padStart(6,'0'),ico:e.ico,emitent:e.nazev,nazev:`${e.nazev} ${kupon!=null?kupon.toFixed(2).replace('.',','):'–'}/${String(splatnost).slice(2)}`,
        kupon,splatnost,aktivni:splatnost>YEAR,jmen,min:jmen<10000?10000:jmen,zajisteni:zaj,doloz});
    }
  });
  emitenti.forEach(e=>{const m=emise.filter(x=>x.ico===e.ico);e.emise=m.length;e.aktivni=m.filter(x=>x.aktivni).length;});

  const $=id=>document.getElementById(id);
  const cz=n=>n.toLocaleString('cs-CZ');
  const pct=n=>n==null?'<span class="na">Nezjištěno</span>':n.toFixed(2).replace('.',',')+' %';
  const ZT={zajistena:'Zajištěná',nezajistena:'Nezajištěná',nezjisteno:'<span class="na">Nezjištěno</span>'};
  const ICO_CMP='<svg class="ico" viewBox="0 0 24 24"><path d="M7 20h10M6 6l6-1 6 1M12 3v17M9 12 6 6l-3 6a3 3 0 0 0 6 0M21 12l-3-6-3 6a3 3 0 0 0 6 0"/></svg>';
  const ICO_CHK='<svg class="ico" viewBox="0 0 24 24"><path d="M3 21h10M5 21V6l7-3v9"/><circle cx="16.5" cy="16.5" r="3.5"/><path d="m21 21-2-2"/></svg>';
  let sort=KIND==='emise'?'doloz':'emise', page=1;

  // naplnění výběrů ze záznamů
  if(KIND==='emitenti'){const s=$('flt-sidlo');[...new Set(emitenti.map(e=>e.mesto))].sort((a,b)=>a.localeCompare(b,'cs')).forEach(c=>s.add(new Option(c,c)));}
  else{const s=$('flt-emitent');emitenti.slice().sort((a,b)=>a.nazev.localeCompare(b.nazev,'cs')).forEach(e=>s.add(new Option(e.nazev,e.ico)));}

  function rows(){
    const q=$('db-q').value.trim().toLocaleLowerCase('cs'), v=id=>($(id)||{}).value||'';
    if(KIND==='emitenti'){
      return emitenti.filter(e=>{
        if(q&&![e.nazev,e.ico,e.sidlo].join(' ').toLocaleLowerCase('cs').includes(q))return false;
        const p=v('flt-pocet');if(p==='1'&&e.emise!==1||p==='2-5'&&(e.emise<2||e.emise>5)||p==='6'&&e.emise<6)return false;
        const a=v('flt-aktivni');if(a==='ano'&&!e.aktivni||a==='ne'&&e.aktivni)return false;
        if(v('flt-sidlo')&&e.mesto!==v('flt-sidlo'))return false;
        if(v('flt-forma')&&e.forma!==v('flt-forma'))return false;
        const st=v('flt-stari'),age=YEAR-e.zalozeno;if(st==='0-3'&&age>3||st==='3-10'&&(age<3||age>10)||st==='10'&&age<=10)return false;
        const z=v('flt-zaverka');if(z==='ano'&&!e.zaverky||z==='ne'&&e.zaverky)return false;
        return true;
      }).sort((a,b)=>sort==='nazev'?a.nazev.localeCompare(b.nazev,'cs'):sort==='stari'?a.zalozeno-b.zalozeno:b.emise-a.emise||a.nazev.localeCompare(b.nazev,'cs'));
    }
    return emise.filter(e=>{
      if(q&&![e.isin,e.emitent,e.nazev].join(' ').toLocaleLowerCase('cs').includes(q))return false;
      if(v('flt-emitent')&&e.ico!==v('flt-emitent'))return false;
      const k=v('flt-kupon');if(k&&(e.kupon==null||k==='0-6'&&e.kupon>=6||k==='6-8'&&(e.kupon<6||e.kupon>8)||k==='8'&&e.kupon<=8))return false;
      const st=v('flt-stav');if(st==='aktivni'&&!e.aktivni||st==='splaceno'&&e.aktivni)return false;
      const sp=v('flt-splatnost');if(sp==='-2027'&&e.splatnost>2027||sp==='2028-2030'&&(e.splatnost<2028||e.splatnost>2030)||sp==='2031-'&&e.splatnost<2031)return false;
      if(v('flt-zajisteni')&&e.zajisteni!==v('flt-zajisteni'))return false;
      const m=v('flt-min');if(m==='10000'&&e.min>10000||m==='50000'&&e.min>50000||m==='50001'&&e.min<=50000)return false;
      return true;
    }).sort((a,b)=>sort==='kupon'?(b.kupon??-1)-(a.kupon??-1):sort==='splatnost'?a.splatnost-b.splatnost:sort==='emitent'?a.emitent.localeCompare(b.emitent,'cs'):sort==='isin'?a.isin.localeCompare(b.isin):b.doloz-a.doloz||a.isin.localeCompare(b.isin));
  }
  function render(){
    const all=rows(), pages=Math.max(1,Math.ceil(all.length/PER));page=Math.min(page,pages);
    const from=(page-1)*PER, list=all.slice(from,from+PER), unit=KIND==='emise'?'emisí':'emitentů';
    $('db-count').textContent=all.length?`Řádky ${from+1}–${from+list.length} z ${all.length} ${unit}`:`Žádný záznam z ${KIND==='emise'?emise.length:emitenti.length} ${unit}`;
    $('db-body').innerHTML=list.length?list.map((r,i)=>KIND==='emitenti'?
      `<tr><td class="c-n">${from+i+1}</td><td><strong>${escapeHTML(r.nazev)}</strong><small>${escapeHTML(r.obor)}, ${r.forma}</small></td><td class="mono">${r.ico}</td><td>${escapeHTML(r.sidlo)}</td><td class="num">${r.emise}</td><td class="num">${r.aktivni}</td><td class="num">${r.zaverky?r.zaverky+' let':'<span class="na">Chybí</span>'}</td>
        <td class="c-act"><a class="act" href="proverit-emitenta.html?emitent=${encodeURIComponent(r.nazev)}" title="Prověřit emitenta" aria-label="Prověřit ${escapeHTML(r.nazev)}">${ICO_CHK}</a><a class="act" href="emise.html?emitent=${r.ico}" title="Emise tohoto emitenta" aria-label="Emise emitenta ${escapeHTML(r.nazev)}"><svg class="ico"><use href="#i-layers"/></svg></a></td></tr>`:
      `<tr><td class="c-n">${from+i+1}</td><td class="mono"><strong>${r.isin}</strong></td><td>${escapeHTML(r.emitent)}</td><td class="num">${pct(r.kupon)}</td><td>${r.splatnost}${r.aktivni?'':'<small>splaceno</small>'}</td><td class="num">${cz(r.jmen)} Kč</td><td>${ZT[r.zajisteni]}</td>
        <td><span class="doloz" title="Doloženo ${r.doloz} z 5 klíčových údajů" aria-label="Doloženo ${r.doloz} z 5 klíčových údajů">${'<i class="on"></i>'.repeat(r.doloz)}${'<i></i>'.repeat(5-r.doloz)}</span></td>
        <td class="c-act"><a class="act" href="porovnat-emise.html?emise=${encodeURIComponent(r.isin)}" title="Porovnat emisi" aria-label="Porovnat ${r.isin}">${ICO_CMP}</a><a class="act" href="proverit-emitenta.html?emitent=${encodeURIComponent(r.emitent)}" title="Prověřit emitenta" aria-label="Prověřit ${escapeHTML(r.emitent)}">${ICO_CHK}</a></td></tr>`
    ).join(''):`<tr><td colspan="9" class="db-empty">Zadaným filtrům neodpovídá žádný záznam. <button type="button" class="link-inline" id="db-reset">Zrušit filtry</button></td></tr>`;
    const heads=[...table.querySelectorAll('thead th')].map(th=>th.textContent.trim());
    table.querySelectorAll('#db-body tr').forEach(tr=>[...tr.cells].forEach((td,i)=>{if(heads[i]&&i>1)td.dataset.l=heads[i];}));
    const pg=$('db-pager');
    pg.innerHTML=pages>1?Array.from({length:pages},(_,i)=>`<button type="button" data-page="${i+1}"${i+1===page?' aria-current="page"':''}>${i+1}</button>`).join(''):'';
  }
  $('db-filter').addEventListener('submit',e=>{e.preventDefault();page=1;render();});
  $('db-filter').addEventListener('change',()=>{page=1;render();});
  $('db-q').addEventListener('input',()=>{page=1;render();});
  document.querySelector('.seg').addEventListener('click',e=>{const b=e.target.closest('[data-sort]');if(!b)return;sort=b.dataset.sort;page=1;document.querySelectorAll('.seg [data-sort]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();});
  $('db-pager').addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(!b)return;page=+b.dataset.page;render();table.scrollIntoView({block:'start'});});
  table.addEventListener('click',e=>{if(e.target.id==='db-reset'){$('db-filter').reset();page=1;render();}});
  const pre=new URLSearchParams(location.search).get('emitent');if(pre&&$('flt-emitent'))$('flt-emitent').value=pre;
  render();
})();

// Úvod: při každém načtení tři náhodně vybrané články
const PHOTO_COVERS=['emitent-7-ukazatelu','zajisteni-firemnich-dluhopisu','dluhopisy-od-a-do-z','desatero-cnb','statni-a-firemni-dluhopisy'];
const COVER=slug=>PHOTO_COVERS.includes(slug)?`assets/photos/${slug}.jpg`:`assets/covers/${slug}.svg`;
(function(){
  const grid=document.querySelector('#insights .article-grid');
  if(!grid||!RADAR_ARTICLES.length)return;
  const pick=RADAR_ARTICLES.slice().sort(()=>Math.random()-.5).slice(0,3);
  grid.innerHTML=pick.map(a=>`<a class="article-card" href="clanek-${a.slug}.html"><span class="article-image"><img src="${COVER(a.slug)}" width="1200" height="675" alt=""><span class="topic">${escapeHTML(a.label.toUpperCase())}</span></span><span class="article-body"><strong>${escapeHTML(a.title)}</strong><span class="article-meta"><span><svg class="ico"><use href="#i-calendar"/></svg> ${escapeHTML(a.date.charAt(0).toUpperCase()+a.date.slice(1))}</span><i></i><span><svg class="ico"><use href="#i-clock"/></svg> ${a.mins} min čtení</span></span></span></a>`).join('');
})();
