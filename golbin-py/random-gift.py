#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import csv
import random

if len(sys.argv) < 3:
  print "Usage: ./random-gift.py product.csv email.csv"
  sys.exit()

# 1/2 이메일 추출 및 셔플

email = []

f = open(sys.argv[2], 'r')
csvReader = csv.reader(f)

for row in csvReader:
  email.append(row[0])

f.close()

random.shuffle(email)

# 2/2 경품 배정

f = open(sys.argv[1], 'r')
csvReader = csv.reader(f)

total = 0

for row in csvReader:
  for count in range(0, int(row[1])):
    print "%s - %s - %s" % (row[0], count + 1, email[total])
    total = total + 1

f.close()
