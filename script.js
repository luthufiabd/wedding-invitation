/* =====================================================================
   EDIT EVERYTHING BELOW. This single object controls the whole page —
   names, dates, venue, map, dress code, and the blessing text.
   Leave any text field as an empty string '' to hide that line entirely.
===================================================================== */
const CONFIG = {

  // ---- Couple -----------------------------------------------------
  groomName:    "Luthufi Abdul Latheef",
  groomParents: "S/o Abdul Latheef Kunhahammed & Sunnera Thayyil",   // leave '' to hide
  brideName:    "Lujeen Abdul Jabbar",
  brideParents: "D/o Abdul Jabbar Kunnath Kalathingal & Suneera MA",   // leave '' to hide

  tagline: "Together with their families, request the honour of your presence",

  // ---- Event --------------------------------------------------------
  eventName: "Waleema",                 // shown as "Counting down to the ___" and the card eyebrow
  // Date & time the event starts. Keep the format YYYY-MM-DDTHH:MM:SS+05:30
  // (the +05:30 is the India time zone offset — change it if you're elsewhere).
  eventDateISO: "2026-08-16T11:00:00+05:30",
  eventTimeLabel: "11:00 AM – 2:30 PM",    // free text shown under the date
  eventDurationHours: 3,                // used only for the "Add to Calendar" file

  // Optional Hijri date. If left blank, the page tries to estimate one
  // automatically from the Gregorian date (approximate — Hijri months
  // officially depend on moon sighting). Type your confirmed date here
  // to override the estimate, e.g. "11 Rabi al-Awwal 1448".
  eventHijriOverride: "",

  // ---- Venue ----------------------------------------------------------
  venueName: "Fora Castle Auditorium",
  venueAddress: "Chemrakkattur - Areecode - Kondotty Rd",  // \n = line break
  dressCode: "",          // leave '' to hide the whole dress-code line

  // The exact Google Maps link you shared — guests tap the location card
  // (or "Get Directions") and go straight to your pinned location.
  mapLink: "https://maps.app.goo.gl/ccmLSELZDHPemnA4A?g_st=ic",

  // ---- Blessing / footer ------------------------------------------
  duaArabic: "بَارَكَ اللّٰهُ لَكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",   // leave '' to hide
  duaTranslation: "May Allah bless you both and join you together in goodness.", // leave '' to hide
  footerNames: "Luthufi and Lujeen",     // shown as "With love, ___" at the very end

  // ---- RSVP guest limit ------------------------------------------
  maxGuests: 10,

  // ---- Host dashboard ------------------------------------------
  // Tap "Host dashboard" at the very bottom of the page and enter this
  // to see who has responded. Change it to anything you like — just
  // remember it. Note: this is a simple lock for casual privacy, not
  // strong security (anyone who reads the page's code could find it).
  hostPasscode: "1608"
};

