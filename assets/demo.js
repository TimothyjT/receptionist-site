"use strict";
/*
 * Willa try-it demo. The "shop" is fictional (Bluebonnet Plumbing), the facts
 * below are its whole knowledge base, and Willa answers only from that list.
 * Ask something that isn't on the list and she says so — same rule as the
 * real product. Nothing typed here leaves the page.
 */
var WILLA_KB = [
  {
    keys: ["hour", "open", "close", "when are you", "what time"],
    answer: "Bluebonnet Plumbing is open Monday through Saturday, 7 in the morning to 7 in the evening. After hours I still answer, mostly for emergencies like a burst pipe."
  },
  {
    keys: ["water heater", "tankless"],
    answer: "A standard water heater install starts at $1,450, and that includes the unit. A tankless install starts at $2,100."
  },
  {
    keys: ["drain", "clog", "blocked"],
    answer: "Drain clearing is $129 flat. No hourly meter running while the tech works."
  },
  {
    keys: ["leak", "diagnostic", "visit cost", "come look", "come out"],
    answer: "For a leak, the visit to find it costs $79. If you have us do the repair, that $79 comes off the bill."
  },
  {
    keys: ["faucet", "tap"],
    answer: "Faucet installation is $185, plus the faucet itself if you don't already have one."
  },
  {
    keys: ["area", "round rock", "cedar park", "austin", "where do you", "come to", "serve", "service area"],
    answer: "The shop covers Austin, Round Rock, and Cedar Park."
  },
  {
    keys: ["warranty", "guarantee", "guaranteed"],
    answer: "Labor is guaranteed for a year. If our work fails within that year, we come back and make it right."
  },
  {
    keys: ["burst", "emergency", "flood", "flooding", "pipe broke", "pipe burst"],
    answer: "If a pipe has burst, turn the water off at the main shutoff if you can. On a real call I would mark it an emergency right then: text the owner, try his phone, and if he didn't pick up, call you back myself with the next step. Nobody gets left waiting."
  },
  {
    keys: ["book", "appointment", "schedule", "come thursday", "come friday", "slot"],
    answer: "On a real call I check the shop's calendar and book you on the spot, then read the day and time back to you before I hang up. This demo can't hold a real slot, but the next openings I would offer are Thursday at 9 in the morning and Friday at 1."
  },
  {
    keys: ["who are you", "are you a robot", "are you real", "are you human", "your name"],
    answer: "I'm Willa, the automated receptionist for Bluebonnet Plumbing, which is a made-up shop built for this demo. A real setup works the same way: I answer from the shop's own facts, and anything I can't answer goes to the owner."
  },
  {
    keys: ["person", "human", "owner", "someone real", "talk to a"],
    answer: "Of course. On a real call, asking for a person is enough: during opening hours I'd put you through, and after hours I'd take your number and have the owner call you back. I never argue about it."
  },
  {
    keys: ["price", "cost", "how much", "charge"],
    answer: "The prices I have are: water heater install from $1,450, tankless from $2,100, drain clearing $129 flat, faucet install $185, and a leak-finding visit for $79 that comes off the repair bill. Ask me about any one of them."
  }
];

var WILLA_FALLBACK =
  "That's not one of the facts I have for Bluebonnet, so I won't guess at it. On a real call I'd offer to have the owner call you back with the answer. Try asking me about hours, prices, the service area, or what happens in an emergency.";

function willaMatch(question) {
  var q = " " + String(question || "").toLowerCase() + " ";
  var best = null, bestScore = 0;
  for (var i = 0; i < WILLA_KB.length; i++) {
    var entry = WILLA_KB[i], score = 0;
    for (var j = 0; j < entry.keys.length; j++) {
      if (q.indexOf(entry.keys[j]) !== -1) score += entry.keys[j].length;
    }
    if (score > bestScore) { bestScore = score; best = entry; }
  }
  return bestScore > 0 ? best.answer : WILLA_FALLBACK;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { WILLA_KB: WILLA_KB, WILLA_FALLBACK: WILLA_FALLBACK, willaMatch: willaMatch };
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("tryit-form");
    if (!form) return;
    var input = document.getElementById("tryit-input");
    var answerBox = document.getElementById("tryit-answer-text");
    var micBtn = document.getElementById("tryit-mic");

    function speak(text) {
      if (!("speechSynthesis" in window)) return;
      try {
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text);
        u.lang = "en-US";
        u.rate = 1.0;
        var voices = window.speechSynthesis.getVoices();
        for (var i = 0; i < voices.length; i++) {
          var v = voices[i];
          if (/en[-_]US/i.test(v.lang) && /female|zira|aria|jenny|samantha/i.test(v.name)) { u.voice = v; break; }
          if (/en[-_]US/i.test(v.lang) && !u.voice) u.voice = v;
        }
        window.speechSynthesis.speak(u);
      } catch (e) { /* text answer is already on screen */ }
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = function () {};
    }

    function ask(text) {
      var q = (text || input.value || "").trim();
      if (!q) return;
      var a = willaMatch(q);
      answerBox.textContent = a;
      speak(a);
    }

    form.addEventListener("submit", function (ev) { ev.preventDefault(); ask(); });
    var chips = form.querySelectorAll(".tryit-chip");
    for (var c = 0; c < chips.length; c++) {
      chips[c].addEventListener("click", function () { input.value = this.textContent; ask(this.textContent); });
    }

    var Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (Rec && micBtn) {
      micBtn.hidden = false;
      micBtn.addEventListener("click", function () {
        var r = new Rec();
        r.lang = "en-US";
        r.interimResults = false;
        micBtn.textContent = "Listening…";
        r.onresult = function (ev) {
          var said = ev.results[0][0].transcript;
          input.value = said;
          micBtn.textContent = "Speak a question";
          ask(said);
        };
        r.onend = function () { micBtn.textContent = "Speak a question"; };
        r.onerror = function () { micBtn.textContent = "Speak a question"; };
        r.start();
      });
    }
  });
}
