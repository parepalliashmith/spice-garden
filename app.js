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
  /* ---- Veg Starters ---- */
  { id:1,  name:"Paneer 65",          price:220, category:"Veg Starters", veg:"veg", tag:"Bestseller" },
  { id:2,  name:"Mushroom Chilli",    price:220, category:"Veg Starters", veg:"veg", tag:"" },
  { id:3,  name:"Mushroom Manchuria", price:220, category:"Veg Starters", veg:"veg", tag:"" },
  { id:4,  name:"Mushroom 65",        price:230, category:"Veg Starters", veg:"veg", tag:"" },
  { id:5,  name:"Veg Manchuria",      price:230, category:"Veg Starters", veg:"veg", tag:"" },
  { id:6,  name:"Chilli Paneer",      price:240, category:"Veg Starters", veg:"veg", tag:"Spicy" },
  { id:7,  name:"Paneer Majestic",    price:260, category:"Veg Starters", veg:"veg", tag:"" },
  { id:8,  name:"Paneer Hong Kong",   price:260, category:"Veg Starters", veg:"veg", tag:"" },
  { id:9,  name:"Kaju Fry",           price:280, category:"Veg Starters", veg:"veg", tag:"" },

  /* ---- Egg ---- */
  { id:10, name:"Boiled Eggs (2 Pcs)",price:30,  category:"Egg", veg:"nonveg", tag:"" },
  { id:11, name:"Egg Curry",          price:160, category:"Egg", veg:"nonveg", tag:"" },
  { id:12, name:"Egg Burji",          price:160, category:"Egg", veg:"nonveg", tag:"" },
  { id:13, name:"Egg Masala",         price:160, category:"Egg", veg:"nonveg", tag:"" },
  { id:14, name:"Egg Tomato Curry",   price:180, category:"Egg", veg:"nonveg", tag:"" },
  { id:15, name:"Egg Butter Masala",  price:190, category:"Egg", veg:"nonveg", tag:"" },
  { id:16, name:"Egg 65",             price:190, category:"Egg", veg:"nonveg", tag:"" },
  { id:17, name:"Egg Fry",            price:190, category:"Egg", veg:"nonveg", tag:"" },
  { id:18, name:"Egg Chilli",         price:190, category:"Egg", veg:"nonveg", tag:"" },
  { id:19, name:"Egg Manchuria",      price:190, category:"Egg", veg:"nonveg", tag:"" },

  /* ---- Chicken Starters ---- */
  { id:20, name:"Chicken Strips",        price:180, category:"Chicken Starters", veg:"nonveg", tag:"" },
  { id:21, name:"Lolly Pop Half Plate (3 Pcs)", price:180, category:"Chicken Starters", veg:"nonveg", tag:"" },
  { id:22, name:"Chicken Spring Roll",   price:190, category:"Chicken Starters", veg:"nonveg", tag:"" },
  { id:23, name:"Chicken 65",            price:240, category:"Chicken Starters", veg:"nonveg", tag:"Bestseller" },
  { id:24, name:"Chicken Manchuria",     price:250, category:"Chicken Starters", veg:"nonveg", tag:"" },
  { id:25, name:"Chicken Chilli",        price:250, category:"Chicken Starters", veg:"nonveg", tag:"Spicy" },
  { id:26, name:"Ginger Chicken (Dry)",  price:250, category:"Chicken Starters", veg:"nonveg", tag:"" },
  { id:27, name:"Chicken Fry (Bone)",    price:250, category:"Chicken Starters", veg:"nonveg", tag:"" },
  { id:28, name:"Schezwan Chicken",      price:250, category:"Chicken Starters", veg:"nonveg", tag:"Spicy" },
  { id:29, name:"Chicken Drum Sticks",   price:260, category:"Chicken Starters", veg:"nonveg", tag:"" },
  { id:30, name:"Chicken Lollypop",      price:260, category:"Chicken Starters", veg:"nonveg", tag:"" },
  { id:31, name:"Lemon Chicken",         price:270, category:"Chicken Starters", veg:"nonveg", tag:"" },
  { id:32, name:"Pepper Chicken",        price:270, category:"Chicken Starters", veg:"nonveg", tag:"" },
  { id:33, name:"Chicken Wings",         price:270, category:"Chicken Starters", veg:"nonveg", tag:"" },
  { id:34, name:"Lovely Chicken",        price:270, category:"Chicken Starters", veg:"nonveg", tag:"" },
  { id:35, name:"Chicken Roast (Bone)",  price:280, category:"Chicken Starters", veg:"nonveg", tag:"" },
  { id:36, name:"Chicken Majestic",      price:280, category:"Chicken Starters", veg:"nonveg", tag:"" },
  { id:37, name:"Chicken Fry (Boneless)",price:280, category:"Chicken Starters", veg:"nonveg", tag:"" },
  { id:38, name:"Chicken 555",           price:280, category:"Chicken Starters", veg:"nonveg", tag:"" },
  { id:39, name:"Punjabi Chicken",       price:280, category:"Chicken Starters", veg:"nonveg", tag:"" },
  { id:40, name:"Chicken Roast (Boneless)", price:290, category:"Chicken Starters", veg:"nonveg", tag:"" },
  { id:41, name:"Chicken Chettinadu",    price:290, category:"Chicken Starters", veg:"nonveg", tag:"" },
  { id:42, name:"Burhani Chicken",       price:300, category:"Chicken Starters", veg:"nonveg", tag:"" },

  /* ---- Fish ---- */
  { id:43, name:"Fish 65",        price:270, category:"Fish", veg:"nonveg", tag:"" },
  { id:44, name:"Fish Fry",       price:270, category:"Fish", veg:"nonveg", tag:"" },
  { id:45, name:"Fish Manchuria", price:270, category:"Fish", veg:"nonveg", tag:"" },
  { id:46, name:"Chilli Fish",    price:270, category:"Fish", veg:"nonveg", tag:"Spicy" },
  { id:47, name:"Ginger Fish",    price:290, category:"Fish", veg:"nonveg", tag:"" },
  { id:48, name:"Fish Roast",     price:290, category:"Fish", veg:"nonveg", tag:"" },
  { id:49, name:"Apollo Fish",    price:290, category:"Fish", veg:"nonveg", tag:"Bestseller" },

  /* ---- Prawns ---- */
  { id:50, name:"Prawns 65",     price:280, category:"Prawns", veg:"nonveg", tag:"" },
  { id:51, name:"Chilli Prawns", price:280, category:"Prawns", veg:"nonveg", tag:"Spicy" },
  { id:52, name:"Pepper Prawns", price:290, category:"Prawns", veg:"nonveg", tag:"" },
  { id:53, name:"Loose Prawns",  price:300, category:"Prawns", veg:"nonveg", tag:"" },
  { id:54, name:"Prawns Fry",    price:330, category:"Prawns", veg:"nonveg", tag:"" },

  /* ---- Tandoori Kababs ---- */
  { id:55, name:"Tangdi Kabab (1 Piece)",   price:120, category:"Tandoori", veg:"nonveg", tag:"" },
  { id:56, name:"Paneer Tikka",             price:250, category:"Tandoori", veg:"veg",    tag:"" },
  { id:57, name:"Chicken Tikka",            price:260, category:"Tandoori", veg:"nonveg", tag:"" },
  { id:58, name:"Tandoori Chicken (Half)",  price:300, category:"Tandoori", veg:"nonveg", tag:"" },
  { id:59, name:"Tandoori Chicken (Full)",  price:550, category:"Tandoori", veg:"nonveg", tag:"Chef's Special" },

  /* ---- Rotis & Breads ---- */
  { id:60, name:"Roti",          price:30, category:"Breads", veg:"veg", tag:"" },
  { id:61, name:"Butter Roti",   price:35, category:"Breads", veg:"veg", tag:"" },
  { id:62, name:"Plain Naan",    price:35, category:"Breads", veg:"veg", tag:"" },
  { id:63, name:"Plain Parotha", price:35, category:"Breads", veg:"veg", tag:"" },
  { id:64, name:"Butter Naan",   price:40, category:"Breads", veg:"veg", tag:"" },
  { id:65, name:"Kulcha",        price:45, category:"Breads", veg:"veg", tag:"" },
  { id:66, name:"Butter Paratha",price:45, category:"Breads", veg:"veg", tag:"" },
  { id:67, name:"Pudina Paratha",price:45, category:"Breads", veg:"veg", tag:"" },
  { id:68, name:"Lacha Paratha", price:45, category:"Breads", veg:"veg", tag:"" },
  { id:69, name:"Methi Paratha", price:50, category:"Breads", veg:"veg", tag:"" },
  { id:70, name:"Butter Kulcha", price:50, category:"Breads", veg:"veg", tag:"" },
  { id:71, name:"Aaloo Paratha", price:50, category:"Breads", veg:"veg", tag:"" },
  { id:72, name:"Masala Kulcha", price:50, category:"Breads", veg:"veg", tag:"" },
  { id:73, name:"Garlic Naan",   price:55, category:"Breads", veg:"veg", tag:"" },
  { id:74, name:"Paneer Paratha",price:60, category:"Breads", veg:"veg", tag:"" },

  /* ---- Veg Curries (Main Course) ---- */
  { id:75, name:"Tomato Curry",        price:140, category:"Veg Curries", veg:"veg", tag:"" },
  { id:76, name:"Plain Palak",         price:160, category:"Veg Curries", veg:"veg", tag:"" },
  { id:77, name:"Kadai Veg",           price:200, category:"Veg Curries", veg:"veg", tag:"" },
  { id:78, name:"Mix Veg Curry",       price:200, category:"Veg Curries", veg:"veg", tag:"" },
  { id:79, name:"Palak Paneer",        price:220, category:"Veg Curries", veg:"veg", tag:"" },
  { id:80, name:"Vegetable Maharani",  price:220, category:"Veg Curries", veg:"veg", tag:"" },
  { id:81, name:"Veg Kolhapuri",       price:220, category:"Veg Curries", veg:"veg", tag:"" },
  { id:82, name:"Veg Chatpat",         price:230, category:"Veg Curries", veg:"veg", tag:"" },
  { id:83, name:"Veg Jaipuri",         price:230, category:"Veg Curries", veg:"veg", tag:"" },
  { id:84, name:"Baby Corn Masala",    price:230, category:"Veg Curries", veg:"veg", tag:"" },
  { id:85, name:"Paneer Butter Masala",price:230, category:"Veg Curries", veg:"veg", tag:"Bestseller" },
  { id:86, name:"Kadai Paneer",        price:230, category:"Veg Curries", veg:"veg", tag:"" },
  { id:87, name:"Veg Shahi Kurma",     price:230, category:"Veg Curries", veg:"veg", tag:"" },
  { id:88, name:"Methi Chaman",        price:240, category:"Veg Curries", veg:"veg", tag:"" },
  { id:89, name:"Mushroom Curry",      price:240, category:"Veg Curries", veg:"veg", tag:"" },
  { id:90, name:"Paneer Chatpat",      price:250, category:"Veg Curries", veg:"veg", tag:"" },
  { id:91, name:"Paneer Kurma",        price:250, category:"Veg Curries", veg:"veg", tag:"" },
  { id:92, name:"Paneer Shahi Kurma",  price:250, category:"Veg Curries", veg:"veg", tag:"" },
  { id:93, name:"Malai Kofta",         price:260, category:"Veg Curries", veg:"veg", tag:"" },
  { id:94, name:"Tomato Kaju Curry",   price:260, category:"Veg Curries", veg:"veg", tag:"" },
  { id:95, name:"Kaju Paneer",         price:270, category:"Veg Curries", veg:"veg", tag:"" },
  { id:96, name:"Kaju Capsicum",       price:270, category:"Veg Curries", veg:"veg", tag:"" },
  { id:97, name:"Kaju Curry",          price:290, category:"Veg Curries", veg:"veg", tag:"" },

  /* ---- Chicken Curries (Main Course) ---- */
  { id:98,  name:"Chicken Curry (Bone)",        price:250, category:"Chicken Curries", veg:"nonveg", tag:"Bestseller" },
  { id:99,  name:"Butter Chicken",              price:270, category:"Chicken Curries", veg:"nonveg", tag:"Bestseller" },
  { id:100, name:"Chicken Chettinad (Bone)",    price:270, category:"Chicken Curries", veg:"nonveg", tag:"" },
  { id:101, name:"Dumka Chicken",               price:280, category:"Chicken Curries", veg:"nonveg", tag:"" },
  { id:102, name:"Methi Chicken",               price:280, category:"Chicken Curries", veg:"nonveg", tag:"" },
  { id:103, name:"Chicken Afghani",             price:300, category:"Chicken Curries", veg:"nonveg", tag:"" },
  { id:104, name:"Kaju Chicken",                price:320, category:"Chicken Curries", veg:"nonveg", tag:"" },
  { id:105, name:"Ginger Chicken Curry",        price:260, category:"Chicken Curries", veg:"nonveg", tag:"" },
  { id:106, name:"Chicken Curry (Boneless)",    price:270, category:"Chicken Curries", veg:"nonveg", tag:"" },
  { id:107, name:"Kadai Chicken",               price:280, category:"Chicken Curries", veg:"nonveg", tag:"" },
  { id:108, name:"Chicken Kolhapuri",           price:280, category:"Chicken Curries", veg:"nonveg", tag:"" },
  { id:109, name:"Mughlai Chicken",             price:290, category:"Chicken Curries", veg:"nonveg", tag:"" },
  { id:110, name:"Chicken Chettinad (Boneless)",price:290, category:"Chicken Curries", veg:"nonveg", tag:"" },
  { id:111, name:"Chicken Maharani",            price:300, category:"Chicken Curries", veg:"nonveg", tag:"" },

  /* ---- Mutton ---- */
  { id:112, name:"Andhra Mutton", price:300, category:"Mutton", veg:"nonveg", tag:"Spicy" },
  { id:113, name:"Mutton Curry",  price:300, category:"Mutton", veg:"nonveg", tag:"" },
  { id:114, name:"Mutton Fry",    price:320, category:"Mutton", veg:"nonveg", tag:"" },

  /* ---- Fish & Prawns (Main Course) ---- */
  { id:115, name:"Fish Curry",   price:290, category:"Seafood", veg:"nonveg", tag:"" },
  { id:116, name:"Prawns Curry", price:300, category:"Seafood", veg:"nonveg", tag:"" },
];
const MENU_VERSION = 3;   // bump when DEFAULT_MENU changes

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

