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
{id:3,n:"Retatrutide",c:"Weight Loss",v:[{sp:"10mg per vial",ds:"10mg",pr:2899},{sp:"20mg per vial",ds:"20mg",pr:4500}]},
{id:4,n:"BPC-157",c:"Healing & Recovery",oos:true,v:[{sp:"10mg per vial",ds:"10mg",pr:1990}]},
{id:5,n:"TB-500",c:"Healing & Recovery",oos:true,v:[{sp:"10mg per vial",ds:"10mg",pr:3400}]},
{id:6,n:"BPC+TB Combo",c:"Healing & Recovery",oos:true,v:[{sp:"BPC-157 5mg + TB-500 5mg",ds:"10mg",pr:3200}]},
{id:8,n:"GHK-Cu",c:"Skin & Anti-Aging",v:[{sp:"50mg per vial",ds:"50mg",pr:1500}]},
{id:11,n:"CJC-1295 (no DAC)",c:"GH",oos:true,v:[{sp:"5mg per vial",ds:"5mg",pr:2800}]},
{id:12,n:"CJC+IPA Combo",c:"GH",oos:true,v:[{sp:"CJC-1295 5mg + Ipamorelin 5mg",ds:"10mg",pr:3750}]},
{id:13,n:"KLOW Blend",c:"Healing & Recovery",oos:true,v:[{sp:"BPC-157 10mg + TB-500 10mg + KPV 10mg + GHK-Cu 50mg",ds:"80mg",pr:3990}]},
{id:14,n:"BAC Water",c:"Supplies",v:[{sp:"10ml per vial",ds:"10ml",pr:799}]}
];

