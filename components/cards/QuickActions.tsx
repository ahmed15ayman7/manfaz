import { Card } from "@mui/material";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { IconTruck, IconTools, IconShoppingCart } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const QuickActions = () => {
  const t = useTranslations('home');
  const router = useRouter();

  const actions = [
    {
      icon: <IconTools size={24} className="text-green-600" />,
      title: t('services'),
      description: t('services_description'),
      onClick: () => router.push('/services'),
      color: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
    },
    {
      icon: <IconTruck size={24} className="text-blue-600" />,
      title: t('delivery'),
      description: t('delivery_description'),
      onClick: () => router.push('/delivery-service'),
      color: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
    },
    {
      icon: <IconShoppingCart size={24} className="text-purple-600" />,
      title: t('products'),
      description: t('products_description'),
      onClick: () => router.push('/products'),
      color: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
    },
  ];

  return (
    <div className="px-4 mt-4">
      <h2 className="text-lg font-semibold mb-4">{t('quick_actions')}</h2>
      <div className="grid grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              onClick={action.onClick}
              className={`p-4 cursor-pointer transition-all duration-300 ${action.color} ${action.hoverColor} border-none`}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <div className={`p-2 rounded-full ${action.color}`}>
                  {action.icon}
                </div>
                <h3 className="font-medium">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