let menu = store.get("sg_menu", null);
/* on a menu-version bump, load the full current menu for everyone (this release is a complete menu) */
if(!menu || store.get("sg_menu_v", 0) < MENU_VERSION){
  menu = DEFAULT_MENU.map(d=>({...d}));
  store.set("sg_menu", menu);
  store.set("sg_menu_v", MENU_VERSION);
}
let orders       = store.get("sg_orders", []);
let reservations = store.get("sg_res", []);
let myOrderIds   = store.get("sg_myorders", []);
let cart         = store.get("sg_cart", []);          // array of line items — survives refresh
let favs         = store.get("sg_favs", []);          // favourite item ids
let activeCat    = "All";
let searchTerm   = "";
let vegOnly      = store.get("sg_vegonly", false);
let tip          = 0;
let promo        = null;                               // {code, ...PROMOS[code]}
let profile      = store.get("sg_profile", {});        // remembered name/phone/address

const $  = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const rupee = n => "₹" + Math.round(n).toLocaleString("en-IN");
const emojiFor = c => ({
  "Veg Starters":"🥗","Egg":"🥚","Chicken Starters":"🍗","Fish":"🐟","Prawns":"🦐",
  "Tandoori":"🍢","Breads":"🫓","Veg Curries":"🍲","Chicken Curries":"🍛","Mutton":"🍖","Seafood":"🦞",
  Pizza:"🍕",Starters:"🍟",Burgers:"🍔",Mains:"🍛",Desserts:"🍰",Drinks:"🥤","Rice & Noodles":"🍚",Biryani:"🍛"
}[c] || "🍴");
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
    "promo.apply":"Apply","tip.label":"Tip the staff","filter.veg":"Veg only",
    "confirm.title":"Order Confirmed!","confirm.no":"Your order number is","confirm.eta":"Ready in about",
    "confirm.track":"Track my order","confirm.keep":"Keep browsing",
    "welcome.title":"Welcome to Spice Garden!","welcome.sub":"Ordering is quick and easy:",
    "welcome.s1":"Browse the menu and tap a dish to customize it.","welcome.s2":"Add to cart, then pay online or choose cash.",
    "welcome.s3":"Track your order live in “My Orders”.","welcome.s4":"Tap the mic to fill forms by voice.","welcome.start":"Start ordering",
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
    "promo.apply":"लागू करें","tip.label":"स्टाफ़ को टिप दें","filter.veg":"शाकाहारी",
    "confirm.title":"ऑर्डर कन्फर्म!","confirm.no":"आपका ऑर्डर नंबर है","confirm.eta":"लगभग तैयार",
    "confirm.track":"ऑर्डर ट्रैक करें","confirm.keep":"और देखें",
    "welcome.title":"स्पाइस गार्डन में स्वागत है!","welcome.sub":"ऑर्डर करना आसान है:",
    "welcome.s1":"मेन्यू देखें और कस्टमाइज़ करने के लिए डिश पर टैप करें।","welcome.s2":"कार्ट में जोड़ें, फिर ऑनलाइन या कैश से भुगतान करें।",
    "welcome.s3":"“मेरे ऑर्डर” में अपना ऑर्डर लाइव ट्रैक करें।","welcome.s4":"फ़ॉर्म आवाज़ से भरने के लिए माइक दबाएँ।","welcome.start":"ऑर्डर शुरू करें",
  },
  te:{
    "nav.menu":"మెను","nav.reserve":"బుకింగ్","nav.orders":"నా ఆర్డర్లు","nav.admin":"అడ్మిన్",
    "hero.title":"స్పైస్ గార్డెన్‌కు స్వాగతం","hero.sub":"తాజా, రుచికరమైన ఆహారం — టేక్‌అవే లేదా డైన్-ఇన్ ఆర్డర్ చేయండి.",
    "search.ph":"వంటకాలను వెతకండి — ఉదా. పిజ్జా, పనీర్…",
    "orders.title":"నా ఆర్డర్లు","orders.sub":"ఈ పరికరం నుండి చేసిన ఆర్డర్లను ట్రాక్ చేయండి.",
    "reserve.title":"టేబుల్ బుక్ చేయండి","reserve.sub":"మీ స్థలాన్ని రిజర్వ్ చేయండి, మేము సిద్ధంగా ఉంచుతాం.","reserve.btn":"బుకింగ్ నిర్ధారించండి",
    "admin.login":"స్టాఫ్ లాగిన్",
    "f.name":"పేరు","f.phone":"ఫోన్","f.date":"తేదీ","f.time":"సమయం","f.guests":"ఎంత మంది",
    "f.requests":"ప్రత్యేక అభ్యర్థనలు","f.type":"ఆర్డర్ రకం","f.address":"డెలివరీ చిరునామా","f.landmark":"ల్యాండ్‌మార్క్","f.pay":"చెల్లింపు",
    "cart.title":"మీ ఆర్డర్","cart.view":"కార్ట్ చూడండి",
    "cz.size":"పరిమాణం","cz.spice":"కారం స్థాయి","cz.addons":"యాడ్-ఆన్‌లు","cz.note":"ప్రత్యేక సూచనలు",
    "promo.apply":"వర్తింపజేయండి","tip.label":"సిబ్బందికి టిప్","filter.veg":"శాకాహారం మాత్రమే",
    "confirm.title":"ఆర్డర్ నిర్ధారించబడింది!","confirm.no":"మీ ఆర్డర్ నంబర్","confirm.eta":"దాదాపు సిద్ధం",
    "confirm.track":"నా ఆర్డర్ ట్రాక్ చేయండి","confirm.keep":"బ్రౌజ్ కొనసాగించండి",
    "welcome.title":"స్పైస్ గార్డెన్‌కు స్వాగతం!","welcome.sub":"ఆర్డర్ చేయడం చాలా సులభం:",
    "welcome.s1":"మెనూ చూసి, కస్టమైజ్ చేయడానికి వంటకంపై నొక్కండి.","welcome.s2":"కార్ట్‌కు జోడించి, ఆన్‌లైన్ లేదా నగదుతో చెల్లించండి.",
    "welcome.s3":"“నా ఆర్డర్లు”లో మీ ఆర్డర్‌ను లైవ్‌గా ట్రాక్ చేయండి.","welcome.s4":"వాయిస్‌తో ఫారమ్‌లు నింపడానికి మైక్ నొక్కండి.","welcome.start":"ఆర్డర్ ప్రారంభించండి",
  }
};
const LANGS = ["en","hi","te"];
const LANG_LABEL = { en:"EN", hi:"हि", te:"తె" };
let lang = store.get("sg_lang", "en");
if(!LANGS.includes(lang)) lang = "en";
function applyLang(){
  const dict = I18N[lang];
  $$("[data-i18n]").forEach(el=>{ const v = dict[el.dataset.i18n]; if(v!=null) el.textContent = v; });
  $$("[data-i18n-ph]").forEach(el=>{ const v = dict[el.dataset.i18nPh]; if(v!=null) el.placeholder = v; });
  $("#langBtn").textContent = LANG_LABEL[lang];
  document.documentElement.lang = lang;
}
$("#langBtn").onclick = ()=>{
  lang = LANGS[(LANGS.indexOf(lang)+1) % LANGS.length];
  store.set("sg_lang", lang); applyLang();
};

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

