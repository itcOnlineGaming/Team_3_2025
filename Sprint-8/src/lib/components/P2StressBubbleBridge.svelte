<script lang="ts">
  // src/lib/components/P2StressBubbleBridge.svelte
  // This component bridges Sprint 8's stores with P2's StressBubbleGraph component
  
  import { onMount, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import StressBubbleGraph from 'stress-bubble';
  import { stressActions as p2StressActions } from 'stress-bubble';
  import { stressStore } from '$lib/stores/stressStore';
  import { calendarStore } from '$lib/stores/calendarStore';
  import { convertCalendarToP2Format, convertP2ToCalendarFormat, toP2Stressor } from '$lib/adapters/stressBubbleAdapter';

  // Props for controlling visibility of P2's internal features
  export let showAddButton = true;
  export let showTimeline = true;
  export let showCalendar = true;

  let mounted = false;
  let syncInterval: number;

  onMount(() => {
    console.log('P2 Bridge: Component mounted');
    
    // Initial sync: Load Sprint 8 data into P2
    syncSprint8ToP2();
    
    // Set up periodic sync from P2 back to Sprint 8 (every 2 seconds)
    syncInterval = window.setInterval(() => {
      if (mounted) {
        syncP2ToSprint8();
      }
    }, 2000);
    
    mounted = true;
  });

  onDestroy(() => {
    mounted = false;
    if (syncInterval) {
      clearInterval(syncInterval);
    }
    
    // Final sync before unmounting
    syncP2ToSprint8();
  });

  /**
   * Sync Sprint 8 calendar data to P2 stress data
   */
  function syncSprint8ToP2() {
    try {
      // Get all calendar data from Sprint 8
      const calendarData = get({ subscribe: calendarStore.subscribe });
      
      // Convert to P2 format
      const p2Data = convertCalendarToP2Format(calendarData);
      
      console.log('P2 Bridge: Syncing Sprint 8 to P2', {
        calendarEntries: Object.keys(calendarData).length,
        p2Dates: Object.keys(p2Data).length
      });
      
      // Load into P2 store
      p2StressActions.loadData(p2Data);
      
      // Set P2 to today's date
      const today = new Date().toISOString().split('T')[0];
      p2StressActions.setDate(today);
      
      // Save P2 data to localStorage (P2's internal persistence)
      localStorage.setItem('stress-bubble-data', JSON.stringify(p2Data));
    } catch (error) {
      console.error('P2 Bridge: Error syncing Sprint 8 to P2', error);
    }
  }

  /**
   * Sync P2 stress data back to Sprint 8 calendar
   */
  function syncP2ToSprint8() {
    try {
      // Get P2's stress data from localStorage
      const p2DataStr = localStorage.getItem('stress-bubble-data');
      if (!p2DataStr) return;
      
      const p2Data = JSON.parse(p2DataStr);
      
      // Convert to Sprint 8 calendar format
      const calendarData = convertP2ToCalendarFormat(p2Data);
      
      console.log('P2 Bridge: Syncing P2 to Sprint 8', {
        p2Dates: Object.keys(p2Data).length,
        calendarEntries: Object.keys(calendarData).length
      });
      
      // Update Sprint 8 calendar store
      Object.keys(calendarData).forEach(yearMonth => {
        const monthData = calendarData[yearMonth];
        Object.keys(monthData).forEach(day => {
          const dayEntry = monthData[day];
          const date = new Date(dayEntry.date);
          
          // Save to Sprint 8 calendar
          calendarStore.saveEntry(date, dayEntry.stressors, true);
        });
      });
      
      // Update today's stressors in stressStore
      const today = new Date().toISOString().split('T')[0];
      if (p2Data[today] && p2Data[today].length > 0) {
        const todayStressors = p2Data[today].map((p2Stressor: any) => ({
          id: p2Stressor.id,
          text: p2Stressor.name,
          intensity: p2Stressor.level,
          mood: p2Stressor.notes || '',
          timestamp: new Date(p2Stressor.createdAt)
        }));
        
        stressStore.loadStressors(todayStressors);
      }
    } catch (error) {
      console.error('P2 Bridge: Error syncing P2 to Sprint 8', error);
    }
  }

  // When Sprint 8 adds a stressor via forum, sync it to P2
  $: {
    const currentStressors = $stressStore;
    if (mounted && currentStressors.length > 0) {
      // Add today's stressors to P2
      const today = new Date().toISOString().split('T')[0];
      const p2Stressors = currentStressors.map(toP2Stressor);
      
      // Update P2's data for today
      const p2DataStr = localStorage.getItem('stress-bubble-data');
      const p2Data = p2DataStr ? JSON.parse(p2DataStr) : {};
      p2Data[today] = p2Stressors;
      localStorage.setItem('stress-bubble-data', JSON.stringify(p2Data));
      
      // Reload P2 data
      p2StressActions.loadData(p2Data);
      p2StressActions.setDate(today);
    }
  }
</script>

<div class="p2-bridge-container">
  <!-- P2's StressBubbleGraph component -->
  <!-- It manages its own state via its internal stores -->
  <StressBubbleGraph />
</div>

<style>
  .p2-bridge-container {
    width: 100%;
    min-height: 100vh;
  }
</style>