<?php
require_once __DIR__.'/config.php';
try { $pdo=db(); $settings=settings($pdo); $home=page_data($pdo,'home'); $theme=page_data($pdo,'theme'); $projects=projects($pdo); } catch(Throwable $e) { $settings=[]; $home=[]; $theme=[]; $projects=[]; }
function eh($v){ return htmlspecialchars((string)$v,ENT_QUOTES,'UTF-8'); }
function asset($f){ $p=__DIR__.'/'.$f; return $f.(is_file($p)?'?v='.filemtime($p):''); }
$primary=$theme['primary']??$settings['theme_primary']??'#172116';
if(!preg_match('/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i',(string)$primary)) $primary='#172116';
$css=$theme['_custom_css']??''; $css.=$settings['global_css']??'';
$phone=$settings['phone']??'+91 60330 96156'; $email=$settings['email']??'earth.gramineae@gmail.com';
$wa=preg_replace('/\D+/','',$phone);
$tel=(strpos(trim($phone),'+')===0?'+':'').$wa;

// Hero picture: reuse whichever image your existing styles.css sets on .hero-image.
$heroImg='assets/images/img_24.jpeg';
if(is_file(__DIR__.'/styles.css') && preg_match('/\.hero-image\b[^{}]*\{[^}]*?url\(\s*[\'"]?([^\'")]+)/i',(string)file_get_contents(__DIR__.'/styles.css'),$m)) $heroImg=trim($m[1]);

// First project is the big feature panel, the rest fill the comic gallery.
$feature=$projects[0]??['image'=>'assets/images/img_24.jpeg','title'=>'Gazebo','description'=>'Crafted from sustainably sourced bamboo, this gazebo blends natural elegance with modern eco-design.'];
$others=array_slice($projects,1);

$principles=[
  ['Commitment to Excellence','From the initial consultation to the final build, we ensure that each step of the process meets rigorous standards of sustainability and precision. We adhere to modern building practices that respect both tradition and cutting-edge techniques.'],
  ['Transparency & Collaboration','At Earth Gramineae, we believe in fostering strong partnerships with our clients. We maintain open lines of communication and involve our customers in the design and building process, ensuring their visions are realized in harmony with our eco-conscious goals.'],
  ['Sustainability in Action','Our professionalism is not just reflected in the end product but in how we source materials and manage each project. By using bamboo—a rapidly renewable resource—we ensure that every structure we create reduces environmental impact and contributes to a more sustainable future.'],
  ['Cultural Respect & Innovation','Earth Gramineae\'s work is rooted in the rich heritage of Meghalaya and beyond. We blend cultural respect with modern innovation, resulting in designs that honor tradition while embracing forward-thinking solutions.'],
  ['Client-Centric Approach','Each project is tailored to suit the unique needs of our clients, ensuring personalized service and a final result that is both functional and aesthetically pleasing. We go beyond just meeting expectations; we aim to exceed them by delivering designs that inspire and endure.'],
];
function shoot($n){ return '<button type="button" class="shoot shoot-'.$n.'" data-shoot="'.$n.'" aria-label="Collect hidden bamboo shoot '.$n.'"><svg viewBox="0 0 40 48" aria-hidden="true"><path d="M20 3C31 15 34 28 30 44H10C6 28 9 15 20 3Z" fill="#8fe03c" stroke="#14110f" stroke-width="3" stroke-linejoin="round"/><path d="M11 25c7 1 12 5 14 12M29 19c-6 2-9 6-10 11" fill="none" stroke="#14110f" stroke-width="2.5" stroke-linecap="round"/></svg></button>'; }
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="<?=eh($primary)?>">
  <meta name="description" content="<?=eh($home['meta_description']??'Earth Gramineae — eco-sustainable bamboo architecture, furniture, garden landscapes and eco-living spaces from Meghalaya.')?>">
  <title><?=eh($home['meta_title']??'Earth Gramineae — Future From The Past')?></title>
  <link rel="icon" href="assets/images/img_01.png">
  <script>document.documentElement.className='js';</script>
  <link rel="preload" href="assets/fonts/bangers-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="<?=eh(asset('comic.css'))?>">
  <style>:root{--primary:<?=$primary?>}<?= $css ?></style>
