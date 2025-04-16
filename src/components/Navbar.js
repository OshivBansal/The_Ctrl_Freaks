import fullLogo from '../metamarket.jpeg';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';

function Navbar() {
  const [connected, setConnected] = useState(false);
  const [currAddress, setCurrAddress] = useState('0x');
  const location = useLocation();

  const updateButton = () => {
    const ethereumButton = document.querySelector('.enableEthereumButton');
    if (ethereumButton) {
      ethereumButton.textContent = 'Connected';
      ethereumButton.classList.remove('bg-blue-500', 'hover:bg-blue-700');
      ethereumButton.classList.add('bg-green-500', 'hover:bg-green-700');
    }
  };

  const connectWebsite = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to connect.');
      return;
    }

    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0xaa36a7') {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setConnected(true);
        setCurrAddress(accounts[0]);
        updateButton();
      }
    } catch (error) {
      alert('Connection request was rejected or failed.');
    }
  };

  const checkConnection = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setConnected(true);
        setCurrAddress(accounts[0]);
        updateButton();
      } else {
        setConnected(false);
        setCurrAddress('0x');
      }
    } catch (err) {
      console.error('Failed to check wallet connection', err);
    }
  }, []);

  useEffect(() => {
    checkConnection();

    const handleAccountsChanged = () => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [location.pathname, checkConnection]);

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between h-20 px-6">
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2">
            <img src={fullLogo} alt="Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold">MetaMarket</span>
          </Link>
        </div>

        <div className="hidden md:flex space-x-8 text-lg font-medium">
          <Link
            to="/"
            className={location.pathname === '/' ? 'border-b-2 border-white' : 'hover:text-gray-300'}
          >
            Marketplace
          </Link>
          <Link
            to="/sellNFT"
            className={location.pathname === '/sellNFT' ? 'border-b-2 border-white' : 'hover:text-gray-300'}
          >
            List My NFT
          </Link>
          <Link
            to="/profile"
            className={location.pathname === '/profile' ? 'border-b-2 border-white' : 'hover:text-gray-300'}
          >
            Profile
          </Link>
        </div>

        <div className="flex flex-col items-end space-y-1">
          <button
            className={`enableEthereumButton ${
              connected ? 'bg-green-500 hover:bg-green-700' : 'bg-blue-500 hover:bg-blue-700'
            } text-white font-bold py-2 px-4 rounded text-sm`}
            onClick={connectWebsite}
          >
            {connected ? 'Connected' : 'Connect Wallet'}
          </button>
          {connected && (
            <p className="text-xs text-gray-400">
              Connected: {currAddress.slice(0, 6)}...{currAddress.slice(-4)}
            </p>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
