// Constants
const COLORS = [
    [0, 0, 0],        // 0: Black
    [255, 0, 0],      // 1: Red
    [0, 255, 0],      // 2: Green
    [0, 0, 255],      // 3: Blue
    [255, 255, 0],    // 4: Yellow
    [255, 0, 255],    // 5: Magenta
    [0, 255, 255],    // 6: Cyan
    [255, 255, 255],  // 7: White
];
const NUM_COLORS = COLORS.length;

// Movement directions
const DIRECTIONS = {
    'N': [0, -1],   // North
    'S': [0, 1],    // South
    'E': [1, 0],    // East
    'W': [-1, 0],   // West
    'U': [1, -1],   // Up-right
    'D': [-1, 1],   // Down-left
    'UL': [-1, -1], // Up-left
    'DR': [1, 1]    // Down-right
};

// Direction changes for turning
const TURN_RIGHT = {
    'N': 'E',
    'E': 'S',
    'S': 'W',
    'W': 'N'
};

const TURN_LEFT = {
    'N': 'W',
    'W': 'S',
    'S': 'E',
    'E': 'N'
};

class Turmite {
    constructor() {
        // Get screen dimensions
        this.SCREEN_WIDTH = window.innerWidth;
        this.SCREEN_HEIGHT = window.innerHeight;
        
        // Grid constants
        this.CELL_SIZE = 4;
        this.GRID_WIDTH_PX = 1000;
        this.GRID_HEIGHT_PX = 600;
        this.GRID_WIDTH = this.GRID_WIDTH_PX / this.CELL_SIZE;
        this.GRID_HEIGHT = this.GRID_HEIGHT_PX / this.CELL_SIZE;
        this.MAX_GRID_SIZE = 100000;

        // UI constants
        this.SLIDER_HEIGHT = 20;
        this.SLIDER_WIDTH = 200;
        this.SLIDER_X = 20;
        this.SLIDER_Y = this.SCREEN_HEIGHT - this.SLIDER_HEIGHT - 20;
        this.BUTTON_WIDTH = 120;
        this.BUTTON_HEIGHT = 30;
        this.BUTTON_X = this.SCREEN_WIDTH - this.BUTTON_WIDTH - 20;
        this.BUTTON_Y = this.SCREEN_HEIGHT - this.BUTTON_HEIGHT - 20;
        this.HELP_BUTTON_WIDTH = 80;
        this.HELP_BUTTON_HEIGHT = 30;
        this.HELP_BUTTON_X = 20;
        this.HELP_BUTTON_Y = 20;

        // Menu constants
        this.MENU_WIDTH = 400;
        this.MENU_HEIGHT = 550;
        this.MENU_X = (this.SCREEN_WIDTH - this.MENU_WIDTH) / 2;
        this.MENU_Y = (this.SCREEN_HEIGHT - this.MENU_HEIGHT) / 2;
        this.INPUT_HEIGHT = 40;
        this.BUTTON_MARGIN = 20;
        this.COPY_BUTTON_HEIGHT = 30;
        this.COPY_BUTTON_MARGIN = 10;

        // Help menu constants
        this.HELP_MENU_WIDTH = 400;
        this.HELP_MENU_HEIGHT = 400;
        this.HELP_MENU_X = (this.SCREEN_WIDTH - this.HELP_MENU_WIDTH) / 2;
        this.HELP_MENU_Y = (this.SCREEN_HEIGHT - this.HELP_MENU_HEIGHT) / 2;

        // Welcome popup constants
        this.WELCOME_WIDTH = 600;
        this.WELCOME_HEIGHT = 400;
        this.WELCOME_X = (this.SCREEN_WIDTH - this.WELCOME_WIDTH) / 2;
        this.WELCOME_Y = (this.SCREEN_HEIGHT - this.WELCOME_HEIGHT) / 2;

        // Status message
        this.statusMessage = "";
        this.statusTimer = 0;
        this.statusDuration = 2000; // 2 seconds

        // Initial delay
        this.startTime = performance.now();
        this.initialDelay = 3000; // 3 seconds
        this.hasStarted = false;
        this.welcomeClosed = false;  // New flag to track if welcome was closed

        // Help menu state
        this.showHelp = false;
        this.helpButtonHover = false;

        // Welcome popup state
        this.showWelcome = true;
        this.welcomeButtonHover = false;

        // Colors
        this.SLIDER_COLOR = [50, 50, 50];
        this.BUTTON_COLOR = [70, 70, 70];
        this.BUTTON_HOVER_COLOR = [90, 90, 90];
        this.MENU_BG_COLOR = [30, 30, 30];
        this.MENU_BORDER_COLOR = [100, 100, 100];
        this.INPUT_BG_COLOR = [50, 50, 50];
        this.INPUT_TEXT_COLOR = [255, 255, 255];

        // Initialize canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.SCREEN_WIDTH;
        this.canvas.height = this.SCREEN_HEIGHT;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        // Initialize state
        this.grid = Array(this.GRID_HEIGHT).fill().map(() => Array(this.GRID_WIDTH).fill(0));
        this.speed = 20000;
        this.lastUpdateTime = performance.now();
        this.accumulatedTime = 0;
        this.sliderDragging = false;
        this.autoMode = true;
        this.autoInterval = 7000;
        this.lastAutoTime = performance.now();
        this.showUI = true;
        this.paused = false;
        this.showMenu = false;
        this.menuSeedInput = "";
        this.menuInputActive = false;
        this.autoIntervalInput = "7";
        this.autoIntervalActive = false;
        this.widthInput = "1000";
        this.heightInput = "600";
        this.widthActive = false;
        this.heightActive = false;
        this.currentSeed = null;
        this.errorMessage = "";
        this.errorTimer = 0;
        this.buttonHover = false;
        this.closeButtonHover = false;
        this.copyButtonHover = false;
        this.searchButtonHover = false;
        this.lastEscTime = 0;

        // Initialize with Langton's Ant rules
        this.initializeLangtonAnt();
        this.updateSliderPosition();

        // Set up event listeners
        this.setupEventListeners();

        // Start animation loop
        this.animate();
    }

