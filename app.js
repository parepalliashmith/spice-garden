/* ============================================================
   Spice Garden — restaurant app (browser-only, localStorage)
   ============================================================ */

/* ---------- storage ---------- */
const store = {
  get(key, fb){ try { return JSON.parse(localStorage.getItem(key)) ?? fb; } catch { return fb; } },
  set(key, v){ localStorage.setItem(key, JSON.stringify(v)); }
};

/* ---------- seed menu ---------- */
const DEFAULT_MENU = [
  { id:1, name:"Margherita Pizza", price:299, category:"Pizza",    emoji:"🍕", desc:"Classic tomato, mozzarella & basil.", veg:"veg",    tag:"Bestseller" },
  { id:2, name:"Paneer Tikka",     price:249, category:"Starters", emoji:"🧆", desc:"Spiced grilled cottage cheese.",     veg:"veg",    tag:"Chef's Special" },
  { id:3, name:"Veg Burger",       price:149, category:"Burgers",  emoji:"🍔", desc:"Crispy patty, lettuce & sauce.",     veg:"veg",    tag:"" },
  { id:4, name:"Butter Chicken",   price:329, category:"Mains",    emoji:"🍛", desc:"Creamy tomato chicken curry.",       veg:"nonveg", tag:"Bestseller" },
  { id:5, name:"Masala Dosa",      price:129, category:"Mains",    emoji:"🥞", desc:"Crispy dosa with potato filling.",   veg:"veg",    tag:"" },
  { id:6, name:"French Fries",     price:99,  category:"Starters", emoji:"🍟", desc:"Golden, salted & crispy.",           veg:"veg",    tag:"" },
  { id:7, name:"Chocolate Cake",   price:159, category:"Desserts", emoji:"🍰", desc:"Rich molten chocolate slice.",       veg:"veg",    tag:"" },
  { id:8, name:"Cold Coffee",      price:119, category:"Drinks",   emoji:"🥤", desc:"Chilled blended coffee.",            veg:"veg",    tag:"" },
];

/* customization options (shared by all dishes) */
const SIZES   = [ {name:"Regular", price:0}, {name:"Large", price:60} ];
const SPICES  = [ "Mild", "Medium", "Hot" ];
const ADDONS  = [ {name:"Extra cheese", price:40}, {name:"Extra sauce", price:20}, {name:"Add fries", price:60} ];

/* charges & promos */
const TAX_RATE = 0.05;
const DELIVERY_FEE = 40;
const PROMOS = {
  WELCOME10: { kind:"pct",  value:10, label:"10% off" },
  FLAT50:    { kind:"flat", value:50, min:200, label:"₹50 off" },
  FREESHIP:  { kind:"ship", value:0,  label:"Free delivery" },
};

let menu         = store.get("sg_menu", null) || (store.set("sg_menu", DEFAULT_MENU), DEFAULT_MENU);
let orders       = store.get("sg_orders", []);
let reservations = store.get("sg_res", []);
let myOrderIds   = store.get("sg_myorders", []);
let cart         = store.get("sg_cart", []);          // array of line items — survives refresh
let favs         = store.get("sg_favs", []);          // favourite item ids
let activeCat    = "All";
let searchTerm   = "";
let tip          = 0;
let promo        = null;                               // {code, ...PROMOS[code]}
let profile      = store.get("sg_profile", {});        // remembered name/phone/address

const $  = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const rupee = n => "₹" + Math.round(n).toLocaleString("en-IN");
const emojiFor = c => ({Pizza:"🍕",Starters:"🍟",Burgers:"🍔",Mains:"🍛",Desserts:"🍰",Drinks:"🥤"}[c] || "🍴");
const uid = () => Date.now() + "-" + Math.floor(performance.now()*1000 % 100000);

/* ============================================================
   LANGUAGE (English / Hindi)
   ============================================================ */
const I18N = {
  en:{
    "nav.menu":"Menu","nav.reserve":"Reserve","nav.orders":"My Orders","nav.admin":"Admin",
    "hero.title":"Welcome to Spice Garden","hero.sub":"Fresh, delicious food — order for takeaway or dine-in.",
    "search.ph":"Search dishes — e.g. pizza, paneer…",
    "orders.title":"My Orders","orders.sub":"Track the orders you placed from this device.",
    "reserve.title":"Book a Table","reserve.sub":"Reserve your spot and we'll have it ready.","reserve.btn":"Confirm Reservation",
    "admin.login":"Staff Login",
    "f.name":"Name","f.phone":"Phone","f.date":"Date","f.time":"Time","f.guests":"Party size",
    "f.requests":"Special requests","f.type":"Order type","f.address":"Delivery address","f.landmark":"Landmark","f.pay":"Payment",
    "cart.title":"Your Order","cart.view":"View Cart",
    "cz.size":"Size","cz.spice":"Spice level","cz.addons":"Add-ons","cz.note":"Special instructions",
    "promo.apply":"Apply","tip.label":"Tip the staff",
    "confirm.title":"Order Confirmed!","confirm.no":"Your order number is","confirm.eta":"Ready in about",
    "confirm.track":"Track my order","confirm.keep":"Keep browsing",
  },
  hi:{
    "nav.menu":"मेन्यू","nav.reserve":"बुकिंग","nav.orders":"मेरे ऑर्डर","nav.admin":"एडमिन",
    "hero.title":"स्पाइस गार्डन में स्वागत है","hero.sub":"ताज़ा, स्वादिष्ट खाना — टेकअवे या डाइन-इन ऑर्डर करें।",
    "search.ph":"व्यंजन खोजें — जैसे पिज़्ज़ा, पनीर…",
    "orders.title":"मेरे ऑर्डर","orders.sub":"इस डिवाइस से किए गए ऑर्डर ट्रैक करें।",
    "reserve.title":"टेबल बुक करें","reserve.sub":"अपनी जगह आरक्षित करें, हम तैयार रखेंगे।","reserve.btn":"बुकिंग पक्की करें",
    "admin.login":"स्टाफ़ लॉगिन",
    "f.name":"नाम","f.phone":"फ़ोन","f.date":"तारीख़","f.time":"समय","f.guests":"कितने लोग",
    "f.requests":"विशेष अनुरोध","f.type":"ऑर्डर प्रकार","f.address":"डिलीवरी पता","f.landmark":"लैंडमार्क","f.pay":"भुगतान",
    "cart.title":"आपका ऑर्डर","cart.view":"कार्ट देखें",
    "cz.size":"साइज़","cz.spice":"तीखापन","cz.addons":"एड-ऑन","cz.note":"विशेष निर्देश",
    "promo.apply":"लागू करें","tip.label":"स्टाफ़ को टिप दें",
    "confirm.title":"ऑर्डर कन्फर्म!","confirm.no":"आपका ऑर्डर नंबर है","confirm.eta":"लगभग तैयार",
    "confirm.track":"ऑर्डर ट्रैक करें","confirm.keep":"और देखें",
  }
};
let lang = store.get("sg_lang", "en");
function applyLang(){
  const dict = I18N[lang];
  $$("[data-i18n]").forEach(el=>{ const v = dict[el.dataset.i18n]; if(v!=null) el.textContent = v; });
  $$("[data-i18n-ph]").forEach(el=>{ const v = dict[el.dataset.i18nPh]; if(v!=null) el.placeholder = v; });
  $("#langBtn").textContent = lang === "en" ? "EN" : "हि";
  document.documentElement.lang = lang;
}
$("#langBtn").onclick = ()=>{ lang = lang === "en" ? "hi" : "en"; store.set("sg_lang", lang); applyLang(); };

