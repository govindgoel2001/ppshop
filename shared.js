// ============================================================
// AthenaBioLabs — shared.js
// Shared product data, cart, payment, and utility functions
// Used by index.html and all /products/*.html pages
// ============================================================

// =====================
// PRODUCT DATA
// =====================
var P=[
{id:2,n:"Tirzepatide",c:"Weight Loss",oos:true,v:[{sp:"10mg per vial",ds:"10mg",pr:2799},{sp:"20mg per vial",ds:"20mg",pr:3999}]},
{id:3,n:"Retatrutide",c:"Weight Loss",v:[{sp:"10mg per vial",ds:"10mg",pr:3499},{sp:"20mg per vial",ds:"20mg",pr:4999}]},
{id:4,n:"BPC-157",c:"Healing & Recovery",v:[{sp:"10mg per vial",ds:"10mg",pr:2199}]},
{id:5,n:"TB-500",c:"Healing & Recovery",oos:true,v:[{sp:"10mg per vial",ds:"10mg",pr:3599}]},
{id:6,n:"BPC+TB Combo",c:"Healing & Recovery",oos:true,v:[{sp:"BPC-157 5mg + TB-500 5mg",ds:"10mg",pr:3499}]},
{id:8,n:"GHK-Cu",c:"Skin & Anti-Aging",v:[{sp:"50mg per vial",ds:"50mg",pr:1799}]},
{id:12,n:"CJC+IPA Combo",c:"GH",oos:true,v:[{sp:"CJC-1295 5mg + Ipamorelin 5mg",ds:"10mg",pr:3999}]},
{id:13,n:"KLOW Blend",c:"Healing & Recovery",oos:true,v:[{sp:"BPC-157 10mg + TB-500 10mg + KPV 10mg + GHK-Cu 50mg",ds:"80mg",pr:4299}]},
{id:14,n:"BAC Water",c:"Supplies",v:[{sp:"10ml per vial",ds:"10ml",pr:899}]},
{id:15,n:"Tesamorelin",c:"GH",v:[{sp:"10mg per vial",ds:"10mg",pr:3999}]}
];

var _cfaqs=[
  {q:'How is this shipped?',a:'All compounds ship cold-chain in an insulated pack with ice gel. Express courier, typically 2\u20134 days pan-India.'},
  {q:'What is the storage protocol?',a:'Store lyophilised powder at \u221220\u00b0C. After reconstituting with bacteriostatic water, store at 2\u20138\u00b0C and use within 28 days.'},
  {q:'Is a Certificate of Analysis included?',a:'Yes. A QR-linked COA showing HPLC purity trace, mass spec, and LAL endotoxin result from an ISO\u00a017025-accredited lab ships with every vial.'},
  {q:'What assays are run on each batch?',a:'Reverse-phase C18 HPLC for purity and area%, ESI-MS for molecular weight confirmation, and LAL endotoxin screening.'},
  {q:'Is this for human use?',a:'No. All products are sold strictly for in-vitro laboratory research. Not intended for human or animal administration.'}
];
var PI={
"Tirzepatide":{desc:"First-in-class dual GIP/GLP-1 receptor agonist. The dual mechanism produces synergistic metabolic effects exceeding mono-agonists, with significant research interest in glycemic control, weight management, and lipid profiles.",tagline:"Dual-pathway metabolic research. Both incretins, one scaffold.",dose:"2.5 - 15mg weekly, subcutaneous",mw:"4813.45 g/mol",seq:"GIP/GLP-1 dual agonist (39 AA)",cat:"Metabolic",janoshik:{purity:"99.505%",quantity:"21.65 mg",taskNumber:"85117",verifyUrl:"https://verify.janoshik.com/tests/85117-T20_G8LQUXM7GQ6I",image:"/img/testing/tirz20-hplc.png",date:"2025-10-29"},faqs:_cfaqs,citations:[{year:"2023",title:"Tirzepatide Once Weekly for the Treatment of Obesity \u2014 SURMOUNT-1",journal:"NEJM \u00b7 doi:10.1056/NEJMoa2206038",url:"https://doi.org/10.1056/NEJMoa2206038"},{year:"2021",title:"Tirzepatide versus Semaglutide Once Weekly \u2014 SURPASS-2",journal:"NEJM \u00b7 doi:10.1056/NEJMoa2107519",url:"https://doi.org/10.1056/NEJMoa2107519"}]},
"Retatrutide":{desc:"Novel triple agonist targeting GLP-1, GIP, and glucagon receptors simultaneously. The glucagon component adds thermogenic and lipolytic effects, representing a potential advancement over dual agonists.",tagline:"Triple agonism. Unprecedented metabolic research leverage.",dose:"1 - 12mg weekly, subcutaneous",mw:"~4400 g/mol",seq:"Triple agonist (39 AA)",cat:"Weight Loss",janoshik:{purity:"99.790%",quantity:"10.13 mg",taskNumber:"85120",verifyUrl:"https://verify.janoshik.com/tests/85120-R10_YSA9ZNR2VPT6",image:"/img/testing/reta10-hplc.png",date:"2025-10-29"},faqs:_cfaqs,citations:[{year:"Dec 2025",title:"TRIUMPH-4 Phase 3 \u2014 Retatrutide delivered average 26.2% weight loss at 96 weeks",journal:"Lilly Investor Relations \u00b7 TRIUMPH-4",url:"https://investor.lilly.com/news-releases/news-release-details/lillys-triple-agonist-retatrutide-delivered-weight-loss-average"},{year:"Oct 2025",title:"TRIUMPH Programme Rationale and Trial Design",journal:"PubMed \u00b7 PMID 41090431",url:"https://pubmed.ncbi.nlm.nih.gov/41090431/"},{year:"Aug 2025",title:"Body Composition Substudy of Retatrutide Phase 2",journal:"PubMed \u00b7 PMID 40609566",url:"https://pubmed.ncbi.nlm.nih.gov/40609566/"},{year:"Jul 2025",title:"Retatrutide in Obesity: Systematic Review and Meta-Analysis",journal:"PubMed \u00b7 PMID 40728138",url:"https://pubmed.ncbi.nlm.nih.gov/40728138/"},{year:"2024",title:"Structural Insights into Triple Agonism of Retatrutide",journal:"Cell Research \u00b7 doi:10.1038/s41421-024-00700-0",url:"https://doi.org/10.1038/s41421-024-00700-0"},{year:"2023",title:"Retatrutide Phase 2 Dose-Finding \u2014 NEJM",journal:"New England Journal of Medicine \u00b7 doi:10.1056/NEJMoa2301972",url:"https://doi.org/10.1056/NEJMoa2301972"}]},
"BPC-157":{desc:"A 15-amino-acid peptide derived from human gastric juice. Extensively studied for accelerated healing of tendons, ligaments, muscle, and bone. Promotes angiogenesis and modulates nitric oxide pathways.",tagline:"Tissue repair from within. Site-specific healing cascade.",dose:"200 - 500mcg 1-2x daily, subcutaneous",mw:"1419.53 g/mol",seq:"Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",cat:"Healing & Recovery",janoshik:{purity:"99.765%",quantity:"11.72 mg",taskNumber:"105627",verifyUrl:"https://verify.janoshik.com/tests/105627-BPC10_1KWNMRQ5BUSC",image:"/img/testing/bpc10-hplc.png",date:"2026-02-09"},faqs:_cfaqs,citations:[{year:"2023",title:"BPC-157 and Tendon Healing \u2014 Systematic Review",journal:"Curr Pharm Des \u00b7 PMID 36173050",url:"https://pubmed.ncbi.nlm.nih.gov/36173050/"},{year:"2021",title:"Body Protection Compound-157: Candidate Medication for Wound Healing",journal:"Front Pharmacol \u00b7 PMC7837306",url:"https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7837306/"}]},
"TB-500":{desc:"A 43-amino-acid peptide central to tissue repair and regeneration. Sequesters actin monomers, promotes cell migration, and has demonstrated effects on cardiac tissue repair and inflammation reduction.",tagline:"Systemic tissue regeneration. Actin sequestration at scale.",dose:"2 - 5mg 2x weekly (loading), subcutaneous",mw:"4963.50 g/mol",seq:"Thymosin Beta-4 (43 AA)",cat:"Healing & Recovery",faqs:_cfaqs,citations:[{year:"2022",title:"Thymosin Beta-4 and Tissue Repair: An Updated Overview",journal:"Curr Pharm Des \u00b7 PMID 35236248",url:"https://pubmed.ncbi.nlm.nih.gov/35236248/"}]},
"BPC+TB Combo":{desc:"Pre-blended stack of BPC-157 and TB-500. Combines BPC-157\u2019s site-specific healing with TB-500\u2019s systemic actin-sequestering and anti-inflammatory effects for comprehensive tissue regeneration research.",tagline:"Site-specific meets systemic. The complete healing stack.",dose:"Per protocol, subcutaneous",mw:"Blend",seq:"BPC-157 + TB-500",cat:"Healing & Recovery",faqs:_cfaqs,citations:[]},
"GHK-Cu":{desc:"A naturally occurring tripeptide-copper complex. Over 4,000 genes modulated by GHK-Cu have been identified, with effects including collagen synthesis, antioxidant enzyme upregulation, and dermal fibroblast promotion.",tagline:"4,000 genes. One copper-peptide.",dose:"1 - 2mg daily, subcutaneous",mw:"340.38 g/mol",seq:"Gly-His-Lys:Cu(2+)",cat:"Skin & Anti-Aging",janoshik:{purity:"99.814%",quantity:"103.80 mg",taskNumber:"123506",verifyUrl:"https://verify.janoshik.com/tests/123506-GHKCU100_7WJADAMR6PSI",image:"/img/testing/ghkcu100-hplc.png",date:"2026-04-10"},faqs:_cfaqs,citations:[{year:"2023",title:"GHK-Cu in Skin Regeneration and Wound Healing",journal:"Cosmetics \u00b7 doi:10.3390/cosmetics10020051",url:"https://doi.org/10.3390/cosmetics10020051"}]},
"Tesamorelin":{desc:"A 44-amino-acid synthetic analog of growth hormone-releasing hormone (GHRH). Studied for visceral adiposity reduction, metabolic modulation, and IGF-1 axis effects. Third-party HPLC verified at 99.4%+ purity.",tagline:"GHRH analog. IGF-1 axis research at full potency.",dose:"2mg daily, subcutaneous",mw:"5135.86 g/mol",seq:"GHRH analog (44 AA, stabilised)",cat:"GH",janoshik:{purity:"99.426%",quantity:"10.43 mg",taskNumber:"98686",verifyUrl:"https://verify.janoshik.com/tests/98686-Tessa_H6AQGINN3FM8",image:"/img/testing/tesa-hplc.png",date:"2026-01-14"},faqs:_cfaqs,citations:[{year:"2023",title:"Tesamorelin and Visceral Adiposity — Systematic Review",journal:"Front Endocrinol · PMID 37082122",url:"https://pubmed.ncbi.nlm.nih.gov/37082122/"},{year:"2021",title:"Tesamorelin for Excess Abdominal Fat in HIV-infected Patients with Lipodystrophy",journal:"NEJM · doi:10.1056/NEJMoa0808256",url:"https://doi.org/10.1056/NEJMoa0808256"}]},
"CJC+IPA Combo":{desc:"Pre-blended combination of CJC-1295 (no DAC) and Ipamorelin. Synergistic GH release through simultaneous GHRH and ghrelin receptor activation, producing amplified pulsatile GH output.",tagline:"GHRH + ghrelin axis. Amplified, synchronised GH pulse.",dose:"100 - 300mcg combined, 1-3x daily, subcutaneous",mw:"Blend",seq:"CJC-1295 + Ipamorelin",cat:"GH",faqs:_cfaqs,citations:[]},
"KLOW Blend":{desc:"Advanced recovery and skin blend combining TB-500, BPC-157, GHK-Cu, and KPV. Pairs systemic tissue repair with localised healing, anti-inflammatory action via KPV, and copper-peptide skin regeneration for a comprehensive research protocol.",tagline:"Four-peptide synergy. The most comprehensive repair stack.",dose:"Per component protocol, subcutaneous",mw:"Blend",seq:"TB-500 + BPC-157 + GHK-Cu + KPV",cat:"Healing & Recovery",faqs:_cfaqs,citations:[]},
"BAC Water":{desc:"Bacteriostatic water (0.9% benzyl alcohol) in a sterile 10ml vial. The standard reconstitution medium for research compounds \u2014 preservative allows multi-draw use over 28 days without contamination risk.",tagline:"The essential reconstitution medium. Preserves integrity across multi-draw protocols.",dose:"N/A - reconstitution supply",mw:"N/A",seq:"N/A",cat:"Supplies",janoshik:{purity:"N/A",quantity:"Benzyl Alcohol: 9.33 mg/ml",taskNumber:"108612",verifyUrl:"https://verify.janoshik.com/tests/108612-Bacteriostatic_Water_3ml_T4XMD1ZUBTYK",image:"/img/testing/bac-water-hplc.png",date:"2026-02-16"},faqs:[{q:'How should I store this?',a:'Store at 2\u20138\u00b0C. Keep in original sealed vial until use. Once opened, use within 28 days.'},{q:'Can I use this for all compounds?',a:'Yes. Bacteriostatic water (0.9% benzyl alcohol) is the standard reconstitution medium for all lyophilised research compounds in our catalogue.'},{q:'How much do I need per vial?',a:'Typically 1\u20132 mL per vial, depending on your target concentration.'}],citations:[]}
};

