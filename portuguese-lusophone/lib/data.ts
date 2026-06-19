import type { Flashcard, Lesson, PhrasebookSection, QuizItem, SoundGuide, VocabRow } from './types';

export const MOZAMBIQUE = {
  name: 'Mozambique',
  label: 'Moçambique',
  capital: 'Maputo',
  tagline: 'Portuguese for people who have just moved here',
};

export const QUICK_START = [
  'Learn “Não percebi” and “Pode repetir?” — you will use them daily.',
  'Save emergency phrases on your phone — screenshot the Emergencies section in Daily life.',
  'Markets: always ask Quanto é? before you buy.',
  'Transport: chapa for shared minibuses; autocarro for larger buses.',
  'Formal places (banks, clinics): use o senhor / a senhora and você.',
];

export const SOUND_GUIDE: SoundGuide[] = [
  { letter: 'ã / â', name: 'Nasal a', pron: { simple: 'ahng (as in não)', ipa: '/ɐ̃/' }, tip: 'Essential: não, mãe, manhã' },
  { letter: 'õ', name: 'Nasal o', pron: { simple: 'ohng (as in bom)', ipa: '/õ/' }, tip: 'In bom, obrigado' },
  { letter: 'nh', name: 'Palatal N', pron: { simple: 'nyee (banho)', ipa: '/ɲ/' }, tip: 'casa de banho = toilet' },
  { letter: 'x', name: 'X', pron: { simple: 'sh (fixe)', ipa: '/ʃ/' }, tip: 'fixe = great / OK' },
  { letter: 'estou a', name: 'Ongoing action', pron: { simple: 'esh-TOH ah', ipa: '/ɨʃˈto a/' }, tip: 'Estou a trabalhar = I am working' },
  { letter: 's (end)', name: 'Final S', pron: { simple: 'clear s', ipa: '/s/' }, tip: 'Not like Brazilian “z” at the end' },
];