/* veg-only filter */
function applyVegToggle(){
  const b = $("#vegToggle");
  b.classList.toggle("on", vegOnly);
  b.setAttribute("aria-pressed", vegOnly ? "true" : "false");
}
$("#vegToggle").onclick = ()=>{ vegOnly = !vegOnly; store.set("sg_vegonly", vegOnly); applyVegToggle(); renderMenu(); };

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
    const vegOk = !vegOnly || m.veg==="veg";
    return catOk && vegOk && searchMatches(m, searchTerm);
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
    // rate the order once it's completed
    if(!cancelled && si>=STAGES.length-1){
      const rate = document.createElement("div");
      rate.className = "rate-box";
      if(o.rating){
        rate.innerHTML = `<span class="muted small">You rated:</span> <span class="stars-static">${"★".repeat(o.rating)}${"☆".repeat(5-o.rating)}</span>`;
      } else {
        rate.innerHTML = `<span class="muted small">Rate your order:</span> <span class="stars" role="group" aria-label="Rate this order"></span>`;
        const box = rate.querySelector(".stars");
        for(let n=1;n<=5;n++){
          const st = document.createElement("button");
          st.className="star"; st.textContent="☆"; st.setAttribute("aria-label", n+" star"+(n>1?"s":""));
          st.onmouseenter = ()=> [...box.children].forEach((c,i)=> c.textContent = i<n ? "★" : "☆");
          st.onmouseleave = ()=> [...box.children].forEach(c=> c.textContent = "☆");
          st.onclick = ()=> rateOrder(o, n);
          box.appendChild(st);
        }
      }
      row.appendChild(rate);
    }
    wrap.appendChild(row);
  });
  updateEtas();
}

