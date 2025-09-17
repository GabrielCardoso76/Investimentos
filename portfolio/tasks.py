from celery import shared_task
import logging
from .models import PriceAlert
from .services import get_market_data
from decimal import Decimal

logger = logging.getLogger(__name__)

@shared_task
def check_price_alerts():
    """
    Celery task to check active price alerts and trigger them if conditions are met.
    """
    active_alerts = PriceAlert.objects.filter(status=PriceAlert.AlertStatus.ACTIVE).select_related('asset')

    if not active_alerts.exists():
        logger.info("No active price alerts to check.")
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
            logger.info(f"Alert {alert.id} for {alert.asset.ticker} triggered! Price {current_price} met condition {alert.condition} {alert.target_price}.")
            # Here you would typically send a notification (e.g., email, push notification)
            # send_notification.delay(alert.user.email, f"Price alert for {alert.asset.ticker}!")

    logger.info(f"Price alert check complete. Triggered {triggered_count} alerts.")
    return f"Checked {len(active_alerts)} alerts, triggered {triggered_count}."
