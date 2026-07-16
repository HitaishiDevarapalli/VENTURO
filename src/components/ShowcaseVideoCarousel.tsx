import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  showcaseVideosDb,
  showcaseSettingsDb,
  propertiesDb,
  franchiseDb,
  businessDb,
  ShowcaseVideo,
} from '../db/marketplaceDb';

// ── helpers ──────────────────────────────────────────────────────────────────

const getLinkedItem = (video: ShowcaseVideo) => {
  if (!video.linkedId) return null;
  switch (video.linkedCategory) {
    case 'Property':
      return propertiesDb.find((p) => p.id === video.linkedId) || null;
    case 'Franchise':
      return franchiseDb.find((f) => f.id === video.linkedId) || null;
    case 'Business':
      return businessDb.find((b) => b.id === video.linkedId) || null;
    default:
      return null;
  }
};

const getLocation = (video: ShowcaseVideo): string | null => {
  const item = getLinkedItem(video);
  if (!item) return null;
  if ('city' in item && 'state' in item) {
    return `${(item as any).city}, ${(item as any).state}`;
  }
  if ('location' in item) return (item as any).location;
  return null;
};

const getPrice = (video: ShowcaseVideo): string | null => {
  const item = getLinkedItem(video);
  if (!item) return null;
  if ('priceDisplay' in item) return (item as any).priceDisplay;
  if ('investmentDisplay' in item) return (item as any).investmentDisplay;
  return null;
};

// ── category badge colours ───────────────────────────────────────────────────

const categoryColors: Record<string, { bg: string; text: string }> = {
  Property: { bg: 'rgba(16,185,129,0.85)', text: '#fff' },
  Franchise: { bg: 'rgba(99,102,241,0.85)', text: '#fff' },
  Business: { bg: 'rgba(245,158,11,0.85)', text: '#fff' },
  None: { bg: 'rgba(100,116,139,0.7)', text: '#fff' },
};

// ── component ────────────────────────────────────────────────────────────────

