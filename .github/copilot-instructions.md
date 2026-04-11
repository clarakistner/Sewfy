---
name: sewfy-instructions
description: "Use when: working on the Sewfy Laravel application for production order management; includes architecture, build commands, routing patterns, and database conventions"
---

# Sewfy Development Guidelines

## Project Overview

**Sewfy** is a Laravel-based production order management system with a Vue.js + Vite frontend. It optimizes workflows for orders, products, suppliers, inventory, and accounts payable across multiple companies.

- **Backend**: Laravel 12 (PHP 8.2+) with JWT authentication
- **Frontend**: Vue.js 3, Vite bundler, Tailwind CSS  
- **Database**: MySQL
- **Project Root**: `www.sewfy/`

---

## Quick Start Commands

### Development Server
```bash
# From www.sewfy/
npm run dev          # Frontend hot reload (Vite)
php artisan serve    # Backend server (localhost:8000)
composer run dev     # Start all concurrently: server, queue, logs, vite
```

### Build & Deploy
```bash
npm run build        # Production frontend build
php artisan migrate  # Run pending migrations
php artisan seed:refresh  # Refresh seeders
```

### Testing & Quality
```bash
php artisan test     # Run PHPUnit tests
php vendor/bin/pint  # Auto-fix code style (or use Pint VS Code extension)
php artisan pail     # Stream live logs
```

---

## Project Structure

```
www.sewfy/
├── app/
│   ├── Http/Controllers/         # API & web endpoints
│   ├── Http/Middleware/          # Auth, CORS, custom middleware
│   ├── Models/                   # Eloquent models (Empresa, User, etc.)
│   ├── Mail/                     # Mailable classes (e.g., ConviteEmail)
│   ├── Helpers/                  # FuncoesAuxiliares.php
│   └── Providers/                # Service providers
├── routes/
│   ├── api.php                   # API route loader (imports modular routes)
│   ├── web.php                   # Web/SPA routes
│   ├── console.php               # Artisan commands
│   └── api/                      # Modular API routes by feature
│       ├── auth.php              # Authentication endpoints
│       ├── ordens_producao.php   # Production orders
│       ├── produtos.php          # Products
│       ├── insumos.php           # Inputs/Materials
│       ├── clifor.php            # Clients & Suppliers
│       ├── empresas.php          # Company management
│       ├── contapagar.php        # Accounts payable
│       └── [other modules].php
├── database/
│   ├── migrations/               # Schema changes
│   ├── seeders/                  # Initial data
│   └── factories/                # Test data generators
├── config/
│   ├── database.php              # DB connection (MySQL)
│   ├── auth.php                  # JWT auth config
│   ├── mail.php                  # Email config (ConviteEmail)
│   └── [other configs].php
├── tests/
│   ├── Feature/                  # API & workflow tests
│   ├── Unit/                     # Model & utility tests
│   └── TestCase.php              # Base test class
├── resources/
│   ├── views/                    # Blade templates (SPA entry points)
│   ├── js/                       # Vue.js components & app logic
│   └── css/                      # Tailwind CSS
└── storage/ & public/            # Logs, cache, compiled assets

```

---

## Architecture & Patterns

### Routing & Controllers
- **Modular API routes**: Each feature has a dedicated file in `routes/api/` (e.g., `ordens_producao.php`)
- **Controllers** in `app/Http/Controllers/` handle requests; organized by domain  
- **Naming**: Follow Laravel conventions (`OrderController`, `ProductController`, etc.)

### Models & Database
- **Eloquent Models**: Use models for all DB access; avoid raw queries
  - Models: `Empresa`, `User`, `OrdemDeProducao`, `Produto`, `ContaPagar`, etc.
  - Relations defined in model methods
- **Migrations**: Keep migrations small; use `php artisan make:migration` to generate
- **Seeders**: Use `DatabaseSeeder` for initial data

### Authentication
- **JWT-based**: `php-open-source-saver/jwt-auth` package
- **Guards**: Likely `api` guard for API routes
- **Tokens**: Stored client-side; sent in `Authorization: Bearer <token>` header

### Frontend (Vue.js + Vite)
- **Entry point**: `resources/views/` (SPA routes like `login`, `home`, `cadastro-empresa`)
- **Components**: Vue components in `resources/js/`
- **Styling**: Tailwind CSS; configured in `vite.config.js`
- **Hot reload**: `npm run dev` watches JS/CSS and reloads instantly

### Mail & Notifications
- **ConviteEmail**: Mailable class for invitation emails
- **Config**: Email settings in `config/mail.php`

---

## Common Development Tasks

