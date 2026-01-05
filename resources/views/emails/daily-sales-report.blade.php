<h2>Daily Sales Report ({{ $dateLabel }})</h2>

<p>
  <strong>Total orders:</strong> {{ $summary['orders_count'] }} <br />
  <strong>Total items sold:</strong> {{ $summary['items_sold'] }} <br />
  <strong>Gross revenue:</strong> {{ $summary['gross_revenue'] }}
</p>

@if (count($rows) === 0)
  <p>No products were sold today.</p>
@else
  <table cellpadding="8" cellspacing="0" border="1" style="border-collapse: collapse;">
    <thead>
      <tr>
        <th align="left">Product</th>
        <th align="right">Qty Sold</th>
        <th align="right">Gross</th>
      </tr>
    </thead>
    <tbody>
      @foreach ($rows as $r)
        <tr>
          <td>{{ $r['product_name'] }} (ID: {{ $r['product_id'] }})</td>
          <td align="right">{{ $r['qty_sold'] }}</td>
          <td align="right">{{ $r['gross'] }}</td>
        </tr>
      @endforeach
    </tbody>
  </table>
@endif