    initializeLangtonAnt() {
        // Reset grid
        this.grid = Array(this.GRID_HEIGHT).fill().map(() => Array(this.GRID_WIDTH).fill(0));
        
        // Calculate center positions
        const centerX = Math.floor(this.GRID_WIDTH / 2);
        const centerY = Math.floor(this.GRID_HEIGHT / 2);
        
        // Draw "ANT" centered
        // A
        const aStartX = centerX - 40;
        for (let y = centerY - 15; y < centerY - 5; y++) {
            this.grid[y][aStartX] = 7;
            this.grid[y][aStartX + 10] = 7;
        }
        for (let x = aStartX; x < aStartX + 11; x++) {
            this.grid[centerY - 15][x] = 7;
            this.grid[centerY - 10][x] = 7;
        }
        
        // N
        const nStartX = centerX - 25;
        for (let y = centerY - 15; y < centerY - 5; y++) {
            this.grid[y][nStartX] = 7;
            this.grid[y][nStartX + 10] = 7;
        }
        for (let i = 0; i < 11; i++) {
            this.grid[centerY - 15 + i][nStartX + i] = 7;
        }
        
        // T
        const tStartX = centerX - 10;
        for (let x = tStartX; x < tStartX + 11; x++) {
            this.grid[centerY - 15][x] = 7;
        }
        for (let y = centerY - 15; y < centerY - 5; y++) {
            this.grid[y][tStartX + 5] = 7;
        }
        
        // Draw "EATER" centered below "ANT"
        // E
        const eStartX = centerX - 40;
        for (let x = eStartX; x < eStartX + 11; x++) {
            this.grid[centerY][x] = 7;
            this.grid[centerY + 5][x] = 7;
            this.grid[centerY + 9][x] = 7;
        }
        for (let y = centerY; y < centerY + 10; y++) {
            this.grid[y][eStartX] = 7;
        }
        
        // A
        const a2StartX = centerX - 25;
        for (let y = centerY; y < centerY + 10; y++) {
            this.grid[y][a2StartX] = 7;
            this.grid[y][a2StartX + 10] = 7;
        }
        for (let x = a2StartX; x < a2StartX + 11; x++) {
            this.grid[centerY][x] = 7;
            this.grid[centerY + 5][x] = 7;
        }
        
        // T
        const t2StartX = centerX - 10;
        for (let x = t2StartX; x < t2StartX + 11; x++) {
            this.grid[centerY][x] = 7;
        }
        for (let y = centerY; y < centerY + 10; y++) {
            this.grid[y][t2StartX + 5] = 7;
        }
        
        // E
        const e2StartX = centerX + 5;
        for (let x = e2StartX; x < e2StartX + 11; x++) {
            this.grid[centerY][x] = 7;
            this.grid[centerY + 5][x] = 7;
            this.grid[centerY + 9][x] = 7;
        }
        for (let y = centerY; y < centerY + 10; y++) {
            this.grid[y][e2StartX] = 7;
        }
        
        // R
        const rStartX = centerX + 20;
        for (let y = centerY; y < centerY + 10; y++) {
            this.grid[y][rStartX] = 7;
        }
        for (let x = rStartX; x < rStartX + 11; x++) {
            this.grid[centerY][x] = 7;
            this.grid[centerY + 5][x] = 7;
        }
        for (let i = 0; i < 5; i++) {
            this.grid[centerY + 5 + i][rStartX + 10] = 7;
        }
        for (let i = 0; i < 4; i++) {
            this.grid[centerY + 5 + i][rStartX + 10 - i] = 7;
        }
        
        // Reset ant position and direction
        this.antX = Math.floor(this.GRID_WIDTH / 2);
        this.antY = Math.floor(this.GRID_HEIGHT / 2);
        this.direction = 'E';
        
        // Set mode to Langton's Ant
        this.isLangtonAnt = true;
    }

    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    handleMouseDown(e) {
        if (this.showWelcome) {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const closeButton = {
                x: this.WELCOME_X + (this.WELCOME_WIDTH - 100) / 2,
                y: this.WELCOME_Y + this.WELCOME_HEIGHT - 50,
                width: 100,
                height: 30
            };
            if (mouseX >= closeButton.x && mouseX <= closeButton.x + closeButton.width &&
                mouseY >= closeButton.y && mouseY <= closeButton.y + closeButton.height) {
                this.showWelcome = false;
                this.welcomeClosed = true;
                this.startTime = performance.now(); // Reset start time when welcome is closed
                return;
            }
        } else if (this.showMenu) {
            this.handleMenuMouseDown(e);
        } else if (this.showUI) {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Check help button
            if (mouseX >= this.HELP_BUTTON_X && mouseX <= this.HELP_BUTTON_X + this.HELP_BUTTON_WIDTH &&
                mouseY >= this.HELP_BUTTON_Y && mouseY <= this.HELP_BUTTON_Y + this.HELP_BUTTON_HEIGHT) {
                this.showHelp = !this.showHelp;
                if (this.showHelp) {
                    this.paused = true;
                } else {
                    this.paused = false;
                    this.lastUpdateTime = performance.now();
                    this.accumulatedTime = 0;
                }
                return;
            }

            // Check help menu close button
            if (this.showHelp) {
                const closeButton = {
                    x: this.HELP_MENU_X + this.HELP_MENU_WIDTH - 100,
                    y: this.HELP_MENU_Y + this.HELP_MENU_HEIGHT - 40,
                    width: 80,
                    height: 30
                };
                if (mouseX >= closeButton.x && mouseX <= closeButton.x + closeButton.width &&
                    mouseY >= closeButton.y && mouseY <= closeButton.y + closeButton.height) {
                    this.showHelp = false;
                    this.paused = false;
                    this.lastUpdateTime = performance.now();
                    this.accumulatedTime = 0;
                    return;
                }
            }
            
            // Check slider
            if (mouseX >= this.SLIDER_X && mouseX <= this.SLIDER_X + this.SLIDER_WIDTH &&
                mouseY >= this.SLIDER_Y - 5 && mouseY <= this.SLIDER_Y + this.SLIDER_HEIGHT + 5) {
                this.sliderDragging = true;
            }
            // Check reset button
            else if (mouseX >= this.BUTTON_X && mouseX <= this.BUTTON_X + this.BUTTON_WIDTH &&
                     mouseY >= this.BUTTON_Y && mouseY <= this.BUTTON_Y + this.BUTTON_HEIGHT) {
                this.generateRandomRules();
            }
        }
    }

    handleMouseUp(e) {
        this.sliderDragging = false;
    }

    handleMouseMove(e) {
        if (!this.showMenu && this.showUI) {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Update button hover states
            this.buttonHover = (mouseX >= this.BUTTON_X && mouseX <= this.BUTTON_X + this.BUTTON_WIDTH &&
                               mouseY >= this.BUTTON_Y && mouseY <= this.BUTTON_Y + this.BUTTON_HEIGHT);
            
            this.helpButtonHover = (mouseX >= this.HELP_BUTTON_X && mouseX <= this.HELP_BUTTON_X + this.HELP_BUTTON_WIDTH &&
                                  mouseY >= this.HELP_BUTTON_Y && mouseY <= this.HELP_BUTTON_Y + this.HELP_BUTTON_HEIGHT);
            
            // Update welcome button hover state
            if (this.showWelcome) {
                const closeButton = {
                    x: this.WELCOME_X + (this.WELCOME_WIDTH - 100) / 2,
                    y: this.WELCOME_Y + this.WELCOME_HEIGHT - 50,
                    width: 100,
                    height: 30
                };
                this.welcomeButtonHover = (mouseX >= closeButton.x && mouseX <= closeButton.x + closeButton.width &&
                                         mouseY >= closeButton.y && mouseY <= closeButton.y + closeButton.height);
            }
            
            // Handle slider
            if (this.sliderDragging) {
                const newX = Math.max(this.SLIDER_X, Math.min(this.SLIDER_X + this.SLIDER_WIDTH, mouseX));
                this.sliderPos = newX;
                this.speed = this.getSpeedFromSlider(newX);
            }
        } else if (this.showMenu) {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Update menu button hover states
            this.copyButtonHover = (mouseX >= this.MENU_X + 20 && mouseX <= this.MENU_X + this.MENU_WIDTH - 20 &&
                                  mouseY >= this.MENU_Y + 80 && mouseY <= this.MENU_Y + 110);
            
            this.searchButtonHover = (mouseX >= this.MENU_X + 20 && mouseX <= this.MENU_X + this.MENU_WIDTH - 20 &&
                                    mouseY >= this.MENU_Y + 200 && mouseY <= this.MENU_Y + 230);
        }
    }