var PI={
"Tirzepatide":{desc:"First-in-class dual GIP/GLP-1 receptor agonist. The dual mechanism produces synergistic metabolic effects exceeding mono-agonists, with significant research interest in glycemic control, weight management, and lipid profiles.",dose:"2.5 - 15mg weekly, subcutaneous",mw:"4813.45 g/mol",seq:"GIP/GLP-1 dual agonist (39 AA)",cat:"Metabolic"},
"Retatrutide":{desc:"Novel triple agonist targeting GLP-1, GIP, and glucagon receptors simultaneously. The glucagon component adds thermogenic and lipolytic effects, representing a potential advancement over dual agonists.",dose:"1 - 12mg weekly, subcutaneous",mw:"~4400 g/mol",seq:"Triple agonist (39 AA)",cat:"Weight Loss"},
"BPC-157":{desc:"A 15-amino-acid peptide derived from human gastric juice. Extensively studied for accelerated healing of tendons, ligaments, muscle, and bone. Promotes angiogenesis and modulates nitric oxide pathways.",dose:"200 - 500mcg 1-2x daily, subcutaneous",mw:"1419.53 g/mol",seq:"Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",cat:"Healing & Recovery"},
"TB-500":{desc:"A 43-amino-acid peptide central to tissue repair and regeneration. Sequesters actin monomers, promotes cell migration, and has demonstrated effects on cardiac tissue repair and inflammation reduction.",dose:"2 - 5mg 2x weekly (loading), subcutaneous",mw:"4963.50 g/mol",seq:"Thymosin Beta-4 (43 AA)",cat:"Healing & Recovery"},
"BPC+TB Combo":{desc:"Pre-blended stack of BPC-157 and TB-500. Combines BPC-157's site-specific healing with TB-500's systemic actin-sequestering and anti-inflammatory effects for comprehensive tissue regeneration research.",dose:"Per protocol, subcutaneous",mw:"Blend",seq:"BPC-157 + TB-500",cat:"Healing & Recovery"},
"GHK-Cu":{desc:"A naturally occurring tripeptide-copper complex. Over 4,000 genes modulated by GHK-Cu have been identified, with effects including collagen synthesis, antioxidant enzyme upregulation, and dermal fibroblast promotion.",dose:"1 - 2mg daily, subcutaneous",mw:"340.38 g/mol",seq:"Gly-His-Lys:Cu(2+)",cat:"Skin & Anti-Aging"},
"CJC-1295 (no DAC)":{desc:"Synthetic GHRH analog with ~30 min half-life producing acute GH pulses mimicking natural physiology. Commonly paired with GHRP peptides for synergistic pulsatile GH release.",dose:"100 - 200mcg 1-3x daily, subcutaneous",mw:"3367.97 g/mol",seq:"GHRH analog (29 AA, mod.)",cat:"GH"},
"CJC+IPA Combo":{desc:"Pre-blended combination of CJC-1295 (no DAC) and Ipamorelin. Synergistic GH release through simultaneous GHRH and ghrelin receptor activation, producing amplified pulsatile GH output.",dose:"100 - 300mcg combined, 1-3x daily, subcutaneous",mw:"Blend",seq:"CJC-1295 + Ipamorelin",cat:"GH"},
"KLOW Blend":{desc:"Advanced recovery and skin blend combining TB-500, BPC-157, GHK-Cu, and KPV. Pairs systemic tissue repair with localised healing, anti-inflammatory action via KPV, and copper-peptide skin regeneration for a comprehensive research protocol.",dose:"Per component protocol, subcutaneous",mw:"Blend",seq:"TB-500 + BPC-157 + GHK-Cu + KPV",cat:"Healing & Recovery"},
"BAC Water":{desc:"Bacteriostatic water (0.9% benzyl alcohol) in a sterile 10ml vial. The standard reconstitution medium for research peptides — preservative allows multi-draw use over 28 days without contamination risk.",dose:"N/A - reconstitution supply",mw:"N/A",seq:"N/A",cat:"Supplies"}
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
  h+='<button class="b b1" style="width:100%;margin-top:16px;padding:18px 40px;font-size:13px;position:relative" onclick="payNow('+total+')"><span style="position:absolute;left:16px;top:50%;transform:translateY(-50%)">&#128274;</span> Pay Now &middot; '+fmt(total)+'</button>';
  h+='<div style="display:flex;gap:8px;margin-top:8px">';
  h+='<button class="b b2" style="flex:1;padding:12px 16px;font-size:9px" onclick="showBankDetails()">Bank / UPI Transfer</button>';
  h+='<a href="mailto:support@athenabiolabs.com?subject=AthenaBioLabs%20Order" class="b b2" style="flex:1;padding:12px 16px;font-size:9px">Email Order</a>';
  h+='</div>';
  h+='<div id="bankInfo" style="display:none;background:#F0EDE7;padding:18px;margin-top:10px;font-size:12px;line-height:2">';
  h+='<p style="font-weight:600;letter-spacing:.12em;font-size:9px;text-transform:uppercase;color:#b5b0a6;margin-bottom:8px">Bank Transfer / UPI Details</p>';
  h+='<p><b>UPI ID:</b> YOUR_UPI_ID@bank</p>';
  h+='<p><b>Account Name:</b> AthenaBioLabs</p>';
  h+='<p><b>Account No:</b> YOUR_ACCOUNT_NUMBER</p>';
  h+='<p><b>IFSC:</b> YOUR_IFSC_CODE</p>';
  h+='<p style="margin-top:6px;font-size:10px;color:#8a8580;line-height:1.6">After transferring, email your UTR / reference number to <b>support@athenabiolabs.com</b> with your shipping address.</p>';
  h+='<button onclick="confirmBankTransfer('+total+')" class="b b3" style="width:100%;margin-top:12px;padding:12px;font-size:9px">I\'ve Transferred &mdash; Confirm Order</button>';
  h+='</div>';
  h+='<div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:12px;padding-bottom:20px"><span style="font-size:9px;color:#b5b0a6">Secured by</span><span style="font-size:10px;font-weight:700;color:#2B84EA">Razorpay</span><span style="font-size:9px;color:#b5b0a6">&middot; UPI &middot; Cards &middot; Netbanking &middot; Bank Transfer</span></div>';
  h+='</div>';
  bd.innerHTML=h;
}

