require 'toto'

# Rack config
use Rack::Static, :urls => ['/css', '/js', '/images', '/portfolio', '/uploads', '/favicon.ico'], :root => 'public'
use Rack::CommonLogger

if ENV['RACK_ENV'] == 'development'
  use Rack::ShowExceptions
end

#
# Create and configure a toto instance
#

$dropbox = "http://dl.getdropbox.com/u/916710/site"

toto = Toto::Server.new do

  # Add your settings here
  # set [:setting], [value]
  # 
  # set :author,    "Joshua Ogle"                             # blog author
    set :title,     Dir.pwd.split('/').last                   # site title
  # set :root,      "index"                                   # page to load on /
    set :url,       "http://joshuaogle.com"                   # root URL of the site
  # set :date,      lambda {|now| now.strftime("%b/%m/%Y") }  # date format for articles
  # set :markdown,  :smart                                    # use markdown + smart-mode
  # set :disqus,    "joshuaogle"                              # disqus id, or false
  # set :summary,   :max => 150, :delim => /~/                # length of article summary and delimiter
  # set :ext,       'txt'                                     # file extension for articles
  # set :cache,      28800                                    # cache duration, in seconds
 
  set :author, "Joshua Ogle"
  set :disqus, "joshuaogle"
  set :ext, 'html'
  set :date, lambda {|now| now.strftime("%b #{now.day.ordinal}, %Y") }
end

run toto