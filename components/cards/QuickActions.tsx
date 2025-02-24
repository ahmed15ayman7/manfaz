import { Card } from "@mui/material";

const QuickActions = () => {
  return (
    <div className="px-4 mt-4">
      <h2 className="text-lg font-semibold">Quick Actions</h2>
      <Card className="p-4 bg-green-100 text-green-700 mt-2 text-center w-1/3">
        <span className="text-lg">⚙️</span>
        <p className="mt-1">Not Available Service</p>
      </Card>
    </div>
  );
};

export default QuickActions;
