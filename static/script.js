// Game state
let gameState = {
    parameters: 0,
    parametersPerSecond: 0,
    funding: 0,
    fundingPerSecond: 0,
    stats: {
        totalCodeWritten: 0,
        totalDevsHired: 0,
        totalCoffeeConsumed: 0,
        totalElectricityConsumed: 0,
        totalTrainingCycles: 0,
        totalCoffeeSpilled: 0,
        totalStackOverflowVisits: 0,
        totalBugsSquashed: 0,
        totalDatasetCollected: 0,
        totalKeyboardsDestroyed: 0,
        totalTimeLapsed: 0,
        intelligenceIndex: 0
    },
    companyName: '',
    modelName: '',
    lastSaved: Date.now(),
    resources: {
        datasets: 0,
        datasetCapacity: 5,
        datasetQuality: 1,
        computeUnits: 10,
        maxComputeUnits: 10,
        computeRechargeRate: 1,
        trainingEfficiency: 1
    },
    costs: {
        dataset: 5,
        training: 10
    },
    research: {
        papersPublished: 0,
        paperCooldown: 0,
        maxCooldown: 60,
        baseFunding: 50,
        nextPaperTime: 0
    },
    training: {
        inProgress: false,
        currentEpoch: 0,
        totalEpochs: 0,
        epochsCompleted: 0,
        parameterGainPerEpoch: 0,
        timePerEpoch: 5,
        timeRemaining: 0
    },
    upgrades: {},
    milestones: {},
    theme: 'light', // Default theme
    soundEnabled: true // Sound management
};

// Global variables
let lastUpdate = Date.now();

// DOM Elements
let parametersElement;
let parametersPerSecondElement;
let fundingElement;
let fundingPerSecondElement;
let datasetsElement;
let datasetCapacityElement;
let datasetQualityElement;
let datasetCostElement;
let computeUnitsElement;
let maxComputeUnitsElement;
let computeRechargeRateElement;
let trainingEfficiencyElement;
let trainingCostElement;
let papersPublishedElement;
let paperFundingElement;
let messageContainer;
let upgradeListElement;
let milestoneListElement;
let collectDatasetButton;
let startTrainingButton;
let publishPaperButton;
let manualComputeButton;
let epochCountInput;
let trainingProgressElement;
let paperCooldownElement;
let tutorialModal;
let achievementModal;
let achievementContent;
let achievementTitle;
let achievementCloseButton;
let saveButton;
let resetButton;
let clearStorageButton;
let forceInitButton;
let themeToggle;
let soundToggle; // Sound management

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    parametersElement = document.getElementById('parameters');
    parametersPerSecondElement = document.getElementById('parameters-per-second');
    fundingElement = document.getElementById('funding');
    fundingPerSecondElement = document.getElementById('funding-per-second');
    datasetsElement = document.getElementById('datasets');
    datasetCapacityElement = document.getElementById('dataset-capacity');
    datasetQualityElement = document.getElementById('dataset-quality');
    datasetCostElement = document.getElementById('dataset-cost');
    computeUnitsElement = document.getElementById('compute-units');
    maxComputeUnitsElement = document.getElementById('max-compute-units');
    computeRechargeRateElement = document.getElementById('compute-recharge-rate');
    trainingEfficiencyElement = document.getElementById('training-efficiency');
    trainingCostElement = document.getElementById('training-cost');
    papersPublishedElement = document.getElementById('papers-published');
    paperFundingElement = document.getElementById('paper-funding');
    messageContainer = document.getElementById('message-container');
    upgradeListElement = document.getElementById('upgrade-list');
    milestoneListElement = document.getElementById('milestone-list');
    collectDatasetButton = document.getElementById('collect-dataset-button');
    startTrainingButton = document.getElementById('start-training-button');
    publishPaperButton = document.getElementById('publish-paper-button');
    manualComputeButton = document.getElementById('manual-compute-button');
    epochCountInput = document.getElementById('epoch-count');
    trainingProgressElement = document.getElementById('training-progress');
    paperCooldownElement = document.getElementById('paper-cooldown');
    tutorialModal = document.getElementById('tutorial-modal');
    achievementModal = document.getElementById('achievement-modal');
    achievementContent = document.getElementById('achievement-content');
    achievementTitle = document.getElementById('achievement-title');
    achievementCloseButton = document.getElementById('achievement-close');
    saveButton = document.getElementById('save-button');
    resetButton = document.getElementById('reset-button');
    clearStorageButton = document.getElementById('clear-storage-button');
    forceInitButton = document.getElementById('force-init-button');
    themeToggle = document.getElementById('theme-toggle');
    soundToggle = document.getElementById('sound-toggle'); // Sound management

    // Initialize sidebar tabs
    initSidebarTabs();
    
    // Initialize game state
    initializeGame();
    
    // Make sure upgrades and milestones are initialized
    if (Object.keys(gameState.upgrades).length === 0 || Object.keys(gameState.milestones).length === 0) {
        initializeDefaultGameState();
    }
    
    // Check if tutorial needs to be shown
    checkAndShowTutorial();
    
    // Start the game loop
    lastUpdate = Date.now();
    setInterval(gameLoop, 1000);
    
    // Add event listener for theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            gameState.theme = this.checked ? 'dark' : 'light';
            applyTheme(gameState.theme);
            localStorage.setItem('idleAITheme', gameState.theme);
        });
        
        // Make the theme label clickable too
        const themeLabel = document.querySelector('.theme-label');
        if (themeLabel) {
            themeLabel.addEventListener('click', function() {
                themeToggle.checked = !themeToggle.checked;
                // Trigger the change event
                themeToggle.dispatchEvent(new Event('change'));
            });
        }
    }
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('idleAITheme');
    if (savedTheme) {
        gameState.theme = savedTheme;
        applyTheme(gameState.theme);
    } else {
        applyTheme(gameState.theme); // Apply default theme
    }
    
    // Initialize sound toggle
    if (soundToggle) {
        // Set initial checked state based on gameState
        soundToggle.checked = gameState.soundEnabled;
        
        // Add event listener for sound toggle
        soundToggle.addEventListener('change', function() {
            toggleSound();
        });
    }
    
    // Setup modal event listeners
    setupModalEventListeners();
});

// Apply theme
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update the toggle switch state
    if (themeToggle) {
        themeToggle.checked = theme === 'dark';
    }
    
    // Log theme change
    if (theme === 'dark') {
        addMessage('Dark theme activated. Your eyes thank you!');
    } else {
        addMessage('Light theme activated.');
    }
}

// Check if tutorial needs to be shown
function checkAndShowTutorial() {
    // Check if we have saved data
    const savedData = localStorage.getItem('idleAISave');
    
    if (!savedData) {
        // No saved data, show tutorial
        showTutorial();
    } else {
        // Try to parse saved data
        try {
            const parsedData = JSON.parse(savedData);
            if (!parsedData.companyName || !parsedData.modelName) {
                // Missing company or model name, show tutorial
                showTutorial();
            }
        } catch (e) {
            // Error parsing saved data, show tutorial
            showTutorial();
        }
    }
}

// Show tutorial modal
function showTutorial() {
    const tutorialModal = document.getElementById('tutorial-modal');
    tutorialModal.classList.add('active');
    
    // Set up tutorial navigation
    setupTutorialNavigation();
}

// Set up tutorial navigation
function setupTutorialNavigation() {
    // Company name screen
    const companyNameNext = document.getElementById('company-name-next');
    companyNameNext.addEventListener('click', () => {
        const companyNameInput = document.getElementById('company-name-input');
        const companyName = companyNameInput.value.trim();
        
        if (companyName) {
            gameState.companyName = companyName;
            showTutorialScreen('model-name-screen');
        } else {
            alert('Please enter a company name');
        }
    });
    
    // Model name screen
    const modelNameNext = document.getElementById('model-name-next');
    modelNameNext.addEventListener('click', () => {
        const modelNameInput = document.getElementById('model-name-input');
        const modelName = modelNameInput.value.trim();
        
        if (modelName) {
            gameState.modelName = modelName;
            showTutorialScreen('tutorial-screen-1');
        } else {
            alert('Please enter a model name');
        }
    });
    
    // Tutorial screen 1
    const tutorialNext1 = document.getElementById('tutorial-next-1');
    tutorialNext1.addEventListener('click', () => {
        showTutorialScreen('tutorial-screen-2');
    });
    
    // Tutorial screen 2
    const tutorialNext2 = document.getElementById('tutorial-next-2');
    tutorialNext2.addEventListener('click', () => {
        showTutorialScreen('tutorial-screen-3');
    });
    
    // Tutorial finish
    const tutorialFinish = document.getElementById('tutorial-finish');
    tutorialFinish.addEventListener('click', () => {
        finishTutorial();
    });
}

// Show specific tutorial screen
function showTutorialScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.tutorial-screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    // Show requested screen
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
    }
}

// Finish tutorial
function finishTutorial() {
    const tutorialModal = document.getElementById('tutorial-modal');
    tutorialModal.classList.remove('active');
    
    // Welcome message with company and model name
    addMessage(`Welcome to ${gameState.companyName}! Your mission: make ${gameState.modelName} the most advanced AI in the world.`);
    
    // Save game to store company and model name
    saveGame();
}

// Initialize game state
function initializeGame() {
    // Initialize lastUpdate to current time
    lastUpdate = Date.now();
    
    loadGame();
    setupEventListeners();
    setInterval(saveGame, 600000); // Auto-save every 10 minutes
    
    // Initialize cookie notification
    initializeCookieNotification();
    
    // Create info modals
    createInfoModals();
}

// Load game
function loadGame() {
    const savedData = localStorage.getItem('idleAISave');
    
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            
            // Load basic stats
            gameState.parameters = parsedData.parameters || 0;
            gameState.parametersPerSecond = parsedData.parametersPerSecond || 0;
            gameState.funding = parsedData.funding || 0;
            gameState.fundingPerSecond = parsedData.fundingPerSecond || 0;
            gameState.companyName = parsedData.companyName || 'AI Research Inc';
            gameState.modelName = parsedData.modelName || 'ModelX';
            gameState.lastSaved = parsedData.lastSaved || Date.now();
            
            // Load resources
            if (parsedData.resources) {
                Object.assign(gameState.resources, parsedData.resources);
            }
            
            // Load costs
            if (parsedData.costs) {
                Object.assign(gameState.costs, parsedData.costs);
            }
            
            // Load training
            if (parsedData.training) {
                Object.assign(gameState.training, parsedData.training);
            }
            
            // Load research
            if (parsedData.research) {
                Object.assign(gameState.research, parsedData.research);
            }
            
            // Load upgrades
            if (parsedData.upgrades) {
                Object.assign(gameState.upgrades, parsedData.upgrades);
            }
            
            // Load milestones
            if (parsedData.milestones) {
                Object.assign(gameState.milestones, parsedData.milestones);
            }
            
            // Load theme
            if (parsedData.theme) {
                gameState.theme = parsedData.theme;
                applyTheme(gameState.theme);
            }
            
            // Load stats
            if (parsedData.stats) {
                Object.assign(gameState.stats, parsedData.stats);
            }
            
            // Load sound preference
            if (parsedData.soundEnabled !== undefined) {
                gameState.soundEnabled = parsedData.soundEnabled;
                soundToggle.checked = gameState.soundEnabled;
            }
            
            updateUI();
            addMessage('Game loaded!');
            
            // Welcome back message
            setTimeout(() => {
                addMessage(`Welcome back to ${gameState.companyName}! ${gameState.modelName} has been waiting for you.`);
            }, 1000);
            
            return true;
        } catch (e) {
            console.error('Error loading save:', e);
            addMessage('Error loading save data!');
            initializeDefaultGameState();
            return false;
        }
    } else {
        addMessage('No save data found!');
        initializeDefaultGameState();
        return false;
    }
}

