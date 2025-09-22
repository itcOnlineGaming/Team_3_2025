<script lang="ts">
  import { getHighlightedPrompt } from '$lib/textinput';
  import { goto } from '$app/navigation';
  import { selectedText } from '$lib/stores.js';
  import '../../lib/style.css';

  let defaultPrompt = "The quick brown fox jumps over the lazy dog";
  let prompt = defaultPrompt;
  let userInput = "";

  // Subscribe to the selected text from the store
  const unsubscribe = selectedText.subscribe(value => {
    if (value) {
      prompt = value;
    } else {
      prompt = defaultPrompt;
    }
    userInput = ""; // Reset input when prompt changes
  });

  $: highlighted = getHighlightedPrompt(prompt, userInput);
  $: if (userInput === prompt) {
    goto('/map');
  }
</script>

<div class="text-container">
  <div class="prompt-text">
    {#each highlighted as {char, status}, i}
      <span class="char {status}">{char}</span>
    {/each}
  </div>
  <input
    bind:value={userInput}
    class="text-input"
    autocomplete="off"
    autocorrect="off"
    spellcheck="false"
    maxlength={prompt.length}
    placeholder=""
  />
</div>
