import {ref} from 'vue'


// Simple, app-wide store pattern.
const _results = ref([])
const _where = ref('—')
const _searching = ref(false)
const _err = ref('')


export function useSeniorSearch() {
    const results = _results
    const searching = _searching
    const lastError = _err
    const whereLabel = _where


    const setLocation = (label) => {
        _where.value = label ?? '—'
    }


    /**
     * 1) Convert ZIP → {lat, lon, place} using Zippopotam.us
     * 2) Query OSM Overpass for nursing homes + assisted living within N miles
     */
    const runSearch = async (zip, miles = 15) => {
        _err.value = ''
        _results.value = []

        const zip5 = String(zip || '').replace(/\D/g, '').slice(0, 5)
        if (zip5.length !== 5) {
            _err.value = 'Please enter a valid 5-digit ZIP code.'
            return
        }

        try {
            _searching.value = true

            // 1) ZIP -> coords
            const locRes = await fetch(`https://api.zippopotam.us/us/${zip5}`)
            if (!locRes.ok) throw new Error('Could not resolve that ZIP code.')
            const loc = await locRes.json()
            const place = loc.places?.[0]
            const lat = Number(place.latitude)
            const lon = Number(place.longitude)
            _where.value = `${place["place name"]}, ${place.state} ${zip5}`


            // 2) Overpass — search within radius (meters)
            const radiusMeters = Math.round((miles || 15) * 1609.34)
            const query = `
                [out:json][timeout:25];
                (
                node["amenity"="nursing_home"](around:${radiusMeters},${lat},${lon});
                way["amenity"="nursing_home"](around:${radiusMeters},${lat},${lon});
                relation["amenity"="nursing_home"](around:${radiusMeters},${lat},${lon});


                node["social_facility"="assisted_living"](around:${radiusMeters},${lat},${lon});
                way["social_facility"="assisted_living"](around:${radiusMeters},${lat},${lon});
                relation["social_facility"="assisted_living"](around:${radiusMeters},${lat},${lon});
                );
                out center tags;`

            const osmRes = await fetch('https://overpass-api.de/api/interpreter', {
                method: 'POST',
                headers: {'Content-Type': 'text/plain;charset=UTF-8'},
                body: query
            })
            if (!osmRes.ok) throw new Error('Search provider is busy. Please try again in a moment.')
            const data = await osmRes.json()


            const mapped = (data.elements || []).map((el, i) => {
                const t = el.tags || {}
                const addr = [t['addr:housenumber'], t['addr:street'], t['addr:city'], t['addr:state'], t['addr:postcode']].filter(Boolean).join(' ')
                const name = t.name || 'Unnamed community'
                const website = t.website || t.url || ''
                const phone = t.phone || t['contact:phone'] || ''
                const kind = t['social_facility'] === 'assisted_living' ? 'Assisted Living' : 'Nursing Home'
                return {
                    id: el.id || i,
                    name,
                    address: addr || (t['addr:city'] ? `${t['addr:city']}, ${t['addr:state'] || ''}`.trim() : '—'),
                    phone,
                    website,
                    kind,
                    lat: el.lat || el.center?.lat,
                    lon: el.lon || el.center?.lon,
// Fallback stock photo
                    photo: kind === 'Assisted Living'
                        ? 'https://images.unsplash.com/photo-1519832979-6fa011b2a3d9?auto=format&fit=crop&w=1200&q=80'
                        : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
                }
            })
            _results.value = mapped


            if (!mapped.length) {
                _err.value = 'No communities found in that area. Try a larger radius or a nearby ZIP.'
            }
        } catch (e) {
            _err.value = e.message || 'Something went wrong.'
        } finally {
            _searching.value = false
        }
    }


    return {results, whereLabel, searching, lastError, runSearch, setLocation}
}