var IMG={
"Tirzepatide":"tirzepatide.png","Retatrutide":"retatrutide.png",
"BPC-157":"bpc-157.png","TB-500":"tb-500.png","BPC+TB Combo":"bpc157tb500.png","GHK-Cu":"ghk-cu.png",
"CJC+IPA Combo":"cjc_1295.png",
"KLOW Blend":"klow.png","BAC Water":"bac-water.png"
};
var IMGPOS={};

// Slug map: product id -> URL slug
var SLUG_MAP={
  2:'tirzepatide',3:'retatrutide',4:'bpc-157',5:'tb-500',
  6:'bpc-tb-combo',8:'ghk-cu',
  12:'cjc-ipa-combo',13:'klow-blend',14:'bac-water',15:'tesamorelin'
};

// =====================
// SUPABASE
// =====================
var SUPA=supabase.createClient('https://vlhcmycnscmjeiyczwec.supabase.co','sb_publishable_1hNyIavnnJa0gGZJIw1fcg_XLkU0GoQ');

// =====================
// UTILITIES
// =====================
function trackEvent(evName,params){
  try{if(window.posthog)posthog.capture(evName,params||{});}catch(e){}
}
function fmt(n){return "\u20B9"+n.toLocaleString("en-IN")}
function mono(nm){return nm.replace(/[-\s\+\(\)]/g,"").substring(0,3).toUpperCase()}
function imgSrc(n){var f=IMG[n]||"placeholder";return "/img/"+f+(f.indexOf(".")>-1?"":".jpg");}
function imgStyle(n){return 'object-position:'+(IMGPOS[n]||'center center')+';';}
function slugify(name){return name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}

// Visitor ID (kept for session analytics only)
var VID=(function(){var id=localStorage.getItem('abl_vid');if(!id){id='v_'+Date.now()+'_'+Math.random().toString(36).substring(2,11);localStorage.setItem('abl_vid',id);}return id;})();
var usedFirst=false;
// OTP state for FIRST5 coupon
var otpState='idle',otpEmail='';

