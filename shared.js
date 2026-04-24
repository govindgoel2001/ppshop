// ============================================================
// AthenaBioLabs — shared.js
// Shared product data, cart, payment, and utility functions
// Used by index.html and all /products/*.html pages
// ============================================================

// =====================
// PRODUCT DATA
// =====================
var P=[
{id:2,n:"Tirzepatide",c:"Weight Loss",oos:true,v:[{sp:"10mg per vial",ds:"10mg",pr:2400},{sp:"20mg per vial",ds:"20mg",pr:3800}]},
{id:3,n:"Retatrutide",c:"Weight Loss",v:[{sp:"10mg per vial",ds:"10mg",pr:2899,cp:1800},{sp:"20mg per vial",ds:"20mg",pr:4500,cp:2600},{sp:"30mg per vial",ds:"30mg",pr:null,cp:3500}]},
{id:4,n:"BPC-157",c:"Healing & Recovery",v:[{sp:"10mg per vial",ds:"10mg",pr:1990,cp:1000}]},
{id:5,n:"TB-500",c:"Healing & Recovery",oos:true,v:[{sp:"10mg per vial",ds:"10mg",pr:3400}]},
{id:6,n:"BPC+TB Combo",c:"Healing & Recovery",oos:true,v:[{sp:"BPC-157 5mg + TB-500 5mg",ds:"10mg",pr:3200}]},
{id:8,n:"GHK-Cu",c:"Skin & Anti-Aging",v:[{sp:"50mg per vial",ds:"50mg",pr:1990,cp:1300}]},
{id:11,n:"CJC-1295 (no DAC)",c:"GH",oos:true,v:[{sp:"5mg per vial",ds:"5mg",pr:2800}]},
{id:12,n:"CJC+IPA Combo",c:"GH",oos:true,v:[{sp:"CJC-1295 5mg + Ipamorelin 5mg",ds:"10mg",pr:3750}]},
{id:13,n:"KLOW Blend",c:"Healing & Recovery",oos:true,v:[{sp:"BPC-157 10mg + TB-500 10mg + KPV 10mg + GHK-Cu 50mg",ds:"80mg",pr:3990}]},
{id:14,n:"BAC Water",c:"Supplies",v:[{sp:"10ml per vial",ds:"10ml",pr:799}]}
];

// Returns markup % for a variant: (selling - cost) / cost * 100
// Returns null if cost or selling price is missing.
function calcMarkup(variant){
  if(!variant.cp||!variant.pr) return null;
  return Math.round(((variant.pr-variant.cp)/variant.cp)*10000)/100;
}

