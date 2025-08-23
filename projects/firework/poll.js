// Pineapple Pizza Gesture Poll - JavaScript
// This script integrates MediaPipe hand gesture recognition with Firebase Realtime Database
// Students can vote using thumbs up/down gestures detected through their webcam

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  
  // ========================================
  // STEP 1: FIREBASE CONFIGURATION
  // ========================================
  // Replace these values with your actual Firebase project configuration
  // Get these from Firebase Console > Project Settings > General > Your apps
  
  const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();

  // ========================================
  // STEP 2: GET REFERENCES TO HTML ELEMENTS
  // ========================================
  
  const videoElement = document.getElementById('videoElement');
  const canvasElement = document.getElementById('canvasElement');
  const canvasCtx = canvasElement.getContext('2d');
  const gestureStatus = document.getElementById('gestureStatus');
  const confidenceBar = document.getElementById('confidenceBar');
  const enableCameraBtn = document.getElementById('enableCameraBtn');
  const pineappleCount = document.getElementById('pineappleCount');
  const traditionalCount = document.getElementById('traditionalCount');
  const totalVotes = document.getElementById('totalVotes');
  const connectionStatus = document.getElementById('connection-status');
  const pineappleBar = document.getElementById('pineappleBar');
  const traditionalBar = document.getElementById('traditionalBar');

  // ========================================
  // STEP 3: GESTURE DETECTION VARIABLES
  // ========================================
  
  let currentGesture = null;
  let gestureConfidence = 0;
  let lastVoteTime = 0;
  const VOTE_COOLDOWN = 2000; // 2 seconds between votes to prevent spam
  let hands; // MediaPipe Hands instance
  let camera; // Camera instance

  // ========================================
  // STEP 4: INITIALIZE MEDIAPIPE HANDS
  // ========================================
  
  function initializeGestureRecognition() {
    // Create MediaPipe Hands instance
    hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    // Configure hand detection settings
    hands.setOptions({
      maxNumHands: 1,              // Only detect one hand at a time
      modelComplexity: 1,          // Balance between accuracy and performance
      minDetectionConfidence: 0.7, // Minimum confidence for hand detection
      minTrackingConfidence: 0.5   // Minimum confidence for hand tracking
    });

    // Set up results callback
    hands.onResults(onResults);

    // Don't start camera automatically - wait for user click
  }

  function startCamera() {
    // Initialize camera with better error handling
    camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({image: videoElement});
      },
      width: 640,
      height: 480
    });

    // Update status to show camera permission request
    gestureStatus.textContent = '📷 Requesting camera access...';
    gestureStatus.style.background = 'rgba(255, 193, 7, 0.9)';
    enableCameraBtn.style.display = 'none';

    camera.start().then(() => {
      console.log('📷 Camera started successfully');
      gestureStatus.textContent = '✋ Show your hand to vote!';
      gestureStatus.style.background = 'rgba(40, 167, 69, 0.9)';
    }).catch((error) => {
      console.error('❌ Error starting camera:', error);

      // Show button again on error
      enableCameraBtn.style.display = 'block';

      // Provide more specific error messages
      if (error.name === 'NotAllowedError') {
        gestureStatus.innerHTML = '❌ Camera access denied<br><small>Please click "Allow" when prompted and try again</small>';
      } else if (error.name === 'NotFoundError') {
        gestureStatus.innerHTML = '❌ No camera found<br><small>Please connect a camera and try again</small>';
      } else if (error.name === 'NotSupportedError') {
        gestureStatus.innerHTML = '❌ Camera not supported<br><small>Try using Chrome or Firefox</small>';
      } else {
        gestureStatus.innerHTML = '❌ Camera error<br><small>Please try again</small>';
      }

      gestureStatus.style.background = 'rgba(220, 53, 69, 0.9)';
      gestureStatus.style.color = 'white';
    });
  }

  // Add button click event listener
  enableCameraBtn.addEventListener('click', startCamera);

  // ========================================
  // STEP 5: GESTURE RECOGNITION CALLBACK
  // ========================================
  
  function onResults(results) {
    // Set canvas size to match video
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    
    // Clear canvas and prepare for drawing
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      // Draw hand landmarks and connections
      for (const landmarks of results.multiHandLandmarks) {
        // Draw connections between landmarks (hand skeleton)
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: '#00FF00', 
          lineWidth: 2
        });
        
        // Draw individual landmarks (joint points)
        drawLandmarks(canvasCtx, landmarks, {
          color: '#FF0000', 
          lineWidth: 1,
          radius: 3
        });
        
        // Detect and process gesture
        const gesture = detectGesture(landmarks);
        updateGestureStatus(gesture);
      }
    } else {
      // No hand detected
      currentGesture = null;
      gestureStatus.textContent = '✋ Show your hand to vote!';
      gestureStatus.style.background = 'rgba(0,0,0,0.8)';
      confidenceBar.style.width = '0%';
    }
    
    canvasCtx.restore();
  }

  // ========================================
  // STEP 6: GESTURE DETECTION LOGIC
  // ========================================
  
  function detectGesture(landmarks) {
    // Get landmark positions for gesture analysis
    // Landmark indices based on MediaPipe hand model
    const thumb_tip = landmarks[4];    // Thumb tip
    const thumb_mcp = landmarks[2];    // Thumb MCP joint
    const index_tip = landmarks[8];    // Index finger tip
    const index_pip = landmarks[6];    // Index finger PIP joint
    const middle_tip = landmarks[12];  // Middle finger tip
    const middle_pip = landmarks[10];  // Middle finger PIP joint
    const ring_tip = landmarks[16];    // Ring finger tip
    const ring_pip = landmarks[14];    // Ring finger PIP joint
    const pinky_tip = landmarks[20];   // Pinky tip
    const pinky_pip = landmarks[18];   // Pinky PIP joint
    
    // THUMBS UP DETECTION
    // Thumb should be up (tip higher than MCP joint)
    const isThumbUp = thumb_tip.y < thumb_mcp.y - 0.05; // Added threshold for stability
    
    // Other fingers should be curled (tips lower than PIP joints)
    const otherFingersDown = index_tip.y > index_pip.y && 
                            middle_tip.y > middle_pip.y && 
                            ring_tip.y > ring_pip.y && 
                            pinky_tip.y > pinky_pip.y;
    
    // THUMBS DOWN DETECTION  
    // Thumb should be down (tip lower than MCP joint)
    const isThumbDown = thumb_tip.y > thumb_mcp.y + 0.05; // Added threshold for stability
    
    // Other fingers should be extended (tips higher than PIP joints)
    const otherFingersUp = index_tip.y < index_pip.y && 
                          middle_tip.y < middle_pip.y && 
                          ring_tip.y < ring_pip.y && 
                          pinky_tip.y < pinky_pip.y;
    
    // Return detected gesture with confidence
    if (isThumbUp && otherFingersDown) {
      return { type: 'thumbs_up', confidence: 0.9 };
    } else if (isThumbDown && otherFingersUp) {
      return { type: 'thumbs_down', confidence: 0.9 };
    }
    
    return null; // No gesture detected
  }

  // ========================================
  // STEP 7: UPDATE GESTURE STATUS & AUTO-VOTE
  // ========================================
  
  function updateGestureStatus(gesture) {
    if (gesture) {
      currentGesture = gesture.type;
      gestureConfidence = gesture.confidence;
      
      // Update UI based on detected gesture
      if (gesture.type === 'thumbs_up') {
        gestureStatus.textContent = '👍 TEAM PINEAPPLE DETECTED!';
        gestureStatus.style.background = 'rgba(255, 210, 63, 0.9)';
      } else if (gesture.type === 'thumbs_down') {
        gestureStatus.textContent = '👎 TEAM TRADITIONAL DETECTED!';
        gestureStatus.style.background = 'rgba(196, 69, 105, 0.9)';
      }
      
      // Update confidence bar
      confidenceBar.style.width = (gestureConfidence * 100) + '%';
      
      // Auto-vote if confidence is high enough and cooldown has passed
      if (gestureConfidence > 0.8 && Date.now() - lastVoteTime > VOTE_COOLDOWN) {
        castVote(gesture.type);
      }
    }
  }

  // ========================================
  // STEP 8: VOTING LOGIC
  // ========================================
  
  function castVote(gestureType) {
    lastVoteTime = Date.now(); // Update last vote time for cooldown
    
    console.log(`🗳️ Casting vote: ${gestureType}`);
    
    if (gestureType === 'thumbs_up') {
      // Vote for pineapple
      database.ref('pizza_poll/pineapple').once('value')
        .then(function(snapshot) {
          const currentCount = snapshot.val() || 0;
          const newCount = currentCount + 1;
          
          return database.ref('pizza_poll/pineapple').set(newCount);
        })
        .then(function() {
          console.log('✅ Pineapple vote recorded successfully');
          createParticles('🍍', true);
          showVoteConfirmation('Welcome to Team Pineapple! 🍍', '#ffd23f');
        })
        .catch(function(error) {
          console.error('❌ Error recording pineapple vote:', error);
          showError('Failed to record vote. Please try again.');
        });
        
    } else if (gestureType === 'thumbs_down') {
      // Vote for traditional
      database.ref('pizza_poll/traditional').once('value')
        .then(function(snapshot) {
          const currentCount = snapshot.val() || 0;
          const newCount = currentCount + 1;
          
          return database.ref('pizza_poll/traditional').set(newCount);
        })
        .then(function() {
          console.log('✅ Traditional vote recorded successfully');
          createParticles('🍅', false);
          showVoteConfirmation('Welcome to Team Traditional! 🍅', '#c44569');
        })
        .catch(function(error) {
          console.error('❌ Error recording traditional vote:', error);
          showError('Failed to record vote. Please try again.');
        });
    }
  }

  // ========================================
  // STEP 9: VISUAL EFFECTS - PARTICLE SYSTEM
  // ========================================
  
  function createParticles(emoji, isPineapple) {
    const container = document.querySelector('.camera-container');
    const particleCount = 12; // Number of particles to create
    
    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = emoji;
        
        // Random starting position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Add some variety to particle size
        const scale = 0.8 + Math.random() * 0.4; // Scale between 0.8 and 1.2
        particle.style.transform = `scale(${scale})`;
        
        container.appendChild(particle);
        
        // Remove particle after animation completes
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, 3000);
      }, i * 80); // Stagger particle creation
    }
  }

  // ========================================
  // STEP 10: USER FEEDBACK FUNCTIONS
  // ========================================
  
  function showVoteConfirmation(message, color) {
    const confirmation = document.createElement('div');
    confirmation.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: ${color || 'rgba(0,0,0,0.9)'};
      color: white;
      padding: 25px 35px;
      border-radius: 15px;
      font-size: 1.5rem;
      font-weight: bold;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 2000;
      animation: confirmationPop 0.6s ease-out;
    `;
    confirmation.textContent = message;
    
    document.body.appendChild(confirmation);
    
    setTimeout(() => {
      if (confirmation.parentNode) {
        confirmation.style.animation = 'confirmationFadeOut 0.4s ease-in';
        setTimeout(() => {
          confirmation.parentNode.removeChild(confirmation);
        }, 400);
      }
    }, 2000);
  }
  
  function showError(message) {
    const error = document.createElement('div');
    error.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4757;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: bold;
      z-index: 1000;
      box-shadow: 0 5px 15px rgba(255, 71, 87, 0.4);
    `;
    error.textContent = message;
    
    document.body.appendChild(error);
    
    setTimeout(() => {
      if (error.parentNode) {
        error.parentNode.removeChild(error);
      }
    }, 4000);
  }

  // ========================================
  // STEP 11: FIREBASE REAL-TIME LISTENERS
  // ========================================
  
  // Listen for pineapple vote changes
  database.ref('pizza_poll/pineapple').on('value', function(snapshot) {
    const count = snapshot.val() || 0;
    pineappleCount.textContent = count;
    updateTotalVotes();
    updatePercentageBars();
    
    console.log('🍍 Pineapple votes updated:', count);
  });

  // Listen for traditional vote changes
  database.ref('pizza_poll/traditional').on('value', function(snapshot) {
    const count = snapshot.val() || 0;
    traditionalCount.textContent = count;
    updateTotalVotes();
    updatePercentageBars();
    
    console.log('🍅 Traditional votes updated:', count);
  });

  // ========================================
  // STEP 12: UI UPDATE FUNCTIONS
  // ========================================
  
  function updateTotalVotes() {
    const pineapple = parseInt(pineappleCount.textContent) || 0;
    const traditional = parseInt(traditionalCount.textContent) || 0;
    const total = pineapple + traditional;
    
    totalVotes.textContent = total;
  }
  
  function updatePercentageBars() {
    const pineapple = parseInt(pineappleCount.textContent) || 0;
    const traditional = parseInt(traditionalCount.textContent) || 0;
    const total = pineapple + traditional;
    
    if (total > 0) {
      const pineapplePercent = (pineapple / total) * 100;
      const traditionalPercent = (traditional / total) * 100;
      
      pineappleBar.style.width = pineapplePercent + '%';
      traditionalBar.style.width = traditionalPercent + '%';
    } else {
      pineappleBar.style.width = '0%';
      traditionalBar.style.width = '0%';
    }
  }

  // ========================================
  // STEP 13: CONNECTION STATUS MONITORING
  // ========================================
  
  database.ref('.info/connected').on('value', function(snapshot) {
    if (snapshot.val()) {
      connectionStatus.innerHTML = '<p style="color: #2ed573;">🔥 Live & Connected to Firebase!</p>';
      console.log('✅ Connected to Firebase');
    } else {
      connectionStatus.innerHTML = '<p style="color: #ff4757;">❌ Connection Lost - Reconnecting...</p>';
      console.log('❌ Disconnected from Firebase');
    }
  });

  // ========================================
  // STEP 14: INITIALIZATION
  // ========================================
  
  // Initialize poll data in Firebase if it doesn't exist
  database.ref('pizza_poll').once('value')
    .then(function(snapshot) {
      if (!snapshot.exists()) {
        console.log('🔧 Initializing poll data...');
        return database.ref('pizza_poll').set({
          pineapple: 0,
          traditional: 0
        });
      }
    })
    .then(function() {
      console.log('✅ Poll data initialized successfully');
    })
    .catch(function(error) {
      console.error('❌ Error initializing poll:', error);
    });

  // Add CSS animations for confirmations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes confirmationPop {
      0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
      50% { transform: translate(-50%, -50%) scale(1.1); }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    @keyframes confirmationFadeOut {
      from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
  `;
  document.head.appendChild(style);

  // Start gesture recognition
  initializeGestureRecognition();

  console.log('🍕 Pineapple Pizza Gesture Voting App initialized successfully!');
  console.log('👋 Ready to detect hand gestures for voting!');
});

// ========================================
// TUTORIAL NOTES FOR STUDENTS
// ========================================
/*
KEY CONCEPTS DEMONSTRATED:

1. MEDIAPIPE INTEGRATION:
   - Real-time hand tracking using machine learning
   - Landmark detection and gesture analysis
   - Camera access and video processing

2. FIREBASE REALTIME DATABASE:
   - Real-time data synchronization across users
   - Event listeners for live updates
   - Error handling and connection monitoring

3. COMPUTER VISION CONCEPTS:
   - Hand landmark detection (21 points per hand)
   - Gesture classification using coordinate analysis
   - Confidence scoring and threshold-based voting

4. USER EXPERIENCE DESIGN:
   - Visual feedback for detected gestures
   - Particle effects for engagement
   - Vote confirmation and error handling
   - Responsive design considerations

5. WEB APIS USED:
   - getUserMedia() for camera access (via MediaPipe Camera utility)
   - Canvas API for drawing hand landmarks
   - Firebase Web SDK for database operations
   - CSS animations and transforms for effects

EXTEND THIS PROJECT:
- Add more gesture types (peace sign, fist, etc.)
- Implement user authentication
- Add voice recognition alongside gestures
- Create gesture-based games or interactions
- Add data visualization charts
- Implement gesture training/calibration
*/