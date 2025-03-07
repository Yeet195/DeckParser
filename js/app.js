// Yu-Gi-Oh! Deck Viewer - Web Version
// Main JavaScript functionality

// Global deck object
let deck = null;
let cardDetailsCache = {};

// Utility functions
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

function showCardPreview(card) {
    const previewElement = document.getElementById('cardPreview');
    const imageElement = document.getElementById('previewImage');
    const nameElement = document.getElementById('previewName');
    const infoElement = document.getElementById('previewInfo');

    // Set image and name
    imageElement.src = card.image_url || 'https://images.ygoprodeck.com/images/cards/back_high.jpg';
    nameElement.textContent = card.name || 'Unknown Card';

    // Clear previous info
    infoElement.innerHTML = '';

    // Add card details
    if (card.type) {
        addInfoRow(infoElement, 'Type', card.type);
    }

    if (card.race) {
        addInfoRow(infoElement, 'Race', card.race);
    }

    if (card.attribute) {
        addInfoRow(infoElement, 'Attribute', card.attribute);
    }

    if (card.level) {
        addInfoRow(infoElement, 'Level/Rank', card.level);
    }

    if (card.atk !== undefined) {
        addInfoRow(infoElement, 'ATK', card.atk);
    }

    if (card.def !== undefined) {
        addInfoRow(infoElement, 'DEF', card.def);
    }

    if (card.desc) {
        const descRow = document.createElement('div');
        descRow.className = 'mt-4';
        descRow.innerHTML = `
            <h3 class="font-bold text-primary">Description</h3>
            <p class="mt-1 text-gray-300">${card.desc}</p>
        `;
        infoElement.appendChild(descRow);
    }

    // Show the preview
    previewElement.classList.remove('hidden');
}

function closeCardPreview() {
    document.getElementById('cardPreview').classList.add('hidden');
}

function addInfoRow(container, label, value) {
    const row = document.createElement('div');
    row.className = 'flex justify-between border-b border-gray-700 py-1';
    row.innerHTML = `
        <span class="font-medium">${label}:</span>
        <span>${value}</span>
    `;
    container.appendChild(row);
}

function showImportForm() {
    document.getElementById('importFormContainer').classList.remove('hidden');
    document.getElementById('noDeckMessage').classList.add('hidden');
}

function hideImportForm() {
    document.getElementById('importFormContainer').classList.add('hidden');
    if (!document.getElementById('deckContent').classList.contains('hidden')) {
        document.getElementById('noDeckMessage').classList.add('hidden');
    } else {
        document.getElementById('noDeckMessage').classList.remove('hidden');
    }
}

// Rendering functions
function renderCardSection(elementId, cards) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card-container relative';

        // Card count badge for multiple copies
        let countBadge = '';
        if (card.count > 1) {
            countBadge = `<div class="absolute top-0 right-0 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center font-bold z-10">
                ${card.count}
            </div>`;
        }

        cardElement.innerHTML = `
            ${countBadge}
            <img src="${card.image_url || 'https://images.ygoprodeck.com/images/cards/back_high.jpg'}"
                alt="${card.name}"
                class="rounded-lg shadow-lg w-full hover:shadow-xl cursor-pointer"
                onerror="this.src='https://images.ygoprodeck.com/images/cards/back_high.jpg'"
                data-card-id="${card.id}">
        `;

        const imgElement = cardElement.querySelector('img');
        imgElement.addEventListener('click', () => showCardPreview(card));

        container.appendChild(cardElement);
    });
}

