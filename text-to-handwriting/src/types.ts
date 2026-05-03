export interface Settings {
  text: string;
  fontFamily: string;
  fontSize: number;
  inkColor: string;
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
  margin: number;
  paperType: 'blank' | 'lined';
  paperColor: string;
  backgroundImage: string | null;
  scannerEffect: boolean;
  shadowEffect: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  text: '',
  fontFamily: 'Project Note',
  fontSize: 18,
  inkColor: '#000080', // Navy Blue
  lineHeight: 1.5,
  letterSpacing: 0,
  wordSpacing: 4,
  margin: 40,
  paperType: 'lined',
  paperColor: '#ffffff',
  backgroundImage: null,
  scannerEffect: false,
  shadowEffect: false,
};