function rateOrder(o, n){
  o.rating = n;
  store.set("sg_orders", orders);
  renderMyOrders();
  toast("⭐ Thanks for rating!");
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
/* ---- users are now phone-based: { phone, role, status, name } ---- */
/* seed one Super Admin to bootstrap (change/replace from Manage Users) */
const DEFAULT_USERS=[
  { phone:"9999999999", role:"superadmin", status:"active", name:"Owner" },
];
let users = store.get("sg_users", null);
if(!users || !users[0] || !users[0].phone){   // none, or old username/password format → reseed
  users = DEFAULT_USERS.map(u=>({...u}));
  store.set("sg_users", users);
}
function saveUsers(){ store.set("sg_users", users); }
function findUser(phone){ return users.find(u=>u.phone===phone); }

/* session: who is logged in. role 'customer' for ordinary customers. */
let session = store.get("sg_session", null);
let me = null;   // set to the session only when it's a team member (staff/admin/superadmin)

const cleanPhone = s => (s||"").replace(/\D/g,"").slice(-10);
const validPhone = p => /^\d{10}$/.test(p);

/* ============================================================
   OTP — talks to the backend (/api/otp/*).
   If the backend isn't reachable (e.g. opened as a static file),
   it falls back to a client-side demo code so login still works.
   ============================================================ */
let pendingPhone = null, pendingRole = null;
let fallbackCode = null;        // set only when backend is unreachable (offline demo)

async function apiSendOtp(phone){
  try{
    const r = await fetch("/api/otp/send", {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ phone })
    });
    if(!r.ok) throw new Error("send " + r.status);
    fallbackCode = null;
    return await r.json();                 // { mode:"sms" } or { mode:"demo", code }
  }catch(_){
    fallbackCode = String(Math.floor(100000 + Math.random()*900000));
    return { mode:"demo", code: fallbackCode, offline:true };
  }
}
async function apiVerifyOtp(phone, code){
  if(fallbackCode != null) return code === fallbackCode;   // offline demo
  try{
    const r = await fetch("/api/otp/verify", {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ phone, code })
    });
    if(!r.ok) return false;
    return !!(await r.json()).ok;
  }catch(_){ return false; }
}

