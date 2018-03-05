# phtrends
product hunt trends

Just doing this for fun to see what might come out of it

# How to get this data - PYTHON

Read the [PH API docs](https://api.producthunt.com/v1/docs)

Get a `developer_token` from the [app dashboard](https://www.producthunt.com/v1/oauth/applications).

```python
%matplotlib inline

import matplotlib
import numpy as np
import matplotlib.pyplot as plt
import math
import requests
base = "https://api.producthunt.com/v1/"
headers = {
'Accept': 'application/json',
'Content-Type': 'application/json',
'Authorization': 'Bearer {REDACTED}',
'Host': 'api.producthunt.com'
}
rawdata = {}
# get data from 2014-2017
for yr in range(2014, 2018):
    for mth in range(1, 13): 
        yrs = str(yr)
        mths = str(mth)
        req = requests.get(base + "posts/all?sort_by=votes_count&order=desc&search[featured_month]=" + mths + "&search[featured_year]=" + yrs, headers=headers)
        data = req.json()
        rawdata[yrs + '-' + mths.zfill(2)] = data['posts']
# first 2 months of 2018
req = requests.get(base + "posts/all?sort_by=votes_count&order=desc&search[featured_month]=1&search[featured_year]=2018", headers=headers)
data = req.json()
rawdata['2018-01'] = data['posts']
req = requests.get(base + "posts/all?sort_by=votes_count&order=desc&search[featured_month]=2&search[featured_year]=2018", headers=headers)
data = req.json()
rawdata['2018-02'] = data['posts']


# data cleaning
clean = {}
for x in rawdata.keys():
    temparr = []
    for y in rawdata[x]:
        temp = {}
        temp['discussion_url'] = y['discussion_url']
        temp['screenshot_url'] = y['screenshot_url']
        temp['thumbnail'] = y['thumbnail']
        temp['tagline'] = y['tagline']
        temp['topics'] = y['topics']
        temp['topics_flat'] = [x['name'] for x in y['topics']]
        temp['name'] = y['name']
        temp['slug'] = y['slug']
        temp['comments_count'] = y['comments_count']
        temp['votes_count'] = y['votes_count']
        temparr.append(temp)
    clean[int(x[:4]) * 100 + int(x[-2:])] = temparr
import pandas as pd
df = pd.DataFrame.from_dict(clean).T
```

the data munging looks kind of like: 

```python
# def lambfunc(x):
#     count = []
#     for y in x:
# #         if not isinstance(y, dict):
# #             print('lsdkj: ' + str(y))
# #         else:
#             if 'Design Tools' in y['topics_flat']:
#                 count += 1
#     return count
# df['topics'] = df.apply(lambfunc, axis=1)
# def extendfunc(x):
#     arr = []
#     for y in x:
#         arr.extend(y['topics_flat'])
#     temp = pd.DataFrame({'col':arr})
#     return temp.groupby('col').col.count()
# df2 = df.apply(extendfunc, axis=1)
# def votes(x):
#     arr = []
#     for y in x:
#         arr.extend([{'topic': z, 'votes': y['votes_count']} for z in y['topics_flat']])
#     temp = pd.DataFrame(arr)
#     return temp.groupby('topic').votes.sum()
# vcdf = df.apply(votesandcommentsfunc, axis=1)
def commentsfunc(x):
    arr = []
    for y in x:
        arr.extend([{'topic': z, 'comments': y['comments_count']} for z in y['topics_flat']])
    temp = pd.DataFrame(arr)
    return temp.groupby('topic').comments.sum()
cdf = df.apply(commentsfunc, axis=1)

## output
# df2.to_csv('trends_counts.csv')
# vdf.to_csv('votes_counts.csv')
cdf.to_csv('comments_counts.csv')
```

to check trends of top categories

```python
df2[df2.sum(axis=0).sort_values(ascending=False)[:10].index]
```
