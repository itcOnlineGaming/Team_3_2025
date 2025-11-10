<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let phase = 'Breathe in';
  let timeLeft = 120; // seconds
  let totalElapsed = 0;
  let phaseIndex = 0;
  let interval;

  const phases = ['Breathe in', 'Hold', 'Breathe out', 'Hold'];

  // Start timer
  onMount(() => {
    const phaseInterval = 4; // seconds per phase
    const totalDuration = 120; // 2 minutes

    interval = setInterval(() => {
      totalElapsed += 1;
      timeLeft = totalDuration - totalElapsed;

      // Change phase every 4 seconds
      if (totalElapsed % phaseInterval === 0) {
        phaseIndex = (phaseIndex + 1) % phases.length;
        phase = phases[phaseIndex];
      }

      if (timeLeft <= 0) {
        clearInterval(interval);
        phase = 'Session complete';
        dispatch('complete'); // notify parent
      }
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<div class="meditation">
  <h2>{phase}</h2>

  {#if timeLeft > 0}
    <p>Time remaining: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
  {/if}
</div>

<style>
  .meditation {
    text-align: center;
    font-size: 2rem;
    margin-top: 2rem;
  }

  h2 {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #2c3e50;
    transition: opacity 0.5s ease;
  }

  p {
    font-size: 1.5rem;
    color: #555;
  }
</style>