function renderDeckStats(stats) {
    const statsContainer = document.getElementById('deckStats');
    statsContainer.innerHTML = '';

    // Card Count Summary
    const countSummary = document.createElement('div');
    countSummary.className = 'bg-gray-800 rounded-lg p-3';
    countSummary.innerHTML = `
        <h3 class="font-bold mb-2">Card Count</h3>
        <div class="grid grid-cols-3 gap-2 text-center">
            <div class="bg-gray-700 rounded p-2">
                <div class="text-blue-400 font-bold">${stats.main_deck}</div>
                <div class="text-xs">Main</div>
            </div>
            <div class="bg-gray-700 rounded p-2">
                <div class="text-purple-400 font-bold">${stats.extra_deck}</div>
                <div class="text-xs">Extra</div>
            </div>
            <div class="bg-gray-700 rounded p-2">
                <div class="text-green-400 font-bold">${stats.side_deck}</div>
                <div class="text-xs">Side</div>
            </div>
        </div>
    `;
    statsContainer.appendChild(countSummary);

    // Card Types Distribution
    if (stats.card_types && Object.keys(stats.card_types).length > 0) {
        const cardTypes = document.createElement('div');
        cardTypes.className = 'bg-gray-800 rounded-lg p-3';

        let cardTypesHTML = '<h3 class="font-bold mb-2">Card Types</h3><div class="space-y-1">';

        const colors = {
            'Normal Monster': '#f9ca24',
            'Effect Monster': '#e17055',
            'Fusion Monster': '#6c5ce7',
            'Ritual Monster': '#0984e3',
            'Synchro Monster': '#dfe6e9',
            'Xyz Monster': '#2d3436',
            'Pendulum Monster': '#00b894',
            'Link Monster': '#00cec9',
            'Spell Card': '#00b894',
            'Trap Card': '#d63031'
        };

        for (const [type, count] of Object.entries(stats.card_types)) {
            const color = colors[type] || '#636e72';
            cardTypesHTML += `
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <span class="stat-circle" style="background-color: ${color}"></span>
                        ${type}
                    </div>
                    <span class="font-bold">${count}</span>
                </div>
            `;
        }

        cardTypesHTML += '</div>';
        cardTypes.innerHTML = cardTypesHTML;
        statsContainer.appendChild(cardTypes);
    }

    // Attributes Distribution
    if (stats.attributes && Object.keys(stats.attributes).length > 0) {
        const attributes = document.createElement('div');
        attributes.className = 'bg-gray-800 rounded-lg p-3';

        let attributesHTML = '<h3 class="font-bold mb-2">Attributes</h3><div class="space-y-1">';

        const colors = {
            'DARK': '#2d3436',
            'LIGHT': '#fdcb6e',
            'EARTH': '#b33939',
            'WATER': '#0984e3',
            'FIRE': '#e17055',
            'WIND': '#00b894',
            'DIVINE': '#e84393'
        };

        for (const [attr, count] of Object.entries(stats.attributes)) {
            const color = colors[attr] || '#636e72';
            attributesHTML += `
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <span class="stat-circle" style="background-color: ${color}"></span>
                        ${attr}
                    </div>
                    <span class="font-bold">${count}</span>
                </div>
            `;
        }

        attributesHTML += '</div>';
        attributes.innerHTML = attributesHTML;
        statsContainer.appendChild(attributes);
    }

    // Monster Types Distribution
    if (stats.monster_types && Object.keys(stats.monster_types).length > 0) {
        const monsterTypes = document.createElement('div');
        monsterTypes.className = 'bg-gray-800 rounded-lg p-3';

        let monsterTypesHTML = '<h3 class="font-bold mb-2">Monster Types</h3><div class="space-y-1">';

        for (const [type, count] of Object.entries(stats.monster_types)) {
            monsterTypesHTML += `
                <div class="flex items-center justify-between">
                    <div>${type}</div>
                    <span class="font-bold">${count}</span>
                </div>
            `;
        }

        monsterTypesHTML += '</div>';
        monsterTypes.innerHTML = monsterTypesHTML;
        statsContainer.appendChild(monsterTypes);
    }

    // Levels/Ranks Distribution
    if (stats.levels && Object.keys(stats.levels).length > 0) {
        const levels = document.createElement('div');
        levels.className = 'bg-gray-800 rounded-lg p-3';

        let levelsHTML = '<h3 class="font-bold mb-2">Levels/Ranks</h3><div class="grid grid-cols-4 gap-2 text-center">';

        for (let i = 1; i <= 12; i++) {
            const count = stats.levels[i] || 0;
            const opacity = count > 0 ? 1 : 0.3;

            levelsHTML += `
                <div class="bg-gray-700 rounded p-1" style="opacity: ${opacity}">
                    <div class="font-bold">${count}</div>
                    <div class="text-xs">★${i}</div>
                </div>
            `;
        }

        levelsHTML += '</div>';
        levels.innerHTML = levelsHTML;
        statsContainer.appendChild(levels);
    }
}

