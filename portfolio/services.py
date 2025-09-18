import yfinance as yf
import logging
from decimal import Decimal

logger = logging.getLogger(__name__)

def get_market_data(tickers):
    """
    Busca dados de mercado para uma lista de tickers.
    Refatorado para usar yf.Ticker individualmente, pois yf.Tickers está instável.
    """
    if not tickers:
        return {}

    market_data = {}
    for ticker in tickers:
        yahoo_ticker = f"{ticker}.SA"
        try:
            ticker_obj = yf.Ticker(yahoo_ticker)

            # Tenta obter o preço de 'fast_info' (mais rápido)
            current_price = ticker_obj.fast_info.get('last_price')

            # Se não conseguir, tenta o preço de fechamento anterior de 'info' (fallback)
            if current_price is None:
                info = ticker_obj.info
                current_price = info.get('previousClose')

            if current_price is not None:
                market_data[ticker] = {'current_price': Decimal(str(current_price))}
            else:
                logger.warning(f"Não foi possível obter o preço para o ticker: {ticker}")

        except Exception as e:
            # yfinance pode lançar várias exceções se o ticker não for encontrado ou a API falhar
            logger.error(f"Erro ao buscar dados para o ticker {ticker}: {e}")

    return market_data
