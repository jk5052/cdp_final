// Moon Phase Academic Relationships Timeline
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
        }
    },
    {
        id: "Bob", name: "Bob Smith", role: "professor", age: 45,
        department: "Mathematics", birthday: {month: 7, day: 23},
        zodiac: { 
            sign: "Leo", symbol: "♌", 
            traits: ["Leadership", "Confident", "Generous", "Dramatic"], 
            description: "Leos are natural leaders who inspire others. Their confidence and generosity make them excellent mentors."
        }
    },
    {
        id: "Carol", name: "Carol Davis", role: "student", age: 20,
        department: "Physics", birthday: {month: 11, day: 8},
        zodiac: { 
            sign: "Scorpio", symbol: "♏", 
            traits: ["Intense", "Passionate", "Mysterious", "Determined"], 
            description: "Scorpios are deeply passionate and determined individuals who form strong, lasting relationships."
        }
    },
    {
        id: "David", name: "David Wilson", role: "professor", age: 38,
        department: "Computer Science", birthday: {month: 5, day: 12},
        zodiac: { 
            sign: "Taurus", symbol: "♉", 
            traits: ["Reliable", "Practical", "Stubborn", "Loyal"], 
            description: "Taurus individuals are known for their reliability and practical approach to problem-solving."
        }
    },
    {
        id: "Eve", name: "Eve Brown", role: "student", age: 21,
        department: "Mathematics", birthday: {month: 9, day: 2},
        zodiac: { 
            sign: "Virgo", symbol: "♍", 
            traits: ["Analytical", "Perfectionist", "Helpful", "Organized"], 
            description: "Virgos excel in analytical thinking and have a natural desire to help others succeed."
        }
    },
    {
        id: "Frank", name: "Frank Miller", role: "student", age: 23,
        department: "Physics", birthday: {month: 1, day: 20},
        zodiac: { 
            sign: "Aquarius", symbol: "♒", 
            traits: ["Innovative", "Independent", "Humanitarian", "Eccentric"], 
            description: "Aquarians are forward-thinking innovators who value independence and humanitarian causes."
        }
    },
    {
        id: "Grace", name: "Grace Lee", role: "student", age: 22,
        department: "Literature", birthday: {month: 6, day: 18},
        zodiac: { 
            sign: "Gemini", symbol: "♊", 
            traits: ["Curious", "Adaptable", "Communicative", "Witty"], 
            description: "Geminis are excellent communicators with insatiable curiosity and adaptability."
        }
    },
    {
        id: "Henry", name: "Henry Clark", role: "professor", age: 42,
        department: "Literature", birthday: {month: 12, day: 25},
        zodiac: { 
            sign: "Capricorn", symbol: "♑", 
            traits: ["Ambitious", "Disciplined", "Responsible", "Traditional"], 
            description: "Capricorns are ambitious and disciplined leaders who value tradition and responsibility."
        }
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
    {source: "Frank", target: "Eve", relationship: "study-partners", since: 2025, strength: 0.7, month: 12, day: 15},
    {source: "Alice", target: "Frank", relationship: "friends", since: 2025, strength: 0.5, month: 1, day: 28},
    {source: "Bob", target: "Henry", relationship: "colleagues", since: 2025, strength: 0.6, month: 2, day: 14},
    {source: "Carol", target: "Grace", relationship: "friends", since: 2025, strength: 0.9, month: 3, day: 21},
    {source: "David", target: "Eve", relationship: "colleagues", since: 2025, strength: 0.8, month: 4, day: 10},
    {source: "Frank", target: "Grace", relationship: "study-partners", since: 2025, strength: 0.6, month: 6, day: 30},
    {source: "Alice", target: "Henry", relationship: "study-partners", since: 2025, strength: 0.5, month: 9, day: 25}
];

// ============================================================================
// CONFIGURATION
// ============================================================================

const config = {
    months: ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
             'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'],
    daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    zodiacCompatibility: {
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
    }
};

// ============================================================================
// GLOBAL VARIABLES
// ============================================================================

let currentYear = 2025;
let currentFilter = 'all';
let tooltip = null;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Calculate moon phase based on relationship strength
function getRelationshipMoonPhase(strength) {
    if (strength < 0.2) return 'new-moon';
    if (strength < 0.4) return 'waxing-crescent';
    if (strength < 0.6) return 'first-quarter';
    if (strength < 0.8) return 'waxing-gibbous';
    return 'full-moon';
}

// Calculate day of year
function getDayOfYear(month, day) {
    let dayOfYear = 0;
    for (let i = 0; i < month - 1; i++) {
        dayOfYear += config.daysInMonth[i];
    }
    return dayOfYear + day;
}

// Calculate basic moon phase for day (cyclical)
function getBasicMoonPhase(dayOfYear) {
    const cycle = (dayOfYear % 29.5) / 29.5; // Lunar cycle is ~29.5 days
    
    if (cycle < 0.125) return 'new-moon';
    if (cycle < 0.25) return 'waxing-crescent';
    if (cycle < 0.375) return 'first-quarter';
    if (cycle < 0.5) return 'waxing-gibbous';
    if (cycle < 0.625) return 'full-moon';
    if (cycle < 0.75) return 'waning-gibbous';
    if (cycle < 0.875) return 'last-quarter';
    return 'waning-crescent';
}

