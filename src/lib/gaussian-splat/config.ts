/**
 * Configuración central del visor de Gaussian Splatting.
 * Controla defaults de cámara, performance y formatos aceptados.
 */

export const SPLAT_VIEWER_CONFIG = {
  /** Formatos de modelo soportados */
  supportedFormats: ['ply', 'splat', 'ksplat'] as const,

  /** Extensiones permitidas para validación */
  allowedExtensions: ['.ply', '.splat', '.ksplat'],

  /** Posición de cámara por defecto en el centro de la casa a la altura de los ojos humanos (~1.7m sobre el suelo) */
  defaultCameraPosition: [-0.3, 0.55, 0.6] as [number, number, number],

  /** Target de cámara por defecto mirando al frente en línea de horizonte natural */
  defaultCameraTarget: [-0.3, 0.55, -0.8] as [number, number, number],

  /** Tamaño máximo de modelo recomendado (en bytes) — 200 MB */
  maxRecommendedModelSize: 200 * 1024 * 1024,

  /** Timeout para descarga de modelo (ms) — 2 minutos */
  modelLoadTimeout: 120_000,

  /** Factor de escala de render para dispositivos móviles */
  mobileRenderScale: 0.75,

  /** Factor de escala de render para desktop */
  desktopRenderScale: 1.0,

  /** Modelo de prueba por defecto (Gaussian Splat ultra optimizado servido desde CDN de Supabase, 781 KB) */
  sampleModelUrl: 'https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-images/properties/demo-fast.splat',
} as const;

export type SplatFormat = (typeof SPLAT_VIEWER_CONFIG.supportedFormats)[number];
