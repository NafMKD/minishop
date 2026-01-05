@php
  $brandColor = $brandColor ?? '#DC2626'; 
  $bgColor    = '#F5F7FB';
  $cardBg     = '#FFFFFF';
  $textColor  = '#111827';
  $mutedColor = '#6B7280';
  $border     = '#E5E7EB';

  $remaining  = (int) ($product->stock_quantity ?? 0);
  $threshold  = (int) ($product->low_stock_threshold ?? 0);

  $severity = 'Low Stock';
  if ($remaining <= 0) $severity = 'Out of Stock';
  elseif ($threshold > 0 && $remaining <= max(1, (int) floor($threshold * 0.25))) $severity = 'Critical';
@endphp

<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <style>
    body { margin:0; padding:0; background:#F5F7FB; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; color:#111827; }
    table { border-collapse: collapse; }
    a { color: inherit; text-decoration: none; }

    .container { width:100%; background:#F5F7FB; padding: 28px 12px; }
    .wrap { width:100%; max-width: 680px; margin: 0 auto; }

    .header {
      background: linear-gradient(135deg, #DC2626, #F97316);
      border-radius: 16px;
      padding: 20px 22px;
      color: #ffffff;
      box-shadow: 0 12px 30px rgba(17,24,39,.12);
    }
    .header h1 { margin:0; font-size: 18px; line-height: 1.3; font-weight: 800; letter-spacing:.2px; }
    .header p { margin: 8px 0 0; font-size: 13px; opacity: .92; }

    .pill {
      display:inline-block;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 999px;
      background: rgba(255,255,255,.16);
      border: 1px solid rgba(255,255,255,.22);
      margin-left: 10px;
      vertical-align: middle;
      white-space: nowrap;
    }

    .card {
      background:#ffffff;
      border: 1px solid #E5E7EB;
      border-radius: 16px;
      padding: 18px 18px;
      margin-top: 14px;
      box-shadow: 0 10px 26px rgba(17,24,39,.06);
    }

    .section-title { margin:0 0 12px; font-size: 14px; font-weight: 800; color:#111827; }

    .banner {
      border-radius: 14px;
      padding: 14px 14px;
      border: 1px solid #FECACA;
      background: #FEF2F2;
    }
    .banner-row { width: 100%; }
    .banner-left { vertical-align: top; padding-right: 10px; }
    .icon {
      width: 38px; height: 38px;
      border-radius: 12px;
      background: #DC2626;
      display: inline-block;
      text-align: center;
      line-height: 38px;
      font-weight: 900;
      color:#fff;
      box-shadow: 0 8px 16px rgba(220,38,38,.18);
    }
    .banner-title { margin:0; font-size: 14px; font-weight: 900; color:#991B1B; }
    .banner-sub { margin:4px 0 0; font-size: 12px; color:#7F1D1D; opacity: .9; }

    .kv { width:100%; margin-top: 14px; border: 1px solid #E5E7EB; border-radius: 14px; overflow: hidden; }
    .kv tr td { padding: 12px 12px; font-size: 13px; }
    .kv tr td:first-child { width: 42%; color:#6B7280; background:#F9FAFB; font-weight: 700; }
    .kv tr td:last-child { color:#111827; font-weight: 700; }
    .kv tr + tr td { border-top: 1px solid #E5E7EB; }

    .badge {
      display:inline-block;
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 999px;
      background: rgba(220,38,38,.10);
      color: #B91C1C;
      border: 1px solid rgba(220,38,38,.18);
      font-weight: 800;
    }

    .footer { text-align:center; font-size: 12px; color:#6B7280; margin-top: 14px; padding: 8px 6px; }

    @media (max-width: 520px) {
      .banner-left { display:none !important; }
      .kv tr td:first-child { width: 48%; }
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="wrap">

      <div class="header">
        <h1>
          Low Stock Alert
          <span class="pill">{{ $severity }}</span>
        </h1>
        <p>Action may be required to avoid stockouts.</p>
      </div>

      <div class="card">
        <p class="section-title">Inventory Notice</p>

        <div class="banner">
          <table class="banner-row" role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td class="banner-left" width="48">
                <span class="icon">!</span>
              </td>
              <td>
                <p class="banner-title">
                  {{ $product->name }}
                  <span class="badge">PRODUCT ID: {{ $product->id }}</span>
                </p>
                <p class="banner-sub">
                  Remaining stock is below the configured threshold. Consider restocking soon.
                </p>
              </td>
            </tr>
          </table>
        </div>

        <table class="kv" role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td>Product</td>
            <td>{{ $product->name }}</td>
          </tr>
          <tr>
            <td>Stock remaining</td>
            <td>{{ $product->stock_quantity }}</td>
          </tr>
          <tr>
            <td>Low stock threshold</td>
            <td>{{ $product->low_stock_threshold }}</td>
          </tr>
          <tr>
            <td>PRODUCT ID</td>
            <td>{{ $product->id }}</td>
          </tr>
        </table>
      </div>

      <div class="footer">
        This is an automated alert. Please review inventory levels in your dashboard.
      </div>

    </div>
  </div>
</body>
</html>
