<!doctype html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sewfy - Selecionar Empresa</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="selecionar-empresa.css?v=4.0" />
  </head>
  <body>

    <div class="bg-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <div class="card">

      <div class="card-header">
        <h1 class="card-title">Escolha a empresa</h1>
        <p class="card-subtitle">
          Bem-vindo(a) de volta, <strong id="usuario-email"></strong>!<br/>
          Por favor escolha a empresa que você deseja acessar.
        </p>
      </div>

      <div class="card-body">
        <label class="select-label" for="select-empresa">Empresa</label>
        <div class="select-wrapper">
          <select id="select-empresa" class="select-empresa">
            <option value="" disabled selected>Escolha uma empresa</option>
          </select>
          <div class="select-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>

        <button class="btn-continuar" id="btn-continuar">
          Continuar
        </button>
      </div>

    </div>

    <div class="copyright">© 2026 Sewfy. Todos os direitos reservados.</div>

    <script type="module" src="selecionar-empresa.js?v=1.0"></script>
    <script type="module" src="../../api/front/api.js"></script>
  </body>
</html>