var _cfaqs=[
  {q:'How is this shipped?',a:'All peptides ship cold-chain in an insulated pack with ice gel. Express courier, typically 2\u20134 days pan-India.'},
  {q:'What is the storage protocol?',a:'Store lyophilised powder at \u221220\u00b0C. After reconstituting with bacteriostatic water, store at 2\u20138\u00b0C and use within 28 days.'},
  {q:'Is a Certificate of Analysis included?',a:'Yes. A QR-linked COA showing HPLC purity trace, mass spec, and LAL endotoxin result from an ISO\u00a017025-accredited lab ships with every vial.'},
  {q:'What assays are run on each batch?',a:'Reverse-phase C18 HPLC for purity and area%, ESI-MS for molecular weight confirmation, and LAL endotoxin screening.'},
  {q:'Is this for human use?',a:'No. All products are sold strictly for in-vitro laboratory research. Not intended for human or animal administration.'}
];
var PI={
"Tirzepatide":{desc:"First-in-class dual GIP/GLP-1 receptor agonist. The dual mechanism produces synergistic metabolic effects exceeding mono-agonists, with significant research interest in glycemic control, weight management, and lipid profiles.",tagline:"Dual-pathway metabolic research. Both incretins, one scaffold.",dose:"2.5 - 15mg weekly, subcutaneous",mw:"4813.45 g/mol",seq:"GIP/GLP-1 dual agonist (39 AA)",cat:"Metabolic",faqs:_cfaqs,citations:[{year:"2023",title:"Tirzepatide Once Weekly for the Treatment of Obesity \u2014 SURMOUNT-1",journal:"NEJM \u00b7 doi:10.1056/NEJMoa2206038",url:"https://doi.org/10.1056/NEJMoa2206038"},{year:"2021",title:"Tirzepatide versus Semaglutide Once Weekly \u2014 SURPASS-2",journal:"NEJM \u00b7 doi:10.1056/NEJMoa2107519",url:"https://doi.org/10.1056/NEJMoa2107519"}]},
"Retatrutide":{desc:"Novel triple agonist targeting GLP-1, GIP, and glucagon receptors simultaneously. The glucagon component adds thermogenic and lipolytic effects, representing a potential advancement over dual agonists.",tagline:"Triple agonism. Unprecedented metabolic research leverage.",dose:"1 - 12mg weekly, subcutaneous",mw:"~4400 g/mol",seq:"Triple agonist (39 AA)",cat:"Weight Loss",faqs:_cfaqs,citations:[{year:"Dec 2025",title:"TRIUMPH-4 Phase 3 \u2014 Retatrutide delivered average 26.2% weight loss at 96 weeks",journal:"Lilly Investor Relations \u00b7 TRIUMPH-4",url:"https://investor.lilly.com/news-releases/news-release-details/lillys-triple-agonist-retatrutide-delivered-weight-loss-average"},{year:"Oct 2025",title:"TRIUMPH Programme Rationale and Trial Design",journal:"PubMed \u00b7 PMID 41090431",url:"https://pubmed.ncbi.nlm.nih.gov/41090431/"},{year:"Aug 2025",title:"Body Composition Substudy of Retatrutide Phase 2",journal:"PubMed \u00b7 PMID 40609566",url:"https://pubmed.ncbi.nlm.nih.gov/40609566/"},{year:"Jul 2025",title:"Retatrutide in Obesity: Systematic Review and Meta-Analysis",journal:"PubMed \u00b7 PMID 40728138",url:"https://pubmed.ncbi.nlm.nih.gov/40728138/"},{year:"2024",title:"Structural Insights into Triple Agonism of Retatrutide",journal:"Cell Research \u00b7 doi:10.1038/s41421-024-00700-0",url:"https://doi.org/10.1038/s41421-024-00700-0"},{year:"2023",title:"Retatrutide Phase 2 Dose-Finding \u2014 NEJM",journal:"New England Journal of Medicine \u00b7 doi:10.1056/NEJMoa2301972",url:"https://doi.org/10.1056/NEJMoa2301972"}]},
"BPC-157":{desc:"A 15-amino-acid peptide derived from human gastric juice. Extensively studied for accelerated healing of tendons, ligaments, muscle, and bone. Promotes angiogenesis and modulates nitric oxide pathways.",tagline:"Tissue repair from within. Site-specific healing cascade.",dose:"200 - 500mcg 1-2x daily, subcutaneous",mw:"1419.53 g/mol",seq:"Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",cat:"Healing & Recovery",faqs:_cfaqs,citations:[{year:"2023",title:"BPC-157 and Tendon Healing \u2014 Systematic Review",journal:"Curr Pharm Des \u00b7 PMID 36173050",url:"https://pubmed.ncbi.nlm.nih.gov/36173050/"},{year:"2021",title:"Body Protection Compound-157: Candidate Medication for Wound Healing",journal:"Front Pharmacol \u00b7 PMC7837306",url:"https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7837306/"}]},
"TB-500":{desc:"A 43-amino-acid peptide central to tissue repair and regeneration. Sequesters actin monomers, promotes cell migration, and has demonstrated effects on cardiac tissue repair and inflammation reduction.",tagline:"Systemic tissue regeneration. Actin sequestration at scale.",dose:"2 - 5mg 2x weekly (loading), subcutaneous",mw:"4963.50 g/mol",seq:"Thymosin Beta-4 (43 AA)",cat:"Healing & Recovery",faqs:_cfaqs,citations:[{year:"2022",title:"Thymosin Beta-4 and Tissue Repair: An Updated Overview",journal:"Curr Pharm Des \u00b7 PMID 35236248",url:"https://pubmed.ncbi.nlm.nih.gov/35236248/"}]},
"BPC+TB Combo":{desc:"Pre-blended stack of BPC-157 and TB-500. Combines BPC-157\u2019s site-specific healing with TB-500\u2019s systemic actin-sequestering and anti-inflammatory effects for comprehensive tissue regeneration research.",tagline:"Site-specific meets systemic. The complete healing stack.",dose:"Per protocol, subcutaneous",mw:"Blend",seq:"BPC-157 + TB-500",cat:"Healing & Recovery",faqs:_cfaqs,citations:[]},
"GHK-Cu":{desc:"A naturally occurring tripeptide-copper complex. Over 4,000 genes modulated by GHK-Cu have been identified, with effects including collagen synthesis, antioxidant enzyme upregulation, and dermal fibroblast promotion.",tagline:"4,000 genes. One copper-peptide.",dose:"1 - 2mg daily, subcutaneous",mw:"340.38 g/mol",seq:"Gly-His-Lys:Cu(2+)",cat:"Skin & Anti-Aging",faqs:_cfaqs,citations:[{year:"2023",title:"GHK-Cu in Skin Regeneration and Wound Healing",journal:"Cosmetics \u00b7 doi:10.3390/cosmetics10020051",url:"https://doi.org/10.3390/cosmetics10020051"}]},
"CJC-1295 (no DAC)":{desc:"Synthetic GHRH analog with ~30 min half-life producing acute GH pulses mimicking natural physiology. Commonly paired with GHRP peptides for synergistic pulsatile GH release.",tagline:"Pulsatile growth hormone. Physiological mimicry, refined.",dose:"100 - 200mcg 1-3x daily, subcutaneous",mw:"3367.97 g/mol",seq:"GHRH analog (29 AA, mod.)",cat:"GH",faqs:_cfaqs,citations:[]},
"CJC+IPA Combo":{desc:"Pre-blended combination of CJC-1295 (no DAC) and Ipamorelin. Synergistic GH release through simultaneous GHRH and ghrelin receptor activation, producing amplified pulsatile GH output.",tagline:"GHRH + ghrelin axis. Amplified, synchronised GH pulse.",dose:"100 - 300mcg combined, 1-3x daily, subcutaneous",mw:"Blend",seq:"CJC-1295 + Ipamorelin",cat:"GH",faqs:_cfaqs,citations:[]},
"KLOW Blend":{desc:"Advanced recovery and skin blend combining TB-500, BPC-157, GHK-Cu, and KPV. Pairs systemic tissue repair with localised healing, anti-inflammatory action via KPV, and copper-peptide skin regeneration for a comprehensive research protocol.",tagline:"Four-peptide synergy. The most comprehensive repair stack.",dose:"Per component protocol, subcutaneous",mw:"Blend",seq:"TB-500 + BPC-157 + GHK-Cu + KPV",cat:"Healing & Recovery",faqs:_cfaqs,citations:[]},
"BAC Water":{desc:"Bacteriostatic water (0.9% benzyl alcohol) in a sterile 10ml vial. The standard reconstitution medium for research peptides \u2014 preservative allows multi-draw use over 28 days without contamination risk.",tagline:"The essential reconstitution medium. Preserves integrity across multi-draw protocols.",dose:"N/A - reconstitution supply",mw:"N/A",seq:"N/A",cat:"Supplies",faqs:[{q:'How should I store this?',a:'Store at 2\u20138\u00b0C. Keep in original sealed vial until use. Once opened, use within 28 days.'},{q:'Can I use this for all peptides?',a:'Yes. Bacteriostatic water (0.9% benzyl alcohol) is the standard reconstitution medium for all lyophilised research peptides in our catalogue.'},{q:'How much do I need per peptide vial?',a:'Typically 1\u20132 mL per peptide vial, depending on your target concentration. Use our Dosage Calculator for exact volumes.'}],citations:[]}
};