    handleKeyDown(e) {
        const currentTime = performance.now();
        
        if (e.key === 'Escape') {
            if (this.lastEscTime && currentTime - this.lastEscTime < 300) {
                return false;
            }
            this.lastEscTime = currentTime;
            
            this.showMenu = !this.showMenu;
            if (this.showMenu) {
                this.paused = true;
                this.lastUpdateTime = currentTime;
                this.accumulatedTime = 0;
                this.lastAutoTime = currentTime;
            } else {
                this.menuSeedInput = "";
                this.menuInputActive = false;
                this.autoIntervalActive = false;
                this.widthActive = false;
                this.heightActive = false;
                this.errorMessage = "";
                this.paused = false;
                this.lastUpdateTime = currentTime;
                this.accumulatedTime = 0;
                this.lastAutoTime = currentTime;
            }
        } else if (!this.showMenu) {
            switch (e.key) {
                case ' ':
                    this.generateRandomRules();
                    break;
                case 'h':
                    this.showUI = !this.showUI;
                    break;
                case 'p':
                    this.paused = !this.paused;
                    this.lastUpdateTime = currentTime;
                    this.accumulatedTime = 0;
                    this.lastAutoTime = currentTime;
                    break;
                case 'r':
                    this.resetSimulation();
                    break;
                case 'a':
                    this.autoMode = !this.autoMode;
                    this.statusMessage = `Automatic Mode: ${this.autoMode ? 'Enabled' : 'Disabled'}`;
                    this.statusTimer = currentTime;
                    if (this.autoMode) {
                        this.lastAutoTime = currentTime;
                    }
                    break;
                case 'f':
                    if (!document.fullscreenElement) {
                        this.canvas.requestFullscreen().catch(err => {
                            console.log(`Error attempting to enable fullscreen: ${err.message}`);
                        });
                    } else {
                        document.exitFullscreen();
                    }
                    break;
                case 'ArrowLeft':
                    if (this.speed <= 60) {
                        this.speed = Math.max(1, this.speed - 1);
                    } else {
                        this.speed = Math.max(60, Math.floor(this.speed * 0.9));
                    }
                    this.updateSliderPosition();
                    this.statusMessage = `Speed: ${this.speed} steps/sec`;
                    this.statusTimer = currentTime;
                    break;
                case 'ArrowRight':
                    if (this.speed < 60) {
                        this.speed = Math.min(60, this.speed + 1);
                    } else {
                        this.speed = Math.min(200000, Math.floor(this.speed * 1.1));
                    }
                    this.updateSliderPosition();
                    this.statusMessage = `Speed: ${this.speed} steps/sec`;
                    this.statusTimer = currentTime;
                    break;
            }
        }
    }

    handleResize() {
        this.SCREEN_WIDTH = window.innerWidth;
        this.SCREEN_HEIGHT = window.innerHeight;
        this.canvas.width = this.SCREEN_WIDTH;
        this.canvas.height = this.SCREEN_HEIGHT;
        
        // Update UI positions
        this.SLIDER_Y = this.SCREEN_HEIGHT - this.SLIDER_HEIGHT - 20;
        this.BUTTON_X = this.SCREEN_WIDTH - this.BUTTON_WIDTH - 20;
        this.BUTTON_Y = this.SCREEN_HEIGHT - this.BUTTON_HEIGHT - 20;
        this.MENU_X = (this.SCREEN_WIDTH - this.MENU_WIDTH) / 2;
        this.MENU_Y = (this.SCREEN_HEIGHT - this.MENU_HEIGHT) / 2;
    }

    updateSliderPosition() {
        if (this.speed <= 50) {
            this.sliderPos = this.SLIDER_X + (this.SLIDER_WIDTH/8) * (this.speed / 50);
        } else {
            const logMin = Math.log(50);
            const logMax = Math.log(200000);
            const logSpeed = Math.log(this.speed);
            this.sliderPos = this.SLIDER_X + this.SLIDER_WIDTH/8 + 
                            (this.SLIDER_WIDTH * 7/8) * (logSpeed - logMin) / (logMax - logMin);
        }
    }

    getSpeedFromSlider(sliderPos) {
        if (sliderPos <= this.SLIDER_X + this.SLIDER_WIDTH/8) {
            const speed = Math.floor(50 * (sliderPos - this.SLIDER_X) / (this.SLIDER_WIDTH/8));
            return Math.max(1, speed);
        } else {
            const logMin = Math.log(50);
            const logMax = Math.log(200000);
            const logSpeed = logMin + (logMax - logMin) * 
                           (sliderPos - (this.SLIDER_X + this.SLIDER_WIDTH/8)) / (this.SLIDER_WIDTH * 7/8);
            return Math.floor(Math.exp(logSpeed));
        }
    }

    move(turnOrDirection) {
        if (this.isLangtonAnt) {
            if (turnOrDirection === 'R') {
                this.direction = TURN_RIGHT[this.direction];
            } else if (turnOrDirection === 'L') {
                this.direction = TURN_LEFT[this.direction];
            }
            const [dx, dy] = DIRECTIONS[this.direction];
            this.antX = (this.antX + dx + this.GRID_WIDTH) % this.GRID_WIDTH;
            this.antY = (this.antY + dy + this.GRID_HEIGHT) % this.GRID_HEIGHT;
        } else {
            const [dx, dy] = DIRECTIONS[turnOrDirection];
            this.antX = (this.antX + dx + this.GRID_WIDTH) % this.GRID_WIDTH;
            this.antY = (this.antY + dy + this.GRID_HEIGHT) % this.GRID_HEIGHT;
        }
    }

