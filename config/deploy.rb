set :using_passenger, true
set :application, "elastic"
set :deploy_to, "/home/deploy/elastic"

default_run_options[:pty] = true
set :scm, :git
set :repository, "git@creativewebsolutions.com.mx:repos/elastic.git"
set :branch, "master"
#set :deploy_via, :remote_cache
set :git_shallow_clone, 1
set :git_enable_submodules, 1
set :use_sudo, false
set :user, 'deploy'
set :ssh_options, { :forward_agent => true }
#set :ssh_options, {:paranoid => false }

role :app, "creativewebsolutions.com.mx"
role :web, "creativewebsolutions.com.mx"
role :db,  "creativewebsolutions.com.mx"

