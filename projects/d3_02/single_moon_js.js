// Lunar Relationships - Single Interactive Moon
// Main JavaScript file

// ============================================================================
// DATA DEFINITIONS
// ============================================================================

const peopleData = [
    {
        id: "Alice", name: "Alice Johnson", role: "student", age: 22,
        department: "Computer Science", birthday: {month: 3, day: 15},
        zodiac: { 
            sign: "Pisces", symbol: "♓", 
            traits: ["Intuitive", "Artistic", "Compassionate", "Dreamy"], 
            description: "Pisces are known for their deep emotional intelligence and creative spirit. They often excel in collaborative environments."
        },
        color: "#ff6b6b"
    },
    {
        id: "Bob", name: "Bob Smith", role: "professor", age: 45,
        department: "Mathematics", birthday: {month: 7, day: 23},
        zodiac: { 
            sign: "Leo", symbol: "♌", 
            traits: ["Leadership", "Confident", "Generous", "Dramatic"], 
            description: "Leos are natural leaders who inspire others. Their confidence and generosity make them excellent mentors."
        },
        color: "#4ecdc4"
    },
    {
        id: "Carol", name: "Carol Davis", role: "student", age: 20,
        department: "Physics", birthday: {month: 11, day: 8},
        zodiac: { 
            sign: "Scorpio", symbol: "♏", 
            traits: ["Intense", "Passionate", "Mysterious", "Determined"], 
            description: "Scorpios are deeply passionate and determined individuals who form strong, lasting relationships."
        },
        color: "#ff6b6b"
    },
    {
        id: "David", name: "David Wilson", role: "professor", age: 38,
        department: "Computer Science", birthday: {month: 5, day: 12},
        zodiac: { 
            sign: "Taurus", symbol: "♉", 
            traits: ["Reliable", "Practical", "Stubborn", "Loyal"], 
            description: "Taurus individuals are known for their reliability and practical approach to problem-solving."
        },
        color: "#4ecdc4"
    },
    {
        id: "Eve", name: "Eve Brown", role: "student", age: 21,
        department: "Mathematics", birthday: {month: 9, day: 2},
        zodiac: { 
            sign: "Virgo", symbol: "♍", 
            traits: ["Analytical", "Perfectionist", "Helpful", "Organized"], 
            description: "Virgos excel in analytical thinking and have a natural desire to help others succeed."
        },
        color: "#ff6b6b"
    },
    {
        id: "Frank", name: "Frank Miller", role: "student", age: 23,
        department: "Physics", birthday: {month: 1, day: 20},
        zodiac: { 
            sign: "Aquarius", symbol: "♒", 
            traits: ["Innovative", "Independent", "Humanitarian", "Eccentric"], 
            description: "Aquarians are forward-thinking innovators who value independence and humanitarian causes."
        },
        color: "#ff6b6b"
    },
    {
        id: "Grace", name: "Grace Lee", role: "student", age: 22,
        department: "Literature", birthday: {month: 6, day: 18},
        zodiac: { 
            sign: "Gemini", symbol: "♊", 
            traits: ["Curious", "Adaptable", "Communicative", "Witty"], 
            description: "Geminis are excellent communicators with insatiable curiosity and adaptability."
        },
        color: "#ff6b6b"
    },
    {
        id: "Henry", name: "Henry Clark", role: "professor", age: 42,
        department: "Literature", birthday: {month: 12, day: 25},
        zodiac: { 
            sign: "Capricorn", symbol: "♑", 
            traits: ["Ambitious", "Disciplined", "Responsible", "Traditional"], 
            description: "Capricorns are ambitious and disciplined leaders who value tradition and responsibility."
        },
        color: "#4ecdc4"
    }
];

