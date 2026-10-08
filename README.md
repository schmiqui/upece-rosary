# Ruženec – prototyp

Web appka na modlitbu ruženca. Guľôčky sú na obrazovke ako na fyzickom ruženci a človek ťukne na tú, ktorú sa už pomodlil.

**Appka:** https://schmiqui.github.io/upece-rosary/

## Inštalácia do mobilu

- **iPhone (Safari):** otvor odkaz → tlačidlo Zdieľať (štvorec so šípkou) → *Pridať na plochu*.
- **Android (Chrome):** otvor odkaz → menu ⋮ → *Inštalovať aplikáciu* / *Pridať na plochu*.

Pozícia v ruženci sa ukladá priamo v telefóne. Zmaže sa len pri odstránení appky z plochy alebo pri vymazaní údajov prehliadača. Na iPhone má appka na ploche vlastné úložisko, oddelené od Safari, preto pokračuj vždy cez ikonu na ploche.

## Čo vie

- **Výber ruženca** – radostný, svetla, bolestný, slávnostný. Ruženec pre dnešný deň má štítok „Dnes“.
- **Ťukanie na guľôčky** – ťukneš na guľôčku, ktorú si sa pomodlil/a, a zvýrazní sa ďalšia (pulzuje).
  - Ťukneš ďalej dopredu: všetko predtým sa označí ako pomodlené, objaví sa „Vrátiť“.
  - Ťukneš znova na poslednú pomodlenú: odznačí sa.
  - Tlačidlá „Pomodlené ✓“ a „‹ Späť“ sú pre tých, čo nechcú mieriť na malé guľôčky.
- **Text modlitby** – ukazuje, čo sa práve modliť, a tajomstvo je v Zdravase zvýraznené. V nastaveniach sa dá prepnúť na skrátený text.
- **Appka si pamätá, kde si skončil/a** – každé ťuknutie sa hneď uloží do zariadenia. Keď appku zavrieš (napr. vystupuješ z MHD) a znova otvoríš, otvorí sa presne na tej guľôčke. V strede ruženca je vždy veľké „2. desiatok · 7 / 10“.
- **Nevypínať obrazovku** počas modlitby (ikona oka; funguje v prehliadačoch s Wake Lock API).
- **Svetlý / tmavý režim** – automaticky podľa telefónu alebo ručne (nastavenia, ikona mesiaca pri modlitbe).
- **Funguje offline** (service worker) a dá sa pridať na plochu mobilu ako appka (PWA).
- Každý ruženec má svoju farbu; rozloženie na mobil aj desktop.

## Nasadenie

Appka beží na GitHub Pages z vetvy `main` (koreň repa). Každý push do `main` ju aktualizuje do minúty či dvoch.
Pri zmene súborov zvýš verziu `CACHE` v `sw.js`, aby si telefóny stiahli novú verziu.

## Lokálne spustenie

Netreba nič inštalovať, stačí statický server:

```bash
python3 -m http.server 8080
```

Potom otvor http://localhost:8080. Na mobile v tej istej Wi-Fi otvor `http://<IP-počítača>:8080`.

## Štruktúra

```
index.html             obrazovky (výber ruženca, modlitba)
css/style.css          dizajn
js/prayers.js          texty modlitieb a tajomstiev
js/app.js              logika, kreslenie ruženca, ukladanie pozície
sw.js                  offline cache
manifest.webmanifest   PWA manifest
icons/                 ikona appky
```

Poradie krokov (61): kríž (Znamenie kríža, Verím v Boha) → Otče náš → 3× Zdravas (viera, nádej, láska) → 5× [Sláva Otcu (+ Ó, Ježišu), ohlásenie tajomstva, Otče náš, 10× Zdravas] → medailón (Sláva Otcu, Ó, Ježišu, Zdravas, Kráľovná).

## Ďalší krok: Google Play / App Store

Appka je čisté HTML/CSS/JS, takže sa dá zabaliť cez [Capacitor](https://capacitorjs.com/) bez prepisovania:

```bash
npm init -y && npm i @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init Ruzenec sk.ruzenec.app --web-dir .
npx cap add android && npx cap add ios
```

Pred vydaním by som ešte doriešil:
- uložená pozícia je teraz v `localStorage`; v natívnej appke ju presunúť do `@capacitor/preferences` (spoľahlivejšie na iOS)
- nevypínanie obrazovky cez `@capacitor-community/keep-awake` a vibrácie cez `@capacitor/haptics` (iOS Safari `navigator.vibrate` nepodporuje)
- korektúra textov modlitieb (napr. niekým z farnosti)
- ikony vo všetkých veľkostiach a splash screen