var IMG={
"Tirzepatide":"tirzepatide.png","Retatrutide":"retatrutide.png",
"BPC-157":"bpc-157.png","TB-500":"tb-500.png","BPC+TB Combo":"bpc157tb500.png","GHK-Cu":"ghk-cu.png",
"CJC-1295 (no DAC)":"cjc-no-dac.png","CJC+IPA Combo":"cjc_1295.png",
"KLOW Blend":"klow.png","BAC Water":"bac-water.png"
};
var IMGPOS={};

// Slug map: product id -> URL slug
var SLUG_MAP={
  2:'tirzepatide',3:'retatrutide',4:'bpc-157',5:'tb-500',
  6:'bpc-tb-combo',8:'ghk-cu',11:'cjc-1295-no-dac',
  12:'cjc-ipa-combo',13:'klow-blend',14:'bac-water'
};

// =====================
// SUPABASE
// =====================
var SUPA=supabase.createClient('https://vlhcmycnscmjeiyczwec.supabase.co','sb_publishable_1hNyIavnnJa0gGZJIw1fcg_XLkU0GoQ');

// =====================
// UTILITIES
// =====================
function trackEvent(evName,params){
  try{gtag('event',evName,params||{});}catch(e){}
  try{fbq('track',evName,params||{});}catch(e){}
}
function fmt(n){return "\u20B9"+n.toLocaleString("en-IN")}
function mono(nm){return nm.replace(/[-\s\+\(\)]/g,"").substring(0,3).toUpperCase()}
function imgSrc(n){var f=IMG[n]||"placeholder";return "/img/"+f+(f.indexOf(".")>-1?"":".jpg");}
function imgStyle(n){return 'object-position:'+(IMGPOS[n]||'center center')+';';}
function slugify(name){return name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}

// Visitor ID
var VID=(function(){var id=localStorage.getItem('abl_vid');if(!id){id='v_'+Date.now()+'_'+Math.random().toString(36).substr(2,9);localStorage.setItem('abl_vid',id);}return id;})();
var usedFirst=false;
SUPA.from('coupon_usage').select('id').eq('visitor_id',VID).eq('code','FIRST5').maybeSingle().then(function(r){if(r&&r.data)usedFirst=true;});