// =====================
// CART STATE
// =====================
var cart=[],selV={},coupon="",couponMsg="",includeEbook=true,customerEmail="",customerAddr="",customerPin="";
function saveCart(){try{localStorage.setItem('abl_cart',JSON.stringify(cart));}catch(e){}}
function loadCart(){
  try{
    var raw=localStorage.getItem('abl_cart');if(!raw){cart=[];return;}
    var parsed=JSON.parse(raw);if(!Array.isArray(parsed)){cart=[];return;}
    cart=[];
    for(var i=0;i<parsed.length;i++){
      var it=parsed[i];if(!it||typeof it!=='object')continue;
      var id=parseInt(it.id,10),vi=parseInt(it.vi,10),q=parseInt(it.q,10);
      if(!isFinite(id)||!isFinite(vi)||!isFinite(q)||q<=0)continue;
      // Re-derive product fields from canonical P[] to drop any tampering
      var p=null;for(var j=0;j<P.length;j++){if(P[j].id===id){p=P[j];break;}}
      if(!p||!p.v||!p.v[vi])continue;
      var v=p.v[vi];
      cart.push({id:id,vi:vi,n:p.n,sp:v.sp,ds:v.ds,pr:v.pr,q:Math.min(q,99)});
    }
  }catch(e){cart=[];}
}
loadCart();

function getCartQty(id,vi){
  for(var i=0;i<cart.length;i++){if(cart[i].id===id&&cart[i].vi===vi)return cart[i].q;}
  return 0;
}
function aC(id){
  var p;for(var i=0;i<P.length;i++){if(P[i].id===id){p=P[i];break;}}
  var vi=selV[id]||0,v=p.v[vi],ex=null;
  for(var i=0;i<cart.length;i++){if(cart[i].id===id&&cart[i].vi===vi){ex=cart[i];break;}}
  if(ex)ex.q++;else cart.push({id:p.id,vi:vi,n:p.n,sp:v.sp,ds:v.ds,pr:v.pr,q:1});
  trackEvent('AddToCart',{content_name:p.n,content_category:p.c,value:v.pr,currency:'INR'});
  saveCart();uB();rC();
  if(typeof rP==='function')rP();
  if(typeof refreshPDP==='function')refreshPDP();
}
function aC2(id,vi,d){
  for(var i=0;i<cart.length;i++){
    if(cart[i].id===id&&cart[i].vi===vi){
      cart[i].q=cart[i].q+d;
      if(cart[i].q<=0){cart.splice(i,1);}
      break;
    }
  }
  saveCart();uB();rC();
  if(typeof rP==='function')rP();
  if(typeof refreshPDP==='function')refreshPDP();
}
function rm(id,vi){
  var nc=[];for(var i=0;i<cart.length;i++){if(!(cart[i].id===id&&cart[i].vi===vi))nc.push(cart[i]);}
  cart=nc;saveCart();uB();rC();
  if(typeof rP==='function')rP();
}
function cQ(id,vi,d){
  for(var i=0;i<cart.length;i++){if(cart[i].id===id&&cart[i].vi===vi){cart[i].q=Math.max(1,cart[i].q+d);break;}}
  saveCart();uB();rC();
}
function uB(){
  var n=0;for(var i=0;i<cart.length;i++)n+=cart[i].q;
  var lk=document.getElementById("cL");
  if(lk)lk.innerHTML=n>0?'Cart <span class="cc">'+n+'</span>':'Cart';
}
function openCart(){
  var ov=document.getElementById("ov"),dr=document.getElementById("dr");
  if(ov)ov.classList.add("op");
  if(dr)dr.classList.add("op");
  rC();
}
function closeCart(){
  var ov=document.getElementById("ov"),dr=document.getElementById("dr");
  if(ov)ov.classList.remove("op");
  if(dr)dr.classList.remove("op");
}

// =====================
// COUPON & OTP FLOW
// =====================
function applyCoupon(){
  var el=document.getElementById("cpIn");
  var code=((el&&el.value)||"").trim().toUpperCase();
  var sub=0;for(var i=0;i<cart.length;i++)sub+=cart[i].pr*cart[i].q;
  // Always reset coupon state on a new apply attempt — never leave a previous discount latched
  coupon="";couponMsg="";
  if(code==="FIRST5"){
    if(usedFirst){
      couponMsg='<span style="color:#c44">FIRST5 has already been used on this account</span>';
      rC();return;
    }
    if(otpState==='verified'){
      coupon="FIRST5";couponMsg='<span style="color:#7a9a6d">FIRST5 applied: 5% off your first order</span>';
      rC();return;
    }
    otpState='email_needed';
    rC();return;
  }
  if(code==="BULK10"){
    if(sub>=20000){coupon="BULK10";couponMsg='<span style="color:#7a9a6d">BULK10 applied: 10% off</span>';}
    else couponMsg='<span style="color:#c44">BULK10 requires order above Rs 20,000</span>';
  }
  else if(code) couponMsg='<span style="color:#c44">Invalid coupon code</span>';
  rC();
}
// Pure: compute discount without mutating coupon/couponMsg
function calcDiscount(sub){
  if(coupon==="FIRST5") return Math.round(sub*0.05);
  if(coupon==="BULK10"&&sub>=20000) return Math.round(sub*0.10);
  return 0;
}
// Auto-apply BULK10 when order qualifies and no coupon is set; called from rC() before computing totals.
function maybeAutoApplyBulk10(sub){
  if(!coupon&&sub>=20000){
    coupon="BULK10";
    couponMsg='<span style="color:#7a9a6d">BULK10 auto-applied: 10% off (order 20k+)</span>';
  } else if(coupon==="BULK10"&&sub<20000){
    // Order dropped below threshold — revert auto-applied BULK10
    coupon="";couponMsg="";
  }
}

function sendOtp(){
  var emailEl=document.getElementById("otpEmailIn");
  if(!emailEl)return;
  var email=emailEl.value.trim().toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    var msg=document.getElementById("otpMsg");if(msg)msg.innerHTML='<span style="color:#c44">Enter a valid email address</span>';
    return;
  }
  otpEmail=email;
  otpState='sending';
  rC();
  fetch('/api/send-otp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email})})
    .then(function(r){return r.json().then(function(d){return{status:r.status,d:d};});})
    .then(function(res){
      var d=res.d||{};
      if(d.alreadyUsed){
        otpState='idle';usedFirst=true;
        couponMsg='<span style="color:#c44">FIRST5 has already been used with this email</span>';
      } else if(d.sent){
        otpState='code_sent';
        couponMsg='<span style="color:#7a9a6d">Code sent to '+esc(email)+'</span>';
      } else {
        otpState='email_needed';
        couponMsg='<span style="color:#c44">'+esc(d.error||'Failed to send OTP')+'</span>';
      }
      rC();
    })
    .catch(function(){otpState='email_needed';couponMsg='<span style="color:#c44">Network error. Try again.</span>';rC();});
}

function verifyOtp(){
  var otpEl=document.getElementById("otpCodeIn");
  if(!otpEl)return;
  var otp=otpEl.value.trim();
  if(!/^\d{6}$/.test(otp)){
    var msg=document.getElementById("otpMsg");if(msg)msg.innerHTML='<span style="color:#c44">Enter the 6-digit code</span>';
    return;
  }
  otpState='verifying';
  rC();
  fetch('/api/verify-coupon',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:otpEmail,otp:otp,code:'FIRST5'})})
    .then(function(r){return r.json();})
    .then(function(d){
      if(d&&d.valid){
        otpState='verified';
        coupon='FIRST5';
        if(!customerEmail)customerEmail=otpEmail;
        couponMsg='<span style="color:#7a9a6d">FIRST5 applied: 5% off your first order</span>';
      } else {
        otpState='code_sent';
        couponMsg='<span style="color:#c44">'+esc((d&&d.error)||'Invalid code')+'</span>';
      }
      rC();
    })
    .catch(function(){otpState='code_sent';couponMsg='<span style="color:#c44">Network error. Try again.</span>';rC();});
}

function resendOtp(){
  otpState='email_needed';
  couponMsg='';
  rC();
}

