import { AppInfo } from './types';

export const MOCK_APPS: AppInfo[] = [
  { id: 'phone', name: 'Phone', icon: 'Phone', category: 'Utilities', color: 'bg-[#1A73E8]' },
  { id: 'messages', name: 'Messages', icon: 'MessageSquare', category: 'Social', color: 'bg-[#1A73E8]' },
  { id: 'chrome', name: 'Chrome', icon: 'Chrome', category: 'Utilities', color: 'bg-white' },
  { id: 'music', name: 'YT Music', icon: 'Music', category: 'Entertainment', color: 'bg-[#FF0000]' },
  { id: 'photos', name: 'Photos', icon: 'Image', category: 'Entertainment', color: 'bg-white' },
  { id: 'camera', name: 'Camera', icon: 'Camera', category: 'Utilities', color: 'bg-[#424242]' },
  { id: 'gmail', name: 'Gmail', icon: 'Mail', category: 'Productivity', color: 'bg-white' },
  { id: 'calendar', name: 'Calendar', icon: 'Calendar', category: 'Productivity', color: 'bg-[#1A73E8]' },
  { id: 'keep', name: 'Keep Notes', icon: 'FileText', category: 'Productivity', color: 'bg-[#FBBC05]' },
  { id: 'settings', name: 'Settings', icon: 'Settings', category: 'Utilities', color: 'bg-[#5F6368]' },
  { id: 'playstore', name: 'Play Store', icon: 'Play', category: 'Utilities', color: 'bg-white' },
  { id: 'maps', name: 'Google Maps', icon: 'Map', category: 'Utilities', color: 'bg-white' },
  { id: 'weather', name: 'Weather', icon: 'Cloud', category: 'Utilities', color: 'bg-[#1A73E8]' },
  { id: 'clock', name: 'Clock', icon: 'Clock', category: 'Utilities', color: 'bg-[#3F51B5]' },
  { id: 'calculator', name: 'Calculator', icon: 'Calculator', category: 'Utilities', color: 'bg-[#0F9D58]' },
  { id: 'files', name: 'Files', icon: 'Folder', category: 'Productivity', color: 'bg-[#1A73E8]' },
  { id: 'tasks', name: 'Tasks', icon: 'List', category: 'Productivity', color: 'bg-white' },
  { id: 'wallet', name: 'Wallet', icon: 'Wallet', category: 'Utilities', color: 'bg-[#202124]' },
  { id: 'fit', name: 'Google Fit', icon: 'Heart', category: 'Utilities', color: 'bg-white' },
  { id: 'youtube', name: 'YouTube', icon: 'Youtube', category: 'Entertainment', color: 'bg-[#FF0000]' },
  { id: 'heating', name: 'Heating Center', icon: 'Thermometer', category: 'Utilities', color: 'bg-gradient-to-tr from-amber-500 to-orange-600' },
  { id: 'control', name: 'Control Center', icon: 'Sliders', category: 'Utilities', color: 'bg-[#2563EB]' },
  { id: 'decoy', name: 'Calc Vault', icon: 'Calculator', category: 'Utilities', color: 'bg-[#5F6368]' },
];

export const DOCK_APPS = ['phone', 'messages', 'chrome', 'music'];
