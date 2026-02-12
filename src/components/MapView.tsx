import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import type { Vendor } from '@/types'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
})

interface MapViewProps {
    vendors: Vendor[]
}

export function MapView({ vendors }: MapViewProps) {
    const navigate = useNavigate()

    // Calculate center of all vendors
    const center: [number, number] = vendors.length > 0
        ? [
            vendors.reduce((sum, v) => sum + parseFloat(v.latitude), 0) / vendors.length,
            vendors.reduce((sum, v) => sum + parseFloat(v.longitude), 0) / vendors.length
        ]
        : [3.1390, 101.6869] // Default to KL

    return (
        <div className="w-full h-[600px] rounded-2xl overflow-hidden border-2 border-stone-200 shadow-xl">
            <MapContainer
                center={center}
                zoom={11}
                className="w-full h-full"
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {vendors.map((vendor) => {
                    const lat = parseFloat(vendor.latitude)
                    const lng = parseFloat(vendor.longitude)

                    return (
                        <Marker
                            key={vendor.id}
                            position={[lat, lng]}
                        >
                            <Popup>
                                <div className="min-w-[200px]">
                                    <div className="flex gap-3">
                                        {vendor.image_url && (
                                            <img
                                                src={vendor.image_url}
                                                alt={vendor.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h3 className="font-bold text-sm mb-1">{vendor.name}</h3>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-bold text-amber-600">
                                                    {vendor.jason_score}/10
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/vendor/${vendor.id}`)}
                                                className="text-xs bg-stone-900 text-white px-3 py-1 rounded-full hover:bg-stone-700 transition-colors"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>
        </div>
    )
}