/* ============================================================
   SEARCH (typo-tolerant)
   ============================================================ */
function levenshtein(a, b){
  const m=a.length, n=b.length; if(!m) return n; if(!n) return m;
  const dp = Array.from({length:n+1}, (_,i)=>i);
  for(let i=1;i<=m;i++){ let prev=dp[0]; dp[0]=i;
    for(let j=1;j<=n;j++){ const t=dp[j]; dp[j]=Math.min(dp[j]+1,dp[j-1]+1,prev+(a[i-1]===b[j-1]?0:1)); prev=t; } }
  return dp[n];
}
function fuzzyWord(term, word){
  if(word.includes(term)||term.includes(word)) return true;
  const tol = term.length>=7?2 : term.length>=4?1 : 0;
  return levenshtein(term, word) <= tol;
}
function searchMatches(m, q){
  if(!q) return true;
  const words = (m.name+" "+(m.desc||"")+" "+m.category).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  return q.split(/\s+/).filter(Boolean).every(term => words.some(w=>fuzzyWord(term,w)));
}
/* "did you mean" — closest dish name when nothing matched */
function suggestDish(q){
  let best=null, bestD=99;
  menu.forEach(m=> m.name.toLowerCase().split(/\s+/).forEach(w=>{
    const d=levenshtein(q,w); if(d<bestD){ bestD=d; best=m.name; }
  }));
  return (best && bestD<=2) ? best : null;
}

/* ============================================================
   NAVIGATION / THEME
   ============================================================ */
function showView(name){
  $$("[data-view]").forEach(b=>b.classList.toggle("active", b.dataset.view===name));
  $$(".view").forEach(v=>v.classList.remove("active"));
  $("#view-"+name).classList.add("active");
  window.scrollTo(0,0);
  if(name==="orders") renderMyOrders();
  updateStickyCart();
}
$$("[data-view]").forEach(btn=> btn.onclick = ()=> showView(btn.dataset.view));

function applyTheme(){
  const dark = store.get("sg_theme","light")==="dark";
  document.body.classList.toggle("dark", dark);
  $("#themeBtn").textContent = dark ? "☀️" : "🌙";
}
$("#themeBtn").onclick = ()=>{ store.set("sg_theme", document.body.classList.contains("dark")?"light":"dark"); applyTheme(); };

$("#searchInput").oninput = e=>{ searchTerm = e.target.value.trim().toLowerCase(); renderMenu(); };

/* ============================================================
   MENU
   ============================================================ */
function renderCategories(){
  const cats = ["All","❤️", ...new Set(menu.map(m=>m.category))];
  const bar = $("#categoryBar"); bar.innerHTML="";
  cats.forEach(c=>{
    const chip = document.createElement("button");
    chip.className = "cat-chip" + (c===activeCat?" active":"");
    chip.textContent = c==="❤️" ? "❤️ Favourites" : c;
    chip.onclick = ()=>{ activeCat=c; renderCategories(); renderMenu(); };
    bar.appendChild(chip);
  });
}

function renderMenu(){
  const grid = $("#menuGrid"); grid.innerHTML="";
  const hint = $("#searchHint"); hint.textContent="";
  let items = menu.filter(m=>{
    const catOk = activeCat==="All" ? true : activeCat==="❤️" ? favs.includes(m.id) : m.category===activeCat;
    return catOk && searchMatches(m, searchTerm);
  });
  if(!items.length){
    grid.innerHTML = `<p class="empty">No dishes found${searchTerm?` for “${searchTerm}”`:""}.</p>`;
    if(searchTerm){ const s = suggestDish(searchTerm);
      if(s){ hint.innerHTML = `Did you mean <button class="link-btn" id="dymBtn">${s}</button>?`;
        $("#dymBtn").onclick = ()=>{ $("#searchInput").value=s; searchTerm=s.toLowerCase(); renderMenu(); }; } }
    return;
  }
  items.forEach(m=>{
    const card = document.createElement("div"); card.className="dish";
    const veg = m.veg ? `<span class="veg-dot ${m.veg}" title="${m.veg==="veg"?"Veg":"Non-veg"}"></span>` : "";
    const tag = m.tag ? `<span class="tag-chip ${m.tag.replace(/[^a-zA-Z]/g,'')}">${m.tag}</span>` : "";
    const inCart = cart.filter(l=>l.itemId===m.id).reduce((s,l)=>s+l.qty,0);
    const fav = favs.includes(m.id);
    const media = m.photo ? `<img class="dish-photo" src="${m.photo}" alt="${m.name}"/>` : `<div class="emoji">${m.emoji||emojiFor(m.category)}</div>`;
    card.innerHTML = `
      <button class="fav-btn ${fav?'on':''}" title="Favourite">${fav?'❤️':'🤍'}</button>
      ${media}
      <div class="dish-head">${veg}<h3>${m.name}</h3></div>
      ${tag}
      <p class="desc">${m.desc||""}</p>
      <div class="bottom">
        <span class="price">${rupee(m.price)}</span>
        <button class="btn primary small add">${inCart?`Add more · ${inCart}`:"Add +"}</button>
      </div>`;
    card.querySelector(".add").onclick = ()=> openCustomize(m);
    card.querySelector(".fav-btn").onclick = ()=> toggleFav(m.id);
    grid.appendChild(card);
  });
}

