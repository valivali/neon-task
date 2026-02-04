"use client"

import { useEffect, useRef, useState } from "react"
import Globe from "react-globe.gl"
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

export const WorldMap = ({ highlightedCountries, focusedCountry, onCountryClick }: WorldMapProps) => {
  const globeEl = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [countries, setCountries] = useState<GeoJsonFeatureCollection>({ type: "FeatureCollection", features: [] })
  const [globeSize, setGlobeSize] = useState({ width: 0, height: 0 })
  const colors = {
    highlight: "rgba(2, 195, 154, 0.8)",
    default: "rgba(5, 102, 141, 0.15)",
    atmosphere: "rgba(2, 128, 144, 0.5)"
  }

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

  const getCountryCode = (d: GeoJsonFeature): string => {
    if (d.id && ISO_ALPHA3_TO_ALPHA2[d.id]) {
      return ISO_ALPHA3_TO_ALPHA2[d.id]
    }
    return (d.properties?.ISO_A2 || d.properties?.iso_a2 || "").toUpperCase()
  }

  const getPolygonLabel = (d: object) => {
    const feature = d as GeoJsonFeature
    return feature.properties?.name || feature.properties?.NAME || ""
  }

  const getPolygonCapColor = (d: object) => {
    const countryCode = getCountryCode(d as GeoJsonFeature)
    if (countryCode && highlightedCountries.includes(countryCode)) {
      return colors.highlight
    }
    return "rgba(0, 0, 0, 0.75)"
  }

  const getPolygonSideColor = (d: object) => {
    const countryCode = getCountryCode(d as GeoJsonFeature)
    if (countryCode && highlightedCountries.includes(countryCode)) {
      return "rgba(231, 40, 40, 0)"
    }
    return "rgba(0, 0, 0, 0)"
  }

  const getPolygonStrokeColor = (d: object) => {
    const countryCode = getCountryCode(d as GeoJsonFeature)
    if (countryCode && highlightedCountries.includes(countryCode)) {
      return "rgba(231, 40, 40, 0.6)"
    }
    return "rgba(255, 255, 255, 0.75)"
  }

  const handlePolygonClick = (polygon: object) => {
    const countryCode = getCountryCode(polygon as GeoJsonFeature)
    if (countryCode) {
      onCountryClick(countryCode)
    }
  }

  const handlePolygonHover = (polygon: object | null) => {
    if (globeEl.current) {
      document.body.style.cursor = polygon ? "pointer" : "default"
    }
  }

  return (
    <div className={styles.globeContainer} ref={containerRef}>
      <Globe
        ref={globeEl}
        width={globeSize.width}
        height={globeSize.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor={colors.atmosphere}
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
