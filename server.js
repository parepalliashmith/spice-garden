/* ============================================================
   Spice Garden — tiny Node backend
   - Serves the static app (index.html, app.js, …)
   - Provides OTP endpoints:  POST /api/otp/send , POST /api/otp/verify
   - SMS provider is auto-selected from environment variables:
       • Twilio Verify  → TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID
       • Fast2SMS       → FAST2SMS_API_KEY   (India)
       • none set       → DEMO mode (code returned to the browser, shown on screen)
   No external dependencies — uses Node 18+ built-in fetch.
   ============================================================ */
const http = require("http");
const fs   = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const CC   = process.env.COUNTRY_CODE || "+91";

const TW_SID    = process.env.TWILIO_ACCOUNT_SID;
const TW_AUTH   = process.env.TWILIO_AUTH_TOKEN;
const TW_VERIFY = process.env.TWILIO_VERIFY_SERVICE_SID;
const F2S_KEY   = process.env.FAST2SMS_API_KEY;

const useTwilio   = !!(TW_SID && TW_AUTH && TW_VERIFY);
const useFast2sms = !useTwilio && !!F2S_KEY;
const MODE = useTwilio ? "twilio" : useFast2sms ? "fast2sms" : "demo";
console.log("OTP provider mode:", MODE);

/* in-memory OTP store (for demo + fast2sms; Twilio Verify keeps its own) */
const otps = new Map();          // phone -> { code, expires, tries }
const TTL  = 5 * 60 * 1000;
const gen6  = () => String(Math.floor(100000 + Math.random() * 900000));
const clean = p => String(p || "").replace(/\D/g, "").slice(-10);
const valid = p => /^\d{10}$/.test(p);

async function sendOtp(phone){
  if(useTwilio){
    const url = `https://verify.twilio.com/v2/Services/${TW_VERIFY}/Verifications`;
    const r = await fetch(url, {
      method:"POST",
      headers:{ Authorization:"Basic "+Buffer.from(`${TW_SID}:${TW_AUTH}`).toString("base64"),
                "Content-Type":"application/x-www-form-urlencoded" },
      body: new URLSearchParams({ To: CC+phone, Channel:"sms" })
    });
    if(!r.ok) throw new Error("twilio send " + r.status + " " + await r.text());
    return { mode:"sms" };
  }
  const code = gen6();
  otps.set(phone, { code, expires: Date.now()+TTL, tries:0 });
  if(useFast2sms){
    const url = `https://www.fast2sms.com/dev/bulkV3?authorization=${encodeURIComponent(F2S_KEY)}`
              + `&route=otp&variables_values=${code}&flash=0&numbers=${phone}`;
    const r = await fetch(url);
    if(!r.ok) throw new Error("fast2sms send " + r.status + " " + await r.text());
    return { mode:"sms" };
  }
  return { mode:"demo", code };     // demo: hand the code back so the UI can show it
}

async function verifyOtp(phone, code){
  if(useTwilio){
    const url = `https://verify.twilio.com/v2/Services/${TW_VERIFY}/VerificationCheck`;
    const r = await fetch(url, {
      method:"POST",
      headers:{ Authorization:"Basic "+Buffer.from(`${TW_SID}:${TW_AUTH}`).toString("base64"),
                "Content-Type":"application/x-www-form-urlencoded" },
      body: new URLSearchParams({ To: CC+phone, Code: String(code) })
    });
    const j = await r.json().catch(()=>({}));
    return j.status === "approved";
  }
  const rec = otps.get(phone);
  if(!rec) return false;
  if(Date.now() > rec.expires){ otps.delete(phone); return false; }
  if(++rec.tries > 6){ otps.delete(phone); return false; }
  const ok = rec.code === String(code);
  if(ok) otps.delete(phone);
  return ok;
}

/* ---------- helpers ---------- */
function readBody(req){
  return new Promise(res=>{
    let d=""; req.on("data",c=>{ d+=c; if(d.length>1e4) req.destroy(); });
    req.on("end",()=>{ try{ res(JSON.parse(d||"{}")); }catch{ res({}); } });
  });
}
function json(res, code, obj){ res.writeHead(code, {"Content-Type":"application/json"}); res.end(JSON.stringify(obj)); }

const TYPES = { ".html":"text/html",".js":"application/javascript",".css":"text/css",
  ".json":"application/json",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml",
  ".ico":"image/x-icon",".webmanifest":"application/manifest+json",".txt":"text/plain" };

function serveStatic(req, res){
  let rel = decodeURIComponent(req.url.split("?")[0]);
  if(rel === "/") rel = "/index.html";
  const file = path.normalize(path.join(ROOT, rel));
  if(!file.startsWith(ROOT)){ res.writeHead(403); return res.end("Forbidden"); }
  fs.readFile(file, (err, data)=>{
    if(err){ res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, {"Content-Type": TYPES[path.extname(file)] || "application/octet-stream"});
    res.end(data);
  });
}

/* ---------- server ---------- */
http.createServer(async (req, res)=>{
  if(req.url === "/api/health"){ return json(res, 200, { ok:true, otpMode:MODE }); }

  if(req.method === "POST" && req.url === "/api/otp/send"){
    const { phone } = await readBody(req);
    const p = clean(phone);
    if(!valid(p)) return json(res, 400, { error:"invalid phone" });
    try { return json(res, 200, await sendOtp(p)); }
    catch(e){ console.error(e.message); return json(res, 502, { error:"sms failed" }); }
  }

  if(req.method === "POST" && req.url === "/api/otp/verify"){
    const { phone, code } = await readBody(req);
    const p = clean(phone);
    if(!valid(p) || !code) return json(res, 400, { ok:false });
    try { return json(res, 200, { ok: await verifyOtp(p, code) }); }
    catch(e){ console.error(e.message); return json(res, 502, { ok:false }); }
  }

  serveStatic(req, res);
}).listen(PORT, ()=> console.log("Spice Garden running on port", PORT));