/* =====================================================================
   Below this line is page logic — no need to touch it to edit content.
===================================================================== */
(function(){
  const eventDate = new Date(CONFIG.eventDateISO);

  // ---------- fill in text content ----------
  document.title = CONFIG.groomName + " & " + CONFIG.brideName;

  document.getElementById('groomName').textContent = CONFIG.groomName;
  document.getElementById('brideName').textContent = CONFIG.brideName;
  document.getElementById('footerNames').textContent = CONFIG.footerNames;

  setOrHide('groomParents', CONFIG.groomParents);
  setOrHide('brideParents', CONFIG.brideParents);
  setOrHide('tagline', CONFIG.tagline);

  document.getElementById('eventNameCountdown').textContent = "the " + CONFIG.eventName;
  document.getElementById('eventNameLabel').textContent = "The " + CONFIG.eventName;

  document.getElementById('eventDateDisplay').textContent =
    eventDate.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  setOrHide('eventTime', CONFIG.eventTimeLabel);

  // Hijri date: use override if given, else try to estimate, else hide.
  let hijriText = CONFIG.eventHijriOverride;
  if(!hijriText){
    try{
      hijriText = new Intl.DateTimeFormat('en-u-ca-islamic', { day:'numeric', month:'long', year:'numeric' }).format(eventDate);
    }catch(e){ hijriText = ''; }
  }
  setOrHide('eventHijri', hijriText);

  document.getElementById('venueName').textContent = CONFIG.venueName;
  document.getElementById('venueAddress').textContent = CONFIG.venueAddress;

  if(CONFIG.dressCode){
    document.getElementById('dressCode').textContent = CONFIG.dressCode;
  }else{
    document.getElementById('dressCodeRow').style.display = 'none';
  }

  setOrHide('duaArabic', CONFIG.duaArabic);
  setOrHide('duaTranslation', CONFIG.duaTranslation);

  if(!CONFIG.duaArabic && !CONFIG.duaTranslation){
    // hide the lone ornament above an empty blessing block too
    const orn = document.querySelector('.blessing .ornament');
    if(orn) orn.style.display = 'none';
  }

  function setOrHide(id, value){
    const el = document.getElementById(id);
    if(!el) return;
    if(value && String(value).trim() !== ''){
      el.textContent = value;
    }else{
      el.style.display = 'none';
    }
  }

  // ---------- location card ----------
  document.getElementById('mapLinkBox').href = CONFIG.mapLink;
  document.getElementById('directionsLink').href = CONFIG.mapLink;

  // ---------- countdown ----------
  function updateCountdown(){
    let diff = eventDate.getTime() - Date.now();
    if(diff < 0) diff = 0;
    const day = Math.floor(diff / 86400000); diff -= day * 86400000;
    const hr  = Math.floor(diff / 3600000);  diff -= hr * 3600000;
    const min = Math.floor(diff / 60000);    diff -= min * 60000;
    const sec = Math.floor(diff / 1000);
    document.getElementById('cdDays').textContent  = String(day).padStart(2,'0');
    document.getElementById('cdHours').textContent = String(hr).padStart(2,'0');
    document.getElementById('cdMins').textContent  = String(min).padStart(2,'0');
    document.getElementById('cdSecs').textContent  = String(sec).padStart(2,'0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ---------- add to calendar (.ics download, works for Apple/Google/Outlook) ----------
  document.getElementById('addCalendarBtn').addEventListener('click', function(){
    const start = toICSDate(eventDate);
    const end = toICSDate(new Date(eventDate.getTime() + CONFIG.eventDurationHours * 3600000));
    const lines = [
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wedding Invitation//EN','BEGIN:VEVENT',
      'UID:' + Date.now() + '@invitation',
      'DTSTAMP:' + toICSDate(new Date()),
      'DTSTART:' + start,
      'DTEND:' + end,
      'SUMMARY:' + escapeICS(CONFIG.eventName + ': ' + CONFIG.groomName + ' & ' + CONFIG.brideName),
      'LOCATION:' + escapeICS(CONFIG.venueName + ', ' + CONFIG.venueAddress.replace(/\n/g, ', ')),
      'DESCRIPTION:' + escapeICS('You are invited to the ' + CONFIG.eventName + ' of ' + CONFIG.groomName + ' and ' + CONFIG.brideName + '.'),
      'END:VEVENT','END:VCALENDAR'
    ];
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (CONFIG.eventName || 'event').replace(/\s+/g,'-').toLowerCase() + '.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  function toICSDate(d){ return d.toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z'; }
  function escapeICS(s){ return String(s).replace(/[,;]/g, m => '\\' + m); }

  // ---------- RSVP ----------
  let choice = null;
  let guestCount = 1;

  const acceptBtn = document.getElementById('acceptBtn');
  const declineBtn = document.getElementById('declineBtn');
  const guestRow = document.getElementById('guestCountRow');
  const guestCountEl = document.getElementById('guestCount');
  const submitBtn = document.getElementById('rsvpSubmit');

  acceptBtn.addEventListener('click', () => selectChoice('accept'));
  declineBtn.addEventListener('click', () => selectChoice('decline'));

  function selectChoice(value){
    choice = value;
    acceptBtn.classList.toggle('is-active', value === 'accept');
    declineBtn.classList.toggle('is-active', value === 'decline');
    guestRow.hidden = value !== 'accept';
    submitBtn.disabled = false;
  }

  document.getElementById('stepDown').addEventListener('click', () => {
    guestCount = Math.max(1, guestCount - 1);
    guestCountEl.textContent = guestCount;
  });
  document.getElementById('stepUp').addEventListener('click', () => {
    guestCount = Math.min(CONFIG.maxGuests, guestCount + 1);
    guestCountEl.textContent = guestCount;
  });

  document.getElementById('rsvpForm').addEventListener('submit', async function(e){
    e.preventDefault();
    if(!choice) return;

    const name = document.getElementById('guestName').value.trim();
    const namePart = name ? ', ' + name : '';
    let message;

    if(choice === 'accept'){
      const extra = guestCount > 1 ? ` and ${guestCount - 1} guest${guestCount - 1 > 1 ? 's' : ''}` : '';
      message = `Thank you${namePart}! We can't wait to celebrate the ${CONFIG.eventName} with you${extra}.`;
    }else{
      message = `Thank you${namePart} for letting us know — you'll be dearly missed.`;
    }

    await saveRSVP({
      name: name || 'Guest',
      choice: choice,
      guestCount: choice === 'accept' ? guestCount : 0,
      submittedAt: new Date().toISOString()
    });

    document.getElementById('rsvpThanksMsg').textContent = message;
    document.getElementById('rsvpForm').hidden = true;
    document.getElementById('rsvpThanks').hidden = false;
  });

  // ---------- RSVP storage (works when this page is opened via its
  // published Claude link — see note at the bottom of the chat) ----------
  async function saveRSVP(record){
    try{
      if(!window.storage) return false;
      const id = 'rsvp:' + Date.now() + '-' + Math.random().toString(36).slice(2,8);
      await window.storage.set(id, JSON.stringify(record), true);
      return true;
    }catch(e){
      console.error('Could not save RSVP', e);
      return false;
    }
  }

  async function loadAllRSVPs(){
    if(!window.storage) return [];
    try{
      const listResult = await window.storage.list('rsvp:', true);
      const keys = (listResult && listResult.keys) || [];
      const records = [];
      await Promise.all(keys.map(async (key) => {
        try{
          const res = await window.storage.get(key, true);
          if(res && res.value) records.push(JSON.parse(res.value));
        }catch(e){ /* skip a single unreadable entry */ }
      }));
      records.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
      return records;
    }catch(e){
      console.error('Could not load RSVPs', e);
      return [];
    }
  }

  function relativeTime(iso){
    const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if(mins < 1) return 'just now';
    if(mins < 60) return mins + 'm ago';
    const hrs = Math.round(mins / 60);
    if(hrs < 24) return hrs + 'h ago';
    return Math.round(hrs / 24) + 'd ago';
  }

  function escapeHTML(str){
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderDashboard(records){
    const accepted = records.filter(r => r.choice === 'accept');
    const declined = records.filter(r => r.choice === 'decline');
    const totalGuests = accepted.reduce((sum, r) => sum + (r.guestCount || 1), 0);

    document.getElementById('statAccepted').textContent = accepted.length;
    document.getElementById('statDeclined').textContent = declined.length;
    document.getElementById('statGuests').textContent = totalGuests;

    const list = document.getElementById('hostList');
    if(records.length === 0){
      list.innerHTML = '<p class="host-empty">No responses yet.</p>';
      return;
    }
    list.innerHTML = records.map(r => {
      const isYes = r.choice === 'accept';
      const countText = isYes ? (r.guestCount || 1) + ' guest' + ((r.guestCount || 1) > 1 ? 's' : '') : 'Not attending';
      return `<div class="host-row">
        <div class="host-row-main">
          <span class="name">${escapeHTML(r.name || 'Guest')}</span>
          <span class="badge ${isYes ? 'badge--yes' : 'badge--no'}">${isYes ? 'Accepted' : 'Declined'}</span>
        </div>
        <div class="host-row-meta">${countText} · ${relativeTime(r.submittedAt)}</div>
      </div>`;
    }).join('');
  }

  // ---------- host dashboard open/lock/unlock ----------
  const hostDashboard = document.getElementById('hostDashboard');
  const hostGate = document.getElementById('hostGate');
  const hostPanel = document.getElementById('hostPanel');
  const hostPasscodeInput = document.getElementById('hostPasscodeInput');
  const hostError = document.getElementById('hostError');
  const hostDashboardLink = document.getElementById('hostDashboardLink');

  hostDashboardLink.addEventListener('click', () => {
    hostDashboard.hidden = false;
    hostDashboardLink.hidden = true;
    hostDashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('hostCloseBtn').addEventListener('click', () => {
    hostDashboard.hidden = true;
    hostDashboardLink.hidden = false;
    hostPasscodeInput.value = '';
    hostError.hidden = true;
  });

  document.getElementById('hostUnlockBtn').addEventListener('click', async () => {
    if(hostPasscodeInput.value.trim() === String(CONFIG.hostPasscode)){
      hostGate.hidden = true;
      hostPanel.hidden = false;
      hostError.hidden = true;
      renderDashboard(await loadAllRSVPs());
    }else{
      hostError.hidden = false;
    }
  });
  hostPasscodeInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') document.getElementById('hostUnlockBtn').click();
  });

  document.getElementById('refreshBtn').addEventListener('click', async () => {
    renderDashboard(await loadAllRSVPs());
  });

  document.getElementById('lockBtn').addEventListener('click', () => {
    hostPanel.hidden = true;
    hostGate.hidden = false;
    hostPasscodeInput.value = '';
  });

  // ---------- scroll reveal ----------
  const revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => obs.observe(el));
  }else{
    revealEls.forEach(el => el.classList.add('is-visible'));
  }
})();
