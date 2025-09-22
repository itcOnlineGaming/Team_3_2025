<script lang="ts">
  import { getHighlightedPrompt } from '$lib/textinput';
  import { goto } from '$app/navigation';
  import '../../lib/style.css';
  let prompt = "The quick brown fox jumps over the lazy dog";
  let userInput = "";

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

