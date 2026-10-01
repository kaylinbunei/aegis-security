// Web3Forms access key. Enquiries are delivered to the email set up on the Web3Forms account.
var ACCESS_KEY = "174822d3-7a68-4662-b3e2-6b4d314653e4";

document.getElementById("yr").textContent = new Date().getFullYear();

// Mobile menu
var btn = document.querySelector(".menu-btn"), menu = document.getElementById("menu");
btn.addEventListener("click", function(){
  var open = menu.classList.toggle("open");
  btn.setAttribute("aria-expanded", open);
});
menu.addEventListener("click", function(e){ if(e.target.tagName==="A"){ menu.classList.remove("open"); btn.setAttribute("aria-expanded","false"); }});

// Hero route: the escort marker travels from departure to arrival, pauses, then starts again
(function(){
  var path = document.getElementById("done"), dot = document.getElementById("dot");
  var len = path.getTotalLength();
  function place(e){
    path.style.strokeDashoffset = len * (1 - e);
    var pt = path.getPointAtLength(len * e);
    dot.setAttribute("cx", pt.x); dot.setAttribute("cy", pt.y);
  }
  path.style.strokeDasharray = len;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { place(1); return; }
  var travel = 4200, pause = 1200, start = null;
  function step(t){
    if (start === null) start = t;
    var elapsed = t - start;
    var p = Math.min(elapsed / travel, 1);
    place(p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
    if (elapsed >= travel + pause) start = t;
    requestAnimationFrame(step);
  }
  place(0);
  requestAnimationFrame(step);
})();

// Contact form
document.getElementById("form").addEventListener("submit", function(e){
  e.preventDefault();
  var f = e.target, msg = document.getElementById("msg"), btn = document.getElementById("send");
  var name = f.elements["name"].value.trim(), email = f.elements["email"].value.trim(), details = f.elements["details"].value.trim();
  msg.className = "msg err";
  if(!name){ msg.textContent = "Enter your name."; f.elements["name"].focus(); return; }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ msg.textContent = "Enter a valid email address."; f.elements["email"].focus(); return; }
  if(!details){ msg.textContent = "Describe your movement so we can prepare a reply."; f.elements["details"].focus(); return; }

  btn.disabled = true; btn.textContent = "Sending...";
  msg.className = "msg"; msg.textContent = "";

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      subject: "New security request from " + name,
      from_name: "AEGIS Escort website",
      name: name,
      email: email,
      service: f.elements["service"].value,
      message: details,
      botcheck: f.elements["botcheck"].checked
    })
  })
  .then(function(r){ return r.json(); })
  .then(function(data){
    if(data.success){
      f.reset();
      msg.className = "msg ok";
      msg.textContent = "Request sent. We will reply to you shortly.";
    } else {
      throw new Error(data.message || "Request failed");
    }
  })
  .catch(function(){
    msg.className = "msg err";
    msg.textContent = "Your request could not be sent. Please check your connection and try again.";
  })
  .then(function(){ btn.disabled = false; btn.textContent = "Send request"; });
});
