import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { PasscodeManager } from '@/components/PasscodeManager';
import { BackupManager } from '@/components/BackupManager';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface SettingsProps {
  onUnlock: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onUnlock }) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [showBackup, setShowBackup] = useState(false);

  return (
    <div className="space-y-6">
      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings')}</CardTitle>
          <CardDescription>
            {('manageAppSecuritySettings')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PasscodeManager onUnlock={onUnlock} />
        </CardContent>
      </Card>
      {/* Backup Manager */}
      <Card>
        <CardHeader>
          <CardTitle>{('backupAndRestore')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="flex items-center gap-2"
            onClick={() => setShowBackup(!showBackup)}
          >
            {showBackup ? ('hideBackupManager') : ('openBackupManager')}
          </Button>
          {showBackup && <BackupManager />}
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
