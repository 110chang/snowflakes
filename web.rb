require 'uri'
require 'active_support'
require 'active_support/core_ext'
require 'sinatra'
require 'sinatra/reloader' if development?
require 'compass'
require 'mechanize'
require 'net/https'

api_base = 'http://jlp.yahooapis.jp/MAService/V1/parse?'
app_id = 'dj0zaiZpPUFoaE04WmcyRW1NaSZzPWNvbnN1bWVyc2VjcmV0Jng9Njg-'

#set :bind, '0.0.0.0'

configure do
  Compass.configuration do |config|
    config.project_path = File.dirname(__FILE__)
    config.sass_dir = 'views'
    config.output_style = :expanded
    config.line_comments = false
  end
  set :sass, Compass.sass_engine_options
  set :scss, Compass.sass_engine_options
end

configure :development do
  set :slim, { :pretty => true, :sort_attrs => false, :format => :html }
end

get '/' do
  slim :index
end

post '/falling' do
  @url = @params[:url]
  @mec = Mechanize.new
  @mec.get(@url)

  @body = @mec.page.search('body')
  @body.search('script').unlink()
  @body.search('style').unlink()

  @uri = URI(api_base)
  @uri.query = {
    appid: app_id,
    filter: [*1..12].join('|'),
    results: 'ma,uniq',
    sentence: @body.inner_text,
  }.to_param
  logger.info(@uri.host)
  logger.info(@uri.port)
  logger.info(@uri.path)

  http = Net::HTTP.new(@uri.host, @uri.port)
  responce = http.post(@uri.path, @uri.query, {'Content-type'=>'application/x-www-form-urlencoded'})
  @json = Hash.from_xml(responce.body).to_json
  #@json = CGI.unescapeHTML(@json)
  logger.info(@json.encoding);
  #@doc = @mec.page.search('body').remove('script')
  #slim :falling#, escape_html: true
  json @json
end

get '/css/*.css' do
  content_type 'text/css', :charset => 'utf-8'
  filename = params[:splat].first
  sass filename.to_sym, :views => "#{settings.root}/assets/css"
end

after do
  #puts settings.development?
  cache_control :no_cache if settings.development?
end

