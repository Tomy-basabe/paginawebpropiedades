/**
 * Configuración central del visor de Gaussian Splatting.
 * Controla defaults de cámara, performance y formatos aceptados.
 */

export const SPLAT_VIEWER_CONFIG = {
  /** Formatos de modelo soportados */
  supportedFormats: ['ply', 'splat', 'ksplat'] as const,

  /** Extensiones permitidas para validación */
  allowedExtensions: ['.ply', '.splat', '.ksplat'],

  /** Posición de cámara por defecto si la propiedad no define una */
  defaultCameraPosition: [0, 5, 12] as [number, number, number],

  /** Target de cámara por defecto */
  defaultCameraTarget: [0, 1, 0] as [number, number, number],

  /** Tamaño máximo de modelo recomendado (en bytes) — 200 MB */
  maxRecommendedModelSize: 200 * 1024 * 1024,

  /** Timeout para descarga de modelo (ms) — 2 minutos */
  modelLoadTimeout: 120_000,

  /** Factor de escala de render para dispositivos móviles */
  mobileRenderScale: 0.75,

  /** Factor de escala de render para desktop */
  desktopRenderScale: 1.0,

  /** Modelo de prueba por defecto (Gaussian Splat real optimizado de habitación interior) */
  sampleModelUrl: '/models/demo-room.splat',
} as const;

export type SplatFormat = (typeof SPLAT_VIEWER_CONFIG.supportedFormats)[number];
