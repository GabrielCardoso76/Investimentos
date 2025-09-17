import yfinance as yf
import logging
from decimal import Decimal

logger = logging.getLogger(__name__)

def get_market_data(tickers):
    """
    Busca dados de mercado para uma lista de tickers.
    """
    if not tickers:
        return {}

    yahoo_tickers = [f"{ticker}.SA" for ticker in tickers]
    market_data = {}

    try:
        ticker_data = yf.Tickers(yahoo_tickers)

        for i, ticker_obj in enumerate(ticker_data.tickers):
            original_ticker = tickers[i]
            try:
                if hasattr(ticker_obj, 'fast_info'):
                    current_price = ticker_obj.fast_info.get('last_price')
                    if current_price:
                        market_data[original_ticker] = {'current_price': Decimal(str(current_price))}
                    else:
                        info = ticker_obj.info
                        if 'previousClose' in info:
                             market_data[original_ticker] = {'current_price': Decimal(str(info['previousClose']))}
                        else:
                            logger.warning(f"Could not get price for ticker: {original_ticker}")
                else:
                    logger.warning(f"Invalid ticker object for {original_ticker}. It might not exist.")
            except Exception as e:
                logger.error(f"Error processing ticker {original_ticker}: {e}")
    except Exception as e:
        logger.error(f"Error calling yfinance API: {e}")
        return {}

    return market_data