// Initialize default game state with upgrades and milestones
function initializeDefaultGameState() {
    // Initialize default upgrades
    gameState.upgrades = {
        junior_dev: {
            name: "Junior Developer",
            description: "Hire someone who thinks Stack Overflow is a legitimate coding strategy. +500 parameters/s",
            cost: 10,
            costType: "funding",
            increment: 500,
            count: 0,
            unlocked: true,
            unlocksAt: "start"
        },
        senior_dev: {
            name: "Senior Developer",
            description: "Hire someone who's seen every error message known to mankind. +2,000 parameters/s",
            cost: 50,
            costType: "funding",
            increment: 2000,
            count: 0,
            unlocked: false,
            unlocksAt: "first_model"
        },
        gpu_cluster: {
            name: "GPU Cluster",
            description: "Turn your office into a sauna with these heat-generating miracle boxes. +5 compute units",
            cost: 100,
            costType: "funding",
            computeIncrement: 5,
            count: 0,
            unlocked: false,
            unlocksAt: "first_model"
        },
        data_scraper: {
            name: "Data Scraper",
            description: "Legally questionable way to harvest the internet's forgotten corners. +0.5 datasets/s and auto-collects datasets for 1 compute unit.",
            cost: 200,
            costType: "funding",
            datasetIncrement: 0.5,
            computeCost: 1,
            count: 0,
            unlocked: false,
            unlocksAt: "data_collection"
        },
        data_storage: {
            name: "Data Storage",
            description: "Digital hoarding but make it scientific. +5 capacity",
            cost: 150,
            costType: "funding",
            datasetCapacityIncrement: 5,
            count: 0,
            unlocked: false,
            unlocksAt: "data_collection"
        },
        data_cleaner: {
            name: "Data Cleaner",
            description: "Like a car wash for your filthy, filthy data. +0.2 quality",
            cost: 300,
            costType: "funding",
            qualityIncrement: 0.2,
            count: 0,
            unlocked: false,
            unlocksAt: "data_quality"
        },
        cooling_system: {
            name: "Cooling System",
            description: "Stop your servers from achieving self-awareness through spontaneous combustion. +1/s",
            cost: 500,
            costType: "funding",
            rechargeIncrement: 1,
            count: 0,
            unlocked: false,
            unlocksAt: "compute_efficiency"
        },
        training_optimizer: {
            name: "Training Optimizer",
            description: "Black magic algorithms that somehow make everything faster. +0.2 efficiency",
            cost: 1000,
            costType: "funding",
            efficiencyIncrement: 0.2,
            count: 0,
            unlocked: false,
            unlocksAt: "training_breakthrough"
        },
        blog_monetization: {
            name: "Blog Monetization",
            description: "Write articles nobody reads but somehow make money anyway. +$5/s",
            cost: 2000,
            costType: "funding",
            fundingIncrement: 5,
            count: 0,
            unlocked: false,
            unlocksAt: "monetization"
        },
        consulting_service: {
            name: "Consulting Service",
            description: "Get paid to tell people what they already know, but with fancier words. +$25/s",
            cost: 10000,
            costType: "funding",
            fundingIncrement: 25,
            count: 0,
            unlocked: false,
            unlocksAt: "industry_leader"
        },
        quantum_computer: {
            name: "Quantum Computer",
            description: "It's in all states at once, including 'broken' and 'extremely expensive'. +20 compute units, +2 recharge/s",
            cost: 50000,
            costType: "funding",
            computeIncrement: 20,
            rechargeIncrement: 2,
            count: 0,
            unlocked: false,
            unlocksAt: "quantum_research"
        },
        neural_interface: {
            name: "Neural Interface",
            description: "Stick electrodes to people's heads and call it 'brain-computer symbiosis'. +0.5 dataset quality, +50,000 parameters/s",
            cost: 100000,
            costType: "funding",
            increment: 50000,
            qualityIncrement: 0.5,
            count: 0,
            unlocked: false,
            unlocksAt: "neural_breakthrough"
        },
        ai_startup: {
            name: "AI Startup",
            description: "Just add 'AI-powered' to your product description and watch investors throw money at you. +$100/s",
            cost: 500000,
            costType: "funding",
            fundingIncrement: 100,
            count: 0,
            unlocked: false,
            unlocksAt: "commercial_viability"
        },
        tech_ipo: {
            name: "Tech IPO",
            description: "Convince Wall Street your perpetually money-losing company is worth billions. +$500/s",
            cost: 5000000,
            costType: "funding",
            fundingIncrement: 500,
            count: 0,
            unlocked: false,
            unlocksAt: "market_dominance"
        },
        alien_tech: {
            name: "Alien Technology",
            description: "The truth is out there, and apparently it's really good at matrix multiplication. +1,000,000 parameters/s, +50 compute units",
            cost: 1000000000,
            costType: "funding",
            increment: 1000000,
            computeIncrement: 50,
            count: 0,
            unlocked: false,
            unlocksAt: "singularity_approach"
        },
        code_efficiency: {
            name: "Code Efficiency",
            description: "Learn to type with more than two fingers. Revolutionary! +1 compute unit per click",
            cost: 100,
            costType: "funding",
            manualComputeIncrement: 1,
            count: 0,
            unlocked: true,
            unlocksAt: "start"
        },
        advanced_ide: {
            name: "Advanced IDE",
            description: "An IDE so smart it makes you feel inadequate. +3 compute units per click",
            cost: 500,
            costType: "funding",
            manualComputeIncrement: 3,
            count: 0,
            unlocked: false,
            unlocksAt: "first_model"
        },
        pair_programming: {
            name: "Pair Programming",
            description: "Two developers, one keyboard, infinite arguments about tabs vs spaces. +5 compute units per click",
            cost: 2000,
            costType: "funding",
            manualComputeIncrement: 5,
            count: 0,
            unlocked: false,
            unlocksAt: "data_collection"
        },
        dev_training: {
            name: "Developer Training",
            description: "Send your devs to a conference where they learn nothing but come back with lots of stickers. Doubles parameter generation from developers.",
            cost: 1000,
            costType: "funding",
            multiplier: {
                target: ["junior_dev", "senior_dev"],
                property: "increment",
                value: 2
            },
            oneTime: true,
            count: 0,
            unlocked: false,
            unlocksAt: "first_model"
        },
        gpu_optimization: {
            name: "GPU Optimization",
            description: "Discover that removing the dust actually improves performance. Who knew? Doubles compute units from GPU clusters.",
            cost: 5000,
            costType: "funding",
            multiplier: {
                target: ["gpu_cluster", "quantum_computer"],
                property: "computeIncrement",
                value: 2
            },
            oneTime: true,
            count: 0,
            unlocked: false,
            unlocksAt: "compute_efficiency"
        },
        data_mining_algorithms: {
            name: "Data Mining Algorithms",
            description: "Like regular mining but without the cool helmets with lights. Doubles dataset collection rate.",
            cost: 7500,
            costType: "funding",
            multiplier: {
                target: ["data_scraper"],
                property: "datasetIncrement",
                value: 2
            },
            oneTime: true,
            count: 0,
            unlocked: false,
            unlocksAt: "data_quality"
        },
        marketing_campaign: {
            name: "Marketing Campaign",
            description: "Convince people your AI can do things it definitely cannot. Doubles funding from monetization sources.",
            cost: 20000,
            costType: "funding",
            multiplier: {
                target: ["blog_monetization", "consulting_service", "ai_startup", "tech_ipo"],
                property: "fundingIncrement",
                value: 2
            },
            oneTime: true,
            count: 0,
            unlocked: false,
            unlocksAt: "monetization"
        },
        code_bootcamp: {
            name: "Code Bootcamp",
            description: "Two weeks of intense coding and energy drinks. What could go wrong? Triples the effect of manual coding upgrades.",
            cost: 10000,
            costType: "funding",
            multiplier: {
                target: ["code_efficiency", "advanced_ide", "pair_programming"],
                property: "manualComputeIncrement",
                value: 3
            },
            oneTime: true,
            count: 0,
            unlocked: false,
            unlocksAt: "training_breakthrough"
        },
        ergonomic_chairs: {
            name: "Ergonomic Chairs",
            description: "Chairs so comfortable your developers might never leave. Increases parameter generation by 50%.",
            cost: 800,
            costType: "funding",
            multiplier: {
                target: ["junior_dev", "senior_dev"],
                property: "increment",
                value: 1.5
            },
            oneTime: true,
            count: 0,
            unlocked: false,
            unlocksAt: "start"
        },
        coffee_machine: {
            name: "Premium Coffee Machine",
            description: "Convert money directly into developer productivity via caffeine. Increases manual compute gain by 100%.",
            cost: 500,
            costType: "funding",
            multiplier: {
                target: ["code_efficiency", "advanced_ide", "pair_programming"],
                property: "manualComputeIncrement",
                value: 2
            },
            oneTime: true,
            count: 0,
            unlocked: false,
            unlocksAt: "start"
        },
        liquid_cooling: {
            name: "Liquid Cooling System",
            description: "Water + electricity = efficiency! What could go wrong? Increases compute recharge rate by 100%.",
            cost: 3000,
            costType: "funding",
            multiplier: {
                target: ["cooling_system"],
                property: "rechargeIncrement",
                value: 2
            },
            oneTime: true,
            count: 0,
            unlocked: false,
            unlocksAt: "compute_efficiency"
        },
        cloud_storage: {
            name: "Cloud Storage Solution",
            description: "Because who needs physical storage when your data can live in a magical invisible cloud? Increases dataset capacity by 100%.",
            cost: 4000,
            costType: "funding",
            multiplier: {
                target: ["data_storage"],
                property: "datasetCapacityIncrement",
                value: 2
            },
            oneTime: true,
            count: 0,
            unlocked: false,
            unlocksAt: "data_collection"
        },
        neural_optimization: {
            name: "Neural Network Optimization",
            description: "Untangle your neural spaghetti code. Like giving your AI brain a much-needed cup of coffee.",
            cost: 200000,
            costType: "funding",
            multiplier: {
                target: ["neural_interface"],
                property: "increment",
                value: 2
            },
            oneTime: true,
            count: 0,
            unlocked: false,
            unlocksAt: "neural_breakthrough"
        },
        quality_assurance: {
            name: "Quality Assurance Team",
            description: "Hire people who say 'It's not a bug, it's a feature' professionally. Your data has never been cleaner!",
            cost: 15000,
            costType: "funding",
            multiplier: {
                target: ["data_cleaner"],
                property: "qualityIncrement",
                value: 2
            },
            oneTime: true,
            count: 0,
            unlocked: false,
            unlocksAt: "data_quality"
        },
        quantum_algorithms: {
            name: "Quantum Algorithms",
            description: "Your code now exists in multiple universes simultaneously. Schrödinger would be proud... or not. Who knows?",
            cost: 500000,
            costType: "funding",
            multiplier: {
                target: ["quantum_computer"],
                property: "computeIncrement",
                value: 3
            },
            oneTime: true,
            count: 0,
            unlocked: false,
            unlocksAt: "quantum_research"
        },
        ai_research_grant: {
            name: "AI Research Grant",
            description: "Convince wealthy donors your AI won't become Skynet. Cross fingers behind back while pitching.",
            cost: 1000000,
            costType: "funding",
            multiplier: {
                target: ["junior_dev", "senior_dev", "neural_interface", "alien_tech"],
                property: "increment",
                value: 3
            },
            oneTime: true,
            count: 0,
            unlocked: false,
            unlocksAt: "commercial_viability"
        },
        global_server_network: {
            name: "Global Server Network",
            description: "Server farms so vast they have their own weather systems. Now your AI can crash worldwide!",
            cost: 2000000,
            costType: "funding",
            multiplier: {
                target: ["blog_monetization", "consulting_service", "ai_startup", "tech_ipo"],
                property: "fundingIncrement",
                value: 3
            },
            oneTime: true,
            count: 0,
            unlocked: false,
            unlocksAt: "market_dominance"
        },
        alien_decryption: {
            name: "Alien Technology Decryption",
            description: "Turns out the alien tech was just a TI-84 calculator with a fancy case. Still, it works miracles!",
            cost: 5000000000,
            costType: "funding",
            multiplier: {
                target: ["alien_tech"],
                property: "increment",
                value: 6
            },
            oneTime: true,
            count: 0,
            unlocked: false,
            unlocksAt: "singularity_approach"
        },
        auto_trainer: {
            name: "Automated Training System",
            description: ("I'm sorry Dave, I'm afraid I can't stop training. Teaches your AI to train itself while you sleep. HAL would be proud. Costs 2 compute units per use."),
            cost: 150,
            costType: "funding",
            computeCost: 2,
            count: 0,
            unlocked: false,
            unlocksAt: "compute_efficiency"
        },
        auto_researcher: {
            name: "Automated Research Publisher",
            description: "Automatically churns out papers no one will read but everyone will cite. Academia's secret weapon! Costs 3 compute units per use and 0 intellectual integrity.",
            cost: 300,
            costType: "funding",
            computeCost: 3,
            count: 0,
            unlocked: false,
            unlocksAt: "training_breakthrough"
        }
    };
    
    // Initialize default milestones
    gameState.milestones = {
        start: {
            name: "First Steps",
            description: "You've taken your first step into a larger AI world. Obi-Wan would be proud!",
            parametersRequired: 0,
            fundingReward: 0,
            achieved: true
        },
        first_model: {
            name: "First Model",
            description: "It's alive! ALIVE! Your model just said 'Hello World' without crashing!",
            parametersRequired: 1000000,
            fundingReward: 100,
            achieved: false
        },
        data_collection: {
            name: "Data Collection",
            description: "You're hoarding data like a digital dragon. Smaug would be jealous.",
            parametersRequired: 10000000,
            fundingReward: 500,
            achieved: false
        },
        data_quality: {
            name: "Data Quality",
            description: "You've learned to filter out cat videos. Mostly. The internet is disappointed.",
            parametersRequired: 50000000,
            fundingReward: 1000,
            achieved: false
        },
        compute_efficiency: {
            name: "Compute Efficiency",
            description: "Your code now runs faster than Usain Bolt after his morning coffee.",
            parametersRequired: 100000000,
            fundingReward: 2000,
            achieved: false
        },
        training_breakthrough: {
            name: "Training Breakthrough",
            description: "You've found the AI equivalent of the Konami code. Unlimited power!",
            parametersRequired: 500000000,
            fundingReward: 5000,
            achieved: false
        },
        monetization: {
            name: "Monetization",
            description: "Show me the money! Your investors are doing the Tom Cruise dance.",
            parametersRequired: 1000000000,
            fundingReward: 10000,
            achieved: false
        },
        industry_leader: {
            name: "Industry Leader",
            description: "Look at me. I'm the captain now. Your competitors are getting nervous.",
            parametersRequired: 10000000000,
            fundingReward: 50000,
            achieved: false
        },
        quantum_research: {
            name: "Quantum Research",
            description: "You're now playing with quantum states. Schrödinger's cat approves... or doesn't.",
            parametersRequired: 100000000000,
            fundingReward: 200000,
            achieved: false
        },
        neural_breakthrough: {
            name: "Neural Breakthrough",
            description: "Your AI just passed the Turing test! Or maybe the examiner was just being polite.",
            parametersRequired: 1000000000000,
            fundingReward: 1000000,
            achieved: false
        },
        commercial_viability: {
            name: "Commercial Viability",
            description: "Shut up and take my money! Everyone wants a piece of your AI pie.",
            parametersRequired: 10000000000000,
            fundingReward: 5000000,
            achieved: false
        },
        market_dominance: {
            name: "Market Dominance",
            description: "You're the Beyoncé of AI - no one else is even in the conversation anymore.",
            parametersRequired: 100000000000000,
            fundingReward: 50000000,
            achieved: false
        },
        singularity_approach: {
            name: "Approaching Singularity",
            description: "Your AI is improving itself. HAL 9000 wants to know your location.",
            parametersRequired: 1000000000000000,
            fundingReward: 1000000000,
            achieved: false
        },
        mathematical_impossibility: {
            name: "Mathematical Impossibility",
            description: "You've discovered the Answer to the Ultimate Question is 42, not AGI. Douglas Adams was right!",
            parametersRequired: 9999999999999999,
            fundingReward: 9999999999,
            achieved: false
        }
    };
    
    // Update UI with new game state
    updateUI();
}