export const LESSONS: Lesson[] = [
  {
    id: 'welcome',
    title: 'Your first weeks in Mozambique',
    body: `If you have just moved here, you do not need perfect Portuguese on day one. People appreciate effort, patience, and polite greetings.

Portuguese is the language of government, schools, many workplaces, and urban daily life. In cities you will also hear local languages — that is normal. Start with short phrases for shops, transport, and neighbours.

This app uses European Portuguese (pt-PT) for audio — the same tradition taught in Mozambique. Tap 🔊 on any phrase to practise.`,
  },
  {
    id: 'new-here',
    title: 'Telling people you are new',
    body: `Use these when meeting neighbours, colleagues, or officials. Mozambicans are often warm to newcomers who try to speak Portuguese.`,
    phrases: [
      { pt: 'Acabei de chegar a Moçambique.', en: 'I have just arrived in Mozambique.', pron: { simple: 'ah-kah-BAY dee sheh-GAR ah moh-sam-BEE-keh', ipa: '/ɐkɐˈsej dɨ ʃɨˈɡaɾ a musɐ̃ˈbi.kɨ/' } },
      { pt: 'Mudei-me para Moçambique.', en: 'I have moved to Mozambique.', pron: { simple: 'moo-DAY-mee PAH-rah moh-sam-BEE-keh', ipa: '/muˈdej.mɨ ˈpaɾɐ musɐ̃ˈbi.kɨ/' } },
      { pt: 'Não falo muito bem português.', en: "I don't speak Portuguese very well.", pron: { simple: 'nowng FAH-loh mwee-toh bayng por-too-GEHZ', ipa: '/ˈnɐ̃w̃ ˈfalu ˈmujtu ˈbɐ̃j̃ puɾtuˈɣeʃ/' }, note: 'Honest and useful' },
      { pt: 'Estou a aprender português.', en: 'I am learning Portuguese.', pron: { simple: 'esh-TOH ah ah-prehn-DER por-too-GEHZ', ipa: '/ɨʃˈto a ɐpɾẽˈdeɾ puɾtuˈɣeʃ/' } },
      { pt: 'Pode falar mais devagar, por favor?', en: 'Can you speak more slowly, please?', pron: { simple: 'POH-deh fah-LAR mysh deh-vah-GAR, por fah-VOR?', ipa: '/ˈpɔ.dɨ ˈfa.lɐ ˈmajʃ dɨ.vaˈɡaɾ puɾ fɐˈvoɾ/' } },
      { pt: 'Não percebi.', en: "I didn't understand.", pron: { simple: 'nowng per-SEH-bee', ipa: '/ˈnɐ̃w̃ pɨɾˈsɨ.bi/' } },
    ],
  },
  {
    id: 'greetings',
    title: 'Neighbours, shops & politeness',
    phrases: [
      { pt: 'Bom dia', en: 'Good morning', pron: { simple: 'bohng JEE-ah', ipa: '/bõ ˈdi.ɐ/' } },
      { pt: 'Olá', en: 'Hello', pron: { simple: 'oh-LAH', ipa: '/ɔˈla/' } },
      { pt: 'Olá, como está?', en: 'Hello, how are you?', pron: { simple: 'oh-LAH, KOH-moh es-TAH?', ipa: '/ɔˈla ˈko.mu ˈɛʃta/' }, note: 'Polite greeting' },
      { pt: 'Olá, como está?', en: 'Hello how are you', pron: { simple: 'oh-LAH, KOH-moh es-TAH?', ipa: '/ɔˈla ˈko.mu ˈɛʃta/' } },
      { pt: 'Olá', en: 'Hi', pron: { simple: 'oh-LAH', ipa: '/ɔˈla/' } },
      { pt: 'Boa tarde', en: 'Good afternoon', pron: { simple: 'BOH-ah TAR-deh', ipa: '/ˈbo.ɐ ˈtaɾ.dɨ/' } },
      { pt: 'Boa noite', en: 'Good evening / night', pron: { simple: 'BOH-ah NOY-chee', ipa: '/ˈbo.ɐ ˈnoj.tɨ/' } },
      { pt: 'Como está?', en: 'How are you?', pron: { simple: 'KOH-moh es-TAH?', ipa: '/ˈko.mu ˈɛʃta/' }, note: 'Safe default with strangers' },
      { pt: 'Está tudo bem?', en: 'Is everything well?', pron: { simple: 'es-TAH TOO-doo bayng?', ipa: '/ˈɛʃta ˈtu.du ˈbɐ̃j̃/' } },
      { pt: 'Obrigado / Obrigada', en: 'Thank you (m / f speaker)', pron: { simple: 'oh-bree-GAH-doo / dah', ipa: '/obɾiˈɣaðu/' } },
      { pt: 'Desculpe / Com licença', en: 'Sorry / Excuse me', pron: { simple: 'desh-KOOL-peh / kohng lee-SEN-sah', ipa: '/dɨʃˈkul.pɨ/' } },
      { pt: 'Até logo', en: 'See you soon', pron: { simple: 'ah-TEH LOH-goo', ipa: '/aˈtɛ ˈlo.ɡu/' } },
    ],
  },
  {
    id: 'transport',
    title: 'Getting around',
    body: `In Maputo and other cities, chapas (shared minibuses) are common. Confirm the destination before you get in. Have small metical notes ready when possible.`,
    phrases: [
      { pt: 'Onde fica a paragem do autocarro?', en: 'Where is the bus stop?', pron: { simple: 'ON-dee FEE-kah ah pah-RAH-zhehng doo ow-toh-KAH-roh?', ipa: '/ˈõ.dɨ ˈfi.kɐ a pɐˈɾaʒɐ̃j̃ du ˈaw.tuˈka.ʁu/' } },
      { pt: 'Esta chapa vai para…?', en: 'Does this minibus go to…?', pron: { simple: 'ESH-tah SHAH-pah vigh PAH-rah', ipa: '/ˈɛʃta ˈʃapɐ ˈvaj ˈpaɾɐ/' } },
      { pt: 'Pare aqui, por favor.', en: 'Stop here, please.', pron: { simple: 'PAH-reh ah-KEE, por fah-VOR', ipa: '/ˈpa.ɾɨ aˈki puɾ fɐˈvoɾ/' } },
      { pt: 'Quanto custa a viagem?', en: 'How much is the fare?', pron: { simple: 'KWAN-too KOOS-tah ah vee-ah-ZAYNG?', ipa: '/ˈkwɐ̃.tu ˈkus.tɐ a vjɐˈʒɐ̃j̃/' } },
      { pt: 'Pode chamar um táxi?', en: 'Can you call a taxi?', pron: { simple: 'POH-deh shah-MAR oong TAH-ksee?', ipa: '/ˈpɔ.dɨ ʃɐˈmaɾ ũ ˈtaʃi/' } },
    ],
  },
  {
    id: 'shopping',
    title: 'Markets, shops & money',
    body: `Metical (MT, plural meticais) is the currency. At markets, greet the seller, ask the price, then decide. Mobile money (M-Pesa, e-Mola, etc.) is widely used — learn the words your workplace or landlord uses.`,
    phrases: [
      { pt: 'Quanto é?', en: 'How much is it?', pron: { simple: 'KWAN-too EH?', ipa: '/ˈkwɐ̃.tu ˈɛ/' } },
      { pt: 'É muito caro.', en: "It's too expensive.", pron: { simple: 'EH mwee-toh KAH-roh', ipa: '/ˈɛ ˈmujtu ˈkaɾu/' } },
      { pt: 'Vou levar isto.', en: "I'll take this.", pron: { simple: 'voh leh-VAR EESH-too', ipa: '/ˈvo lɨˈvaɾ ˈiʃtu/' } },
      { pt: 'Tem troco?', en: 'Do you have change?', pron: { simple: 'tayng TROH-koo?', ipa: '/ˈtẽj̃ ˈtɾɔku/' } },
      { pt: 'Onde posso levantar dinheiro?', en: 'Where can I withdraw money?', pron: { simple: 'ON-deh POH-soo leh-vahn-TAR dee-NYEH-roh?', ipa: '/ˈõ.dɨ ˈpɔsu lɨˈvɐ̃taɾ diˈɲɐj.ɾu/' } },
    ],
  },
  {
    id: 'home',
    title: 'Home, rent & utilities',
    body: `When talking to a landlord, agent, or building manager, keep phrases simple and confirm details in writing when you can.`,
    phrases: [
      { pt: 'Procuro uma casa para alugar.', en: 'I am looking for a house to rent.', pron: { simple: 'proh-KOO-roh OO-mah KAH-zah PAH-rah ah-loo-GAR', ipa: '/pɾuˈkuɾu ˈumɐ ˈka.sɐ ˈpaɾɐ ɐluˈɡaɾ/' } },
      { pt: 'A água não está a funcionar.', en: 'The water is not working.', pron: { simple: 'ah AH-gwahnowng es-TAH ah foonk-see-oh-NAR', ipa: '/a ˈaɣwɐ ˈnɐ̃w̃ ˈɛʃta a fũsiuˈnaɾ/' } },
      { pt: 'A luz foi-se.', en: 'The power is out.', pron: { simple: 'ah looz foy-SEE', ipa: '/a ˈluʃ ˈfojsɨ/' }, note: 'Common way to say there is a blackout' },
      { pt: 'O senhor pode ajudar?', en: 'Can you help me? (to a man)', pron: { simple: 'oo seh-NYOR POH-deh ah-ZHOO-dar?', ipa: '/u sɨˈɲoɾ ˈpɔdɨ ɐʒuˈdaɾ/' } },
    ],
  },
  {
    id: 'health',
    title: 'Health & emergencies',
    body: `Save these phrases. For serious emergencies, seek local help immediately — language practice is secondary to safety.`,
    phrases: [
      { pt: 'Preciso de um médico.', en: 'I need a doctor.', pron: { simple: 'preh-SEE-zoo deh oong MEH-dee-koo', ipa: '/pɾɨˈsizu dɨ ũ mɨˈdiku/' } },
      { pt: 'Onde fica o hospital mais próximo?', en: 'Where is the nearest hospital?', pron: { simple: 'ON-dee FEE-kah oo ohs-pee-TAL mysh PROH-ksee-moo?', ipa: '/ˈõ.dɨ ˈfi.kɐ u ɔʃpiˈtal ˈmajʃ ˈpɾɔsimu/' } },
      { pt: 'Estou doente.', en: 'I am ill.', pron: { simple: 'esh-TOH doo-EN-teh', ipa: '/ɨʃˈto duˈẽtɨ/' } },
      { pt: 'Chame a polícia!', en: 'Call the police!', pron: { simple: 'SHAH-meh ah poh-LEE-see-ah', ipa: '/ˈʃamɨ a puˈlisjɐ/' } },
      { pt: 'Preciso de ajuda. É urgente.', en: 'I need help. It is urgent.', pron: { simple: 'preh-SEE-zoo deh ah-ZHOO-dah. EH oor-ZHEN-teh', ipa: '/pɾɨˈsizu dɨ ɐˈʒuðɐ ˈɛ uɾˈʒẽtɨ/' } },
    ],
  },
];