function renderDeck(processedDeck, stats) {
    // Update card counts
    document.getElementById('mainCount').textContent = `(${stats.main_deck} cards)`;
    document.getElementById('extraCount').textContent = `(${stats.extra_deck} cards)`;
    document.getElementById('sideCount').textContent = `(${stats.side_deck} cards)`;

    // Render each section
    renderCardSection('mainDeck', processedDeck.main);
    renderCardSection('extraDeck', processedDeck.extra);
    renderCardSection('sideDeck', processedDeck.side);

    // Render stats
    renderDeckStats(stats);
}

// Card API functions
async function fetchCardDetails(cardId) {
    // Check cache first
    if (cardDetailsCache[cardId]) {
        return cardDetailsCache[cardId];
    }

    try {
        const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${cardId}`);
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.data && data.data.length > 0) {
                const cardData = data.data[0];
                
                let imageUrl = null;
                if (cardData.card_images && cardData.card_images.length > 0) {
                    if (cardData.card_images[0].image_url_cropped) {
                        imageUrl = cardData.card_images[0].image_url_cropped;
                    } else if (cardData.card_images[0].image_url) {
                        imageUrl = cardData.card_images[0].image_url;
                    }
                }
                
                // Create a simplified card object
                const card = {
                    id: cardId,
                    name: cardData.name || 'Unknown',
                    type: cardData.type || 'Unknown',
                    desc: cardData.desc || '',
                    image_url: imageUrl
                };
                
                // Add monster-specific attributes if applicable
                if (card.type.includes('Monster')) {
                    card.atk = cardData.atk;
                    card.def = cardData.def;
                    card.level = cardData.level || cardData.rank || cardData.linkval;
                    card.attribute = cardData.attribute || '';
                    card.race = cardData.race || '';
                }
                
                // Cache and return the card
                cardDetailsCache[cardId] = card;
                return card;
            }
        }
        
        // Return a placeholder if API fails or card not found
        return {
            id: cardId,
            name: `Card #${cardId}`,
            type: 'Unknown',
            desc: 'Card data not available',
            image_url: null
        };
    } catch (error) {
        console.error(`Error fetching card ${cardId}:`, error);
        
        // Return a placeholder for error
        return {
            id: cardId,
            name: `Card #${cardId}`,
            type: 'Error',
            desc: `Failed to fetch card data: ${error.message}`,
            image_url: null
        };
    }
}

// Deck loading and processing functions
async function loadYdkFromFile(file) {
    showLoading();
    try {
        const content = await file.text();
        deck = parseYdkContent(content);
        
        // Validate deck structure
        if (!deck.main.length && !deck.extra.length && !deck.side.length) {
            alert("No valid cards found in the deck file.");
            hideLoading();
            return;
        }
        
        await loadDeckInfo();
    } catch (error) {
        console.error("Error loading YDK file:", error);
        alert(`Error loading deck file: ${error.message}`);
    }
    hideLoading();
}

function parseYdkContent(content) {
    const lines = content.split('\n');
    const deck = { main: [], extra: [], side: [] };
    let currentSection = null;

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        // Handle section markers
        if (trimmedLine.startsWith('#')) {
            if (trimmedLine === '#main') {
                currentSection = 'main';
                continue;
            } else if (trimmedLine === '#extra') {
                currentSection = 'extra';
                continue;
            } else {
                // Skip other comment lines
                continue;
            }
        }
        
        if (trimmedLine === '!side') {
            currentSection = 'side';
            continue;
        }
        
        if (!currentSection) continue;
        
        // Try to parse the card ID
        const cardId = parseInt(trimmedLine, 10);
        if (!isNaN(cardId)) {
            deck[currentSection].push(cardId);
        }
    }
    
    console.log(`Parsed YDK content: ${deck.main.length} main, ${deck.extra.length} extra, ${deck.side.length} side cards`);
    return deck;
}

