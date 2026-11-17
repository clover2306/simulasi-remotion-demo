import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import './pixelFont';
import {PaperDefs} from './lib/paper/kit';
import {CutSeries, type CutScene, type CutSpec} from './lib/paper/transitions';
import {FULL_BEATS, FULL_TOTAL_FRAMES, fullHudStateAt} from './fullPlan';
import {LiveMapContext} from './components/LiveMapBg';
import {GlobalHud, HudContext, PX} from './components/PixelUI';
import {B01_ColdOpen} from './scenes/B01_ColdOpen';
import {B02_ShowcaseKevin} from './scenes/B02_ShowcaseKevin';
import {B03_ShowcaseMulyadi} from './scenes/B03_ShowcaseMulyadi';
import {B04_Taruhan} from './scenes/B04_Taruhan';
import {B05_M1_GembokTuas} from './scenes/B05_M1_GembokTuas';
import {B06_AturanTeknologi} from './scenes/B06_AturanTeknologi';
import {B07_AturanRencana} from './scenes/B07_AturanRencana';
import {B08_AturanBelajar} from './scenes/B08_AturanBelajar';
import {B09_SatuPembedaTahun1} from './scenes/B09_SatuPembedaTahun1';
import {B10_M2_LumbungTerkuras} from './scenes/B10_M2_LumbungTerkuras';
import {B11_WargaBertanya} from './scenes/B11_WargaBertanya';
import {B12_V1_PompaMogok} from './scenes/B12_V1_PompaMogok';
import {B13_KontrasTanjungsari} from './scenes/B13_KontrasTanjungsari';
import {B14_V2_MendengarkanM3} from './scenes/B14_V2_MendengarkanM3';
import {B15_Checkpoint46_Tahun4} from './scenes/B15_Checkpoint46_Tahun4';
import {B16_M4_DuaJalurGabah} from './scenes/B16_M4_DuaJalurGabah';
import {B17_MapHidup_V3Larangan} from './scenes/B17_MapHidup_V3Larangan';
import {B18_V4_UjangMenyeberang} from './scenes/B18_V4_UjangMenyeberang';
import {B19_Checkpoint60_Tahun7} from './scenes/B19_Checkpoint60_Tahun7';
import {B20_Dialog1_SariMulyadi} from './scenes/B20_Dialog1_SariMulyadi';
import {B21_M5_AirTurun} from './scenes/B21_M5_AirTurun';
import {B22_V5_TolakKemarau} from './scenes/B22_V5_TolakKemarau';
import {B23_Taruhan2_Skor74} from './scenes/B23_Taruhan2_Skor74';
import {B24_V6_Eksodus} from './scenes/B24_V6_Eksodus';
import {B25_Dialog2_BujukPompa} from './scenes/B25_Dialog2_BujukPompa';
import {B26_V7_PompaRahasia} from './scenes/B26_V7_PompaRahasia';
import {B27_M6_CaraKerjaPompa} from './scenes/B27_M6_CaraKerjaPompa';
import {B28_PasarBersama_V8Kopi} from './scenes/B28_PasarBersama_V8Kopi';
import {B29_Dialog3_Mulyadi88} from './scenes/B29_Dialog3_Mulyadi88';
import {B30_GrafikSkor_Final} from './scenes/B30_GrafikSkor_Final';
import {B31_V9_HidupUjang} from './scenes/B31_V9_HidupUjang';
import {B32_M7_EksperimenBalik} from './scenes/B32_M7_EksperimenBalik';
import {B33_SeratusKali_M8} from './scenes/B33_SeratusKali_M8';
import {B34_JawabanUmur} from './scenes/B34_JawabanUmur';
import {B35_Penutup} from './scenes/B35_Penutup';