export const ShowcaseVideoCarousel: React.FC<{
  onNavigate: (page: string) => void;
  onPropertyClick?: (id: string) => void;
}> = ({ onNavigate, onPropertyClick }) => {
  // ── state ────────────────────────────────────────────────────────────────

  const [activeVideos, setActiveVideos] = useState<ShowcaseVideo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [overlayHovered, setOverlayHovered] = useState(false);
  const [btnHoverLeft, setBtnHoverLeft] = useState(false);
  const [btnHoverRight, setBtnHoverRight] = useState(false);
  const [viewDetailHover, setViewDetailHover] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // ── data loader ──────────────────────────────────────────────────────────

  const loadVideos = useCallback(() => {
    const filtered = [...showcaseVideosDb]
      .filter((v) => v.status === 'Active')
      .sort((a, b) => a.displayOrder - b.displayOrder);
    setActiveVideos(filtered);
    setCurrentIndex((prev) => (prev >= filtered.length ? 0 : prev));
  }, []);

  useEffect(() => {
    loadVideos();
    const handler = () => loadVideos();
    window.addEventListener('nexopp_data_changed', handler);
    return () => window.removeEventListener('nexopp_data_changed', handler);
  }, [loadVideos]);

  // ── navigation helpers ───────────────────────────────────────────────────

  const goTo = useCallback(
    (idx: number) => {
      if (isTransitioning || activeVideos.length === 0) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(idx);
        setIsTransitioning(false);
      }, 400);
    },
    [isTransitioning, activeVideos.length],
  );

  const goNext = useCallback(() => {
    if (activeVideos.length === 0) return;
    goTo((currentIndex + 1) % activeVideos.length);
  }, [activeVideos.length, currentIndex, goTo]);

  const goPrev = useCallback(() => {
    if (activeVideos.length === 0) return;
    goTo((currentIndex - 1 + activeVideos.length) % activeVideos.length);
  }, [activeVideos.length, currentIndex, goTo]);

  // ── auto‑advance timer ──────────────────────────────────────────────────

  useEffect(() => {
    if (activeVideos.length <= 1) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    const video = activeVideos[currentIndex];
    const duration =
      (video?.autoplayDuration ?? showcaseSettingsDb.defaultPlaybackDurationSec) * 1000;
    timerRef.current = setTimeout(goNext, duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, activeVideos, goNext]);

  // ── video element autoplay ──────────────────────────────────────────────

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === currentIndex) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [currentIndex, activeVideos]);

  // ── touch / swipe ──────────────────────────────────────────────────────

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      touchEndX.current = e.changedTouches[0].clientX;
      const diff = touchStartX.current - touchEndX.current;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goNext() : goPrev();
      }
    },
    [goNext, goPrev],
  );

  // ── click handlers ────────────────────────────────────────────────────

  const handleViewDetails = useCallback(
    (video: ShowcaseVideo) => {
      if (video.linkedCategory === 'Property' && video.linkedId) {
        onPropertyClick
          ? onPropertyClick(video.linkedId)
          : onNavigate(`propertyDetails_${video.linkedId}`);
      } else if (video.linkedCategory === 'Franchise' && video.linkedId) {
        onNavigate(`franchiseDetails_${video.linkedId}`);
      } else if (video.linkedCategory === 'Business' && video.linkedId) {
        onNavigate(`businessDetails_${video.linkedId}`);
      } else if (video.linkedCategory === 'Property') {
        onNavigate('properties');
      } else if (video.linkedCategory === 'Franchise') {
        onNavigate('franchise');
      } else if (video.linkedCategory === 'Business') {
        onNavigate('business');
      }
    },
    [onNavigate, onPropertyClick],
  );

  // ── early return ─────────────────────────────────────────────────────

  if (activeVideos.length === 0) return null;

  const currentVideo = activeVideos[currentIndex];
  const location = getLocation(currentVideo);
  const price = getPrice(currentVideo);
  const catColor = categoryColors[currentVideo.linkedCategory] || categoryColors.None;

  // ── render ────────────────────────────────────────────────────────────

  return (
    <section
      style={{
        width: '100%',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0F172A 100%)',
        padding: '48px 0 56px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* decorative blurred orbs */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          left: -80,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -60,
          right: -60,
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* section title */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          marginBottom: 32,
        }}
      >
        <h2
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: '#F8FAFC',
            margin: 0,
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 30 }}>🎬</span>
          <span
            style={{
              background: 'linear-gradient(90deg, #F8FAFC, #94A3B8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Featured Showcase
          </span>
        </h2>
        <p
          style={{
            margin: '6px 0 0',
            fontSize: 14,
            color: '#94A3B8',
            fontWeight: 400,
          }}
        >
          Explore premium listings through immersive video experiences
        </p>
      </div>

      {/* carousel viewport */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          position: 'relative',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* 16:9 container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
          }}
        >
          {/* video layers */}
          {activeVideos.map((video, idx) => (
            <video
              key={video.id}
              ref={(el) => { videoRefs.current[idx] = el; }}
              src={video.videoUrl}
              poster={video.thumbnailUrl || undefined}
              autoPlay={idx === currentIndex}
              muted
              loop
              playsInline
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: idx === currentIndex && !isTransitioning ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out',
                zIndex: idx === currentIndex ? 2 : 1,
              }}
            />
          ))}

          {/* glassmorphism overlay */}
          <div
            onMouseEnter={() => setOverlayHovered(true)}
            onMouseLeave={() => setOverlayHovered(false)}
            onClick={() => handleViewDetails(currentVideo)}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 5,
              background: overlayHovered
                ? 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 60%, transparent 100%)'
                : 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 60%, transparent 100%)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              padding: '80px 28px 24px',
              cursor: currentVideo.linkedCategory !== 'None' ? 'pointer' : 'default',
              transition: 'background 0.3s ease',
            }}
          >
            {/* category badge */}
            {currentVideo.linkedCategory !== 'None' && (
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 14px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  background: catColor.bg,
                  color: catColor.text,
                  marginBottom: 10,
                  backdropFilter: 'blur(6px)',
                }}
              >
                {currentVideo.linkedCategory}
              </span>
            )}

            {/* title */}
            <h3
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#FFFFFF',
                margin: '0 0 6px',
                textShadow: '0 2px 8px rgba(0,0,0,0.4)',
              }}
            >
              {currentVideo.title}
            </h3>

            {/* meta row: location + price */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              {location && (
                <span
                  style={{
                    fontSize: 13,
                    color: '#CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  📍 {location}
                </span>
              )}
              {price && (
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#34D399',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  💰 {price}
                </span>
              )}
            </div>

            {/* View Details button */}
            {currentVideo.linkedCategory !== 'None' && (
              <button
                onMouseEnter={() => setViewDetailHover(true)}
                onMouseLeave={() => setViewDetailHover(false)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(currentVideo);
                }}
                style={{
                  marginTop: 14,
                  padding: '10px 28px',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  color: '#fff',
                  background: viewDetailHover
                    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                  cursor: 'pointer',
                  boxShadow: viewDetailHover
                    ? '0 6px 24px rgba(16,185,129,0.5)'
                    : '0 4px 16px rgba(16,185,129,0.3)',
                  transform: viewDetailHover ? 'translateY(-1px)' : 'translateY(0)',
                  transition: 'all 0.25s ease',
                }}
              >
                View Details →
              </button>
            )}
          </div>

          {/* ── left arrow ──────────────────────────────────────────── */}
          {activeVideos.length > 1 && (
            <button
              aria-label="Previous video"
              onClick={goPrev}
              onMouseEnter={() => setBtnHoverLeft(true)}
              onMouseLeave={() => setBtnHoverLeft(false)}
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 8,
                width: 44,
                height: 44,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.2)',
                background: btnHoverLeft
                  ? 'rgba(255,255,255,0.25)'
                  : 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(6px)',
                color: '#fff',
                fontSize: 20,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: hovered ? 1 : 0,
                transition: 'opacity 0.3s ease, background 0.25s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              ‹
            </button>
          )}

          {/* ── right arrow ──────────────────────────────────────── */}
          {activeVideos.length > 1 && (
            <button
              aria-label="Next video"
              onClick={goNext}
              onMouseEnter={() => setBtnHoverRight(true)}
              onMouseLeave={() => setBtnHoverRight(false)}
              style={{
                position: 'absolute',
                right: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 8,
                width: 44,
                height: 44,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.2)',
                background: btnHoverRight
                  ? 'rgba(255,255,255,0.25)'
                  : 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(6px)',
                color: '#fff',
                fontSize: 20,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: hovered ? 1 : 0,
                transition: 'opacity 0.3s ease, background 0.25s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              ›
            </button>
          )}

          {/* video counter badge */}
          <div
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 6,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(8px)',
              borderRadius: 20,
              padding: '5px 14px',
              fontSize: 12,
              fontWeight: 600,
              color: '#E2E8F0',
              letterSpacing: '0.04em',
            }}
          >
            {currentIndex + 1} / {activeVideos.length}
          </div>
        </div>

        {/* ── navigation dots ─────────────────────────────────────── */}
        {activeVideos.length > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10,
              marginTop: 20,
            }}
          >
            {activeVideos.map((_, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  aria-label={`Go to video ${idx + 1}`}
                  onClick={() => goTo(idx)}
                  style={{
                    width: isActive ? 28 : 10,
                    height: 10,
                    borderRadius: 5,
                    border: 'none',
                    cursor: 'pointer',
                    background: isActive
                      ? 'linear-gradient(90deg, #10B981, #34D399)'
                      : 'rgba(148,163,184,0.35)',
                    boxShadow: isActive
                      ? '0 0 12px rgba(16,185,129,0.6), 0 0 4px rgba(16,185,129,0.4)'
                      : 'none',
                    transition: 'all 0.35s ease',
                    padding: 0,
                    outline: 'none',
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShowcaseVideoCarousel;
