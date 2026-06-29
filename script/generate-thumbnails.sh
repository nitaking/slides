#!/bin/bash

SLIDES_DIR="slides"
THUMBNAILS_DIR="public/thumbnails"

mkdir -p "$THUMBNAILS_DIR"

if [ $# -eq 0 ]; then
    for pdf_file in "$SLIDES_DIR"/*.pdf; do
        if [ ! -f "$pdf_file" ]; then
            echo "PDFファイルが見つかりません: $pdf_file"
            continue
        fi

        filename=$(basename "$pdf_file" .pdf)
        output_image="$THUMBNAILS_DIR/${filename}.png"

        echo "処理中: $pdf_file -> $output_image"

        sips -s format png --resampleWidth 800 --setProperty dpiWidth 288 --setProperty dpiHeight 288 "$pdf_file" --out "$output_image" 2>/dev/null

        if [ $? -eq 0 ]; then
            echo "✓ 成功: $output_image"
        else
            echo "✗ 失敗: $pdf_file"
        fi
    done
else
    pdf_file="$1"

    if [ ! -f "$pdf_file" ]; then
        echo "PDFファイルが見つかりません: $pdf_file"
        exit 1
    fi

    filename=$(basename "$pdf_file" .pdf)
    output_image="$THUMBNAILS_DIR/${filename}.png"

    echo "処理中: $pdf_file -> $output_image"

    sips -s format png --resampleWidth 800 --setProperty dpiWidth 288 --setProperty dpiHeight 288 "$pdf_file" --out "$output_image" 2>/dev/null

    if [ $? -eq 0 ]; then
        echo "✓ 成功: $output_image"
    else
        echo "✗ 失敗: $pdf_file"
        exit 1
    fi
fi
