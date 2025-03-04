import { Card } from "@mui/material";
import { useTranslations } from "next-intl";

const QuickActions = () => {
  let t = useTranslations('home');
  return (
    <div className="px-4 mt-4">
      <h2 className="text-lg font-semibold">{t('quick_actions')}</h2>
      <Card className="p-4 bg-green-100 text-green-700 mt-2 text-center w-1/3">
        <span className="text-lg">⚙️</span>
        <p className="mt-1">{t('not_available_service')}</p>
      </Card>
    </div>
  );
};

export default QuickActions;
