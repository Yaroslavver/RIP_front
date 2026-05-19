export interface Electrolyte {
  id: number;
  name: string;
  concentration: number;
  ions: string;
  ph: number;
  description: string;
  image: string;
  video: string;
  description_en: string;
  embedding?: number[];
}

export interface CurrentUser {
  id: number;
  login: string;
  isModerator: boolean;
}

export interface CartInfo {
  draft_id: number;
  count: number;
}

export interface ConcentrationItem {
  id: number;
  concentration_id?: number;
  electrolyte_id: number;
  volume: number;
  comment?: string;
  electrolyte?: Electrolyte;
  Electrolyte?: Electrolyte;
}

export interface Concentration {
  id: number;
  status: string;
  result?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  finished_at?: string | null;
  creator_id?: number;
  creator?: { id?: number; login?: string };
  Creator?: { id?: number; login?: string };
}

export interface ConcentrationDetails {
  concentration: Concentration | null;
  items: ConcentrationItem[];
}

export interface RequestFilters {
  status: string;
  from: string;
  to: string;
  creator: string;
}
