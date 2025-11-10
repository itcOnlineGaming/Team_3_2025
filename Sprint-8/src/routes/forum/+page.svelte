<script>
  let selectedMood = null;

  const moods = [
    { id: 'stress', label: 'Stressed', color: '#E91E63' },
    { id: 'bad', label: 'little stressed', color: '#FF69B4' },
    { id: 'okay', label: 'Okay', color: '#FFA500' },
    { id: 'good', label: 'good', color: '#FFD700' },
    { id: 'notStressed', label: 'Not Stressed', color: '#9ACD32' }
  ];

  function selectMood(moodId) {
    selectedMood = moodId;
  }
</script>

<div class="container">
  <h1>How Are You?</h1>
  
  <div class="spectrum-container">
    <span class="spectrum-label">Stressed</span>
    
    <div class="mood-buttons">
      {#each moods as mood}
        <button
          class="mood-button"
          class:selected={selectedMood === mood.label}
          style="--mood-color: {mood.color}"
          on:click={() => selectMood(mood.label)}
        >
        </button>
      {/each}
    </div>
    
    <span class="spectrum-label">Not Stressed</span>
  </div>

  {#if selectedMood}
    <p class="feedback">You selected: <strong>{selectedMood}</strong></p>
  {/if}
  
  <div class="button-container">
    <a href="/Team_3_2025/meditation" class="submit-button">Submit</a>
  </div>
</div>

<style>
  .button-container {
    display: flex;
    justify-content: flex-end;
    width: 100rem;
    max-width: 600px;
    margin-top: 3rem;
  }

  .submit-button {
    padding: 1rem 2rem;
    background-color: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .submit-button:hover {
    background-color: #45a049;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #333;
  }

  .spectrum-container {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .spectrum-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #666;
    white-space: nowrap;
  }

  .mood-buttons {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .mood-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: white;
    border: 3px solid var(--mood-color);
    border-radius: 50%;
    width: 80px;
    height: 80px;
    cursor: pointer;
    position: relative;
  }

  .mood-button.selected {
    background: var(--mood-color);
  }

  .feedback {
    margin-top: 4rem;
    font-size: 1.25rem;
    color: #666;
  }

  .feedback strong {
    color: #333;
    text-transform: capitalize;
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 2rem;
    }

    .spectrum-container {
      flex-direction: column;
      gap: 1rem;
    }

    .mood-buttons {
      gap: 1rem;
    }

    .mood-button {
      width: 60px;
      height: 60px;
    }
  }
</style>