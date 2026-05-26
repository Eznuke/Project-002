import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
import { Search, TrendingUp, TrendingDown, Eye, EyeOff, Plus, Minus, Clock, Bell, LogOut, AlertCircle, Trophy, User, Settings } from 'lucide-react';

export default function StockMarketSimulator() {
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [authError, setAuthError] = useState('');

  // Game State
  const [stocks, setStocks] = useState({});
  const [stockHistory, setStockHistory] = useState({});
  const [portfolio, setPortfolio] = useState({});
  const [balance, setBalance] = useState(100000);
  const [watchlist, setWatchlist] = useState(['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN']);
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellStock, setSellStock] = useState(null);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [orderHistory, setOrderHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orderType, setOrderType] = useState('market');
  const [limitPrice, setLimitPrice] = useState('');
  const [sector, setSector] = useState('all');
  const [sortBy, setSortBy] = useState('change');
  const [showProfileModal, setShowProfileModal] = useState(false);

  const allStocks = {
    'AAPL': { name: 'Apple Inc.', price: 192.45, basePrice: 192.45, change: 0, volume: 52234567, pe: 28.5, market_cap: '2.98T', eps: 6.05, dividend: 0.94, sector: 'Technology', industry: 'Consumer Electronics', dayHigh: 195, dayLow: 190, week52High: 215, week52Low: 155, avgVolume: 50000000 },
    'GOOGL': { name: 'Alphabet Inc.', price: 138.75, basePrice: 138.75, change: 0, volume: 21345678, pe: 24.3, market_cap: '1.82T', eps: 5.71, dividend: 0, sector: 'Technology', industry: 'Internet Services', dayHigh: 140, dayLow: 136, week52High: 155, week52Low: 95, avgVolume: 25000000 },
    'MSFT': { name: 'Microsoft Corp.', price: 375.92, basePrice: 375.92, change: 0, volume: 19876543, pe: 35.2, market_cap: '2.80T', eps: 10.65, dividend: 2.72, sector: 'Technology', industry: 'Software', dayHigh: 380, dayLow: 370, week52High: 420, week52Low: 310, avgVolume: 20000000 },
    'NVDA': { name: 'NVIDIA Corp.', price: 875.28, basePrice: 875.28, change: 0, volume: 38765432, pe: 68.4, market_cap: '2.16T', eps: 12.78, dividend: 0.04, sector: 'Technology', industry: 'Semiconductors', dayHigh: 890, dayLow: 860, week52High: 950, week52Low: 420, avgVolume: 35000000 },
    'META': { name: 'Meta Platforms', price: 498.34, basePrice: 498.34, change: 0, volume: 12345678, pe: 22.1, market_cap: '1.27T', eps: 22.54, dividend: 0, sector: 'Technology', industry: 'Internet Services', dayHigh: 510, dayLow: 485, week52High: 540, week52Low: 350, avgVolume: 15000000 },
    'INTC': { name: 'Intel Corp.', price: 41.82, basePrice: 41.82, change: 0, volume: 45123456, pe: 12.5, market_cap: '175B', eps: 3.34, dividend: 1.40, sector: 'Technology', industry: 'Semiconductors', dayHigh: 43, dayLow: 40, week52High: 52, week52Low: 28, avgVolume: 42000000 },
    'AMD': { name: 'Advanced Micro Devices', price: 168.45, basePrice: 168.45, change: 0, volume: 28765432, pe: 35.2, market_cap: '172B', eps: 4.78, dividend: 0, sector: 'Technology', industry: 'Semiconductors', dayHigh: 171, dayLow: 165, week52High: 192, week52Low: 85, avgVolume: 27000000 },
    'TSMC': { name: 'Taiwan Semiconductor', price: 120.56, basePrice: 120.56, change: 0, volume: 32145678, pe: 18.9, market_cap: '1.26T', eps: 6.38, dividend: 1.70, sector: 'Technology', industry: 'Semiconductors', dayHigh: 122, dayLow: 119, week52High: 140, week52Low: 60, avgVolume: 30000000 },
    'TSLA': { name: 'Tesla Inc.', price: 242.84, basePrice: 242.84, change: 0, volume: 127654321, pe: 58.9, market_cap: '770B', eps: 4.07, dividend: 0, sector: 'Automotive', industry: 'Auto Manufacturing', dayHigh: 250, dayLow: 235, week52High: 280, week52Low: 140, avgVolume: 120000000 },
    'TM': { name: 'Toyota Motor', price: 195.32, basePrice: 195.32, change: 0, volume: 2345678, pe: 9.8, market_cap: '295B', eps: 19.91, dividend: 4.40, sector: 'Automotive', industry: 'Auto Manufacturing', dayHigh: 198, dayLow: 192, week52High: 240, week52Low: 150, avgVolume: 2100000 },
    'AMZN': { name: 'Amazon.com Inc.', price: 180.56, basePrice: 180.56, change: 0, volume: 45678901, pe: 45.6, market_cap: '1.87T', eps: 3.96, dividend: 0, sector: 'Consumer', industry: 'Internet Retail', dayHigh: 185, dayLow: 175, week52High: 210, week52Low: 130, avgVolume: 42000000 },
    'WMT': { name: 'Walmart Inc.', price: 92.45, basePrice: 92.45, change: 0, volume: 6234567, pe: 26.8, market_cap: '248B', eps: 3.45, dividend: 1.96, sector: 'Consumer', industry: 'Retail', dayHigh: 94, dayLow: 90, week52High: 98, week52Low: 68, avgVolume: 5800000 },
    'COST': { name: 'Costco Wholesale', price: 825.12, basePrice: 825.12, change: 0, volume: 1765432, pe: 48.5, market_cap: '365B', eps: 17.01, dividend: 2.04, sector: 'Consumer', industry: 'Retail', dayHigh: 835, dayLow: 815, week52High: 870, week52Low: 540, avgVolume: 1600000 },
    'JPM': { name: 'JPMorgan Chase', price: 198.45, basePrice: 198.45, change: 0, volume: 12543210, pe: 13.2, market_cap: '561B', eps: 15.05, dividend: 4.00, sector: 'Finance', industry: 'Banking', dayHigh: 200, dayLow: 196, week52High: 215, week52Low: 120, avgVolume: 11900000 },
    'JNJ': { name: 'Johnson & Johnson', price: 156.78, basePrice: 156.78, change: 0, volume: 4234567, pe: 24.2, market_cap: '412B', eps: 6.48, dividend: 4.60, sector: 'Healthcare', industry: 'Pharma', dayHigh: 159, dayLow: 155, week52High: 175, week52Low: 110, avgVolume: 4000000 },
    'NFLX': { name: 'Netflix Inc.', price: 445.92, basePrice: 445.92, change: 0, volume: 3456789, pe: 35.8, market_cap: '192B', eps: 12.44, dividend: 0, sector: 'Entertainment', industry: 'Streaming', dayHigh: 460, dayLow: 430, week52High: 500, week52Low: 300, avgVolume: 3200000 },
    'DIS': { name: 'Disney Inc.', price: 92.15, basePrice: 92.15, change: 0, volume: 12345678, pe: 22.5, market_cap: '168B', eps: 4.09, dividend: 0.99, sector: 'Entertainment', industry: 'Media', dayHigh: 94, dayLow: 90, week52High: 123, week52Low: 78, avgVolume: 12000000 },
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const users = JSON.parse(localStorage.getItem('apex_users') || '{}');
      const loggedInUser = localStorage.getItem('apex_currentUser');

      if (loggedInUser && users[loggedInUser]) {
        const userData = users[loggedInUser];
        setCurrentUser({
          email: loggedInUser,
          username: userData.username || 'Trader',
          joinDate: userData.joinDate || new Date().toLocaleDateString(),
        });
        setIsLoggedIn(true);
        setStocks(userData.stocks || { ...allStocks });
        setStockHistory(userData.stockHistory || {});
        setPortfolio(userData.portfolio || {});
        setBalance(userData.balance || 100000);
        setWatchlist(userData.watchlist || ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN']);
        setOrderHistory(userData.orderHistory || []);
      } else {
        setStocks({ ...allStocks });
      }
    } catch (error) {
      console.log('Load error:', error);
      setStocks({ ...allStocks });
    }
  };

  const saveUserData = useCallback(() => {
    if (!currentUser) return;
    try {
      const users = JSON.parse(localStorage.getItem('apex_users') || '{}');
      // PENTING: Simpan data terpisah per user
      users[currentUser.email] = {
        username: currentUser.username,
        joinDate: currentUser.joinDate,
        password: users[currentUser.email]?.password, // Keep existing password
        stocks: stocks,
        stockHistory: stockHistory,
        portfolio: portfolio,
        balance: balance,
        watchlist: watchlist,
        orderHistory: orderHistory,
        selectedStock: selectedStock,
        timestamp: Date.now()
      };
      localStorage.setItem('apex_users', JSON.stringify(users));
    } catch (error) {
      console.log('Save error:', error);
    }
  }, [currentUser, stocks, stockHistory, portfolio, balance, watchlist, orderHistory, selectedStock]);

  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => saveUserData(), 500);
      return () => clearTimeout(timer);
    }
  }, [balance, portfolio, orderHistory, isLoggedIn, saveUserData]);

  const handleLogin = () => {
    if (!authEmail || !authPassword) {
      setAuthError('Email dan password harus diisi!');
      return;
    }

    if (!authEmail.includes('@')) {
      setAuthError('Format email tidak valid!');
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem('apex_users') || '{}');

      if (authMode === 'login') {
        if (!users[authEmail]) {
          setAuthError('Email tidak terdaftar!');
          return;
        }

        if (users[authEmail].password !== authPassword) {
          setAuthError('Password salah!');
          return;
        }

        localStorage.setItem('apex_currentUser', authEmail);
        const userData = users[authEmail];
        setCurrentUser({
          email: authEmail,
          username: userData.username || 'Trader',
          joinDate: userData.joinDate || new Date().toLocaleDateString(),
        });
        setIsLoggedIn(true);
        setAuthError('');

        // Load user's specific data
        setStocks(userData.stocks || { ...allStocks });
        setStockHistory(userData.stockHistory || {});
        setPortfolio(userData.portfolio || {});
        setBalance(userData.balance || 100000);
        setWatchlist(userData.watchlist || ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN']);
        setOrderHistory(userData.orderHistory || []);
      } else {
        // Register
        if (!authUsername) {
          setAuthError('Username tidak boleh kosong!');
          return;
        }

        if (users[authEmail]) {
          setAuthError('Email sudah terdaftar!');
          return;
        }

        const joinDate = new Date().toLocaleDateString();
        users[authEmail] = {
          password: authPassword,
          username: authUsername,
          joinDate: joinDate,
          stocks: { ...allStocks },
          stockHistory: {},
          portfolio: {},
          balance: 100000,
          watchlist: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'],
          orderHistory: [],
          selectedStock: 'AAPL',
          timestamp: Date.now()
        };

        localStorage.setItem('apex_users', JSON.stringify(users));
        localStorage.setItem('apex_currentUser', authEmail);
        
        setCurrentUser({
          email: authEmail,
          username: authUsername,
          joinDate: joinDate,
        });
        setIsLoggedIn(true);
        setAuthError('');

        // Initialize new user's data
        setStocks({ ...allStocks });
        setBalance(100000);
        setPortfolio({});
        setWatchlist(['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN']);
        setOrderHistory([]);
      }

      setAuthEmail('');
      setAuthPassword('');
      setAuthUsername('');
    } catch (error) {
      setAuthError('Terjadi error: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('apex_currentUser');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setAuthEmail('');
    setAuthPassword('');
    setAuthUsername('');
    setAuthMode('login');
    setAuthError('');
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(() => {
      setStocks(prevStocks => {
        const updatedStocks = { ...prevStocks };
        Object.keys(updatedStocks).forEach(symbol => {
          const stock = updatedStocks[symbol];
          const randomChange = (Math.random() - 0.5) * 2 * (stock.basePrice * 0.02);
          const newPrice = Math.max(stock.basePrice * 0.5, stock.price + randomChange);
          const changePercent = ((newPrice - stock.basePrice) / stock.basePrice) * 100;

          updatedStocks[symbol] = {
            ...stock,
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(changePercent.toFixed(2)),
            volume: stock.volume + Math.floor(Math.random() * 100000),
            dayHigh: Math.max(stock.dayHigh, newPrice),
            dayLow: Math.min(stock.dayLow, newPrice),
          };

          setStockHistory(prev => ({
            ...prev,
            [symbol]: [
              ...(prev[symbol] || []),
              {
                time: new Date().toLocaleTimeString(),
                price: parseFloat(newPrice.toFixed(2)),
                volume: stock.volume + Math.floor(Math.random() * 100000),
              }
            ].slice(-120)
          }));
        });
        return updatedStocks;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const handleBuyStock = () => {
    const stock = stocks[selectedStock];
    const buyPrice = orderType === 'limit' ? (parseFloat(limitPrice) || stock.price) : stock.price;
    const totalCost = buyPrice * buyQuantity;

    if (totalCost > balance) {
      alert('Saldo tidak cukup!');
      return;
    }

    setBalance(balance - totalCost);
    setPortfolio({
      ...portfolio,
      [selectedStock]: (portfolio[selectedStock] || 0) + buyQuantity
    });

    setOrderHistory([
      {
        id: Date.now(),
        symbol: selectedStock,
        type: 'BUY',
        quantity: buyQuantity,
        price: buyPrice,
        total: totalCost,
        timestamp: new Date().toLocaleString(),
      },
      ...orderHistory
    ]);

    setBuyQuantity(1);
    setLimitPrice('');
    setOrderType('market');
    setShowBuyModal(false);
  };

  const handleSellStock = () => {
    if (!sellStock || !stocks[sellStock]) {
      alert('Error - Stock tidak valid');
      return;
    }

    const stock = stocks[sellStock];
    const currentQty = portfolio[sellStock] || 0;

    if (currentQty === 0) {
      alert('Anda tidak punya stock ini!');
      return;
    }

    if (sellQuantity <= 0 || sellQuantity > currentQty) {
      alert(`Input quantity invalid! Anda punya ${currentQty} shares`);
      return;
    }

    const totalValue = stock.price * sellQuantity;
    const newBalance = balance + totalValue;
    const newQty = currentQty - sellQuantity;

    setBalance(newBalance);

    if (newQty <= 0) {
      const newPortfolio = { ...portfolio };
      delete newPortfolio[sellStock];
      setPortfolio(newPortfolio);
    } else {
      setPortfolio({
        ...portfolio,
        [sellStock]: newQty
      });
    }

    setOrderHistory([
      {
        id: Date.now(),
        symbol: sellStock,
        type: 'SELL',
        quantity: sellQuantity,
        price: stock.price,
        total: totalValue,
        timestamp: new Date().toLocaleString(),
      },
      ...orderHistory
    ]);

    setShowSellModal(false);
    setSellStock(null);
    setSellQuantity(1);

    alert(`✅ Berhasil jual ${sellQuantity} ${sellStock} seharga $${totalValue.toFixed(2)}`);
  };

  const calculatePortfolioValue = () => {
    return Object.entries(portfolio).reduce((acc, [symbol, quantity]) => {
      return acc + (stocks[symbol]?.price || 0) * quantity;
    }, 0);
  };

  const calculateTotalGain = () => {
    const currentValue = calculatePortfolioValue() + balance;
    return currentValue - 100000;
  };

  const getLeaderboard = () => {
    try {
      const users = JSON.parse(localStorage.getItem('apex_users') || '{}');
      return Object.entries(users).map(([email, data]) => {
        const portfolioValue = Object.entries(data.portfolio || {}).reduce((acc, [sym, qty]) => {
          return acc + (data.stocks?.[sym]?.price || 0) * qty;
        }, 0);
        const totalValue = portfolioValue + (data.balance || 100000);
        const gain = totalValue - 100000;
        
        return { 
          email, 
          username: data.username || 'Trader',
          totalValue, 
          gain, 
          gainPercent: (gain / 100000) * 100 
        };
      }).sort((a, b) => b.totalValue - a.totalValue);
    } catch (error) {
      return [];
    }
  };

  const toggleWatchlist = (symbol) => {
    setWatchlist(prev =>
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const getChartData = useCallback(() => {
    if (!stockHistory[selectedStock]) return [];
    return stockHistory[selectedStock].slice(-60).map((item, idx) => ({
      time: idx,
      price: item.price,
      volume: item.volume,
    }));
  }, [selectedStock, stockHistory]);

  const filteredStocks = Object.entries(stocks)
    .filter(([symbol, stock]) => {
      const matchesSearch = symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = sector === 'all' || stock.sector === sector;
      return matchesSearch && matchesSector;
    })
    .sort((a, b) => b[1].change - a[1].change);

  const selectedStockData = stocks[selectedStock];
  const chartData = getChartData();
  const sectors = ['all', ...new Set(Object.values(stocks).map(s => s.sector))];
  const leaderboard = getLeaderboard();
  const userRank = leaderboard.findIndex(u => u.email === currentUser?.email) + 1;

  // LOGIN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white font-sans flex items-center justify-center p-4">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-md w-full">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                APEX TRADING
              </h1>
              <p className="text-slate-400">Stock Market Simulator</p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-2 bg-slate-700/30 p-1 rounded-lg">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError('');
                    setAuthUsername('');
                  }}
                  className={`flex-1 py-2 rounded font-semibold ${authMode === 'login' ? 'bg-cyan-500 text-white' : 'text-slate-400'}`}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setAuthError('');
                  }}
                  className={`flex-1 py-2 rounded font-semibold ${authMode === 'register' ? 'bg-cyan-500 text-white' : 'text-slate-400'}`}
                >
                  Register
                </button>
              </div>

              {authError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle size={20} className="text-red-400" />
                  <p className="text-sm text-red-200">{authError}</p>
                </div>
              )}

              <div className="space-y-4">
                {authMode === 'register' && (
                  <input
                    type="text"
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                )}

                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="user@example.com"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />

                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="••••••••"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold py-3 rounded-lg transition-all"
              >
                {authMode === 'login' ? 'Login' : 'Create Account'}
              </button>

              <div className="bg-slate-700/30 rounded-lg p-4 text-sm">
                <p className="mb-2">📝 Demo: demo@apex.com / demo123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN APP
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <header className="relative border-b border-slate-700/50 backdrop-blur-xl bg-slate-950/50 sticky top-0 z-40">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                APEX TRADING
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right text-sm">
                <p className="text-slate-400">Balance: <span className="text-cyan-400 font-bold">${balance.toFixed(0)}</span></p>
                <p className={`${calculateTotalGain() >= 0 ? 'text-green-400' : 'text-red-400'} font-bold`}>
                  {calculateTotalGain() >= 0 ? '+' : ''}{calculateTotalGain().toFixed(0)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="text-slate-400 hover:text-cyan-400 transition-all"
                >
                  <User size={24} />
                </button>
                <div>
                  <p className="text-sm font-bold">{currentUser?.username}</p>
                  <p className="text-xs text-slate-400">{currentUser?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500/20 hover:bg-red-500/30 p-2 rounded transition-all"
                >
                  <LogOut size={18} className="text-red-400" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 border-t border-slate-700/50 pt-4 overflow-x-auto">
            {['dashboard', 'market', 'portfolio', 'leaderboard', 'orders'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-semibold whitespace-nowrap ${
                  activeTab === tab ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400'
                }`}
              >
                {tab === 'leaderboard' ? '🏆 ' : ''}{tab.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="relative max-w-full mx-auto px-6 py-6">
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-6">
                <p className="text-slate-400 text-sm mb-2">Portfolio Value</p>
                <p className="text-3xl font-bold text-cyan-400">${(calculatePortfolioValue() + balance).toFixed(0)}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <p className="text-slate-400 text-sm mb-2">Holdings</p>
                <p className="text-3xl font-bold">${calculatePortfolioValue().toFixed(0)}</p>
              </div>
              <div className={`${calculateTotalGain() >= 0 ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'} border rounded-xl p-6`}>
                <p className="text-slate-400 text-sm mb-2">Gain/Loss</p>
                <p className={`text-3xl font-bold ${calculateTotalGain() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {calculateTotalGain() >= 0 ? '+' : ''}{calculateTotalGain().toFixed(0)}
                </p>
              </div>
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-6">
                <p className="text-slate-400 text-sm mb-2">Rank</p>
                <p className="text-3xl font-bold text-purple-400">#{userRank}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Holdings</h3>
                {Object.keys(portfolio).length === 0 ? (
                  <p className="text-slate-400">No holdings</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(portfolio).map(([sym, qty]) => {
                      const stock = stocks[sym];
                      return (
                        <div key={sym} className="flex justify-between p-3 bg-slate-700/30 rounded">
                          <div>
                            <p className="font-bold">{sym}</p>
                            <p className="text-xs text-slate-400">{qty} shares</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-cyan-400">${(stock.price * qty).toFixed(0)}</p>
                            <p className={`text-xs ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Trades</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {orderHistory.slice(0, 8).map(o => (
                    <div key={o.id} className="flex justify-between text-sm p-2 bg-slate-700/30 rounded">
                      <div>
                        <span className={`text-xs font-bold mr-2 px-2 py-1 rounded ${
                          o.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>{o.type}</span>
                        {o.symbol} x{o.quantity}
                      </div>
                      <span className="font-bold">${o.total.toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MARKET */}
        {activeTab === 'market' && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-4">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold">{selectedStock}</h2>
                    <p className="text-sm text-slate-400">{selectedStockData?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-cyan-400">${selectedStockData?.price}</p>
                    <p className={`text-lg font-bold ${selectedStockData?.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {selectedStockData?.change > 0 ? '+' : ''}{selectedStockData?.change}%
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4 h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="time" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b' }} />
                      <Line yAxisId="left" type="monotone" dataKey="price" stroke="#06b6d4" strokeWidth={2} dot={false} />
                      <Bar yAxisId="right" dataKey="volume" fill="#8b5cf6" opacity={0.3} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-4 gap-2 text-sm mb-4">
                  <div className="bg-slate-700/30 p-3 rounded">
                    <p className="text-slate-400">P/E</p>
                    <p className="font-bold">{selectedStockData?.pe}</p>
                  </div>
                  <div className="bg-slate-700/30 p-3 rounded">
                    <p className="text-slate-400">EPS</p>
                    <p className="font-bold">${selectedStockData?.eps}</p>
                  </div>
                  <div className="bg-slate-700/30 p-3 rounded">
                    <p className="text-slate-400">DIV</p>
                    <p className="font-bold">${selectedStockData?.dividend || '0'}</p>
                  </div>
                  <div className="bg-slate-700/30 p-3 rounded">
                    <p className="text-slate-400">Range</p>
                    <p className="font-bold text-xs">${selectedStockData?.dayLow}-${selectedStockData?.dayHigh}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowBuyModal(true)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg"
                  >
                    BUY
                  </button>
                  <button
                    onClick={() => {
                      if (portfolio[selectedStock] && portfolio[selectedStock] > 0) {
                        setSellStock(selectedStock);
                        setSellQuantity(1);
                        setShowSellModal(true);
                      } else {
                        alert('Tidak punya stock ini!');
                      }
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg"
                  >
                    SELL
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <div className="relative mb-3">
                  <Search className="absolute left-2 top-2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Cari..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded px-8 py-2 text-sm text-white"
                  />
                </div>

                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-xs text-white"
                >
                  {sectors.map(s => (
                    <option key={s} value={s}>{s === 'all' ? 'Semua' : s}</option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
                {filteredStocks.map(([symbol, stock]) => (
                  <div
                    key={symbol}
                    onClick={() => setSelectedStock(symbol)}
                    className={`p-3 border-b border-slate-700/30 cursor-pointer ${
                      selectedStock === symbol ? 'bg-cyan-500/20' : 'hover:bg-slate-700/30'
                    }`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-bold text-sm">{symbol}</p>
                        <p className="text-xs text-slate-400">{stock.name}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(symbol);
                        }}
                        className="text-slate-400 hover:text-cyan-400"
                      >
                        {watchlist.includes(symbol) ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-sm font-bold text-cyan-400">${stock.price}</span>
                      <span className={`text-xs font-bold ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PORTFOLIO */}
        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Holdings</h2>
              {Object.keys(portfolio).length === 0 ? (
                <p className="text-slate-400">No holdings</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(portfolio).map(([sym, qty]) => {
                    const stock = stocks[sym];
                    const value = stock.price * qty;
                    return (
                      <div key={sym} className="bg-slate-700/30 p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <div>
                            <p className="font-bold">{sym}</p>
                            <p className="text-sm text-slate-400">{qty} shares</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-cyan-400">${value.toFixed(0)}</p>
                            <p className={`text-sm ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSellStock(sym);
                            setSellQuantity(1);
                            setShowSellModal(true);
                          }}
                          className="text-red-400 hover:text-red-300 text-sm font-bold"
                        >
                          Jual
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-xl p-4">
                <p className="text-xs text-slate-400">Total Value</p>
                <p className="text-2xl font-bold text-cyan-400">${(calculatePortfolioValue() + balance).toFixed(0)}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <p className="text-xs text-slate-400">Holdings</p>
                <p className="text-xl font-bold">${calculatePortfolioValue().toFixed(0)}</p>
              </div>
              <div className={`${calculateTotalGain() >= 0 ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'} border rounded-xl p-4`}>
                <p className="text-xs text-slate-400">Gain/Loss</p>
                <p className={`text-xl font-bold ${calculateTotalGain() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {calculateTotalGain() >= 0 ? '+' : ''}{calculateTotalGain().toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Trophy size={28} className="text-yellow-400" /> Leaderboard
            </h2>
            <table className="w-full text-sm">
              <thead className="border-b-2 border-slate-700">
                <tr>
                  <th className="text-left py-3 px-3">Rank</th>
                  <th className="text-left py-3 px-3">Username</th>
                  <th className="text-left py-3 px-3">Email</th>
                  <th className="text-right py-3 px-3">Value</th>
                  <th className="text-right py-3 px-3">Gain</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user, idx) => (
                  <tr
                    key={user.email}
                    className={`border-b border-slate-700/30 ${
                      user.email === currentUser?.email ? 'bg-cyan-500/20 font-bold' : 'hover:bg-slate-700/20'
                    }`}
                  >
                    <td className="py-3 px-3">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </td>
                    <td className="py-3 px-3">{user.username}</td>
                    <td className="py-3 px-3 text-xs text-slate-400">{user.email}</td>
                    <td className="text-right py-3 px-3 font-bold">${user.totalValue.toFixed(0)}</td>
                    <td className={`text-right py-3 px-3 font-bold ${user.gain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {user.gain >= 0 ? '+' : ''}{user.gain.toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 overflow-x-auto">
            <h2 className="text-xl font-bold mb-4">Order History</h2>
            {orderHistory.length === 0 ? (
              <p className="text-slate-400">No orders</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b border-slate-700">
                  <tr>
                    <th className="text-left py-2 px-2">Symbol</th>
                    <th className="text-left py-2 px-2">Type</th>
                    <th className="text-right py-2 px-2">Qty</th>
                    <th className="text-right py-2 px-2">Price</th>
                    <th className="text-right py-2 px-2">Total</th>
                    <th className="text-left py-2 px-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {orderHistory.map(o => (
                    <tr key={o.id} className="border-b border-slate-700/30">
                      <td className="py-2 px-2 font-bold">{o.symbol}</td>
                      <td className="py-2 px-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          o.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>{o.type}</span>
                      </td>
                      <td className="text-right py-2 px-2">{o.quantity}</td>
                      <td className="text-right py-2 px-2">${o.price}</td>
                      <td className="text-right py-2 px-2 font-bold">${o.total.toFixed(0)}</td>
                      <td className="text-left py-2 px-2 text-xs text-slate-400">{o.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>

      {/* PROFILE MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-sm w-full p-6">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <User size={28} className="text-cyan-400" /> User Profile
            </h3>

            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-400 text-sm mb-1">Username</p>
                <p className="text-2xl font-bold text-cyan-400">{currentUser?.username}</p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-400 text-sm mb-1">Email</p>
                <p className="text-lg font-bold">{currentUser?.email}</p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-400 text-sm mb-1">Member Since</p>
                <p className="text-lg font-bold">{currentUser?.joinDate}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-cyan-500/20 border border-cyan-500/30 p-4 rounded-lg">
                  <p className="text-xs text-slate-400">Rank</p>
                  <p className="text-2xl font-bold text-cyan-400">#{userRank}</p>
                </div>
                <div className="bg-purple-500/20 border border-purple-500/30 p-4 rounded-lg">
                  <p className="text-xs text-slate-400">Total Gain</p>
                  <p className={`text-2xl font-bold ${calculateTotalGain() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {calculateTotalGain() >= 0 ? '+' : ''}{calculateTotalGain().toFixed(0)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowProfileModal(false)}
                className="w-full bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BUY MODAL */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-sm w-full p-6">
            <h3 className="text-xl font-bold mb-4">Buy {selectedStock}</h3>
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-xs mb-1">Price</p>
                <p className="text-3xl font-bold text-cyan-400">${selectedStockData?.price}</p>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2">Quantity</label>
                <div className="flex gap-2">
                  <button onClick={() => setBuyQuantity(Math.max(1, buyQuantity - 1))} className="bg-slate-700 p-2 rounded">
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={buyQuantity}
                    onChange={(e) => setBuyQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-center text-white font-bold"
                  />
                  <button onClick={() => setBuyQuantity(buyQuantity + 1)} className="bg-slate-700 p-2 rounded">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="bg-slate-800/50 p-3 rounded-lg">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="font-bold text-cyan-400">${(selectedStockData?.price * buyQuantity).toFixed(0)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setShowBuyModal(false)} className="flex-1 bg-slate-700 py-2 rounded">Cancel</button>
                <button onClick={handleBuyStock} className="flex-1 bg-green-500 text-white py-2 rounded font-bold">Buy</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SELL MODAL */}
      {showSellModal && sellStock && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-sm w-full p-6">
            <h3 className="text-xl font-bold mb-4">Sell {sellStock}</h3>
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-xs mb-1">Price</p>
                <p className="text-3xl font-bold text-red-400">${stocks[sellStock]?.price}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-2">Available: {portfolio[sellStock]} shares</p>
                <label className="block text-xs text-slate-400 mb-2">Qty Sell</label>
                <div className="flex gap-2">
                  <button onClick={() => setSellQuantity(Math.max(1, sellQuantity - 1))} className="bg-slate-700 p-2 rounded">
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={sellQuantity}
                    onChange={(e) => setSellQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-center text-white font-bold"
                  />
                  <button onClick={() => setSellQuantity(Math.min(portfolio[sellStock], sellQuantity + 1))} className="bg-slate-700 p-2 rounded">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="bg-slate-800/50 p-3 rounded-lg">
                <div className="flex justify-between">
                  <span>Will Receive</span>
                  <span className="font-bold text-green-400">${(stocks[sellStock]?.price * sellQuantity).toFixed(0)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowSellModal(false);
                    setSellStock(null);
                    setSellQuantity(1);
                  }}
                  className="flex-1 bg-slate-700 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSellStock}
                  className="flex-1 bg-red-500 text-white py-2 rounded font-bold"
                >
                  Sell
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