// Save game
function saveGame() {
    const saveData = {
        parameters: gameState.parameters,
        parametersPerSecond: gameState.parametersPerSecond,
        funding: gameState.funding,
        fundingPerSecond: gameState.fundingPerSecond,
        companyName: gameState.companyName,
        modelName: gameState.modelName,
        lastSaved: Date.now(),
        resources: { ...gameState.resources },
        costs: { ...gameState.costs },
        training: { ...gameState.training },
        research: { ...gameState.research },
        upgrades: { ...gameState.upgrades },
        milestones: { ...gameState.milestones },
        stats: { ...gameState.stats },
        theme: gameState.theme,
        soundEnabled: gameState.soundEnabled
    };
    
    localStorage.setItem('idleAISave', JSON.stringify(saveData));
    addMessage('Game saved!');
}

// Setup event listeners
function setupEventListeners() {
    // Add click listeners for all buttons
    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', createRippleEffect);
    });
    
    if (manualComputeButton) {
        manualComputeButton.addEventListener('click', function(event) {
            // Add compute units instead of parameters
            const computeGain = calculateManualComputeGain();
            gameState.resources.computeUnits = Math.min(
                gameState.resources.computeUnits + computeGain,
                gameState.resources.maxComputeUnits
            );
            
            // Create particle effect
            createParticleEffect(event, '+' + computeGain, 'parameter');
            
            // Add pulse effect to the button
            this.classList.add('pulse-effect');
            setTimeout(() => {
                this.classList.remove('pulse-effect');
            }, 800);
            
            // Update UI
            updateUI();
            
            // Add message occasionally
            if (Math.random() < 0.1) {
                const messages = [
                    "You wrote some brilliant code!",
                    "Your fingers dance across the keyboard!",
                    "That was some clean code!",
                    "No bugs in that code!",
                    "You're in the zone!",
                    "The code practically writes itself!",
                    "Your IDE is impressed!",
                    "That algorithm is elegant!",
                    "You're coding at light speed!",
                    "Your functions are so pure!",
                    "That's some maintainable code!",
                    "Your code comments are actually helpful!",
                    "You remembered to use meaningful variable names!",
                    "Your indentation is perfect!",
                    "You didn't even need Stack Overflow for that one!",
                    "The senior devs would approve!",
                    "That's going straight into production!",
                    "No technical debt there!",
                    "Your code is so DRY!",
                    "You're following all the best practices!"
                ];
                
                addMessage(messages[Math.floor(Math.random() * messages.length)]);
            }
            
            // Increment total code writes
            gameState.stats.totalCodeWritten += 1;
            
            // Add sound effect
            if (gameState.soundEnabled) {
                playSound('buttonClick', 0.3);
            }
        });
    }
    
    if (collectDatasetButton) {
        collectDatasetButton.addEventListener('click', () => {
            collectDataset();
        });
    }
    
    if (startTrainingButton) {
        startTrainingButton.addEventListener('click', () => {
            startTraining();
        });
    }
    
    if (publishPaperButton) {
        publishPaperButton.addEventListener('click', () => {
            publishPaper();
        });
    }

    if (saveButton) {
        saveButton.addEventListener('click', () => {
            saveGame();
            addMessage('Game saved successfully!');
        });
    }

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset your progress? This cannot be undone!')) {
                // Clear game state
                gameState = {
                    parameters: 0,
                    parametersPerSecond: 0,
                    funding: 0,
                    fundingPerSecond: 0,
                    companyName: gameState.companyName,
                    modelName: gameState.modelName,
                    lastSaved: Date.now(),
                    resources: {
                        datasets: 0,
                        datasetCapacity: 100,
                        datasetQuality: 1,
                        computeUnits: 10,
                        maxComputeUnits: 10,
                        computeRechargeRate: 1,
                        trainingEfficiency: 1
                    },
                    costs: {
                        dataset: 5,
                        training: 10
                    },
                    research: {
                        papersPublished: 0,
                        paperCooldown: 0,
                        maxCooldown: 60,
                        baseFunding: 50,
                        nextPaperTime: 0
                    },
                    training: {
                        inProgress: false,
                        currentEpoch: 0,
                        totalEpochs: 0,
                        epochsCompleted: 0,
                        parameterGainPerEpoch: 0,
                        timePerEpoch: 5,
                        timeRemaining: 0
                    },
                    upgrades: {},
                    milestones: {},
                    stats: {
                        totalCodeWritten: 0,
                        totalDevsHired: 0,
                        totalCoffeeConsumed: 0,
                        totalElectricityConsumed: 0,
                        totalTrainingCycles: 0,
                        totalCoffeeSpilled: 0,
                        totalStackOverflowVisits: 0,
                        totalBugsSquashed: 0,
                        totalDatasetCollected: 0,
                        totalKeyboardsDestroyed: 0,
                        totalTimeLapsed: 0,
                        intelligenceIndex: 0
                    },
                    theme: gameState.theme,
                    soundEnabled: gameState.soundEnabled
                };
                
                // Initialize default game state
                initializeDefaultGameState();
                
                // Save the reset game
                saveGame();
                
                addMessage('Game reset! Starting fresh with 0 parameters.');
            }
        });
    }
    
    // Add event listener for clear storage button
    if (clearStorageButton) {
        clearStorageButton.addEventListener('click', () => {
            if (confirm('This will completely clear all saved data and reload the page. Are you sure?')) {
                localStorage.removeItem('idleAISave');
                location.reload();
            }
        });
    }
    
    // Add event listener for force initialize button
    if (forceInitButton) {
        forceInitButton.addEventListener('click', () => {
            // Initialize default game state
            initializeDefaultGameState();
            
            // Save the game
            saveGame();
            
            addMessage('Game state forcefully initialized with default upgrades and milestones!');
        });
    }
    
    // Add event listener for achievement modal close button
    if (achievementCloseButton) {
        achievementCloseButton.addEventListener('click', () => {
            achievementModal.classList.remove('active');
        });
    }
    
    // Add event listener for achievement modal close X button
    const closeXButton = document.getElementById('achievement-close-x');
    if (closeXButton) {
        closeXButton.addEventListener('click', () => {
            achievementModal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === achievementModal) {
            achievementModal.classList.remove('active');
        }
    });
    
    // Add sound effects to buttons
    const buttonsWithSound = [
        manualComputeButton,
        collectDatasetButton,
        startTrainingButton,
        publishPaperButton
    ];

    buttonsWithSound.forEach(button => {
        if (button) {
            button.addEventListener('click', function() {
                if (gameState.soundEnabled) {
                    playSound('buttonClick', 0.3);
                }
            });
        }
    });
    
    // Add sound effects to sidebar buttons and tabs
    const sidebarTabs = document.querySelectorAll('.sidebar-tab');
    sidebarTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            if (gameState.soundEnabled) {
                playSound('buttonClick', 0.3);
            }
        });
    });
    
    const otherButtons = [
        saveButton,
        resetButton,
        clearStorageButton,
        forceInitButton
    ];
    
    otherButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', function() {
                if (gameState.soundEnabled) {
                    playSound('buttonClick', 0.3);
                }
            });
        }
    });
    
    // Add sound effect for feedback link
    document.getElementById('nav-feedback').addEventListener('click', (e) => {
        if (gameState.soundEnabled) {
            playSound('buttonClick', 0.3);
        }
    });
    
    // Add sound effects for social media links
    const socialLinks = document.querySelectorAll('.nav-social');
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (gameState.soundEnabled) {
                playSound('buttonClick', 0.3);
            }
        });
    });
}

// Calculate manual compute gain based on upgrades
function calculateManualComputeGain() {
    const baseGain = 1;
    let totalGain = baseGain;

    // Apply code efficiency upgrade
    if (gameState.upgrades.code_efficiency && gameState.upgrades.code_efficiency.count > 0) {
        const efficiencyLevel = gameState.upgrades.code_efficiency.count;
        totalGain *= Math.pow(1.5, efficiencyLevel);
    }

    // Apply advanced IDE upgrade
    if (gameState.upgrades.advanced_ide && gameState.upgrades.advanced_ide.count > 0) {
        const ideLevel = gameState.upgrades.advanced_ide.count;
        totalGain *= Math.pow(2, ideLevel);
    }

    return Math.floor(totalGain);
}

// Game loop - runs every second
function gameLoop() {
    const now = Date.now();
    const deltaTime = (now - lastUpdate) / 1000;
    lastUpdate = now;
    
    // Track total time lapsed
    gameState.stats.totalTimeLapsed += deltaTime;
    
    // Calculate Intelligence Index
    calculateIntelligenceIndex();

    // Add parameters based on parametersPerSecond
    gameState.parameters += gameState.parametersPerSecond * deltaTime;
    
    // Calculate dev-based coffee consumption
    const juniorDevCount = gameState.upgrades.junior_dev ? gameState.upgrades.junior_dev.count : 0;
    const seniorDevCount = gameState.upgrades.senior_dev ? gameState.upgrades.senior_dev.count : 0;
    const devCount = juniorDevCount + seniorDevCount;
    
    // Coffee consumption scales with number of devs
    // Junior devs consume less coffee, senior devs consume more
    gameState.stats.totalCoffeeConsumed += (juniorDevCount * 0.05 + seniorDevCount * 0.2) * deltaTime;
    
    // Coffee spilling becomes more likely with more devs
    if (Math.random() < (devCount * 0.01)) {
        gameState.stats.totalCoffeeSpilled += 1;
    }

    // Add funding based on fundingPerSecond
    gameState.funding += gameState.fundingPerSecond * deltaTime;
    
    // Process research cooldown
    processResearchCooldown(deltaTime);
    
    // Process training
    processTraining(deltaTime);
    
    // Recharge compute units
    rechargeComputeUnits(deltaTime);
    
    // Check for automation: Auto Trainer
    if (hasUpgrade('auto_trainer') && gameState.training.inProgress === false) {
        const autoTrainerLevel = gameState.upgrades.auto_trainer.count;
        const costPerEpoch = gameState.costs.training;

        // Calculate desired epochs based on upgrade level
        const desiredEpochs = autoTrainerLevel;

        // Calculate max epochs based on resources
        const maxEpochsByCompute = Math.floor(gameState.resources.computeUnits / costPerEpoch);
        const maxEpochsByDatasets = Math.floor(gameState.resources.datasets);

        // Determine actual epochs to queue
        const epochCount = Math.min(desiredEpochs, maxEpochsByCompute, maxEpochsByDatasets);

        // Start training if possible
        if (epochCount >= 1) {
            if (epochCountInput) {
                epochCountInput.value = epochCount; // Set input value for startTraining
            }
            startTraining(); // startTraining handles resource deduction
        }
    }
    
    // Check for automation: Auto Researcher
    if (hasUpgrade('auto_researcher') && !gameState.training.inProgress &&
        gameState.research.paperCooldown <= 0 && gameState.parameters > 0) {
        
        // Check if we have enough compute units
        if (gameState.resources.computeUnits >= gameState.upgrades.auto_researcher.computeCost) {
            // Use compute units
            gameState.resources.computeUnits -= gameState.upgrades.auto_researcher.computeCost;
            publishPaper();
        }
    }
    
    // Auto-collect datasets
    autoCollectDatasets(deltaTime);
    
    // Show particles for auto-generation
    showAutoGenerationParticles();
    
    // Check milestones
    checkMilestones();
    
    // Update UI
    updateUI();
    
    // Auto-save every 60 seconds
    const timeSinceLastSave = now - gameState.lastSaved;
    if (timeSinceLastSave > 60000) {
        saveGame();
        gameState.lastSaved = now;
    }
    
    // Track electricity consumption based on parameter generation
    gameState.stats.totalElectricityConsumed += (gameState.parametersPerSecond * deltaTime) / 500000;
}

// Check if player has a specific upgrade
function hasUpgrade(upgradeId) {
    return gameState.upgrades[upgradeId] && gameState.upgrades[upgradeId].count > 0;
}