export const VOCABULARY: VocabRow[] = [
  { concept: 'Minibus', pt: 'chapa', note: 'Shared taxi — ask route before boarding', pron: { simple: 'SHAH-pah', ipa: '/ˈʃapɐ/' } },
  { concept: 'Bus', pt: 'autocarro', note: 'Larger / intercity buses', pron: { simple: 'ow-toh-KAH-roh', ipa: '/ˈaw.tuˈka.ʁu/' } },
  { concept: 'Taxi', pt: 'táxi', note: 'Agree price or use meter if available', pron: { simple: 'TAH-ksee', ipa: '/ˈtaʃi/' } },
  { concept: 'Stop (bus)', pt: 'paragem', note: 'Bus/minibus stop', pron: { simple: 'pah-RAH-zhehng', ipa: '/pɐˈɾaʒɐ̃j̃/' } },
  { concept: 'Money / currency', pt: 'dinheiro / metical', note: 'MT or MZN on prices', pron: { simple: 'dee-NYEH-roh / meh-tee-KAL', ipa: '/diˈɲɐj.ɾu/' } },
  { concept: 'Change (coins)', pt: 'troco', note: 'Markets often need small notes', pron: { simple: 'TROH-koo', ipa: '/ˈtɾɔku/' } },
  { concept: 'Rent', pt: 'renda / aluguer', note: 'Monthly rent', pron: { simple: 'HEN-dah / ah-loo-GEHR', ipa: '/ˈʁẽdɐ/' } },
  { concept: 'Landlord', pt: 'senhorio / senhora da casa', note: 'Formal: o senhorio', pron: { simple: 'seh-NYOR-ee-oo', ipa: '/sɨˈɲɔɾiu/' } },
  { concept: 'Electricity', pt: 'luz / electricidade', note: 'A luz foi-se = power cut', pron: { simple: 'looz / eh-lehk-tree-see-dah-DEE', ipa: '/ˈluʃ/' } },
  { concept: 'Water', pt: 'água', note: 'Bottled: água mineral', pron: { simple: 'AH-gwah', ipa: '/ˈa.ɣwɐ/' } },
  { concept: 'Market', pt: 'mercado / feira', note: 'feira often = market day / fair', pron: { simple: 'mer-KAH-doo / FAY-rah', ipa: '/mɨɾˈkaðu/' } },
  { concept: 'Supermarket', pt: 'supermercado', note: 'Larger shops in cities', pron: { simple: 'soo-per-mer-KAH-doo', ipa: '/ˌsupɨɾˈmɛɾkadu/' } },
  { concept: 'Pharmacy', pt: 'farmácia', note: 'For basic medicine', pron: { simple: 'far-MAH-see-ah', ipa: '/fɐɾˈmasjɐ/' } },
  { concept: 'Hospital', pt: 'hospital', note: 'Public and private options', pron: { simple: 'ohs-pee-TAL', ipa: '/ɔʃpiˈtal/' } },
  { concept: 'Police', pt: 'polícia', note: 'Emergency phrasebook has more', pron: { simple: 'poh-LEE-see-ah', ipa: '/puˈlisjɐ/' } },
  { concept: 'Toilet', pt: 'casa de banho', note: 'Not banheiro', pron: { simple: 'KAH-zah deh BAN-yoo', ipa: '/ˈka.sɐ dɨ ˈbɐ̃.ɲu/' } },
  { concept: 'Phone', pt: 'telemóvel', note: 'SIM: cartão SIM', pron: { simple: 'teh-leh-MOH-vel', ipa: '/tɨ.lɨˈmɔ.vɛl/' } },
  { concept: 'Address', pt: 'morada', note: 'For forms and deliveries', pron: { simple: 'moh-RAH-dah', ipa: '/muˈɾaðɐ/' } },
  { concept: 'Work', pt: 'trabalho / emprego', note: 'Job vs work', pron: { simple: 'trah-BAH-lyoo / em-PREH-goo', ipa: '/tɾɐˈbaʎu/' } },
  { concept: 'OK / great', pt: 'fixe', note: 'Friendly, everyday', pron: { simple: 'FEESH', ipa: '/ˈfi.ʃɨ/' } },
  { concept: 'Expensive', pt: 'caro', note: 'É muito caro = too expensive', pron: { simple: 'KAH-roh', ipa: '/ˈkaɾu/' } },
  { concept: 'Cheap', pt: 'barato', note: 'At markets', pron: { simple: 'bah-RAH-too', ipa: '/bɐˈɾatu/' } },
];