function toggleFav(id){
  if(favs.includes(id)) favs = favs.filter(x=>x!==id); else favs.push(id);
  store.set("sg_favs", favs);
  renderMenu();
}

/* ============================================================
   CUSTOMIZE MODAL
   ============================================================ */
let czItem=null, czQty=1, czSize=0, czSpice=1, czAddons=[];
function openCustomize(m){
  czItem=m; czQty=1; czSize=0; czSpice=1; czAddons=[];
  $("#cz-name").textContent = m.name;
  $("#cz-desc").textContent = m.desc||"";
  $("#cz-sizes").innerHTML  = SIZES.map((s,i)=>`<button class="cz-opt ${i===0?'on':''}" data-i="${i}">${s.name}${s.price?` +${rupee(s.price)}`:""}</button>`).join("");
  $("#cz-spice").innerHTML  = SPICES.map((s,i)=>`<button class="cz-opt ${i===1?'on':''}" data-i="${i}">${s}</button>`).join("");
  $("#cz-addons").innerHTML = ADDONS.map((a,i)=>`<button class="cz-opt" data-i="${i}">${a.name} +${rupee(a.price)}</button>`).join("");
  $("#cz-note").value = "";
  $("#cz-qty").textContent = "1";
  $$("#cz-sizes .cz-opt").forEach(b=> b.onclick=()=>{ czSize=+b.dataset.i; sel("#cz-sizes",b); czPrice(); });
  $$("#cz-spice .cz-opt").forEach(b=> b.onclick=()=>{ czSpice=+b.dataset.i; sel("#cz-spice",b); });
  $$("#cz-addons .cz-opt").forEach(b=> b.onclick=()=>{ const i=+b.dataset.i;
    if(czAddons.includes(i)){ czAddons=czAddons.filter(x=>x!==i); b.classList.remove("on"); }
    else { czAddons.push(i); b.classList.add("on"); } czPrice(); });
  czPrice();
  $("#customizeOverlay").classList.add("show");
}
function sel(group, btn){ $$(group+" .cz-opt").forEach(b=>b.classList.remove("on")); btn.classList.add("on"); }
function czUnit(){ return czItem.price + SIZES[czSize].price + czAddons.reduce((s,i)=>s+ADDONS[i].price,0); }
function czPrice(){ $("#cz-add").textContent = `Add · ${rupee(czUnit()*czQty)}`; }
$("#cz-minus").onclick = ()=>{ czQty=Math.max(1,czQty-1); $("#cz-qty").textContent=czQty; czPrice(); };
$("#cz-plus").onclick  = ()=>{ czQty++; $("#cz-qty").textContent=czQty; czPrice(); };
$("#customizeClose").onclick = ()=> $("#customizeOverlay").classList.remove("show");
$("#customizeOverlay").onclick = e=>{ if(e.target.id==="customizeOverlay") $("#customizeOverlay").classList.remove("show"); };
$("#cz-add").onclick = ()=>{
  addLine({
    itemId: czItem.id, name: czItem.name, qty: czQty,
    size: SIZES[czSize].name, sizePrice: SIZES[czSize].price,
    spice: SPICES[czSpice], addons: czAddons.map(i=>ADDONS[i]),
    note: $("#cz-note").value.trim(), unitPrice: czUnit()
  });
  $("#customizeOverlay").classList.remove("show");
  toast("Added to order");
};

/* ============================================================
   CART (array of lines, persisted)
   ============================================================ */
function saveCart(){ store.set("sg_cart", cart); }
function lineLabel(l){
  const bits = [];
  if(l.size && l.size!=="Regular") bits.push(l.size);
  if(l.spice && l.spice!=="Medium") bits.push(l.spice);
  if(l.addons && l.addons.length) bits.push(...l.addons.map(a=>a.name));
  return bits.join(" · ");
}
function addLine(line){
  // merge with an identical existing line
  const key = l => [l.itemId,l.size,l.spice,(l.addons||[]).map(a=>a.name).join(","),l.note||""].join("|");
  const ex = cart.find(l=> key(l)===key(line));
  if(ex) ex.qty += line.qty; else cart.push({ lineId:uid(), ...line });
  saveCart(); renderCart(); renderMenu();
}
function changeLineQty(lineId, delta){
  const l = cart.find(x=>x.lineId===lineId); if(!l) return;
  l.qty += delta;
  if(l.qty<=0) cart = cart.filter(x=>x.lineId!==lineId);
  saveCart(); renderCart(); renderMenu();
}
function cartCount(){ return cart.reduce((s,l)=>s+l.qty,0); }
function subtotal(){ return cart.reduce((s,l)=>s+l.unitPrice*l.qty,0); }

function billLines(){
  const sub = subtotal();
  let discount = 0, freeShip = false;
  if(promo){
    if(promo.kind==="pct")  discount = sub*promo.value/100;
    if(promo.kind==="flat" && sub>=(promo.min||0)) discount = promo.value;
    if(promo.kind==="ship") freeShip = true;
  }
  const taxable = Math.max(0, sub - discount);
  const tax = taxable * TAX_RATE;
  const type = $("#typeSelect") ? $("#typeSelect").value : "Takeaway";
  let delivery = type==="Home delivery" ? DELIVERY_FEE : 0;
  if(freeShip) delivery = 0;
  const total = taxable + tax + delivery + tip;
  return { sub, discount, tax, delivery, tip, total };
}

function renderBill(){
  const b = billLines();
  const row = (label,val,cls="") => `<div class="bill-row ${cls}"><span>${label}</span><span>${rupee(val)}</span></div>`;
  let html = row("Subtotal", b.sub);
  if(b.discount>0) html += row(`Discount${promo?` (${promo.code})`:""}`, -b.discount, "discount");
  html += row(`Tax (${TAX_RATE*100}%)`, b.tax);
  if(b.delivery>0) html += row("Delivery fee", b.delivery);
  if(b.tip>0) html += row("Tip", b.tip);
  html += row("Total", b.total, "grand");
  $("#billBreakdown").innerHTML = html;
  $("#placeOrderBtn").textContent =
    ($("#paySelect").value==="online" ? "Pay & Place · " : "Place Order · ") + rupee(b.total);
}

