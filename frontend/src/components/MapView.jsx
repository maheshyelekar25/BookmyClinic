import { divIcon } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const markerIcon = divIcon({
  className: 'clinic-map-marker',
  html: '<span></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

export default function MapView({ clinics, center }) {
  if (!clinics.length) return null
  const mapCenter = center ?? [clinics[0].lat, clinics[0].lng]

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <MapContainer key={mapCenter.join(',')} center={mapCenter} zoom={12} className="h-80 w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {clinics.map((clinic) => (
          <Marker key={clinic.id} position={[clinic.lat, clinic.lng]} icon={markerIcon}>
            <Popup>
              <strong>{clinic.name}</strong><br />
              {clinic.city}, {clinic.state}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
