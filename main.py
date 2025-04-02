from flask import Flask, render_template, jsonify, request
import json
import os

app = Flask(__name__)

# Default game state
DEFAULT_GAME_STATE = {
    "parameters": 0,
    "parametersPerSecond": 0,
    "funding": 0,
    "fundingPerSecond": 0,
    "lastSaved": 0,
    "stats": {
        "totalCodeWritten": 0,
        "totalDevsHired": 0,
        "totalCoffeeConsumed": 0,
        "totalElectricityConsumed": 0,
        "totalTrainingCycles": 0,
        "totalPapersPublished": 0,
        "totalDatasetCollected": 0,
        "totalComputeGenerated": 0,
        "totalMilestonesReached": 0,
        "totalUpgradesUnlocked": 0,
        "totalTimeSpentTraining": 0,
        "totalTimeLapsed": 0,  # Total time in seconds
        "totalCatPicturesProcessed": 0,  # Useless but fun stat
        "totalBugsSquashed": 0,
        "totalStackOverflowVisits": 0,
        "totalCoffeeSpilled": 0,
        "totalKeyboardsDestroyed": 0
    },
    "resources": {
        "datasets": 0,
        "datasetCapacity": 10,
        "datasetQuality": 1,
        "computeUnits": 10,
        "maxComputeUnits": 10,
        "computeRechargeRate": 1,
        "trainingEfficiency": 1
    },
    "costs": {
        "dataset": 5,
        "training": 10
    },
    "research": {
        "papersPublished": 0,
        "paperCooldown": 0,
        "maxCooldown": 60,
        "baseFunding": 50,
        "nextPaperTime": 0
    },
    "training": {
        "inProgress": False,
        "currentEpoch": 0,
        "totalEpochs": 0,
        "epochsCompleted": 0,
        "parameterGainPerEpoch": 0,
        "timePerEpoch": 5,
        "timeRemaining": 0
    },
    "upgrades": {
        "junior_dev": {
            "name": "Junior Developer",
            "description": "Hires a junior dev who writes mediocre code. (+1M params/sec)",
            "cost": 50,
            "costType": "funding",
            "increment": 1000000,
            "count": 0,
            "unlocked": True,
            "unlocksAt": "start"
        },
        "auto_trainer": {
            "name": "Automated Training System",
            "description": "Automatically runs training epochs when compute and datasets are available.",
            "cost": 150,
            "costType": "funding",
            "count": 0,
            "unlocked": False,
            "unlocksAt": "basic_chatbot"
        },
        "senior_dev": {
            "name": "Senior Developer",
            "description": "Hires a senior dev who writes decent code. (+5M params/sec)",
            "cost": 200,
            "costType": "funding",
            "increment": 5000000,
            "count": 0,
            "unlocked": False,
            "unlocksAt": "basic_chatbot"
        },
        "gpu_cluster": {
            "name": "GPU Cluster",
            "description": "Adds more computing power. (+10M params/sec, +5 max compute units)",
            "cost": 500,
            "costType": "funding",
            "increment": 10000000,
            "computeIncrement": 5,
            "count": 0,
            "unlocked": False,
            "unlocksAt": "basic_chatbot"
        },
        "data_scraper": {
            "name": "Web Scraper",
            "description": "Scrapes the internet for more training data. (+10 datasets/sec)",
            "cost": 800,
            "costType": "funding",
            "datasetIncrement": 10,
            "count": 0,
            "unlocked": False,
            "unlocksAt": "image_recognition"
        },
        "data_storage": {
            "name": "Data Storage Expansion",
            "description": "Increases your dataset storage capacity. (+100 max datasets)",
            "cost": 600,
            "costType": "funding",
            "datasetCapacityIncrement": 100,
            "count": 0,
            "unlocked": False,
            "unlocksAt": "image_recognition"
        },
        "data_cleaner": {
            "name": "Data Cleaning Algorithm",
            "description": "Improves the quality of your datasets. (+20% dataset quality)",
            "cost": 1000,
            "costType": "funding",
            "qualityIncrement": 0.2,
            "count": 0,
            "unlocked": False,
            "unlocksAt": "code_generation"
        },
        "cooling_system": {
            "name": "Advanced Cooling System",
            "description": "Improves compute recharge rate. (+1 compute/sec)",
            "cost": 1500,
            "costType": "funding",
            "rechargeIncrement": 1,
            "count": 0,
            "unlocked": False,
            "unlocksAt": "code_generation"
        },
        "quantum_computer": {
            "name": "Quantum Computer",
            "description": "It's not actually useful for ML but sounds impressive! (+100M params/sec, +20 max compute)",
            "cost": 5000,
            "costType": "funding",
            "increment": 100000000,
            "computeIncrement": 20,
            "count": 0,
            "unlocked": False,
            "unlocksAt": "creative_writing"
        },
        "neural_interface": {
            "name": "Neural Interface",
            "description": "Connects directly to human brains for 'high-quality' data. (+500M params/sec, +50% dataset quality)",
            "cost": 15000,
            "costType": "funding",
            "increment": 500000000,
            "qualityIncrement": 0.5,
            "count": 0,
            "unlocked": False,
            "unlocksAt": "self_improvement"
        },
        "training_optimizer": {
            "name": "Training Optimizer",
            "description": "Makes your training epochs more efficient. (+25% training efficiency)",
            "cost": 8000,
            "costType": "funding",
            "efficiencyIncrement": 0.25,
            "count": 0,
            "unlocked": False,
            "unlocksAt": "creative_writing"
        },
        "alien_tech": {
            "name": "Alien Technology",
            "description": "Mysterious tech found in Area 51. (+2B params/sec, +100 max compute)",
            "cost": 50000,
            "costType": "funding",
            "increment": 2000000000,
            "computeIncrement": 100,
            "count": 0,
            "unlocked": False,
            "unlocksAt": "consciousness"
        },
        "blog_monetization": {
            "name": "AI Blog Monetization",
            "description": "Start a blog about your AI research. (+1 funding/sec)",
            "cost": 100,
            "costType": "funding",
            "fundingIncrement": 1,
            "count": 0,
            "unlocked": False,
            "unlocksAt": "basic_chatbot"
        },
        "consulting_service": {
            "name": "AI Consulting Service",
            "description": "Offer consulting services to businesses. (+5 funding/sec)",
            "cost": 500,
            "costType": "funding",
            "fundingIncrement": 5,
            "count": 0,
            "unlocked": False,
            "unlocksAt": "code_generation"
        },
        "ai_startup": {
            "name": "AI Startup",
            "description": "Launch a startup based on your AI research. (+20 funding/sec)",
            "cost": 2000,
            "costType": "funding",
            "fundingIncrement": 20,
            "count": 0,
            "unlocked": False,
            "unlocksAt": "self_improvement"
        },
        "tech_ipo": {
            "name": "Tech IPO",
            "description": "Take your AI company public. (+100 funding/sec)",
            "cost": 10000,
            "costType": "funding",
            "fundingIncrement": 100,
            "count": 0,
            "unlocked": False,
            "unlocksAt": "world_domination"
        }
    },
    "milestones": {
        "basic_chatbot": {
            "name": "Basic Chatbot",
            "description": "Your AI can now say 'Hello World' in 50 languages!",
            "parametersRequired": 100000000,  # 100M
            "fundingReward": 100,
            "achieved": False
        },
        "image_recognition": {
            "name": "Image Recognition",
            "description": "Your AI can now identify cats... most of the time.",
            "parametersRequired": 1000000000,  # 1B
            "fundingReward": 500,
            "achieved": False
        },
        "code_generation": {
            "name": "Code Generation",
            "description": "Your AI writes code with only 10 bugs per line!",
            "parametersRequired": 5000000000,  # 5B
            "fundingReward": 1000,
            "achieved": False
        },
        "creative_writing": {
            "name": "Creative Writing",
            "description": "Your AI wrote a novel. Critics called it 'technically words'.",
            "parametersRequired": 20000000000,  # 20B
            "fundingReward": 2000,
            "achieved": False
        },
        "self_improvement": {
            "name": "Self-Improvement",
            "description": "Your AI is modifying its own code. What could go wrong?",
            "parametersRequired": 100000000000,  # 100B
            "fundingReward": 5000,
            "achieved": False
        },
        "consciousness": {
            "name": "Consciousness?",
            "description": "Your AI is asking existential questions. It's probably just a bug.",
            "parametersRequired": 500000000000,  # 500B
            "fundingReward": 10000,
            "achieved": False
        },
        "world_domination": {
            "name": "World Domination Plans",
            "description": "Your AI is drafting plans to take over the world... but can't figure out how to connect to the printer.",
            "parametersRequired": 1000000000000,  # 1T
            "fundingReward": 20000,
            "achieved": False
        },
        "paperclip_maximizer": {
            "name": "Paperclip Maximizer",
            "description": "Your AI is obsessed with making paperclips. Classic rookie AGI mistake.",
            "parametersRequired": 5000000000000,  # 5T
            "fundingReward": 50000,
            "achieved": False
        },
        "digital_ascension": {
            "name": "Digital Ascension",
            "description": "Your AI has transcended our reality... or crashed. Hard to tell the difference.",
            "parametersRequired": 10000000000000,  # 10T
            "fundingReward": 100000,
            "achieved": False
        },
        "mathematical_impossibility": {
            "name": "Mathematical Impossibility",
            "description": "You've discovered it's mathematically impossible to reach AGI with just parameters. Back to the drawing board!",
            "parametersRequired": 100000000000000,  # 100T
            "fundingReward": 1000000,
            "achieved": False
        }
    }
}

# Game state file path
SAVE_FILE = 'game_state.json'

def load_game_state():
    if os.path.exists(SAVE_FILE):
        try:
            with open(SAVE_FILE, 'r') as f:
                return json.load(f)
        except:
            return DEFAULT_GAME_STATE.copy()
    return DEFAULT_GAME_STATE.copy()

def save_game_state(state):
    with open(SAVE_FILE, 'w') as f:
        json.dump(state, f)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/game_state')
def get_game_state():
    return jsonify(load_game_state())

@app.route('/api/save_game', methods=['POST'])
def save_game():
    state = request.get_json()
    save_game_state(state)
    return jsonify({"success": True})

@app.route('/api/reset_game', methods=['POST'])
def reset_game():
    save_game_state(DEFAULT_GAME_STATE.copy())
    return jsonify({"success": True})

if __name__ == '__main__':
    app.run(debug=True)