/* ============================================================
   LOGIN GATE
   ============================================================ */
let authRole = "customer";   // tab choice: customer | staff
function updateRoleNotes(){
  $("#customerNote").classList.toggle("hidden", authRole!=="customer");
  $("#staffNote").classList.toggle("hidden", authRole!=="staff");
}
$$(".auth-tab").forEach(t=> t.onclick = ()=>{
  $$(".auth-tab").forEach(x=>x.classList.remove("active"));
  t.classList.add("active");
  authRole = t.dataset.role;
  showAuthStep("phone");
  $("#authMsg").textContent=""; $("#authMsg").className="auth-msg";
  updateRoleNotes();
});
function showAuthStep(which){
  $("#authPhoneStep").classList.toggle("hidden", which!=="phone");
  $("#authOtpStep").classList.toggle("hidden", which!=="otp");
}
function openGate(){ $("#authGate").classList.add("show"); showAuthStep("phone"); updateRoleNotes(); }
function closeGate(){ $("#authGate").classList.remove("show"); }

$("#sendOtpBtn").onclick = async ()=>{
  const phone = cleanPhone($("#authPhone").value);
  const msg = $("#authMsg");
  if(!validPhone(phone)){ msg.className="auth-msg bad"; msg.textContent="Enter a valid 10-digit number"; return; }
  pendingPhone = phone; pendingRole = authRole;
  const btn = $("#sendOtpBtn"); btn.disabled = true; btn.textContent = "Sending…";
  const res = await apiSendOtp(phone);
  btn.disabled = false; btn.textContent = "Send OTP";
  $("#otpToPhone").textContent = "+91 " + phone;
  $("#authOtp").value = "";
  if(res.mode === "demo"){
    $("#demoOtp").className = "demo-otp show";
    $("#demoOtp").innerHTML = `Demo OTP: <strong>${res.code}</strong><br>`
      + `<span class="muted small">${res.offline ? "offline demo" : "real SMS once a provider is configured"}</span>`;
  } else {
    $("#demoOtp").className = "demo-otp"; $("#demoOtp").innerHTML = "";
  }
  $("#authMsg2").textContent = ""; $("#authMsg2").className = "auth-msg";
  showAuthStep("otp");
};
$("#otpBackBtn").onclick = ()=> showAuthStep("phone");
$("#verifyOtpBtn").onclick = async ()=>{
  const msg = $("#authMsg2");
  const btn = $("#verifyOtpBtn"); btn.disabled = true; btn.textContent = "Verifying…";
  const ok = await apiVerifyOtp(pendingPhone, $("#authOtp").value.trim());
  btn.disabled = false; btn.textContent = "Verify & Continue";
  if(!ok){ msg.className="auth-msg bad"; msg.textContent="Wrong or expired code"; return; }
  loginVerified(pendingPhone, pendingRole);
};

