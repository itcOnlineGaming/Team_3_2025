<script lang="ts">
    import { base } from '$app/paths';
    import { stressStore } from '$lib/stores/stressStore';
    import { goto } from '$app/navigation';

  let text = $state<string>('');
  const charLimit: number = 50;

  let selectedMood = $state<string | null>(null);
  let selectedIntensity = $state<number>(3);

  const moods = [
    { id: 'stress', label: 'Stressed', color: '#E91E63', intensity: 5, icon: 'stressed.svg' },
    { id: 'bad', label: 'little stressed', color: '#FF69B4', intensity: 4, icon: 'bad.svg' },
    { id: 'okay', label: 'Okay', color: '#FFA500', intensity: 3, icon: 'okay.svg' },
    { id: 'good', label: 'good', color: '#FFD700', intensity: 2, icon: 'good.svg' },
    { id: 'notStressed', label: 'Not Stressed', color: '#9ACD32', intensity: 1, icon: 'notStressed.svg' }
  ];

  // Derived question text based on selected mood
  let questionText = $derived.by(() => {
    if (!selectedMood) return 'What\'s on your mind?';
    
    const mood = selectedMood.toLowerCase();
    if (mood === 'stressed' || mood === 'little stressed') {
      return 'What stressed you out?';
    } else if (mood === 'okay') {
      return 'What\'s on your mind?';
    } else if (mood === 'good' || mood === 'not stressed') {
      return 'What made you happy?';
    }
    return 'What\'s on your mind?';
  });

  function selectMood(moodLabel: string, intensity: number) {
    selectedMood = moodLabel;
    selectedIntensity = intensity;
  }

  function handleSubmit() {
    if (text && selectedMood) {
      stressStore.addStressor(text, selectedIntensity, selectedMood);
      goto(`${base}/graphPage`);
    } else {
      alert('Please fill in all fields before submitting');
    }
  }

  function handleEnterKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }
</script>

<div class="container">
  <div class="help-popup">
    <div class="help-content">
      <h3>Steps:</h3>
      <ol>
        <li>Select how stressed you are</li>
        <li>Enter what is on your mind</li>
      </ol>
    </div>
  </div>

  <h1>How Are You?</h1>
  
  <div class="spectrum-container">
    <span class="spectrum-label">Stressed</span>
    
    <div class="mood-buttons">
      {#each moods as mood}
        <button
          class="mood-button"
          class:selected={selectedMood === mood.label}
          style="--mood-color: {mood.color}"
          onclick={() => selectMood(mood.label, mood.intensity)}
        >
        <img 
          src={`${base}/Images/${mood.icon}`} 
          alt={mood.label} 
          class="mood-icon"
        />
        </button>
      {/each}
    </div>
    
    <span class="spectrum-label">Not Stressed</span>
  </div>

  {#if selectedMood}
    <p class="feedback">You selected: <strong>{selectedMood}</strong></p>
  {/if}

  <div class="card">
    <h1 class="title">
      {questionText}
    </h1>
    
    <div class="form-group">
      <input
        type="text"
        bind:value={text}
        maxlength={charLimit}
        placeholder="Type your response..."
        onkeypress={(e) => handleEnterKey(e)}
        class="input"
      />
      
      <div class="counter">
        {text.length} / {charLimit}
      </div>
    </div>
  </div>

  <div class="button-container">
    <button onclick={handleSubmit} class="submit-button">Submit</button>
  </div>
</div>

<style>
  .button-container {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    max-width: 600px;
    margin-top: 3rem;
  }

  .submit-button {
    padding: 1rem 2rem;
    background-color: #e8a87c;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
  }

  .submit-button:hover {
    background-color: #d89968;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);

  }

  .container {
    background: #f7ebe4;
    border-radius: 20px;
    max-width: 800px;
    width: 90%;
    padding: 2rem;
    margin: 2rem auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    font-family: BlinkMacSystemFont, -apple-system, sans-serif;
  }
  
  .container::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #e8a87c;
    z-index: -1;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #333;
    font-family: BlinkMacSystemFont, -apple-system, sans-serif;
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
    transition: all 0.3s ease;
    font-family: BlinkMacSystemFont, -apple-system, sans-serif;
  }

  .mood-button:hover {
    transform: scale(1.1);
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

  .card {
    margin-top: 2rem;
    padding: 2rem;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
    font-family: BlinkMacSystemFont, -apple-system, sans-serif;
  }

  .title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1.5rem;
    text-align: center;
    font-family: BlinkMacSystemFont, -apple-system, sans-serif;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .input {
    width: 95%;
    padding: 0.75rem 1rem;
    border: 2px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  .mood-icon {
  width: 60%;
  height: 60%;
  object-fit: contain;
  pointer-events: none;
  }

  .input:focus {
    outline: none;
    border-color: #6366f1;
  }

  .counter {
    text-align: right;
    font-size: 0.875rem;
    color: #6b7280;
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

  .help-popup {
  position: fixed;
  left: 2rem;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  max-width: 250px;
}

.help-content h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.25rem;
  font-family: BlinkMacSystemFont, -apple-system, sans-serif;
}

.help-content ol {
  margin: 0;
  padding-left: 1.5rem;
  color: #666;
}

.help-content li {
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.help-content li:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .help-popup {
    display: none;
  }
}

</style>