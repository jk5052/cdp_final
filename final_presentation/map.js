import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const EmotionBiasWorldMap = () => {
  const svgRef = useRef();
  const [currentProjection, setCurrentProjection] = useState('Natural Earth');
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: '' });

  // 투영법 정의
  const projections = {
    "Natural Earth": d3.geoNaturalEarth1,
    "Mercator": d3.geoMercator,
    "Robinson": d3.geoRobinson,
    "Mollweide": d3.geoMollweide,
    "Orthographic": d3.geoOrthographic,
    "Stereographic": d3.geoStereographic,
    "Eckert IV": d3.geoEckert4,
    "Equal Earth": d3.geoEqualEarth,
    "Hammer": d3.geoHammer,
    "Winkel tripel": d3.geoWinkel3
  };

  // Emotional bias data
  const emotionBiasData = [
    {
      region: "North America",
      country: "United States",
      coordinates: [-95, 37],
      biasLevel: 2,
      cases: 180,
      issues: ["Western-centric facial recognition", "Cultural context ignored", "Lack of diversity"],
      description: "Despite being home to major AI companies, Western-centric bias is most severe here"
    },
    {
      region: "Europe",
      country: "Germany",
      coordinates: [10, 51],
      biasLevel: 1,
      cases: 95,
      issues: ["Privacy vs emotion recognition conflict", "Europe-specific emotional expressions"],
      description: "Relatively less bias due to data collection restrictions like GDPR"
    },
    {
      region: "East Asia",
      country: "China",
      coordinates: [104, 35],
      biasLevel: 3,
      cases: 220,
      issues: ["Collectivist culture ignored", "Western individualism standards applied", "Linguistic context lacking"],
      description: "Most populous region but extreme bias due to Western-trained AI systems"
    },
    {
      region: "East Asia",
      country: "Japan",
      coordinates: [138, 36],
      biasLevel: 2,
      cases: 130,
      issues: ["Honne-Tatemae cultural context", "Indirect emotional expression"],
      description: "Japanese unique emotional expression often misunderstood by Western AI systems"
    },
    {
      region: "South Asia",
      country: "India",
      coordinates: [77, 20],
      biasLevel: 3,
      cases: 200,
      issues: ["Multilingual emotional expression", "Caste system influence", "Religious context"],
      description: "Diverse languages and cultures coexist but processed by single model causing bias"
    },
    {
      region: "Middle East",
      country: "Saudi Arabia",
      coordinates: [45, 24],
      biasLevel: 3,
      cases: 160,
      issues: ["Religious emotional expression", "Gender-separated culture", "Arabic cultural context"],
      description: "Islamic cultural emotional expressions frequently misinterpreted negatively by Western AI"
    },
    {
      region: "Africa",
      country: "Nigeria",
      coordinates: [8, 10],
      biasLevel: 2,
      cases: 85,
      issues: ["Tribal emotional expression differences", "Data scarcity", "Economic accessibility"],
      description: "Africa's most populous country but significantly underrepresented in AI training data"
    },
    {
      region: "South America",
      country: "Brazil",
      coordinates: [-55, -10],
      biasLevel: 2,
      cases: 110,
      issues: ["Expressive Latin culture emotions", "Portuguese context", "Socioeconomic diversity"],
      description: "Expressive Latin cultural emotions often exaggerated in AI interpretation bias"
    },
    {
      region: "Oceania",
      country: "Australia",
      coordinates: [133, -27],
      biasLevel: 0,
      cases: 45,
      issues: ["Indigenous culture consideration lacking"],
      description: "Western cultural region but Aboriginal indigenous culture still marginalized in AI"
    }
  ];

  // 색상 및 크기 스케일
  const colorScale = d3.scaleOrdinal()
    .domain([0, 1, 2, 3])
    .range(["#38a169", "#d69e2e", "#dd6b20", "#c53030"]);

  const sizeScale = d3.scaleLinear()
    .domain([0, 250])
    .range([8, 35]);

  useEffect(() => {
    drawMap();
  }, [currentProjection]);

  const drawMap = () => {
    const svg = d3.select(svgRef.current);
    const width = 1200;
    const height = 600;

    svg.selectAll("*").remove();

    // 투영법 설정
    const ProjectionConstructor = projections[currentProjection];
    let projection = ProjectionConstructor()
      .scale(200)
      .translate([width/2, height/2]);

    // Orthographic 특별 설정
    if (currentProjection === "Orthographic") {
      projection.scale(250).rotate([0, -30]);
    }

    const path = d3.geoPath().projection(projection);

    // 배경 원 (구체)
    svg.append("circle")
      .attr("cx", width/2)
      .attr("cy", height/2)
      .attr("r", projection.scale())
      .attr("fill", "rgba(255,255,255,0.05)")
      .attr("stroke", "rgba(255,255,255,0.2)")
      .attr("stroke-width", 1);

    // 그리드 라인
    const graticule = d3.geoGraticule();
    svg.append("path")
      .datum(graticule())
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.1)")
      .attr("stroke-width", 0.5);

    // 감정 편향 데이터 포인트
    svg.selectAll(".emotion-point")
      .data(emotionBiasData)
      .enter()
      .append("circle")
      .attr("class", "emotion-point")
      .attr("cx", d => {
        const coords = projection(d.coordinates);
        return coords ? coords[0] : 0;
      })
      .attr("cy", d => {
        const coords = projection(d.coordinates);
        return coords ? coords[1] : 0;
      })
      .attr("r", d => sizeScale(d.cases))
      .attr("fill", d => colorScale(d.biasLevel))
      .attr("fill-opacity", 0.8)
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("mouseover", (event, d) => {
        setTooltip({
          show: true,
          x: event.pageX,
          y: event.pageY,
          content: `
            <strong>${d.region} - ${d.country}</strong><br>
            Bias Level: ${["Good", "Moderate", "Severe", "Extreme"][d.biasLevel]}<br>
            Cases: ${d.cases} incidents<br>
            Key Issues: ${d.issues.join(", ")}<br>
            <br>
            ${d.description}
          `
        });
        
        d3.select(event.target)
          .attr("stroke-width", 3)
          .attr("r", sizeScale(d.cases) * 1.2);
      })
      .on("mouseout", (event, d) => {
        setTooltip({ show: false, x: 0, y: 0, content: '' });
        d3.select(event.target)
          .attr("stroke-width", 1)
          .attr("r", sizeScale(d.cases));
      })
      .on("click", (event, d) => {
        alert(`${d.region} - ${d.country}\n\nDetailed Information:\n${d.description}\n\nKey Issues:\n• ${d.issues.join("\n• ")}`);
      });
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white overflow-hidden">
      {/* Header */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-50">
        <h1 className="text-4xl font-bold mb-3 text-orange-400 drop-shadow-lg">
          🌍 Emotional Data Bias World Map
        </h1>
        <p className="text-xl opacity-90">
          Explore cultural bias cases in AI emotion recognition technology on the world map
        </p>
      </div>

      {/* Controls */}
      <div className="absolute top-36 left-8 z-50">
        <div className="bg-white bg-opacity-10 backdrop-blur-md p-4 rounded-lg">
          <label className="block mb-2 font-bold text-orange-400">Select Projection:</label>
          <select 
            value={currentProjection}
            onChange={(e) => setCurrentProjection(e.target.value)}
            className="w-48 p-2 rounded bg-white bg-opacity-90 text-gray-800"
          >
            {Object.keys(projections).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Container */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      w-11/12 h-3/4 bg-white bg-opacity-5 rounded-3xl overflow-hidden 
                      backdrop-blur-md border border-white border-opacity-10">
        <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 1200 600" />
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 left-8 bg-black bg-opacity-70 backdrop-blur-md p-5 rounded-lg">
        <h3 className="mb-4 text-orange-400 font-bold">🎯 Bias Severity</h3>
        {[
          { level: 3, color: "#c53030", label: "Extreme - 90%+ error rate (language, culture ignored)" },
          { level: 2, color: "#dd6b20", label: "Severe - 60%+ error rate (Western-centric)" },
          { level: 1, color: "#d69e2e", label: "Moderate - 30%+ error rate (partial bias)" },
          { level: 0, color: "#38a169", label: "Good - <30% error rate (relatively accurate)" }
        ].map(item => (
          <div key={item.level} className="flex items-center mb-2">
            <div 
              className="w-5 h-5 rounded-full mr-3" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="absolute bottom-8 right-8 bg-black bg-opacity-70 backdrop-blur-md p-5 rounded-lg">
        <h3 className="mb-4 text-orange-400 font-bold">📊 Circle Size = Number of Cases</h3>
        <div className="text-sm space-y-1">
          <div>• Large circle: 150+ cases</div>
          <div>• Medium circle: 75-149 cases</div>
          <div>• Small circle: ~74 cases</div>
          <br />
          <div>💡 Click circles for detailed information</div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-1/2 right-8 text-6xl text-white text-opacity-50">
        09 / 18
      </div>

      {/* Tooltip */}
      {tooltip.show && (
        <div 
          className="absolute bg-black bg-opacity-90 text-white p-3 rounded border border-orange-400 
                     pointer-events-none z-50 max-w-xs"
          style={{ left: tooltip.x + 10, top: tooltip.y - 10 }}
          dangerouslySetInnerHTML={{ __html: tooltip.content }}
        />
      )}
    </div>
  );
};

export default EmotionBiasWorldMap;