function rC(){
  var bd=document.getElementById("dB"),ft=document.getElementById("dF");
  if(!bd)return;
  if(ft)ft.style.display="none";
  if(!cart.length){
    bd.innerHTML='<div style="text-align:center;padding:80px 0"><p style="font-family:Cormorant Garamond,serif;font-size:20px;font-style:italic;color:#b5b0a6;margin-bottom:24px">Your cart is empty</p><a href="/" class="b b2">Browse Collection</a></div>';
    return;
  }
  var h="";
  for(var i=0;i<cart.length;i++){
    var it=cart[i];
    h+='<div class="ci"><div class="ct">'+esc(mono(it.n))+'</div>';
    h+='<div class="cd2"><h4>'+esc(it.n)+'</h4><div class="cm">'+esc(it.ds)+' &middot; '+esc(it.sp)+' &middot; 99%+ HPLC</div>';
    h+='<div style="margin-top:10px;display:flex;align-items:center"><div class="cq">';
    h+='<button onclick="cQ('+it.id+','+it.vi+',-1)">&minus;</button><span>'+it.q+'</span><button onclick="cQ('+it.id+','+it.vi+',1)">+</button>';
    h+='</div><button class="cr" onclick="rm('+it.id+','+it.vi+')">Remove</button></div></div>';
    h+='<div class="cp">'+fmt(it.pr*it.q)+'</div></div>';
  }
  h+='<div style="border-top:1px solid rgba(0,0,0,.06);margin-top:16px;padding-top:20px">';
  h+='<h3 style="font-family:Cormorant Garamond,serif;font-size:20px;font-weight:600;margin-bottom:16px">Checkout</h3>';
  var sub=0;for(var i=0;i<cart.length;i++)sub+=cart[i].pr*cart[i].q;
  maybeAutoApplyBulk10(sub);
  var disc=calcDiscount(sub);
  var total=sub-disc;
  h+='<div class="cui"><input type="text" id="cpIn" placeholder="Coupon code" value="'+esc(coupon||"")+'"><button onclick="applyCoupon()">Apply</button></div>';
  if(couponMsg) h+='<div class="cmsg">'+couponMsg+'</div>';
  // OTP flow UI for FIRST5
  if(otpState==='email_needed'){
    h+='<div style="margin-top:10px;padding:14px;background:#f8f7f4;border:1px solid #e8e3dc">';
    h+='<div style="font-size:11px;color:#6a6560;margin-bottom:8px;font-weight:500">Enter your email to verify FIRST5:</div>';
    h+='<div style="display:flex;gap:6px">';
    h+='<input type="email" id="otpEmailIn" placeholder="your@email.com" style="flex:1;padding:9px 12px;border:1px solid #d4cfc8;font-family:DM Sans,sans-serif;font-size:12px;background:#fafaf7;outline:none" value="'+esc(otpEmail||'')+'">';
    h+='<button onclick="sendOtp()" style="font-family:DM Sans,sans-serif;font-size:9px;font-weight:600;letter-spacing:.1em;padding:9px 16px;background:#1a1a1a;color:#FAFAF7;border:none;cursor:pointer">SEND OTP</button>';
    h+='</div>';
    h+='<div id="otpMsg" style="margin-top:6px;font-size:11px"></div>';
    h+='</div>';
  } else if(otpState==='sending'){
    h+='<div style="margin-top:10px;padding:12px 14px;background:#f8f7f4;font-size:11px;color:#8a8580">Sending code to '+esc(otpEmail)+'\u2026</div>';
  } else if(otpState==='code_sent'||otpState==='verifying'){
    h+='<div style="margin-top:10px;padding:14px;background:#f8f7f4;border:1px solid #e8e3dc">';
    h+='<div style="font-size:11px;color:#6a6560;margin-bottom:8px;font-weight:500">Enter the 6-digit code sent to '+esc(otpEmail)+':</div>';
    h+='<div style="display:flex;gap:6px">';
    h+='<input type="text" id="otpCodeIn" placeholder="000000" maxlength="6" inputmode="numeric" style="flex:1;padding:9px 12px;border:1px solid #d4cfc8;font-family:DM Mono,monospace;font-size:16px;letter-spacing:.25em;text-align:center;background:#fafaf7;outline:none"'+(otpState==='verifying'?' disabled':'')+' value="">';
    h+='<button onclick="verifyOtp()"'+(otpState==='verifying'?' disabled':'')+' style="font-family:DM Sans,sans-serif;font-size:9px;font-weight:600;letter-spacing:.1em;padding:9px 16px;background:#1a1a1a;color:#FAFAF7;border:none;cursor:pointer">'+(otpState==='verifying'?'VERIFYING\u2026':'VERIFY')+'</button>';
    h+='</div>';
    h+='<div id="otpMsg" style="margin-top:6px;font-size:11px"></div>';
    h+='<button onclick="resendOtp()" style="margin-top:6px;background:none;border:none;color:#8a8580;font-size:10px;cursor:pointer;text-decoration:underline;padding:0">Use different email</button>';
    h+='</div>';
  }
  // Always-required contact email (separate from OTP-verified email so non-coupon orders still capture it)
  h+='<div style="margin-top:10px"><label style="font-size:11px;color:#6a6560;font-weight:500;display:block;margin-bottom:6px">Contact email</label>';
  h+='<input type="email" id="custEmail" placeholder="your@email.com" required oninput="customerEmail=this.value" style="width:100%;box-sizing:border-box;padding:9px 12px;border:1px solid #d4cfc8;font-family:DM Sans,sans-serif;font-size:12px;background:#fafaf7;outline:none" value="'+esc(customerEmail||otpEmail||'')+'"></div>';
  h+='<div style="margin-top:10px"><label style="font-size:11px;color:#6a6560;font-weight:500;display:block;margin-bottom:6px">Delivery address</label>';
  h+='<textarea id="custAddr" placeholder="Street, city, state" required rows="3" oninput="customerAddr=this.value" style="width:100%;box-sizing:border-box;padding:9px 12px;border:1px solid #d4cfc8;font-family:DM Sans,sans-serif;font-size:12px;background:#fafaf7;outline:none;resize:vertical">'+esc(customerAddr)+'</textarea></div>';
  h+='<div style="margin-top:10px"><label style="font-size:11px;color:#6a6560;font-weight:500;display:block;margin-bottom:6px">PIN code</label>';
  h+='<input type="text" id="custPin" placeholder="6-digit PIN" required inputmode="numeric" maxlength="6" pattern="[1-9][0-9]{5}" oninput="customerPin=this.value.replace(/\\D/g,&#39;&#39;).slice(0,6);this.value=customerPin" style="width:160px;box-sizing:border-box;padding:9px 12px;border:1px solid #d4cfc8;font-family:DM Mono,monospace;font-size:13px;letter-spacing:.18em;background:#fafaf7;outline:none" value="'+esc(customerPin)+'"></div>';
  h+='<div class="sr"><span>Subtotal</span><span>'+fmt(sub)+'</span></div>';
  if(disc>0) h+='<div class="sr"><span>Discount ('+esc(coupon)+')</span><span style="color:#7a9a6d">-'+fmt(disc)+'</span></div>';
  h+='<div class="sr"><span>Shipping</span><span style="color:#7a9a6d">Complimentary</span></div>';
  h+='<div class="gs" style="margin:12px 0"></div>';
  h+='<div class="st"><span>Total</span><span>'+fmt(total)+'</span></div>';
  if(includeEbook){
    h+='<div class="eb"><div class="ei">&#128218;</div><div class="et"><b>Free: Peptide Research Guide</b><span>15-chapter eBook included</span></div><button onclick="includeEbook=false;rC()" style="background:none;border:none;color:#b5b0a6;font-size:10px;cursor:pointer;text-decoration:underline;white-space:nowrap;margin-left:8px">Remove</button></div>';
  } else {
    h+='<div style="margin-top:12px;padding:12px 16px;background:#F0EDE7;display:flex;align-items:center;justify-content:space-between"><span style="font-size:11px;color:#8a8580">Peptide Research Guide eBook</span><button onclick="includeEbook=true;rC()" style="font-family:DM Sans,sans-serif;font-size:9px;font-weight:600;letter-spacing:.1em;padding:5px 12px;background:#1a1a1a;color:#FAFAF7;border:none;cursor:pointer">+ Add Free eBook</button></div>';
  }
  h+='<div class="consult-card" style="margin-top:12px"><div class="consult-icon">&#128172;</div><div class="consult-info"><div class="consult-title">Need guidance?</div><div class="consult-sub">15 min consultation &middot; &#8377;1000</div></div><a href="https://topmate.io/athenabiolabs/" target="_blank" rel="noopener" class="consult-btn">Book</a></div>';
  h+='<button class="b b1" style="width:100%;margin-top:16px;padding:18px 40px;font-size:13px" onclick="payViaUpi('+total+')">Pay via UPI &middot; '+fmt(total)+'</button>';
  h+='<a href="mailto:support@athenabiolabs.com?subject=AthenaBioLabs%20Order" class="b b2" style="display:block;text-align:center;margin-top:8px;padding:12px 16px;font-size:9px">Email Order</a>';
  h+='</div>';
  bd.innerHTML=h;
}

