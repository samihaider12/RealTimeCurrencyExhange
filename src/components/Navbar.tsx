import { useState, useEffect, useMemo, memo } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Button,
  Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Divider, Avatar,
  IconButton, useMediaQuery, useTheme, TextField
} from '@mui/material';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import { getRates } from '../services/currency.api';
import { auth } from '../DataBase/fireBase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import Swal from 'sweetalert2';
import { country_list } from '../services/currencyList';

const drawerWidth = 240;
const closedDrawerWidth = 75;
const CurrencyRow = memo(({ code, onClick, open, isMobile, flagUrl }: any) => {
  // Full currency name nikalne ke liye built-in browser API
  const currencyNames = new Intl.DisplayNames(['en'], { type: 'currency' });
  const fullName = currencyNames.of(code) || "";

  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        onClick={() => onClick(code)}
        sx={{ 
          minHeight: "75px", 
          px: 2, 
          justifyContent: open || isMobile ? 'initial' : 'center' 
        }}
      >
        <ListItemIcon sx={{ minWidth: 0, mr: (open || isMobile) ? 3 : 'auto' }}>
          <Avatar 
            src={flagUrl} 
            alt={code} 
            sx={{ 
              width: 32, 
              height: 32, 
              border: '1px solid #eee',
              borderRadius: '4px' // Thoda rectangular look flag ke liye
            }} 
          />
        </ListItemIcon>
        
        {(open || isMobile) && (
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '15px', color: '#333' }}>
                  {code}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {fullName}
                </Typography>
              </Box>
            }
          />
        )}
      </ListItemButton>
      <Divider />
    </ListItem>
  );
});

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [visibleCount, setVisibleCount] = useState(15);

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // ✅ Fix 1: Saare Hooks 'return' se pehle aane chahiye
  const isAuthPage = location.pathname === '/auth';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && location.pathname === '/auth') {
        navigate('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [navigate, location.pathname]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await getRates("USD");
        setCurrencies(Object.keys(data));
      } catch (err) {
        console.error("Fetch error", err);
      }
    };
    fetchCurrencies();
  }, []);

  useEffect(() => {
    setVisibleCount(15);
  }, [searchText]);

  const filteredCurrencies = useMemo(() => {
    const filtered = currencies.filter(c =>
      c.toLowerCase().includes(searchText.toLowerCase())
    );
    return filtered.slice(0, visibleCount);
  }, [currencies, searchText, visibleCount]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Swal.fire({
        title: 'Logged Out',
        text: 'You successfully logout!',
        icon: 'info',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true
      });
      navigate('/auth');
    } catch (error: any) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  const handleCurrencyClick = (code: string) => {
    navigate(`/dashboard?filter=${code}`);
    if (isMobile) setMobileOpen(false);
  };

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
      setVisibleCount((prev) => prev + 15);
    }
  };

  // ✅ Fix 2: 'if' condition ko saare hooks ke NEECHE rakha hai
  if (isAuthPage) return null;

  const drawerContent = (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toolbar />
      <Box sx={{ flexShrink: 0 }}>
        <ListItemButton onClick={() => navigate('/dashboard')}>
          <ListItemIcon><DashboardIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Full Dashboard" />
        </ListItemButton>
        <Divider />
        <Box sx={{ p: 2 }}>
          <TextField
            size="small" fullWidth placeholder="Search currency..."
            value={searchText} onChange={(e) => setSearchText(e.target.value)}
          />
        </Box>
      </Box>

      <Box
        onScroll={handleScroll}
        sx={{
          flex: 1,
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#ccc', borderRadius: '10px' }
        }}
      >
        <List>
          {filteredCurrencies.map((code) => (
            <CurrencyRow
              key={code}
              code={code}
              symbol={country_list[code] || code[0]}
              flagUrl={`https://flagcdn.com/48x36/${code.substring(0, 2).toLowerCase()}.png`}
              open={open}
              isMobile={isMobile}
              onClick={handleCurrencyClick}
            />
          ))}
          {visibleCount < currencies.length && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="textSecondary">Loading more...</Typography>
            </Box>
          )}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, bgcolor: '#1976d2' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton color="inherit" onClick={() => setMobileOpen(true)} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6">💱 Exchange</Typography>
          </Box>
          <Box>
            <Button color="inherit" component={RouterLink} to="/dashboard" sx={{ mx: 1, textTransform: "none" }}>Dashboard</Button>
            <Button color="inherit" component={RouterLink} to="/form" sx={{ mx: 1, textTransform: "none" }}>Add +</Button>
            {user ? (
              <Button
                sx={{
                  color: "red",
                  textTransform: "none",
                  bgcolor: 'rgba(255,255,255,0.1)'
                }}
                onClick={handleLogout}>Logout</Button>
            ) : (
              <Button color="inherit" component={RouterLink} to="/auth">Login</Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : open}
        onClose={() => setMobileOpen(false)}
        onMouseEnter={() => !isMobile && setOpen(true)}
        onMouseLeave={() => !isMobile && setOpen(false)}
        sx={{
          width: open ? drawerWidth : closedDrawerWidth,
          '& .MuiDrawer-paper': {
            width: (open || isMobile) ? drawerWidth : closedDrawerWidth,
            transition: 'width 0.15s ease-in-out',
            overflowX: 'hidden'
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Navbar;