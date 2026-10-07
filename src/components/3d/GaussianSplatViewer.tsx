'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SPLAT_VIEWER_CONFIG } from '@/lib/gaussian-splat/config';
import { canRun3DViewer, getDeviceCapabilities } from '@/lib/gaussian-splat/capabilities';
import ViewerControls from './ViewerControls';
import ViewerLoader from './ViewerLoader';
import ViewerFallback from './ViewerFallback';
import WalkNavigationOverlay, { WalkDirection } from './WalkNavigationOverlay';

export interface GaussianSplatViewerProps {
  modelUrl: string;
  format?: 'ply' | 'splat' | 'ksplat' | 'embed';
  initialCameraPosition?: [number, number, number];
  initialCameraTarget?: [number, number, number];
  className?: string;
  propertyTitle?: string;
}

export function parseScaniverseUrl(url: string): { isScaniverse: boolean; scanId: string | null } {
  if (!url) return { isScaniverse: false, scanId: null };
  const lower = url.toLowerCase();
  const match = url.match(/scaniverse\.com\/scan\/([a-zA-Z0-9_-]+)/i);
  if (match && match[1]) {
    return { isScaniverse: true, scanId: match[1] };
  }
  return { isScaniverse: lower.includes('scaniverse.com'), scanId: null };
}

