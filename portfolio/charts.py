import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
from .models import PortfolioSnapshot

def generate_asset_type_pie_chart(assets):
    if not assets: return None
    data = [{'type': asset.get_asset_type_display(), 'value': float(asset.current_total_value or 0)} for asset in assets]
    df = pd.DataFrame(data)
    if df['value'].sum() == 0: return None
    fig = px.pie(df, names='type', values='value', title='Distribuição por Tipo de Ativo')
    return fig.to_html(full_html=False, include_plotlyjs=False)

def generate_sector_pie_chart(assets):
    if not assets: return None
    data = [{'sector': asset.sector or 'N/A', 'value': float(asset.current_total_value or 0)} for asset in assets if asset.sector]
    if not data: return None
    df = pd.DataFrame(data).groupby('sector')['value'].sum().reset_index()
    if df['value'].sum() == 0: return None
    fig = px.pie(df, names='sector', values='value', title='Distribuição por Setor')
    return fig.to_html(full_html=False, include_plotlyjs=False)

def generate_profitability_bar_chart(assets):
    if not assets: return None
    data = [{'ticker': asset.ticker, 'profit': float(asset.profit_loss or 0)} for asset in assets if asset.profit_loss is not None]
    if not data: return None
    df = pd.DataFrame(data).sort_values(by='profit', ascending=False)
    colors = ['green' if x > 0 else 'red' for x in df['profit']]
    fig = go.Figure(go.Bar(x=df['ticker'], y=df['profit'], marker_color=colors))
    fig.update_layout(title_text='Rentabilidade por Ativo (R$)', xaxis_title='Ativo', yaxis_title='Rentabilidade (R$)')
    return fig.to_html(full_html=False, include_plotlyjs=False)

def generate_historical_value_chart(user):
    snapshots = PortfolioSnapshot.objects.filter(user=user).order_by('date')
    if snapshots.count() < 2: return None
    df = pd.DataFrame(list(snapshots.values('date', 'total_value')))
    fig = px.line(df, x='date', y='total_value', title='Evolução da Carteira', labels={'date': 'Data', 'total_value': 'Valor Total (R$)'})
    return fig.to_html(full_html=False, include_plotlyjs=False)
