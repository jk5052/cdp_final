// Movie network data generator
function generateMovieNetworkData() {
    const eras = [
        {
            name: "Golden Age",
            period: "1950s",
            movies: ["Sunset Boulevard", "Singin' in the Rain", "Casablanca", "Roman Holiday"],
            genres: ["Drama", "Musical", "Romance", "Film Noir"],
            directors: ["Billy Wilder", "Gene Kelly", "Michael Curtiz", "William Wyler"],
            actors: ["Humphrey Bogart", "Gene Kelly", "Audrey Hepburn", "Gloria Swanson"]
        },
        {
            name: "New Hollywood",
            period: "1970s", 
            movies: ["The Godfather", "Taxi Driver", "Jaws", "Star Wars", "Apocalypse Now"],
            genres: ["Crime", "Thriller", "Action", "Sci-Fi", "War"],
            directors: ["Francis Ford Coppola", "Martin Scorsese", "Steven Spielberg", "George Lucas"],
            actors: ["Al Pacino", "Robert De Niro", "Harrison Ford", "Marlon Brando"]
        },
        {
            name: "Blockbuster Era",
            period: "1980s",
            movies: ["E.T.", "Back to the Future", "Raiders of the Lost Ark", "The Terminator", "Blade Runner"],
            genres: ["Adventure", "Time Travel", "Action", "Sci-Fi", "Fantasy"],
            directors: ["Steven Spielberg", "Robert Zemeckis", "James Cameron", "Ridley Scott"],
            actors: ["Harrison Ford", "Michael J. Fox", "Arnold Schwarzenegger", "Sean Young"]
        },
        {
            name: "Independent Revolution", 
            period: "1990s",
            movies: ["Pulp Fiction", "Reservoir Dogs", "The Shawshank Redemption", "Goodfellas", "Fargo"],
            genres: ["Crime", "Drama", "Dark Comedy", "Thriller", "Neo-Noir"],
            directors: ["Quentin Tarantino", "Frank Darabont", "Martin Scorsese", "Coen Brothers"],
            actors: ["John Travolta", "Samuel L. Jackson", "Morgan Freeman", "Robert De Niro"]
        },
        {
            name: "Digital Revolution",
            period: "2000s",
            movies: ["The Matrix", "Lord of the Rings", "Pirates of the Caribbean", "Finding Nemo", "The Dark Knight"],
            genres: ["Sci-Fi", "Fantasy", "Animation", "Superhero", "Epic"],
            directors: ["The Wachowskis", "Peter Jackson", "Gore Verbinski", "Andrew Stanton", "Christopher Nolan"],
            actors: ["Keanu Reeves", "Elijah Wood", "Johnny Depp", "Christian Bale"]
        },
        {
            name: "Superhero Dominance",
            period: "2010s",
            movies: ["Avengers", "Black Panther", "Wonder Woman", "Guardians of the Galaxy", "Inception"],
            genres: ["Superhero", "Action", "Adventure", "Sci-Fi", "Fantasy"],
            directors: ["Joss Whedon", "Ryan Coogler", "Patty Jenkins", "James Gunn", "Christopher Nolan"],
            actors: ["Robert Downey Jr.", "Chadwick Boseman", "Gal Gadot", "Chris Pratt"]
        }
    ];

    return eras.map((era, index) => {
        const nodes = [];
        const links = [];
        let nodeId = 0;

        // Create genre nodes (persistent across eras)
        const genreNodes = era.genres.map(genre => ({
            id: `genre_${genre}`,
            name: genre,
            type: "genre",
            size: Math.random() * 3 + 8,
            era: index
        }));
        nodes.push(...genreNodes);

        // Create movie nodes
        const movieNodes = era.movies.map(movie => ({
            id: `movie_${movie}`,
            name: movie,
            type: "movie", 
            size: Math.random() * 4 + 6,
            era: index
        }));
        nodes.push(...movieNodes);

        // Create director nodes
        const directorNodes = era.directors.map(director => ({
            id: `director_${director}`,
            name: director,
            type: "director",
            size: Math.random() * 3 + 7,
            era: index
        }));
        nodes.push(...directorNodes);

        // Create actor nodes
        const actorNodes = era.actors.map(actor => ({
            id: `actor_${actor}`,
            name: actor,
            type: "actor",
            size: Math.random() * 3 + 5,
            era: index
        }));
        nodes.push(...actorNodes);

        // Create links between movies and genres
        movieNodes.forEach(movie => {
            const numGenres = Math.floor(Math.random() * 3) + 1;
            const shuffledGenres = [...genreNodes].sort(() => Math.random() - 0.5);
            
            for (let i = 0; i < Math.min(numGenres, shuffledGenres.length); i++) {
                links.push({
                    source: movie.id,
                    target: shuffledGenres[i].id,
                    type: "movie-genre",
                    strength: Math.random() * 0.5 + 0.5
                });
            }
        });

        // Create links between movies and directors
        movieNodes.forEach((movie, i) => {
            if (i < directorNodes.length) {
                links.push({
                    source: movie.id,
                    target: directorNodes[i].id,
                    type: "movie-director",
                    strength: Math.random() * 0.3 + 0.7
                });
            }
        });

        // Create links between movies and actors
        movieNodes.forEach(movie => {
            const numActors = Math.floor(Math.random() * 3) + 1;
            const shuffledActors = [...actorNodes].sort(() => Math.random() - 0.5);
            
            for (let i = 0; i < Math.min(numActors, shuffledActors.length); i++) {
                links.push({
                    source: movie.id,
                    target: shuffledActors[i].id,
                    type: "movie-actor",
                    strength: Math.random() * 0.4 + 0.4
                });
            }
        });

        // Create some cross-connections between directors and actors
        directorNodes.forEach(director => {
            if (Math.random() < 0.6) {
                const randomActor = actorNodes[Math.floor(Math.random() * actorNodes.length)];
                links.push({
                    source: director.id,
                    target: randomActor.id,
                    type: "director-actor",
                    strength: Math.random() * 0.3 + 0.3
                });
            }
        });

        return {
            era: era.name,
            period: era.period,
            nodes: nodes,
            links: links
        };
    });
}