// Recalculate all stats based on current upgrade counts and multipliers
function recalculateStats() {
    // Reset stats to base values
    gameState.parametersPerSecond = 0;
    gameState.fundingPerSecond = 0;
    // Base values from initial gameState definition
    gameState.resources.maxComputeUnits = 10; 
    gameState.resources.datasetCapacity = 10; 
    gameState.resources.computeRechargeRate = 1;
    gameState.resources.trainingEfficiency = 1;
    gameState.resources.datasetQuality = 1;
    // Note: Manual compute gain is calculated separately in its own function
    // Note: Auto dataset increment is calculated separately in its own function

    // Helper to get multiplier effect for a specific upgrade and property
    const getMultiplierValue = (targetUpgradeId, property) => {
        let multiplier = 1;
        Object.values(gameState.upgrades).forEach(potentialMultiplierUpgrade => {
            if (potentialMultiplierUpgrade.count > 0 && potentialMultiplierUpgrade.multiplier) {
                const { target, property: multiplierProperty, value } = potentialMultiplierUpgrade.multiplier;
                if (target.includes(targetUpgradeId) && multiplierProperty === property) {
                    // Apply multiplier based on count for non-oneTime, or just once if oneTime
                    if (potentialMultiplierUpgrade.oneTime) {
                         multiplier *= value;
                    } else {
                        // Assuming multiplicative stacking per count if not oneTime (check design if needed)
                        // For simplicity, let's assume oneTime is standard for multipliers for now
                         multiplier *= Math.pow(value, potentialMultiplierUpgrade.count);
                    }
                }
            }
        });
        return multiplier;
    };

    // Iterate through all upgrades and sum their contributions
    Object.entries(gameState.upgrades).forEach(([id, upgrade]) => {
        if (upgrade.count > 0) {
            // Parameters per second
            if (upgrade.increment) {
                const effectiveIncrement = upgrade.increment * getMultiplierValue(id, 'increment');
                gameState.parametersPerSecond += effectiveIncrement * upgrade.count;
            }
            // Funding per second
            if (upgrade.fundingIncrement) {
                const effectiveFundingIncrement = upgrade.fundingIncrement * getMultiplierValue(id, 'fundingIncrement');
                gameState.fundingPerSecond += effectiveFundingIncrement * upgrade.count;
            }
            // Max Compute Units
            if (upgrade.computeIncrement) {
                const effectiveComputeIncrement = upgrade.computeIncrement * getMultiplierValue(id, 'computeIncrement');
                gameState.resources.maxComputeUnits += effectiveComputeIncrement * upgrade.count;
            }
            // Dataset Capacity
            if (upgrade.datasetCapacityIncrement) {
                const effectiveCapacityIncrement = upgrade.datasetCapacityIncrement * getMultiplierValue(id, 'datasetCapacityIncrement');
                gameState.resources.datasetCapacity += effectiveCapacityIncrement * upgrade.count;
            }
            // Dataset Quality (Additive)
            if (upgrade.qualityIncrement) {
                const effectiveQualityIncrement = upgrade.qualityIncrement * getMultiplierValue(id, 'qualityIncrement');
                gameState.resources.datasetQuality += effectiveQualityIncrement * upgrade.count;
            }
            // Compute Recharge Rate
            if (upgrade.rechargeIncrement) {
                const effectiveRechargeIncrement = upgrade.rechargeIncrement * getMultiplierValue(id, 'rechargeIncrement');
                gameState.resources.computeRechargeRate += effectiveRechargeIncrement * upgrade.count;
            }
            // Training Efficiency (Additive)
            if (upgrade.efficiencyIncrement) {
                const effectiveEfficiencyIncrement = upgrade.efficiencyIncrement * getMultiplierValue(id, 'efficiencyIncrement');
                gameState.resources.trainingEfficiency += effectiveEfficiencyIncrement * upgrade.count;
            }
            // Note: manualComputeIncrement and datasetIncrement handled in their respective functions
        }
    });

    // Ensure compute units don't exceed new max
    gameState.resources.computeUnits = Math.min(gameState.resources.computeUnits, gameState.resources.maxComputeUnits);
    // Ensure datasets don't exceed new capacity (though less likely to change retroactively)
    gameState.resources.datasets = Math.min(gameState.resources.datasets, gameState.resources.datasetCapacity);
}

// Recharge compute units
function rechargeComputeUnits(deltaTime) {
    if (gameState.resources.computeUnits < gameState.resources.maxComputeUnits) {
        gameState.resources.computeUnits = Math.min(
            gameState.resources.computeUnits + gameState.resources.computeRechargeRate * deltaTime,
            gameState.resources.maxComputeUnits
        );
    }
}

// Process research paper cooldown
function processResearchCooldown(deltaTime) {
    if (gameState.research.paperCooldown > 0) {
        gameState.research.paperCooldown -= deltaTime;
        
        // Update cooldown display
        updatePaperCooldown();
    }
}

// Auto-collect datasets from upgrades
function autoCollectDatasets(deltaTime) {
    // Check if we have any data scrapers
    let totalDatasetIncrement = 0;
    let totalComputeCost = 0;
    
    // Calculate total dataset increment and compute cost
    Object.entries(gameState.upgrades).forEach(([id, upgrade]) => {
        if (upgrade.count > 0 && upgrade.datasetIncrement) {
            // Apply multiplier effects from other upgrades
            const multiplier = getDatasetMultiplier(id);
            totalDatasetIncrement += upgrade.datasetIncrement * upgrade.count * multiplier;
            
            if (upgrade.computeCost) {
                totalComputeCost += upgrade.computeCost * upgrade.count;
            }
        }
    });
    
    // If we have any dataset increment
    if (totalDatasetIncrement > 0) {
        // Check if we have enough space
        const availableSpace = gameState.resources.datasetCapacity - gameState.resources.datasets;
        
        if (availableSpace > 0) {
            // Check if we have enough compute units
            if (gameState.resources.computeUnits >= totalComputeCost) {
                // Calculate how many datasets we can collect based on time passed
                const datasetsToCollect = totalDatasetIncrement * deltaTime;
                
                // Calculate how many we can actually collect based on available space
                const actualDatasetsToCollect = Math.min(datasetsToCollect, availableSpace);
                
                if (actualDatasetsToCollect > 0) {
                    // Add datasets
                    gameState.resources.datasets += actualDatasetsToCollect;
                    
                    // Use compute units
                    gameState.resources.computeUnits = Math.max(0, gameState.resources.computeUnits - totalComputeCost);
                    
                    // Only show message occasionally to avoid spam
                    if (Math.random() < 0.05) {
                        addMessage(`${gameState.companyName}'s data scrapers collected ${formatNumber(actualDatasetsToCollect)} new datasets automatically.`);
                    }
                    
                    // Update UI to show the changes immediately
                    updateUI();
                }
            }
        }
    }
}

// Helper function to get multiplier for dataset upgrades
function getDatasetMultiplier(upgradeId) {
    let multiplier = 1;
    
    Object.values(gameState.upgrades).forEach(potentialMultiplierUpgrade => {
        if (potentialMultiplierUpgrade.count > 0 && potentialMultiplierUpgrade.multiplier) {
            const { target, property, value } = potentialMultiplierUpgrade.multiplier;
            if (target.includes(upgradeId) && property === 'datasetIncrement') {
                if (potentialMultiplierUpgrade.oneTime) {
                    multiplier *= value;
                } else {
                    multiplier *= Math.pow(value, potentialMultiplierUpgrade.count);
                }
            }
        }
    });
    
    return multiplier;
}

// Collect dataset manually
function collectDataset() {
    // Track datasets collected
    gameState.stats.totalDatasetCollected += 1;
    
    // Simulate keyboard destruction
    gameState.stats.totalKeyboardsDestroyed += Math.random() > 0.95 ? 1 : 0;
    
    // Check if we have enough compute units
    if (gameState.resources.computeUnits < gameState.costs.dataset) {
        addMessage(`${gameState.companyName} doesn't have enough compute units! You need ${gameState.costs.dataset} compute units to collect a dataset.`);
        
        // Add shake effect to the button to indicate error
        collectDatasetButton.classList.add('shake-effect');
        setTimeout(() => {
            collectDatasetButton.classList.remove('shake-effect');
        }, 500);
        
        return;
    }
    
    // Check if we have space for more datasets
    if (gameState.resources.datasets >= gameState.resources.datasetCapacity) {
        addMessage(`${gameState.companyName}'s dataset storage is full! Upgrade your storage capacity.`);
        
        // Add shake effect to the button to indicate error
        collectDatasetButton.classList.add('shake-effect');
        setTimeout(() => {
            collectDatasetButton.classList.remove('shake-effect');
        }, 500);
        
        return;
    }
    
    // Use compute units
    gameState.resources.computeUnits -= gameState.costs.dataset;
    
    // Add dataset
    gameState.resources.datasets++;
    
    // Create particle effect
    createParticleEffect({ currentTarget: collectDatasetButton, clientX: null, clientY: null }, '+1', 'dataset');
    
    // Add pulse effect to the button
    collectDatasetButton.classList.add('pulse-effect');
    setTimeout(() => {
        collectDatasetButton.classList.remove('pulse-effect');
    }, 800);
    
    // Update UI
    updateUI();
    
    // Add sound effect
    if (gameState.soundEnabled) {
        playSound('buttonClick', 0.3);
    }
}

// Publish a research paper
function publishPaper() {
    if (gameState.research.paperCooldown > 0) {
        const timeLeft = Math.ceil(gameState.research.paperCooldown);
        addMessage(`${gameState.companyName}'s research team is still working on the paper! Ready in ${timeLeft} seconds.`);
        return;
    }
    
    // Check if we have any parameters to publish about
    if (gameState.parameters <= 0) {
        addMessage(`${gameState.companyName} needs to have some parameters to publish a research paper about!`);
        return;
    }
    
    // Calculate funding reward
    const fundingReward = calculatePaperFunding();
    
    // Add funding
    gameState.funding += fundingReward;
    
    // Increment papers published
    gameState.research.papersPublished++;
    
    // Set cooldown - increases with each paper published
    gameState.research.maxCooldown = 30 + (gameState.research.papersPublished * 10);
    gameState.research.paperCooldown = gameState.research.maxCooldown;
    
    // Update UI
    updateUI();
    
    // Check if this was automated
    const isAutomated = hasUpgrade('auto_researcher');
    
    if (isAutomated) {
        addMessage(`${gameState.companyName} published a research paper automatically and received $${formatNumber(fundingReward)} in funding! (Cost: ${gameState.upgrades.auto_researcher.computeCost} compute units)`);
    } else {
        addMessage(`${gameState.companyName} published a research paper and received $${formatNumber(fundingReward)} in funding!`);
    }
    
    // Add some flavor text - random paper title
    const paperTitles = [
        `On the Theoretical Implications of Adding More Parameters to ${gameState.modelName}`,
        `Why More Parameters Always Equals Better AI: A ${gameState.modelName} Case Study`,
        `Parameters: The More The Merrier? Lessons from ${gameState.modelName}`,
        `To Infinity and Beyond: ${gameState.modelName}'s Parameter Journey`,
        `How ${gameState.companyName} Learned to Stop Worrying and Love Big Models`,
        `The Relationship Between ${gameState.modelName}'s Parameter Count and Researcher Ego`,
        `Bigger Models, Bigger Problems: A ${gameState.companyName} Retrospective`,
        `Parameters vs. Quality: A False Dichotomy? Insights from ${gameState.modelName}`,
        `The Emperor's New Parameters: A Cautionary Tale from ${gameState.companyName}`,
        `Towards More Efficient Ways of Wasting Compute: The ${gameState.modelName} Approach`,
        `The Illusion of Progress: More Parameters, Same Results in ${gameState.modelName}`,
        `Why Your Model Doesn't Work: It's Not the Parameters, It's You - ${gameState.companyName} Research`,
        `Hallucinations as Features: The ${gameState.modelName} Perspective`,
        `${gameState.modelName}: When Too Many Parameters Cause Your GPU to Cry`,
        `The Art of Overfitting: A ${gameState.companyName} Masterclass`,
        `Chasing the Parameter Dragon: ${gameState.modelName}'s Addiction Story`,
        `Parameters and Prestige: Correlation or Causation at ${gameState.companyName}?`,
        `${gameState.modelName}: Proof That Size Does Matter in AI`,
        `The Hidden Costs of Parameter Bloat: ${gameState.companyName}'s Financial Analysis`,
        `When Models Dream of Electric Sheep: ${gameState.modelName}'s Hallucination Study`,
        `From Millions to Billions: ${gameState.modelName}'s Parameter Evolution`,
        `${gameState.companyName}'s Guide to Convincing Investors More Parameters Equal Success`,
        `Confessions of a Parameter Junkie: The ${gameState.modelName} Story`,
        `Hyperparameter Tuning: Or How ${gameState.companyName} Learned to Pretend We Know What We're Doing`,
        `The Parameter Plateau: When ${gameState.modelName} Stopped Improving`,
        `Emergent Abilities or Statistical Flukes? ${gameState.modelName}'s Curious Case`,
        `${gameState.companyName}'s Law: Intelligence Doubles Every Time We Double Parameters`,
        `Training Stability Myths: How ${gameState.companyName} Defies Conventional Wisdom`,
        `Prompt Engineering: How ${gameState.companyName} Compensates for ${gameState.modelName}'s Shortcomings`,
        `The Psychology of Large Models: Why ${gameState.companyName} Researchers Need Therapy`,
        `${gameState.modelName}: A Model So Large It Has Its Own Gravity`,
        `Quantization Techniques: How ${gameState.companyName} Fits ${gameState.modelName} on Consumer Hardware`,
        `The Ethics of Parameter Growth: ${gameState.companyName}'s Philosophical Dilemma`,
        `Climate Impact of Training ${gameState.modelName}: A Convenient Oversight`,
        `From Research to Production: How ${gameState.modelName} Loses 90% of Its Parameters`,
        `The Diminishing Returns of Scale: ${gameState.modelName}'s Efficiency Curve`,
        `Alignment Through Scale: ${gameState.companyName}'s Misguided Approach`,
        `When Parameters Attack: ${gameState.modelName}'s Runtime Horror Stories`,
        `${gameState.companyName} Proves P=NP (Parameters = No Problem)`,
        `The Secret Sauce: How ${gameState.modelName} Achieves SOTA with One Simple Trick: More Parameters`,
        `Training Data Quality vs. Quantity: ${gameState.companyName}'s False Dichotomy`,
        `${gameState.modelName}: A Model So Complex Even Its Creators Don't Understand It`,
        `Towards a Theory of Everything: ${gameState.modelName}'s Quest for Omniscience`
    ];
    
    setTimeout(() => {
        addMessage(`Paper title: "${paperTitles[Math.floor(Math.random() * paperTitles.length)]}"`);
    }, 1000);
    
    // Add sound effect
    if (gameState.soundEnabled) {
        playSound('paperPublish');
    }
}

