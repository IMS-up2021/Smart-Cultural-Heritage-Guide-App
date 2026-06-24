export interface Exhibit {
  name: string;
  period: string;
}

export interface LocationData {
  id: string;
  name: string;
  shortName: string;
  category: 'Museum' | 'Monument' | 'Castle' | 'Church' | 'Palace';
  distance: string;
  rating: number;
  reviews: number;
  visits: number;
  description: { explorer: string; scholar: string };
  hours: string;
  address: string;
  image: string;
  galleryImages: string[];
  hasAudio: boolean;
  hasVideo: boolean;
  period: string;
  mapCoords: { x: number; y: number };
  tags: string[];
  exhibits: Exhibit[];
  audioTitle: string;
  audioDuration: number;
  entryFee: string;
  website: string;
}

export interface TourStop {
  locationId: string;
  walkTime: string;
  walkDistance: string;
  audioChapter: number;
}

export interface TourData {
  id: string;
  name: string;
  duration: string;
  distance: string;
  stops: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  description: string;
  locationIds: string[];
  tourStops: TourStop[];
  image: string;
  theme: string;
  mapPath: string;
}

export const LOCATIONS: LocationData[] = [
  {
    id: 'museu-nacional',
    name: 'Museu Nacional de Arte Antiga',
    shortName: 'Arte Antiga',
    category: 'Museum',
    distance: '120 m',
    rating: 4.8,
    reviews: 3420,
    visits: 124000,
    description: {
      explorer: 'One of Portugal\'s greatest art museums, packed with treasures from the Age of Discovery. The collection spans 1,200 years — Portuguese painting, gilded altarpieces, exotic Japanese screens brought by traders, and Moorish ceramics. Don\'t miss the iconic Panels of São Vicente de Fora.',
      scholar: 'Founded in 1884 and housed in the 17th-century Palácio Alvo, the Museu Nacional de Arte Antiga constitutes the primary repository of Portuguese visual culture from the 8th to the 19th centuries. Its holdings include the seminal polyptych Painéis de São Vicente de Fora (attr. Nuno Gonçalves, c.1470–80), the Manueline-period Custódia de Belém (Gil Vicente, 1506), and an exceptional corpus of Namban art reflecting Lusophone-Japanese cultural exchange during the Azuchi-Momoyama period.',
    },
    hours: 'Tue–Sun: 10:00–18:00',
    address: 'Rua das Janelas Verdes, 1249-017 Lisboa',
    image: 'photo-1649452843752-663493034117',
    galleryImages: [
      'photo-1649452843752-663493034117',
      'photo-1761563071832-e548e022a706',
      'photo-1575223970966-76ae61ee7838',
    ],
    hasAudio: true,
    hasVideo: true,
    period: 'Founded 1884',
    mapCoords: { x: 170, y: 140 },
    tags: ['Art', 'History', 'Collections', 'Medieval'],
    exhibits: [
      { name: 'Panels of São Vicente de Fora', period: 'c. 1470–1480' },
      { name: 'Custódia de Belém', period: '1506' },
      { name: 'Indo-Portuguese Furniture', period: '16th–17th c.' },
      { name: 'Flemish Paintings Collection', period: '15th–16th c.' },
      { name: 'Namban Screens Gallery', period: 'c. 1590–1610' },
    ],
    audioTitle: 'Chapter 1: The Golden Age of Portuguese Art',
    audioDuration: 348,
    entryFee: '€6 / Free under 12',
    website: 'museudearteantiga.pt',
  },
  {
    id: 'mosteiro-jeronimos',
    name: 'Mosteiro dos Jerónimos',
    shortName: 'Jerónimos',
    category: 'Church',
    distance: '350 m',
    rating: 4.9,
    reviews: 18700,
    visits: 893000,
    description: {
      explorer: 'A UNESCO World Heritage masterpiece that took over a century to build. This breathtaking monastery was commissioned by King Manuel I to celebrate Vasco da Gama\'s sea route to India. The ornate stone carvings — ropes, armillary spheres, anchors — are a visual poem about Portugal\'s maritime glory.',
      scholar: 'Commissioned by Dom Manuel I c. 1501 and constructed over 100 years (principal architects: Boytac, João de Castilho, Diogo de Torralva), the Mosteiro dos Jerónimos represents the apogee of the Manueline architectural style — a uniquely Lusophone idiom synthesising late Gothic structure with maritime iconography, Moorish decorative vocabulary, and Renaissance spatial sensibility. Designated UNESCO World Heritage Site in 1983, its cloister is among the finest examples of Portuguese stone carving.',
    },
    hours: 'Tue–Sun: 09:30–17:30',
    address: 'Praça do Império, 1400-206 Lisboa',
    image: 'photo-1598417642835-f05aa7bd7702',
    galleryImages: [
      'photo-1598417642835-f05aa7bd7702',
      'photo-1566927244565-9a96a147a998',
      'photo-1570312601864-af0a405333cf',
    ],
    hasAudio: true,
    hasVideo: true,
    period: 'Built 1502–1601',
    mapCoords: { x: 80, y: 170 },
    tags: ['Architecture', 'UNESCO', 'Manueline', 'Gothic'],
    exhibits: [
      { name: 'Church of Santa Maria', period: '1517' },
      { name: 'Tomb of Vasco da Gama', period: '1880' },
      { name: 'Royal Cloister', period: '1517–1541' },
      { name: 'Chapter House', period: '16th c.' },
      { name: 'Tomb of Luís de Camões', period: '1880' },
    ],
    audioTitle: 'Chapter 1: Stone, Sea, and Empire',
    audioDuration: 412,
    entryFee: '€10 / Free under 12',
    website: 'mosteirojeronimos.gov.pt',
  },
  {
    id: 'castelo-sao-jorge',
    name: 'Castelo de São Jorge',
    shortName: 'Castelo',
    category: 'Castle',
    distance: '980 m',
    rating: 4.7,
    reviews: 12100,
    visits: 671000,
    description: {
      explorer: 'Perched atop Lisbon\'s highest hill, this Moorish castle offers a panoramic sweep of the entire city. Wander the ancient battlements, peer into the excavated Iron Age village, and spot peacocks strolling the grounds. The views at sunset are unforgettable.',
      scholar: 'Occupying an Iron Age settlement site above the Tagus, Castelo de São Jorge was reinforced by successive Visigothic, Moorish (8th c.), and Portuguese (Christian reconquest, 1147) builders. The present crenellated silhouette dates principally from the 14th-century reign of Dom Afonso IV. In-situ archaeological excavations (ongoing since 1996) have exposed stratified occupation from the 7th century BCE through the Islamic period, with artefacts housed in the adjacent Museu do Castelo.',
    },
    hours: 'Daily: 09:00–21:00 (Jun–Oct), 09:00–18:00 (Nov–May)',
    address: 'R. de Santa Cruz do Castelo, 1100-129 Lisboa',
    image: 'photo-1570312601864-af0a405333cf',
    galleryImages: [
      'photo-1570312601864-af0a405333cf',
      'photo-1572905421176-6fa2f11a236e',
      'photo-1566927244565-9a96a147a998',
    ],
    hasAudio: true,
    hasVideo: false,
    period: 'Founded c. 1st c. AD',
    mapCoords: { x: 310, y: 100 },
    tags: ['Castle', 'Moorish', 'Viewpoint', 'Archaeological'],
    exhibits: [
      { name: 'Archaeological Site (Iron Age)', period: '7th c. BCE' },
      { name: 'Islamic Quarter Remains', period: '8th–12th c.' },
      { name: 'Ulysses Tower & Museum', period: '14th c.' },
      { name: 'Peacock Garden', period: '20th c.' },
    ],
    audioTitle: 'Chapter 1: A Hill Above History',
    audioDuration: 295,
    entryFee: '€15 / Free under 10',
    website: 'castelodesaojorge.pt',
  },
  {
    id: 'torre-belem',
    name: 'Torre de Belém',
    shortName: 'Torre de Belém',
    category: 'Monument',
    distance: '1.2 km',
    rating: 4.6,
    reviews: 22400,
    visits: 1030000,
    description: {
      explorer: 'Lisbon\'s most iconic silhouette — a limestone tower rising from the Tagus like a chess piece. Built to guard the river entrance, it once welcomed home explorers from India and the Americas. Look for the carving of a rhinoceros on the lower bastion — one of the earliest European depictions of the animal.',
      scholar: 'Constructed between 1516 and 1521 under Master Architect Francisco de Arruda, Torre de Belém is a singularly refined articulation of the Manueline idiom in military architecture. Its bastioned lower platform incorporates an extraordinary rhinoceros figurehead — likely derived from Albrecht Dürer\'s 1515 woodcut, representing the gift of an Indian rhinoceros from Sultan Muzaffar II to King Manuel I. Designated UNESCO World Heritage Site (jointly with Mosteiro dos Jerónimos) in 1983.',
    },
    hours: 'Tue–Sun: 10:00–17:30',
    address: 'Av. Brasília, 1400-038 Lisboa',
    image: 'photo-1572905421176-6fa2f11a236e',
    galleryImages: [
      'photo-1572905421176-6fa2f11a236e',
      'photo-1598417642835-f05aa7bd7702',
      'photo-1714509068734-a2ece8da080e',
    ],
    hasAudio: true,
    hasVideo: true,
    period: 'Built 1516–1521',
    mapCoords: { x: 40, y: 200 },
    tags: ['Architecture', 'UNESCO', 'Maritime', 'Military'],
    exhibits: [
      { name: 'Rhinoceros Carving (Bastion)', period: '1516' },
      { name: 'Governor\'s Room', period: '16th c.' },
      { name: 'Royal Hall (2nd Floor)', period: '16th c.' },
      { name: 'Terrace & Watchtowers', period: '16th c.' },
    ],
    audioTitle: 'Chapter 1: Guardian of the Tagus',
    audioDuration: 380,
    entryFee: '€6 / Free under 12',
    website: 'torrebelem.gov.pt',
  },
  {
    id: 'museu-azulejo',
    name: 'Museu Nacional do Azulejo',
    shortName: 'Azulejo',
    category: 'Museum',
    distance: '2.1 km',
    rating: 4.8,
    reviews: 6800,
    visits: 285000,
    description: {
      explorer: 'Portugal\'s most distinctive art form — ceramic tiles — gets its own museum, housed in a stunning 16th-century convent. The highlight is a 36-metre-long tile panorama of Lisbon painted in 1738, showing the city exactly as it looked 17 years before the Great Earthquake destroyed it.',
      scholar: 'Established in 1965 within the former Convento da Madre de Deus (founded 1509), the Museu Nacional do Azulejo constitutes the world\'s most comprehensive collection of glazed ceramic tilework, tracing the evolution of azulejo production from 15th-century Hispano-Moorish geometric work through the Baroque polychrome narrative panels of the 18th century to contemporary studio practice. The Great Panorama of Lisbon (c. 1738, 1,300 tiles, 36.5m) represents an irreplaceable pre-pombaline cartographic record.',
    },
    hours: 'Tue–Sun: 10:00–18:00',
    address: 'R. Me. Deus 4, 1900-312 Lisboa',
    image: 'photo-1754336241390-9a945d0d4daf',
    galleryImages: [
      'photo-1754336241390-9a945d0d4daf',
      'photo-1752608911056-ccec7f5c0a8e',
      'photo-1761563071832-e548e022a706',
    ],
    hasAudio: false,
    hasVideo: false,
    period: 'Founded 1965',
    mapCoords: { x: 340, y: 90 },
    tags: ['Azulejos', 'Decorative Arts', 'Convent', 'Ceramics'],
    exhibits: [
      { name: 'Great Panorama of Lisbon (1738)', period: 'c. 1738' },
      { name: 'Chapel of Santo António', period: '16th c.' },
      { name: 'Baroque Tiles Room', period: '17th–18th c.' },
      { name: 'Hispano-Moorish Gallery', period: '15th–16th c.' },
      { name: 'Modern Azulejaria', period: '20th–21st c.' },
    ],
    audioTitle: 'Chapter 1: Five Centuries of Tile',
    audioDuration: 310,
    entryFee: '€5 / Free under 12',
    website: 'museudoazulejo.gov.pt',
  },
  {
    id: 'museu-fado',
    name: 'Museu do Fado',
    shortName: 'Museu do Fado',
    category: 'Museum',
    distance: '870 m',
    rating: 4.5,
    reviews: 4200,
    visits: 142000,
    description: {
      explorer: 'Feel the soul of Lisbon in this beautifully curated museum dedicated to Fado — the melancholic musical genre born in the city\'s working-class neighbourhoods. Listen to recordings, see the distinctive Portuguese guitar, and follow the story from 19th-century taverns to international concert halls.',
      scholar: 'Inaugurated in 1998 in Alfama, Fado\'s historic birthplace, the Museu do Fado documents the socio-cultural evolution of the genre from its probable origins in urban popular music of the 1820s–1840s through its international recognition (UNESCO Intangible Cultural Heritage, 2011). The collection includes rare 78 rpm recordings, original costumes worn by Amália Rodrigues, and an extensive organological collection of viola baixo, guitarra portuguesa, and cavaquinho instruments.',
    },
    hours: 'Tue–Sun: 10:00–18:00',
    address: 'Largo do Chafariz de Dentro 1, 1100-139 Lisboa',
    image: 'photo-1761563071832-e548e022a706',
    galleryImages: [
      'photo-1761563071832-e548e022a706',
      'photo-1752608911056-ccec7f5c0a8e',
      'photo-1575223970966-76ae61ee7838',
    ],
    hasAudio: true,
    hasVideo: true,
    period: 'Founded 1998',
    mapCoords: { x: 290, y: 120 },
    tags: ['Music', 'UNESCO', 'Culture', 'Intangible Heritage'],
    exhibits: [
      { name: 'Origins of Fado (19th c.)', period: '1820s–1900' },
      { name: 'Amália Rodrigues Gallery', period: '1920–1999' },
      { name: 'Portuguese Guitar Collection', period: 'Various' },
      { name: 'Contemporary Fado Stage', period: '21st c.' },
    ],
    audioTitle: 'Chapter 1: The Voice of Lisbon',
    audioDuration: 268,
    entryFee: '€5 / Free under 12',
    website: 'museudofado.pt',
  },
];

