from django.shortcuts import render
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import (
    ListView,
    CreateView,
    UpdateView,
    DeleteView,
)
from django.db.models import Sum
from .models import Asset, Dividend, PriceAlert
from .forms import AssetForm, DividendForm, PriceAlertForm
from .services import get_market_data
from .charts import (
    generate_asset_type_pie_chart,
    generate_sector_pie_chart,
    generate_profitability_bar_chart
)
from decimal import Decimal

# --- Asset Views ---

class AssetListView(LoginRequiredMixin, ListView):
    model = Asset
    template_name = 'portfolio/asset_list.html'
    context_object_name = 'assets'

    def get_queryset(self):
        return Asset.objects.filter(user=self.request.user).order_by('ticker')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        assets = self.get_queryset()

        tickers = [asset.ticker for asset in assets]
        market_data = get_market_data(tickers)

        total_invested = Decimal('0.0')
        total_current_value = Decimal('0.0')

        enriched_assets = []
        for asset in assets:
            total_invested += asset.quantity * asset.average_price

            data = market_data.get(asset.ticker)
            if data and data.get('current_price'):
                current_price = Decimal(str(data['current_price']))
                asset.current_price = current_price
                asset.current_total_value = asset.quantity * current_price
                asset.profit_loss = asset.current_total_value - (asset.quantity * asset.average_price)

                invested_value = asset.quantity * asset.average_price
                if invested_value > 0:
                    asset.profit_loss_percent = (asset.profit_loss / invested_value) * 100
                else:
                    asset.profit_loss_percent = Decimal('0.0')

                total_current_value += asset.current_total_value
            else:
                asset.current_price = None
                asset.current_total_value = None
                asset.profit_loss = None
                asset.profit_loss_percent = None

            enriched_assets.append(asset)

        total_profit_loss = total_current_value - total_invested
        if total_invested > 0:
            total_profit_loss_percent = (total_profit_loss / total_invested) * 100
        else:
            total_profit_loss_percent = Decimal('0.0')

        context['asset_type_pie_chart'] = generate_asset_type_pie_chart(enriched_assets)
        context['sector_pie_chart'] = generate_sector_pie_chart(enriched_assets)
        context['profitability_bar_chart'] = generate_profitability_bar_chart(enriched_assets)

        context['assets'] = enriched_assets
        context['total_invested'] = total_invested
        context['total_current_value'] = total_current_value
        context['total_profit_loss'] = total_profit_loss
        context['total_profit_loss_percent'] = total_profit_loss_percent

        total_dividends = Dividend.objects.filter(asset__user=self.request.user).aggregate(total=Sum('amount'))['total'] or Decimal('0.0')
        context['total_passive_income'] = total_dividends

        return context

class AssetCreateView(LoginRequiredMixin, CreateView):
    model = Asset
    form_class = AssetForm
    template_name = 'portfolio/asset_form.html'
    success_url = reverse_lazy('portfolio:asset_list')

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)

class AssetUpdateView(LoginRequiredMixin, UpdateView):
    model = Asset
    form_class = AssetForm
    template_name = 'portfolio/asset_form.html'
    success_url = reverse_lazy('portfolio:asset_list')

    def get_queryset(self):
        return Asset.objects.filter(user=self.request.user)

class AssetDeleteView(LoginRequiredMixin, DeleteView):
    model = Asset
    template_name = 'portfolio/asset_confirm_delete.html'
    success_url = reverse_lazy('portfolio:asset_list')
    context_object_name = 'asset'

    def get_queryset(self):
        return Asset.objects.filter(user=self.request.user)

# --- Dividend Views ---

class DividendListView(LoginRequiredMixin, ListView):
    model = Dividend
    template_name = 'portfolio/dividend_list.html'
    context_object_name = 'dividends'
    paginate_by = 10

    def get_queryset(self):
        return Dividend.objects.filter(asset__user=self.request.user).order_by('-date')

class DividendCreateView(LoginRequiredMixin, CreateView):
    model = Dividend
    form_class = DividendForm
    template_name = 'portfolio/dividend_form.html'
    success_url = reverse_lazy('portfolio:dividend_list')

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)

class DividendUpdateView(LoginRequiredMixin, UpdateView):
    model = Dividend
    form_class = DividendForm
    template_name = 'portfolio/dividend_form.html'
    success_url = reverse_lazy('portfolio:dividend_list')

    def get_queryset(self):
        return Dividend.objects.filter(asset__user=self.request.user)

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs

class DividendDeleteView(LoginRequiredMixin, DeleteView):
    model = Dividend
    template_name = 'portfolio/dividend_confirm_delete.html'
    success_url = reverse_lazy('portfolio:dividend_list')
    context_object_name = 'dividend'

    def get_queryset(self):
        return Dividend.objects.filter(asset__user=self.request.user)

# --- Price Alert Views ---

class PriceAlertListView(LoginRequiredMixin, ListView):
    model = PriceAlert
    template_name = 'portfolio/pricealert_list.html'
    context_object_name = 'alerts'
    paginate_by = 10

    def get_queryset(self):
        return PriceAlert.objects.filter(user=self.request.user).order_by('-created_at')

class PriceAlertCreateView(LoginRequiredMixin, CreateView):
    model = PriceAlert
    form_class = PriceAlertForm
    template_name = 'portfolio/pricealert_form.html'
    success_url = reverse_lazy('portfolio:pricealert_list')

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)

class PriceAlertDeleteView(LoginRequiredMixin, DeleteView):
    model = PriceAlert
    template_name = 'portfolio/pricealert_confirm_delete.html'
    success_url = reverse_lazy('portfolio:pricealert_list')
    context_object_name = 'alert'

    def get_queryset(self):
        return PriceAlert.objects.filter(user=self.request.user)
