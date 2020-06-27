import './App.css'
import pointsJSON from '../data/points.json'
import statesJSON from '../data/states.json'
import React from 'react'
import mapboxgl from 'mapbox-gl'
import VisSelector from './VisSelector'

mapboxgl.accessToken = 'pk.eyJ1IjoiemhvdWRheGlhMjMzIiwiYSI6ImNrYndiY25kbjBlZXgyeG14dGRhMXlpZ20ifQ.FVNHr1fjVNC_RHlmE4TpHQ'

class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            lat: 51.1657,
            lng: 10.4515,
            zoom: 5
        }
    }

    componentDidMount() {
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom
        })

        const map = this.map

        map.on('load', () => {
            map.on('move', () => {
                this.setState({
                    lat: map.getCenter().lat.toFixed(4),
                    lng: map.getCenter().lng.toFixed(4),
                    zoom: map.getZoom().toFixed(2)
                })
            })

            map.addSource('states', {
                'type': 'geojson',
                'data': statesJSON
            })

            map.addSource('points', {
                'type': 'geojson',
                'data': pointsJSON
            })

            map.addLayer({
                'id': 'state-layer',
                'type': 'fill',
                'source': 'states',
                'paint': {
                    'fill-color': '#000000',
                    'fill-opacity': 0.5
                }
            })

            map.addLayer({
                'id': 'point-layer',
                'type': 'circle',
                'source': 'points',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#B42222'
                }
            })

            // Create a popup, but don't add it to the map yet.
            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });

            map.on('mouseenter', 'point-layer', e => {
                // Change the cursor style as a UI indicator.
                map.getCanvas().style.cursor = 'pointer'

                const coords = e.features[0].geometry.coordinates.slice()
                const {NAME_1: state, NAME_2: city} = e.features[0].properties

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coords[0]) > 180) {
                    coords[0] += e.lngLat.lng > coords[0] ? 360 : -360
                }

                // Populate the popup and set its coordinates
                // based on the feature found.
                popup
                .setLngLat(coords)
                .setHTML(`${state}:</br>${city}`)
                .addTo(map);
            })

            map.on('mouseleave', 'point-layer', () => {
                map.getCanvas().style.cursor = ''
                popup.remove()
            })

        })

    }

    onAttrChange = attr => {
        const colorCollection = [
            'red', 'orange', 'yellow', 'green', 'cyan',
            'blue', 'purple', 'pink', 'grey', 'brown'
        ]

        switch (attr) {
            case 'color':
                this.map.setPaintProperty('state-layer', 'fill-color', ['get', 'color'])
                break
            case 'number':
                this.map.setPaintProperty('state-layer', 'fill-color', [
                    'case',
                    ['==', ['get', 'number'], 0], colorCollection[0],
                    ['==', ['get', 'number'], 1], colorCollection[1],
                    ['==', ['get', 'number'], 2], colorCollection[2],
                    ['==', ['get', 'number'], 3], colorCollection[3],
                    ['==', ['get', 'number'], 4], colorCollection[4],
                    ['==', ['get', 'number'], 5], colorCollection[5],
                    ['==', ['get', 'number'], 6], colorCollection[6],
                    ['==', ['get', 'number'], 7], colorCollection[7],
                    ['==', ['get', 'number'], 8], colorCollection[8],
                    ['==', ['get', 'number'], 9], colorCollection[9],
                    'black'
                ])
                break
            case 'area':
                // below code is buggy, please fix
                this.map.setPaintProperty('state-layer', 'fill-color', [
                    'case',
                    ['==', ['%', ['get', 'area'], 10], 0], colorCollection[0],
                    ['==', ['%', ['get', 'area'], 10], 1], colorCollection[1],
                    ['==', ['%', ['get', 'area'], 10], 2], colorCollection[2],
                    ['==', ['%', ['get', 'area'], 10], 3], colorCollection[3],
                    ['==', ['%', ['get', 'area'], 10], 4], colorCollection[4],
                    ['==', ['%', ['get', 'area'], 10], 5], colorCollection[5],
                    ['==', ['%', ['get', 'area'], 10], 6], colorCollection[6],
                    ['==', ['%', ['get', 'area'], 10], 7], colorCollection[7],
                    ['==', ['%', ['get', 'area'], 10], 8], colorCollection[8],
                    ['==', ['%', ['get', 'area'], 10], 9], colorCollection[9],
                    'white'
                ])
                break
            default:
                this.map.setPaintProperty('state-layer', 'fill-color', '#000000')
        }
    }

    render() {
        return (
            <div className="geo-app">
                <div className="side-bar">{this.state.lat}N, {this.state.lng}E</div>
                <div className="vis-selector"><VisSelector onAttrChange={this.onAttrChange} /></div>
                <div ref={el => this.mapContainer = el} className="map-container" />
            </div>
        )
    }
}

export default App
