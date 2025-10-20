<div class="blue-box">
  <h2>Task</h2>
  <p>Word Count: 300</p>
  <p>Completed: No</p>
</div>

<div class="button-box">
  <button class="change-task-btn"><a href="/tasks">Change Task</a></button>
</div>

<style>
  .blue-box {
    width: 20em;
    height: 15em;
    background-color: blue;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    color: white;
    font-size: 0.9em;
    text-align: center;
    padding: 1em;
    box-sizing: border-box;
    position: fixed;
    top: 40%;
    left: 75%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
  }

  .button-box {
    position: fixed;
    top: 60%;
    left: 75%;
    transform: translate(-50%, -50%);
  }

  .blue-box h3 {
    margin: 0 0 1em 0;
    font-size: 1.2em;
  }
  
  .blue-box p {
    margin: 0.5em 0;
    line-height: 1.4;
  }

  .change-task-btn {
    padding: 0.8em 1.5em;
    background-color: white;
    color: blue;
    border: 2px solid blue;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
  }
  
  .change-task-btn:hover {
    background-color: #f0f0f0;
  }
  
  .change-task-btn a {
    text-decoration: none;
    color: inherit;
  }
  
</style>