const relationshipData = [
    {source: "Alice", target: "Bob", relationship: "student-teacher", course: "CS101", since: 2025, strength: 0.8, month: 1, day: 15},
    {source: "Alice", target: "Carol", relationship: "friends", since: 2025, strength: 0.9, month: 2, day: 3},
    {source: "Bob", target: "David", relationship: "colleagues", since: 2025, strength: 0.7, month: 3, day: 12},
    {source: "Carol", target: "David", relationship: "student-teacher", course: "CS201", since: 2025, strength: 0.6, month: 4, day: 8},
    {source: "Eve", target: "Bob", relationship: "student-teacher", course: "MATH101", since: 2025, strength: 0.8, month: 5, day: 22},
    {source: "Alice", target: "Eve", relationship: "friends", since: 2025, strength: 0.7, month: 6, day: 7},
    {source: "Frank", target: "Alice", relationship: "study-partners", since: 2025, strength: 0.6, month: 7, day: 14},
    {source: "Grace", target: "Carol", relationship: "friends", since: 2025, strength: 0.8, month: 8, day: 28},
    {source: "Henry", target: "Bob", relationship: "colleagues", since: 2025, strength: 0.7, month: 9, day: 5},
    {source: "David", target: "Henry", relationship: "colleagues", since: 2025, strength: 0.9, month: 10, day: 18},
    {source: "Grace", target: "Henry", relationship: "student-teacher", course: "LIT200", since: 2025, strength: 0.8, month: 11, day: 2},
    {source: "Frank", target: "Eve", relationship: "study-partners", since: 2025, strength: 0.7, month: 12, day: 15}
];

// ============================================================================
// GLOBAL VARIABLES
// ============================================================================

let currentMode = 'relationships';
let currentYear = 2025;
let selectedPerson = null;
let selectedRelationship = null;
let mainMoon = null;
let zodiacSymbol = null;
let phaseIndicator = null;
let currentFocus = null;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getMoonPhaseFromStrength(strength) {
    if (strength < 0.2) return 'new-moon';
    if (strength < 0.4) return 'waxing-crescent';
    if (strength < 0.6) return 'first-quarter';
    if (strength < 0.8) return 'waxing-gibbous';
    return 'full-moon';
}

function areZodiacCompatible(sign1, sign2) {
    const compatibility = {
        'Aries': ['Leo', 'Sagittarius', 'Gemini', 'Aquarius'],
        'Taurus': ['Virgo', 'Capricorn', 'Cancer', 'Pisces'],
        'Gemini': ['Libra', 'Aquarius', 'Aries', 'Leo'],
        'Cancer': ['Scorpio', 'Pisces', 'Taurus', 'Virgo'],
        'Leo': ['Aries', 'Sagittarius', 'Gemini', 'Libra'],
        'Virgo': ['Taurus', 'Capricorn', 'Cancer', 'Scorpio'],
        'Libra': ['Gemini', 'Aquarius', 'Leo', 'Sagittarius'],
        'Scorpio': ['Cancer', 'Pisces', 'Virgo', 'Capricorn'],
        'Sagittarius': ['Aries', 'Leo', 'Libra', 'Aquarius'],
        'Capricorn': ['Taurus', 'Virgo', 'Scorpio', 'Pisces'],
        'Aquarius': ['Gemini', 'Libra', 'Aries', 'Sagittarius'],
        'Pisces': ['Cancer', 'Scorpio', 'Taurus', 'Capricorn']
    };
    return compatibility[sign1] && compatibility[sign1].includes(sign2);
}

function getPersonById(id) {
    return peopleData.find(person => person.id === id);
}

function getPersonRelationships(personId) {
    return relationshipData.filter(rel => 
        rel.source === personId || rel.target === personId
    );
}

// ============================================================================
// MOON CONTROL FUNCTIONS
// ============================================================================