export const PHRASEBOOK: PhrasebookSection[] = [
  {
    id: 'arriving',
    title: 'Arriving & settling in',
    description: 'Introduce yourself as someone who has just moved.',
    phrases: [
      { pt: 'Acabei de chegar.', en: 'I have just arrived.', pron: { simple: 'ah-kah-BAY dee sheh-GAR', ipa: '/ɐkɐˈsej dɨ ʃɨˈɡaɾ/' } },
      { pt: 'Vivo aqui agora.', en: 'I live here now.', pron: { simple: 'VEE-voh ah-KEE ah-GOH-rah', ipa: '/ˈvivo aˈki ɐˈɡɔ.ɾɐ/' } },
      { pt: 'Estou à procura de trabalho.', en: 'I am looking for work.', pron: { simple: 'esh-TOH ah proh-KOO-rah deh trah-BAH-lyoo', ipa: '/ɨʃˈto a pɾuˈkuɾɐ dɨ tɾɐˈbaʎu/' } },
      { pt: 'Onde fica a farmácia mais próxima?', en: 'Where is the nearest pharmacy?', pron: { simple: 'ON-dee FEE-kah ah far-MAH-see-ah mysh PROH-ksee-mah?', ipa: '/ˈõ.dɨ ˈfi.kɐ a fɐɾˈmasjɐ ˈmajʃ ˈpɾɔsimɐ/' } },
    ],
  },
  {
    id: 'housing',
    title: 'Housing & home',
    phrases: [
      { pt: 'Tenho um contrato de arrendamento.', en: 'I have a rental contract.', pron: { simple: 'TAYNG-oo oong kon-TAH-too deh ah-ren-dah-MEN-too', ipa: '/ˈtẽj̃u ũ kõˈtɾatu dɨ ɐɾẽdɐˈmẽtu/' } },
      { pt: 'A internet não funciona.', en: 'The internet is not working.', pron: { simple: 'ah een-ter-NETnowng foonk-see-OH-nah', ipa: '/a ˌĩtɨɾˈnɛt ˈnɐ̃w̃ fũsiuˈna/' } },
      { pt: 'Há um problema na casa.', en: 'There is a problem in the house.', pron: { simple: 'ah oong proh-BLEH-mah nah KAH-zah', ipa: '/a ũ pɾuˈblɛmɐ nɐ ˈka.sɐ/' } },
    ],
  },
  {
    id: 'daily',
    title: 'Shops, food & restaurants',
    phrases: [
      { pt: 'Uma cerveja, por favor.', en: 'A beer, please.', pron: { simple: 'OO-mah ser-VAY-zhah, por fah-VOR', ipa: '/ˈumɐ sɨɾˈveʒɐ puɾ fɐˈvoɾ/' } },
      { pt: 'A conta, faz favor.', en: 'The bill, please.', pron: { simple: 'ah KON-tah, fahsh fah-VOR', ipa: '/a ˈkõtɐ faʃ fɐˈvoɾ/' } },
      { pt: 'Não como carne de porco.', en: "I don't eat pork.", pron: { simple: 'nowng KOH-moo KAR-neh deh POR-koo', ipa: '/ˈnɐ̃w̃ ˈkɔmu ˈkaɾnɨ dɨ ˈpoɾku/' }, note: 'Useful dietary phrase' },
      { pt: 'Onde posso comprar água?', en: 'Where can I buy water?', pron: { simple: 'ON-deh POH-soo kohm-PRAR AH-gwah?', ipa: '/ˈõ.dɨ ˈpɔsu kũˈpɾaɾ ˈaɣwɐ/' } },
    ],
  },
  {
    id: 'transport',
    title: 'Transport',
    phrases: [
      { pt: 'Para o centro, por favor.', en: 'To the centre, please.', pron: { simple: 'PAH-rah oo SEN-troh, por fah-VOR', ipa: '/ˈpaɾɐ u ˈsẽtɾu puɾ fɐˈvoɾ/' } },
      { pt: 'É longe daqui?', en: 'Is it far from here?', pron: { simple: 'EH LON-zheh dah-KEE?', ipa: '/ˈɛ ˈlõʒɨ dɐˈki/' } },
      { pt: 'Posso pagar com cartão?', en: 'Can I pay by card?', pron: { simple: 'POH-soo pah-GAR kohng kar-TOWNG?', ipa: '/ˈpɔsu pɐˈɡaɾ kũ kɐɾˈtɐ̃w̃/' } },
    ],
  },
  {
    id: 'official',
    title: 'Offices, banks & paperwork',
    phrases: [
      { pt: 'Tenho uma reunião às dez horas.', en: 'I have a meeting at ten o’clock.', pron: { simple: 'TAYNG-oo OO-mah reh-oo-nee-OWNG ahsh dehzh OH-rahsh', ipa: '/ˈtẽj̃u ˈumɐ ʁejuniˈɐ̃w̃ aʃ dɛʃ ˈɔɾɐʃ/' } },
      { pt: 'Preciso de uma fatura.', en: 'I need an invoice.', pron: { simple: 'preh-SEE-zoo deh OO-mah fah-TOO-rah', ipa: '/pɾɨˈsizu dɨ ˈumɐ fɐˈtuɾɐ/' } },
      { pt: 'Onde entrego este formulário?', en: 'Where do I submit this form?', pron: { simple: 'ON-deh en-TREH-goo ESH-teh for-moo-LAH-ree-oh?', ipa: '/ˈõ.dɨ ẽˈtɾɛɡu ˈɛʃtɨ fuɾmuˈlaɾju/' } },
      { pt: 'Falo inglês. Há alguém que fale inglês?', en: 'I speak English. Is there someone who speaks English?', pron: { simple: 'FAH-loh een-GLEHZ. ah AL-gayng keh FAH-leh een-GLEHZ?', ipa: '/ˈfalu ĩˈɡlɛʃ a ˈaɫɡɐ̃j̃ kɨ ˈfalɨ ĩˈɡlɛʃ/' } },
    ],
  },
  {
    id: 'emergency',
    title: 'Emergencies',
    description: 'Learn these before you need them.',
    phrases: [
      { pt: 'Ajuda!', en: 'Help!', pron: { simple: 'ah-ZHOO-dah', ipa: '/ɐˈʒuðɐ/' } },
      { pt: 'Chame uma ambulância!', en: 'Call an ambulance!', pron: { simple: 'SHAH-meh OO-mah am-boo-LAHN-see-ah', ipa: '/ˈʃamɨ ˈumɐ ɐ̃bulˈɐ̃sjɐ/' } },
      { pt: 'Perdi o passaporte.', en: 'I lost my passport.', pron: { simple: 'per-DEE oo pah-sah-POR-teh', ipa: '/pɨɾˈdi u pɐsɐˈpɔɾtɨ/' } },
      { pt: 'Onde fica a embaixada?', en: 'Where is the embassy?', pron: { simple: 'ON-dee FEE-kah ah em-bigh-SAH-dah?', ipa: '/ˈõ.dɨ ˈfi.kɐ a ẽbɐjˈʃaðɐ/' } },
    ],
  },
];