    update() {
        if (this.speed === 0) return;

        const currentColor = this.grid[this.antY][this.antX];

        if (this.isLangtonAnt) {
            if (currentColor === 0) {
                this.grid[this.antY][this.antX] = 7;
                this.move('R');
            } else {
                this.grid[this.antY][this.antX] = 0;
                this.move('L');
            }
        } else {
            const stateRules = this.rules[this.currentState];
            const rule = stateRules[currentColor % stateRules.length];
            this.grid[this.antY][this.antX] = rule.writeColor;
            this.move(rule.move);
            this.currentState = rule.nextState;
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = `rgb(${COLORS[0].join(',')})`;
        this.ctx.fillRect(0, 0, this.SCREEN_WIDTH, this.SCREEN_HEIGHT);

        // Calculate offset to center the grid
        const offsetX = (this.SCREEN_WIDTH - this.GRID_WIDTH_PX) / 2;
        const offsetY = (this.SCREEN_HEIGHT - this.GRID_HEIGHT_PX) / 2;

        // Draw grid
        for (let y = 0; y < this.GRID_HEIGHT; y++) {
            for (let x = 0; x < this.GRID_WIDTH; x++) {
                const color = this.grid[y][x];
                if (color !== 0) {
                    this.ctx.fillStyle = `rgb(${COLORS[color].join(',')})`;
                    this.ctx.fillRect(
                        Math.floor(offsetX + x * this.CELL_SIZE),
                        Math.floor(offsetY + y * this.CELL_SIZE),
                        Math.ceil(this.CELL_SIZE),
                        Math.ceil(this.CELL_SIZE)
                    );
                }
            }
        }

        // Draw ant
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        this.ctx.fillRect(
            Math.floor(offsetX + this.antX * this.CELL_SIZE),
            Math.floor(offsetY + this.antY * this.CELL_SIZE),
            Math.ceil(this.CELL_SIZE),
            Math.ceil(this.CELL_SIZE)
        );

        // Draw status message if active
        if (this.statusMessage && performance.now() - this.statusTimer < this.statusDuration) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'right';
            const textWidth = this.ctx.measureText(this.statusMessage).width;
            const padding = 10;
            this.ctx.fillRect(
                this.SCREEN_WIDTH - textWidth - padding * 2,
                10,
                textWidth + padding * 2,
                30
            );
            this.ctx.fillStyle = 'rgb(255, 255, 255)';
            this.ctx.fillText(
                this.statusMessage,
                this.SCREEN_WIDTH - padding,
                30
            );
            this.ctx.textAlign = 'left';
        }

        // Draw UI elements if visible
        if (this.showUI) {
            this.drawUI();
        }

        // Draw menu if active
        if (this.showMenu) {
            this.drawMenu();
        }

        // Draw help menu if active
        if (this.showHelp) {
            this.drawHelpMenu();
        }

        // Draw welcome popup if active
        if (this.showWelcome) {
            this.drawWelcomePopup();
        }
    }

