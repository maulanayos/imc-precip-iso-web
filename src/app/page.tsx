'use client'

import 'maplibre-gl/dist/maplibre-gl.css'
import maplibregl, { LayerSpecification, Map as MapTypes } from 'maplibre-gl'
import React, { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const STYLE = {
  voyager: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  satellite: 'https://api.maptiler.com/maps/hybrid/style.json?key=4ws1UIWszFIT6mPjWLny',
}

const NAME = 'station'
const CONFIG: LayerSpecification = {
  id: NAME,
  type: 'circle',
  source: NAME,
  paint: {
    'circle-radius': 4,
    'circle-color': 'blue',
    'circle-stroke-color': 'white',
    'circle-stroke-width': 1,
  },
}

export default function Page() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [style, setStyle] = React.useState<string>('satellite')
  const [map, setMap] = useState<MapTypes | null>(null)
  const [popup, setPopup] = useState<{
    longitude: number
    latitude: number
    content: JSX.Element
  } | null>(null)
  const popupRef = useRef(null)

  useEffect(() => {
    if (!map) return
    fetch(
      'https://raw.githubusercontent.com/sandyherho/imc-precip-iso/main/output_data/sta_list.csv',
    )
      .then((res) => res.text())
      .then(csvToGeojson)
      .then((ft) => {
        // if (map.getSource(NAME)) return
        map.addSource(NAME, { type: 'geojson', data: ft })

        // if (map.getLayer(NAME)) return
        map.addLayer(CONFIG)

        map.on('mouseenter', NAME, () => {
          map.getCanvas().style.cursor = 'pointer'
        })
        map.on('mouseleave', NAME, () => {
          map.getCanvas().style.cursor = ''
        })

        map.on('click', NAME, (e) => {
          map.getCanvas().style.cursor = 'pointer'

          const features = e.features as any[]
          const { properties, geometry } = features[0]
          const [longitude, latitude] = geometry.coordinates

          fetch(
            `https://raw.githubusercontent.com/sandyherho/imc-precip-iso/main/output_data/sta_data/sta_${properties.id}.csv`,
          )
            .then((res) => res.text())
            .then((data) => {
              const d = [] as any[]
              const lines = data.split('\n')
              lines.shift()

              for (let line of lines) {
                const [date, o18, h2, d_excess] = line.split(',')
                if (!date || date == '') continue
                if (isNaN(parseFloat(o18)) || isNaN(parseFloat(h2))) continue
                if (parseFloat(o18) === -999.0 || parseFloat(h2) === -999.0) continue
                d.push({
                  date,
                  o18: parseFloat(o18),
                  h2: parseFloat(h2),
                  d_excess: parseFloat(d_excess),
                })
              }

              const popupContent = PopupContent({
                properties,
                data: d,
              })

              setPopup({
                longitude,
                latitude,
                content: popupContent,
              })
            })
        })
      })
  }, [map])

  useEffect(() => {
    const m = new maplibregl.Map({
      container: mapContainerRef.current as HTMLDivElement,
      style: STYLE[style as keyof typeof STYLE],
      center: [110, -2],
      maxBounds: [
        [80, -20], // Southwest coordinates
        [150, 20], // Northeast coordinates
      ],
      zoom: 4,
      minZoom: 1,
      maxZoom: 12,
    })

    m.addControl(
      new maplibregl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true,
      }),
      'top-right',
    )

    m.on('style.load', () => {
      setMap(m)
    })

    return () => m.remove()
  }, [style])

  useEffect(() => {
    if (!popup || !popupRef.current || !map) return

    const newPopup = new maplibregl.Popup({
      closeButton: false,
      maxWidth: 'none',
    })
      .setLngLat([popup?.longitude, popup?.latitude])
      .setDOMContent(popupRef.current)
      .addTo(map)

    return () => {
      newPopup.remove()
    }
  }, [popup, map])

  return (
    <main className="h-screen w-screen">
      <div ref={mapContainerRef} className="w-full h-full relative">
        <div style={{ display: 'none' }}>
          <div ref={popupRef}>{popup?.content}</div>
        </div>

        {/* Basemap option panel */}
        <div className="mr-12 mt-3 absolute right-0 top-0 bg-white flex flex-col z-10 pl-3 pr-6 py-2 rounded-md gap-2">
          <form
            onChange={(e) => {
              const target = e.target as any
              setStyle(target.value)
            }}
          >
            <div className="text-gray-900 text-sm uppercase">Basemap</div>
            <div className="flex flex-row gap-2 pt-2">
              <input
                id="voyager-basemap"
                type="radio"
                name="rtoggle"
                value="voyager"
                checked={style === 'voyager'}
              />
              <label htmlFor="voyager-basemap" className="text-gray-900 text-sm">
                Base
              </label>
            </div>
            <div className="flex flex-row gap-2">
              <input
                id="satellite-streets-v12"
                type="radio"
                name="rtoggle"
                value="satellite"
                checked={style === 'satellite'}
              />
              <label htmlFor="satellite-streets-v12" className="text-gray-900 text-sm">
                Satellite
              </label>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

const PopupContent = ({ properties, data }: { properties: any; data: any }) => {
  const options: any = {
    chart: {
      id: 'isotop',
      type: 'scatter',
      zoom: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        formatter: function (val: string) {
          return parseInt(val)
        },
      },
      title: {
        text: 'd2H',
        rotate: -90,
        style: {
          fontWeight: 600,
        },
      },
    },
    xaxis: {
      // decimalsInFloat: 0,
      tickAmount: 8,
      labels: {
        formatter: function (val: string) {
          return parseFloat(val).toFixed(1)
        },
      },
      title: {
        text: 'd18O',
        style: {
          fontWeight: 600,
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return `${val}`
        },
      },
      x: {
        show: false,
      },
    },
    markers: {
      size: 4,
      hover: {
        sizeOffset: 1,
      },
    },
  }
  const series = [
    {
      name: 'd2H',
      data: data.map((d: any) => {
        return [d.o18, d.h2]
      }),
    },
  ]

  return (
    <div className="flex flex-col max-w-80 text-gray-900 bg-white">
      <div className="font-semibold text-sm pb-2 border-b">Station Metadata</div>
      <div className="flex flex-row justify-between mt-2">
        <div className="font-semibold">Station</div>
        <div>{properties.name}</div>
      </div>
      <div className="flex flex-row justify-between">
        <div className="font-semibold">Region</div>
        <div>{properties.region}</div>
      </div>
      <div className="flex flex-row justify-between">
        <div className="font-semibold">Elevation</div>
        <div>{properties.elev}</div>
      </div>

      <Chart options={options} series={series} type="scatter" width="400" />

      <div className="flex w-full justify-end items-end">
        <button
          className="block rounded-md bg-teal-600 px-3 py-1 text-center text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          onClick={() => {
            fetch(
              `https://raw.githubusercontent.com/sandyherho/imc-precip-iso/main/output_data/sta_data/sta_${properties.id}.csv`,
            )
              .then((res) => res.blob())
              .then((blob) => {
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `station-${properties.name}.csv`
                a.click()
              })
          }}
        >
          Download Data
        </button>
      </div>
    </div>
  )
}

function csvToGeojson(csv: string) {
  const lines = csv.split('\n')
  lines.shift()
  const featureCollection = {
    type: 'FeatureCollection',
    features: [] as any[],
  }
  for (let line of lines) {
    const data = line.split(',')
    featureCollection.features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(data[3]), parseFloat(data[4])],
      },
      properties: {
        id: data[0],
        name: data[1],
        region: data[2],
        elev: data[5],
      },
    })
  }

  return featureCollection
}