// =====================
// PAYMENT \u2014 UPI QR
// =====================
function genRef(){
  var s='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',out='',b=new Uint8Array(8);
  (window.crypto||window.msCrypto).getRandomValues(b);
  for(var i=0;i<8;i++)out+=s.charAt(b[i]%32);
  return out;
}

var _qrLibPromise=null;
function loadQrLib(){
  if(window.qrcode)return Promise.resolve(window.qrcode);
  if(_qrLibPromise)return _qrLibPromise;
  _qrLibPromise=new Promise(function(resolve,reject){
    var s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js';
    s.onload=function(){resolve(window.qrcode);};
    s.onerror=function(){reject(new Error('qr-failed'));};
    document.head.appendChild(s);
  });
  return _qrLibPromise;
}

var _upiCfgPromise=null;
function loadUpiConfig(){
  if(_upiCfgPromise)return _upiCfgPromise;
  _upiCfgPromise=fetch('/api/config').then(function(r){return r.json();}).catch(function(){return{upiVpa:'',upiDisplayName:'AthenaBioLabs'};});
  return _upiCfgPromise;
}

var EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function payViaUpi(total){
  if(coupon==='FIRST5'&&otpState!=='verified'){
    alert('Please verify your email via OTP to use FIRST5.');
    return;
  }
  var ce=document.getElementById('custEmail');
  var contact=((ce&&ce.value)||customerEmail||'').trim().toLowerCase();
  if(!EMAIL_RE.test(contact)){
    alert('Please enter a valid contact email so we can confirm your order.');
    if(ce)ce.focus();
    return;
  }
  var addrEl=document.getElementById('custAddr');
  var addr=((addrEl&&addrEl.value)||customerAddr||'').trim();
  if(!addr){
    alert('Please enter your delivery address before paying.');
    if(addrEl)addrEl.focus();
    return;
  }
  var pinEl=document.getElementById('custPin');
  var pin=((pinEl&&pinEl.value)||customerPin||'').replace(/\D/g,'').slice(0,6);
  if(!/^[1-9]\d{5}$/.test(pin)){
    alert('Please enter a valid 6-digit PIN code.');
    if(pinEl)pinEl.focus();
    return;
  }
  customerEmail=contact;
  customerAddr=addr;
  customerPin=pin;
  var ref=genRef();
  var ov=document.createElement('div');
  ov.id='upiOv';
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px';
  ov.innerHTML=
    '<div style="background:#FAFAF7;max-width:420px;width:100%;padding:28px 24px;font-family:DM Sans,sans-serif;color:#1a1a1a">'+
    '  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">'+
    '    <h3 style="font-family:Cormorant Garamond,serif;font-size:22px;font-weight:500;margin:0">Pay via UPI</h3>'+
    '    <button id="upiX" style="background:none;border:none;font-size:22px;cursor:pointer;color:#888">&times;</button>'+
    '  </div>'+
    '  <p style="font-size:11px;color:#6a6560;margin:0 0 14px">Order reference <strong id="upiRef">'+esc(ref)+'</strong> &middot; Amount <strong>'+fmt(total)+'</strong></p>'+
    '  <div id="upiQr" style="display:flex;justify-content:center;padding:14px;background:#fff;border:1px solid #e8e3dc;min-height:220px"></div>'+
    '  <div id="upiFallback" style="margin-top:10px;font-size:11px;color:#8a8580;text-align:center"></div>'+
    '  <div style="margin-top:14px;font-size:11px;color:#6a6560"><strong>UPI ID:</strong> <span id="upiVpa">\u2026</span></div>'+
    '  <button id="upiPaid" style="margin-top:18px;width:100%;padding:13px;background:#1a1a1a;color:#FAFAF7;border:none;font-size:11px;font-weight:600;letter-spacing:.18em;cursor:pointer">I\'VE PAID \u2014 ENTER UTR</button>'+
    '  <div id="upiUtrWrap" style="display:none;margin-top:14px">'+
    '    <label style="font-size:11px;color:#6a6560;display:block;margin-bottom:6px">12-digit UTR / Reference number</label>'+
    '    <input id="upiUtr" inputmode="numeric" maxlength="12" placeholder="123456789012" style="width:100%;box-sizing:border-box;padding:11px;border:1px solid #d4cfc8;font-family:DM Mono,monospace;letter-spacing:.18em;background:#fafaf7">'+
    '    <div id="upiMsg" style="font-size:11px;margin-top:6px;min-height:14px"></div>'+
    '    <button id="upiSubmit" style="margin-top:10px;width:100%;padding:13px;background:#1a1a1a;color:#FAFAF7;border:none;font-size:11px;font-weight:600;letter-spacing:.18em;cursor:pointer">CONFIRM ORDER</button>'+
    '  </div>'+
    '</div>';
  document.body.appendChild(ov);
  document.getElementById('upiX').onclick=function(){ov.remove();};
  document.getElementById('upiPaid').onclick=function(){
    document.getElementById('upiUtrWrap').style.display='block';
    document.getElementById('upiPaid').style.display='none';
    document.getElementById('upiUtr').focus();
  };
  document.getElementById('upiSubmit').onclick=function(){
    submitUpiOrder(ref,total,contact);
  };

  Promise.all([loadUpiConfig(),loadQrLib().catch(function(){return null;})]).then(function(arr){
    var cfg=arr[0]||{},qrlib=arr[1];
    var vpa=cfg.upiVpa||'',name=cfg.upiDisplayName||'AthenaBioLabs';
    document.getElementById('upiVpa').textContent=vpa||'(configured on server)';
    var uri='upi://pay?pa='+encodeURIComponent(vpa)+'&pn='+encodeURIComponent(name)+'&am='+encodeURIComponent(String(total))+'&cu=INR&tn=ABL-'+encodeURIComponent(ref);
    var qrEl=document.getElementById('upiQr');
    var fallback=document.getElementById('upiFallback');
    if(qrlib&&vpa){
      var q=qrlib(0,'M');q.addData(uri);q.make();
      qrEl.innerHTML=q.createSvgTag({scalable:true,margin:1,cellSize:5});
      fallback.innerHTML='Scan with any UPI app (GPay, PhonePe, Paytm).';
    } else {
      qrEl.innerHTML='<a href="'+uri+'" style="word-break:break-all;font-size:11px;color:#C8A97E">'+esc(uri)+'</a>';
      fallback.innerHTML='Tap the link above on a phone to open your UPI app.';
    }
  });
}