    drawUI() {
        // Draw speed slider background
        this.ctx.fillStyle = `rgb(${this.SLIDER_COLOR.join(',')})`;
        this.ctx.fillRect(this.SLIDER_X, this.SLIDER_Y, this.SLIDER_WIDTH, this.SLIDER_HEIGHT);

        // Draw slider handle
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        this.ctx.fillRect(this.sliderPos - 5, this.SLIDER_Y - 5, 10, this.SLIDER_HEIGHT + 10);

        // Draw speed text
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Speed: ${this.speed} steps/sec`, this.SLIDER_X, this.SLIDER_Y - 25);

        // Draw reset button
        this.ctx.fillStyle = `rgb(${(this.buttonHover ? this.BUTTON_HOVER_COLOR : this.BUTTON_COLOR).join(',')})`;
        this.ctx.fillRect(this.BUTTON_X, this.BUTTON_Y, this.BUTTON_WIDTH, this.BUTTON_HEIGHT);
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('New Rules', this.BUTTON_X + this.BUTTON_WIDTH/2, this.BUTTON_Y + this.BUTTON_HEIGHT/2 + 8);
        this.ctx.textAlign = 'left';

        // Draw help button
        if (this.showUI) {
            this.ctx.fillStyle = `rgb(${(this.helpButtonHover ? this.BUTTON_HOVER_COLOR : this.BUTTON_COLOR).join(',')})`;
            this.ctx.fillRect(this.HELP_BUTTON_X, this.HELP_BUTTON_Y, this.HELP_BUTTON_WIDTH, this.HELP_BUTTON_HEIGHT);
            this.ctx.fillStyle = 'rgb(255, 255, 255)';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Help', this.HELP_BUTTON_X + this.HELP_BUTTON_WIDTH/2, this.HELP_BUTTON_Y + this.HELP_BUTTON_HEIGHT/2 + 8);
            this.ctx.textAlign = 'left';
        }
    }

    animate() {
        const currentTime = performance.now();

        // Check if initial delay has passed and welcome was closed
        if (!this.hasStarted && this.welcomeClosed && currentTime - this.startTime >= this.initialDelay) {
            this.hasStarted = true;
            this.lastUpdateTime = currentTime;
            this.accumulatedTime = 0;
            this.lastAutoTime = currentTime;
        }

        if (!this.paused && this.hasStarted) {
            const frameTime = currentTime - this.lastUpdateTime;
            this.lastUpdateTime = currentTime;

            this.accumulatedTime += frameTime;
            if (this.speed !== 0) {
                const stepsToTake = Math.floor((this.accumulatedTime / 1000.0) * Math.abs(this.speed));
                this.accumulatedTime -= (stepsToTake / Math.abs(this.speed)) * 1000.0;

                for (let i = 0; i < stepsToTake; i++) {
                    this.update();
                }
            }
        }

        // Handle automatic mode
        if (this.autoMode && !this.paused && !this.showMenu && this.hasStarted) {
            if (currentTime - this.lastAutoTime >= this.autoInterval) {
                this.generateRandomRules();
                this.lastAutoTime = currentTime;
                this.lastUpdateTime = currentTime;
                this.accumulatedTime = 0;
            }
        }

        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    generateRandomRules() {
        // Reset grid
        this.grid = Array(this.GRID_HEIGHT).fill().map(() => Array(this.GRID_WIDTH).fill(0));
        
        // Reset ant position and direction
        this.antX = Math.floor(this.GRID_WIDTH / 2);
        this.antY = Math.floor(this.GRID_HEIGHT / 2);
        this.direction = 'E';
        
        // Reset time tracking
        this.lastUpdateTime = performance.now();
        this.accumulatedTime = 0;
        
        // Generate random number of states (3-6)
        const numStates = Math.floor(Math.random() * 4) + 3; // Random between 3 and 6
        this.rules = {};
        
        // Generate rules for each state
        for (let state = 0; state < numStates; state++) {
            const stateRules = [];
            // Create a shuffled list of all colors for this state
            const availableColors = Array.from({length: NUM_COLORS}, (_, i) => i);
            for (let i = availableColors.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [availableColors[i], availableColors[j]] = [availableColors[j], availableColors[i]];
            }
            let colorIndex = 0;
            
            // Generate 5 rules per state
            for (let ruleIndex = 0; ruleIndex < 5; ruleIndex++) {
                // Prevent self-referential loops in first two rules
                let nextState;
                if (ruleIndex < 2) {
                    // First two rules must lead to different states
                    nextState = String((state + Math.floor(Math.random() * (numStates - 1)) + 1) % numStates);
                } else {
                    // More balanced state transitions for other rules
                    if (Math.random() < 0.5) {
                        // 50% chance to stay in current state
                        nextState = String(state);
                    } else {
                        // 50% chance to go to a different state
                        nextState = String((state + Math.floor(Math.random() * (numStates - 1)) + 1) % numStates);
                    }
                }
                
                // More varied movement patterns
                let move;
                if (ruleIndex === 0) {
                    // First rule has equal chance for all directions
                    move = Object.keys(DIRECTIONS)[Math.floor(Math.random() * Object.keys(DIRECTIONS).length)];
                } else {
                    // Other rules have equal chance for all directions
                    move = Object.keys(DIRECTIONS)[Math.floor(Math.random() * Object.keys(DIRECTIONS).length)];
                }
                
                // Use colors in a shuffled order
                const writeColor = availableColors[colorIndex];
                colorIndex = (colorIndex + 1) % NUM_COLORS;
                
                const rule = {
                    writeColor: writeColor,
                    move: move,
                    nextState: nextState
                };
                stateRules.push(rule);
            }
            this.rules[String(state)] = stateRules;
        }
        
        this.currentState = "0";
        this.isLangtonAnt = false;
        
        // Generate and store the seed for these rules
        this.currentSeed = this.generateSeedFromRules();
    }

    generateSeedFromRules() {
        if (this.isLangtonAnt) {
            return "LANGTON";
        }
        
        // Convert rules to a compact binary string
        let binaryStr = "";
        for (const state of Object.keys(this.rules).sort()) {
            for (const rule of this.rules[state]) {
                // Color: 3 bits (0-7)
                binaryStr += rule.writeColor.toString(2).padStart(3, '0');
                // Move: 3 bits (0-7)
                binaryStr += Object.keys(DIRECTIONS).indexOf(rule.move).toString(2).padStart(3, '0');
                // Next state: 3 bits (0-5)
                binaryStr += parseInt(rule.nextState).toString(2).padStart(3, '0');
            }
        }
        
        // Convert binary to base-64
        // First pad the binary string to be divisible by 6
        const padding = (6 - (binaryStr.length % 6)) % 6;
        binaryStr += '0'.repeat(padding);
        
        // Convert to base-64
        const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-";
        let seed = "";
        for (let i = 0; i < binaryStr.length; i += 6) {
            const chunk = binaryStr.slice(i, i + 6);
            const value = parseInt(chunk, 2);
            seed += base64Chars[value];
        }
        
        return seed;
    }

    resetSimulation() {
        // Reset grid
        this.grid = Array(this.GRID_HEIGHT).fill().map(() => Array(this.GRID_WIDTH).fill(0));
        
        // Reset ant position and direction
        this.antX = Math.floor(this.GRID_WIDTH / 2);
        this.antY = Math.floor(this.GRID_HEIGHT / 2);
        this.direction = 'E';
        
        // Reset state if in Turmite mode
        if (!this.isLangtonAnt) {
            this.currentState = "0";
        }
    }

    drawMenu() {
        // Draw semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
        
        // Draw menu background
        this.ctx.fillStyle = `rgb(${this.MENU_BG_COLOR.join(',')})`;
        this.ctx.fillRect(this.MENU_X, this.MENU_Y, this.MENU_WIDTH, this.MENU_HEIGHT);
        this.ctx.strokeStyle = `rgb(${this.MENU_BORDER_COLOR.join(',')})`;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.MENU_X, this.MENU_Y, this.MENU_WIDTH, this.MENU_HEIGHT);

        // Menu layout constants
        const PADDING = 20;
        const SECTION_SPACING = 30;
        const ELEMENT_SPACING = 15;
        let currentY = this.MENU_Y + PADDING;

        // Draw current seed section
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Current Seed', this.SCREEN_WIDTH/2, currentY);
        currentY += 30;

        // Draw seed value
        const currentSeed = this.generateSeedFromRules();
        this.ctx.font = '16px Arial';
        this.ctx.fillText(currentSeed, this.SCREEN_WIDTH/2, currentY);
        currentY += 30;

        // Draw copy button
        const copyRect = {
            x: this.MENU_X + PADDING,
            y: currentY,
            width: this.MENU_WIDTH - PADDING * 2,
            height: this.COPY_BUTTON_HEIGHT
        };
        this.ctx.fillStyle = `rgb(${(this.copyButtonHover ? this.BUTTON_HOVER_COLOR : this.BUTTON_COLOR).join(',')})`;
        this.ctx.fillRect(copyRect.x, copyRect.y, copyRect.width, copyRect.height);
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        this.ctx.fillText('Copy Seed', this.SCREEN_WIDTH/2, copyRect.y + copyRect.height/2 + 8);
        currentY += copyRect.height + SECTION_SPACING;

        // Draw seed finder section
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText('Seed Finder', this.SCREEN_WIDTH/2, currentY);
        currentY += 30;

        // Draw seed input box
        const inputRect = {
            x: this.MENU_X + PADDING,
            y: currentY,
            width: this.MENU_WIDTH - PADDING * 2,
            height: this.INPUT_HEIGHT
        };
        this.ctx.fillStyle = `rgb(${this.INPUT_BG_COLOR.join(',')})`;
        this.ctx.fillRect(inputRect.x, inputRect.y, inputRect.width, inputRect.height);
        if (this.menuInputActive) {
            this.ctx.strokeStyle = 'rgb(100, 100, 255)';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(inputRect.x, inputRect.y, inputRect.width, inputRect.height);
        }
        if (this.menuSeedInput) {
            this.ctx.fillStyle = `rgb(${this.INPUT_TEXT_COLOR.join(',')})`;
            this.ctx.textAlign = 'left';
            this.ctx.font = '16px Arial';
            this.ctx.fillText(this.menuSeedInput, inputRect.x + 10, inputRect.y + this.INPUT_HEIGHT/2 + 6);
        }
        currentY += inputRect.height + ELEMENT_SPACING;

        // Draw error message if any
        if (this.errorMessage && performance.now() - this.errorTimer < 3000) {
            this.ctx.fillStyle = 'rgb(255, 100, 100)';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.errorMessage, this.SCREEN_WIDTH/2, currentY);
            currentY += 25;
        }

        // Draw search button
        const searchRect = {
            x: this.MENU_X + PADDING,
            y: currentY,
            width: this.MENU_WIDTH - PADDING * 2,
            height: this.BUTTON_HEIGHT
        };
        this.ctx.fillStyle = `rgb(${(this.searchButtonHover ? this.BUTTON_HOVER_COLOR : this.BUTTON_COLOR).join(',')})`;
        this.ctx.fillRect(searchRect.x, searchRect.y, searchRect.width, searchRect.height);
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Search', this.SCREEN_WIDTH/2, searchRect.y + searchRect.height/2 + 8);
        currentY += searchRect.height + SECTION_SPACING;

        // Draw automatic mode section
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText('Automatic Mode', this.SCREEN_WIDTH/2, currentY);
        currentY += 30;

        // Draw interval input box
        const intervalRect = {
            x: this.MENU_X + PADDING,
            y: currentY,
            width: this.MENU_WIDTH - PADDING * 2,
            height: this.INPUT_HEIGHT
        };
        this.ctx.fillStyle = `rgb(${this.INPUT_BG_COLOR.join(',')})`;
        this.ctx.fillRect(intervalRect.x, intervalRect.y, intervalRect.width, intervalRect.height);
        if (this.autoIntervalActive) {
            this.ctx.strokeStyle = 'rgb(100, 100, 255)';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(intervalRect.x, intervalRect.y, intervalRect.width, intervalRect.height);
        }
        this.ctx.fillStyle = `rgb(${this.INPUT_TEXT_COLOR.join(',')})`;
        this.ctx.textAlign = 'left';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`${this.autoIntervalInput} seconds`, intervalRect.x + 10, intervalRect.y + this.INPUT_HEIGHT/2 + 6);
        currentY += intervalRect.height + ELEMENT_SPACING;

        // Draw auto mode status
        const statusText = this.autoMode ? "Enabled" : "Disabled";
        const statusColor = this.autoMode ? "rgb(100, 255, 100)" : "rgb(255, 100, 100)";
        this.ctx.fillStyle = statusColor;
        this.ctx.textAlign = 'center';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Status: ${statusText}`, this.SCREEN_WIDTH/2, currentY);
        currentY += 25 + SECTION_SPACING;

