from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from .models import Asset, Dividend, PriceAlert
from decimal import Decimal

User = get_user_model()

class PortfolioModelsTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.asset = Asset.objects.create(
            user=self.user,
            ticker='TEST4',
            quantity=100,
            average_price=Decimal('10.00'),
            asset_type=Asset.AssetType.ACAO,
            sector='Tecnologia'
        )

    def test_asset_creation(self):
        self.assertEqual(self.asset.ticker, 'TEST4')
        self.assertEqual(self.asset.user.username, 'testuser')
        self.assertEqual(Asset.objects.count(), 1)

    def test_dividend_creation(self):
        dividend = Dividend.objects.create(
            asset=self.asset,
            date='2024-01-01',
            amount=Decimal('50.00'),
            dividend_type=Dividend.DividendType.DIVIDENDO
        )
        self.assertEqual(dividend.amount, Decimal('50.00'))
        self.assertEqual(Dividend.objects.count(), 1)

    def test_price_alert_creation(self):
        alert = PriceAlert.objects.create(
            user=self.user,
            asset=self.asset,
            target_price=Decimal('12.00'),
            condition=PriceAlert.AlertCondition.ABOVE
        )
        self.assertEqual(alert.target_price, Decimal('12.00'))
        self.assertEqual(PriceAlert.objects.count(), 1)


class PortfolioViewsTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.dashboard_url = reverse('portfolio:asset_list')

    def test_dashboard_authenticated(self):
        self.client.login(username='testuser', password='password123')
        response = self.client.get(self.dashboard_url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'portfolio/asset_list.html')

    def test_dashboard_unauthenticated(self):
        response = self.client.get(self.dashboard_url)
        # Should redirect to the login page. The default admin login has /admin/login/
        self.assertRedirects(response, f'/admin/login/?next={self.dashboard_url}')

    def test_create_asset_view(self):
        self.client.login(username='testuser', password='password123')
        create_url = reverse('portfolio:asset_create')
        response = self.client.post(create_url, {
            'ticker': 'NEWCO5',
            'quantity': 50,
            'average_price': '25.50',
            'asset_type': Asset.AssetType.ACAO,
            'sector': 'Varejo'
        })
        self.assertRedirects(response, self.dashboard_url)
        self.assertTrue(Asset.objects.filter(ticker='NEWCO5').exists())
        self.assertEqual(Asset.objects.count(), 1)