// Create the movie network visualization
function createMovieNetwork() {
    const data = generateMovieNetworkData();
    let currentEra = 0;
    let isPlaying = false;
    let animationSpeed = 1500;

    const container = d3.select("#network-container");
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create the network chart (similar to Observable structure)
    const chart = createNetworkChart();
    container.node().appendChild(chart);

    function createNetworkChart() {
        const simulation = d3.forceSimulation()
            .force("charge", d3.forceManyBody().strength(-200))
            .force("link", d3.forceLink().id(d => d.id).distance(60).strength(0.6))
            .force("x", d3.forceX(width / 2).strength(0.1))
            .force("y", d3.forceY(height / 2).strength(0.1))
            .force("collision", d3.forceCollide().radius(d => d.size + 2))
            .on("tick", ticked);

        const svg = d3.create("svg")
            .attr("viewBox", [0, 0, width, height])
            .attr("width", width)
            .attr("height", height)
            .attr("style", "max-width: 100%; height: auto;");

        let link = svg.append("g")
            .attr("class", "links")
            .selectAll("line");

        let node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle");

        let label = svg.append("g")
            .attr("class", "labels")
            .selectAll("text");

        function ticked() {
            node.attr("cx", d => d.x)
                .attr("cy", d => d.y);
            
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            label.attr("x", d => d.x)
                .attr("y", d => d.y + d.size + 12);
        }

        // Drag functionality
        function drag(simulation) {
            function dragstarted(event, d) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(event, d) {
                d.fx = event.x;
                d.fy = event.y;
            }

            function dragended(event, d) {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }

        // Update function (similar to Observable pattern)
        function update({nodes, links}) {
            // Make a shallow copy to protect against mutation
            const old = new Map(node.data().map(d => [d.id, d]));
            nodes = nodes.map(d => ({...old.get(d.id), ...d}));
            links = links.map(d => ({...d}));

            // Update links
            link = link
                .data(links, d => `${d.source}-${d.target}`)
                .join(
                    enter => enter.append("line")
                        .attr("class", "network-link")
                        .style("opacity", 0)
                        .call(enter => enter.transition()
                            .duration(500)
                            .style("opacity", d => d.strength)),
                    update => update,
                    exit => exit.transition()
                        .duration(300)
                        .style("opacity", 0)
                        .remove()
                );

            // Update nodes
            node = node
                .data(nodes, d => d.id)
                .join(
                    enter => enter.append("circle")
                        .attr("class", d => `${d.type}-node`)
                        .attr("r", 0)
                        .style("opacity", 0)
                        .call(drag(simulation))
                        .call(enter => enter.transition()
                            .duration(500)
                            .attr("r", d => d.size)
                            .style("opacity", 1))
                        .on("mouseover", function(event, d) {
                            // Highlight connected nodes
                            const connectedIds = new Set();
                            links.forEach(link => {
                                if (link.source.id === d.id) connectedIds.add(link.target.id);
                                if (link.target.id === d.id) connectedIds.add(link.source.id);
                            });
                            
                            node.style("opacity", n => 
                                n.id === d.id || connectedIds.has(n.id) ? 1 : 0.3);
                            link.style("opacity", l => 
                                l.source.id === d.id || l.target.id === d.id ? 1 : 0.1);
                        })
                        .on("mouseout", function() {
                            node.style("opacity", 1);
                            link.style("opacity", d => d.strength);
                        }),
                    update => update.transition()
                        .duration(300)
                        .attr("r", d => d.size),
                    exit => exit.transition()
                        .duration(300)
                        .attr("r", 0)
                        .style("opacity", 0)
                        .remove()
                );

            // Update labels
            label = label
                .data(nodes.filter(d => d.type === 'movie' || d.size > 8), d => d.id)
                .join(
                    enter => enter.append("text")
                        .attr("class", "node-label important-label")
                        .text(d => d.name.length > 15 ? d.name.substring(0, 12) + "..." : d.name)
                        .style("opacity", 0)
                        .call(enter => enter.transition()
                            .duration(500)
                            .style("opacity", 1)),
                    update => update.text(d => d.name.length > 15 ? d.name.substring(0, 12) + "..." : d.name),
                    exit => exit.transition()
                        .duration(300)
                        .style("opacity", 0)
                        .remove()
                );

            // Update simulation
            simulation.nodes(nodes);
            simulation.force("link").links(links);
            simulation.alpha(0.5).restart();
        }

        // Return chart object with update method
        return Object.assign(svg.node(), { update });
    }

    // Update UI stats
    function updateStats() {
        const currentData = data[currentEra];
        const movieCount = currentData.nodes.filter(n => n.type === 'movie').length;
        const genreCount = currentData.nodes.filter(n => n.type === 'genre').length;
        const directorCount = currentData.nodes.filter(n => n.type === 'director').length;
        
        d3.select("#movie-count").text(movieCount);
        d3.select("#genre-count").text(genreCount);
        d3.select("#director-count").text(directorCount);
        d3.select("#connection-count").text(currentData.links.length);
        d3.select("#era-display").text(currentData.era);
        d3.select("#year-display").text(currentData.period);
        
        // Update timeline
        const progress = ((currentEra + 1) / data.length) * 100;
        d3.select("#timeline-progress").style("width", `${progress}%`);
        d3.select("#timeline-marker").style("left", `${progress}%`);
    }

    // Update visualization
    function updateVisualization() {
        const currentData = data[currentEra];
        chart.update({
            nodes: currentData.nodes,
            links: currentData.links
        });
        updateStats();
    }

    // Animation controls
    let animationInterval;

    function startAnimation() {
        if (animationInterval) clearInterval(animationInterval);
        animationInterval = setInterval(() => {
            currentEra = (currentEra + 1) % data.length;
            updateVisualization();
        }, animationSpeed);
    }

    function stopAnimation() {
        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        }
    }

    function nextEra() {
        currentEra = (currentEra + 1) % data.length;
        updateVisualization();
    }

    function previousEra() {
        currentEra = (currentEra - 1 + data.length) % data.length;
        updateVisualization();
    }

    // Event listeners
    d3.select("#play-btn").on("click", function() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            this.textContent = "⏸ Pause";
            startAnimation();
        } else {
            this.textContent = "▶ Play";
            stopAnimation();
        }
    });

    d3.select("#next-btn").on("click", function() {
        if (!isPlaying) {
            nextEra();
        }
    });

    d3.select("#prev-btn").on("click", function() {
        if (!isPlaying) {
            previousEra();
        }
    });

    d3.select("#speed-slider").on("input", function() {
        animationSpeed = +this.value;
        d3.select("#speed-display").text(`${(animationSpeed / 1000).toFixed(1)}s`);
        if (isPlaying) {
            stopAnimation();
            startAnimation();
        }
    });

    // Keyboard controls
    document.addEventListener("keydown", (event) => {
        switch(event.code) {
            case "Space":
                event.preventDefault();
                d3.select("#play-btn").node().click();
                break;
            case "ArrowLeft":
                if (!isPlaying) {
                    previousEra();
                }
                break;
            case "ArrowRight":
                if (!isPlaying) {
                    nextEra();
                }
                break;
        }
    });

    // Initialize
    updateVisualization();
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function() {
    createMovieNetwork();
});

// Handle window resize
window.addEventListener("resize", () => {
    location.reload();
});