/**
 * mapBox_Sketch_03.js
 * 맵박스 별자리 지도 - 교수님 파일 구조에 맞게 수정
 */

// ⭐ 맵박스 토큰 설정
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

// 맨해튼 설정
const MANHATTAN_CENTER = [-73.9712, 40.7831];
const MANHATTAN_BOUNDS = [
    [-74.0479, 40.7009], // 남서쪽
    [-73.9047, 40.8820]  // 북동쪽
];

// 별자리 데이터 (미리 정의된 데이터 사용)
const extractedConstellations = {
    'BigDipper': [
        [-73.98, 40.78], [-73.975, 40.785], [-73.97, 40.79], 
        [-73.965, 40.785], [-73.96, 40.78], [-73.955, 40.775], [-73.95, 40.77]
    ],
    'Cassiopeia': [
        [-73.99, 40.77], [-73.985, 40.775], [-73.98, 40.78], 
        [-73.975, 40.785], [-73.97, 40.79]
    ],
    'Orion': [
        [-73.985, 40.75], [-73.98, 40.755], [-73.975, 40.76], 
        [-73.97, 40.765], [-73.965, 40.77]
    ],
    'Leo': [
        [-73.945, 40.76], [-73.95, 40.765], [-73.955, 40.77], 
        [-73.96, 40.775], [-73.965, 40.78]
    ],
    'Draco': [
        [-73.95, 40.75], [-73.955, 40.755], [-73.96, 40.76], 
        [-73.965, 40.765], [-73.97, 40.77], [-73.975, 40.775]
    ]
};

let map;
let visibleConstellations = new Set();
let isDataExtracted = true; // 데이터가 이미 준비됨

// 별자리 지도 초기화
const map3 = new mapboxgl.Map({
    container: 'mapbox-container-3',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: MANHATTAN_CENTER,
    zoom: 13,
    pitch: 0,
    bearing: 0
});

// 별자리별 색상 지정
function getConstellationColor(name) {
    const colors = {
        'BigDipper': '#FFD700',   // 금색
        'Cassiopeia': '#87CEEB',  // 하늘색  
        'Orion': '#98FB98',       // 연두색
        'Leo': '#DDA0DD',         // 자주색
        'Draco': '#F0E68C'        // 카키색
    };
    return colors[name] || '#FFFFFF';
}

// 맵 로드 완료 후 실행
map3.on('load', () => {
    console.log('✅ 별자리 지도 로드 완료');
    
    // 맨해튼 경계선 추가
    addManhattanBounds();
    
    // 모든 별자리 자동 로드
    loadConstellations();
});

// 맨해튼 경계선 추가
function addManhattanBounds() {
    const manhattanPolygon = {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [[
                [MANHATTAN_BOUNDS[0][0], MANHATTAN_BOUNDS[0][1]], // SW
                [MANHATTAN_BOUNDS[1][0], MANHATTAN_BOUNDS[0][1]], // SE
                [MANHATTAN_BOUNDS[1][0], MANHATTAN_BOUNDS[1][1]], // NE
                [MANHATTAN_BOUNDS[0][0], MANHATTAN_BOUNDS[1][1]], // NW
                [MANHATTAN_BOUNDS[0][0], MANHATTAN_BOUNDS[0][1]]  // SW (닫기)
            ]]
        }
    };
    
    map3.addSource('manhattan-bounds', {
        type: 'geojson',
        data: manhattanPolygon
    });
    
    map3.addLayer({
        id: 'manhattan-bounds-line',
        type: 'line',
        source: 'manhattan-bounds',
        paint: {
            'line-color': '#444',
            'line-width': 2,
            'line-dasharray': [5, 5],
            'line-opacity': 0.6
        }
    });
}

// 별자리를 맵에 로드
function loadConstellations() {
    console.log('🗺️ 맵박스에 별자리 추가 중...');
    
    let addedCount = 0;
    
    Object.entries(extractedConstellations).forEach(([name, coordinates]) => {
        if (coordinates && coordinates.length >= 2) {
            addConstellationToMap(name, coordinates);
            addedCount++;
            visibleConstellations.add(name);
        }
    });
    
    console.log(`✅ ${addedCount}개 별자리가 맵에 추가되었습니다!`);
}

