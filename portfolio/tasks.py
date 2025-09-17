from celery import shared_task
import logging
from .models import PriceAlert, Asset, PortfolioSnapshot
from .services import get_market_data
from decimal import Decimal
from django.contrib.auth import get_user_model
from datetime import date

User = get_user_model()
logger = logging.getLogger(__name__)

@shared_task
def take_portfolio_snapshots():
    """
    Takes a snapshot of the total value of each user's portfolio.
    This task should be run daily.
    """
    logger.info("Starting daily portfolio snapshot task...")
    users = User.objects.all()
    for user in users:
        assets = Asset.objects.filter(user=user)
        if not assets.exists():
            continue

        tickers = [asset.ticker for asset in assets]
        market_data = get_market_data(tickers)

        total_current_value = Decimal('0.0')
        for asset in assets:
            data = market_data.get(asset.ticker)
            if data and data.get('current_price'):
                current_price = Decimal(str(data['current_price']))
                total_current_value += asset.quantity * current_price

        if total_current_value > 0:
            PortfolioSnapshot.objects.update_or_create(
                user=user,
                date=date.today(),
                defaults={'total_value': total_current_value}
            )
            logger.info(f"Successfully took snapshot for user {user.username}.")
        else:
            logger.info(f"Skipping snapshot for user {user.username} due to zero portfolio value.")
    return f"Snapshots taken for {users.count()} users."


@shared_task
def check_price_alerts():
    """
    Celery task to check active price alerts and trigger them if conditions are met.
    """
    logger.info("Checking for active price alerts...")
    active_alerts = PriceAlert.objects.filter(status=PriceAlert.AlertStatus.ACTIVE).select_related('asset')

    if not active_alerts.exists():
        return "No active alerts."

    tickers_to_check = {alert.asset.ticker for alert in active_alerts}
    market_data = get_market_data(list(tickers_to_check))

    if not market_data:
        logger.warning("Could not retrieve market data. Skipping alert check.")
        return "Failed to get market data."

    triggered_count = 0
    for alert in active_alerts:
        data = market_data.get(alert.asset.ticker)
        if not data or not data.get('current_price'):
            continue

        current_price = Decimal(str(data['current_price']))

        condition_met = False
        if alert.condition == PriceAlert.AlertCondition.ABOVE and current_price > alert.target_price:
            condition_met = True
        elif alert.condition == PriceAlert.AlertCondition.BELOW and current_price < alert.target_price:
            condition_met = True

        if condition_met:
            alert.status = PriceAlert.AlertStatus.TRIGGERED
            alert.save()
            triggered_count += 1
            logger.info(f"Alert {alert.id} for {alert.asset.ticker} triggered!")
            # Email sending logic will be added in a later step

    logger.info(f"Price alert check complete. Triggered {triggered_count} alerts.")
    return f"Checked {len(active_alerts)} alerts, triggered {triggered_count}."
