import { useState, useEffect } from 'react'
import type { SaveDataPreference } from '../types'

/* ======================
    BANDWIDTH
   ====================== */
const _0xflux = [
    'saveDataPreference',
    'low',                
    'high',               
    'enabled'             
] as const;

const _x = (i: number) => _0xflux[i] as any;
const _KEY_EN = _0xflux[3]; // 'enabled'

export const useSaveData = () => {
  const [saveData, setSaveData] = useState<SaveDataPreference>(() => {
    const _K = _x(0);
    const saved = localStorage.getItem(_K);
    return saved
      ? JSON.parse(saved)
      : ({ [_KEY_EN]: false, quality: _x(2) } as any as SaveDataPreference);
  });

  useEffect(() => {
    const connection = (navigator as any).connection;
    const isBrowserSaving = connection?.saveData || false;

    if (isBrowserSaving && !saveData[_KEY_EN]) {
      setSaveData({ [_KEY_EN]: true, quality: _x(1) } as any as SaveDataPreference);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(_x(0), JSON.stringify(saveData));
  }, [saveData]);

  const toggleSaveData = () => {
    setSaveData((prev) => {
      const nextState = !prev[_KEY_EN];
      return {
        ...prev,
        [_KEY_EN]: nextState,
        quality: nextState ? _x(1) : _x(2),
      } as any as SaveDataPreference;
    });
  };

  const setQuality = (quality: 'low' | 'medium' | 'high') => {
    setSaveData((prev) => ({ ...prev, quality }));
  };

  return {
    saveData,
    toggleSaveData,
    setQuality,
    isEnabled: saveData[_KEY_EN],
  };
}