// =====================
// PAYMENT
// =====================
function payNow(amount){
  var desc="";
  for(var i=0;i<cart.length;i++){var c=cart[i];desc+=c.n+" ("+c.ds+") x"+c.q+", ";}
  desc=desc.slice(0,-2);
  if(desc.length>200) desc=desc.substring(0,197)+"...";
  var options={
    key:"rzp_live_XXXXXXXXXXXXXXX",
    amount:amount*100,currency:"INR",name:"AthenaBioLabs",description:desc,image:"",
    handler:function(response){
      trackEvent('Purchase',{value:amount,currency:'INR',transaction_id:response.razorpay_payment_id});
      var items=cart.map(function(c){return c.n+' ('+c.ds+') x'+c.q;}).join(', ');
      SUPA.from('orders').insert({items:items,total:amount,coupon:coupon||null,payment_method:'razorpay',payment_id:response.razorpay_payment_id,status:'paid',ebook:includeEbook,visitor_id:VID}).then(function(){});
      if(coupon==='FIRST5'){usedFirst=true;SUPA.from('coupon_usage').insert({visitor_id:VID,code:'FIRST5'}).then(function(){});}
      alert("Payment confirmed!\n\nPayment ID: "+response.razorpay_payment_id+"\n\nYour order is confirmed. We'll dispatch within 24 hours.");
      cart=[];saveCart();uB();rC();closeCart();
    },
    prefill:{},theme:{color:"#C8A97E"},
    modal:{ondismiss:function(){trackEvent('PaymentDismissed',{value:amount,currency:'INR'});}}
  };
  try{
    var rzp=new Razorpay(options);
    rzp.on('payment.failed',function(){alert("Payment failed. Please use Bank / UPI Transfer.");trackEvent('PaymentFailed',{value:amount,currency:'INR'});});
    rzp.open();
    trackEvent('InitiateCheckout',{value:amount,currency:'INR',num_items:cart.length});
  }catch(e){alert("Payment gateway loading. Please use Bank / UPI Transfer or email support@athenabiolabs.com.");}
}
function showBankDetails(){
  var el=document.getElementById("bankInfo");
  if(el)el.style.display=el.style.display==='none'?'block':'none';
}
function confirmBankTransfer(amount){
  var items=cart.map(function(c){return c.n+' ('+c.ds+') x'+c.q;}).join(', ');
  var btn=event.target;btn.disabled=true;btn.textContent='Saving\u2026';
  SUPA.from('orders').insert({items:items,total:amount,coupon:coupon||null,payment_method:'bank_transfer',status:'pending_verification',ebook:includeEbook,visitor_id:VID}).then(function(r){
    btn.disabled=false;btn.textContent="I've Transferred \u2014 Confirm Order";
    if(r.error){alert("Please email support@athenabiolabs.com with your UTR number.");}
    else{
      if(coupon==='FIRST5'){usedFirst=true;SUPA.from('coupon_usage').insert({visitor_id:VID,code:'FIRST5'}).then(function(){});}
      alert("Order logged! Please email your UTR to support@athenabiolabs.com with your shipping address. Dispatch within 24h.");
      cart=[];saveCart();uB();rC();closeCart();
    }
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
  var info=PI[p.n]||{desc:"Premium research-grade compound. HPLC verified.",dose:"Refer to published literature",mw:"See COA",seq:"See COA",cat:p.c};
  var sel=selV[p.id]||0;
  var v=p.v[sel];
  trackEvent('ViewContent',{content_name:p.n,content_category:p.c,value:v.pr,currency:'INR'});

  var catUrl=encodeURIComponent(p.c);
  var h='<div class="pdp-breadcrumb">';
  h+='<a href="/">Home</a> <span>&rsaquo;</span> ';
  h+='<a href="/catalogue">All Peptides</a> <span>&rsaquo;</span> ';
  h+='<a href="/catalogue?cat='+catUrl+'">'+p.c+'</a> <span>&rsaquo;</span> ';
  h+='<span>'+p.n+'</span>';
  h+='</div>';

  h+='<div class="pdp-top">';
  h+='<div class="pdp-img">';
  h+='<img src="/img/'+(IMG[p.n]||'placeholder.png')+'" alt="'+p.n+'" style="width:100%;height:380px;object-fit:cover;object-position:center top;" onerror="this.style.display=\'none\';this.parentNode.innerHTML+=\'<div style=padding:60px;text-align:center><span style=font-family:Cormorant+Garamond,serif;font-size:56px;color:#C8A97E>'+mono(p.n)+'</span></div>\'">';
  h+='</div>';
  h+='<div class="pdp-info">';
  h+='<h1>'+p.n+'</h1>';
  h+='<div class="pdp-cat">'+info.cat+(p.n!=='BAC Water'?' &middot; 99%+ HPLC Purity':'')+'</div>';
  h+='<div style="margin-bottom:8px"><span class="pp" style="font-size:36px">'+fmt(v.pr)+'</span><span style="font-size:11px;color:#b5b0a6;margin-left:8px">per vial</span></div>';
  h+='<div style="font-size:12px;color:#8a8580;margin-bottom:20px;letter-spacing:.02em">'+v.sp+'</div>';
  // variant selector
  if(p.v.length>1){
    h+='<div style="margin-bottom:20px"><div style="font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#b5b0a6;margin-bottom:8px">Strength</div><div class="vr" style="margin:0">';
    for(var k=0;k<p.v.length;k++){
      h+='<button class="vb'+(k===sel?" on":"")+'" style="padding:8px 18px;font-size:11px" onclick="selV['+p.id+']='+k+';renderProductPage('+p.id+')">'+p.v[k].ds+'</button>';
    }
    h+='</div></div>';
  }
  // add to cart
  if(p.oos){
    h+='<a href="https://wa.me/919560397569?text='+encodeURIComponent('Hi, I want to be notified when '+p.n+' is back in stock.')+'" target="_blank" rel="noopener" style="display:block;width:100%;margin-bottom:20px;text-decoration:none"><button style="width:100%;padding:18px 40px;font-size:13px;background:#25D366;color:#fff;border:none;border-radius:6px;cursor:pointer;letter-spacing:.08em;font-weight:600;text-transform:uppercase">Out of Stock — Notify Me via WhatsApp</button></a>';
    h+='<p style="font-size:12px;color:#8a8580;margin-bottom:20px">This product is temporarily unavailable. Tap above and we\'ll message you the moment it\'s back.</p>';
  } else {
    var cQty=getCartQty(p.id,sel);
    if(cQty>0){
      h+='<div style="display:flex;align-items:center;gap:16px;margin-bottom:20px"><div class="acb" style="height:48px"><div class="acb-qty" style="height:100%"><button style="width:40px;font-size:16px" onclick="aC2('+p.id+','+sel+',-1);">&minus;</button><span style="min-width:36px;font-size:15px">'+cQty+'</span><button style="width:40px;font-size:16px" onclick="aC2('+p.id+','+sel+',1);">+</button></div></div><span style="font-size:12px;color:#7a9a6d;font-weight:600">In your cart</span></div>';
    } else {
      h+='<button class="b b1" style="width:100%;margin-bottom:20px;padding:18px 40px;font-size:13px" onclick="aC('+p.id+');">Add to Cart</button>';
    }
  }
  // trust badges
  h+='<div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:20px">';
  if(p.n!=='BAC Water')h+='<div style="font-size:10px;color:#8a8580;display:flex;align-items:center;gap:4px"><span style="color:#7a9a6d">&#10003;</span> 99%+ Purity</div>';
  h+='<div style="font-size:10px;color:#8a8580;display:flex;align-items:center;gap:4px"><span style="color:#7a9a6d">&#10003;</span> Third-Party Tested</div>';
  h+='<div style="font-size:10px;color:#8a8580;display:flex;align-items:center;gap:4px"><span style="color:#7a9a6d">&#10003;</span> Free Shipping</div>';
  h+='</div>';
  // consultation card
  h+='<div class="consult-card"><div class="consult-icon">&#128172;</div><div class="consult-info"><div class="consult-title">Book a Research Consultation</div><div class="consult-sub">15 min &middot; &#8377;1000 &middot; 1-on-1 with our team</div></div><a href="https://topmate.io/athenabiolabs/" target="_blank" rel="noopener" class="consult-btn">Book Now</a></div>';
  h+='</div></div>';

  // TABS
  h+='<div class="pdp-tabs">';
  h+='<div class="pdp-tabs-nav">';
  h+='<button id="tab1" class="tab-btn active" onclick="showTab(1)">Description</button>';
  h+='<button id="tab2" class="tab-btn" onclick="showTab(2)">Details</button>';
  h+='<button id="tab3" class="tab-btn" onclick="showTab(3)">Dosage</button>';
  h+='</div>';
  h+='<div id="tabC1" class="tab-content"><p style="font-size:14px;line-height:1.9;color:#6b6560;font-weight:300">'+info.desc+'</p></div>';
  h+='<div id="tabC2" class="tab-content" style="display:none">';
  h+='<table style="width:100%;border-collapse:collapse">';
  h+='<tr style="border-bottom:1px solid #e8e4de"><td class="td-lbl">Category</td><td class="td-val">'+info.cat+'</td></tr>';
  h+='<tr style="border-bottom:1px solid #e8e4de"><td class="td-lbl">Molecular Weight</td><td class="td-val">'+info.mw+'</td></tr>';
  h+='<tr style="border-bottom:1px solid #e8e4de"><td class="td-lbl">Sequence</td><td class="td-val" style="word-break:break-all;font-size:12px">'+info.seq+'</td></tr>';
  if(p.n!=='BAC Water'){h+='<tr style="border-bottom:1px solid #e8e4de"><td class="td-lbl">Purity</td><td class="td-val">&ge;99% (HPLC verified)</td></tr>';h+='<tr style="border-bottom:1px solid #e8e4de"><td class="td-lbl">Form</td><td class="td-val">White lyophilized powder</td></tr>';}
  h+='<tr><td class="td-lbl">Storage</td><td class="td-val">'+(p.n==='BAC Water'?'2-8&deg;C':'-20&deg;C (lyophilized) / 2-8&deg;C (reconstituted)')+'</td></tr>';
  h+='</table></div>';
  h+='<div id="tabC3" class="tab-content" style="display:none">';
  h+='<div style="background:#F7F5F2;padding:16px 20px;margin-bottom:12px"><p style="font-size:13px;line-height:1.8;color:#6b6560"><strong style="color:#1a1a1a">Research Reference:</strong> '+info.dose+'</p></div>';
  h+='<p style="font-size:10px;color:#b5b0a6;font-style:italic;line-height:1.6">For in-vitro research reference only. Not medical advice.</p>';
  h+='</div></div>';

  // disclaimer
  h+='<div class="pdp-disclaimer"><p>All products are for in-vitro research use only. Not for human or animal consumption. Not intended to diagnose, treat, cure, or prevent any disease.</p></div>';

  var wrap=document.getElementById("pdpContent");
  if(wrap){wrap.innerHTML=h;initReveal();}

  // Related products
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

// Cookie consent
function getCookie(n){var v=document.cookie.match('(^|;)\\s*'+n+'=([^;]*)');return v?v[2]:null;}
function setCookie(n,v,d){var dt=new Date();dt.setTime(dt.getTime()+d*86400000);document.cookie=n+'='+v+';expires='+dt.toUTCString()+';path=/;SameSite=Lax';}
function acceptCookies(){setCookie('cookie_consent','accepted',365);var b=document.getElementById('cookieBanner');if(b)b.style.display='none';}
function declineCookies(){setCookie('cookie_consent','declined',30);var b=document.getElementById('cookieBanner');if(b)b.style.display='none';window['ga-disable-G-XXXXXXXXXX']=true;}