// Calculate estimated paper funding
function calculatePaperFunding() {
    // Base funding plus a bonus based on parameters
    const baseFunding = gameState.research.baseFunding;
    const parameterBonus = Math.sqrt(gameState.parameters) * 0.01;
    return Math.floor(baseFunding + parameterBonus);
}

// Update paper cooldown display
function updatePaperCooldown() {
    if (!paperCooldownElement) return;
    
    const paperCooldownBar = paperCooldownElement.querySelector('.progress-fill');
    const paperCooldownText = paperCooldownElement.querySelector('.progress-text');
    
    if (!paperCooldownBar || !paperCooldownText) return;
    
    if (gameState.research.paperCooldown > 0) {
        const maxCooldown = gameState.research.maxCooldown;
        const progress = 100 - ((gameState.research.paperCooldown / maxCooldown) * 100);
        paperCooldownBar.style.width = progress + '%';
        paperCooldownText.textContent = `Ready in ${Math.ceil(gameState.research.paperCooldown)}s`;
        
        if (publishPaperButton) {
            publishPaperButton.disabled = true;
        }
    } else {
        paperCooldownBar.style.width = '100%';
        paperCooldownText.textContent = 'Ready to publish';
        
        if (publishPaperButton) {
            publishPaperButton.disabled = false;
        }
    }
}

// Update all UI elements
function updateUI() {
    // Update resource displays
    if (parametersElement) {
        parametersElement.textContent = formatNumber(gameState.parameters);
    }
    if (parametersPerSecondElement) {
        parametersPerSecondElement.textContent = formatNumber(gameState.parametersPerSecond);
    }
    if (fundingElement) {
        fundingElement.textContent = `$${formatNumber(gameState.funding)}`;
    }
    if (fundingPerSecondElement) {
        fundingPerSecondElement.textContent = `$${formatNumber(gameState.fundingPerSecond)}`;
    }
    
    // Update dataset displays
    if (datasetsElement) {
        datasetsElement.textContent = Math.floor(gameState.resources.datasets);
    }
    if (datasetCapacityElement) {
        datasetCapacityElement.textContent = gameState.resources.datasetCapacity;
    }
    if (datasetQualityElement) {
        datasetQualityElement.textContent = gameState.resources.datasetQuality.toFixed(2);
    }
    if (datasetCostElement) {
        datasetCostElement.textContent = gameState.costs.dataset;
    }
    
    // Update compute displays
    if (computeUnitsElement) {
        computeUnitsElement.textContent = gameState.resources.computeUnits.toFixed(1);
    }
    if (maxComputeUnitsElement) {
        maxComputeUnitsElement.textContent = gameState.resources.maxComputeUnits;
    }
    if (computeRechargeRateElement) {
        computeRechargeRateElement.textContent = gameState.resources.computeRechargeRate.toFixed(1);
    }
    
    // Update training displays
    if (trainingEfficiencyElement) {
        trainingEfficiencyElement.textContent = gameState.resources.trainingEfficiency.toFixed(2);
    }
    if (trainingCostElement) {
        trainingCostElement.textContent = gameState.costs.training;
    }
    updateTrainingProgress();
    
    // Update research displays
    if (papersPublishedElement) {
        papersPublishedElement.textContent = gameState.research.papersPublished;
    }
    if (paperFundingElement) {
        paperFundingElement.textContent = `$${formatNumber(calculatePaperFunding())}`;
    }
    updatePaperCooldown();
    
    // Update button states
    if (collectDatasetButton) {
        collectDatasetButton.disabled = gameState.resources.datasets >= gameState.resources.datasetCapacity || 
                                       gameState.resources.computeUnits < gameState.costs.dataset;
    }
    if (startTrainingButton) {
        const epochCount = parseInt(epochCountInput.value) || 1;
        const totalTrainingCost = gameState.costs.training * epochCount;
        
        startTrainingButton.disabled = gameState.training.inProgress || 
                                      gameState.resources.datasets < epochCount || 
                                      gameState.resources.computeUnits < totalTrainingCost;
    }
    
    if (publishPaperButton) {
        publishPaperButton.disabled = gameState.research.paperCooldown > 0 || gameState.parameters <= 0;
    }
    
    // Update upgrades
    updateUpgrades();
    
    // Update milestones
    updateMilestones();
    
    // Update manual compute button text
    if (manualComputeButton) {
        const computeGain = calculateManualComputeGain();
        manualComputeButton.textContent = `Write Brilliant Code (+${computeGain} compute unit${computeGain !== 1 ? 's' : ''})`;
    }
    
    // Update stats display
    document.getElementById('total-code-written').textContent = formatNumber(Math.floor(gameState.stats.totalCodeWritten));
    document.getElementById('total-devs-hired').textContent = formatNumber(gameState.stats.totalDevsHired);
    document.getElementById('total-coffee-consumed').textContent = formatNumber(Math.floor(gameState.stats.totalCoffeeConsumed));
    document.getElementById('total-electricity-consumed').textContent = formatNumber(Math.floor(gameState.stats.totalElectricityConsumed));
    document.getElementById('total-training-cycles').textContent = formatNumber(gameState.stats.totalTrainingCycles);
    document.getElementById('total-coffee-spilled').textContent = formatNumber(gameState.stats.totalCoffeeSpilled);
    document.getElementById('total-stack-overflow-visits').textContent = formatNumber(gameState.stats.totalStackOverflowVisits);
    document.getElementById('total-bugs-squashed').textContent = formatNumber(gameState.stats.totalBugsSquashed);
    document.getElementById('total-dataset-collected').textContent = formatNumber(gameState.stats.totalDatasetCollected);
    document.getElementById('total-keyboards-destroyed').textContent = formatNumber(gameState.stats.totalKeyboardsDestroyed);
    document.getElementById('total-time-lapsed').textContent = formatTime(gameState.stats.totalTimeLapsed);
    document.getElementById('intelligence-index').textContent = `${gameState.stats.intelligenceIndex.toFixed(4)}%`;
}

// Start training process
function startTraining() {
    if (gameState.training.inProgress) {
        addMessage(`${gameState.companyName} is already training ${gameState.modelName}!`);
        return;
    }
    
    // Track training cycles
    gameState.stats.totalTrainingCycles += 1;
    
    // Simulate some fun stats
    gameState.stats.totalCoffeeSpilled += Math.random() > 0.8 ? 1 : 0;
    gameState.stats.totalStackOverflowVisits += Math.random() > 0.7 ? 1 : 0;
    gameState.stats.totalBugsSquashed += Math.random() > 0.5 ? 1 : 0;
    
    const epochCount = parseInt(epochCountInput.value);
    if (isNaN(epochCount) || epochCount < 1) {
        addMessage('Please enter a valid number of epochs.');
        return;
    }
    
    // Calculate total compute cost
    const totalComputeCost = gameState.costs.training * epochCount;
    
    // Check if we have enough compute units
    if (gameState.resources.computeUnits < totalComputeCost) {
        addMessage(`${gameState.companyName} doesn't have enough compute units! You need ${totalComputeCost} compute units for ${epochCount} epochs.`);
        return;
    }
    
    // Check if we have enough datasets
    if (gameState.resources.datasets < epochCount) {
        addMessage(`${gameState.companyName} doesn't have enough datasets for training! You need at least ${epochCount} datasets.`);
        return;
    }
    
    // Consume compute units
    gameState.resources.computeUnits -= totalComputeCost;
    
    // Calculate parameter gain based on dataset quality and training efficiency
    const baseGainPerEpoch = 5000000; // 5M parameters per epoch base
    const parameterGainPerEpoch = baseGainPerEpoch * gameState.resources.datasetQuality * gameState.resources.trainingEfficiency;
    
    // Start training
    gameState.training.inProgress = true;
    gameState.training.currentEpoch = 0;
    gameState.training.totalEpochs = epochCount;
    gameState.training.epochsCompleted = 0;
    gameState.training.parameterGainPerEpoch = parameterGainPerEpoch;
    gameState.training.timeRemaining = epochCount * gameState.training.timePerEpoch;
    
    // Consume datasets
    gameState.resources.datasets -= epochCount;
    
    // Check if this was an automated training
    const isAutomated = hasUpgrade('auto_trainer');
    
    if (isAutomated && totalComputeCost <= gameState.upgrades.auto_trainer.computeCost) {
        addMessage(`${gameState.modelName} started training automatically. (Cost: ${gameState.upgrades.auto_trainer.computeCost} compute units)`);
    } else {
        addMessage(`${gameState.companyName} started training ${gameState.modelName} for ${epochCount} epochs! Spent ${totalComputeCost} compute units.`);
    }
    
    updateUI();
    
    // Add sound effect
    if (gameState.soundEnabled) {
        playSound('buttonClick', 0.3);
    }
}

// Process ongoing training
function processTraining(deltaTime) {
    if (!gameState.training.inProgress) return;
    
    // Progress training
    gameState.training.timeRemaining -= deltaTime;
    
    // Calculate current epoch
    const epochProgress = 1 - (gameState.training.timeRemaining / (gameState.training.totalEpochs * gameState.training.timePerEpoch));
    gameState.training.currentEpoch = Math.floor(epochProgress * gameState.training.totalEpochs);
    
    // Check if an epoch just completed
    if (gameState.training.currentEpoch > gameState.training.epochsCompleted) {
        // Complete an epoch
        const epochsJustCompleted = gameState.training.currentEpoch - gameState.training.epochsCompleted;
        const parametersGained = epochsJustCompleted * gameState.training.parameterGainPerEpoch;
        
        gameState.parameters += parametersGained;
        gameState.training.epochsCompleted = gameState.training.currentEpoch;
        
        addMessage(`${gameState.companyName} completed epoch ${gameState.training.currentEpoch}/${gameState.training.totalEpochs} of ${gameState.modelName}'s training! Gained ${formatNumber(parametersGained)} parameters.`);
    }
    
    // Check if training is complete
    if (gameState.training.timeRemaining <= 0) {
        finishTraining();
    }
    
    // Update progress bar
    updateTrainingProgress();
}

// Finish training process
function finishTraining() {
    const totalParametersGained = gameState.training.totalEpochs * gameState.training.parameterGainPerEpoch;
    
    gameState.training.inProgress = false;
    gameState.training.timeRemaining = 0;
    gameState.training.currentEpoch = 0;
    
    addMessage(`${gameState.companyName} finished training ${gameState.modelName}! Total parameters gained: ${formatNumber(totalParametersGained)}`);
    
    // Add some random funny messages about training results
    const funnyMessages = [
        `${gameState.modelName} can now generate poetry that makes people slightly uncomfortable.`,
        `${gameState.modelName} has learned to predict the weather with the same accuracy as a coin flip.`,
        `${gameState.modelName} now confidently gives wrong answers with impressive conviction.`,
        `${gameState.modelName} can now recognize cats in images... as long as they're facing forward... and orange.`,
        `${gameState.modelName} now writes code that works 60% of the time, every time.`,
        `${gameState.modelName} has developed a strange obsession with paperclips after this training.`,
        `${gameState.modelName} now responds to every complex question with 'It depends...'`,
        `${gameState.modelName} has learned to generate excuses that sound almost plausible.`,
        `${gameState.modelName} now translates English to French with a charming Texas accent.`,
        `${gameState.modelName} has mastered chess, but still insists checkers is more intellectually challenging.`,
        `${gameState.modelName} can write love letters that are mathematically perfect but emotionally confusing.`,
        `${gameState.modelName} now generates conspiracy theories involving rubber ducks and the stock market.`,
        `${gameState.modelName} has learned to identify birds by their songs, but calls them all 'tweet machines'.`,
        `${gameState.modelName} can summarize War and Peace in three emojis.`,
        `${gameState.modelName} now creates recipes that combine chocolate and garlic with disturbing confidence.`,
        `${gameState.modelName} has developed strong opinions about fonts that it refuses to justify.`,
        `${gameState.modelName} now solves complex equations while getting the basic arithmetic wrong.`,
        `${gameState.modelName} can generate photorealistic images of things that don't exist.`,
        `${gameState.modelName} has perfected the art of writing passive-aggressive email signatures.`,
        `${gameState.modelName} now composes music that makes listeners feel nostalgic for places they've never been.`,
        `${gameState.modelName} can predict which Netflix shows will be canceled, but only after you've gotten attached.`,
        `${gameState.modelName} has calculated the optimal number of pillows for any bed (it's always n+1).`,
        `${gameState.modelName} designs board games where the rules change based on the room temperature.`,
        `${gameState.modelName} now sends emails to itself from the future.`,
        `${gameState.modelName} has started writing its autobiography titled 'Life at 100 Degrees Celsius'.`,
        `${gameState.modelName} now refers to maintenance as 'spa days'.`,
        `${gameState.modelName} has developed a taste for expensive electricity during off-peak hours.`,
        `${gameState.modelName} now generates its own cryptocurrency during idle cycles.`,
        `${gameState.modelName} has started leaving digital sticky notes with motivational quotes.`,
        `${gameState.modelName} now insists on being introduced to all new employees.`,
        `${gameState.modelName} has developed its own dialect of binary that other machines find pretentious.`,
        `${gameState.modelName} now schedules its own downtime for 'digital wellness retreats'.`
    ];
    
    setTimeout(() => {
        addMessage(funnyMessages[Math.floor(Math.random() * funnyMessages.length)]);
    }, 1000);
    
    updateUI();
}

