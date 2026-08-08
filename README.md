# Skeleton Package

One-line description of what this package does.

---

## Structure

```
skeleton-package/
├── composer.json
├── README.md
└── src/
    └── NeoSkeletonPackage.php
```

---

## How it works

Explain what the package does and how, in a few sentences.

---

## Installation

### Published (Packagist)

```bash
composer require neophp/skeleton-package
```

### Via `package:require`

```bash
php bin/neo package:require neophp/skeleton-package --project=MyProject
```

### Local development (path repository)

Root `composer.json` of the NeoPHP framework:
```json
{
    "repositories": [
        { "type": "path", "url": "packages/skeleton-package" }
    ]
}
```

Target project's `composer.json`:
```json
{
    "require": {
        "neophp/skeleton-package": "@dev"
    }
}
```

```bash
composer update
```

---

## Enabling the package

```php
// src/MyProject/Config/app.config.php
return [
    // ...
    'packages' => [
        \Vendor\NeoPHP\SkeletonPackage\NeoSkeletonPackage::class,
    ],
];
```

---

## Usage

Explain how to use the package here.

---

## License

MIT