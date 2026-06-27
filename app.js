/* ============================================================
   Spice Garden — restaurant app
   Pure browser app. Data is saved in localStorage so menu edits,
   orders and reservations persist between visits.
   ============================================================ */

const ADMIN_PASSWORD = "admin123";

/* ---------- tiny storage helpers ---------- */
const store = {
  get(key, fallback){
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
};

/* ---------- seed menu (first run only) ---------- */
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

let menu        = store.get("sg_menu", null) || (store.set("sg_menu", DEFAULT_MENU), DEFAULT_MENU);
let orders       = store.get("sg_orders", []);
let reservations = store.get("sg_res", []);
let myOrderIds   = store.get("sg_myorders", []);   // ids of orders placed from THIS device
let cart         = {};            // id -> qty (session only)
let activeCat    = "All";
let searchTerm   = "";

const $  = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const rupee = n => "₹" + n.toLocaleString("en-IN");
const emojiFor = c => ({Pizza:"🍕",Starters:"🍟",Burgers:"🍔",Mains:"🍛",Desserts:"🍰",Drinks:"🥤"}[c] || "🍴");

/* ---------- typo-tolerant search ---------- */
/* edit distance between two words (how many single-char changes apart) */
function levenshtein(a, b){
  const m = a.length, n = b.length;
  if(!m) return n; if(!n) return m;
  const dp = Array.from({length:n+1}, (_,i)=>i);
  for(let i=1; i<=m; i++){
    let prev = dp[0]; dp[0] = i;
    for(let j=1; j<=n; j++){
      const tmp = dp[j];
      dp[j] = Math.min(dp[j]+1, dp[j-1]+1, prev + (a[i-1]===b[j-1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[n];
}
/* does a search word match a dish word, allowing small spelling mistakes? */
function fuzzyWord(term, word){
  if(word.includes(term) || term.includes(word)) return true;   // substring / partial
  const tol = term.length >= 7 ? 2 : term.length >= 4 ? 1 : 0;   // longer word → forgive more typos
  return levenshtein(term, word) <= tol;
}
/* match a dish against the whole query (name + description + category) */
function searchMatches(m, query){
  if(!query) return true;
  const words = (m.name + " " + (m.desc||"") + " " + m.category)
    .toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  return query.split(/\s+/).filter(Boolean)
    .every(term => words.some(w => fuzzyWord(term, w)));
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function showView(name){
  $$(".nav-btn").forEach(b=>b.classList.toggle("active", b.dataset.view===name));
  $$(".view").forEach(v=>v.classList.remove("active"));
  $("#view-"+name).classList.add("active");
  if(name==="orders") renderMyOrders();
  updateStickyCart();
}
$$(".nav-btn").forEach(btn=>{ btn.onclick = ()=> showView(btn.dataset.view); });

/* ---------- dark mode ---------- */
function applyTheme(){
  const dark = store.get("sg_theme","light") === "dark";
  document.body.classList.toggle("dark", dark);
  $("#themeBtn").textContent = dark ? "☀️" : "🌙";
}
$("#themeBtn").onclick = ()=>{
  const next = document.body.classList.contains("dark") ? "light" : "dark";
  store.set("sg_theme", next);
  applyTheme();
};
applyTheme();

/* ---------- search ---------- */
$("#searchInput").oninput = e=>{ searchTerm = e.target.value.trim().toLowerCase(); renderMenu(); };

/* ============================================================
   MENU (customer)
   ============================================================ */
function renderCategories(){
  const cats = ["All", ...new Set(menu.map(m=>m.category))];
  const bar = $("#categoryBar");
  bar.innerHTML = "";
  cats.forEach(c=>{
    const chip = document.createElement("button");
    chip.className = "cat-chip" + (c===activeCat ? " active" : "");
    chip.textContent = c;
    chip.onclick = ()=>{ activeCat = c; renderCategories(); renderMenu(); };
    bar.appendChild(chip);
  });
}

function renderMenu(){
  const grid = $("#menuGrid");
  grid.innerHTML = "";
  const items = menu.filter(m=>
    (activeCat==="All" || m.category===activeCat) &&
    searchMatches(m, searchTerm)
  );
  if(!items.length){
    grid.innerHTML = `<p class="empty">No dishes found${searchTerm?` for “${searchTerm}”`:""}.</p>`;
    return;
  }
  items.forEach(m=>{
    const card = document.createElement("div");
    card.className = "dish";
    const veg = m.veg ? `<span class="veg-dot ${m.veg}" title="${m.veg==="veg"?"Veg":"Non-veg"}"></span>` : "";
    const tag = m.tag ? `<span class="tag-chip ${m.tag.replace(/[^a-zA-Z]/g,'')}">${m.tag}</span>` : "";
    const qty = cart[m.id] || 0;
    const control = qty > 0
      ? `<span class="stepper"><button class="minus">−</button><span class="q">${qty}</span><button class="plus">+</button></span>`
      : `<button class="btn primary small add">Add +</button>`;
    card.innerHTML = `
      <div class="emoji">${m.emoji || emojiFor(m.category)}</div>
      <div class="dish-head">${veg}<h3>${m.name}</h3></div>
      ${tag}
      <p class="desc">${m.desc || ""}</p>
      <div class="bottom">
        <span class="price">${rupee(m.price)}</span>
        ${control}
      </div>`;
    const addBtn = card.querySelector(".add");
    if(addBtn) addBtn.onclick = ()=> addToCart(m.id);
    const minus = card.querySelector(".minus"), plus = card.querySelector(".plus");
    if(minus) minus.onclick = ()=> changeQty(m.id, -1);
    if(plus)  plus.onclick  = ()=> changeQty(m.id, 1);
    grid.appendChild(card);
  });
}

/* ============================================================
   CART
   ============================================================ */
function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  renderCart(); renderMenu();
  toast("Added to order");
}
function changeQty(id, delta){
  cart[id] = (cart[id] || 0) + delta;
  if(cart[id] <= 0) delete cart[id];
  renderCart(); renderMenu();
}
function cartTotal(){
  return Object.entries(cart).reduce((sum,[id,q])=>{
    const m = menu.find(x=>x.id == id); return sum + (m ? m.price*q : 0);
  }, 0);
}
function renderCart(){
  const wrap = $("#cartItems");
  const ids = Object.keys(cart);
  $("#cartCount").textContent = ids.reduce((s,id)=>s+cart[id],0);
  if(!ids.length){ wrap.innerHTML = `<p class="empty">Your order is empty.<br/>Add some dishes!</p>`; }
  else {
    wrap.innerHTML = "";
    ids.forEach(id=>{
      const m = menu.find(x=>x.id == id); if(!m) return;
      const line = document.createElement("div");
      line.className = "cart-line";
      line.innerHTML = `
        <div class="info"><div class="n">${m.name}</div><div class="p">${rupee(m.price)}</div></div>
        <div class="qty">
          <button class="minus">−</button><span>${cart[id]}</span><button class="plus">+</button>
        </div>`;
      line.querySelector(".minus").onclick = ()=>changeQty(id,-1);
      line.querySelector(".plus").onclick  = ()=>changeQty(id, 1);
      wrap.appendChild(line);
    });
  }
  $("#cartTotal").textContent = rupee(cartTotal());
  updateStickyCart();
}

/* sticky "View Cart" bar — shown only on the menu view when cart has items */
function updateStickyCart(){
  const count = Object.values(cart).reduce((s,q)=>s+q,0);
  const onMenu = $("#view-menu").classList.contains("active");
  const bar = $("#stickyCart");
  if(count > 0 && onMenu){
    $("#stickyCount").textContent = count + (count===1?" item":" items");
    $("#stickyTotal").textContent = rupee(cartTotal());
    bar.classList.add("show");
  } else {
    bar.classList.remove("show");
  }
}

function openCart(open){
  $("#cartDrawer").classList.toggle("show", open);
  $("#drawerOverlay").classList.toggle("show", open);
}
$("#cartPill").onclick   = ()=> openCart(true);
$("#stickyCart").onclick = ()=> openCart(true);
$("#closeCart").onclick  = ()=> openCart(false);
$("#drawerOverlay").onclick = ()=> openCart(false);

/* update the checkout button label based on payment choice */
$("#paySelect").onchange = e=>{
  $("#placeOrderBtn").textContent = e.target.value === "online" ? "Pay & Place Order" : "Place Order";
};

/* place order */
$("#orderForm").onsubmit = e=>{
  e.preventDefault();
  if(!Object.keys(cart).length){ toast("Your order is empty"); return; }
  const f = e.target;
  const items = Object.keys(cart).map(id=>{
    const m = menu.find(x=>x.id == id);
    return { name:m.name, price:m.price, qty:cart[id] };
  });
  const order = {
    id: Date.now(),
    name: f.name.value, phone: f.phone.value, type: f.type.value,
    items, total: cartTotal(), status:"new",
    payMethod: f.pay.value,                 // "online" | "cash"
    paid: false,
    time: new Date().toLocaleString()
  };

  if(order.payMethod === "online"){
    openPayment(order);                     // pay first, save on success
  } else {
    saveOrder(order, "✅ Order placed! Pay on pickup/delivery.");
  }
};

function saveOrder(order, msg){
  orders.unshift(order);
  store.set("sg_orders", orders);
  myOrderIds.unshift(order.id);                 // remember on THIS device for tracking
  store.set("sg_myorders", myOrderIds);
  cart = {}; renderCart(); renderMenu();
  $("#orderForm").reset();
  $("#placeOrderBtn").textContent = "Pay & Place Order";
  openCart(false);
  refreshAdminCounts();
  toast(msg);
  showConfirmation(order);
}

/* ---------- order confirmation + tracking ---------- */
function showConfirmation(order){
  $("#confirmNo").textContent = "#" + String(order.id).slice(-4);
  $("#confirmOverlay").classList.add("show");
}
$("#confirmClose").onclick = ()=> $("#confirmOverlay").classList.remove("show");
$("#confirmTrack").onclick = ()=>{
  $("#confirmOverlay").classList.remove("show");
  showView("orders");
};

function renderMyOrders(){
  const wrap = $("#myOrdersList");
  const mine = myOrderIds.map(id => orders.find(o=>o.id===id)).filter(Boolean);
  if(!mine.length){ wrap.innerHTML = `<p class="empty">You haven't placed any orders yet.</p>`; return; }
  wrap.innerHTML = "";
  mine.forEach(o=>{
    const ready = o.status === "done";
    const row = document.createElement("div");
    row.className = "track-row";
    row.innerHTML = `
      <div class="top">
        <div>
          <strong>#${String(o.id).slice(-4)}</strong> · ${o.type}
          <div class="meta">${o.items.reduce((s,i)=>s+i.qty,0)} items · ${rupee(o.total)} · ${o.paid?"Paid":(o.payMethod==="online"?"Unpaid":"Cash")}</div>
        </div>
        <span class="track-status ${ready?"ready":"preparing"}">${ready?"✅ Ready":"👨‍🍳 Preparing"}</span>
      </div>
      <div class="track-steps">
        <span class="dot on"></span><span class="bar on"></span>
        <span class="dot on"></span><span class="bar ${ready?"on":""}"></span>
        <span class="dot ${ready?"on":""}"></span>
        <span style="margin-left:6px">Placed → Preparing → Ready</span>
      </div>`;
    wrap.appendChild(row);
  });
}

/* ============================================================
   ONLINE PAYMENT (demo — simulates a gateway, no real money)
   ============================================================ */
let pendingOrder = null;

function openPayment(order){
  pendingOrder = order;
  $("#payAmount").textContent  = rupee(order.total);
  $("#payNowBtn").textContent  = `Pay ${rupee(order.total)} now`;
  $("#payOverlay").classList.add("show");
}
function closePayment(){
  $("#payOverlay").classList.remove("show");
  pendingOrder = null;
}
$("#payClose").onclick   = closePayment;
$("#payOverlay").onclick = e=>{ if(e.target.id === "payOverlay") closePayment(); };

/* switch between UPI / Card panes */
$$(".pay-method").forEach(btn=>{
  btn.onclick = ()=>{
    $$(".pay-method").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    $$(".pay-pane").forEach(p=>p.classList.remove("active"));
    $("#pane-" + btn.dataset.method).classList.add("active");
  };
});

/* simulate a successful payment */
$("#payNowBtn").onclick = ()=>{
  if(!pendingOrder) return;
  const btn = $("#payNowBtn");
  btn.disabled = true; btn.textContent = "Processing…";
  setTimeout(()=>{
    const order = pendingOrder;
    order.paid = true;
    btn.disabled = false;
    closePayment();
    saveOrder(order, "✅ Payment successful! Order placed.");
  }, 1200);
};

/* ============================================================
   RESERVATIONS
   ============================================================ */
/* Pre-fill date & time with the current moment, and block past dates */
function initReserveDefaults(){
  const now = new Date();
  const pad = n => String(n).padStart(2, "0");
  const today = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
  const time  = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const dateEl = $("#reserveForm [name=date]");
  const timeEl = $("#reserveForm [name=time]");
  dateEl.value = today;
  dateEl.min   = today;          // can't pick a day in the past
  timeEl.value = time;
}

$("#reserveForm").onsubmit = e=>{
  e.preventDefault();
  const f = e.target;
  reservations.unshift({
    id: Date.now(),
    name:f.name.value, phone:f.phone.value, date:f.date.value,
    time:f.time.value, guests:f.guests.value, notes:f.notes.value,
    status:"new", made: new Date().toLocaleString()
  });
  store.set("sg_res", reservations);
  f.reset(); initReserveDefaults(); refreshAdminCounts();
  toast("✅ Table reserved! See you soon.");
};

/* ============================================================
   ADMIN  —  roles: superadmin > admin > staff
   ============================================================ */
const ROLE_LABEL = { superadmin:"Super Admin", admin:"Admin", staff:"Staff" };

/* what each role is allowed to do */
const can = {
  manageMenu:  role => role === "superadmin" || role === "admin",
  deleteItems: role => role === "superadmin" || role === "admin",   // delete orders/reservations
  manageUsers: role => role === "superadmin" || role === "admin",
  viewRevenue: role => role === "superadmin" || role === "admin",   // amounts/totals
  // who a given role is allowed to create / remove
  managesRole: (role, target) =>
    role === "superadmin" ? true :                       // super admin manages everyone
    role === "admin"      ? target === "staff" : false,  // admin manages staff only
};

/* seed default accounts on first run */
const DEFAULT_USERS = [
  { user:"superadmin", pw:"super123", role:"superadmin" },
  { user:"admin",      pw:"admin123", role:"admin" },
  { user:"staff",      pw:"staff123", role:"staff" },
];
let users = store.get("sg_users", null) || (store.set("sg_users", DEFAULT_USERS), DEFAULT_USERS);

let me = null;   // the logged-in user, or null

$("#adminLoginForm").onsubmit = e=>{
  e.preventDefault();
  const f = e.target;
  const found = users.find(u =>
    u.user.toLowerCase() === f.user.value.trim().toLowerCase() && u.pw === f.pw.value);
  if(!found){ toast("Wrong username or password"); return; }
  me = found;
  f.reset();
  $("#adminLogin").classList.add("hidden");
  $("#adminDash").classList.remove("hidden");
  applyPermissions();
  renderAdmin();
};

$("#logoutBtn").onclick = ()=>{
  me = null;
  document.body.classList.remove("can-menu","can-users","can-revenue");
  $("#adminDash").classList.add("hidden");
  $("#adminLogin").classList.remove("hidden");
};

/* show/hide tabs + label the current user according to role */
function applyPermissions(){
  $("#meName").textContent = me.user;
  const tag = $("#meRole");
  tag.textContent = ROLE_LABEL[me.role];
  tag.className = "role-tag " + me.role;

  document.body.classList.toggle("can-menu",    can.manageMenu(me.role));
  document.body.classList.toggle("can-users",   can.manageUsers(me.role));
  document.body.classList.toggle("can-revenue", can.viewRevenue(me.role));

  // if the active tab is now hidden for this role, fall back to Orders
  const active = $(".tab.active");
  if(active && active.offsetParent === null) $$(".tab")[0].click();

  // limit which roles this user may create
  $$("#newUserRole option").forEach(opt=>{
    opt.hidden = !can.managesRole(me.role, opt.value);
  });
}

/* tabs */
$$(".tab").forEach(t=>{
  t.onclick = ()=>{
    $$(".tab").forEach(x=>x.classList.remove("active"));
    t.classList.add("active");
    $$(".tab-panel").forEach(p=>p.classList.remove("active"));
    $("#tab-"+t.dataset.tab).classList.add("active");
  };
});

function renderAdmin(){ renderOrders(); renderReservations(); renderMenuEditor(); renderUsers(); refreshAdminCounts(); }

function refreshAdminCounts(){
  $("#ordersBadge").textContent = orders.filter(o=>o.status==="new").length;
  $("#resBadge").textContent    = reservations.filter(r=>r.status==="new").length;
  renderStats();
}

/* order.id is Date.now() at creation — use it to tell which orders are from today */
function renderStats(){
  const startOfToday = new Date(); startOfToday.setHours(0,0,0,0);
  const todays = orders.filter(o => o.id >= startOfToday.getTime());

  $("#statOrdersToday").textContent = todays.length;                                  // count — everyone
  $("#statRevToday").textContent    = rupee(todays.reduce((s,o)=>s+o.total, 0));      // amount — admins only
  $("#statRevTotal").textContent    = rupee(orders.reduce((s,o)=>s+o.total, 0));      // total — admins only
}

function renderOrders(){
  const wrap = $("#ordersList");
  if(!orders.length){ wrap.innerHTML = `<p class="empty">No orders yet.</p>`; return; }
  wrap.innerHTML = "";
  orders.forEach(o=>{
    const el = document.createElement("div");
    el.className = "card-row";
    el.innerHTML = `
      <div class="top">
        <div>
          <div class="who">${o.name} · <span class="meta">${o.type}</span></div>
          <div class="meta">📞 ${o.phone} · ${o.time}</div>
          <div class="meta">${o.paid
            ? '<span class="pay-paid">PAID ONLINE</span>'
            : '<span class="pay-unpaid">'+(o.payMethod==="online"?"UNPAID":"CASH")+'</span>'}</div>
        </div>
        <span class="status ${o.status==="new"?"new":"done"}">${o.status==="new"?"NEW":"DONE"}</span>
      </div>
      <ul class="order-items">
        ${o.items.map(i=>`<li><span>${i.qty}× ${i.name}</span><span>${rupee(i.price*i.qty)}</span></li>`).join("")}
        <li style="border-top:1px solid var(--line);margin-top:6px;padding-top:6px;font-weight:700">
          <span>Total</span><span>${rupee(o.total)}</span></li>
      </ul>
      <div class="card-actions"></div>`;
    const actions = el.querySelector(".card-actions");
    if(o.status==="new"){
      const done = document.createElement("button");
      done.className="btn primary small"; done.textContent="Mark ready ✓";
      done.onclick=()=>{ o.status="done"; store.set("sg_orders",orders); renderOrders(); refreshAdminCounts(); };
      actions.appendChild(done);
    }
    if(can.deleteItems(me?.role)){
      const del = document.createElement("button");
      del.className="btn danger small"; del.textContent="Delete";
      del.onclick=()=>{ orders=orders.filter(x=>x.id!==o.id); store.set("sg_orders",orders); renderOrders(); refreshAdminCounts(); };
      actions.appendChild(del);
    }
    wrap.appendChild(el);
  });
}

function renderReservations(){
  const wrap = $("#resList");
  if(!reservations.length){ wrap.innerHTML = `<p class="empty">No reservations yet.</p>`; return; }
  wrap.innerHTML = "";
  reservations.forEach(r=>{
    const el = document.createElement("div");
    el.className = "card-row";
    el.innerHTML = `
      <div class="top">
        <div>
          <div class="who">${r.name} · <span class="meta">${r.guests} guests</span></div>
          <div class="meta">📅 ${r.date} at ${r.time} · 📞 ${r.phone}</div>
          ${r.notes?`<div class="meta">📝 ${r.notes}</div>`:""}
        </div>
        <span class="status ${r.status==="new"?"new":"done"}">${r.status==="new"?"NEW":"SEATED"}</span>
      </div>
      <div class="card-actions"></div>`;
    const actions = el.querySelector(".card-actions");
    if(r.status==="new"){
      const ok = document.createElement("button");
      ok.className="btn primary small"; ok.textContent="Mark seated ✓";
      ok.onclick=()=>{ r.status="done"; store.set("sg_res",reservations); renderReservations(); refreshAdminCounts(); };
      actions.appendChild(ok);
    }
    if(can.deleteItems(me?.role)){
      const del = document.createElement("button");
      del.className="btn danger small"; del.textContent="Delete";
      del.onclick=()=>{ reservations=reservations.filter(x=>x.id!==r.id); store.set("sg_res",reservations); renderReservations(); refreshAdminCounts(); };
      actions.appendChild(del);
    }
    wrap.appendChild(el);
  });
}

/* menu editor */
$("#menuItemForm").onsubmit = e=>{
  e.preventDefault();
  const f = e.target;
  menu.push({
    id: Date.now(),
    name:f.name.value, price:Number(f.price.value),
    category:f.category.value, desc:f.desc.value,
    veg:f.veg.value, tag:f.tag.value,
    emoji: emojiFor(f.category.value)
  });
  store.set("sg_menu", menu);
  f.reset();
  renderMenuEditor(); renderCategories(); renderMenu();
  toast("Item added to menu");
};

function renderMenuEditor(){
  // refresh category datalist
  $("#catList").innerHTML = [...new Set(menu.map(m=>m.category))]
    .map(c=>`<option value="${c}">`).join("");
  const wrap = $("#menuEditList");
  wrap.innerHTML = "";
  menu.forEach(m=>{
    const row = document.createElement("div");
    row.className = "menu-edit-row";
    row.innerHTML = `
      <span style="font-size:22px">${m.emoji||emojiFor(m.category)}</span>
      ${m.veg?`<span class="veg-dot ${m.veg}"></span>`:""}
      <span class="n">${m.name}</span>
      <span class="c">${m.category}</span>
      ${m.tag?`<span class="tag-chip ${m.tag.replace(/[^a-zA-Z]/g,'')}">${m.tag}</span>`:""}
      <span class="pr">${rupee(m.price)}</span>`;
    const del = document.createElement("button");
    del.className="btn danger small"; del.textContent="Remove";
    del.onclick=()=>{
      menu = menu.filter(x=>x.id!==m.id);
      store.set("sg_menu", menu);
      renderMenuEditor(); renderCategories(); renderMenu();
    };
    row.appendChild(del);
    wrap.appendChild(row);
  });
}

/* ============================================================
   USER MANAGEMENT  (super admin & admin)
   ============================================================ */
const ROLE_EMOJI = { superadmin:"👑", admin:"🛠️", staff:"🧑‍🍳" };

$("#userForm").onsubmit = e=>{
  e.preventDefault();
  const f = e.target;
  const uname = f.user.value.trim();
  const role  = f.role.value;
  if(!can.managesRole(me.role, role)){ toast("You can't create that role"); return; }
  if(users.some(u=>u.user.toLowerCase()===uname.toLowerCase())){ toast("Username already exists"); return; }
  users.push({ user:uname, pw:f.pw.value, role });
  store.set("sg_users", users);
  f.reset();
  renderUsers();
  toast(`${ROLE_LABEL[role]} "${uname}" added`);
};

function renderUsers(){
  const wrap = $("#userList");
  if(!wrap) return;
  wrap.innerHTML = "";
  users.forEach(u=>{
    const row = document.createElement("div");
    row.className = "menu-edit-row";
    row.innerHTML = `
      <span style="font-size:20px">${ROLE_EMOJI[u.role]}</span>
      <span class="n">${u.user}${me && u.user===me.user ? '  <span class="c">(you)</span>' : ''}</span>
      <span class="user-role-pill role-tag ${u.role}">${ROLE_LABEL[u.role]}</span>`;
    // can this logged-in user remove this account?
    const removable = me && u.user !== me.user && can.managesRole(me.role, u.role);
    if(removable){
      const del = document.createElement("button");
      del.className="btn danger small"; del.textContent="Remove";
      del.onclick=()=>{
        users = users.filter(x=>x.user!==u.user);
        store.set("sg_users", users);
        renderUsers();
        toast(`Removed ${u.user}`);
      };
      row.appendChild(del);
    }
    wrap.appendChild(row);
  });
}

/* ============================================================
   TOAST
   ============================================================ */
let toastTimer;
function toast(msg){
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove("show"), 2200);
}

/* ============================================================
   NEW-ORDER ALERT (sound + highlight for staff/admin)
   ============================================================ */
let audioCtx = null;
function beep(){
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if(audioCtx.state === "suspended") audioCtx.resume();
    [880, 1175].forEach((freq, i)=>{                 // two-tone "ding-dong"
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.frequency.value = freq; o.type = "sine";
      o.connect(g); g.connect(audioCtx.destination);
      const t = audioCtx.currentTime + i*0.18;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t+0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t+0.16);
      o.start(t); o.stop(t+0.18);
    });
  }catch(_){ /* audio not available */ }
}
function notifyNewOrder(){
  if(!me) return;                       // only alert a logged-in staff/admin
  beep();
  toast("🔔 New order received!");
  renderOrders(); refreshAdminCounts();
}
/* customer order in a DIFFERENT browser tab → fire alert in the staff tab */
window.addEventListener("storage", e=>{
  if(e.key === "sg_orders"){
    orders = store.get("sg_orders", []);
    notifyNewOrder();
  }
});

/* ============================================================
   PWA — installable + offline (only over http(s), not file://)
   ============================================================ */
if("serviceWorker" in navigator && location.protocol.startsWith("http")){
  window.addEventListener("load", ()=> navigator.serviceWorker.register("sw.js").catch(()=>{}));
}

/* ============================================================
   INIT
   ============================================================ */
renderCategories();
renderMenu();
renderCart();
initReserveDefaults();
refreshAdminCounts();
updateStickyCart();
