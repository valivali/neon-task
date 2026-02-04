"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import Globe, { GlobeMethods } from "react-globe.gl"
import { Country } from "@/types"
import { ISO_ALPHA3_TO_ALPHA2 } from "@/data/isoCodeMapping"
import styles from "./WorldMap.module.scss"

interface WorldMapProps {
  highlightedCountries: string[]
  focusedCountry?: Country | null
  onCountryClick: (countryCode: string) => void
}

interface GeoJsonFeature {
  type: string
  id?: string
  properties: {
    ISO_A2?: string
    iso_a2?: string
    NAME?: string
    name?: string
  }
  geometry: {
    type: string
    coordinates: number[][][] | number[][][][]
  }
}

interface GeoJsonFeatureCollection {
  type: string
  features: GeoJsonFeature[]
}

const COLORS = {
  highlight: "rgba(2, 195, 154, 0.8)",
  default: "rgba(5, 102, 141, 0.15)",
  atmosphere: "rgba(2, 128, 144, 0.5)",
  highlightedCap: "rgba(2, 195, 154, 0.8)",
  defaultCap: "rgba(0, 0, 0, 0.75)",
  highlightedSide: "rgba(231, 40, 40, 0)",
  defaultSide: "rgba(0, 0, 0, 0)",
  highlightedStroke: "rgba(231, 40, 40, 0.6)",
  defaultStroke: "rgba(255, 255, 255, 0.75)"
}

export const WorldMap = ({ highlightedCountries, focusedCountry, onCountryClick }: WorldMapProps) => {
  const globeEl = useRef<GlobeMethods | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [countries, setCountries] = useState<GeoJsonFeatureCollection>({ type: "FeatureCollection", features: [] })
  const [globeSize, setGlobeSize] = useState({ width: 0, height: 0 })

  const highlightedSet = useMemo(() => new Set(highlightedCountries), [highlightedCountries])

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data as GeoJsonFeatureCollection)
      })
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const updateSize = () => {
      if (!containerRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()
      setGlobeSize({
        width: Math.max(0, Math.floor(width)),
        height: Math.max(0, Math.floor(height))
      })
    }

    updateSize()

    const observer = new ResizeObserver(() => updateSize())
    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (focusedCountry && globeEl.current) {
      globeEl.current.pointOfView(
        {
          lat: focusedCountry.lat,
          lng: focusedCountry.lng,
          altitude: 0.5
        },
        1500
      )
    }
  }, [focusedCountry])

  const getCountryCode = useCallback((d: GeoJsonFeature): string => {
    if (d.id && ISO_ALPHA3_TO_ALPHA2[d.id]) {
      return ISO_ALPHA3_TO_ALPHA2[d.id]
    }
    return (d.properties?.ISO_A2 || d.properties?.iso_a2 || "").toUpperCase()
  }, [])

  const getPolygonLabel = useCallback((d: object) => {
    const feature = d as GeoJsonFeature
    return feature.properties?.name || feature.properties?.NAME || ""
  }, [])

  const getPolygonCapColor = useCallback(
    (d: object) => {
      const countryCode = getCountryCode(d as GeoJsonFeature)
      return countryCode && highlightedSet.has(countryCode) ? COLORS.highlightedCap : COLORS.defaultCap
    },
    [getCountryCode, highlightedSet]
  )

  const getPolygonSideColor = useCallback(
    (d: object) => {
      const countryCode = getCountryCode(d as GeoJsonFeature)
      return countryCode && highlightedSet.has(countryCode) ? COLORS.highlightedSide : COLORS.defaultSide
    },
    [getCountryCode, highlightedSet]
  )

  const getPolygonStrokeColor = useCallback(
    (d: object) => {
      const countryCode = getCountryCode(d as GeoJsonFeature)
      return countryCode && highlightedSet.has(countryCode) ? COLORS.highlightedStroke : COLORS.defaultStroke
    },
    [getCountryCode, highlightedSet]
  )

  const handlePolygonClick = useCallback(
    (polygon: object) => {
      const countryCode = getCountryCode(polygon as GeoJsonFeature)
      if (countryCode) {
        onCountryClick(countryCode)
      }
    },
    [getCountryCode, onCountryClick]
  )

  const handlePolygonHover = useCallback((polygon: object | null) => {
    document.body.style.cursor = polygon ? "pointer" : "default"
  }, [])

  return (
    <div className={styles.globeContainer} ref={containerRef}>
      <Globe
        ref={globeEl}
        width={globeSize.width}
        height={globeSize.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor={COLORS.atmosphere}
        atmosphereAltitude={0.15}
        polygonsData={countries.features}
        polygonLabel={getPolygonLabel}
        polygonCapColor={getPolygonCapColor}
        polygonSideColor={getPolygonSideColor}
        polygonStrokeColor={getPolygonStrokeColor}
        polygonAltitude={0.01}
        polygonsTransitionDuration={300}
        onPolygonClick={handlePolygonClick}
        onPolygonHover={handlePolygonHover}
        enablePointerInteraction={true}
        animateIn={true}
      />
    </div>
  )
}
