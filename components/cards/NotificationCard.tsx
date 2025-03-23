import { Avatar, Typography, Card, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box } from "@mui/material";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { FC, useState } from "react";
import { IconCheck, IconTrash } from "@tabler/icons-react";

interface NotificationCardProps {
  image: string;
  title: string;
  description: string;
  highlightedText?: string;
  timeAgo: string;
  isRead: boolean;
  onDelete: () => void;
  onRead: () => void;
}

const NotificationCard: FC<NotificationCardProps> = ({
  image,
  title,
  description,
  highlightedText,
  timeAgo,
  onDelete,
  onRead,
  isRead
}) => {
  let [open, setOpen] = useState(false)
  return (
<motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full"
    >
      <Card className={twMerge("p-4 flex items-center space-x-4 rtl:space-x-reverse rounded-xl shadow-sm")}>
        {/* Profile Image */}
        <img src={image} alt="User Avatar" className="max-sm:w-12 max-sm:h-12 h-24 w-24 rounded-full" />

        {/* Text Content */}
        <div className="flex-1">
          <Typography variant="subtitle1" className="font-semibold">
            {title}
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            {description.split(highlightedText ?? "").map((part, index) => (
              <span key={index}>
                {part}
                {index < (highlightedText ? description.split(highlightedText).length - 1 : 0) && (
                  <span className="text-blue-600 font-medium">{highlightedText}</span>
                )}
              </span>
            ))} 
          </Typography>
          <Typography variant="caption" className="text-gray-400">
            {timeAgo}
          </Typography>
        </div>
            <Box className="flex items-center space-x-1 rtl:space-x-reverse">
            {/* Read Button */}
        {!isRead && <Button onClick={onRead}>
          <Typography variant="body2" className="text-blue-500 font-medium">
            <IconCheck />
          </Typography>
        </Button>}
        {/* Delete Button */}
        <Button onClick={() => setOpen(true)}>
          <Typography variant="body2" className="text-red-500 font-medium">
            <IconTrash />
          </Typography>
        </Button>
        </Box>
      </Card>
      {/* confirm delete dialog */}
      <Dialog open={open}>
          <Card>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this notification?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={()=>{
                onDelete()
                setOpen(false)
              }}>
              <Typography variant="body2" className="text-red-500 font-medium">
                Delete
              </Typography>
              </Button>
            </DialogActions>
          </Card>
        </Dialog>
    </motion.div>
  );
};

export default NotificationCard;
