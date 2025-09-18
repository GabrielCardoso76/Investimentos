from django.shortcuts import render
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
import csv
import io
from django.views.generic import (
    ListView,
    CreateView,
    UpdateView,
    DeleteView,
    View,
    FormView,
)
from django.db.models import Sum
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.contrib import messages
from weasyprint import HTML

from .models import Asset, Dividend, PriceAlert, PortfolioSnapshot, Profile
from .forms import AssetForm, DividendForm, PriceAlertForm, CSVImportForm, ProfileForm
from .services import get_market_data
from .charts import (
    generate_asset_type_pie_chart,
    generate_sector_pie_chart,
    generate_profitability_bar_chart,
    generate_historical_value_chart,
)
from decimal import Decimal

class _PortfolioDataMixin:
    def _get_portfolio_context(self, user):
        assets = Asset.objects.filter(user=user).order_by('ticker')
        tickers = [asset.ticker for asset in assets]
        market_data = get_market_data(tickers)

        total_invested = Decimal('0.0')
        total_current_value = Decimal('0.0')

        enriched_assets = []
        for asset in assets:
            total_invested += asset.quantity * asset.average_price

            data = market_data.get(asset.ticker)
            if data and data.get('current_price'):
                current_price = data['current_price']
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

        return {
            'assets': enriched_assets,
            'total_invested': total_invested,
            'total_current_value': total_current_value,
            'total_profit_loss': total_profit_loss,
            'total_profit_loss_percent': total_profit_loss_percent,
        }

class AssetListView(LoginRequiredMixin, _PortfolioDataMixin, ListView):
    model = Asset
    template_name = 'portfolio/asset_list.html'
    context_object_name = 'assets'

    def get_queryset(self):
        return Asset.objects.filter(user=self.request.user).order_by('ticker')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        portfolio_context = self._get_portfolio_context(self.request.user)
        context.update(portfolio_context)

        # Preço Teto Calculation
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        desired_yield = profile.desired_yield

        enriched_assets = portfolio_context['assets']
        for asset in enriched_assets:
            asset.preco_teto = None
            if desired_yield > 0 and asset.annual_dividend_projection is not None and asset.annual_dividend_projection > 0:
                asset.preco_teto = asset.annual_dividend_projection / (desired_yield / 100)

        context['asset_type_pie_chart'] = generate_asset_type_pie_chart(enriched_assets)
        context['sector_pie_chart'] = generate_sector_pie_chart(enriched_assets)
        context['profitability_bar_chart'] = generate_profitability_bar_chart(enriched_assets)
        context['historical_value_chart'] = generate_historical_value_chart(self.request.user)

        total_dividends = Dividend.objects.filter(asset__user=self.request.user).aggregate(total=Sum('amount'))['total'] or Decimal('0.0')
        context['total_passive_income'] = total_dividends

        return context

class GeneratePDFReportView(LoginRequiredMixin, _PortfolioDataMixin, View):
    def get(self, request, *args, **kwargs):
        portfolio_context = self._get_portfolio_context(request.user)
        html_string = render_to_string('portfolio/pdf_report.html', {'user': request.user, **portfolio_context})
        pdf_file = HTML(string=html_string).write_pdf()
        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="relatorio_carteira.pdf"'
        return response

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

class AssetCSVImportView(LoginRequiredMixin, FormView):
    template_name = 'portfolio/asset_import_csv.html'
    form_class = CSVImportForm
    success_url = reverse_lazy('portfolio:asset_list')

    def form_valid(self, form):
        csv_file = form.cleaned_data['csv_file']
        decoded_file = csv_file.read().decode('utf-8')
        io_string = io.StringIO(decoded_file)

        # Espera-se um CSV com header: ticker,quantity,average_price,asset_type,sector
        reader = csv.DictReader(io_string)

        created_count = 0
        errors = []
        for row in reader:
            try:
                asset_type = row.get('asset_type', 'Ação').strip()
                if asset_type not in Asset.AssetType.values:
                    asset_type = 'Ação' # Default

                Asset.objects.update_or_create(
                    user=self.request.user,
                    ticker=row['ticker'].strip().upper(),
                    defaults={
                        'quantity': int(row['quantity']),
                        'average_price': Decimal(row['average_price']),
                        'asset_type': asset_type,
                        'sector': row.get('sector', '').strip()
                    }
                )
                created_count += 1
            except (KeyError, ValueError, TypeError) as e:
                errors.append(f"Erro na linha {reader.line_num}: {e} - {row}")

        if errors:
            messages.error(self.request, f"Ocorreram erros ao importar o CSV: {'; '.join(errors)}")
        if created_count > 0:
            messages.success(self.request, f"{created_count} ativos importados/atualizados com sucesso!")

        return super().form_valid(form)

class ProfileUpdateView(LoginRequiredMixin, UpdateView):
    model = Profile
    form_class = ProfileForm
    template_name = 'portfolio/profile_form.html'
    success_url = reverse_lazy('portfolio:asset_list')

    def get_object(self, queryset=None):
        # Get or create the profile for the current user
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile

    def form_valid(self, form):
        messages.success(self.request, "Seu perfil foi atualizado com sucesso!")
        return super().form_valid(form)
