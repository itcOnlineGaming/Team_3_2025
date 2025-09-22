<script lang="ts">
  import { getHighlightedPrompt } from '$lib/textinput';
  import { goto } from '$app/navigation';
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

<style>
.text-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 2rem auto;
}
.prompt-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  color: #bbb;
  font-size: 1.5rem;
  font-family: inherit;
  font-weight: normal;
  letter-spacing: normal;
  line-height: 1.2;
  pointer-events: none;
  white-space: pre-wrap;
  z-index: 1;
  padding: 8px 12px;
  box-sizing: border-box;
}
.text-input {
  position: relative;
  width: 100%;
  font-size: 1.5rem;
  font-family: inherit;
  font-weight: normal;
  letter-spacing: normal;
  line-height: 1.2;
  background: transparent;
  color: #222;
  border: none;
  box-shadow: 0 0 0 2px #ccc;
  z-index: 2;
  outline: none;
  padding: 8px 12px;
  box-sizing: border-box;
}
</style>

