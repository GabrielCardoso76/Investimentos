import yfinance as yf
import logging

# Configure logging
logger = logging.getLogger(__name__)

def get_market_data(tickers):
    """
    Busca dados de mercado para uma lista de tickers.

    Args:
        tickers (list): Uma lista de strings com os tickers (ex: ['PETR4', 'VALE3']).

    Returns:
        dict: Um dicionário mapeando cada ticker para seus dados de mercado.
              Ex: {'PETR4': {'current_price': 50.20}, 'VALE3': {'current_price': 80.10}}
              Retorna um dicionário vazio se a API falhar ou nenhum ticker for válido.
    """
    if not tickers:
        return {}

    # Adiciona o sufixo .SA para ativos brasileiros, necessário para a API do Yahoo Finance
    yahoo_tickers = [f"{ticker}.SA" for ticker in tickers]

    market_data = {}

    try:
        # yf.Tickers() é eficiente para buscar múltiplos tickers
        ticker_data = yf.Tickers(yahoo_tickers)

        for i, ticker_obj in enumerate(ticker_data.tickers):
            original_ticker = tickers[i]
            try:
                # Adiciona uma verificação para garantir que o objeto é válido
                if hasattr(ticker_obj, 'fast_info'):
                    current_price = ticker_obj.fast_info.get('last_price')

                    if current_price:
                        market_data[original_ticker] = {
                            'current_price': current_price
                        }
                    else:
                        # Fallback para 'previous_close' se 'last_price' não estiver disponível
                        info = ticker_obj.info
                        if 'previousClose' in info:
                             market_data[original_ticker] = {
                                'current_price': info['previousClose']
                            }
                        else:
                            logger.warning(f"Não foi possível obter o preço para o ticker: {original_ticker}")
                else:
                    logger.warning(f"Objeto ticker inválido para {original_ticker}. Pode ser um ticker inexistente.")

            except Exception as e:
                logger.error(f"Erro ao processar o ticker {original_ticker}: {e}")

    except Exception as e:
        logger.error(f"Erro ao chamar a API do yfinance: {e}")
        return {}

    return market_data
