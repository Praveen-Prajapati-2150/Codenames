function generateRoomParam() {
  const adjectives = [
    'ash',
    'brisk',
    'calm',
    'damp',
    'eager',
    'frost',
    'gentle',
    'happy',
    'icy',
    'jolly',
    'keen',
    'light',
    'mild',
    'neat',
    'oily',
    'proud',
    'quick',
    'rough',
    'soft',
    'tame',
    'vast',
    'wild',
    'young',
    'zesty',
  ];
  const verbs = [
    'paste',
    'shine',
    'jump',
    'wave',
    'slide',
    'hover',
    'drift',
    'soar',
    'blend',
    'grow',
    'chase',
    'fetch',
    'glow',
    'grip',
    'mix',
    'rush',
    'sway',
    'lift',
    'twist',
    'move',
    'spin',
    'rest',
    'catch',
    'draw',
  ];
  const nouns = [
    'patient',
    'forest',
    'ocean',
    'mountain',
    'valley',
    'meadow',
    'river',
    'cliff',
    'stone',
    'creek',
    'desert',
    'field',
    'garden',
    'island',
    'lake',
    'peak',
    'canyon',
    'path',
    'hill',
    'wood',
    'pond',
    'shore',
    'bay',
    'trail',
  ];

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${randomAdjective}-${randomVerb}-${randomNoun}`;
}

export default generateRoomParam;
