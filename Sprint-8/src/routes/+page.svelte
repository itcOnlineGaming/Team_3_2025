<script lang="ts">
  import { base } from '$app/paths';
</script>

<div class="container">
  <div class="context-container">
    <h1>Background</h1>
    <p>We are a team made up of 4th years in Computer Games Development and Interactive Digital Art & Design. 
      We are working on a project called Self Regulated Learning (SRL), 
      where we design and develop an interface under different SRL headings. 
      Our group is working under the heading of emotional management.</p><br><br>
    <h1>Emotional App Prototype</h1>
    <p>Track your emotional well-being with our app. Log how you're feeling, visualize your stress patterns through interactive graphs, 
      and access a guided meditation session when you need to relax. <br><br>
      We'd love your feedback!<br> Please test our prototype and complete the short survey at the end. <br>
      Click below to begin your journey.</p>
  </div>

  <div class="container2">
    <div class="button-container">
      <a href={`${base}/forum`} class="submit-button">Go to App!</a>
    </div>
  </div>
</div>

<style>
  .context-container {
    padding-top: 1rem;
    max-width: 600px;
    margin: 2rem auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    text-align: center;
  }

  .container {
    background: #f7ebe4;
    border-radius: 20px;
    max-width: 800px;
    width: 90%;
    padding: 1rem;
    margin: 2rem auto;
    margin-top: 7rem;
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

  .container2 {
    display: flex;
    justify-content: center;
  }

  .button-container {
    display: flex;
    justify-content: center;
    width: 100rem;
    max-width: 600px;
    margin-top: 1rem;
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
  }

  .submit-button:hover {
    background-color: #d89968;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
</style>