function renderCart(){
  const wrap = $("#cartItems");
  $("#cartCount").textContent = cartCount();
  if(!cart.length){
    wrap.innerHTML = `<p class="empty">Your order is empty.<br/>Add some dishes!</p>`;
    $("#billBreakdown").innerHTML = "";
    $("#placeOrderBtn").textContent = "Pay & Place Order";
  } else {
    wrap.innerHTML = "";
    cart.forEach(l=>{
      const label = lineLabel(l);
      const line = document.createElement("div"); line.className="cart-line";
      line.innerHTML = `
        <div class="info">
          <div class="n">${l.name}</div>
          ${label?`<div class="opts">${label}</div>`:""}
          ${l.note?`<div class="opts note">📝 ${l.note}</div>`:""}
          <div class="p">${rupee(l.unitPrice)} each</div>
        </div>
        <div class="qty"><button class="minus">−</button><span>${l.qty}</span><button class="plus">+</button></div>`;
      line.querySelector(".minus").onclick = ()=> changeLineQty(l.lineId,-1);
      line.querySelector(".plus").onclick  = ()=> changeLineQty(l.lineId, 1);
      wrap.appendChild(line);
    });
    renderBill();
  }
  updateStickyCart();
}

function updateStickyCart(){
  const n = cartCount(), onMenu = $("#view-menu").classList.contains("active");
  const bar = $("#stickyCart");
  if(n>0 && onMenu){
    $("#stickyCount").textContent = n + (n===1?" item":" items");
    $("#stickyTotal").textContent = rupee(billLines().total);
    bar.classList.add("show");
  } else bar.classList.remove("show");
}

function openCart(open){
  $("#cartDrawer").classList.toggle("show", open);
  $("#drawerOverlay").classList.toggle("show", open);
}
$("#cartPill").onclick = ()=> openCart(true);
$("#stickyCart").onclick = ()=> openCart(true);
$("#closeCart").onclick = ()=> openCart(false);
$("#drawerOverlay").onclick = ()=> openCart(false);

/* order type → toggle address + recompute bill */
$("#typeSelect").onchange = e=>{
  $("#addressBlock").classList.toggle("hidden", e.target.value!=="Home delivery");
  renderCart();
};
$("#paySelect").onchange = ()=> renderBill();

/* promo */
$("#promoBtn").onclick = ()=>{
  const code = $("#promoInput").value.trim().toUpperCase();
  const msg = $("#promoMsg");
  if(!code){ promo=null; msg.textContent=""; renderCart(); return; }
  const p = PROMOS[code];
  if(!p){ promo=null; msg.className="promo-msg bad"; msg.textContent="Invalid code"; renderCart(); return; }
  if(p.kind==="flat" && subtotal()<(p.min||0)){
    promo=null; msg.className="promo-msg bad"; msg.textContent=`Spend ${rupee(p.min)}+ to use ${code}`; renderCart(); return;
  }
  promo = { code, ...p };
  msg.className="promo-msg good"; msg.textContent=`✓ ${p.label} applied`;
  renderCart();
};

/* tip */
$$("#tipBtns button").forEach(b=> b.onclick = ()=>{
  $$("#tipBtns button").forEach(x=>x.classList.remove("active")); b.classList.add("active");
  tip = b.dataset.tip==="pct" ? Math.round(subtotal()*0.10) : Number(b.dataset.tip);
  renderCart();
});

/* place order */
$("#orderForm").onsubmit = e=>{
  e.preventDefault();
  if(!cart.length){ toast("Your order is empty"); return; }
  const f = e.target;
  if(f.type.value==="Home delivery" && !f.address.value.trim()){ toast("Please enter a delivery address"); return; }
  const b = billLines();
  const order = {
    id: Date.now(),
    name: f.name.value, phone: f.phone.value, type: f.type.value,
    address: f.type.value==="Home delivery" ? f.address.value.trim() : "",
    landmark: f.landmark ? f.landmark.value.trim() : "",
    items: cart.map(l=>({ name:l.name, itemId:l.itemId, qty:l.qty, unitPrice:l.unitPrice,
                          size:l.size, sizePrice:l.sizePrice, spice:l.spice, addons:l.addons, note:l.note })),
    subtotal:b.sub, discount:b.discount, tax:b.tax, delivery:b.delivery, tip:b.tip, total:b.total,
    promo: promo ? promo.code : "",
    status: "placed", payMethod: f.pay.value, paid:false,
    time: new Date().toLocaleString()
  };
  if(order.payMethod==="online") openPayment(order);
  else saveOrder(order, "✅ Order placed! Pay on pickup/delivery.");
};

function saveOrder(order, msg){
  orders.unshift(order); store.set("sg_orders", orders);
  myOrderIds.unshift(order.id); store.set("sg_myorders", myOrderIds);
  // remember the customer so they don't retype next time
  profile = { name:order.name, phone:order.phone, address:order.address||profile.address||"" };
  store.set("sg_profile", profile);
  cart = []; saveCart();
  tip = 0; promo = null;
  $$("#tipBtns button").forEach((x,i)=>x.classList.toggle("active", i===0));
  $("#promoInput").value=""; $("#promoMsg").textContent="";
  renderCart(); renderMenu();
  $("#orderForm").reset();
  $("#addressBlock").classList.add("hidden");
  fillProfile();
  openCart(false); refreshAdminCounts();
  toast(msg); showConfirmation(order);
}

/* pre-fill known customer details into both forms */
function fillProfile(){
  const set = (sel, val)=>{ const el=$(sel); if(el && val && !el.value) el.value = val; };
  set("#orderForm [name=name]",  profile.name);
  set("#orderForm [name=phone]", profile.phone);
  set("#orderForm [name=address]", profile.address);
  set("#reserveForm [name=name]",  profile.name);
  set("#reserveForm [name=phone]", profile.phone);
}

/* ============================================================
   ORDER STATUS STAGES + TRACKING
   ============================================================ */
const STAGES = ["placed","preparing","ready","completed"];
const STAGE_LABEL = { placed:"Placed", preparing:"Preparing", ready:"Ready", completed:"Completed" };
function stageIndex(o){
  if(o.status==="new") return 0;          // legacy
  if(o.status==="done") return STAGES.length-1;
  const i = STAGES.indexOf(o.status); return i<0?0:i;
}

