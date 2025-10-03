import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={i18n.language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => i18n.changeLanguage('en')}
      >
        English
      </Button>
      <Button
        variant={i18n.language === 'hi' ? 'default' : 'outline'}
        size="sm"
        onClick={() => i18n.changeLanguage('hi')}
      >
        हिन्दी
      </Button>
    </div>
  );
}