/* called after OTP is confirmed */
function loginVerified(phone, intendedRole){
  const u = findUser(phone);
  if(intendedRole === "staff"){
    if(u && u.status==="active"){              // approved team member (staff/admin/superadmin)
      setSession({ phone, role:u.role, name:u.name||"" });
      toast(`Welcome, ${ROLE_LABEL[u.role]}`);
    } else if(u && u.status==="pending"){
      $("#authMsg2").className="auth-msg bad";
      $("#authMsg2").textContent="Your staff access is awaiting admin approval.";
    } else {                                   // new staff request → goes on hold
      users.push({ phone, role:"staff", status:"pending", name:"" });
      saveUsers();
      $("#authMsg2").className="auth-msg good";
      $("#authMsg2").textContent="✅ Request sent! An admin will approve your staff access.";
    }
  } else {
    // customer: if this phone is actually a team member, still let them in as customer
    setSession({ phone, role:"customer", name:(u&&u.name)||"" });
    profile = { ...profile, phone };
    store.set("sg_profile", profile);
    fillProfile();
    toast("✅ Logged in — happy ordering!");
  }
}

function setSession(s){
  session = s; store.set("sg_session", session);
  applySession();
  closeGate();
  if(session.role==="customer"){ showView("menu"); maybeShowWelcome(); }
}
function applySession(){
  const team = session && session.role!=="customer";
  me = team ? session : null;
  document.body.classList.toggle("is-team", !!team);
  $("#sessionBtn").hidden = !session;
  if(team){ applyPermissions(); renderAdmin(); }
  else {
    document.body.classList.remove("can-menu","can-users","can-revenue");
  }
}

