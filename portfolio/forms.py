import csv
from django import forms
from .models import Asset, Dividend, PriceAlert, Profile

class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['desired_yield']
        widgets = {
            'desired_yield': forms.NumberInput(attrs={'class': 'form-control'}),
        }
        help_texts = {
            'desired_yield': 'Informe o percentual de dividend yield mínimo que você deseja para seus investimentos. Ex: 6 para 6%.',
        }

class CSVImportForm(forms.Form):
    csv_file = forms.FileField(label='Arquivo CSV')

class AssetForm(forms.ModelForm):
    class Meta:
        model = Asset
        fields = ['ticker', 'quantity', 'average_price', 'asset_type', 'sector', 'annual_dividend_projection']
        widgets = {
            'ticker': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ex: PETR4'}),
            'quantity': forms.NumberInput(attrs={'class': 'form-control'}),
            'average_price': forms.NumberInput(attrs={'class': 'form-control'}),
            'asset_type': forms.Select(attrs={'class': 'form-control'}),
            'sector': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ex: Petróleo'}),
            'annual_dividend_projection': forms.NumberInput(attrs={'class': 'form-control'}),
        }

class DividendForm(forms.ModelForm):
    class Meta:
        model = Dividend
        fields = ['asset', 'date', 'amount', 'dividend_type']
        widgets = {
            'date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'amount': forms.NumberInput(attrs={'class': 'form-control'}),
            'dividend_type': forms.Select(attrs={'class': 'form-control'}),
            'asset': forms.Select(attrs={'class': 'form-control'}),
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        if user:
            self.fields['asset'].queryset = Asset.objects.filter(user=user)

class PriceAlertForm(forms.ModelForm):
    class Meta:
        model = PriceAlert
        fields = ['asset', 'target_price', 'condition']
        widgets = {
            'asset': forms.Select(attrs={'class': 'form-control'}),
            'target_price': forms.NumberInput(attrs={'class': 'form-control'}),
            'condition': forms.Select(attrs={'class': 'form-control'}),
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        if user:
            self.fields['asset'].queryset = Asset.objects.filter(user=user)