export const TOURS: TourData[] = [
  {
    id: 'belem-discovery',
    name: 'Belém Discovery Trail',
    duration: '2h 30min',
    distance: '3.2 km',
    stops: 3,
    difficulty: 'Easy',
    description: 'Follow the footsteps of Portuguese explorers along the Tagus waterfront, from the iconic tower to the monastery that sent them off to sea.',
    locationIds: ['torre-belem', 'mosteiro-jeronimos', 'museu-nacional'],
    tourStops: [
      { locationId: 'torre-belem', walkTime: '—', walkDistance: 'Start here', audioChapter: 1 },
      { locationId: 'mosteiro-jeronimos', walkTime: '12 min', walkDistance: '850 m', audioChapter: 2 },
      { locationId: 'museu-nacional', walkTime: '15 min', walkDistance: '1.1 km', audioChapter: 3 },
    ],
    image: 'photo-1744380623104-5fa0711afdd4',
    theme: 'Age of Discovery',
    mapPath: 'M 40 200 L 80 170 L 170 140',
  },
  {
    id: 'alfama-heritage',
    name: 'Alfama Heritage Walk',
    duration: '1h 45min',
    distance: '2.1 km',
    stops: 3,
    difficulty: 'Moderate',
    description: 'Explore Lisbon\'s oldest quarter where Moorish walls meet Fado music, climbing through medieval alleyways to the city\'s crowning castle.',
    locationIds: ['museu-fado', 'museu-azulejo', 'castelo-sao-jorge'],
    tourStops: [
      { locationId: 'museu-fado', walkTime: '—', walkDistance: 'Start here', audioChapter: 1 },
      { locationId: 'museu-azulejo', walkTime: '8 min', walkDistance: '650 m', audioChapter: 2 },
      { locationId: 'castelo-sao-jorge', walkTime: '18 min', walkDistance: '1.2 km', audioChapter: 3 },
    ],
    image: 'photo-1752608911056-ccec7f5c0a8e',
    theme: 'Moorish & Medieval',
    mapPath: 'M 290 120 L 340 90 L 310 100',
  },
];

export function getLocation(id: string): LocationData | undefined {
  return LOCATIONS.find(l => l.id === id);
}

export function getTour(id: string): TourData | undefined {
  return TOURS.find(t => t.id === id);
}

export function getImageUrl(photoId: string, width = 800, height = 500): string {
  return `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&fit=crop&auto=format`;
}
