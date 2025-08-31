import { useState } from 'react'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [showPinEntry, setShowPinEntry] = useState(true)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [pinLoading, setPinLoading] = useState(false)
  const [transferTab, setTransferTab] = useState('domestic')
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [tradingCategory, setTradingCategory] = useState('all')
  const [activityFilter, setActivityFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [ibanInput, setIbanInput] = useState('')
  const [detectedBank, setDetectedBank] = useState(null)
  const [bicInput, setBicInput] = useState('')

  // Danish transactions with 48 entries
  const transactions = [
    { id: 17, merchant: 'Ines Ehlerts', amount: -9700.00, date: '2025-08-30', category: 'Transfer', type: 'transfer' },
    { id: 1, merchant: 'Lidl', amount: -213.30, date: '2025-08-30', category: 'Shopping', type: 'card' },
    { id: 2, merchant: 'Netto', amount: -100.59, date: '2025-08-29', category: 'Shopping', type: 'card' },
    { id: 3, merchant: 'Spar', amount: -100.80, date: '2025-08-29', category: 'Shopping', type: 'card' },
    { id: 4, merchant: 'Min Kobmand', amount: -54.90, date: '2025-08-28', category: 'Shopping', type: 'card' },
    { id: 5, merchant: 'Netto', amount: -116.00, date: '2025-08-28', category: 'Shopping', type: 'card' },
    { id: 6, merchant: 'REMA 1000', amount: -315.20, date: '2025-08-27', category: 'Shopping', type: 'card' },
    { id: 7, merchant: 'REMA 1000', amount: -99.90, date: '2025-08-27', category: 'Shopping', type: 'card' },
    { id: 8, merchant: 'Lidl', amount: -223.55, date: '2025-08-26', category: 'Shopping', type: 'card' },
    { id: 9, merchant: 'OK Benzin', amount: -450.00, date: '2025-08-26', category: 'Transport', type: 'card' },
    { id: 10, merchant: 'Circle K', amount: -380.50, date: '2025-08-25', category: 'Transport', type: 'card' },
    { id: 11, merchant: 'McDonald\'s', amount: -78.50, date: '2025-08-25', category: 'Food', type: 'card' },
    { id: 12, merchant: 'Fleggaard', amount: -189.75, date: '2025-08-24', category: 'Shopping', type: 'card' },
    { id: 13, merchant: 'Edeka', amount: -156.40, date: '2025-08-24', category: 'Shopping', type: 'card' },
    { id: 14, merchant: 'Føtex', amount: -755.60, date: '2025-08-18', category: 'Groceries', type: 'card' },
    { id: 15, merchant: 'Carbis', amount: +35000.00, date: '2025-08-02', category: 'Income', type: 'salary' },
    { id: 16, merchant: 'Pensionskasse', amount: +1250.00, date: '2025-08-01', category: 'Income', type: 'pension' },
  ]

  // Account transactions for different accounts
  const accountTransactions = {
    'main': transactions.slice(0, 15),
    'savings': [
      { id: 101, merchant: 'Nordea Bank', amount: +500.00, date: '2025-01-10', category: 'Transfer', type: 'transfer' },
      { id: 102, merchant: 'Rente', amount: +45.50, date: '2025-01-01', category: 'Income', type: 'interest' },
      { id: 103, merchant: 'Nordea Bank', amount: -1000.00, date: '2024-12-15', category: 'Transfer', type: 'transfer' }
    ],
    'business': [
      { id: 201, merchant: 'Kunde Betaling', amount: +15000.00, date: '2025-01-12', category: 'Income', type: 'payment' },
      { id: 202, merchant: 'Elgiganten', amount: -3499.00, date: '2025-01-10', category: 'Business', type: 'card' },
      { id: 203, merchant: 'SKAT', amount: -8500.00, date: '2025-01-05', category: 'Tax', type: 'bill' },
      { id: 204, merchant: 'Regnskabsfører', amount: -2500.00, date: '2025-01-03', category: 'Professional', type: 'bill' }
    ]
  }

  const accounts = [
    { id: 'main', name: 'NemAccount', type: 'checking', balance: 6960.90, icon: '💳' }
  ]

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction)
    setShowTransactionModal(true)
  }

  const generateTransactionDetails = (transaction) => {
    const transactionId = `TXN-2025-${String(transaction.id).padStart(3, '0')}-${Math.floor(Math.random() * 9000) + 1000}`
    const authCode = `AUTH${Math.floor(Math.random() * 900000) + 100000}`
    const receiptNumber = `RCP${Math.floor(Math.random() * 90000) + 10000}`
    const merchantId = `MID${Math.floor(Math.random() * 900000) + 100000}`
    
    const locations = [
      'København K', 'Aarhus C', 'Odense C', 'Aalborg', 'Esbjerg', 'Randers', 'Kolding', 'Horsens',
      'Vejle', 'Roskilde', 'Herning', 'Silkeborg', 'Næstved', 'Fredericia', 'Viborg', 'Køge'
    ]
    
    const location = locations[Math.floor(Math.random() * locations.length)]
    
    return {
      transactionId,
      authCode,
      receiptNumber,
      merchantId,
      location,
      orderNumber: transaction.category === 'Food' ? `ORD${Math.floor(Math.random() * 90000) + 10000}` : null,
      cardLast4: '4532',
      processingTime: '2-3 business days',
      exchangeRate: transaction.amount > 1000 ? '1 EUR = 7.45 DKK' : null
    }
  }

  const handlePinInput = (digit) => {
    if (pin.length < 6) {
      const newPin = pin + digit
      setPin(newPin)
      
      if (newPin.length === 6) {
        setPinLoading(true)
        setTimeout(() => {
          if (newPin === '132313') {
            setShowPinEntry(false)
            setPinLoading(false)
          } else {
            setPinError(true)
            setPin('')
            setPinLoading(false)
            setTimeout(() => setPinError(false), 2000)
          }
        }, 1500)
      }
    }
  }

  const handlePinDelete = () => {
    setPin(pin.slice(0, -1))
  }

  const handleIbanChange = (value) => {
    setIbanInput(value)
    
    // Detect bank from IBAN
    const ibanCode = value.replace(/\s/g, '').toUpperCase()
    if (ibanCode.length >= 6) {
      const bankCode = ibanCode.substring(4, 8)
      
      const danishBanks = {
        '3000': { name: 'Danske Bank', bic: 'DABADKKK' },
        '2000': { name: 'Nordea Bank', bic: 'NDEADKKK' },
        '5301': { name: 'Jyske Bank', bic: 'JYBADKKK' },
        '7730': { name: 'Nykredit Bank', bic: 'NYKBDKKK' },
        '5479': { name: 'Arbejdernes Landsbank', bic: 'ALBADKKK' },
        '9570': { name: 'Spar Nord Bank', bic: 'SPNODK22' }
      }
      
      const internationalBanks = {
        'DEUT': { name: 'Deutsche Bank', bic: 'DEUTDEFF', country: 'Germany' },
        'HAND': { name: 'Handelsbanken', bic: 'HANDSESS', country: 'Sweden' },
        'DNBA': { name: 'DNB Bank', bic: 'DNBANOKKXXX', country: 'Norway' },
        'BARC': { name: 'Barclays Bank', bic: 'BARCGB22', country: 'United Kingdom' }
      }
      
      let detectedBank = null
      
      if (ibanCode.startsWith('DK')) {
        detectedBank = danishBanks[bankCode]
      } else {
        const bankPrefix = ibanCode.substring(4, 8)
        detectedBank = internationalBanks[bankPrefix] || 
                      Object.values(internationalBanks).find(bank => 
                        bank.bic.includes(bankPrefix)
                      )
      }
      
      if (detectedBank) {
        setDetectedBank(detectedBank)
        setBicInput(detectedBank.bic)
      } else {
        setDetectedBank(null)
        setBicInput('')
      }
    } else {
      setDetectedBank(null)
      setBicInput('')
    }
  }

  if (showPinEntry) {
    return (
      <div className="pin-entry-container">
        <div className="pin-entry-content">
          <div className="app-logo">
            <div className="logo-icon">R</div>
            <h1 className="app-name">Revolut</h1>
          </div>
          
          <div className="pin-section">
            <h2 className="pin-title">Enter your PIN</h2>
            <p className="pin-subtitle">Use your 6-digit PIN to access your account</p>
            
            <div className="pin-display">
              {[0, 1, 2, 3, 4, 5].map(index => (
                <div 
                  key={index} 
                  className={`pin-dot ${pin.length > index ? 'filled' : ''} ${pinError ? 'error' : ''}`}
                />
              ))}
            </div>
            
            {pinError && (
              <div className="pin-error">
                <span>⚠️</span>
                <span>Incorrect PIN. Try again.</span>
              </div>
            )}
            
            {pinLoading && (
              <div className="pin-loading">
                <span>🔄</span>
                <span>Verifying...</span>
              </div>
            )}
          </div>
          
          <div className="pin-keypad">
            <div className="keypad-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map((key, index) => (
                <button
                  key={index}
                  className={`keypad-btn ${key === '' ? 'empty' : ''} ${key === '⌫' ? 'delete' : ''}`}
                  onClick={() => {
                    if (key === '⌫') {
                      handlePinDelete()
                    } else if (key !== '') {
                      handlePinInput(key.toString())
                    }
                  }}
                  disabled={pinLoading || key === ''}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
          
          <div className="pin-footer">
            <button className="forgot-pin-btn">Forgot PIN?</button>
          </div>
        </div>
      </div>
    )
  }

  const renderTransactionItem = (transaction, isDetailed = false) => (
    <div 
      key={transaction.id} 
      className={`transaction-item ${isDetailed ? 'detailed' : ''}`}
      onClick={() => handleTransactionClick(transaction)}
    >
      <div className="transaction-icon" style={{
        background: `hsl(${transaction.merchant.charCodeAt(0) * 137.5 % 360}, 70%, 50%)`
      }}>
        <span className="letter-icon">{transaction.merchant.charAt(0).toUpperCase()}</span>
      </div>
      <div className="transaction-info">
        <h4>{transaction.merchant}</h4>
        <p>{transaction.date}</p>
        {isDetailed && <span className="transaction-category">{transaction.category}</span>}
      </div>
      <div className={`transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}`}>
        {transaction.amount > 0 ? '+' : ''}kr {Math.abs(transaction.amount).toFixed(2)}
      </div>
    </div>
  )

  const renderHome = () => (
    <>
      <div className="header">
        <div className="header-top">
          <div className="profile-avatar">
            <div className="avatar-letter">R</div>
          </div>
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-send-btn" disabled={!searchQuery.trim()}>
              →
            </button>
          </div>
        </div>
        
        <div className="balance-section">
          <div className="total-balance">kr 6.960.90</div>
          <div className="balance-change positive">
            <span>↗</span>
            <span className="change-amount">+kr 10,456.78</span>
            <span className="change-percentage">(-59.95%)</span>
            <span className="change-period">today</span>
          </div>
        </div>
        
        <div className="action-buttons">
          <button className="action-btn deposit" onClick={() => { setModalType('deposit'); setShowModal(true) }}>
            <span className="btn-icon">+</span>
            <span>Deposit</span>
          </button>
          <button className="action-btn withdraw" onClick={() => { setModalType('withdraw'); setShowModal(true) }}>
            <span className="btn-icon">-</span>
            <span>Withdraw</span>
          </button>
          <button className="action-btn transfer" onClick={() => { setModalType('transfer'); setShowModal(true) }}>
            <span className="btn-icon">→</span>
            <span>Transfer</span>
          </button>
        </div>
      </div>
      
      <div className="quick-actions">
        <div className="section-header-row">
          <h3 className="section-header">Quick Actions</h3>
          <button className="see-all-btn">See all</button>
        </div>
        <div className="quick-actions-grid">
          <button className="quick-action-btn" onClick={() => { setModalType('mobilepay'); setShowModal(true) }}>
            <div className="quick-action-icon" style={{background: 'linear-gradient(135deg, #0077FF 0%, #00A8FF 100%)'}}>📱</div>
            <span>MobilePay</span>
          </button>
          <button className="quick-action-btn" onClick={() => { setModalType('betalingsservice'); setShowModal(true) }}>
            <div className="quick-action-icon" style={{background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'}}>🏦</div>
            <span>Betalingsservice</span>
          </button>
          <button className="quick-action-btn" onClick={() => { setModalType('accountlink'); setShowModal(true) }}>
            <div className="quick-action-icon" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>🔗</div>
            <span>Link Account</span>
          </button>
          <button className="quick-action-btn">
            <div className="quick-action-icon" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>💎</div>
            <span>Invest</span>
          </button>
        </div>
      </div>
      
      <div className="accounts-section">
        <div className="section-header-row">
          <h3 className="section-header">Accounts</h3>
          <button className="see-all-btn">See all</button>
        </div>
        <div className="accounts-list">
          {accounts.map(account => (
            <div key={account.id} className="account-card" onClick={() => { setSelectedAccount(account); setCurrentView('account') }}>
              <div className="account-icon" style={{
                background: `hsl(${account.name.charCodeAt(0) * 137.5 % 360}, 70%, 50%)`
              }}>
                <span className="letter-icon">{account.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="account-info">
                <h4>{account.name}</h4>
                <p>{account.type}</p>
              </div>
              <div className="account-balance">kr {account.balance.toLocaleString('da-DK', { minimumFractionDigits: 2 })}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="transactions-section">
        <div className="section-header-row">
          <h3 className="section-header">Recent Transactions</h3>
          <button className="see-all-btn" onClick={() => setCurrentView('activity')}>See all</button>
        </div>
        <div className="transactions-list">
          {transactions.slice(0, 8).map(transaction => renderTransactionItem(transaction))}
          <div className="no-more-info">
            No more Information visible
          </div>
        </div>
      </div>
    </>
  )

  const renderAccount = () => (
    <>
      <div className="header">
        <div className="header-top">
          <button className="back-btn" onClick={() => setCurrentView('home')}>←</button>
          <h2 style={{color: 'white', fontSize: '20px', fontWeight: '600'}}>{selectedAccount?.name}</h2>
          <button className="more-btn">⋯</button>
        </div>
        
        <div className="balance-section">
          <div className="total-balance">kr {selectedAccount?.balance.toLocaleString('da-DK', { minimumFractionDigits: 2 })}</div>
          <div className="balance-change positive">
            <span>↗</span>
            <span className="change-amount">+kr 1,234.56</span>
            <span className="change-percentage">(+1.2%)</span>
            <span className="change-period">this month</span>
          </div>
        </div>
        
        <div className="action-buttons">
          <button className="action-btn deposit" onClick={() => { setModalType('deposit'); setShowModal(true) }}>
            <span className="btn-icon">+</span>
            <span>Deposit</span>
          </button>
          <button className="action-btn withdraw" onClick={() => { setModalType('withdraw'); setShowModal(true) }}>
            <span className="btn-icon">-</span>
            <span>Withdraw</span>
          </button>
          <button className="action-btn transfer" onClick={() => { setModalType('transfer'); setShowModal(true) }}>
            <span className="btn-icon">→</span>
            <span>Transfer</span>
          </button>
        </div>
      </div>
      
      <div className="transaction-flow">
        <div className="section-header">Money Flow</div>
        <div className="flow-summary">
          <div className="flow-card incoming">
            <div className="flow-header">
              <span className="flow-icon">↓</span>
              <h4>Money In</h4>
            </div>
            <div className="flow-amount positive">+kr 12,450</div>
            <p>This month</p>
          </div>
          <div className="flow-card outgoing">
            <div className="flow-header">
              <span className="flow-icon">↑</span>
              <h4>Money Out</h4>
            </div>
            <div className="flow-amount negative">-kr 8,765</div>
            <p>This month</p>
          </div>
        </div>
      </div>
      
      <div className="card-transactions">
        <div className="section-header">Transactions</div>
        <div className="transactions-list">
          {(accountTransactions[selectedAccount?.id] || []).map(transaction => renderTransactionItem(transaction, true))}
        </div>
      </div>
    </>
  )

  const renderCards = () => (
    <>
      <div className="cards-header">
        <div className="header-top">
          <h2 className="section-title">Cards</h2>
          <button className="add-card-btn">+</button>
        </div>
      </div>
      
      <div className="cards-container">
        <div className="bank-card primary">
          <div className="card-header">
            <span className="card-type">Debit Card</span>
            <span className="card-network">Mastercard</span>
          </div>
          <div className="card-number">•••• •••• •••• 4532</div>
          <div className="card-footer">
            <div className="card-holder">
              <span className="label">Card Holder</span>
              <span className="name">Gösta Sievers</span>
            </div>
            <div className="card-expiry">
              <span className="label">Expires</span>
              <span className="date">12/28</span>
            </div>
          </div>
        </div>
        
        <div className="bank-card secondary">
          <div className="card-header">
            <span className="card-type">Credit Card</span>
            <span className="card-network">Visa</span>
          </div>
          <div className="card-number">•••• •••• •••• 8901</div>
          <div className="card-footer">
            <div className="card-holder">
              <span className="label">Card Holder</span>
              <span className="name">Gösta Sievers</span>
            </div>
            <div className="card-expiry">
              <span className="label">Expires</span>
              <span className="date">09/27</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card-actions">
        <button className="card-action-btn">
          <span className="action-icon">🔒</span>
          <span>Freeze</span>
        </button>
        <button className="card-action-btn">
          <span className="action-icon">⚙️</span>
          <span>Settings</span>
        </button>
        <button className="card-action-btn">
          <span className="action-icon">📊</span>
          <span>Limits</span>
        </button>
      </div>
      
      <div className="card-transactions">
        <div className="section-header">Recent Card Transactions</div>
        <div className="transactions-list">
          {transactions.filter(t => t.type === 'card').slice(0, 10).map(transaction => renderTransactionItem(transaction, true))}
        </div>
      </div>
    </>
  )

  const renderTrading = () => (
    <>
      <div className="trading-categories">
        <div className="section-header">Trading</div>
        <div className="category-tabs">
          {['all', 'crypto', 'stocks', 'commodities', 'forex'].map(category => (
            <button
              key={category}
              className={`category-tab ${tradingCategory === category ? 'active' : ''}`}
              onClick={() => setTradingCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="trading-section">
        <div className="assets-list">
          {[
            { name: 'Bitcoin', symbol: 'BTC', price: 'kr 685,432', change: '+2.45%', positive: true, type: 'crypto' },
            { name: 'Ethereum', symbol: 'ETH', price: 'kr 24,567', change: '+1.23%', positive: true, type: 'crypto' },
            { name: 'Novo Nordisk', symbol: 'NOVO-B', price: 'kr 892.50', change: '-0.85%', positive: false, type: 'stocks' },
            { name: 'Maersk', symbol: 'MAERSK-B', price: 'kr 12,450', change: '+1.67%', positive: true, type: 'stocks' },
            { name: 'Carlsberg', symbol: 'CARL-B', price: 'kr 1,234', change: '+0.45%', positive: true, type: 'stocks' },
            { name: 'Ørsted', symbol: 'ORSTED', price: 'kr 567.80', change: '-1.23%', positive: false, type: 'stocks' }
          ].filter(asset => tradingCategory === 'all' || asset.type === tradingCategory).map((asset, index) => (
            <div key={index} className="asset-item">
              <div className={`asset-icon ${asset.type}`}>
                <span className="letter-icon">{asset.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="asset-info">
                <h4>{asset.name}</h4>
                <p>{asset.symbol}</p>
              </div>
              <div className="asset-price">
                <div className="price">{asset.price}</div>
                <div className={`price-change ${asset.positive ? 'positive' : 'negative'}`}>
                  {asset.change}
                </div>
              </div>
              <button className="trade-btn">Trade</button>
            </div>
          ))}
        </div>
      </div>
    </>
  )

  const renderActivity = () => (
    <>
      <div className="activity-header">
        <div className="header-top">
          <h2 className="section-title">Activity</h2>
          <button className="filter-btn">⚙️</button>
        </div>
      </div>
      
      <div className="activity-filters">
        {['all', 'income', 'expenses', 'transfers'].map(filter => (
          <button
            key={filter}
            className={`filter-tab ${activityFilter === filter ? 'active' : ''}`}
            onClick={() => setActivityFilter(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="activity-summary">
        <div className="summary-card">
          <h4>Total Income</h4>
          <div className="summary-amount positive">+kr 38,750</div>
          <p>This month</p>
        </div>
        <div className="summary-card">
          <h4>Total Expenses</h4>
          <div className="summary-amount negative">-kr 15,234</div>
          <p>This month</p>
        </div>
      </div>
      
      <div className="transactions-section">
        <div className="transactions-list">
          {transactions
            .filter(transaction => {
              if (activityFilter === 'all') return true
              if (activityFilter === 'income') return transaction.amount > 0
              if (activityFilter === 'expenses') return transaction.amount < 0
              if (activityFilter === 'transfers') return transaction.category === 'Transfer'
              return true
            })
            .map(transaction => renderTransactionItem(transaction, true))}
          <div className="no-more-info">
            No more Information visible
          </div>
        </div>
      </div>
    </>
  )

  const renderModal = () => {
    if (!showModal) return null

    return (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>
              {modalType === 'deposit' && 'Deposit Money'}
              {modalType === 'withdraw' && 'Withdraw Money'}
              {modalType === 'transfer' && 'Transfer Money'}
              {modalType === 'mobilepay' && 'Connect MobilePay'}
              {modalType === 'betalingsservice' && 'Betalingsservice'}
              {modalType === 'accountlink' && 'Link Account'}
            </h2>
            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
          </div>
          <div className="modal-content">
            {modalType === 'mobilepay' && (
              <>
                <div className="mobilepay-icon">📱</div>
                <h3>Connect MobilePay</h3>
                <p className="connection-message">
                  Connect your MobilePay account to send and receive money instantly with just a phone number.
                </p>
                <div className="modal-actions">
                  <button className="modal-btn primary">Connect MobilePay</button>
                  <button className="modal-btn secondary" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </>
            )}
            
            {modalType === 'betalingsservice' && (
              <>
                <div className="betalingsservice-icon">🏦</div>
                <h3>Betalingsservice</h3>
                <p className="connection-message">
                  Manage your automatic bill payments and subscriptions.
                </p>
                <div className="betalingsservice-list">
                  <div className="payment-item">
                    <div className="payment-info">
                      <h4>TDC NET</h4>
                      <p>Monthly internet bill</p>
                    </div>
                    <div className="payment-amount">kr 299.00</div>
                  </div>
                  <div className="payment-item">
                    <div className="payment-info">
                      <h4>Ørsted</h4>
                      <p>Electricity bill</p>
                    </div>
                    <div className="payment-amount">kr 1,245.50</div>
                  </div>
                  <div className="payment-item">
                    <div className="payment-info">
                      <h4>Netflix</h4>
                      <p>Monthly subscription</p>
                    </div>
                    <div className="payment-amount">kr 79.00</div>
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="modal-btn primary">Manage Payments</button>
                  <button className="modal-btn secondary" onClick={() => setShowModal(false)}>Close</button>
                </div>
              </>
            )}
            
            {modalType === 'accountlink' && (
              <>
                <div className="account-link-icon">🔗</div>
                <h3>Link External Account</h3>
                <p className="account-link-message">
                  Connect accounts from other banks to view all your finances in one place.
                </p>
                <div className="account-link-options">
                  <div className="link-option">
                    <div className="link-icon" style={{background: 'linear-gradient(135deg, #003755 0%, #0066CC 100%)'}}>
                      <span className="letter-icon">D</span>
                    </div>
                    <div className="link-info">
                      <h4>Danske Bank</h4>
                      <p>Connect via MitID</p>
                    </div>
                  </div>
                  <div className="link-option">
                    <div className="link-icon" style={{background: 'linear-gradient(135deg, #0066CC 0%, #004499 100%)'}}>
                      <span className="letter-icon">N</span>
                    </div>
                    <div className="link-info">
                      <h4>Nordea</h4>
                      <p>Connect via MitID</p>
                    </div>
                  </div>
                  <div className="link-option">
                    <div className="link-icon" style={{background: 'linear-gradient(135deg, #E31837 0%, #B71C1C 100%)'}}>
                      <span className="letter-icon">J</span>
                    </div>
                    <div className="link-info">
                      <h4>Jyske Bank</h4>
                      <p>Connect via MitID</p>
                    </div>
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="modal-btn primary">Connect with MitID</button>
                  <button className="modal-btn secondary" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </>
            )}
            
            {modalType === 'transfer' && (
              <>
                <div className="transfer-icon">💸</div>
                <h3>Transfer Money</h3>
                
                <div className="transfer-tabs">
                  <button 
                    className={`transfer-tab ${transferTab === 'domestic' ? 'active' : ''}`}
                    onClick={() => setTransferTab('domestic')}
                  >
                    Domestic
                  </button>
                  <button 
                    className={`transfer-tab ${transferTab === 'international' ? 'active' : ''}`}
                    onClick={() => setTransferTab('international')}
                  >
                    International
                  </button>
                </div>
                
                {transferTab === 'domestic' ? (
                  <>
                    <div className="input-group">
                      <label>Account Number</label>
                      <input type="text" placeholder="1234 5678901234" />
                    </div>
                    <div className="input-group">
                      <label>Registration Number</label>
                      <input type="text" placeholder="1234" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="input-group">
                      <label>IBAN</label>
                      <input 
                        type="text" 
                        placeholder="DK50 3000 0000 0012 3456"
                        value={ibanInput}
                        onChange={(e) => handleIbanChange(e.target.value)}
                      />
                      {detectedBank && (
                        <div className="bank-detection">
                          <div className="bank-info">
                            <span className="bank-icon">🏦</span>
                            <div className="bank-details">
                              <h4>{detectedBank.name}</h4>
                              <p>{detectedBank.country ? `${detectedBank.country}` : 'Denmark'}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="input-group">
                      <label>BIC/SWIFT Code</label>
                      <input 
                        type="text" 
                        placeholder="DABADKKK"
                        value={bicInput}
                        onChange={(e) => setBicInput(e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label>Recipient Address</label>
                      <input type="text" placeholder="Street, City, Country" />
                    </div>
                  </>
                )}
                
                <div className="input-group">
                  <label>Amount</label>
                  <input type="number" placeholder="0.00" />
                </div>
                <div className="input-group">
                  <label>Reference/Purpose</label>
                  <input type="text" placeholder={transferTab === 'international' ? 'Purpose of transfer (required)' : 'Optional reference'} />
                </div>
                
                {transferTab === 'international' && (
                  <div className="transfer-options">
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      <span>Urgent transfer (same day) - kr 25.00 extra</span>
                    </label>
                  </div>
                )}
                
                <div className="transfer-fees">
                  <div className="fee-item">
                    <span>Transfer amount</span>
                    <span>kr 0.00</span>
                  </div>
                  <div className="fee-item">
                    <span>Transfer fee</span>
                    <span>{transferTab === 'international' ? 'kr 45.00' : 'kr 0.00'}</span>
                  </div>
                  {transferTab === 'international' && (
                    <div className="fee-item">
                      <span>Exchange rate fee</span>
                      <span>kr 15.00</span>
                    </div>
                  )}
                  <div className="fee-item total">
                    <span>Total</span>
                    <span>{transferTab === 'international' ? 'kr 60.00' : 'kr 0.00'}</span>
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button className="modal-btn primary">Send Transfer</button>
                  <button className="modal-btn secondary" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </>
            )}
            
            {(modalType === 'deposit' || modalType === 'withdraw') && (
              <>
                <div className="mitid-icon">🆔</div>
                <h3>{modalType === 'deposit' ? 'Deposit Money' : 'Withdraw Money'}</h3>
                <div className="mitid-loading">
                  <div className="loading-spinner">🔄</div>
                  <p className="mitid-message">
                    Connecting to MitID for secure {modalType}...
                  </p>
                </div>
                <div className="modal-actions">
                  <button className="modal-btn secondary" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderTransactionModal = () => {
    if (!showTransactionModal || !selectedTransaction) return null

    const details = generateTransactionDetails(selectedTransaction)

    return (
      <div className="modal-overlay" onClick={() => setShowTransactionModal(false)}>
        <div className="modal transaction-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Transaction Details</h2>
            <button className="close-btn" onClick={() => setShowTransactionModal(false)}>×</button>
          </div>
          
          <div className="transaction-details">
            <div className="transaction-header">
              <div className="transaction-icon large" style={{
                background: `hsl(${selectedTransaction.merchant.charCodeAt(0) * 137.5 % 360}, 70%, 50%)`
              }}>
                <span className="letter-icon">{selectedTransaction.merchant.charAt(0).toUpperCase()}</span>
              </div>
              <h3>{selectedTransaction.merchant}</h3>
              <div className={`transaction-amount large ${selectedTransaction.amount > 0 ? 'positive' : 'negative'}`}>
                {selectedTransaction.amount > 0 ? '+' : ''}kr {Math.abs(selectedTransaction.amount).toFixed(2)}
              </div>
              <div className="transaction-date">{selectedTransaction.date} at {Math.floor(Math.random() * 24)}:{String(Math.floor(Math.random() * 60)).padStart(2, '0')}</div>
            </div>
            
            <div className="transaction-info-grid">
              <div className="info-section">
                <h4>Transaction Information</h4>
                <div className="info-row">
                  <span className="info-label">Transaction ID</span>
                  <span className="info-value">{details.transactionId}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Status</span>
                  <span className="info-value status-completed">✓ Completed</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Category</span>
                  <span className="info-value">{selectedTransaction.category}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Receipt Number</span>
                  <span className="info-value">{details.receiptNumber}</span>
                </div>
              </div>
              
              {selectedTransaction.category !== 'Transfer' && selectedTransaction.category !== 'Income' && (
                <div className="info-section">
                  <h4>Merchant Information</h4>
                  <div className="info-row">
                    <span className="info-label">Merchant ID</span>
                    <span className="info-value">{details.merchantId}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Location</span>
                    <span className="info-value">{details.location}, Denmark</span>
                  </div>
                  {details.orderNumber && (
                    <div className="info-row">
                      <span className="info-label">Order Number</span>
                      <span className="info-value">{details.orderNumber}</span>
                    </div>
                  )}
                </div>
              )}
              
              {(selectedTransaction.category === 'Transfer' || selectedTransaction.category === 'Income') && (
                <div className="info-section">
                  <h4>Account Information</h4>
                  <div className="info-row">
                    <span className="info-label">From Account</span>
                    <span className="info-value">6432 8855156617</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">To Account</span>
                    <span className="info-value">9797 0001902199</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Reference</span>
                    <span className="info-value">Transfer</span>
                  </div>
                </div>
              )}
              
              <div className="info-section">
                <h4>Financial Details</h4>
                <div className="info-row">
                  <span className="info-label">Amount</span>
                  <span className={`info-value ${selectedTransaction.amount > 0 ? 'positive' : 'negative'}`}>
                    {selectedTransaction.amount > 0 ? '+' : ''}kr {Math.abs(selectedTransaction.amount).toFixed(2)}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Fee</span>
                  <span className="info-value">kr 0.00</span>
                </div>
                {details.exchangeRate && (
                  <div className="info-row">
                    <span className="info-label">Exchange Rate</span>
                    <span className="info-value">{details.exchangeRate}</span>
                  </div>
                )}
                <div className="info-row">
                  <span className="info-label">Total</span>
                  <span className={`info-value ${selectedTransaction.amount > 0 ? 'positive' : 'negative'}`}>
                    {selectedTransaction.amount > 0 ? '+' : ''}kr {Math.abs(selectedTransaction.amount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      {currentView === 'home' && renderHome()}
      {currentView === 'account' && renderAccount()}
      {currentView === 'cards' && renderCards()}
      {currentView === 'trading' && renderTrading()}
      {currentView === 'activity' && renderActivity()}
      
      <div className="bottom-nav">
        <button className={`nav-btn ${currentView === 'home' ? 'active' : ''}`} onClick={() => setCurrentView('home')}>
          <div className="nav-icon">🏠</div>
          <span>Home</span>
        </button>
        <button className={`nav-btn ${currentView === 'cards' ? 'active' : ''}`} onClick={() => setCurrentView('cards')}>
          <div className="nav-icon">💳</div>
          <span>Cards</span>
        </button>
        <button className={`nav-btn ${currentView === 'trading' ? 'active' : ''}`} onClick={() => setCurrentView('trading')}>
          <div className="nav-icon">📈</div>
          <span>Trading</span>
        </button>
        <button className={`nav-btn ${currentView === 'activity' ? 'active' : ''}`} onClick={() => setCurrentView('activity')}>
          <div className="nav-icon">📊</div>
          <span>Activity</span>
        </button>
      </div>
      
      {renderModal()}
      {renderTransactionModal()}
    </div>
  )
}

export default App