// =====================
// CART STATE
// =====================
var cart=[],selV={},coupon="",couponMsg="",includeEbook=true;
function saveCart(){try{localStorage.setItem('abl_cart',JSON.stringify(cart));}catch(e){}}
function loadCart(){try{var c=localStorage.getItem('abl_cart');if(c)cart=JSON.parse(c);}catch(e){}}
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
// COUPON & CHECKOUT
// =====================
function applyCoupon(){
  var code=(document.getElementById("cpIn").value||"").trim().toUpperCase();
  var sub=0;for(var i=0;i<cart.length;i++)sub+=cart[i].pr*cart[i].q;
  coupon="";couponMsg="";
  if(code==="FIRST5"){
    if(usedFirst){couponMsg='<span style="color:#c44">FIRST5 has already been used on this device</span>';}
    else{coupon="FIRST5";couponMsg='<span style="color:#7a9a6d">FIRST5 applied: 5% off your first order</span>';}
  }
  else if(code==="BULK10"){
    if(sub>=20000){coupon="BULK10";couponMsg='<span style="color:#7a9a6d">BULK10 applied: 10% off</span>';}
    else couponMsg='<span style="color:#c44">BULK10 requires order above Rs 20,000</span>';
  }
  else if(code) couponMsg='<span style="color:#c44">Invalid coupon code</span>';
  rC();
}
function calcDiscount(sub){
  if(coupon==="FIRST5") return Math.round(sub*0.05);
  if(coupon==="BULK10"&&sub>=20000) return Math.round(sub*0.10);
  if(!coupon&&sub>=20000){coupon="BULK10";couponMsg='<span style="color:#7a9a6d">BULK10 auto-applied: 10% off (order 20k+)</span>';return Math.round(sub*0.10);}
  return 0;
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
    h+='<div class="ci"><div class="ct">'+mono(it.n)+'</div>';
    h+='<div class="cd2"><h4>'+it.n+'</h4><div class="cm">'+it.ds+' &middot; '+it.sp+' &middot; 99%+ HPLC</div>';
    h+='<div style="margin-top:10px;display:flex;align-items:center"><div class="cq">';
    h+='<button onclick="cQ('+it.id+','+it.vi+',-1)">&minus;</button><span>'+it.q+'</span><button onclick="cQ('+it.id+','+it.vi+',1)">+</button>';
    h+='</div><button class="cr" onclick="rm('+it.id+','+it.vi+')">Remove</button></div></div>';
    h+='<div class="cp">'+fmt(it.pr*it.q)+'</div></div>';
  }
  h+='<div style="border-top:1px solid rgba(0,0,0,.06);margin-top:16px;padding-top:20px">';
  h+='<h3 style="font-family:Cormorant Garamond,serif;font-size:20px;font-weight:600;margin-bottom:16px">Checkout</h3>';
  var sub=0;for(var i=0;i<cart.length;i++)sub+=cart[i].pr*cart[i].q;
  var disc=calcDiscount(sub);
  var total=sub-disc;
  h+='<div class="cui"><input type="text" id="cpIn" placeholder="Coupon code" value="'+(coupon||"")+'"><button onclick="applyCoupon()">Apply</button></div>';
  if(couponMsg) h+='<div class="cmsg">'+couponMsg+'</div>';
  h+='<div class="sr"><span>Subtotal</span><span>'+fmt(sub)+'</span></div>';
  if(disc>0) h+='<div class="sr"><span>Discount ('+coupon+')</span><span style="color:#7a9a6d">-'+fmt(disc)+'</span></div>';
  h+='<div class="sr"><span>Shipping</span><span style="color:#7a9a6d">Complimentary</span></div>';
  h+='<div class="gs" style="margin:12px 0"></div>';
  h+='<div class="st"><span>Total</span><span>'+fmt(total)+'</span></div>';
  if(includeEbook){
    h+='<div class="eb"><div class="ei">&#128218;</div><div class="et"><b>Free: Peptide Research Guide</b><span>15-chapter eBook included</span></div><button onclick="includeEbook=false;rC()" style="background:none;border:none;color:#b5b0a6;font-size:10px;cursor:pointer;text-decoration:underline;white-space:nowrap;margin-left:8px">Remove</button></div>';
  } else {
    h+='<div style="margin-top:12px;padding:12px 16px;background:#F0EDE7;display:flex;align-items:center;justify-content:space-between"><span style="font-size:11px;color:#8a8580">Peptide Research Guide eBook</span><button onclick="includeEbook=true;rC()" style="font-family:DM Sans,sans-serif;font-size:9px;font-weight:600;letter-spacing:.1em;padding:5px 12px;background:#1a1a1a;color:#FAFAF7;border:none;cursor:pointer">+ Add Free eBook</button></div>';
  }
  h+='<div class="consult-card" style="margin-top:12px"><div class="consult-icon">&#128172;</div><div class="consult-info"><div class="consult-title">Need guidance?</div><div class="consult-sub">15 min consultation &middot; &#8377;1000</div></div><a href="https://topmate.io/athenabiolabs/" target="_blank" rel="noopener" class="consult-btn">Book</a></div>';
  h+='<button class="b b1" style="width:100%;margin-top:16px;padding:18px 40px;font-size:13px;position:relative" onclick="openUpiModal('+total+')"><span style="position:absolute;left:16px;top:50%;transform:translateY(-50%)">&#9654;</span> Pay via UPI &middot; '+fmt(total)+'</button>';
  h+='<div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-top:12px;padding-bottom:20px"><span style="font-size:9px;color:#b5b0a6">Pay via UPI &middot; Paytm &middot; GPay &middot; PhonePe &middot; BHIM</span></div>';
  h+='</div>';
  bd.innerHTML=h;
}