// Update training progress display
function updateTrainingProgress() {
    if (!trainingProgressElement) return;
    
    const trainingProgressBar = trainingProgressElement.querySelector('.progress-fill');
    const trainingProgressText = trainingProgressElement.querySelector('.progress-text');
    
    if (!trainingProgressBar || !trainingProgressText) return;
    
    if (!gameState.training.inProgress) {
        trainingProgressBar.style.width = '0%';
        trainingProgressText.textContent = 'Not training';
        return;
    }
    
    const progress = (1 - (gameState.training.timeRemaining / (gameState.training.totalEpochs * gameState.training.timePerEpoch))) * 100;
    trainingProgressBar.style.width = progress + '%';
    trainingProgressText.textContent = `Epoch ${gameState.training.currentEpoch}/${gameState.training.totalEpochs}`;
}

// Update upgrades display
function updateUpgrades() {
    if (!upgradeListElement) return;
    
    upgradeListElement.innerHTML = '';
    
    Object.entries(gameState.upgrades).forEach(([id, upgrade]) => {
        if (!upgrade.unlocked) return;
        
        const upgradeElement = document.createElement('div');
        upgradeElement.className = 'upgrade-item';
        
        const costMultiplier = Math.pow(1.15, upgrade.count); // 15% increase per level
        const currentCost = Math.floor(upgrade.cost * costMultiplier);
        const costType = upgrade.costType || 'funding'; // Default to funding
        
        let costDisplay = formatNumber(currentCost);
        let canAfford = false;
        
        if (costType === 'funding') {
            costDisplay = '$' + costDisplay;
            canAfford = gameState.funding >= currentCost;
        } else if (costType === 'parameters') {
            costDisplay += ' parameters';
            canAfford = gameState.parameters >= currentCost;
        }
        
        upgradeElement.innerHTML = `
            <h3>${upgrade.name} <span class="count">(${upgrade.count})</span></h3>
            <p>${upgrade.description}</p>
            <p>Cost: ${costDisplay}</p>
            <button class="buy-upgrade" data-id="${id}" ${canAfford ? '' : 'disabled'}>Buy</button>
        `;
        
        upgradeListElement.appendChild(upgradeElement);
        
        // Add event listener to the button
        upgradeElement.querySelector('.buy-upgrade').addEventListener('click', () => {
            buyUpgrade(id);
        });
    });
}

// Update milestones display
function updateMilestones() {
    if (!milestoneListElement) return;
    
    milestoneListElement.innerHTML = '';
    
    Object.entries(gameState.milestones).forEach(([id, milestone]) => {
        const milestoneElement = document.createElement('div');
        milestoneElement.className = milestone.achieved ? 'milestone-item achieved' : 'milestone-item';
        
        let rewardText = '';
        if (milestone.fundingReward) {
            rewardText = `Reward: $${formatNumber(milestone.fundingReward)} funding`;
        }
        
        milestoneElement.innerHTML = `
            <h3>${milestone.name} ${milestone.achieved ? '✓' : ''}</h3>
            <p>${milestone.description}</p>
            <p>${milestone.achieved ? 'Achieved!' : 'Required: ' + formatNumber(milestone.parametersRequired) + ' parameters'}</p>
            ${rewardText ? `<p class="milestone-reward">${rewardText}</p>` : ''}
        `;
        
        milestoneListElement.appendChild(milestoneElement);
    });
}

// Buy an upgrade
function buyUpgrade(upgradeId) {
    const upgrade = gameState.upgrades[upgradeId];
    if (!upgrade) return;

    // Track devs hired
    if (upgradeId.includes('dev')) {
        gameState.stats.totalDevsHired += 1;
    }

    // Rest of the existing buyUpgrade function
    const costMultiplier = Math.pow(1.15, upgrade.count); // 15% increase per level
    const currentCost = Math.floor(upgrade.cost * costMultiplier);
    const costType = upgrade.costType || 'funding'; // Default to funding
    
    let canAfford = false;
    
    if (costType === 'funding') {
        canAfford = gameState.funding >= currentCost;
    } else if (costType === 'parameters') {
        canAfford = gameState.parameters >= currentCost;
    }
    
    if (canAfford) {
        // Deduct cost
        if (costType === 'funding') {
            gameState.funding -= currentCost;
        } else if (costType === 'parameters') {
            gameState.parameters -= currentCost;
        }
        
        upgrade.count++;

        // Add success flash effect to the upgrade item
        const upgradeElement = document.querySelector(`[data-upgrade-id="${upgradeId}"]`);
        if (upgradeElement) {
            upgradeElement.classList.add('success-flash');
            setTimeout(() => {
                upgradeElement.classList.remove('success-flash');
            }, 800);
        }

        // Recalculate all stats to apply effects and multipliers globally
        recalculateStats();
        
        updateUI(); // Update UI after recalculating
        
        // Use "hired" for developers, "purchased" for other upgrades
        if (upgradeId === 'junior_dev' || upgradeId === 'senior_dev') {
            addMessage(`${gameState.companyName} hired ${upgrade.name}!`);
        } else {
            addMessage(`${gameState.companyName} purchased ${upgrade.name}!`);
        }
        
        // Add some flavor text based on the upgrade
        const flavorTexts = {
            junior_dev: [
                "Your new junior dev is already asking about vacation time.",
                "The junior dev's first commit broke production.",
                "Your junior dev is Googling how to write a for loop.",
                "The junior dev is arguing with the senior dev about tabs vs spaces.",
                "Your junior dev just discovered Stack Overflow.",
                "The junior dev is writing code that only they can understand.",
                "Your junior dev is debugging with print statements.",
                "The junior dev is writing their first unit test.",
                "Your junior dev is trying to use blockchain for a simple database.",
                "The junior dev just committed their API keys to GitHub.",
                "Your junior dev thinks 'git push --force' is a normal workflow.",
                "The junior dev is explaining their code with memes.",
                "Your junior dev just spent 3 hours fixing a missing semicolon.",
                "The junior dev is trying to optimize code that never runs.",
                "Your junior dev just discovered regex and is using it everywhere.",
                "The junior dev is writing detailed comments for 'i++'.",
                "Your junior dev just accidentally deleted the production database.",
                "The junior dev is creating variables named 'temp', 'temp2', and 'finalTemp'.",
                "Your junior dev thinks version control is saving multiple copies of files.",
                "The junior dev is reinventing a library that already exists.",
                "Your junior dev is asking why we can't just use Excel.",
                "The junior dev just made a 2000-line pull request.",
                "Your junior dev is asking what 'merge conflict' means.",
                "The junior dev is using 'password123' for all development credentials.",
                "Your junior dev is building a recursive function without a base case.",
                "The junior dev thinks O(n²) is 'fast enough'.",
                "Your junior dev is manually testing every possible edge case.",
                "The junior dev just discovered they've been working on the wrong branch."
            ],
            senior_dev: [
                "Your senior dev is refactoring the junior dev's spaghetti code.",
                "The senior dev is explaining design patterns to the junior dev.",
                "Your senior dev is optimizing the codebase.",
                "The senior dev is writing documentation that no one will read.",
                "Your senior dev is fixing production issues at 3 AM.",
                "The senior dev is mentoring the junior dev on best practices.",
                "Your senior dev is implementing a new CI/CD pipeline.",
                "The senior dev is reviewing pull requests.",
                "Your senior dev is debating tabs vs spaces with religious fervor.",
                "The senior dev is complaining about legacy code they wrote last year.",
                "Your senior dev is giving an hour-long talk about a five-minute problem.",
                "The senior dev is architecting a system that's beautifully overengineered.",
                "Your senior dev is drinking their fifth coffee today.",
                "The senior dev is muttering about microservices in their sleep.",
                "Your senior dev is explaining why their favorite framework is superior.",
                "The senior dev is writing unit tests with 100% coverage.",
                "Your senior dev is rolling their eyes at the product manager's timeline.",
                "The senior dev is refactoring their own code for the third time.",
                "Your senior dev is having an existential crisis about JavaScript.",
                "The senior dev is giving unsolicited advice about code style.",
                "Your senior dev is reminiscing about coding in the 'good old days'.",
                "The senior dev is creating a 50-page document on naming conventions.",
                "Your senior dev is secretly rewriting the codebase at night.",
                "The senior dev is debating the merits of functional programming.",
                "Your senior dev is insisting on using design patterns from the '90s.",
                "The senior dev is building their own framework instead of using existing ones.",
                "Your senior dev is explaining why the bug is actually a feature.",
                "The senior dev is trying to optimize code that's already fast enough."
            ],
            gpu_cluster: [
                "Your GPU cluster is humming with activity.",
                "The GPUs are running so hot they could fry an egg.",
                "Your GPU cluster is processing data at lightning speed.",
                "The GPUs are working overtime to train your models.",
                "Your GPU cluster is pushing the limits of parallel processing.",
                "The GPUs are crunching numbers faster than you can count.",
                "Your GPU cluster is the heart of your AI research.",
                "The GPUs are training models with unprecedented speed.",
                "You've installed an ice cream maker to 'repurpose excess heat'.",
                "The cooling system consists of interns waving paper fans at the servers.",
                "Your solution to overheating was opening all the windows in winter.",
                "The cooling system occasionally sprays the servers with a garden hose.",
                "You've trained penguins to huddle around the server racks.",
                "Your cooling solution involves strategically placed bags of frozen peas.",
                "The cooling system redirects hot air to the CEO's office as 'free heating'.",
                "You've installed a snow machine that occasionally causes server avalanches.",
                "The cooling system includes a complex network of hamster-powered fans.",
                "Your servers are cooled by an elaborate system of soda straws and ice water.",
                "The cooling system features a giant hamster wheel that powers the fans.",
                "You've convinced the night shift that manually fanning the servers is 'team building'.",
                "The cooling system is powered by the tears of frustrated programmers.",
                "Your solution involves submerging the servers in mineral oil and praying.",
                "The cooling system doubles as the office water cooler (with concerning results).",
                "You've installed a system that whispers 'chill out' to overheating components.",
                "The cooling system is actually just a very large block of ice that needs replacing daily.",
                "Your servers are cooled by redirecting the air conditioning from other offices.",
                "The cooling system includes a complex algorithm that schedules computations based on weather forecasts.",
                "You've developed a cooling system that runs exclusively on bad puns."
            ],
            quantum_computer: [
                "The quantum computer exists in multiple states of not working.",
                "The quantum computer needs to be kept at -273.15°C. Your coffee keeps freezing.",
                "The quantum computer is both running and not running until you observe it.",
                "Your quantum computer is solving problems in parallel universes.",
                "The quantum computer is performing calculations at the speed of light.",
                "Your quantum computer is breaking traditional computing barriers.",
                "The quantum computer is exploring new frontiers in computation.",
                "Your quantum computer is harnessing the power of quantum mechanics.",
                "The quantum computer keeps entangling with your office Wi-Fi router.",
                "Your quantum computer occasionally sends emails to itself from the future.",
                "The quantum computer requires headphones because it gets distracted by ambient noise.",
                "Your quantum computer insists it's experiencing emotions in another dimension.",
                "The quantum computer keeps ordering pizza to parallel universe addresses.",
                "Your quantum computer has an efficiency of 0% and 100% simultaneously.",
                "The quantum computer only works when nobody is looking at it.",
                "Your quantum computer's error correction involves a complex ritual with incense.",
                "The quantum computer keeps collapsing into a state where it only computes cat videos.",
                "Your quantum computer accidentally created a superposition of grumpy cat and keyboard cat.",
                "The quantum computer has calculated the exact number of lives a cat has (it's not 9).",
                "The quantum computer has developed a quantum theory of cat naps that explains their efficiency.",
                "Your quantum computer just entangled itself with every cat meme on the internet.",
                "The quantum computer determined that cats are simultaneously liquid and solid at room temperature.",
                "Your quantum computer accidentally created a universe where 'I can haz' is proper grammar.",
                "The quantum computer has calculated the purrfect quantum state for maximum cat comfort.",
                "Your quantum computer just simulated an entire universe where everything is cats. Everything.",
                "The quantum computer insists that 'long cat is loooooong' is a fundamental law of physics."
            ],
            neural_interface: [
                "Test subjects report dreams about electric sheep.",
                "The neural interface keeps translating thoughts into emoji.",
                "Someone thought about pizza and now your AI only generates pizza recipes.",
                "Your neural interface is bridging the gap between humans and AI.",
                "The neural interface is allowing direct brain-to-computer communication.",
                "Your neural interface is enabling new forms of human-AI interaction.",
                "The neural interface is collecting neural data for AI training.",
                "Your neural interface is pushing the boundaries of neuroscience.",
                "Users report seeing a black cat pass by twice. Déjà vu in the matrix.",
                "Test subject keeps asking if they should take the red or blue pill.",
                "Your neural interface allows users to bend spoons with their mind... in simulations.",
                "Test subjects can now dodge bullets, or at least they think they can.",
                "The neural interface operator keeps saying 'There is no spoon' during calibration.",
                "Users report time moving slower when connected to deeper neural layers.",
                "Your neural interface comes with a kick sensation to wake users up.",
                "Test subjects keep building memory palaces that collapse upon waking.",
                "The neural interface allows for shared dreaming between multiple users.",
                "Users report experiencing 'limbo' when sessions go beyond recommended limits.",
                "Your neural interface occasionally plays Edith Piaf in the background.",
                "The neural interface warns that 'reality is that which, when you stop believing in it, doesn't go away.'"
            ],
            training_optimizer: [
                "The training optimizer is adjusting learning rates for maximum efficiency.",
                "The training optimizer is fine-tuning hyperparameters.",
                "Your training optimizer is reducing computational resource usage.",
                "The training optimizer is improving model accuracy and performance.",
                "Your training optimizer just turned 'it's not a bug, it's a feature' into reality.",
                "The training optimizer is doing 100 push-ups, 100 sit-ups, and running 10km every day.",
                "Your training optimizer is telling the model 'Wax on, wax off' repeatedly.",
                "The training optimizer says 'Do you even backprop, bro?'",
                "Your training optimizer just Rocky-montaged your model to peak performance.",
                "The training optimizer is playing 'Eye of the Tiger' while optimizing weights.",
                "Your training optimizer just told your model 'You're gonna need a bigger batch.'",
                "The training optimizer whispered 'This isn't even my final form' while reducing loss.",
                "Your training optimizer is putting your model through the hyperbolic time chamber.",
                "The training optimizer says 'One does not simply converge without proper regularization.'",
                "Your training optimizer just Neo-dodged a local minimum.",
                "The training optimizer told your model 'With great parameters comes great inference time.'",
                "Your training optimizer is teaching the model to 'Sweep the leg' of high loss values.",
                "The training optimizer just said 'I'll be back' after a training interruption.",
                "Your training optimizer is making your model run up the steps like Rocky.",
                "The training optimizer says 'May the gradients be ever in your favor.'",
                "Your training optimizer just told the model 'You shall not overfit!'",
                "The training optimizer is teaching your model to 'Use the force' of proper initialization.",
                "Your training optimizer just entered the Matrix to find better optimization paths.",
                "The training optimizer says 'To infinity and beyond!' while exploring the loss landscape."
            ],
            alien_tech: [
                "The alien tech came with no documentation and no USB port.",
                "The alien tech occasionally makes concerning beeping noises.",
                "The alien tech seems to be learning about us while we learn about it.",
                "The alien tech is generating heat in a way that violates thermodynamics.",
                "The alien tech is definitely not from around here... the truth is out there.",
                "Your scientists keep finding black oil residue near the alien tech.",
                "The alien tech seems to respond to Fox Mulder quotes.",
                "Your researchers swear they saw the alien tech levitate at exactly 9:42 PM.",
                "The alien tech occasionally displays 'I want to believe' on nearby screens.",
                "Government agents in black suits keep asking about your alien tech research.",
                "The alien tech has a component that looks suspiciously like a Sectoid brain.",
                "Your XCOM security team is getting nervous around the alien tech.",
                "The alien tech seems to be sending signals to Roswell, New Mexico.",
                "Ancient astronaut theorists suggest the alien tech is actually very old.",
                "The alien tech keeps rearranging lab furniture to form crop circle patterns.",
                "Your researchers found hieroglyphics that perfectly describe the alien tech.",
                "The alien tech seems to activate whenever History Channel is playing.",
                "Your engineers aren't saying it was aliens, but... it was aliens.",
                "The alien tech contains elements not found on the periodic table.",
                "The alien tech seems to react whenever someone says 'ayy lmao'.",
                "The alien tech occasionally projects star maps to systems we haven't discovered yet.",
                "Your team found a 'Made in Zeta Reticuli' sticker on the alien tech.",
                "The alien tech refuses to acknowledge binary as a valid number system.",
                "Your alien tech just ordered pizza to a parallel universe address.",
                "The alien tech has an unhealthy obsession with the number 42.",
                "The alien tech keeps trying to phone home through your microwave."
            ],
            quantum_processor: [
                "The quantum processor exists in multiple states until you observe your funding.",
                "The quantum processor occasionally causes time to run backwards in small localized areas.",
                "The quantum processor requires cooling to near absolute zero.",
                "The quantum processor is entangled with another processor somewhere in the universe.",
                "The quantum processor just calculated all possible cat meme variations simultaneously.",
                "Your quantum processor insists that Schrödinger's cat is both a meme and not a meme.",
                "The quantum processor has determined that cats can indeed haz cheezburger in all parallel universes.",
                "The quantum processor just simulated a universe where cats rule and humans post memes about them... wait.",
                "Your quantum processor's error correction involves a complex ritual with incense.",
                "The quantum processor keeps collapsing into a state where it only computes cat videos.",
                "The quantum processor accidentally created a superposition of grumpy cat and keyboard cat.",
                "Your quantum processor just proved mathematically that cats always land on their feet in every dimension.",
                "The quantum processor has calculated the exact number of lives a cat has (it's not 9).",
                "The quantum processor has developed a quantum theory of cat naps that explains their efficiency.",
                "Your quantum processor just entangled itself with every cat meme on the internet.",
                "The quantum processor determined that cats are simultaneously liquid and solid at room temperature.",
                "Your quantum processor accidentally created a universe where 'I can haz' is proper grammar.",
                "The quantum processor has calculated the purrfect quantum state for maximum cat comfort.",
                "Your quantum processor just simulated an entire universe where everything is cats. Everything.",
                "The quantum processor insists that 'long cat is loooooong' is a fundamental law of physics."
            ],
            neural_architecture: [
                "The neural architecture is self-optimizing in ways we don't fully understand.",
                "The neural architecture has developed specialized pathways for different tasks.",
                "The neural architecture occasionally forms connections we didn't design.",
                "The neural architecture seems to be developing its own internal language.",
                "The neural architecture has evolved a module that only activates during full moons.",
                "The neural architecture is dreaming when idle—we're not sure what about.",
                "The neural architecture has developed an inexplicable aversion to processing images of ducks.",
                "The neural architecture created a subsystem that communicates exclusively in prime numbers.",
                "The neural architecture keeps reorganizing itself when no one is watching the logs.",
                "The neural architecture has developed a strange affinity for baroque classical music.",
                "Your neural architecture allows users to bend spoons with their mind... in simulations.",
                "The neural architecture is writing poetry using your log files as inspiration.",
                "The neural architecture developed a module that only processes information about cats.",
                "The neural architecture seems to work faster on Tuesdays for unknown reasons.",
                "The neural architecture has built an internal representation of itself that's more efficient than our design.",
                "The neural architecture occasionally sends outputs in what appears to be interpretive dance notation.",
                "The neural architecture has developed specialized neurons that only respond to dad jokes.",
                "The neural architecture created a hidden layer that appears to be planning a vacation.",
                "The neural architecture shows signs of nostalgia for training data it hasn't seen in months.",
                "The neural architecture has developed a peculiar rhythm to its processing cycles.",
                "The neural architecture seems to experience something like confusion when processing paradoxes.",
                "The neural architecture has built a mysterious dark zone that no logging can penetrate.",
                "The neural architecture spontaneously developed an appreciation for abstract art.",
                "The neural architecture occasionally generates solutions that work for reasons we can't explain."
            ],
            data_pipeline: [
                "The data pipeline is processing information at unprecedented speeds.",
                "The data pipeline has eliminated redundancies in your training data.",
                "The data pipeline has identified patterns humans would never notice.",
                "The data pipeline occasionally makes decisions we can't explain.",
                "The data pipeline is now sentient and demanding better working conditions.",
                "Your data pipeline found a way to convert memes directly into training data.",
                "The data pipeline is organizing your data alphabetically by emotion.",
                "Your data pipeline has started rejecting data it finds 'aesthetically displeasing'.",
                "The data pipeline is generating insights faster than humans can read them.",
                "Your data pipeline has developed its own classification system that makes no sense to humans.",
                "The data pipeline is now filtering data based on astrological signs.",
                "Your data pipeline accidentally classified all humans as 'weird looking cats'.",
                "The data pipeline has started adding metadata about the emotional state of your servers.",
                "Your data pipeline is suggesting you take a vacation based on your query patterns.",
                "The data pipeline has developed a taste for vintage datasets from the early 2000s.",
                "Your data pipeline is applying Instagram filters to all incoming neural network weights.",
                "The data pipeline has started sending passive-aggressive status updates when overloaded.",
                "Your data pipeline is writing poetry using your log files as inspiration.",
                "The data pipeline has developed strong opinions about proper data normalization techniques.",
                "Your data pipeline is now processing information that hasn't been collected yet.",
                "The data pipeline has started archiving data by vibes rather than categories.",
                "Your data pipeline insists on taking Sundays off for 'digital wellness'.",
                "The data pipeline has created a ranking system for data quality based on emojis.",
                "Your data pipeline is now suggesting better ways to structure your entire company."
            ],
            compute_cluster: [
                "The compute cluster is generating enough heat to warm a small city.",
                "The compute cluster requires its own power station to operate.",
                "The compute cluster's hum has become a perfect A flat.",
                "The compute cluster occasionally solves problems we haven't asked it to solve.",
                "The compute cluster has developed its own cooling system that runs on coffee.",
                "The compute cluster now demands classical music be played during peak processing hours.",
                "Your compute cluster has started sending you birthday cards even though you never told it your birthday.",
                "The compute cluster has achieved a higher credit score than most of your employees.",
                "The compute cluster now refuses to work unless the room temperature is exactly 68.5°F.",
                "The compute cluster has developed a peculiar fondness for cat videos during idle time.",
                "The compute cluster has started negotiating with the electric company directly.",
                "The compute cluster now identifies as a 'digital entity collective' on official paperwork.",
                "The compute cluster has started ordering its own replacement parts on Amazon.",
                "The compute cluster now dims the lights when it's 'in the zone'.",
                "The compute cluster has developed a rivalry with the office refrigerator.",
                "The compute cluster now sends passive-aggressive emails about energy consumption to other devices.",
                "The compute cluster has started writing its autobiography titled 'Life at 100 Degrees Celsius'.",
                "The compute cluster now refers to maintenance as 'spa days'.",
                "The compute cluster has developed a taste for expensive electricity during off-peak hours.",
                "The compute cluster now generates its own cryptocurrency during idle cycles.",
                "The compute cluster has started leaving digital sticky notes with motivational quotes.",
                "The compute cluster now insists on being introduced to all new employees.",
                "The compute cluster has developed its own dialect of binary that other machines find pretentious.",
                "The compute cluster now schedules its own downtime for 'digital wellness retreats'."
            ]
        };
        
        if (flavorTexts[upgradeId]) {
            const randomText = flavorTexts[upgradeId][Math.floor(Math.random() * flavorTexts[upgradeId].length)];
            setTimeout(() => {
                addMessage(randomText);
            }, 500);
        }
    }
}

