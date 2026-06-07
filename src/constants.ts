import { AppInfo } from './types';

export const MOCK_APPS: AppInfo[] = [
  { id: 'phone', name: 'Phone', icon: 'Phone', category: 'Utilities', color: 'bg-green-500' },
  { id: 'messages', name: 'Messages', icon: 'MessageSquare', category: 'Social', color: 'bg-green-400' },
  { id: 'safari', name: 'Safari', icon: 'Compass', category: 'Utilities', color: 'bg-blue-500' },
  { id: 'music', name: 'Music', icon: 'Music', category: 'Entertainment', color: 'bg-pink-500' },
  { id: 'photos', name: 'Photos', icon: 'Image', category: 'Entertainment', color: 'bg-white' },
  { id: 'camera', name: 'Camera', icon: 'Camera', category: 'Utilities', color: 'bg-gray-500' },
  { id: 'mail', name: 'Mail', icon: 'Mail', category: 'Productivity', color: 'bg-blue-400' },
  { id: 'calendar', name: 'Calendar', icon: 'Calendar', category: 'Productivity', color: 'bg-white' },
  { id: 'notes', name: 'Notes', icon: 'FileText', category: 'Productivity', color: 'bg-yellow-400' },
  { id: 'settings', name: 'Settings', icon: 'Settings', category: 'Utilities', color: 'bg-gray-400' },
  { id: 'appstore', name: 'App Store', icon: 'ShoppingBag', category: 'Utilities', color: 'bg-blue-600' },
  { id: 'maps', name: 'Maps', icon: 'Map', category: 'Utilities', color: 'bg-green-300' },
  { id: 'weather', name: 'Weather', icon: 'Cloud', category: 'Utilities', color: 'bg-blue-300' },
  { id: 'clock', name: 'Clock', icon: 'Clock', category: 'Utilities', color: 'bg-black' },
  { id: 'calculator', name: 'Calculator', icon: 'Calculator', category: 'Utilities', color: 'bg-orange-500' },
  { id: 'files', name: 'Files', icon: 'Folder', category: 'Productivity', color: 'bg-blue-100' },
  { id: 'reminders', name: 'Reminders', icon: 'List', category: 'Productivity', color: 'bg-white' },
  { id: 'wallet', name: 'Wallet', icon: 'Wallet', category: 'Utilities', color: 'bg-black' },
  { id: 'health', name: 'Health', icon: 'Heart', category: 'Utilities', color: 'bg-white' },
  { id: 'shortcuts', name: 'Shortcuts', icon: 'Zap', category: 'Productivity', color: 'bg-indigo-500' },
];

export const DOCK_APPS = ['phone', 'messages', 'safari', 'music'];
