<?php
/**
 * @file
 * Map page template for Mark-a-Spot
 */
?>

<div class="navbar-wrapper">
  <div class="navbar navbar-inverse navbar-static-top" role="navigation">
    <div class="container-fluid secondary">
      <div class="navbar-header">
        <?php if ($logo): ?>
          
        <?php endif; ?>

        <?php if (!empty($site_name)): ?>
          <a class="name navbar-brand secondary" href="<?php print $front_page; ?>" title="<?php print t('Home'); ?>"></a>
        <?php endif; ?>

        <!-- .btn-navbar is used as the toggle for collapsed navbar content -->
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
      </div>


      <?php if (!empty($primary_nav) || !empty($secondary_nav) || !empty($page['navigation'])): ?>
        <div class="collapse navbar-collapse">
          <nav class="nav navbar-nav">
            <?php if (!empty($primary_nav)): ?>
              <?php print render($primary_nav); ?>
            <?php endif; ?>
            <?php if (!empty($secondary_nav)): ?>
              <?php print render($secondary_nav); ?>
            <?php endif; ?>
            <?php if (!empty($page['navigation'])): ?>
              <?php print render($page['navigation']); ?>
            <?php endif; ?>
          </nav>
        </div>
      <?php endif; ?>
    </div>
  </div>
</div>

<div class="main-container container page relatorio-page">
    <div class="row">
        <section class="col-md-12">
            <a id="main-content"></a>
            <h1 class="page-header">Relatórios</h1>
            <div class="region region-content">
                <div class="form-dropdown-menus">
                    <div class="form-select-element">
                        <label class="form-label label-category">Categorias</label>
                        <select id="form-select-category" class="form-control form-select">
                            <option value="">Please category</option>
                        </select>
                    </div>
                    <div class="form-select-element">
                        <label class="form-label label-status">Estados</label>
                        <select id="form-select-status" class="form-control form-select">
                            <option value="">Please status</option>
                        </select>
                    </div>
                    <div class="form-select-element">
                        <label class="form-label label-address">Bairros</label>
                        <select id="form-select-address" class="form-control form-select">
                            <option value="">Please address</option>
                        </select>
                    </div>
                </div>
                <div class="section-pie-charts">
                    <div class="chart-container">
                        <canvas id="categoriesPieChart" width="400" height="400"></canvas>
                        <label>Categorias</label>
                        <div class="chart-legend"></div>
                    </div>
                    <div class="chart-container">
                        <canvas id="statusPieChart" width="400" height="400"></canvas>
                        <label>Estados</label>
                        <div class="chart-legend"></div>
                    </div>
                    <div class="chart-container">
                        <canvas id="addressPieChart" width="400" height="400"></canvas>
                        <label>Bairros</label>
                        <div class="chart-legend"></div>
                    </div>
                </div>
                <div class="section-dates">
                    
                </div>
                <div class="section-line-chart">
                    <canvas id="lineChart" width="400" height="400"></canvas>
                </div>
            </div>
        </section>
    </div>
</div>
<footer class="footer navbar-inverse navbar-fixed-bottom">
  <?php print render($page['footer']); ?>
</footer>