// Check zodiac compatibility
function areZodiacCompatible(sign1, sign2) {
    return config.zodiacCompatibility[sign1] && config.zodiacCompatibility[sign1].includes(sign2);
}

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

// Initialize the application
function init() {
    tooltip = document.getElementById('tooltip');
    setupEventListeners();
    createCalendar();
}

// Setup event listeners
function setupEventListeners() {
    // Year input
    document.getElementById('year-input').addEventListener('input', function() {
        currentYear = parseInt(this.value);
        createCalendar();
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            createCalendar();
        });
    });
}

// Create the main calendar
function createCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    // Filter data based on current year and filter
    const filteredRelationships = relationshipData.filter(rel => {
        const yearMatch = rel.since === currentYear;
        const typeMatch = currentFilter === 'all' || rel.relationship === currentFilter;
        return yearMatch && typeMatch;
    });

    const filteredBirthdays = currentFilter === 'all' || currentFilter === 'birthdays' ? peopleData : [];

    config.months.forEach((month, monthIndex) => {
        createMonthRow(month, monthIndex, filteredRelationships, filteredBirthdays);
    });

    updateStatistics(filteredRelationships, filteredBirthdays);
}

// Create a single month row
function createMonthRow(month, monthIndex, relationships, birthdays) {
    const monthRow = document.createElement('div');
    monthRow.className = 'month-row';

    // Month label
    const monthLabel = document.createElement('div');
    monthLabel.className = 'month-label';
    monthLabel.textContent = month;

    // Days container
    const daysContainer = document.createElement('div');
    daysContainer.className = 'days-container';

    const daysInCurrentMonth = config.daysInMonth[monthIndex];

    // Create each day
    for (let day = 1; day <= daysInCurrentMonth; day++) {
        const dayContainer = createDayContainer(day, monthIndex + 1, relationships, birthdays);
        daysContainer.appendChild(dayContainer);
    }

    monthRow.appendChild(monthLabel);
    monthRow.appendChild(daysContainer);
    document.getElementById('calendar').appendChild(monthRow);
}

// Create individual day container with moon phase
function createDayContainer(day, month, relationships, birthdays) {
    const dayContainer = document.createElement('div');
    dayContainer.className = 'moon-phase-container';

    // Find events for this day
    const dayRelationships = relationships.filter(rel => rel.month === month && rel.day === day);
    const dayBirthdays = birthdays.filter(person => person.birthday.month === month && person.birthday.day === day);

    // Create moon phase element
    const moonPhase = document.createElement('div');
    moonPhase.className = 'moon-phase';

    // Determine moon phase and styling
    let moonPhaseClass = 'new-moon';
    let hasBirthday = dayBirthdays.length > 0;
    let hasRelationship = dayRelationships.length > 0;

    if (hasBirthday) {
        moonPhase.classList.add('has-birthday');
        // Add zodiac symbol for birthday
        if (dayBirthdays[0]) {
            const zodiacSymbol = document.createElement('div');
            zodiacSymbol.className = 'zodiac-symbol';
            zodiacSymbol.textContent = dayBirthdays[0].zodiac.symbol;
            moonPhase.appendChild(zodiacSymbol);
        }
    } else if (hasRelationship) {
        // Use relationship strength to determine moon phase
        const avgStrength = dayRelationships.reduce((sum, rel) => sum + rel.strength, 0) / dayRelationships.length;
        moonPhaseClass = getRelationshipMoonPhase(avgStrength);
        
        // Add relationship indicator
        const relationshipIndicator = document.createElement('div');
        relationshipIndicator.className = `relationship-indicator relationship-${dayRelationships[0].relationship}`;
        moonPhase.appendChild(relationshipIndicator);
    } else {
        // Default moon phase based on day of year
        const dayOfYear = getDayOfYear(month, day);
        moonPhaseClass = getBasicMoonPhase(dayOfYear);
    }

    // Create moon lit portion
    if (!hasBirthday) {
        const moonLit = document.createElement('div');
        moonLit.className = `moon-lit ${moonPhaseClass}`;
        moonPhase.appendChild(moonLit);
    }

    // Add day number
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;

    // Add event listeners
    moonPhase.addEventListener('mouseenter', (e) => showTooltip(e, day, month, dayRelationships, dayBirthdays));
    moonPhase.addEventListener('mouseleave', hideTooltip);
    moonPhase.addEventListener('click', () => showPersonDetails(dayRelationships, dayBirthdays));

    dayContainer.appendChild(moonPhase);
    dayContainer.appendChild(dayNumber);

    return dayContainer;
}

