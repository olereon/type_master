// Keyboard layout images - static imports for webpack
import EnglishUSQWERTY from '../assets/keyboard-layouts/Layout_English_US-QWERTY.png';
import EnglishUKQWERTY from '../assets/keyboard-layouts/Layout_English_UK-QWERTY.png';
import EnglishDVORAK from '../assets/keyboard-layouts/Layout_English_DVORAK.png';
import EnglishCOLEMAK from '../assets/keyboard-layouts/Layout_English_COLEMAK.png';
import EnglishWORKMAN from '../assets/keyboard-layouts/Layout_English_WORKMAN.png';

import SpanishLATAM from '../assets/keyboard-layouts/Layout_Spanish_LATAM.png';
import SpanishStandart from '../assets/keyboard-layouts/Layout_Spanish_Standart.png';

import FrenchBEPO from '../assets/keyboard-layouts/Layout_French_BEPO.png';
import FrenchCanadian from '../assets/keyboard-layouts/Layout_French_Canadian.png';
import FrenchStandart from '../assets/keyboard-layouts/Layout_French_Standart.png';

import GermanStandart from '../assets/keyboard-layouts/Layout_German_Standart.png';

import UkrainianStandart from '../assets/keyboard-layouts/Layout_Ukrainian_Standart.png';

export const keyboardLayoutImages: Record<string, string> = {
  'Layout_English_US-QWERTY.png': EnglishUSQWERTY,
  'Layout_English_UK-QWERTY.png': EnglishUKQWERTY,
  'Layout_English_DVORAK.png': EnglishDVORAK,
  'Layout_English_COLEMAK.png': EnglishCOLEMAK,
  'Layout_English_WORKMAN.png': EnglishWORKMAN,
  
  'Layout_Spanish_LATAM.png': SpanishLATAM,
  'Layout_Spanish_Standart.png': SpanishStandart,
  
  'Layout_French_BEPO.png': FrenchBEPO,
  'Layout_French_Canadian.png': FrenchCanadian,
  'Layout_French_Standart.png': FrenchStandart,
  
  'Layout_German_Standart.png': GermanStandart,
  
  'Layout_Ukrainian_Standart.png': UkrainianStandart,
};

export const getLayoutImageSrc = (language: string, layout: string): string => {
  const languageFileNames: Record<string, string> = {
    en: 'English',
    es: 'Spanish', 
    fr: 'French',
    de: 'German',
    ua: 'Ukrainian'
  };
  
  const fileLanguageName = languageFileNames[language] || 'English';
  const imageName = `Layout_${fileLanguageName}_${layout}.png`;
  return keyboardLayoutImages[imageName] || '';
};