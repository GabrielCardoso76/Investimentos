from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Asset(models.Model):
    class AssetType(models.TextChoices):
        ACAO = 'Ação', 'Ação'
        FII = 'FII', 'Fundo Imobiliário'
        RENDA_FIXA = 'Renda Fixa', 'Renda Fixa'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assets')
    ticker = models.CharField(max_length=10, verbose_name='Código do Ativo')
    quantity = models.PositiveIntegerField(verbose_name='Quantidade')
    average_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Preço Médio')
    asset_type = models.CharField(max_length=20, choices=AssetType.choices, verbose_name='Tipo de Ativo')
    sector = models.CharField(max_length=50, blank=True, null=True, verbose_name='Setor')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Ativo'
        verbose_name_plural = 'Ativos'
        unique_together = ('user', 'ticker')

    def __str__(self):
        return f'{self.ticker} - {self.user.username}'

class Dividend(models.Model):
    class DividendType(models.TextChoices):
        DIVIDENDO = 'Dividendo', 'Dividendo'
        JCP = 'JCP', 'Juros sobre Capital Próprio'
        RENDIMENTO = 'Rendimento', 'Rendimento'

    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='dividends')
    date = models.DateField(verbose_name='Data de Pagamento')
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Valor Recebido')
    dividend_type = models.CharField(max_length=20, choices=DividendType.choices, verbose_name='Tipo de Provento')

    class Meta:
        verbose_name = 'Provento'
        verbose_name_plural = 'Proventos'
        ordering = ['-date']

    def __str__(self):
        return f'{self.asset.ticker} - {self.date} - R$ {self.amount}'


class PriceAlert(models.Model):
    class AlertCondition(models.TextChoices):
        ABOVE = 'ABOVE', 'Acima de'
        BELOW = 'BELOW', 'Abaixo de'

    class AlertStatus(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Ativo'
        TRIGGERED = 'TRIGGERED', 'Acionado'
        CANCELLED = 'CANCELLED', 'Cancelado'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='alerts')
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='alerts')
    target_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Preço Alvo')
    condition = models.CharField(max_length=10, choices=AlertCondition.choices, verbose_name='Condição')
    status = models.CharField(max_length=10, choices=AlertStatus.choices, default=AlertStatus.ACTIVE, verbose_name='Status')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Alerta de Preço'
        verbose_name_plural = 'Alertas de Preços'
        ordering = ['-created_at']

    def __str__(self):
        return f'Alerta para {self.asset.ticker} {self.get_condition_display()} R$ {self.target_price} ({self.get_status_display()})'
