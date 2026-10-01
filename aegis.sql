// Set the client's real email here; the form opens the visitor's email app addressed to it.
var CONTACT_EMAIL = "info@example.com";

document.getElementById("yr").textContent = new Date().getFullYear();

// Mobile menu
var btn = document.querySelector(".menu-btn"), menu = document.getElementById("menu");
btn.addEventListener("click", function(){
  var open = menu.classList.toggle("open");
  btn.setAttribute("aria-expanded", open);
});
menu.addEventListener("click", function(e){ if(e.target.tagName==="A"){ menu.classList.remove("open"); btn.setAttribute("aria-expanded","false"); }});

// Hero route: the escort marker travels the route once on load
(function(){
  var path = document.getElementById("done"), dot = document.getElementById("dot");
  var len = path.getTotalLength();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var end = path.getPointAtLength(len); dot.setAttribute("cx", end.x); dot.setAttribute("cy", end.y); return;
  }
  path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
  var start = null, dur = 4200;
  function step(t){
    if(!start) start = t;
    var p = Math.min((t - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
    path.style.strokeDashoffset = len * (1 - e);
    var pt = path.getPointAtLength(len * e);
    dot.setAttribute("cx", pt.x); dot.setAttribute("cy", pt.y);
    if(p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
})();

// Contact form
document.getElementById("form").addEventListener("submit", function(e){
  e.preventDefault();
  var f = e.target, msg = document.getElementById("msg");
  var name = f.name.value.trim(), email = f.email.value.trim(), details = f.details.value.trim();
  msg.className = "msg err";
  if(!name){ msg.textContent = "Enter your name."; f.name.focus(); return; }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ msg.textContent = "Enter a valid email address."; f.email.focus(); return; }
  if(!details){ msg.textContent = "Describe your movement so we can prepare a reply."; f.details.focus(); return; }
  var body = "Name: " + name + "\nEmail: " + email + "\nService: " + f.service.value + "\n\n" + details;
  window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent("Security request from " + name) + "&body=" + encodeURIComponent(body);
  msg.className = "msg ok"; msg.textContent = "Your email app is opening with the request ready to send.";
});