<script lang="ts">
  import { base } from '$app/paths';

</script>

<div class="container">
  <h1>This is the meditation page</h1>


  <div class="button-container">
    <a href={`${base}/Conclusion`} class="action-button">Skip</a>
    <button class="action-button">Start</button>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    position: relative;
  }

  h1 {
    font-size: 2.5rem;
    color: #333;
    text-align: center;
  }

  .button-container {
    position: fixed;
    bottom: 2rem;
    left: 2rem;
    right: 2rem;
    display: flex;
    justify-content: space-between;
    max-width: 100%;
  }

  .action-button {
    padding: 1rem 2rem;
    background-color: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    font-family: inherit;
  }

  .action-button:hover {
    background-color: #45a049;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
</style>