'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SPLAT_VIEWER_CONFIG } from '@/lib/gaussian-splat/config';
import { canRun3DViewer, getDeviceCapabilities } from '@/lib/gaussian-splat/capabilities';
import ViewerControls from './ViewerControls';
import ViewerLoader from './ViewerLoader';
import ViewerFallback from './ViewerFallback';

export interface GaussianSplatViewerProps {
  modelUrl: string;
  format?: 'ply' | 'splat' | 'ksplat';
  initialCameraPosition?: [number, number, number];
  initialCameraTarget?: [number, number, number];
  className?: string;
  propertyTitle?: string;
}

type ViewerState = 'checking' | 'loading' | 'ready' | 'error' | 'unsupported';

export default function GaussianSplatViewer({
  modelUrl,
  format,
  initialCameraPosition,
  initialCameraTarget,
  className = '',
  propertyTitle,
}: GaussianSplatViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [viewerState, setViewerState] = useState<ViewerState>('checking');
  const [loadProgress, setLoadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const cameraPosition = initialCameraPosition || SPLAT_VIEWER_CONFIG.defaultCameraPosition;
  const cameraTarget = initialCameraTarget || SPLAT_VIEWER_CONFIG.defaultCameraTarget;

  // Cleanup del viewer
  const disposeViewer = useCallback(() => {
    if (viewerRef.current) {
      try {
        viewerRef.current.dispose();
      } catch {
        // Viewer ya dispuesto o error no crítico
      }
      viewerRef.current = null;
    }
  }, []);

  // Inicializar el viewer
  const initViewer = useCallback(async () => {
    if (!containerRef.current || !modelUrl) return;

    // Verificar capacidades
    const compatibility = canRun3DViewer();
    if (!compatibility.supported) {
      setViewerState('unsupported');
      setErrorMessage(compatibility.reason || 'Dispositivo no compatible');
      return;
    }

    setViewerState('loading');
    setLoadProgress(0);
    setErrorMessage('');

    // Limpiar viewer anterior
    disposeViewer();

    try {
      // Import dinámico para evitar SSR
      const GaussianSplats3D = await import('@mkkellogg/gaussian-splats-3d');
      const capabilities = getDeviceCapabilities();

      // Limpiar container
      const container = containerRef.current;
      while (container.firstChild) {
        if (container.firstChild instanceof HTMLCanvasElement) {
          container.removeChild(container.firstChild);
        } else {
          break;
        }
      }

      const renderScale = capabilities.isMobile
        ? SPLAT_VIEWER_CONFIG.mobileRenderScale
        : SPLAT_VIEWER_CONFIG.desktopRenderScale;

      const viewer = new GaussianSplats3D.Viewer({
        cameraUp: [0, -1, -0.6],
        initialCameraPosition: cameraPosition,
        initialCameraLookAt: cameraTarget,
        rootElement: container,
        dynamicScene: false,
        selfDrivenMode: true,
        useBuiltInControls: true,
        renderMode: GaussianSplats3D.RenderMode.Always,
        sceneRevealMode: GaussianSplats3D.SceneRevealMode.Instant,
        sharedMemoryForWorkers: false, // CRÍTICO: evita errores de SharedArrayBuffer en navegadores sin headers COOP/COEP
        halfPrecisionCovariancesOnGPU: true, // Reduce a la mitad el consumo de memoria en GPU/móviles
        integerBasedSort: true,
        antialiased: false,
        focalAdjustment: 1.0,
        logLevel: GaussianSplats3D.LogLevel.None,
        devicePixelRatio: renderScale,
      });

      viewerRef.current = viewer;

      // Detectar formato real
      const detectedFormat = format || detectFormat(modelUrl);
      const splatFormat = mapFormat(detectedFormat, GaussianSplats3D);

      let lastPercent = 10;
      setLoadProgress(lastPercent);

      // Simulación de avance continuo en caso de que la respuesta HTTP no tenga header Content-Length
      const progressTimer = setInterval(() => {
        setLoadProgress((prev) => {
          if (prev < 90) return prev + 3;
          return prev;
        });
      }, 400);

      // Timeout de seguridad (40s) para evitar que se quede colgado indefinidamente
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error('Tiempo de espera agotado al descargar el modelo 3D (40s). Verificá tu conexión a internet.')),
          40000
        );
      });

      // Carga estándar (más robusta y confiable que progressiveLoad en navegadores)
      const loadPromise = viewer.addSplatScene(modelUrl, {
        format: splatFormat,
        splatAlphaRemovalThreshold: 1,
        showLoadingUI: false,
        progressiveLoad: false,
        onProgress: (percentComplete: number) => {
          if (typeof percentComplete === 'number' && !isNaN(percentComplete)) {
            const rounded = Math.min(99, Math.round(percentComplete));
            setLoadProgress((prev) => Math.max(prev, rounded));
          }
        },
      });

      await Promise.race([loadPromise, timeoutPromise]);
      clearInterval(progressTimer);

      viewer.start();
      setLoadProgress(100);

      setTimeout(() => {
        setViewerState('ready');
      }, 250);

    } catch (err: unknown) {
      setViewerState('error');
      const message = err instanceof Error ? err.message : 'Error desconocido al cargar el modelo 3D';

      if (message.includes('fetch') || message.includes('network') || message.includes('404')) {
        setErrorMessage('No se pudo descargar el modelo 3D. Verificá que la URL sea accesible.');
      } else if (message.includes('memory') || message.includes('allocation')) {
        setErrorMessage('Memoria insuficiente para procesar el modelo 3D.');
      } else if (message.includes('WebGL') || message.includes('context')) {
        setErrorMessage('Error de WebGL al inicializar el visor 3D.');
      } else {
        setErrorMessage(`Error al cargar el recorrido 3D: ${message}`);
      }
    }
  }, [modelUrl, format, cameraPosition, cameraTarget, disposeViewer]);

  // Detectar formato por extensión
  function detectFormat(url: string): 'ply' | 'splat' | 'ksplat' {
    const lower = url.toLowerCase();
    if (lower.endsWith('.ksplat')) return 'ksplat';
    if (lower.endsWith('.splat')) return 'splat';
    return 'ply';
  }

  // Mapear formato a constante de la lib de forma exacta
  function mapFormat(fmt: string, lib: any): number {
    const formats = lib.SceneFormat || {};
    switch (fmt) {
      case 'splat': return formats.Splat ?? 0;
      case 'ksplat': return formats.KSplat ?? 1;
      case 'ply': return formats.Ply ?? 2;
      case 'spz': return formats.Spz ?? 3;
      default: return formats.Splat ?? 0;
    }
  }

  // Inicializar al montar
  useEffect(() => {
    initViewer();
    return () => {
      disposeViewer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelUrl]);

  // Reset de cámara
  const handleResetCamera = useCallback(() => {
    // Re-init es la forma más confiable de resetear con esta librería
    initViewer();
  }, [initViewer]);

  // Fullscreen
  const handleToggleFullscreen = useCallback(async () => {
    const container = containerRef.current?.parentElement;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fullscreen no disponible (ej: iframe restringido)
    }
  }, []);

  // Listener de cambios de fullscreen (por Esc o gesto del navegador)
  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, []);

  // Prevenir scroll de la página al interactuar con el visor
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventScroll = (e: WheelEvent | TouchEvent) => {
      e.preventDefault();
    };

    container.addEventListener('wheel', preventScroll, { passive: false });
    container.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      container.removeEventListener('wheel', preventScroll);
      container.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  // Estado: verificando capacidades
  if (viewerState === 'unsupported') {
    return (
      <ViewerFallback
        reason={errorMessage}
        propertyTitle={propertyTitle}
      />
    );
  }

  return (
    <div
      className={`relative w-full bg-luxury-black rounded-sm overflow-hidden group/viewer ${className}`}
      style={{ aspectRatio: isFullscreen ? undefined : '16/9' }}
    >
      {/* Capa de loading */}
      {(viewerState === 'checking' || viewerState === 'loading') && (
        <ViewerLoader progress={loadProgress} />
      )}

      {/* Capa de error */}
      {viewerState === 'error' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-luxury-black/95 text-white p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="font-serif text-lg font-semibold text-white mb-2">
            No se pudo cargar el recorrido
          </h3>
          <p className="text-sm text-neutral-400 max-w-sm mb-5 leading-relaxed">
            {errorMessage}
          </p>
          <button
            onClick={initViewer}
            className="bg-gold-500 hover:bg-gold-400 text-luxury-black text-xs font-semibold px-5 py-2.5 rounded-sm transition-colors btn-tactile"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Canvas container del visor */}
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ touchAction: 'none' }}
        role="application"
        aria-label={`Recorrido 3D de ${propertyTitle || 'la propiedad'}`}
        tabIndex={0}
      />

      {/* Controles — solo visibles cuando el visor está listo */}
      {viewerState === 'ready' && (
        <ViewerControls
          onResetCamera={handleResetCamera}
          onToggleFullscreen={handleToggleFullscreen}
          isFullscreen={isFullscreen}
        />
      )}

      {/* Hint de interacción — se oculta tras unos segundos */}
      {viewerState === 'ready' && <InteractionHint />}
    </div>
  );
}

/** Indicador sutil para que el usuario sepa que puede interactuar */
function InteractionHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none animate-fade-in w-[90%] max-w-sm">
      <div className="bg-black/75 backdrop-blur-md text-white text-[11px] sm:text-xs px-3.5 py-2 rounded-full flex items-center justify-center gap-2 border border-white/15 shadow-xl text-center">
        <svg className="w-4 h-4 text-gold-400 shrink-0 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
        </svg>
        <span className="truncate sm:whitespace-normal">1 dedo para rotar • 2 dedos para zoom / mover</span>
      </div>
    </div>
  );
}
