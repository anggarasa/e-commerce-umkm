<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>@yield('title') - {{ config('app.name', 'GarraCommerce') }}</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <style>
        :root {
            --background: oklch(0.995 0.002 264.1);
            --foreground: oklch(0.18 0.06 264.1);
            --muted-foreground: oklch(0.45 0.04 264.1);
            --primary: oklch(0.5 0.18 264.1);
            --primary-light: oklch(0.55 0.2 264.1);
            --border: oklch(0.92 0.01 264.1);
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --background: oklch(0.12 0.025 264.1);
                --foreground: oklch(0.95 0.01 264.1);
                --muted-foreground: oklch(0.6 0.03 264.1);
                --primary: oklch(0.65 0.2 264.1);
                --primary-light: oklch(0.7 0.22 264.1);
                --border: oklch(0.25 0.03 264.1);
            }
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html,
        body {
            height: 100%;
        }

        body {
            font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
            background: var(--background);
            color: var(--foreground);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        .error-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            position: relative;
            overflow: hidden;
        }

        /* Background pattern */
        .error-container::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+");
            opacity: 0.5;
        }

        /* Decorative blobs */
        .blob-1 {
            position: absolute;
            width: 400px;
            height: 400px;
            border-radius: 50%;
            background: var(--primary);
            opacity: 0.08;
            filter: blur(80px);
            top: -150px;
            right: -150px;
        }

        .blob-2 {
            position: absolute;
            width: 400px;
            height: 400px;
            border-radius: 50%;
            background: var(--primary);
            opacity: 0.08;
            filter: blur(80px);
            bottom: -150px;
            left: -150px;
        }

        .error-content {
            position: relative;
            text-align: center;
            max-width: 480px;
            z-index: 1;
        }

        .error-code {
            font-size: 8rem;
            font-weight: 700;
            line-height: 1;
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1rem;
            letter-spacing: -0.02em;
        }

        @media (max-width: 640px) {
            .error-code {
                font-size: 5rem;
            }
        }

        .error-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--foreground);
            margin-bottom: 0.75rem;
        }

        .error-message {
            font-size: 1rem;
            color: var(--muted-foreground);
            line-height: 1.6;
        }



        .error-icon {
            width: 4rem;
            height: 4rem;
            margin: 0 auto 1.5rem;
            color: var(--primary);
        }

        /* Animation */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .error-content {
            animation: fadeIn 0.5s ease-out;
        }
    </style>
</head>

<body>
    <div class="error-container" role="main">
        <div class="blob-1"></div>
        <div class="blob-2"></div>

        <div class="error-content">
            @yield('icon')

            <div class="error-code">@yield('code')</div>

            <h1 class="error-title">@yield('title')</h1>

            <p class="error-message">@yield('description')</p>


        </div>
    </div>
</body>

</html>
