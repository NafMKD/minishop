@php
  $brandColor = $brandColor ?? '#4F46E5'; 
  $bgColor    = '#F5F7FB';
  $cardBg     = '#FFFFFF';
  $textColor  = '#111827';
  $mutedColor = '#6B7280';
  $border     = '#E5E7EB';
@endphp

<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <style>
    /* Basic resets for email */
    body { margin:0; padding:0; background:#F5F7FB; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color:#111827; }
    table { border-collapse: collapse; }
    img { border:0; outline:none; text-decoration:none; }
    a { color: inherit; text-decoration: none; }

    .container { width:100%; background:#F5F7FB; padding: 28px 12px; }
    .wrap { width: 100%; max-width: 720px; margin: 0 auto; }

    .header {
      background: linear-gradient(135deg, #4F46E5, #7C3AED);
      border-radius: 16px;
      padding: 22px 22px;
      color: #ffffff;
      box-shadow: 0 12px 30px rgba(17,24,39,.12);
    }
    .header h1 { margin:0; font-size: 20px; line-height: 1.3; font-weight: 700; letter-spacing: .2px; }
    .header p { margin: 8px 0 0; font-size: 13px; opacity: .92; }

    .card {
      background:#ffffff;
      border: 1px solid #E5E7EB;
      border-radius: 16px;
      padding: 18px 18px;
      margin-top: 14px;
      box-shadow: 0 10px 26px rgba(17,24,39,.06);
    }

    .section-title {
      margin: 0 0 12px;
      font-size: 14px;
      font-weight: 700;
      color: #111827;
    }

    .stats { width:100%; }
    .stat {
      width: 33.33%;
      padding: 12px 10px;
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      background: #F9FAFB;
      vertical-align: top;
    }
    .stat-label { font-size: 12px; color:#6B7280; margin:0 0 6px; }
    .stat-value { font-size: 18px; font-weight: 800; margin:0; color:#111827; }

    .divider { height: 1px; background:#E5E7EB; margin: 16px 0; }

    .table-wrap { border: 1px solid #E5E7EB; border-radius: 14px; overflow: hidden; }
    .data-table { width: 100%; }
    .data-table thead th {
      background: #111827;
      color: #ffffff;
      font-size: 12px;
      letter-spacing: .4px;
      text-transform: uppercase;
      padding: 12px 12px;
    }
    .data-table tbody td {
      padding: 12px 12px;
      font-size: 13px;
      color: #111827;
      border-top: 1px solid #E5E7EB;
      background: #ffffff;
    }
    .data-table tbody tr:nth-child(even) td { background: #F9FAFB; }

    .pill {
      display: inline-block;
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 999px;
      background: rgba(79,70,229,.12);
      color: #efeff5;
      border: 1px solid rgba(79,70,229,.18);
      margin-left: 8px;
      vertical-align: middle;
      white-space: nowrap;
    }

    .right { text-align: right; }
    .muted { color:#6B7280; }

    .empty {
      padding: 16px;
      border: 1px dashed #E5E7EB;
      border-radius: 14px;
      background: #F9FAFB;
      color: #6B7280;
      font-size: 13px;
    }

    .footer {
      text-align:center;
      font-size: 12px;
      color:#6B7280;
      margin-top: 14px;
      padding: 8px 6px;
    }

    @media (max-width: 520px) {
      .stat { display:block; width: 100% !important; margin-bottom: 10px; }
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="wrap">

      <div class="header">
        <h1>Daily Sales Report <span class="pill">{{ $dateLabel }}</span></h1>
        <p class="muted" style="color: rgba(255,255,255,.85);">
          A quick snapshot of today’s performance.
        </p>
      </div>

      <div class="card">
        <p class="section-title">Summary</p>

        <table class="stats" role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td class="stat" style="width:33.33%;">
              <p class="stat-label">Total Orders</p>
              <p class="stat-value">{{ $summary['orders_count'] }}</p>
            </td>
            <td style="width:10px;"></td>
            <td class="stat" style="width:33.33%;">
              <p class="stat-label">Items Sold</p>
              <p class="stat-value">{{ $summary['items_sold'] }}</p>
            </td>
            <td style="width:10px;"></td>
            <td class="stat" style="width:33.33%;">
              <p class="stat-label">Gross Revenue</p>
              <p class="stat-value">{{ $summary['gross_revenue'] }}</p>
            </td>
          </tr>
        </table>

        <div class="divider"></div>

        <p class="section-title" style="margin-bottom: 10px;">Product Breakdown</p>

        @if (count($rows) === 0)
          <div class="empty">
            No products were sold today.
          </div>
        @else
          <div class="table-wrap">
            <table class="data-table" cellpadding="0" cellspacing="0" role="presentation">
              <thead>
                <tr>
                  <th align="left">Product</th>
                  <th class="right">Qty Sold</th>
                  <th class="right">Gross</th>
                </tr>
              </thead>
              <tbody>
                @foreach ($rows as $r)
                  <tr>
                    <td>
                      <strong>{{ $r['product_name'] }}</strong>
                      <span class="muted" style="font-size: 12px;">(ID: {{ $r['product_id'] }})</span>
                    </td>
                    <td class="right">{{ $r['qty_sold'] }}</td>
                    <td class="right"><strong>{{ $r['gross'] }}</strong></td>
                  </tr>
                @endforeach
              </tbody>
            </table>
          </div>
        @endif
      </div>

      <div class="footer">
        Generated automatically — {{ $dateLabel }}
      </div>

    </div>
  </div>
</body>
</html>
