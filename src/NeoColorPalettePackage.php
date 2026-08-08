<?php

declare(strict_types=1);

namespace Vendor\NeoPHP\ColorPalettePackage;

use Neo\Core\Package\Abstract\AbstractPackage;

final class NeoColorPalettePackage extends AbstractPackage
{
    public function getName(): string
    {
        return 'ColorPalette';
    }

    public function getPath(): string
    {
        return dirname(__DIR__);
    }
}