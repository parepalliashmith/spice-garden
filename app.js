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
  { id:1, name:"Margherita Pizza", price:299, category:"Pizza",    emoji:"🍕", desc:"Classic tomato, mozzarella & basil." },
  { id:2, name:"Paneer Tikka",     price:249, category:"Starters", emoji:"🧆", desc:"Spiced grilled cottage cheese." },
  { id:3, name:"Veg Burger",       price:149, category:"Burgers",  emoji:"🍔", desc:"Crispy patty, lettuce & sauce." },
  { id:4, name:"Butter Chicken",   price:329, category:"Mains",    emoji:"🍛", desc:"Creamy tomato chicken curry." },
  { id:5, name:"Masala Dosa",      price:129, category:"Mains",    emoji:"🥞", desc:"Crispy dosa with potato filling." },
  { id:6, name:"French Fries",     price:99,  category:"Starters", emoji:"🍟", desc:"Golden, salted & crispy." },
  { id:7, name:"Chocolate Cake",   price:159, category:"Desserts", emoji:"🍰", desc:"Rich molten chocolate slice." },
  { id:8, name:"Cold Coffee",      price:119, category:"Drinks",   emoji:"🥤", desc:"Chilled blended coffee." },
];

let menu        = store.get("sg_menu", null) || (store.set("sg_menu", DEFAULT_MENU), DEFAULT_MENU);
let orders       = store.get("sg_orders", []);
let reservations = store.get("sg_res", []);
let cart         = {};            // id -> qty (session only)
let activeCat    = "All";

const $  = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const rupee = n => "₹" + n.toLocaleString("en-IN");
const emojiFor = c => ({Pizza:"🍕",Starters:"🍟",Burgers:"🍔",Mains:"🍛",Desserts:"🍰",Drinks:"🥤"}[c] || "🍴");

/* ============================================================
   NAVIGATION
   ============================================================ */
$$(".nav-btn").forEach(btn=>{
  btn.onclick = ()=>{
    $$(".nav-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    $$(".view").forEach(v=>v.classList.remove("active"));
    $("#view-"+btn.dataset.view).classList.add("active");
  };
});

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
  const items = menu.filter(m=> activeCat==="All" || m.category===activeCat);
  if(!items.length){ grid.innerHTML = `<p class="empty">No dishes here yet.</p>`; return; }
  items.forEach(m=>{
    const card = document.createElement("div");
    card.className = "dish";
    card.innerHTML = `
      <div class="emoji">${m.emoji || emojiFor(m.category)}</div>
      <h3>${m.name}</h3>
      <p class="desc">${m.desc || ""}</p>
      <div class="bottom">
        <span class="price">${rupee(m.price)}</span>
        <button class="btn primary small">Add +</button>
      </div>`;
    card.querySelector("button").onclick = ()=> addToCart(m.id);
    grid.appendChild(card);
  });
}

/* ============================================================
   CART
   ============================================================ */
function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  toast("Added to order");
}
function changeQty(id, delta){
  cart[id] = (cart[id] || 0) + delta;
  if(cart[id] <= 0) delete cart[id];
  renderCart();
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
}

function openCart(open){
  $("#cartDrawer").classList.toggle("show", open);
  $("#drawerOverlay").classList.toggle("show", open);
}
$("#cartPill").onclick   = ()=> openCart(true);
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
  cart = {}; renderCart();
  $("#orderForm").reset();
  $("#placeOrderBtn").textContent = "Pay & Place Order";
  openCart(false);
  refreshAdminCounts();
  toast(msg);
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
  document.body.classList.remove("can-menu","can-users");
  $("#adminDash").classList.add("hidden");
  $("#adminLogin").classList.remove("hidden");
};

/* show/hide tabs + label the current user according to role */
function applyPermissions(){
  $("#meName").textContent = me.user;
  const tag = $("#meRole");
  tag.textContent = ROLE_LABEL[me.role];
  tag.className = "role-tag " + me.role;

  document.body.classList.toggle("can-menu",  can.manageMenu(me.role));
  document.body.classList.toggle("can-users", can.manageUsers(me.role));

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
      <span class="n">${m.name}</span>
      <span class="c">${m.category}</span>
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
   INIT
   ============================================================ */
renderCategories();
renderMenu();
renderCart();
initReserveDefaults();
refreshAdminCounts();
