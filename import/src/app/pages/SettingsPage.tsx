import { useState } from 'react';
import { GlassCard } from '@/app/components/GlassCard';
import { NeonPrimaryButton } from '@/app/components/NeonPrimaryButton';
import { GlassSecondaryButton } from '@/app/components/GlassSecondaryButton';
import { Slider } from '@/app/components/ui/slider';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { Trash2 } from 'lucide-react';

export function SettingsPage() {
  const [neonIntensity, setNeonIntensity] = useState([70]);
  const [isMemeMode, setIsMemeMode] = useState(false);
  const [showShadow, setShowShadow] = useState(true);

  return (
    <div className="min-h-screen bg-forest-950 pt-20">
      <div className="max-w-[800px] mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-mist-50 text-4xl mb-2">Настройки</h1>
          <p className="text-mist-400">Настрой приложение под себя</p>
        </div>

        <div className="space-y-6">
          {/* Neon Intensity */}
          <GlassCard className="p-6">
            <h3 className="text-mist-50 text-lg mb-4">Интенсивность неона</h3>
            <div className="space-y-4">
              <Slider
                value={neonIntensity}
                onValueChange={setNeonIntensity}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="text-mist-400 text-sm text-center">
                {neonIntensity[0]}%
              </div>
            </div>
          </GlassCard>

          {/* Default Mode */}
          <GlassCard className="p-6">
            <h3 className="text-mist-50 text-lg mb-4">Режим по умолчанию</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="default-meme" className="text-mist-200">
                  Мемный режим
                </Label>
                <Switch
                  id="default-meme"
                  checked={isMemeMode}
                  onCheckedChange={setIsMemeMode}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="default-shadow" className="text-mist-200">
                  Показывать тень по умолчанию
                </Label>
                <Switch
                  id="default-shadow"
                  checked={showShadow}
                  onCheckedChange={setShowShadow}
                />
              </div>
            </div>
          </GlassCard>

          {/* Language */}
          <GlassCard className="p-6">
            <h3 className="text-mist-50 text-lg mb-4">Язык интерфейса</h3>
            <select className="w-full px-4 py-3 rounded-lg bg-glass border border-border-glass text-mist-50">
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </GlassCard>

          {/* Danger Zone */}
          <GlassCard className="p-6 border-neon-crimson-500 border-opacity-30">
            <h3 className="text-neon-crimson-500 text-lg mb-4">Опасная зона</h3>
            <p className="text-mist-400 text-sm mb-4">
              Удалить всю историю раскладов. Это действие необратимо.
            </p>
            <GlassSecondaryButton className="border-neon-crimson-500 text-neon-crimson-500 hover:bg-neon-crimson-500 hover:bg-opacity-10">
              <Trash2 className="h-4 w-4 mr-2" />
              Очистить историю
            </GlassSecondaryButton>
          </GlassCard>

          {/* Save */}
          <div className="flex justify-end gap-4">
            <GlassSecondaryButton>Отмена</GlassSecondaryButton>
            <NeonPrimaryButton>Сохранить настройки</NeonPrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
