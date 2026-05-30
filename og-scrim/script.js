/**
 * ONLY么GODS SCRIM SYSTEM
 * Vanilla JS | No Backend | LocalStorage Sync | Auto Timezone
 */

document.addEventListener('DOMContentLoaded', () => {
    // Determine page type
    const isAdminPage = document.getElementById('login-form');
    
    if (isAdminPage) {
        initAdmin();
    } else {
        initPublicPage();
    }
});

// ================= ADMIN PANEL =================
function initAdmin() {
    const loginForm = document.getElementById('login-form');
    const dashboard = document.getElementById('admin-dashboard');
    const loginInput = document.getElementById('admin-pass');
    const loginBtn = document.getElementById('login-btn');
    const loginError = document.getElementById('login-error');
    
    // Change this password as needed
    const ADMIN_HASH = btoa('OG2026Admin'); // Simple obfuscation

    loginBtn.addEventListener('click', () => {
        if (btoa(loginInput.value) === ADMIN_HASH) {
            loginForm.classList.add('hidden');
            dashboard.classList.remove('hidden');
            loadCurrentAdminData();
        } else {
            loginError.classList.remove('hidden');
            setTimeout(() => loginError.classList.add('hidden'), 2000);
        }
    });

    document.getElementById('save-event-btn').addEventListener('click', () => {
        const name = document.getElementById('event-name-input').value.trim();
        const date = document.getElementById('event-date-input').value;
        const time = document.getElementById('event-time-input').value;
        const successMsg = document.getElementById('save-success');

        if (!name || !date || !time) {
            alert('Please fill in all fields.');
            return;
        }

        const localDate = new Date(`${date}T${time}`);
        const eventPayload = {
            name: name,
            iso: localDate.toISOString()
        };

        localStorage.setItem('og_scrim_event', JSON.stringify(eventPayload));
        
        successMsg.classList.remove('hidden');
        setTimeout(() => successMsg.classList.add('hidden'), 3000);
    });
}

function loadCurrentAdminData() {
    const stored = localStorage.getItem('og_scrim_event');
    const data = stored ? JSON.parse(stored) : window.OG_SCRIM_CONFIG;
    
    if (data && data.iso) {
        const d = new Date(data.iso);
        document.getElementById('event-name-input').value = data.name || '';
        // Format to YYYY-MM-DD for date input
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        document.getElementById('event-date-input').value = `${yyyy}-${mm}-${dd}`;
        // Format to HH:MM for time input
        const hh = String(d.getHours()).padStart(2, '0');
        const mi = String(d.getMinutes()).padStart(2, '0');
        document.getElementById('event-time-input').value = `${hh}:${mi}`;
    }
}

// ================= PUBLIC PAGE =================
function initPublicPage() {
    const eventNameEl = document.getElementById('event-name');
    const dateEl = document.getElementById('local-date');
    const timeEl = document.getElementById('local-time');
    const countdownContainer = document.getElementById('countdown-container');
    const liveStatus = document.getElementById('live-status');
    const endedStatus = document.getElementById('ended-status');
    
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minsEl = document.getElementById('minutes');
    const secsEl = document.getElementById('seconds');

    // Load event (localStorage > default fallback)
    const stored = localStorage.getItem('og_scrim_event');
    const eventData = stored ? JSON.parse(stored) : window.OG_SCRIM_CONFIG;
    
    const eventDate = new Date(eventData.iso);
    
    // Update static info
    eventNameEl.textContent = eventData.name || 'Upcoming Scrim';
    dateEl.textContent = eventDate.toLocaleDateString(undefined, { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
    timeEl.textContent = eventDate.toLocaleTimeString(undefined, { 
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });

    const LIVE_DURATION_MS = 2 * 60 * 60 * 1000; // 2-hour live window

    function updateCountdown() {
        const now = new Date();
        let diff = eventDate - now;

        if (diff < 0) {
            // Event has started or passed
            if (diff > -LIVE_DURATION_MS) {
                // LIVE STATE
                countdownContainer.classList.add('hidden');
                endedStatus.classList.add('hidden');
                liveStatus.classList.remove('hidden');
            } else {
                // ENDED STATE
                countdownContainer.classList.add('hidden');
                liveStatus.classList.add('hidden');
                endedStatus.classList.remove('hidden');
            }
        } else {
            // BEFORE STATE (Countdown)
            liveStatus.classList.add('hidden');
            endedStatus.classList.add('hidden');
            countdownContainer.classList.remove('hidden');

            const totalSeconds = Math.floor(diff / 1000);
            const d = Math.floor(totalSeconds / (3600 * 24));
            const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            const s = Math.floor(totalSeconds % 60);

            daysEl.textContent = String(d).padStart(2, '0');
            hoursEl.textContent = String(h).padStart(2, '0');
            minsEl.textContent = String(m).padStart(2, '0');
            secsEl.textContent = String(s).padStart(2, '0');
        }
    }

    // Initial call & interval
    updateCountdown();
    setInterval(updateCountdown, 1000);
}