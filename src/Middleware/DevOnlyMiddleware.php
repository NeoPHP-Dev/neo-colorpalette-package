<?php

declare(strict_types=1);

namespace Vendor\NeoPHP\ColorPalettePackage\Middleware;

use Neo\Core\Security\Middleware\Interface\MiddlewareInterface;
use Neo\Core\Utils\Config\ConfigManager;

final class DevOnlyMiddleware implements MiddlewareInterface
{
    public function __construct(
        private ConfigManager $config
    ) {
    }

    public function handle(): bool
    {
        return $this->config->from('app')->get('environment') === 'dev';
    }
}