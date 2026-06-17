const COUNTRIES = {
  br: { id: 'br', name: 'Brazil', label: 'Brasil', speakers: '~214 million' },
  mz: { id: 'mz', name: 'Mozambique', label: 'Moçambique', speakers: '~33 million' },
  ao: { id: 'ao', name: 'Angola', label: 'Angola', speakers: '~35 million' },
};

const LESSONS = [
  {
    id: 'intro',
    title: 'One language, three worlds',
    body: `Portuguese is the official language in Brazil, Mozambique, and Angola. Grammar is largely shared (based on European Portuguese), but vocabulary, pronunciation, and everyday expressions differ.

Brazilian Portuguese (BP) absorbed indigenous and African influences and diverged strongly from European norms. Mozambican and Angolan Portuguese keep closer ties to European Portuguese while mixing in African languages (Bantu, Kimbundu, Umbundu, Swahili near the coast, and local creoles).

All three use the same alphabet and most verb tenses. Your biggest wins: learn core European-style grammar, then study regional words and sounds.`,
  },
  {
    id: 'pronunciation',
    title: 'Pronunciation highlights',
    body: `Brazil: vowels are more open; final -s often sounds like -z; -de/-di can sound like "dji" (cidade → "sidadji"). R at word end is often a soft h or dropped.

Mozambique & Angola: closer to European Portuguese; more reduced unstressed vowels; clearer consonants. In Angola, some speakers use more closed vowels in Luanda.

Informal "tu" is common in Mozambique and Angola among friends; Brazil prefers você (and tá for está).`,
    phrases: [
      { pt: 'Brasil: "legal" (cool)', en: 'Angola: "fixe" (cool)', note: 'MZ often uses "fixe" too (European influence)' },
      { pt: 'BR: você está bem?', en: 'MZ/AO: (Tu) estás bem?', note: 'Formal settings use o senhor/a senhora' },
    ],
  },
  {
    id: 'greetings',
    title: 'Greetings & politeness',
    phrases: [
      { pt: 'Olá / Oi', en: 'Hello', note: 'Oi is very common in Brazil; olá everywhere' },
      { pt: 'Bom dia / Boa tarde / Boa noite', en: 'Good morning / afternoon / evening', note: 'Shared' },
      { pt: 'Tudo bem? / Tá bom?', en: 'How are you? / All good?', note: 'Tá bom? especially Brazil' },
      { pt: 'Prazer em conhecê-lo(a)', en: 'Nice to meet you', note: 'BR: conhecer você — MZ/AO: conhecer-te (informal)' },
      { pt: 'Obrigado / Obrigada', en: 'Thank you', note: 'Gender matches speaker' },
      { pt: 'Desculpe / Com licença', en: 'Sorry / Excuse me', note: 'Shared' },
      { pt: 'Até logo / Até mais', en: 'See you soon', note: 'BR: até mais, falou! (informal)' },
    ],
  },
  {
    id: 'numbers',
    title: 'Numbers & time',
    body: 'Numbers 1–100 are identical. Brazil uses 24h clock in writing but often says "duas da tarde" in speech. Mozambique and Angola follow European habits in formal contexts.',
    phrases: [
      { pt: 'um, dois, três… dez, vinte, cem', en: '1, 2, 3… 10, 20, 100', note: '' },
      { pt: 'Que horas são?', en: 'What time is it?', note: 'Shared' },
      { pt: 'Hoje / Amanhã / Ontem', en: 'Today / Tomorrow / Yesterday', note: 'Shared' },
    ],
  },
];

const VOCABULARY = [
  { concept: 'Bus', br: 'ônibus', mz: 'autocarro / chapa*', ao: 'autocarro / machimbombo*', note: '*chapa = shared minibus (MZ); machimbombo = colloquial (AO)' },
  { concept: 'Cell phone', br: 'celular', mz: 'telemóvel', ao: 'telemóvel', note: 'BR uses American-style term' },
  { concept: 'Breakfast', br: 'café da manhã', mz: 'pequeno-almoço', ao: 'pequeno-almoço', note: 'MZ/AO align with European PT' },
  { concept: 'Boy / guy (informal)', br: 'cara, mano', mz: 'miúdo, gajo', ao: 'gajo, bué (intensifier)', note: 'bué = "very" / "a lot" in AO slang' },
  { concept: 'Cool / great', br: 'legal, massa', mz: 'fixe', ao: 'fixe', note: 'fixe from European PT, strong in Lusophone Africa' },
  { concept: 'Money', br: 'grana, dinheiro', mz: 'dinheiro', ao: 'dinheiro, kwanza', note: 'kwanza = AO currency and slang' },
  { concept: 'Work', br: 'trabalho', mz: 'trabalho', ao: 'trabalho', note: 'Shared' },
  { concept: 'To eat', br: 'comer', mz: 'comer', ao: 'comer', note: 'Shared' },
  { concept: 'Party', br: 'festa, balada', mz: 'festa', ao: 'festa, kizomba*', note: '*dance/music culture in AO' },
  { concept: 'Now', br: 'agora', mz: 'agora', ao: 'agora, já', note: 'já = "already/now" emphasis in AO' },
  { concept: 'Taxi (informal)', br: 'táxi / Uber', mz: 'chapa', ao: 'candongueiro*', note: '*informal transport names' },
  { concept: 'Friend', br: 'amigo/amiga', mz: 'amigo', ao: 'amigo, parceiro', note: 'parceiro common in AO' },
  { concept: 'House', br: 'casa', mz: 'casa', ao: 'casa', note: 'Shared' },
  { concept: 'Water', br: 'água', mz: 'água', ao: 'água', note: 'Shared' },
  { concept: 'Thank you (informal)', br: 'valeu!', mz: 'obrigado', ao: 'obrigado', note: 'valeu = BR informal thanks' },
];

