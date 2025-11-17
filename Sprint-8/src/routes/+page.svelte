<script lang="ts">
  import { base } from '$app/paths';
</script>

<div class="context-container">
  <h1>Background</h1>
  <p>We are a team made up of 4th years in Computer Games Development and Interactive Digital Art & Design. 
    We are working on a project called Self Regulated Learning (SRL), 
    where we design and develop an interface under different SRL headings. 
    Our group is working under the heading of emotional management.</p>
  <h1>Emotional App Prototype</h1>
  <p>The aim of our app is about to log and visualise stress levels through graphs, along with an optional meditation session to calm the users nerves.
    We would appreciate if you could test out our prototype and fill out the short form at the end.
    To start click the button below</p>
</div>

<div class="container">
  <div class="button-container">
    <a href={`${base}/forum`} class="submit-button">Go to App!</a>
  </div>
</div>

<style>
  .context-container {
    padding-top: 8rem;
    max-width: 600px;
    margin: 2rem auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    text-align: center;
  }

  .container {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }

  .button-container {
    display: flex;
    justify-content: center;
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
</style>