#!/bin/sh

ssh-add config/repo.key
git remote add vbox vagrant@192.168.33.10:komfo_social_demo
