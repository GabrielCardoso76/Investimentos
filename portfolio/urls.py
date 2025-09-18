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
    GeneratePDFReportView,
    ProfileUpdateView,
)

app_name = 'portfolio'

urlpatterns = [
    # Asset URLs
    path('', AssetListView.as_view(), name='asset_list'),
    path('assets/add/', AssetCreateView.as_view(), name='asset_create'),
    path('assets/import/', AssetCSVImportView.as_view(), name='asset_import_csv'),
    path('assets/<int:pk>/edit/', AssetUpdateView.as_view(), name='asset_update'),
    path('assets/<int:pk>/delete/', AssetDeleteView.as_view(), name='asset_delete'),
    path('report/pdf/', GeneratePDFReportView.as_view(), name='report_pdf'),

    # Dividend URLs
    path('dividends/', DividendListView.as_view(), name='dividend_list'),
    path('dividends/add/', DividendCreateView.as_view(), name='dividend_create'),
    path('dividends/<int:pk>/edit/', DividendUpdateView.as_view(), name='dividend_update'),
    path('dividends/<int:pk>/delete/', DividendDeleteView.as_view(), name='dividend_delete'),

    # Price Alert URLs
    path('alerts/', PriceAlertListView.as_view(), name='pricealert_list'),
    path('alerts/add/', PriceAlertCreateView.as_view(), name='pricealert_create'),
    path('alerts/<int:pk>/delete/', PriceAlertDeleteView.as_view(), name='pricealert_delete'),

    # Profile URL
    path('profile/', ProfileUpdateView.as_view(), name='profile_update'),
]