function showConfirmation(order){
  $("#confirmNo").textContent = "#" + String(order.id).slice(-4);
  $("#confirmOverlay").classList.add("show");
}
$("#confirmClose").onclick = ()=> $("#confirmOverlay").classList.remove("show");
$("#confirmTrack").onclick = ()=>{ $("#confirmOverlay").classList.remove("show"); showView("orders"); };

const ETA_MINUTES = 20;
function orderEta(o){ return o.id + ETA_MINUTES*60*1000; }

function renderMyOrders(){
  const wrap = $("#myOrdersList");
  const mine = myOrderIds.map(id=>orders.find(o=>o.id===id)).filter(Boolean);
  if(!mine.length){ wrap.innerHTML = `<p class="empty">You haven't placed any orders yet.</p>`; return; }
  wrap.innerHTML="";
  mine.forEach(o=>{
    const cancelled = o.status==="cancelled";
    const si = stageIndex(o);
    const row = document.createElement("div"); row.className="track-row" + (cancelled?" cancelled":"");

    if(cancelled){
      row.innerHTML = `
        <div class="top">
          <div><strong>#${String(o.id).slice(-4)}</strong> · ${o.type}
            <div class="meta">${o.items.reduce((s,i)=>s+i.qty,0)} items · ${rupee(o.total)}</div>
          </div>
          <span class="track-status cancelled">Cancelled</span>
        </div>
        <div class="card-actions"></div>`;
    } else {
      const steps = STAGES.map((st,i)=>
        `<div class="ts-step ${i<=si?'on':''}"><span class="ts-dot"></span><span class="ts-lbl">${STAGE_LABEL[st]}</span></div>`
      ).join('<span class="ts-bar"></span>');
      const ready = si>=2;
      const eta = ready ? "" : `<span class="eta-pill" data-eta="${orderEta(o)}">⏱️ …</span>`;
      row.innerHTML = `
        <div class="top">
          <div><strong>#${String(o.id).slice(-4)}</strong> · ${o.type}
            <div class="meta">${o.items.reduce((s,i)=>s+i.qty,0)} items · ${rupee(o.total)} · ${o.paid?"Paid":(o.payMethod==="online"?"Unpaid":"Cash")}</div>
          </div>
          <span class="track-status ${ready?'ready':'preparing'}">${STAGE_LABEL[STAGES[si]]}</span>
        </div>
        <div class="track-steps">${steps}</div>
        <div class="eta-line">${eta}</div>
        <div class="card-actions"></div>`;
    }

    const actions = row.querySelector(".card-actions");
    const again = document.createElement("button");
    again.className="btn ghost small"; again.textContent="🔁 Order again";
    again.onclick = ()=> reorder(o);
    actions.appendChild(again);
    // can cancel only while still "Placed" (not yet being prepared)
    if(!cancelled && si===0){
      const cancel = document.createElement("button");
      cancel.className="btn danger small"; cancel.textContent="Cancel order";
      cancel.onclick = ()=> cancelMyOrder(o);
      actions.appendChild(cancel);
    }
    wrap.appendChild(row);
  });
  updateEtas();
}

function cancelMyOrder(o){
  if(stageIndex(o)!==0){ toast("Too late to cancel — it's already being prepared"); return; }
  if(!confirm(`Cancel order #${String(o.id).slice(-4)}?`)) return;
  o.status = "cancelled";
  store.set("sg_orders", orders);
  renderMyOrders(); refreshAdminCounts();
  toast("Order cancelled");
}

/* live ETA countdown — updates every second while My Orders is open */
function updateEtas(){
  $$(".eta-pill").forEach(el=>{
    const target = Number(el.dataset.eta);
    const ms = target - Date.now();
    if(ms <= 0){ el.textContent = "⏱️ Any moment now…"; return; }
    const m = Math.floor(ms/60000), s = Math.floor(ms%60000/1000);
    el.textContent = `⏱️ Ready in ${m}:${String(s).padStart(2,"0")}`;
  });
}
function startEtaTicker(){
  setInterval(()=>{ if($("#view-orders").classList.contains("active")) updateEtas(); }, 1000);
}

function reorder(o){
  o.items.forEach(it=> addLine({
    itemId:it.itemId, name:it.name, qty:it.qty,
    size:it.size, sizePrice:it.sizePrice, spice:it.spice,
    addons:it.addons||[], note:it.note||"", unitPrice:it.unitPrice
  }));
  showView("menu"); openCart(true);
  toast("Items added — review your order");
}

/* ============================================================
   PAYMENT (demo)
   ============================================================ */
let pendingOrder=null;
function openPayment(order){
  pendingOrder=order;
  $("#payAmount").textContent = rupee(order.total);
  $("#payNowBtn").textContent = `Pay ${rupee(order.total)} now`;
  $("#payOverlay").classList.add("show");
}
function closePayment(){ $("#payOverlay").classList.remove("show"); pendingOrder=null; }
$("#payClose").onclick = closePayment;
$("#payOverlay").onclick = e=>{ if(e.target.id==="payOverlay") closePayment(); };
$$(".pay-method").forEach(btn=> btn.onclick = ()=>{
  $$(".pay-method").forEach(b=>b.classList.remove("active")); btn.classList.add("active");
  $$(".pay-pane").forEach(p=>p.classList.remove("active")); $("#pane-"+btn.dataset.method).classList.add("active");
});
$("#payNowBtn").onclick = ()=>{
  if(!pendingOrder) return;
  const btn=$("#payNowBtn"); btn.disabled=true; btn.textContent="Processing…";
  setTimeout(()=>{ const o=pendingOrder; o.paid=true; btn.disabled=false; closePayment();
    saveOrder(o, "✅ Payment successful! Order placed."); }, 1200);
};

/* ============================================================
   RESERVATIONS
   ============================================================ */
