export interface AppInfo {
  id: string;
  name: string;
  icon: string;
  category: 'Social' | 'Entertainment' | 'Productivity' | 'Utilities' | 'Games' | 'Other';
  color: string;
}

export interface WidgetInfo {
  id: string;
  type: 'Clock' | 'Weather' | 'Battery' | 'Calendar' | 'Music';
  size: 'small' | 'medium' | 'large';
}

export type ScreenState = 'AOD' | 'HOME' | 'LIBRARY' | 'SEARCH' | 'LOCK';
