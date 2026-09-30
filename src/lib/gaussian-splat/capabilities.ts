/**
 * Utilidades para detectar capacidades del navegador/dispositivo
 * relacionadas con el renderizado de Gaussian Splatting.
 */

export interface DeviceCapabilities {
  hasWebGL: boolean;
  hasWebGL2: boolean;
  isMobile: boolean;
  hasTouchScreen: boolean;
  estimatedPerformance: 'high' | 'medium' | 'low';
}

/** Detecta si WebGL está disponible */
function checkWebGL(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return gl !== null;
  } catch {
    return false;
  }
}

/** Detecta si WebGL2 está disponible */
function checkWebGL2(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    return gl !== null;
  } catch {
    return false;
  }
}

/** Detecta si el dispositivo es móvil */
function checkMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/** Detecta pantalla táctil */
function checkTouchScreen(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/** Estima el nivel de rendimiento del dispositivo */
function estimatePerformance(): 'high' | 'medium' | 'low' {
  if (typeof navigator === 'undefined') return 'medium';

  const cores = navigator.hardwareConcurrency || 2;
  // @ts-expect-error — deviceMemory es experimental
  const memory = navigator.deviceMemory || 4;

  if (cores >= 8 && memory >= 8) return 'high';
  if (cores >= 4 && memory >= 4) return 'medium';
  return 'low';
}

/** Obtiene las capacidades del dispositivo actual */
export function getDeviceCapabilities(): DeviceCapabilities {
  return {
    hasWebGL: checkWebGL(),
    hasWebGL2: checkWebGL2(),
    isMobile: checkMobile(),
    hasTouchScreen: checkTouchScreen(),
    estimatedPerformance: estimatePerformance(),
  };
}

/** Determina si el dispositivo puede ejecutar el visor 3D */
export function canRun3DViewer(): { supported: boolean; reason?: string } {
  const caps = getDeviceCapabilities();

  if (!caps.hasWebGL) {
    return {
      supported: false,
      reason: 'Tu navegador no soporta WebGL, necesario para el recorrido 3D.',
    };
  }

  return { supported: true };
}
