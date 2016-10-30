use Rack::Static,
:urls => ["disqus_technutty.html" "/assets/img", "/assets/js", "/assets/css", "/assets/icons", "/php", "/playground", "/playground/Obiou", "/playground/Obiou/css", "/playground/Obiou/js", "/playground/Obiou/img"],
  :root => "public"

run lambda { |env|
  [
    200,
    {
      'Content-Type'  => 'text/html',
      'Cache-Control' => 'public, max-age=86400'
    },
    File.open('public/index.html', File::RDONLY)
  ]
}