// 개별 별자리를 맵에 추가
function addConstellationToMap(name, coordinates) {
    const sourceId = `constellation-${name}`;
    const lineLayerId = `constellation-line-${name}`;
    
    // 유효한 좌표만 필터링
    const validCoords = coordinates.filter(coord => 
        Array.isArray(coord) && 
        coord.length >= 2 && 
        !isNaN(coord[0]) && 
        !isNaN(coord[1])
    );
    
    if (validCoords.length < 2) {
        console.warn(`${name}: 유효한 좌표가 부족합니다.`);
        return;
    }
    
    // 별자리 선 데이터 (GeoJSON LineString)
    const lineData = {
        type: 'Feature',
        properties: { name: name },
        geometry: {
            type: 'LineString',
            coordinates: validCoords
        }
    };
    
    // 소스 추가
    map3.addSource(sourceId, {
        type: 'geojson',
        data: lineData
    });
    
    // 선 레이어 추가
    map3.addLayer({
        id: lineLayerId,
        type: 'line',
        source: sourceId,
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': getConstellationColor(name),
            'line-width': 3,
            'line-opacity': 0.8
        }
    });
    
    // 별 포인트들 추가 (GeoJSON Points)
    validCoords.forEach((coord, index) => {
        const starId = `star-${name}-${index}`;
        
        map3.addSource(starId, {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {
                    constellation: name,
                    starIndex: index,
                    starName: `${name} - 별 ${index + 1}`,
                    color: getConstellationColor(name)
                },
                geometry: {
                    type: 'Point',
                    coordinates: coord
                }
            }
        });
        
        map3.addLayer({
            id: `star-layer-${starId}`,
            type: 'circle',
            source: starId,
            paint: {
                'circle-radius': 6,
                'circle-color': '#FFFFFF',
                'circle-opacity': 0.9,
                'circle-stroke-color': getConstellationColor(name),
                'circle-stroke-width': 2
            }
        });
    });
}

