@props(['url'])
<tr>
    <td class="header">
        <a href="{{ $url }}" style="display: inline-block;">
            <img src="{{ $url }}/assets/logo/logo-fav.png" class="logo" alt="{{ config('app.name') }} Logo"
                style="height: 48px; width: auto; border-radius: 8px;">
            <span
                style="color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.02em; margin-left: 12px;">{{
                config('app.name') }}</span>
        </a>
    </td>
</tr>