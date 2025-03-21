import React, { useState, useEffect } from "react";
import Card from "./components/Card";

// Currency list
const allowedCoins = [
  "bitcoin", "toncoin", "polkadot", "cardano", "cat-in-a-dogs-world",
  "dogecoin", "dogs", "hamster-kombat", "notcoin", "tron", "not-pixel", 
  "solana", "shiba-inu", "ethereum", "litecoin", "ripple", "stellar", 
  "tether", "usd-coin", "binancecoin", "chainlink", "bitcoin-cash", 
  "uniswap", "wrapped-bitcoin", "dogecoin", "polkadot", "litecoin", 
  "ethereum", "ripple", "stellar", "tether", "usd-coin", "binancecoin", 
  "chainlink",
];

// Функция для форматирования Market Cap
function formatMarketCap(number) {
  if (number >= 1e12) return `$${(number / 1e12).toFixed(1)}T`;
  if (number >= 1e9) return `$${(number / 1e9).toFixed(1)}B`;
  if (number >= 1e6) return `$${(number / 1e6).toFixed(1)}M`;
  return `$${number.toLocaleString()}`;
}

// Telegram Mini Apps SDK
function App() {
  const [safeArea, setSafeArea] = useState({ top: 50, bottom: 16, left: 16, right: 16 });

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();
      tg.ready();
      tg.disableVerticalSwipes();

      // ✅ Проверяем, открыт ли WebApp в Telegram
      const isTelegram = tg.initDataUnsafe?.query_id !== undefined;

      if (isTelegram) {
        console.log("Running inside Telegram WebApp");
        tg.requestFullscreen(); // ✅ Только в Telegram
      } else {
        console.log("Running in a regular browser. Fullscreen is disabled.");
      }

      // ✅ Подписка на `content_safe_area_changed`
      tg.onEvent("content_safe_area_changed", (safeAreaData) => {
        console.log("Safe Area Changed:", safeAreaData);
        setSafeArea(safeAreaData);
      });

      // ✅ Если `content_safe_area_changed` не сработал, используем `viewportHeight`
      setTimeout(() => {
        if (tg.viewportHeight) {
          console.log("Using viewportHeight as fallback:", tg.viewportHeight);
          setSafeArea((prev) => ({
            ...prev,
            top: tg.viewportHeight * 0.08, // 8% от высоты экрана как резервное значение
          }));
        }
      }, 500);

      return () => {
        tg.offEvent("content_safe_area_changed");
      };
    }
  }, []);

  // Coingecko API
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false")
      .then((response) => response.json())
      .then((data) => {
        const filteredCoins = data.filter(coin => allowedCoins.includes(coin.id));
        setCoins(filteredCoins);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка загрузки данных:", error);
        setLoading(false);
      });
  }, []);

  // App
  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center gap-[32px] p-[16px] pt-[64px] pb-[24px]"
        style={{
          paddingTop: `${safeArea.top}px`, // ✅ Теперь обновляется напрямую
          paddingBottom: `${safeArea.bottom}px`,
          paddingLeft: `${safeArea.left}px`,
          paddingRight: `${safeArea.right}px`
        }}>
      <h1 className="text-4xl text-center text-white font-bold">
        Crypto Dashboard
      </h1>

      {loading ? (
        <p className="text-white">Loading</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[12px] w-full max-w-[1000px]">
          {coins.map((coin) => (
            <Card
              key={coin.id}
              title={coin.name} // Название криптовалюты
              description={`Market Cap: ${formatMarketCap(coin.market_cap)}`} // Форматирование Market Cap
              icon={coin.image} // URL иконки
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;