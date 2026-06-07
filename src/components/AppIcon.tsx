import React from 'react';
import { 
  Phone, MessageSquare, Compass, Music, Image, Camera, 
  Mail, Calendar, FileText, Settings, ShoppingBag, Map, 
  Cloud, Clock, Calculator, Folder, List, Wallet, Heart, Zap 
} from 'lucide-react';
import { AppInfo } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const ICON_MAP: Record<string, any> = {
  Phone, MessageSquare, Compass, Music, Image, Camera, 
  Mail, Calendar, FileText, Settings, ShoppingBag, Map, 
  Cloud, Clock, Calculator, Folder, List, Wallet, Heart, Zap
};

interface AppIconProps {
  app: AppInfo;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const AppIcon: React.FC<AppIconProps> = ({ app, showLabel = true, size = 'md', onClick }) => {
  const Icon = ICON_MAP[app.icon] || Folder;
  
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  const iconSize = {
    sm: 20,
    md: 28,
    lg: 32
  };

  return (
    <motion.div 
      whileTap={{ scale: 0.9 }}
      className="flex flex-col items-center gap-1 cursor-pointer"
      onClick={onClick}
    >
      <div className={cn(
        "rounded-[1.2rem] flex items-center justify-center shadow-lg transition-shadow hover:shadow-xl",
        app.color,
        sizeClasses[size]
      )}>
        <Icon 
          size={iconSize[size]} 
          className={cn(
            app.color === 'bg-white' ? 'text-gray-800' : 'text-white'
          )} 
        />
      </div>
      {showLabel && (
        <span className="text-[11px] text-white font-medium drop-shadow-md truncate w-full text-center px-1">
          {app.name}
        </span>
      )}
    </motion.div>
  );
};
