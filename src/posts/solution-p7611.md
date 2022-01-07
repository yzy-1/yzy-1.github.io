---
title: P7611 题解
tags: ["题解"]
uptime: 1625535525
---

考虑乱搞，每次从 $[0,2000]$ 里面随机一个整数检查是否符合条件。对于每组数据，设置时限 $0.1s$。在超时之前不断生成随机数并检查答案，如果到了 $0.1s$ 仍然没有找到符合要求的 $n$ 就输出无解。

```python
import math
import random
import time
T = int(input())
for _ in range(T):
    a, b, c = [int(i)for i in input().split()]
    fl = False
    st = time.process_time()
    while time.process_time() - st < 0.1:
        n = random.randint(0, 2000)
        if(math.gcd(a*n+b, c) == 1):
            print(n)
            fl = True
            break
    if(not fl):
        print(-1)
```