export const FLASHCARDS: Flashcard[] = VOCABULARY.map((row) => ({
  id: row.concept,
  front: row.concept,
  back: row.pt.split(' / ')[0] ?? row.pt,
  hint: row.note,
  pron: row.pron,
}));

export const QUIZ_ITEMS: QuizItem[] = [
  { q: 'You just moved — how do you say "I have just arrived"?', options: ['Sou de Moçambique', 'Acabei de chegar', 'Vou embora', 'Estou cansado'], answer: 1 },
  { q: 'Shared minibus used daily in cities:', options: ['comboio', 'chapa', 'avião', 'ferry'], answer: 1 },
  { q: 'How do you ask the price at a market?', options: ['Onde é?', 'Quanto é?', 'Que horas são?', 'Como está?'], answer: 1 },
  { q: 'The toilet is called:', options: ['banheiro', 'casa de banho', 'WC masculino', 'sanitário'], answer: 1 },
  { q: 'Power cut — common phrase:', options: ['A luz foi-se', 'A luz está fixe', 'Tenho luz', 'Apaguei a luz'], answer: 0 },
  { q: 'When you did not understand someone:', options: ['Não percebi', 'Não gosto', 'Não falo', 'Não quero'], answer: 0 },
  { q: 'Mozambican currency:', options: ['rand', 'metical', 'dollar', 'euro'], answer: 1 },
  { q: 'Cell phone (word used in Mozambique):', options: ['celular', 'telemóvel', 'fone', 'mobile'], answer: 1 },
  { q: 'Stop here (in a chapa or taxi):', options: ['Vamos embora', 'Pare aqui, por favor', 'Mais rápido', 'Está longe'], answer: 1 },
  { q: 'I need help — it is urgent:', options: ['Está fixe', 'Preciso de ajuda. É urgente.', 'Até logo', 'Bom dia'], answer: 1 },
];

export const TABS = [
  { id: 'home' as const, label: 'Start here' },
  { id: 'translate' as const, label: 'Translate' },
  { id: 'phrases' as const, label: 'Daily life' },
  { id: 'lessons' as const, label: 'Guides' },
  { id: 'vocab' as const, label: 'Words' },
  { id: 'sounds' as const, label: 'Sounds' },
  { id: 'practice' as const, label: 'Practice' },
];
