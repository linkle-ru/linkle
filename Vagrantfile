# -*- mode: ruby -*-
# vi: set ft=ruby :

host_name = "s.taxnuke.local"
database_name = "url-shortener"
server_private_ip = "192.168.10.30"

# Ресурсы для виртуалки
vm_cpus_count = 1
vm_ram_size = 1024

# домашняя директория vagrant-пользователя
vagrant_root = "/home/vagrant"
# корень веб-директории для nginx
nginx_root = vagrant_root + "/www"
# место куда шарятся файлы проекта (корень сайта)
project_root = nginx_root + "/" + host_name

Vagrant.configure("2") do |config|
  config.ssh.forward_agent = true
  config.vm.box = "ubuntu/xenial64"
  config.vm.hostname = "url-shortener-ubuntu"
  config.vm.synced_folder ".", project_root, nfs: true

  if ARGV[0] == "up" || ARGV[0] == "provision" || ARGV[0] == "reload"
    # Пробрасываем порты в хост из виртуалки
    config.vm.network "forwarded_port", guest: 80, host: 8080 # webserver
    # для mongodb обязательно нужно, чтобы порты совпадали иначе авторизацию не пройти снаружи
    config.vm.network "forwarded_port", guest: 27017, host: 28017 # mongodb

    # настраиваем приватную сеть, чтобы виртуалка работала со своими IP в локальной сети
    puts ">>> Configuring private network. Add to /etc/hosts:\n#{server_private_ip} #{host_name}\n"
    config.vm.network "private_network", ip: server_private_ip
  end

  config.vm.provider :virtualbox do |vb|
    vb.name = "url-shortener-ubuntu"
    vb.customize ["modifyvm", :id, "--cpus", vm_cpus_count]
    vb.customize ["modifyvm", :id, "--memory", vm_ram_size]
    vb.customize ["modifyvm", :id, "--cpuexecutioncap", "90"]
    vb.customize ["guestproperty", "set", :id, "/VirtualBox/GuestAdd/VBoxService/--timesync-set-threshold", 10000]
  end

  config.vm.provision :shell, path: "./vagrant_provision/base.sh"
  config.vm.provision :shell, path: "./vagrant_provision/nginx.sh", args: [nginx_root, vagrant_root, host_name]
  config.vm.provision :shell, path: "./vagrant_provision/mongodb.sh", args: [project_root, database_name]
  config.vm.provision "shell", inline: <<-SHELL
    echo "ALL SYSTEMS ARE READY"
  SHELL
end
