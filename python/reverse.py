#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun May  2 01:38:03 2021

@author: eustinakim
"""

from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter
import pandas as pd

df = pd.read_csv("Urban_Art.csv")
df["geom"] = df["latitude"].map(str)+','+df['longitude'].map(str)
locator = Nominatim(timeout=10,user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.3 Safari/605.1.15")

rgeocode = RateLimiter(locator.reverse, min_delay_seconds=0.001)

#tqdm.pandas()
df['address'] = df['geom'].apply(rgeocode)

#df.to_csv(df,index=False)