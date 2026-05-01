# Normaliza el nav en todas las paginas. Reemplaza el bloque <div class="nav-items">...</div>
# por la version canonica (8 items) y aplica aria-current segun el slug.

$root = "C:\Users\nicoz\OneDrive\Desktop\PROYECTO AURA\yustalabs-web"

# slug -> nav-item href que debe llevar aria-current
$slugMap = @{
  "index"       = "/"
  "showroom"    = "/showroom"
  "proceso"     = "/proceso"
  "casos"       = "/casos"
  "agentes"     = "/agentes"
  "precios"     = "/precios"
  "servicios"   = "/servicios"
  "nosotros"    = "/nosotros"
  "faq"         = "/faq"
  "contacto"    = "/contacto"
  "custom"      = "/custom"
  "garantia"    = "/garantia"
  "terminos"    = "/terminos"
  "privacidad"  = "/privacidad"
  "probar-aura-commerce" = "/probar-aura-commerce"
}

function Build-NavItems($activeHref) {
  $links = @(
    @{ href = "/showroom";  text = "Demos" },
    @{ href = "/proceso";   text = "Proceso" },
    @{ href = "/casos";     text = "Casos" },
    @{ href = "/agentes";   text = "Agentes IA" },
    @{ href = "/precios";   text = "Precios" },
    @{ href = "/servicios"; text = "Servicios" },
    @{ href = "/nosotros";  text = "Nosotros" },
    @{ href = "/faq";       text = "FAQ" }
  )
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.Append('<div class="nav-items">')
  foreach ($l in $links) {
    $aria = ""
    if ($l.href -eq $activeHref) { $aria = ' aria-current="page"' }
    [void]$sb.Append("`n    " + '<a href="' + $l.href + '" class="nav-item"' + $aria + '>' + $l.text + '</a>')
  }
  [void]$sb.Append("`n  </div>")
  return $sb.ToString()
}

# Regex que captura el bloque <div class="nav-items"> ... </div>
$pattern = '(?s)<div class="nav-items">.*?</div>'

$files = Get-ChildItem -Path $root -Recurse -Filter *.html -File | Where-Object {
  $_.FullName -notmatch 'index-legacy|node_modules|partials\\nav\.html|rubros\\index\.html'
}

$totalChanged = 0
foreach ($f in $files) {
  $rel = $f.FullName.Substring($root.Length + 1).Replace('\', '/')
  # Determinar slug. Para "<slug>/index.html" -> slug. Para "index.html" -> "index" (home).
  if ($rel -eq "index.html") {
    $slug = "index"
    $activeHref = "/"
  } else {
    $parts = $rel -split '/'
    if ($parts[-1] -eq "index.html") {
      $slug = $parts[0]
      if ($slugMap.ContainsKey($slug)) { $activeHref = $slugMap[$slug] } else { $activeHref = "" }
    } else {
      continue
    }
  }

  $content = Get-Content -LiteralPath $f.FullName -Raw -Encoding UTF8
  if ($content -notmatch $pattern) { continue }

  $newNavItems = Build-NavItems $activeHref
  $updated = [regex]::Replace($content, $pattern, [System.Text.RegularExpressions.MatchEvaluator]{
    param($m)
    return $newNavItems
  })

  if ($updated -ne $content) {
    Set-Content -LiteralPath $f.FullName -Value $updated -NoNewline -Encoding UTF8
    $totalChanged++
    Write-Output "[$slug] $rel"
  }
}

Write-Output "TOTAL CHANGED: $totalChanged"