function updateMoonPhase(phase) {
    // Remove all existing phase classes
    const phases = ['new-moon', 'waxing-crescent', 'first-quarter', 'waxing-gibbous', 
                   'full-moon', 'waning-gibbous', 'last-quarter', 'waning-crescent',
                   'birthday-moon', 'relationship-moon'];
    
    phases.forEach(p => mainMoon.classList.remove(p));
    
    // Add new phase
    mainMoon.classList.add(phase);
    
    // Update phase indicator text
    const phaseNames = {
        'new-moon': 'New Moon',
        'waxing-crescent': 'Waxing Crescent',
        'first-quarter': 'First Quarter',
        'waxing-gibbous': 'Waxing Gibbous',
        'full-moon': 'Full Moon',
        'waning-gibbous': 'Waning Gibbous',
        'last-quarter': 'Last Quarter',
        'waning-crescent': 'Waning Crescent',
        'birthday-moon': 'Birthday Moon',
        'relationship-moon': 'Connection Moon'
    };
    
    phaseIndicator.textContent = phaseNames[phase] || 'Full Moon';
}

function updateZodiacSymbol(symbol, person = null) {
    zodiacSymbol.textContent = symbol;
    
    if (person) {
        zodiacSymbol.style.color = person.color;
    } else {
        zodiacSymbol.style.color = '#ffd700';
    }
}

function updateCurrentFocus(text) {
    currentFocus.textContent = text;
}

// ============================================================================
// DISPLAY FUNCTIONS
// ============================================================================

function createPersonGrid() {
    const personGrid = document.getElementById('person-grid');
    personGrid.innerHTML = '';
    
    peopleData.forEach(person => {
        const personCard = document.createElement('div');
        personCard.className = 'person-card';
        personCard.dataset.personId = person.id;
        
        personCard.innerHTML = `
            <div class="person-name">${person.name}</div>
            <div class="person-role">${person.role} - ${person.department}</div>
            <div class="person-zodiac">${person.zodiac.symbol} ${person.zodiac.sign}</div>
        `;
        
        personCard.addEventListener('mouseenter', () => {
            if (currentMode === 'birthdays') {
                showPersonBirthday(person);
            } else {
                showPersonConnections(person);
            }
        });
        
        personCard.addEventListener('click', () => {
            selectPerson(person);
        });
        
        personGrid.appendChild(personCard);
    });
}

function showPersonBirthday(person) {
    updateMoonPhase('birthday-moon');
    updateZodiacSymbol(person.zodiac.symbol, person);
    updateCurrentFocus(`${person.name}'s Birthday - ${getMonthName(person.birthday.month)} ${person.birthday.day}`);
    showPersonDetails(person);
}

function showPersonConnections(person) {
    const relationships = getPersonRelationships(person.id);
    
    if (relationships.length > 0) {
        // Calculate average relationship strength
        const avgStrength = relationships.reduce((sum, rel) => sum + rel.strength, 0) / relationships.length;
        const phase = getMoonPhaseFromStrength(avgStrength);
        
        updateMoonPhase('relationship-moon');
        mainMoon.classList.add(phase);
        updateZodiacSymbol(person.zodiac.symbol, person);
        updateCurrentFocus(`${person.name} - ${relationships.length} connection${relationships.length > 1 ? 's' : ''}`);
    } else {
        updateMoonPhase('new-moon');
        updateZodiacSymbol(person.zodiac.symbol, person);
        updateCurrentFocus(`${person.name} - No connections yet`);
    }
    
    showPersonDetails(person);
    showRelationshipList(relationships, person);
}

