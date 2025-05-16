"use client";
import { useTranslations } from 'next-intl';
import { Box, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import NotesIcon from '@mui/icons-material/Notes';
import PercentIcon from '@mui/icons-material/Percent';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BusinessIcon from '@mui/icons-material/Business';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import Link from 'next/link';

export default function ProfilePage() {
  const t = useTranslations();
  return (
    <Box sx={{ py: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <List>
          <ListItem component={Link} href="/profile/wallet">
            <ListItemIcon><WalletIcon color="primary" /></ListItemIcon>
            <ListItemText primary={t('profile_tab.wallet')} />
          </ListItem>
          <ListItem component={Link} href="/profile/delivery-balance">
            <ListItemIcon><LocalShippingIcon color="primary" /></ListItemIcon>
            <ListItemText primary={t('profile_tab.delivery_balance')} />
          </ListItem>
          <ListItem component={Link} href="/profile/orders">
            <ListItemIcon><ListAltIcon color="primary" /></ListItemIcon>
            <ListItemText primary={t('profile_tab.orders')} />
          </ListItem>
          <ListItem component={Link} href="/profile/addresses">
            <ListItemIcon><LocationOnIcon color="primary" /></ListItemIcon>
            <ListItemText primary={t('profile_tab.saved_addresses')} />
          </ListItem>
          <ListItem component={Link} href="/profile/ratings">
            <ListItemIcon><StarIcon color="primary" /></ListItemIcon>
            <ListItemText primary={t('profile_tab.ratings')} />
          </ListItem>
          <ListItem component={Link} href="/profile/notes">
            <ListItemIcon><NotesIcon color="primary" /></ListItemIcon>
            <ListItemText primary={t('profile_tab.user_notes')} />
          </ListItem>
          <ListItem component={Link} href="/profile/coupons">
            <ListItemIcon><PercentIcon color="primary" /></ListItemIcon>
            <ListItemText primary={t('profile_tab.add_coupon')} />
          </ListItem>
          <ListItem component={Link} href="/profile/support">
            <ListItemIcon><SupportAgentIcon color="primary" /></ListItemIcon>
            <ListItemText primary={t('profile_tab.customer_support')} />
          </ListItem>
          <ListItem component={Link} href="/profile/offers">
            <ListItemIcon><BusinessIcon color="primary" /></ListItemIcon>
            <ListItemText primary={t('profile_tab.corporate_offers')} />
          </ListItem>
          <ListItem component={Link} href="/profile/settings">
            <ListItemIcon><SettingsIcon color="primary" /></ListItemIcon>
            <ListItemText primary={t('profile_tab.settings')} />
          </ListItem>
          <ListItem component={Link} href="/profile/about">
            <ListItemIcon><InfoIcon color="primary" /></ListItemIcon>
            <ListItemText primary={t('about.title')} />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}
// "use client";
// import { useTranslations } from 'next-intl';
// import { Box, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
// import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
// import LocalShippingIcon from '@mui/icons-material/LocalShipping';
// import ListAltIcon from '@mui/icons-material/ListAlt';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import StarIcon from '@mui/icons-material/Star';
// import NotesIcon from '@mui/icons-material/Notes';
// import PercentIcon from '@mui/icons-material/Percent';
// import SupportAgentIcon from '@mui/icons-material/SupportAgent';
// import BusinessIcon from '@mui/icons-material/Business';
// import SettingsIcon from '@mui/icons-material/Settings';
// import InfoIcon from '@mui/icons-material/Info';
// import Link from 'next/link';

// export default function ProfilePage() {
//   const t = useTranslations();
//   return (
//     <Box sx={{ py: 4 }}>
//       <Paper sx={{ p: 3, borderRadius: 2 }}>
//         <List>
//           <ListItem component={Link} href="/profile/wallet">
//             <ListItemIcon><WalletIcon color="primary" /></ListItemIcon>
//             <ListItemText primary={t('profile_tab.wallet')} />
//           </ListItem>
//           <ListItem component={Link} href="/profile/delivery-balance">
//             <ListItemIcon><LocalShippingIcon color="primary" /></ListItemIcon>
//             <ListItemText primary={t('profile_tab.delivery_balance')} />
//           </ListItem>
//           <ListItem component={Link} href="/profile/orders">
//             <ListItemIcon><ListAltIcon color="primary" /></ListItemIcon>
//             <ListItemText primary={t('profile_tab.orders')} />
//           </ListItem>
//           <ListItem component={Link} href="/profile/addresses">
//             <ListItemIcon><LocationOnIcon color="primary" /></ListItemIcon>
//             <ListItemText primary={t('profile_tab.saved_addresses')} />
//           </ListItem>
//           <ListItem component={Link} href="/profile/ratings">
//             <ListItemIcon><StarIcon color="primary" /></ListItemIcon>
//             <ListItemText primary={t('profile_tab.ratings')} />
//           </ListItem>
//           <ListItem component={Link} href="/profile/notes">
//             <ListItemIcon><NotesIcon color="primary" /></ListItemIcon>
//             <ListItemText primary={t('profile_tab.user_notes')} />
//           </ListItem>
//           <ListItem component={Link} href="/profile/coupons">
//             <ListItemIcon><PercentIcon color="primary" /></ListItemIcon>
//             <ListItemText primary={t('profile_tab.add_coupon')} />
//           </ListItem>
//           <ListItem component={Link} href="/profile/support">
//             <ListItemIcon><SupportAgentIcon color="primary" /></ListItemIcon>
//             <ListItemText primary={t('profile_tab.customer_support')} />
//           </ListItem>
//           <ListItem component={Link} href="/profile/offers">
//             <ListItemIcon><BusinessIcon color="primary" /></ListItemIcon>
//             <ListItemText primary={t('profile_tab.corporate_offers')} />
//           </ListItem>
//           <ListItem component={Link} href="/profile/settings">
//             <ListItemIcon><SettingsIcon color="primary" /></ListItemIcon>
//             <ListItemText primary={t('profile_tab.settings')} />
//           </ListItem>
//           <ListItem component={Link} href="/profile/about">
//             <ListItemIcon><InfoIcon color="primary" /></ListItemIcon>
//             <ListItemText primary={t('about.title')} />
//           </ListItem>
//         </List>
//       </Paper>
//     </Box>
//   );
// }