// 🎯 클릭 이벤트 처리 (교수님 요구사항)
map3.on('click', (e) => {
    // 1️⃣ 별을 클릭했을 때
    const features = map3.queryRenderedFeatures(e.point);
    
    if (features.length > 0) {
        const feature = features[0];
        
        if (feature.properties && feature.properties.constellation) {
            // 별자리 별을 클릭한 경우
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`
                    <div style="color: black; font-family: Arial; max-width: 250px;">
                        <h3 style="margin: 0 0 10px 0; color: ${feature.properties.color};">
                            ⭐ ${feature.properties.constellation}
                        </h3>
                        <p style="margin: 0 0 5px 0;">
                            <strong>별 번호:</strong> ${feature.properties.starIndex + 1}
                        </p>
                        <p style="margin: 0 0 10px 0; font-size: 13px; color: #666;">
                            ${getConstellationDescription(feature.properties.constellation)}
                        </p>
                        <div style="font-size: 12px; color: #888;">
                            <strong>좌표:</strong> ${e.lngLat.lng.toFixed(4)}, ${e.lngLat.lat.toFixed(4)}
                        </div>
                        <small style="color: #999;">GeoJSON Point - 별자리 데이터</small>
                    </div>
                `)
                .addTo(map3);
                
            console.log(`🌟 클릭한 별: ${feature.properties.constellation} - 별 ${feature.properties.starIndex + 1}`);
        }
    } else {
        // 2️⃣ 빈 공간을 클릭했을 때
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
                <div style="color: black; font-family: Arial;">
                    <h4 style="margin: 0 0 10px 0;">🌃 맨해튼 밤하늘</h4>
                    <p style="margin: 0 0 5px 0;">
                        <strong>위치:</strong> ${e.lngLat.lng.toFixed(4)}, ${e.lngLat.lat.toFixed(4)}
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #666;">
                        별을 클릭하면 별자리 정보를 볼 수 있습니다
                    </p>
                    <small style="color: #999;">Interactive Map - Tutorial 요구사항</small>
                </div>
            `)
            .addTo(map3);
            
        console.log(`🗺️ 맵 클릭: ${e.lngLat.lng.toFixed(4)}, ${e.lngLat.lat.toFixed(4)}`);
    }
});

// 별자리 설명 반환
function getConstellationDescription(name) {
    const descriptions = {
        'BigDipper': '큰곰자리의 일부로 북두칠성이라고 불립니다',
        'Cassiopeia': '에티오피아의 왕비로 W자 모양의 별자리입니다',
        'Orion': '사냥꾼 오리온을 나타내는 겨울 대표 별자리입니다',
        'Leo': '사자 모양의 봄철 대표 별자리입니다',
        'Draco': '용자리로 북극성 주변을 감싸고 있는 별자리입니다'
    };
    return descriptions[name] || '아름다운 별자리입니다';
}

// 🎛️ 전역 제어 함수들 (HTML 버튼용)
function toggleAllConstellations(show) {
    Object.keys(extractedConstellations).forEach(name => {
        const visibility = show ? 'visible' : 'none';
        
        // 선 레이어 토글
        const lineLayerId = `constellation-line-${name}`;
        if (map3.getLayer(lineLayerId)) {
            map3.setLayoutProperty(lineLayerId, 'visibility', visibility);
        }
        
        // 별 레이어들 토글
        extractedConstellations[name].forEach((coord, index) => {
            const starLayerId = `star-layer-star-${name}-${index}`;
            if (map3.getLayer(starLayerId)) {
                map3.setLayoutProperty(starLayerId, 'visibility', visibility);
            }
        });
        
        if (show) {
            visibleConstellations.add(name);
        } else {
            visibleConstellations.delete(name);
        }
    });
    
    console.log(`🌟 모든 별자리 ${show ? '표시' : '숨김'}`);
}

function addRandomStar() {
    // 맨해튼 범위 내 랜덤 좌표 생성
    const randomLng = MANHATTAN_BOUNDS[0][0] + Math.random() * (MANHATTAN_BOUNDS[1][0] - MANHATTAN_BOUNDS[0][0]);
    const randomLat = MANHATTAN_BOUNDS[0][1] + Math.random() * (MANHATTAN_BOUNDS[1][1] - MANHATTAN_BOUNDS[0][1]);
    const randomId = Date.now();
    
    // 랜덤 별 추가 (GeoJSON Point)
    map3.addSource(`random-star-${randomId}`, {
        type: 'geojson',
        data: {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [randomLng, randomLat]
            },
            properties: {
                type: 'random-star',
                created: new Date().toLocaleTimeString(),
                name: `랜덤 별 #${randomId}`
            }
        }
    });
    
    map3.addLayer({
        id: `random-star-${randomId}`,
        type: 'circle',
        source: `random-star-${randomId}`,
        paint: {
            'circle-radius': 8,
            'circle-color': '#FF69B4',
            'circle-stroke-color': '#FFFFFF',
            'circle-stroke-width': 2,
            'circle-opacity': 0.8
        }
    });
    
    // 새 별 팝업 표시
    new mapboxgl.Popup()
        .setLngLat([randomLng, randomLat])
        .setHTML(`
            <div style="color: black; font-family: Arial;">
                <h4 style="margin: 0 0 10px 0;">✨ 새로운 별 탄생!</h4>
                <p style="margin: 0 0 5px 0;">맨해튼 하늘에 별이 추가되었습니다</p>
                <div style="font-size: 12px; color: #666;">
                    <strong>생성 시간:</strong> ${new Date().toLocaleTimeString()}<br>
                    <strong>좌표:</strong> ${randomLng.toFixed(4)}, ${randomLat.toFixed(4)}
                </div>
                <small style="color: #999;">동적 GeoJSON Point 생성</small>
            </div>
        `)
        .addTo(map3);
    
    console.log(`✨ 랜덤 별 추가: ${randomLng.toFixed(4)}, ${randomLat.toFixed(4)}`);
}

// 마우스 호버 효과
map3.on('mouseenter', 'star-layer-star-BigDipper-0', () => {
    map3.getCanvas().style.cursor = 'pointer';
});

map3.on('mouseleave', 'star-layer-star-BigDipper-0', () => {
    map3.getCanvas().style.cursor = '';
});

// 에러 처리
map3.on('error', (e) => {
    console.error('별자리 지도 오류:', e.error);
});

// HTML 버튼들이 함수를 찾을 수 있도록 전역 스코프에 추가
window.toggleAllConstellations = toggleAllConstellations;
window.addRandomStar = addRandomStar;

console.log('⭐ mapBox_Sketch_03.js 로드 완료: 별자리 지도 준비됨!');