/* account button / dashboard logout → sign out */
function logout(){
  if(!confirm("Log out?")) return;
  session = null; me = null;
  localStorage.removeItem("sg_session");
  document.body.classList.remove("is-team","can-menu","can-users","can-revenue");
  $("#sessionBtn").hidden = true;
  showView("menu");
  openGate();
}
$("#sessionBtn").onclick = logout;
$("#logoutBtn").onclick = logout;

function applyPermissions(){
  $("#meName").textContent = me.name ? `${me.name} (${me.phone})` : me.phone;
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

/* add a team member directly by phone (super admin → admin/staff, admin → staff) */
$("#userForm").onsubmit = e=>{
  e.preventDefault(); const f=e.target;
  const phone = cleanPhone(f.phone.value), role=f.role.value, name=f.name.value.trim();
  if(!validPhone(phone)){ toast("Enter a valid 10-digit number"); return; }
  if(!can.managesRole(me.role,role)){ toast("You can't assign that role"); return; }
  const ex = findUser(phone);
  if(ex){ ex.role=role; ex.status="active"; if(name) ex.name=name; toast("Updated — now "+ROLE_LABEL[role]); }
  else { users.push({ phone, role, status:"active", name }); toast(`${ROLE_LABEL[role]} added (${phone})`); }
  saveUsers(); f.reset(); renderUsers();
};

/* approve / reject pending staff requests (admin & super admin) */
function renderPending(){
  const box=$("#pendingBox"); if(!box) return;
  const pend = users.filter(u=>u.status==="pending");
  if(!pend.length){ box.innerHTML=""; return; }
  box.innerHTML = `<h4 class="users-h">Pending staff approvals (${pend.length})</h4>`;
  pend.forEach(u=>{
    const card=document.createElement("div"); card.className="pending-card";
    card.innerHTML=`<div class="top">
        <div><span class="who">🧑‍🍳 ${u.phone}</span> <span class="status-pill">ON HOLD</span></div>
        <div class="card-actions"></div></div>`;
    const acts=card.querySelector(".card-actions");
    const ok=document.createElement("button"); ok.className="btn primary small"; ok.textContent="✓ Accept";
    ok.onclick=()=>{ u.status="active"; u.role="staff"; saveUsers(); renderUsers(); toast(`Approved staff ${u.phone}`); };
    const no=document.createElement("button"); no.className="btn danger small"; no.textContent="Reject";
    no.onclick=()=>{ users=users.filter(x=>x.phone!==u.phone); saveUsers(); renderUsers(); toast(`Rejected ${u.phone}`); };
    acts.appendChild(ok); acts.appendChild(no);
    box.appendChild(card);
  });
}

function renderUsers(){
  renderPending();
  const wrap=$("#userList"); if(!wrap) return; wrap.innerHTML="";
  users.filter(u=>u.status==="active").forEach(u=>{
    const isMe = me && u.phone===me.phone;
    const row=document.createElement("div"); row.className="menu-edit-row";
    row.innerHTML=`
      <span style="font-size:20px">${ROLE_EMOJI[u.role]}</span>
      <span class="n">${u.name?u.name+' · ':''}${u.phone}${isMe?'  <span class="c">(you)</span>':''}</span>
      <span class="user-role-pill role-tag ${u.role}">${ROLE_LABEL[u.role]}</span>`;
    if(me && !isMe && can.managesRole(me.role,u.role)){
      const del=document.createElement("button"); del.className="btn danger small"; del.textContent="Remove";
      del.onclick=()=>{ users=users.filter(x=>x.phone!==u.phone); saveUsers(); renderUsers(); toast(`Removed ${u.phone}`); };
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
    mic.setAttribute("aria-label", "Speak to fill this field");
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
  rec.lang = { hi:"hi-IN", te:"te-IN", en:"en-US" }[lang] || "en-US";
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
   INSTALL APP (PWA install prompt)
   ============================================================ */
let deferredInstall = null;
window.addEventListener("beforeinstallprompt", e=>{
  e.preventDefault();
  deferredInstall = e;
  $("#installBtn").hidden = false;
});
$("#installBtn").onclick = async ()=>{
  if(!deferredInstall){ toast("Open the browser menu → ‘Install app’ / ‘Add to Home screen’"); return; }
  deferredInstall.prompt();
  await deferredInstall.userChoice;
  deferredInstall = null;
  $("#installBtn").hidden = true;
};
window.addEventListener("appinstalled", ()=>{ $("#installBtn").hidden = true; toast("✅ App installed!"); });

/* ============================================================
   OFFLINE BANNER
   ============================================================ */
function updateOnline(){ $("#offlineBar").classList.toggle("show", !navigator.onLine); }
window.addEventListener("online", ()=>{ updateOnline(); toast("✅ Back online"); });
window.addEventListener("offline", updateOnline);

/* ============================================================
   WELCOME GUIDE (first visit only)
   ============================================================ */
$("#welcomeStart").onclick = ()=> $("#welcomeOverlay").classList.remove("show");
function maybeShowWelcome(){
  if(!store.get("sg_seenWelcome", false)){
    $("#welcomeOverlay").classList.add("show");
    store.set("sg_seenWelcome", true);
  }
}

/* ============================================================
   INIT
   ============================================================ */
applyLang();
applyTheme();
applyVegToggle();
renderCategories();
renderMenu();
renderCart();
initReserveDefaults();
fillProfile();
refreshAdminCounts();
updateStickyCart();
attachVoice();
startEtaTicker();
updateOnline();

/* auth gate: resume an existing session, or ask the user to log in */
applySession();
if(!session){
  openGate();
} else if(session.role === "customer"){
  maybeShowWelcome();
}