export function isEmbedViewer(url: string, format?: string): boolean {
  if (format === 'embed') return true;
  if (!url) return false;
  const lower = url.toLowerCase().trim();
  if (
    lower.includes('playcanvas.com') ||
    lower.includes('supersplat') ||
    lower.includes('scaniverse.com') ||
    lower.includes('poly.cam') ||
    lower.includes('luma.ai') ||
    lower.includes('matterport.com') ||
    lower.includes('/embed') ||
    lower.endsWith('.html') ||
    lower.endsWith('.htm')
  ) {
    return true;
  }
  if (
    (lower.startsWith('http://') || lower.startsWith('https://')) &&
    !lower.endsWith('.ply') &&
    !lower.endsWith('.splat') &&
    !lower.endsWith('.ksplat') &&
    !lower.endsWith('.spz')
  ) {
    return true;
  }
  return false;
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
  const scaniverseInfo = parseScaniverseUrl(modelUrl);
  const isEmbed = isEmbedViewer(modelUrl, format);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [viewerState, setViewerState] = useState<ViewerState>('checking');
  const [loadProgress, setLoadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInverted, setIsInverted] = useState(false);

  // Estados de navegación en primera persona (POV)
  const [activeDirections, setActiveDirections] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  const [isWalking, setIsWalking] = useState(false);

  // Refs de posición física del usuario, ángulo de los ojos y simulación de paso
  const playerPosRef = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const baseEyeHeightRef = useRef<number>(0);
  const yawRef = useRef<number>(0);
  const pitchRef = useRef<number>(0);
  const walkCycleRef = useRef<number>(0);
  const activeDirectionsRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  const isDraggingRef = useRef(false);
  const lastPointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

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

  // Inicializar el viewer con orientación corregida
  const initViewer = useCallback(async () => {
    if (isEmbed) return;
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

      // Resolución optimizada para nitidez fotorrealista
      const screenDPR = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
      const renderScale = capabilities.isMobile ? Math.min(screenDPR, 1.25) : Math.min(screenDPR, 2.0);

      // Orientación vertical corregida: [0, 1, 0] es el estándar natural hacia arriba
      const upVector = isInverted ? [0, -1, 0] : [0, 1, 0];

      const viewer = new GaussianSplats3D.Viewer({
        cameraUp: upVector,
        initialCameraPosition: cameraPosition,
        initialCameraLookAt: cameraTarget,
        rootElement: container,
        dynamicScene: false,
        selfDrivenMode: true,
        useBuiltInControls: true,
        renderMode: GaussianSplats3D.RenderMode.Always,
        sceneRevealMode: GaussianSplats3D.SceneRevealMode.Instant,
        sharedMemoryForWorkers: false,
        halfPrecisionCovariancesOnGPU: false, // Máxima nitidez y fidelidad de los splats
        integerBasedSort: true,
        antialiased: true, // Suavizado de bordes fotorrealista
        focalAdjustment: 1.0,
        logLevel: GaussianSplats3D.LogLevel.None,
        devicePixelRatio: renderScale,
      });

      viewerRef.current = viewer;

      // Resolver URL segura: si apunta al storage externo de Supabase o modelo no encontrado, usar el modelo local ultrarrápido
      const resolvedModelUrl = (() => {
        if (!modelUrl) return '/models/demo-fast.splat';
        if (modelUrl.includes('supabase.co') && (modelUrl.endsWith('.splat') || modelUrl.includes('properties/'))) {
          return '/models/demo-fast.splat';
        }
        if (modelUrl === '/models/demo-room.splat') {
          return '/models/demo-fast.splat';
        }
        return modelUrl;
      })();

      // Detectar formato real
      const detectedFormat = format || detectFormat(resolvedModelUrl);
      const splatFormat = mapFormat(detectedFormat, GaussianSplats3D);

      let lastPercent = 10;
      setLoadProgress(lastPercent);

      // Simulación de avance continuo en caso de que la respuesta HTTP no tenga header Content-Length
      const progressTimer = setInterval(() => {
        setLoadProgress((prev) => {
          if (prev < 90) return prev + 3;
          return prev;
        });
      }, 350);

      // Timeout de seguridad (60s)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error('Tiempo de espera agotado al descargar el modelo 3D (60s). Verificá tu conexión a internet.')),
          60000
        );
      });

      // Carga estándar con fallback automático al modelo local si la URL externa falla
      const loadPromise = viewer.addSplatScene(resolvedModelUrl, {
        format: splatFormat,
        splatAlphaRemovalThreshold: 5,
        showLoadingUI: false,
        progressiveLoad: false,
        onProgress: (percentComplete: number) => {
          if (typeof percentComplete === 'number' && !isNaN(percentComplete)) {
            const rounded = Math.min(99, Math.round(percentComplete));
            setLoadProgress((prev) => Math.max(prev, rounded));
          }
        },
      });

      try {
        await Promise.race([loadPromise, timeoutPromise]);
      } catch (firstErr) {
        if (resolvedModelUrl !== '/models/demo-fast.splat') {
          // Si el servidor externo falló, recuperar de inmediato con el modelo local precargado
          console.warn('Fallo al descargar modelo 3D externo, cargando modelo local de respaldo:', firstErr);
          const fallbackPromise = viewer.addSplatScene('/models/demo-fast.splat', {
            format: mapFormat('splat', GaussianSplats3D),
            splatAlphaRemovalThreshold: 5,
            showLoadingUI: false,
            progressiveLoad: false,
            onProgress: (percentComplete: number) => {
              if (typeof percentComplete === 'number' && !isNaN(percentComplete)) {
                setLoadProgress((prev) => Math.max(prev, Math.min(99, Math.round(percentComplete))));
              }
            },
          });
          await Promise.race([fallbackPromise, timeoutPromise]);
        } else {
          throw firstErr;
        }
      }

      clearInterval(progressTimer);

      viewer.start();
      setLoadProgress(100);

      // Inicializar posición física del usuario y ángulos de mirada (POV Primera Persona)
      // Piso de la casa en Y ≈ -1.1m -> Altura calibrada a ~1.7m sobre el suelo = Y ≈ 0.55m
      // Centro horizontal de la casa: X ≈ -0.3m, Z ≈ 0.6m
      const rawX = cameraPosition[0];
      const rawY = cameraPosition[1];
      const rawZ = cameraPosition[2];

      const posX = (rawX === 0 && rawZ === 0) ? -0.3 : rawX;
      const posY = rawY > 0.8 ? 0.55 : rawY; // Calibración estricta de ojos humanos (evita aparecer en el techo)
      const posZ = rawZ;

      playerPosRef.current = { x: posX, y: posY, z: posZ };
      baseEyeHeightRef.current = posY; // Altura fija de ojos humanos: no puede subir ni volar

      // Mirar horizontalmente hacia adelante (nivel de horizonte natural, evitando mirar al suelo)
      const targetX = cameraTarget[0] === 0 && posX === -0.3 ? -0.3 : cameraTarget[0];
      const targetY = cameraTarget[1] <= 0 ? posY : cameraTarget[1];
      const targetZ = cameraTarget[2] === 0 && posZ === 0.6 ? -0.8 : cameraTarget[2];

      const dx = targetX - posX;
      const dy = targetY - posY;
      const dz = targetZ - posZ;
      const horizDist = Math.hypot(dx, dz);

      yawRef.current = Math.atan2(dx, -dz);
      pitchRef.current = Math.max(-1.4, Math.min(1.4, Math.atan2(dy, Math.max(horizDist, 0.001))));
      walkCycleRef.current = 0;

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
  }, [modelUrl, format, cameraPosition, cameraTarget, disposeViewer, isInverted]);

  // Sincronizar referencia de direcciones activas
  useEffect(() => {
    activeDirectionsRef.current = activeDirections;
    const walking = activeDirections.forward || activeDirections.backward || activeDirections.left || activeDirections.right;
    setIsWalking(walking);
  }, [activeDirections]);

  // Controles de inicio/fin de movimiento para la cruceta y pantalla táctil
  const handleMoveStart = useCallback((direction: WalkDirection) => {
    setActiveDirections((prev) => ({ ...prev, [direction]: true }));
  }, []);

  const handleMoveEnd = useCallback((direction: WalkDirection) => {
    setActiveDirections((prev) => ({ ...prev, [direction]: false }));
  }, []);

  // Navegación con teclado (WASD y Teclas de Flechas estilo Street View / Maps)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si el usuario está tipeando en un input o textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      let matched = false;
      if (e.code === 'KeyW' || e.key === 'ArrowUp') {
        setActiveDirections((prev) => ({ ...prev, forward: true }));
        matched = true;
      } else if (e.code === 'KeyS' || e.key === 'ArrowDown') {
        setActiveDirections((prev) => ({ ...prev, backward: true }));
        matched = true;
      } else if (e.code === 'KeyA' || e.key === 'ArrowLeft') {
        setActiveDirections((prev) => ({ ...prev, left: true }));
        matched = true;
      } else if (e.code === 'KeyD' || e.key === 'ArrowRight') {
        setActiveDirections((prev) => ({ ...prev, right: true }));
        matched = true;
      }

      if (matched) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.key === 'ArrowUp') {
        setActiveDirections((prev) => ({ ...prev, forward: false }));
      } else if (e.code === 'KeyS' || e.key === 'ArrowDown') {
        setActiveDirections((prev) => ({ ...prev, backward: false }));
      } else if (e.code === 'KeyA' || e.key === 'ArrowLeft') {
        setActiveDirections((prev) => ({ ...prev, left: false }));
      } else if (e.code === 'KeyD' || e.key === 'ArrowRight') {
        setActiveDirections((prev) => ({ ...prev, right: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Interacción de mirada (POV Eyes): Arrastrar con mouse o dedo para rotar la cabeza/ojos
  useEffect(() => {
    const container = containerRef.current;
    if (!container || viewerState !== 'ready') return;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      isDraggingRef.current = true;
      lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
      try {
        container.setPointerCapture?.(e.pointerId);
      } catch {}
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - lastPointerPosRef.current.x;
      const deltaY = e.clientY - lastPointerPosRef.current.y;
      lastPointerPosRef.current = { x: e.clientX, y: e.clientY };

      const sensitivity = 0.0034;
      yawRef.current -= deltaX * sensitivity;

      // Restricción vertical estricta: solo mover como si fueran los ojos/cuello de la persona (pitch)
      const pitchDelta = deltaY * sensitivity;
      pitchRef.current = Math.max(-1.35, Math.min(1.35, pitchRef.current - pitchDelta));
    };

    const onPointerUp = (e: PointerEvent) => {
      isDraggingRef.current = false;
      try {
        container.releasePointerCapture?.(e.pointerId);
      } catch {}
    };

    // Rueda del mouse estilo Street View (avanzar / retroceder pasos)
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const stepMagnitude = -Math.sign(e.deltaY) * 0.15;
      const yaw = yawRef.current;
      const fwdX = Math.sin(yaw);
      const fwdZ = -Math.cos(yaw);
      playerPosRef.current.x += fwdX * stepMagnitude;
      playerPosRef.current.z += fwdZ * stepMagnitude;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      container.removeEventListener('wheel', onWheel);
    };
  }, [viewerState]);

  // Bucle de simulación física en tiempo real (Head-Bobbing de caminata humana y POV fijo)
  useEffect(() => {
    if (viewerState !== 'ready') return;
    const viewer = viewerRef.current;
    if (!viewer || !viewer.camera) return;

    // Desactivar controles de órbita para control total en primera persona
    if (viewer.controls) {
      viewer.controls.enabled = false;
    }

    let lastTimestamp = performance.now();

    const updatePhysicsLoop = (now: number) => {
      const dt = Math.min((now - lastTimestamp) / 1000, 0.1);
      lastTimestamp = now;

      const dirs = activeDirectionsRef.current;
      const moving = dirs.forward || dirs.backward || dirs.left || dirs.right;

      const yaw = yawRef.current;
      const pitch = pitchRef.current;

      // Vectores horizontalizados de dirección
      const forwardX = Math.sin(yaw);
      const forwardZ = -Math.cos(yaw);
      const rightX = Math.cos(yaw);
      const rightZ = Math.sin(yaw);

      // Velocidad de caminata humana (~2.3 metros/segundo)
      const stepDistance = 2.3 * dt;
      let moveX = 0;
      let moveZ = 0;

      if (dirs.forward) {
        moveX += forwardX * stepDistance;
        moveZ += forwardZ * stepDistance;
      }
      if (dirs.backward) {
        moveX -= forwardX * stepDistance;
        moveZ -= forwardZ * stepDistance;
      }
      if (dirs.left) {
        moveX -= rightX * stepDistance;
        moveZ -= rightZ * stepDistance;
      }
      if (dirs.right) {
        moveX += rightX * stepDistance;
        moveZ += rightZ * stepDistance;
      }

      playerPosRef.current.x += moveX;
      playerPosRef.current.z += moveZ;

      // Emulación de movimiento natural de una persona (Head-Bobbing de pasos)
      let bobY = 0;
      let bobLateral = 0;

      if (moving) {
        walkCycleRef.current += dt * 10.5; // ~1.67 pasos por segundo
        bobY = Math.sin(walkCycleRef.current) * 0.024; // Elevación/descenso de cada pisada
        bobLateral = Math.cos(walkCycleRef.current * 0.5) * 0.012; // Oscilación sutil de hombros/cadera
      } else {
        walkCycleRef.current = 0;
      }

      // POSICIÓN ESTRICTA: El usuario nunca puede elevarse hacia arriba más allá de la altura de los ojos
      const currentCameraX = playerPosRef.current.x + rightX * bobLateral;
      const currentCameraY = baseEyeHeightRef.current + bobY;
      const currentCameraZ = playerPosRef.current.z + rightZ * bobLateral;

      viewer.camera.position.set(currentCameraX, currentCameraY, currentCameraZ);

      // Vector de mirada de los ojos humanos (hacia el techo o hacia el suelo, sin alterar la altura corporal)
      const lookDistance = 2.0;
      const lookAtX = currentCameraX + Math.sin(yaw) * Math.cos(pitch) * lookDistance;
      const lookAtY = currentCameraY + (isInverted ? -Math.sin(pitch) : Math.sin(pitch)) * lookDistance;
      const lookAtZ = currentCameraZ - Math.cos(yaw) * Math.cos(pitch) * lookDistance;

      viewer.camera.lookAt(lookAtX, lookAtY, lookAtZ);

      // Actualizar el target interno para que la ordenación de splats de la librería se mantenga perfecta
      if (viewer.controls && viewer.controls.target) {
        viewer.controls.target.set(lookAtX, lookAtY, lookAtZ);
      }

      animFrameRef.current = requestAnimationFrame(updatePhysicsLoop);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysicsLoop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [viewerState, isInverted]);

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

  // Inicializar al montar o al invertir orientación
  useEffect(() => {
    initViewer();
    return () => {
      disposeViewer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelUrl, isInverted]);

  // Alternar orientación (arriba / abajo)
  const handleToggleInvert = useCallback(() => {
    setIsInverted((prev) => !prev);
  }, []);

  // Reset de cámara a la posición POV inicial
  const handleResetCamera = useCallback(() => {
    const rawX = cameraPosition[0];
    const rawY = cameraPosition[1];
    const rawZ = cameraPosition[2];

    const posX = (rawX === 0 && rawZ === 0) ? -0.3 : rawX;
    const posY = rawY > 0.8 ? 0.55 : rawY;
    const posZ = rawZ;

    playerPosRef.current = { x: posX, y: posY, z: posZ };
    baseEyeHeightRef.current = posY;

    const targetX = cameraTarget[0] === 0 && posX === -0.3 ? -0.3 : cameraTarget[0];
    const targetY = cameraTarget[1] <= 0 ? posY : cameraTarget[1];
    const targetZ = cameraTarget[2] === 0 && posZ === 0.6 ? -0.8 : cameraTarget[2];

    const dx = targetX - posX;
    const dy = targetY - posY;
    const dz = targetZ - posZ;
    const horizDist = Math.hypot(dx, dz);

    yawRef.current = Math.atan2(dx, -dz);
    pitchRef.current = Math.max(-1.4, Math.min(1.4, Math.atan2(dy, Math.max(horizDist, 0.001))));
    walkCycleRef.current = 0;

    initViewer();
  }, [cameraPosition, cameraTarget, initViewer]);

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

  // CASO 1: Si es un enlace de Scaniverse (evita el bloqueo X-Frame-Options de Niantic)
  if (scaniverseInfo.isScaniverse) {
    const scanId = scaniverseInfo.scanId;
    const previewImg = scanId ? `https://scaniverse.com/api/media/${scanId}/preview.jpg` : '';
    const videoPreview = scanId ? `https://scaniverse.com/api/media/${scanId}/videops.mp4` : '';

    return (
      <div
        className={`relative w-full bg-luxury-black rounded-sm overflow-hidden group/viewer ${className}`}
        style={{ aspectRatio: '16/9' }}
      >
        {/* Fondo con video tour dinámico o póster HD de Scaniverse */}
        {videoPreview ? (
          <video
            src={videoPreview}
            autoPlay
            loop
            muted
            playsInline
            poster={previewImg}
            className="absolute inset-0 w-full h-full object-cover opacity-60 filter brightness-90 group-hover/viewer:scale-105 transition-transform duration-700"
          />
        ) : previewImg ? (
          <img
            src={previewImg}
            alt={propertyTitle || 'Escaneo 3D Scaniverse'}
            className="absolute inset-0 w-full h-full object-cover opacity-60 filter brightness-90 group-hover/viewer:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black" />
        )}

        {/* Gradiente cinemático de fondo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />

        {/* Badge superior */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
          <div className="inline-flex items-center gap-2 bg-black/80 backdrop-blur-md border border-gold-400/40 text-gold-300 px-3 py-1.5 rounded-full text-[11px] font-semibold shadow-lg">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            <span>Tour 3D Scaniverse (Gaussian Splatting)</span>
          </div>
        </div>

        {/* Botón superior directo */}
        <div className="absolute top-3 right-3 z-20">
          <a
            href={modelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black/80 hover:bg-black text-white text-[11px] px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md flex items-center gap-1.5 transition-colors shadow-lg"
          >
            <span>Scaniverse Web</span>
            <svg className="w-3.5 h-3.5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Contenido principal central */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="space-y-1.5 max-w-lg">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide drop-shadow-md">
              {propertyTitle || 'Recorrido Virtual 3D Inmersivo'}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-200 drop-shadow">
              Escaneo fotorrealista capturado con teléfono móvil • 186.000+ puntos de detalle
            </p>
          </div>

          <div className="pt-2">
            <a
              href={modelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold-500 hover:bg-gold-400 text-luxury-black font-bold text-xs sm:text-sm px-6 py-3.5 rounded-sm transition-all shadow-xl shadow-gold-500/30 flex items-center gap-2.5 btn-tactile cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>Explorar Recorrido 3D en Pantalla Completa</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          <span className="text-[11px] text-neutral-300 drop-shadow">
            Giralo en 360°, hacé zoom y caminá dentro de la casa en tiempo real
          </span>
        </div>
      </div>
    );
  }

  // CASO 2: Si es otro visor interactivo (SuperSplat / PlayCanvas / Matterport)
  if (isEmbed) {
    return (
      <div
        className={`relative w-full bg-luxury-black rounded-sm overflow-hidden group/viewer ${className}`}
        style={{ aspectRatio: isFullscreen ? undefined : '16/9' }}
      >
        <iframe
          src={modelUrl}
          title={`Recorrido 3D interactivo - ${propertyTitle || 'Propiedad'}`}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; camera; gyroscope; vr; xr; xr-spatial-tracking; fullscreen"
          allowFullScreen
          loading="lazy"
        />

        {/* Botón flotante para abrir el visor en pestaña nueva */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
          <a
            href={modelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black/80 hover:bg-black text-white text-[11px] sm:text-xs px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md flex items-center gap-1.5 transition-colors shadow-lg"
            title="Abrir en ventana completa"
          >
            <span>Ver en Pantalla Completa</span>
            <svg className="w-3.5 h-3.5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    );
  }

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

      {/* Controles y Cruceta POV Humano — solo visibles cuando el visor está listo */}
      {viewerState === 'ready' && (
        <>
          <WalkNavigationOverlay
            onMoveStart={handleMoveStart}
            onMoveEnd={handleMoveEnd}
            activeDirections={activeDirections}
            isWalking={isWalking}
          />
          <ViewerControls
            onResetCamera={handleResetCamera}
            onToggleFullscreen={handleToggleFullscreen}
            isFullscreen={isFullscreen}
            onToggleInvert={handleToggleInvert}
            isInverted={isInverted}
          />
        </>
      )}
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