const PHRASEBOOK = {
  br: [
    { pt: 'Oi, tudo bem?', en: 'Hi, how are you?' },
    { pt: 'Eu sou do Brasil.', en: 'I am from Brazil.' },
    { pt: 'Pode falar mais devagar?', en: 'Can you speak more slowly?' },
    { pt: 'Não entendi.', en: "I didn't understand." },
    { pt: 'Quanto custa?', en: 'How much does it cost?' },
    { pt: 'Onde fica o banheiro?', en: 'Where is the bathroom?' },
    { pt: 'Estou aprendendo português.', en: 'I am learning Portuguese.' },
  ],
  mz: [
    { pt: 'Olá, está tudo bem?', en: 'Hello, is everything well?' },
    { pt: 'Sou de Moçambique.', en: 'I am from Mozambique.' },
    { pt: 'Pode repetir, por favor?', en: 'Can you repeat, please?' },
    { pt: 'Não percebi.', en: "I didn't understand." },
    { pt: 'Quanto é?', en: 'How much is it?' },
    { pt: 'Onde é a casa de banho?', en: 'Where is the toilet?' },
    { pt: 'Estou a aprender português.', en: 'I am learning Portuguese.' },
  ],
  ao: [
    { pt: 'Olá, tudo bem?', en: 'Hello, all good?' },
    { pt: 'Sou de Angola.', en: 'I am from Angola.' },
    { pt: 'Fala mais devagar, faz favor.', en: 'Speak slower, please.' },
    { pt: 'Não entendi.', en: "I didn't understand." },
    { pt: 'Quanto custa?', en: 'How much does it cost?' },
    { pt: 'Onde fica a casa de banho?', en: 'Where is the bathroom?' },
    { pt: 'Estou a aprender português.', en: 'I am learning Portuguese.' },
  ],
};

const FLASHCARDS = VOCABULARY.flatMap((row) => [
  {
    id: `br-${row.concept}`,
    region: 'br',
    front: row.concept,
    back: row.br,
    hint: row.note,
  },
  {
    id: `mz-${row.concept}`,
    region: 'mz',
    front: `${row.concept} (Mozambique)`,
    back: row.mz.split(' / ')[0],
    hint: row.mz,
  },
  {
    id: `ao-${row.concept}`,
    region: 'ao',
    front: `${row.concept} (Angola)`,
    back: row.ao.split(' / ')[0],
    hint: row.ao,
  },
]);

const QUIZ_ITEMS = [
  {
    q: 'How do you say "bus" in Brazil?',
    options: ['autocarro', 'ônibus', 'chapa', 'machimbombo'],
    answer: 1,
    region: 'br',
  },
  {
    q: 'Which word means "cool" in Angola and much of Mozambique?',
    options: ['legal', 'massa', 'fixe', 'valeu'],
    answer: 2,
    region: 'ao',
  },
  {
    q: 'Cell phone in Mozambique/Angola (European term):',
    options: ['celular', 'telemóvel', 'telefone', 'mobile'],
    answer: 1,
    region: 'mz',
  },
  {
    q: 'Informal "thank you" often heard in Brazil:',
    options: ['fixe', 'valeu', 'bué', 'já'],
    answer: 1,
    region: 'br',
  },
  {
    q: 'Breakfast in Mozambique/Angola is usually called:',
    options: ['café da manhã', 'pequeno-almoço', 'almoço', 'jantar'],
    answer: 1,
    region: 'mz',
  },
  {
    q: 'Angolan slang intensifier meaning "very" or "a lot":',
    options: ['legal', 'bué', 'oi', 'chapa'],
    answer: 1,
    region: 'ao',
  },
  {
    q: 'Shared minibus transport name in Mozambique:',
    options: ['ônibus', 'chapa', 'Uber', 'trem'],
    answer: 1,
    region: 'mz',
  },
  {
    q: '"How are you?" — very casual Brazilian form:',
    options: ['Tudo bem?', 'Tá bom?', 'Estás bem?', 'Bom dia?'],
    answer: 1,
    region: 'br',
  },
];
