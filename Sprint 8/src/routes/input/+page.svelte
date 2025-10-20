<script lang="ts">
  let text: string = '';
  const charLimit: number = 50;

  function handleChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    if (target.value.length <= charLimit) {
      text = target.value;
    }
  }
</script>

<div class="container">
  <div class="card">
    <h1 class="title">
      What stressed you out?
    </h1>
    
    <div class="form-group">
      <input
        type="text"
        bind:value={text}
        maxlength={charLimit}
        placeholder="Type your response..."
        on:change={handleChange}
        class="input"
      />
      
      <div class="counter">
        {text.length} / {charLimit}
      </div>
    </div>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }

  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }

  .title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: border-color 0.2s;
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
</style>