        // Draw dimension section
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText('Grid Size', this.SCREEN_WIDTH/2, currentY);
        currentY += 30;

        // Draw width and height inputs side by side
        const inputWidth = (this.MENU_WIDTH - PADDING * 3) / 2;
        
        // Width input
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        this.ctx.fillText('Width:', this.MENU_X + PADDING, currentY);
        const widthRect = {
            x: this.MENU_X + PADDING,
            y: currentY + 5,
            width: inputWidth,
            height: this.INPUT_HEIGHT
        };
        this.ctx.fillStyle = `rgb(${this.INPUT_BG_COLOR.join(',')})`;
        this.ctx.fillRect(widthRect.x, widthRect.y, widthRect.width, widthRect.height);
        if (this.widthActive) {
            this.ctx.strokeStyle = 'rgb(100, 100, 255)';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(widthRect.x, widthRect.y, widthRect.width, widthRect.height);
        }
        this.ctx.fillStyle = `rgb(${this.INPUT_TEXT_COLOR.join(',')})`;
        this.ctx.fillText(`${this.widthInput} px`, widthRect.x + 10, widthRect.y + this.INPUT_HEIGHT/2 + 6);

        // Height input
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        this.ctx.fillText('Height:', this.MENU_X + PADDING * 2 + inputWidth, currentY);
        const heightRect = {
            x: this.MENU_X + PADDING * 2 + inputWidth,
            y: currentY + 5,
            width: inputWidth,
            height: this.INPUT_HEIGHT
        };
        this.ctx.fillStyle = `rgb(${this.INPUT_BG_COLOR.join(',')})`;
        this.ctx.fillRect(heightRect.x, heightRect.y, heightRect.width, heightRect.height);
        if (this.heightActive) {
            this.ctx.strokeStyle = 'rgb(100, 100, 255)';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(heightRect.x, heightRect.y, heightRect.width, heightRect.height);
        }
        this.ctx.fillStyle = `rgb(${this.INPUT_TEXT_COLOR.join(',')})`;
        this.ctx.fillText(`${this.heightInput} px`, heightRect.x + 10, heightRect.y + this.INPUT_HEIGHT/2 + 6);

