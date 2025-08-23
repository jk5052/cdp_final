// Celestial Mapbox Integration
class CelestialMapbox {
    constructor() {
        this.map = null;
        this.constellationData = null;
        this.constellationLines = null;
        this.isLoading = true;
        this.settings = {
            showConstellations: true,
            showStars: true,
            showNames: false,
            opacity: 0.8,
            scale: 1.0
        };
        
        this.init();
    }
    
    async init() {
        try {
            // Initialize Mapbox
            this.initMap();
            
            // Load constellation data
            await this.loadConstellationData();
            
            // Setup controls
            this.setupControls();
            
            // Add constellation layers
            this.addConstellationLayers();
            
            this.hideLoading();
        } catch (error) {
            console.error('초기화 오류:', error);
            this.showError('데이터를 불러오는 중 오류가 발생했습니다.');
        }
    }
    
    initMap() {
        // Mapbox access token (여기에 실제 토큰을 넣으세요)
        mapboxgl.accessToken = 'pk.eyJ1IjoiamF5Y2VrIiwiYSI6ImNtYzB0N2RsdzA2MXgya3IzbGM1OTg0bTMifQ.2iyCIDuQTc7gkqtgG6f3Ew';

        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [126.9780, 37.5665], // Seoul coordinates
            zoom: 10,
            pitch: 0,
            bearing: 0,
            antialias: true
        });

        // Add navigation controls
        this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add fullscreen control
        this.map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

        // Add geolocate control
        this.map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
        }), 'top-right');
    }
    
    async loadConstellationData() {
        try {
            // Load constellation points and lines data
            const [constellationsResponse, linesResponse] = await Promise.all([
                fetch('d3-celestial-master/data/constellations.json'),
                fetch('d3-celestial-master/data/constellations.lines.json')
            ]);
            
            this.constellationData = await constellationsResponse.json();
            this.constellationLines = await linesResponse.json();
            
            console.log('별자리 데이터 로드 완료:', {
                constellations: this.constellationData.features.length,
                lines: this.constellationLines.features.length
            });
            
        } catch (error) {
            console.error('별자리 데이터 로드 실패:', error);
            // Fallback to sample data
            this.createSampleData();
        }
    }
    
    createSampleData() {
        // Create comprehensive constellation data for demonstration
        const sampleConstellations = [
            {
                name: "북두칠성",
                nameEn: "Ursa Major",
                coords: [126.9780, 37.5665],
                stars: this.generateBigDipper(),
                description: "큰곰자리의 일부로, 국자 모양의 7개 별로 이루어진 별자리",
                magnitude: 1.8,
                season: "봄"
            },
            {
                name: "카시오페이아",
                nameEn: "Cassiopeia",
                coords: [127.0280, 37.6165],
                stars: this.generateCassiopeia(),
                description: "W자 모양의 5개 별로 이루어진 북극성 근처의 별자리",
                magnitude: 2.2,
                season: "가을"
            },
            {
                name: "오리온",
                nameEn: "Orion",
                coords: [126.9280, 37.5165],
                stars: this.generateOrion(),
                description: "겨울철 대표 별자리로 사냥꾼의 모습을 하고 있음",
                magnitude: 0.1,
                season: "겨울"
            },
            {
                name: "백조자리",
                nameEn: "Cygnus",
                coords: [127.0780, 37.6665],
                stars: this.generateCygnus(),
                description: "십자가 모양으로 배열된 여름철 대표 별자리",
                magnitude: 1.3,
                season: "여름"
            },
            {
                name: "전갈자리",
                nameEn: "Scorpius",
                coords: [126.8780, 37.4665],
                stars: this.generateScorpius(),
                description: "S자 곡선을 그리며 전갈의 모습을 닮은 별자리",
                magnitude: 1.0,
                season: "여름"
            },
            {
                name: "사자자리",
                nameEn: "Leo",
                coords: [127.1280, 37.7165],
                stars: this.generateLeo(),
                description: "물음표를 뒤집은 모양의 봄철 대표 별자리",
                magnitude: 1.4,
                season: "봄"
            }
        ];

        this.constellationData = {
            type: "FeatureCollection",
            features: sampleConstellations.map((constellation, index) => ({
                type: "Feature",
                id: `constellation_${index}`,
                properties: {
                    name: constellation.name,
                    nameEn: constellation.nameEn,
                    nameKo: constellation.name,
                    description: constellation.description,
                    magnitude: constellation.magnitude,
                    season: constellation.season,
                    rank: Math.floor(constellation.magnitude) + 1
                },
                geometry: {
                    type: "Point",
                    coordinates: constellation.coords
                }
            }))
        };

        this.constellationLines = {
            type: "FeatureCollection",
            features: sampleConstellations.map((constellation, index) => ({
                type: "Feature",
                id: `lines_${index}`,
                properties: {
                    name: constellation.name,
                    nameEn: constellation.nameEn,
                    season: constellation.season
                },
                geometry: {
                    type: "LineString",
                    coordinates: constellation.stars
                }
            }))
        };
    }
    
    generateBigDipper() {
        const center = [126.9780, 37.5665];
        return [
            [center[0] - 0.02, center[1] + 0.01],
            [center[0] - 0.015, center[1] + 0.015],
            [center[0] - 0.01, center[1] + 0.02],
            [center[0] - 0.005, center[1] + 0.015],
            [center[0], center[1] + 0.01],
            [center[0] + 0.005, center[1] + 0.005],
            [center[0] + 0.01, center[1]]
        ];
    }
    
    generateCassiopeia() {
        const center = [127.0280, 37.6165];
        return [
            [center[0] - 0.015, center[1]],
            [center[0] - 0.01, center[1] + 0.01],
            [center[0], center[1] + 0.005],
            [center[0] + 0.01, center[1] + 0.015],
            [center[0] + 0.015, center[1] + 0.005]
        ];
    }
    
    generateOrion() {
        const center = [126.9280, 37.5165];
        return [
            [center[0] - 0.01, center[1] + 0.02],
            [center[0], center[1] + 0.015],
            [center[0] + 0.01, center[1] + 0.02],
            [center[0] + 0.005, center[1] + 0.005],
            [center[0], center[1]],
            [center[0] - 0.005, center[1] + 0.005],
            [center[0] - 0.01, center[1] + 0.02]
        ];
    }

    generateCygnus() {
        const center = [127.0780, 37.6665];
        return [
            [center[0], center[1] + 0.025],
            [center[0], center[1] + 0.01],
            [center[0] - 0.015, center[1] + 0.005],
            [center[0], center[1] + 0.01],
            [center[0] + 0.015, center[1] + 0.005],
            [center[0], center[1] + 0.01],
            [center[0], center[1] - 0.01]
        ];
    }

    generateScorpius() {
        const center = [126.8780, 37.4665];
        return [
            [center[0] - 0.02, center[1] + 0.01],
            [center[0] - 0.015, center[1] + 0.005],
            [center[0] - 0.01, center[1]],
            [center[0] - 0.005, center[1] - 0.005],
            [center[0], center[1] - 0.01],
            [center[0] + 0.005, center[1] - 0.015],
            [center[0] + 0.01, center[1] - 0.02],
            [center[0] + 0.015, center[1] - 0.015]
        ];
    }

    generateLeo() {
        const center = [127.1280, 37.7165];
        return [
            [center[0] - 0.015, center[1] + 0.01],
            [center[0] - 0.01, center[1] + 0.015],
            [center[0] - 0.005, center[1] + 0.02],
            [center[0], center[1] + 0.015],
            [center[0] + 0.005, center[1] + 0.01],
            [center[0] + 0.01, center[1] + 0.005],
            [center[0] + 0.015, center[1]],
            [center[0] + 0.01, center[1] - 0.005]
        ];
    }
    
    addConstellationLayers() {
        this.map.on('load', () => {
            // Add constellation lines
            this.map.addSource('constellation-lines', {
                type: 'geojson',
                data: this.constellationLines
            });
            
            this.map.addLayer({
                id: 'constellation-lines-layer',
                type: 'line',
                source: 'constellation-lines',
                paint: {
                    'line-color': '#FFD700',
                    'line-width': 2,
                    'line-opacity': this.settings.opacity
                }
            });
            
            // Add constellation points (stars)
            this.map.addSource('constellation-points', {
                type: 'geojson',
                data: this.constellationData
            });
            
            this.map.addLayer({
                id: 'constellation-stars-layer',
                type: 'circle',
                source: 'constellation-points',
                paint: {
                    'circle-radius': 6 * this.settings.scale,
                    'circle-color': '#FFFFFF',
                    'circle-stroke-color': '#FFD700',
                    'circle-stroke-width': 2,
                    'circle-opacity': this.settings.opacity
                }
            });
            
            // Add constellation names (initially hidden)
            this.map.addLayer({
                id: 'constellation-names-layer',
                type: 'symbol',
                source: 'constellation-points',
                layout: {
                    'text-field': ['get', 'name'],
                    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                    'text-size': 12,
                    'text-anchor': 'center',
                    'text-offset': [0, 2],
                    'visibility': this.settings.showNames ? 'visible' : 'none'
                },
                paint: {
                    'text-color': '#FFD700',
                    'text-halo-color': '#000000',
                    'text-halo-width': 2,
                    'text-opacity': this.settings.opacity
                }
            });
            
            // Add click events
            this.addClickEvents();
        });
    }
    
    addClickEvents() {
        // Click on constellation stars
        this.map.on('click', 'constellation-stars-layer', (e) => {
            const feature = e.features[0];
            const coordinates = feature.geometry.coordinates.slice();
            const name = feature.properties.name || feature.properties.nameKo || '알 수 없는 별자리';
            
            // Create popup
            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(`
                    <div>
                        <h3>${name}</h3>
                        <p>이 별자리에 대한 더 자세한 정보를 보려면 클릭하세요.</p>
                        <small>좌표: ${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}</small>
                    </div>
                `)
                .addTo(this.map);
            
            this.updateConstellationInfo(name, feature.properties);
        });
        
        // Change cursor on hover
        this.map.on('mouseenter', 'constellation-stars-layer', () => {
            this.map.getCanvas().style.cursor = 'pointer';
        });
        
        this.map.on('mouseleave', 'constellation-stars-layer', () => {
            this.map.getCanvas().style.cursor = '';
        });
    }
    
    setupControls() {
        // Toggle buttons
        document.getElementById('toggle-constellations').addEventListener('click', () => {
            this.toggleLayer('constellation-lines-layer', 'toggle-constellations');
        });
        
        document.getElementById('toggle-stars').addEventListener('click', () => {
            this.toggleLayer('constellation-stars-layer', 'toggle-stars');
        });
        
        document.getElementById('toggle-names').addEventListener('click', () => {
            this.toggleLayer('constellation-names-layer', 'toggle-names');
        });
        
        // Map style selector
        document.getElementById('map-style').addEventListener('change', (e) => {
            this.map.setStyle(e.target.value);
            // Re-add layers after style change
            this.map.once('styledata', () => {
                this.addConstellationLayers();
            });
        });
        
        // Opacity slider
        const opacitySlider = document.getElementById('opacity-slider');
        const opacityValue = document.getElementById('opacity-value');
        
        opacitySlider.addEventListener('input', (e) => {
            const opacity = parseFloat(e.target.value);
            this.settings.opacity = opacity;
            opacityValue.textContent = Math.round(opacity * 100) + '%';
            this.updateOpacity(opacity);
        });
        
        // Scale slider
        const scaleSlider = document.getElementById('scale-slider');
        const scaleValue = document.getElementById('scale-value');
        
        scaleSlider.addEventListener('input', (e) => {
            const scale = parseFloat(e.target.value);
            this.settings.scale = scale;
            scaleValue.textContent = Math.round(scale * 100) + '%';
            this.updateScale(scale);
        });
    }
    
    toggleLayer(layerId, buttonId) {
        const visibility = this.map.getLayoutProperty(layerId, 'visibility');
        const button = document.getElementById(buttonId);
        
        if (visibility === 'visible' || visibility === undefined) {
            this.map.setLayoutProperty(layerId, 'visibility', 'none');
            button.classList.remove('active');
        } else {
            this.map.setLayoutProperty(layerId, 'visibility', 'visible');
            button.classList.add('active');
        }
    }
    
    updateOpacity(opacity) {
        if (this.map.getLayer('constellation-lines-layer')) {
            this.map.setPaintProperty('constellation-lines-layer', 'line-opacity', opacity);
        }
        if (this.map.getLayer('constellation-stars-layer')) {
            this.map.setPaintProperty('constellation-stars-layer', 'circle-opacity', opacity);
        }
        if (this.map.getLayer('constellation-names-layer')) {
            this.map.setPaintProperty('constellation-names-layer', 'text-opacity', opacity);
        }
    }
    
    updateScale(scale) {
        if (this.map.getLayer('constellation-stars-layer')) {
            this.map.setPaintProperty('constellation-stars-layer', 'circle-radius', 6 * scale);
        }
    }
    
    updateConstellationInfo(name, properties) {
        const infoBox = document.getElementById('constellation-info');
        const englishName = properties.nameEn || '정보 없음';
        const description = properties.description || '이 별자리는 밤하늘에서 관찰할 수 있는 아름다운 별의 패턴입니다.';
        const magnitude = properties.magnitude || '정보 없음';
        const season = properties.season || '정보 없음';
        const rank = properties.rank || '정보 없음';

        infoBox.innerHTML = `
            <h3>🌟 ${name}</h3>
            <div style="margin-bottom: 10px;">
                <p><strong>영문명:</strong> ${englishName}</p>
                <p><strong>관측 계절:</strong> ${season}</p>
                <p><strong>밝기:</strong> ${magnitude !== '정보 없음' ? magnitude + '등급' : magnitude}</p>
                <p><strong>등급:</strong> ${rank !== '정보 없음' ? rank + '급' : rank}</p>
            </div>
            <div style="padding: 10px; background: rgba(255, 255, 255, 0.05); border-radius: 6px; border-left: 3px solid #FFD700;">
                <p style="font-size: 0.85rem; line-height: 1.4;">${description}</p>
            </div>
            <div style="margin-top: 10px; font-size: 0.8rem; color: rgba(255, 255, 255, 0.6);">
                <p>💡 팁: 지도를 확대/축소하여 더 자세히 관찰해보세요!</p>
            </div>
        `;
    }
    
    hideLoading() {
        const loading = document.getElementById('loading');
        loading.classList.add('hidden');
        this.isLoading = false;
    }
    
    showError(message) {
        const loading = document.getElementById('loading');
        loading.innerHTML = `
            <div style="color: #ff6b6b;">
                <h3>오류 발생</h3>
                <p>${message}</p>
            </div>
        `;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new CelestialMapbox();
});
