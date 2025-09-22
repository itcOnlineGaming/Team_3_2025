<script lang="ts">
  // Player progress (0-100, represents percentage along the path)
  let playerProgress = 25;
  
  // Map locations/waypoints
  const waypoints = [ // Id, name for display, x and y, completed flag
    { id: 1, name: "Point 1", x: 10, y: 80, completed: true },
    { id: 2, name: "Point 2", x: 30, y: 60, completed: true },
    { id: 3, name: "Point 3", x: 50, y: 40, completed: false },
    { id: 4, name: "Point 4", x: 70, y: 30, completed: false },
    { id: 5, name: "Point 5", x: 90, y: 10, completed: false }
  ];
  
  // Path coordinates for the curved line
  // M is starting point, Q is qurve point link
  const pathData = "M 10 80 Q 20 80, 30 60 Q 40 50, 50 40 Q 60 35, 70 30 Q 80 20, 90 10";
  
  // Force completion of task
  function simulateTaskCompletion() {
    if (playerProgress < 100) {
      playerProgress = Math.min(playerProgress + 25, 100);
      
      // Update waypoint completion based on progress
      waypoints.forEach(waypoint => {
        const waypointProgress = ((waypoint.id - 1) / (waypoints.length - 1)) * 100; // 
        waypoint.completed = playerProgress >= waypointProgress; // Mark completed if past 
      });
    }
  }
  
  // Force Reset
  function resetProgress() {
    playerProgress = 0;
    waypoints.forEach((waypoint, index) => {
      waypoint.completed = index === 0;
    });
  }
  
  // Calculate player position along the path // PN: $ is a reative agent so it recalculates
  $: playerPosition = getPlayerPosition(playerProgress);
  
  // Where should player be
  function getPlayerPosition(progress: number) {
    const normalizedProgress = progress / 100; 
    const startPoint = { x: 10, y: 80 }; // Start
    const endPoint = { x: 90, y: 10 };  // End
    
    return { // Linear interpolation to force locations for now
      x: startPoint.x + (endPoint.x - startPoint.x) * normalizedProgress,
      y: startPoint.y + (endPoint.y - startPoint.y) * normalizedProgress
    };
  }
</script>

<main class="container">
    <!-- Navigation -->
  <nav class="navigation">
    <div class="button-group">
      <a href="/game" class="nav-button">Game Page</a>
    </div>
  </nav>

  <!-- Progress Path -->
  <div class="progress-section">
    <h1>Progress Path</h1>
    
    <div class="progress-info">
      <p>Progress: {playerProgress}%</p>
    </div>
    
    <!-- Simple Path Visualization -->
    <div class="path-container">
      <svg viewBox="0 0 100 100" class="progress-path"> <!-- Box visual container -->
        <!-- The curved path -->
        <path 
          d={pathData} 
          fill="none" 
          stroke="black" 
          stroke-width="2"
        />
        
        <!-- Waypoints -->
        {#each waypoints as waypoint}
          <circle 
            cx={waypoint.x} 
            cy={waypoint.y} 
            r="4" 
            fill={waypoint.completed ? "black" : "white"}
            stroke="black"
            stroke-width="2"
          />
        {/each}
        
        <!-- Player marker -->
        <circle 
          cx={playerPosition.x} 
          cy={playerPosition.y} 
          r="3" 
          fill="gray" 
          stroke="black" 
          stroke-width="1"
        />
      </svg>
    </div>
    
    <!-- Controls -->
    <div class="controls">
      <button on:click={simulateTaskCompletion} class="control-button">
        Complete Task
      </button>
      <button on:click={resetProgress} class="control-button">
        Reset
      </button>
    </div>
  </div>
</main>



<style>
  :global(body.dark) {
    background: #222;
    color: #eee;
  }
  :global(body.dark) h1,
  :global(body.dark) .progress-info p,
  :global(body.dark) .nav-button,
  :global(body.dark) .control-button {
    color: #eee;
  }
  :global(body.dark) .control-button,
  :global(body.dark) .nav-button {
    background: #333;
    color: #fdfdfd;
    border-color: #ebe9e1;
  }
  :global(body.dark) .control-button:hover,
  :global(body.dark) .nav-button:hover {
    background: #ffd700;
    color: #222;
  }

  .navigation {
    margin-bottom: 30px;
  }

  .button-group {
    display: flex;
    gap: 2px;
  }

  .nav-button {
    padding: 10px 20px;
    background: white;
    color: black;
    text-decoration: none;
    border: 2px solid black;
    cursor: pointer;
    font-size: 16px;
  }

  .nav-button:hover {
    background: black;
    color: white;
  }

  .progress-section {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
  }

  h1 {
    color: black;
    font-size: 2rem;
    margin-bottom: 20px;
  }

  .progress-info p {
    font-size: 1.2rem;
    color: black;
    margin-bottom: 20px;
  }

  .path-container {
    border: 2px solid black;
    background: white;
    margin: 20px 0;
    padding: 20px;
  }

  .progress-path {
    width: 100%;
    max-width: 500px;
    height: auto;
  }

  .controls {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
  }

  .control-button {
    padding: 10px 20px;
    border: 2px solid black;
    background: white;
    color: black;
    font-size: 16px;
    cursor: pointer;
  }

  .control-button:hover {
    background: black;
    color: white;
  }
</style>