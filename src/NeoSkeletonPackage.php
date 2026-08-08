<?php

declare(strict_types=1);

namespace Vendor\NeoPHP\SkeletonPackage;

use Neo\Core\Package\Abstract\AbstractPackage;

final class NeoSkeletonPackage extends AbstractPackage
{
    public function getName(): string
    {
        return 'Skeleton';
    }

    public function getPath(): string
    {
        return dirname(__DIR__);
    }
}