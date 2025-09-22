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

<button><a href="/home">Home</a></button>
<button><a href="/map">Map</a></button>
<button><a href="/tasks">Tasks</a></button>
<button><a href="/shop">Shop</a></button>
<button><a href="/avatar">Avatar</a></button>
<button><a href="/settings">Settings</a></button>

<div class="text-container">
  <div class="prompt-text">
    {#each highlighted as {char, correct}, i}
      <span style="color: {correct ? '#4caf50' : '#bbb'}">{char}</span>
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

