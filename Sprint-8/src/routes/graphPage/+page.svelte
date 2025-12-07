<script lang="ts">
  // src/routes/graphPage/+page.svelte
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import P2StressBubbleBridge from '$lib/components/P2StressBubbleBridge.svelte';
  import { stressStore } from '$lib/stores/stressStore';
  import { calendarStore } from '$lib/stores/calendarStore';

  let isLoading = $state(true);
  let hasLoadedInitialData = false;

  onMount(() => {
    const today = new Date();
    const existingEntry = calendarStore.getEntry(today);
    const currentStoreCount = $stressStore.length;
    
    console.log('GraphPage: onMount', {
      currentStoreCount,
      savedCount: existingEntry?.stressors.length || 0
    });
    
    // Load saved data if store is empty
    if (existingEntry && existingEntry.stressors.length > 0 && currentStoreCount === 0) {
      console.log('GraphPage: Loading saved stressors');
      stressStore.loadStressors(existingEntry.stressors);
    }
    
    setTimeout(() => {
      hasLoadedInitialData = true;
      isLoading = false;
    }, 100);
  });

  function goToMeditation() {
    // P2 Bridge auto-syncs, so data is already saved
    goto(`${base}/meditation`);
  }

  function goToCalendar() {
    // P2 Bridge auto-syncs, so data is already saved
    goto(`${base}/calendarPage`);
  }

  function goToForum() {
    goto(`${base}/forum`);
  }
</script>

<div class="page-container">
  {#if !isLoading}
    <!-- Help Popup -->
    <div class="help-popup">
      <div class="help-content">
        <h3>Steps:</h3>
        <ol>
          <li>Reflect on your activities and what stresses you</li>
          <li>Click the (+) button to add a stressor</li>
          <li>Click bubbles to adjust stress levels</li>
          <li>Click cells to reduce stress</li>
          <li>View different dates with the timeline</li>
          <li>Open calendar to see your history</li>
        </ol>
      </div>
    </div>

    <!-- P2 Stress Bubble Graph via Bridge -->
    <div class="p2-graph-wrapper">
      <P2StressBubbleBridge />
    </div>

    <!-- Action Buttons Overlay (Sprint 8 Navigation) -->
    <div class="action-overlay">
      <button onclick={goToForum} class="action-btn forum-btn" type="button" title="Add stressor from forum">
        📝 Add via Forum
      </button>

      {#if $stressStore.length > 0}
        <button onclick={goToCalendar} class="action-btn calendar-btn" type="button">
          📅 View Calendar
        </button>
      {/if}

      <button onclick={goToMeditation} class="action-btn meditation-btn" type="button">
        🧘 Continue to Meditation
      </button>
    </div>

    <!-- Auto-save Indicator -->
    {#if $stressStore.length > 0}
      <div class="auto-save-indicator">
        <span class="save-icon">✓</span> Auto-syncing
      </div>
    {/if}
  {/if}
</div>

<style>
  .page-container {
    position: relative;
    min-height: 100vh;
    background: #e8a87c;
    font-family: BlinkMacSystemFont, -apple-system, sans-serif;
  }

  .p2-graph-wrapper {
    width: 100%;
    min-height: 100vh;
  }

  /* Help Popup */
  .help-popup {
    position: fixed;
    left: 2rem;
    top: 50%;
    transform: translateY(-50%);
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 200;
    max-width: 250px;
  }

  .help-content h3 {
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1.25rem;
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

  /* Action Buttons Overlay */
  .action-overlay {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 1rem;
    z-index: 200;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 90vw;
  }

  .action-btn {
    padding: 0.875rem 1.5rem;
    border-radius: 25px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-family: BlinkMacSystemFont, -apple-system, sans-serif;
    white-space: nowrap;
  }

  .forum-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .forum-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  .calendar-btn {
    background: linear-gradient(135deg, #6c5ce7 0%, #5f4dd1 100%);
    color: white;
  }

  .calendar-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(108, 92, 231, 0.4);
  }

  .meditation-btn {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    color: white;
  }

  .meditation-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(17, 153, 142, 0.4);
  }

  /* Auto-save Indicator */
  .auto-save-indicator {
    position: fixed;
    top: 2rem;
    right: 2rem;
    background: #4CAF50;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    animation: slideIn 0.3s ease;
    z-index: 200;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .save-icon {
    font-size: 1.2rem;
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .help-popup {
      display: none;
    }

    .action-overlay {
      bottom: 1rem;
      flex-direction: column;
      gap: 0.75rem;
      max-width: calc(100% - 2rem);
    }

    .action-btn {
      width: 100%;
      font-size: 0.9rem;
      padding: 0.75rem 1.25rem;
    }

    .auto-save-indicator {
      top: 1rem;
      right: 1rem;
      font-size: 0.8rem;
      padding: 0.6rem 1.2rem;
    }
  }

  @media (max-width: 480px) {
    .action-btn {
      font-size: 0.85rem;
      padding: 0.7rem 1rem;
    }
  }
</style>