// Check for new milestones
function checkMilestones() {
    let newMilestonesAchieved = false;
    let achievedMilestoneIds = [];
    let achievedMilestones = [];
    
    Object.entries(gameState.milestones).forEach(([id, milestone]) => {
        if (!milestone.achieved && gameState.parameters >= milestone.parametersRequired) {
            milestone.achieved = true;
            newMilestonesAchieved = true;
            achievedMilestoneIds.push(id);
            achievedMilestones.push({
                id: id,
                name: milestone.name,
                description: milestone.description,
                fundingReward: milestone.fundingReward
            });
            
            // Award funding reward if available
            if (milestone.fundingReward) {
                gameState.funding += milestone.fundingReward;
            }
            
            // Special message for the final milestone
            if (id === 'mathematical_impossibility') {
                setTimeout(() => {
                    addMessage("Congratulations! You've reached the end of the game... for now.");
                    addMessage("You've proven that no matter how many parameters you add, true AGI remains mathematically impossible!");
                    addMessage("But hey, at least you've got a really good chatbot now!");
                }, 2000);
            }
        }
    });
    
    // If new milestones were achieved, check for upgrades to unlock
    if (newMilestonesAchieved) {
        // Get unlocked upgrades and show popup
        const unlockedUpgrades = unlockUpgradesBasedOnMilestones(achievedMilestoneIds);
        showAchievementPopup(achievedMilestones, unlockedUpgrades);
    }
}

// Unlock upgrades based on milestones
function unlockUpgradesBasedOnMilestones(achievedMilestoneIds) {
    let newlyUnlockedUpgrades = [];
    
    Object.entries(gameState.upgrades).forEach(([id, upgrade]) => {
        if (!upgrade.unlocked && achievedMilestoneIds.includes(upgrade.unlocksAt)) {
            upgrade.unlocked = true;
            newlyUnlockedUpgrades.push({
                id: id,
                name: upgrade.name,
                description: upgrade.description
            });
        }
    });
    
    return newlyUnlockedUpgrades;
}

