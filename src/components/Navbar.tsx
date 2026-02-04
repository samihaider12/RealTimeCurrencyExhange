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
              borderRadius: '4px' 
            }} 
          />
        </ListItemIcon>
        
        {(open || isMobile) && (
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Typography sx={{ fontWeight: 600, fontSize: '15px', color: '#333' }}>
                  {code}
                </Typography>
                <Typography sx={{ fontSize: '11px', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
  
  // Responsive Breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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
        icon: 'info',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate('/auth');
    } catch (error: any) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  const handleCurrencyClick = (code: string) => {
    navigate(`/dashboard?filter=${code}`);
    if (isMobile || isTablet) setMobileOpen(false);
  };

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
      setVisibleCount((prev) => prev + 15);
    }
  };

  if (isAuthPage) return null;

  const drawerContent = (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toolbar />
      <Box sx={{ flexShrink: 0 }}>
        <ListItemButton onClick={() => { navigate('/dashboard'); if(isMobile) setMobileOpen(false); }}>
          <ListItemIcon><DashboardIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Full Dashboard" />
        </ListItemButton>
        <Divider />
        <Box sx={{ p: 2 }}>
          <TextField
            size="small" fullWidth placeholder="Search..."
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
          '&::-webkit-scrollbar': { width: '4px' },
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
              isMobile={isMobile || isTablet}
              onClick={handleCurrencyClick}
            />
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, bgcolor: '#1976d2' }}>
        <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
          {/* Left Side: Menu + Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            {(isMobile || isTablet) && (
              <IconButton color="inherit" onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 700 }}>
              💱 {isMobile ? "Ex" : "Exchange"}
            </Typography>
          </Box>

          {/* Right Side: Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
            <Button color="inherit" component={RouterLink} to="/dashboard" 
              sx={{ fontSize: { xs: '12px', sm: '14px' }, textTransform: "none", minWidth: 'auto' }}>
              Dashboard
            </Button>
            <Button color="inherit" component={RouterLink} to="/form" 
              sx={{ fontSize: { xs: '12px', sm: '14px' }, textTransform: "none", minWidth: 'auto' }}>
              Add+
            </Button>
            {user ? (
              <Button
                variant="contained"
                size="small"
                sx={{
                  bgcolor: "#d32f2f",
                  fontSize: { xs: '10px', sm: '12px' },
                  textTransform: "none",
                  '&:hover': { bgcolor: '#b71c1c' }
                }}
                onClick={handleLogout}>Logout</Button>
            ) : (
              <Button color="inherit" component={RouterLink} to="/auth">Login</Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={(isMobile || isTablet) ? "temporary" : "permanent"}
        open={(isMobile || isTablet) ? mobileOpen : open}
        onClose={() => setMobileOpen(false)}
        onMouseEnter={() => !(isMobile || isTablet) && setOpen(true)}
        onMouseLeave={() => !(isMobile || isTablet) && setOpen(false)}
        sx={{
          width: open ? drawerWidth : (isMobile || isTablet ? 0 : closedDrawerWidth),
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: (open || isMobile || isTablet) ? drawerWidth : closedDrawerWidth,
            transition: 'width 0.2s ease-in-out',
            overflowX: 'hidden',
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Navbar;