</head>
<body>
  <div class="scroll-bamboo" aria-hidden="true"><div class="scroll-bamboo-fill"></div></div>

  <header class="site-header" id="top">
    <a class="brand" href="#top" aria-label="Earth Gramineae home">
      <span class="brand-mark"><img src="assets/images/img_01.png" alt="Earth Gramineae mark"></span>
      <span class="brand-name"><b>Earth</b> Gramineae</span>
    </a>
    <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
    <nav class="nav" id="nav">
      <a href="#about">About</a><a href="#mission">Mission</a><a href="#work">Work</a><a href="#principles">Approach</a><a href="#play" class="nav-play">Play</a><a href="#contact">Contact</a>
    </nav>
  </header>

  <main>
    <section class="hero">
      <div class="sunburst" aria-hidden="true"></div>
      <div class="hero-content reveal">
        <p class="eyebrow caption">EARTH GRAMINEAE · EST. 2019 · MEGHALAYA</p>
        <h1><?= $home['hero_title']??'Future<br><em>from the past.</em>' ?></h1>
        <p class="hero-copy bubble"><?=eh($home['hero_copy']??'Bamboo-led architecture, furniture and eco-living spaces where cultural heritage meets contemporary design.')?></p>
        <div class="hero-actions"><a class="btn btn-red" href="#work">Explore our work <span>↘</span></a><a class="btn btn-yellow" href="#play">Play: build a gazebo</a><a class="text-link" href="#contact">Start a conversation</a></div>
      </div>
      <div class="hero-art reveal">
        <figure class="panel hero-panel tilt"><img class="comic-img hero-image" src="<?=eh($heroImg)?>" alt="Bamboo work by Earth Gramineae"></figure>
        <button type="button" class="sticker sticker-pop" data-word="TOK!">Tap<br>me!</button>
      </div>
      <div class="ticker" aria-hidden="true"><div><?php for($i=0;$i<2;$i++): ?><span>BAMBOO ★ DESIGN ★ CRAFT ★ SUSTAINABILITY ★ BAMBOO ★ DESIGN ★ CRAFT ★ SUSTAINABILITY ★&nbsp;</span><?php endfor; ?></div></div>
    </section>

    <section class="intro section" id="about">
      <div class="section-tag reveal">01 / INTRODUCTION</div>
      <?=shoot(1)?>
      <div class="intro-grid">
        <div class="portrait-wrap reveal"><figure class="panel tilt"><img class="comic-img" src="assets/images/img_03.jpeg" alt="Bamboo gazebo in a green landscape" loading="lazy"><figcaption class="image-caption">Crafted in harmony with Meghalaya's landscape.</figcaption></figure></div>
        <div class="intro-copy reveal">
          <h2 class="display"><?=eh($home['intro_display']??'Building with a material that grows back.')?></h2>
          <p><?=eh($home['intro_p1']??'Established in 2019, Earth Gramineae is dedicated to crafting innovative, eco-conscious structures using bamboo—a fast-growing, renewable resource. We specialize in creating bespoke garden landscapes, furniture, and eco-living spaces that harmonize with nature.')?></p>
          <p><?=eh($home['intro_p2']??'Our mission is to deliver distinctive, sustainable products, carefully designed to meet modern aesthetic and environmental needs. By blending time-honored materials with advanced building techniques, we ensure that every project embodies efficiency, beauty, and eco-friendly craftsmanship.')?></p>
          <div class="stat-row">
            <button type="button" class="stat" data-word="SINCE 2019!"><strong>2019</strong><span>Established</span></button>
            <button type="button" class="stat" data-word="GROW!"><strong>Bamboo</strong><span>Core material</span></button>
            <button type="button" class="stat" data-word="HOME!"><strong>Meghalaya</strong><span>Rooted here</span></button>
          </div>
        </div>
      </div>
    </section>

    <section class="mission section dark" id="mission">
      <div class="section-tag reveal">02 / MISSION</div>
      <?=shoot(2)?>
      <div class="mission-grid">
        <div class="mission-copy reveal">
          <h2>Culture is our foundation.<br><em>Nature is our future.</em></h2>
          <p class="textbox">At Earth Gramineae, our mission is to showcase the extraordinary potential of bamboo as a cornerstone for building a more sustainable and eco-conscious future. Bamboo, deeply embedded in our cultural heritage, especially in the rural landscapes of Meghalaya, has long been valued for its versatility and resilience. Today, we seek to bring its transformative power to the forefront of modern innovation.</p>
          <p class="textbox">We are dedicated to demonstrating that bamboo is not just a traditional resource, but a pivotal solution to addressing some of the most urgent environmental and economic challenges of our time. By promoting its use, we can make significant strides in the fight against deforestation, reducing reliance on less sustainable building materials, and combating the global issue of carbon emissions. The regenerative nature of bamboo allows us to cultivate it quickly, ensuring that its use has a minimal ecological footprint while providing a sustainable future.</p>
        </div>
        <div class="mission-image reveal"><figure class="panel tilt"><img class="comic-img" src="assets/images/img_04.jpeg" alt="Carved bamboo planter with a plant" loading="lazy"></figure><div class="vertical-label">TRADITION × INNOVATION</div></div>
      </div>
    </section>

    <section class="founder section">
      <div class="section-tag reveal">03 / THE FOUNDER</div>
      <?=shoot(3)?>
      <div class="founder-grid">
        <div class="founder-copy reveal">
          <p class="kicker">Denzil Lyngdoh</p><h2>Founder &amp; Director</h2>
          <p>Denzil Lyngdoh, born and raised in Meghalaya, India, left a flourishing career as a disc jockey in the music industry to pursue his passion for eco-sustainable architecture. In 2019, he established Earth Gramineae, driven by his deep connection to bamboo and its potential to create sustainable, beautiful structures.</p>
          <p>Inspired by the material's cultural roots and its ability to offer eco-friendly solutions, Denzil leads the company in collaboration with innovative designers and architects to develop nature-inspired, sustainable solutions for the modern world.</p>
          <p>Denzil’s vision extends beyond creating eco-conscious products; he strives to inspire a global shift toward sustainability by leveraging bamboo as a pivotal resource. His mission is to cultivate sustainable practices that honor both the culture and landscape of Meghalaya, while advancing the possibilities of bamboo in building a greener, more promising future.</p>
        </div>
        <div class="founder-photo reveal"><figure class="panel tilt"><img class="comic-img gentle" src="assets/images/img_06.jpeg" alt="Denzil Lyngdoh outdoors" loading="lazy"></figure><div class="founder-badge">MEGHALAYA<br>INDIA</div></div>
      </div>
    </section>

    <section class="principles section" id="principles">
      <div class="section-tag reveal">04 / PROFESSIONALISM</div>
      <?=shoot(4)?>
      <div class="principles-head reveal"><h2>Built with <em>integrity.</em></h2><p class="textbox">Earth Gramineae stands on a foundation of professionalism, where every project is executed with the utmost attention to quality, integrity, and customer satisfaction. Our team of skilled designers, architects, and builders is committed to delivering eco-sustainable structures that reflect the highest standards of craftsmanship and innovation.</p></div>
      <div class="principles-grid">
      <?php foreach($principles as $i=>$c): ?>
        <article class="principle reveal"><div class="flip">
          <div class="face front"><span class="num"><?=sprintf('%02d',$i+1)?></span><h3><?=eh($c[0])?></h3><span class="flip-hint">Tap to reveal ↻</span></div>
          <div class="face back"><h4><?=eh($c[0])?></h4><p><?=eh($c[1])?></p></div>
        </div></article>
      <?php endforeach; ?>
      </div>
      <div class="wide-image reveal"><figure class="panel"><img class="comic-img" src="assets/images/img_07.jpeg" alt="Bamboo lighting installation" loading="lazy"><figcaption>Natural material. Considered design.</figcaption></figure></div>
    </section>

    <section class="projects section" id="work">
      <div class="section-tag reveal">05 / OUR FEW PROJECTS</div>
      <?=shoot(5)?>
      <div class="projects-head reveal"><h2>Made by hand.<br><em>Made to last.</em></h2><p class="textbox">A selection of bamboo structures, furniture, lighting and crafted objects from the Earth Gramineae portfolio.</p></div>

      <div class="project-feature reveal">
        <button type="button" class="panel project-open tilt" data-title="<?=eh($feature['title'])?>" data-desc="<?=eh($feature['description'])?>" aria-label="Open <?=eh($feature['title'])?>"><img class="comic-img" src="<?=eh($feature['image'])?>" alt="<?=eh($feature['title'])?>" loading="lazy"></button>
        <div class="feature-text"><p class="project-number">01</p><h3><?=eh($feature['title'])?></h3><p><?=eh($feature['description'])?></p></div>
      </div>

      <?php if($others): ?>
      <p class="gallery-hint">Tap any panel to open the comic reader</p>
      <div class="gallery" aria-label="Project gallery">
      <?php foreach($others as $p): ?>
        <button type="button" class="gallery-card project-open reveal <?=((int)$p['sort_order']%5===0?'tall':'')?>" data-title="<?=eh($p['title'])?>" data-desc="<?=eh($p['description'])?>"><img class="comic-img" src="<?=eh($p['image'])?>" alt="<?=eh($p['title'])?>" loading="lazy"><span><?=eh($p['title'])?></span></button>
      <?php endforeach; ?>
      </div>
      <details class="project-notes">
        <summary class="btn btn-yellow">Read all project notes</summary>
        <div class="project-details">
        <?php foreach($others as $p): ?><article class="detail"><span><?=str_pad((string)$p['sort_order'],2,'0',STR_PAD_LEFT)?></span><h3><?=eh($p['title'])?></h3><p><?=eh($p['description'])?></p></article><?php endforeach; ?>
        </div>
      </details>
      <?php endif; ?>
    </section>

    <section class="play section" id="play">
      <div class="section-tag reveal">BONUS LEVEL / PLAY</div>
      <div class="play-head reveal"><h2>Bamboo <em>Builder!</em></h2><p class="textbox">Catch bamboo poles to build a gazebo. Golden shoots count as three. Dodge the cement bags. Drag, tap or use the arrow keys.</p></div>
      <div class="game reveal">
        <div class="game-hud"><span>Poles <b id="gScore">0</b>/20</span><span>Lives <b id="gLives">♥♥♥</b></span><button type="button" id="gPause" disabled>Pause</button></div>
        <div class="game-stage">
          <canvas id="game" tabindex="0" aria-label="Bamboo Builder game. Move the basket with left and right arrow keys."></canvas>
          <div class="game-screen" id="gScreen" aria-live="polite">
            <h3 id="gTitle">Ready, builder?</h3>
            <p id="gText">Catch 20 poles to finish the gazebo.</p>
            <div class="game-buttons"><button type="button" class="btn btn-red" id="gStart">Start game</button><button type="button" class="btn btn-yellow" id="gAsk" hidden>Ask about a real gazebo</button></div>
          </div>
        </div>
        <div class="game-pad"><button type="button" data-dir="-1" aria-label="Move left">◀</button><button type="button" data-dir="1" aria-label="Move right">▶</button></div>
      </div>
    </section>

    <section class="cta" id="contact">
      <div class="cta-inner reveal">
        <p class="eyebrow caption">06 / LET'S WORK TOGETHER</p>
        <h2>Have a space<br>in mind?</h2>
        <p class="cta-copy bubble">Tell us what you're imagining. We can talk through a structure, furniture piece, garden landscape, installation or bespoke bamboo idea.</p>
        <div class="contact-layout">
          <form id="contactForm" class="contact-form" data-wa="<?=eh($wa)?>" data-email="<?=eh($email)?>">
            <fieldset class="chips"><legend>Pick your mission</legend>
              <?php foreach(['Structure','Furniture piece','Garden landscape','Installation','Bespoke bamboo idea'] as $chip): ?><button type="button" class="chip" aria-pressed="false"><?=eh($chip)?></button><?php endforeach; ?>
            </fieldset>
            <label>Your name<input id="name" required placeholder="Name" autocomplete="name"></label>
            <label>Project / service<input id="project" placeholder="What are you looking for?"></label>
            <label>Your message<textarea id="message" required rows="4" placeholder="Tell us a little about your idea..."></textarea></label>
            <div class="form-actions"><button class="btn btn-green" type="submit">Send via WhatsApp <span>↗</span></button><button class="btn btn-blue" type="button" id="emailBtn">Send via Email</button></div>
          </form>
          <div class="contact-direct">
            <p class="contact-label">DIRECT</p>
            <a href="tel:<?=eh($tel)?>" class="contact-big"><?=eh($phone)?></a>
            <a href="mailto:<?=eh($email)?>"><?=eh($email)?></a>
            <a href="https://www.instagram.com/earth.gramineae/" target="_blank" rel="noopener">@earth.gramineae</a>
            <div class="quick-actions"><a href="tel:<?=eh($tel)?>">Call</a><a href="https://wa.me/<?=eh($wa)?>" target="_blank" rel="noopener">WhatsApp</a><a href="mailto:<?=eh($email)?>">Email</a></div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer><div><strong>Earth Gramineae</strong><span>Future from the past.</span></div><a href="#top" class="btn btn-yellow">Back to top ↑</a><small>© <span id="year"><?=date('Y')?></span> Earth Gramineae. Crafted around bamboo, culture and conscious design.</small></footer>

  <div class="hud" role="group" aria-label="Page controls">
    <div class="hud-count" title="Find the hidden bamboo shoots">Shoots <b id="shootCount">0</b>/5</div>
    <button type="button" id="fxBtn" aria-pressed="true">Comic FX: On</button>
    <button type="button" id="soundBtn" aria-pressed="false">Sound: Off</button>
  </div>

  <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-labelledby="lightboxTitle" hidden>
    <div class="reader">
      <button type="button" class="lightbox-close" aria-label="Close">×</button>
      <img id="lightboxImg" src="assets/images/img_01.png" alt="">
      <div class="reader-text"><p id="lightboxCount"></p><h3 id="lightboxTitle"></h3><p id="lightboxDesc"></p>
        <div class="reader-nav"><button type="button" class="btn btn-yellow" id="prevBtn">◀ Prev</button><button type="button" class="btn btn-yellow" id="nextBtn">Next ▶</button><button type="button" class="btn btn-red" id="likeBtn">I want one like this</button></div>
      </div>
    </div>
  </div>

  <div class="badge-pop" id="badge" role="dialog" aria-modal="true" aria-labelledby="badgeTitle" hidden>
    <div><h3 id="badgeTitle">Bamboo Hero!</h3><p>You found all 5 hidden shoots.</p><button type="button" class="btn btn-red" id="badgeClose">Keep exploring</button></div>
  </div>

  <div id="fxLayer" aria-hidden="true"></div>
  <script src="<?=eh(asset('comic.js'))?>"></script>
</body>
</html>
