import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
from decimal import Decimal

def generate_asset_type_pie_chart(assets):
    """
    Gera um gráfico de pizza da distribuição da carteira por tipo de ativo.
    """
    if not assets:
        return None

    data = [{
        'asset_type': asset.get_asset_type_display(),
        'current_total_value': float(asset.current_total_value or 0)
    } for asset in assets]

    df = pd.DataFrame(data)
    if df['current_total_value'].sum() == 0:
        return None

    fig = px.pie(df, names='asset_type', values='current_total_value', title='Distribuição por Tipo de Ativo')
    fig.update_layout(legend_title_text='Tipos de Ativo')
    return fig.to_html(full_html=False, include_plotlyjs=False)


def generate_sector_pie_chart(assets):
    """
    Gera um gráfico de pizza da distribuição da carteira por setor.
    """
    if not assets:
        return None

    # Filtra ativos que possuem setor definido e valor
    data = [{
        'sector': asset.sector or 'Não categorizado',
        'current_total_value': float(asset.current_total_value or 0)
    } for asset in assets if asset.sector and asset.current_total_value]

    if not data:
        return None

    df = pd.DataFrame(data)
    df_grouped = df.groupby('sector')['current_total_value'].sum().reset_index()

    if df_grouped['current_total_value'].sum() == 0:
        return None

    fig = px.pie(df_grouped, names='sector', values='current_total_value', title='Distribuição por Setor')
    fig.update_layout(legend_title_text='Setores')
    return fig.to_html(full_html=False, include_plotlyjs=False)


def generate_profitability_bar_chart(assets):
    """
    Gera um gráfico de barras com a rentabilidade de cada ativo.
    """
    if not assets:
        return None

    data = [{
        'ticker': asset.ticker,
        'profit_loss': float(asset.profit_loss or 0)
    } for asset in assets if asset.profit_loss is not None]

    if not data:
        return None

    df = pd.DataFrame(data)
    df = df.sort_values(by='profit_loss', ascending=False)

    colors = ['green' if x > 0 else 'red' for x in df['profit_loss']]

    fig = go.Figure(go.Bar(
        x=df['ticker'],
        y=df['profit_loss'],
        marker_color=colors
    ))

    fig.update_layout(
        title_text='Rentabilidade por Ativo (R$)',
        xaxis_title='Ativo',
        yaxis_title='Rentabilidade (R$)'
    )
    return fig.to_html(full_html=False, include_plotlyjs=False)
