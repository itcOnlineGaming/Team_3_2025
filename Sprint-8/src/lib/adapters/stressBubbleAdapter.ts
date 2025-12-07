import type { Stressor as Sprint8Stressor } from '$lib/stores/stressStore';
import type { Stressor as P2Stressor, StressData as P2StressData } from 'stress-bubble';

/**
 * Convert Sprint 8 Stressor to P2 Package Stressor
 * Sprint 8: { id, text, intensity, mood, timestamp }
 * P2: { id, name, level, notes, date, createdAt }
 */
export function toP2Stressor(s8: Sprint8Stressor): P2Stressor {
  return {
    id: s8.id,
    name: s8.text, // text -> name
    level: Math.min(5, Math.max(1, s8.intensity)) as 1 | 2 | 3 | 4 | 5, // intensity -> level (1-5)
    notes: s8.mood, // mood -> notes
    date: s8.timestamp.toISOString().split('T')[0], // timestamp -> date (YYYY-MM-DD)
    createdAt: s8.timestamp.getTime() // timestamp -> createdAt (ms)
  };
}

/**
 * Convert P2 Package Stressor to Sprint 8 Stressor
 */
export function fromP2Stressor(p2: P2Stressor): Sprint8Stressor {
  return {
    id: p2.id,
    text: p2.name, // name -> text
    intensity: p2.level, // level -> intensity
    mood: p2.notes || '', // notes -> mood
    timestamp: new Date(p2.createdAt) // createdAt -> timestamp
  };
}

/**
 * Convert Sprint 8 calendar data to P2 StressData format
 * Sprint 8 CalendarData: { [yearMonth]: { [day]: { stressors, date, timestamp } } }
 * P2 StressData: { [date]: Stressor[] }
 */
export function convertCalendarToP2Format(calendarData: any): P2StressData {
  const p2Data: P2StressData = {};
  
  // Iterate through year-months
  Object.keys(calendarData).forEach(yearMonth => {
    const monthData = calendarData[yearMonth];
    
    // Iterate through days
    Object.keys(monthData).forEach(day => {
      const dayEntry = monthData[day];
      const dateStr = dayEntry.date; // Already in YYYY-MM-DD format
      
      // Convert stressors to P2 format
      p2Data[dateStr] = dayEntry.stressors.map(toP2Stressor);
    });
  });
  
  return p2Data;
}

/**
 * Convert P2 StressData back to Sprint 8 calendar format
 */
export function convertP2ToCalendarFormat(p2Data: P2StressData): any {
  const calendarData: any = {};
  
  Object.keys(p2Data).forEach(dateStr => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const yearMonth = `${year}-${month}`;
    
    if (!calendarData[yearMonth]) {
      calendarData[yearMonth] = {};
    }
    
    calendarData[yearMonth][day] = {
      date: dateStr,
      stressors: p2Data[dateStr].map(fromP2Stressor),
      timestamp: new Date()
    };
  });
  
  return calendarData;
}