        // Draw apply settings text instead of button
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        this.ctx.textAlign = 'center';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Press Enter to apply settings', this.SCREEN_WIDTH/2, this.MENU_Y + this.MENU_HEIGHT - 30);
        this.ctx.textAlign = 'left';
    }

    handleMenuMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Menu layout constants
        const PADDING = 20;
        const SECTION_SPACING = 30;
        const ELEMENT_SPACING = 15;
        let currentY = this.MENU_Y + PADDING;

        // Calculate positions
        currentY += 60; // Skip title and seed text

        // Copy button
        const copyRect = {
            x: this.MENU_X + PADDING,
            y: currentY,
            width: this.MENU_WIDTH - PADDING * 2,
            height: this.COPY_BUTTON_HEIGHT
        };
        if (mouseX >= copyRect.x && mouseX <= copyRect.x + copyRect.width &&
            mouseY >= copyRect.y && mouseY <= copyRect.y + copyRect.height) {
            const currentSeed = this.generateSeedFromRules();
            navigator.clipboard.writeText(currentSeed);
            return true;
        }
        currentY += copyRect.height + SECTION_SPACING + 30; // Skip section title

        // Seed input box
        const inputRect = {
            x: this.MENU_X + PADDING,
            y: currentY,
            width: this.MENU_WIDTH - PADDING * 2,
            height: this.INPUT_HEIGHT
        };
        this.menuInputActive = mouseX >= inputRect.x && mouseX <= inputRect.x + inputRect.width &&
                              mouseY >= inputRect.y && mouseY <= inputRect.y + inputRect.height;
        if (this.menuInputActive) {
            this.autoIntervalActive = false;
            this.widthActive = false;
            this.heightActive = false;
        }
        currentY += inputRect.height + ELEMENT_SPACING;

        // Add space for error message if it exists
        if (this.errorMessage && performance.now() - this.errorTimer < 3000) {
            currentY += 25;
        }

        // Search button
        const searchRect = {
            x: this.MENU_X + PADDING,
            y: currentY,
            width: this.MENU_WIDTH - PADDING * 2,
            height: this.BUTTON_HEIGHT
        };
        if (mouseX >= searchRect.x && mouseX <= searchRect.x + searchRect.width &&
            mouseY >= searchRect.y && mouseY <= searchRect.y + searchRect.height) {
            if (this.menuSeedInput) {
                if (this.replicateRulesFromSeed(this.menuSeedInput)) {
                    this.menuSeedInput = "";
                    this.menuInputActive = false;
                    this.showMenu = false;
                    this.paused = false;
                    this.lastUpdateTime = performance.now();
                    this.accumulatedTime = 0;
                }
            }
            return true;
        }
        currentY += searchRect.height + SECTION_SPACING + 30; // Skip section title

        // Interval input box
        const intervalRect = {
            x: this.MENU_X + PADDING,
            y: currentY,
            width: this.MENU_WIDTH - PADDING * 2,
            height: this.INPUT_HEIGHT
        };
        this.autoIntervalActive = mouseX >= intervalRect.x && mouseX <= intervalRect.x + intervalRect.width &&
                                 mouseY >= intervalRect.y && mouseY <= intervalRect.y + intervalRect.height;
        if (this.autoIntervalActive) {
            this.menuInputActive = false;
            this.widthActive = false;
            this.heightActive = false;
        }
        currentY += intervalRect.height + ELEMENT_SPACING;

        // Add space for status text
        currentY += 25 + SECTION_SPACING + 30; // Skip status, spacing, and section title

        // Width and height inputs
        const inputWidth = (this.MENU_WIDTH - PADDING * 3) / 2;
        
        // Width input
        const widthRect = {
            x: this.MENU_X + PADDING,
            y: currentY + 5,
            width: inputWidth,
            height: this.INPUT_HEIGHT
        };
        this.widthActive = mouseX >= widthRect.x && mouseX <= widthRect.x + widthRect.width &&
                          mouseY >= widthRect.y && mouseY <= widthRect.y + widthRect.height;
        if (this.widthActive) {
            this.menuInputActive = false;
            this.autoIntervalActive = false;
            this.heightActive = false;
        }

        // Height input
        const heightRect = {
            x: this.MENU_X + PADDING * 2 + inputWidth,
            y: currentY + 5,
            width: inputWidth,
            height: this.INPUT_HEIGHT
        };
        this.heightActive = mouseX >= heightRect.x && mouseX <= heightRect.x + heightRect.width &&
                           mouseY >= heightRect.y && mouseY <= heightRect.y + heightRect.height;
        if (this.heightActive) {
            this.menuInputActive = false;
            this.autoIntervalActive = false;
            this.widthActive = false;
        }
    }

    handleKeyUp(e) {
        if (this.showMenu) {
            if (e.key === 'Enter') {
                // Handle seed input
                if (this.menuInputActive && this.menuSeedInput) {
                    if (this.replicateRulesFromSeed(this.menuSeedInput)) {
                        this.menuSeedInput = "";
                        this.menuInputActive = false;
                        this.showMenu = false;
                        this.paused = false;
                        this.lastUpdateTime = performance.now();
                        this.accumulatedTime = 0;
                    }
                    return;
                }
                
                // Handle auto interval
                if (this.autoIntervalActive && this.autoIntervalInput) {
                    const newInterval = parseInt(this.autoIntervalInput);
                    if (!isNaN(newInterval) && newInterval >= 1 && newInterval <= 60) {
                        this.autoInterval = newInterval * 1000;
                        this.autoIntervalActive = false;
                        this.showMenu = false;
                        this.paused = false;
                        this.lastUpdateTime = performance.now();
                        this.accumulatedTime = 0;
                    } else {
                        this.errorMessage = "Interval must be between 1 and 60 seconds";
                        this.errorTimer = performance.now();
                    }
                    return;
                }
                
                // Handle grid size
                if ((this.widthActive || this.heightActive) && (this.widthInput || this.heightInput)) {
                    const newWidth = parseInt(this.widthInput);
                    const newHeight = parseInt(this.heightInput);
                    if (!isNaN(newWidth) && !isNaN(newHeight) &&
                        newWidth >= 100 && newWidth <= this.MAX_GRID_SIZE &&
                        newHeight >= 100 && newHeight <= this.MAX_GRID_SIZE) {
                        this.GRID_WIDTH_PX = newWidth;
                        this.GRID_HEIGHT_PX = newHeight;
                        this.GRID_WIDTH = this.GRID_WIDTH_PX / this.CELL_SIZE;
                        this.GRID_HEIGHT = this.GRID_HEIGHT_PX / this.CELL_SIZE;
                        this.resetSimulation();
                        this.widthActive = false;
                        this.heightActive = false;
                        this.showMenu = false;
                        this.paused = false;
                        this.lastUpdateTime = performance.now();
                        this.accumulatedTime = 0;
                    } else {
                        this.errorMessage = `Size must be between 100 and ${this.MAX_GRID_SIZE} pixels`;
                        this.errorTimer = performance.now();
                    }
                    return;
                }
            }

            if (this.menuInputActive) {
                if (e.key === 'Backspace') {
                    this.menuSeedInput = this.menuSeedInput.slice(0, -1);
                } else if (e.key === 'Escape') {
                    this.showMenu = false;
                    this.paused = false;
                    this.lastUpdateTime = performance.now();
                    this.accumulatedTime = 0;
                } else if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
                    navigator.clipboard.readText().then(text => {
                        this.menuSeedInput = text.replace(/[^a-zA-Z0-9+-]/g, '');
                    });
                } else if (e.key.length === 1 && /[a-zA-Z0-9+-]/.test(e.key)) {
                    this.menuSeedInput += e.key;
                }
            } else if (this.autoIntervalActive) {
                if (e.key === 'Backspace') {
                    this.autoIntervalInput = this.autoIntervalInput.slice(0, -1);
                } else if (e.key === 'Escape') {
                    this.autoIntervalActive = false;
                } else if (e.key >= '0' && e.key <= '9') {
                    this.autoIntervalInput += e.key;
                }
            } else if (this.widthActive || this.heightActive) {
                if (e.key === 'Backspace') {
                    if (this.widthActive) {
                        this.widthInput = this.widthInput.slice(0, -1);
                    } else {
                        this.heightInput = this.heightInput.slice(0, -1);
                    }
                } else if (e.key === 'Escape') {
                    this.widthActive = false;
                    this.heightActive = false;
                } else if (e.key >= '0' && e.key <= '9') {
                    if (this.widthActive) {
                        this.widthInput += e.key;
                    } else {
                        this.heightInput += e.key;
                    }
                }
            }
        }
    }

    replicateRulesFromSeed(seed) {
        if (seed === "LANGTON") {
            this.initializeLangtonAnt();
            return true;
        }
        
        try {
            // Reset grid and ant
            this.grid = Array(this.GRID_HEIGHT).fill().map(() => Array(this.GRID_WIDTH).fill(0));
            this.antX = Math.floor(this.GRID_WIDTH / 2);
            this.antY = Math.floor(this.GRID_HEIGHT / 2);
            this.direction = 'E';
            
            // Convert base-64 to binary
            const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-";
            let binaryStr = "";
            for (const char of seed) {
                if (!base64Chars.includes(char)) {
                    throw new Error("Invalid character in seed");
                }
                const value = base64Chars.indexOf(char);
                binaryStr += value.toString(2).padStart(6, '0');
            }
            
            // Remove any trailing padding bits
            while (binaryStr.length % 9 !== 0) {
                binaryStr = binaryStr.slice(0, -1);
            }
            
            // Parse the binary string
            this.rules = {};
            let state = 0;
            let ruleIndex = 0;
            let i = 0;
            
            while (i < binaryStr.length) {
                if (ruleIndex === 0) {
                    this.rules[String(state)] = [];
                }
                
                // Ensure we have enough bits left
                if (i + 9 > binaryStr.length) {
                    throw new Error("Invalid seed length");
                }
                
                // Parse color (3 bits)
                const color = parseInt(binaryStr.slice(i, i + 3), 2);
                if (color >= NUM_COLORS) {
                    throw new Error("Invalid color value");
                }
                i += 3;
                
                // Parse move (3 bits)
                const moveIndex = parseInt(binaryStr.slice(i, i + 3), 2);
                if (moveIndex >= Object.keys(DIRECTIONS).length) {
                    throw new Error("Invalid move value");
                }
                const move = Object.keys(DIRECTIONS)[moveIndex];
                i += 3;
                
                // Parse next state (3 bits)
                const nextState = String(parseInt(binaryStr.slice(i, i + 3), 2));
                i += 3;
                
                const rule = {
                    writeColor: color,
                    move: move,
                    nextState: nextState
                };
                this.rules[String(state)].push(rule);
                
                ruleIndex++;
                if (ruleIndex === 5) {
                    ruleIndex = 0;
                    state++;
                    if (state > 6) {
                        throw new Error("Too many states");
                    }
                }
            }
            
            if (Object.keys(this.rules).length === 0) {
                throw new Error("No valid rules generated");
            }
            
            this.currentState = "0";
            this.isLangtonAnt = false;
            this.currentSeed = seed;
            return true;
            
        } catch (error) {
            this.errorMessage = `Error: ${error.message}`;
            this.errorTimer = performance.now();
            return false;
        }
    }

    drawHelpMenu() {
        // Draw semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
        
        // Draw help menu background
        this.ctx.fillStyle = `rgb(${this.MENU_BG_COLOR.join(',')})`;
        this.ctx.fillRect(this.HELP_MENU_X, this.HELP_MENU_Y, this.HELP_MENU_WIDTH, this.HELP_MENU_HEIGHT);
        this.ctx.strokeStyle = `rgb(${this.MENU_BORDER_COLOR.join(',')})`;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.HELP_MENU_X, this.HELP_MENU_Y, this.HELP_MENU_WIDTH, this.HELP_MENU_HEIGHT);

        // Draw title
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Keyboard Controls', this.SCREEN_WIDTH/2, this.HELP_MENU_Y + 40);

        // Draw controls
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        let y = this.HELP_MENU_Y + 80;
        const lineHeight = 30;
        const keyWidth = 100;
        const descX = this.HELP_MENU_X + keyWidth + 20;

        const controls = [
            ['Space', 'Generate new rules'],
            ['H', 'Toggle UI visibility'],
            ['P', 'Pause/Resume simulation'],
            ['R', 'Reset simulation'],
            ['A', 'Toggle automatic mode'],
            ['F', 'Toggle fullscreen'],
            ['Esc', 'Open/Close menu'],
            ['←', 'Decrease speed'],
            ['→', 'Increase speed']
        ];

        for (const [key, desc] of controls) {
            // Draw key
            this.ctx.fillStyle = `rgb(${this.BUTTON_COLOR.join(',')})`;
            this.ctx.fillRect(this.HELP_MENU_X + 20, y - 20, keyWidth, 25);
            this.ctx.fillStyle = 'rgb(255, 255, 255)';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(key, this.HELP_MENU_X + 20 + keyWidth/2, y);
            
            // Draw description
            this.ctx.textAlign = 'left';
            this.ctx.fillText(desc, descX, y);
            
            y += lineHeight;
        }

        // Draw close button
        const closeButton = {
            x: this.HELP_MENU_X + this.HELP_MENU_WIDTH - 100,
            y: this.HELP_MENU_Y + this.HELP_MENU_HEIGHT - 40,
            width: 80,
            height: 30
        };
        this.ctx.fillStyle = `rgb(${this.BUTTON_COLOR.join(',')})`;
        this.ctx.fillRect(closeButton.x, closeButton.y, closeButton.width, closeButton.height);
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Close', closeButton.x + closeButton.width/2, closeButton.y + closeButton.height/2 + 8);
        this.ctx.textAlign = 'left';
    }

    drawWelcomePopup() {
        // Draw semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
        
        // Draw welcome popup background
        this.ctx.fillStyle = `rgb(${this.MENU_BG_COLOR.join(',')})`;
        this.ctx.fillRect(this.WELCOME_X, this.WELCOME_Y, this.WELCOME_WIDTH, this.WELCOME_HEIGHT);
        this.ctx.strokeStyle = `rgb(${this.MENU_BORDER_COLOR.join(',')})`;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.WELCOME_X, this.WELCOME_Y, this.WELCOME_WIDTH, this.WELCOME_HEIGHT);

        // Draw welcome message
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        
        const message = `Dear Internet Person,

Welcome to Ant Eater, a simulation inspired by Langton's Ant, created for the sole purpose of generating trippy, mind-bending patterns.
Each run spawns a completely new and random ruleset. Also, just so you know, there's a very real prize which I will hand out in person for the first person to witness all 2.8 quintillion possibilities.

Hit the Help button to learn the controls, and dive in. Enjoy the chaos.

— eBrows`;

        // Split message into lines and wrap text
        const maxWidth = this.WELCOME_WIDTH - 40; // 20px padding on each side
        const lineHeight = 25;
        let y = this.WELCOME_Y + 40;
        
        const paragraphs = message.split('\n\n');
        for (const paragraph of paragraphs) {
            const words = paragraph.split(' ');
            let currentLine = '';
            
            for (const word of words) {
                const testLine = currentLine ? `${currentLine} ${word}` : word;
                const metrics = this.ctx.measureText(testLine);
                
                if (metrics.width > maxWidth) {
                    this.ctx.fillText(currentLine, this.WELCOME_X + 20, y);
                    y += lineHeight;
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }
            
            if (currentLine) {
                this.ctx.fillText(currentLine, this.WELCOME_X + 20, y);
                y += lineHeight;
            }
            
            y += lineHeight; // Add extra space between paragraphs
        }

        // Draw close button
        const closeButton = {
            x: this.WELCOME_X + (this.WELCOME_WIDTH - 100) / 2,
            y: this.WELCOME_Y + this.WELCOME_HEIGHT - 50,
            width: 100,
            height: 30
        };
        this.ctx.fillStyle = `rgb(${(this.welcomeButtonHover ? this.BUTTON_HOVER_COLOR : this.BUTTON_COLOR).join(',')})`;
        this.ctx.fillRect(closeButton.x, closeButton.y, closeButton.width, closeButton.height);
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Close', closeButton.x + closeButton.width/2, closeButton.y + closeButton.height/2 + 8);
        this.ctx.textAlign = 'left';
    }
}

// Create and start the simulation when the page loads
window.addEventListener('load', () => {
    new Turmite();
}); 