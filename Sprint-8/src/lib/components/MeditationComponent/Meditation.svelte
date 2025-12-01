<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let phase = 'Breathe in';
  let timeLeft = 120; // seconds
  let totalElapsed = 0;
  let phaseIndex = 0;
  let interval;
  let circleScale = 1;
  let animationFrame;

  const phases = ['Breathe in', 'Hold', 'Breathe out', 'Hold'];
  const phaseDurations = [4, 2, 4, 2]; // seconds per phase (breathe in, hold, breathe out, hold)

  // Easing function for natural breathing feel
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Start timer
  onMount(() => {
    const totalDuration = 120; // 2 minutes
    const startTime = Date.now();
    let phaseStartTime = 0;

    function animate() {
      const elapsed = (Date.now() - startTime) / 1000;
      totalElapsed = Math.floor(elapsed);
      timeLeft = totalDuration - totalElapsed;

      // Calculate current phase
      let cycleTime = elapsed % 12; // 12 seconds per full cycle
      let newPhaseIndex = 0;
      let phaseElapsed = cycleTime;
      
      for (let i = 0; i < phaseDurations.length; i++) {
        if (phaseElapsed < phaseDurations[i]) {
          newPhaseIndex = i;
          break;
        }
        phaseElapsed -= phaseDurations[i];
      }

      if (newPhaseIndex !== phaseIndex) {
        phaseIndex = newPhaseIndex;
        phase = phases[phaseIndex];
      }

      // Smooth animation with easing
      const phaseProgress = phaseElapsed / phaseDurations[phaseIndex];
      const easedProgress = easeInOutCubic(phaseProgress);

      if (phase === 'Breathe in') {
        circleScale = 1 + (easedProgress * 0.6); // Expand from 1 to 1.6
      } else if (phase === 'Breathe out') {
        circleScale = 1.6 - (easedProgress * 0.6); // Contract from 1.6 to 1
      } else if (phase === 'Hold' && phaseIndex === 1) {
        circleScale = 1.6; // Hold expanded
      } else {
        circleScale = 1; // Hold contracted
      }

      if (timeLeft <= 0) {
        cancelAnimationFrame(animationFrame);
        phase = 'Session complete';
        dispatch('complete');
        return;
      }

      animationFrame = requestAnimationFrame(animate);
    }

    animationFrame = requestAnimationFrame(animate);
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
    if (animationFrame) cancelAnimationFrame(animationFrame);
  });
</script>

<div class="meditation">
  <div class="breathing-circle" style="transform: scale({circleScale});">
    <div class="inner-circle"></div>
  </div>
  
  <div class="phase">
    <h2>{phase}</h2>

    {#if timeLeft > 0}
      <p class="timer">Time remaining: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
    {/if}
  </div>
</div>

<style>
  .meditation {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 60vh;
    position: relative;
  }

  .phase {
    margin-top: 10rem;
    text-align: center;
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(10px);
		border-radius: 20px;
		padding: 2rem;
    padding-top: 0rem;
		margin-bottom: 2rem;
		border: 2px solid rgba(255, 255, 255, 0.3);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
	
	.phase p {
		font-style: BlinkMacSystemFont, -apple-system, sans-serif;
		font-size: 1.2rem;
		line-height: 1.6;
		margin: 0;
		color: #000;
	}

  .breathing-circle {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.15));
    backdrop-filter: blur(15px);
    border: 3px solid rgba(255, 255, 255, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: none;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 0 0 60px rgba(255, 255, 255, 0.2);
    margin-bottom: 3rem;
    will-change: transform;
  }

  .inner-circle {
    width: 80%;
    height: 80%;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #2c3e50;
    font-weight: 600;
  }

  .timer {
    font-size: 1.2rem;
    color: #555;
    opacity: 0.8;
  }
</style>
