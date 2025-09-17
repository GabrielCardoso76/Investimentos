from django.urls import path
from .views import (
    AssetListView,
    AssetCreateView,
    AssetUpdateView,
    AssetDeleteView,
    DividendListView,
    DividendCreateView,
    DividendUpdateView,
    DividendDeleteView,
    PriceAlertListView,
    PriceAlertCreateView,
    PriceAlertDeleteView,
    AssetCSVImportView,
)

app_name = 'portfolio'

urlpatterns = [
    # Asset URLs
    path('', AssetListView.as_view(), name='asset_list'),
    path('assets/add/', AssetCreateView.as_view(), name='asset_create'),
    path('assets/<int:pk>/edit/', AssetUpdateView.as_view(), name='asset_update'),
    path('assets/<int:pk>/delete/', AssetDeleteView.as_view(), name='asset_delete'),

    # Dividend URLs
    path('dividends/', DividendListView.as_view(), name='dividend_list'),
    path('dividends/add/', DividendCreateView.as_view(), name='dividend_create'),
    path('dividends/<int:pk>/edit/', DividendUpdateView.as_view(), name='dividend_update'),
    path('dividends/<int:pk>/delete/', DividendDeleteView.as_view(), name='dividend_delete'),

    # Price Alert URLs
    path('alerts/', PriceAlertListView.as_view(), name='pricealert_list'),
    path('alerts/add/', PriceAlertCreateView.as_view(), name='pricealert_create'),
    path('alerts/<int:pk>/delete/', PriceAlertDeleteView.as_view(), name='pricealert_delete'),
]
