# Ansible Role: scratch_mqtt

[![Build Status](https://travis-ci.com/Bassinator/ansible-role-scratch_mqtt.svg?branch=master)](https://travis-ci.com/Bassinator/ansible-role-scratch_mqtt)

Install the scratch mqtt networking extension. https://github.com/Bassinator/scratch-mqtt-extension


## Requirements

  You need a running web server to serve the extension dependencies

## Role Variables

Available variables are listed below, along with default values:

    installation_os_user: vagrant
    installation_os_group: vagrant

## Dependencies

  None.

## Example Playbook

    - hosts: raspberries
      roles:
         - { role: bassinator.scratch_mqtt, installation_os_user: pi ,installation_os_group: pi }

## License

GNU GPLv3

## Author Information
This role was created in 2018 by [Bastian Bukatz](https://bassinator.github.io).