async function loadYdkeUrl(ydkeUrl) {
    showLoading();
    try {
        if (!ydkeUrl.startsWith('ydke://')) {
            throw new Error("Invalid YDKE URL format");
        }

        const components = ydkeUrl.substring('ydke://'.length).split('!');
        if (components.length < 3) {
            throw new Error("Missing YDKE URL components");
        }

        deck = {
            main: base64ToPasscodes(components[0]),
            extra: base64ToPasscodes(components[1]),
            side: base64ToPasscodes(components[2])
        };

        await loadDeckInfo();
    } catch (error) {
        console.error("Error loading YDKE URL:", error);
        alert(`Error loading YDKE URL: ${error.message}`);
    }
    hideLoading();
}

function base64ToPasscodes(base64String) {
    try {
        // Decode base64 string to binary
        const binary = atob(base64String);
        
        // Convert binary to Uint8Array for binary operations
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        
        // Read 4-byte integers (passcodes)
        const passcodes = [];
        for (let i = 0; i < bytes.length; i += 4) {
            if (i + 4 <= bytes.length) {
                // Little-endian byte order
                const passcode = 
                    bytes[i] | 
                    (bytes[i + 1] << 8) | 
                    (bytes[i + 2] << 16) | 
                    (bytes[i + 3] << 24);
                passcodes.push(passcode >>> 0); // Convert to unsigned 32-bit integer
            }
        }
        
        return passcodes;
    } catch (error) {
        console.error('Error decoding base64:', error);
        return [];
    }
}

async function loadOmegaFormat(encodedData) {
    showLoading();
    try {
        alert("Omega format import is not currently implemented in the web version.");
        // Implementing Omega format in JavaScript would require additional libraries for zlib decompression
        hideLoading();
    } catch (error) {
        console.error("Error loading Omega format:", error);
        alert(`Error loading Omega format: ${error.message}`);
        hideLoading();
    }
}

async function loadDeckInfo() {
    if (!deck) {
        return { status: "error", message: "No deck loaded" };
    }

    showLoading();
    try {
        // Process deck sections
        const processedDeck = { main: [], extra: [], side: [] };
        
        // Calculate basic stats
        const stats = {
            main_deck: deck.main.length,
            extra_deck: deck.extra.length,
            side_deck: deck.side.length,
            card_types: {},
            attributes: {},
            monster_types: {},
            levels: {}
        };

        // Process each section
        for (const section of ['main', 'extra', 'side']) {
            // Count unique cards
            const cardCounts = {};
            for (const cardId of deck[section]) {
                cardCounts[cardId] = (cardCounts[cardId] || 0) + 1;
            }

            // Process each unique card
            for (const [cardId, count] of Object.entries(cardCounts)) {
                const cardDetail = await fetchCardDetails(parseInt(cardId));
                cardDetail.count = count;
                processedDeck[section].push(cardDetail);

                // Collect statistics
                if (cardDetail.type) {
                    stats.card_types[cardDetail.type] = (stats.card_types[cardDetail.type] || 0) + 1;
                }

                if (cardDetail.type.includes('Monster')) {
                    if (cardDetail.attribute) {
                        stats.attributes[cardDetail.attribute] = (stats.attributes[cardDetail.attribute] || 0) + 1;
                    }
                    
                    if (cardDetail.race) {
                        stats.monster_types[cardDetail.race] = (stats.monster_types[cardDetail.race] || 0) + 1;
                    }
                    
                    if (cardDetail.level) {
                        stats.levels[cardDetail.level] = (stats.levels[cardDetail.level] || 0) + 1;
                    }
                }
            }
        }

        // Show the deck
        document.getElementById('noDeckMessage').classList.add('hidden');
        document.getElementById('deckContent').classList.remove('hidden');
        
        renderDeck(processedDeck, stats);
    } catch (error) {
        console.error("Error loading deck info:", error);
        alert(`Error loading deck info: ${error.message}`);
    }
    hideLoading();
}

