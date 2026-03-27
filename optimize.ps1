$images = Get-ChildItem -Recurse -Include *.png, *.jpg, *.jpeg -Exclude *.webp
foreach ($img in $images) {
    if ($img.Extension -ne ".webp") {
        $out = [System.IO.Path]::ChangeExtension($img.FullName, ".webp")
        ffmpeg -y -i $img.FullName -vf "scale='if(gt(iw,1024),1024,-1)':'if(gt(ih,1024),1024,-1)',scale=iw:ih:force_original_aspect_ratio=decrease" -q:v 75 $out
        Remove-Item $img.FullName
    }
}
