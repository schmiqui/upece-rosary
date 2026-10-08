// Texty modlitieb a tajomstiev ruženca (slovenské znenie).
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

window.INTRO_MYSTERIES = [
  "ktorý nech rozmnožuje našu vieru",
  "ktorý nech posilňuje našu nádej",
  "ktorý nech roznecuje našu lásku",
];

window.ROSARIES = [
  {
    id: "radostny",
    name: "Radostný ruženec",
    days: [1, 6], // Po, So
    mysteries: [
      { title: "Zvestovanie Pána", formula: "ktorého si, Panna, z Ducha Svätého počala" },
      { title: "Navštívenie Alžbety", formula: "ktorého si, Panna, pri návšteve Alžbety v lone niesla" },
      { title: "Narodenie Pána", formula: "ktorého si, Panna, v Betleheme porodila" },
      { title: "Obetovanie v chráme", formula: "ktorého si, Panna, v chráme obetovala" },
      { title: "Nájdenie v chráme", formula: "ktorého si, Panna, v chráme našla" },
    ],
  },
  {
    id: "svetla",
    name: "Ruženec svetla",
    days: [4], // Št
    mysteries: [
      { title: "Krst v Jordáne", formula: "ktorý bol pokrstený v Jordáne" },
      { title: "Svadba v Káne", formula: "ktorý zjavil seba samého na svadbe v Káne" },
      { title: "Ohlasovanie Božieho kráľovstva", formula: "ktorý ohlasoval Božie kráľovstvo a vyzýval na obrátenie" },
      { title: "Premenenie na vrchu Tábor", formula: "ktorý sa zjavil vo svojej sláve na vrchu Tábor" },
      { title: "Ustanovenie Eucharistie", formula: "ktorý ustanovil Eucharistiu" },
    ],
  },
  {
    id: "bolestny",
    name: "Bolestný ruženec",
    days: [2, 5], // Ut, Pi
    mysteries: [
      { title: "Krvavý pot v Getsemanskej záhrade", formula: "ktorý sa za nás krvou potil" },
      { title: "Bičovanie", formula: "ktorý bol za nás bičovaný" },
      { title: "Korunovanie tŕním", formula: "ktorý bol za nás tŕním korunovaný" },
      { title: "Krížová cesta", formula: "ktorý pre nás niesol ťažký kríž" },
      { title: "Ukrižovanie", formula: "ktorý bol za nás ukrižovaný" },
    ],
  },
  {
    id: "slavnostny",
    name: "Slávnostný ruženec",
    days: [0, 3], // Ne, St
    mysteries: [
      { title: "Zmŕtvychvstanie", formula: "ktorý z mŕtvych vstal" },
      { title: "Nanebovstúpenie", formula: "ktorý na nebo vstúpil" },
      { title: "Zoslanie Ducha Svätého", formula: "ktorý nám zoslal Ducha Svätého" },
      { title: "Nanebovzatie Panny Márie", formula: "ktorý ťa, Panna, vzal do neba" },
      { title: "Korunovanie Panny Márie", formula: "ktorý ťa, Panna, v nebi korunoval" },
    ],
  },
];