async function copyCardmarketWantsList() {
    showLoading();
    try {
        if (!deck) {
            alert('No deck loaded');
            hideLoading();
            return;
        }

        // Generate the wants list content
        let contentParts = [];
        
        // Process main deck
        if (deck.main.length > 0) {
            contentParts.push('');
            const mainCounts = {};
            for (const cardId of deck.main) {
                mainCounts[cardId] = (mainCounts[cardId] || 0) + 1;
            }
            
            for (const [cardId, count] of Object.entries(mainCounts)) {
                const card = await fetchCardDetails(parseInt(cardId));
                contentParts.push(`${count}x ${card.name}`);
            }
            contentParts.push(''); // Empty line
        }
        
        // Process extra deck
        if (deck.extra.length > 0) {
            contentParts.push('');
            const extraCounts = {};
            for (const cardId of deck.extra) {
                extraCounts[cardId] = (extraCounts[cardId] || 0) + 1;
            }
            
            for (const [cardId, count] of Object.entries(extraCounts)) {
                const card = await fetchCardDetails(parseInt(cardId));
                contentParts.push(`${count}x ${card.name}`);
            }
            contentParts.push(''); // Empty line
        }
        
        // Process side deck
        if (deck.side.length > 0) {
            contentParts.push('');
            const sideCounts = {};
            for (const cardId of deck.side) {
                sideCounts[cardId] = (sideCounts[cardId] || 0) + 1;
            }
            
            for (const [cardId, count] of Object.entries(sideCounts)) {
                const card = await fetchCardDetails(parseInt(cardId));
                contentParts.push(`${count}x ${card.name}`);
            }
        }

        const content = contentParts.join('\n');
        
        // Copy to clipboard
        await navigator.clipboard.writeText(content);
        alert('CardMarket wants list copied to clipboard!');
    } catch (error) {
        console.error("Error copying CardMarket wants list:", error);
        alert(`Error copying CardMarket wants list: ${error.message}`);
    }
    hideLoading();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing...");

    // Setup file inputs for YDK files
    document.getElementById('ydkFileInput').addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            loadYdkFromFile(e.target.files[0]);
        }
    });
    
    document.getElementById('ydkFileInputAlt').addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            loadYdkFromFile(e.target.files[0]);
        }
    });

    // Setup open buttons (they trigger file input clicks)
    document.getElementById('openYDKBtn').addEventListener('click', () => {
        document.getElementById('ydkFileInput').click();
    });
    
    document.getElementById('openYDKBtnAlt').addEventListener('click', () => {
        document.getElementById('ydkFileInputAlt').click();
    });

    // Setup import form related buttons
    document.getElementById('showImportFormBtn').addEventListener('click', showImportForm);
    document.getElementById('showImportFormBtnAlt').addEventListener('click', showImportForm);
    document.getElementById('closeImportBtn').addEventListener('click', hideImportForm);
    
    // Setup import button
    document.getElementById('importDeckBtn').addEventListener('click', async () => {
        const importText = document.getElementById('importText').value.trim();
        const format = document.querySelector('input[name="importFormat"]:checked').value;
        
        if (!importText) {
            alert('Please enter data to import');
            return;
        }
        
        if (format === 'ydke') {
            await loadYdkeUrl(importText);
            hideImportForm();
        } else if (format === 'omega') {
            await loadOmegaFormat(importText);
            hideImportForm();
        }
    });
    
    // Setup copy button
    document.getElementById('downloadCardmarketBtn').addEventListener('click', copyCardmarketWantsList);

    console.log('Event listeners initialized successfully');
});