<?php

declare(strict_types=1);

namespace Vendor\NeoPHP\ColorPalettePackage\Controllers;

use Neo\Core\Controller\AbstractController;
use Neo\Core\Http\Response\Types\Response;
use Neo\Core\Routing\Attribute\MainRoute;
use Neo\Core\Routing\Attribute\Route;
use Neo\Core\Security\Middleware\Attribute\Middleware;
use Vendor\NeoPHP\ColorPalettePackage\Middleware\DevOnlyMiddleware;

#[MainRoute(path: '/_colorpalette', name: 'colorpalette')]
#[Middleware(use: DevOnlyMiddleware::class, message: 'Only available in dev environment.', onError: 'block')]
final class ColorPaletteController extends AbstractController
{
    #[Route(path: '/', name: 'index', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('@ColorPalette/pages/builder.html.twig');
    }
}