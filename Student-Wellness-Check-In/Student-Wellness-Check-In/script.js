const STORAGE_KEY = "studentWellnessCheckIns";
let draft = null;
const pages = ["home","checkin","review","saved","history","support","privacy"];
const labels = {energy:"Energy",workload:"Workload",sleep:"Sleep",breaks:"Breaks",balance:"Study–life balance"};
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];

function getEntries(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]")}catch{return []}}
function setEntries(entries){localStorage.setItem(STORAGE_KEY,JSON.stringify(entries))}
function showPage(name){
  pages.forEach(p=>$("#page-"+p)?.classList.toggle("active",p===name));
  $$(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.page===name));
  if(name==="history") renderHistory();
  window.scrollTo({top:0,behavior:"smooth"});
}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2600)}
function formatDate(value){return new Intl.DateTimeFormat(undefined,{dateStyle:"medium",timeStyle:"short"}).format(new Date(value))}
function readForm(){
  const data=new FormData($("#checkin-form"));
  const result={};
  Object.keys(labels).forEach(k=>result[k]=data.get(k));
  result.note=(data.get("note")||"").trim();
  return result;
}
function renderReview(){
  const summary=$("#review-summary");summary.innerHTML="";
  Object.entries(labels).forEach(([key,label])=>{
    const div=document.createElement("div"),dt=document.createElement("dt"),dd=document.createElement("dd");
    dt.textContent=label;dd.textContent=draft[key];div.append(dt,dd);summary.append(div);
  });
  $("#review-note").textContent=draft.note?`Your note: ${draft.note}`:"No optional note added.";
}
$("#checkin-form").addEventListener("submit",e=>{
  e.preventDefault();
  if(!e.currentTarget.reportValidity())return;
  draft=readForm();renderReview();showPage("review");
});
$("#edit-answers").addEventListener("click",()=>showPage("checkin"));
$("#save-checkin").addEventListener("click",()=>{
  if(!draft)return;
  const entries=getEntries();
  entries.unshift({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),createdAt:new Date().toISOString(),...draft});
  try{setEntries(entries);draft=null;$("#checkin-form").reset();showPage("saved");}
  catch{toast("Your browser could not save this entry. Check available storage.");}
});
function renderHistory(){
  const list=$("#history-list"),entries=getEntries();list.innerHTML="";
  if(!entries.length){const empty=document.createElement("div");empty.className="empty-state";empty.textContent="No check-ins saved yet. When you're ready, start with a small reflection.";list.append(empty);return;}
  entries.forEach(entry=>{
    const card=document.createElement("article");card.className="history-entry";
    const top=document.createElement("div");top.className="entry-top";
    const date=document.createElement("span");date.className="entry-date";date.textContent=formatDate(entry.createdAt);
    const del=document.createElement("button");del.className="delete-entry";del.textContent="Delete";del.setAttribute("aria-label","Delete check-in from "+formatDate(entry.createdAt));
    del.addEventListener("click",()=>{if(confirm("Delete this check-in? This cannot be undone.")){setEntries(getEntries().filter(x=>x.id!==entry.id));renderHistory();toast("Check-in deleted.");}});
    top.append(date,del);
    const details=document.createElement("p");details.className="entry-details";
    details.textContent=`Energy: ${entry.energy}  ·  Workload: ${entry.workload}  ·  Sleep: ${entry.sleep}  ·  Breaks: ${entry.breaks}  ·  Study–life balance: ${entry.balance}`;
    card.append(top,details);
    if(entry.note){const note=document.createElement("p");note.className="entry-note";note.textContent="Note: "+entry.note;card.append(note);}
    list.append(card);
  });
}
$("#clear-history").addEventListener("click",()=>{
  const entries=getEntries();if(!entries.length){toast("There is no history to clear.");return;}
  if(confirm("Clear all saved check-ins from this browser? This cannot be undone.")){setEntries([]);renderHistory();toast("Your history has been cleared.");}
});
$$("[data-go]").forEach(btn=>btn.addEventListener("click",()=>showPage(btn.dataset.go)));
$$(".nav-link").forEach(btn=>btn.addEventListener("click",()=>showPage(btn.dataset.page)));
$$("[data-info]").forEach(btn=>btn.addEventListener("click",()=>{
  const messages={
    student:"Check your institution's official website or student portal for counselling, wellness, disability or student affairs services. You can also ask the student administration office where to begin.",
    academic:"Look for academic advising, tutoring, writing support or consultation hours. Contact your lecturer or faculty office to ask what support is available."
  };
  const box=$("#support-info");box.hidden=false;box.textContent=messages[btn.dataset.info];box.scrollIntoView({behavior:"smooth",block:"nearest"});
}));
showPage("home");
