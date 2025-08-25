├── index.html
├── styles.css
├── script.js
├── STRUCTURE.md
└── README.md


# The Lost Kite - Project Structure

## Files
- index.html: Main HTML file with the structure of the storybook
- styles.css: CSS styles for layout, typography, and responsive design
- script.js: JavaScript functionality for navigation, language switching, etc.

## Components

### HTML Structure
- .screen: Main container for the entire application
- .visual: Container for the background visual (canvas)
- .veil: Semi-transparent overlay for text legibility
- .text: Container for the story text (both languages)
- .controls: Navigation and action buttons
- .bottom-left: Text size controls

### JavaScript Functionality

#### Story Data
The story is stored as an array of objects, each containing:
- en: English text
- es: Spanish text
- color1, color2: Colors for gradient background

#### Core Functions
- init(): Initializes the application
- setupEventListeners(): Sets up all event listeners
- renderPage(): Updates content based on current page
- prevPage(), nextPage(): Navigation functions
- toggleLanguage(): Switches between English and Spanish
- increaseFontSize(), decreaseFontSize(): Text size controls
- drawBackground(): Creates gradient background with simple kite drawing
- updatePageIndicator(): Shows current page position
- poke(): Handles auto-hiding of controls

#### Navigation Methods
1. Button clicks (previous/next)
2. Touch swipes (left/right)
3. Screen taps (left/right sides)
4. Keyboard events (left/right arrows)

#### Responsive Design
- Uses CSS variables and clamp() for responsive sizing
- Adapts to different screen orientations
- Respects reduced motion preferences

#### Persistence
- Font size preference is saved to localStorage