function submitUpiOrder(ref,total,contact){
  var utrEl=document.getElementById('upiUtr'),msg=document.getElementById('upiMsg'),btn=document.getElementById('upiSubmit');
  var utr=(utrEl.value||'').replace(/\D/g,'').slice(0,12);
  if(utr.length!==12){msg.style.color='#c44';msg.textContent='Enter the 12-digit UTR shown in your UPI app.';return;}
  var addrEl=document.getElementById('custAddr');
  var addr=((addrEl&&addrEl.value)||customerAddr||'').trim();
  var pinEl=document.getElementById('custPin');
  var pin=((pinEl&&pinEl.value)||customerPin||'').replace(/\D/g,'').slice(0,6);
  if(!addr){msg.style.color='#c44';msg.textContent='Please enter your delivery address before confirming.';return;}
  if(!/^[1-9]\d{5}$/.test(pin)){msg.style.color='#c44';msg.textContent='Please enter a valid 6-digit PIN code.';return;}
  btn.disabled=true;btn.textContent='SAVING\u2026';msg.textContent='';
  var payload={
    items:cart.map(function(c){return{id:c.id,vi:c.vi,q:c.q};}),
    coupon:coupon||null,
    contactEmail:contact,
    otpEmail:(otpState==='verified'&&otpEmail)?otpEmail:null,
    shippingAddress:addr+'\nPIN: '+pin,
    ebook:!!includeEbook,
    ref:ref,
    utr:utr
  };
  fetch('/api/place-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
    .then(function(r){return r.json().then(function(d){return{status:r.status,d:d};});})
    .then(function(res){
      if(res.status===200&&res.d.ok){
        trackEvent('Purchase',{value:total,currency:'INR',transaction_id:res.d.ref,coupon:coupon||null});
        var ov=document.getElementById('upiOv');
        if(ov)ov.innerHTML='<div style="background:#FAFAF7;max-width:420px;width:100%;padding:32px 28px;text-align:center;font-family:DM Sans,sans-serif"><h3 style="font-family:Cormorant Garamond,serif;font-size:22px;font-weight:500;margin:0 0 12px">Order placed</h3><p style="font-size:12px;color:#6a6560">Reference <strong>'+esc(res.d.ref)+'</strong>. We\'ll verify your payment and email you within 24 hours.</p><button onclick="document.getElementById(\'upiOv\').remove()" style="margin-top:18px;padding:12px 24px;background:#1a1a1a;color:#FAFAF7;border:none;font-size:11px;font-weight:600;letter-spacing:.18em;cursor:pointer">CLOSE</button></div>';
        cart=[];saveCart();uB();coupon='';couponMsg='';otpState='idle';otpEmail='';customerEmail='';customerAddr='';customerPin='';rC();closeCart();
      } else {
        btn.disabled=false;btn.textContent='CONFIRM ORDER';
        msg.style.color='#c44';msg.textContent=esc((res.d&&res.d.error)||'Could not save your order. Please try again.');
      }
    })
    .catch(function(){btn.disabled=false;btn.textContent='CONFIRM ORDER';msg.style.color='#c44';msg.textContent='Network error. Try again.';});
}

// =====================
// PROMO BANNER
// =====================
var promos=[
  {code:"FIRST5",txt:"5% off your first order"},
  {code:"BULK10",txt:"10% off orders above Rs 20,000"}
];
var promoIdx=0;
function cyclePromo(){
  var el=document.getElementById("promoInner");
  if(!el)return;
  var p=promos[promoIdx];
  el.innerHTML='<span>Use code</span> <b>'+p.code+'</b> <span>&mdash; '+p.txt+'</span>';
  el.style.animation="none";el.offsetHeight;el.style.animation="pbFade .5s ease";
  promoIdx=(promoIdx+1)%promos.length;
}

// =====================
// SOCIAL PROOF TOASTS
// =====================
var spCities=["Mumbai","Delhi","Bangalore","Pune","Hyderabad","Chennai","Kolkata","Ahmedabad","Jaipur","Lucknow","Chandigarh","Kochi","Indore","Goa","Noida","Gurgaon","Dubai","Singapore","London","New York"];
var spTimes=["just now","2 min ago","5 min ago","8 min ago","12 min ago"];
function showSP(){
  var p=P[Math.floor(Math.random()*P.length)];
  var city=spCities[Math.floor(Math.random()*spCities.length)];
  var time=spTimes[Math.floor(Math.random()*spTimes.length)];
  var el=document.getElementById("spTxt");
  if(!el)return;
  el.innerHTML='Someone from <b>'+city+'</b> purchased <b>'+p.n+'</b><span class="sp-time">'+time+'</span>';
  var toast=document.getElementById("spToast");
  if(toast){toast.classList.add("show");setTimeout(function(){toast.classList.remove("show");},5000);}
}

// =====================
// MOBILE NAV TOGGLE
// =====================
function toggleMob(){var n=document.getElementById("mobNav"),b=document.getElementById("hamBtn");if(n)n.classList.toggle("open");if(b)b.classList.toggle("open");}
function closeMob(){var n=document.getElementById("mobNav"),b=document.getElementById("hamBtn");if(n)n.classList.remove("open");if(b)b.classList.remove("open");}

// =====================
// SCROLL REVEAL + COUNTERS
// =====================
var revealObserver,counterDone=false;
function initReveal(){
  if(!window.IntersectionObserver)return;
  if(revealObserver)revealObserver.disconnect();
  revealObserver=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target);}});
  },{threshold:0.1});
  document.querySelectorAll('.reveal:not(.visible)').forEach(function(el){revealObserver.observe(el);});
  if(!counterDone){
    var sg=document.querySelector('.stat-grid,.sp-bar');
    if(sg){
      var co=new IntersectionObserver(function(entries){
        if(entries[0].isIntersecting&&!counterDone){
          counterDone=true;
          document.querySelectorAll('.stat-num[data-target],.sp-num[data-target]').forEach(function(el){
            var target=parseFloat(el.getAttribute('data-target'));
            var suffix=el.getAttribute('data-suffix')||'';
            var dur=1600,step=16,inc=target/(dur/step),val=0;
            var t=setInterval(function(){
              val=Math.min(val+inc,target);
              el.textContent=Math.floor(val)+suffix;
              if(val>=target)clearInterval(t);
            },step);
          });
          co.disconnect();
        }
      },{threshold:0.4});
      co.observe(sg);
    }
  }
}

