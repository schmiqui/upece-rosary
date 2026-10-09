// Texty modlitieb a tajomstiev ruženca (slovenské znenie).
// Tajomstvá a prosby k preddesiatku podľa https://dmc.sk/modlitba-ruzenca/tajomstva-ruzenca/
window.PRAYERS = {
  znamenieKriza: {
    name: "Znamenie kríža",
    text: "V mene Otca i Syna i Ducha Svätého. Amen.",
  },
  verim: {
    name: "Verím v Boha",
    text:
      "Verím v Boha, Otca všemohúceho, Stvoriteľa neba i zeme. " +
      "I v Ježiša Krista, jeho jediného Syna, nášho Pána, ktorý sa počal z Ducha Svätého, " +
      "narodil sa z Márie Panny, trpel za vlády Poncia Piláta, bol ukrižovaný, umrel a bol pochovaný. " +
      "Zostúpil k zosnulým, v tretí deň vstal z mŕtvych, vystúpil na nebesia, " +
      "sedí po pravici Boha Otca všemohúceho, odtiaľ príde súdiť živých i mŕtvych. " +
      "Verím v Ducha Svätého, svätú Cirkev katolícku, spoločenstvo svätých, " +
      "odpustenie hriechov, vzkriesenie tela a večný život. Amen.",
  },
  otceNas: {
    name: "Otče náš",
    text:
      "Otče náš, ktorý si na nebesiach, posväť sa meno tvoje, príď kráľovstvo tvoje, " +
      "buď vôľa tvoja ako v nebi, tak i na zemi. Chlieb náš každodenný daj nám dnes " +
      "a odpusť nám naše viny, ako i my odpúšťame svojim vinníkom, " +
      "a neuveď nás do pokušenia, ale zbav nás zlého. Amen.",
  },
  zdravas: {
    name: "Zdravas, Mária",
    // {T} sa nahradí tajomstvom
    text:
      "Zdravas, Mária, milosti plná, Pán s tebou. Požehnaná si medzi ženami " +
      "a požehnaný je plod tvojho života, Ježiš, {T}. " +
      "Svätá Mária, Matka Božia, pros za nás hriešnych teraz i v hodinu našej smrti. Amen.",
  },
  slava: {
    name: "Sláva Otcu",
    text:
      "Sláva Otcu i Synu i Duchu Svätému, ako bolo na počiatku, " +
      "tak nech je i teraz i vždycky i na veky vekov. Amen.",
  },
  fatima: {
    name: "Ó, Ježišu",
    text:
      "Ó, Ježišu, odpusť nám naše hriechy, zachráň nás od pekelného ohňa " +
      "a priveď do neba všetky duše, najmä tie, ktoré najviac potrebujú tvoje milosrdenstvo.",
  },
  salve: {
    name: "Zdravas, Kráľovná",
    text:
      "Zdravas, Kráľovná, Matka milosrdenstva, život, sladkosť a nádej naša, buď pozdravená! " +
      "K tebe voláme, vyhnaní synovia Evy, k tebe vzdycháme, nariekajúc a plačúc v tomto údolí sĺz. " +
      "Preto, orodovnica naša, obráť na nás svoje milosrdné oči a Ježiša, požehnaný plod svojho života, " +
      "ukáž nám po tomto putovaní. Ó, milostivá, ó, láskavá, ó, sladká Panna Mária! " +
      "Oroduj za nás, svätá Božia Rodička, aby sme boli hodní Kristových prisľúbení. Amen.",
  },
};

window.ROSARIES = [
  {
    id: "radostny",
    name: "Radostný ruženec",
    days: [1, 6], // Po, So
    intro: [
      "ktorý nech rozmnožuje našu vieru",
      "ktorý nech posilňuje našu nádej",
      "ktorý nech roznecuje našu lásku",
    ],
    mysteries: [
      { title: "Zvestovanie Pána", formula: "ktorého si, Panna, z Ducha Svätého počala" },
      { title: "Navštívenie Alžbety", formula: "ktorého si, Panna, pri návšteve Alžbety v živote nosila" },
      { title: "Narodenie Pána", formula: "ktorého si, Panna, v Betleheme porodila" },
      { title: "Obetovanie v chráme", formula: "ktorého si, Panna, so svätým Jozefom v chráme obetovala" },
      { title: "Nájdenie v chráme", formula: "ktorého si, Panna, so svätým Jozefom v chráme našla" },
    ],
  },
  {
    id: "svetla",
    name: "Ruženec svetla",
    days: [4], // Št
    intro: [
      "ktorý nech je svetlom nášho života",
      "ktorý nech nás uzdravuje milosrdnou láskou",
      "ktorý nech nás vezme k sebe do večnej slávy",
    ],
    mysteries: [
      { title: "Krst v Jordáne", formula: "ktorý bol pokrstený v Jordáne a začal svoje verejné účinkovanie" },
      { title: "Svadba v Káne", formula: "ktorý zázrakom v Káne Galilejskej otvoril srdcia učeníkov pre vieru" },
      { title: "Ohlasovanie Božieho kráľovstva", formula: "ktorý ohlasoval Božie kráľovstvo a vyzýval ľud na pokánie" },
      { title: "Premenenie na vrchu Tábor", formula: "ktorý sa ukázal v božskej sláve na vrchu premenenia" },
      { title: "Ustanovenie Eucharistie", formula: "ktorý nám dal seba samého za pokrm a nápoj v Oltárnej sviatosti" },
    ],
  },
  {
    id: "bolestny",
    name: "Bolestný ruženec",
    days: [2, 5], // Ut, Pi
    intro: [
      "ktorý nech osvecuje náš rozum",
      "ktorý nech upevňuje našu vôľu",
      "ktorý nech posilňuje našu pamäť",
    ],
    mysteries: [
      { title: "Krvavý pot v Getsemanskej záhrade", formula: "ktorý sa pre nás krvou potil" },
      { title: "Bičovanie", formula: "ktorý bol pre nás bičovaný" },
      { title: "Korunovanie tŕním", formula: "ktorý bol pre nás tŕním korunovaný" },
      { title: "Krížová cesta", formula: "ktorý pre nás kríž niesol" },
      { title: "Ukrižovanie", formula: "ktorý bol pre nás ukrižovaný" },
    ],
  },
  {
    id: "slavnostny",
    name: "Slávnostný ruženec",
    days: [0, 3], // Ne, St
    intro: [
      "ktorý nech usporadúva naše myšlienky",
      "ktorý nech riadi naše slová",
      "ktorý nech spravuje naše skutky",
    ],
    mysteries: [
      { title: "Zmŕtvychvstanie", formula: "ktorý slávne vstal z mŕtvych" },
      { title: "Nanebovstúpenie", formula: "ktorý slávne vystúpil do neba" },
      { title: "Zoslanie Ducha Svätého", formula: "ktorý nám zoslal Ducha Svätého" },
      { title: "Nanebovzatie Panny Márie", formula: "ktorý ťa, Panna, vzal do neba" },
      { title: "Korunovanie Panny Márie", formula: "ktorý ťa, Panna, v nebi korunoval" },
    ],
  },
];
