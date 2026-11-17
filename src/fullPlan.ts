import {interpolate} from 'remotion';
import {BEATS as DEMO_BEATS, FPS, type BeatMeta} from './demoPlan';

export {FPS};
export const FULL_TOTAL_FRAMES = 22396; // 746.52s @ 30fps

const RAW_NEW_BEATS: Array<{id: string; label: string; t0: number; t1: number}> = [
  {id: 'B14', label: 'V2 Mendengarkan & M3 Bibit', t0: 191.52, t1: 216.0},
  {id: 'B15', label: 'Checkpoint 46 vs 40 & Tahun 4', t0: 216.0, t1: 244.16},
  {id: 'B16', label: 'M4 Dua Jalur Gabah', t0: 244.16, t1: 254.02},
  {id: 'B17', label: 'Map Hidup & V3 Larangan', t0: 254.02, t1: 266.4},
  {id: 'B18', label: 'V4 Ujang Menyeberang', t0: 266.4, t1: 280.3},
  {id: 'B19', label: 'Checkpoint 60 vs 44 & Sari', t0: 280.3, t1: 307.38},
  {id: 'B20', label: 'Dialog 1 Sari vs Mulyadi', t0: 307.38, t1: 330.24},
  {id: 'B21', label: 'M5 Air Turun Kemarau', t0: 330.24, t1: 343.62},
  {id: 'B22', label: 'V5 Pompa Pinjaman Ditolak', t0: 343.62, t1: 357.04},
  {id: 'B23', label: 'Taruhan 2 & Skor 74 vs 38', t0: 357.04, t1: 375.88},
  {id: 'B24', label: 'V6 Eksodus & Desa Sepi', t0: 375.88, t1: 415.44},
  {id: 'B25', label: 'Dialog 2 Bujuk Satu Pompa', t0: 415.44, t1: 435.06},
  {id: 'B26', label: 'V7 Pompa Rahasia Malam', t0: 435.06, t1: 451.48},
  {id: 'B27', label: 'M6 Cara Kerja Pompa & 80 vs 46', t0: 451.48, t1: 472.5},
  {id: 'B28', label: 'Pasar Bersama & V8 Kopi', t0: 472.5, t1: 513.8},
  {id: 'B29', label: 'Dialog 3 Mulyadi 88 Tahun', t0: 513.8, t1: 545.74},
  {id: 'B30', label: 'Grafik Skor & 88 vs 56', t0: 545.74, t1: 575.76},
  {id: 'B31', label: 'V9 Hidup Ujang Dua Kali', t0: 575.76, t1: 601.84},
  {id: 'B32', label: 'M7 Eksperimen Balik', t0: 601.84, t1: 647.3},
  {id: 'B33', label: 'Seratus Kali & M8 Lima Lapis', t0: 647.3, t1: 695.58},
  {id: 'B34', label: 'Jawaban Selisih Umur', t0: 695.58, t1: 710.96},
  {id: 'B35', label: 'Penutup & CTA', t0: 710.96, t1: 746.52},
];

const NEW_BEATS: BeatMeta[] = RAW_NEW_BEATS.map((b) => {
  const from = Math.round(b.t0 * FPS);
  const to = Math.round(b.t1 * FPS);
  return {
    id: b.id,
    label: b.label,
    t0: b.t0,
    t1: b.t1,
    from,
    durationInFrames: to - from,
  };
});

export const FULL_BEATS: BeatMeta[] = [...DEMO_BEATS, ...NEW_BEATS];

/** Convert absolute video seconds to local beat frames for any beat B01..B35. */
export const fullLocalF = (beatId: string, absSec: number): number => {
  const b = FULL_BEATS.find((x) => x.id === beatId);
  if (!b) throw new Error(`Unknown beat ${beatId}`);
  return Math.round((absSec - b.t0) * FPS);
};

const YEAR_MARKERS: Array<{sec: number; year: number}> = [
  {sec: 0, year: 1},
  {sec: 153.5, year: 2},
  {sec: 210.42, year: 3},
  {sec: 226.64, year: 4},
  {sec: 244.16, year: 5},
  {sec: 251.2, year: 6},
  {sec: 293.8, year: 7},
  {sec: 324.65, year: 8},
  {sec: 330.24, year: 9},
  {sec: 360.44, year: 10},
  {sec: 384.32, year: 11},
  {sec: 397.1, year: 12},
  {sec: 435.06, year: 13},
  {sec: 451.94, year: 14},
  {sec: 472.5, year: 15},
  {sec: 489.42, year: 16},
  {sec: 513.8, year: 18},
  {sec: 538.38, year: 19},
  {sec: 545.74, year: 20},
];

// Score checkpoints: [startSec, endSec, fromS, toS, fromT, toT]
const SCORE_STEPS: Array<[number, number, number, number, number, number]> = [
  [177.58, 182.5, 20, 28, 20, 34],
  [229.4, 232.0, 28, 46, 34, 40],
  [290.12, 292.8, 46, 60, 40, 44],
  [361.54, 364.2, 60, 74, 44, 38],
  [456.28, 458.8, 74, 80, 38, 46],
  [549.56, 553.0, 80, 88, 46, 56],
];

export const fullHudStateAt = (globalFrame: number): {year: number; s: number; t: number; yearLabel?: string} => {
  const sec = globalFrame / FPS;

  let year = 1;
  for (const m of YEAR_MARKERS) {
    if (sec >= m.sec) year = m.year;
  }

  let s = 20;
  let t = 20;
  for (const [s0, s1, fs, ts, ft, tt] of SCORE_STEPS) {
    if (sec >= s0) {
      const p = interpolate(sec, [s0, s1], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      s = Math.round(fs + (ts - fs) * p);
      t = Math.round(ft + (tt - ft) * p);
    }
  }

  // Counterfactual rerun during B32 (620.60..647.30): animate scores to 90 vs 74 in HUD only
  if (sec >= 620.6 && sec < 647.3) {
    const p = interpolate(sec, [620.6, 624.5], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    s = Math.round(88 + (90 - 88) * p);
    t = Math.round(56 + (74 - 56) * p);
    return {year: 20, s, t, yearLabel: 'EKSPERIMEN • TH 20'};
  }

  return {year, s, t};
};
