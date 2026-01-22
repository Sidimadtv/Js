const m3uUrlInput = document.getElementById('m3u-url');
const m3uFileInput = document.getElementById('m3u-file');
const serverInput = document.getElementById('server');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const categoriesDiv = document.getElementById('categories');
const channelsDiv = document.getElementById('channels');
const channelsSearch = document.getElementById('channels-search');
const epgDiv = document.getElementById('epg');
const epgContainer = document.getElementById('epg-container');
const videoPlayer = document.getElementById('video-player');
const loginSection = document.getElementById('login-section');
const mainSection = document.getElementById('main-section');
const videoModal = new bootstrap.Modal(document.getElementById('videoModal'), { backdrop: 'static', keyboard: false });
const settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
const categoriesSection = document.getElementById('categories-section');
const channelsSection = document.getElementById('channels-section');
const backButton = document.getElementById('back-to-categories');
const logoutBtn = document.getElementById('logout-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const errorToast = new bootstrap.Toast(document.getElementById('error-toast'));
const playerNotification = document.getElementById('player-notification');
const totalChannelsSpan = document.getElementById('total-channels');
const activeChannelsSpan = document.getElementById('active-channels');
const offlineChannelsSpan = document.getElementById('offline-channels');
const languageSelect = document.getElementById('language-select');
const layoutSelect = document.getElementById('layout-select');
const cardSizeInput = document.getElementById('card-size');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const themeSelect = document.getElementById('theme-select');
const parentalToggle = document.getElementById('parental-toggle');
const restrictedCategoriesInput = document.getElementById('restricted-categories');

let baseUrl = '';
let username = '';
let password = '';
let currentHls = null;
let playlist = [];
let originalPlaylist = [];
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
let viewingHistory = JSON.parse(localStorage.getItem('viewingHistory') || '[]');
let watchLater = JSON.parse(localStorage.getItem('watchLater') || '[]');
let currentLanguage = localStorage.getItem('language') || 'en';
let isInitialCheckDone = false;
const STATUS_CHECK_INTERVAL = 10000;
const BATCH_SIZE = 50;
let currentFilter = 'all';
let userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
let currentUser = null;
let theme = localStorage.getItem('theme') || 'default';

const translations = {
    en: {
        'login-title': 'Login',
        'url-tab': 'URL',
        'file-tab': 'File',
        'login-m3u': 'Login with M3U URL',
        'login-file': 'Login with File',
        'login-api': 'Login',
        'back-categories': '← Back to Categories',
        'logout': 'Logout',
        'search-placeholder': 'Search channels...',
        'total': 'Total:',
        'active': 'Active:',
        'offline': 'Offline:',
        'epg-title': 'EPG (Electronic Program Guide)',
        'close': 'Close',
        'dark-mode': 'Toggle Dark Mode',
        'settings': 'Settings',
        'settings-title': 'Settings',
        'layout': 'Layout:',
        'grid': 'Grid',
        'list': 'List',
        'card-size': 'Card Size:',
        'subtitles': 'Subtitles',
        'error': 'Error',
        'favorite': 'Favorite',
        'recommendations': 'Recommendations',
        'watch-later': 'Watch Later',
        'share': 'Share',
        'favorites-btn': 'Favorites',
        'watch-later-btn': 'Watch Later'
    },
    es: {
        'login-title': 'Iniciar Sesión',
        'url-tab': 'URL',
        'file-tab': 'Archivo',
        'login-m3u': 'Iniciar con URL M3U',
        'login-file': 'Iniciar con Archivo',
        'login-api': 'Iniciar Sesión',
        'back-categories': '← Volver a Categorías',
        'logout': 'Cerrar Sesión',
        'search-placeholder': 'Buscar canales...',
        'total': 'Total:',
        'active': 'Activos:',
        'offline': 'Fuera de línea:',
        'epg-title': 'Guía de Programación Electrónica (EPG)',
        'close': 'Cerrar',
        'dark-mode': 'Alternar Modo Oscuro',
        'settings': 'Configuraciones',
        'settings-title': 'Configuraciones',
        'layout': 'Diseño:',
        'grid': 'Cuadrícula',
        'list': 'Lista',
        'card-size': 'Tamaño de Tarjeta:',
        'subtitles': 'Subtítulos',
        'error': 'Error',
        'favorite': 'Favorito',
        'recommendations': 'Recomendaciones',
        'watch-later': 'Ver Más Tarde',
        'share': 'Compartir',
        'favorites-btn': 'Favoritos',
        'watch-later-btn': 'Ver Más Tarde'
    }
};

window.onload = function () {
    const credentials = localStorage.getItem('iptvCredentials');
    const storedPlaylist = localStorage.getItem('iptvPlaylist');
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
    languageSelect.value = currentLanguage;
    themeSelect.value = theme;
    applyTheme();
    changeLanguage();
    
    if (credentials || storedPlaylist) {
        showUserProfileSelection();
    } else {
        loginSection.classList.remove('d-none');
    }
};

function showLoading() { loadingSpinner.classList.remove('d-none'); }
function hideLoading() { loadingSpinner.classList.add('d-none'); }
function showError(message) {
    document.getElementById('error-message').innerText = message;
    errorToast.show();
}
function showPlayerNotification(message) {
    playerNotification.innerText = message;
    playerNotification.style.display = 'block';
    setTimeout(() => playerNotification.style.display = 'none', 3000);
}

function toggleDarkMode() {
    const isDark = darkModeToggle.checked;
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('darkMode', isDark);
    if (currentUser) {
        userProfiles[currentUser].darkMode = isDark;
        saveUserProfiles();
    }
}

function applyTheme() {
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme}`);
    if (currentUser) {
        userProfiles[currentUser].theme = theme;
        saveUserProfiles();
    }
    themeSelect.value = theme; // Ensure theme select reflects current theme
}

function changeLanguage() {
    currentLanguage = languageSelect.value;
    localStorage.setItem('language', currentLanguage);
    if (currentUser) {
        userProfiles[currentUser].language = currentLanguage;
        saveUserProfiles();
    }
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        el.innerText = translations[currentLanguage][key] || el.innerText;
    });
    if (playlist.length) displayChannels(playlist, 'All Channels');
}

function showUserProfileSelection() {
    loginSection.classList.remove('d-none');
    loginSection.innerHTML = `
        <div class="user-profile-selection">
            <h3>Select User Profile</h3>
            <div id="profile-list" class="profile-list"></div>
            <button class="btn btn-primary mt-3" onclick="addNewProfile()">Add New Profile</button>
        </div>
    `;
    const profileList = document.getElementById('profile-list');
    Object.keys(userProfiles).forEach(profile => {
        const div = document.createElement('div');
        div.className = 'profile-item';
        div.innerHTML = `
            <span>${profile}</span>
            <button class="btn btn-sm btn-outline-primary" onclick="loadUserProfile('${profile}')">Select</button>
        `;
        profileList.appendChild(div);
    });
}

function addNewProfile() {
    const name = prompt('Enter profile name:');
    if (name && !userProfiles[name]) {
        userProfiles[name] = {
            favorites: [],
            viewingHistory: [],
            watchLater: [],
            darkMode: false,
            language: 'en',
            theme: 'default',
            parentalControls: { enabled: false, restrictedCategories: [] }
        };
        saveUserProfiles();
        showUserProfileSelection();
    }
}

function loadUserProfile(profile) {
    currentUser = profile;
    favorites = userProfiles[profile].favorites;
    viewingHistory = userProfiles[profile].viewingHistory;
    watchLater = userProfiles[profile].watchLater;
    document.body.classList.toggle('dark-mode', userProfiles[profile].darkMode);
    darkModeToggle.checked = userProfiles[profile].darkMode;
    localStorage.setItem('darkMode', userProfiles[profile].darkMode);
    languageSelect.value = userProfiles[profile].language;
    currentLanguage = userProfiles[profile].language;
    theme = userProfiles[profile].theme;
    themeSelect.value = theme;
    parentalToggle.checked = userProfiles[profile].parentalControls.enabled;
    restrictedCategoriesInput.value = userProfiles[profile].parentalControls.restrictedCategories.join(',');
    applyTheme();
    changeLanguage();

    const credentials = localStorage.getItem('iptvCredentials');
    const storedPlaylist = localStorage.getItem('iptvPlaylist');
    if (credentials) {
        const { server, username: storedUsername, password: storedPassword } = JSON.parse(credentials);
        serverInput.value = server;
        usernameInput.value = storedUsername;
        passwordInput.value = storedPassword;
        login();
    } else if (storedPlaylist) {
        playlist = JSON.parse(storedPlaylist);
        originalPlaylist = [...playlist];
        loginSection.classList.add('d-none');
        mainSection.classList.remove('d-none');
        logoutBtn.classList.remove('d-none');
        displayChannels(playlist, 'All Channels');
        categoriesSection.classList.add('d-none');
        channelsSection.classList.remove('d-none');
        backButton.style.display = 'none';
        setupSearch();
        setupFilterButtons();
        if (!isInitialCheckDone) {
            checkChannelStatus(playlist);
            isInitialCheckDone = true;
        }
        displayRecommendations();
    }
}

function saveUserProfiles() {
    localStorage.setItem('userProfiles', JSON.stringify(userProfiles));
}

function parseM3UUrl() {
    const m3uUrl = m3uUrlInput.value.trim();
    if (!m3uUrl) { showError('Please enter an M3U URL.'); return; }

    showLoading();
    fetch(m3uUrl)
        .then(response => { if (!response.ok) throw new Error('Failed to fetch M3U URL.'); return response.text(); })
        .then(data => {
            playlist = parsePlaylistContent(data, 'm3u');
            if (playlist.length === 0) throw new Error('No valid channels found in M3U content.');
            originalPlaylist = [...playlist];
            localStorage.setItem('iptvPlaylist', JSON.stringify(playlist));
            localStorage.removeItem('iptvCredentials');
            loginSection.classList.add('d-none');
            mainSection.classList.remove('d-none');
            logoutBtn.classList.remove('d-none');
            displayChannels(playlist, 'All Channels');
            categoriesSection.classList.add('d-none');
            channelsSection.classList.remove('d-none');
            backButton.style.display = 'none';
            setupSearch();
            setupFilterButtons();
            if (!isInitialCheckDone) {
                checkChannelStatus(playlist);
                isInitialCheckDone = true;
            }
            displayRecommendations();
        })
        .catch(error => { console.error('Error fetching M3U URL:', error); showError('Failed to fetch or parse M3U URL.'); })
        .finally(() => hideLoading());
}

function parseM3UFile() {
    const file = m3uFileInput.files[0];
    if (!file) { showError('Please select a file.'); return; }

    const fileType = file.name.split('.').pop().toLowerCase();
    showLoading();
    const reader = new FileReader();
    reader.onload = function (event) {
        playlist = parsePlaylistContent(event.target.result, fileType);
        if (playlist.length === 0) { showError('No valid channels found in the file.'); hideLoading(); return; }
        originalPlaylist = [...playlist];
        localStorage.setItem('iptvPlaylist', JSON.stringify(playlist));
        localStorage.removeItem('iptvCredentials');
        loginSection.classList.add('d-none');
        mainSection.classList.remove('d-none');
        logoutBtn.classList.remove('d-none');
        displayChannels(playlist, 'All Channels');
        categoriesSection.classList.add('d-none');
        channelsSection.classList.remove('d-none');
        backButton.style.display = 'none';
        setupSearch();
        setupFilterButtons();
        if (!isInitialCheckDone) {
            checkChannelStatus(playlist);
            isInitialCheckDone = true;
        }
        displayRecommendations();
        hideLoading();
    };
    reader.onerror = function () { showError('Error reading file.'); hideLoading(); };
    reader.readAsText(file);
}

function parsePlaylistContent(content, type) {
    const channels = [];
    if (type === 'm3u' || type === 'txt') {
        const lines = content.split('\n');
        let currentChannel = null;
        let index = 0;
        for (const line of lines) {
            if (line.startsWith('#EXTINF:')) {
                const match = line.match(/#EXTINF:-?\d+(?:.*?)tvg-logo="([^"]*)"?[^,]*?group-title="([^"]*)"?[^,]*?,(.+)/i);
                currentChannel = {
                    name: match ? match[3].trim() : `Channel ${index}`,
                    logo: match && match[1] ? match[1] : '',
                    category: match && match[2] ? match[2] : 'Uncategorized',
                    url: '',
                    status: 'unknown',
                    index: index++,
                    epg: []
                };
            } else if (line.trim().startsWith('http') && currentChannel) {
                currentChannel.url = line.trim();
                channels.push(currentChannel);
                currentChannel = null;
            }
        }
    } else if (type === 'json') {
        try {
            const data = JSON.parse(content);
            if (Array.isArray(data)) {
                data.forEach((item, index) => {
                    if (item.name && item.url) {
                        channels.push({
                            name: item.name,
                            logo: item.logo || '',
                            category: item.category || 'Uncategorized',
                            url: item.url,
                            status: 'unknown',
                            index,
                            epg: []
                        });
                    }
                });
            }
        } catch (error) { console.error('Error parsing JSON:', error); }
    }
    return channels;
}

async function checkChannelStatus(channels) {
    showLoading();
    let activeCount = 0;
    const totalChannels = channels.length;
    
    const checkBatch = async (batch) => {
        return Promise.all(batch.map(async (channel) => {
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), STATUS_CHECK_INTERVAL);
                
                const response = await fetch(channel.url, {
                    method: 'HEAD',
                    mode: 'cors',
                    cache: 'no-store',
                    signal: controller.signal
                });
                
                clearTimeout(timeout);
                channel.status = response.ok ? 'active' : 'offline';
                if (response.ok) activeCount++;
            } catch {
                channel.status = 'offline';
            }
            updateChannelStats();
        }));
    };

    for (let i = 0; i < totalChannels; i += BATCH_SIZE) {
        const batch = channels.slice(i, i + BATCH_SIZE);
        await checkBatch(batch);
    }
    
    updateChannelStats();
    displayChannels(channels, 'All Channels');
    checkForNewContent(channels);
    hideLoading();
}

function updateChannelStats() {
    const total = playlist.length || originalPlaylist.length;
    const active = (playlist.length ? playlist : originalPlaylist).filter(ch => ch.status === 'active').length;
    const offline = total - active;
    totalChannelsSpan.textContent = total;
    activeChannelsSpan.textContent = active;
    offlineChannelsSpan.textContent = offline;
}

function resyncPlaylist() {
    showLoading();
    checkChannelStatus(playlist.length ? playlist : originalPlaylist);
}

async function login() {
    const server = serverInput.value;
    username = usernameInput.value;
    password = passwordInput.value;

    if (!server || !username || !password) { showError('Please fill in all fields.'); return; }

    baseUrl = `${server}/player_api.php?username=${username}&password=${password}`;
    showLoading();
    try {
        const response = await fetch(`${baseUrl}&action=get_live_categories`);
        if (!response.ok) throw new Error('Invalid response from server.');
        const categories = await response.json();
        if (categories && categories.length > 0) {
            localStorage.setItem('iptvCredentials', JSON.stringify({ server, username, password }));
            localStorage.removeItem('iptvPlaylist');
            loginSection.classList.add('d-none');
            mainSection.classList.remove('d-none');
            logoutBtn.classList.remove('d-none');
            displayCategories(categories);
            displayRecommendations();
        } else {
            throw new Error('No categories found.');
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        showError('Failed to fetch categories. Check your credentials.');
    } finally {
        hideLoading();
    }
}

function logout() {
    localStorage.removeItem('iptvCredentials');
    localStorage.removeItem('iptvPlaylist');
    localStorage.removeItem('viewingHistory');
    if (currentUser) {
        userProfiles[currentUser].favorites = favorites;
        userProfiles[currentUser].viewingHistory = viewingHistory;
        userProfiles[currentUser].watchLater = watchLater;
        saveUserProfiles();
    }
    playlist = [];
    originalPlaylist = [];
    viewingHistory = [];
    watchLater = [];
    currentUser = null;
    loginSection.classList.remove('d-none');
    mainSection.classList.add('d-none');
    logoutBtn.classList.add('d-none');
    serverInput.value = '';
    usernameInput.value = '';
    passwordInput.value = '';
    m3uUrlInput.value = '';
    m3uFileInput.value = '';
    showUserProfileSelection();
}

function displayCategories(categories) {
    categoriesDiv.innerHTML = categories.map(cat => `
        <div class="col-12 col-md-4 col-sm-6">
            <div class="card category-card p-2" onclick="loadChannels('${cat.category_id}', '${cat.category_name}')">
                <div class="card-body">
                    <h5 class="card-title">${cat.category_name}</h5>
                </div>
            </div>
        </div>
    `).join('');
}

async function loadChannels(categoryId, categoryName) {
    showLoading();
    try {
        const response = await fetch(`${baseUrl}&action=get_live_streams&category_id=${categoryId}`);
        if (!response.ok) throw new Error('Invalid response from server.');
        const channels = await response.json();
        if (channels && channels.length > 0) {
            channels.forEach((ch, idx) => ch.index = idx);
            categoriesSection.classList.add('d-none');
            channelsSection.classList.remove('d-none');
            backButton.style.display = 'block';
            displayChannels(channels, categoryName);
            setupSearch();
            setupFilterButtons();
        } else {
            throw new Error('No channels found.');
        }
    } catch (error) {
        console.error('Error fetching channels:', error);
        showError('Failed to fetch channels.');
    } finally {
        hideLoading();
    }
}

function showCategories() {
    categoriesSection.classList.remove('d-none');
    channelsSection.classList.add('d-none');
    backButton.style.display = 'none';
}

function displayChannels(channels, categoryName) {
    if (currentUser && userProfiles[currentUser].parentalControls.enabled) {
        channels = channels.filter(ch => !userProfiles[currentUser].parentalControls.restrictedCategories.includes(ch.category));
    }

    channelsDiv.innerHTML = '';
    const layout = localStorage.getItem('layout') || 'grid';
    channelsDiv.className = `channels-list ${layout === 'list' ? 'channels-list-view' : ''}`;
    const cardSize = localStorage.getItem('cardSize') || 280;
    document.documentElement.style.setProperty('--card-width', `${cardSize}px`);

    let filteredChannels = [...channels];
    if (currentFilter === 'active') {
        filteredChannels = channels.filter(ch => ch.status === 'active');
    } else if (currentFilter === 'offline') {
        filteredChannels = channels.filter(ch => ch.status === 'offline');
    }

    const container = document.createElement('div');
    container.className = 'playlist-container';

    if (playlist.length > 0) {
        const groupedChannels = filteredChannels.reduce((acc, ch) => {
            const cat = ch.category || 'Uncategorized';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(ch);
            return acc;
        }, {});

        Object.entries(groupedChannels).forEach(([cat, chans], idx) => {
            const categorySection = document.createElement('div');
            categorySection.className = 'category-section';

            const header = document.createElement('div');
            header.className = 'category-header';
            header.innerHTML = `
                <div class="category-info">
                    <h3 class="category-title">${cat}</h3>
                    <span class="category-count">${chans.length} Channels</span>
                </div>
                <button class="toggle-btn" onclick="toggleCategory(this, 'cat-${idx}')">
                    <i class="fas fa-chevron-down"></i>
                </button>
            `;
            categorySection.appendChild(header);

            const channelList = document.createElement('div');
            channelList.className = `channel-list cat-${idx} ${layout === 'grid' ? 'grid-layout' : 'list-layout'}`;
            channelList.innerHTML = chans.map(ch => `
                <div class="channel-card" onclick="playStream('${ch.index}', '${ch.name}')">
                    <div class="channel-content">
                        <img src="${ch.logo || ''}" class="channel-icon" alt="${ch.name}" onerror="this.src=''">
                        <div class="channel-info">
                            <h4 class="channel-name">${ch.name}</h4>
                            <div class="channel-status">
                                <span class="status-dot ${ch.status}"></span>
                                <span class="status-text">${ch.status === 'active' ? 'Live' : ch.status === 'offline' ? 'Offline' : 'Checking'}</span>
                            </div>
                        </div>
                        <div class="channel-actions">
                            <button class="fav-btn ${favorites.includes(ch.index) ? 'active' : ''}" 
                                    onclick="toggleFavorite(${ch.index}, event)">
                                <i class="fas fa-star"></i>
                            </button>
                            <button class="watch-later-btn ${watchLater.includes(ch.index) ? 'active' : ''}" 
                                    onclick="toggleWatchLater(${ch.index}, event)">
                                <i class="fas fa-clock"></i>
                            </button>
                            <button class="share-btn" onclick="shareChannel('${ch.name}', '${ch.url || ''}', event)">
                                <i class="fas fa-share-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
            categorySection.appendChild(channelList);
            container.appendChild(categorySection);
        });
    } else {
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section';
        
        const header = document.createElement('div');
        header.className = 'category-header';
        header.innerHTML = `
            <div class="category-info">
                <h3 class="category-title">${categoryName}</h3>
                <span class="category-count">${filteredChannels.length} Channels</span>
            </div>
        `;
        categorySection.appendChild(header);

        const channelList = document.createElement('div');
        channelList.className = `channel-list ${layout === 'grid' ? 'grid-layout' : 'list-layout'}`;
        channelList.innerHTML = filteredChannels.map(ch => `
            <div class="channel-card" onclick="playStream('${ch.index}', '${ch.name}')">
                <div class="channel-content">
                    <img src="${ch.stream_icon || ''}" class="channel-icon" alt="${ch.name}" onerror="this.src=''">
                    <div class="channel-info">
                        <h4 class="channel-name">${ch.name}</h4>
                        <div class="channel-status">
                            <span class="status-dot api"></span>
                            <span class="status-text">API Channel</span>
                        </div>
                    </div>
                    <div class="channel-actions">
                        <button class="fav-btn ${favorites.includes(ch.index) ? 'active' : ''}" 
                                onclick="toggleFavorite(${ch.index}, event)">
                            <i class="fas fa-star"></i>
                        </button>
                        <button class="watch-later-btn ${watchLater.includes(ch.index) ? 'active' : ''}" 
                                onclick="toggleWatchLater(${ch.index}, event)">
                            <i class="fas fa-clock"></i>
                        </button>
                        <button class="share-btn" onclick="shareChannel('${ch.name}', '${baseUrl}/live/${username}/${password}/${ch.index}.m3u8', event)">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        categorySection.appendChild(channelList);
        container.appendChild(categorySection);
    }

    channelsDiv.appendChild(container);
    updateChannelStats();
    displayRecommendations();
}

function toggleCategory(btn, catClass) {
    const list = document.querySelector(`.${catClass}`);
    list.classList.toggle('collapsed');
    const icon = btn.querySelector('i');
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
}

function toggleFavorite(index, event) {
    event.stopPropagation();
    const idx = favorites.indexOf(index);
    if (idx > -1) favorites.splice(idx, 1);
    else favorites.push(index);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    if (currentUser) {
        userProfiles[currentUser].favorites = favorites;
        saveUserProfiles();
    }
    displayChannels(playlist.length ? playlist : originalPlaylist, 'All Channels');
}

function toggleWatchLater(index, event) {
    event.stopPropagation();
    const idx = watchLater.indexOf(index);
    if (idx > -1) watchLater.splice(idx, 1);
    else watchLater.push(index);
    localStorage.setItem('watchLater', JSON.stringify(watchLater));
    if (currentUser) {
        userProfiles[currentUser].watchLater = watchLater;
        saveUserProfiles();
    }
    displayChannels(playlist.length ? playlist : originalPlaylist, 'All Channels');
}

function shareChannel(channelName, channelUrl, event) {
    event.stopPropagation();
    const shareData = {
        title: `Check out ${channelName}`,
        text: `Watch ${channelName} on this IPTV player!`,
        url: channelUrl || `${window.location.origin}?channel=${encodeURIComponent(channelName)}`
    };
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        navigator.share(shareData)
            .catch(err => {
                console.error('Error sharing:', err);
                fallbackShare(channelName, shareData.url);
            });
    } else {
        fallbackShare(channelName, shareData.url);
    }
}

function fallbackShare(channelName, url) {
    const textarea = document.createElement('textarea');
    textarea.value = `${channelName}: ${url}`;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showPlayerNotification('Link copied to clipboard!');
}

function showFavorites() {
    const favChannels = (playlist.length ? playlist : originalPlaylist).filter(ch => favorites.includes(ch.index));
    displayChannels(favChannels, 'Favorites');
}

function showWatchLater() {
    const watchLaterChannels = (playlist.length ? playlist : originalPlaylist).filter(ch => watchLater.includes(ch.index));
    displayChannels(watchLaterChannels, 'Watch Later');
}

function setupSearch() {
    channelsSearch.addEventListener('input', () => {
        const query = channelsSearch.value.toLowerCase();
        const filtered = (originalPlaylist.length > 0 ? originalPlaylist : playlist).filter(ch => {
            const matchesQuery = ch.name.toLowerCase().includes(query) || ch.category.toLowerCase().includes(query) || (ch.status && ch.status.toLowerCase().includes(query));
            return matchesQuery;
        });
        displayChannels(filtered, 'Filtered Channels');
    });
}

function setupFilterButtons() {
    const header = document.querySelector('.channels-header');
    if (!header.querySelector('.filter-buttons')) {
        const filterDiv = document.createElement('div');
        filterDiv.className = 'filter-buttons';
        filterDiv.innerHTML = `
            <button class="btn btn-sm btn-outline-primary filter-btn" data-filter="all">All</button>
            <button class="btn btn-sm btn-outline-success filter-btn" data-filter="active">Active</button>
            <button class="btn btn-sm btn-outline-danger filter-btn" data-filter="offline">Offline</button>
            <button class="btn btn-sm btn-outline-info resync-btn" onclick="resyncPlaylist()">Resync</button>
            <button class="btn btn-sm btn-outline-warning favorites-btn" onclick="showFavorites()" data-lang="favorites-btn">${translations[currentLanguage]['favorites-btn']}</button>
            <button class="btn btn-sm btn-outline-primary watch-later-btn" onclick="showWatchLater()" data-lang="watch-later-btn">${translations[currentLanguage]['watch-later-btn']}</button>
        `;
        header.appendChild(filterDiv);

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentFilter = btn.dataset.filter;
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                displayChannels(playlist.length ? playlist : originalPlaylist, 'All Channels');
            });
        });
        document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
    }
}

async function playStream(streamIndex, channelName) {
    if (currentHls) {
        currentHls.destroy();
        currentHls = null;
    }

    videoPlayer.pause();
    videoPlayer.src = '';
    videoPlayer.load();

    let streamUrl;
    if (playlist.length > 0) {
        streamUrl = playlist[parseInt(streamIndex)].url;
        viewingHistory.push({ name: channelName, category: playlist[parseInt(streamIndex)].category, timestamp: Date.now() });
    } else {
        const serverUrl = baseUrl.split('/player_api.php')[0];
        streamUrl = `${serverUrl}/live/${username}/${password}/${streamIndex}.m3u8`;
        viewingHistory.push({ name: channelName, category: 'API', timestamp: Date.now() });
    }
    localStorage.setItem('viewingHistory', JSON.stringify(viewingHistory.slice(-50)));
    if (currentUser) {
        userProfiles[currentUser].viewingHistory = viewingHistory;
        saveUserProfiles();
    }

    try {
        showPlayerNotification('Loading stream...');
        if (Hls.isSupported()) {
            currentHls = new Hls({ enableWorker: true, lowLatencyMode: true, backBufferLength: 90 });
            currentHls.loadSource(streamUrl);
            currentHls.attachMedia(videoPlayer);
            currentHls.on(Hls.Events.MANIFEST_PARSED, () => {
                videoPlayer.play().catch(error => {
                    console.error('Error playing video:', error);
                    showPlayerNotification('Failed to play the stream.');
                });
            });
            currentHls.on(Hls.Events.ERROR, (event, data) => {
                console.error('HLS Error:', data);
                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                    showPlayerNotification('Network error. Retrying...');
                    currentHls.startLoad();
                } else if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
                    showPlayerNotification('Buffering stalled. Recovering...');
                    currentHls.recoverMediaError();
                } else {
                    showPlayerNotification('Stream error: ' + data.details);
                }
            });
        } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
            videoPlayer.src = streamUrl;
            videoPlayer.play().catch(error => {
                console.error('Error playing native HLS:', error);
                showPlayerNotification('Failed to play the stream natively.');
            });
        } else {
            showPlayerNotification('HLS playback not supported.');
            return;
        }

        document.getElementById('videoModalLabel').innerText = channelName;
        videoModal.show();

        const modalElement = document.getElementById('videoModal');
        modalElement.removeEventListener('hidden.bs.modal', handleModalClose);
        modalElement.addEventListener('hidden.bs.modal', handleModalClose);

        const videoContainer = document.querySelector('.video-container');
        videoContainer.addEventListener('mousemove', () => {
            videoContainer.classList.add('active');
            clearTimeout(videoContainer.timeout);
            videoContainer.timeout = setTimeout(() => videoContainer.classList.remove('active'), 2000);
        });

        if (!playlist.length) await loadEPG(streamIndex);
        else {
            epgContainer.style.display = 'block';
            displayEPG(playlist[parseInt(streamIndex)].epg);
        }

        const pipButton = document.createElement('button');
        pipButton.className = 'btn btn-sm btn-outline-light pip-btn';
        pipButton.innerHTML = '<i class="fas fa-window-restore"></i>';
        pipButton.onclick = togglePictureInPicture;
        document.querySelector('.playback-controls').appendChild(pipButton);
    } catch (error) {
        console.error('Error in playStream:', error);
        showPlayerNotification('An error occurred while playing.');
    }
}

function togglePictureInPicture() {
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch(err => console.error('Error exiting PiP:', err));
    } else if (videoPlayer) {
        videoPlayer.requestPictureInPicture().catch(err => console.error('Error entering PiP:', err));
    }
}

function rewind() { videoPlayer.currentTime -= 10; }
function fastForward() { videoPlayer.currentTime += 10; }

async function loadSubtitles() {
    const file = document.getElementById('subtitle-file').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            addSubtitleTrack(URL.createObjectURL(file), 'Custom');
        };
        reader.readAsDataURL(file);
    } else {
        const channelName = document.getElementById('videoModalLabel').innerText;
        showPlayerNotification('Searching for English subtitles...');
        
        try {
            const subtitleUrl = await searchSubtitlesOnline(channelName);
            if (subtitleUrl) {
                addSubtitleTrack(subtitleUrl, 'English (Auto)');
                showPlayerNotification('Subtitles found and loaded!');
            } else {
                showPlayerNotification('English subtitles not found.');
            }
        } catch (error) {
            console.error('Subtitle search error:', error);
            showPlayerNotification('Error searching for subtitles.');
        }
    }
}

function addSubtitleTrack(src, label) {
    while (videoPlayer.textTracks.length) {
        videoPlayer.removeChild(videoPlayer.textTracks[0]);
    }
    const track = document.createElement('track');
    track.kind = 'subtitles';
    track.label = label;
    track.srclang = 'en';
    track.src = src;
    videoPlayer.appendChild(track);
    videoPlayer.textTracks[0].mode = 'showing';
}

async function searchSubtitlesOnline(channelName) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(null);
        }, 1000);
    });
}

function handleModalClose() {
    if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.src = '';
        while (videoPlayer.textTracks.length) videoPlayer.removeChild(videoPlayer.textTracks[0]);
    }
    if (currentHls) {
        currentHls.destroy();
        currentHls = null;
    }
    epgContainer.style.display = 'none';
}

async function loadEPG(streamId) {
    if (playlist.length) return;
    try {
        const response = await fetch(`${baseUrl}&action=get_short_epg&stream_id=${streamId}&limit=5`);
        if (!response.ok) throw new Error('Invalid response from server.');
        const data = await response.json();
        if (data.epg_listings && data.epg_listings.length > 0) {
            displayEPG(data.epg_listings);
            epgContainer.style.display = 'block';
        } else {
            epgContainer.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching EPG:', error);
        epgContainer.style.display = 'none';
    }
}

function displayEPG(epgListings) {
    epgDiv.innerHTML = epgListings.map(entry => {
        const title = entry.title ? atob(entry.title) : 'No Title';
        const desc = entry.description ? atob(entry.description) : 'No Description';
        const start = entry.start_timestamp ? new Date(parseInt(entry.start_timestamp) * 1000).toLocaleTimeString() : 'N/A';
        const end = entry.end_timestamp ? new Date(parseInt(entry.end_timestamp) * 1000).toLocaleTimeString() : 'N/A';
        return `
            <div class="epg-entry">
                <strong>${start} - ${end}</strong><br>
                <span>${title}</span><br>
                <small class="text-muted">${desc}</small>
            </div>
        `;
    }).join('');
}

function displayRecommendations() {
    const categoryCount = viewingHistory.reduce((acc, entry) => {
        acc[entry.category] = (acc[entry.category] || 0) + 1;
        return acc;
    }, {});
    const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (topCategory && playlist.length) {
        const recs = playlist.filter(ch => ch.category === topCategory && !viewingHistory.some(h => h.name === ch.name)).slice(0, 5);
        if (recs.length) {
            const recDiv = document.createElement('div');
            recDiv.className = 'category-section';
            recDiv.innerHTML = `
                <div class="category-header">
                    <div class="category-info">
                        <h3 class="category-title">${translations[currentLanguage].recommendations}</h3>
                        <span class="category-count">${recs.length} Channels</span>
                    </div>
                </div>
                <div class="channel-list ${localStorage.getItem('layout') || 'grid'} === 'grid' ? 'grid-layout' : 'list-layout'}">
                    ${recs.map(ch => `
                        <div class="channel-card" onclick="playStream('${ch.index}', '${ch.name}')">
                            <div class="channel-content">
                                <img src="${ch.logo || ''}" class="channel-icon" alt="${ch.name}" onerror="this.src=''">
                                <div class="channel-info">
                                    <h4 class="channel-name">${ch.name}</h4>
                                    <div class="channel-status">
                                        <span class="status-dot ${ch.status}"></span>
                                        <span class="status-text">${ch.status === 'active' ? 'Live' : ch.status === 'offline' ? 'Offline' : 'Checking'}</span>
                                    </div>
                                </div>
                                <div class="channel-actions">
                                    <button class="fav-btn ${favorites.includes(ch.index) ? 'active' : ''}" 
                                            onclick="toggleFavorite(${ch.index}, event)">
                                        <i class="fas fa-star"></i>
                                    </button>
                                    <button class="watch-later-btn ${watchLater.includes(ch.index) ? 'active' : ''}" 
                                            onclick="toggleWatchLater(${ch.index}, event)">
                                        <i class="fas fa-clock"></i>
                                    </button>
                                    <button class="share-btn" onclick="shareChannel('${ch.name}', '${ch.url}', event)">
                                        <i class="fas fa-share-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            channelsDiv.insertBefore(recDiv, channelsDiv.firstChild);
        }
    }
}

function checkForNewContent(channels) {
    const prevChannels = JSON.parse(localStorage.getItem('prevChannels') || '[]');
    const newChannels = channels.filter(ch => !prevChannels.some(pc => pc.name === ch.name));
    if (newChannels.length > 0) {
        showPlayerNotification(`${newChannels.length} new channels added!`);
        localStorage.setItem('prevChannels', JSON.stringify(channels));
    }
}

function toggleParentalControls() {
    if (currentUser) {
        userProfiles[currentUser].parentalControls.enabled = parentalToggle.checked;
        userProfiles[currentUser].parentalControls.restrictedCategories = restrictedCategoriesInput.value.split(',').map(c => c.trim());
        saveUserProfiles();
        displayChannels(playlist.length ? playlist : originalPlaylist, 'All Channels');
    }
}

function updateLayout() {
    localStorage.setItem('layout', layoutSelect.value);
    displayChannels(playlist.length ? playlist : originalPlaylist, 'All Channels');
}

function updateCardSize() {
    localStorage.setItem('cardSize', cardSizeInput.value);
    document.documentElement.style.setProperty('--card-width', `${cardSizeInput.value}px`);
    displayChannels(playlist.length ? playlist : originalPlaylist, 'All Channels');
}