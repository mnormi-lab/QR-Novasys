/* NovaSyY Lab Hub — static GitHub Pages app with optional Google Drive sync */
const STORAGE_KEY = "novasyy-lab-records-v1";
const CONFIG_KEY = "novasyy-drive-config-v1";
let records = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let config = JSON.parse(localStorage.getItem(CONFIG_KEY) || "null");

const $ = (s) => document.querySelector(s);
const esc = (s = "") => String(s).replace(/[&<>'"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[c]));
const dateLabel = (value) => value ? new Intl.DateTimeFormat("ms-MY", { day:"2-digit", month:"short", year:"numeric" }).format(new Date(`${value}T00:00:00`)) : "—";

function saveLocal(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }
function showToast(message){ const t=$("#toast"); t.textContent=message; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),3000); }
function setToday(){ document.querySelectorAll('input[type="date"]').forEach(i=>{if(!i.value)i.value=new Date().toISOString().slice(0,10)}); }
function route(id){ document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===id)); document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.go===id)); window.scrollTo({top:0,behavior:"smooth"}); render(); }
function title(record){ if(record.type==="log")return record.activity; if(record.type==="loan")return record.assetDescription; return `${record.brand || "MCCB"} — ${record.testRef}`; }
function subtitle(record){ if(record.type==="log")return `${record.attendees} · ${dateLabel(record.date)}`; if(record.type==="loan")return `${record.applicant} · Pulang ${dateLabel(record.expectedReturn)}`; return `${record.jobNo} · ${dateLabel(record.testDate)}`; }
function icon(record){return record.type==="log"?"▤":record.type==="loan"?"▱":"⌁";}
function card(record){ const date=record.type==="log"?record.date:record.type==="loan"?record.borrowDate:record.testDate; return `<article class="record"><span class="record-icon">${icon(record)}</span><div><h3>${esc(title(record))}</h3><p>${esc(subtitle(record))}</p></div><time>${dateLabel(date)}</time></article>`; }
function render(){
  const logs=records.filter(r=>r.type==="log"); const loans=records.filter(r=>r.type==="loan"); const mccb=records.filter(r=>r.type==="mccb");
  $("#logCount").textContent=logs.length; $("#loanCount").textContent=loans.filter(r=>r.approval!=="Tidak lulus" && !r.returnedDate).length; $("#mccbCount").textContent=mccb.length;
  const recent=[...records].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,4); $("#recentList").innerHTML=recent.length?recent.map(card).join(""):'<p class="empty">Belum ada rekod. Tambah rekod pertama anda.</p>';
  [["#logRecords",logs],["#loanRecords",loans],["#mccbRecords",mccb]].forEach(([sel,list])=>$(sel).innerHTML=list.length?list.slice().reverse().map(card).join(""):'');
  const status=$("#driveStatus"); status.classList.toggle("connected",!!config?.endpoint); status.innerHTML=`<span></span> ${config?.endpoint ? "Google Drive disambungkan" : "Simpanan setempat"}`;
}
function collect(form,type){ const data=Object.fromEntries(new FormData(form).entries()); return {...data,type,id:crypto.randomUUID(),createdAt:new Date().toISOString()}; }
async function postDrive(record){
  if(!config?.endpoint) return;
  const response=await fetch(config.endpoint,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"save",key:config.key||"",record})});
  const result=await response.json(); if(!result.ok) throw new Error(result.error||"Gagal simpan ke Drive");
}
async function onSubmit(event,type){ event.preventDefault(); const form=event.currentTarget; const record=collect(form,type); records.push(record); saveLocal(); form.reset(); setToday(); render(); showToast("Rekod disimpan pada peranti"); try{await postDrive(record); if(config?.endpoint)showToast("Rekod disegerakkan ke Google Drive");}catch(err){showToast("Rekod setempat disimpan. Sync Drive gagal."); console.warn(err);} }
async function sync(){
  if(!config?.endpoint){
    const endpoint=prompt("Tampal URL Web App Google Apps Script (/exec):");
    if(!endpoint)return;
    const key=prompt("Masukkan ACCESS_KEY Apps Script:");
    if(!key)return;
    config={endpoint:endpoint.trim(),key}; localStorage.setItem(CONFIG_KEY,JSON.stringify(config)); render();
  }
  try{ const response=await fetch(`${config.endpoint}?action=list&key=${encodeURIComponent(config.key||"")}`); const result=await response.json(); if(!result.ok)throw new Error(result.error); const remote=result.records||[]; const ids=new Set(records.map(r=>r.id)); records=[...records,...remote.filter(r=>!ids.has(r.id))]; saveLocal(); render(); showToast(`${remote.length} rekod Drive disegerakkan`); }catch(err){ showToast("Tidak dapat sambung ke Google Drive"); console.warn(err); }
}
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>route(b.dataset.go)));
$("#logForm").addEventListener("submit",e=>onSubmit(e,"log")); $("#loanForm").addEventListener("submit",e=>onSubmit(e,"loan")); $("#mccbForm").addEventListener("submit",e=>onSubmit(e,"mccb")); $("#syncButton").addEventListener("click",sync);
setToday(); render();