### Adding a New Feature (e.g., a new module)
1. **Create the model**: `php artisan make:model Nomodo --migration`
2. **Create the migration**: Edit generated migration, then run `php artisan migrate`
3. **Create the controller**: `php artisan make:controller NomodoController`
4. **Add routes**: Create `routes/api/nomodo.php`, require it in `routes/api.php`
5. **Frontend**: Add Vue components in `resources/js/` and routes in `resources/views/`

### Database Changes
1. Create migration: `php artisan make:migration change_description --table=table_name`
2. Edit the migration file in `database/migrations/`
3. Run: `php artisan migrate`
4. Rollback if needed: `php artisan migrate:rollback`

### Testing an Endpoint
1. Locate route in `routes/api/` or use `php artisan route:list`
2. Check controller method in `app/Http/Controllers/`
3. Write test in `tests/Feature/` using `$this->postJson()`, etc.
4. Run: `php artisan test --filter=YourTestName`

### Debugging
- **Logs**: `php artisan pail` (real-time) or check `storage/logs/`
- **DB queries**: Enable query logging in `.env` or use Laravel Debugbar
- **Frontend**: VS Code debugger or browser DevTools
- **API responses**: Use Postman/Insomnia; endpoint list: `php artisan route:list`

---

## Database Model Overview

### Key Models (found in `app/Models/`)
- **`Empresa`**: Companies using the system
- **`User`**: System users tied to companies
- **`EmpresaUsuarios`**: Many-to-many: users → companies
- **`Modulo`**: Available features/modules
- **`UsuarioModulos`**: Module access per user
- **`OrdemDeProducao`**: Production orders
- **`Produto`**: Products inventory
- **`OPInsumo`**: Input materials for orders
- **`ClienteFornecedor`**: Suppliers & clients
- **`ContaPagar`**: Accounts payable
- **`Convite`**: Invite records (pre-registration)
- **`ConviteEmpresaModulo`**: Module invites for companies
- **`SewfyAdm`**: Admin/system settings

### Conventions
- **Timestamps**: Use `$timestamps = ['created_at', 'updated_at'];` in models
- **Relations**: Define in methods; use eager loading in queries (`with()`)
- **Scopes**: Use query scopes for reusable filters

---

## Code Style & Quality

- **PHP**: Follow Laravel PSR-2 standards; use `php vendor/bin/pint` to auto-fix
- **JavaScript/Vue**: Consistent formatting; check `vite.config.js`
- **Database**: Use migrations; avoid manual schema changes
- **Comments**: Document complex logic and business rules in Portuguese or English

---

## Git Workflow

- **Branches**: Feature branches off `main` (or current base branch)
- **Commits**: Clear, descriptive messages; reference issues where possible
- **Pull Requests**: Include context; link to related issues
- **Testing**: Run full test suite before pushing

---

## Common Gotchas & Debug Tips

1. **JWT token expired**: Check token TTL in `config/auth.php` (guard config)
2. **CORS errors**: Verify `config/cors.php` and middleware chain
3. **Vite hot-reload not working**: Restart `npm run dev`; clear browser cache
4. **Migration conflicts**: Resolve timestamps in migration filenames; rebase if needed
5. **Queue issues**: Check `config/queue.php`; ensure `php artisan queue:listen` is running
6. **Email not sending**: Validate `config/mail.php`; use `php artisan tinker` to test mailing

---

## Resources

- **Laravel docs**: https://laravel.com/docs/12.x
- **Vue 3 docs**: https://vuejs.org/
- **Tailwind CSS**: https://tailwindcss.com/
- **Vite**: https://vitejs.dev/
- **GitHub**: https://github.com/clarakistner/Sewfy
- **Design Docs**: https://docs.google.com/document/d/1iXiXxnyJuWpZRln787g9bhRvnsYC8uxjXrjBx_XKkAU/

---

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "env file not found" | Copy `.env.example` to `.env`; run `php artisan key:generate` |
| DB connection error | Check `.env` `DB_*` vars; ensure MySQL is running |
| Composer/npm slow | Clear cache: `composer clear-cache` or `npm cache clean --force` |
| Tests fail | Run `php artisan migrate --env=testing`; check `phpunit.xml` |
| 401 Unauthorized | Check JWT token; verify `Authorization` header is present |
| Vue not rendering | Check `npm run dev` is running; ensure component is imported |

---

## For AI Assistants (Copilot/Claude)

When helping with Sewfy:
1. Always reference the modular route structure in `routes/api/` for context
2. Use Eloquent queries; avoid raw SQL unless explicitly needed
3. For frontend changes, update Vue components in `resources/js/`
4. For backend changes, follow the model→migration→controller→route pattern
5. Suggest PHPUnit tests alongside feature implementations
6. Remember: JWT auth means API requests require an `Authorization` header
7. When adding features, check existing modules first (don't duplicate logic)
8. Use helper functions from `app/Helpers/FuncoesAuxiliares.php` where available
