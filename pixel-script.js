(function (w, d) {
  // 1) Pixel Express pixel URL (DEFAULT-ON except GPC or user opt-out)
  var PIXEL_URL = "https://cdn.v3.identitypxl.app/pixels/a34a05a3-c540-4299-aa9b-80774b26c3ae/p.js";
  var PIXEL_ID  = "pixelexpress-superpixel";

  // 2) Keys
  var OPT_KEY = "us_privacy_optout"; // "1" = opted-out

  // 3) GPC / UOOM
  var hasGPC = !!(w.navigator && w.navigator.globalPrivacyControl === true);

  function isOptedOut() { try { return (w.localStorage && localStorage.getItem(OPT_KEY) === "1"); } catch(_) { return false; } }
  function canLoad()    { return !isOptedOut() && !hasGPC; }

  function loadPixel() {
    if (!canLoad() || d.getElementById(PIXEL_ID)) return;
    var s = d.createElement("script");
    s.src = PIXEL_URL; s.async = true; s.id = PIXEL_ID;
    d.head.appendChild(s);
  }
  function removePixel() {
    var s = d.getElementById(PIXEL_ID);
    if (s) s.remove();
  }
  function setOptOut(on) {
    try { localStorage.setItem(OPT_KEY, on ? "1" : "0"); } catch (e) {}
    if (on) removePixel(); else if (canLoad()) loadPixel();
  }

  // 4) Top-right panel (Continue to site + Settings) and footer link
  function injectConsentUI() {
    if (d.getElementById("privacy-choices-panel")) return;

    (function(){
      var css = [
        "#privacy-continue, #privacy-settings, #privacy-save, #privacy-x,",
        "#privacy-continue:hover, #privacy-settings:hover, #privacy-save:hover, #privacy-x:hover,",
        "#privacy-continue:active, #privacy-settings:active, #privacy-save:active, #privacy-x:active,",
        "#privacy-continue:focus, #privacy-settings:focus, #privacy-save:focus, #privacy-x:focus {outline:none!important;box-shadow:none!important;transition:none!important;}",
        "#privacy-choices-panel{color-scheme:light!important;color:#111!important;background:#fff!important;border-color:#ccc!important;}",
        "#privacy-choices-panel details{color:#555!important;}",
        "#privacy-settings, #privacy-save {color:#111!important;border-color:#111!important;background:#fff!important;}",
        "#privacy-continue, #privacy-continue:hover, #privacy-continue:active, #privacy-continue:focus {background:#01adc8!important;color:#fff!important;border-color:#01adc8!important;font-weight:700!important;}",
        "#privacy-x, #privacy-x:hover, #privacy-x:active, #privacy-x:focus {background:transparent!important;color:#111!important;border:none!important;font-weight:700!important;}"
      ].join("\n");
      var st = d.createElement("style"); st.textContent = css; d.head.appendChild(st);
    })();

    var panel = d.createElement("div");
    panel.id = "privacy-choices-panel";
    panel.style.cssText = "position:fixed;right:12px;top:12px;z-index:2147483647;background:#fff;border:1px solid #ccc;border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,.15);padding:14px 16px;max-width:380px;display:none;font:14px/1.45 system-ui,sans-serif;color:#111;color-scheme:light;min-height:180px;";

    var closeX = d.createElement("button");
    closeX.id = "privacy-x";
    closeX.textContent = "×";
    closeX.setAttribute("aria-label", "Close");
    closeX.style.cssText = "position:absolute; right:8px; top:6px; cursor:pointer; font-size:18px; line-height:1; background:transparent; border:none;";
    panel.appendChild(closeX);

    var header = d.createElement("div");
    header.style.cssText = "font-weight:600;margin-bottom:8px; padding-right:24px;";
    header.textContent = "Your Privacy Choices";
    panel.appendChild(header);

    var copy = d.createElement("div");
    copy.style.cssText = "font-size:13px;margin-bottom:10px;";
    copy.textContent = "To improve your experience, analytics and identity-based services are active. You can adjust your settings any time.";
    panel.appendChild(copy);

    var btnRow = d.createElement("div");
    btnRow.style.cssText = "display:flex;gap:8px;align-items:center;margin-bottom:10px;flex-wrap:wrap;";
    var continueBtn = d.createElement("button");
    continueBtn.id = "privacy-continue";
    continueBtn.textContent = "Continue to site";
    continueBtn.style.cssText = "padding:8px 12px;border:1px solid #01adc8;border-radius:8px;background:#01adc8;cursor:pointer;color:#fff;font-weight:700;";
    var settingsBtn = d.createElement("button");
    settingsBtn.id = "privacy-settings";
    settingsBtn.textContent = "Settings";
    settingsBtn.style.cssText = "padding:6px 10px;border:1px solid currentColor;border-radius:8px;background:#fff;cursor:pointer;color:inherit;";
    btnRow.appendChild(continueBtn); btnRow.appendChild(settingsBtn);
    panel.appendChild(btnRow);

    var customizeArea = d.createElement("div");
    customizeArea.id = "privacy-customize-area";
    customizeArea.style.cssText = "display:none;";

    var optRow = d.createElement("label");
    optRow.style.cssText = "display:flex;gap:8px;align-items:flex-start;margin:6px 0 10px;";
    var cb = d.createElement("input");
    cb.type = "checkbox"; cb.id = "privacy-optout";
    if (isOptedOut()) cb.checked = true;
    var cbText = d.createElement("span");
    cbText.textContent = "Do not sell or share my personal information / opt out of targeted advertising. We also honor browser signals like Global Privacy Control.";
    optRow.appendChild(cb); optRow.appendChild(cbText);
    customizeArea.appendChild(optRow);

    var actions = d.createElement("div");
    actions.style.cssText = "display:flex;gap:8px;margin-bottom:8px;";
    var saveBtn = d.createElement("button");
    saveBtn.id = "privacy-save";
    saveBtn.textContent = "Save";
    saveBtn.style.cssText = "padding:6px 10px;border:1px solid currentColor;border-radius:8px;background:#fff;cursor:pointer;color:inherit;";
    actions.appendChild(saveBtn);
    customizeArea.appendChild(actions);

    var details = d.createElement("details");
    details.style.cssText = "font-size:12px;color:#555;";
    var sum = d.createElement("summary"); sum.style.cssText = "cursor:pointer"; sum.textContent = "Privacy Notice (summary)";
    var body = d.createElement("div");
    body.style.cssText = "margin-top:8px;";
    body.textContent =
      "This site collects site-activity data (pages viewed, clicks, scrolls, time on page, and technical identifiers) " +
      "and shares it with our analytics/identity vendor to measure performance and provide interest-based services. " +
      "Use the controls above to opt out of sale/share or targeted advertising. We honor Global Privacy Control signals. " +
      "We do not knowingly sell/share personal information of consumers under 16. For a full policy, see the website’s Privacy Policy.";
    details.appendChild(sum); details.appendChild(body);
    customizeArea.appendChild(details);

    panel.appendChild(customizeArea);
    d.body.appendChild(panel);

    try {
      var linkWrap = d.createElement("div");
      linkWrap.style.cssText = "width:100%;text-align:center;margin-top:2px;margin-bottom:6px;";
      var footerLink = d.createElement("a");
      footerLink.href = "javascript:void(0)";
      footerLink.textContent = "Do Not Sell or Share My Personal Information";
      footerLink.style.cssText = "color:#666;font-size:12px;text-decoration:none;cursor:pointer;";
      footerLink.onclick = function(){
        cb.checked = isOptedOut();
        panel.style.display = (panel.style.display === "none" ? "block" : "none");
      };
      linkWrap.appendChild(footerLink);
      var footers = d.getElementsByTagName("footer");
      if (footers && footers[0]) { footers[0].appendChild(linkWrap); } else { d.body.appendChild(linkWrap); }
    } catch(e){}

    function toggleSettings() {
      cb.checked = isOptedOut();
      customizeArea.style.display = (customizeArea.style.display === "none" ? "block" : "none");
    }
    settingsBtn.onclick = toggleSettings;
    continueBtn.onclick = function(){ panel.style.display = "none"; };
    closeX.onclick = function(){ panel.style.display = "none"; };
    saveBtn.onclick  = function(){ setOptOut(cb.checked === true); panel.style.display = "none"; };

    if (!isOptedOut()) panel.style.display = "block";
  }

  // 5) Minimal API
  w.PrivacyChoices = {
    optOut: function(){ setOptOut(true); },
    optIn:  function(){ setOptOut(false); },
    status: function(){ return { gpc: hasGPC, optedOut: isOptedOut(), consent: !isOptedOut() }; },
    open:   function(){ var p=d.getElementById("privacy-choices-panel"); if (p) p.style.display="block"; }
  };

  // 6) Boot
  function boot(){ injectConsentUI(); if (canLoad()) loadPixel(); }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot); else boot();

  // SPA soft navigations
  var _push = history.pushState; history.pushState = function(){ _push.apply(this, arguments); if (canLoad()) loadPixel(); };
  w.addEventListener("popstate", function(){ if (canLoad()) loadPixel(); });
})(window, document);