function initReserveDefaults(){
  const now=new Date(), pad=n=>String(n).padStart(2,"0");
  const today=`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
  const time=`${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const d=$("#reserveForm [name=date]"), t=$("#reserveForm [name=time]");
  d.value=today; d.min=today; t.value=time;
}
$("#reserveForm").onsubmit = e=>{
  e.preventDefault(); const f=e.target;
  reservations.unshift({ id:Date.now(), name:f.name.value, phone:f.phone.value, date:f.date.value,
    time:f.time.value, guests:f.guests.value, notes:f.notes.value, status:"new", made:new Date().toLocaleString() });
  store.set("sg_res", reservations);
  profile = { ...profile, name:f.name.value, phone:f.phone.value };
  store.set("sg_profile", profile);
  f.reset(); initReserveDefaults(); fillProfile(); refreshAdminCounts();
  toast("✅ Table reserved! See you soon.");
};

/* ============================================================
   ADMIN — roles
   ============================================================ */
const ROLE_LABEL={superadmin:"Super Admin",admin:"Admin",staff:"Staff"};
const can={
  manageMenu:r=>r==="superadmin"||r==="admin",
  deleteItems:r=>r==="superadmin"||r==="admin",
  manageUsers:r=>r==="superadmin"||r==="admin",
  viewRevenue:r=>r==="superadmin"||r==="admin",
  managesRole:(r,t)=> r==="superadmin"?true : r==="admin"?t==="staff":false,
};
const DEFAULT_USERS=[
  {user:"superadmin",pw:"super123",role:"superadmin"},
  {user:"admin",pw:"admin123",role:"admin"},
  {user:"staff",pw:"staff123",role:"staff"},
];
let users = store.get("sg_users", null) || (store.set("sg_users", DEFAULT_USERS), DEFAULT_USERS);
let me=null;

$("#adminLoginForm").onsubmit = e=>{
  e.preventDefault(); const f=e.target;
  const found = users.find(u=> u.user.toLowerCase()===f.user.value.trim().toLowerCase() && u.pw===f.pw.value);
  if(!found){ toast("Wrong username or password"); return; }
  me=found; f.reset();
  $("#adminLogin").classList.add("hidden"); $("#adminDash").classList.remove("hidden");
  applyPermissions(); renderAdmin();
};
$("#logoutBtn").onclick = ()=>{
  me=null; document.body.classList.remove("can-menu","can-users","can-revenue");
  $("#adminDash").classList.add("hidden"); $("#adminLogin").classList.remove("hidden");
};
function applyPermissions(){
  $("#meName").textContent=me.user;
  const tag=$("#meRole"); tag.textContent=ROLE_LABEL[me.role]; tag.className="role-tag "+me.role;
  document.body.classList.toggle("can-menu", can.manageMenu(me.role));
  document.body.classList.toggle("can-users", can.manageUsers(me.role));
  document.body.classList.toggle("can-revenue", can.viewRevenue(me.role));
  const active=$(".tab.active"); if(active && active.offsetParent===null) $$(".tab")[0].click();
  $$("#newUserRole option").forEach(o=> o.hidden = !can.managesRole(me.role,o.value));
}
$$(".tab").forEach(t=> t.onclick = ()=>{
  $$(".tab").forEach(x=>x.classList.remove("active")); t.classList.add("active");
  $$(".tab-panel").forEach(p=>p.classList.remove("active")); $("#tab-"+t.dataset.tab).classList.add("active");
});

function renderAdmin(){ renderOrders(); renderReservations(); renderMenuEditor(); renderUsers(); refreshAdminCounts(); }
function refreshAdminCounts(){
  $("#ordersBadge").textContent = orders.filter(o=> o.status!=="cancelled" && stageIndex(o)<STAGES.length-1).length;
  $("#resBadge").textContent    = reservations.filter(r=>r.status==="new").length;
  renderStats();
}
function renderStats(){
  const start=new Date(); start.setHours(0,0,0,0);
  const todays = orders.filter(o=> o.id>=start.getTime());
  $("#statOrdersToday").textContent = todays.length;
  $("#statRevToday").textContent = rupee(todays.reduce((s,o)=>s+o.total,0));
  $("#statRevTotal").textContent = rupee(orders.reduce((s,o)=>s+o.total,0));
}

function renderOrders(){
  const wrap=$("#ordersList");
  if(!orders.length){ wrap.innerHTML=`<p class="empty">No orders yet.</p>`; return; }
  wrap.innerHTML="";
  orders.forEach(o=>{
    const si=stageIndex(o);
    const cancelled = o.status==="cancelled";
    const el=document.createElement("div"); el.className="card-row"+(cancelled?" cancelled":"");
    const itemLine = i =>{
      const extras=[]; if(i.size&&i.size!=="Regular")extras.push(i.size);
      if(i.spice&&i.spice!=="Medium")extras.push(i.spice);
      if(i.addons&&i.addons.length)extras.push(...i.addons.map(a=>a.name));
      const sub = extras.length||i.note ? `<div class="oi-sub">${extras.join(" · ")}${i.note?` · 📝 ${i.note}`:""}</div>` : "";
      return `<li><span>${i.qty}× ${i.name}${sub}</span><span>${rupee(i.unitPrice*i.qty)}</span></li>`;
    };
    el.innerHTML=`
      <div class="top">
        <div>
          <div class="who">${o.name} · <span class="meta">${o.type}</span></div>
          <div class="meta">📞 ${o.phone} · ${o.time}</div>
          ${o.address?`<div class="meta">📍 ${o.address}${o.landmark?` (${o.landmark})`:""}</div>`:""}
          <div class="meta">${o.paid?'<span class="pay-paid">PAID ONLINE</span>':'<span class="pay-unpaid">'+(o.payMethod==="online"?"UNPAID":"CASH")+'</span>'}${o.promo?` <span class="tag-chip">${o.promo}</span>`:""}</div>
        </div>
        <span class="status ${cancelled?'cancelled':si>=STAGES.length-1?'done':'new'}">${cancelled?'CANCELLED':STAGE_LABEL[STAGES[si]].toUpperCase()}</span>
      </div>
      <ul class="order-items">
        ${o.items.map(itemLine).join("")}
        <li class="oi-total"><span>Total</span><span>${rupee(o.total)}</span></li>
      </ul>
      <div class="card-actions"></div>`;
    const actions=el.querySelector(".card-actions");
    if(!cancelled && si<STAGES.length-1){
      const next=document.createElement("button");
      next.className="btn primary small";
      next.textContent="Advance → "+STAGE_LABEL[STAGES[si+1]];
      next.onclick=()=>{ o.status=STAGES[si+1]; store.set("sg_orders",orders); renderOrders(); refreshAdminCounts(); };
      actions.appendChild(next);
    }
    if(can.deleteItems(me?.role)){
      const del=document.createElement("button"); del.className="btn danger small"; del.textContent="Delete";
      del.onclick=()=>{ orders=orders.filter(x=>x.id!==o.id); store.set("sg_orders",orders); renderOrders(); refreshAdminCounts(); };
      actions.appendChild(del);
    }
    wrap.appendChild(el);
  });
}

function renderReservations(){
  const wrap=$("#resList");
  if(!reservations.length){ wrap.innerHTML=`<p class="empty">No reservations yet.</p>`; return; }
  wrap.innerHTML="";
  reservations.forEach(r=>{
    const el=document.createElement("div"); el.className="card-row";
    el.innerHTML=`
      <div class="top">
        <div>
          <div class="who">${r.name} · <span class="meta">${r.guests} guests</span></div>
          <div class="meta">📅 ${r.date} at ${r.time} · 📞 ${r.phone}</div>
          ${r.notes?`<div class="meta">📝 ${r.notes}</div>`:""}
        </div>
        <span class="status ${r.status==="new"?"new":"done"}">${r.status==="new"?"NEW":"SEATED"}</span>
      </div>
      <div class="card-actions"></div>`;
    const actions=el.querySelector(".card-actions");
    if(r.status==="new"){
      const ok=document.createElement("button"); ok.className="btn primary small"; ok.textContent="Mark seated ✓";
      ok.onclick=()=>{ r.status="done"; store.set("sg_res",reservations); renderReservations(); refreshAdminCounts(); };
      actions.appendChild(ok);
    }
    if(can.deleteItems(me?.role)){
      const del=document.createElement("button"); del.className="btn danger small"; del.textContent="Delete";
      del.onclick=()=>{ reservations=reservations.filter(x=>x.id!==r.id); store.set("sg_res",reservations); renderReservations(); refreshAdminCounts(); };
      actions.appendChild(del);
    }
    wrap.appendChild(el);
  });
}

/* ============================================================
   MENU EDITOR (add / edit / remove + photo)
   ============================================================ */
let editingId = null;
function readPhoto(file){
  return new Promise(res=>{
    if(!file){ res(""); return; }
    const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=()=>res(""); r.readAsDataURL(file);
  });
}
$("#menuItemForm").onsubmit = async e=>{
  e.preventDefault(); const f=e.target;
  const photo = await readPhoto(f.photo.files[0]);
  if(editingId){
    const m = menu.find(x=>x.id===editingId);
    Object.assign(m, { name:f.name.value, price:Number(f.price.value), category:f.category.value,
      desc:f.desc.value, veg:f.veg.value, tag:f.tag.value, emoji:emojiFor(f.category.value) });
    if(photo) m.photo = photo;
    toast("Item updated");
  } else {
    menu.push({ id:Date.now(), name:f.name.value, price:Number(f.price.value), category:f.category.value,
      desc:f.desc.value, veg:f.veg.value, tag:f.tag.value, photo, emoji:emojiFor(f.category.value) });
    toast("Item added to menu");
  }
  store.set("sg_menu", menu);
  exitEdit(); renderMenuEditor(); renderCategories(); renderMenu();
};
$("#menuFormCancel").onclick = ()=>{ exitEdit(); };
function exitEdit(){
  editingId=null;
  $("#menuItemForm").reset();
  $("#menuFormBtn").textContent="Add item";
  $("#menuFormCancel").hidden=true;
}
function startEdit(m){
  editingId=m.id;
  const f=$("#menuItemForm");
  f.name.value=m.name; f.price.value=m.price; f.category.value=m.category;
  f.desc.value=m.desc||""; f.veg.value=m.veg||"veg"; f.tag.value=m.tag||"";
  $("#menuFormBtn").textContent="Save changes";
  $("#menuFormCancel").hidden=false;
  $("#tab-menuedit").scrollIntoView({behavior:"smooth"});
}
function renderMenuEditor(){
  $("#catList").innerHTML = [...new Set(menu.map(m=>m.category))].map(c=>`<option value="${c}">`).join("");
  const wrap=$("#menuEditList"); wrap.innerHTML="";
  menu.forEach(m=>{
    const row=document.createElement("div"); row.className="menu-edit-row";
    row.innerHTML=`
      ${m.photo?`<img class="me-photo" src="${m.photo}"/>`:`<span style="font-size:22px">${m.emoji||emojiFor(m.category)}</span>`}
      ${m.veg?`<span class="veg-dot ${m.veg}"></span>`:""}
      <span class="n">${m.name}</span>
      <span class="c">${m.category}</span>
      ${m.tag?`<span class="tag-chip ${m.tag.replace(/[^a-zA-Z]/g,'')}">${m.tag}</span>`:""}
      <span class="pr">${rupee(m.price)}</span>`;
    const edit=document.createElement("button"); edit.className="btn ghost small"; edit.textContent="Edit";
    edit.onclick=()=> startEdit(m);
    row.appendChild(edit);
    const del=document.createElement("button"); del.className="btn danger small"; del.textContent="Remove";
    del.onclick=()=>{ menu=menu.filter(x=>x.id!==m.id); store.set("sg_menu",menu); if(editingId===m.id) exitEdit(); renderMenuEditor(); renderCategories(); renderMenu(); };
    row.appendChild(del);
    wrap.appendChild(row);
  });
}

/* ============================================================
   USERS
   ============================================================ */
const ROLE_EMOJI={superadmin:"👑",admin:"🛠️",staff:"🧑‍🍳"};
$("#userForm").onsubmit = e=>{
  e.preventDefault(); const f=e.target;
  const uname=f.user.value.trim(), role=f.role.value;
  if(!can.managesRole(me.role,role)){ toast("You can't create that role"); return; }
  if(users.some(u=>u.user.toLowerCase()===uname.toLowerCase())){ toast("Username already exists"); return; }
  users.push({user:uname,pw:f.pw.value,role}); store.set("sg_users",users);
  f.reset(); renderUsers(); toast(`${ROLE_LABEL[role]} "${uname}" added`);
};
function renderUsers(){
  const wrap=$("#userList"); if(!wrap) return; wrap.innerHTML="";
  users.forEach(u=>{
    const row=document.createElement("div"); row.className="menu-edit-row";
    row.innerHTML=`
      <span style="font-size:20px">${ROLE_EMOJI[u.role]}</span>
      <span class="n">${u.user}${me&&u.user===me.user?'  <span class="c">(you)</span>':''}</span>
      <span class="user-role-pill role-tag ${u.role}">${ROLE_LABEL[u.role]}</span>`;
    if(me && u.user!==me.user && can.managesRole(me.role,u.role)){
      const del=document.createElement("button"); del.className="btn danger small"; del.textContent="Remove";
      del.onclick=()=>{ users=users.filter(x=>x.user!==u.user); store.set("sg_users",users); renderUsers(); toast(`Removed ${u.user}`); };
      row.appendChild(del);
    }
    wrap.appendChild(row);
  });
}

/* ============================================================
   TOAST + NEW-ORDER ALERT + PWA
   ============================================================ */
let toastTimer;
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove("show"),2200); }

