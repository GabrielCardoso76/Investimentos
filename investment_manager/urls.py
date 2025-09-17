from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("assets/", include("portfolio.urls", namespace="portfolio")),
    path("", RedirectView.as_view(url="/assets/", permanent=True)),
]
