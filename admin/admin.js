// admin/admin.js — shared admin client helpers
window.ADMIN = (function(){
  function fmtINR(n){return '₹'+Number(n||0).toLocaleString('en-IN');}
  function fmtDate(s){if(!s)return '—';var d=new Date(s);return d.toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'});}
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
  function statusPill(s){
    var color={'pending_verification':'#C8A97E','paid':'#7a9a6d','rejected':'#c44','shipped':'#4a8fbb'}[s]||'#888';
    var label={'pending_verification':'PENDING','paid':'PAID','rejected':'REJECTED','shipped':'SHIPPED'}[s]||s;
    return '<span style="display:inline-block;padding:3px 9px;font-size:9px;font-weight:600;letter-spacing:.14em;background:'+color+';color:#fff">'+esc(label)+'</span>';
  }
  function api(path,opts){
    return fetch(path,opts).then(function(r){
      if(r.status===401){location.href='/admin/login.html?next='+encodeURIComponent(location.pathname+location.search);throw new Error('UNAUTH');}
      return r.json().then(function(d){return{status:r.status,d:d};});
    });
  }
  function requireSession(then){
    api('/api/admin/me').then(function(res){
      if(res.status===200&&res.d.email){then(res.d.email);}
    }).catch(function(){});
  }
  function logout(){
    fetch('/api/admin/logout',{method:'POST'}).then(function(){location.href='/admin/login.html';});
  }
  return {fmtINR:fmtINR,fmtDate:fmtDate,esc:esc,statusPill:statusPill,api:api,requireSession:requireSession,logout:logout};
})();
