const storageKey = 'useless-internet-state';
const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
const state = { theme: saved.theme || 'light', sound: saved.sound || false, clicks: saved.clicks || 0, rockName: saved.rockName || 'Pebble' };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const save = () => localStorage.setItem(storageKey, JSON.stringify(state));
const toast = (message) => { const element = $('#toast'); element.textContent = message; element.classList.add('show'); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => element.classList.remove('show'), 2400); };
const beep = (frequency = 440) => { if (!state.sound) return; const context = new (window.AudioContext || window.webkitAudioContext)(); const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.frequency.value = frequency; oscillator.type = 'sine'; gain.gain.setValueAtTime(.04, context.currentTime); gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .16); oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + .16); };

const setTheme = (theme) => { state.theme = theme; document.documentElement.dataset.theme = theme; $('#theme-toggle').setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`); save(); };
setTheme(state.theme);
$('#sound-toggle').setAttribute('aria-label', state.sound ? 'Turn sound off' : 'Turn sound on');
$('#theme-toggle').addEventListener('click', () => { setTheme(state.theme === 'light' ? 'dark' : 'light'); toast(`${state.theme === 'dark' ? 'Darkness' : 'Light'}: activated.`); beep(250); });
$('#sound-toggle').addEventListener('click', () => { state.sound = !state.sound; $('#sound-toggle').setAttribute('aria-label', state.sound ? 'Turn sound off' : 'Turn sound on'); save(); toast(state.sound ? 'Tiny sounds: enabled.' : 'Tiny sounds: muted.'); beep(660); });
$('#surprise-me').addEventListener('click', () => { const places = ['#the-button','#excuses','#randomness','#pet-rock','#store']; const target = $(places[Math.floor(Math.random() * places.length)]); target.scrollIntoView({ behavior:'smooth', block:'center' }); toast('Your surprise has been responsibly delegated.'); });

const buttonOutcomes = [
  ['The button has learned your name. It refuses to say it.', 'coral'], ['You have unlocked: The Achievement of Clicking.', 'acid'], ['Nothing happened. It was beautiful.', 'blue'], ['The button is now emotionally available.', 'acid'], ['A committee reviewed your click. It passed unanimously.', 'blue'], ['Your productivity has been reduced by 0.0001%.', 'coral'], ['Rare event: the page feels slightly more circular.', 'acid'], ['You are now legally allowed to call this a hobby.', 'blue'], ['The button moved three pixels to the left. You cannot prove it.', 'coral']
];
let buttonCount = 0;
$('#big-button').addEventListener('click', () => { buttonCount++; const [message, color] = buttonOutcomes[Math.floor(Math.random() * buttonOutcomes.length)]; $('#button-result').textContent = message; $('.button-card').style.background = `var(--${color})`; $('#big-button').classList.add('shake'); setTimeout(() => $('#big-button').classList.remove('shake'), 400); beep(220 + buttonCount * 15); if (buttonCount === 7) toast('Achievement unlocked: suspicious persistence.'); });

const excuses = {
  late: ['My calendar developed a personal grudge against me.', 'A pigeon gave me directions and I chose to trust it.', 'I was ready on time, but my shadow needed a minute.', 'The elevator stopped at every floor to process its feelings.', 'I got trapped in a very small but important thought.'],
  messages: ['I saw your message and wanted to reply with the respect it deserves.', 'My thumbs are currently on a silent retreat.', 'I opened the message, blinked, and it became tomorrow.', 'I have been meaning to reply since a different version of me existed.', 'I was waiting for the perfect words. They have not arrived.'],
  responsibility: ['I delegated it to the part of my brain that handles things. No updates.', 'The task looked directly at me, so I had to give it privacy.', 'I am letting the problem marinate. It is nearly a sauce.', 'I made a spreadsheet about doing it. That is basically doing it.', 'The universe has not yet confirmed this is my responsibility.']
};
const makeExcuse = () => { const list = excuses[$('#excuse-category').value]; $('#excuse-output').textContent = list[Math.floor(Math.random() * list.length)]; beep(380); };
$('#new-excuse').addEventListener('click', makeExcuse);
$('#excuse-category').addEventListener('change', makeExcuse);
$('#copy-excuse').addEventListener('click', async () => { try { await navigator.clipboard.writeText($('#excuse-output').textContent); toast('Excuse copied. Accountability postponed.'); } catch { toast('Copy failed, but the excuse remains valid.'); } });

const titles = [[0,'The Uninitiated'],[5,'Button Adjacent'],[15,'Casually Pointless'],[30,'Senior Time Waster'],[60,'Director of Nothing'],[100,'Useless Legend']];
const counterMessages = ['Your progress is being archived nowhere.', 'A truly unnecessary number.', 'The counter is proud, for some reason.', 'You are very good at this particular nothing.', 'Human potential remains mysterious.'];
const updateCounter = () => { $('#counter-value').textContent = state.clicks; const current = titles.reduce((result, title) => state.clicks >= title[0] ? title[1] : result, titles[0][1]); const next = titles.find((title) => state.clicks < title[0]); $('#counter-title').textContent = current; $('#counter-progress').style.width = `${Math.min(100, next ? (state.clicks / next[0]) * 100 : 100)}%`; $('#counter-message').textContent = counterMessages[Math.min(counterMessages.length - 1, Math.floor(state.clicks / 12))]; };
updateCounter();
$('#counter-click').addEventListener('click', () => { state.clicks++; save(); updateCounter(); beep(300 + (state.clicks % 8) * 30); if ([5,15,30,60,100].includes(state.clicks)) toast(`New title: ${$('#counter-title').textContent}`); });

const randomThings = [
  ['Imaginary product', 'The Desk Umbrella: for protecting your paperwork from indoor weather.'], ['Fake headline', 'Local person finally understands a meme from 2017, celebrates quietly.'], ['Unnecessary fact', 'A group of flamingos is called a flamboyance, which feels like oversharing.'], ['Imaginary product', 'Scented silence: now available in three varieties of absolutely nothing.'], ['Fake headline', 'Scientists confirm that putting something down means losing it forever.'], ['Unnecessary fact', 'The inventor of the Pringles can is buried in one. A crisp commitment.'], ['Imaginary product', 'Premium waiting: a subscription that lets you wait in a slightly nicer font.']
];
let randomIndex = -1;
const showRandomThing = () => { if ($('#randomize').disabled) return; $('#randomize').disabled = true; $('#random-again').disabled = true; $('#random-output').classList.add('spinning'); $('.random-button-label').textContent = 'Consulting nonsense'; let nextIndex = randomIndex; while (nextIndex === randomIndex) nextIndex = Math.floor(Math.random() * randomThings.length); randomIndex = nextIndex; const [label, text] = randomThings[randomIndex]; setTimeout(() => { $('#random-output').innerHTML = `<span class="output-label">${label}</span><strong>${text}</strong>`; $('#random-output').classList.remove('spinning'); $('#randomize').disabled = false; $('#random-again').disabled = false; $('.random-button-label').textContent = 'Make it weirder'; beep(520); }, 420); };
$('#randomize').addEventListener('click', showRandomThing);
$('#random-again').addEventListener('click', showRandomThing);

const fortunes = ['a suspiciously specific snack.', 'a meeting that could have been a nap.', 'a tiny victory nobody will document.', 'the answer, but only in lowercase.', 'an email you will bravely ignore.', 'a beautiful leaf with no clear purpose.'];
$('#fortune-button').addEventListener('click', () => { const paper = $('#fortune-paper'); paper.classList.add('shake'); $('#fortune-button').disabled = true; setTimeout(() => { paper.querySelector('strong').textContent = fortunes[Math.floor(Math.random() * fortunes.length)]; paper.classList.remove('shake'); $('#fortune-button').disabled = false; beep(470); }, 260); });

const moods = [['suspiciously capable', '#f2a6a0'], ['one tab away from genius', '#f2dc78'], ['quietly ungovernable', '#b9a7e8'], ['ready for a snack', '#f3b77f'], ['doing your best, oddly', '#9dd8e8']];
$('#mood-button').addEventListener('click', () => { const [mood, color] = moods[Math.floor(Math.random() * moods.length)]; $('#mood-result').textContent = `Pointing at: ${mood}.`; $('#mood-orb').style.background = color; $('#mood-orb').style.transform = `rotate(${Math.floor(Math.random() * 26) - 13}deg) scale(1.06)`; beep(610); });

const rockStatuses = ['Pebble feels seen. This is new.', 'Pebble would like a tiny vacation.', 'Pebble has absorbed your compliment.', 'Pebble is pretending not to care.', 'Pebble is now 0.02% more powerful.', 'Pebble is thinking about sediment.'];
$('#pet-name').textContent = state.rockName;
const rockStatus = (message) => { $('#pet-status').textContent = message; $('#rock-face').classList.add('shake'); setTimeout(() => $('#rock-face').classList.remove('shake'), 400); beep(190); };
$('#feed-rock').addEventListener('click', () => rockStatus('Pebble enjoyed the imaginary snack. Crunchy.'));
$('#compliment-rock').addEventListener('click', () => rockStatus(rockStatuses[Math.floor(Math.random() * rockStatuses.length)]));
$('#ignore-rock').addEventListener('click', () => rockStatus('Pebble noticed. Pebble will remember.'));
$('#rename-rock').addEventListener('click', () => { const name = window.prompt('What should your rock be called?', state.rockName); if (name && name.trim()) { state.rockName = name.trim().slice(0, 18); $('#pet-name').textContent = state.rockName; save(); toast(`${state.rockName} has entered the chat.`); } });

$$('.buy-button').forEach((button) => button.addEventListener('click', () => toast(`${button.dataset.product} added to your imaginary basket.`)));
$('#reset-data').addEventListener('click', () => { if (window.confirm('Forget all useless progress?')) { localStorage.removeItem(storageKey); window.location.reload(); } });
