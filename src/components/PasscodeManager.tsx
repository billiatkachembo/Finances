import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Check, Key, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

export interface PasscodeManagerProps {
  onUnlock: () => void;
}

export const PasscodeManager: React.FC<PasscodeManagerProps> = ({ onUnlock }) => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const [unlockPasscode, setUnlockPasscode] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [showPasscodes, setShowPasscodes] = useState(false);
  const [currentPasscode, setCurrentPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  useEffect(() => {
    const hasPasscode = localStorage.getItem('app-passcode') !== null;
    setIsEnabled(hasPasscode);
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    if (window.PublicKeyCredential) {
      try {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        setIsBiometricAvailable(available);
      } catch {
        setIsBiometricAvailable(false);
      }
    }
  };

  const handleUnlock = () => {
    const stored = localStorage.getItem('app-passcode');
    if (!stored) {
      setUnlockError(t('noPasscodeSet'));
      return;
    }

    const decoded = atob(stored);
    if (unlockPasscode === decoded) {
      sessionStorage.setItem('app-authenticated', 'true');
      setUnlockError('');
      setUnlockPasscode('');
      onUnlock();
    } else {
      setUnlockError(t('incorrectPasscode'));
    }
  };

  const handleBiometricUnlock = async () => {
    try {
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          timeout: 60000,
          userVerification: 'required',
        },
      });

      if (assertion) {
        toast({ title: t('biometricSuccess') });
        onUnlock();
      }
    } catch {
      toast({ title: t('biometricFailed'), variant: 'destructive' });
    }
  };

  const handleEnablePasscode = () => {
    if (!newPasscode || newPasscode !== confirmPasscode) {
      toast({
        title: t('error'),
        description: t('passcodesDontMatchOrEmpty'),
        variant: 'destructive',
      });
      return;
    }

    if (newPasscode.length < 4) {
      toast({
        title: t('error'),
        description: t('passcodeMinLength'),
        variant: 'destructive',
      });
      return;
    }

    localStorage.setItem('app-passcode', btoa(newPasscode));
    setIsEnabled(true);
    setNewPasscode('');
    setConfirmPasscode('');

    toast({
      title: t('passcodeEnabled'),
      description: t('passcodeEnabledDescription'),
    });
  };

  const handleChangePasscode = () => {
    const stored = localStorage.getItem('app-passcode');
    if (!stored) return;

    const decoded = atob(stored);
    if (currentPasscode !== decoded) {
      toast({
        title: t('error'),
        description: t('currentPasscodeIncorrect'),
        variant: 'destructive',
      });
      return;
    }

    if (!newPasscode || newPasscode !== confirmPasscode) {
      toast({
        title: t('error'),
        description: t('newPasscodesDontMatchOrEmpty'),
        variant: 'destructive',
      });
      return;
    }

    if (newPasscode.length < 4) {
      toast({
        title: t('error'),
        description: t('passcodeMinLength'),
        variant: 'destructive',
      });
      return;
    }

    localStorage.setItem('app-passcode', btoa(newPasscode));
    setCurrentPasscode('');
    setNewPasscode('');
    setConfirmPasscode('');
    setIsChanging(false);

    toast({
      title: t('passcodeChanged'),
      description: t('passcodeChangedDescription'),
    });
  };

  const handleDisablePasscode = () => {
    const stored = localStorage.getItem('app-passcode');
    if (!stored || atob(stored) !== currentPasscode) {
      toast({
        title: t('error'),
        description: t('currentPasscodeIncorrect'),
        variant: 'destructive',
      });
      return;
    }

    localStorage.removeItem('app-passcode');
    setIsEnabled(false);
    setCurrentPasscode('');

    toast({
      title: t('passcodeDisabled'),
      description: t('passcodeDisabledDescription'),
    });
  };

  const isAuthenticated = sessionStorage.getItem('app-authenticated');

  if (isEnabled && !isAuthenticated) {
    return (
      <Card className="max-w-sm mx-auto">
        <CardHeader>
          <CardTitle>{t('unlockApp')}</CardTitle>
          <CardDescription>{t('enterPasscodeToContinue')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type={showPasscodes ? 'text' : 'password'}
            placeholder={t('enterPasscode') || 'Enter your 4-digit passcode'}
            value={unlockPasscode}
            onChange={(e) => setUnlockPasscode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            autoFocus
          />

          {unlockError && <p className="text-red-500">{unlockError}</p>}
          <Button className="w-full" onClick={handleUnlock}>
            <Key className="mr-2 w-4 h-4" />
            {t('unlock')}
          </Button>
          {isBiometricAvailable && (
            <Button variant="outline" className="w-full" onClick={handleBiometricUnlock}>
              {t('useBiometric')}
            </Button>
          )}
          <div className="flex items-center justify-between">
            <span>{t('showPasscode')}</span>
            <Switch checked={showPasscodes} onCheckedChange={setShowPasscodes} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-6">
      <CardHeader>
        <CardTitle>{t('passcodeSettings')}</CardTitle>
        <CardDescription>{t('secureAppWithPasscode')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEnabled ? (
          <>
            <Input
              type="password"
              placeholder={t('newPasscode') || 'Enter new 4-digit passcode'}
              value={newPasscode}
              onChange={(e) => setNewPasscode(e.target.value)}
            />
            <Input
              type="password"
              placeholder={t('confirmPasscode') || 'Confirm new passcode'}
              value={confirmPasscode}
              onChange={(e) => setConfirmPasscode(e.target.value)}
            />
            <Button className="w-full" onClick={handleEnablePasscode}>
              <Check className="mr-2 w-4 h-4" />
              {t('enablePasscode')}
            </Button>
          </>
        ) : isChanging ? (
          <>
            <Input
              type="password"
              placeholder={t('currentPasscode') || 'Enter current passcode'}
              value={currentPasscode}
              onChange={(e) => setCurrentPasscode(e.target.value)}
            />
            <Input
              type="password"
              placeholder={t('newPasscode') || 'Enter new 4-digit passcode'}
              value={newPasscode}
              onChange={(e) => setNewPasscode(e.target.value)}
            />
            <Input
              type="password"
              placeholder={t('confirmPasscode') || 'Confirm new passcode'}
              value={confirmPasscode}
              onChange={(e) => setConfirmPasscode(e.target.value)}
            />
            <Button className="w-full" onClick={handleChangePasscode}>
              <Check className="mr-2 w-4 h-4" />
              {t('saveChanges')}
            </Button>
          </>
        ) : (
          <>
            <Input
              type="password"
              placeholder={t('currentPasscode') || 'Enter current passcode'}
              value={currentPasscode}
              onChange={(e) => setCurrentPasscode(e.target.value)}
            />
            <div className="flex flex-col gap-2 mt-2">
              <Button variant="default" onClick={() => setIsChanging(true)}>
                <Key className="mr-2 w-4 h-4" />
                {t('changePasscode')}
              </Button>
              <Button variant="destructive" onClick={handleDisablePasscode}>
                <Trash2 className="mr-2 w-4 h-4" />
                {t('disablePasscode')}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