let audioCtx=null;
function beep(){
  try{ audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==="suspended") audioCtx.resume();
    [880,1175].forEach((fr,i)=>{ const o=audioCtx.createOscillator(),g=audioCtx.createGain();
      o.frequency.value=fr; o.type="sine"; o.connect(g); g.connect(audioCtx.destination);
      const t=audioCtx.currentTime+i*0.18; g.gain.setValueAtTime(0.0001,t);
      g.gain.exponentialRampToValueAtTime(0.25,t+0.02); g.gain.exponentialRampToValueAtTime(0.0001,t+0.16);
      o.start(t); o.stop(t+0.18); });
  }catch(_){}
}
function notifyNewOrder(){ if(!me) return; beep(); toast("🔔 New order received!"); renderOrders(); refreshAdminCounts(); }
window.addEventListener("storage", e=>{ if(e.key==="sg_orders"){ orders=store.get("sg_orders",[]); notifyNewOrder(); } });

if("serviceWorker" in navigator && location.protocol.startsWith("http")){
  window.addEventListener("load", ()=> navigator.serviceWorker.register("sw.js").catch(()=>{}));
}

/* ============================================================
   VOICE INPUT — speak to fill fields (Web Speech API, Chrome)
   ============================================================ */
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
const NUM_WORDS = {
  zero:"0",oh:"0",o:"0",one:"1",two:"2",to:"2",too:"2",three:"3",four:"4",for:"4",
  five:"5",six:"6",seven:"7",eight:"8",ate:"8",nine:"9",
  "शून्य":"0","एक":"1","दो":"2","तीन":"3","चार":"4","पांच":"5","पाँच":"5","छह":"6","सात":"7","आठ":"8","नौ":"9","नो":"9"
};
function toDigits(s){
  return s.toLowerCase().split(/[\s-]+/)
    .map(w => NUM_WORDS[w] !== undefined ? NUM_WORDS[w] : w)
    .join("").replace(/\D/g, "");
}
function attachVoice(){
  if(!SpeechRec) return;                       // browser doesn't support it → no mic buttons
  $$("[data-voice]").forEach(field=>{
    if(field.dataset.voiceReady) return;       // don't double-attach
    field.dataset.voiceReady = "1";
    const wrap = document.createElement("span");
    wrap.className = "voice-wrap";
    field.parentNode.insertBefore(wrap, field);
    wrap.appendChild(field);
    const mic = document.createElement("button");
    mic.type = "button"; mic.className = "mic-btn"; mic.title = "Speak to fill";
    mic.textContent = "🎤";
    wrap.appendChild(mic);
    const mode = field.dataset.voice;          // "" or "number"
    mic.onclick = ()=> listen(field, mode, mic);
  });
}
let activeRec = null, activeMic = null, voiceWatchdog = null;
const VOICE_ERR = {
  "not-allowed":"🎤 Microphone blocked — click the 🔒 in the address bar and allow it",
  "service-not-allowed":"🎤 Microphone blocked by the browser/permissions",
  "no-speech":"🎤 Didn't hear anything — tap and speak clearly",
  "audio-capture":"🎤 No microphone found on this device",
  "network":"🎤 Voice needs internet — check your connection",
  "aborted":"" // user/stop initiated — no message
};
function stopVoice(){
  if(voiceWatchdog){ clearTimeout(voiceWatchdog); voiceWatchdog=null; }
  if(activeMic) activeMic.classList.remove("listening");
  if(activeRec){ try{ activeRec.stop(); }catch(_){} }
  activeRec=null; activeMic=null;
}
function listen(field, mode, mic){
  if(!SpeechRec){ toast("Voice isn't supported in this browser"); return; }
  if(activeRec){ stopVoice(); return; }          // tapping again cancels

  let rec;
  try { rec = new SpeechRec(); } catch(_){ toast("Voice unavailable here — open in a Chrome tab"); return; }
  rec.lang = lang === "hi" ? "hi-IN" : "en-US";
  rec.interimResults = false; rec.maxAlternatives = 1;
  activeRec = rec; activeMic = mic;
  mic.classList.add("listening");
  field.focus();
  toast(lang==="hi" ? "🎤 सुन रहे हैं… अब बोलिए" : "🎤 Listening… speak now");

  rec.onresult = e=>{
    let text = (e.results[0][0].transcript || "").trim();
    if(mode === "number") text = toDigits(text);
    if(field.tagName === "TEXTAREA" && field.value.trim()) field.value += " " + text;
    else field.value = text;
    field.dispatchEvent(new Event("input", { bubbles:true }));
    toast("✅ Got it");
  };
  rec.onerror = ev=>{
    const msg = VOICE_ERR[ev.error];
    if(msg === undefined) toast("🎤 Voice error — please try again");
    else if(msg) toast(msg);
    stopVoice();
  };
  rec.onend = ()=> stopVoice();

  try{
    rec.start();
    // safety net: if nothing happens in 9s (e.g. blocked in an iframe), reset the UI
    voiceWatchdog = setTimeout(()=>{
      if(activeRec===rec){ toast("🎤 No response — try opening localhost in a Chrome tab"); stopVoice(); }
    }, 9000);
  }catch(_){ toast("🎤 Couldn't start — open in a Chrome tab and allow the mic"); stopVoice(); }
}

/* ============================================================
   INIT
   ============================================================ */
applyLang();
applyTheme();
renderCategories();
renderMenu();
renderCart();
initReserveDefaults();
fillProfile();
refreshAdminCounts();
updateStickyCart();
attachVoice();
startEtaTicker();