// =====================
// PRODUCT PAGE (standalone /products/*.html)
// =====================
function renderProductPage(pid){
  var p=null;for(var i=0;i<P.length;i++){if(P[i].id===pid){p=P[i];break;}}
  if(!p)return;
  var info=PI[p.n]||{desc:"Premium research-grade compound.",tagline:"",dose:"Refer to published literature",mw:"See COA",seq:"See COA",cat:p.c,faqs:[],citations:[]};
  var sel=selV[p.id]||0;
  var v=p.v[sel];
  if(!window._pdpTracked||window._pdpTracked!==p.id){window._pdpTracked=p.id;trackEvent('ViewContent',{content_name:p.n,content_category:p.c,value:v.pr,currency:'INR'});}

  var catUrl=encodeURIComponent(p.c);
  var h='';

  // Breadcrumb
  h+='<div class="pdp-breadcrumb"><a href="/">Home</a><span>\u203a</span><a href="/catalogue">All Compounds</a><span>\u203a</span><a href="/catalogue?cat='+catUrl+'">'+p.c+'</a><span>\u203a</span><span>'+p.n+'</span></div>';

  // Two-column hero
  h+='<div class="pdp-hero">';

  // Left: sticky image column
  h+='<div class="pdp-hero-img-col"><div class="pdp-img-wrap">';
  h+='<img src="/img/'+esc(IMG[p.n]||'placeholder.png')+'" alt="'+esc(p.n)+'" class="pdp-hero-img" onerror="this.style.display=\'none\';this.parentNode.innerHTML+=\'<div style=&quot;display:flex;align-items:center;justify-content:center;height:100%;padding:40px&quot;><span style=&quot;font-family:Cormorant Garamond,serif;font-size:72px;font-weight:300;color:#C8A97E&quot;>'+esc(mono(p.n))+'</span></div>\'">';
  h+='</div></div>';

  // Right: purchase info column
  h+='<div class="pdp-hero-info-col">';
  h+='<div class="pdp-eyebrow"><span>'+p.c+'</span><span class="pdp-ey-sep">\u00b7</span><span>'+info.mw+'</span></div>';
  h+='<div class="pdp-title-row"><h1 class="pdp-h1">'+p.n+'<span class="pdp-period-gold">.</span></h1></div>';
  if(info.tagline)h+='<p class="pdp-tagline">'+info.tagline+'</p>';

  if(p.n!=='BAC Water'){
    h+='<div class="pdp-trust-strip">';
    h+='<div class="pdp-trust-item"><div class="pdp-trust-val">99%+</div><div class="pdp-trust-lbl">HPLC Purity</div></div>';
    h+='<div class="pdp-trust-div"></div>';
    h+='<div class="pdp-trust-item"><div class="pdp-trust-val">ISO</div><div class="pdp-trust-lbl">3rd Party Lab</div></div>';
    h+='<div class="pdp-trust-div"></div>';
    h+='<div class="pdp-trust-item"><div class="pdp-trust-val">COA</div><div class="pdp-trust-lbl">Every Batch</div></div>';
    h+='</div>';
  }

  h+='<div class="pdp-hairline"></div>';

  if(p.v.length>1){
    h+='<div class="pdp-vsel"><div class="pdp-sect-lbl">Strength</div><div class="pdp-vt-row">';
    for(var k=0;k<p.v.length;k++){
      var isOn=k===sel,isPop=p.v[k].ds==='20mg';
      h+='<div class="pdp-vt'+(isOn?' on':'')+'" onclick="selV['+p.id+']='+k+';renderProductPage('+p.id+')">';
      if(isPop)h+='<div class="pdp-vt-badge">POPULAR</div>';
      h+='<div class="pdp-vt-mg">'+p.v[k].ds+'</div>';
      h+='<div class="pdp-vt-label">'+p.v[k].sp+'</div>';
      h+='<div class="pdp-vt-price">'+fmt(p.v[k].pr)+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  h+='<div class="pdp-pricebox"><span class="pdp-price-big">'+fmt(v.pr)+'</span><span class="pdp-price-meta">per vial &middot; '+v.sp+'</span></div>';

  h+='<div class="pdp-atc-row">';
  if(p.oos){
    h+='<a href="https://wa.me/919818697569?text='+encodeURIComponent('Hi, notify me when '+p.n+' is back in stock.')+'" target="_blank" rel="noopener" class="b b3 pdp-oos">Out of Stock \u2014 Notify via WhatsApp</a>';
  } else {
    var cQty=getCartQty(p.id,sel);
    if(cQty>0){
      h+='<div class="pdp-stepper"><button onclick="aC2('+p.id+','+sel+',-1)">\u2212</button><span>'+cQty+'</span><button onclick="aC2('+p.id+','+sel+',1)">+</button></div>';
      h+='<span class="pdp-incart">In your cart</span>';
    } else {
      h+='<button class="pdp-atc b b1" onclick="aC('+p.id+')">Add to Cart</button>';
    }
  }
  h+='</div>';

  h+='<div class="pdp-ship-strip">';
  h+='<div class="pdp-ship-cell"><span class="pdp-ship-icon">\u25ca</span><span class="pdp-ship-text"><span class="pdp-ship-v">Cold-chain</span><span class="pdp-ship-l">2\u20134 days</span></span></div>';
  h+='<div class="pdp-ship-cell"><span class="pdp-ship-icon">\u25ca</span><span class="pdp-ship-text"><span class="pdp-ship-v">COA</span><span class="pdp-ship-l">with every vial</span></span></div>';
  h+='<div class="pdp-ship-cell"><span class="pdp-ship-icon">\u25ca</span><span class="pdp-ship-text"><span class="pdp-ship-v">Free</span><span class="pdp-ship-l">shipping</span></span></div>';
  h+='</div>';

  h+='</div></div>'; // close info-col and hero

  h+='<div class="pdp-about-grid">';
  h+='<div class="pdp-about-left"><span class="pdp-sect-eyebrow">Mechanism</span><h2 class="pdp-about-h2">How it<br><em>works.</em></h2></div>';
  h+='<div class="pdp-about-right"><p class="pdp-mechanism-body">'+info.desc+'</p>';
  if(info.seq&&info.seq!=='N/A'){
    h+='<div class="pdp-seq-block"><div class="pdp-seq-label">Sequence / Structure</div><div class="pdp-seq-val">'+info.seq+'</div></div>';
  }
  h+='</div></div>';

  h+='<div class="pdp-tabs">';
  h+='<div class="pdp-tabs-nav"><button id="tab1" class="tab-btn active" onclick="showTab(1)">Description</button><button id="tab2" class="tab-btn" onclick="showTab(2)">Details</button></div>';
  h+='<div id="tabC1" class="tab-content"><p class="pdp-desc">'+info.desc+'</p></div>';
  h+='<div id="tabC2" class="tab-content" style="display:none"><table class="pdp-table">';
  h+='<tr><td class="td-lbl">Category</td><td class="td-val">'+info.cat+'</td></tr>';
  h+='<tr><td class="td-lbl">Molecular Weight</td><td class="td-val">'+info.mw+'</td></tr>';
  h+='<tr><td class="td-lbl">Sequence</td><td class="td-val" style="word-break:break-all;font-size:12px">'+info.seq+'</td></tr>';
  if(p.n!=='BAC Water'){h+='<tr><td class="td-lbl">Purity</td><td class="td-val">&ge;99% (HPLC verified)</td></tr><tr><td class="td-lbl">Form</td><td class="td-val">White lyophilized powder</td></tr>';}
  h+='<tr><td class="td-lbl">Storage</td><td class="td-val">'+(p.n==='BAC Water'?'2\u20138\u00b0C':'\u221220\u00b0C (lyophilized) / 2\u20138\u00b0C (reconstituted)')+'</td></tr>';
  h+='</table></div>';
  h+='</div>';

  if(info.janoshik){
    var j=info.janoshik;
    h+='<div style="background:#F4F1EB;padding:36px 40px;margin:32px 0;border-left:3px solid #C8A97E">';
    h+='<div style="margin-bottom:20px">';
    h+='<div style="font-size:9px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:#C8A97E;margin-bottom:6px">Third-party verified</div>';
    h+='<div style="font-family:\'Cormorant Garamond\',serif;font-size:22px;font-weight:500">Independent Lab Analysis</div>';
    h+='</div>';
    h+='<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-bottom:20px" class="jano-grid">';
    if(j.purity&&j.purity!=='N/A')h+='<div><div style="font-size:8px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#b5b0a6;margin-bottom:4px">Purity</div><div style="font-family:\'Cormorant Garamond\',serif;font-size:26px;font-weight:600;color:#7a9a6d">'+j.purity+'</div></div>';
    h+='<div><div style="font-size:8px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#b5b0a6;margin-bottom:4px">Quantity found</div><div style="font-family:\'Cormorant Garamond\',serif;font-size:20px;font-weight:500">'+j.quantity+'</div></div>';
    h+='</div>';
    h+='<img src="'+j.image+'" alt="HPLC chromatogram" style="width:100%;max-height:180px;object-fit:cover;object-position:center;border:1px solid rgba(0,0,0,.08)">';
    h+='<div style="font-size:10px;color:#b5b0a6;margin-top:10px">Janoshik task #'+j.taskNumber+' · Analysis by independent third-party laboratory. Full report available on request.</div>';
    h+='</div>';
  }

  if(info.citations&&info.citations.length){
    h+='<div class="pdp-research"><div class="pdp-research-left">';
    h+='<span class="pdp-sect-eyebrow pdp-sect-eyebrow-gold">Literature</span>';
    h+='<h2 class="pdp-research-h2">Research<br><em class="pdp-research-em">citations.</em></h2>';
    h+='<p class="pdp-research-intro">Published peer-reviewed studies supporting mechanism and activity data.</p>';
    h+='</div><div class="pdp-research-right">';
    for(var c=0;c<info.citations.length;c++){
      var cit=info.citations[c];
      h+='<div class="pdp-cit-row"><div class="pdp-cit-year">'+cit.year+'</div>';
      h+='<div class="pdp-cit-body"><div class="pdp-cit-title">'+cit.title+'</div><div class="pdp-cit-journal">'+cit.journal+'</div>';
      h+='<a href="'+cit.url+'" target="_blank" rel="noopener" class="pdp-cit-link">View paper \u2192</a></div></div>';
    }
    h+='</div></div>';
  }

  h+='<div class="pdp-reviews-section"><div class="pdp-reviews-header">';
  h+='<div class="pdp-rating-block"><div class="pdp-rating-num">4.9</div><div class="pdp-stars">\u2605\u2605\u2605\u2605\u2605</div><div class="pdp-rating-count">Based on 47 reviews</div></div>';
  h+='<h2 class="pdp-reviews-h2">What researchers<br><em>say.</em></h2>';
  h+='</div><div class="pdp-reviews-grid">';
  h+='<div class="pdp-review-card"><div class="pdp-review-stars">\u2605\u2605\u2605\u2605\u2605</div><p class="pdp-review-q">\u201cPurity exceeded spec. Chromatogram matches exactly what they publish on the site. Will order again.\u201d</p><div class="pdp-review-footer"><span class="pdp-review-name">Dr. A. Sharma</span><span class="pdp-review-loc">Bangalore</span></div></div>';
  h+='<div class="pdp-review-card"><div class="pdp-review-stars">\u2605\u2605\u2605\u2605\u2605</div><p class="pdp-review-q">\u201cFastest dispatch I\u2019ve experienced in India. Cold-pack still ice-cold on arrival. COA exactly as described.\u201d</p><div class="pdp-review-footer"><span class="pdp-review-name">R. Nair</span><span class="pdp-review-loc">Kochi</span></div></div>';
  h+='<div class="pdp-review-card"><div class="pdp-review-stars">\u2605\u2605\u2605\u2605\u2605</div><p class="pdp-review-q">\u201cPurity data matched the published HPLC results exactly. Well-documented, excellent research team.\u201d</p><div class="pdp-review-footer"><span class="pdp-review-name">M. Patel</span><span class="pdp-review-loc">Mumbai</span></div></div>';
  h+='</div></div>';

  if(info.faqs&&info.faqs.length){
    h+='<div class="pdp-faq-section"><div class="pdp-faq-col-left">';
    h+='<span class="pdp-sect-eyebrow">FAQ</span>';
    h+='<h2 class="pdp-faq-h2">Common<br>questions.</h2>';
    h+='<p class="pdp-faq-sub">Everything you need to know before you order.</p>';
    h+='</div><div class="pdp-faq-col-right">';
    for(var f=0;f<info.faqs.length;f++){
      h+='<div class="pdp-faq-item" id="pdpFaq'+f+'">';
      h+='<button class="pdp-faq-q" onclick="pdpFaqToggle('+f+')">'+info.faqs[f].q+'<span class="pdp-faq-plus" id="pdpFaqPlus'+f+'">+</span></button>';
      h+='<div class="pdp-faq-body" id="pdpFaqBody'+f+'" style="display:none">'+info.faqs[f].a+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  h+='<div class="consult-card" style="margin:32px 0"><div class="consult-icon">&#128172;</div><div class="consult-info"><div class="consult-title">Book a Research Consultation</div><div class="consult-sub">15 min &middot; &#8377;1000 &middot; 1-on-1 with our team</div></div><a href="https://topmate.io/athenabiolabs/" target="_blank" rel="noopener" class="consult-btn">Book Now</a></div>';
  h+='<div class="pdp-disclaimer"><p>All products are sold exclusively for in-vitro laboratory research purposes. Not approved or intended for human or animal administration. Not intended to diagnose, treat, cure, or prevent any disease. By purchasing you confirm compliance with all applicable local laws and regulations. AthenaBioLabs accepts no liability for misuse.</p></div>';

  var wrap=document.getElementById("pdpContent");
  if(wrap){
    var scrollY=window.scrollY||window.pageYOffset;
    wrap.style.minHeight=wrap.offsetHeight+'px';
    wrap.innerHTML=h;
    window.scrollTo(0,scrollY);
    requestAnimationFrame(function(){
      wrap.style.minHeight='';
      var related=document.querySelector('.related-section');
      var calc=document.getElementById('reconCalcSection');
      var chrom=document.getElementById('chromSection');
      if(related&&related.parentNode){
        if(calc&&calc.parentNode)related.parentNode.insertBefore(calc,related);
        if(chrom&&chrom.parentNode)related.parentNode.insertBefore(chrom,related);
      }
    });
    initReveal();
  }

  renderRelated(p);
}

function refreshPDP(){
  var wrap=document.getElementById("pdpContent");
  if(!wrap||!wrap.dataset.pid)return;
  renderProductPage(parseInt(wrap.dataset.pid));
}

function renderRelated(currentProduct){
  var relGrid=document.getElementById("relatedGrid");
  if(!relGrid)return;
  var related=[];
  for(var i=0;i<P.length;i++){
    if(P[i].id!==currentProduct.id&&P[i].c===currentProduct.c)related.push(P[i]);
  }
  if(related.length<3){
    for(var i=0;i<P.length&&related.length<3;i++){
      if(P[i].id!==currentProduct.id&&P[i].c!==currentProduct.c)related.push(P[i]);
    }
  }
  related=related.slice(0,3);
  var h="";
  for(var i=0;i<related.length;i++){
    var p=related[i],v=p.v[0];
    h+='<a href="/products/'+SLUG_MAP[p.id]+'" class="pc" style="padding:0;cursor:pointer;text-decoration:none;color:inherit">';
    h+='<div style="overflow:hidden;height:220px">';
    h+='<img src="/img/'+esc(IMG[p.n]||'placeholder.png')+'" alt="'+esc(p.n)+'" style="width:100%;height:220px;object-fit:cover;display:block" onerror="this.outerHTML=\'<div style=&quot;height:220px;background:#F4F1EB;display:flex;align-items:center;justify-content:center&quot;><span style=&quot;font-family:Cormorant Garamond,serif;font-size:44px;color:#C8A97E&quot;>'+esc(mono(p.n))+'</span></div>\'">';
    h+='</div>';
    h+='<div style="padding:20px 24px">';
    h+='<div style="font-size:9px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#b5b0a6;margin-bottom:4px">'+p.c+'</div>';
    h+='<h3 style="font-size:17px;font-weight:600;margin-bottom:8px;letter-spacing:-.01em">'+p.n+'</h3>';
    h+='<span class="pp" style="font-size:18px">'+fmt(v.pr)+'</span>';
    h+='</div></a>';
  }
  relGrid.innerHTML=h;
}

function showTab(n){
  for(var i=1;i<=3;i++){
    var tc=document.getElementById("tabC"+i),tb=document.getElementById("tab"+i);
    if(tc)tc.style.display=i===n?"block":"none";
    if(tb){tb.classList.toggle('active',i===n);}
  }
}

function pdpFaqToggle(idx){
  var body=document.getElementById('pdpFaqBody'+idx);
  var plus=document.getElementById('pdpFaqPlus'+idx);
  if(!body)return;
  var open=body.style.display!=='none';
  body.style.display=open?'none':'block';
  if(plus)plus.textContent=open?'+':'\u2212';
}

// Cookie consent
function getCookie(n){var v=document.cookie.match('(^|;)\\s*'+n+'=([^;]*)');return v?v[2]:null;}
function setCookie(n,v,d){var dt=new Date();dt.setTime(dt.getTime()+d*86400000);document.cookie=n+'='+v+';expires='+dt.toUTCString()+';path=/;SameSite=Lax';}
function acceptCookies(){setCookie('cookie_consent','accepted',365);var b=document.getElementById('cookieBanner');if(b)b.style.display='none';}
function declineCookies(){setCookie('cookie_consent','declined',30);var b=document.getElementById('cookieBanner');if(b)b.style.display='none';}
