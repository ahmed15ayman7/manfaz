import { Typography } from "@mui/material";
import {IconLocation} from "@tabler/icons-react"

const HomeHeader = () => {
  return (
    <div className="bg-blue-600 text-white p-4 rounded-b-2xl absolute top-20 left-0 right-0">
      <div className="flex items-center gap-2">
        <IconLocation size={20} />
        <Typography variant="body2" className="font-medium">
          El Najah, Saudi Arabia ▼
        </Typography>
      </div>
      <Typography variant="h5" className="font-bold mt-2">
        Good Morning, Ahmed
      </Typography>
    </div>
  );
};

export default HomeHeader;