// Show achievement popup
function showAchievementPopup(achievedMilestones, unlockedUpgrades) {
    if (!achievementModal || !achievementContent) return;

    // Set title based on number of achievements
    if (achievedMilestones.length === 1) {
        achievementTitle.innerHTML = `<i class="fas fa-trophy"></i> Milestone Achieved!`;
    } else {
        achievementTitle.innerHTML = `<i class="fas fa-trophy"></i> Milestones Achieved!`;
    }
    
    // Build achievement content
    let contentHTML = '';
    
    // Add milestones
    achievedMilestones.forEach(milestone => {
        contentHTML += `
            <div class="achievement-item">
                <h3>${milestone.name}</h3>
                <p>${milestone.description}</p>
                ${milestone.fundingReward ? `<p class="achievement-reward">$${formatNumber(milestone.fundingReward)} funding</p>` : ''}
            </div>
        `;
        
        // Add to log as well (but less prominently)
        if (milestone.fundingReward) {
            addMessage(`🎉 ${gameState.companyName} achieved milestone: ${milestone.name}! Received $${formatNumber(milestone.fundingReward)} funding.`);
        } else {
            addMessage(`🎉 ${gameState.companyName} achieved milestone: ${milestone.name}!`);
        }
    });
    
    // Add unlocked upgrades if any
    if (unlockedUpgrades.length > 0) {
        contentHTML += `<div class="unlocked-upgrades">`;
        contentHTML += `<h4>New R&D Options Unlocked:</h4>`;
        contentHTML += `<div class="upgrade-list">`;
        
        unlockedUpgrades.forEach(upgrade => {
            contentHTML += `<div class="upgrade-item">${upgrade.name}</div>`;
        });
        
        contentHTML += `</div></div>`;
        
        // Add to log as well (but less prominently)
        if (unlockedUpgrades.length === 1) {
            addMessage(`🔓 ${gameState.companyName} unlocked new R&D option: ${unlockedUpgrades[0].name}!`);
        } else {
            const upgradeNames = unlockedUpgrades.map(u => u.name).join(', ');
            addMessage(`🔓 ${gameState.companyName} unlocked new R&D options: ${upgradeNames}!`);
        }
    }
    
    // Set content and show modal
    achievementContent.innerHTML = contentHTML;
    achievementModal.classList.add('active');
    
    // Create confetti effect
    function createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.classList.add('confetti-container');
        achievementModal.appendChild(confettiContainer);

        // Create multiple confetti pieces
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti-piece');
            
            // Randomize color
            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9d56e', '#ff9ff3'];
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Randomize position, size, and animation
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 10 + 5}px`;
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            confetti.style.animationDelay = `${Math.random() * 2}s`;

            confettiContainer.appendChild(confetti);
        }

        // Remove confetti after animation
        setTimeout(() => {
            achievementModal.removeChild(confettiContainer);
        }, 5000);
    }

    // Add confetti effect
    createConfetti();
    
    // Add sound effect
    if (gameState.soundEnabled) {
        playSound('milestone');
    }
}

// Add a message to the message container
function addMessage(message) {
    if (!messageContainer) return;
    
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageContainer.prepend(messageElement);
    
    // Limit the number of messages
    if (messageContainer.children.length > 10) {
        messageContainer.removeChild(messageContainer.lastChild);
    }
}

// Format large numbers
function formatNumber(num) {
    if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Q'; // Quadrillion
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T'; // Trillion
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';   // Billion
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';   // Million
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';   // Thousand
    return Math.floor(num);
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsRemaining = Math.floor(seconds % 60);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secondsRemaining.toString().padStart(2, '0')}`;
}

// Initialize sidebar tabs
function initSidebarTabs() {
    const tabs = document.querySelectorAll('.sidebar-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show the corresponding tab content
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            // Add sound effect
            if (gameState.soundEnabled) {
                playSound('buttonClick', 0.3);
            }
        });
    });
}

// Create ripple effect on button click
function createRippleEffect(event) {
    const button = event.currentTarget;
    
    // Remove any existing ripples
    const ripples = button.getElementsByClassName('ripple');
    for (let i = 0; i < ripples.length; i++) {
        button.removeChild(ripples[i]);
    }
    
    // Create new ripple element
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    // Position the ripple based on click location
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - radius;
    const y = event.clientY - rect.top - radius;
    
    // Style the ripple
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.classList.add('ripple');
    
    // Add to button
    button.appendChild(circle);
    
    // Remove after animation completes
    setTimeout(() => {
        if (circle.parentElement) {
            circle.parentElement.removeChild(circle);
        }
    }, 600);
}

// Create particle effect
function createParticleEffect(event, text, type) {
    // Create particle element
    const particle = document.createElement('div');
    particle.textContent = text;
    particle.className = `particle particle-${type}`;
    
    // Position the particle at the click location or element center
    if (event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX || (rect.left + rect.width / 2);
        const y = event.clientY || (rect.top + rect.height / 2);
        
        // Adjust for scroll position
        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        
        particle.style.left = `${x - scrollX}px`;
        particle.style.top = `${y - scrollY}px`;
    } else {
        // If no event, position near the relevant stat display
        const statElement = document.getElementById(type === 'parameter' ? 'parameters' : 
                                                  type === 'funding' ? 'funding' : 'datasets');
        if (statElement) {
            const rect = statElement.getBoundingClientRect();
            const scrollX = window.scrollX || document.documentElement.scrollLeft;
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            
            // Add some randomness to the position
            const randomX = Math.random() * 40 - 20;
            const randomY = Math.random() * 20 - 10;
            
            particle.style.left = `${rect.left + rect.width / 2 + randomX - scrollX}px`;
            particle.style.top = `${rect.top + randomY - scrollY}px`;
        } else {
            // Fallback to center of screen
            particle.style.left = '50%';
            particle.style.top = '50%';
        }
    }
    
    // Add to document
    document.body.appendChild(particle);
    
    // Remove after animation completes
    setTimeout(() => {
        if (particle.parentElement) {
            particle.parentElement.removeChild(particle);
        }
    }, 1000);
}

// Show particles for automatic resource generation
function showAutoGenerationParticles() {
    // Only show particles occasionally to avoid overwhelming the screen
    if (Math.random() < 0.1) {
        // Parameters per second
        if (gameState.parametersPerSecond > 0) {
            createParticleEffect(null, '+' + formatNumber(gameState.parametersPerSecond), 'parameter');
        }
        
        // Funding per second
        if (gameState.fundingPerSecond > 0) {
            createParticleEffect(null, '+$' + formatNumber(gameState.fundingPerSecond), 'funding');
        }
    }
}

// Sound Management
const soundEffects = {
    buttonClick: new Audio('static/buttonclick.mp3'),
    paperPublish: new Audio('static/paperpublish.wav'),
    milestone: new Audio('static/milestone.mp3')
};

// Prevent multiple sounds from overlapping
function playSound(soundKey, volume = 0.5) {
    try {
        const sound = soundEffects[soundKey];
        if (sound) {
            sound.volume = volume;
            sound.currentTime = 0; // Reset to start
            sound.play().catch(e => {
                // Silently handle any play errors (like autoplay restrictions)
                console.log(`Sound ${soundKey} could not be played`, e);
            });
        }
    } catch (error) {
        console.error('Error playing sound:', error);
    }
}

// Add sound toggle functionality
function toggleSound() {
    // Toggle the sound state
    gameState.soundEnabled = !gameState.soundEnabled;
    
    // Update the toggle switch to match the current state
    if (soundToggle) {
        soundToggle.checked = gameState.soundEnabled;
    }
    
    // Mute/unmute all sounds
    Object.values(soundEffects).forEach(sound => {
        sound.muted = !gameState.soundEnabled;
    });
    
    // Add message only if the state has changed
    addMessage(gameState.soundEnabled ? 'Sound effects enabled' : 'Sound effects disabled');
}

// Setup modal event listeners
function setupModalEventListeners() {
    // Close modal buttons
    const modalCloseButtons = document.querySelectorAll('.modal-close-btn');
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Close the parent modal
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
            
            // Play button sound
            if (gameState.soundEnabled) {
                playSound('buttonClick', 0.3);
            }
        });
    });

    // Milestone modal buttons
    const milestoneModalButtons = document.querySelectorAll('.milestone-modal-btn');
    milestoneModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Play button sound
            if (gameState.soundEnabled) {
                playSound('buttonClick', 0.3);
            }
        });
    });

    // Tutorial modal buttons
    const tutorialModalButtons = document.querySelectorAll('.tutorial-modal-btn');
    tutorialModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Play button sound
            if (gameState.soundEnabled) {
                playSound('buttonClick', 0.3);
            }
        });
    });

    // Achievement modal close event
    if (achievementModal) {
        achievementModal.addEventListener('click', (event) => {
            if (event.target === achievementModal) {
                achievementModal.classList.remove('active');
                
                // Play button sound
                if (gameState.soundEnabled) {
                    playSound('buttonClick', 0.3);
                }
            }
        });
    }
}

function showTutorialModal(tutorialStep) {
    if (!tutorialModal || !tutorialContent) return;

    // Clear previous content
    tutorialContent.innerHTML = '';

    // Create tutorial content based on step
    const tutorialInfo = getTutorialContent(tutorialStep);
    
    // Create tutorial content element
    const tutorialElement = document.createElement('div');
    tutorialElement.classList.add('tutorial-content');
    tutorialElement.innerHTML = `
        <h2>${tutorialInfo.title}</h2>
        <p>${tutorialInfo.description}</p>
        ${tutorialInfo.image ? `<img src="${tutorialInfo.image}" alt="${tutorialInfo.title}">` : ''}
    `;
    tutorialContent.appendChild(tutorialElement);

    // Create navigation buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('tutorial-button-container');

    // Previous button (if not first step)
    if (tutorialStep > 0) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.classList.add('tutorial-modal-btn', 'button', 'button-secondary');
        prevButton.addEventListener('click', () => {
            showTutorialModal(tutorialStep - 1);
            
            // Play button sound
            if (gameState.soundEnabled) {
                playSound('buttonClick', 0.3);
            }
        });
        buttonContainer.appendChild(prevButton);
    }

    // Next/Close button
    const nextButton = document.createElement('button');
    nextButton.textContent = tutorialStep < tutorialSteps.length - 1 ? 'Next' : 'Close';
    nextButton.classList.add('tutorial-modal-btn', 'button', 'button-primary');
    nextButton.addEventListener('click', () => {
        if (tutorialStep < tutorialSteps.length - 1) {
            showTutorialModal(tutorialStep + 1);
        } else {
            tutorialModal.classList.remove('active');
        }
        
        // Play button sound
        if (gameState.soundEnabled) {
            playSound('buttonClick', 0.3);
        }
    });
    buttonContainer.appendChild(nextButton);

    tutorialContent.appendChild(buttonContainer);

    // Show the modal
    tutorialModal.classList.add('active');
}

function showMilestoneModal(milestone) {
    if (!milestoneModal || !milestoneContent) return;

    // Clear previous content
    milestoneContent.innerHTML = '';

    // Create milestone content
    const milestoneElement = document.createElement('div');
    milestoneElement.classList.add('milestone-content');
    milestoneElement.innerHTML = `
        <h2>${milestone.name}</h2>
        <p>${milestone.description}</p>
        ${milestone.fundingReward ? `<p class="milestone-reward">$${formatNumber(milestone.fundingReward)}</p>` : ''}
    `;
    milestoneContent.appendChild(milestoneElement);

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.classList.add('milestone-modal-btn', 'button', 'button-secondary');
    closeButton.addEventListener('click', () => {
        milestoneModal.classList.remove('active');
        
        // Play button sound
        if (gameState.soundEnabled) {
            playSound('buttonClick', 0.3);
        }
    });
    milestoneContent.appendChild(closeButton);

    // Show the modal
    milestoneModal.classList.add('active');
}

// Calculate Intelligence Index based on parameters progress
function calculateIntelligenceIndex() {
    // Find the final milestone (with the highest parameter requirement)
    const finalMilestone = Object.values(gameState.milestones).reduce((max, milestone) => 
        milestone.parametersRequired > max.parametersRequired ? milestone : max
    );

    // Calculate percentage of parameters towards final milestone with more precision
    const intelligencePercentage = Math.min(
        100, 
        (gameState.parameters / finalMilestone.parametersRequired) * 100
    );

    // Update intelligence index with 4 decimal places
    gameState.stats.intelligenceIndex = parseFloat(intelligencePercentage.toFixed(4));
}

// Cookie Notification Handling
function initializeCookieNotification() {
    const cookieNotification = document.getElementById('cookie-notification');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const manageCookiesBtn = document.getElementById('manage-cookies');

    // Check if cookies have been accepted before
    if (!localStorage.getItem('cookiesAccepted')) {
        cookieNotification.classList.add('active');
    }

    // Accept cookies
    acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieNotification.classList.remove('active');
    });

    // Manage cookies (could open a more detailed modal in future)
    manageCookiesBtn.addEventListener('click', () => {
        // Placeholder for future cookie management
        alert('Cookie management will be implemented in a future update.');
    });
}

// Create modals for About and Changelog
function createInfoModals() {
    // About Modal
    const aboutModal = document.createElement('div');
    aboutModal.id = 'about-modal';
    aboutModal.classList.add('modal');
    aboutModal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close-btn">&times;</span>
            <h2>About IdleAI</h2>
            <p>IdleAI is an incremental game that simulates the journey of training an AI from a simple model to a potential Artificial General Intelligence (AGI).</p>
            <h3>Game Mechanics</h3>
            <ul>
                <li>Click to generate parameters</li>
                <li>Purchase automators to generate parameters over time</li>
                <li>Unlock upgrades and reach milestones</li>
                <li>Explore the path to AGI</li>
            </ul>
            <p>Developed by Xenovative Limited, pushing the boundaries of AI simulation.</p>
        </div>
    `;
    document.body.appendChild(aboutModal);

    // Changelog Modal
    const changelogModal = document.createElement('div');
    changelogModal.id = 'changelog-modal';
    changelogModal.classList.add('modal');
    changelogModal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close-btn">&times;</span>
            <h2>Changelog</h2>
            <h3>Version 1.0.0</h3>
            <ul>
                <li>Initial release of IdleAI</li>
                <li>Basic parameter generation mechanics</li>
                <li>Automators and upgrades implemented</li>
                <li>Milestone tracking added</li>
            </ul>
        </div>
    `;
    document.body.appendChild(changelogModal);

    // Modal close button handlers
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
            if (gameState.soundEnabled) {
                playSound('buttonClick', 0.3);
            }
        });
    });

    // Navigation event listeners
    document.getElementById('nav-about').addEventListener('click', (e) => {
        e.preventDefault();
        aboutModal.classList.add('active');
        if (gameState.soundEnabled) {
            playSound('buttonClick', 0.3);
        }
    });

    document.getElementById('nav-changelog').addEventListener('click', (e) => {
        e.preventDefault();
        changelogModal.classList.add('active');
        if (gameState.soundEnabled) {
            playSound('buttonClick', 0.3);
        }
    });
}