const COMP_BY_ID: Record<string, React.ComponentType> = {
  B01: B01_ColdOpen,
  B02: B02_ShowcaseKevin,
  B03: B03_ShowcaseMulyadi,
  B04: B04_Taruhan,
  B05: B05_M1_GembokTuas,
  B06: B06_AturanTeknologi,
  B07: B07_AturanRencana,
  B08: B08_AturanBelajar,
  B09: B09_SatuPembedaTahun1,
  B10: B10_M2_LumbungTerkuras,
  B11: B11_WargaBertanya,
  B12: B12_V1_PompaMogok,
  B13: B13_KontrasTanjungsari,
  B14: B14_V2_MendengarkanM3,
  B15: B15_Checkpoint46_Tahun4,
  B16: B16_M4_DuaJalurGabah,
  B17: B17_MapHidup_V3Larangan,
  B18: B18_V4_UjangMenyeberang,
  B19: B19_Checkpoint60_Tahun7,
  B20: B20_Dialog1_SariMulyadi,
  B21: B21_M5_AirTurun,
  B22: B22_V5_TolakKemarau,
  B23: B23_Taruhan2_Skor74,
  B24: B24_V6_Eksodus,
  B25: B25_Dialog2_BujukPompa,
  B26: B26_V7_PompaRahasia,
  B27: B27_M6_CaraKerjaPompa,
  B28: B28_PasarBersama_V8Kopi,
  B29: B29_Dialog3_Mulyadi88,
  B30: B30_GrafikSkor_Final,
  B31: B31_V9_HidupUjang,
  B32: B32_M7_EksperimenBalik,
  B33: B33_SeratusKali_M8,
  B34: B34_JawabanUmur,
  B35: B35_Penutup,
};

const SCENES: CutScene[] = FULL_BEATS.map((b) => ({
  id: b.id,
  component: COMP_BY_ID[b.id],
  durationInFrames: b.durationInFrames,
}));

// Transitions keyed by INCOMING beat id; curtain vignettes & continuous map cuts stay hard cut
const CUTS: Record<string, CutSpec> = {
  B02: {kind: 'zoomThrough', x: 320, y: 340, scale: 4, frames: 8, align: 'mid'},
  B03: {kind: 'whip', blur: 32, frames: 8, align: 'mid'},
  B04: {kind: 'whip', blur: 32, frames: 8, align: 'mid'},
  B05: {kind: 'tapePull', y: 160, frames: 10, align: 'mid'},
  B06: {kind: 'pageTurn', style: 'fold', frames: 10, align: 'after'},
  B07: {kind: 'whip', blur: 28, frames: 7, align: 'after'},
  B08: {kind: 'whip', blur: 28, frames: 7, align: 'after'},
  B09: {kind: 'pageTurn', style: 'curl', frames: 10, align: 'mid'},
  B10: {kind: 'zoomThrough', x: 640, y: 360, scale: 4, frames: 8, align: 'mid'},
  B11: {kind: 'tapePull', y: 160, frames: 10, align: 'mid'},
  B14: {kind: 'whip', blur: 28, frames: 8, align: 'mid'},
  B15: {kind: 'pageTurn', style: 'fold', frames: 10, align: 'mid'},
  B16: {kind: 'zoomThrough', x: 320, y: 360, scale: 3.5, frames: 8, align: 'mid'},
  B17: {kind: 'whip', blur: 28, frames: 8, align: 'mid'},
  B20: {kind: 'whip', blur: 28, frames: 8, align: 'mid'},
  B21: {kind: 'tapePull', y: 160, frames: 10, align: 'mid'},
  B22: {kind: 'whip', blur: 28, frames: 8, align: 'mid'},
  B25: {kind: 'whip', blur: 28, frames: 8, align: 'mid'},
  B26: {kind: 'whip', blur: 28, frames: 8, align: 'mid'},
  B29: {kind: 'whip', blur: 28, frames: 8, align: 'mid'},
  B30: {kind: 'pageTurn', style: 'curl', frames: 10, align: 'mid'},
  B33: {kind: 'whip', blur: 28, frames: 8, align: 'mid'},
  B34: {kind: 'whip', blur: 28, frames: 8, align: 'mid'},
  B35: {kind: 'pageTurn', style: 'fold', frames: 10, align: 'mid'},
};

export const FullVideo: React.FC = () => {
  const f = useCurrentFrame();
  const fadeBlack = interpolate(f, [FULL_TOTAL_FRAMES - 24, FULL_TOTAL_FRAMES - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <LiveMapContext.Provider value="full">
      <HudContext.Provider value={fullHudStateAt}>
        <AbsoluteFill style={{backgroundColor: PX.bgDark}}>
          <PaperDefs />
          <CutSeries scenes={SCENES} cuts={CUTS} />
          <GlobalHud />
          {fadeBlack > 0 ? (
            <AbsoluteFill style={{backgroundColor: '#000', opacity: fadeBlack, zIndex: 90}} />
          ) : null}
        </AbsoluteFill>
      </HudContext.Provider>
    </LiveMapContext.Provider>
  );
};