// =====================
// PAYMENT
// =====================
function openUpiModal(total){
  _upiData=null;clearInterval(_upiTimer);
  var el=document.getElementById('upiModal');
  if(!el){el=document.createElement('div');el.id='upiModal';document.body.appendChild(el);}
  el.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto';
  el.innerHTML=_upiStep1Html(total);
}
function closeUpiModal(){
  clearInterval(_upiTimer);
  var el=document.getElementById('upiModal');
  if(el)el.remove();
}
var _upiData=null,_upiTimer=null;
function _upiStep1Html(total){
  var inp='padding:11px 14px;border:1px solid #ddd;background:#fff;font-family:DM Sans,sans-serif;font-size:13px;outline:none;width:100%;box-sizing:border-box';
  return '<div style="background:#FAFAF7;max-width:420px;width:100%;padding:36px 28px;position:relative;font-family:DM Sans,sans-serif;box-sizing:border-box">'+
    '<button onclick="closeUpiModal()" style="position:absolute;top:14px;right:16px;background:none;border:none;font-size:22px;cursor:pointer;color:#aaa;line-height:1">&times;</button>'+
    '<p style="font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#C8A97E;margin:0 0 6px">UPI Payment · Step 1 of 2</p>'+
    '<h2 style="font-family:Cormorant Garamond,serif;font-size:24px;font-weight:500;margin:0 0 6px">Shipping Details</h2>'+
    '<p style="font-size:12px;color:#aaa;margin:0 0 20px">Fill in your details, then we’ll show you the payment QR</p>'+
    '<div style="display:flex;flex-direction:column;gap:10px">'+
    '<input id="uName" placeholder="Full name *" style="'+inp+'">'+
    '<input id="uEmail" type="email" placeholder="Email address *" style="'+inp+'">'+
    '<input id="uPhone" type="tel" placeholder="Phone number *" style="'+inp+'">'+
    '<textarea id="uAddr" placeholder="Full shipping address (with PIN code) *" rows="3" style="'+inp+';resize:vertical"></textarea>'+
    '</div>'+
    '<button onclick="_upiNext('+total+')" class="b b1" style="width:100%;margin-top:16px;padding:16px;font-size:11px">Get Payment QR &rarr;</button>'+
    '</div>';
}
function _upiNext(total){
  var name=(document.getElementById('uName')||{}).value||'';
  var email=(document.getElementById('uEmail')||{}).value||'';
  var phone=(document.getElementById('uPhone')||{}).value||'';
  var addr=(document.getElementById('uAddr')||{}).value||'';
  if(!name.trim()||!email.trim()||!phone.trim()||!addr.trim()){alert('Please fill in all fields.');return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())){alert('Please enter a valid email address.');return;}
  _upiData={name:name.trim(),email:email.trim(),phone:phone.trim(),address:addr.trim()};
  var el=document.getElementById('upiModal');
  if(el)el.innerHTML=_upiStep2Html(total);
  _startUpiTimer(300);
}
function _upiStep2Html(total){
  return '<div style="background:#FAFAF7;max-width:420px;width:100%;padding:36px 28px;position:relative;font-family:DM Sans,sans-serif;text-align:center;box-sizing:border-box">'+
    '<button onclick="closeUpiModal()" style="position:absolute;top:14px;right:16px;background:none;border:none;font-size:22px;cursor:pointer;color:#aaa;line-height:1">&times;</button>'+
    '<p style="font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#C8A97E;margin:0 0 6px">UPI Payment · Step 2 of 2</p>'+
    '<h2 style="font-family:Cormorant Garamond,serif;font-size:24px;font-weight:500;margin:0 0 4px">Scan &amp; Pay</h2>'+
    '<p style="font-size:13px;color:#888;margin:0 0 16px">Pay <strong style="color:#1a1a1a">'+fmt(total)+'</strong> to complete your order</p>'+
    '<img src="/img/upi-qr.png" alt="UPI QR" style="width:200px;height:200px;border:1px solid #eee;display:block;margin:0 auto 10px">'+
    '<p style="font-size:11px;color:#aaa;margin:0 0 14px">9560397569@ptaxis · Govind Narayan Goel</p>'+
    '<a href="/img/upi-qr.png" download="athenabiolabs-upi-qr.png" style="display:inline-block;border:1px solid #1a1a1a;padding:9px 22px;font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#1a1a1a;text-decoration:none;margin-bottom:20px">↓ Download QR</a>'+
    '<div style="background:#F0EDE7;padding:14px 18px;margin-bottom:16px">'+
    '<p style="font-size:10px;color:#aaa;margin:0 0 4px;letter-spacing:.1em;text-transform:uppercase">Time remaining to pay</p>'+
    '<div id="upiTimerDisplay" style="font-family:Cormorant Garamond,serif;font-size:38px;font-weight:600;color:#1a1a1a;letter-spacing:.04em">5:00</div>'+
    '</div>'+
    '<div id="utrSection" style="display:none;text-align:left">'+
    '<p style="font-size:12px;color:#555;margin:0 0 8px;line-height:1.6">Enter the <strong>UTR / reference number</strong> shown in your UPI app after payment</p>'+
    '<input id="utrInput" placeholder="e.g. 504321987654 *" style="width:100%;padding:11px 14px;border:1px solid #ddd;background:#fff;font-family:DM Sans,sans-serif;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:10px">'+
    '<button id="upiPayBtn" onclick="_submitUpiPayment('+total+')" class="b b1" style="width:100%;padding:16px;font-size:11px">I've Paid — Confirm Order</button>'+
    '</div>'+
    '<p id="upiWaitMsg" style="font-size:11px;color:#bbb;margin-top:10px;line-height:1.6">Pay using the QR above, then wait for the timer</p>'+
    '</div>';
}
function _startUpiTimer(secs){
  clearInterval(_upiTimer);
  var rem=secs;
  function tick(){
    var el=document.getElementById('upiTimerDisplay');
    if(!el){clearInterval(_upiTimer);return;}
    var m=Math.floor(rem/60),s=rem%60;
    el.textContent=m+':'+(s<10?'0':'')+s;
    if(rem<=0){
      clearInterval(_upiTimer);
      el.textContent='0:00';el.style.color='#7a9a6d';
      var utr=document.getElementById('utrSection');
      var msg=document.getElementById('upiWaitMsg');
      if(utr)utr.style.display='block';
      if(msg)msg.style.display='none';
      return;
    }
    rem--;
  }
  tick();
  _upiTimer=setInterval(tick,1000);
}
function _submitUpiPayment(total){
  var utr=(document.getElementById('utrInput')||{}).value||'';
  if(!utr.trim()){alert('Please enter your UTR / reference number from your UPI app.');return;}
  if(!_upiData){alert('Session expired. Please start again.');closeUpiModal();return;}
  var btn=document.getElementById('upiPayBtn');
  if(btn){btn.disabled=true;btn.textContent='Submitting…';}
  var payload={
    email:_upiData.email,name:_upiData.name,
    address:_upiData.phone+'\n'+_upiData.address,
    utr:utr.trim(),
    items:cart.map(function(c){return{n:c.n,ds:c.ds,sp:c.sp,pr:c.pr,q:c.q};}),
    total:total,coupon:coupon||null,ebook:includeEbook
  };
  fetch('/api/send-order-email',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
    .then(function(r){return r.json();})
    .then(function(d){
      if(d.error){
        if(btn){btn.disabled=false;btn.textContent="I've Paid — Confirm Order";}
        alert('Error: '+d.error);
      } else {
        if(coupon==='FIRST5'){usedFirst=true;SUPA.from('coupon_usage').insert({visitor_id:VID,code:'FIRST5'}).then(function(){});}
        trackEvent('Purchase',{value:total,currency:'INR',transaction_id:'upi_'+d.orderId});
        closeUpiModal();
        alert('Order received! Check '+_upiData.email+' for your confirmation email. We’ll verify your UTR and dispatch within 24h.');
        cart=[];saveCart();uB();rC();closeCart();
      }
    })
    .catch(function(){
      if(btn){btn.disabled=false;btn.textContent="I've Paid — Confirm Order";}
      alert('Network error. Please email support@athenabiolabs.com with your order details.');
    });
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
// Called on individual product pages with the product ID
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
  h+='<div class="pdp-breadcrumb"><a href="/">Home</a><span>\u203a</span><a href="/catalogue">All Peptides</a><span>\u203a</span><a href="/catalogue?cat='+catUrl+'">'+p.c+'</a><span>\u203a</span><span>'+p.n+'</span></div>';

  // Two-column hero
  h+='<div class="pdp-hero">';

  // Left: sticky image column
  h+='<div class="pdp-hero-img-col"><div class="pdp-img-wrap">';
  h+='<img src="/img/'+(IMG[p.n]||'placeholder.png')+'" alt="'+p.n+'" class="pdp-hero-img" onerror="this.style.display=\'none\';this.parentNode.innerHTML+=\'<div style=display:flex;align-items:center;justify-content:center;height:100%;padding:40px><span style=font-family:Cormorant+Garamond,serif;font-size:72px;font-weight:300;color:#C8A97E>'+mono(p.n)+'</span></div>\'">';
  h+='</div></div>';

  // Right: purchase info column
  h+='<div class="pdp-hero-info-col">';

  // Eyebrow
  h+='<div class="pdp-eyebrow"><span>'+p.c+'</span><span class="pdp-ey-sep">\u00b7</span><span>'+info.mw+'</span></div>';

  // Title + gold period
  h+='<div class="pdp-title-row"><h1 class="pdp-h1">'+p.n+'<span class="pdp-period-gold">.</span></h1></div>';

  // Italic tagline
  if(info.tagline)h+='<p class="pdp-tagline">'+info.tagline+'</p>';

  // Trust strip
  if(p.n!=='BAC Water'){
    h+='<div class="pdp-trust-strip">';
    h+='<div class="pdp-trust-item"><div class="pdp-trust-val">99%+</div><div class="pdp-trust-lbl">HPLC Purity</div></div>';
    h+='<div class="pdp-trust-div"></div>';
    h+='<div class="pdp-trust-item"><div class="pdp-trust-val">ISO</div><div class="pdp-trust-lbl">3rd Party Lab</div></div>';
    h+='<div class="pdp-trust-div"></div>';
    h+='<div class="pdp-trust-item"><div class="pdp-trust-val">COA</div><div class="pdp-trust-lbl">Every Batch</div></div>';
    h+='</div>';
  }

  // Hairline
  h+='<div class="pdp-hairline"></div>';

  // Variant tiles
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

  // Price block
  h+='<div class="pdp-pricebox"><span class="pdp-price-big">'+fmt(v.pr)+'</span><span class="pdp-price-meta">per vial &middot; '+v.sp+'</span></div>';

  // Add to cart / stepper / OOS
  h+='<div class="pdp-atc-row">';
  if(p.oos){
    h+='<a href="https://wa.me/919560397569?text='+encodeURIComponent('Hi, notify me when '+p.n+' is back in stock.')+'" target="_blank" rel="noopener" class="b b3 pdp-oos">Out of Stock \u2014 Notify via WhatsApp</a>';
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

  // Ship strip
  h+='<div class="pdp-ship-strip">';
  h+='<div class="pdp-ship-cell"><span class="pdp-ship-icon">\u25ca</span><span class="pdp-ship-text"><span class="pdp-ship-v">Cold-chain</span><span class="pdp-ship-l">2\u20134 days</span></span></div>';
  h+='<div class="pdp-ship-cell"><span class="pdp-ship-icon">\u25ca</span><span class="pdp-ship-text"><span class="pdp-ship-v">COA</span><span class="pdp-ship-l">with every vial</span></span></div>';
  h+='<div class="pdp-ship-cell"><span class="pdp-ship-icon">\u25ca</span><span class="pdp-ship-text"><span class="pdp-ship-v">Free</span><span class="pdp-ship-l">shipping</span></span></div>';
  h+='</div>';

  h+='</div></div>'; // close info-col and hero

  // Mechanism section
  h+='<div class="pdp-about-grid">';
  h+='<div class="pdp-about-left"><span class="pdp-sect-eyebrow">Mechanism</span><h2 class="pdp-about-h2">How it<br><em>works.</em></h2></div>';
  h+='<div class="pdp-about-right"><p class="pdp-mechanism-body">'+info.desc+'</p>';
  if(info.seq&&info.seq!=='N/A'){
    h+='<div class="pdp-seq-block"><div class="pdp-seq-label">Sequence / Structure</div><div class="pdp-seq-val">'+info.seq+'</div></div>';
  }
  h+='</div></div>';

  // Tabs
  h+='<div class="pdp-tabs">';
  h+='<div class="pdp-tabs-nav"><button id="tab1" class="tab-btn active" onclick="showTab(1)">Description</button><button id="tab2" class="tab-btn" onclick="showTab(2)">Details</button><button id="tab3" class="tab-btn" onclick="showTab(3)">Dosage</button></div>';
  h+='<div id="tabC1" class="tab-content"><p class="pdp-desc">'+info.desc+'</p></div>';
  h+='<div id="tabC2" class="tab-content" style="display:none"><table class="pdp-table">';
  h+='<tr><td class="td-lbl">Category</td><td class="td-val">'+info.cat+'</td></tr>';
  h+='<tr><td class="td-lbl">Molecular Weight</td><td class="td-val">'+info.mw+'</td></tr>';
  h+='<tr><td class="td-lbl">Sequence</td><td class="td-val" style="word-break:break-all;font-size:12px">'+info.seq+'</td></tr>';
  if(p.n!=='BAC Water'){h+='<tr><td class="td-lbl">Purity</td><td class="td-val">&ge;99% (HPLC verified)</td></tr><tr><td class="td-lbl">Form</td><td class="td-val">White lyophilized powder</td></tr>';}
  h+='<tr><td class="td-lbl">Storage</td><td class="td-val">'+(p.n==='BAC Water'?'2\u20138\u00b0C':'\u221220\u00b0C (lyophilized) / 2\u20138\u00b0C (reconstituted)')+'</td></tr>';
  h+='</table></div>';
  h+='<div id="tabC3" class="tab-content" style="display:none"><div class="pdp-dosage-box"><div class="pdp-dosage-lbl">Research Reference</div><div class="pdp-dosage-val">'+info.dose+'</div></div>';
  h+='<p style="font-size:10px;color:#b5b0a6;font-style:italic;margin-top:12px;line-height:1.6">For in-vitro research reference only. Not medical advice.</p></div>';
  h+='</div>';

  // Research citations (dark)
  if(info.citations&&info.citations.length){
    h+='<div class="pdp-research"><div class="pdp-research-left">';
    h+='<span class="pdp-sect-eyebrow pdp-sect-eyebrow-gold">Literature</span>';
    h+='<h2 class="pdp-research-h2">Research<br><em class="pdp-research-em">citations.</em></h2>';
    h+='<p class="pdp-research-intro">Published peer-reviewed studies from which dosage and mechanism data is derived.</p>';
    h+='</div><div class="pdp-research-right">';
    for(var c=0;c<info.citations.length;c++){
      var cit=info.citations[c];
      h+='<div class="pdp-cit-row"><div class="pdp-cit-year">'+cit.year+'</div>';
      h+='<div class="pdp-cit-body"><div class="pdp-cit-title">'+cit.title+'</div><div class="pdp-cit-journal">'+cit.journal+'</div>';
      h+='<a href="'+cit.url+'" target="_blank" rel="noopener" class="pdp-cit-link">View paper \u2192</a></div></div>';
    }
    h+='</div></div>';
  }

  // Reviews
  h+='<div class="pdp-reviews-section"><div class="pdp-reviews-header">';
  h+='<div class="pdp-rating-block"><div class="pdp-rating-num">4.9</div><div class="pdp-stars">\u2605\u2605\u2605\u2605\u2605</div><div class="pdp-rating-count">Based on 47 reviews</div></div>';
  h+='<h2 class="pdp-reviews-h2">What researchers<br><em>say.</em></h2>';
  h+='</div><div class="pdp-reviews-grid">';
  h+='<div class="pdp-review-card"><div class="pdp-review-stars">\u2605\u2605\u2605\u2605\u2605</div><p class="pdp-review-q">\u201cPurity exceeded spec. Chromatogram matches exactly what they publish on the site. Will order again.\u201d</p><div class="pdp-review-footer"><span class="pdp-review-name">Dr. A. Sharma</span><span class="pdp-review-loc">Bangalore</span></div></div>';
  h+='<div class="pdp-review-card"><div class="pdp-review-stars">\u2605\u2605\u2605\u2605\u2605</div><p class="pdp-review-q">\u201cFastest dispatch I\u2019ve experienced in India. Cold-pack still ice-cold on arrival. COA exactly as described.\u201d</p><div class="pdp-review-footer"><span class="pdp-review-name">R. Nair</span><span class="pdp-review-loc">Kochi</span></div></div>';
  h+='<div class="pdp-review-card"><div class="pdp-review-stars">\u2605\u2605\u2605\u2605\u2605</div><p class="pdp-review-q">\u201cUsed the reconstitution calculator to plan my protocol. Well-documented, excellent research team.\u201d</p><div class="pdp-review-footer"><span class="pdp-review-name">M. Patel</span><span class="pdp-review-loc">Mumbai</span></div></div>';
  h+='</div></div>';

  // FAQ accordion
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

  // Consultation card
  h+='<div class="consult-card" style="margin:32px 0"><div class="consult-icon">&#128172;</div><div class="consult-info"><div class="consult-title">Book a Research Consultation</div><div class="consult-sub">15 min &middot; &#8377;1000 &middot; 1-on-1 with our team</div></div><a href="https://topmate.io/athenabiolabs/" target="_blank" rel="noopener" class="consult-btn">Book Now</a></div>';

  // Disclaimer
  h+='<div class="pdp-disclaimer"><p>All products are for in-vitro research use only. Not for human or animal consumption. Not intended to diagnose, treat, cure, or prevent any disease.</p></div>';

  var wrap=document.getElementById("pdpContent");
  if(wrap){
    var scrollY=window.scrollY||window.pageYOffset;
    wrap.style.minHeight=wrap.offsetHeight+'px';
    wrap.innerHTML=h;
    window.scrollTo(0,scrollY);
    requestAnimationFrame(function(){
      wrap.style.minHeight='';
      // Move calc + chrom sections before the related-products section (they render below footer by default)
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
  // If fewer than 3 from same category, fill with other products
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
    h+='<div style="background:linear-gradient(180deg,#f8f7f4,#f0ede7);overflow:hidden;height:180px;display:flex;align-items:center;justify-content:center">';
    h+='<img src="/img/'+(IMG[p.n]||'placeholder.png')+'" alt="'+p.n+'" style="width:100%;height:180px;object-fit:cover;object-position:center top" onerror="this.outerHTML=\'<span style=font-family:Cormorant+Garamond,serif;font-size:44px;color:#C8A97E>'+mono(p.n)+'</span>\'">';
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
function declineCookies(){setCookie('cookie_consent','declined',30);var b=document.getElementById('cookieBanner');if(b)b.style.display='none';window['ga-disable-G-XXXXXXXXXX']=true;}