// Show tooltip on hover
function showTooltip(event, day, month, relationships, birthdays) {
    let content = `<div class="tooltip-title">${config.months[month - 1]} ${day}, ${currentYear}</div>`;
    
    if (birthdays.length > 0) {
        content += '<div class="tooltip-content">';
        birthdays.forEach(person => {
            content += `🎂 <strong>${person.name}</strong> (${person.zodiac.sign} ${person.zodiac.symbol})<br>`;
            content += `${person.role} - ${person.department}<br>`;
        });
        content += '</div>';
    }

    if (relationships.length > 0) {
        content += '<div class="tooltip-content">';
        relationships.forEach(rel => {
            const sourcePerson = peopleData.find(p => p.id === rel.source);
            const targetPerson = peopleData.find(p => p.id === rel.target);
            content += `🔗 <strong>${sourcePerson.name}</strong> ↔ <strong>${targetPerson.name}</strong><br>`;
            content += `${rel.relationship} (${Math.round(rel.strength * 100)}% strength)<br>`;
            if (rel.course) content += `Course: ${rel.course}<br>`;
        });
        content += '</div>';
    }

    if (relationships.length === 0 && birthdays.length === 0) {
        content += '<div class="tooltip-content">No events on this day</div>';
    }

    tooltip.innerHTML = content;
    tooltip.style.opacity = '1';
    tooltip.style.left = (event.pageX + 10) + 'px';
    tooltip.style.top = (event.pageY - 10) + 'px';
}

// Hide tooltip
function hideTooltip() {
    tooltip.style.opacity = '0';
}

// Show person details in info panel
function showPersonDetails(relationships, birthdays) {
    const infoPanel = document.getElementById('personInfo');
    let content = '';

    if (birthdays.length > 0) {
        const person = birthdays[0];
        content += `
            <div class="person-name">${person.name}</div>
            <p><strong>Role:</strong> ${person.role}</p>
            <p><strong>Department:</strong> ${person.department}</p>
            <p><strong>Age:</strong> ${person.age}</p>
            <p><strong>Birthday:</strong> ${config.months[person.birthday.month - 1]} ${person.birthday.day}</p>
            
            <div class="zodiac-info">
                <h4>${person.zodiac.sign} ${person.zodiac.symbol}</h4>
                <p><strong>Traits:</strong> ${person.zodiac.traits.join(', ')}</p>
                <div class="zodiac-traits">${person.zodiac.description}</div>
            </div>
        `;
    } else if (relationships.length > 0) {
        const rel = relationships[0];
        const sourcePerson = peopleData.find(p => p.id === rel.source);
        const targetPerson = peopleData.find(p => p.id === rel.target);
        
        content += `
            <div class="person-name">Relationship: ${sourcePerson.name} ↔ ${targetPerson.name}</div>
            <p><strong>Type:</strong> ${rel.relationship}</p>
            <p><strong>Strength:</strong> ${Math.round(rel.strength * 100)}%</p>
            ${rel.course ? `<p><strong>Course:</strong> ${rel.course}</p>` : ''}
            <p><strong>Since:</strong> ${rel.since}</p>
            
            <div class="zodiac-info">
                <h4>Zodiac Compatibility</h4>
                <p>${sourcePerson.zodiac.sign} ${sourcePerson.zodiac.symbol} + ${targetPerson.zodiac.sign} ${targetPerson.zodiac.symbol}</p>
                <div class="zodiac-traits">
                    ${areZodiacCompatible(sourcePerson.zodiac.sign, targetPerson.zodiac.sign) ? 
                        '✨ Compatible signs! Natural harmony in this relationship.' : 
                        '⚡ Different energies - can create interesting dynamics and growth opportunities.'}
                </div>
            </div>
        `;
    }

    infoPanel.innerHTML = content;
}

// Update statistics
function updateStatistics(relationships, birthdays) {
    const totalConnections = relationships.length;
    const birthdayCount = birthdays.length;
    
    // Calculate most active month
    const monthCounts = {};
    relationships.forEach(rel => {
        monthCounts[rel.month] = (monthCounts[rel.month] || 0) + 1;
    });
    
    let mostActiveMonth = '-';
    let maxCount = 0;
    Object.keys(monthCounts).forEach(month => {
        if (monthCounts[month] > maxCount) {
            maxCount = monthCounts[month];
            mostActiveMonth = config.months[month - 1].slice(0, 3);
        }
    });
    
    // Calculate zodiac compatibility matches
    let compatiblePairs = 0;
    relationships.forEach(rel => {
        const sourcePerson = peopleData.find(p => p.id === rel.source);
        const targetPerson = peopleData.find(p => p.id === rel.target);
        if (sourcePerson && targetPerson) {
            if (areZodiacCompatible(sourcePerson.zodiac.sign, targetPerson.zodiac.sign)) {
                compatiblePairs++;
            }
        }
    });
    
    // Update UI
    document.getElementById('totalConnections').textContent = totalConnections;
    document.getElementById('birthdayCount').textContent = birthdayCount;
    document.getElementById('strongestMonth').textContent = mostActiveMonth;
    document.getElementById('zodiacMatches').textContent = compatiblePairs;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);