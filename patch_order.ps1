$path = 'C:/Frontend/moon-flovers/moon-flowers/src/app/catalog/page.tsx'
$bytes = [System.IO.File]::ReadAllBytes($path)
$content = [System.Text.Encoding]::UTF8.GetString($bytes)

# 1. Add useRouter/useSearchParams import after existing next imports (or after react import)
$old1 = 'import { Suspense, useCallback, useEffect, useMemo, useState } from "react";'
$new1 = 'import { Suspense, useCallback, useEffect, useMemo, useState } from "react";' + "`r`n" + 'import { useRouter, useSearchParams } from "next/navigation";'

# 2. Replace useState for category to read from searchParams
$old2 = '  const [category, setCategory] = useState<number | undefined>();'
$new2 = '  const searchParams = useSearchParams();' + "`r`n" + '  const router = useRouter();' + "`r`n" + '  const [category, setCategory] = useState<number | undefined>(() => {' + "`r`n" + '    const v = searchParams.get("category");' + "`r`n" + '    return v ? Number(v) : undefined;' + "`r`n" + '  });'

# 3. Wrap setCategory to also update URL
$old3 = '          <Categories setter={setCategory} />'
$new3 = '          <Categories setter={(id) => { setCategory(id); const params = new URLSearchParams(searchParams.toString()); if (id) params.set("category", String(id)); else params.delete("category"); router.replace(`/catalog?${params.toString()}`, { scroll: false }); }} />'

$content = $content.Replace($old1, $new1)
$content = $content.Replace($old2, $new2)
$content = $content.Replace($old3, $new3)

[System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "DONE"