function selectPerson(person) {
    // Remove active class from all cards
    document.querySelectorAll('.person-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Add active class to selected card
    document.querySelector(`[data-person-id="${person.id}"]`).classList.add('active');
    
    selectedPerson = person;
    
    if (currentMode === 'birthdays') {
        showPersonBirthday(person);
    } else {
        showPersonConnections(person);
    }
    
    if (currentMode === 'timeline') {
        showPersonTimeline(person);
    }
}

function showPersonDetails(person) {
    const personDetails = document.getElementById('person-details');
    
    personDetails.innerHTML = `
        <h3>Person Details</h3>
        <div class="detail-item">
            <span class="detail-label">Name:</span> ${person.name}
        </div>
        <div class="detail-item">
            <span class="detail-label">Role:</span> ${person.role}
        </div>
        <div class="detail-item">
            <span class="detail-label">Department:</span> ${person.department}
        </div>
        <div class="detail-item">
            <span class="detail-label">Age:</span> ${person.age}
        </div>
        <div class="detail-item">
            <span class="detail-label">Birthday:</span> ${getMonthName(person.birthday.month)} ${person.birthday.day}
        </div>
        
        <div class="zodiac-info">
            <h4>${person.zodiac.sign} ${person.zodiac.symbol}</h4>
            <div class="detail-item">
                <span class="detail-label">Traits:</span> ${person.zodiac.traits.join(', ')}
            </div>
            <p style="margin-top: 10px; font-size: 0.9em; color: #ddd;">
                ${person.zodiac.description}
            </p>
        </div>
    `;
}

function showRelationshipList(relationships, person) {
    const relationshipDetails = document.getElementById('relationship-details');
    
    if (relationships.length === 0) {
        relationshipDetails.innerHTML = `
            <h3>Relationship Details</h3>
            <p class="placeholder">No relationships found for ${person.name}</p>
        `;
        return;
    }
    
    let relationshipHTML = '<h3>Relationship Details</h3><div class="relationship-list">';
    
    relationships.forEach(rel => {
        const otherPerson = rel.source === person.id ? 
            getPersonById(rel.target) : getPersonById(rel.source);
        
        const compatible = areZodiacCompatible(person.zodiac.sign, otherPerson.zodiac.sign);
        
        relationshipHTML += `
            <div class="relationship-card ${rel.relationship}" data-rel-id="${rel.source}-${rel.target}">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: 600; color: #fff; margin-bottom: 4px;">
                            ${otherPerson.name}
                        </div>
                        <div style="font-size: 0.85em; color: #ccc; margin-bottom: 4px;">
                            ${rel.relationship}${rel.course ? ` (${rel.course})` : ''}
                        </div>
                        <div style="font-size: 0.8em; color: #aaa;">
                            Strength: ${Math.round(rel.strength * 100)}% • 
                            Since: ${rel.since}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.2em; margin-bottom: 4px;">
                            ${person.zodiac.symbol} ${otherPerson.zodiac.symbol}
                        </div>
                        <div style="font-size: 0.8em; color: ${compatible ? '#4ecdc4' : '#ff6b6b'};">
                            ${compatible ? '✨ Compatible' : '⚡ Different'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    relationshipHTML += '</div>';
    relationshipDetails.innerHTML = relationshipHTML;
    
    // Add click events to relationship cards
    document.querySelectorAll('.relationship-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const relId = card.dataset.relId;
            const [sourceId, targetId] = relId.split('-');
            const relationship = relationshipData.find(r => 
                (r.source === sourceId && r.target === targetId) || 
                (r.source === targetId && r.target === sourceId)
            );
            
            if (relationship) {
                showRelationshipMoon(relationship);
            }
        });
        
        card.addEventListener('click', () => {
            const relId = card.dataset.relId;
            const [sourceId, targetId] = relId.split('-');
            const relationship = relationshipData.find(r => 
                (r.source === sourceId && r.target === targetId) || 
                (r.source === targetId && r.target === sourceId)
            );
            
            if (relationship) {
                selectRelationship(relationship);
            }
        });
    });
}

function showRelationshipMoon(relationship) {
    const phase = getMoonPhaseFromStrength(relationship.strength);
    updateMoonPhase('relationship-moon');
    mainMoon.classList.add(phase);
    
    const sourcePerson = getPersonById(relationship.source);
    const targetPerson = getPersonById(relationship.target);
    
    updateZodiacSymbol(`${sourcePerson.zodiac.symbol}${targetPerson.zodiac.symbol}`);
    updateCurrentFocus(`${sourcePerson.name} ↔ ${targetPerson.name} (${relationship.relationship})`);
}

function selectRelationship(relationship) {
    selectedRelationship = relationship;
    showRelationshipMoon(relationship);
}

function showPersonTimeline(person) {
    const timelinePanel = document.getElementById('timeline-panel');
    const relationships = getPersonRelationships(person.id);
    
    // Show timeline panel
    timelinePanel.style.display = 'block';
    
    // Create month markers
    const timelineMonths = document.getElementById('timeline-months');
    timelineMonths.innerHTML = '';
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    months.forEach(month => {
        const marker = document.createElement('div');
        marker.className = 'month-marker';
        marker.textContent = month;
        timelineMonths.appendChild(marker);
    });
    
    // Create timeline events
    const timelineEvents = document.getElementById('timeline-events');
    timelineEvents.innerHTML = '';
    
    relationships.forEach(rel => {
        const event = document.createElement('div');
        event.className = `timeline-event ${rel.relationship}`;
        event.style.left = `${(rel.month - 1) / 11 * 100}%`;
        event.style.backgroundColor = getRelationshipColor(rel.relationship);
        
        event.addEventListener('mouseenter', () => {
            showRelationshipMoon(rel);
        });
        
        timelineEvents.appendChild(event);
    });
}

function getRelationshipColor(relationship) {
    const colors = {
        'friends': '#ff6b6b',
        'colleagues': '#4ecdc4',
        'student-teacher': '#45b7d1',
        'study-partners': '#f39c12'
    };
    return colors[relationship] || '#fff';
}

function getMonthName(monthNum) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNum - 1];
}

// ============================================================================
// MODE SWITCHING
// ============================================================================

function switchMode(mode) {
    currentMode = mode;
    
    // Update active button
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    
    // Reset moon
    updateMoonPhase('full-moon');
    updateZodiacSymbol('🌙');
    
    // Show/hide timeline panel
    const timelinePanel = document.getElementById('timeline-panel');
    if (mode === 'timeline') {
        timelinePanel.style.display = 'block';
        updateCurrentFocus('Select a person to see their relationship timeline');
    } else {
        timelinePanel.style.display = 'none';
        if (mode === 'birthdays') {
            updateCurrentFocus('Hover over people to see their birthdays');
        } else {
            updateCurrentFocus('Hover over people to explore their connections');
        }
    }
    
    // Clear selections
    selectedPerson = null;
    selectedRelationship = null;
    document.querySelectorAll('.person-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Reset details panels
    document.getElementById('person-details').innerHTML = `
        <h3>Person Details</h3>
        <p class="placeholder">Select a person to see details</p>
    `;
    
    document.getElementById('relationship-details').innerHTML = `
        <h3>Relationship Details</h3>
        <p class="placeholder">Select a person to see their relationships</p>
    `;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function init() {
    // Get DOM elements
    mainMoon = document.getElementById('main-moon');
    zodiacSymbol = document.getElementById('moon-zodiac');
    phaseIndicator = document.getElementById('phase-indicator');
    currentFocus = document.getElementById('current-focus');
    
    // Setup event listeners
    setupEventListeners();
    
    // Create initial display
    createPersonGrid();
    
    // Set initial moon state
    updateMoonPhase('full-moon');
    updateZodiacSymbol('🌙');
    updateCurrentFocus('Hover over people to explore their connections');
}

function setupEventListeners() {
    // Year selector
    document.getElementById('year-select').addEventListener('change', function() {
        currentYear = parseInt(this.value);
        // Refresh data based on new year
        createPersonGrid();
    });
    
    // Mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchMode(this.dataset.mode);
        });
    });
    
    // Main moon click
    mainMoon.addEventListener('click', function() {
        // Reset to default state
        updateMoonPhase('full-moon');
        updateZodiacSymbol('🌙');
        updateCurrentFocus('Click on people to explore their connections');
        
        selectedPerson = null;
        selectedRelationship = null;
        document.querySelectorAll('.person-card').forEach(card => {
            card.classList.remove('active');
        });
    });
}

// Start the application
document.addEventListener('DOMContentLoaded', init);