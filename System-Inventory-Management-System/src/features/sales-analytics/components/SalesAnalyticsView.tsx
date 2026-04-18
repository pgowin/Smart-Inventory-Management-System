import { useSalesAnalytics } from '../hooks/useSalesAnalytics'

type SalesAnalyticsViewProps = {
  locationId: string
  locationName: string
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString))
}

function formatDateTime(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateString))
}

export function SalesAnalyticsView({
  locationId,
  locationName,
}: SalesAnalyticsViewProps) {
  const {
    summary,
    dailyRevenue,
    maxDailyRevenue,
    topItems,
    locationPerformance,
    recentTransactions,
  } = useSalesAnalytics(locationId)

  return (
    <section className="sales-analytics-panel">
      <div className="sales-analytics-panel__header">
        <h2>Sales Analytics Report</h2>
        <p>
          Snapshot of revenue performance for {locationName}.
        </p>
      </div>

      <div className="sales-summary-grid">
        <article className="sales-metric-card">
          <h3>Total Revenue</h3>
          <p>{formatCurrency(summary.totalRevenue)}</p>
        </article>
        <article className="sales-metric-card">
          <h3>Total Units Sold</h3>
          <p>{summary.totalUnitsSold}</p>
        </article>
        <article className="sales-metric-card">
          <h3>Transactions</h3>
          <p>{summary.transactions}</p>
        </article>
        <article className="sales-metric-card">
          <h3>Avg Order Value</h3>
          <p>{formatCurrency(summary.averageOrderValue)}</p>
        </article>
      </div>

      <section className="sales-chart-panel">
        <h3>Daily Revenue Trend</h3>
        <div className="sales-chart" role="img" aria-label="Bar chart of daily sales revenue">
          {dailyRevenue.map((point) => {
            const percent = maxDailyRevenue === 0 ? 0 : (point.totalRevenue / maxDailyRevenue) * 100

            return (
              <div className="sales-chart__bar-group" key={point.date}>
                <span className="sales-chart__value">{formatCurrency(point.totalRevenue)}</span>
                <div className="sales-chart__bar-track">
                  <span
                    className="sales-chart__bar"
                    style={{ height: `${Math.max(percent, 4)}%` }}
                  />
                </div>
                <span className="sales-chart__label">{formatDate(point.date)}</span>
              </div>
            )
          })}
        </div>
      </section>

      <div className="sales-report-grid">
        <section className="sales-report-card">
          <h3>Top Products by Revenue</h3>
          <ul className="sales-ranking-list">
            {topItems.map((item) => (
              <li key={item.itemId}>
                <div>
                  <strong>{item.itemName}</strong>
                  <p>{item.unitsSold} units in {item.transactions} transactions</p>
                </div>
                <span>{formatCurrency(item.totalRevenue)}</span>
              </li>
            ))}
            {topItems.length === 0 && <li>No sales data for this location yet.</li>}
          </ul>
        </section>

        <section className="sales-report-card">
          <h3>Location Performance</h3>
          <table className="sales-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Revenue</th>
                <th>Units</th>
              </tr>
            </thead>
            <tbody>
              {locationPerformance.map((location) => (
                <tr key={location.locationId}>
                  <td>{location.locationName}</td>
                  <td>{formatCurrency(location.totalRevenue)}</td>
                  <td>{location.unitsSold}</td>
                </tr>
              ))}
              {locationPerformance.length === 0 && (
                <tr>
                  <td colSpan={3}>No location performance data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>

      <section className="sales-report-card sales-report-card--full-width">
        <h3>Recent Transactions</h3>
        <table className="sales-table">
          <thead>
            <tr>
              <th>Sold At</th>
              <th>Item ID</th>
              <th>Location</th>
              <th>Units</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((record) => (
              <tr key={record.id}>
                <td>{formatDateTime(record.soldAt)}</td>
                <td>{record.itemId}</td>
                <td>{locationName}</td>
                <td>{record.unitsSold}</td>
                <td>{formatCurrency(record.revenue)}</td>
              </tr>
            ))}
            {recentTransactions.length === 0 && (
              <tr>
                <td colSpan={5}>No transactions recorded for this location.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </section>
  )
}
